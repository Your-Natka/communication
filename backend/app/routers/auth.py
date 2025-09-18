from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app import models, schemas, auth
from app.db import AsyncSessionLocal
from sqlalchemy.ext.asyncio import AsyncSession


router = APIRouter()


@router.post("/register", response_model=schemas.UserOut)
async def register(user_in: schemas.UserCreate):
    async with AsyncSessionLocal() as db:
        # check existing
        existing = await db.execute(select(models.User).filter(models.User.username == user_in.username))
        if existing.scalars().first():
            raise HTTPException(status_code=400, detail="Username already taken")
        user = models.User(username=user_in.username, hashed_password=auth.pwd_context.hash(user_in.password), display_name=user_in.display_name)
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user


@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await auth.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}