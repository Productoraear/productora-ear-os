
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './Icon';
import { useTranslations } from '../contexts/LanguageContext';
import { loginWithCredential, registerCredential, isDeviceRegistered } from '../services/biometricService';
import { toast } from './ToastContainer';

interface BiometricLoginProps {
    onAuthenticated: () => void;
}

export const BiometricLogin: React.FC<BiometricLoginProps> = ({ onAuthenticated }) => {
    const { t } = useTranslations();
    const [isRegistered, setIsRegistered] = useState(isDeviceRegistered());
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        const success = await loginWithCredential();
        if (success) {
            toast.success(t('auth_login_success'));
            setTimeout(onAuthenticated, 800); // Small delay for effect
        } else {
            toast.error(t('auth_error_verify'));
            setIsLoading(false);
        }
    };

    const handleRegister = async () => {
        setIsLoading(true);
        const success = await registerCredential("Comandante");
        if (success) {
            toast.success(t('auth_register_success'));
            setIsRegistered(true);
            setIsLoading(false);
        } else {
            toast.error(t('auth_error_browser'));
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px]"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 5, repeat: Infinity }}
                />
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-sm p-8 bg-zinc-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex flex-col items-center text-center"
            >
                <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6 border border-zinc-700 shadow-lg shadow-blue-900/20">
                    <Icon className="w-10 h-10 text-blue-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565m4.386 8.295A11.209 11.209 0 0 1 8.25 19.5a3.75 3.75 0 0 1-7.5 0" />
                    </Icon>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">{t('auth_title')}</h2>
                <p className="text-sm text-zinc-400 mb-8">{t('auth_instruction')}</p>

                {isRegistered ? (
                    <button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <Icon className="w-5 h-5 animate-spin"><path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" fill="currentColor"/></Icon>
                        ) : (
                            <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></Icon>
                        )}
                        {t('auth_login_button')}
                    </button>
                ) : (
                    <button
                        onClick={handleRegister}
                        disabled={isLoading}
                        className="w-full py-4 bg-zinc-800 border border-zinc-700 text-white font-bold rounded-xl hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
                    >
                        {t('auth_register_button')}
                    </button>
                )}

                <button 
                    onClick={onAuthenticated} 
                    className="mt-6 text-xs text-zinc-600 hover:text-zinc-400 underline"
                >
                    {t('auth_bypass')}
                </button>
            </motion.div>
        </div>
    );
};
