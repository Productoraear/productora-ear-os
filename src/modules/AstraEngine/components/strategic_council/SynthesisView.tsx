
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AllAnalysisResults, CouncilSynthesis } from '../../types';
import { useTranslations } from '../../contexts/LanguageContext';
import { Icon } from '../Icon';
import { generateCouncilSynthesis } from '../../services/geminiService';

interface SynthesisViewProps {
    dilemma: string;
    context: string;
    results: AllAnalysisResults;
    onComplete: () => void;
}

export const SynthesisView: React.FC<SynthesisViewProps> = ({ dilemma, context, results, onComplete }) => {
    const { t, language } = useTranslations();
    const [synthesis, setSynthesis] = useState<CouncilSynthesis | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const runSynthesis = async () => {
            try {
                const result = await generateCouncilSynthesis(dilemma, context, results, language);
                if (isMounted) {
                    setSynthesis(result);
                }
            } catch (error) {
                console.error("Synthesis failed:", error);
                if (isMounted) {
                    setError("Failed to generate synthesis. Please try again.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };
        runSynthesis();
        return () => { isMounted = false; };
    }, [dilemma, context, results, language]);

    // Helper to safely render text that might accidentally be an object
    const safeRender = (content: any) => {
        if (typeof content === 'string') return content;
        if (typeof content === 'number') return String(content);
        if (typeof content === 'object' && content !== null) return JSON.stringify(content);
        return '';
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center h-full bg-zinc-950 p-8">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full mb-8"
                />
                <h2 className="text-2xl font-bold text-white mb-2">{t('council_synthesis_generating')}</h2>
                <p className="text-zinc-400 text-center max-w-md">
                    {t('council_synthesis_subtitle')}
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center h-full bg-zinc-950 p-8 text-center">
                <Icon className="w-16 h-16 text-red-500 mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></Icon>
                <h2 className="text-2xl font-bold text-white mb-2">{t('errorUnknown')}</h2>
                <p className="text-zinc-400 mb-6">{error}</p>
                <button onClick={onComplete} className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white transition-colors">
                    {t('backButton')}
                </button>
            </div>
        );
    }

    if (!synthesis) return null;

    return (
        <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden">
            <header className="flex-shrink-0 p-6 border-b border-white/10 bg-zinc-900/50 backdrop-blur-md flex justify-between items-center z-10">
                <div>
                    <h2 className="text-2xl font-bold text-white">{t('council_synthesis_title')}</h2>
                    <p className="text-sm text-zinc-400">{t('council_synthesis_subtitle')}</p>
                </div>
                <button 
                    onClick={onComplete}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all transform hover:scale-105"
                >
                    {t('council_finalize_mission')}
                </button>
            </header>

            <main className="flex-1 overflow-y-auto p-6 md:p-10">
                <div className="max-w-5xl mx-auto space-y-8">
                    
                    {/* Verdict Banner */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-500/30 p-8 text-center shadow-2xl shadow-blue-900/20"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-fuchsia-500"></div>
                        <h3 className="text-sm font-bold text-blue-300 uppercase tracking-widest mb-2">{t('council_synthesis_verdict')}</h3>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">"{safeRender(synthesis.verdict)}"</h1>
                        <p className="text-lg text-zinc-300 max-w-3xl mx-auto leading-relaxed">{safeRender(synthesis.executiveSummary)}</p>
                        
                        <div className="mt-8 flex items-center justify-center gap-4">
                             <div className="flex flex-col items-center p-4 bg-black/20 rounded-xl border border-white/5">
                                <span className="text-xs text-zinc-400 uppercase tracking-wider mb-2">{t('council_synthesis_consensus')}</span>
                                <div className="relative w-48 h-3 bg-zinc-800 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${synthesis.consensusLevel}%` }}
                                        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                                        className={`h-full ${(synthesis.consensusLevel || 0) > 70 ? 'bg-green-500' : (synthesis.consensusLevel || 0) > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                    />
                                </div>
                                <span className="text-lg font-bold text-white mt-2">{synthesis.consensusLevel || 0}%</span>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Unified Strategy */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-2 space-y-6"
                        >
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 hover:border-zinc-700 transition-colors">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-fuchsia-500/20 rounded-lg">
                                         <Icon className="w-6 h-6 text-fuchsia-400"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></Icon>
                                    </div>
                                    {t('council_synthesis_strategy')}
                                </h3>
                                <h4 className="text-2xl font-bold text-blue-300 mb-4">{safeRender(synthesis.unifiedStrategy?.title)}</h4>
                                <p className="text-zinc-300 mb-8 leading-relaxed text-lg">{safeRender(synthesis.unifiedStrategy?.description)}</p>
                                
                                <div className="space-y-4">
                                    {Array.isArray(synthesis.unifiedStrategy?.keySteps) && synthesis.unifiedStrategy.keySteps.map((step, i) => (
                                        <motion.div 
                                            key={i} 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 + (i * 0.1) }}
                                            className="flex items-start gap-4 p-4 bg-zinc-800/40 rounded-xl border border-zinc-700/50 hover:bg-zinc-800/60 transition-colors"
                                        >
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold mt-0.5">
                                                {i + 1}
                                            </div>
                                            <p className="text-zinc-200 leading-relaxed pt-1">{safeRender(step)}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Risks & Dissent */}
                        <div className="space-y-6">
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
                            >
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Icon className="w-5 h-5 text-red-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></Icon>
                                    {t('council_synthesis_risk_plan')}
                                </h3>
                                <div className="space-y-4">
                                    {Array.isArray(synthesis.riskMitigationPlan) && synthesis.riskMitigationPlan.map((item, i) => (
                                        <div key={i} className="text-sm p-3 bg-red-900/10 border border-red-900/30 rounded-lg">
                                            <p className="font-semibold text-red-300 mb-1">{safeRender(item.risk)}</p>
                                            <div className="flex items-start gap-2 mt-2">
                                                <Icon className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></Icon>
                                                <p className="text-zinc-400">{safeRender(item.mitigation)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {Array.isArray(synthesis.dissentingVoices) && synthesis.dissentingVoices.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
                                >
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <Icon className="w-5 h-5 text-amber-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" /></Icon>
                                        {t('council_synthesis_dissent')}
                                    </h3>
                                    <ul className="list-disc list-inside space-y-2">
                                        {synthesis.dissentingVoices.map((voice, i) => (
                                            <li key={i} className="text-sm text-zinc-400">{safeRender(voice)}</li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
