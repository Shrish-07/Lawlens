from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from apps.api.database import get_db
from apps.api.models import PDFFile
from apps.api.schemas import PDFUploadResponse, PDFListResponse
from apps.api.auth import get_current_user
from fastapi.responses import FileResponse
import os
from pathlib import Path

# Import our shared summarizer functions
from apps.api.summarizer import extract_text, summarize_text

router = APIRouter(
    prefix="/pdf",
    tags=["PDFs"]
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


# ----------- Upload PDF -----------
@router.post("/upload", response_model=PDFUploadResponse)
async def upload_pdf(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user) 
):
    try:
        file_location = UPLOAD_DIR / file.filename
        with open(file_location, "wb") as f:
            f.write(await file.read())

        pdf_entry = PDFFile(
            filename=file.filename,
            filepath=str(file_location),
            owner_id=current_user.id
        )
        db.add(pdf_entry)
        db.commit()
        db.refresh(pdf_entry)

        return {
            "id": pdf_entry.id,
            "filename": pdf_entry.filename,
            "owner_id": pdf_entry.owner_id,
            "message": "Uploaded successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


# ----------- List PDFs -----------
@router.get("/list", response_model=PDFListResponse)
def list_pdfs(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    pdfs = db.query(PDFFile).filter(PDFFile.owner_id == current_user.id).all()
    return {"pdfs": pdfs}


# ----------- Download PDF -----------
@router.get("/download/{pdf_id}")
def download_pdf(
    pdf_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    pdf = db.query(PDFFile).filter(
        PDFFile.id == pdf_id, PDFFile.owner_id == current_user.id
    ).first()

    if not pdf:
        raise HTTPException(status_code=404, detail="PDF not found")

    file_path = UPLOAD_DIR / pdf.filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found on server")

    return FileResponse(path=file_path, filename=pdf.filename, media_type="application/pdf")


# ----------- Summarize PDF -----------
@router.get("/summarize/{pdf_id}")
def summarize_pdf(
    pdf_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    pdf = db.query(PDFFile).filter(
        PDFFile.id == pdf_id, PDFFile.owner_id == current_user.id
    ).first()

    if not pdf:
        raise HTTPException(status_code=404, detail="PDF not found")

    file_path = UPLOAD_DIR / pdf.filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found on server")

    try:
        text = extract_text(str(file_path))
        final_summary = summarize_text(text)
        return {"id": pdf.id, "summary": final_summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to summarize PDF: {str(e)}")


# ----------- Delete PDF -----------
@router.delete("/delete/{pdf_id}")
def delete_pdf(
    pdf_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    pdf = db.query(PDFFile).filter(
        PDFFile.id == pdf_id, PDFFile.owner_id == current_user.id
    ).first()

    if not pdf:
        raise HTTPException(status_code=404, detail="PDF not found")

    file_path = UPLOAD_DIR / pdf.filename
    if file_path.exists():
        os.remove(file_path)

    db.delete(pdf)
    db.commit()

    return {"message": "PDF deleted successfully"}
