from sqlalchemy import Column, String, DateTime, Enum as SQLEnum
from sqlalchemy.sql import func
from app.db.session import Base
import enum


class SubscriptionTier(enum.Enum):
    FREE = "free"
    BASIC = "basic"
    PREMIUM = "premium"


class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    profile_picture = Column(String, nullable=True)
    subscription_tier = Column(SQLEnum(SubscriptionTier), default=SubscriptionTier.FREE)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
