from typing import Any, List


def generate_notifications(data: Any, n: int = 1) -> List[str]:
    return [
        "<a>You have been undersleeping in the last week!</a>"
    ] * n
