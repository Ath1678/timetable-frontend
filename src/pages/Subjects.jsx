import React, { useEffect, useState, useCallback } from "react";
import { getClasses } from "../api/classApi";
import { getTeachers } from "../api/teacherApi";
import { getSubjects, addSubject, deleteSubject } from "../api/subjectApi";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, BookOpen, Clock, Layers, Search } from "lucide-react";
import { useToast } from "../context/ToastContext";
import ConfirmationModal from "../components/ConfirmationModal";

export default function Subjects() {
  const [name, setName] = useState("");
  const [classId, setClassId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [periodsPerWeek, setPeriodsPerWeek] = useState("");
  const [semester, setSemester] = useState("");
  const [type, setType] = useState("Theory"); // Theory or Practical

  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const loadAll = useCallback(async () => {
    try {
      const [cls, tch, sub] = await Promise.all([
        getClasses(),
        getTeachers(),
        getSubjects()
      ]);
      setClasses(cls);
      setTeachers(tch);
      setSubjects(sub);
    } catch (error) {
      console.error("Error loading data:", error);
      addToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !classId || !teacherId || !periodsPerWeek || !semester) {
      addToast("Please fill all required fields", "warning");
      return;
    }

    try {
      await addSubject({
        name,
        classId: parseInt(classId, 10),
        teacherId: parseInt(teacherId, 10),
        periodsPerWeek: Number(periodsPerWeek),
        semester: Number(semester),
        type // Send type to backend (mock or real)
      });

      setName("");
      setClassId("");
      setTeacherId("");
      setPeriodsPerWeek("");
      setSemester("");
      setType("Theory");
      addToast("Subject created successfully!", "success");
      loadAll();
    } catch (error) {
      console.error("Error adding subject:", error);
      addToast(error.response?.data?.message || "Failed to add subject", "error");
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
      await deleteSubject(id);
      setSubjects(subjects.filter(s => s.id !== id));
      addToast("Subject deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting subject:", error);
      let msg = "Failed to delete subject.";
      if (error.response?.data) {
        const rawErr = typeof error.response.data === 'string' ? error.response.data : error.response.data.message;
        if (rawErr && (rawErr.toLowerCase().includes("foreign key") || rawErr.toLowerCase().includes("constraint"))) {
          msg = "Cannot delete: This subject appears in generated Timetables. Please clear the timetable first.";
        } else {
          msg = rawErr || "Cannot delete subject";
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
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-blue-400 to-indigo-500 drop-shadow-lg">
              Subjects
            </h1>
            <p className="text-slate-400 mt-2 text-lg font-light">Curriculum and assignments</p>
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
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                New Subject
              </h2>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Subject Name</label>
                    <input
                      className="w-full bg-dark/50 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                      placeholder="e.g. Advanced Math"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Type</label>
                    <select
                      className="w-full bg-dark/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="Theory" className="bg-dark">Theory</option>
                      <option value="Practical" className="bg-dark">Practical</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Class</label>
                    <select
                      className="w-full bg-dark/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                      value={classId}
                      onChange={(e) => setClassId(e.target.value)}
                    >
                      <option value="" className="bg-dark">Select Class</option>
                      {classes.map((c) => (
                        <option key={c.id} value={c.id} className="bg-dark">{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Teacher</label>
                    <select
                      className="w-full bg-dark/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                      value={teacherId}
                      onChange={(e) => setTeacherId(e.target.value)}
                    >
                      <option value="" className="bg-dark">Teacher</option>
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id} className="bg-dark">{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Periods/Wk</label>
                    <input
                      type="number"
                      className="w-full bg-dark/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                      placeholder="4"
                      value={periodsPerWeek}
                      onChange={(e) => setPeriodsPerWeek(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Semester</label>
                    <select
                      className="w-full bg-dark/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all"
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

                <button className="w-full bg-white text-dark font-bold py-4 rounded-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-shadow">
                  Create Subject
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
                placeholder="Search subjects..."
                className="bg-transparent border-none focus:outline-none text-white w-full h-full text-lg placeholder-slate-600"
              />
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {loading ? (
                  <div className="text-center py-20 text-slate-500">Loading...</div>
                ) : subjects.length === 0 ? (
                  <div className="text-center py-20 text-slate-500 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    No subjects found.
                  </div>
                ) : (
                  subjects.map((s, index) => (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className="group p-5 rounded-2xl bg-[#13141f] hover:bg-[#1a1c2e] border border-white/5 hover:border-cyan-500/30 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30">
                          <BookOpen className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{s.name}</h3>
                          <div className="flex gap-4 mt-1 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {s.academicClass?.name}</span>
                            <span className="text-slate-600">|</span>
                            <span>{s.teacher?.name}</span>
                            <span className="text-slate-600">|</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${s.type === 'Practical' ? 'bg-pink-500/10 text-pink-400' : 'bg-blue-500/10 text-blue-400'}`}>
                              {s.type || 'Theory'}
                            </span>
                            <span className="text-slate-600">|</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {s.periodsPerWeek}/wk</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteClick(s.id)}
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
        title="Delete Subject?"
        message="Are you sure you want to delete this subject? This action cannot be undone."
      />
    </div>
  );
}
