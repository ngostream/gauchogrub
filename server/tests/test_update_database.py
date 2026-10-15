"""Exercise the scheduled menu refresh without calling UCSB or PostgreSQL."""

import datetime
import importlib.util
import json
import os
from pathlib import Path
import unittest
from unittest.mock import MagicMock, patch


UPDATE_FILE = Path(__file__).resolve().parents[1] / "update_database.py"


class DatabaseUpdateTests(unittest.TestCase):
    def run_update(self):
        connection = MagicMock()
        response = MagicMock()

        def get_menu(url):
            result = MagicMock()
            if "/Carrillo/Lunch?" in url:
                result.status_code = 200
                result.text = json.dumps([
                    {"name": "Pizza", "station": "Grill"},
                    {"name": "Soup"},
                ])
            else:
                result.status_code = 503
                result.text = "upstream unavailable"
            return result

        with patch.dict(os.environ, {"API_KEY": "test-key", "DATABASE_URL": "postgres://test"}):
            with patch("psycopg2.connect", return_value=connection) as connect:
                with patch("requests.get", side_effect=get_menu) as get:
                    with patch("builtins.print"):
                        spec = importlib.util.spec_from_file_location("gauchogrub_update_under_test", UPDATE_FILE)
                        module = importlib.util.module_from_spec(spec)
                        spec.loader.exec_module(module)
        return module, connection, connect, get

    def test_refresh_fetches_every_hall_and_meal(self):
        module, connection, connect, get = self.run_update()
        self.assertEqual(get.call_count, 16)
        self.assertTrue(all("ucsb-api-key=test-key" in call.args[0] for call in get.call_args_list))
        connect.assert_called_once_with("postgres://test")
        connection.commit.assert_called_once()
        connection.close.assert_called_once()
        self.assertEqual(module.dining_halls, ["Carrillo", "De-La-Guerra", "Ortega", "Portola"])

    def test_refresh_groups_items_and_uses_default_station(self):
        _, connection, _, _ = self.run_update()
        sql_calls = connection.cursor.return_value.execute.call_args_list
        item_inserts = [call for call in sql_calls if "INSERT INTO Menu_Items" in call.args[0]]
        self.assertEqual(len(item_inserts), 2)
        self.assertEqual(item_inserts[0].args[1], ("Pizza", "Carrillo", "Lunch", "Grill"))
        self.assertEqual(item_inserts[1].args[1], ("Soup", "Carrillo", "Lunch", "General"))

        daily_insert = next(call for call in sql_calls if "INSERT INTO Daily_Menu" in call.args[0])
        menu = json.loads(daily_insert.args[1][1])
        self.assertEqual(menu["Carrillo"]["Lunch"], {"Grill": ["Pizza"], "General": ["Soup"]})
        self.assertEqual(menu["Portola"]["Dinner"], {})

    def test_refresh_cleans_up_old_menu_dates(self):
        _, connection, _, _ = self.run_update()
        sql_calls = connection.cursor.return_value.execute.call_args_list
        daily_insert = next(call for call in sql_calls if "INSERT INTO Daily_Menu" in call.args[0])
        cleanup = next(call for call in sql_calls if "DELETE FROM Daily_Menu" in call.args[0])
        self.assertEqual(cleanup.args[1][0], daily_insert.args[1][0] - datetime.timedelta(days=2))


if __name__ == "__main__":
    unittest.main()
