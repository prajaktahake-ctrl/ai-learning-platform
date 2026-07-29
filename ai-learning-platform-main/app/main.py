from fastapi import FastAPI
from app.db.database import engine, Base
import app.models.user   # Import the User model to ensure the table is created
from app.api import auth 
import app.models.learning_plan
import app.models.topic, app.models.subtopic
from app.api import learning_path
from app.api import tracking
from fastapi.middleware.cors import CORSMiddleware
from app.api import quiz


app = FastAPI()
app.include_router(auth.router)  # Include the authentication routes
app.include_router(learning_path.router)
app.include_router(tracking.router)
app.include_router(quiz.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
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

