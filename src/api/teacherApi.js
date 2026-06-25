import apiClient from "./apiClient";

/**
 * Get all teachers
 * @returns {Promise<Array>} List of teachers
 */
export const getTeachers = async () => {
  try {
    const res = await apiClient.get("/teachers");
    return res.data;
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};

/**
 * Add a new teacher
 * @param {Object} data - Teacher data to add
 * @returns {Promise<Object>} Created teacher data
 */
export const addTeacher = async (data) => {
  try {
    const res = await apiClient.post("/teachers", data);
    return res.data;
  } catch (error) {
    console.error("Error adding teacher:", error);
    throw error;
  }
};

/**
 * Update an existing teacher
 * @param {string|number} id - Teacher ID
 * @param {Object} data - Updated teacher data
 * @returns {Promise<Object>} Updated teacher data
 */
export const updateTeacher = async (id, data) => {
  try {
    const res = await apiClient.put(`/teachers/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating teacher:", error);
    throw error;
  }
};

/**
 * Delete a teacher
 * @param {string|number} id - Teacher ID
 * @returns {Promise<Object>} Delete confirmation
 */
export const deleteTeacher = async (id) => {
  try {
    const res = await apiClient.delete(`/teachers/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting teacher:", error);
    throw error;
  }
};

/**
 * Get a single teacher by ID
 * @param {string|number} id - Teacher ID
 * @returns {Promise<Object>} Teacher data
 */
export const getTeacherById = async (id) => {
  try {
    const res = await apiClient.get(`/teachers/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching teacher:", error);
    throw error;
  }
};

/**
 * Get teachers by department
 * @param {string|number} departmentId - Department ID
 * @returns {Promise<Array>} List of teachers in the department
 */
export const getTeachersByDepartment = async (departmentId) => {
  try {
    const res = await apiClient.get(`/teachers/department/${departmentId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching teachers by department:", error);
    throw error;
  }
};

/**
 * Get teacher availability
 * @param {string|number} teacherId - Teacher ID
 * @returns {Promise<Object>} Teacher availability data
 */
export const getTeacherAvailability = async (teacherId) => {
  try {
    const res = await apiClient.get(`/teachers/${teacherId}/availability`);
    return res.data;
  } catch (error) {
    console.error("Error fetching teacher availability:", error);
    throw error;
  }
};
