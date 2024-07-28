from flask import Flask, render_template, jsonify, request

import requests
import os

SPOTIFY_CLIENT_ID=os.environ['SPOTIFY_CLIENT_ID']
SPOTIFY_CLIENT_SECRET=os.environ['SPOTIFY_CLIENT_SECRET']
auth_url = 'https://accounts.spotify.com/api/token'
auth_response = requests.post(auth_url, {
    'grant_type': 'client_credentials',
    'client_id': SPOTIFY_CLIENT_ID,
    'client_secret': SPOTIFY_CLIENT_SECRET,
})

print("SPOTIFY_CLIENT_SECRET", SPOTIFY_CLIENT_SECRET)

auth_response_data = auth_response.json()
access_token = auth_response_data['access_token']
print("access_token", access_token)

def fetch_web_api(endpoint, method='GET', body=None):
    url = f'https://api.spotify.com/{endpoint}'
    headers = {
        'Authorization': f'Bearer {access_token}',
    }
    response = requests.request(method, url, headers=headers, json=body)
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


def get_top_artists() -> list[str]:
    try:
        # Endpoint reference: https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
        top_artists = fetch_web_api('v1/me/top/artists?time_range=long_term&limit=5')
        print(f"{top_artists=}")
        formatted_artists = [
            f"{artist['name']}" for artist in top_artists['items']
        ]
        print(f"{formatted_artists=}")

        result = formatted_artists
    except Exception as e:
        result = ['Taylor Swift', 'Kendrick Lamar', 'Jeremy Zucker', 'La Femme', 'Billie Eilish']
    print(f"FOUND ARTISTS: {result}")
    return result
