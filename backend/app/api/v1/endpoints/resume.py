import os
import shutil
import uuid
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.models.job import Resume
from app.services.resume_parser import parse_resume

router = APIRouter()

UPLOAD_DIR = "uploads/resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    # Validate file type
    allowed_extensions = [".pdf", ".docx", ".txt", ".json", ".docs"]
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=400, 
            detail=f"File type not allowed. Allowed types: {', '.join(allowed_extensions)}"
        )
    
    # Generate unique filename
    file_id = str(uuid.uuid4())
    filename = f"{file_id}{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")
        
    # Parse content
    content_text = parse_resume(file_path, file.content_type)
    
    # Create DB entry
    # Check if user already has a resume, maybe we want to keep history or replace?
    # PRD says "show the latest uploaded resume".
    # We'll create a new entry.
    
    resume = Resume(
        id=file_id,
        user_id=current_user.id,
        file_path=file_path,
        content_text=content_text,
        experience_level="Pending Analysis", # Placeholder until Gemini analysis
        encouraging_note="Great start! Let's tailor this." # Placeholder
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    
    return {
        "id": resume.id,
        "filename": file.filename,
        "uploaded_at": resume.uploaded_at,
        "insights": {
            "experience_level": resume.experience_level,
            "encouraging_note": resume.encouraging_note
        }
    }


@router.get("/", response_model=None)
def get_latest_resume(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    # Get latest resume
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.uploaded_at.desc()).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="No resume found")
        
    return {
        "id": resume.id,
        "uploaded_at": resume.uploaded_at,
        "insights": {
            "experience_level": resume.experience_level,
            "encouraging_note": resume.encouraging_note
        }
    }
