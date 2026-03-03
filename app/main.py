from fastapi import FastAPI
from app.db.database import engine, Base
import app.models.user   # Import the User model to ensure the table is created

app = FastAPI()


@app.on_event("startup")
def test_database_connection():
    try:
        with engine.connect() as connection:
            print("Database connected successfully ✅")
    except Exception as e:
        print("Database connection failed ❌")
        print(str(e))

Base.metadata.create_all(bind=engine)  # Create tables based on models

@app.get("/")
def root():
    return {"message": "AI Learning Platform Backend Running"}

