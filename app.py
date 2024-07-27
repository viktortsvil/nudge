from flask import Flask, render_template, request

from server.utils import generate_notifications, generate_suggestions_from_notifications

app = Flask(__name__)


@app.route("/notifications/", methods=["GET"])
def hello_world():
    notifs = generate_notifications(None)
    return render_template(notifs)


if __name__ == "__main__":
    app.run(debug=True)