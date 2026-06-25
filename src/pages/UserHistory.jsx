import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Shield, Trash2, Key, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import ConfirmationModal from '../components/ConfirmationModal';

export default function UserHistory() {
    const { getRegistrationLogs, getPendingUsers, deleteUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { addToast } = useToast();
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, username: null });

    // Combine logs and current state to get a comprehensive view
    useEffect(() => {
        const fetchData = () => {
            const logs = getRegistrationLogs() || [];
            const pending = getPendingUsers() || [];
            const registered = JSON.parse(localStorage.getItem('timetable_registered_users') || '[]');

            // We want to show a unique list of users with their Current Status.
            // 1. Map all usernames from logs, pending, and registered.
            const allUsernames = new Set([
                ...logs.map(l => l.username),
                ...pending.map(u => u.username),
                ...registered.map(u => u.username)
            ]);

            const consolidatedUsers = Array.from(allUsernames).map(username => {
                // Determine Current Status
                const isPending = pending.find(u => u.username === username);
                const isRegistered = registered.find(u => u.username === username);
                const latestLog = logs.find(l => l.username === username); // Logs are reversed (newest first)

                let status = 'UNKNOWN';
                let userData = isRegistered || isPending || (latestLog ? { ...latestLog, password: '---' } : {});

                if (isRegistered) status = 'APPROVED';
                else if (isPending) status = 'PENDING';
                else if (latestLog && latestLog.action === 'REJECTED') status = 'REJECTED';
                else if (latestLog && latestLog.action === 'DELETED') status = 'DELETED';

                return {
                    username,
                    name: userData.name || latestLog?.name || 'Unknown',
                    role: userData.role || latestLog?.role || 'student',
                    institute: userData.institute || latestLog?.institute || 'N/A',
                    password: userData.password || 'Has been deleted/rejected', // Show password if active
                    status,
                    lastActionTime: latestLog?.timestamp || null
                };
            });

            // Filter: If user wants "history of pending after approval dont show pending", 
            // the consolidated list naturally does this by picking the definitive status.
            // We process each username exactly once.

            setUsers(consolidatedUsers.filter(u => u.status !== 'DELETED')); // Optionally hide deleted users? User kept permission to remove login.
        };

        fetchData();
    }, [getRegistrationLogs, getPendingUsers]);

    const handleDeleteClick = (username) => {
        setDeleteModal({ isOpen: true, username });
    };

    const confirmDelete = () => {
        if (deleteUser(deleteModal.username)) {
            addToast('User deleted successfully', 'success');
            setDeleteModal({ isOpen: false, username: null });
            window.location.reload();
        } else {
            addToast('Failed to delete user', 'error');
        }
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.institute?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 min-h-screen bg-slate-900 relative overflow-hidden">
            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, username: null })}
                onConfirm={confirmDelete}
                title="Delete User?"
                message={`Are you sure you want to permanently delete user "${deleteModal.username}"? This action cannot be undone.`}
            />

            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Shield className="w-8 h-8 text-violet-400" />
                            User Management
                        </h1>
                        <p className="text-slate-400 mt-1">Manage access, view passwords, and track user history.</p>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-[#1a1c29] border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500 transition-colors w-64"
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#1a1c29]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black/20 text-slate-400 text-sm uppercase tracking-wider">
                                    <th className="p-4 font-medium">User</th>
                                    <th className="p-4 font-medium">Role</th>
                                    <th className="p-4 font-medium">Institute</th>
                                    <th className="p-4 font-medium flex items-center gap-1"><Key className="w-3 h-3" /> Password</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium">Last Action</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                                    <tr key={user.username} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold border border-white/10">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-white font-medium">{user.name}</div>
                                                    <div className="text-slate-500 text-xs">@{user.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                user.role === 'teacher' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' :
                                                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-300">{user.institute}</td>
                                        <td className="p-4">
                                            <div className="font-mono text-amber-300 bg-amber-500/10 px-2 py-1 rounded w-fit border border-amber-500/20 select-all">
                                                {user.password}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {user.status === 'APPROVED' && <span className="flex items-center gap-1.5 text-emerald-400 font-medium"><CheckCircle className="w-4 h-4" /> Active</span>}
                                            {user.status === 'PENDING' && <span className="flex items-center gap-1.5 text-amber-400 font-medium"><Clock className="w-4 h-4 animate-pulse" /> Pending</span>}
                                            {user.status === 'REJECTED' && <span className="flex items-center gap-1.5 text-red-400 font-medium"><XCircle className="w-4 h-4" /> Declined</span>}
                                        </td>
                                        <td className="p-4 text-slate-500">
                                            {user.lastActionTime ? new Date(user.lastActionTime).toLocaleString() : '-'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleDeleteClick(user.username)}
                                                title="Revoke Access / Delete"
                                                className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-slate-500">
                                            No users found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
