"use client";

import Navbar from "@/components/navbar";
import { useState, useEffect } from "react";
import { Users, Calendar, BookOpen, Clock, Bell, Plus, Trash2, Edit2, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [notices, setNotices] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("notices");
    if (saved) setNotices(JSON.parse(saved));
  }, []);

  const saveNotices = (updated: string[]) => {
    setNotices(updated);
    localStorage.setItem("notices", JSON.stringify(updated));
  };

  const addOrUpdateNotice = () => {
    if (!input) return;

    let updated;
    if (editingIndex !== null) {
      updated = [...notices];
      updated[editingIndex] = input;
      setEditingIndex(null);
    } else {
      updated = [input, ...notices];
    }
    
    saveNotices(updated);
    setInput("");
  };

  const deleteNotice = (index: number) => {
    const updated = notices.filter((_, i) => i !== index);
    saveNotices(updated);
  };

  const startEdit = (index: number) => {
    setInput(notices[index]);
    setEditingIndex(index);
  };

  const stats = [
    { title: "Total Subjects", value: "24", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "Weekly Slots", value: "120", icon: Clock, color: "text-purple-500", bg: "bg-purple-50" },
    { title: "Active Faculty", value: "18", icon: Users, color: "text-emerald-500", bg: "bg-emerald-50" },
    { title: "Classrooms", value: "8", icon: Calendar, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex-1 ml-64 p-8 xl:p-12">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-gray-500 mt-1">Welcome back, Admin. Here is what's happening today.</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
            <Bell className="h-5 w-5 text-gray-600" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className={`p-4 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center min-h-[300px]"
          >
            <div className="text-center max-w-sm">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="h-10 w-10 text-indigo-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to generate?</h2>
              <p className="text-gray-500 mb-6 text-sm">Create a conflict-free timetable for the upcoming semester using our advanced AI generation engine.</p>
              <a href="/generate" className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-200">
                Generate Timetable
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col max-h-[500px]"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-gray-400" />
              Announcements
            </h2>

            <div className="flex gap-2 mb-6">
              <input
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder={editingIndex !== null ? "Update notice..." : "Add new notice..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addOrUpdateNotice()}
              />
              <button
                onClick={addOrUpdateNotice}
                className={`text-white p-2.5 rounded-xl transition-colors ${editingIndex !== null ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-900 hover:bg-black'}`}
              >
                {editingIndex !== null ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {notices.length === 0 ? (
                <div className="text-center text-gray-400 py-8 text-sm">
                  No announcements yet
                </div>
              ) : (
                notices.map((n, i) => (
                  <div key={i} className="group bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm text-gray-700 relative pl-4 pr-16 flex justify-between items-start hover:border-gray-200 transition-colors">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-lg" />
                    <span className="pr-2">{n}</span>
                    
                    <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => startEdit(i)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => deleteNotice(i)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}