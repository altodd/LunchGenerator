from flask import Flask, request, render_template
import json
from random import seed, randint
import requests

app = Flask(__name__)


@app.route('/', methods=['GET'])
def checkbox_test():
    return render_template('index.html')


@app.route('/destination', methods=['POST'])
def destination():
    restaurant_list = get_all_restaurants(request.form.get('locations'))

    restaurant = get_random_restaurant(restaurant_list, request.form.getlist('hello'))

    return render_template('destination.html', restaurant=restaurant["name"])


def get_all_restaurants(locations):
    url = "https://api.foursquare.com/v3/places/search"

    headers = {
        "Accept": "application/json",
        "Authorization": "fsq3McZkGqug9ranloyP4FvxUCFytNF9AUI3UK04LcLXWOQ="
    }

    responses = []

    jsonLocations = json.loads(locations)

    for location in jsonLocations:
        loc_string = str(location["lat"])+","+str(location["lng"])

        params = {
            "query": "restaurant",
            "ll": loc_string,
            "radius": 1605,
            "limit": "50",
            "open_now": "true",
            "sort":"DISTANCE"
        }

        response = requests.request("GET", url, params=params, headers=headers)

        responses.append(response.text)

    return responses

def get_random_restaurant(json_list, exclusions):
    combined_list = []
    for restaurant_set in json_list:
        json_list = json.loads(restaurant_set)
        for json_set in json_list["results"]:
            if not any(cat in cat_name["name"] for cat_name in json_set["categories"] for cat in exclusions):
                combined_list.append(json_set)

    seed()
    return combined_list[randint(0, len(combined_list) -1)]


if __name__ == '__main__':
    app.run(host="0.0.0.0")
