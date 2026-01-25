NAVIGATION_MAP = {
    "fertilizer subsidy": "/schemes/fertilizer",
    "pm kisan": "/schemes/pm-kisan",
    "tea pruning": "/tea/pruning",
    "tea disease": "/tea/diseases",
    "weather": "/weather",
    "market price": "/market"
}

def detect_navigation_intent(user_message: str):
    msg = user_message.lower()

    for keyword, url in NAVIGATION_MAP.items():
        if keyword in msg:
            return {
                "type": "NAVIGATION",
                "url": url,
                "label": f"Open {keyword.title()}"
            }

    return None
