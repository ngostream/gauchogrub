"""API tests against isolated PostgreSQL tables when TEST_DATABASE_URL is set."""

import datetime
from contextlib import closing
import importlib.util
import json
import os
from pathlib import Path
import unittest
import uuid
from unittest.mock import patch
from zoneinfo import ZoneInfo

import psycopg2
from psycopg2 import sql
from psycopg2.extensions import make_dsn


SERVER_DIR = Path(__file__).resolve().parents[1]


def load_module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class PostgresIntegrationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        base_dsn = os.getenv("TEST_DATABASE_URL")
        if not base_dsn:
            raise unittest.SkipTest("Set TEST_DATABASE_URL to run PostgreSQL integration tests")

        cls.schema_name = f"gg_test_{uuid.uuid4().hex}"
        cls.admin = psycopg2.connect(base_dsn)
        with cls.admin.cursor() as cursor:
            cursor.execute(sql.SQL("CREATE SCHEMA {}").format(sql.Identifier(cls.schema_name)))
        cls.admin.commit()

        cls.test_dsn = make_dsn(base_dsn, options=f"-c search_path={cls.schema_name}")
        schema_setup = load_module("gauchogrub_schema_under_test", SERVER_DIR / "database_setup.py")
        with closing(psycopg2.connect(cls.test_dsn)) as connection:
            schema_setup.create_schema(connection)
            schema_setup.create_schema(connection)  # setup should be safe to repeat

        with patch.dict(os.environ, {"API_KEY": "test-key", "DATABASE_URL": cls.test_dsn}):
            cls.server = load_module("gauchogrub_real_postgres_server", SERVER_DIR / "server.py")
        cls.server.app.config["TESTING"] = True

    @classmethod
    def tearDownClass(cls):
        cls.server.db_pool.closeall()
        with cls.admin.cursor() as cursor:
            cursor.execute(sql.SQL("DROP SCHEMA {} CASCADE").format(sql.Identifier(cls.schema_name)))
        cls.admin.commit()
        cls.admin.close()

    def setUp(self):
        with closing(psycopg2.connect(self.test_dsn)) as connection, connection:
            with connection.cursor() as cursor:
                cursor.execute("TRUNCATE Reviews, Menu_Items, Daily_Menu RESTART IDENTITY")
        self.client = self.server.app.test_client()

    def add_item(self, name="Pizza"):
        with closing(psycopg2.connect(self.test_dsn)) as connection, connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    "INSERT INTO Menu_Items (name, dining_hall, meal, station) VALUES (%s, %s, %s, %s) RETURNING id",
                    (name, "Carrillo", "Lunch", "Grill"),
                )
                return cursor.fetchone()[0]

    def test_post_persists_review_and_average_rating(self):
        item_id = self.add_item()
        response = self.client.post("/Carrillo/Pizza", json={"rating": 4.5, "review": "  Tasty  "})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["avg_rating"], 4.5)
        self.assertEqual(response.json["reviews"][0]["comment"], "Tasty")

        with closing(psycopg2.connect(self.test_dsn)) as connection, connection:
            with connection.cursor() as cursor:
                cursor.execute("SELECT rating, comment FROM Reviews WHERE menu_item_id = %s", (item_id,))
                self.assertEqual(cursor.fetchall(), [(4.5, "Tasty")])
                cursor.execute("SELECT avg_rating FROM Menu_Items WHERE id = %s", (item_id,))
                self.assertEqual(cursor.fetchone()[0], 4.5)
        self.assertEqual(self.client.get("/Carrillo/avg_ratings").json, {"Pizza": 4.5})

    def test_duplicate_post_is_not_stored_twice(self):
        self.add_item()
        payload = {"rating": 4, "review": "Good"}
        self.assertEqual(self.client.post("/Carrillo/Pizza", json=payload).status_code, 200)
        self.assertEqual(self.client.post("/Carrillo/Pizza", json=payload).status_code, 200)

        with closing(psycopg2.connect(self.test_dsn)) as connection, connection:
            with connection.cursor() as cursor:
                cursor.execute("SELECT COUNT(*) FROM Reviews")
                self.assertEqual(cursor.fetchone()[0], 1)

    def test_invalid_review_does_not_write_to_database(self):
        self.add_item()
        response = self.client.post("/Carrillo/Pizza", json={"rating": True, "review": "Good"})
        self.assertEqual(response.status_code, 400)
        with closing(psycopg2.connect(self.test_dsn)) as connection, connection:
            with connection.cursor() as cursor:
                cursor.execute("SELECT COUNT(*) FROM Reviews")
                self.assertEqual(cursor.fetchone()[0], 0)

    def test_menu_returns_todays_saved_json(self):
        today = datetime.datetime.now(ZoneInfo("America/Los_Angeles")).date()
        menu = {"Carrillo": {"Lunch": {"Grill": ["Pizza"]}}}
        with closing(psycopg2.connect(self.test_dsn)) as connection, connection:
            with connection.cursor() as cursor:
                cursor.execute("INSERT INTO Daily_Menu (date, data) VALUES (%s, %s)", (today, json.dumps(menu)))
        self.assertEqual(self.client.get("/").json, menu)

    def test_menu_uses_latest_previous_day(self):
        today = datetime.datetime.now(ZoneInfo("America/Los_Angeles")).date()
        menu = {"Ortega": {"Dinner": {"Grill": ["Tacos"]}}}
        with closing(psycopg2.connect(self.test_dsn)) as connection, connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    "INSERT INTO Daily_Menu (date, data) VALUES (%s, %s)",
                    (today - datetime.timedelta(days=1), json.dumps(menu)),
                )
        self.assertEqual(self.client.get("/").json, menu)


if __name__ == "__main__":
    unittest.main()
