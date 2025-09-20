from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Для реєстрації
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    display_name: Optional[str] = None

# Вивід користувача
class UserOut(BaseModel):
    id: int
    username: str
    email: str
    display_name: Optional[str] = None

    class Config:
        from_attributes = True

# Повідомлення
class MessageOut(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    content: Optional[str]
    created_at: datetime
    updated_at: datetime
    edited: bool
    class Config:
        from_attributes = True

# Токен
class Token(BaseModel):
    access_token: str
    token_type: str
    
class TokenData(BaseModel):
    id: str | None = None