"use client";

import { useState, useRef } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import Navbar from "@/components/navbar";
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/services/api";

export default function UploadPage() {
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [category, setCategory] = useState("Faculty Data");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    "Faculty Data",
    "Subject Data",
    "Classroom Data",
    "Class Group Data",
    "Time Slot Data"
  ];

  const processFile = async (file: File) => {
    setStatus(null);
    setData([]);

    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => {
          if (res.data.length > 0) {
            setHeaders(Object.keys(res.data[0] as object));
            setData(res.data);
            setStatus({ type: 'success', message: `Parsed ${res.data.length} records.` });
          } else {
            setStatus({ type: 'error', message: 'The uploaded CSV file is empty.' });
          }
        },
        error: () => {
          setStatus({ type: 'error', message: 'Failed to parse the CSV file.' });
        }
      });
    } else if (file.name.endsWith('.xlsx')) {
      try {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (json.length > 0) {
          setHeaders(Object.keys(json[0]));
          setData(json);
          setStatus({ type: 'success', message: `Parsed ${json.length} records from Excel.` });
        } else {
          setStatus({ type: 'error', message: 'The uploaded Excel file is empty.' });
        }
      } catch (err) {
        setStatus({ type: 'error', message: 'Failed to parse the Excel file.' });
      }
    } else {
      setStatus({ type: 'error', message: 'Unsupported file type. Please upload CSV or XLSX.' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = ''; // Reset input
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleImport = async () => {
    setUploading(true);
    const res = await api.uploadData(category, data);
    setUploading(false);

    if (res.success) {
      setStatus({ type: 'success', message: `${category} imported to database successfully!` });
      setTimeout(() => {
        setData([]);
        setStatus(null);
      }, 3000);
    } else {
      setStatus({ type: 'error', message: 'Failed to upload to the server.' });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex-1 ml-64 p-8 xl:p-12">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <UploadCloud className="h-8 w-8 text-indigo-500" />
              Data Import
            </h1>
            <p className="text-gray-500 mt-1">Upload files to update the timetable generation database.</p>
          </div>

          <div className="w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Upload Category</label>
            <select 
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setData([]);
                setStatus(null);
              }}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </header>

        <div className="max-w-4xl">
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
              isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-gray-50'
            }`}
          >
            <input 
              type="file" 
              accept=".csv, .xlsx" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
            />
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileSpreadsheet className="h-10 w-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Drag & Drop your {category} file here</h3>
            <p className="text-gray-500 mb-6">Supports .csv and .xlsx formats</p>
            <span className="inline-flex items-center justify-center px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-black transition-colors">
              Browse Files
            </span>
          </div>

          {status && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-xl flex items-center gap-3 border ${
                status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'
              }`}
            >
              {status.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />}
              <span className="font-medium text-sm">{status.message}</span>
            </motion.div>
          )}

          {data.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-900">Data Preview: {category}</h3>
                <button 
                  onClick={handleImport}
                  disabled={uploading}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Confirm & Import
                </button>
              </div>
              <div className="overflow-x-auto max-h-[400px]">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0">
                    <tr>
                      {headers.map((h, i) => (
                        <th key={i} className="px-6 py-3 font-semibold whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.slice(0, 10).map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50/50">
                        {headers.map((h, j) => (
                          <td key={j} className="px-6 py-3 font-medium text-gray-700 whitespace-nowrap">{row[h]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.length > 10 && (
                <div className="p-3 text-center text-xs text-gray-500 bg-gray-50/50 border-t border-gray-100">
                  Showing 10 of {data.length} rows
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}