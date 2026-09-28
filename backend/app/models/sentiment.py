from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from app.config import HF_SENTIMENT_REPO, MAX_TOKEN_LENGTH

tokenizer = AutoTokenizer.from_pretrained(HF_SENTIMENT_REPO)
model = AutoModelForSequenceClassification.from_pretrained(HF_SENTIMENT_REPO)
model.eval()

def predict_sentiment(text: str) -> dict:
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=MAX_TOKEN_LENGTH)
    with torch.no_grad():
        logits = model(**inputs).logits
    probs = torch.softmax(logits, dim=-1)[0]
    id2label = model.config.id2label  # read from the model itself
    probabilities = {id2label[i].lower(): round(float(probs[i]), 4) for i in range(len(probs))}
    best_idx = int(torch.argmax(probs))
    return {
        "label": id2label[best_idx].upper(),
        "confidence": round(float(probs[best_idx]), 4),
        "probabilities": probabilities,
    }
