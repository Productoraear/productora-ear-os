import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Persona, AllAnalysisResults, PersonaAnalysis } from '../types';
import { useTranslations } from '../contexts/LanguageContext';
import { Icon } from './Icon';
import { PERSONA_CONFIG } from '../constants';
import { ScenarioCard } from './ScenarioCard';

interface ComparisonModalProps {
    isOpen: boolean;
    onClose: () => void;
    selection: Persona[];
    results: AllAnalysisResults;
    onGenerateActionPlan: (persona: Persona, strategy: string) => void;
    onToggleActionStep: (persona: Persona, strategy: string, stepIndex: number) => void;
}

const PersonaColumn: React.FC<{ 
    persona: Persona, 
    analysis: PersonaAnalysis,
    onGenerateActionPlan: (strategy: string) => void;
    onToggleActionStep: (strategy: string, stepIndex: number) => void;
}> = ({ persona, analysis, onGenerateActionPlan, onToggleActionStep }) => {
    const { t } = useTranslations();
    
    return (
        <div className="flex flex-col h-full overflow-y-auto p-6">
            <div className="flex items-center gap-4 mb-6 sticky top-0 bg-zinc-900/80 backdrop-blur-sm py-4 -mt-6 -mx-6 px-6 z-10 border-b border-white/10">
                 <div className="flex-shrink-0 bg-black/30 p-3 rounded-full border border-white/10">
                    <Icon className="w-9 h-9 text-white">{PERSONA_CONFIG[persona].icon}</Icon>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{t(`personaName${persona}`)}</h3>
                </div>
            </div>
            <div className="space-y-6">
                {analysis.error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-300 p-4 rounded-md">
                        {/* FIX: Use renamed translation key to avoid conflicts. */}
                        <h3 className="font-bold">{t('analysisErrorTitle')}</h3>
                        <p>{analysis.error}</p>
                    </div>
                )}
                
                {analysis.analysisResult && (
                    <div>
                         <h4 className="text-base font-semibold text-white mb-2">Narrative Analysis</h4>
                         <div className="prose prose-invert prose-zinc max-w-none text-zinc-300 prose-p:leading-relaxed prose-p:text-zinc-300 text-base">
                            {analysis.scenarios.length === 0 && analysis.analysisResult.trim().startsWith('{') ? (
                                <pre className="bg-black/20 p-3 rounded-md text-xs whitespace-pre-wrap break-all"><code>{analysis.analysisResult}</code></pre>
                            ) : (
                                <p>{analysis.analysisResult}</p>
                            )}
                        </div>
                    </div>
                )}

                 {analysis.scenarios.length > 0 && (
                    <div>
                        <h4 className="text-base font-semibold text-white mb-3">{t('recommendedStrategies')}</h4>
                        <div className="space-y-4">
                            {analysis.scenarios.map((scenario, i) => (
                                <ScenarioCard 
                                    key={i} 
                                    scenario={scenario} 
                                    index={i}
                                    onGenerateActionPlan={() => onGenerateActionPlan(scenario.strategy)}
                                    onToggleActionStep={(stepIndex) => onToggleActionStep(scenario.strategy, stepIndex)}
                                />
                            ))}
                        </div>
                    </div>
                 )}

                {analysis.sources.length > 0 && (
                     <div>
                        <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                            <Icon className="w-5 h-5 text-zinc-400"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></Icon>
                            {t('sources')}
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                            {analysis.sources.map((source, index) => (
                                <a
                                    key={index}
                                    href={source.web.uri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={source.web.uri}
                                    className="bg-black/20 border border-white/10 p-3 rounded-md text-sm text-zinc-300 hover:border-blue-500/50 hover:bg-black/30 transition-colors block truncate"
                                >
                                    <p className="font-medium text-blue-400 truncate">{source.web.title || new URL(source.web.uri).hostname}</p>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ isOpen, onClose, selection, results, onGenerateActionPlan, onToggleActionStep }) => {
    const { t } = useTranslations();
    
    if (selection.length < 2) return null;

    const [persona1, persona2] = selection;
    const analysis1 = results[persona1];
    const analysis2 = results[persona2];

    const title = t('comparisonModalTitle')
        .replace('{persona1}', t(`personaName${persona1}`))
        .replace('{persona2}', t(`personaName${persona2}`));

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
                        className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-7xl h-full max-h-[90vh] flex flex-col overflow-hidden"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="flex-shrink-0 p-4 border-b border-white/10 flex justify-between items-center">
                           <div className="flex items-center gap-3">
                             <Icon className="w-8 h-8 text-blue-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h18M16.5 3 21 7.5m0 0L16.5 12M21 7.5H3" />
                             </Icon>
                             <h2 className="text-xl font-bold text-white">{title}</h2>
                           </div>
                           <button onClick={onClose} className="p-1 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white">
                                <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></Icon>
                           </button>
                        </header>

                        <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-800/50 overflow-hidden">
                           {analysis1 && <PersonaColumn persona={persona1} analysis={analysis1} onGenerateActionPlan={(strategy) => onGenerateActionPlan(persona1, strategy)} onToggleActionStep={(strategy, stepIndex) => onToggleActionStep(persona1, strategy, stepIndex)} />}
                           {analysis2 && <PersonaColumn persona={persona2} analysis={analysis2} onGenerateActionPlan={(strategy) => onGenerateActionPlan(persona2, strategy)} onToggleActionStep={(strategy, stepIndex) => onToggleActionStep(persona2, strategy, stepIndex)} />}
                        </main>
                        
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
