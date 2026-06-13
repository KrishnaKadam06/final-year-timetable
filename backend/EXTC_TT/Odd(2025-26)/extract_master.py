import pandas as pd
import glob
import os
import re

# ==========================================
# 1. EXACT FOLDER PATHS
# ==========================================
TIMETABLE_DIR = r"C:\Users\My Document\OneDrive\Desktop\final-year-timetable\backend\EXTC_TT\Odd(2025-26)"
OUTPUT_DIR = r"C:\Users\My Document\OneDrive\Desktop\final-year-timetable\backend\EXTC_TT\Odd(2025-26)\cleaned_data"

os.makedirs(OUTPUT_DIR, exist_ok=True)

raw_assignments = []
unique_faculty = set()
unique_subjects = set()
unique_rooms = set()

# 2. Look for Classroom and Lab files in the exact directory
search_pattern = os.path.join(TIMETABLE_DIR, "*.xlsx")
excel_files = [f for f in glob.glob(search_pattern) if not os.path.basename(f).startswith('~$') and ('Lab' in f or 'Classroom' in f)]

if not excel_files:
    print(f"❌ Could not find any Lab or Classroom files in:\n{TIMETABLE_DIR}")
    exit()

for file in excel_files:
    print(f"🚀 Processing File: {os.path.basename(file)}")
    try:
        xl = pd.ExcelFile(file)
        for sheet_name in xl.sheet_names:
            df = pd.read_excel(file, sheet_name=sheet_name, header=None)
            
            start_row = -1
            for i, row in df.iterrows():
                if str(row[0]).strip().startswith('Day'):
                    start_row = i
                    break
                    
            if start_row == -1:
                continue 
                
            df.columns = df.iloc[start_row]
            df = df.iloc[start_row + 1:]
            
            for index, row in df.iterrows():
                day = str(row.iloc[0]).strip()
                if day not in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']:
                    continue
                    
                for col in df.columns[1:]:
                    cell = str(row[col]).replace('\n', '').strip()
                    
                    if cell == 'nan' or not cell or 'BREAK' in cell.upper() or 'HONORS' in cell.upper() or 'AIDS' in cell.upper() or 'MINOR' in cell.upper():
                        continue
                        
                    if "DLE-" in cell:
                        cell = cell.split(':')[-1].strip()
                        
                    parts = [p.strip() for p in cell.split('/')]
                    
                    if len(parts) >= 3:
                        batch = parts[0]
                        subject = parts[1]
                        faculty = parts[2]
                        # Capture the Room Code (e.g., CR-13, Lab-602)
                        room = parts[3] if len(parts) > 3 else sheet_name
                        
                        is_practical = bool(re.search(r'\d$', batch))
                        
                        raw_assignments.append({
                            "batch_or_div": batch,
                            "subject_code": subject,
                            "faculty_initials": faculty,
                            "room_code": room,
                            "assignment_type": "practical" if is_practical else "theory",
                            # FIX: Override merged cells. Practicals are 2 hours, Theory is 1 hour
                            "hours_per_week": 2 if is_practical else 1
                        })
                        
                        unique_faculty.add(faculty)
                        unique_subjects.add(subject)
                        unique_rooms.add(room)

    except Exception as e:
        print(f"❌ Error reading {os.path.basename(file)}: {e}")

# ==========================================
# 3. EXPORT
# ==========================================
if raw_assignments:
    df_assignments = pd.DataFrame(raw_assignments)
    
    # This groups duplicates and sums up hours (e.g., if a teacher has two 1-hour theory classes)
    workload_summary = df_assignments.groupby(
        ['batch_or_div', 'subject_code', 'faculty_initials', 'room_code', 'assignment_type']
    )['hours_per_week'].sum().reset_index()

    workload_summary.to_csv(os.path.join(OUTPUT_DIR, "extracted_workloads.csv"), index=False)
    pd.DataFrame(list(unique_rooms), columns=["room_code"]).to_csv(os.path.join(OUTPUT_DIR, "extracted_rooms.csv"), index=False)
    
    print(f"\n🎉 SUCCESS! Extracted {len(workload_summary)} master workload rules.")