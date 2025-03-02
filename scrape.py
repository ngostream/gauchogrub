import requests
import datetime
from bs4 import BeautifulSoup
import sqlite3
from flask import Flask, request, render_template
import html
app = Flask(__name__)

date = str(datetime.datetime.now())
date = date[0:10]
weekend = datetime.datetime.today().weekday() >= 5
# connect to database and move cursor to the beginning
conn = sqlite3.connect("dining_menu.db")
cursor = conn.cursor()

url = f"https://apps.dining.ucsb.edu/menu/day?dc=carrillo&dc=de-la-guerra&dc=ortega&dc=portola&d={date}&m=breakfast&m=brunch&m=lunch&m=dinner&food="

response = requests.get(url)
'''
Note: Sometimes you may get error “Not accepted” so try adding a browser user agent like below. 
Find your user agent based on device and browser from here https://deviceatlas.com/blog/list-of-user-agent-strings
'''
soup = BeautifulSoup(response.content, "html5lib")

c = soup.find(id="carrillo-body")
d = soup.find(id="de-la-guerra-body")
o = soup.find(id="ortega-body")
p = soup.find(id="portola-body")

# fix for the ampersands not showing up correctly
carrilloString = html.unescape(" ".join(str(c).split()))
dlgString = html.unescape(" ".join(str(d).split()))
ortegaString = html.unescape(" ".join(str(o).split()))
portolaString = html.unescape(" ".join(str(p).split()))

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

 

#change scrape to add dictionaries of mealtime during scrape function instead of hardcoding the meal times into dininghall dict

'''
<dl>                                    Start of <dl>. Can honestly ignore since we're looking for <dt>
    <dt>Deli</dt>                       startSec and endSec here. We're really just grabbing the title
    <dd>Sliced Genoa Salami</dd>        item
    <dd>Sliced Turkey</dd>              item
    <dd>Sliced Jack Cheese (v)</dd>     item
    <dd>Sliced Smoked Gouda</dd>        item
</dl>                                   dlEnd
'''

def parse(mealTime, diningHallString, diningHallDictionary):
    #this function should never be called with args Breakfast, ortegaString, ortegaMeals
    start = diningHallString.find(mealTime)
    end = diningHallString.find("<small ", start + 27) if diningHallString.find("<small ", start + 27) != -1 else len(diningHallString)
    #for debugging purposes -> will print section it's searching through

    #print(diningHallString[start : end])
    
    #search through mealtime for section
    #search through section for items
    i = start
    while i < end:
        # for debugging:
        # print(start, " start")
        # print(end, " end")
        # print(i, " i")

        # find the bounds for the title
        startSec = diningHallString.find("<dt>", i)
        if startSec == -1: 
            break
        startSec += len("<dt>")
        endSec = diningHallString.find("</dt>", startSec)
        if endSec == -1: 
            break
        
        # reminder: j is the index of the item
        # realistically, i should be updated at the end of the j loop so we don't run into i being ahead of j
        j = endSec + len("</dt>")

        # end of the <dl> section. we're using it a lot so why not call it once before the j loop to be more efficient
        dlEnd = diningHallString.find("</dl>", startSec)

        # reset the list that accumulates items to append
        list = []

       # print(diningHallString[startSec:endSec]) # DEBUGGING

        while j < dlEnd and j < end:
            #print(j, " j") # DEBUGGING

            # find the bounds for menu items
            startItem = diningHallString.find("<dd>", j)
            if startItem == -1 or startItem >= dlEnd:   # CHANGING THIS LINE FIXED IT! startItem was overshooting and finding the next <dd> even though it was a greater index than the end of the <dl>
                break
            startItem += len("<dd>")
            endItem = diningHallString.find("</dd>", startItem)
            if endItem == -1:
                break

            list.append(diningHallString[startItem:endItem])    # append the item to the accumulator list
            j = endItem + len("</dd>")      # move to next item

            # debugging:
            # print(list)
            # print()

        if list:
            diningHallDictionary[mealTime][diningHallString[startSec:endSec]]= list
            
        i = dlEnd + len("</dl>") # move to the next <dl>

        # Resolved?
        #item loop isn't being set far enough since it's adding the previous section's last item to the current section
        #section loop is running one more time than it should be since it was resetting the carrillo deli section

if weekend:
    parse("Brunch",carrilloString, carrillo)
    parse("Brunch",dlgString, dlg)
    parse("Brunch", portolaString, portola)
    print("weekend")
else:
    parse("Breakfast", carrilloString, carrillo)
    parse("Lunch", carrilloString, carrillo)
    parse("Breakfast", dlgString, dlg)
    parse("Lunch", dlgString, dlg)
    parse("Breakfast", portolaString, portola)
    parse("Lunch", portolaString, portola)
    parse("Lunch", ortegaString, ortega)
    parse("Dinner", ortegaString, ortega)
    print("weekday")

parse("Dinner", carrilloString, carrillo)
parse("Dinner", dlgString, dlg)
parse("Dinner", portolaString, portola)


diningHalls ={
    "Carrillo": carrillo,
    "De La Guerra": dlg,
    "Portola": portola,
    "Ortega": ortega
}

# inserting into the database
for hall_name, meals in diningHalls.items():
    for meal_time, categories in meals.items():
        for category, items in categories.items():
            for item in items:
                # insert or ignore ignores duplicates
                cursor.execute("""
                    INSERT OR IGNORE INTO Menu_Items (name, dining_hall, meal, category)
                    VALUES (?, ?, ?, ?)
                """, (item.strip(), hall_name, meal_time, category.strip()))
conn.commit()
conn.close()

@app.route("/")
def display_meals():
    return render_template("index.html",
        halls = diningHalls,
        weekend = weekend
)
@app.route("/food/<food_name>", methods=["GET", "POST"])
def food_detail(food_name):
    conn = sqlite3.connect("dining_menu.db")
    cursor = conn.cursor()

    # find the menu item id
    cursor.execute("SELECT id FROM Menu_Items WHERE name = ?", (food_name,))
    # only retrive single row, thats all we're looking for
    menu_item = cursor.fetchone()
    # close connection and throw error if menu item not found
    if not menu_item:
        conn.close()
        return "Menu item not found", 404
    
    # the first column of menu_item should be id
    menu_item_id = menu_item[0]

    if request.method == "POST":
        review_text = request.form["review"]
        rating = int(request.form["rating"])    # converts string rating to integer

        cursor.execute(
            "INSERT INTO Reviews (menu_item_id, rating, comment) VALUES (?, ?, ?)",
            (menu_item_id, rating, review_text)
        )
        conn.commit()
    
    # get reviews for the item
    cursor.execute("SELECT rating, comment FROM Reviews WHERE menu_item_id = ?", (menu_item_id,))
    reviews = [{"rating": row[0], "comment": row[1]} for row in cursor.fetchall()]      # fetchall retrieves multiple items

    conn.close()

    # update the page
    return render_template("food_detail.html", food_name = food_name, reviews = reviews)

if __name__ == "__main__": 
    app.run(debug=True)
