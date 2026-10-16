"""Tests for the scheduled menu refresh without external services."""

import datetime
import importlib.util
import json
from pathlib import Path
import unittest
from unittest.mock import MagicMock, patch

UPDATE_FILE = Path(__file__).resolve().parents[1] / "update_database.py"
spec = importlib.util.spec_from_file_location("gauchogrub_update_under_test", UPDATE_FILE)
updater = importlib.util.module_from_spec(spec)
spec.loader.exec_module(updater)


class DatabaseUpdateTests(unittest.TestCase):
    def setUp(self):
        self.session = MagicMock()
        self.connection = MagicMock()
        self.connection.__enter__.return_value = self.connection
        self.cursor = self.connection.cursor.return_value
        self.cursor.__enter__.return_value = self.cursor
        self.day = datetime.date(2026, 10, 15)

        def get_menu(url, **kwargs):
            response = MagicMock()
            if "/Carrillo/Lunch" in url:
                response.status_code = 200
                response.json.return_value = [
                    {"name": "Pizza", "station": "Grill"}, {"name": "Soup"}
                ]
            else:
                response.status_code = 404
            return response

        self.session.get.side_effect = get_menu

    def refresh(self):
        with patch.object(updater.psycopg2, "connect", return_value=self.connection):
            updater.refresh_menu("postgres://test", "test-key", self.day, self.session)

    def test_refresh_groups_items_and_saves_snapshot(self):
        self.refresh()
        self.assertEqual(self.session.get.call_count, 16)
        self.assertEqual(self.session.get.call_args.kwargs["timeout"], 10)
        calls = self.cursor.execute.call_args_list
        inserts = [call for call in calls if "INSERT INTO Menu_Items" in call.args[0]]
        self.assertEqual([call.args[1] for call in inserts], [
            ("Pizza", "Carrillo", "Lunch", "Grill"),
            ("Soup", "Carrillo", "Lunch", "General"),
        ])
        daily = next(call for call in calls if "INSERT INTO Daily_Menu" in call.args[0])
        self.assertEqual(json.loads(daily.args[1][1])["Carrillo"]["Lunch"],
                         {"Grill": ["Pizza"], "General": ["Soup"]})
        cleanup = next(call for call in calls if "DELETE FROM Daily_Menu" in call.args[0])
        self.assertEqual(cleanup.args[1][0], self.day - datetime.timedelta(days=2))
        self.connection.__exit__.assert_called_once()
        self.connection.close.assert_called_once()

    def test_server_error_preserves_existing_snapshot(self):
        self.session.get.side_effect = None
        self.session.get.return_value.status_code = 503
        self.session.get.return_value.raise_for_status.side_effect = RuntimeError("upstream down")
        with self.assertRaises(RuntimeError):
            self.refresh()
        self.cursor.execute.assert_not_called()

    def test_empty_response_preserves_existing_snapshot(self):
        self.session.get.side_effect = None
        self.session.get.return_value.status_code = 200
        self.session.get.return_value.json.return_value = []
        with self.assertRaises(ValueError):
            self.refresh()
        self.cursor.execute.assert_not_called()

    def test_sql_error_rolls_back_and_closes(self):
        self.cursor.execute.side_effect = RuntimeError("write failed")
        with self.assertRaises(RuntimeError):
            self.refresh()
        self.connection.__exit__.assert_called_once()
        self.connection.close.assert_called_once()


if __name__ == "__main__":
    unittest.main()
