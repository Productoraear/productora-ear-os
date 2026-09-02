
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon, XMarkIcon } from './Icon';
import { useTranslations } from '../contexts/LanguageContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface ScratchpadProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Scratchpad: React.FC<ScratchpadProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslations();
    const [content, setContent] = useLocalStorage<string>('astra-scratchpad', '');

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 z-[90] backdrop-blur-sm"
                    />
                    
                    {/* Slide-over Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed top-20 right-4 bottom-4 w-96 bg-zinc-900/90 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-2xl z-[100] flex flex-col overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                            <div className="flex items-center gap-2">
                                <Icon className="w-5 h-5 text-yellow-400"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></Icon>
                                <h3 className="font-bold text-zinc-100">{t('scratchpad_title')}</h3>
                            </div>
                            <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white transition-colors">
                                <Icon className="w-5 h-5">{XMarkIcon}</Icon>
                            </button>
                        </div>
                        
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={t('scratchpad_placeholder')}
                            className="flex-1 w-full bg-transparent p-4 text-zinc-300 resize-none focus:outline-none font-mono text-sm leading-relaxed"
                            autoFocus
                        />
                        
                        <div className="p-2 border-t border-white/5 text-xs text-zinc-500 text-right bg-black/20">
                            Auto-saved locally
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
