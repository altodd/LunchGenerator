import json
import glob

results = []

for f in glob.glob("*.json"):
    with open(f, "rb") as infile:
        for result in json.load(infile)["results"]:
            if result["business_status"] == "OPERATIONAL" and result not in results:
                results.append(result)

print("We have ", len(results), " restaurants now")
with open("restaurants.json", "w") as outfile:
    json.dump(results, outfile)
