import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  CalendarDays,
  LogOut,
  Coffee,
  X,
  Shield,
  History,
  Sun,
  Moon,
  Monitor
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Building2, label: "Departments", path: "/departments" },
    { icon: Users, label: "Classes", path: "/classes" },
    { icon: GraduationCap, label: "Teachers", path: "/teachers" },
    { icon: BookOpen, label: "Subjects", path: "/subjects" },
    { icon: CalendarDays, label: "Timetable", path: "/timetable" },
    { icon: Coffee, label: "Holidays", path: "/holidays" },
    { icon: Shield, label: "User Manage", path: "/users" }, // Admin only
    { icon: History, label: "Login History", path: "/login-history" }, // Admin only
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.div
        className={`fixed left-0 top-0 h-full w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200 dark:border-white/10 p-6 flex flex-col z-50 transition-all duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Brand */}
        <div className="mb-10 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Timetable Pro Logo" className="w-9 h-9 rounded-xl shadow-lg" />
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-fuchsia-600 dark:from-white dark:to-slate-400">
              Timetable Pro
            </h2>
          </div>
          {/* Close Button Mobile */}
          <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
          {menuItems.filter(item => {
            const userRole = user?.role || 'student';
            if (userRole === 'admin') return true;
            if (userRole === 'teacher') return ['Dashboard', 'Timetable', 'Holidays'].includes(item.label);
            if (userRole === 'student') return ['Dashboard', 'Timetable'].includes(item.label);
            return false;
          }).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={onClose}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden ${isActive
                    ? "text-indigo-700 dark:text-white font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-indigo-50 dark:hover:bg-white/5"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-violet-100 dark:from-violet-600/20 dark:to-indigo-600/20 border border-indigo-200 dark:border-violet-500/30 rounded-xl"
                    />
                  )}

                  <item.icon className={`w-5 h-5 relative z-10 ${isActive ? "text-indigo-600 dark:text-violet-400" : ""}`} />
                  <span className="relative z-10">{item.label}</span>

                  {isActive && (
                    <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-violet-400 shadow-[0_0_10px_rgba(99,102,241,0.8)] dark:shadow-[0_0_10px_rgba(167,139,250,0.8)]" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="px-2 py-3 border-t border-slate-200 dark:border-white/5 mt-auto">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/5 text-center text-xs text-slate-500">
          <p>v2.0.0 &copy; 2026</p>
        </div>
      </motion.div>
    </>
  );
}
