"use client";

import Navbar from "@/components/navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, BrainCircuit, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { api } from "@/services/api";

export default function GeneratePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    academicYear: "2023-2024",
    semester: "Odd",
    department: "Computer Engineering",
  });

  const generate = async () => {
    setLoading(true);
    try {
      const result = await api.generateTimetable(formData);
      localStorage.setItem("timetable", JSON.stringify(result));
      setLoading(false);
      router.push("/timetable");
    } catch (error: any) {
      alert(error.message || "Failed to generate timetable. The AI found the constraints to be mathematically infeasible.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex-1 ml-64 p-8 xl:p-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-indigo-500" />
            AI Generator
          </h1>
          <p className="text-gray-500 mt-1">Configure parameters and let the AI resolve constraints.</p>
        </header>

        <div className="max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4">
                <BrainCircuit className="h-48 w-48" />
              </div>
              <h2 className="text-2xl font-bold mb-2 relative z-10">Timetable Constraints Engine</h2>
              <p className="text-indigo-100 relative z-10">The engine automatically balances faculty load, prevents room clashes, and optimizes slot placement.</p>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                  <select 
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.academicYear}
                    onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                  >
                    <option>2023-2024</option>
                    <option>2024-2025</option>
                    <option>2025-2026</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                  <select 
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.semester}
                    onChange={(e) => setFormData({...formData, semester: e.target.value})}
                  >
                    <option>Odd</option>
                    <option>Even</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select 
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                  >
                    <option>Computer Engineering</option>
                    <option>Information Technology</option>
                    <option>Electronics & Telecommunication</option>
                    <option>Mechanical Engineering</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={generate}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Resolving Constraints...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate Timetable
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}