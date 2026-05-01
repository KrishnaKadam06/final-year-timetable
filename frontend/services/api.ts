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
    // TODO: Replace with real FastAPI call
    // e.g. return await fetch("http://localhost:8000/timetable/generate", { ... })

    // MOCK AI Delay
    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    return [
      {
        day: "Monday",
        slots: [
          { subject: "Machine Learning", faculty: "Dr. Smith", room: "Room 101" },
          { subject: "Data Structures", faculty: "Prof. Alan", room: "Lab 2" },
          { subject: "Break", faculty: "", room: "" },
          { subject: "Operating Systems", faculty: "Dr. Lin", room: "Room 102" },
          { subject: "Computer Networks", faculty: "Prof. Sarah", room: "Room 103" },
          { subject: "Free", faculty: "", room: "" },
        ]
      },
      {
        day: "Tuesday",
        slots: [
          { subject: "Database Systems", faculty: "Dr. E. Codd", room: "Room 201" },
          { subject: "Web Dev", faculty: "Prof. Tim", room: "Lab 1" },
          { subject: "Break", faculty: "", room: "" },
          { subject: "Machine Learning", faculty: "Dr. Smith", room: "Room 101" },
          { subject: "Operating Systems", faculty: "Dr. Lin", room: "Room 102" },
          { subject: "Free", faculty: "", room: "" },
        ]
      },
      {
        day: "Wednesday",
        slots: [
          { subject: "Computer Networks", faculty: "Prof. Sarah", room: "Room 103" },
          { subject: "Data Structures", faculty: "Prof. Alan", room: "Lab 2" },
          { subject: "Break", faculty: "", room: "" },
          { subject: "Web Dev", faculty: "Prof. Tim", room: "Lab 1" },
          { subject: "Database Systems", faculty: "Dr. E. Codd", room: "Room 201" },
          { subject: "Free", faculty: "", room: "" },
        ]
      },
      {
        day: "Thursday",
        slots: [
          { subject: "Operating Systems", faculty: "Dr. Lin", room: "Room 102" },
          { subject: "Machine Learning", faculty: "Dr. Smith", room: "Room 101" },
          { subject: "Break", faculty: "", room: "" },
          { subject: "Computer Networks", faculty: "Prof. Sarah", room: "Room 103" },
          { subject: "Data Structures", faculty: "Prof. Alan", room: "Lab 2" },
          { subject: "Free", faculty: "", room: "" },
        ]
      },
      {
        day: "Friday",
        slots: [
          { subject: "Web Dev", faculty: "Prof. Tim", room: "Lab 1" },
          { subject: "Database Systems", faculty: "Dr. E. Codd", room: "Room 201" },
          { subject: "Break", faculty: "", room: "" },
          { subject: "Mini Project", faculty: "Dr. Smith", room: "Lab 3" },
          { subject: "Mini Project", faculty: "Dr. Smith", room: "Lab 3" },
          { subject: "Free", faculty: "", room: "" },
        ]
      }
    ];
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
