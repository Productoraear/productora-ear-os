import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from '../../contexts/LanguageContext';
import { generateSWOTAnalysis } from '../../services/geminiService';
import { SWOTAnalysisResult } from '../../types';
import { Icon } from '../Icon';

const InputField: React.FC<{
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder: string;
}> = ({ label, value, onChange, placeholder }) => (
    <div>
        <label className="block text-lg font-semibold text-zinc-200 mb-2">{label}</label>
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-3 h-32 bg-zinc-900 border border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-zinc-500 resize-none text-base"
        />
    </div>
);

const ResultSection: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
    <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
        <h4 className="font-bold text-blue-400 mb-2">{title}</h4>
        <ul className="space-y-2 list-disc list-inside">
            {(items || []).map((item, index) => (
                <li key={index} className="text-sm text-zinc-300">
                    {typeof item === 'string' ? item : JSON.stringify(item)}
                </li>
            ))}
        </ul>
    </div>
);

export const SWOTAnalysis: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const { t, language } = useTranslations();
    const [strengths, setStrengths] = useState('');
    const [weaknesses, setWeaknesses] = useState('');
    const [opportunities, setOpportunities] = useState('');
    const [threats, setThreats] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<SWOTAnalysisResult | null>(null);
    const [error, setError] = useState('');

    const canGenerate = strengths.trim() && weaknesses.trim() && opportunities.trim() && threats.trim();

    const handleGenerate = async () => {
        if (!canGenerate) return;
        setIsLoading(true);
        setResult(null);
        setError('');
        try {
            const analysisResult = await generateSWOTAnalysis(strengths, weaknesses, opportunities, threats, language);
            setResult(analysisResult);
        } catch (e) {
            console.error("SWOT analysis error:", e);
            setError(t('errorUnknown'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-zinc-950">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t('tool_swotAnalysis_title')}</h1>
                    <p className="text-base md:text-lg text-zinc-400 mb-8">{t('tool_swotAnalysis_description')}</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <InputField label={`1. ${t('swot_strengths')}`} value={strengths} onChange={e => setStrengths(e.target.value)} placeholder={t('swot_strengths_placeholder')} />
                    <InputField label={`2. ${t('swot_weaknesses')}`} value={weaknesses} onChange={e => setWeaknesses(e.target.value)} placeholder={t('swot_weaknesses_placeholder')} />
                    <InputField label={`3. ${t('swot_opportunities')}`} value={opportunities} onChange={e => setOpportunities(e.target.value)} placeholder={t('swot_opportunities_placeholder')} />
                    <InputField label={`4. ${t('swot_threats')}`} value={threats} onChange={e => setThreats(e.target.value)} placeholder={t('swot_threats_placeholder')} />
                </div>

                <div className="text-center mb-8">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !canGenerate}
                        className="flex items-center justify-center gap-3 py-3 px-8 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Icon className="w-5 h-5 animate-spin"><path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" fill="currentColor"/></Icon>
                                {t('swot_generating')}
                            </>
                        ) : t('swot_generate_button')}
                    </button>
                </div>
                
                {error && <p className="text-red-400 text-center">{error}</p>}

                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h2 className="text-2xl font-bold text-center mb-6">{t('swot_results_title')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ResultSection title={t('swot_maintain_title')} items={result.conclusions.maintain} />
                            <ResultSection title={t('swot_exploit_title')} items={result.conclusions.exploit} />
                            <ResultSection title={t('swot_correct_title')} items={result.conclusions.correct} />
                            <ResultSection title={t('swot_confront_title')} items={result.conclusions.confront} />
                        </div>
                    </motion.div>
                )}
                
                <div className="mt-12 text-center">
                    <button onClick={onComplete} className="py-3 px-8 bg-zinc-700 text-white font-bold rounded-lg hover:bg-zinc-600 transition-colors">
                        {t('completeAndContinue')}
                    </button>
                </div>
            </div>
        </div>
    );
};