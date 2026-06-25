import apiClient from "./apiClient";

/**
 * Get all classes
 * @returns {Promise<Array>} List of classes
 */
export const getClasses = async () => {
  try {
    const res = await apiClient.get("/classes");
    return res.data;
  } catch (error) {
    console.error("Error fetching classes:", error);
    throw error;
  }
};

/**
 * Add a new class
 * @param {Object} data - Class data to add
 * @returns {Promise<Object>} Created class data
 */
export const addClass = async (data) => {
  try {
    const res = await apiClient.post("/classes", data);
    return res.data;
  } catch (error) {
    console.error("Error adding class:", error);
    throw error;
  }
};

/**
 * Update an existing class
 * @param {string|number} id - Class ID
 * @param {Object} data - Updated class data
 * @returns {Promise<Object>} Updated class data
 */
export const updateClass = async (id, data) => {
  try {
    const res = await apiClient.put(`/classes/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating class:", error);
    throw error;
  }
};

/**
 * Delete a class
 * @param {string|number} id - Class ID
 * @returns {Promise<Object>} Delete confirmation
 */
export const deleteClass = async (id) => {
  try {
    const res = await apiClient.delete(`/classes/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting class:", error);
    throw error;
  }
};

/**
 * Get a single class by ID
 * @param {string|number} id - Class ID
 * @returns {Promise<Object>} Class data
 */
export const getClassById = async (id) => {
  try {
    const res = await apiClient.get(`/classes/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching class:", error);
    throw error;
  }
};
