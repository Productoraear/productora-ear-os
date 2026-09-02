import React from 'react';
import { motion } from 'framer-motion';
import { UserRole } from '../types';
import { ROLE_CONFIG, ROLE_OPTIONS } from '../constants';
import { useTranslations } from '../contexts/LanguageContext';
import { Icon } from './Icon';

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void;
}

const RoleCard: React.FC<{ role: UserRole; onSelect: () => void; delay: number }> = ({ role, onSelect, delay }) => {
    const { t } = useTranslations();
    const config = ROLE_CONFIG[role];
    
    return (
        <motion.button
            onClick={onSelect}
            className="group relative w-full h-full text-left p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-zinc-800/60 hover:border-blue-500/50"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: 'easeOut' }}
            whileHover={{ y: -5 }}
        >
            <div className="relative z-10">
                <div className="mb-4 w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 group-hover:bg-zinc-700/50 transition-colors">
                    <Icon className="w-7 h-7 text-white">{config.icon}</Icon>
                </div>
                <h3 className="text-xl font-bold text-white">{t(config.labelKey)}</h3>
                <p className="text-zinc-400 mt-1 text-sm">{t(config.descriptionKey)}</p>
            </div>
            <div className="absolute -bottom-10 -right-10 text-zinc-800 group-hover:text-blue-500/10 transition-colors duration-500 opacity-20">
                 <div className="scale-[4]">{config.icon}</div>
            </div>
        </motion.button>
    );
};

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelect }) => {
    const { t } = useTranslations();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full p-8 bg-zinc-950 overflow-y-auto">
            <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400 tracking-tighter mb-4">
                    {t('welcomeTitle')}
                </h1>
                <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-light">
                    {t('roleSelectionPrompt')}
                </p>
            </motion.div>
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ROLE_OPTIONS.map((role, index) => (
                    <RoleCard key={role} role={role} onSelect={() => onRoleSelect(role)} delay={0.3 + index * 0.1} />
                ))}
            </div>
        </div>
    );
};
