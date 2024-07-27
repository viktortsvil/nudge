from flask import Flask, render_template, jsonify, request
from server.utils import generate_notifications

app = Flask(__name__)

@app.route("/notifications/", methods=["GET"])
def notifications():
    notifs = generate_notifications(None)
    return render_template('index.html', notifs=notifs)

@app.route('/create_suggestion', methods=['POST'])
def create_suggestion():
    # Perform the action you want when the notification is clicked
    print("Notification clicked!")
    js = request.json
    print(js)
    return jsonify({"message": "Notification handled"})

if __name__ == "__main__":
    app.run(debug=True)
