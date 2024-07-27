from pprint import pprint

from flask import Flask

from server.utils import generate_notifications

app = Flask(__name__)


@app.route("/notifications/", methods=["GET"])
def hello_world():
    notifs = generate_notifications(None)
    return notifs


if __name__ == "__main__":
    app.run(debug=True)