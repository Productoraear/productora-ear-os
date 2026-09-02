import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './Icon';
import { useTranslations } from '../contexts/LanguageContext';
import { TOOL_REGISTRY } from '../utils/toolRegistry';
import { UserRole } from '../types';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    onLaunchTool: (toolId: string) => void;
    userRole: UserRole | null;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onLaunchTool, userRole }) => {
    const { t } = useTranslations();
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            setQuery('');
        }
    }, [isOpen]);

    // Filter tools based on role and query
    const filteredTools = Object.entries(TOOL_REGISTRY)
        .filter(([, config]) => !userRole || config.roles.includes(userRole))
        .filter(([key, config]) => {
            if (!query) return true; // Show all if empty
            const title = t(config.titleKey).toLowerCase();
            const desc = t(config.descriptionKey).toLowerCase();
            const search = query.toLowerCase();
            return title.includes(search) || desc.includes(search);
        });

    // Limit results for performance
    const displayTools = filteredTools.slice(0, 8);

    // Reset selection when query changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % displayTools.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + displayTools.length) % displayTools.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (displayTools[selectedIndex]) {
                    onLaunchTool(displayTools[selectedIndex][0]);
                    onClose();
                }
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, displayTools, selectedIndex, onLaunchTool, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-start justify-center pt-[15vh]"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: -20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: -20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="w-full max-w-xl bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center px-4 py-3 border-b border-white/5 bg-white/5">
                            <Icon className="w-5 h-5 text-zinc-400 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></Icon>
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder={t('command_placeholder') || "Buscar herramienta..."}
                                className="flex-1 bg-transparent border-none outline-none text-white placeholder-zinc-500 text-lg font-medium"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                            />
                            <div className="flex gap-1.5">
                                <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-mono font-medium text-zinc-400 bg-zinc-800/50 rounded border border-zinc-700">ESC</kbd>
                            </div>
                        </div>
                        
                        <div className="max-h-[60vh] overflow-y-auto p-2">
                            {displayTools.length === 0 ? (
                                <div className="p-8 text-center text-zinc-500 text-sm">
                                    No se encontraron resultados para "{query}".
                                </div>
                            ) : (
                                <ul className="space-y-1">
                                    {displayTools.map(([key, config], index) => (
                                        <li key={key}>
                                            <button
                                                onClick={() => { onLaunchTool(key); onClose(); }}
                                                onMouseEnter={() => setSelectedIndex(index)}
                                                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-150 text-left group ${
                                                    index === selectedIndex 
                                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' 
                                                        : 'text-zinc-300 hover:bg-zinc-800/50'
                                                }`}
                                            >
                                                <div className={`p-2 rounded-lg transition-colors ${
                                                    index === selectedIndex ? 'bg-white/20' : 'bg-zinc-800 border border-zinc-700 group-hover:border-zinc-600'
                                                }`}>
                                                    <Icon className={`w-5 h-5 ${index === selectedIndex ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>{config.icon}</Icon>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`font-semibold text-sm truncate ${index === selectedIndex ? 'text-white' : 'text-zinc-200'}`}>{t(config.titleKey)}</p>
                                                    <p className={`text-xs truncate ${index === selectedIndex ? 'text-blue-100' : 'text-zinc-500'}`}>{t(config.descriptionKey)}</p>
                                                </div>
                                                {index === selectedIndex && (
                                                    <Icon className="w-4 h-4 opacity-70 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></Icon>
                                                )}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        
                        <div className="px-4 py-2 bg-zinc-950/50 border-t border-white/5 text-[10px] text-zinc-500 flex justify-between items-center">
                            <span><strong>Astra OS</strong> v10.0 KERNEL</span>
                            <div className="flex gap-3">
                                <span className="flex items-center gap-1"><kbd className="font-mono bg-zinc-800 px-1 rounded text-zinc-400">↑↓</kbd> navegar</span>
                                <span className="flex items-center gap-1"><kbd className="font-mono bg-zinc-800 px-1 rounded text-zinc-400">↵</kbd> seleccionar</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};