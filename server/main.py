from fastapi import FastAPI
from routes.user_route import router as user_router 

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello, FastAPI!"}

@app.get("/api")
def api_root():
    return {"message": "Hello, welcome to the server!"}

app.include_router(user_router, prefix="/api/user", tags=["user"])