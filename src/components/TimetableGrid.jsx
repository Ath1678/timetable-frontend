import { useState } from "react";
import { saveTimetableApi, deleteTimetable } from "../api/timetableApi";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const periods = [1, 2, 3, 4, 5, 6];

export default function TimetableGrid({ data, reload, showToast, className = "CS-A", semester = "1" }) {
  const [undo, setUndo] = useState(null);

  const handleEdit = async (cell) => {
    const subject = prompt("Subject:", cell.subject || "");
    if (!subject) return;

    try {
      await saveTimetableApi({
        ...cell,
        subject,
        className,
        semester,
        department: "CS" // Default or prop
      });
      showToast("Saved", "success");
      reload();
    } catch (error) {
      showToast("Failed to save", "error");
    }
  };

  const handleDelete = async (cell) => {
    setUndo(cell);
    try {
      await deleteTimetable(cell.id);
      showToast("Deleted – Undo available", "error");
      reload();

      setTimeout(() => setUndo(null), 5000);
    } catch (error) {
      showToast("Failed to delete", "error");
    }
  };

  const undoDelete = async () => {
    try {
      await saveTimetableApi(undo);
      setUndo(null);
      showToast("Undo success", "success");
      reload();
    } catch (error) {
      showToast("Failed to undo", "error");
    }
  };

  return (
    <>
      {undo && <button onClick={undoDelete}>UNDO DELETE</button>}

      <table border="1">
        <thead>
          <tr>
            <th>Day / Period</th>
            {periods.map(p => <th key={p}>P{p}</th>)}
          </tr>
        </thead>

        <tbody>
          {days.map(day => (
            <tr key={day}>
              <td>{day}</td>
              {periods.map(p => {
                const cell = data.find(
                  c => c.day === day && c.period === p
                );

                return (
                  <td
                    key={p}
                    onClick={() => handleEdit(cell || { day, period: p })}
                    style={{ cursor: "pointer", height: "40px", backgroundColor: cell ? "transparent" : "rgba(255,255,255,0.05)" }}
                  >
                    {cell?.subject || ""}
                    {cell && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(cell);
                        }}
                      >
                        ❌
                      </button>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
