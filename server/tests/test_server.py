"""Route tests using a mocked PostgreSQL pool; no external services are needed."""

import importlib.util
import os
from pathlib import Path
import unittest
from unittest.mock import MagicMock, patch


SERVER_FILE = Path(__file__).resolve().parents[1] / "server.py"


class ServerRouteTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with patch.dict(os.environ, {"API_KEY": "test-key", "DATABASE_URL": "postgres://test"}):
            with patch("psycopg2.pool.SimpleConnectionPool") as pool_class:
                spec = importlib.util.spec_from_file_location("gauchogrub_server_under_test", SERVER_FILE)
                module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(module)
                cls.server = module
                cls.pool = pool_class.return_value
        cls.server.app.config["TESTING"] = True

    def setUp(self):
        self.pool.reset_mock()
        self.conn = MagicMock()
        self.cursor = self.conn.cursor.return_value
        self.conn.__enter__.return_value = self.conn
        self.cursor.__enter__.return_value = self.cursor
        self.conn.closed = 0
        self.pool.getconn.return_value = self.conn
        self.client = self.server.app.test_client()

    def test_health(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, b"OK")
        self.pool.getconn.assert_not_called()

    def test_menu_returns_todays_data(self):
        self.cursor.fetchone.return_value = ('{"Carrillo": {"Lunch": {}}}',)
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"Carrillo": {"Lunch": {}}})
        self.assertEqual(self.cursor.execute.call_count, 1)
        self.pool.putconn.assert_called_once_with(self.conn)
        self.conn.__exit__.assert_called_once()

    def test_connection_returns_to_pool_after_sql_error(self):
        self.cursor.execute.side_effect = RuntimeError("database unavailable")
        with self.assertRaises(RuntimeError):
            self.client.get("/")
        self.conn.__exit__.assert_called_once()
        self.pool.putconn.assert_called_once_with(self.conn)

    def test_menu_falls_back_to_latest_available_day(self):
        self.cursor.fetchone.side_effect = [None, ('{"Portola": {}}',)]
        response = self.client.get("/")
        self.assertEqual(response.json, {"Portola": {}})
        self.assertEqual(self.cursor.execute.call_count, 2)
        self.assertIn("ORDER BY date DESC", self.cursor.execute.call_args.args[0])
        self.pool.putconn.assert_called_once_with(self.conn)

    def test_menu_returns_404_when_empty(self):
        self.cursor.fetchone.side_effect = [None, None]
        response = self.client.get("/")
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json, {"error": "No data found"})
        self.pool.putconn.assert_called_once_with(self.conn)

    def test_average_ratings_are_rounded(self):
        self.cursor.fetchall.return_value = [("Pizza", 4.256), ("Salad", 0)]
        response = self.client.get("/Carrillo/avg_ratings")
        self.assertEqual(response.json, {"Pizza": 4.26, "Salad": 0})
        self.assertEqual(self.cursor.execute.call_args.args[1], ("Carrillo",))
        self.pool.putconn.assert_called_once_with(self.conn)

    def test_unknown_review_item_returns_404(self):
        self.cursor.fetchone.return_value = None
        response = self.client.get("/Carrillo/Pizza")
        self.assertEqual(response.status_code, 404)
        self.assertEqual(self.pool.putconn.call_count, 1)

    def test_review_path_decodes_slashes(self):
        self.cursor.fetchone.side_effect = [(7,), (4.5,)]
        self.cursor.fetchall.return_value = [(4.5, "Good", "2026-10-14")]
        response = self.client.get("/Carrillo/Soup__slash__Salad")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["avg_rating"], 4.5)
        self.assertEqual(response.json["reviews"][0]["comment"], "Good")
        self.assertEqual(self.cursor.execute.call_args_list[0].args[1], ("Soup/Salad", "Carrillo"))
        self.pool.putconn.assert_called_once_with(self.conn)

    def test_review_rejects_missing_fields(self):
        self.cursor.fetchone.return_value = (7,)
        response = self.client.post("/Carrillo/Pizza", json={"rating": 4})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], "Missing review data")
        self.conn.commit.assert_not_called()
        self.pool.putconn.assert_called_once_with(self.conn)

    def test_review_rejects_missing_json_body(self):
        self.cursor.fetchone.return_value = (7,)
        response = self.client.post("/Carrillo/Pizza")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], "Missing review data")
        self.pool.putconn.assert_called_once_with(self.conn)

    def test_review_rejects_blank_or_non_string_text(self):
        for review in ["   ", None, 42]:
            with self.subTest(review=review):
                self.cursor.fetchone.return_value = (7,)
                response = self.client.post("/Carrillo/Pizza", json={"rating": 4, "review": review})
                self.assertEqual(response.status_code, 400)
                self.assertEqual(response.json["error"], "Review must be non-empty text")
        self.conn.commit.assert_not_called()
        self.assertEqual(self.pool.putconn.call_count, 3)

    def test_review_rejects_invalid_rating_and_long_text(self):
        for payload, expected in [
            ({"rating": 0, "review": "Good"}, "Rating must be between 1 and 5 in half-star steps"),
            ({"rating": 6, "review": "Good"}, "Rating must be between 1 and 5 in half-star steps"),
            ({"rating": "4", "review": "Good"}, "Rating must be between 1 and 5 in half-star steps"),
            ({"rating": True, "review": "Good"}, "Rating must be between 1 and 5 in half-star steps"),
            ({"rating": 4.25, "review": "Good"}, "Rating must be between 1 and 5 in half-star steps"),
            ({"rating": 4, "review": "a" * 301}, "Review too long (300 character limit)"),
        ]:
            with self.subTest(payload=payload):
                self.cursor.fetchone.return_value = (7,)
                response = self.client.post("/Carrillo/Pizza", json=payload)
                self.assertEqual(response.status_code, 400)
                self.assertEqual(response.json["error"], expected)
        self.conn.commit.assert_not_called()
        self.assertEqual(self.pool.putconn.call_count, 6)

    def test_review_accepts_300_character_boundary(self):
        self.cursor.fetchone.side_effect = [(7,), None, (5.0,)]
        self.cursor.fetchall.return_value = []
        response = self.client.post("/Carrillo/Pizza", json={"rating": 5, "review": "a" * 300})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(any("INSERT INTO Reviews" in call.args[0] for call in self.cursor.execute.call_args_list))

    def test_get_reviews_returns_empty_list_and_null_average(self):
        self.cursor.fetchone.side_effect = [(7,), (None,)]
        self.cursor.fetchall.return_value = []
        response = self.client.get("/Carrillo/Pizza")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["reviews"], [])
        self.assertIsNone(response.json["avg_rating"])
        self.assertFalse(any("INSERT INTO Reviews" in call.args[0] for call in self.cursor.execute.call_args_list))

    def test_review_rejects_profanity(self):
        self.cursor.fetchone.return_value = (7,)
        with patch.object(self.server, "is_inappropriate", return_value=True):
            response = self.client.post("/Carrillo/Pizza", json={"rating": 4, "review": "Bad words"})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], "Review contains inappropriate language")
        self.conn.commit.assert_not_called()
        self.pool.putconn.assert_called_once_with(self.conn)

    def test_review_submission_inserts_and_returns_reviews(self):
        self.cursor.fetchone.side_effect = [(7,), None, (4.5,)]
        self.cursor.fetchall.return_value = [(4.5, "Tasty", "2026-10-14")]
        response = self.client.post("/Carrillo/Pizza", json={"rating": 4.5, "review": "  Tasty  "})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["avg_rating"], 4.5)
        self.assertEqual(response.json["reviews"][0]["comment"], "Tasty")
        insert = [call for call in self.cursor.execute.call_args_list if "INSERT INTO Reviews" in call.args[0]]
        self.assertEqual(len(insert), 1)
        self.assertEqual(insert[0].args[1], (7, 4.5, "Tasty"))
        self.pool.putconn.assert_called_once_with(self.conn)

    def test_duplicate_review_is_not_inserted_again(self):
        self.cursor.fetchone.side_effect = [(7,), (1,), (4.0,)]
        self.cursor.fetchall.return_value = []
        response = self.client.post("/Carrillo/Pizza", json={"rating": 4, "review": "Tasty"})
        self.assertEqual(response.status_code, 200)
        self.assertFalse(any("INSERT INTO Reviews" in call.args[0] for call in self.cursor.execute.call_args_list))
        self.pool.putconn.assert_called_once_with(self.conn)


if __name__ == "__main__":
    unittest.main()
