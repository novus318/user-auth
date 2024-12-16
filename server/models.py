from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"  # Table

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)