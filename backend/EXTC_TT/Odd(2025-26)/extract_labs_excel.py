import pandas as pd
import os
import re

# 1. Target your exact lab file
TARGET_FILE = "New_Odd(2025-26)_Lab.xlsx"
OUTPUT_DIR = "cleaned_data"
os.makedirs(OUTPUT_DIR, exist_ok=True)

raw_assignments = []
unique_faculty = set()
unique_subjects = set()
unique_rooms = set()

# Check if the specific file exists
if not os.path.exists(TARGET_FILE):
    print(f"❌ Error: Could not find '{TARGET_FILE}' in the current folder!")
    print("Please check the spelling or make sure it is in the exact same folder.")
    exit()

print(f"🚀 Locked onto Excel file: {TARGET_FILE}")

try:
    # 2. Open the Excel file and get all sheet names
    xl = pd.ExcelFile(TARGET_FILE)
    print(f"📂 Found {len(xl.sheet_names)} sheets. Starting extraction...\n")

    for sheet_name in xl.sheet_names:
        # Read the sheet without headers so we don't mess up the top rows
        df = pd.read_excel(TARGET_FILE, sheet_name=sheet_name, header=None)
        
        # Search for the row where the actual timetable grid begins
        start_row = -1
        for i, row in df.iterrows():
            # Look for "Day" or "Day /Time" in the first column
            if str(row[0]).strip().startswith('Day'):
                start_row = i
                break
                
        if start_row == -1:
            print(f"⏭️ Skipping sheet '{sheet_name}' (No timetable grid found)")
            continue 
            
        # Re-assign the correct headers (e.g., 8:30-9:30, 9:30-10:30)
        df.columns = df.iloc[start_row]
        
        # Keep only the rows below the header (Mon, Tue, Wed, Thu, Fri)
        df = df.iloc[start_row + 1:]
        
        extracted_count = 0
        
        # Extract the data
        for index, row in df.iterrows():
            day = str(row.iloc[0]).strip()
            if day not in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']:
                continue
                
            for col in df.columns[1:]:
                cell = str(row[col]).replace('\n', '').strip()
                
                # Skip empty slots, breaks, or Honors electives
                if cell == 'nan' or not cell or 'BREAK' in cell.upper() or 'HONORS' in cell.upper() or 'AIDS' in cell.upper():
                    continue
                    
                # Clean up complex entries like "DLE-III: ESR/SS/Lab-703"
                if "DLE-" in cell:
                    cell = cell.split(':')[-1].strip()
                    
                # Split the cell by '/'
                parts = [p.strip() for p in cell.split('/')]
                
                if len(parts) >= 3:
                    batch = parts[0]
                    subject = parts[1]
                    faculty = parts[2]
                    # Use the room from the cell if available, otherwise use the sheet name
                    room = parts[3] if len(parts) > 3 else sheet_name
                    
                    # If batch has a number (like SYB1), it's a practical. Otherwise, theory.
                    is_practical = bool(re.search(r'\d$', batch))
                    
                    raw_assignments.append({
                        "batch_or_div": batch,
                        "subject_code": subject,
                        "faculty_initials": faculty,
                        "room_code": room,
                        "assignment_type": "practical" if is_practical else "theory",
                        "hours_per_week": 1 # Each cell represents 1 hour
                    })
                    
                    unique_faculty.add(faculty)
                    unique_subjects.add(subject)
                    unique_rooms.add(room)
                    extracted_count += 1
                    
        print(f"✅ Processed sheet '{sheet_name}' - Extracted {extracted_count} slots")

except Exception as e:
    print(f"❌ Error reading file: {e}")

# ==========================================
# AGGREGATE AND EXPORT
# ==========================================
if raw_assignments:
    df_assignments = pd.DataFrame(raw_assignments)
    
    # Group by the assignments to sum up the total hours per week
    workload_summary = df_assignments.groupby(
        ['batch_or_div', 'subject_code', 'faculty_initials', 'assignment_type']
    )['hours_per_week'].sum().reset_index()

    # Save to CSVs
    workload_summary.to_csv(f"{OUTPUT_DIR}/extracted_workloads.csv", index=False)
    pd.DataFrame(list(unique_faculty), columns=["faculty_initials"]).to_csv(f"{OUTPUT_DIR}/extracted_faculty.csv", index=False)
    pd.DataFrame(list(unique_subjects), columns=["subject_code"]).to_csv(f"{OUTPUT_DIR}/extracted_subjects.csv", index=False)
    pd.DataFrame(list(unique_rooms), columns=["room_code"]).to_csv(f"{OUTPUT_DIR}/extracted_rooms.csv", index=False)

    print(f"\n🎉 SUCCESS! Extracted {len(workload_summary)} unique workload rules.")
    print(f"📁 Check the '{OUTPUT_DIR}' folder for your database-ready CSVs!")
else:
    print("\n❌ Could not extract any valid data from the sheets.")