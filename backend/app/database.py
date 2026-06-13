from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "postgresql://postgres:manas123@localhost:5433/timetable_db"

print("DATABASE URL =", DATABASE_URL)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

# This creates a database session factory for FastAPI
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# This is the base class for all your database models
Base = declarative_base()

# Dependency to get the DB session for your routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()