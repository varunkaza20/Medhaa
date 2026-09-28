# మేధా (Medhaa) — Telugu NLP Toolkit

Medhaa is a Telugu NLP toolkit — a set of four small tools for sentiment analysis, named entity recognition, transliteration, and code-switching detection in Telugu text. This project explores multilingual and low-resource NLP.

## What it does

| Tool | Task | Approach |
|---|---|---|
| **Sentiment Analysis** | Classify Telugu text as positive / neutral / negative | Fine-tuned transformer, 4-model comparison |
| **Named Entity Recognition** | Tag PERSON / LOCATION / ORGANIZATION spans | Fine-tuned transformer, 4-model comparison |
| **Transliteration** | Convert Roman-script Telugu to native script | Pretrained AI4Bharat IndicXlit (no fine-tuning) |
| **Code-Switching Detection** | Tag Telugu/English mixing, native-script and romanized text | Rule-based (native script) + fine-tuned transformer (romanized) |

## Models, datasets, and results

All fine-tuned models were selected from a 4-way comparison (MuRIL, IndicBERTv2-MLM-only, XLM-RoBERTa, mBERT) and are published on Hugging Face Hub.

### Sentiment Analysis
- **Dataset**: merged from three sources — ACTSA (`indic_glue`, `actsa-sc.te`), Mounika's Telugu Sentiment dataset, and AI4Bharat's IndicSentiment (Telugu subset). Combined: 28,798 train / 4,206 validation / 8,562 test examples, 3-class (negative/neutral/positive).
- **Chosen model**: IndicBERTv2-MLM-only — 72.80% accuracy / 72.68% macro-F1 on the held-out test set.
- **Model card**: [varunkaza20/telugu-sentiment](https://huggingface.co/varunkaza20/telugu-sentiment)

### Named Entity Recognition
- **Dataset**: AI4Bharat's Naamapadam (Telugu subset). 100,000 train (sampled from ~507K available) / 2,700 validation / 847 test (machine-projected) sentences, plus a 50-sentence human-verified gold test set. Entity types: PER, LOC, ORG (BIO tagging).
- **Chosen model**: XLM-RoBERTa — 82.99% F1 on the human-verified gold test set (84.37% on the larger but machine-projected test set).
- **Model card**: [varunkaza20/telugu-ner](https://huggingface.co/varunkaza20/telugu-ner)
- **Note**: the gold test set is small (50 sentences), so its F1 has real run-to-run variance — treat it as directional.

### Transliteration
- **Approach**: AI4Bharat's pretrained IndicXlit (11M parameters), used as-is with no fine-tuning.
- **Evaluation**: 3,000-word random sample from Aksharantar's Telugu test split (10,260 pairs total).
- **Results**: 66.03% top-1 word accuracy, 72.17% top-5 word accuracy, 8.74% mean character error rate.

### Code-Switching Detection
- **Native-script text**: handled deterministically via Unicode script-range detection — no model needed.
- **Romanized text dataset**: Gundapu & Mamidi's Telugu-English code-mixed word-level LID corpus. 1,426 train / 158 validation / 393 test sentences, labels `en` / `te` / `univ` (punctuation) / `ne` (named entity).
- **Chosen model**: mBERT — 86.99% accuracy / 72.04% macro-F1. Per-class F1: en 0.945, te 0.859, univ 0.735, ne 0.342 (the `ne` class has only 112 test examples, which explains its lower score).
- **Model card**: [varunkaza20/telugu-english-code-switch-lid](https://huggingface.co/varunkaza20/telugu-english-code-switch-lid)

## Tech stack

**Frontend**: React + TypeScript, built with Vite, styled with Tailwind CSS, routed with React Router.
**Backend** : FastAPI serving the three fine-tuned models plus the IndicXlit pipeline.

## Project structure

```
medhaa/
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── components/
    │   ├── ConfidenceBar.tsx
    │   ├── EmptyState.tsx
    │   ├── EntityHighlight.tsx
    │   ├── ErrorState.tsx
    │   ├── Footer.tsx
    │   ├── LanguageBadge.tsx
    │   ├── LoadingState.tsx
    │   ├── MainLayout.tsx
    │   ├── ModelCard.tsx
    │   ├── PageHeader.tsx
    │   ├── ResultCard.tsx
    │   ├── Sidebar.tsx
    │   ├── TextInput.tsx
    │   └── TopBar.tsx
    ├── pages/
    │   ├── About.tsx
    │   ├── Analyze.tsx
    │   ├── CodeSwitching.tsx
    │   ├── Dashboard.tsx
    │   ├── Models.tsx
    │   ├── NER.tsx
    │   ├── Sentiment.tsx
    │   └── Transliteration.tsx
    └── services/
        └── api.ts
```

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default (Vite's default port).

To build for production:

```bash
npm run build
```

## Status

All four NLP components are trained/integrated and evaluated. The React frontend covers all eight pages. The FastAPI backend and full frontend-backend integration are in progress.

## Author

Varun Kaza
