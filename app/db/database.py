from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from app.config import DATABASE_URL

engine = create_engine(DATABASE_URL, pool_pre_ping=True)  #pool_pre_ping to check connection health(still alive or not) before using it from the pool

Base = declarative_base()