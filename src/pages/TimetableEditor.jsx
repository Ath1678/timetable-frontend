import { useEffect, useState } from "react";
import { loadTimetableApi } from "../api/timetableApi";
import TimetableGrid from "../components/TimetableGrid";
import Toast from "../components/Toast";
import "../styles/toast.css";

export default function TimetableEditor() {
  const [data, setData] = useState([]);
  const [toast, setToast] = useState(null);

  const reload = async () => {
    try {
      // TODO: This hardcoded "CS-A" should probably come from props or context
      const res = await loadTimetableApi("CS-A");
      setData(res);
    } catch (error) {
      console.error("Failed to load timetable", error);
    }
  };

  useEffect(() => { reload(); }, []);

  return (
    <>
      {toast && <Toast {...toast} />}
      <TimetableGrid
        data={data}
        reload={reload}
        showToast={(m, t) => setToast({ message: m, type: t })}
        className="CS-A"
        semester="1"
      />
    </>
  );
}
