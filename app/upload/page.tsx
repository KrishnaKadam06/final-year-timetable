"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import Navbar from "@/components/navbar";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [data, setData] = useState<string[][]>([]);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") router.push("/timetable");
  }, []);

  const handleFile = (e: any) => {
    const file = e.target.files[0];

    Papa.parse(file, {
      complete: (res) => {
        setData(res.data as string[][]);
      },
    });
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Navbar />

      <div className="flex-1 p-8">
        <h1 className="text-2xl mb-4">Upload CSV</h1>

        <input type="file" onChange={handleFile} />

        {data.length > 0 && (
          <div className="overflow-auto mt-6 border">
            <table className="border w-full text-sm">
              <tbody>
                {data.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className="border p-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}