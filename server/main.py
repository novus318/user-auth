from fastapi import FastAPI
from routes.user_route import router as user_router
from database import  engine
import models


models.Base.metadata.create_all(bind=engine)
app = FastAPI()


@app.get("/")
def root():
    return {"message": "Hello, this is FastAPI!"}

@app.get("/api")
def api_root():
    return {"message": "Hi, welcome to the server!"}

# Include the user routes
app.include_router(user_router, prefix="/api/user", tags=["user"])
