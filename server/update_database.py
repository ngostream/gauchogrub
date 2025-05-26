import os
# import sqlite3
import psycopg2
from psycopg2.extras import Json
from collections import OrderedDict
import requests
import json
import datetime
from dotenv import load_dotenv
from zoneinfo import ZoneInfo
load_dotenv(".env.prod")
# ucsb dining api
API_KEY = os.getenv("API_KEY")
BASE_URL = "https://api.ucsb.edu/dining/menu/v1/"
now = datetime.datetime.now(ZoneInfo("America/Los_Angeles"))
date = now.isoformat(timespec="seconds")
# get menu data from the api
def get_menu_data(date, dining_hall, meal):
    url = f"{BASE_URL}{date}/{dining_hall}/{meal}?ucsb-api-key={API_KEY}"
    response = requests.get(url)
    return json.loads(response.text) if response.status_code == 200 else []

# connect to database
# conn = sqlite3.connect("dining_menu.db")
conn = psycopg2.connect(os.getenv("DATABASE_URL"))
cursor = conn.cursor()

# dining halls and meals
dining_halls = ["Carrillo", "De-La-Guerra", "Ortega", "Portola"]
meals = ["Breakfast", "Brunch", "Lunch", "Dinner"]

diningHalls = OrderedDict()
for hall in dining_halls:
    diningHalls[hall] = OrderedDict()
    for meal in meals:
        diningHalls[hall][meal] = OrderedDict()

# get api data and insert into database
for hall in dining_halls:
    for meal in meals:
        menu_items = get_menu_data(date, hall, meal)
        if isinstance(menu_items, list):
            for item in menu_items:
                name = item["name"]
                station = item.get("station", "General")  # Some items may not have stations
                try:
                    cursor.execute(
                        """INSERT INTO Menu_Items (name, dining_hall, meal, station)
                            VALUES (%s, %s, %s, %s)
                            ON CONFLICT (name, dining_hall, meal) DO NOTHING""",
                        (name, hall, meal, station),
                    )
                except Exception as e:
                    print(f"Error inserting {name}: {e}")
                if station not in diningHalls[hall][meal]:
                    diningHalls[hall][meal][station] = []
                diningHalls[hall][meal][station].append(name)
print('done inserting into menu_items')

cursor.execute(
    """
    INSERT INTO Daily_Menu (date, data)
    VALUES (%s, %s)
    ON CONFLICT (date) DO UPDATE SET data = EXCLUDED.data, last_updated = CURRENT_TIMESTAMP
    """,
    (now.date(), Json(diningHalls, dumps=lambda x: json.dumps(x, sort_keys=False)))
)
print('inserted into daily menu')

# commit and close
conn.commit()
conn.close()

