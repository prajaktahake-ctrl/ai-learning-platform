from fastapi import FastAPI
from app.db.database import engine

app = FastAPI()


@app.on_event("startup")
def test_database_connection():
    try:
        with engine.connect() as connection:
            print("Database connected successfully ✅")
    except Exception as e:
        print("Database connection failed ❌")
        print(str(e))


@app.get("/")
def root():
    return {"message": "AI Learning Platform Backend Running"}