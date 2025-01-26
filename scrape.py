import requests
from bs4 import BeautifulSoup

#url = "https://apps.dining.ucsb.edu/menu/day"
url = "https://apps.dining.ucsb.edu/menu/day?dc=carrillo&dc=de-la-guerra&dc=ortega&dc=portola&d=2025-01-26&m=breakfast&m=brunch&m=lunch&m=dinner&m=late-night&food="
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

#print(carrilloString)


i = 0

'''
dictionaries named after dining halls
each key holds a section of the dininghall 
key corresponds to a list of items 
'''
 #convert int o function 

carrilloMap = {}

while i < len(carrilloString):
    list = []
    startSec = carrilloString.find("<dt>", i)
    if startSec == -1: 
        break
    startSec += len("<dt>")
    endSec = carrilloString.find("</dt>", startSec)
    if endSec == -1: 
        break
    carrilloMap[carrilloString[startSec:endSec]] = None
    i = endSec + len("</dt>") 
    j = startSec
    while j < carrilloString.find("</dl>", startSec):
        startItem = carrilloString.find("<dd>", j)
        if startItem == -1: 
            break
        startItem += len("<dd>")
        endItem = carrilloString.find("</dd>", startItem)
        if endSec == -1: 
            break
        list.append(carrilloString[startItem:endItem])
        j = endItem + len("</dd>") 
    carrilloMap[carrilloString[startSec:endSec]] = list

for i in carrilloMap:
    print(i) 
    for j in carrilloMap[i]:
        print(j)







'''
class hierarchy->
dining hall
    private:
        string name
        Menu[3] menu (breakafast, lunch, dinner)
    public:
        getMenu
        getName

Menu
    private:
        string timeOfDay( ex: breakfast,lunch,dinner)
        Section[] sections (mongolian grill, deli ...)
    public:
        getTime
        getSection
    
Section
    private:
        string[] items
    public
        getItems
'''