import os
import json
import jwt
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime,timedelta
from bcrypt import hashpw, gensalt,checkpw
from dotenv import load_dotenv

# Create the router
router = APIRouter()

load_dotenv() 

SECRET_KEY = os.getenv("SECRET_KEY1")


class User(BaseModel):
    name: Optional[str] = None
    email: str
    password: str

class TokenRequest(BaseModel):
    token: str

# File path for user data
USER_FILE = "user.json"

def save_user_to_file(user_data=None):
    # Check if the file exists; create it if not
    if not os.path.exists(USER_FILE):
        with open(USER_FILE, "w") as file:
            json.dump([], file)

    # Read existing users
    with open(USER_FILE, "r") as file:
        users = json.load(file)

    if user_data:
        # Append the new user if data is provided
        users.append(user_data)
        # Save back to the file
        with open(USER_FILE, "w") as file:
            json.dump(users, file, indent=4)
    
    return users 

@router.post("/create-user")
async def create_user(user: User):
    # Validate input data
    if not user.name or not user.email or not user.password:
        raise HTTPException(status_code=400, detail="Name, email, and password are required")
    
    users = save_user_to_file()  # Get the existing users
    if any(existing_user['email'] == user.email for existing_user in users):
        raise HTTPException(status_code=400, detail="Email is already registered")


    # Hash the password
    hashed_password = hashpw(user.password.encode("utf-8"), gensalt()).decode("utf-8")

    # Prepare user data
    user_data = {
        "id": datetime.utcnow().isoformat(),
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
    }

    # Save the user to file
    try:
        save_user_to_file(user_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving user data: {str(e)}")

    try:
        print(f"SECRET_KEY: {SECRET_KEY}")
        expiration_time = datetime.utcnow() + timedelta(days=2)
        token = jwt.encode(
            {"sub": user_data["id"], "exp": expiration_time},
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
async def login(user: User):
    # Validate input data
    if not user.email or not user.password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    
    users = save_user_to_file()  # Get the existing users

    # Find the user
    existing_user = next((u for u in users if u['email'] == user.email), None)
    if not existing_user:
        raise HTTPException(status_code=400, detail="Invalid email")
    
    # Check password matches
    if not checkpw(user.password.encode("utf-8"), existing_user['password'].encode("utf-8")):
     raise HTTPException(status_code=400, detail="Invalid password")
    
    try:
        expiration_time = datetime.utcnow() + timedelta(days=2)
        token = jwt.encode(
            {"sub": existing_user["id"], "exp": expiration_time},
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
async def verify_token(data: TokenRequest):
    # Extract the token from the request body
    token = data.token
    if not token:
        raise HTTPException(status_code=400, detail="Token is required")

    try:
        # Decode the token
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("sub")
        
        if not user_id:
            raise HTTPException(status_code=400, detail="Invalid token")
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid token")

    # Find the user 
    users = save_user_to_file()  # Get the users
    existing_user = next((u for u in users if u['id'] == user_id), None)
    
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Return the user
    return {
        "success": True,
        "user": {
            "id": existing_user["id"],
            "name": existing_user["name"],
            "email": existing_user["email"],
        }
    }

