from transformers import AutoTokenizer, AutoModelForTokenClassification
import torch
from app.config import HF_NER_REPO, MAX_TOKEN_LENGTH

tokenizer = AutoTokenizer.from_pretrained(HF_NER_REPO)
model = AutoModelForTokenClassification.from_pretrained(HF_NER_REPO)
model.eval()

def predict_ner(text: str) -> dict:
    inputs = tokenizer(text, return_tensors="pt", truncation=True,
                        max_length=MAX_TOKEN_LENGTH, return_offsets_mapping=True)
    offset_mapping = inputs.pop("offset_mapping")[0].tolist()
    with torch.no_grad():
        logits = model(**inputs).logits
    probs = torch.softmax(logits, dim=-1)[0]
    preds = torch.argmax(probs, dim=-1).tolist()
    id2label = model.config.id2label

    entities = []
    current = None
    for pred_id, prob_row, (start, end) in zip(preds, probs.tolist(), offset_mapping):
        if start == end:
            continue  # special token
        label = id2label[pred_id]
        confidence = prob_row[pred_id]
        if label == "O":
            if current:
                entities.append(current)
                current = None
            continue
        prefix, ent_type = label.split("-", 1) if "-" in label else ("B", label)
        if prefix == "B" or current is None or current["type"] != ent_type:
            if current:
                entities.append(current)
            current = {"text": text[start:end], "type": ent_type,
                       "start": start, "end": end, "confidence": round(confidence, 4)}
        else:
            current["text"] = text[current["start"]:end]
            current["end"] = end
            current["confidence"] = round((current["confidence"] + confidence) / 2, 4)
    if current:
        entities.append(current)
    return {"entities": entities}
