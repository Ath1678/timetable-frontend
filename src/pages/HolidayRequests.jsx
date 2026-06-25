import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function HolidayRequests() {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [requests, setRequests] = useState([]);
    const [newRequest, setNewRequest] = useState({ date: '', reason: '' });
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const storedRequests = JSON.parse(localStorage.getItem('timetable_holiday_requests') || '[]');
        setRequests(storedRequests);
    }, []);

    const saveRequests = (newRequests) => {
        setRequests(newRequests);
        localStorage.setItem('timetable_holiday_requests', JSON.stringify(newRequests));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newRequest.date || !newRequest.reason) {
            addToast('Please fill in all fields', 'error');
            return;
        }
        const request = {
            id: Date.now(),
            teacher: user.name || 'Current Teacher',
            date: newRequest.date,
            reason: newRequest.reason,
            status: 'Pending'
        };
        saveRequests([request, ...requests]);
        setNewRequest({ date: '', reason: '' });
        addToast('Holiday request submitted successfully', 'success');
    };

    const handleAction = (id, action) => {
        saveRequests(requests.map(req =>
            req.id === id ? { ...req, status: action === 'approve' ? 'Approved' : 'Rejected' } : req
        ));
        addToast(`Request ${action === 'approve' ? 'Approved' : 'Rejected'}`, action === 'approve' ? 'success' : 'info');
    };

    const filteredRequests = requests.filter(req => {
        if (user.role === 'teacher') {
            return req.teacher === (user.name || 'Current Teacher') || req.teacher === 'John Doe'; // Mock match
        }
        if (filter === 'All') return true;
        return req.status === filter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'Rejected': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
            default: return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
        }
    };

    return (
        <div className="p-8 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-8">

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Holiday Requests</h1>
                        <p className="text-slate-400">Manage leave applications and time off.</p>
                    </div>
                    {user.role === 'admin' && (
                        <div className="flex gap-2">
                            {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Form Section - Only for Teachers */}
                    {user.role === 'teacher' && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass p-6 rounded-2xl border border-white/5 bg-[#13141f] h-fit sticky top-8"
                        >
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-violet-400" /> New Request
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
                                    <input
                                        type="date"
                                        value={newRequest.date}
                                        onChange={(e) => setNewRequest({ ...newRequest, date: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Reason</label>
                                    <textarea
                                        rows="4"
                                        value={newRequest.reason}
                                        onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                                        placeholder="Why do you need a holiday?"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    Submit Request
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* List Section - Full width for Admin, 2/3 for Teacher */}
                    <div className={`${user.role === 'teacher' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                        <div className="space-y-4">
                            {filteredRequests.length === 0 ? (
                                <div className="text-center py-20 text-slate-500">No requests found.</div>
                            ) : (
                                filteredRequests.map((req) => (
                                    <motion.div
                                        key={req.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                                    >
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-semibold text-white">{req.teacher}</h3>
                                                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(req.status)} flex items-center gap-1`}>
                                                    {req.status === 'Pending' && <Clock className="w-3 h-3" />}
                                                    {req.status === 'Approved' && <CheckCircle className="w-3 h-3" />}
                                                    {req.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                                                    {req.status}
                                                </div>
                                            </div>
                                            <p className="text-slate-400 text-sm flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-violet-400" /> {req.date}
                                                <span className="w-1 h-1 bg-slate-600 rounded-full" />
                                                <span>{req.reason}</span>
                                            </p>
                                        </div>

                                        {user.role === 'admin' && req.status === 'Pending' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleAction(req.id, 'approve')}
                                                    className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                                    title="Approve"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(req.id, 'reject')}
                                                    className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                                                    title="Reject"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
