export type Slot = {
  subject: string;
  faculty: string;
} | null;

export type DayData = {
  day: string;
  slots: Slot[];
};

export const TIME_SLOTS = [
  "9-10",
  "10-11",
  "11-12",
  "12-1",
  "2-3",
  "3-4",
];

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const getDefaultTimetable = (): DayData[] =>
  DAYS.map((day) => ({
    day,
    slots: TIME_SLOTS.map(() => null),
  }));