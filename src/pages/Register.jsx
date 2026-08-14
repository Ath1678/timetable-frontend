import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Lock, Mail, ArrowRight, Shield, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import SuccessModal from '../components/SuccessModal';

const Register = () => {
    const [formData, setFormData] = useState({
        institute: '',
        name: '',
        username: '',
        password: '',
        role: 'student' // Default role
    });
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.institute || !formData.name || !formData.username || !formData.password) {
            setError('All fields are required');
            return;
        }

        const dataToSend = {
            ...formData,
            instituteCode: formData.role !== 'admin' ? formData.institute : '',
            institute: formData.role === 'admin' ? formData.institute : ''
        };

        const result = await register(dataToSend);
        if (result.success) {
            setShowModal(true);
        } else {
            setError(result.message || 'Registration failed');
        }
    };

    const handleSuccessConfirm = () => {
        setShowModal(false);
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

            <SuccessModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleSuccessConfirm}
                title="Registration Successful!"
                message="Your account has been created successfully. It is currently pending Admin approval. You will be able to login once approved."
                confirmText="Go to Login"
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20"
            >
                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <div className="bg-violet-600 p-3 rounded-full shadow-lg">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Create Account</h2>
                    <p className="text-center text-gray-500 mb-6">Join the Timetable Management System</p>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Institute Name or Code */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 ml-1">
                                {formData.role === 'admin' ? 'Institute Name' : 'Institute Join Code'}
                            </label>
                            <div className="relative group mt-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Building className="h-5 w-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={formData.institute}
                                    onChange={(e) => setFormData({ ...formData, institute: e.target.value })}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white/50 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                                    placeholder={formData.role === 'admin' ? "e.g. MIT, Stanford" : "Enter 6-digit Join Code"}
                                    required
                                />
                            </div>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 ml-1">Full Name</label>
                            <div className="relative group mt-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white/50 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        {/* Username */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 ml-1">Username</label>
                            <div className="relative group mt-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white/50 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                                    placeholder="johndoe"
                                    required
                                />
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 ml-1">Role</label>
                            <div className="relative group mt-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Shield className="h-5 w-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                                </div>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white/50 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
                            <div className="relative group mt-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white/50 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                                    placeholder="Create a password"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all transform hover:scale-[1.02]"
                        >
                            create Account
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-violet-600 hover:text-violet-500">
                                Sign in here
                            </Link>
                        </p>
                    </div>

                </div>
            </motion.div>
        </div>
    );
};

export default Register;
