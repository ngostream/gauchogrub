import requests
from bs4 import BeautifulSoup
import sqlite3

# connect to database and move cursor to the beginning
conn = sqlite3.connect("dining_menu.db")
cursor = conn.cursor()

#url = "https://apps.dining.ucsb.edu/menu/day"
url = "https://apps.dining.ucsb.edu/menu/day?dc=carrillo&dc=de-la-guerra&dc=ortega&dc=portola&d=2025-01-27&m=Breakfast&m=brunch&m=Lunch&m=Dinner&food="
'''
change day you're looking at by changing url
'''
response = requests.get(url)
'''
Note: Sometimes you may get error “Not accepted” so try adding a browser user agent like below. 
Find your user agent based on device and browser from here https://deviceatlas.com/blog/list-of-user-agent-strings
'''
soup = BeautifulSoup(response.content, "html5lib")

carrillo = soup.find(id="carrillo-body")
dlg = soup.find(id="de-la-guerra-body")
ortega = soup.find(id="ortega-body")
portola = soup.find(id="portola-body")

carrilloString = " ".join(str(carrillo).split())
dlgString = " ".join(str(dlg).split())
ortegaString = " ".join(str(ortega).split())
portolaString = " ".join(str(portola).split())


carrilloMeals = {
    "Breakfast" : {}, 
    "Lunch" : {},
    "Dinner" : {}
}
dlgMeals = {
    "Breakfast" : {},
    "Lunch" : {},
    "Dinner" : {}
}
ortegaMeals = {
    "Lunch" : {},
    "Dinner" : {}
}
portolaMeals = {
    "Breakfast" : {},
    "Lunch" : {},
    "Dinner" : {}
}


'''
dictionaries named after dining halls
each key holds a section of the dininghall 
key corresponds to a list of items 
'''
 #convert int o function 

#search for meal time (Breakfast ...), then run <dt> <dd> search through it? turn into function

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

    print(diningHallString[start : end])
    
    #search through mealtime for section
    #search through section for items
    i = start
    while i < end:
        # for debugging:
        print(start, " start")
        print(end, " end")
        print(i, " i")

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

        print(diningHallString[startSec:endSec]) # DEBUGGING

        while j < dlEnd and j < end:
            print(j, " j") # DEBUGGING

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
            print(list)
            print()

        if list:
            diningHallDictionary[mealTime][diningHallString[startSec:endSec]]= list
            
        i = dlEnd + len("</dl>") # move to the next <dl>

        # Resolved?
        #item loop isn't being set far enough since it's adding the previous section's last item to the current section
        #section loop is running one more time than it should be since it was resetting the carrillo deli section


#print(carrilloString)
parse("Lunch", carrilloString, carrilloMeals)
#parse("Lunch", dlgString, dlgMeals)
print()
print()
print(carrilloMeals.items())
#print(dlgMeals.items())
"""
        j = startSec
        while j < diningHallString.find("</dl>", startSec): #
            startItem = diningHallString.find("<dd>", j)
            if startItem == -1: 
                break
            startItem += len("<dd>")
            endItem = diningHallString.find("</dd>", startItem)
            if endSec == -1: 
                break
            list.append(diningHallString[startItem:endItem])
            j = endItem + len("</dd>") 


        j = startSec
        # while j < diningHallString.find("</dl>",startSec):
        #     startItem = diningHallString.find("<dd>",j) + len("<dd>")
        #     if startItem == -1:
        #         break
        #     endItem = diningHallString.find("</dd>", j)
        #     if endItem == -1:
        #         break
        #     list.append(diningHallString[startItem:endItem])
        #     j = endItem + 1
        # diningHallDictionary[mealTime][diningHallString[startSec:endSec]]= list








"""