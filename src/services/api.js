import axios from "axios";

const BASE_URL = "https://timetable-backend-m6bt.onrender.com";

export const addClass = (data) =>
  axios.post(`${BASE_URL}/classes`, data);

export const getClasses = () =>
  axios.get(`${BASE_URL}/classes`);

export const deleteClass = (id) =>
  axios.delete(`${BASE_URL}/classes/${id}`);
