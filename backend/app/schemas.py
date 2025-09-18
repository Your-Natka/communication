from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    display_name: Optional[str]


class UserOut(BaseModel):
    id: int
    username: str
    display_name: Optional[str]


    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AttachmentOut(BaseModel):
    id: int
    filename: str
    url: str
    content_type: Optional[str]

    class Config:
        orm_mode = True


class MessageCreate(BaseModel):
    receiver_id: int
    content: Optional[str]
    attachment_ids: Optional[List[int]] = []


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
        orm_mode = True