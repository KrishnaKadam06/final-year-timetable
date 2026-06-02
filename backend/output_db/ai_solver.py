from sqlalchemy import create_engine
import pandas as pd
from ortools.sat.python import cp_model
import sys

sys.stdout.reconfigure(encoding='utf-8')

def fetch_data(target_term):
    # Setup the SQLite connection via SQLAlchemy to avoid requiring a local Postgres server
    engine = create_engine('sqlite:///university_timetable.db')
        
    print(f"👉 Filtering workload for Term: {target_term}")
    
    query = f"SELECT * FROM fact_workload WHERE term = '{target_term}' AND faculty_initials != 'Unknown'"
    workload_df = pd.read_sql_query(query, engine)
    
    workload_df['hours'] = pd.to_numeric(workload_df['hours'], errors='coerce').fillna(0)
    workload_df = workload_df.groupby(['faculty_initials', 'subject_clean', 'type'])['hours'].sum().reset_index()
    workload_df = workload_df[workload_df['hours'] > 0]
    
    slots_df = pd.read_sql_query("SELECT * FROM dim_slots WHERE is_break = 0", engine)
    days_df = pd.read_sql_query("SELECT * FROM dim_days", engine)
    
    return workload_df, slots_df, days_df

def export_to_excel(solver, schedule, days_list, slots_list, subject_year_map, filename="final_timetable.xlsx"):
    print("\n📊 Formatting data for Multi-Sheet Excel Exporter...")
    
    # 1. Extract all successful matches and Tag them with their Year
    data = []
    for (fac, sub, typ, day, slot), var in schedule.items():
        if solver.Value(var) == 1:
            # Find out if this is an SY, TY, or LY subject
            year = subject_year_map.get(sub, 'UNKNOWN')
            
            class_info = f"{sub} ({typ[:4].upper()}) - {fac.upper()}"
            data.append({'Year': year, 'Day': day, 'Slot': slot, 'Class': class_info})
            
    # 2. Convert to Pandas DataFrame
    # Always define columns so that if data is empty, it doesn't crash with KeyError: 'Year'
    df = pd.DataFrame(data, columns=['Year', 'Day', 'Slot', 'Class'])
    
    # 3. Use ExcelWriter to generate multiple sheets in one file
    with pd.ExcelWriter(filename) as writer:
        sheets_added = False
        # We explicitly target your three year batches plus UNKNOWN
        for year in ['SY', 'TY', 'LY', 'UNKNOWN']:
            # Filter the dataframe for only this specific year
            df_year = df[df['Year'] == year]
            
            if df_year.empty:
                continue # Skip if there are no classes for this year
                
            # Group simultaneous classes (for parallel electives like PROJECT)
            df_grouped = df_year.groupby(['Day', 'Slot'])['Class'].apply(lambda x: ' |\n'.join(x)).reset_index()
            
            # Pivot the grid: Days on Y-axis, Slots on X-axis
            pivot_df = df_grouped.pivot(index='Day', columns='Slot', values='Class').fillna('---')
            
            # Clean up the Day labels
            day_mapping = {1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday'}
            pivot_df.index = pivot_df.index.map(day_mapping)
            
            # Ensure all slots exist in the columns, even if they are empty
            for s in slots_list:
                if s not in pivot_df.columns:
                    pivot_df[s] = '---'
                    
            # Sort the columns so Slot 1 is always first
            pivot_df = pivot_df[sorted(pivot_df.columns)]
            pivot_df.columns = [f"Slot {s}" for s in pivot_df.columns]
            
            # Save to its designated tab
            pivot_df.to_excel(writer, sheet_name=f"{year} Timetable")
            sheets_added = True
            
        if not sheets_added:
            pd.DataFrame({'Message': ['No valid schedule data found']}).to_excel(writer, sheet_name="Empty")
            
    print(f"✅ Multi-sheet Excel file successfully saved as: {filename}")

def build_schedule(target_term):
    print("1. Fetching data from database...")
    workload, slots, days = fetch_data(target_term)
    
    days_list = days['day_id'].tolist()
    slots_list = slots['slot_id'].tolist()
    
    print("\n--- SANITY CHECK & DATA CLEANING ---")
    total_slots_per_week = len(days_list) * len(slots_list)
    
    # 🚨 FIX 1: Convert Excel "Batches" to exact "Hours"
    for idx, row in workload.iterrows():
        val = int(float(row['hours']))
        if row['type'].lower() == 'practical':
            actual_hours = val * 2 if val < 10 else val 
            if actual_hours != val:
                print(f"🔧 Converted: Prof '{row['faculty_initials'].upper()}' {row['subject_clean']} ({val} batches -> {actual_hours} hrs)")
            workload.at[idx, 'hours'] = actual_hours
        else:
            workload.at[idx, 'hours'] = val

    faculty_hours = workload.groupby('faculty_initials')['hours'].sum()
    impossible = False
    for fac, hrs in faculty_hours.items():
        if hrs > total_slots_per_week:
            print(f" ERROR: Prof '{fac.upper()}' has {hrs} hours assigned! (Max is {total_slots_per_week})")
            impossible = True
            
    if impossible:
        print(" Stopping AI. Workload demands more hours than exist in a week.")
        return
    else:
        print(" All workloads are valid. Proceeding to AI...\n")

    SUBJECT_YEAR_MAP = {
        'AM-III': 'SY', 'EICS': 'SY', 'RSA': 'SY', 'DSA': 'SY', 'EDC': 'SY',
        'MIS': 'TY', 'DCOM': 'TY', 'BEE': 'TY', 'DTSP': 'TY', 'DLD': 'TY',
        'CSL': 'LY', 'PROJECT': 'LY', 'DOCM': 'LY', 'ROBO': 'LY', 'PBL MINI': 'SY'
    }
    
    EXCLUDE_FROM_CLASH = ['PROJECT', 'PBL MINI', 'MINI PROJECT', 'SEMINAR']

    model = cp_model.CpModel()
    schedule = {}
    
    print("2. Building the mathematical search space...")
    for _, row in workload.iterrows():
        fac = row['faculty_initials']
        subj = row['subject_clean']
        l_type = row['type']
        
        for d in days_list:
            for s in slots_list:
                name = f"match_{fac}_{subj}_{l_type}_day{d}_slot{s}"
                schedule[(fac, subj, l_type, d, s)] = model.NewBoolVar(name)
                
    print("3. Applying Hard Constraints...")
    unique_faculties = workload['faculty_initials'].unique()
    
    for d in days_list:
        for s in slots_list:
            for fac in unique_faculties:
                vars_for_fac_at_time = [
                    schedule[(f, sub, typ, day, slot)] 
                    for (f, sub, typ, day, slot) in schedule 
                    if f == fac and day == d and slot == s
                ]
                model.AddAtMostOne(vars_for_fac_at_time)
                
    for _, row in workload.iterrows():
        fac = row['faculty_initials']
        subj = row['subject_clean']
        l_type = row['type']
        target_hours = int(row['hours'])
        
        class_occurrences = [
            schedule[(f, sub, typ, day, slot)]
            for (f, sub, typ, day, slot) in schedule
            if f == fac and sub == subj and typ == l_type
        ]
        model.Add(sum(class_occurrences) == target_hours)

    print("   -> Enforcing Max 2 hours per day rule for Theory subjects...")
    for d in days_list:
        for fac in unique_faculties:
            prof_theory_subjects = set(sub for (f, sub, typ, day, slot) in schedule if f == fac and typ.lower() == 'theory')
            for subj in prof_theory_subjects:
                daily_occurrences = [
                    schedule[(f, sub, typ, day, slot)]
                    for (f, sub, typ, day, slot) in schedule
                    if f == fac and sub == subj and typ.lower() == 'theory' and day == d
                ]
                model.Add(sum(daily_occurrences) <= 2)

    print("   -> Enforcing Student Clash Rule...")
    unique_years = set(SUBJECT_YEAR_MAP.values())
    for d in days_list:
        for s in slots_list:
            for year in unique_years:
                year_subjects = [subj for subj, y in SUBJECT_YEAR_MAP.items() if y == year]
                vars_for_year_at_time = [
                    schedule[(f, sub, typ, day, slot)]
                    for (f, sub, typ, day, slot) in schedule
                    if sub in year_subjects and sub not in EXCLUDE_FROM_CLASH and typ.lower() == 'theory' and day == d and slot == s
                ]
                if vars_for_year_at_time:
                    model.AddAtMostOne(vars_for_year_at_time)

    print("   -> Enforcing Strict 2-Hour blocks for Practical subjects...")
    for _, row in workload.iterrows():
        if row['type'].lower() == 'practical':
            fac = row['faculty_initials']
            subj = row['subject_clean']
            
            for d in days_list:
                x1 = schedule[(fac, subj, 'practical', d, 1)]
                x2 = schedule[(fac, subj, 'practical', d, 2)]
                x3 = schedule[(fac, subj, 'practical', d, 3)]
                x5 = schedule[(fac, subj, 'practical', d, 5)]
                x6 = schedule[(fac, subj, 'practical', d, 6)]
                x7 = schedule[(fac, subj, 'practical', d, 7)]
                x8 = schedule[(fac, subj, 'practical', d, 8)]

                b1 = model.NewBoolVar(f"start_{fac}_{subj}_d{d}_s1")
                b2 = model.NewBoolVar(f"start_{fac}_{subj}_d{d}_s2")
                b5 = model.NewBoolVar(f"start_{fac}_{subj}_d{d}_s5")
                b6 = model.NewBoolVar(f"start_{fac}_{subj}_d{d}_s6")
                b7 = model.NewBoolVar(f"start_{fac}_{subj}_d{d}_s7")

                model.Add(b1 + b2 <= 1)
                model.Add(b5 + b6 <= 1)
                model.Add(b6 + b7 <= 1)

                model.Add(x1 == b1)
                model.Add(x2 == b1 + b2)
                model.Add(x3 == b2)
                
                model.Add(x5 == b5)
                model.Add(x6 == b5 + b6)
                model.Add(x7 == b6 + b7)
                model.Add(x8 == b7)

    print("4. Handing over to AI Solver Engine...\n")
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 60.0 
    
    # THIS IS THE CRITICAL LINE THAT WAS MISSING
    status = solver.Solve(model)
    
    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        print("✅ SUCCESS! AI found a clash-free schedule.")
        
        # 1. Trigger the Excel Exporter as usual
        export_to_excel(solver, schedule, days_list, slots_list, SUBJECT_YEAR_MAP)
        
        # 2. NEW: Collect results in a list to return to the API
        final_results = []
        for (f, sub, typ, d, s) in schedule:
            if solver.Value(schedule[(f, sub, typ, d, s)]) == 1:
                final_results.append({
                    "day": d,
                    "slot": s,
                    "faculty": f.upper(),
                    "subject": sub,
                    "type": typ
                })
        
        # RETURN this list so the API (main.py) can catch it
        return final_results 
        
    elif status == cp_model.INFEASIBLE:
        print("❌ AI proven mathematically INFEASIBLE.")
        return None

if __name__ == "__main__":
    test_term = "Odd(2024-25)"  # Define it here!
    build_schedule(test_term)