from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    display_name: str | None = None

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    display_name: str | None = None
    class Config:
        from_attributes = True

class AttachmentOut(BaseModel):
    id: int
    filename: str
    url: str
    content_type: Optional[str]
    class Config:
        from_attributes = True

class MessageOut(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    content: Optional[str]
    created_at: datetime
    updated_at: datetime
    edited: bool
    attachments: List[AttachmentOut] = []
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str