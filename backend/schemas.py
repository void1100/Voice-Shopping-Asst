from pydantic import BaseModel, Field, field_validator, EmailStr
from typing import Optional, List
from datetime import datetime


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------

class UserRegister(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., min_length=5, max_length=255)
    password: str = Field(..., min_length=6, max_length=128)

    @field_validator("name")
    @classmethod
    def sanitize_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("name must not be empty")
        return v

    @field_validator("email")
    @classmethod
    def sanitize_email(cls, v: str) -> str:
        v = v.strip().lower()
        if "@" not in v or "." not in v.split("@")[-1]:
            raise ValueError("invalid email format")
        return v


class UserLogin(BaseModel):
    email: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)

    @field_validator("email")
    @classmethod
    def sanitize_email(cls, v: str) -> str:
        return v.strip().lower()


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Shopping List Items
# ---------------------------------------------------------------------------

class ListItemCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    category: Optional[str] = Field(default="uncategorized", max_length=50)
    quantity: int = Field(default=1, ge=1, le=999)
    price: float = Field(default=0, ge=0, le=99999)
    note: Optional[str] = Field(default="", max_length=500)

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


class ListItemUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=200)
    category: Optional[str] = Field(default=None, max_length=50)
    quantity: Optional[int] = Field(default=None, ge=1, le=999)
    price: Optional[float] = Field(default=None, ge=0, le=99999)
    note: Optional[str] = Field(default=None, max_length=500)


class ListItemResponse(BaseModel):
    id: int
    user_id: int
    name: str
    normalized_name: str
    category: str
    quantity: int
    price: float
    note: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BatchListItemCreate(BaseModel):
    items: List[ListItemCreate] = Field(..., min_length=1, max_length=50)


# ---------------------------------------------------------------------------
# Cart Items
# ---------------------------------------------------------------------------

class CartItemCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    category: Optional[str] = Field(default="uncategorized", max_length=50)
    quantity: int = Field(default=1, ge=1, le=999)
    price: float = Field(default=0, ge=0, le=99999)
    source_list_item_id: Optional[int] = None

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


class CartItemUpdate(BaseModel):
    quantity: Optional[int] = Field(default=None, ge=1, le=999)
    price: Optional[float] = Field(default=None, ge=0, le=99999)


class CartItemResponse(BaseModel):
    id: int
    user_id: int
    name: str
    normalized_name: str
    category: str
    quantity: int
    price: float
    source_list_item_id: Optional[int]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BatchCartItemCreate(BaseModel):
    items: List[CartItemCreate] = Field(..., min_length=1, max_length=50)


# ---------------------------------------------------------------------------
# Voice
# ---------------------------------------------------------------------------

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


# ---------------------------------------------------------------------------
# Generic
# ---------------------------------------------------------------------------

class SuccessResponse(BaseModel):
    success: bool
    message: str = ""
