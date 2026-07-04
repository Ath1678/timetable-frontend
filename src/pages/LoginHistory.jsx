import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { History, Search, XCircle, CheckCircle } from 'lucide-react';

export default function LoginHistory() {
    const { getLoginLogs } = useAuth();
    const [logs, setLogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (getLoginLogs) {
            setLogs(getLoginLogs());
        }
    }, [getLoginLogs]);

    const filteredLogs = logs.filter(log =>
        log.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.institute?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 min-h-screen bg-slate-900 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <History className="w-8 h-8 text-blue-400" />
                            Login History
                        </h1>
                        <p className="text-slate-400 mt-1">Track system access and security events.</p>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-[#1a1c29] border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors w-64"
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
                                    <th className="p-4 font-medium">Timestamp</th>
                                    <th className="p-4 font-medium">Username</th>
                                    <th className="p-4 font-medium">Role</th>
                                    <th className="p-4 font-medium">Institute</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-slate-400 font-mono text-xs">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <span className="text-white font-medium">@{log.username}</span>
                                        </td>
                                        <td className="p-4">
                                            {log.role ? (
                                                <span className="text-xs uppercase bg-white/5 px-2 py-1 rounded text-slate-300 border border-white/5">{log.role}</span>
                                            ) : (
                                                <span className="text-slate-600">-</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-slate-400">{log.institute || '-'}</td>
                                        <td className="p-4">
                                            {log.status === 'SUCCESS' ? (
                                                <span className="flex items-center gap-1.5 text-emerald-400 font-medium bg-emerald-500/10 px-2 py-1 rounded w-fit">
                                                    <CheckCircle className="w-3 h-3" /> Success
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-red-400 font-medium bg-red-500/10 px-2 py-1 rounded w-fit">
                                                    <XCircle className="w-3 h-3" /> Failed
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-slate-500 text-xs max-w-xs truncate">
                                            {log.reason || '-'}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-slate-500">
                                            No login history found.
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
