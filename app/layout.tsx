"use client";

import "./globals.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }: any) {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!role) router.push("/login");
  }, []);

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}