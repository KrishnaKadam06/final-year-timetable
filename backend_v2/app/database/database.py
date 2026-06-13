from sqlalchemy import create_engine

DATABASE_URL="postgresql://postgres:manas123@localhost:5433/timetable_db"

print("DATABASE URL =", DATABASE_URL)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)