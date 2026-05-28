from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models import ReadingStatus


class BookCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    author: str = Field(min_length=1, max_length=255)
    status: ReadingStatus = ReadingStatus.unread
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    memo: Optional[str] = None


class BookUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    author: Optional[str] = Field(default=None, min_length=1, max_length=255)
    status: Optional[ReadingStatus] = None
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    memo: Optional[str] = None


class BookResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    author: str
    status: ReadingStatus
    rating: Optional[int]
    memo: Optional[str]
    created_at: datetime
