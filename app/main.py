from fastapi import FastAPI
from app.db.database import engine, Base
import app.models.user   # Import the User model to ensure the table is created
from app.api import auth 
import app.models.learning_plan
import app.models.topic
from fastapi import FastAPI
from app.api import learning_path
from app.api import tracking

app = FastAPI()
app.include_router(auth.router)  # Include the authentication routes
app.include_router(learning_path.router)
app.include_router(tracking.router)

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

