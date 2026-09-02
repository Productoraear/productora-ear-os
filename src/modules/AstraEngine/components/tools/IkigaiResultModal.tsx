import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslations } from '../../contexts/LanguageContext';
import { Icon } from '../Icon';

interface IkigaiResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    result: string;
}

export const IkigaiResultModal: React.FC<IkigaiResultModalProps> = ({ isOpen, onClose, result }) => {
    const { t } = useTranslations();
    const [goals, setGoals] = React.useState('');

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
                        className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-3xl h-full max-h-[90vh] flex flex-col overflow-hidden"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="flex-shrink-0 p-6 border-b border-white/10 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-white">{t('ikigai_result_modal_title')}</h2>
                            </div>
                            <button onClick={onClose} className="p-1 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white">
                                <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></Icon>
                            </button>
                        </header>
                        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
                            <div className="prose prose-sm prose-invert prose-zinc max-w-none">
                                {typeof result === 'string' ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
                                ) : (
                                    <p className="text-red-400">{t('ikigai_format_error')}</p>
                                )}
                            </div>
                            <div className="border-t border-zinc-700 pt-6">
                                <h3 className="text-lg font-bold text-blue-300 mb-2">{t('ikigai_strategic_application_title')}</h3>
                                <p className="text-sm text-zinc-400 mb-4">{t('ikigai_smart_goals_prompt')}</p>
                                <textarea
                                    value={goals}
                                    onChange={(e) => setGoals(e.target.value)}
                                    placeholder={t('ikigai_smart_goals_placeholder')}
                                    className="w-full h-32 p-3 bg-zinc-800/50 border border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500 transition-colors"
                                />
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