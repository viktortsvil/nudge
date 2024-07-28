import json


from flask import Flask, render_template, request

from server.api.suggestion_creator import get_suggestions
from server.spotify import get_top_artists
from server.utils import generate_notifications, generate_suggestions_from_notifications

import os


app = Flask(__name__)
data = json.load(open('server/api/sampleSahhaProcessed.json'))


@app.route("/notifications/", methods=["GET"])
def notifications():
    data = json.load(open('server/api/sampleSahhaProcessed.json'))
    notifs = generate_notifications(str(data), 3)
    return render_template('index.html', notifs=notifs)

@app.route('/create_suggestion', methods=['POST'])
def create_suggestion():
    print("Notification clicked!")
    js = request.json
    suggestion = get_suggestions(str(data), js.get('notification', ''), get_top_artists())
    print(suggestion)
    return render_template('suggestion.html', suggestion=suggestion)

if __name__ == "__main__":
    app.run(
        debug=True,
        load_dotenv=True
    )



