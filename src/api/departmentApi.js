import apiClient from "./apiClient";

/**
 * Get all departments
 * @returns {Promise<Array>} List of departments
 */
export const getDepartments = async () => {
  try {
    const res = await apiClient.get("/departments");
    return res.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error;
  }
};

/**
 * Add a new department
 * @param {Object} data - Department data to add
 * @returns {Promise<Object>} Created department data
 */
export const addDepartment = async (data) => {
  try {
    const res = await apiClient.post("/departments", data);
    return res.data;
  } catch (error) {
    console.error("Error adding department:", error);
    throw error;
  }
};

/**
 * Update an existing department
 * @param {string|number} id - Department ID
 * @param {Object} data - Updated department data
 * @returns {Promise<Object>} Updated department data
 */
export const updateDepartment = async (id, data) => {
  try {
    const res = await apiClient.put(`/departments/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating department:", error);
    throw error;
  }
};

/**
 * Delete a department
 * @param {string|number} id - Department ID
 * @returns {Promise<Object>} Delete confirmation
 */
export const deleteDepartment = async (id) => {
  try {
    const res = await apiClient.delete(`/departments/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting department:", error);
    throw error;
  }
};

/**
 * Get a single department by ID
 * @param {string|number} id - Department ID
 * @returns {Promise<Object>} Department data
 */
export const getDepartmentById = async (id) => {
  try {
    const res = await apiClient.get(`/departments/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching department:", error);
    throw error;
  }
};
