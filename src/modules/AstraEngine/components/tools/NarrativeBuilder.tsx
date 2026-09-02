// FIX: Implemented the NarrativeBuilder component to replace the placeholder content.
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from '../../contexts/LanguageContext';
import { generateNarrative } from '../../services/geminiService';
import { NarrativeResult } from '../../types';
import { Icon } from '../Icon';
import { EnhancedTextarea } from '../EnhancedTextarea';

export const NarrativeBuilder: React.FC = () => {
    const { t, language } = useTranslations();
    const [elements, setElements] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<NarrativeResult | null>(null);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!elements.trim()) return;
        setIsLoading(true);
        setResult(null);
        setError('');
        try {
            const narrativeResult = await generateNarrative(elements, language);
            setResult(narrativeResult);
        } catch (e) {
            console.error("Narrative generation error:", e);
            setError(t('errorUnknown'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center p-8 bg-zinc-950 overflow-y-auto">
            <div className="w-full max-w-4xl">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-4xl font-bold text-white mb-2">{t('tool_narrativeBuilder_title')}</h1>
                    <p className="text-lg text-zinc-400 mb-6">{t('tool_narrativeBuilder_description')}</p>
                </motion.div>

                <div className="w-full space-y-4">
                    <EnhancedTextarea
                        value={elements}
                        onChange={(e) => setElements(e.target.value)}
                        placeholder={t('narrative_placeholder')}
                        className="w-full p-3 h-40 bg-zinc-900 border border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-zinc-500 resize-none text-base"
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !elements.trim()}
                        className="flex items-center justify-center gap-3 py-3 px-8 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 focus:scale-105 disabled:from-zinc-700 disabled:to-zinc-800 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none disabled:opacity-60"
                    >
                         {isLoading ? t('narrative_generating') : t('narrative_button')}
                    </button>
                </div>

                {isLoading && <p className="text-center mt-8 text-zinc-400">{t('narrative_generating_long')}</p>}

                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full mt-8 space-y-6"
                    >
                        <div className="p-6 bg-black/20 border border-zinc-800 rounded-lg">
                            <h2 className="text-2xl font-bold text-blue-400 mb-2">{result.narrativeTitle}</h2>
                            <h3 className="font-semibold text-zinc-300 mt-4 mb-2">{t('narrative_bio')}</h3>
                            <p className="text-zinc-400 whitespace-pre-line">{result.biography}</p>
                            <h3 className="font-semibold text-zinc-300 mt-4 mb-2">{t('narrative_manifesto')}</h3>
                            <p className="text-zinc-400 whitespace-pre-line">{result.manifesto}</p>
                            <h3 className="font-semibold text-zinc-300 mt-4 mb-2">{t('narrative_interview')}</h3>
                            <ul className="list-disc list-inside space-y-1 text-zinc-400">
                                {result.interviewTips.map((tip, i) => <li key={i}>{tip}</li>)}
                            </ul>
                             <h3 className="font-semibold text-zinc-300 mt-4 mb-2">{t('narrative_reaction')}</h3>
                            <p className="text-zinc-400 italic">"{result.simulatedAudienceReaction}"</p>
                        </div>
                    </motion.div>
                )}
                 {error && <p className="text-red-400 mt-4">{error}</p>}
            </div>
        </div>
    );
};