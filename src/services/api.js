import axios from "axios";

const BASE_URL = "http://localhost:8081/api";

export const addClass = (data) =>
  axios.post(`${BASE_URL}/classes`, data);

export const getClasses = () =>
  axios.get(`${BASE_URL}/classes`);

export const deleteClass = (id) =>
  axios.delete(`${BASE_URL}/classes/${id}`);
