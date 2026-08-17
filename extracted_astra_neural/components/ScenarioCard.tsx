

import React, { useState } from 'react';
import { Scenario, ActionStep } from '../types';
import { Icon } from './Icon';
import { useTranslations } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ScenarioCardProps {
    scenario: Scenario;
    index: number;
    onGenerateActionPlan: (strategy: string) => void;
    onToggleActionStep: (stepIndex: number) => void;
}

const ScoreIndicator: React.FC<{ score: number; label: string }> = ({ score, label }) => {
    const color = score > 7 ? 'text-green-400' : score > 4 ? 'text-yellow-400' : 'text-red-400';
    const bgColor = score > 7 ? 'bg-green-400/10' : score > 4 ? 'bg-yellow-400/10' : 'bg-red-400/10';

    return (
        <div className={`text-center p-3 rounded-lg ${bgColor} border ${color.replace('text-', 'border-')}/30`}>
            <p className={`text-2xl font-bold ${color}`}>{score}/10</p>
            <p className="text-xs text-zinc-400 font-medium mt-1">{label}</p>
        </div>
    );
};


export const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, index, onGenerateActionPlan, onToggleActionStep }) => {
    const { t } = useTranslations();
    
    const completedSteps = scenario.actionPlan?.filter(s => s.completed).length || 0;
    const totalSteps = scenario.actionPlan?.length || 0;
    const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
    
    // Defensive coding: ensure pros and cons are always arrays to prevent runtime errors.
    const pros = Array.isArray(scenario.pros) ? scenario.pros : (scenario.pros ? [String(scenario.pros)] : []);
    const cons = Array.isArray(scenario.cons) ? scenario.cons : (scenario.cons ? [String(scenario.cons)] : []);


    return (
        <div className="bg-black/20 border border-white/10 rounded-xl p-5 transition-all hover:border-blue-500/30">
            <h4 className="text-lg font-bold text-blue-300 mb-4">
                {t('strategy')} {index + 1}: {scenario.strategy}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                    <h5 className="flex items-center gap-2 font-semibold text-green-400">
                        <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></Icon>
                        {t('pros')}
                    </h5>
                    <ul className="space-y-2 list-inside">
                        {pros.map((pro, i) => (
                           <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                             <span className="text-green-500 mt-1">✓</span>
                             <span>{pro}</span>
                           </li>
                        ))}
                    </ul>
                </div>
                 <div className="space-y-3">
                    <h5 className="flex items-center gap-2 font-semibold text-red-400">
                       <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></Icon>
                        {t('cons')}
                    </h5>
                    <ul className="space-y-2 list-inside">
                        {cons.map((con, i) => (
                           <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                             <span className="text-red-500 mt-1">✗</span>
                             <span>{con}</span>
                           </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <ScoreIndicator score={scenario.potentialImpact} label={t('potentialImpact')} />
                <ScoreIndicator score={scenario.confidenceScore} label={t('confidenceScore')} />
            </div>

            <AnimatePresence>
            {scenario.actionPlan && scenario.actionPlan.length > 0 && (
                 <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-4 border-t border-white/10"
                 >
                    <div className="flex justify-between items-center mb-3">
                        <h5 className="font-semibold text-zinc-100">{t('actionPlanTitle')}</h5>
                        {totalSteps > 0 && (
                            <span className="text-xs font-medium text-zinc-400">{completedSteps} / {totalSteps} {t('completed')}</span>
                        )}
                    </div>
                     {totalSteps > 0 && (
                        <div className="w-full bg-black/30 rounded-full h-1.5 mb-4">
                            <motion.div
                                className="bg-gradient-to-r from-blue-500 to-fuchsia-500 rounded-full h-1.5"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                            />
                        </div>
                    )}
                    <ol className="space-y-3">
                        {scenario.actionPlan.map((step, i) => (
                            <li key={step.step} className="text-sm">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input type="checkbox" checked={step.completed} onChange={() => onToggleActionStep(i)} className="custom-checkbox mt-1 flex-shrink-0" />
                                    <span className={`flex-1 transition-colors ${step.completed ? 'text-zinc-500 line-through' : 'text-zinc-200 group-hover:text-white'}`}>
                                        <strong className="font-semibold">{t('step')} {step.step}:</strong> {step.description}
                                    </span>
                                </label>
                            </li>
                        ))}
                    </ol>
                </motion.div>
            )}
            </AnimatePresence>

            {!scenario.actionPlan && (
                <div className="mt-6 pt-4 border-t border-white/10">
                    <motion.button 
                        onClick={() => onGenerateActionPlan(scenario.strategy)} 
                        disabled={scenario.isGeneratingActionPlan}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white/5 text-white font-semibold rounded-lg border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50"
                        whileHover={{ y: -2 }}
                    >
                        {scenario.isGeneratingActionPlan ? (
                            <>
                               <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                               </svg>
                                {t('generatingPlan')}...
                            </>
                        ) : (
                           <>
                             <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" /></Icon>
                             {t('generateActionPlan')}
                           </>
                        )}
                    </motion.button>
                </div>
            )}
        </div>
    );
};