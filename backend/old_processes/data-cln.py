import pandas as pd
import os
import re
import sys
import numpy as np

sys.stdout.reconfigure(encoding='utf-8')

master_faculty_dict = {
    "jk": "Dr. Jayashree V. Khanapuri", "na": "Dr. Namrata Ansari",
    "kr": "Dr. Kiran R. Rathod", "ph": "Dr. Priya T. Hankare",
    "sd": "Dr. Sandhya S. Deshpande", "sk": "Dr. Sandhya D. Kadam",
    "pk": "Dr. Pradnya V. Kamble", "prh": "Ms. Pranali P. Hatode",
    "ap": "Dr. Anita Padhye", "dt": "Dr. Dhanashree Toradmalle",
    "pv": "Dr. Payal Varngaonkar", "vd": "Dr. Vrushali Deole",
    "ha": "Mr. Harshawardhan P. Ahire", "mj": "Mr. Martand S. Jha",
    "pd": "Mr. Pankaj Deshmukh", "pu": "Mr. Prashant B. Upadhyay",
    "svm": "Mr. Sagar V. Mhatre", "sm": "Mr. Sandeep S. Mishra",
    "sp": "Mr. Sunil D. Patil", "ak": "Mr. Amit T. Kukreja",
    "dd": "Mr. Datta Deshmukh", "ds": "Mr. Divesh Singh",
    "td": "Ms. Tilottama P. Dhake", "vc": "Ms. Vricha S. Chavan",
    "ra": "Ms. Rashmi R. Adatkar", "rk": "Ms. Rupali S. Kadu",
    "rs": "Ms. Rupali V. Satpute", "ss": "Ms. Swati H. Shinde",
    "ar": "Mrs. Anuprita Rane", "dnd": "Mrs. Dnyada Dafale",
    "ep": "Mrs. Ekta Pandit", "mp": "Mrs. Meghana Patil",
    "pg": "Mrs. Priya Gupta", "rr": "Mrs. Reshma Rasal",
    "vs": "Mrs. Vandana Salve", "pp": "Ms. Prahelika Pai",
    "rak": "Ms. Archan Kshirsagar"
}

tt_folder = "EXTC_TT"
workload_folder = "WORKLOAD_DATA"

# --- 1. TIMETABLE EXTRACTION ---
all_dfs = []
if os.path.exists(tt_folder):
    for root, dirs, files in os.walk(tt_folder):
        for file in files:
            if file.lower().endswith(".xlsx") or file.lower().endswith(".xls"):
                file_path = os.path.join(root, file)
                term_name = os.path.basename(root) 
                try:
                    df = pd.read_excel(file_path, header=None)
                    header_idx = None
                    for i in range(min(20, len(df))): 
                        row_vals = df.iloc[i].values
                        row_str = " ".join([str(x).lower() for x in row_vals])
                        if len(re.findall(r"\d{1,2}:\d{2}", row_str)) >= 3:
                            header_idx = i
                            break
                    if header_idx is not None:
                        raw_cols = df.iloc[header_idx].astype(str).str.strip().str.lower()
                        new_cols = []
                        seen = {}
                        for c in raw_cols:
                            if c in seen:
                                seen[c] += 1
                                new_cols.append(f"{c}_{seen[c]}")
                            else:
                                seen[c] = 0
                                new_cols.append(c)
                        df.columns = new_cols
                        df = df[(header_idx + 1):].reset_index(drop=True)
                        df['term'] = term_name 
                        df['source_file'] = file
                        all_dfs.append(df)
                except Exception:
                    pass

