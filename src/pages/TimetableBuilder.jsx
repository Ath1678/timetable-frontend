import React from "react";
import TimetableForm from "../components/TimetableForm";
import TimetableGrid from "../components/TimetableGrid";
import "../styles/timetable.css";

const TimetableBuilder = () => {
  return (
    <div className="page">
      <h1>🗓 Timetable Builder</h1>

      {/* STEP 1: SELECT DETAILS */}
      <TimetableForm />

      {/* STEP 2: BUILD TIMETABLE */}
      <TimetableGrid />
    </div>
  );
};

export default TimetableBuilder;
