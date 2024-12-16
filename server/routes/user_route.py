import os
import json
import jwt
from typing import Optional,Any
from fastapi import APIRouter, HTTPException ,Depends
from pydantic import BaseModel
from datetime import datetime,timedelta
from bcrypt import hashpw, gensalt,checkpw
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from models import User
from database import SessionLocal  

# Create the router
router = APIRouter()

# Load environment variables
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY1")


class UserTypes(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None


class TokenRequest(BaseModel):
    token: str


# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/create-user")
async def create_user(user: UserTypes, db: Session = Depends(get_db)):
    # Check required
    if not user.name or not user.email or not user.password:
        raise HTTPException(status_code=400, detail="Name, email, and password are required")

    # Check email already registered
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registered")

    # Hash the password
    hashed_password = hashpw(user.password.encode("utf-8"), gensalt()).decode("utf-8")

    # Create a new user instance
    new_user = User(
        id=datetime.utcnow().isoformat(),
        name=user.name,
        email=user.email,
        password=hashed_password
    )

    # Save the user
    try:
        db.add(new_user)
        db.commit()
        db.refresh(user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error saving user data: {str(e)}")

    # Generate a JWT token
    try:
        expiration_time = datetime.utcnow() + timedelta(days=2)
        token = jwt.encode(
            {"sub": new_user.id, "exp": expiration_time},
            SECRET_KEY,
            algorithm="HS256"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating token: {str(e)}")

    # Return response
    return {
        "success": True,
        "message": "User created successfully",
        "token": token
    }


@router.post("/login")
async def login(user: UserTypes, db: Session = Depends(get_db)):
    # Validate 
    if not user.email or not user.password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    
    # find email already present
    existing_user = db.query(User).filter(User.email == user.email).first()
    if not existing_user:
        raise HTTPException(status_code=400, detail="This email is not registered. Please signup")

    # Verify the password
    if not checkpw(user.password.encode("utf-8"), existing_user.password.encode("utf-8")):
        raise HTTPException(status_code=400, detail="Invalid password")

    # Generate a JWT token
    try:
        expiration_time = datetime.utcnow() + timedelta(days=2)
        token = jwt.encode(
            {"sub": existing_user.id, "exp": expiration_time},
            SECRET_KEY,
            algorithm="HS256"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating token: {str(e)}")

    # Return response
    return {
        "success": True,
        "message": "Login successful",
        "token": token
    }


@router.post("/verify")
async def verify_token(data: TokenRequest, db: Session = Depends(get_db)):
    #token from body
    token = data.token
    if not token:
        raise HTTPException(status_code=400, detail="Token is required")

    try:
        # Decode token
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("sub")
        
        if not user_id:
            raise HTTPException(status_code=400, detail="Invalid token")
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid token")

    # Find user 
    existing_user = db.query(User).filter(User.id == user_id).first()
    
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Return with user
    return {
        "success": True,
        "user": {
            "id": existing_user.id,
            "name": existing_user.name,
            "email": existing_user.email,
        }
    }

@router.put("/update-user/{user_id}")
async def update_user_name(user_id: str, data:UserTypes, db: Session = Depends(get_db)):
    print(f"User ID: {user_id}, New Name: {data.name}")
    # Check user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update
    user.name = data.name

    # Commit
    try:
        db.commit()
        db.refresh(user)
    except Exception as e:
        db.rollback()  # Rollback
        raise HTTPException(status_code=500, detail=f"Error updating user data: {str(e)}")

    # Return user information
    return {
        "success": True,
        "message": "User name updated successfully",
        "user": {"id": user.id, "name": user.name, "email": user.email}
    }


