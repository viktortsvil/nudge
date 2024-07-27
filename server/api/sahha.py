import requests
import json

SAHHA_APP_ID = "8qOUmjFI40KT7NXRJDL8xwNATCkPodOF"
SAHHA_CLIENT = "WI42ZMlhLYHPyTDAeH6x92fipmXJIMghewCqIB78wlqNdIqqkqxPbqk3zGGrPUAl"
EXTERNAL_ID = "ZBfQ0lZbkEXdMU247pCSYN0xzxm2"


def get_account_token():
    payload = json.dumps({
            "clientId": SAHHA_APP_ID,
            "clientSecret": SAHHA_CLIENT,
        })
    return requests.post(
        "https://sandbox-api.sahha.ai/api/v1/oauth/account/token",
        data=payload,
        headers={"Content-Type": "application/json"},
    )


def get_profile_token(account_token: str):
    payload = json.dumps({
        "externalId": EXTERNAL_ID,
    })
    return requests.post(
        "https://sandbox-api.sahha.ai/api/v1/oauth/profile/token",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"account {account_token}",
        },
    )


def get_data(account_token: str):
    payload = json.dumps({
        "startDateTime": "2024-07-01T00:00:00+12:00",
        "endDateTime": "2025-01-01T00:00:00+12:00"
    })
    return requests.post(
        f"https://sandbox-api.sahha.ai/api/v1/profile/analysis/{EXTERNAL_ID}",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"account {account_token}",
        },
    )