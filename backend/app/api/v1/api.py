from fastapi import APIRouter
from app.api.v1.endpoints import auth, resume, jobs, applications

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(resume.router, prefix="/resume", tags=["resume"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
api_router.include_router(applications.router, prefix="/applications", tags=["applications"])
