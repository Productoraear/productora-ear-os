// FIX: Implemented the ConvocationView component to replace the placeholder content.
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from '../../contexts/LanguageContext';
import { Icon } from '../Icon';
import { EnhancedTextarea } from '../EnhancedTextarea';

interface ConvocationViewProps {
    onNext: (dilemma: string, context: string) => void;
    initialDilemma: string;
    initialContext: string;
}

export const ConvocationView: React.FC<ConvocationViewProps> = ({ onNext, initialDilemma, initialContext }) => {
    const { t } = useTranslations();
    const [dilemma, setDilemma] = useState(initialDilemma);
    const [context, setContext] = useState(initialContext);

    const canProceed = dilemma.trim().length > 10;

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-zinc-950 overflow-y-auto">
            <motion.div 
                className="w-full max-w-3xl text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">{t('convocationTitle')}</h1>
                    <p className="text-lg text-zinc-400">{t('convocationSubtitle')}</p>
                </div>

                <div className="space-y-6 text-left">
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300 mb-2">{t('dilemmaLabel')}</label>
                        <EnhancedTextarea
                            value={dilemma}
                            onChange={(e) => setDilemma(e.target.value)}
                            placeholder={t('dilemmaPlaceholder')}
                            className="w-full p-3 h-36 bg-zinc-900 border border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-zinc-500 resize-none text-base"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-semibold text-zinc-300 mb-2">{t('contextLabel')}</label>
                        <EnhancedTextarea
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            placeholder={t('contextPlaceholder')}
                            className="w-full p-3 h-24 bg-zinc-900 border border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-zinc-500 resize-none text-base"
                        />
                    </div>
                </div>

                <div className="mt-8">
                    <motion.button
                        onClick={() => onNext(dilemma, context)}
                        disabled={!canProceed}
                        className="flex items-center justify-center gap-3 py-3 px-8 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 focus:scale-105 disabled:from-zinc-700 disabled:to-zinc-800 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none disabled:opacity-60"
                        whileHover={canProceed ? { scale: 1.05 } : {}}
                        whileTap={canProceed ? { scale: 0.98 } : {}}
                    >
                        {t('convocationButton')}
                        <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></Icon>
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};