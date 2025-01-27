import requests
from bs4 import BeautifulSoup

#url = "https://apps.dining.ucsb.edu/menu/day"
url = "https://apps.dining.ucsb.edu/menu/day?dc=carrillo&dc=de-la-guerra&dc=ortega&dc=portola&d=2025-01-27&m=Breakfast&m=brunch&m=Lunch&m=Dinner&food="
'''
change day you're looking at by changing url
'''
r = requests.get(url)
'''
Note: Sometimes you may get error “Not accepted” so try adding a browser user agent like below. 
Find your user agent based on device and browser from here https://deviceatlas.com/blog/list-of-user-agent-strings
'''
soup = BeautifulSoup(r.content, "html5lib")

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
        print(start, " start")
        print(end, " end")
        print(i, " i")
        startSec = diningHallString.find("<dt>", i)
        if startSec == -1: 
            break
        startSec += len("<dt>")
        endSec = diningHallString.find("</dt>", startSec)
        if endSec == -1: 
            break
        i = endSec + len("</dt>") 
        j = startSec
        print(diningHallString[startSec:endSec])
        list = []
        while j < diningHallString.find("</dl>", startSec) and j < end: #
            print(j, " j")
            startItem = diningHallString.find("<dd>", j)
            if startItem == -1: 
                break
            startItem += len("<dd>")
            endItem = diningHallString.find("</dd>", startItem)
            if endItem == -1: 
                break
            list.append(diningHallString[startItem:endItem])
            j = endItem + len("</dd>") 
            print(list)
            print()
        if len(list) != 0:
            diningHallDictionary[mealTime][diningHallString[startSec:endSec]]= list
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