
import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserRole, WorkflowStage, ToolStatus } from '../types';
import { useTranslations } from '../contexts/LanguageContext';
import { TOOL_REGISTRY } from '../utils/toolRegistry';
import { Icon } from './Icon';
import { OnboardingTour, TourStep } from './OnboardingTour';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface StrategicJourneyProps {
    userRole: UserRole;
    onLaunchTool: (toolId: string) => void;
    currentStage: WorkflowStage;
    completedTools: Record<string, boolean>;
}

const p = (d: string) => React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d });

const STAGE_CONFIG: Record<WorkflowStage, { icon: React.ReactNode }> = {
    [WorkflowStage.DIAGNOSIS]: { icon: p("M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5-.5 1.5m0 0 .5 1.5m-1.5-.5-1.5-1.5m-6-3h12") },
    [WorkflowStage.STRATEGY]: { icon: p("M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z") },
    [WorkflowStage.PURPOSE]: { icon: p("M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z") },
    [WorkflowStage.PROTOTYPING]: { icon: p("M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6-2.292m0-14.25v14.25") },
    [WorkflowStage.VALIDATION]: { icon: p("M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-2.253M15 19.128v-3.86a2.25 2.25 0 0 1 .9-1.751M15 19.128S14.25 19.5 12 19.5s-3-1.872-3-1.872v-3.86a2.25 2.25 0 0 1 .9-1.751M12 15.25v3.86m0 0S11.25 19.5 9 19.5s-3-1.872-3-1.872v-3.86a2.25 2.25 0 0 1 .9-1.751M9 15.25v3.86M15 13.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z") },
    [WorkflowStage.IMPLEMENTATION]: { icon: p("M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18") },
    [WorkflowStage.REFLECTION]: { icon: p("M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z") },
};

