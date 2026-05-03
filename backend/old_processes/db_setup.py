import sqlite3
import pandas as pd
import os

def setup_relational_db():
    db_name = 'university_timetable.db'
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    # 1. Create dim_slots (The Time Grid)
    # We define 1-hour slots, plus the 30-min break. 
    # Labs will simply consume two consecutive 1-hour slots (e.g., Slot 1 and Slot 2)
    slots = [
        (1, "09:00", "10:00", 0),
        (2, "10:00", "11:00", 0),
        (3, "11:00", "12:00", 0),
        (4, "12:00", "12:30", 1), # The 30-min Break
        (5, "12:30", "01:30", 0),
        (6, "01:30", "02:30", 0),
        (7, "02:30", "03:30", 0),
        (8, "03:30", "04:30", 0)
    ]
    cursor.execute("DROP TABLE IF EXISTS dim_slots")
    cursor.execute("""
        CREATE TABLE dim_slots (
            slot_id INTEGER PRIMARY KEY,
            start_time TEXT,
            end_time TEXT,
            is_break INTEGER
        )
    """)
    cursor.executemany("INSERT INTO dim_slots VALUES (?,?,?,?)", slots)

    # 2. Create dim_days
    cursor.execute("DROP TABLE IF EXISTS dim_days")
    cursor.execute("CREATE TABLE dim_days (day_id INTEGER PRIMARY KEY, day_name TEXT)")
    cursor.executemany("INSERT INTO dim_days VALUES (?,?)", 
                       [(1, 'Monday'), (2, 'Tuesday'), (3, 'Wednesday'), (4, 'Thursday'), (5, 'Friday')])

    # 3. Create fact_user_constraints (For the Professor's Prompts)
    cursor.execute("DROP TABLE IF EXISTS fact_user_constraints")
    cursor.execute("""
        CREATE TABLE fact_user_constraints (
            constraint_id INTEGER PRIMARY KEY AUTOINCREMENT,
            faculty_initials TEXT,
            day_id INTEGER,
            preferred_start_slot INTEGER,
            preferred_end_slot INTEGER,
            constraint_type TEXT -- 'hard' (must) or 'soft' (should)
        )
    """)

    # 4. Import your CSVs into the Database
    output_dir = "output_db"
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
                print(f"✅ Imported {file} into table: {table_name}")
            else:
                print(f"⚠️ Could not find {file_path}")
    else:
        print(f"⚠️ Folder '{output_dir}' not found. Run your data extraction script first.")

    conn.commit()
    conn.close()
    print(f"\n🚀 Database '{db_name}' initialized and ready for the AI Solver.")

if __name__ == "__main__":
    setup_relational_db()