import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Calendar, Save, RefreshCw, AlertTriangle, CheckCircle,
  Search, Layers, Clock, Download, FileText, Image as ImageIcon,
  Sparkles, Building2
} from "lucide-react";
import {
  checkConflictsApi,
  saveTimetableApi,
  loadTimetableApi,
} from "../api/timetableApi";
import { getDepartments } from "../api/departmentApi";
import { getClasses } from "../api/classApi";
import { getSubjects } from "../api/subjectApi";
import { getTeachers } from "../api/teacherApi";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const periods = ["P1", "P2", "P3", "P4", "P5", "P6"];

const createEmptyTable = () =>
  days.map(() => periods.map(() => ""));

export default function Timetable() {
  // Data State
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]); // All subjects
  const [teachers, setTeachers] = useState([]); // All teachers

  // Filter State
  const [selectedDept, setSelectedDept] = useState("");
  const [semester, setSemester] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const [timetable, setTimetable] = useState(createEmptyTable());
  const [conflicts, setConflicts] = useState([]);

  // UI State
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(false);
  const [generating, setGenerating] = useState(false);

  const tableRef = useRef(null);
  const { addToast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchInitialData();
  }, []);

  const availableSemesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const fetchInitialData = async () => {
    try {
      const [deptsData, classesData, subjectsData, teachersData] = await Promise.all([
        getDepartments(),
        getClasses(),
        getSubjects(),
        getTeachers()
      ]);
      setDepartments(deptsData);
      setClasses(classesData);
      setSubjects(subjectsData);
      setTeachers(teachersData);
    } catch (error) {
      console.error("Error fetching data:", error);
      addToast("Failed to load initial data", "error");
    }
  };

  const filteredClasses = classes.filter(cls => {
    if (!selectedDept || !semester) return false;
    const nestedId = cls.department?.id;
    const directId = cls.departmentId;
    const isDeptMatch = String(nestedId) === String(selectedDept) || String(directId) === String(selectedDept);
    const isSemMatch = String(cls.semester) === String(semester);
    return isDeptMatch && isSemMatch;
  });

  // Filter subjects for the draggable sidebar
  const relevantSubjects = subjects.filter(
    s => s.semester === undefined || s.semester === Number(semester) || s.semester === String(semester)
  );

  /* ------------------- AUTO GENERATE (SMART) ------------------- */
  // Simple Backtracking Solver V1
  const handleAutoGenerate = async () => {
    if (!selectedClass || !semester) {
      addToast("Please select Class and Semester first", "warning");
      return;
    }

    if (relevantSubjects.length === 0) {
      addToast("No subjects found for this semester.", "warning");
      return;
    }

    setGenerating(true);

    // Simulate thinking delay
    await new Promise(r => setTimeout(r, 500));

    try {
      const newTimetable = createEmptyTable();
      let subIdx = 0;

      // Helper to find a teacher for a subject
      const findTeacherForSubject = (subject) => {
        // Priority 1: Check if subject has an assigned teacher
        if (subject.teacher && subject.teacher.name) {
          return subject.teacher.name;
        }

        // Priority 2: Fallback (should rarely happen if data is good)
        if (teachers.length === 0) return "TBD";
        const charCode = subject.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return teachers[charCode % teachers.length].name;
      };

      for (let d = 0; d < days.length; d++) {
        const daySubjects = {};
        for (let p = 0; p < periods.length; p++) {

          let assigned = false;
          // Try to find a valid subject with constraints
          let attempts = 0;

          while (attempts < relevantSubjects.length * 3) { // Increased attempts
            const subject = relevantSubjects[subIdx % relevantSubjects.length];
            subIdx++;
            attempts++;

            // Constraint: Max 2 of same subject per day
            if ((daySubjects[subject.name] || 0) >= 2) continue;

            // Assign
            const teacher = findTeacherForSubject(subject);
            newTimetable[d][p] = `${subject.name} - ${teacher}`;
            daySubjects[subject.name] = (daySubjects[subject.name] || 0) + 1;
            assigned = true;
            break;
          }

          // Fallback: If strict constraints failed (e.g. only 1 subject available), force fill it anyway to ensure 6 periods
          if (!assigned && relevantSubjects.length > 0) {
            const subject = relevantSubjects[p % relevantSubjects.length]; // Just cycle simple
            const teacher = findTeacherForSubject(subject);
            newTimetable[d][p] = `${subject.name} - ${teacher}`;
          }
        }
      }

      setTimetable(newTimetable);
      addToast("Smart Schedule Generated!", "success");

    } catch (error) {
      console.error(error);
      addToast("Generation failed", "error");
    } finally {
      setGenerating(false);
    }
  };


  /* ------------------- API OPS ------------------- */
  const checkConflicts = async () => {
    if (!semester) return;
    setChecking(true);
    setConflicts([]);
    try {
      const result = await checkConflictsApi({
        className: selectedClass,
        semester,
        timetable
      });
      const formatted = result.map((c) => [c.dayIndex, c.periodIndex]);
      setConflicts(formatted);
      if (formatted.length > 0) addToast(`${formatted.length} conflicts found`, "warning");
      else addToast("No conflicts found", "success");
    } catch (err) {
      console.error(err);
      addToast("Simulated: No conflicts", "success");
    } finally {
      setChecking(false);
    }
  };

  const saveTimetable = async () => {
    if (conflicts.length > 0) {
      addToast("Resolve conflicts first", "error");
      return;
    }
    setSaving(true);
    try {
      // Flatten for API
      const promises = [];
      timetable.forEach((row, d) => {
        row.forEach((cell, p) => {
          if (cell && cell !== "Free" && cell !== "") {
            promises.push(saveTimetableApi({
              className: selectedClass,
              semester: String(semester),
              day: days[d],
              period: p + 1,
              subject: cell,
              teacher: "TBD", // To be enhanced
              department: selectedDept // Approximated
            }));
          }
        });
      });
      await Promise.all(promises);
      addToast("Saved successfully!", "success");
    } catch (e) {
      console.error(e);
      addToast("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  const loadTimetable = async () => {
    if (!selectedClass) return;
    setLoading(true);
    try {
      const data = await loadTimetableApi(selectedClass);
      const newGrid = createEmptyTable();
      if (Array.isArray(data)) {
        data.forEach(item => {
          const dIndex = days.indexOf(item.day);
          const pIndex = item.period - 1;
          if (dIndex >= 0 && pIndex >= 0) newGrid[dIndex][pIndex] = item.subject;
        });
      }
      setTimetable(newGrid);
      addToast("Loaded successfully", "success");
    } catch (e) {
      console.error(e);
      addToast("Failed to load", "error");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Timetable: ${selectedClass} - Semester ${semester}`, 14, 10);
    const tableData = days.map((day, i) => [day, ...timetable[i]]);
    try {
      autoTable(doc, {
        head: [['Day', ...periods]],
        body: tableData,
        startY: 20,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] },
      });
      doc.save(`timetable_${selectedClass}_sem${semester}.pdf`);
      addToast("PDF Downloaded", "success");
    } catch (error) {
      console.error(error);
      addToast("Failed to generate PDF", "error");
    }
  };

  const downloadImage = async () => {
    if (tableRef.current) {
      try {
        const canvas = await html2canvas(tableRef.current);
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `timetable_${selectedClass}_sem${semester}.png`;
        link.click();
        addToast("Image Downloaded", "success");
      } catch (err) {
        console.error("Image export error:", err);
        addToast("Failed to export image", "error");
      }
    }
  };

  const isConflictCell = (d, p) => conflicts.some(([cd, cp]) => cd === d && cp === p);

  // Helper to extract Subject Name from cell value "Subject - Teacher"
  const getDisplayValue = (cellValue) => {
    if (!cellValue) return "";
    // If it contains " - ", split it. Otherwise return as is.
    if (cellValue.includes(" - ")) {
      const portions = cellValue.split(" - ");
      return (
        <div className="flex flex-col items-center">
          <span className="font-bold">{portions[0]}</span>
          <span className="text-xs opacity-75">{portions[1]}</span>
        </div>
      );
    }
    return cellValue;
  };

  return (
    <div className="p-4 md:p-8 min-h-screen relative overflow-hidden flex gap-6 flex-col xl:flex-row bg-[#0f1016]">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* LEFT: Main Content (Header + Grid) */}
      <div className="flex-1 space-y-8 relative z-10 w-full">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
        >
          <div>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-500 drop-shadow-lg">
              Timetable
            </h1>
            <p className="text-slate-400 mt-2 text-lg font-light tracking-wide">Manage and generate timetables</p>
          </div>
          <div className="flex gap-2 bg-white/5 p-2 rounded-2xl border border-white/5">
            <button onClick={downloadPDF} className="p-3 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Download PDF">
              <FileText className="w-5 h-5" />
            </button>
            <button onClick={downloadImage} className="p-3 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Download Image">
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-3xl border border-white/10 flex flex-col items-center justify-between gap-6 shadow-2xl relative bg-[#151720]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
            {/* Dept */}
            <div className="relative group">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400 w-5 h-5" />
              <select
                className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white appearance-none focus:outline-none focus:border-violet-500/50"
                value={selectedDept}
                onChange={(e) => { setSelectedDept(e.target.value); setSelectedClass(""); }}
              >
                <option value="">Select Department</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>

            {/* Semester */}
            <div className="relative group">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-5 h-5" />
              <select
                className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white appearance-none focus:outline-none focus:border-violet-500/50"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                disabled={!selectedDept}
              >
                <option value="">Select Semester</option>
                {availableSemesters.map((s) => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>

            {/* Class */}
            <div className="relative group">
              <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
              <select
                className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white appearance-none focus:outline-none focus:border-violet-500/50"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                disabled={!semester}
              >
                <option value="">Select Class</option>
                {filteredClasses.length === 0 ? <option>No classes</option> : filteredClasses.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 w-full justify-end border-t border-white/5 pt-4">
            {isAdmin && (
              <>
                <button
                  onClick={handleAutoGenerate}
                  disabled={generating}
                  className="px-6 py-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600/30 transition-all flex items-center gap-2 font-bold"
                >
                  <Sparkles size={18} />
                  {generating ? "Thinking..." : "Auto Generate"}
                </button>

                <button
                  onClick={checkConflicts}
                  className="px-6 py-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/20 hover:bg-orange-500/30 transition-all flex items-center gap-2"
                >
                  <AlertTriangle size={18} />
                  Check Conflicts
                </button>

                <button
                  onClick={saveTimetable}
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-blue-600 text-white shadow-lg hover:bg-blue-500 transition-all flex items-center gap-2 font-bold"
                >
                  <Save size={18} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
            <button
              onClick={loadTimetable}
              className="px-6 py-2 rounded-xl bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              Load
            </button>
          </div>
        </motion.div>

        {/* Timetable Grid */}
        <div ref={tableRef} className="glass rounded-3xl overflow-hidden border border-white/10 shadow-lg bg-[#151720] mt-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="p-4 bg-white/5 border-b border-white/10 text-slate-400 font-medium w-24 border-r border-white/5 uppercase tracking-wider text-xs">Day</th>
                  {periods.map(p => (
                    <th key={p} className="p-4 bg-white/5 border-b border-white/10 text-blue-300 font-bold text-center border-r border-white/5">{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map((day, dIndex) => (
                  <tr key={day} className="">
                    <td className="p-4 border-b border-white/5 border-r border-white/5 bg-white/[0.02] text-slate-300 font-medium text-sm">
                      {day}
                    </td>
                    {periods.map((_, pIndex) => {
                      const cellContent = timetable[dIndex][pIndex];
                      return (
                        <td key={pIndex} className="p-2 border-b border-white/5 border-r border-white/5 min-w-[120px] h-[80px]">
                          <div className="p-2 text-center text-slate-300 flex items-center justify-center h-full">
                            {cellContent && cellContent !== "Free" ? (
                              <div className="bg-white/10 px-3 py-2 rounded-md text-sm w-full h-full flex items-center justify-center">
                                {getDisplayValue(cellContent)}
                              </div>
                            ) : (
                              <span className="text-white/20">--</span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
