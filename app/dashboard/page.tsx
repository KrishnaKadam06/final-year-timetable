"use client";

import Navbar from "@/components/navbar";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [notices, setNotices] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("notices");
    if (saved) setNotices(JSON.parse(saved));
  }, []);

  const addNotice = () => {
    if (!input) return;

    const updated = [...notices, input];
    setNotices(updated);
    localStorage.setItem("notices", JSON.stringify(updated));
    setInput("");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-8 w-full">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">Subjects: 4</div>
          <div className="bg-white p-4 rounded shadow">Slots: 30</div>
          <div className="bg-white p-4 rounded shadow">Faculty: 4</div>
        </div>

        <div className="bg-white p-6 rounded shadow mb-6">
          <input
            className="border p-2 w-full mb-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            onClick={addNotice}
            className="bg-red-600 text-white px-4 py-2"
          >
            Add Announcement
          </button>
        </div>

        {notices.map((n, i) => (
          <div key={i} className="bg-white p-3 mb-2 rounded shadow">
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}