if all_dfs:
    combined = pd.concat(all_dfs, ignore_index=True)
    day_col_name = combined.columns[0] 
    combined = combined.rename(columns={day_col_name: 'day'})

    time_pattern = re.compile(r"\d{1,2}:\d{2}")
    time_cols = [col for col in combined.columns if time_pattern.search(str(col))]
    cols_to_keep = ['day', 'term'] + time_cols
    timetable_df = combined[cols_to_keep].copy()

    timetable_df['day'] = timetable_df['day'].ffill()
    timetable_df['day_clean'] = timetable_df['day'].astype(str).str.lower().str.strip()
    valid_days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'mon', 'tue', 'wed', 'thu', 'fri']
    timetable_df = timetable_df[timetable_df['day_clean'].isin(valid_days)].drop(columns=['day_clean'])

    timetable_df = timetable_df.dropna(subset=time_cols, how='all')
    timetable_long = timetable_df.melt(id_vars=["day", "term"], value_vars=time_cols, var_name="time", value_name="cell").dropna(subset=["cell"])
    timetable_long["cell"] = timetable_long["cell"].astype(str).str.lower()
    timetable_long = timetable_long.assign(cell=timetable_long["cell"].str.split("\n")).explode("cell")

    def clean_text(text):
        text = str(text).lower().strip()
        if "wef" in text or "date:" in text or "w.e.f" in text: return "invalid_noise"
        text = re.sub(r"\s+", " ", text)       
        text = re.sub(r"\s*/\s*", "/", text)   
        text = re.sub(r"\b([stl]y)\s+([a-c]\d?)", r"\1\2", text) 
        return text

    timetable_long["cell"] = timetable_long["cell"].apply(clean_text)
    timetable_long = timetable_long[timetable_long["cell"] != "invalid_noise"]
    timetable_long = timetable_long[(timetable_long["cell"].str.len() > 3) & (timetable_long["cell"].str.contains("/"))]

    def parse_cell(cell):
        res = {'batch': None, 'subject': None, 'faculty_initial': None, 'room': None, 'type': 'lecture'}
        try:
            if 'lab' in cell: res['type'] = 'lab'
            elif 'tut' in cell: res['type'] = 'tutorial'
            room_match = re.search(r'(lab-?\d+[a-z]*|cr-?\d+[a-z]*|room-?\d+|mbb\d|seminarhall|tp)', cell)
            if room_match:
                res['room'] = room_match.group(1)
                cell = cell.replace(res['room'], '').strip('/')
            cell = re.sub(r'\(.*?\)', '', cell)
            parts = [p.strip() for p in cell.split('/') if p.strip()]
            if not parts: return None
            batch_regex = re.compile(r'^(sy|ty|ly)[a-d]?\d?$')
            leftovers = []
            for p in parts:
                if "202" in p: continue
                if batch_regex.match(p) and not res['batch']: res['batch'] = p
                else: leftovers.append(p)
            if len(leftovers) >= 1: res['subject'] = leftovers[0]
            if len(leftovers) >= 2: res['faculty_initial'] = leftovers[1].replace(" ", "")
            return res
        except Exception: return None

    parsed_rows = []
    for _, row in timetable_long.iterrows():
        parsed = parse_cell(row["cell"])
        if parsed and parsed.get("subject"): 
            parsed["time"] = row["time"]
            parsed["day"] = row["day"]
            parsed["term"] = row["term"]
            init = parsed.get("faculty_initial")
            parsed["faculty_name"] = master_faculty_dict.get(init, "Unknown")
            parsed_rows.append(parsed)

    parsed_df = pd.DataFrame(parsed_rows).drop_duplicates().sort_values(by=["term", "day", "time", "batch", "subject"])
    os.makedirs("output_db", exist_ok=True)
    parsed_df.to_csv("output_db/flat_timetable.csv", index=False)
    faculty = parsed_df[['faculty_initial', 'faculty_name']].drop_duplicates().dropna().reset_index(drop=True)
    faculty['faculty_id'] = faculty.index + 1
    faculty.to_csv("output_db/dim_faculty.csv", index=False)

