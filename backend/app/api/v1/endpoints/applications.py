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


@router.get("/", response_model=List[ApplicationResponse])
def list_applications(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    applications = db.query(Application).filter(Application.user_id == current_user.id).offset(skip).limit(limit).all()
    return applications


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


@router.get("/{id}", response_model=ApplicationResponse)
def get_application(
    id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    application = db.query(Application).filter(Application.id == id, Application.user_id == current_user.id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application


class ApplicationUpdate(BaseModel):
    tailored_resume_sections: Optional[dict] = None
    cover_letter_content: Optional[str] = None
    status: Optional[str] = None


@router.patch("/{id}", response_model=ApplicationResponse)
def update_application(
    id: str,
    app_in: ApplicationUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    application = db.query(Application).filter(Application.id == id, Application.user_id == current_user.id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
        
    if app_in.tailored_resume_sections is not None:
        application.tailored_resume_sections = app_in.tailored_resume_sections
    if app_in.cover_letter_content is not None:
        application.cover_letter_content = app_in.cover_letter_content
    if app_in.status is not None:
        # Validate status enum if needed
        application.status = app_in.status
        
    db.commit()
    db.refresh(application)
    return application


class CoverLetterRegenerate(BaseModel):
    tone: str
    length: str
    highlights: Optional[List[str]] = []


@router.post("/{id}/regenerate_cover_letter", response_model=ApplicationResponse)
async def regenerate_cover_letter(
    id: str,
    params: CoverLetterRegenerate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    application = db.query(Application).filter(Application.id == id, Application.user_id == current_user.id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
        
    job = db.query(Job).filter(Job.id == application.job_id).first()
    resume = db.query(Resume).filter(Resume.id == application.resume_id).first()
    
    cover_letter = await gemini_service.generate_cover_letter(
        resume.content_text, 
        job.job_description, 
        tone=params.tone, 
        length=params.length, 
        highlights=params.highlights
    )
    
    application.cover_letter_content = cover_letter
    application.cover_letter_tone = params.tone
    application.cover_letter_length = params.length
    application.cover_letter_highlights = params.highlights
    
    db.commit()
    db.refresh(application)
    return application


@router.get("/{id}/download")
def download_application_package(
    id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    application = db.query(Application).filter(Application.id == id, Application.user_id == current_user.id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
        
    # Create ZIP in memory
    import io
    import zipfile
    from fastapi.responses import StreamingResponse
    
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        # Add Resume (Text for now, ideally PDF/DOCX)
        resume_content = ""
        if application.tailored_resume_sections:
            for section, content in application.tailored_resume_sections.items():
                resume_content += f"{section.upper()}\n\n{content}\n\n"
        else:
            resume_content = "No tailored resume content available."
            
        zip_file.writestr("tailored_resume.txt", resume_content)
        
        # Add Cover Letter
        cover_letter = application.cover_letter_content or "No cover letter content available."
        zip_file.writestr("cover_letter.txt", cover_letter)
        
    zip_buffer.seek(0)
    
    return StreamingResponse(
        zip_buffer, 
        media_type="application/zip", 
        headers={"Content-Disposition": f"attachment; filename=application_{id}.zip"}
    )
