import requests
import json
import time

danielIslandLoc = "32.860527637550824,-79.90763056603808"
danielIslandRad = "1000"
parkCicleLoc = "32.87698073422012,-79.97584998727048"
parkCicleRad = "1000"
tangerLoc = "32.87181922483533,-80.01783997163471"
tangerRad = "1609"
riversLoc = "32.91473507994811,-80.02740018854531"
riversRad = "1000"
northwoodsLoc = "32.942298891335604,-80.04104120918828"
northwoodsRad = "1600"
baseurl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyAD6hQohOMzYzN0GAnX3-58JyWjHERC7OA"

def saveJson(filePrefix, jsoncont, num):
    with open(filePrefix+str(num)+".json", "w") as results:
        results.write(json.dumps(jsoncont, indent=4))

    num += 1
    if "next_page_token" in jsoncont:
        token = jsoncont["next_page_token"]
        print(filePrefix, ": ", token)
        time.sleep(4)
        resp = requests.get(baseurl+"&pagetoken="+token)
        saveJson(filePrefix, resp.json(), num)

danielIslandResp = requests.get(baseurl+"&location="+danielIslandLoc+"&radius="+danielIslandRad+"&type=restaurant")
saveJson("danielIsland", danielIslandResp.json(), 1)

parkCircleResp = requests.get(baseurl+"&location="+parkCicleLoc+"&radius="+parkCicleRad+"&type=restaurant")
saveJson("parkCircle", parkCircleResp.json(), 1)

tangerResp = requests.get(baseurl+"&location="+tangerLoc+"&radius="+tangerRad+"&type=restaurant")
saveJson("tanger", tangerResp.json(), 1)

riversResp = requests.get(baseurl+"&location="+riversLoc+"&radius="+riversRad+"&type=restaurant")
saveJson("rivers", riversResp.json(), 1)

northwoodsResp = requests.get(baseurl+"&location="+northwoodsLoc+"&radius="+northwoodsRad+"&type=restaurant")
saveJson("northwoods", northwoodsResp.json(), 1)
