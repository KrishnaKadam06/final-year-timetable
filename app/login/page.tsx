"use client";

import { useState } from "react";

export default function LoginPage() {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // 🟢 STUDENT / TEACHER (NO LOGIN REQUIRED)
    if (role === "user") {
      localStorage.setItem("role", "user");
      window.location.href = "/timetable";
      return;
    }

    // 🔴 ADMIN LOGIN
    if (role === "admin") {
      if (username === "admin" && password === "admin123") {
        localStorage.setItem("role", "admin");
        window.location.href = "/dashboard";
      } else {
        alert("Invalid admin credentials");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="p-8 border rounded shadow w-80">
        <h1 className="text-xl font-bold mb-4 text-center text-black">
          STMS Login
        </h1>

        {/* ROLE DROPDOWN */}
        <select
          className="w-full border p-2 mb-4 text-black"
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select User Type</option>
          <option value="admin">Admin</option>
          <option value="user">Student / Teacher</option>
        </select>

        {/* ADMIN INPUTS */}
        {role === "admin" && (
          <>
            <input
              className="border p-2 w-full mb-3"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              className="border p-2 w-full mb-3"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-red-600 text-white py-2 rounded"
        >
          Continue
        </button>

        {role === "admin" && (
          <p className="text-xs mt-3 text-gray-600 text-center">
            Admin Login → admin / admin123
          </p>
        )}
      </div>
    </div>
  );
}