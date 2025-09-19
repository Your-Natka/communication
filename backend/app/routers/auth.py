from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .. import models, schemas, auth_utils
from ..db import get_db
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=schemas.UserOut)
async def register(user_in: schemas.UserCreate, session: AsyncSession = Depends(get_db)):
    q = await session.execute(
        select(models.User).where(
            (models.User.username == user_in.username) | 
            (models.User.email == user_in.email)
        )
    )
    if q.scalars().first():
        raise HTTPException(status_code=400, detail="User exists")

    user = models.User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=auth_utils.get_password_hash(user_in.password)
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user

@router.post("/token", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), session: AsyncSession = Depends(get_db)):
    q = await session.execute(select(models.User).where(models.User.username == form_data.username))
    user = q.scalars().first()
    if not user or not auth_utils.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token = auth_utils.create_access_token({"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}
