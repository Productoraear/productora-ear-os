

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, Bar, Cell } from 'recharts';
// FIX: Corrected import paths
import { Persona, PersonaAnalysis, Scenario } from '../types';
import { ScenarioCard } from './ScenarioCard';
import { Icon } from './Icon';
import { useTranslations } from '../contexts/LanguageContext';
import { PERSONA_CONFIG } from '../constants';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { textToSpeech } from '../services/audioService';

interface PersonaAnalysisCardProps {
    persona: Persona;
    analysis: PersonaAnalysis;
    isLoading: boolean;
    onGenerateActionPlan: (strategy: string) => void;
    comparisonSelection: Persona[];
    onToggleCompare: (persona: Persona) => void;
    onToggleActionStep: (strategy: string, stepIndex: number) => void;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    const { t } = useTranslations();
    if (active && payload && payload.length) {
        return (
            <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 p-3 rounded-lg shadow-lg">
                <p className="text-base font-bold text-white">{`${t('strategy')} ${label}`}</p>
                <p className="text-sm text-blue-400">{`${t('chartImpact')}: ${payload[0].value}`}</p>
                <p className="text-sm text-fuchsia-400">{`${t('chartConfidence')}: ${payload[1].value}`}</p>
            </div>
        );
    }
    return null;
};

export const PersonaAnalysisCard: React.FC<PersonaAnalysisCardProps> = ({ persona, analysis, isLoading, onGenerateActionPlan, comparisonSelection, onToggleCompare, onToggleActionStep }) => {
    const { t } = useTranslations();
    const { play, stop } = useAudioPlayer();
    const [isSpeaking, setIsSpeaking] = useState(false);


    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 },
    };

    const chartData = analysis.scenarios.map((s, i) => ({
        name: i + 1,
        "Potential Impact": s.potentialImpact,
        "Confidence Score": s.confidenceScore,
    }));
    
    const isSelected = comparisonSelection.includes(persona);
    const canSelect = comparisonSelection.length < 2 || isSelected;

    const handleSpeak = async () => {
        if (isSpeaking) {
            stop();
            setIsSpeaking(false);
            return;
        }

        if (analysis.analysisResult) {
            setIsSpeaking(true);
            const audioBuffer = await textToSpeech(analysis.analysisResult);
            if (audioBuffer) {
                play(audioBuffer, () => setIsSpeaking(false));
            } else {
                setIsSpeaking(false);
                console.error("Could not generate or play audio.");
            }
        }
    };


    return (
        <motion.div 
            variants={cardVariants}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="group relative glass-card rounded-2xl flex flex-col transition-all duration-300"
        >
            <div className="absolute -inset-px bg-gradient-to-br from-blue-500/20 to-fuchsia-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
            
            <div className="relative z-10 p-6 flex justify-between items-start">
                 <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 bg-black/30 p-3 rounded-full border border-white/10">
                        <Icon className="w-9 h-9 text-white">{PERSONA_CONFIG[persona].icon}</Icon>
                    </div>
                    <div>
                        <p className="text-sm text-zinc-400">{t('analysisFrom')}</p>
                        <h3 className="text-2xl font-bold text-white tracking-tight">{t(`personaName${persona}`)}</h3>
                    </div>
                </div>
                 <button
                    onClick={() => onToggleCompare(persona)}
                    disabled={!canSelect}
                    title={isSelected ? t('removeFromComparison') : (canSelect ? t('addToComparison') : t('comparisonLimitReached'))}
                    className={`flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isSelected 
                        ? 'bg-blue-500 border-blue-400 text-white' 
                        : 'bg-white/5 border-white/10 text-zinc-300 hover:border-blue-500 hover:text-white'
                    }`}
                >
                    <Icon className="w-4 h-4">
                        {isSelected 
                            ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                        }
                    </Icon>
                    <span className="hidden sm:inline">{isSelected ? t('selectedForComparison') : t('compareButton')}</span>
                </button>
            </div>
            
            <div className="relative z-10 p-6 pt-0 space-y-8 flex-1">
                {analysis.error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-300 p-4 rounded-md">
                        {/* FIX: Use renamed translation key to avoid conflicts. */}
                        <h3 className="font-bold">{t('analysisErrorTitle')}</h3>
                        <p>{analysis.error}</p>
                    </div>
                )}
                
                {analysis.analysisResult && (
                    <div>
                        <div className="flex justify-between items-center mb-2">
                             <h4 className="text-base font-semibold text-white">{t('narrativeAnalysis')}</h4>
                             <button onClick={handleSpeak} title={isSpeaking ? t('stopListening') : t('listenToAnalysis')} className="p-2 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
                                {isSpeaking ? (
                                    <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" /></Icon>
                                ) : (
                                    <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /></Icon>
                                )}
                             </button>
                        </div>
                        <div className="prose prose-invert prose-zinc max-w-none text-zinc-300 prose-p:leading-relaxed prose-p:text-zinc-300 text-base">
                            {analysis.scenarios.length === 0 && analysis.analysisResult.trim().startsWith('{') ? (
                                 <pre className="bg-black/20 p-3 rounded-md text-xs whitespace-pre-wrap break-all"><code>{analysis.analysisResult}</code></pre>
                            ) : (
                                <p>{analysis.analysisResult}</p>
                            )}
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

                {analysis.scenarios.length > 0 && (
                    <>
                        <div>
                            <h4 className="text-base font-semibold text-white mb-2">{t('strategicVisualization')}</h4>
                            <div className="w-full h-60 bg-black/20 p-2 rounded-xl border border-white/10">
                                 <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
                                        <defs>
                                            <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                            </linearGradient>
                                            <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.2}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(tick) => `${t('chartStrategyPrefix')} ${tick}`} />
                                        <YAxis stroke="#a1a1aa" fontSize={12} domain={[0, 10]} tickLine={false} axisLine={false} />
                                        <RechartsTooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255, 255, 255, 0.05)'}} />
                                        <Legend wrapperStyle={{color: '#d4d4d8', fontSize: '12px', paddingTop: '10px'}} formatter={(value) => t(value.replace(/ /g, ''))} />
                                        <Bar dataKey="Potential Impact" fill="url(#colorImpact)" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="Confidence Score" fill="url(#colorConfidence)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
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
                    </>
                )}
            </div>
        </motion.div>
    );
};