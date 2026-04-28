import { DAYS, TIME_SLOTS } from "./mockdata";

export function generateTimetable() {
  const subjects = [
    { name: "Math", faculty: "Dr A", hours: 4 },
    { name: "Physics", faculty: "Dr B", hours: 3 },
    { name: "CS", faculty: "Dr C", hours: 4 },
    { name: "English", faculty: "Dr D", hours: 2 },
  ];

  let pool: any[] = [];

  subjects.forEach((s) => {
    for (let i = 0; i < s.hours; i++) {
      pool.push({ subject: s.name, faculty: s.faculty });
    }
  });

  pool.sort(() => Math.random() - 0.5);

  const timetable = DAYS.map((day) => ({
    day,
    slots: TIME_SLOTS.map(() => null),
  }));

  for (let i = 0; i < DAYS.length; i++) {
    let used = new Set();

    for (let j = 0; j < TIME_SLOTS.length; j++) {
      for (let k = 0; k < pool.length; k++) {
        if (!used.has(pool[k].subject)) {
          timetable[i].slots[j] = pool[k];
          used.add(pool[k].subject);
          pool.splice(k, 1);
          break;
        }
      }
    }
  }

  return timetable;
}