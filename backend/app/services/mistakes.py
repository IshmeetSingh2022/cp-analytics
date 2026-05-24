def get_mistake_type(verdict: str) -> str:
    mapping = {
        "WRONG_ANSWER": "logic",
        "WA": "logic",
        "TIME_LIMIT_EXCEEDED": "optimization",
        "TLE": "optimization",
        "RUNTIME_ERROR": "edge_case",
        "RE": "edge_case",
        "MEMORY_LIMIT_EXCEEDED": "optimization",
        "MLE": "optimization",
    }
    return mapping.get(verdict.upper(), "none")
