"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, CalendarDays, Sparkles, UploadCloud, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("role");
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Generate", href: "/generate", icon: Sparkles },
    { name: "Timetable", href: "/timetable", icon: CalendarDays },
    { name: "Upload Data", href: "/upload", icon: UploadCloud },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col fixed left-0 top-0 shadow-2xl z-50">
      <div className="p-6">
        <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm shadow-lg shadow-indigo-500/30">
            S
          </span>
          STMS
        </h2>
        <p className="text-xs text-gray-400 mt-1 font-medium">Admin Panel</p>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group overflow-hidden ${
                  isActive ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-white/10 border border-white/10 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`h-5 w-5 relative z-10 ${isActive ? "text-indigo-400" : "group-hover:text-indigo-400 transition-colors"}`} />
                <span className="font-medium relative z-10">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors font-medium text-left"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}