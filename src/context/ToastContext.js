import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "info") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 5s
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed inset-0 pointer-events-none z-50 flex flex-col items-center md:items-end md:justify-end p-4">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            layout
                            className={`
                                pointer-events-auto
                                w-full max-w-sm md:max-w-md
                                flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl border border-white/10
                                mt-2 md:mt-0 md:mb-2
                                ${toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                                ${toast.type === 'error' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : ''}
                                ${toast.type === 'warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
                                ${toast.type === 'info' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                            `}
                        >
                            <div className="mt-0.5">
                                {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
                                {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
                                {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400" />}
                                {toast.type === 'info' && <Info className="w-5 h-5" />}
                            </div>
                            <span className="font-medium text-sm">{toast.message}</span>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="ml-2 hover:bg-white/10 p-1 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 opacity-70" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
