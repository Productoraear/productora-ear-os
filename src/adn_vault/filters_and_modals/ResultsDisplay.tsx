

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// FIX: Corrected import paths
import { AllAnalysisResults, Persona, AnalysisParameters, Scenario, PersonaAnalysis, SynthesisResult } from '../types';
import { Icon } from './Icon';
import { useTranslations } from '../contexts/LanguageContext';
import { PersonaAnalysisCard } from './PersonaAnalysisCard';
import { ResultsSkeleton } from './ResultsSkeleton';
// FIX: Updated import path for SynthesisCard.tsx to be a relative path.
import { SynthesisCard } from './SynthesisCard';
import { StrategicOverview } from './StrategicOverview';

interface ResultsDisplayProps {
    isLoading: boolean;
    results: AllAnalysisResults;
    params: AnalysisParameters;
    onGenerateActionPlan: (persona: Persona, strategy: string) => void;
    // FIX: Updated type to SynthesisResult to match data model.
    synthesis: SynthesisResult | null;
    isSynthesizing: boolean;
    comparisonSelection: Persona[];
    onToggleCompare: (persona: Persona) => void;
    onToggleActionStep: (persona: Persona, strategy: string, stepIndex: number) => void;
}

const WelcomeState: React.FC = () => {
    const { t } = useTranslations();
    return (
        <div className="text-center p-8 flex flex-col items-center justify-center h-full w-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-64 h-64 flex items-center justify-center mb-10"
            >
                {/* Abstract animated shape */}
                <motion.div
                    className="absolute w-full h-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                >
                    <div className="absolute top-0 left-1/2 w-32 h-32 bg-blue-500/30 rounded-full filter blur-2xl"></div>
                    <div className="absolute bottom-0 right-1/2 w-32 h-32 bg-fuchsia-500/30 rounded-full filter blur-2xl"></div>
                </motion.div>
                <Icon className="w-28 h-28 text-white relative z-10 opacity-80">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 1-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 1 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 1 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 1-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                </Icon>
            </motion.div>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 tracking-tighter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
                {t('welcomeTitle')}
            </motion.h2>
            <motion.p 
              className="mt-4 max-w-xl mx-auto text-zinc-400 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
                {t('welcomeMessage')}
            </motion.p>
        </div>
    );
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ isLoading, results, params, onGenerateActionPlan, synthesis, isSynthesizing, comparisonSelection, onToggleCompare, onToggleActionStep }) => {
    const { t } = useTranslations();
    const hasResults = Object.values(results).some(res => {
        const analysis = res as PersonaAnalysis | undefined;
        return analysis && (analysis.analysisResult || analysis.scenarios.length > 0 || analysis.error);
    });
    const resultEntries = Object.entries(results).filter(([, res]) => res !== undefined) as [Persona, PersonaAnalysis][];

    if (isLoading && !hasResults) {
        return <ResultsSkeleton personaCount={params.personas.length || 1} />;
    }

    if (!hasResults && !isSynthesizing) {
        return (
             <div className="flex-1 overflow-y-auto">
                <WelcomeState />
            </div>
        );
    }
    
    return (
        <div id="results-container" className="flex-1 p-6 md:p-10 overflow-y-auto">
             <div className="max-w-7xl mx-auto">
                 <div className="mb-10">
                    <h2 className="text-4xl font-bold text-white tracking-tight">{t('councilResultsTitle')}</h2>
                    <p className="text-zinc-400 text-lg max-w-3xl mt-2">{t('councilResultsSubtitle')}</p>
                 </div>
                 <div className="space-y-10">
                    {(isSynthesizing || synthesis) && (
                        <SynthesisCard synthesis={synthesis} isLoading={isSynthesizing} />
                    )}
                    <StrategicOverview results={results} />
                     <motion.div 
                        className="grid gap-8"
                        style={{ gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, 480px), 1fr))`}}
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.15 } },
                            hidden: {},
                        }}
                     >
                        {resultEntries.map(([persona, analysis]) => (
                             <PersonaAnalysisCard
                                key={persona}
                                persona={persona}
                                analysis={analysis!}
                                isLoading={isLoading && !analysis}
                                onGenerateActionPlan={(strategy) => onGenerateActionPlan(persona, strategy)}
                                comparisonSelection={comparisonSelection}
                                onToggleCompare={onToggleCompare}
                                onToggleActionStep={(strategy, stepIndex) => onToggleActionStep(persona, strategy, stepIndex)}
                             />
                        ))}
                     </motion.div>
                 </div>
             </div>
        </div>
    );
};