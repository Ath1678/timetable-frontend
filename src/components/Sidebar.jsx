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
  History
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user, logout } = useAuth();

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
        className={`fixed left-0 top-0 h-full w-64 bg-slate-900/90 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Brand */}
        <div className="mb-10 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Timetable Pro
            </h2>
          </div>
          {/* Close Button Mobile */}
          <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-white/10 text-slate-400">
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
                    ? "text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/30 rounded-xl"
                    />
                  )}

                  <item.icon className={`w-5 h-5 relative z-10 ${isActive ? "text-violet-400" : ""}`} />
                  <span className="font-medium relative z-10">{item.label}</span>

                  {isActive && (
                    <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.8)]" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t border-white/5">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-white/5 text-center text-xs text-slate-500">
          <p>v2.0.0 &copy; 2026</p>
        </div>
      </motion.div>
    </>
  );
}
