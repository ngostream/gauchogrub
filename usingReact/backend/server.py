from flask import Flask
import datetime
import requests
import json #might not be needed

date = str(datetime.datetime.now())
date = date[0:10]
weekend = datetime.datetime.today().weekday() >= 5
iso = str(datetime.datetime.now().replace(microsecond=0).isoformat())
url = "https://api.ucsb.edu/dining/menu/v1/"

def getResponse(date, diningCommon, mealCode):
    link = url
    link += date + "/" + diningCommon + "/" + mealCode + "?ucsb-api-key=rEoqAlcRz9hvsGMvSGnpnOEdY7gwjWSy"
    response = requests.get(link)
    return json.loads(response.text)

test = getResponse(iso,"Carrillo","Brunch")
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
    "De La Guerra": dlg,
    "Ortega": ortega,
    "Portola": portola
}

# if weekend:
    
# else:
app = Flask(__name__)
#pass a dict to return statement
@app.route("/menu")
def menu():
    return test#diningHalls

if __name__ == "__main__":
    app.run(host = "0.0.0.0", port = 5000, debug=True)
