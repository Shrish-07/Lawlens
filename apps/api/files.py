from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os

from apps.api import models
from apps.api.database import get_db
from apps.api.auth import get_current_user

router = APIRouter(prefix="/files", tags=["files"])

UPLOAD_DIR = "uploads"

@router.get("/list")
def list_files(db: Session = Depends(get_db), user=Depends(get_current_user)):
    files = (
        db.query(models.PDFFile)
        .filter(models.PDFFile.owner_id == user.id)
        .all()
    )
    return [
        {
            "id": f.id,
            "filename": f.filename,
            "uploaded_at": f.uploaded_at,
        }
        for f in files
    ]

@router.get("/{file_id}")
def get_file(file_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    file = (
        db.query(models.PDFFile)
        .filter(models.PDFFile.id == file_id, models.PDFFile.owner_id == user.id)
        .first()
    )
    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    file_path = os.path.join(UPLOAD_DIR, file.filepath)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File missing on server")

    return FileResponse(file_path, filename=file.filename)
