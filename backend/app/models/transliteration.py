# Python 3.10 + torch==2.5.1 -- no monkeypatches needed on this path.
from ai4bharat.transliteration import XlitEngine

engine = XlitEngine("te", beam_width=10, rescore=True)

def transliterate_text(text: str) -> dict:
    result = engine.translit_sentence(text)
    return {"output": result["te"]}
