from typing import Any, List


def generate_notifications(data: Any, n: int = 1) -> List[str]:
    return [
        "<a>You have been undersleeping in the last week!</a>"
    ] * n


def generate_suggestions_from_notifications(suggestion: str) -> str:
    """
    This should be triggered when a notification is clicked

    This function will be using the suggestion from the notification to feed it into CrewAI and Groq
    """
    return "Maybe you should sleep more... try these hotels"