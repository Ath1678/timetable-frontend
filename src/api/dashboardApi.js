import { getDepartments } from "./departmentApi";
import { getTeachers } from "./teacherApi";
import { getSubjects } from "./subjectApi";
import { getClasses } from "./classApi";

/**
 * Get dashboard statistics by aggregating data
 * @returns {Promise<Object>} Dashboard stats (departments, teachers, subjects, etc.)
 */
export const getDashboardStats = async () => {
    try {
        const [departments, teachers, subjects, classes] = await Promise.all([
            getDepartments(),
            getTeachers(),
            getSubjects(),
            getClasses()
        ]);

        return {
            departments: departments?.length || 0,
            teachers: teachers?.length || 0,
            subjects: subjects?.length || 0,
            classes: classes?.length || 0
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        // Return default fallback data to prevent crash
        return {
            departments: 0,
            teachers: 0,
            subjects: 0,
            classes: 0
        };
    }
};
