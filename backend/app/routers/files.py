from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
import os
from uuid import uuid4
from app import auth, models
from app.db import AsyncSessionLocal
from sqlalchemy.future import select


router = APIRouter()
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_files(files: list[UploadFile] = File(...), current_user=Depends(auth.get_current_user)):
    saved = []
    async with AsyncSessionLocal() as db:
        for f in files:
            ext = os.path.splitext(f.filename)[1]
            name = f"{uuid4().hex}{ext}"
            path = os.path.join(UPLOAD_DIR, name)
            with open(path, "wb") as out:
                content = await f.read()
                out.write(content)
            # Optionally create Attachment record - omitted here (you can add and link to messages)
            saved.append({"filename": f.filename, "url": f"/files/static/{name}"})
    return saved


@router.get("/static/{filename}")
async def serve_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Not found")
    return FileResponse(file_path)