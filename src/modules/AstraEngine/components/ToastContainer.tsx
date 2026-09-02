
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './Icon';

// Simple Event Bus for Toasts
export interface ToastMessage {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

type ToastListener = (toast: ToastMessage) => void;
let listeners: ToastListener[] = [];

export const toast = {
    success: (msg: string) => emit('success', msg),
    error: (msg: string) => emit('error', msg),
    info: (msg: string) => emit('info', msg),
    warning: (msg: string) => emit('warning', msg),
};

const emit = (type: ToastMessage['type'], message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    listeners.forEach(l => l({ id, message, type }));
};

export const ToastContainer: React.FC = () => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    useEffect(() => {
        const handler = (newToast: ToastMessage) => {
            setToasts(prev => [...prev, newToast]);
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== newToast.id));
            }, 5000);
        };
        
        listeners.push(handler);
        return () => {
            listeners = listeners.filter(l => l !== handler);
        };
    }, []);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="fixed top-24 right-6 z-[70] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {toasts.map(t => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
                        layout
                        className="pointer-events-auto min-w-[300px] max-w-sm bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 shadow-2xl rounded-lg overflow-hidden flex"
                    >
                        <div className={`w-1.5 flex-shrink-0 ${
                            t.type === 'success' ? 'bg-green-500' :
                            t.type === 'error' ? 'bg-red-500' :
                            t.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1 p-3 flex items-start gap-3">
                            <div className={`mt-0.5 flex-shrink-0 ${
                                t.type === 'success' ? 'text-green-400' :
                                t.type === 'error' ? 'text-red-400' :
                                t.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                            }`}>
                                {t.type === 'success' && <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></Icon>}
                                {t.type === 'error' && <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></Icon>}
                                {t.type === 'info' && <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></Icon>}
                                {t.type === 'warning' && <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></Icon>}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-white break-words">{t.message}</p>
                            </div>
                            <button onClick={() => removeToast(t.id)} className="text-zinc-500 hover:text-white transition-colors flex-shrink-0">
                                <Icon className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></Icon>
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
