import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Icon } from './Icon';
import { useTranslations } from '../contexts/LanguageContext';

interface HumanCalibrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    context: string;
    question: string;
    options: string[];
    onCalibrate: (selection: string) => void;
}

const HumanCalibrationModal: React.FC<HumanCalibrationModalProps> = ({
    isOpen,
    onClose,
    context,
    question,
    options,
    onCalibrate
}) => {
    const { t } = useTranslations();
    const [selection, setSelection] = useState<string | null>(null);

    const handleCalibrate = () => {
        if (selection) {
            onCalibrate(selection);
            setSelection(null); // Reset selection
            onClose();
        }
    };
    
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
                        className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="flex-shrink-0 p-6 border-b border-white/10 flex items-start gap-4">
                             <Icon className="w-8 h-8 text-blue-400 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.691v4.992" /></Icon>
                            <div>
                                <h2 className="text-xl font-bold text-white">{t('calibration_title')}</h2>
                                <p className="text-sm text-zinc-400">{t('calibration_subtitle')}</p>
                            </div>
                        </header>
                        <main className="p-6 space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">{t('calibration_context_label')}</h3>
                                <div className="text-zinc-300 bg-black/20 p-4 rounded-lg border border-zinc-700/80 text-sm italic">
                                    "{context}"
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">{t('calibration_question')}</h3>
                                <div className="space-y-3">
                                    {options.map((option, index) => (
                                        <motion.button
                                            key={index}
                                            onClick={() => setSelection(option)}
                                            className={`relative w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${selection === option ? 'bg-blue-600/10 border-blue-500' : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-500'}`}
                                            whileHover={{ y: -2 }}
                                        >
                                            <div className="prose prose-sm prose-invert prose-zinc max-w-none">
                                                {typeof option === 'string' ? (
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{option}</ReactMarkdown>
                                                ) : (
                                                    <span>{String(option)}</span>
                                                )}
                                            </div>
                                            <AnimatePresence>
                                            {selection === option &&
                                                <motion.div 
                                                    className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-blue-500 border-2 border-zinc-900 flex items-center justify-center"
                                                    initial={{scale: 0}}
                                                    animate={{scale: 1}}
                                                    exit={{scale: 0}}
                                                >
                                                    <Icon className="w-4 h-4 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></Icon>
                                                </motion.div>
                                            }
                                            </AnimatePresence>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </main>
                        <footer className="p-4 bg-zinc-950/50 border-t border-white/10 flex justify-end items-center gap-4">
                             <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-zinc-200 bg-transparent hover:bg-white/10 rounded-lg transition-colors">
                                {t('cancelButton')}
                            </button>
                            <button
                                onClick={handleCalibrate}
                                disabled={!selection}
                                className="flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white font-bold rounded-lg hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-[1.03] focus:scale-[1.03] disabled:from-zinc-700 disabled:to-zinc-800 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none disabled:opacity-60"
                            >
                                <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></Icon>
                                {t('saveButton')}
                            </button>
                        </footer>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default HumanCalibrationModal;