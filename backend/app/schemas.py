from pydantic import BaseModel, Field
from typing import Literal

class TextRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=500)

class CodeSwitchRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=500)
    mode: Literal["native", "romanized"]
