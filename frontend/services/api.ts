export const api = {
  login: async (username: string, password: string) => {
    // TODO: Replace with real FastAPI call when ready
    // e.g. const res = await fetch("http://localhost:8000/auth/login", { ... })
    
    // MOCK:
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (username === "admin" && password === "admin") {
      return { success: true, role: "admin", token: "mock_jwt_token_123" };
    }
    return { success: false, error: "Invalid credentials" };
  },

  generateTimetable: async (params: { academicYear: string; semester: string; department: string }) => {
    // Construct term format (e.g. "Odd(2023-24)")
    const parts = params.academicYear.split('-');
    const yearShort = `${parts[0]}-${parts[1].slice(2)}`;
    const term = `${params.semester}(${yearShort})`;

    const response = await fetch(`http://127.0.0.1:8000/get-timetable/${term}`);
    const result = await response.json();

    if (result.status !== "success" || !result.data) {
      throw new Error(result.message || "Failed to generate timetable");
    }

    const flatData = result.data;

    const SUBJECT_YEAR_MAP: Record<string, string> = {
        'AM-III': 'SY', 'EICS': 'SY', 'RSA': 'SY', 'DSA': 'SY', 'EDC': 'SY',
        'MIS': 'TY', 'DCOM': 'TY', 'BEE': 'TY', 'DTSP': 'TY', 'DLD': 'TY',
        'CSL': 'LY', 'PROJECT': 'LY', 'DOCM': 'LY', 'ROBO': 'LY', 'PBL MINI': 'SY'
    };

    const dayMapping: Record<number, string> = {
      1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday'
    };

    const years = ['SY', 'TY', 'LY'];
    const processed: Record<string, any[]> = {};

    years.forEach(year => {
      const yearGrid: any[] = [];
      for (let d = 1; d <= 5; d++) {
        const slots = [];
        for (let s = 1; s <= 8; s++) {
          slots.push({ subject: "", faculty: "", room: "" });
        }
        yearGrid.push({
          day: dayMapping[d],
          slots: slots
        });
      }
      processed[year] = yearGrid;
    });

    flatData.forEach((item: any) => {
      const year = SUBJECT_YEAR_MAP[item.subject] || 'UNKNOWN';
      if (processed[year]) {
        const dayIdx = item.day - 1;
        const slotIdx = item.slot - 1;
        if (dayIdx >= 0 && dayIdx < 5 && slotIdx >= 0 && slotIdx < 8) {
          // If a slot is already occupied (like in parallel practicals/projects),
          // we might append it, but for simplicity we join them if it exists.
          const existing = processed[year][dayIdx].slots[slotIdx];
          if (existing.subject && existing.subject !== item.subject) {
            existing.subject += ` / ${item.subject}`;
            existing.faculty += ` / ${item.faculty}`;
          } else {
            processed[year][dayIdx].slots[slotIdx] = {
              subject: item.subject,
              faculty: item.faculty,
              room: item.type === "practical" ? "Lab" : "Classroom"
            };
          }
        }
      }
    });

    return processed;
  },

  validateTimetable: async (timetable: any[]) => {
    // TODO: Replace with real FastAPI call to validation AI
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // MOCK VALIDATION: Example conflict for demo
    for (let d = 0; d < timetable.length; d++) {
      for (let s = 0; s < timetable[d].slots.length; s++) {
        const slot = timetable[d].slots[s];
        if (slot.faculty === "Dr. Smith" && d === 0 && s === 0) {
          return { valid: false, message: "Conflict: Dr. Smith is double-booked." };
        }
      }
    }
    return { valid: true, message: "No conflicts detected." };
  },

  uploadData: async (category: string, parsedData: any[]) => {
    // TODO: Replace with real FastAPI call
    // fetch(`http://localhost:8000/upload/${category}`, { method: 'POST', body: JSON.stringify(parsedData) })
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, count: parsedData.length };
  }
};
