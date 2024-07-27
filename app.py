import json

from flask import Flask, render_template, jsonify, request

from server.api.get_notificaions import get_notifs
from server.utils import generate_notifications
from flask import Flask, render_template, request

from server.utils import generate_notifications, generate_suggestions_from_notifications

app = Flask(__name__)

@app.route("/notifications/", methods=["GET"])
def notifications():
    data = json.load(open('server/api/sampleSahhaProcessed.json'))
    notifs = generate_notifications(str(data), 3)
    return render_template('index.html', notifs=notifs)

@app.route('/create_suggestion', methods=['POST'])
def create_suggestion():
    # Perform the action you want when the notification is clicked
    print("Notification clicked!")
    js = request.json
    suggestion = generate_suggestions_from_notifications(js)
    print(suggestion)
    #send to crew ai 
    return jsonify({"message": suggestion})

if __name__ == "__main__":
    app.run(
        debug=True,
        load_dotenv=True
    )
