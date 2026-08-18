import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './Icon';
import { useTranslations } from '../contexts/LanguageContext';

interface AIEnhancerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
    originalText: string;
    enhancedText: string;
    isLoading: boolean;
}

export const AIEnhancerModal: React.FC<AIEnhancerModalProps> = ({
    isOpen,
    onClose,
    onAccept,
    originalText,
    enhancedText,
    isLoading
}) => {
    const { t } = useTranslations();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl h-full max-h-[80vh] flex flex-col overflow-hidden"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <header className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
                             <h2 className="text-lg font-bold text-white">{t('enhancerModalTitle')}</h2>
                            <button onClick={onClose} className="p-1 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white">
                                <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></Icon>
                            </button>
                        </header>
                        
                        {isLoading ? (
                            <div className="flex-1 flex items-center justify-center text-zinc-400">
                                <Icon className="w-6 h-6 animate-spin mr-3"><path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" fill="currentColor"/></Icon>
                                {t('enhancingText')}...
                            </div>
                        ) : (
                            <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-800/50 overflow-hidden">
                                <div className="bg-zinc-900/80 p-6 flex flex-col">
                                    <h3 className="font-semibold text-zinc-300 mb-3">{t('enhancerModalOriginal')}</h3>
                                    <div className="flex-grow p-3 bg-zinc-950/70 border border-zinc-700 rounded-md overflow-y-auto whitespace-pre-wrap text-sm leading-6">
                                        {originalText}
                                    </div>
                                </div>
                                <div className="bg-zinc-900/80 p-6 flex flex-col">
                                    <h3 className="font-semibold text-zinc-300 mb-3">{t('enhancerModalEnhanced')}</h3>
                                    <div className="flex-grow p-3 bg-zinc-950/70 border border-blue-500/20 rounded-md overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-zinc-200">
                                        {enhancedText}
                                    </div>
                                </div>
                            </main>
                        )}
                        
                        <footer className="p-4 border-t border-white/10 flex-shrink-0 flex justify-end gap-3">
                            <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-zinc-200 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                                {t('cancelButton')}
                            </button>
                            <button
                                onClick={onAccept}
                                disabled={isLoading}
                                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 disabled:bg-zinc-600"
                            >
                                {t('acceptButton')}
                            </button>
                        </footer>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};