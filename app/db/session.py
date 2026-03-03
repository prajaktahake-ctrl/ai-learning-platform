from sqlalchemy import sessionmaker
from app.db.database import engine 

# Create a session factory bound to the engine
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)