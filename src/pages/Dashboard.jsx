import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../api/dashboardApi";
import { motion } from "framer-motion";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import {
  Users,
  BookOpen,
  Building2,
  GraduationCap,
  Activity,
  ArrowUpRight,
  Zap
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState({ departments: 0, teachers: 0, subjects: 0, classes: 0 });
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const { user, getPendingUsers, approveUser, rejectUser } = useAuth();
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    if (user?.role === 'admin') {
      if (getPendingUsers) setPendingUsers(getPendingUsers());
    }
  }, [user, getPendingUsers]);

  const handleApprove = (username) => {
    if (approveUser(username)) {
      setPendingUsers(prev => prev.filter(u => u.username !== username));
      addToast("User approved successfully", "success");
    }
  };

  const handleReject = (username) => {
    if (rejectUser(username)) {
      setPendingUsers(prev => prev.filter(u => u.username !== username));
      addToast("User rejected", "info");
    }
  };



  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats({
          departments: Number(data.departments) || 0,
          teachers: Number(data.teachers) || 0,
          subjects: Number(data.subjects) || 0,
          classes: Number(data.classes) || 0,
        });
      } catch (error) {
        console.error("Dashboard Load Error:", error);
        addToast("Failed to load dashboard data", "error");
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [addToast]);

  const statCards = [
    { title: "Departments", value: stats.departments, icon: Building2, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", link: "/departments" },
    { title: "Teachers", value: stats.teachers, icon: Users, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20", link: "/teachers" },
    { title: "Subjects", value: stats.subjects, icon: BookOpen, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", link: "/subjects" },
    { title: "Classes", value: stats.classes, icon: GraduationCap, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", link: "/classes" },
  ];

  const chartData = [
    { name: 'Depts', value: stats.departments },
    { name: 'Teachers', value: stats.teachers },
    { name: 'Subjects', value: stats.subjects },
    { name: 'Classes', value: stats.classes },
  ];

  return (
    <div className="p-4 md:p-8 min-h-screen relative overflow-hidden">
      {/* Background Ambient */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">

        {/* Animated Greeting */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col md:flex-row justify-between items-end border-b border-slate-200 dark:border-white/5 pb-8"
        >
          <div>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-2 mb-2"
            >
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold tracking-wider uppercase flex items-center gap-2">
                <Zap className="w-3 h-3 fill-orange-300" /> Live Updates
              </div>
            </motion.div>
            <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tight">
              Dashboard <span className="text-primary">.</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 font-light mt-2">
              Welcome back, <span className="text-slate-900 dark:text-white font-medium">{user?.name}</span>
              <span className="px-2 py-0.5 ml-3 rounded-full bg-slate-200 dark:bg-white/10 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-white/10">
                {user?.role}
              </span>
            </p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-slate-400 font-mono text-sm">SYSTEM STATUS</p>
            <div className="flex items-center gap-2 justify-end mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400 font-bold">OPERATIONAL</span>
            </div>
          </div>
        </motion.div>

        {/* --- Admin Only: Pending Approvals --- */}
        {user?.role === 'admin' && pendingUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 mb-8"
          >
            <h3 className="text-xl font-bold text-amber-200 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" /> Pending Account Requests
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingUsers.map(u => (
                <div key={u.username} className="bg-white/80 dark:bg-black/40 rounded-xl p-4 border border-slate-200 dark:border-white/5 flex flex-col gap-3 shadow-sm">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-900 dark:text-white text-lg">{u.name}</span>
                      <span className="text-xs uppercase bg-slate-200 dark:bg-white/10 px-2 py-1 rounded text-slate-600 dark:text-slate-300">{u.role}</span>
                    </div>
                    <p className="text-slate-400 text-sm">@{u.username}</p>
                    <p className="text-slate-500 text-xs mt-1 flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> {u.institute}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => handleApprove(u.username)}
                      className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(u.username)}
                      className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}



        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((item, index) => (
            <Link to={item.link} key={item.title} className="block group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                className={`p-6 rounded-3xl backdrop-blur-xl border ${item.border} ${item.bg} relative overflow-hidden h-full cursor-pointer hover:shadow-2xl hover:shadow-${item.color.split('-')[1]}-500/10 transition-all`}
              >
                <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                  <item.icon className={`w-12 h-12 ${item.color} opacity-20 transform rotate-12 group-hover:scale-110 transition-transform`} />
                </div>

                <div className="relative z-10">
                  <p className={`font-bold ${item.color} mb-2 uppercase tracking-wider text-xs`}>{item.title}</p>
                  <h3 className="text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">
                    {loading ? <span className="animate-pulse">--</span> : item.value}
                  </h3>
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>View Details</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="glass p-8 rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#13141f]"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <Activity className="w-6 h-6 text-primary" />
                  Analytics Overview
                </h2>
                <p className="text-slate-500 text-sm mt-1">Real-time distribution of resources</p>
              </div>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{
                      backgroundColor: '#0b0c15',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '16px',
                      color: '#fff',
                      padding: '12px 20px',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={50}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={[
                        '#8b5cf6', // Violet
                        '#ec4899', // Pink
                        '#06b6d4', // Cyan
                        '#10b981'  // Emerald
                      ][index % 4]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>


        </div>

      </div>
    </div>
  );
}
