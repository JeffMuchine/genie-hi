from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.api import deps
from app.models.user import User
from app.models.job import Job
from app.services.job_parser import parse_job_input
import uuid

router = APIRouter()


class JobCreate(BaseModel):
    input_data: str  # URL or text


class JobResponse(BaseModel):
    id: str
    job_title: str
    company_name: str
    description_preview: str
    source_url: Optional[str] = None
    
    class Config:
        orm_mode = True


@router.post("/", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def add_job(
    job_in: JobCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    # Parse input
    title, company, description = await parse_job_input(job_in.input_data)
    
    # Create job
    job = Job(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        job_title=title,
        company_name=company,
        job_description=description,
        source_url=job_in.input_data if job_in.input_data.startswith("http") else None
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    
    return {
        "id": job.id,
        "job_title": job.job_title,
        "company_name": job.company_name,
        "description_preview": job.job_description[:100] + "...",
        "source_url": job.source_url
    }


@router.get("/", response_model=List[JobResponse])
def list_jobs(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    jobs = db.query(Job).filter(Job.user_id == current_user.id).order_by(Job.added_at.desc()).all()
    
    return [
        {
            "id": job.id,
            "job_title": job.job_title,
            "company_name": job.company_name,
            "description_preview": job.job_description[:100] + "...",
            "source_url": job.source_url
        }
        for job in jobs
    ]


from fastapi import Response

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(
    job_id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    job = db.query(Job).filter(Job.id == job_id, Job.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    db.delete(job)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
