import json

from flask import Flask, render_template, jsonify, request

from flask import Flask, render_template, request

from server.utils import generate_notifications, generate_suggestions_from_notifications

from openai import OpenAI
import agentops
import os
from dotenv import load_dotenv
from agentops import record_function

agentops.init(os.getenv('AGENTOPS_API_KEY'))

# Create new session
agentops.start_session(tags=["openai-gpt-notebook-events"])


@record_function("add numbers")
def add(x, y):
    return x + y



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



agentops.end_session("Success")