# --- 2. WORKLOAD EXTRACTION ---
if os.path.exists(workload_folder):
    subject_bridge = {
        "Image Processing and Machine Vision": "ipmv", "IOT & Cloud Computing [AIDS]": "iot",
        "Management Information System": "mis", "Artificial Intelligence": "ai",
        "Database Management System": "dbms", "Web Design": "wd",
        "Natural Language Processing": "nlp", "Cyber Security and Law": "csl",
        "Fundamentals of Data Science": "fds", "Optical Communication Networks": "ocn",
        "Artificial Inteligence and Machine Learning": "aiml",
        "Cyber Security & Laws         [EXTC & IT]": "csl",
        "Community Engagement PBL Laboratory- Mini Project-II (Raspberry Pi based Projects)": "pbl-ii"
    }
    safe_subject_bridge = {k.lower().strip(): v for k, v in subject_bridge.items()}
    all_workloads = []

    for root, dirs, files in os.walk(workload_folder):
        for file in files:
            if file.lower().endswith(".xlsx") or file.lower().endswith(".xls") or file.lower().endswith(".csv"):
                file_path = os.path.join(root, file)
                term_name = "Unknown"
                if "Even(2023-24)" in file: term_name = "Even(2023-24)"
                elif "Even(2024-25)" in file: term_name = "Even(2024-25)"
                elif "Even(2025-26)" in file: term_name = "Even(2025-26)"
                elif "Odd(2023-24)" in file: term_name = "Odd(2023-24)"
                elif "Odd(2024-25)" in file: term_name = "Odd(2024-25)"
                elif "Odd(2025-26)" in file: term_name = "Odd(2025-26)"

                try:
                    if file.lower().endswith(".csv"): df = pd.read_csv(file_path, header=None)
                    else: df = pd.read_excel(file_path, header=None)

                    header_idx = None
                    for i in range(min(15, len(df))):
                        row_vals = df.iloc[i].values
                        row_str = " ".join([str(x).lower() for x in row_vals])
                        if "faculty" in row_str and "theory" in row_str:
                            header_idx = i
                            break
                    
                    if header_idx is not None:
                        raw_cols = [str(c).lower().strip().replace('\n', ' ') for c in df.iloc[header_idx].values]
                        new_cols = []
                        seen = {}
                        for c in raw_cols:
                            if c in seen:
                                seen[c] += 1
                                new_cols.append(f"{c}_{seen[c]}")
                            else:
                                seen[c] = 0
                                new_cols.append(c)
                        df.columns = new_cols
                        df = df[(header_idx + 1):].reset_index(drop=True)
                        df['term'] = term_name

                        fac_col = None; theo_subj = None; theo_hrs = None; prac_subj = None; prac_hrs = None
                        for c in df.columns:
                            if not fac_col and "faculty" in c: fac_col = c
                            if not theo_subj and "theory" in c and "subject" in c: theo_subj = c
                            if not theo_hrs and "theory" in c and ("hrs" in c or "hours" in c): theo_hrs = c
                            if not prac_subj and "practical" in c and "subject" in c: prac_subj = c
                            if not prac_hrs and "practical" in c and ("hrs" in c or "batches" in c): prac_hrs = c

                        if fac_col:
                            fac_series = df[fac_col].astype(str).str.strip()
                            fac_series = fac_series.replace({'nan': np.nan, 'None': np.nan, '': np.nan, 'none': np.nan})
                            df['faculty_name'] = fac_series.ffill()

                            if theo_subj and theo_hrs:
                                theory = pd.DataFrame({'term': df['term'], 'faculty_name': df['faculty_name'], 'subject': df[theo_subj], 'hours': df[theo_hrs], 'type': 'theory'})
                                all_workloads.append(theory)
                            if prac_subj and prac_hrs:
                                practical = pd.DataFrame({'term': df['term'], 'faculty_name': df['faculty_name'], 'subject': df[prac_subj], 'hours': df[prac_hrs], 'type': 'practical'})
                                all_workloads.append(practical)
                except Exception:
                    pass

    if all_workloads:
        workload_df = pd.concat(all_workloads, ignore_index=True).dropna(subset=['subject'])
        workload_df = workload_df[workload_df['subject'].astype(str) != 'nan']
        workload_df['hours'] = pd.to_numeric(workload_df['hours'], errors='coerce').fillna(0)
        workload_df = workload_df[workload_df['hours'] > 0]
        workload_df['subject'] = workload_df['subject'].astype(str).str.strip()
        workload_df['subject_clean'] = workload_df['subject'].str.lower().map(safe_subject_bridge).fillna(workload_df['subject']).str.upper()

        def get_initials(name):
            clean_name = str(name).lower().replace(" ", "")
            for init, full in master_faculty_dict.items():
                clean_full = full.lower().replace(" ", "")
                if clean_full in clean_name or clean_name in clean_full: return init
            return "Unknown"

        workload_df['faculty_initials'] = workload_df['faculty_name'].apply(get_initials)
        final_workload = workload_df[['term', 'faculty_initials', 'faculty_name', 'subject_clean', 'type', 'hours']]
        final_workload = final_workload.sort_values(by=['faculty_name', 'term', 'type', 'subject_clean'])
        final_workload.to_csv("output_db/fact_workload.csv", index= False)

print("\nDATA ENGINEERING PIPELINE COMPLETE.")