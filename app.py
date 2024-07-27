import json

from flask import Flask, render_template, jsonify, request
import requests

from server.api.get_notificaions import get_notifs
import os

from server.utils import generate_notifications, generate_suggestions_from_notifications, fetch_web_api

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

@app.route('/top-tracks', methods=['GET'])
def get_top_tracks():
    try:
        # Endpoint reference: https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
        top_tracks = fetch_web_api('v1/me/top/tracks?time_range=long_term&limit=5')
        formatted_tracks = [
            f"{track['name']} by {', '.join(artist['name'] for artist in track['artists'])}"
            for track in top_tracks['items']
        ]
        return jsonify(formatted_tracks)
    except requests.exceptions.HTTPError as e:
        return jsonify({'error': str(e)}), e.response.status_code

@app.route('/top-artists', methods=['GET'])
def get_top_artists():
    try:
        # Endpoint reference: https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
        top_artists = fetch_web_api('v1/me/top/artists?time_range=long_term&limit=5')
        formatted_artists = [
            f"{artist['name']}" for artist in top_artists['items']
        ]
        return jsonify(formatted_artists)
    except requests.exceptions.HTTPError as e:
        return jsonify({'error': str(e)}), e.response.status_code

if __name__ == "__main__":
    app.run(
        debug=True,
        load_dotenv=True
    )
