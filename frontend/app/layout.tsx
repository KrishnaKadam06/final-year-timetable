"use client";

import "./globals.css";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!role && pathname !== "/login") {
      router.push("/login");
    }
  }, [pathname, router]);

  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}