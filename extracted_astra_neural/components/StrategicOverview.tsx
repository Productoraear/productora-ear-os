

import React, { useMemo } from 'react';
// FIX: Corrected import paths
import { AllAnalysisResults, Persona, Scenario, PersonaAnalysis } from '../types';
import { useTranslations } from '../contexts/LanguageContext';
import { Icon } from './Icon';
import { motion } from 'framer-motion';
import { PERSONA_CONFIG } from '../constants';

interface StrategicOverviewProps {
    results: AllAnalysisResults;
}

interface ScenarioWithPersona extends Scenario {
    persona: Persona;
}

const OverviewItem: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50 h-full">
        <h4 className="flex items-center gap-3 font-semibold text-zinc-100 mb-3">
            <span className="bg-zinc-700/80 p-1.5 rounded-full">{icon}</span>
            <span>{title}</span>
        </h4>
        <div>{children}</div>
    </div>
);

export const StrategicOverview: React.FC<StrategicOverviewProps> = ({ results }) => {
    const { t } = useTranslations();

    const { consensus, divergence, topPick } = useMemo(() => {
        const allScenarios: ScenarioWithPersona[] = Object.entries(results)
            .flatMap(([persona, analysis]) => {
                const typedAnalysis = analysis as PersonaAnalysis | undefined;
                return typedAnalysis?.scenarios.map(s => ({ ...s, persona: persona as Persona })) ?? []
            });

        if (allScenarios.length === 0) {
            return { consensus: [], divergence: [], topPick: null };
        }

        const strategyMap = new Map<string, ScenarioWithPersona[]>();
        allScenarios.forEach(s => {
            // FIX: Accessing property 'strategy' which exists on Scenario type
            const existing = strategyMap.get(s.strategy) || [];
            strategyMap.set(s.strategy, [...existing, s]);
        });
        
        const consensus: { strategy: string; personas: Persona[] }[] = [];
        const divergence: ScenarioWithPersona[] = [];

        strategyMap.forEach((scenarios, strategy) => {
            if (scenarios.length > 1) {
                consensus.push({ strategy, personas: scenarios.map(s => s.persona) });
            } else {
                divergence.push(scenarios[0]);
            }
        });

        const topPick = [...allScenarios].sort((a, b) => 
            // FIX: Accessing properties which exist on Scenario type
            (b.potentialImpact + b.confidenceScore) - (a.potentialImpact + a.confidenceScore)
        )[0] ?? null;

        return { consensus, divergence, topPick };

    }, [results]);

    const hasMultiplePersonas = Object.values(results).filter(r => {
        const analysis = r as PersonaAnalysis | undefined;
        return analysis && !analysis.error;
    }).length > 1;

    if (!hasMultiplePersonas || (consensus.length === 0 && divergence.length < 2)) {
        return null; // Not enough data to create a meaningful overview
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-zinc-900/50 border border-zinc-700/50 rounded-2xl shadow-lg"
        >
            <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-1">{t('strategicOverviewTitle')}</h2>
                <p className="text-sm text-zinc-400 mb-6">{t('strategicOverviewSubtitle')}</p>
                
                <div className="grid md:grid-cols-3 gap-4">
                    {topPick && (
                         <OverviewItem 
                            icon={<Icon className="w-5 h-5 text-yellow-400"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 21.1a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></Icon>}
                            title={t('topPickTitle')}
                        >
                            <p className="text-sm text-zinc-200 font-semibold">{topPick.strategy}</p>
                            <p className="text-xs text-zinc-400">
                                {t('suggestedBy')} <span className="font-medium text-zinc-300">{t(`personaName${topPick.persona}`)}</span>
                            </p>
                        </OverviewItem>
                    )}

                    <OverviewItem 
                        icon={<Icon className="w-5 h-5 text-green-400"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.5A2.25 2.25 0 0 1 5.25 21h13.5A2.25 2.25 0 0 1 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></Icon>}
                        title={t('consensusTitle')}
                    >
                       {consensus.length > 0 ? (
                            <ul className="space-y-3">
                                {consensus.map(({ strategy, personas }) => (
                                    <li key={strategy}>
                                        <p className="text-sm text-zinc-200 font-semibold">{strategy}</p>
                                        <div className="flex items-center flex-wrap gap-2 mt-1">
                                            {personas.map(p => (
                                                <div key={p} className="flex items-center gap-1 text-xs text-zinc-400 bg-zinc-700/50 px-1.5 py-0.5 rounded-full" title={t(`personaName${p}`)}>
                                                    <Icon className="w-3 h-3">{PERSONA_CONFIG[p].icon}</Icon>
                                                </div>
                                            ))}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                       ) : <p className="text-sm text-zinc-400">{t('noConsensus')}</p>}
                    </OverviewItem>
                    
                     <OverviewItem 
                        icon={<Icon className="w-5 h-5 text-fuchsia-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25" /></Icon>}
                        title={t('divergenceTitle')}
                    >
                         {divergence.length > 0 ? (
                            <ul className="space-y-3">
                                {divergence.slice(0, 3).map(s => (
                                    <li key={s.strategy}>
                                        <p className="text-sm text-zinc-200 font-semibold">{s.strategy}</p>
                                        <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-400" title={t(`personaName${s.persona}`)}>
                                             <Icon className="w-3 h-3">{PERSONA_CONFIG[s.persona].icon}</Icon>
                                             <span>{t(`personaName${s.persona}`)}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : <p className="text-sm text-zinc-400">{t('noDivergence')}</p>}
                    </OverviewItem>
                </div>
            </div>
        </motion.div>
    );
};