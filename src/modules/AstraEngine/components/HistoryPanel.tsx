

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// FIX: Corrected import paths
import { Session } from '../types';
import { Icon } from './Icon';
import { useTranslations } from '../contexts/LanguageContext';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: Session[];
  onLoad: (session: Session) => void;
  onDelete: (sessionId: string) => void;
  onPreview: (session: Session) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, sessions, onLoad, onDelete, onPreview }) => {
    const { t } = useTranslations();

    const panelVariants = {
        open: { x: 0 },
        closed: { x: '100%' },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/60 z-30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.aside
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 border-l border-white/10 shadow-2xl z-40 flex flex-col"
                        variants={panelVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <h2 className="text-lg font-bold text-white">{t('historyPanelTitle')}</h2>
                            <button onClick={onClose} className="p-1 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white">
                                <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></Icon>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            {sessions.length > 0 ? (
                                <motion.ul 
                                    className="space-y-3"
                                    initial="hidden"
                                    animate="visible"
                                    variants={{ visible: { transition: { staggerChildren: 0.05 }}}}
                                >
                                    {sessions.map(session => (
                                        <motion.li
                                            key={session.id}
                                            variants={itemVariants}
                                            className="bg-zinc-900/70 p-4 rounded-lg border border-zinc-800"
                                        >
                                            <p className="font-semibold text-blue-400 truncate" title={session.title}>{session.title}</p>
                                            <p className="text-xs text-zinc-400 mb-3">{new Date(session.timestamp).toLocaleString()}</p>
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => onPreview(session)} title={t('previewButtonTooltip')} className="text-sm bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded-md transition-colors text-zinc-300 flex items-center gap-1.5">
                                                     <Icon className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></Icon>
                                                     {t('previewSession')}
                                                </button>
                                                <button onClick={() => onLoad(session)} className="text-sm bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-md transition-colors text-white">{t('loadSession')}</button>
                                                <button onClick={() => onDelete(session.id)} className="text-sm text-red-400 hover:bg-red-400/10 p-1.5 rounded-md transition-colors">
                                                     <Icon className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></Icon>
                                                </button>
                                            </div>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            ) : (
                                <div className="text-center text-zinc-500 py-10">
                                    <Icon className="w-12 h-12 mx-auto mb-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></Icon>
                                    <p>{t('noHistory')}</p>
                                </div>
                            )}
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};