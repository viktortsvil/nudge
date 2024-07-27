from typing import Any, List

from server.api.get_best_trails import get_hikes
from server.api.get_notificaions import get_notifs


def generate_notifications(data: Any, n: int = 1) -> List[str]:
    return get_notifs(data, n)


def generate_suggestions_from_notifications(data, suggestion: str) -> str:
    """
    This should be triggered when a notification is clicked

    This function will be using the suggestion from the notification to feed it into CrewAI and Groq
    """
    return get_hikes(data, suggestion)