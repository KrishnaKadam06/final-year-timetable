"use client";

import { SUBJECTS, FACULTY } from "@/lib/mockdata";

export default function EditModal({ cell, onClose, onSave }: any) {
const handleSave = () => {
if (!cell.subject || !cell.faculty) {
alert("Fill all fields");
return;
}


if (cell.faculty === "Dr. Sharma" && cell.subject === "ML") {
  alert("⚠ Conflict detected");
  return;
}

onSave(cell);
onClose();


};

return ( <div className="fixed inset-0 bg-black/50 flex items-center justify-center"> <div className="bg-white rounded-xl shadow-xl p-6 w-80">


    <h2 className="text-lg font-semibold mb-4 text-gray-800">
      Edit Slot
    </h2>

    {/* SUBJECT */}
    <label className="text-sm text-gray-600">Subject</label>
    <select
      className="border border-gray-300 p-2 w-full rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={cell.subject}
      onChange={(e) => (cell.subject = e.target.value)}
    >
      <option value="">Select Subject</option>
      {SUBJECTS.map((s) => (
        <option key={s}>{s}</option>
      ))}
    </select>

    {/* FACULTY */}
    <label className="text-sm text-gray-600">Faculty</label>
    <select
      className="border border-gray-300 p-2 w-full rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={cell.faculty}
      onChange={(e) => (cell.faculty = e.target.value)}
    >
      <option value="">Select Faculty</option>
      {FACULTY.map((f) => (
        <option key={f}>{f}</option>
      ))}
    </select>

    {/* BUTTONS */}
    <div className="flex justify-end gap-3">
      <button
        onClick={onClose}
        className="px-3 py-1 text-gray-600 hover:text-black"
      >
        Cancel
      </button>

      <button
        onClick={handleSave}
        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 rounded-md"
      >
        Save
      </button>
    </div>
  </div>
</div>

);
}
