import React, { useEffect, useState } from "react";
import { getDepartments } from "../api/departmentApi";
import { getTeachers, addTeacher, deleteTeacher } from "../api/teacherApi";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, UserCheck, Search, Briefcase } from "lucide-react";
import { useToast } from "../context/ToastContext";
import ConfirmationModal from "../components/ConfirmationModal";

export default function Teachers() {
  const [name, setName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [maxLoad, setMaxLoad] = useState("");
  const [semester, setSemester] = useState("");

  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setDepartments(await getDepartments());
      setTeachers(await getTeachers());
    } catch (error) {
      console.error("Error loading data:", error);
      addToast("Failed to load teachers", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !departmentId || !maxLoad || !semester) {
      addToast("Please fill all required fields", "warning");
      return;
    }

    try {
      await addTeacher({
        name,
        departmentId: parseInt(departmentId, 10),
        maxLoad: Number(maxLoad),
        semester: Number(semester)
      });

      setName("");
      setDepartmentId("");
      setMaxLoad("");
      setSemester("");
      addToast("Teacher added successfully", "success");
      loadAll();
    } catch (error) {
      console.error("Error adding teacher:", error);
      addToast(error.response?.data?.message || "Failed to add teacher", "error");
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
      await deleteTeacher(id);
      setTeachers(teachers.filter(t => t.id !== id));
      addToast("Teacher deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting teacher:", error);
      let msg = "Failed to delete teacher.";
      if (error.response?.data) {
        const rawErr = typeof error.response.data === 'string' ? error.response.data : error.response.data.message;
        if (rawErr && (rawErr.toLowerCase().includes("foreign key") || rawErr.toLowerCase().includes("constraint"))) {
          msg = "Cannot delete: This teacher is assigned to Subjects. Please reassign or delete their subjects first.";
        } else {
          msg = rawErr || "Cannot delete teacher";
        }
      }
      addToast(msg, "error");
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
        >
          <div>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-400 to-red-500 drop-shadow-lg">
              Teachers
            </h1>
            <p className="text-slate-400 mt-2 text-lg font-light">Manage faculty and workload</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Add Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 lg:sticky lg:top-8 h-fit"
          >
            <div className="glass p-8 rounded-3xl relative overflow-hidden">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/30">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                New Faculty
              </h2>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                  <input
                    className="w-full bg-dark/50 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all"
                    placeholder="e.g. Dr. Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Department</label>
                  <select
                    className="w-full bg-dark/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-pink-500/50 transition-all"
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                  >
                    <option value="" className="bg-dark">Select Department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id} className="bg-dark">{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Max Load</label>
                    <input
                      type="number"
                      className="w-full bg-dark/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-pink-500/50 transition-all"
                      placeholder="3"
                      value={maxLoad}
                      onChange={(e) => setMaxLoad(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Semester</label>
                    <select
                      className="w-full bg-dark/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-pink-500/50 transition-all"
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                    >
                      <option value="" className="bg-dark">Sem</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                        <option key={n} value={n} className="bg-dark">{n}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button className="w-full bg-white text-dark font-bold py-4 rounded-xl hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] transition-shadow">
                  Add Faculty Member
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
                placeholder="Search teachers..."
                className="bg-transparent border-none focus:outline-none text-white w-full h-full text-lg placeholder-slate-600"
              />
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {loading ? (
                  <div className="text-center py-20 text-slate-500">Loading...</div>
                ) : teachers.length === 0 ? (
                  <div className="text-center py-20 text-slate-500 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    No teachers found.
                  </div>
                ) : (
                  teachers.map((t, index) => (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className="group p-5 rounded-2xl bg-[#13141f] hover:bg-[#1a1c2e] border border-white/5 hover:border-pink-500/30 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center border border-pink-500/30">
                          <UserCheck className="w-5 h-5 text-pink-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-pink-400 transition-colors">{t.name}</h3>
                          <div className="flex gap-4 mt-1 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {t.department?.name}</span>
                            <span className="text-slate-600">|</span>
                            <span>Max Load: {t.maxLoad}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteClick(t.id)}
                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
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
        title="Delete Teacher?"
        message="Are you sure you want to delete this teacher? This action cannot be undone."
      />
    </div>
  );
}
