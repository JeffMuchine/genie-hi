from sqlalchemy import Column, String, DateTime, ForeignKey, Text, JSON, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.session import Base
import enum


class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    file_path = Column(String, nullable=False)
    content_text = Column(Text, nullable=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    experience_level = Column(String, nullable=True)  # entry, mid, senior, executive
    encouraging_note = Column(Text, nullable=True)


class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    job_title = Column(String, nullable=False)
    company_name = Column(String, nullable=False)
    job_description = Column(Text, nullable=False)
    source_url = Column(String, nullable=True)
    added_at = Column(DateTime(timezone=True), server_default=func.now())


class ApplicationStatus(enum.Enum):
    DRAFT = "draft"
    GENERATING = "generating"
    READY = "ready"
    DOWNLOADED = "downloaded"
    FAILED = "failed"


class SectionStatus(enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"


class CoverLetterTone(enum.Enum):
    REFERRAL = "referral"
    CHAT = "chat"
    FORMAL = "formal"


class CoverLetterLength(enum.Enum):
    SHORT = "short"
    MEDIUM = "medium"
    LONG = "long"


class Application(Base):
    __tablename__ = "applications"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    job_id = Column(String, ForeignKey("jobs.id"), nullable=False)
    resume_id = Column(String, ForeignKey("resumes.id"), nullable=False)
    
    # Resume sections stored as JSON
    tailored_resume_sections = Column(JSON, nullable=True)
    
    # Cover letter data
    cover_letter_content = Column(Text, nullable=True)
    cover_letter_tone = Column(SQLEnum(CoverLetterTone), default=CoverLetterTone.FORMAL)
    cover_letter_length = Column(SQLEnum(CoverLetterLength), default=CoverLetterLength.MEDIUM)
    cover_letter_highlights = Column(JSON, nullable=True)  # List of strings
    cover_letter_version = Column(String, default="1")
    
    status = Column(SQLEnum(ApplicationStatus), default=ApplicationStatus.DRAFT)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
