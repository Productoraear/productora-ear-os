// FIX: Implemented the LaboratorioRobustez component to replace the placeholder content.
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslations } from '../../contexts/LanguageContext';
import { Icon } from '../Icon';
import { generateCounterArgument } from '../../services/geminiService';
import { CounterArgumentResult } from '../../types';
import { EnhancedTextarea } from '../EnhancedTextarea';

export const LaboratorioRobustez: React.FC = () => {
    const { t, language } = useTranslations();
    const [strategy, setStrategy] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<CounterArgumentResult | null>(null);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!strategy.trim()) return;
        setIsLoading(true);
        setResult(null);
        setError('');
        try {
            const counterResult = await generateCounterArgument(strategy, language);
            setResult(counterResult);
        } catch (e) {
            console.error("Counter-argument error:", e);
            setError(t('errorUnknown'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center p-8 bg-zinc-950 overflow-y-auto">
            <div className="w-full max-w-4xl">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-4xl font-bold text-white mb-2">{t('tool_laboratorioRobustez_title')}</h1>
                    <p className="text-lg text-zinc-400 mb-6">{t('tool_laboratorioRobustez_description')}</p>
                </motion.div>
                
                <div className="w-full space-y-4">
                    <EnhancedTextarea
                        value={strategy}
                        onChange={(e) => setStrategy(e.target.value)}
                        placeholder={t('robustez_placeholder')}
                        className="w-full p-3 h-32 bg-zinc-900 border border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-zinc-500 resize-none text-base"
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !strategy.trim()}
                        className="flex items-center justify-center gap-3 py-3 px-8 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 focus:scale-105 disabled:from-zinc-700 disabled:to-zinc-800 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none disabled:opacity-60"
                    >
                        {isLoading ? (
                           t('robustez_generating')
                        ) : (
                           <>
                            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" /></Icon>
                            {t('robustez_button')}
                           </>
                        )}
                    </button>
                </div>
                
                {result?.counterArgument && (
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full mt-8 p-6 bg-black/20 border border-zinc-800 rounded-lg"
                    >
                         <div className="prose prose-invert prose-zinc max-w-none">
                            {typeof result.counterArgument === 'string' ? (
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.counterArgument}</ReactMarkdown>
                            ) : (
                                <p className="text-red-400">{t('robustez_format_error')}</p>
                            )}
                        </div>
                    </motion.div>
                )}
                {error && <p className="text-red-400 mt-4">{error}</p>}
            </div>
        </div>
    );
};