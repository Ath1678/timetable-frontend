import React, { useState } from "react";

const TimetableForm = () => {
  const [form, setForm] = useState({
    department: "",
    className: "",
    semester: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="form-box">
      <h3>Basic Details</h3>

      <select name="department" onChange={handleChange}>
        <option value="">Select Department</option>
        <option value="CS">Computer Science</option>
        <option value="IT">Information Technology</option>
      </select>

      <select name="className" onChange={handleChange}>
        <option value="">Select Class</option>
        <option value="FY">FY</option>
        <option value="SY">SY</option>
        <option value="TY">TY</option>
      </select>

      <select name="semester" onChange={handleChange}>
        <option value="">Select Semester</option>
        <option value="1">Semester 1</option>
        <option value="2">Semester 2</option>
      </select>
    </div>
  );
};

export default TimetableForm;
