import requests
from django.conf import settings


DEEPL_API_URL = "https://api-free.deepl.com/v2/translate"


class TranslationError(Exception):
    pass


def translate_text(text: str, target_language: str) -> str:
    if not text:
        return ""

    api_key = getattr(settings, "DEEPL_API_KEY", None)
    if not api_key:
        raise TranslationError("DeepL API key not configured.")

    headers = {
        "Authorization": f"DeepL-Auth-Key {api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "text": [text],
        "target_lang": target_language.upper(),
    }

    try:
        response = requests.post(
            DEEPL_API_URL,
            json=payload,
            headers=headers,
            timeout=15,
        )
        response.raise_for_status()
        data = response.json()
    except requests.RequestException as exc:
        raise TranslationError(f"DeepL request failed: {exc}") from exc

    try:
        return data["translations"][0]["text"]
    except (KeyError, IndexError):
        raise TranslationError("Unexpected DeepL response format.")