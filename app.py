import json

from flask import Flask, render_template, jsonify, request


from server.api.get_notifications import get_notifs

from server.utils import generate_notifications, generate_suggestions_from_notifications

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
    suggestion = generate_suggestions_from_notifications(data, js.get('notification', ''))
    print(suggestion)
    return render_template('suggestion.html', suggestion=suggestion)

if __name__ == "__main__":
    app.run(
        debug=True,
        load_dotenv=True
    )
