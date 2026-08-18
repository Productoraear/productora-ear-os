
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './Icon';
import { useTranslations } from '../contexts/LanguageContext';
// FIX: Corrected import of ToolConfig to come from types.ts.
import { TOOL_REGISTRY } from '../utils/toolRegistry';
import { WorkflowStage, ToolConfig } from '../types';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PRINCIPLES = [
    'modularArchitecture',
    'constantFeedback',
    'impactDashboard',
    'visualCollaboration',
    'customizationScalability',
    'integrationAutomation',
    'trainingSupport'
];

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
    <div className="w-full bg-zinc-700/50 rounded-full h-2.5">
        <motion.div
            className="bg-gradient-to-r from-blue-500 to-fuchsia-500 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
        />
    </div>
);

const StageProgress: React.FC<{ stage: WorkflowStage; tools: ToolConfig[] }> = ({ stage, tools }) => {
    const { t } = useTranslations();
    const implementedCount = tools.filter(t => t.isImplemented).length;
    const totalCount = tools.length;
    const progress = totalCount > 0 ? (implementedCount / totalCount) * 100 : 100;

    return (
        <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/80">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-white">{t(`stage_${stage}_title`)}</h4>
                <span className="text-sm font-medium text-zinc-400">{implementedCount} / {totalCount}</span>
            </div>
            <ProgressBar progress={progress} />
            <div className="mt-3 space-y-1">
                {tools.map(tool => {
                    const toolId = Object.keys(TOOL_REGISTRY).find(key => TOOL_REGISTRY[key] === tool) || '';
                    return (
                        <div key={toolId} className="flex items-center gap-2 text-sm">
                            {tool.isImplemented ? (
                                <Icon className="w-4 h-4 text-green-400"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></Icon>
                            ) : (
                                <div className="w-4 h-4 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-zinc-500"></div>
                                </div>
                            )}
                            <span className={tool.isImplemented ? 'text-zinc-300' : 'text-zinc-500'}>
                                {t(`tool_${toolId}_title`)}
                            </span>
                        </div>
                    );
                })}
                 {tools.length === 0 && <p className="text-xs text-zinc-500">Próximamente...</p>}
            </div>
        </div>
    );
};

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslations();

    const toolsByStage = useMemo(() => {
        const stages = Object.values(WorkflowStage);
        const registryEntries = Object.values(TOOL_REGISTRY);

        const result: Partial<Record<WorkflowStage, ToolConfig[]>> = {};

        stages.forEach(stage => {
            const typedStage = stage as WorkflowStage;
            result[typedStage] = registryEntries.filter(tool => tool.stage === typedStage);
        });
        
        return result;
    }, []);

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
                        className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
                            <h2 className="text-xl font-bold text-white">{t('aboutModal.title')}</h2>
                            <button onClick={onClose} className="p-1 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white">
                                <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></Icon>
                            </button>
                        </header>
                        <main className="p-6 space-y-8 overflow-y-auto">
                            <div className="text-zinc-300 space-y-3">
                                <p>{t('aboutModal.p1')}</p>
                                <p>{t('aboutModal.p2')}</p>
                                <p className="text-sm text-zinc-400">{t('aboutModal.p3')}</p>
                            </div>
                            
                            <div className="border-t border-zinc-700/80 pt-6">
                                <h3 className="text-lg font-bold text-white mb-1">{t('aboutModal.roadmapTitle')}</h3>
                                <p className="text-sm text-zinc-400 mb-4">{t('aboutModal.roadmapDescription')}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(toolsByStage).map(([stage, tools]) => (
                                        <StageProgress key={stage} stage={stage as WorkflowStage} tools={tools || []} />
                                    ))}
                                </div>
                            </div>
                            
                             <div className="border-t border-zinc-700/80 pt-6">
                                <h3 className="text-lg font-bold text-white mb-1">{t('aboutModal.principlesTitle')}</h3>
                                <p className="text-sm text-zinc-400 mb-4">{t('aboutModal.principlesDescription')}</p>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-zinc-700">
                                        <thead className="bg-zinc-800/50">
                                            <tr>
                                                <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-zinc-300 uppercase tracking-wider">{t('aboutModal.practice')}</th>
                                                <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-zinc-300 uppercase tracking-wider">{t('aboutModal.objective')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-zinc-900/50 divide-y divide-zinc-800">
                                            {PRINCIPLES.map((p, index) => (
                                                <tr key={index}>
                                                    <td className="px-4 py-3 text-sm font-medium text-white whitespace-nowrap">{t(`principle_${p}_title`)}</td>
                                                    <td className="px-4 py-3 text-sm text-zinc-400 whitespace-nowrap">{t(`principle_${p}_description`)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </main>
                        <footer className="p-4 bg-zinc-950/50 border-t border-white/10 flex justify-end flex-shrink-0">
                            <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-zinc-200 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                                {t('closeButton')}
                            </button>
                        </footer>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
