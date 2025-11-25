from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
import httpx
from app.api import deps
from app.core.config import settings
from app.core import security
from app.models.user import User
from datetime import timedelta

router = APIRouter()


@router.get("/login/google")
def login_google():
    return {
        "url": f"https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id={settings.GOOGLE_CLIENT_ID}&redirect_uri={settings.GOOGLE_REDIRECT_URI}&scope=openid%20email%20profile"
    }


@router.get("/callback/google")
async def callback_google(code: str, db: Session = Depends(deps.get_db)):
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        # Mock behavior for development if keys are missing
        if settings.DEBUG:
            # Create a mock user
            mock_user_id = "mock-google-id-123"
            user = db.query(User).filter(User.id == mock_user_id).first()
            if not user:
                user = User(
                    id=mock_user_id,
                    email="mockuser@example.com",
                    name="Mock User",
                    profile_picture="https://via.placeholder.com/150"
                )
                db.add(user)
                db.commit()
                db.refresh(user)
            
            access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = security.create_access_token(
                subject=user.id, expires_delta=access_token_expires
            )
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": user.name,
                    "picture": user.profile_picture
                }
            }
        raise HTTPException(status_code=500, detail="Google Client ID/Secret not configured")

    async with httpx.AsyncClient() as client:
        # Exchange code for token
        token_response = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
        )
        token_data = token_response.json()
        
        if "error" in token_data:
            raise HTTPException(status_code=400, detail=token_data.get("error_description"))
            
        access_token_google = token_data["access_token"]
        
        # Get user info
        user_info_response = await client.get(
            "https://www.googleapis.com/oauth2/v1/userinfo",
            headers={"Authorization": f"Bearer {access_token_google}"},
        )
        user_info = user_info_response.json()
        
        # Find or create user
        user = db.query(User).filter(User.id == user_info["id"]).first()
        if not user:
            user = User(
                id=user_info["id"],
                email=user_info["email"],
                name=user_info.get("name"),
                profile_picture=user_info.get("picture")
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            # Update info if changed
            user.name = user_info.get("name")
            user.profile_picture = user_info.get("picture")
            db.commit()
        
        # Create JWT
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = security.create_access_token(
            subject=user.id, expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "picture": user.profile_picture
            }
        }
