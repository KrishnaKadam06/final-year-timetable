import pandas as pd
import os
from app.database import engine, SessionLocal
from app.models import Base, Faculty, Subject, Batch, SubjectFacultyAssignment

print("🔄 Initializing Database...")
# This automatically creates all tables defined in models.py if they don't exist
Base.metadata.create_all(bind=engine)

# Path to the CSV we just created
CSV_PATH = "EXTC_TT/Odd(2025-26)/cleaned_data/extracted_workloads.csv"

if not os.path.exists(CSV_PATH):
    print(f"❌ Error: Cannot find {CSV_PATH}. Make sure you are running this from the 'backend' folder.")
    exit()

print("📂 Reading CSV data...")
df = pd.read_csv(CSV_PATH)
db = SessionLocal()

try:
    print("⏳ Populating Master Tables (Faculty, Subjects, Batches)...")
    
    # 1. Insert Unique Faculty (Skipping the bugged "Lab-..." entries)
    faculties = df['faculty_initials'].dropna().unique()
    for f in faculties:
        if str(f).startswith("Lab-"): 
            continue
        if not db.query(Faculty).filter_by(faculty_initials=f).first():
            db.add(Faculty(faculty_initials=f, faculty_name=f"Prof. {f}"))
            
    # 2. Insert Unique Subjects
    subjects = df['subject_code'].dropna().unique()
    for s in subjects:
        if not db.query(Subject).filter_by(subject_code=s).first():
            db.add(Subject(subject_code=s, subject_name=s))
            
    # 3. Insert Unique Batches
    batches = df['batch_or_div'].dropna().unique()
    for b in batches:
        # Filter out the subjects that accidentally got read as batches
        if b not in ['CCS', 'ESR', 'NNDL']: 
            if not db.query(Batch).filter_by(batch_name=b).first():
                db.add(Batch(batch_name=b))

    db.commit()

    print("⏳ Populating Workload Assignments...")
    
    # Clear old assignments to prevent duplicates if you run this twice
    db.query(SubjectFacultyAssignment).delete()
    
    # 4. Insert Assignments
    assignments_added = 0
    for _, row in df.iterrows():
        fac = str(row['faculty_initials'])
        batch = str(row['batch_or_div'])
        
        # Skip the bugged rows
        if fac.startswith("Lab-") or batch in ['CCS', 'ESR', 'NNDL']: 
            continue

        db.add(SubjectFacultyAssignment(
            subject_code=row['subject_code'],
            faculty_initials=fac,
            batch_name=batch,
            assignment_type=row['assignment_type'],
            hours_per_week=row['hours_per_week']
        ))
        assignments_added += 1
    
    db.commit()
    print(f"🎉 BOOM! Successfully injected {assignments_added} valid lab assignments into PostgreSQL!")

except Exception as e:
    print(f"❌ Database Error: {e}")
    db.rollback()
finally:
    db.close()