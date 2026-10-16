"""Refresh the daily menu snapshot from the UCSB Dining API."""

import datetime
import json
import os
from collections import OrderedDict
from zoneinfo import ZoneInfo

import psycopg2
import requests
from dotenv import load_dotenv

BASE_URL = "https://api.ucsb.edu/dining/menu/v1/"
DINING_HALLS = ("Carrillo", "De-La-Guerra", "Ortega", "Portola")
MEALS = ("Breakfast", "Brunch", "Lunch", "Dinner")


def get_menu_data(session, day, hall, meal, api_key):
    response = session.get(
        f"{BASE_URL}{day}/{hall}/{meal}",
        params={"ucsb-api-key": api_key},
        timeout=10,
    )
    # The API returns 404 for meals that are not served. Other failures must not
    # replace a good menu snapshot with an empty one.
    if response.status_code == 404:
        return []
    response.raise_for_status()
    data = response.json()
    if not isinstance(data, list):
        raise ValueError(f"Unexpected menu response for {hall} {meal}")
    return data


def refresh_menu(database_url, api_key, day=None, session=requests):
    if not database_url or not api_key:
        raise ValueError("DATABASE_URL and API_KEY are required")
    day = day or datetime.datetime.now(ZoneInfo("America/Los_Angeles")).date()
    menu = OrderedDict(
        (hall, OrderedDict((meal, OrderedDict()) for meal in MEALS))
        for hall in DINING_HALLS
    )
    items = []
    for hall in DINING_HALLS:
        for meal in MEALS:
            for item in get_menu_data(session, day.isoformat(), hall, meal, api_key):
                name = item["name"]
                station = item.get("station") or "General"
                menu[hall][meal].setdefault(station, []).append(name)
                items.append((name, hall, meal, station))

    if not items:
        raise ValueError("Dining API returned no menu items; keeping existing snapshot")

    conn = psycopg2.connect(database_url)
    try:
        with conn, conn.cursor() as cursor:
            for item in items:
                cursor.execute(
                    """INSERT INTO Menu_Items (name, dining_hall, meal, station)
                       VALUES (%s, %s, %s, %s)
                       ON CONFLICT (name, dining_hall) DO NOTHING""",
                    item,
                )
            cursor.execute(
                """INSERT INTO Daily_Menu (date, data) VALUES (%s, %s)
                   ON CONFLICT (date) DO UPDATE
                   SET data = EXCLUDED.data, last_updated = CURRENT_TIMESTAMP""",
                (day, json.dumps(menu)),
            )
            cursor.execute(
                "DELETE FROM Daily_Menu WHERE date < %s",
                (day - datetime.timedelta(days=2),),
            )
    finally:
        conn.close()


if __name__ == "__main__":
    load_dotenv(".env.prod")
    refresh_menu(os.getenv("DATABASE_URL"), os.getenv("API_KEY"))
