from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime
import requests
import json
import sqlite3
import os
from dotenv import load_dotenv
load_dotenv("server/.env.prod")
API_KEY = os.getenv("API_KEY")
date = str(datetime.datetime.now())
date = date[0:10]
weekend = datetime.datetime.today().weekday() >= 5
iso = str(datetime.datetime.now().replace(microsecond=0).isoformat())
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
            foods = getResponse(iso,diningHall,mealTime)
        elif (weekend == True and diningHall != "Ortega") and (mealTime == "Dinner" or mealTime == "Brunch"):
            foods = getResponse(iso,diningHall, mealTime)
        if isinstance(foods,list):
            for k in foods:
                if k["station"] not in diningHalls[diningHall][mealTime]:
                    diningHalls[diningHall][mealTime][k["station"]] = []
                diningHalls[diningHall][mealTime][k["station"]].append(k["name"])
        
app = Flask(__name__)
CORS(app, origins = "http://localhost:5173") 
@app.route("/")
def menu():
    return json.dumps(diningHalls) #must be json.dumps() to preserve dict order

@app.route("/<dining_hall>/<item_id>", methods = ["POST", "GET"])
def submit(dining_hall, item_id):
    conn = sqlite3.connect("server/dining_menu.db")
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM Menu_Items WHERE name = ? AND dining_hall = ?", (item_id, dining_hall))
    menu_item = cursor.fetchone()

    if not menu_item:
        conn.close()
        return "Menu item not found", 404
    
    menu_item_id = menu_item[0]

    if request.method == "POST":
        data = request.json
        review_text = data["review"]
        rating = data["rating"]

        cursor.execute(
            "INSERT INTO Reviews (menu_item_id, rating, comment) VALUES (?, ?, ?)",
            (menu_item_id, rating ,review_text)
        )
        conn.commit()
    
    cursor.execute(
        """
        SELECT r.rating, r.comment
        FROM Reviews r
        JOIN Menu_Items m ON r.menu_item_id = m.id
        WHERE m.id = ? AND m.dining_hall = ?
        """,
        (menu_item_id, dining_hall),
    )
    reviews = [{"rating": row[0], "comment": row[1]} for row in cursor.fetchall()]
    conn.close()

    if reviews:
        avg_rating = sum(review["rating"] for review in reviews) / len(reviews)
    else:
        avg_rating = 0
    
    return jsonify({"message": "received", "avg_rating": avg_rating, "reviews": reviews}), 200
    
if __name__ == "__main__":
    app.run(host = "0.0.0.0", port = 5000, debug=True)

    