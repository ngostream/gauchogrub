from flask import Flask
from flask_cors import CORS, cross_origin
import datetime
import requests
import json

date = str(datetime.datetime.now())
date = date[0:10]
weekend = datetime.datetime.today().weekday() >= 5
iso = str(datetime.datetime.now().replace(microsecond=0).isoformat())
url = "https://api.ucsb.edu/dining/menu/v1/"

def getResponse(date, diningCommon, mealCode):
    link = url
    link += date + "/" + diningCommon + "/" + mealCode + "?ucsb-api-key=rEoqAlcRz9hvsGMvSGnpnOEdY7gwjWSy"
    response = requests.get(link)
    return json.loads(response.text) #returns list
# test = getResponse(iso,"Carrillo","Brunch")
# print(type(test))
#loop thru diningHalls and pass key into get Response
#outer loop for mealCode?
"""
if weekend: 
    for key in diningHalls: 
        dict = getResponse()
        key brunch = dict
"""
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
cors = CORS(app, origins = "*")
@app.route("/")
def menu(): #METHODS = ["GET"]
    return json.dumps(diningHalls) #must be json.dumps() to preserve dict order
if __name__ == "__main__":
    app.run(host = "0.0.0.0", port = 5000, debug=True)