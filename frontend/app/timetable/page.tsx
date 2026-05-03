"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/navbar";
import { Download, FileDown, Edit3, CheckCircle2, AlertCircle, X, Filter } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/services/api";

export default function TimetablePage() {
  const [data, setData] = useState<Record<string, any[]>>({ SY: [], TY: [], LY: [] });
  const [selectedYear, setSelectedYear] = useState<string>("SY");
  const [editMode, setEditMode] = useState(false);
  const [editingCell, setEditingCell] = useState<{dayIndex: number, slotIndex: number} | null>(null);
  const [editForm, setEditForm] = useState({ subject: "", faculty: "", room: "" });
  const [validationResult, setValidationResult] = useState<{valid: boolean, message: string} | null>(null);

  // Filters
  const [viewMode, setViewMode] = useState<"Master" | "Faculty" | "Room">("Master");
  const [filterValue, setFilterValue] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("timetable");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setData({ SY: parsed, TY: [], LY: [] });
        } else {
          setData(parsed);
        }
      } catch(e) {}
      setValidationResult({ valid: true, message: "No conflicts detected." });
    }
  }, []);

  // Compute unique lists for dropdowns
  const uniqueFaculties = useMemo(() => {
    const set = new Set<string>();
    Object.values(data).forEach(yearData => {
      yearData.forEach((d: any) => d.slots.forEach((s: any) => { if(s.faculty) set.add(s.faculty) }));
    });
    return Array.from(set).sort();
  }, [data]);

  const uniqueRooms = useMemo(() => {
    const set = new Set<string>();
    Object.values(data).forEach(yearData => {
      yearData.forEach((d: any) => d.slots.forEach((s: any) => { if(s.room) set.add(s.room) }));
    });
    return Array.from(set).sort();
  }, [data]);

  const saveToStorage = async (newData: Record<string, any[]>) => {
    setData(newData);
    localStorage.setItem("timetable", JSON.stringify(newData));
    
    // Call the validation API
    const res = await api.validateTimetable(newData[selectedYear] || []);
    setValidationResult(res);
  };

  const handleCellClick = (dayIndex: number, slotIndex: number, slotData: any) => {
    if (!editMode) return;
    setEditingCell({ dayIndex, slotIndex });
    setEditForm({ 
      subject: slotData.subject, 
      faculty: slotData.faculty, 
      room: slotData.room 
    });
  };

  const handleSaveEdit = () => {
    if (!editingCell) return;
    const newData = { ...data };
    const yearData = [...(newData[selectedYear] || [])];
    if (yearData.length > 0) {
      yearData[editingCell.dayIndex].slots[editingCell.slotIndex] = { ...editForm };
      newData[selectedYear] = yearData;
      saveToStorage(newData);
    }
    setEditingCell(null);
  };

  const exportCSV = () => {
    let csv = "Year,Day,Slot 1,Slot 2,Slot 3,Slot 4,Slot 5,Slot 6,Slot 7,Slot 8\n";
    Object.entries(data).forEach(([year, yearData]) => {
      yearData.forEach((row: any) => {
        const rowData = row.slots.map((s: any) => s.subject ? `"${s.subject} (${s.faculty}) - ${s.room}"` : "Free");
        csv += `${year},${row.day},${rowData.join(",")}\n`;
      });
    });
    const blob = new Blob([csv]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "timetable.csv";
    a.click();
  };

  const exportPDF = async () => {
    const element = document.getElementById("tt-export");
    if (!element) return;
    
    // Briefly unhide header for PDF
    const header = document.getElementById("pdf-header");
    if (header) header.style.display = "block";

    const canvas = await html2canvas(element, { scale: 2 });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4");
    
    // A4 Landscape is 297 x 210 mm
    pdf.addImage(img, "PNG", 10, 10, 277, 0);
    
    let filename = "timetable.pdf";
    if (viewMode !== "Master" && filterValue) {
      filename = `timetable_${filterValue.replace(/\s+/g, '_')}.pdf`;
    }
    
    pdf.save(filename);

    if (header) header.style.display = "none";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex-1 ml-64 p-8 xl:p-12 relative">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Master Timetable</h1>
            <p className="text-gray-500 mt-1">Review, edit, filter, and export the schedule.</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setEditMode(!editMode)} 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${editMode ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
            >
              <Edit3 className="h-4 w-4" />
              {editMode ? "Exit Edit Mode" : "Enable Editing"}
            </button>
            <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors">
              <FileDown className="h-4 w-4" />
              CSV
            </button>
            <button onClick={exportPDF} className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl font-medium shadow-lg shadow-gray-900/20 transition-colors">
              <Download className="h-4 w-4" />
              Export PDF
            </button>
          </div>
        </header>

        {validationResult && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${validationResult.valid ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}`}
          >
            {validationResult.valid ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />}
            <span className="font-medium text-sm">{validationResult.message}</span>
          </motion.div>
        )}

        <div className="bg-white p-4 rounded-t-2xl border border-b-0 border-gray-200 flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600 font-medium">
            <Filter className="h-4 w-4" />
            Filter View:
          </div>
          <select 
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            value={viewMode}
            onChange={(e) => {
              setViewMode(e.target.value as any);
              setFilterValue(""); // reset filter
            }}
          >
            <option value="Master">Master Timetable</option>
            <option value="Faculty">By Faculty</option>
            <option value="Room">By Room</option>
          </select>

          {viewMode === "Faculty" && (
            <select 
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            >
              <option value="">-- Select Faculty --</option>
              {uniqueFaculties.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          )}

          {viewMode === "Room" && (
            <select 
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            >
              <option value="">-- Select Room --</option>
              {uniqueRooms.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          )}
        </div>

        <div className="flex gap-2 mt-6">
          {["SY", "TY", "LY"].map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-6 py-3 rounded-t-xl font-semibold transition-all ${
                selectedYear === year 
                  ? 'bg-white text-indigo-600 border-t border-l border-r border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] relative z-10 -mb-[1px]' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border-b border-gray-200'
              }`}
            >
              {year} Timetable
            </button>
          ))}
          <div className="flex-1 border-b border-gray-200"></div>
        </div>

        <div className="bg-white rounded-b-2xl rounded-tr-2xl shadow-sm border border-gray-200 overflow-x-auto relative z-0">
          <div id="tt-export" className="p-6 min-w-[1200px] bg-white">
            <div className="text-center mb-6 hidden" id="pdf-header">
               <h2 className="text-2xl font-bold uppercase tracking-widest text-gray-900">
                 {viewMode === "Master" ? `${selectedYear} College Timetable` : `${selectedYear} Filtered Timetable`}
               </h2>
               <p className="text-gray-500 mt-1">Computer Engineering - Even Semester</p>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 border-gray-200 p-4 text-left font-semibold text-gray-500 bg-gray-50/50 w-32">Day</th>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <th key={i} className="border-b-2 border-gray-200 p-4 text-center font-semibold text-gray-500 bg-gray-50/50">Slot {i}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data[selectedYear] || []).map((row: any, dayIdx: number) => (
                  <tr key={dayIdx} className="group">
                    <td className="border-b border-gray-100 p-4 font-medium text-gray-900 bg-gray-50/30">
                      {row.day}
                    </td>
                    {row.slots.map((slot: any, slotIdx: number) => {
                      const isEditing = editMode;
                      const hasContent = !!slot.subject && slot.subject !== "Break" && slot.subject !== "Free";
                      const isSpecial = slot.subject === "Break" || slot.subject === "Free";

                      // Determine if this cell matches the current filter
                      let isFilteredOut = false;
                      if (viewMode === "Faculty" && filterValue && slot.faculty !== filterValue) isFilteredOut = true;
                      if (viewMode === "Room" && filterValue && slot.room !== filterValue) isFilteredOut = true;
                      
                      // Breaks and Free slots are never filtered out
                      if (isSpecial) isFilteredOut = false;

                      return (
                        <td 
                          key={slotIdx} 
                          onClick={() => handleCellClick(dayIdx, slotIdx, slot)}
                          className={`border-b border-l border-gray-100 p-3 align-top transition-colors ${
                            isEditing && !isSpecial ? 'cursor-pointer hover:bg-indigo-50/50 ring-inset hover:ring-2 hover:ring-indigo-300' : ''
                          } ${isSpecial ? 'bg-gray-50/50 text-center align-middle' : ''} ${isFilteredOut && hasContent ? 'opacity-20 grayscale bg-gray-50/50' : ''}`}
                        >
                          {isSpecial ? (
                            <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">{slot.subject}</span>
                          ) : hasContent ? (
                            <div className="flex flex-col h-full gap-1">
                              <span className="font-bold text-gray-900 text-sm">{slot.subject}</span>
                              <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-md self-start">{slot.faculty}</span>
                              <span className="text-xs text-gray-500 mt-auto">{slot.room}</span>
                            </div>
                          ) : (
                            <span className="text-gray-300 text-sm italic">Empty</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal Overlay */}
        <AnimatePresence>
          {editingCell && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-gray-100"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Edit Time Slot</h3>
                  <button onClick={() => setEditingCell(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input 
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                      value={editForm.subject}
                      onChange={e => setEditForm({...editForm, subject: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
                    <input 
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                      value={editForm.faculty}
                      onChange={e => setEditForm({...editForm, faculty: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room / Lab</label>
                    <input 
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                      value={editForm.room}
                      onChange={e => setEditForm({...editForm, room: e.target.value})}
                    />
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button onClick={() => setEditingCell(null)} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleSaveEdit} className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium shadow-md shadow-indigo-200 transition-colors">
                    Save Changes
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}