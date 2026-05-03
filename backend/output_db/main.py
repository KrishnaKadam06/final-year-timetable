from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ai_solver import build_schedule
import traceback

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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