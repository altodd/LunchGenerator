from flask import Flask, request, render_template
import json
from random import seed, randint

app = Flask(__name__)


@app.route('/', methods=['GET'])
def checkbox_test():
    return render_template('index.html')


@app.route('/destination', methods=['POST'])
def destination():
    if request.method == 'POST':
        print(request.form.getlist('hello'))

    restaurant = get_random_restaurant()

    return render_template('destination.html', restaurant=restaurant["name"])


def get_random_restaurant():
    with open("/home/atodd/website/restaurants.json", "rb") as jsonFile:
        restaurant_list = json.load(jsonFile)
        seed()
        return restaurant_list[randint(0, len(restaurant_list) - 1)]


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int("80"))
