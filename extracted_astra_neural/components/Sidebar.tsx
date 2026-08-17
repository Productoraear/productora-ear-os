
import React from 'react';
import { motion } from 'framer-motion';
import { AppView } from '../types';
import { useTranslations } from '../contexts/LanguageContext';
import { Icon } from './Icon';

interface SidebarProps {
    currentView: AppView;
    onViewChange: (view: AppView) => void;
    onOpenProjects: () => void;
    onOpenWisdom: () => void;
    isZenMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
    currentView, 
    onViewChange, 
    onOpenProjects, 
    onOpenWisdom,
    isZenMode 
}) => {
    const { t } = useTranslations();

    if (isZenMode) return null;

    const navItems = [
        { id: AppView.DASHBOARD, label: t('nav_dashboard'), icon: <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /> },
        { id: AppView.STRATEGIC_JOURNEY, label: t('nav_journey'), icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /> },
        { id: AppView.TOOLKIT_HUB, label: t('nav_toolkit'), icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-10.5v10.5" /> },
    ];

    const actionItems = [
        { id: 'projects', label: t('nav_projects'), icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />, onClick: onOpenProjects },
        { id: 'wisdom', label: t('nav_wisdom'), icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />, onClick: onOpenWisdom },
    ];

    return (
        <aside className="w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col h-full z-40 relative">
            <div className="p-6 border-b border-zinc-900">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
                        <Icon className="w-5 h-5 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 1-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 1 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 1 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 1-3.09 3.09Z" /></Icon>
                    </div>
                    <span className="text-xl font-bold text-white tracking-tighter">ASTRA OS</span>
                </div>
            </div>

            <div className="flex-1 py-6 px-4 space-y-8 overflow-y-auto custom-scrollbar">
                <div className="space-y-1">
                    <p className="px-3 text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-4">Navegación</p>
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${
                                currentView === item.id 
                                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                                    : 'text-zinc-500 hover:text-white hover:bg-zinc-900 border border-transparent'
                            }`}
                        >
                            <Icon className={`w-5 h-5 transition-colors ${currentView === item.id ? 'text-blue-400' : 'text-zinc-600 group-hover:text-zinc-300'}`}>
                                {item.icon}
                            </Icon>
                            <span className="text-sm font-medium">{item.label}</span>
                            {currentView === item.id && (
                                <motion.div 
                                    layoutId="activeNav"
                                    className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                />
                            )}
                        </button>
                    ))}
                </div>

                <div className="space-y-1">
                    <p className="px-3 text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-4">Módulos</p>
                    {actionItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={item.onClick}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all duration-300 group border border-transparent"
                        >
                            <Icon className="w-5 h-5 text-zinc-600 group-hover:text-zinc-300">
                                {item.icon}
                            </Icon>
                            <span className="text-sm font-medium">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-6 border-t border-zinc-900">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-700 uppercase tracking-widest">
                    <span>Sincronizado</span>
                    <span className="text-emerald-500 animate-pulse">Online</span>
                </div>
            </div>
        </aside>
    );
};
