from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.api import deps
from app.models.user import User
from app.models.job import Job, Resume, Application, ApplicationStatus
from app.services.gemini_service import gemini_service
import uuid

router = APIRouter()


class ApplicationCreate(BaseModel):
    job_id: str
    resume_id: str


class ApplicationResponse(BaseModel):
    id: str
    job_id: str
    resume_id: str
    status: str
    tailored_resume_sections: Optional[dict] = None
    cover_letter_content: Optional[str] = None
    
    class Config:
        orm_mode = True


@router.post("/generate", response_model=ApplicationResponse)
async def generate_application_materials(
    app_in: ApplicationCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    # Verify ownership
    job = db.query(Job).filter(Job.id == app_in.job_id, Job.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    resume = db.query(Resume).filter(Resume.id == app_in.resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    # Create Application entry if not exists
    application = db.query(Application).filter(
        Application.job_id == job.id, 
        Application.resume_id == resume.id
    ).first()
    
    if not application:
        application = Application(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            job_id=job.id,
            resume_id=resume.id,
            status=ApplicationStatus.GENERATING
        )
        db.add(application)
        db.commit()
    
    # Generate content (Resume Tailoring)
    tailored_data = await gemini_service.tailor_resume(resume.content_text, job.job_description)
    application.tailored_resume_sections = tailored_data
    
    # Generate Cover Letter (Default settings)
    cover_letter = await gemini_service.generate_cover_letter(
        resume.content_text, 
        job.job_description, 
        tone="Professional", 
        length="Medium", 
        highlights=[]
    )
    application.cover_letter_content = cover_letter
    
    application.status = ApplicationStatus.DRAFT
    db.commit()
    db.refresh(application)
    
    return application
