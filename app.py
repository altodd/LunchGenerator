from flask import Flask, flash, session, redirect, request, render_template, url_for
import json
from random import seed, randint
import requests

app = Flask(__name__)
app.config['SECRET_KEY'] = 'flask_didnt_like_me_not_having_this_all_of_a_sudden'


@app.route('/', methods=['GET'])
def checkbox_test():
    return render_template('index.html')


@app.route('/destination', methods=['POST'])
def destination():
    session.pop('_flashes', None)
    
    restaurant_list = get_all_restaurants(request.form.get('locations'))

    restaurant = get_random_restaurant(restaurant_list, request.form.getlist('hello'))

    if (restaurant == None):
        flash('No restaurant is open in the area you selected, please choose a new area')
        return redirect(url_for('checkbox_test'))
    else:
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
    if (len(combined_list) == 0):
        return None
    else:
        return combined_list[randint(0, len(combined_list) -1)]


if __name__ == '__main__':
    app.run(host="0.0.0.0")
