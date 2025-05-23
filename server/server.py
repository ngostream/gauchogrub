from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime
import requests
import json
# import sqlite3
import psycopg2
import os
from dotenv import load_dotenv
from zoneinfo import ZoneInfo
load_dotenv(".env.prod")
API_KEY = os.getenv("API_KEY")

# OLD DATE HANDLING
""" date = str(datetime.datetime.now())
date = date[0:10]
weekend = datetime.datetime.today().weekday() >= 5
iso = str(datetime.datetime.now().replace(microsecond=0).isoformat()) """

now = datetime.datetime.now(ZoneInfo("America/Los_Angeles"))
date = now.date().isoformat()
iso = now.isoformat()
weekend = now.weekday() >= 5

url = "https://api.ucsb.edu/dining/menu/v1/" #if no internet can't make connection (obviously duh)

def getResponse(date, diningCommon, mealCode):
    link = url
    link += date + "/" + diningCommon + "/" + mealCode + "?ucsb-api-key=" + API_KEY
    response = requests.get(link)
    return json.loads(response.text) #returns list

carrillo = {
    "Breakfast" : {}, 
    "Brunch":{},
    "Lunch" : {},
    "Dinner" : {}
}
dlg = {
    "Breakfast" : {},
    "Brunch":{},
    "Lunch" : {},
    "Dinner" : {}
}
ortega = {
    "Lunch" : {},
    "Dinner" : {}
}
portola = {
    "Breakfast" : {},
    "Brunch":{},
    "Lunch" : {},
    "Dinner" : {}
}
diningHalls = {
    "Carrillo": carrillo,
    "De-La-Guerra": dlg,
    "Ortega": ortega,
    "Portola": portola
}
for diningHall in diningHalls:
    for mealTime in diningHalls[diningHall]:
        foods = {}
        if weekend == False and mealTime != "Brunch":
            foods = getResponse(date,diningHall,mealTime)
        elif (weekend == True and diningHall != "Ortega") and (mealTime == "Dinner" or mealTime == "Brunch"):
            foods = getResponse(date,diningHall, mealTime)
        if isinstance(foods,list):
            for k in foods:
                if k["station"] not in diningHalls[diningHall][mealTime]:
                    diningHalls[diningHall][mealTime][k["station"]] = []
                diningHalls[diningHall][mealTime][k["station"]].append(k["name"])
        
app = Flask(__name__)
# CORS(app, origins = "http://localhost:5173") 
CORS(app, origins=["http://localhost:5173", "https://gauchogrub.vercel.app"])
@app.route("/")
def menu():
    return json.dumps(diningHalls) #must be json.dumps() to preserve dict order

@app.route("/<dining_hall>/<item_id>", methods = ["POST", "GET"])
def submit(dining_hall, item_id):
    item_id = item_id.replace("__slash__","/")
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM Menu_Items WHERE name = %s AND dining_hall = %s", (item_id, dining_hall))
    menu_item = cursor.fetchone()

    if not menu_item:
        conn.close()
        return "Menu item not found", 404
    
    menu_item_id = menu_item[0]

    if request.method == "POST":
        data = request.json

        # malformed json, empty text or no review
        if "rating" not in data or "review" not in data:
            conn.close()
            return jsonify({"error": "Missing review data"}), 400
        
        review_text = data["review"].strip()
        rating = data["rating"]

        # 500 character limit
        if len(review_text) > 500:
            conn.close()
            return jsonify({"error": "Review too long (500 character limit)"}), 400

        # specifying range for ratings
        if not isinstance(rating, (float, int)) or not (1.0 <= rating <= 5.0):
            conn.close()
            return jsonify({"error": "Rating must be an integer between 1 and 5"}), 400


        cursor.execute(
            "INSERT INTO Reviews (menu_item_id, rating, comment) VALUES (%s, %s, %s)",
            (menu_item_id, rating ,review_text)
        )
        conn.commit()

        # update the average rating
        cursor.execute(
            "SELECT AVG(rating) FROM Reviews WHERE menu_item_id = %s",
            (menu_item_id,)
        )
        new_avg = cursor.fetchone()[0]

        cursor.execute(
            "UPDATE Menu_Items SET avg_rating = %s WHERE id = %s",
            (new_avg, menu_item_id)
        )
        conn.commit()

    # grab the rating, comment, and reviews that match the menu item. defaults to descending based on most recent date
    cursor.execute(
        """
        SELECT r.rating, r.comment, r.created_at
        FROM Reviews r
        JOIN Menu_Items m ON r.menu_item_id = m.id
        WHERE m.id = %s AND m.dining_hall = %s
        ORDER BY r.created_at DESC
        """,
        (menu_item_id, dining_hall),
    )
    reviews = [{"rating": row[0], "comment": row[1], "created_at": row[2]} for row in cursor.fetchall()]

    cursor.execute("SELECT avg_rating FROM Menu_Items WHERE id = %s", (menu_item_id,))
    avg_rating = cursor.fetchone()[0] or 0

    conn.close()

    return jsonify({"message": "received", "avg_rating": avg_rating, "reviews": reviews,}), 200

@app.route("/<dining_hall>/avg_ratings", methods=["GET"])
def get_avg_ratings(dining_hall):
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    cursor = conn.cursor()
    cursor.execute("""
        SELECT name, avg_rating FROM Menu_Items WHERE dining_hall = %s
    """, (dining_hall,))
    result = {row[0]: round(row[1] or 0, 2) for row in cursor.fetchall()}
    conn.close()
    return jsonify(result)
    
if __name__ == "__main__":
    app.run(host = "0.0.0.0", port = 5000, debug=True)

    