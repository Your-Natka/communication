from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app import models, db, oauth2, schemas
from app.utils import hash_password, create_access_token

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=schemas.UserOut)
async def read_users_me(current_user: models.User = Depends(oauth2.get_current_user)):
    return current_user

@router.get("/", response_model=list[schemas.UserOut])
async def get_users(db: AsyncSession = Depends(db.get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    result = await db.execute(select(models.User))
    users = result.scalars().all()
    return [u for u in users if u.id != current_user.id]

@router.post("/register", response_model=schemas.Token)
async def register(user: schemas.UserCreate, db: AsyncSession = Depends(db.get_db)):
    hashed_password = hash_password(user.password)
    new_user = models.User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    access_token = create_access_token({"user_id": new_user.id})
    return {"token": access_token}
