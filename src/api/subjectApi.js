import apiClient from "./apiClient";

/**
 * Get all subjects
 * @returns {Promise<Array>} List of subjects
 */
export const getSubjects = async () => {
  try {
    const res = await apiClient.get("/subjects");
    return res.data;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};

/**
 * Add a new subject
 * @param {Object} data - Subject data to add
 * @returns {Promise<Object>} Created subject data
 */
export const addSubject = async (data) => {
  try {
    const res = await apiClient.post("/subjects", data);
    return res.data;
  } catch (error) {
    console.error("Error adding subject:", error);
    throw error;
  }
};

/**
 * Update an existing subject
 * @param {string|number} id - Subject ID
 * @param {Object} data - Updated subject data
 * @returns {Promise<Object>} Updated subject data
 */
export const updateSubject = async (id, data) => {
  try {
    const res = await apiClient.put(`/subjects/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating subject:", error);
    throw error;
  }
};

/**
 * Delete a subject
 * @param {string|number} id - Subject ID
 * @returns {Promise<Object>} Delete confirmation
 */
export const deleteSubject = async (id) => {
  try {
    const res = await apiClient.delete(`/subjects/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting subject:", error);
    throw error;
  }
};

/**
 * Get a single subject by ID
 * @param {string|number} id - Subject ID
 * @returns {Promise<Object>} Subject data
 */
export const getSubjectById = async (id) => {
  try {
    const res = await apiClient.get(`/subjects/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching subject:", error);
    throw error;
  }
};

/**
 * Get subjects by department
 * @param {string|number} departmentId - Department ID
 * @returns {Promise<Array>} List of subjects in the department
 */
export const getSubjectsByDepartment = async (departmentId) => {
  try {
    const res = await apiClient.get(`/subjects/department/${departmentId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching subjects by department:", error);
    throw error;
  }
};
