import sqlite3
import pandas as pd
import os

def setup_relational_db():
    # 💥 THE NUCLEAR OPTION: Hardcoding your exact computer path
    MAIN_DIR = r"c:\Users\Savir\OneDrive\Desktop\Semwise\SEM 6\final year project material"
    output_dir = os.path.join(MAIN_DIR, "output_db")
    db_path = os.path.join(MAIN_DIR, 'university_timetable.db')
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # 1. Create dim_slots 
    slots = [
        (1, "09:00", "10:00", 0), (2, "10:00", "11:00", 0),
        (3, "11:00", "12:00", 0), (4, "12:00", "12:30", 1), 
        (5, "12:30", "01:30", 0), (6, "01:30", "02:30", 0),
        (7, "02:30", "03:30", 0), (8, "03:30", "04:30", 0)
    ]
    cursor.execute("DROP TABLE IF EXISTS dim_slots")
    cursor.execute("CREATE TABLE dim_slots (slot_id INTEGER PRIMARY KEY, start_time TEXT, end_time TEXT, is_break INTEGER)")
    cursor.executemany("INSERT INTO dim_slots VALUES (?,?,?,?)", slots)

    # 2. Create dim_days
    cursor.execute("DROP TABLE IF EXISTS dim_days")
    cursor.execute("CREATE TABLE dim_days (day_id INTEGER PRIMARY KEY, day_name TEXT)")
    cursor.executemany("INSERT INTO dim_days VALUES (?,?)", [(1, 'Monday'), (2, 'Tuesday'), (3, 'Wednesday'), (4, 'Thursday'), (5, 'Friday')])

    # 3. Create fact_user_constraints 
    cursor.execute("DROP TABLE IF EXISTS fact_user_constraints")
    cursor.execute("CREATE TABLE fact_user_constraints (constraint_id INTEGER PRIMARY KEY AUTOINCREMENT, faculty_initials TEXT, day_id INTEGER, preferred_start_slot INTEGER, preferred_end_slot INTEGER, constraint_type TEXT)")

    # 4. Import your CSVs into the Database
    if os.path.exists(output_dir):
        files_to_import = {
            'dim_faculty.csv': 'dim_faculty',
            'fact_workload.csv': 'fact_workload',
            'flat_timetable.csv': 'historical_timetable'
        }
        
        for file, table_name in files_to_import.items():
            file_path = os.path.join(output_dir, file)
            if os.path.exists(file_path):
                df = pd.read_csv(file_path)
                df.to_sql(table_name, conn, if_exists='replace', index=False)
                print(f"[SUCCESS] Imported {file} into table: {table_name}")
            else:
                print(f"[MISSING] Could not find {file_path}")
    else:
        print(f"[ERROR] Folder 'output_db' not found at {output_dir}.")

    conn.commit()
    conn.close()
    print(f"\n[DONE] Database created at: {db_path}")

if __name__ == "__main__":
    setup_relational_db()