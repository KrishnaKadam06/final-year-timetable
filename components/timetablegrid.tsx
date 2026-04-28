"use client";

import { useEffect, useState } from "react";
import { TIME_SLOTS, DayData, getDefaultTimetable } from "@/lib/mockdata";

export default function TimetableGrid() {
  const [data, setData] = useState<DayData[]>([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("timetable");

    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        setData(getDefaultTimetable());
      }
    } else {
      setData(getDefaultTimetable());
    }
  }, []);

  const handleSave = () => {
    const newData = [...data];

    newData[selected.row].slots[selected.col] = {
      subject: selected.subject,
      faculty: selected.faculty,
    };

    setData(newData);
    localStorage.setItem("timetable", JSON.stringify(newData));
    setSelected(null);
  };

  return (
    <div className="overflow-auto">
      <table className="w-full border text-center">
        <thead className="bg-red-600 text-white">
          <tr>
            <th className="border p-2">Day</th>
            {TIME_SLOTS.map((t) => (
              <th key={t} className="border p-2">{t}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr key={row.day}>
              <td className="border p-2 font-bold">{row.day}</td>

              {row.slots.map((slot, j) => (
                <td
                  key={j}
                  className="border p-2 cursor-pointer hover:bg-red-100"
                  onClick={() =>
                    setSelected({
                      row: i,
                      col: j,
                      subject: slot?.subject || "",
                      faculty: slot?.faculty || "",
                    })
                  }
                >
                  {slot ? `${slot.subject} (${slot.faculty})` : "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-80">
            <input
              className="border p-2 w-full mb-2"
              value={selected.subject}
              onChange={(e) =>
                setSelected({ ...selected, subject: e.target.value })
              }
              placeholder="Subject"
            />

            <input
              className="border p-2 w-full mb-2"
              value={selected.faculty}
              onChange={(e) =>
                setSelected({ ...selected, faculty: e.target.value })
              }
              placeholder="Faculty"
            />

            <button
              onClick={handleSave}
              className="bg-red-600 text-white px-4 py-2 w-full"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}