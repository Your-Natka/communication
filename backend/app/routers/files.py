from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
import os, uuid
from app.auth_utils import get_current_user
from app.db import get_db
from sqlalchemy.ext.asyncio import AsyncSession


router = APIRouter(prefix="/api/files", tags=["files"])
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_files(files: list[UploadFile] = File(...), current_user = Depends(get_current_user), session: AsyncSession = Depends(get_db)):
    results = []
    for f in files:
        file_id = str(uuid.uuid4())
        filename = f"{file_id}_{f.filename}"
        dest = os.path.join(UPLOAD_DIR, filename)
        with open(dest, "wb") as buffer:
            content = await f.read()
            buffer.write(content)
        url = f"/uploads/{filename}"
        # тут зберігаєте Attachment після створення message або зберігаєте тимчасовий запис
        results.append({"filename": f.filename, "url": url, "content_type": f.content_type})
    return results