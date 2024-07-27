from typing import Optional
import json

def get_scores(n_days: int = 3):
    filename = 'server1/api/sampleSahha.json'

    with open(filename) as f:
        data = json.load(f)

    result = {}
    for obj in data:
        score_date = obj["scoreDateTime"]
        category = obj['type']
        scores = {}
        for factor in obj["factors"]:
            score_type = factor["name"]
            score = {"score": factor["score"], "goal": factor["goal"], "value": factor["value"], "state": factor["state"], "unit": factor["unit"]}
            scores[score_type] = score
        if score_date not in result:
            result[score_date] = {}
        result[score_date][category] = scores
    json.dump(result, open('server1/api/sampleSahhaProcessed.json', 'w'), indent=4)
    return result
