
// FIX: Implemented the AtlasCultural component to replace the placeholder content.
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from '../contexts/LanguageContext';
import { generateCulturalTrends } from '../services/geminiService';
import { CulturalAtlasResult, VisualTrend, SonicTrend, ConceptualTrend } from '../types';
import { Icon } from './Icon';

const TrendCard: React.FC<{ title: string; description: string; index: number; }> = ({ title, description, index }) => (
    <motion.div
        className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
    >
        <h4 className="font-bold text-blue-400">{title}</h4>
        <p className="text-sm text-zinc-300 mt-1">{description}</p>
    </motion.div>
);

const TrendColumn: React.FC<{ title: string; trends: (VisualTrend | SonicTrend | ConceptualTrend)[]; icon: React.ReactNode; }> = ({ title, trends, icon }) => (
    <div className="bg-black/20 p-6 rounded-xl border border-white/10 flex-1">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
            <Icon className="w-7 h-7">{icon}</Icon>
            {title}
        </h3>
        <div className="space-y-4">
            {trends.map((trend, index) => (
                <TrendCard key={index} title={trend.name} description={trend.description} index={index} />
            ))}
        </div>
    </div>
);


export const AtlasCultural: React.FC = () => {
    const { t, language } = useTranslations();
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<CulturalAtlasResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setResults(null);
        try {
            const data = await generateCulturalTrends(language);
            setResults(data);
        } catch (err) {
            setError(t('errorUnknown'));
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex-1 overflow-y-auto p-8 bg-zinc-950 text-white">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-4xl font-bold text-white mb-2">{t('tool_atlasCultural_title')}</h1>
                    <p className="text-lg text-zinc-400 mb-6">{t('tool_atlasCultural_description')}</p>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-3 py-3 px-8 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 focus:scale-105 disabled:from-zinc-700 disabled:to-zinc-800 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none disabled:opacity-60"
                    >
                         {isLoading ? (
                            <>
                               <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                               </svg>
                               {t('atlas_generating')}...
                            </>
                        ) : (
                           <>
                            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></Icon>
                            {t('atlas_generate_button')}
                           </>
                        )}
                    </button>
                </motion.div>

                <div className="mt-10">
                    {error && <p className="text-red-400">{error}</p>}
                    {results && (
                        <motion.div 
                            className="flex flex-col lg:flex-row gap-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <TrendColumn title={t('atlas_visual_title')} trends={results.visualTrends} icon={<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />} />
                            <TrendColumn title={t('atlas_sonic_title')} trends={results.sonicTrends} icon={<path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25" />} />
                            <TrendColumn title={t('atlas_conceptual_title')} trends={results.conceptualTrends} icon={<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V8.25a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 8.25v10.5A2.25 2.25 0 0 0 6.75 19.5Z" />} />
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};
