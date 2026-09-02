import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from '../../../contexts/LanguageContext';
import type { AnalysisResponse } from '../../../types';
import { BrainIcon, ScalesIcon, LightbulbIcon, RoadmapIcon, ShieldExclamationIcon } from './icons';

interface AnalysisDisplayProps {
  analysis: AnalysisResponse;
}

const AnalysisSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <motion.div
        className="glass-card rounded-xl p-6 mb-6 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <div className="flex items-center gap-3 mb-4">
            <div className="bg-zinc-800/50 p-2 rounded-full border border-zinc-700">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-blue-300">{title}</h3>
        </div>
        <div className="prose prose-invert prose-p:text-zinc-300 prose-li:text-zinc-300">
            {children}
        </div>
    </motion.div>
);

// Helper to safely render items even if they are objects
const SafeList: React.FC<{ items: any[], type?: 'disc' | 'decimal' }> = ({ items, type = 'disc' }) => (
    <ul className={`${type === 'decimal' ? 'list-decimal' : 'list-disc'} pl-5 space-y-2 mt-2`}>
        {(items || []).map((item, index) => (
            <li key={index}>
                {typeof item === 'string' ? item : (item && typeof item === 'object' && item.text ? item.text : JSON.stringify(item))}
            </li>
        ))}
    </ul>
);

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis }) => {
    const { t } = useTranslations();
    return (
    <div className="space-y-6">
        <AnalysisSection title={t('proa_section_assumptions')} icon={<ShieldExclamationIcon className="h-6 w-6 text-yellow-400" />}>
            <SafeList items={analysis.assumptionAnalysis} />
        </AnalysisSection>

        <AnalysisSection title={t('proa_section_counterpoints')} icon={<ScalesIcon className="h-6 w-6 text-orange-400" />}>
            <p className="font-semibold text-zinc-400 italic">{t('proa_section_perspective')}: {analysis.counterpoints.role}</p>
            <SafeList items={analysis.counterpoints.points} />
        </AnalysisSection>

        <AnalysisSection title={t('proa_section_reasoning')} icon={<BrainIcon className="h-6 w-6 text-purple-400" />}>
            <SafeList items={analysis.reasoningTest} />
        </AnalysisSection>
        
        <AnalysisSection title={t('proa_section_perspectives')} icon={<LightbulbIcon className="h-6 w-6 text-green-400" />}>
            <SafeList items={analysis.alternativePerspectives} />
        </AnalysisSection>

        <AnalysisSection title={t('proa_section_roadmap')} icon={<RoadmapIcon className="h-6 w-6 text-blue-400" />}>
             <h4 className="text-lg font-semibold text-zinc-200">{analysis.actionableRoadmap.title}</h4>
             <SafeList items={analysis.actionableRoadmap.steps} type="decimal" />
        </AnalysisSection>
    </div>
  );
};