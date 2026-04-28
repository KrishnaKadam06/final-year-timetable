"use client";

export default function Navbar() {
  return (
    <div className="w-52 bg-red-600 text-white p-5 min-h-screen">
      <h2 className="text-lg font-bold mb-6">STMS</h2>

      <a href="/dashboard" className="block mb-3">Dashboard</a>
      <a href="/timetable" className="block mb-3">Timetable</a>
      <a href="/generate" className="block mb-3">AI Generate</a>
    </div>
  );
}