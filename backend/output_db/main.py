from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Union
from ai_solver import build_schedule
import traceback
import pandas as pd
from sqlalchemy import create_engine

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request bodies
class LoginRequest(BaseModel):
    username: str
    password: str

class ValidateRequest(BaseModel):
    timetable: Union[List[Any], Dict[str, Any]]

@app.post("/auth/login")
def login(request: LoginRequest):
    if request.username == "admin" and request.password == "admin":
        return {"success": True, "role": "admin", "token": "mock_jwt_token_123"}
    return {"success": False, "error": "Invalid credentials"}

@app.post("/upload/{category}")
def upload_data(category: str, data: List[Dict[str, Any]]):
    try:
        if not data:
            return {"success": False, "error": "No data provided"}
            
        print(f"--> Received upload for category: {category} with {len(data)} records")
        
        # Determine table name based on category
        table_name = category
        if category == "workload":
            table_name = "fact_workload"
        elif category == "faculty":
            table_name = "dim_faculty"
        
        # Load data into pandas dataframe
        df = pd.DataFrame(data)
        
        # Push to SQLite instead of Postgres
        engine = create_engine('sqlite:///university_timetable.db')
        df.to_sql(table_name, engine, if_exists='replace', index=False)
        
        return {"success": True, "count": len(data), "message": f"Successfully uploaded to {table_name}"}
    except Exception as e:
        print("🚨 UPLOAD CRASH DETECTED!")
        traceback.print_exc()
        return {"success": False, "error": str(e)}

@app.post("/validate")
def validate_timetable(request: ValidateRequest):
    try:
        timetable = request.timetable
        
        # Simple mock validation replicating the frontend's mock
        if isinstance(timetable, list):
            for d_idx, day_obj in enumerate(timetable):
                if isinstance(day_obj, dict) and 'slots' in day_obj:
                    for s_idx, slot in enumerate(day_obj['slots']):
                        if slot.get('faculty') == "Dr. Smith" and d_idx == 0 and s_idx == 0:
                            return {"valid": False, "message": "Conflict: Dr. Smith is double-booked."}
        
        return {"valid": True, "message": "No conflicts detected."}
    except Exception as e:
        traceback.print_exc()
        return {"valid": False, "message": f"Validation error: {str(e)}"}

@app.get("/get-timetable/{term}")
def get_timetable(term: str):
    try:
        print(f"--> API received request for term: {term}")
        
        # Run the solver
        result = build_schedule(target_term=term)
        
        if result:
            return {"status": "success", "data": result}
        return {"status": "error", "message": "Infeasible"}
        
    except Exception as e:
        # If ANYTHING goes wrong, force it to print and send to the UI
        print("🚨 CRASH DETECTED!")
        traceback.print_exc()
        return {"CRASH_REASON": str(e)}