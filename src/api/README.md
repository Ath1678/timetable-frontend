# API Files - Usage Guide

## Overview
This directory contains refactored API files with proper error handling, consistent configuration, and additional utility functions.

## Files Included
1. **apiClient.js** - Centralized axios instance with interceptors
2. **classApi.js** - Class management APIs
3. **departmentApi.js** - Department management APIs
4. **subjectApi.js** - Subject management APIs
5. **teacherApi.js** - Teacher management APIs
6. **timetableApi.js** - Timetable management APIs

## Key Improvements

### 1. Centralized Configuration
- All APIs use a single axios instance from `apiClient.js`
- Base URL is configurable via environment variable `REACT_APP_API_URL`
- Default timeout of 10 seconds
- Consistent headers across all requests

### 2. Error Handling
- Try-catch blocks in all API functions
- Detailed error logging
- Errors are properly propagated to calling code

### 3. Request/Response Interceptors
- Request interceptor for adding authentication tokens (commented out, ready to use)
- Response interceptor for centralized error handling

### 4. Additional CRUD Operations
- All APIs now include: GET, POST, PUT, DELETE operations
- Individual GET by ID operations
- Additional utility functions (e.g., get by department, availability checks)

## Setup

### Environment Variables
Create a `.env` file in your project root:

```env
REACT_APP_API_URL=http://localhost:8081/api
```

Or use the default: `http://localhost:8081/api`

### Installation
No additional packages needed if you already have axios:
```bash
npm install axios
```

## Usage Examples

### Basic Usage
```javascript
import { getClasses, addClass } from './api/classApi';

// Get all classes
const fetchClasses = async () => {
  try {
    const classes = await getClasses();
    console.log(classes);
  } catch (error) {
    console.error('Failed to fetch classes:', error);
  }
};

// Add a new class
const createClass = async () => {
  try {
    const newClass = await addClass({ name: 'Class 10A', section: 'A' });
    console.log('Class created:', newClass);
  } catch (error) {
    console.error('Failed to create class:', error);
  }
};
```

### With React Hooks
```javascript
import { useEffect, useState } from 'react';
import { getTeachers } from './api/teacherApi';

function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const data = await getTeachers();
        setTeachers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {teachers.map(teacher => (
        <li key={teacher.id}>{teacher.name}</li>
      ))}
    </ul>
  );
}
```

### Adding Authentication
Uncomment the following lines in `apiClient.js`:

```javascript
// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

## API Reference

### Class API
- `getClasses()` - Get all classes
- `addClass(data)` - Add a new class
- `updateClass(id, data)` - Update a class
- `deleteClass(id)` - Delete a class
- `getClassById(id)` - Get a single class

### Department API
- `getDepartments()` - Get all departments
- `addDepartment(data)` - Add a new department
- `updateDepartment(id, data)` - Update a department
- `deleteDepartment(id)` - Delete a department
- `getDepartmentById(id)` - Get a single department

### Subject API
- `getSubjects()` - Get all subjects
- `addSubject(data)` - Add a new subject
- `updateSubject(id, data)` - Update a subject
- `deleteSubject(id)` - Delete a subject
- `getSubjectById(id)` - Get a single subject
- `getSubjectsByDepartment(departmentId)` - Get subjects by department

### Teacher API
- `getTeachers()` - Get all teachers
- `addTeacher(data)` - Add a new teacher
- `updateTeacher(id, data)` - Update a teacher
- `deleteTeacher(id)` - Delete a teacher
- `getTeacherById(id)` - Get a single teacher
- `getTeachersByDepartment(departmentId)` - Get teachers by department
- `getTeacherAvailability(teacherId)` - Get teacher availability

### Timetable API
- `checkConflictsApi(payload)` - Check for conflicts
- `saveTimetableApi(payload)` - Save timetable
- `loadTimetableApi(className)` - Load timetable by class name
- `getAllTimetables()` - Get all timetables
- `deleteTimetable(id)` - Delete a timetable
- `updateTimetable(id, payload)` - Update a timetable
- `generateTimetable(payload)` - Generate automatic timetable
- `getTimetableByClass(classId)` - Get timetable by class ID
- `getTimetableByTeacher(teacherId)` - Get timetable by teacher ID

## Error Handling Best Practices

### Component Level
```javascript
const handleSubmit = async (data) => {
  try {
    await addClass(data);
    // Show success message
    toast.success('Class added successfully!');
  } catch (error) {
    // Show error message
    if (error.response?.status === 400) {
      toast.error('Invalid data provided');
    } else if (error.response?.status === 409) {
      toast.error('Class already exists');
    } else {
      toast.error('Failed to add class. Please try again.');
    }
  }
};
```

## Customization

### Change Base URL
Edit `apiClient.js`:
```javascript
const apiClient = axios.create({
  baseURL: "https://your-api-domain.com/api",
  // ... other options
});
```

### Add Custom Headers
```javascript
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8081/api",
  headers: {
    "Content-Type": "application/json",
    "X-Custom-Header": "value",
  },
});
```

### Modify Timeout
```javascript
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8081/api",
  timeout: 30000, // 30 seconds
});
```

## Notes
- All functions return Promises
- Errors are thrown and should be caught by the calling code
- Response data is automatically extracted (no need for `.data`)
- Backend must support the endpoints defined in each API file
