
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { UserRole } from '../types';
import { Icon, NoteIcon } from './Icon';
import { useTranslations } from '../contexts/LanguageContext';
import { ROLE_CONFIG, ROLE_OPTIONS } from '../constants';

interface HeaderProps {
    onSave: () => void;
    onExport: () => void;
    onToggleHistory: () => void;
    onToggleSettings: () => void;
    onToggleAIAssistant: () => void;
    onToggleKnowledgeExplorer: () => void;
    onToggleProjectsDashboard: () => void;
    onToggleWisdomVault: () => void;
    onToggleAbout: () => void;
    onDemoCalibration: () => void;
    hasAnalysis: boolean;
    activeRole: UserRole;
    onRoleSelect: (role: UserRole) => void;
    onNavigateBack?: () => void;
    currentToolName: string;
    onToggleScratchpad: () => void; // New prop
}

const HeaderButton: React.FC<{ onClick: () => void; title: string; children: React.ReactNode; disabled?: boolean }> = ({ onClick, title, children, disabled }) => (
    <motion.button
        onClick={onClick}
        title={title}
        disabled={disabled}
        whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
        whileTap={{ scale: 0.95 }}
        className="p-2 rounded-full text-zinc-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative group"
    >
        {children}
        <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-blue-500 group-hover:w-1/2 transition-all duration-300 -translate-x-1/2"></span>
    </motion.button>
);


export const Header: React.FC<HeaderProps> = ({
    onSave,
    onExport,
    onToggleHistory,
    onToggleSettings,
    onToggleAIAssistant,
    onToggleKnowledgeExplorer,
    onToggleProjectsDashboard,
    onToggleWisdomVault,
    onToggleAbout,
    hasAnalysis,
    activeRole,
    onRoleSelect,
    onNavigateBack,
    currentToolName,
    onToggleScratchpad
}) => {
    const { t } = useTranslations();
    const { scrollY } = useScroll();

    // Responsive header animations
    const height = useTransform(scrollY, [0, 50], [80, 64]);
    const backgroundColor = useTransform(scrollY, [0, 50], ["rgba(9, 9, 11, 0.5)", "rgba(9, 9, 11, 0.85)"]);
    const borderOpacity = useTransform(scrollY, [0, 50], [0, 0.1]);
    const blurAmount = useTransform(scrollY, [0, 50], [0, 12]);

    return (
        <motion.header
            style={{ 
                height, 
                backgroundColor, 
                borderBottom: "1px solid rgba(255, 255, 255, 0)", // Placeholder for dynamic border
                borderColor: `rgba(255, 255, 255, ${borderOpacity.get()})`,
                backdropFilter: `blur(${blurAmount.get()}px)`,
                WebkitBackdropFilter: `blur(${blurAmount.get()}px)`,
            }}
            className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 transition-all duration-300"
        >
            <div className="flex items-center gap-6">
                {onNavigateBack ? (
                     <motion.button 
                        onClick={onNavigateBack} 
                        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white group"
                        whileHover={{ x: -3 }}
                    >
                        <div className="p-1.5 rounded-full bg-zinc-800/50 group-hover:bg-blue-500/20 transition-colors">
                             <Icon className="w-4 h-4 group-hover:text-blue-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></Icon>
                        </div>
                        <span className="hidden md:inline font-medium">{t('backToHub')}</span>
                    </motion.button>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
                            <Icon className="w-5 h-5 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 1-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 1 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 1 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 1-3.09 3.09Z" /></Icon>
                        </div>
                        <span className="text-lg font-bold text-white tracking-tight">Astra</span>
                    </div>
                )}
                 
                 {currentToolName && (
                    <div className="h-6 w-px bg-white/10 mx-2 hidden md:block"></div>
                 )}
                 
                 <motion.h1 
                    layoutId="headerTitle"
                    className="text-base md:text-lg font-semibold text-white truncate max-w-[200px] md:max-w-md"
                >
                    {currentToolName}
                </motion.h1>
            </div>

            <div className="flex items-center gap-1 md:gap-2">
                <div className="hidden md:flex items-center gap-1">
                    <HeaderButton onClick={onSave} title={t('saveSession')} disabled={!hasAnalysis}>
                        <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></Icon>
                    </HeaderButton>
                    <HeaderButton onClick={onExport} title={t('exportResults')} disabled={!hasAnalysis}>
                        <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25" /></Icon>
                    </HeaderButton>
                    
                    <div className="w-px h-6 bg-white/10 mx-2"></div>
                    
                    <HeaderButton onClick={onToggleScratchpad} title={t('scratchpad_title')}>
                        <Icon className="w-5 h-5 text-yellow-400">{NoteIcon}</Icon>
                    </HeaderButton>

                    <HeaderButton onClick={onToggleWisdomVault} title={t('wisdomVaultHeaderButton')}>
                        <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></Icon>
                    </HeaderButton>
                    <HeaderButton onClick={onToggleAIAssistant} title={t('aiAssistantTitle')}>
                        <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 1-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 1 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 1 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 1-2.846.813a4.5 4.5 0 0 1-3.09 3.09Z" /></Icon>
                    </HeaderButton>
                    <HeaderButton onClick={onToggleKnowledgeExplorer} title={t('knowledgeExplorerTitle')}>
                        <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></Icon>
                    </HeaderButton>
                    <HeaderButton onClick={onToggleProjectsDashboard} title={t('projectsDashboardTitle')}>
                        <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" /></Icon>
                    </HeaderButton>

                    <div className="w-px h-6 bg-white/10 mx-2"></div>
                </div>
                
                {/* Mobile Menu Trigger could go here */}

                <HeaderButton onClick={onToggleHistory} title={t('historyPanelTitle')}>
                    <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></Icon>
                </HeaderButton>
                 <HeaderButton onClick={onToggleSettings} title={t('settingsPanelTitle')}>
                    <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></Icon>
                </HeaderButton>
                 <HeaderButton onClick={onToggleAbout} title={t('aboutModal.title')}>
                    <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></Icon>
                </HeaderButton>
                
                 <div className="w-px h-6 bg-white/10 mx-2 hidden md:block"></div>

                 <div className="relative group">
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 p-1.5 pr-4 bg-zinc-800/50 rounded-full border border-zinc-700 hover:border-blue-500/50 transition-colors backdrop-blur-md"
                    >
                        <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-white">
                             {ROLE_CONFIG[activeRole].icon}
                        </div>
                        <span className="text-sm font-semibold text-white hidden lg:inline">{t(`role_${activeRole}`)}</span>
                        <Icon className="w-3 h-3 text-zinc-400 hidden lg:inline"><path d="m19.5 8.25-7.5 7.5-7.5-7.5" /></Icon>
                    </motion.button>
                    <div className="absolute top-full right-0 mt-2 w-56 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-right scale-95 group-hover:scale-100">
                        <div className="p-2">
                            {ROLE_OPTIONS.map(role => (
                                <button
                                    key={role}
                                    onClick={() => onRoleSelect(role)}
                                    className={`w-full text-left flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                                        activeRole === role ? 'bg-blue-600/20 text-blue-300' : 'text-zinc-300 hover:bg-zinc-800/80'
                                    }`}
                                >
                                    <Icon className="w-5 h-5 opacity-70">{ROLE_CONFIG[role].icon}</Icon>
                                    <span>{t(`role_${role}`)}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                 </div>

            </div>
        </motion.header>
    );
};
