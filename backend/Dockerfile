FROM python:3.10-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends build-essential && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir "pip<24.1" && pip install --no-cache-dir -r requirements.txt
COPY app/ ./app/
# Pre-download and cache all models at BUILD time, not first-request time --
# this is the main lever against cold-start latency on free-tier hosting.
RUN python -c "\
from transformers import AutoTokenizer, AutoModelForSequenceClassification, AutoModelForTokenClassification; \
AutoTokenizer.from_pretrained('varunkaza20/telugu-sentiment'); \
AutoModelForSequenceClassification.from_pretrained('varunkaza20/telugu-sentiment'); \
AutoTokenizer.from_pretrained('varunkaza20/telugu-ner'); \
AutoModelForTokenClassification.from_pretrained('varunkaza20/telugu-ner'); \
AutoTokenizer.from_pretrained('varunkaza20/telugu-english-code-switch-lid'); \
AutoModelForTokenClassification.from_pretrained('varunkaza20/telugu-english-code-switch-lid'); \
from ai4bharat.transliteration import XlitEngine; XlitEngine('te', beam_width=10, rescore=True)"
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
