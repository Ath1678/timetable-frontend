import React, { useState, useEffect } from "react";
import { getDepartments } from "../api/departmentApi";
import { getClasses } from "../api/classApi";

const TimetableForm = ({ onFormChange }) => {
  const [form, setForm] = useState({
    department: "",
    className: "",
    semester: "",
  });

  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const depts = await getDepartments();
      const cls = await getClasses();
      setDepartments(depts);
      setClasses(cls);
    } catch (error) {
      console.error("Error loading form data:", error);
    }
  };

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    
    // Notify parent component if callback is provided
    if (onFormChange) {
      onFormChange(updated);
    }
  };

  return (
    <div className="form-box">
      <h3>Basic Details</h3>

      <select 
        name="department" 
        value={form.department}
        onChange={handleChange}
      >
        <option value="">Select Department</option>
        {departments.map((dept) => (
          <option key={dept.id} value={dept.id}>
            {dept.name}
          </option>
        ))}
      </select>

      <select 
        name="className" 
        value={form.className}
        onChange={handleChange}
      >
        <option value="">Select Class</option>
        {classes.map((cls) => (
          <option key={cls.id} value={cls.id}>
            {cls.name}
          </option>
        ))}
      </select>

      <select 
        name="semester" 
        value={form.semester}
        onChange={handleChange}
      >
        <option value="">Select Semester</option>
        <option value="1">Semester 1</option>
        <option value="2">Semester 2</option>
        <option value="3">Semester 3</option>
        <option value="4">Semester 4</option>
        <option value="5">Semester 5</option>
        <option value="6">Semester 6</option>
        <option value="7">Semester 7</option>
        <option value="8">Semester 8</option>
      </select>
    </div>
  );
};

export default TimetableForm;
