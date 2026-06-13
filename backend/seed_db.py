import pandas as pd
import os
from app.database import engine, SessionLocal
from app.models import Base, Faculty, Subject, Batch, SubjectFacultyAssignment, Room

print("🔄 Initializing Database...")
Base.metadata.create_all(bind=engine)

CSV_PATH = "EXTC_TT/Odd(2025-26)/cleaned_data/extracted_workloads.csv"
ROOMS_CSV = "EXTC_TT/Odd(2025-26)/cleaned_data/extracted_rooms.csv"

df = pd.read_csv(CSV_PATH)
df_rooms = pd.read_csv(ROOMS_CSV)
db = SessionLocal()

try:
    print("⏳ Populating Master Tables...")
    
    # 1. Insert Rooms (NEW)
    for r in df_rooms['room_code'].dropna().unique():
        if not db.query(Room).filter_by(room_code=str(r)).first():
            db.add(Room(room_code=str(r), room_name=str(r), room_type="lab" if "Lab" in str(r) else "theory"))

    # 2. Insert Faculty
    for f in df['faculty_initials'].dropna().unique():
        if not str(f).startswith("Lab-") and not db.query(Faculty).filter_by(faculty_initials=f).first():
            db.add(Faculty(faculty_initials=f, faculty_name=f"Prof. {f}"))
            
    # 3. Insert Subjects
    for s in df['subject_code'].dropna().unique():
        if not db.query(Subject).filter_by(subject_code=s).first():
            db.add(Subject(subject_code=s, subject_name=s))
            
    # 4. Insert Batches
    for b in df['batch_or_div'].dropna().unique():
        if b not in ['CCS', 'ESR', 'NNDL'] and not db.query(Batch).filter_by(batch_name=b).first():
            db.add(Batch(batch_name=b))

    db.commit()

    print("⏳ Populating Workload Assignments...")
    db.query(SubjectFacultyAssignment).delete() # Clear old data
    
    # 5. Insert Assignments (NOW WITH ROOM CODE)
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
            room_code=str(row['room_code']),  # <--- THE FIX IS HERE
            assignment_type=row['assignment_type'],
            hours_per_week=row['hours_per_week'] # <--- This will now correctly say 2 for labs!
        ))
        assignments_added += 1
    
    db.commit()
    print(f"🎉 BOOM! Successfully injected {assignments_added} full assignments into PostgreSQL!")

except Exception as e:
    print(f"❌ Database Error: {e}")
    db.rollback()
finally:
    db.close()