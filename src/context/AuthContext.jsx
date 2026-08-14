import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8081';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user session from localStorage
        const storedUser = localStorage.getItem('timetable_user');
        const token = localStorage.getItem('timetable_token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const register = async (userData) => {
        try {
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: userData.username,
                    password: userData.password,
                    role: userData.role,
                    instituteName: userData.institute || '',
                    instituteCode: userData.instituteCode || ''
                })
            });
            const data = await res.text();
            
            if (!res.ok) {
                return { success: false, message: data || 'Registration failed' };
            }
            
            // Try parsing JSON if backend returns it
            try {
                const json = JSON.parse(data);
                return { success: true, message: json.message || 'Registration successful. Waiting for Admin Approval.' };
            } catch {
                return { success: true, message: data };
            }
        } catch (err) {
            return { success: false, message: 'Server connection error.' };
        }
    };

    const login = async (username, password, institute) => {
        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            if (!res.ok) {
                // Read text to capture Spring Boot error message safely
                const errorText = await res.text();
                return { success: false, message: errorText || 'Invalid credentials or pending approval' };
            }
            
            const data = await res.json();
            
            const userData = {
                username: username,
                role: data.role ? data.role.replace('ROLE_', '').toLowerCase() : '',
                instituteId: data.instituteId,
                name: username // Backend doesn't return full name currently
            };
            
            setUser(userData);
            localStorage.setItem('timetable_user', JSON.stringify(userData));
            localStorage.setItem('timetable_token', data.token);
            
            return { success: true };
        } catch (err) {
            return { success: false, message: 'Server connection error.' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('timetable_user');
        localStorage.removeItem('timetable_token');
    };

    // --- ADMIN METHODS ---
    const getAuthHeaders = () => {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('timetable_token')}`
        };
    };

    const getPendingUsers = useCallback(async () => {
        if (!user || !user.instituteId) return [];
        try {
            const res = await fetch(`${API_BASE}/api/admin/pending-users?instituteId=${user.instituteId}`, {
                headers: getAuthHeaders()
            });
            if (res.ok) {
                return await res.json();
            }
            return [];
        } catch (err) {
            console.error("Failed to fetch pending users", err);
            return [];
        }
    }, [user]);

    const approveUser = async (userId) => {
        try {
            const res = await fetch(`${API_BASE}/api/admin/approve/${userId}`, {
                method: 'POST',
                headers: getAuthHeaders()
            });
            return res.ok;
        } catch (err) {
            return false;
        }
    };

    const rejectUser = async (userId) => {
        try {
            const res = await fetch(`${API_BASE}/api/admin/reject/${userId}`, {
                method: 'POST',
                headers: getAuthHeaders()
            });
            return res.ok;
        } catch (err) {
            return false;
        }
    };

    // Fallbacks for mocked logs
    const getRegistrationLogs = () => { return []; };
    const deleteUser = (username) => { return false; };
    const getLoginLogs = () => { return []; };

    return (
        <AuthContext.Provider value={{ 
            user, login, logout, register, loading, 
            getPendingUsers, approveUser, rejectUser, 
            getRegistrationLogs, deleteUser, getLoginLogs 
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
