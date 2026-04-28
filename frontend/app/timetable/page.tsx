"use client";

import Navbar from "@/components/navbar";
import TimetableGrid from "@/components/timetablegrid";
import { TIME_SLOTS } from "@/lib/mockdata";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function TimetablePage() {
  const exportCSV = () => {
    const data = JSON.parse(localStorage.getItem("timetable") || "[]");

    let csv = "Day," + TIME_SLOTS.join(",") + "\n";

    data.forEach((row: any) => {
      const rowData = row.slots.map((s: any) =>
        s ? `${s.subject} (${s.faculty})` : ""
      );
      csv += `${row.day},${rowData.join(",")}\n`;
    });

    const blob = new Blob([csv]);
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "timetable.csv";
    a.click();
  };

  const exportPDF = async () => {
    const element = document.getElementById("tt");
    if (!element) return;

    const canvas = await html2canvas(element);
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(img, "PNG", 10, 10, 180, 0);
    pdf.save("timetable.pdf");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Timetable</h1>

        <div className="flex gap-3 mb-4">
          <button onClick={exportCSV} className="bg-red-600 text-white px-4 py-2 rounded">
            Export CSV
          </button>

          <button onClick={exportPDF} className="bg-black text-white px-4 py-2 rounded">
            Export PDF
          </button>
        </div>

        <div id="tt" className="bg-white p-4 rounded shadow">
          <TimetableGrid />
        </div>
      </div>
    </div>
  );
}