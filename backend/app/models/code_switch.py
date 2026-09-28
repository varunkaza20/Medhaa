from transformers import AutoTokenizer, AutoModelForTokenClassification
import torch
from app.config import HF_CODESWITCH_REPO, MAX_TOKEN_LENGTH, TELUGU_UNICODE_RANGE

tokenizer = AutoTokenizer.from_pretrained(HF_CODESWITCH_REPO)
model = AutoModelForTokenClassification.from_pretrained(HF_CODESWITCH_REPO)
model.eval()

def classify_token_script(token: str) -> str:
    has_telugu = any(TELUGU_UNICODE_RANGE[0] <= ord(c) <= TELUGU_UNICODE_RANGE[1] for c in token)
    has_latin = any(c.isascii() and c.isalpha() for c in token)
    if has_telugu and not has_latin:
        return "TELUGU"
    if has_latin and not has_telugu:
        return "ENGLISH"
    if has_telugu and has_latin:
        return "MIXED_TOKEN"
    return "OTHER"

def _distribution(tokens: list[dict]) -> dict:
    telugu = sum(1 for t in tokens if t["tag"] == "TELUGU")
    english = sum(1 for t in tokens if t["tag"] == "ENGLISH")
    total = telugu + english
    return {
        "telugu_pct": round(100 * telugu / total, 1) if total else 0.0,
        "english_pct": round(100 * english / total, 1) if total else 0.0,
    }

def predict_native(text: str) -> dict:
    tokens = [{"text": tok, "tag": classify_token_script(tok)} for tok in text.split()]
    return {"tokens": tokens, "distribution": _distribution(tokens)}

def predict_romanized(text: str) -> dict:
    words = text.split()
    if not words:
        return {"tokens": [], "distribution": {"telugu_pct": 0.0, "english_pct": 0.0}}
    inputs = tokenizer(words, is_split_into_words=True, return_tensors="pt",
                        truncation=True, max_length=MAX_TOKEN_LENGTH)
    with torch.no_grad():
        logits = model(**inputs).logits
    preds = torch.argmax(logits, dim=-1)[0].tolist()
    word_ids = inputs.word_ids(batch_index=0)
    id2label = model.config.id2label  # expected set: {"en","te","univ","ne"}

    word_tags = {}
    for pred_id, word_idx in zip(preds, word_ids):
        if word_idx is None or word_idx in word_tags:
            continue
        word_tags[word_idx] = id2label[pred_id]

    display_map = {"en": "ENGLISH", "te": "TELUGU", "univ": "OTHER", "ne": "NAMED_ENTITY"}
    tokens = [{"text": words[i], "tag": display_map.get(word_tags.get(i, "univ"), "OTHER")}
              for i in range(len(words))]
    return {"tokens": tokens, "distribution": _distribution(tokens)}

def predict_code_switch(text: str, mode: str) -> dict:
    return predict_native(text) if mode == "native" else predict_romanized(text)
