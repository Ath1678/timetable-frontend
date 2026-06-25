import React, { useEffect, useState } from "react";
import { addDepartment, getDepartments, deleteDepartment } from "../api/departmentApi";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Search, Building, Sparkles } from "lucide-react";
import { useToast } from "../context/ToastContext";
import ConfirmationModal from "../components/ConfirmationModal";

export default function Departments() {
  const [name, setName] = useState("");
  const [semester, setSemester] = useState("");
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const loadDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      console.error("Error loading departments:", error);
      addToast("Failed to load departments", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !semester) {
      addToast("Please fill all required fields", "info");
      return;
    }

    try {
      await addDepartment({ name, semester: Number(semester) });
      setName("");
      setSemester("");
      addToast("Department created successfully!", "success");
      loadDepartments();
    } catch (error) {
      console.error("Error adding department:", error);
      const msg = error.response?.data?.message || "Failed to add department";
      addToast(msg, "error");
    }
  };

  // Modal State
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    const id = deleteModal.id;
    setDeleteModal({ isOpen: false, id: null });

    try {
      await deleteDepartment(id);
      setDepartments(departments.filter(d => d.id !== id));
      addToast("Department deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting department:", error);
      // Extract meaningful error message
      let msg = "Failed to delete department.";
      if (error.response?.data) {
        const rawErr = typeof error.response.data === 'string'
          ? error.response.data
          : error.response.data.message || JSON.stringify(error.response.data);

        if (rawErr.toLowerCase().includes("foreign key") || rawErr.toLowerCase().includes("constraint")) {
          msg = "Cannot delete: This department has associated Classes or Teachers. Please delete them first.";
        } else {
          msg = rawErr.substring(0, 100); // Limit length
        }
      }
      addToast(msg, "error");
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
        >
          <div>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-accent drop-shadow-lg">
              Departments
            </h1>
            <p className="text-slate-400 mt-2 text-lg font-light tracking-wide">Manage academic structure and semesters</p>
          </div>

          <div className="flex items-center gap-2 bg-card/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-mono text-emerald-400">System Online</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Add Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 h-fit"
          >
            <div className="glass p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-indigo-600 shadow-lg shadow-primary/30">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                Create New
              </h2>

              <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Department Name</label>
                  <input
                    className="w-full bg-dark/50 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
                    placeholder="e.g. Computer Science"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Duration</label>
                  <div className="relative">
                    <select
                      className="w-full bg-dark/50 border border-white/10 rounded-xl p-4 text-white appearance-none focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                    >
                      <option value="" className="bg-dark text-slate-500">Select total semesters...</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                        <option key={n} value={n} className="bg-dark">{n} Semesters</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      ▼
                    </div>
                  </div>
                </div>

                <button className="group w-full relative overflow-hidden bg-white text-dark font-bold py-4 rounded-xl transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Create Department <Sparkles className="w-4 h-4 text-primary" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </button>
              </form>
            </div>
          </motion.div>

          {/* List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8 space-y-6"
          >
            {/* Search Bar */}
            <div className="glass p-2 rounded-2xl flex items-center gap-4 border border-white/5">
              <div className="p-3 rounded-xl bg-white/5">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input
                placeholder="Search departments..."
                className="bg-transparent border-none focus:outline-none text-white w-full h-full text-lg placeholder-slate-600"
              />
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
                    <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <p>Loading data...</p>
                  </div>
                ) : departments.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10"
                  >
                    <Building className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-300">No Departments Found</h3>
                    <p className="text-slate-500">Create one to get started with your schedule.</p>
                  </motion.div>
                ) : (
                  departments.map((d, index) => (
                    <motion.div
                      key={d.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative bg-[#13141f] hover:bg-[#1a1c2e] p-5 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300 flex items-center justify-between shadow-lg"
                    >
                      {/* Left glow on hover */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity rounded-l-2xl" />

                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 transition-transform">
                          <span className="font-mono text-indigo-400 font-bold text-lg">
                            {d.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{d.name}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded">ID: {d.id}</span>
                            <span className="text-xs text-slate-400">{d.semester} Semesters</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="hidden sm:block text-right mr-4">
                          <span className="block text-xs text-slate-500 uppercase tracking-wider font-bold">Status</span>
                          <span className="text-sm text-emerald-400 flex items-center justify-end gap-1">
                            Active <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          </span>
                        </div>

                        <button
                          onClick={() => handleDeleteClick(d.id)}
                          className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-slate-400 hover:text-red-400 transition-all hover:scale-105 active:scale-95"
                          title="Delete Department"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="Delete Department?"
        message="Are you sure you want to delete this department? This action cannot be undone and might affect associated classes."
      />
    </div>
  );
}
