from flask import Flask, render_template, jsonify, request

import requests
import os

SPOTIFY_TOKEN = os.environ['SPOTIFY_TOKEN']

def fetch_web_api(endpoint, method='GET', body=None):
    url = f'https://api.spotify.com/{endpoint}'
    headers = {
        'Authorization': f'Bearer {SPOTIFY_TOKEN}',
        'Content-Type': 'application/json'
    }
    response = requests.request(method, url, headers=headers, json=body)
    response.raise_for_status()
    return response.json()

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
