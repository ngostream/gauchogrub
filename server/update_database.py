import os
import sqlite3
import requests
import json
import datetime
from dotenv import load_dotenv
load_dotenv(".env.prod")
# ucsb dining api
API_KEY = os.getenv("API_KEY")
BASE_URL = "https://api.ucsb.edu/dining/menu/v1/"
date = str(datetime.datetime.now().replace(microsecond=0).isoformat())
# get menu data from the api
def get_menu_data(date, dining_hall, meal):
    url = f"{BASE_URL}{date}/{dining_hall}/{meal}?ucsb-api-key={API_KEY}"
    response = requests.get(url)
    return json.loads(response.text) if response.status_code == 200 else []

# connect to database
conn = sqlite3.connect("dining_menu.db")
cursor = conn.cursor()

# dining halls and meals
dining_halls = ["Carrillo", "De-La-Guerra", "Ortega", "Portola"]
meals = ["Breakfast", "Brunch", "Lunch", "Dinner"]

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
                        "INSERT OR IGNORE INTO Menu_Items (name, dining_hall, meal, station) VALUES (?, ?, ?, ?)",
                        (name, hall, meal, station),
                    )
                except Exception as e:
                    print(f"Error inserting {name}: {e}")
print('done inserting')

# commit and close
conn.commit()
conn.close()

