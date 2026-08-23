from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime


class ItemCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    category: Optional[str] = Field(default="uncategorized", max_length=50)
    quantity: int = Field(default=1, ge=1, le=999)
    price: float = Field(default=0, ge=0, le=99999)

    @field_validator("name")
    @classmethod
    def sanitize_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("name must not be empty")
        return v

    @field_validator("category")
    @classmethod
    def sanitize_category(cls, v: Optional[str]) -> str:
        if v is None:
            return "uncategorized"
        v = v.strip().lower()
        return v if v else "uncategorized"


class BatchItemCreate(BaseModel):
    items: List[ItemCreate] = Field(..., min_length=1, max_length=50)


class VoiceCommandRequest(BaseModel):
    transcript: str = Field(..., min_length=1, max_length=500)
    lang: Optional[str] = Field(default="en-US", max_length=10)

    @field_validator("transcript")
    @classmethod
    def sanitize_transcript(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("transcript must not be empty")
        return v


class ItemResponse(BaseModel):
    id: int
    name: str
    category: str
    quantity: int
    price: float
    date: datetime

    class Config:
        from_attributes = True


class BatchItemResponse(BaseModel):
    success: bool
    items: List[ItemResponse]
    count: int
