from flask import Flask, flash, session, redirect, request, render_template, url_for
import json
from random import seed, randint
from datetime import datetime as dt
import requests

# pip install python-dotenv
from dotenv import load_dotenv
from os import environ as env
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = env["FLASK_SECRET_KEY"]


@app.route('/', methods=['GET'])
def checkbox_test():
    return render_template('index.html')


@app.route('/destination', methods=['POST'])
def destination():
    session.pop('_flashes', None)
    
    restaurant_list = get_all_restaurants(locations=request.form.get('locations'), otherParams=request.form)

    restaurant = get_random_restaurant(restaurant_list, request.form.getlist('filter'))

    if request.form.get('exclude_hotels'):
        while check_hotel(restaurant):
            restaurant = get_random_restaurant(restaurant_list, request.form.getlist('filter'))

    if (restaurant == None):
        flash('No restaurant is open in the area you selected, please choose a new area')
        return redirect(url_for('checkbox_test'))
    else:
        return render_template('destination.html', restaurant=restaurant, menu=test_menu(restaurant), website=test_website(restaurant))


def get_all_restaurants(locations, otherParams:dict):
    url = env["FOURSQUARE_ENDPOINT"]+"search"
    headers = {
        "Accept": "application/json",
        "Authorization": env["FOURSQUARE_TOKEN"]
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
            "open_now": "true" if "currentlyOpenBool" in otherParams else "false",
            "sort":"DISTANCE"
        }
        # Optional Parameters
        if "priceSlider" in otherParams:
            params["max_price"] = int(otherParams["priceSlider"])

        response = requests.request("GET", url, params=params, headers=headers)

        responses.append(response.text)

    return responses

def get_random_restaurant(json_list, exclusions):
    combined_list = []
    for restaurant_set in json_list:
        json_list = json.loads(restaurant_set)
        if "results" not in json_list: continue
        for json_set in json_list["results"]:
            if not any(cat in cat_name["name"] for cat_name in json_set["categories"] for cat in exclusions):
                combined_list.append(json_set)

    seed()
    if (len(combined_list) == 0):
        return None
    else:
        rand_idx = randint(0, len(combined_list) -1)
        restaurant_dict = get_restaurant_details(combined_list[rand_idx])
        restaurant_dict["latlong"] = combined_list[rand_idx]["geocodes"]["main"]
        return restaurant_dict

def get_restaurant_details(restaurant_obj):
    url = env["FOURSQUARE_ENDPOINT"]

    headers = {
        "Accept": "application/json",
        "Authorization": env["FOURSQUARE_TOKEN"]
    }

    params = {
        "fields": "name,tel,website,location,categories,related_places,hours,hours_popular,rating,popularity,price,menu,photos,tastes"
    }

    url = url + restaurant_obj["fsq_id"]
    response = requests.request("GET", url, params=params, headers=headers)

    return json.loads(response.text)

def check_hotel(restaurant_obj):
    # Ensure restaurant object exists before checking its subscript component
    if restaurant_obj is None or "parent" not in restaurant_obj["related_places"]:
        return False

    url = env["FOURSQUARE_ENDPOINT"] + restaurant_obj["related_places"]["parent"]["fsq_id"]

    headers = {
        "Accept": "application/json",
        "Authorization": env["FOURSQUARE_TOKEN"]
    }

    params = {
        "fields": "categories"
    }

    response = requests.request("GET", url, params=params, headers=headers)

    if "hotel" in response.text.lower() or "lodging" in response.text.lower():
        return True
    else:
        return False

def test_menu(restaurant_obj):
    if "menu" in restaurant_obj:
        try:
            response = requests.request("GET", restaurant_obj["menu"])
        except:
            return False
        if response.status_code == 404: return False
        xfo = response.headers.get('X-Frame-Options')
        if xfo is None: return True
        if( "deny" in xfo.lower() or "sameorigin" in xfo.lower()):
            return False
        return True
    else:
        return False

def test_website(restaurant_obj):
    if "website" in restaurant_obj:
        try:
            response = requests.request("GET", restaurant_obj["website"])
        except:
            return False
        if response.status_code > 400: return False
        #Potentially try and add back some check for handling domain squatting but the check I had was breaking functionality
        if "Index of /" in response.text: return False
        xfo = response.headers.get('X-Frame-Options')
        if xfo is None: return True
        if( "deny" in xfo.lower() or "sameorigin" in xfo.lower()):
            return False
        return True
    else:
        return False

if __name__ == '__main__':
    app.run(host="0.0.0.0")
