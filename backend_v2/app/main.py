from fastapi import FastAPI
from sqlalchemy import text
from app.database.database import engine

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Backend V2 Running Successfully"}

@app.get("/db-test")
def test_database():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            return {
                "database": "connected",
                "result": result.scalar()
            }

    except Exception as e:
        import traceback

        traceback.print_exc()

        return {
            "database": "failed",
            "error": str(e)
        }