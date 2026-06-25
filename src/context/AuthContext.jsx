import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for existing session
        const storedUser = localStorage.getItem('timetable_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Helper to add log entry
    const logRegistrationAction = (username, action, details = {}) => {
        const logs = JSON.parse(localStorage.getItem('timetable_registration_logs') || '[]');
        logs.push({
            id: Date.now(),
            username,
            action, // 'PENDING', 'APPROVED', 'REJECTED'
            timestamp: new Date().toISOString(),
            ...details
        });
        localStorage.setItem('timetable_registration_logs', JSON.stringify(logs));
    };

    const register = (userData) => {
        const existingUsers = JSON.parse(localStorage.getItem('timetable_registered_users') || '[]');
        const pendingUsers = JSON.parse(localStorage.getItem('timetable_pending_users') || '[]');

        // Check if username exists in registered or pending
        if (existingUsers.some(u => u.username === userData.username) ||
            pendingUsers.some(u => u.username === userData.username)) {
            return { success: false, message: 'Username already exists' };
        }

        const newUser = { ...userData };
        pendingUsers.push(newUser);
        localStorage.setItem('timetable_pending_users', JSON.stringify(pendingUsers));

        // Log the Pending Request
        logRegistrationAction(userData.username, 'PENDING', { name: userData.name, role: userData.role, institute: userData.institute });

        // NO Auto login
        return { success: true, message: 'Registration successful. Waiting for Admin Approval.' };
    };

    const login = (username, password, institute) => {
        // 0. Check Pending Users First
        const pendingUsers = JSON.parse(localStorage.getItem('timetable_pending_users') || '[]');
        const isPending = pendingUsers.find(u => u.username === username && u.password === password);

        if (isPending) {
            return { success: false, message: 'Your account is pending admin approval.' };
        }

        // 1. Check Registered Users
        const registeredUsers = JSON.parse(localStorage.getItem('timetable_registered_users') || '[]');
        const foundUser = registeredUsers.find(u => u.username === username && u.password === password);

        if (foundUser) {
            // Verify Institute if the user has one registered
            if (foundUser.institute) {
                if (!institute || foundUser.institute.toLowerCase() !== institute.toLowerCase()) {
                    console.warn("Institute mismatch");
                    return { success: false, message: 'Institute mismatch' };
                }
            }

            setUser(foundUser);
            localStorage.setItem('timetable_user', JSON.stringify(foundUser));

            // Log Success
            logLoginAction(username, 'SUCCESS', { role: foundUser.role, institute: foundUser.institute });
            return { success: true };
        }

        // 2. Mock login logic (Fallbacks) - Bypass institute check for demo accounts
        let role = '';
        let name = '';

        if (username === 'admin' && password === 'admin123') {
            role = 'admin';
            name = 'Administrator';
        } else if (username === 'teacher' && password === 'teacher123') {
            role = 'teacher';
            name = 'John Doe';
        } else if (username === 'student' && password === 'student123') {
            role = 'student';
            name = 'Jane Student';
        } else {
            // Log Failed Attempt
            logLoginAction(username, 'FAILED', { reason: 'Invalid credentials' });
            return { success: false, message: 'Invalid credentials' };
        }

        const userData = { username, role, name, institute: institute || 'Demo Institute' };
        setUser(userData);
        localStorage.setItem('timetable_user', JSON.stringify(userData));

        // Log Success (Mock)
        logLoginAction(username, 'SUCCESS', { role, institute: userData.institute });
        return { success: true };
    };

    // Helper for login logs
    const logLoginAction = (username, status, details = {}) => {
        const logs = JSON.parse(localStorage.getItem('timetable_login_logs') || '[]');
        logs.push({
            id: Date.now(),
            username,
            status, // 'SUCCESS', 'FAILED'
            timestamp: new Date().toISOString(),
            ...details
        });
        localStorage.setItem('timetable_login_logs', JSON.stringify(logs));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('timetable_user');
    };

    const getPendingUsers = () => {
        return JSON.parse(localStorage.getItem('timetable_pending_users') || '[]');
    };

    const getRegistrationLogs = () => {
        return JSON.parse(localStorage.getItem('timetable_registration_logs') || '[]').reverse(); // Newest first
    };

    const approveUser = (username) => {
        const pendingUsers = JSON.parse(localStorage.getItem('timetable_pending_users') || '[]');
        const registeredUsers = JSON.parse(localStorage.getItem('timetable_registered_users') || '[]');

        const userIndex = pendingUsers.findIndex(u => u.username === username);
        if (userIndex > -1) {
            const userToApprove = pendingUsers[userIndex];

            // Move to registered
            registeredUsers.push(userToApprove);
            pendingUsers.splice(userIndex, 1);

            localStorage.setItem('timetable_pending_users', JSON.stringify(pendingUsers));
            localStorage.setItem('timetable_registered_users', JSON.stringify(registeredUsers));

            // Log Approval
            logRegistrationAction(username, 'APPROVED', { name: userToApprove.name, role: userToApprove.role, institute: userToApprove.institute });

            return true;
        }
        return false;
    };

    const rejectUser = (username) => {
        const pendingUsers = JSON.parse(localStorage.getItem('timetable_pending_users') || '[]');
        const userIndex = pendingUsers.findIndex(u => u.username === username);

        if (userIndex > -1) {
            const userToReject = pendingUsers[userIndex];
            // Remove from pending
            const newPending = pendingUsers.filter(u => u.username !== username);
            localStorage.setItem('timetable_pending_users', JSON.stringify(newPending)); // Correctly update local storage with filtered list

            // Log Rejection
            logRegistrationAction(username, 'REJECTED', { name: userToReject.name, role: userToReject.role, institute: userToReject.institute });
            return true;
        }
        return false;
    };

    const deleteUser = (username) => {
        // Run against both lists
        const pendingUsers = JSON.parse(localStorage.getItem('timetable_pending_users') || '[]');
        const registeredUsers = JSON.parse(localStorage.getItem('timetable_registered_users') || '[]');
        const logs = JSON.parse(localStorage.getItem('timetable_registration_logs') || '[]');

        const newPending = pendingUsers.filter(u => u.username !== username);
        const newRegistered = registeredUsers.filter(u => u.username !== username);

        // Remove ALL logs related to this user so they disappear from history completely
        const newLogs = logs.filter(l => l.username !== username);

        let changed = false;
        if (newPending.length !== pendingUsers.length ||
            newRegistered.length !== registeredUsers.length ||
            newLogs.length !== logs.length) {

            localStorage.setItem('timetable_pending_users', JSON.stringify(newPending));
            localStorage.setItem('timetable_registered_users', JSON.stringify(newRegistered));
            localStorage.setItem('timetable_registration_logs', JSON.stringify(newLogs));
            changed = true;
        }

        // Return true if we actively deleted something, or if user was just in logs (declined) and we cleaned it up
        return changed;
    };

    const getLoginLogs = () => {
        return JSON.parse(localStorage.getItem('timetable_login_logs') || '[]').reverse();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading, getPendingUsers, approveUser, rejectUser, getRegistrationLogs, deleteUser, getLoginLogs }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
