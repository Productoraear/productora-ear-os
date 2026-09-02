

import React from 'react';
import { motion } from 'framer-motion';
// FIX: Corrected import paths
import { SynthesisResult } from '../types';
import { Icon } from './Icon';
import { useTranslations } from '../contexts/LanguageContext';

interface SynthesisCardProps {
    synthesis: SynthesisResult | null;
    isLoading: boolean;
}

const RiskIndicator: React.FC<{ severity: number }> = ({ severity }) => {
    const color = severity > 7 ? 'bg-red-500' : severity > 4 ? 'bg-yellow-500' : 'bg-green-500';
    return (
        <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${color}`}></div>
            <span className="text-xs font-semibold text-zinc-300">
                {severity > 7 ? 'High' : severity > 4 ? 'Medium' : 'Low'}
            </span>
        </div>
    );
};

export const SynthesisCard: React.FC<SynthesisCardProps> = ({ synthesis, isLoading }) => {
    const { t } = useTranslations();

    if (isLoading) {
        return (
            <div className="bg-zinc-900/50 border-2 border-dashed border-zinc-700 rounded-2xl p-6 text-center animate-pulse">
                <p className="font-semibold text-zinc-400">{t('synthesizing') || 'Synthesizing recommendations...'}</p>
            </div>
        );
    }

    if (!synthesis) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-blue-900/30 border border-zinc-700/50 rounded-2xl shadow-lg"
        >
            <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-1">{t('synthesisTitle')}</h2>
                <p className="text-sm text-zinc-400 mb-6">{t('synthesisSubtitle')}</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column: Summary and Recommendation */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-zinc-100 mb-2">{t('executiveSummary')}</h3>
                            <p className="text-sm text-zinc-300 leading-relaxed">{synthesis.executiveSummary}</p>
                        </div>
                         <div>
                            <h3 className="font-semibold text-zinc-100 mb-2">{t('strategicRecommendation')}</h3>
                            <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
                                <p className="text-base font-bold text-blue-300 mb-2">{synthesis.strategicRecommendation.strategy}</p>
                                <p className="text-sm text-zinc-300 mb-3">{synthesis.strategicRecommendation.justification}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-zinc-400">{t('confidence')}:</span>
                                    <div className="w-full bg-black/30 rounded-full h-2">
                                        <motion.div 
                                            className="bg-blue-500 h-2 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${synthesis.strategicRecommendation.confidence * 10}%` }}
                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-white">{synthesis.strategicRecommendation.confidence}/10</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Risks */}
                    <div>
                        <h3 className="font-semibold text-zinc-100 mb-2">{t('potentialRisks')}</h3>
                        <div className="space-y-3">
                            {synthesis.risks.map((riskItem, index) => (
                                <div key={index} className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="font-semibold text-zinc-200 text-sm flex-1 pr-2">{riskItem.risk}</p>
                                        <RiskIndicator severity={riskItem.severity} />
                                    </div>
                                    <p className="text-xs text-zinc-400">{riskItem.mitigation}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};