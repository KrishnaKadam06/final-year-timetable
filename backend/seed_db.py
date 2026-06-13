import pandas as pd
import os
from app.database import engine, SessionLocal
from app.models import Base, Faculty, Subject, Batch, SubjectFacultyAssignment, Room

print("🔄 Initializing Database...")
Base.metadata.create_all(bind=engine)

# ==========================================
# 1. EXACT ABSOLUTE PATHS
# ==========================================
CSV_PATH = r"C:\Users\My Document\OneDrive\Desktop\final-year-timetable\backend\EXTC_TT\Odd(2025-26)\cleaned_data\extracted_workloads.csv"
ROOMS_CSV = r"C:\Users\My Document\OneDrive\Desktop\final-year-timetable\backend\EXTC_TT\Odd(2025-26)\cleaned_data\extracted_rooms.csv"

if not os.path.exists(CSV_PATH) or not os.path.exists(ROOMS_CSV):
    print("❌ Error: Could not find the CSV files! Did you run extract_master.py first?")
    exit()

print("📂 Reading CSV data...")
df = pd.read_csv(CSV_PATH)
df_rooms = pd.read_csv(ROOMS_CSV)
db = SessionLocal()

try:
    print("⏳ Populating Master Tables...")
    
    # Insert Rooms
    for r in df_rooms['room_code'].dropna().unique():
        if not db.query(Room).filter_by(room_code=str(r)).first():
            db.add(Room(room_code=str(r), room_name=str(r), room_type="lab" if "Lab" in str(r) else "theory"))

    # Insert Faculty
    for f in df['faculty_initials'].dropna().unique():
        if not str(f).startswith("Lab-") and not db.query(Faculty).filter_by(faculty_initials=f).first():
            db.add(Faculty(faculty_initials=f, faculty_name=f"Prof. {f}"))
            
    # Insert Subjects
    for s in df['subject_code'].dropna().unique():
        if not db.query(Subject).filter_by(subject_code=s).first():
            db.add(Subject(subject_code=s, subject_name=s))
            
    # Insert Batches
    for b in df['batch_or_div'].dropna().unique():
        if b not in ['CCS', 'ESR', 'NNDL'] and not db.query(Batch).filter_by(batch_name=b).first():
            db.add(Batch(batch_name=b))

    db.commit()

    print("⏳ Populating Workload Assignments...")
    db.query(SubjectFacultyAssignment).delete() # Clear old data to prevent duplicates
    
    # Insert Assignments WITH Room Code and Hours
    assignments_added = 0
    for _, row in df.iterrows():
        fac = str(row['faculty_initials'])
        batch = str(row['batch_or_div'])
        
        if fac.startswith("Lab-") or batch in ['CCS', 'ESR', 'NNDL']: 
            continue

        db.add(SubjectFacultyAssignment(
            subject_code=row['subject_code'],
            faculty_initials=fac,
            batch_name=batch,
            room_code=str(row['room_code']),
            assignment_type=row['assignment_type'],
            hours_per_week=row['hours_per_week']
        ))
        assignments_added += 1
    
    db.commit()
    print(f"🎉 BOOM! Successfully injected {assignments_added} assignments into PostgreSQL!")

except Exception as e:
    print(f"❌ Database Error: {e}")
    db.rollback()
finally:
    db.close()