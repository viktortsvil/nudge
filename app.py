from pprint import pprint

from flask import Flask

from server.api import get_scores

app = Flask(__name__)

@app.route("/", methods=["GET"])
def hello_world():
    result = get_scores()
    pprint(result)
    return f"<p>{result}</p>"


if __name__ == "__main__":
    app.run(debug=True)