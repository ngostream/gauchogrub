from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import datetime
import requests
import json
# import sqlite3
import psycopg2
import os
from dotenv import load_dotenv
from zoneinfo import ZoneInfo
from better_profanity import profanity
import re
load_dotenv(".env.prod")
API_KEY = os.getenv("API_KEY")

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

# for the profanity filter
def normalize(text):
    substitutions = {
        '1': 'i', '!': 'i', '3': 'e', '4': 'a', '@': 'a',
        '0': 'o', '$': 's', '5': 's', '+': 't'
    }
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', '', text)
    for k, v in substitutions.items():
        text = text.replace(k, v)
    text = re.sub(r'\s+', '', text)
    return text

def contains_fuzzy_profanity(text):
    normalized = normalize(text)
    return profanity.contains_profanity(normalized)
profanity.load_censor_words()

def is_inappropriate(text):
    norm = normalize(text)
    return (
        profanity.contains_profanity(norm)
    )

# dont need this anymore, retrieving from db instead of making a bunch of api calls
""" for diningHall in diningHalls:
    for mealTime in diningHalls[diningHall]:
        foods = getResponse(date, diningHall, mealTime)
        if isinstance(foods, list) and foods:  # only process if API returned actual items
            for item in foods:
                station = item.get("station", "General")
                if station not in diningHalls[diningHall][mealTime]:
                    diningHalls[diningHall][mealTime][station] = []
                diningHalls[diningHall][mealTime][station].append(item["name"]) """
        
app = Flask(__name__)

CORS(app, origins=["http://localhost:5173", "https://gauchogrub.vercel.app"])
@app.route("/")
def menu():
    # return json.dumps(diningHalls) #must be json.dumps() to preserve dict order
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    cursor = conn.cursor()

    cursor.execute("SELECT data FROM Daily_Menu WHERE date = %s", (now.date(),))
    row = cursor.fetchone()

    # fallback, get most recent
    if not row:
        cursor.execute("""
            SELECT data FROM Daily_Menu WHERE DATE < %s
            ORDER BY date DESC LIMIT 1
        """, (now.date(),))
        row = cursor.fetchone()

    conn.close()

    if row:
        json_data = row[0]
        return Response(json_data, mimetype='application/json')
    else:
        return jsonify({"error": "No data found"}), 404

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

        # profanity
        if is_inappropriate(review_text):
            return jsonify({"error": "Review contains inappropriate language"}), 400

        # 300 character limit for review text
        if len(review_text) > 300:
            conn.close()
            return jsonify({"error": "Review too long (300 character limit)"}), 400

        # specifying range for ratings
        if not isinstance(rating, (float, int)) or not (1.0 <= rating <= 5.0):
            conn.close()
            return jsonify({"error": "Rating must be an integer between 1 and 5"}), 400

        cursor.execute("""
            SELECT 1 FROM Reviews
            WHERE menu_item_id = %s AND comment = %s
            AND created_at > NOW() - interval '10 seconds'
        """, (menu_item_id, review_text))
        if not cursor.fetchone():
            cursor.execute(
                "INSERT INTO Reviews (menu_item_id, rating, comment) VALUES (%s, %s, %s)",
                (menu_item_id, rating ,review_text)
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

    conn.close()

    return jsonify({"message": "received", "avg_rating": new_avg, "reviews": reviews,}), 200

@app.route("/<dining_hall>/avg_ratings", methods=["GET"])
def get_avg_ratings(dining_hall):
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    cursor = conn.cursor()
    cursor.execute("""
        SELECT name, COALESCE(avg_rating, 0)
        FROM Menu_Items
        WHERE dining_hall = %s
    """, (dining_hall,))
    result = {row[0]: round(row[1], 2) for row in cursor.fetchall()}
    conn.close()
    return jsonify(result)

# health check endpoint (for pinging to avoid cold starts)
@app.route("/health")
def health():
    return "OK", 200
    
if __name__ == "__main__":
    app.run(host = "0.0.0.0", port = 5000, debug=True)

    