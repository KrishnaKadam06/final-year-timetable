"use client";
import { updateTimetable } from "@/lib/mockdata";
import { useState } from "react";

export default function FileUpload({ onUpload }: any) {
const [message, setMessage] = useState("");

const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
const file = e.target.files?.[0];
if (!file) return;

if (!file.name.endsWith(".csv")) {
  setMessage("❌ Only CSV files allowed");
  return;
}

if (file.name.includes("bad")) {
  setMessage("❌ File contains errors");
} else {
  setMessage("✅ File uploaded successfully");

  // send file to parent
  onUpload(file.name);
}


};

return ( <div className="bg-white p-4 rounded-xl shadow border"> <input type="file" onChange={handleFile} />

```
  {message && (
    <p className="mt-2 text-sm font-medium text-black">{message}</p>
  )}
</div>


);
}
