import apiClient from "./apiClient";

/**
 * Check for timetable conflicts
 * @param {Object} payload - Conflict check payload
 * @returns {Promise<Object>} Conflict check results
 */
export const checkConflictsApi = async (payload) => {
  try {
    const response = await apiClient.post("/timetable/conflicts", payload);
    return response.data;
  } catch (error) {
    console.error("Error checking conflicts:", error);
    throw error;
  }
};

/**
 * Save timetable
 * @param {Object} payload - Timetable data to save
 * @returns {Promise<Object>} Save confirmation
 */
export const saveTimetableApi = async (payload) => {
  try {
    const response = await apiClient.post("/timetable", payload);
    return response.data;
  } catch (error) {
    console.error("Error saving timetable:", error);
    throw error;
  }
};

/**
 * Load timetable for a class
 * @param {string} className - Name of the class
 * @returns {Promise<Object>} Timetable data
 */
export const loadTimetableApi = async (className) => {
  try {
    const response = await apiClient.get(`/timetable/${className}`);
    return response.data;
  } catch (error) {
    console.error("Error loading timetable:", error);
    throw error;
  }
};

/**
 * Get all timetables
 * @returns {Promise<Array>} List of all timetables
 */
export const getAllTimetables = async () => {
  try {
    const response = await apiClient.get("/timetable");
    return response.data;
  } catch (error) {
    console.error("Error fetching timetables:", error);
    throw error;
  }
};

/**
 * Delete a timetable
 * @param {string|number} id - Timetable ID
 * @returns {Promise<Object>} Delete confirmation
 */
export const deleteTimetable = async (id) => {
  try {
    const response = await apiClient.delete(`/timetable/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting timetable:", error);
    throw error;
  }
};

/**
 * Update timetable
 * @param {string|number} id - Timetable ID
 * @param {Object} payload - Updated timetable data
 * @returns {Promise<Object>} Updated timetable data
 */
export const updateTimetable = async (id, payload) => {
  try {
    const response = await apiClient.put(`/timetable/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating timetable:", error);
    throw error;
  }
};

/**
 * Generate automatic timetable
 * @param {Object} payload - Generation parameters
 * @returns {Promise<Object>} Generated timetable
 */
export const generateTimetable = async (payload) => {
  try {
    const response = await apiClient.post("/timetable/generate", payload);
    return response.data;
  } catch (error) {
    console.error("Error generating timetable:", error);
    throw error;
  }
};

/**
 * Get timetable by class ID
 * @param {string|number} classId - Class ID
 * @returns {Promise<Object>} Timetable data for the class
 */
export const getTimetableByClass = async (classId) => {
  try {
    const response = await apiClient.get(`/timetable/class/${classId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching timetable by class:", error);
    throw error;
  }
};

/**
 * Get timetable by teacher ID
 * @param {string|number} teacherId - Teacher ID
 * @returns {Promise<Object>} Timetable data for the teacher
 */
export const getTimetableByTeacher = async (teacherId) => {
  try {
    const response = await apiClient.get(`/timetable/teacher/${teacherId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching timetable by teacher:", error);
    throw error;
  }
};