const JourneyGuide: React.FC<{ stage: WorkflowStage }> = ({ stage }) => {
    const { t } = useTranslations();
    
    // Only show for Diagnosis stage for now as per requirement
    if (stage !== WorkflowStage.DIAGNOSIS) return null;

    return (
        <motion.div
            id="journey-guide"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-900/30 to-fuchsia-900/30 border border-white/10 rounded-xl p-4 mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center"
        >
            <div className="flex-shrink-0 bg-white/10 p-2 rounded-lg">
                <Icon className="w-6 h-6 text-yellow-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" /></Icon>
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-white mb-2 text-sm uppercase tracking-wider">{t('journey_guide_title')}</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="border-l-2 border-blue-500/50 pl-3">
                        <p className="text-zinc-300">{t(`journey_guide_${stage}_novice`)}</p>
                    </div>
                    <div className="border-l-2 border-fuchsia-500/50 pl-3">
                        <p className="text-zinc-300">{t(`journey_guide_${stage}_pro`)}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export const StrategicJourney: React.FC<StrategicJourneyProps> = ({ userRole, onLaunchTool, currentStage, completedTools }) => {
    const { t } = useTranslations();
    const [hasSeenTour, setHasSeenTour] = useLocalStorage('astra-hasSeenTour', false);
    const [isTourOpen, setIsTourOpen] = useState(false);

    // Initialize tour only once
    useEffect(() => {
        if (!hasSeenTour) {
            setIsTourOpen(true);
        }
    }, [hasSeenTour]);

    const handleTourComplete = () => {
        setHasSeenTour(true);
    };
    
    const stages = Object.values(WorkflowStage);
    const currentStageIndex = stages.indexOf(currentStage);

    const toolsForCurrentStage = Object.entries(TOOL_REGISTRY)
        .filter(([, config]) => config.stage === currentStage && config.roles.includes(userRole))
        .sort(([, a], [, b]) => (a.order || 0) - (b.order || 0));

    const isCurrentStageComplete = toolsForCurrentStage.every(([id]) => completedTools[id]);
    
    const progress = ((currentStageIndex + (isCurrentStageComplete ? 1 : 0)) / stages.length) * 100;

    const coachTips = t(`coach_${currentStage}`);
    const randomTip = useMemo(() => {
        if (Array.isArray(coachTips) && coachTips.length > 0) {
            return coachTips[Math.floor(Math.random() * coachTips.length)];
        }
        return coachTips;
    }, [currentStage, coachTips]);

    // Tour definition
    const tourSteps: TourStep[] = [
        {
            targetId: undefined, // Center
            title: t('tour_welcome_title'),
            content: t('tour_welcome_content'),
        },
        {
            targetId: 'journey-header',
            title: t('tour_stages_title'),
            content: t('tour_stages_intro'),
            position: 'bottom'
        },
        // Explaining the specific stages as requested by the prompt
        {
            targetId: 'journey-progress',
            title: t('stage_DIAGNOSIS_title'),
            content: t('tour_diagnosis_desc'),
            position: 'bottom'
        },
        {
            targetId: 'journey-progress',
            title: t('stage_PURPOSE_title'),
            content: t('tour_purpose_desc'),
             position: 'bottom'
        },
        {
            targetId: 'journey-progress',
            title: t('stage_PROTOTYPING_title'),
            content: t('tour_prototyping_desc'),
             position: 'bottom'
        },
         {
            targetId: 'journey-progress',
            title: t('stage_VALIDATION_title'),
            content: t('tour_validation_desc'),
             position: 'bottom'
        },
         {
            targetId: 'journey-progress',
            title: t('stage_IMPLEMENTATION_title'),
            content: t('tour_implementation_desc'),
             position: 'bottom'
        },
        {
            targetId: 'journey-progress',
            title: t('stage_REFLECTION_title'),
            content: t('tour_reflection_desc'),
             position: 'bottom'
        },
        {
            targetId: 'journey-tools',
            title: t('tour_tools_title'),
            content: t('tour_tools_desc'),
             position: 'top'
        }
    ];


    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-zinc-950 pb-40">
            <OnboardingTour 
                isOpen={isTourOpen} 
                onClose={() => setIsTourOpen(false)} 
                steps={tourSteps}
                onComplete={handleTourComplete}
            />

            <div className="max-w-7xl mx-auto">
                <motion.div id="journey-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t('strategicJourney_title')}</h1>
                    <p className="text-base md:text-lg text-zinc-400 max-w-3xl">{t('strategicJourney_subtitle')}</p>
                    <div id="journey-progress" className="mt-4">
                        <div className="w-full bg-zinc-800/50 rounded-full h-2.5">
                            <motion.div
                                className="bg-gradient-to-r from-blue-500 to-fuchsia-500 h-2.5 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                            />
                        </div>
                    </div>
                </motion.div>
                
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 mb-8 flex items-start gap-4">
                    <Icon className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V8.25a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 8.25v10.5A2.25 2.25 0 0 0 6.75 19.5Z" /></Icon>
                    <div>
                         <h2 className="text-xl font-bold text-white mb-2">{t(`stage_${currentStage}_title`)}</h2>
                         <p className="text-zinc-300 italic">"{randomTip}"</p>
                    </div>
                </div>
                
                <JourneyGuide stage={currentStage} />
                
                <motion.div
                    id="journey-tools"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.07 } },
                        hidden: {},
                    }}
                >
                    {toolsForCurrentStage.map(([toolId, config], index) => {
                        const isCompleted = completedTools[toolId];
                        
                        // Mentor Mode: Sequential Locking Logic
                        // A tool is locked if it's NOT completed AND the previous tool in the sequence is NOT completed.
                        // EXCEPTION: Diagnosis Stage tools are all available in parallel.
                        const prevToolId = index > 0 ? toolsForCurrentStage[index - 1][0] : null;
                        const isLocked = currentStage !== WorkflowStage.DIAGNOSIS && prevToolId ? !completedTools[prevToolId] && !isCompleted : false;

                        return (
                            <motion.button
                                key={toolId}
                                onClick={() => !isLocked && onLaunchTool(toolId)}
                                disabled={isLocked}
                                className={`group relative text-left p-6 bg-zinc-900 border-2 rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col ${
                                    isCompleted 
                                        ? 'border-green-500/30 bg-green-900/10' 
                                        : isLocked 
                                            ? 'border-zinc-800 opacity-50 cursor-not-allowed' 
                                            : 'border-zinc-700 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10'
                                }`}
                                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}}
                                whileHover={!isLocked ? { y: -5 } : {}}
                            >
                                {isCompleted && (
                                    <div className="absolute top-3 right-3 text-green-400">
                                        <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></Icon>
                                    </div>
                                )}
                                {isLocked && (
                                    <div className="absolute top-3 right-3 text-zinc-600">
                                        <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></Icon>
                                    </div>
                                )}
                                <div className={`mb-4 w-12 h-12 rounded-lg flex items-center justify-center border transition-colors ${
                                    isLocked 
                                        ? 'bg-zinc-800/50 border-zinc-800 text-zinc-600' 
                                        : 'bg-zinc-800 border-zinc-700 text-white group-hover:bg-zinc-700/50'
                                }`}>
                                    <Icon className="w-7 h-7">{config.icon}</Icon>
                                </div>
                                <h3 className={`text-lg font-bold ${isCompleted ? 'text-zinc-400' : isLocked ? 'text-zinc-600' : 'text-white'}`}>{t(config.titleKey)}</h3>
                                <p className={`text-sm mt-1 flex-grow ${isCompleted ? 'text-zinc-500' : isLocked ? 'text-zinc-700' : 'text-zinc-400'}`}>{t(config.descriptionKey)}</p>
                                
                                {!isLocked && !isCompleted && (
                                    <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center text-blue-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span>{t('start_now')}</span>
                                        <Icon className="w-4 h-4 ml-2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></Icon>
                                    </div>
                                )}
                            </motion.button>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
};
