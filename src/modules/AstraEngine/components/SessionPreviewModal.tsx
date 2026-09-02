import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Session } from '../types';
import { useTranslations } from '../contexts/LanguageContext';
import { Icon } from './Icon';

interface SessionPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    session: Session;
}

export const SessionPreviewModal: React.FC<SessionPreviewModalProps> = ({ isOpen, onClose, session }) => {
    const { t } = useTranslations();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl h-full max-h-[80vh] flex flex-col overflow-hidden"
                        // FIX: Corrected syntax for the initial animation property.
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="flex-shrink-0 p-6 border-b border-white/10 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-white truncate" title={session.title}>{session.title}</h2>
                                <p className="text-sm text-zinc-400">{new Date(session.timestamp).toLocaleString()}</p>
                            </div>
                            <button onClick={onClose} className="p-1 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white">
                                <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></Icon>
                            </button>
                        </header>
                        <main className="flex-1 p-6 space-y-4 overflow-y-auto">
                            <div>
                                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">{t('problemTitle')}</h3>
                                <p className="text-zinc-200 bg-black/20 p-3 rounded-md border border-zinc-700">{session.params?.problem || t('noData')}</p>
                            </div>
                             {session.synthesis?.executiveSummary && (
                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">{t('executiveSummary')}</h3>
                                    <p className="text-zinc-300 text-sm leading-relaxed">{session.synthesis.executiveSummary}</p>
                                </div>
                            )}
                            {session.synthesis?.strategicRecommendation && (
                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">{t('strategicRecommendation')}</h3>
                                    <p className="font-semibold text-blue-300">{session.synthesis.strategicRecommendation.strategy}</p>
                                </div>
                            )}

                             <div>
                                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">{t('personaTitleMulti')}</h3>
                                <div className="flex flex-wrap gap-2">
                                {(session.params?.personas?.length ?? 0) > 0 ? (
                                    session.params?.personas?.map(p => (
                                        <span key={p} className="text-xs bg-zinc-700/50 text-zinc-300 px-2.5 py-1 rounded-full">{t(`personaName${p}`)}</span>
                                    ))
                                ) : (
                                    <p className="text-sm text-zinc-500">{t('noData')}</p>
                                )}
                                </div>
                            </div>
                        </main>
                         <footer className="p-4 bg-zinc-950/50 border-t border-white/10 flex justify-end">
                            <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-zinc-200 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                                {t('closeButton')}
                            </button>
                        </footer>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};