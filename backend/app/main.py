from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.schemas import TextRequest, CodeSwitchRequest
from app.config import TELUGU_UNICODE_RANGE

logger = logging.getLogger("medhaa")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Triggers module-level model loading in app.models.* by importing them here,
    # so the first request never pays the model-load cost.
    from app.models import sentiment, ner, code_switch, transliteration
    logger.info("All models loaded.")
    yield

app = FastAPI(title="Medhaa API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to deployed frontend origin before shipping
    allow_methods=["*"],
    allow_headers=["*"],
)

def _safe_call(fn, *args, **kwargs):
    try:
        return fn(*args, **kwargs)
    except Exception:
        logger.exception("Inference failed")
        raise HTTPException(status_code=503, detail="The model service is temporarily unavailable.")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/api/sentiment")
def sentiment_endpoint(req: TextRequest):
    from app.models.sentiment import predict_sentiment
    return _safe_call(predict_sentiment, req.text)

@app.post("/api/ner")
def ner_endpoint(req: TextRequest):
    from app.models.ner import predict_ner
    return _safe_call(predict_ner, req.text)

@app.post("/api/transliterate")
def transliterate_endpoint(req: TextRequest):
    from app.models.transliteration import transliterate_text
    return _safe_call(transliterate_text, req.text)

@app.post("/api/code-switch")
def code_switch_endpoint(req: CodeSwitchRequest):
    from app.models.code_switch import predict_code_switch
    return _safe_call(predict_code_switch, req.text, req.mode)

@app.post("/api/analyze")
def analyze_endpoint(req: TextRequest):
    from app.models.sentiment import predict_sentiment
    from app.models.ner import predict_ner
    from app.models.code_switch import predict_code_switch

    def _run(text):
        has_telugu_script = any(TELUGU_UNICODE_RANGE[0] <= ord(c) <= TELUGU_UNICODE_RANGE[1] for c in text)
        mode = "native" if has_telugu_script else "romanized"
        sentiment = predict_sentiment(text)
        ner_result = predict_ner(text)
        code_switch_result = predict_code_switch(text, mode)
        has_english = any(t["tag"] == "ENGLISH" for t in code_switch_result["tokens"])
        language = "Telugu + English" if has_english else "Telugu"
        return {
            "sentiment": sentiment,
            "ner": ner_result,
            "codeSwitch": code_switch_result,
            "language": language,
        }
    return _safe_call(_run, req.text)
