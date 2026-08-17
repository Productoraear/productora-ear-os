
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole, Project, ImpactNugget, NextAction, UserProfileSummary, VisionCardData } from '../types';
import { useTranslations } from '../contexts/LanguageContext';
import { Icon } from './Icon';
import { TOOL_REGISTRY } from '../utils/toolRegistry';
import { generateNextAction, generateStrategicInsight } from '../services/geminiService';
import { telemetry, SystemHealth } from '../services/telemetryService';
import { useHaptics } from '../hooks/useHaptics';
import { CountdownWidget } from './CountdownWidget'; 
import { PredictiveWidget } from './PredictiveWidget'; // New Import

interface StrategicCommandDashboardProps {
    userRole: UserRole;
    onNavigateToJourney: () => void;
    onLaunchTool: (toolId: string) => void;
    projects: Project[];
    userNuggets: ImpactNugget[];
    userProfile: UserProfileSummary | null;
    dataContextString: string;
    onUpdateUserProfile: (newProfile: UserProfileSummary) => void;
    completedTools: Record<string, any>;
    visions: VisionCardData[];
    isZenMode?: boolean; // Added Prop
}

// Bento Widget with "Midnight Luxury" styling
const Widget: React.FC<{ 
    title: string; 
    children: React.ReactNode; 
    className?: string; 
    icon?: React.ReactNode;
    onClick?: () => void;
    noPadding?: boolean;
}> = ({ title, children, className = '', icon, onClick, noPadding }) => (
    <motion.div 
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onClick}
        className={`glass-card rounded-2xl flex flex-col relative overflow-hidden ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
        {!noPadding && (
            <>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    {icon && <div className="scale-150 transform">{icon}</div>}
                </div>
                <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2 z-10 px-6 pt-6">
                    {icon}
                    {title}
                </h2>
                <div className="flex-1 z-10 relative px-6 pb-6">
                    {children}
                </div>
            </>
        )}
        {noPadding && children}
    </motion.div>
);

const SystemHealthWidget: React.FC = () => {
    const { t } = useTranslations();
    const [health, setHealth] = useState<SystemHealth>(telemetry.getSystemHealth());

    useEffect(() => {
        const interval = setInterval(() => {
            setHealth(telemetry.getSystemHealth());
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-zinc-500 text-xs font-mono">{t('dashboard_system_health_status')}</span>
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${health.status === 'OPTIMAL' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                    <span className="text-xs font-bold text-zinc-300">{health.status}</span>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-black/40 p-2 rounded border border-white/5">
                    <p className="text-[10px] text-zinc-600 mb-1">LATENCY</p>
                    <p className="text-base font-mono text-blue-400">{health.latency}ms</p>
                </div>
                <div className="bg-black/40 p-2 rounded border border-white/5">
                    <p className="text-[10px] text-zinc-600 mb-1">COGNITION</p>
                    <p className="text-base font-mono text-purple-400">{(health.tokensProcessed/1000).toFixed(1)}k</p>
                </div>
            </div>
        </div>
    );
};

export const StrategicCommandDashboard: React.FC<StrategicCommandDashboardProps> = ({
    userRole,
    onNavigateToJourney,
    onLaunchTool,
    projects,
    userNuggets,
    userProfile,
    dataContextString,
    onUpdateUserProfile,
    completedTools,
    visions,
    isZenMode
}) => {
    const { t, language } = useTranslations();
    const haptic = useHaptics();
    const [nextAction, setNextAction] = useState<NextAction | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(true);
    const [strategicInsight, setStrategicInsight] = useState<string | null>(null);
    const [isInsightLoading, setIsInsightLoading] = useState(true);

    const greetings = t('dashboard_greeting');
    const greeting = useMemo(() => greetings[Math.floor(Math.random() * greetings.length)], [greetings]);

    const lastCompletedToolId = useMemo(() => {
        const completed = Object.keys(completedTools);
        return completed.length > 0 ? completed[completed.length - 1] : null;
    }, [completedTools]);

    useEffect(() => {
        if (userProfile) {
            setIsActionLoading(true);
            setIsInsightLoading(true);
            generateNextAction(dataContextString, userProfile, language, userRole)
                .then(setNextAction)
                .catch(e => console.error("Failed to get next action", e))
                .finally(() => setIsActionLoading(false));
            
            generateStrategicInsight(dataContextString, userProfile, language, userRole)
                .then(setStrategicInsight)
                .catch(e => console.error("Failed to get strategic insight", e))
                .finally(() => setIsInsightLoading(false));
        }
    }, [userProfile, dataContextString, language, userRole]);
    
    // Zen Mode: Show only Next Action
    if (isZenMode && nextAction) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center h-full p-8 bg-midnight">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl text-center space-y-8"
                >
                    <Icon className="w-16 h-16 text-gold mx-auto opacity-80"><path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></Icon>
                    <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">{nextAction.action}</h2>
                    <p className="text-xl text-zinc-400 font-light leading-relaxed">{nextAction.reasoning}</p>
                    <button 
                        onClick={() => { haptic('medium'); onLaunchTool(nextAction.toolId); }} 
                        className="btn-glow py-4 px-12 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
                    >
                        {t('dashboard_acceptButton')}
                    </button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-midnight">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">{greeting}</h1>
                    <p className="text-lg text-zinc-400 font-light">{t('dashboard_subtitle')}</p>
                </motion.div>
                
                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
                    
                    {/* Next Action - Hero - Spans 2 cols */}
                    <Widget title={t('dashboard_next_action_title')} className="md:col-span-2 lg:col-span-2 border-l-4 border-l-gold" icon={<Icon className="w-5 h-5 text-gold"><path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></Icon>}>
                        {isActionLoading ? (
                            <p className="text-zinc-500 animate-pulse">{t('dashboard_generating_next_action')}</p>
                        ) : nextAction ? (
                            <div className="flex flex-col h-full justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-white mb-2 leading-tight">{nextAction.action}</p>
                                    <p className="text-zinc-400 text-sm">{nextAction.reasoning}</p>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <button 
                                        onClick={() => { haptic('success'); onLaunchTool(nextAction.toolId); }}
                                        className="btn-glow py-2 px-6 bg-zinc-100 text-black font-bold rounded-lg hover:bg-white transition-colors flex items-center gap-2"
                                    >
                                        {t('dashboard_acceptButton')} <Icon className="w-4 h-4"><path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></Icon>
                                    </button>
                                </div>
                            </div>
                        ) : <p className="text-zinc-500">{t('errorUnknown')}</p>}
                    </Widget>

                    {/* System Health */}
                    <Widget title={t('dashboard_system_health_title')} className="md:col-span-1" icon={<Icon className="w-5 h-5 text-emerald-500"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></Icon>}>
                        <SystemHealthWidget />
                    </Widget>

                    {/* Countdown Widget (New) */}
                    <Widget title="" className="md:col-span-1 bg-black/40" noPadding>
                        <div className="p-6 h-full">
                            <CountdownWidget />
                        </div>
                    </Widget>

                    {/* Quick Access / Journey */}
                    <Widget title="Acceso Rápido" className="md:col-span-1 lg:row-span-2" icon={<Icon className="w-5 h-5 text-blue-400"><path d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" /></Icon>}>
                         <button onClick={onNavigateToJourney} className="w-full h-full flex flex-col items-center justify-center gap-3 text-zinc-400 hover:text-white transition-colors group">
                            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                <Icon className="w-8 h-8 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></Icon>
                            </div>
                            <span className="font-semibold">{t('dashboard_view_journey')}</span>
                         </button>
                    </Widget>

                    {/* PREDICTIVE ENGINE (Replacing Static Radar) */}
                    <Widget title="Motor Predictivo" className="md:col-span-1 lg:col-span-2 bg-gradient-to-br from-indigo-900/20 to-blue-900/10" noPadding>
                         <PredictiveWidget projects={projects} dataContextString={dataContextString} />
                    </Widget>

                    {/* Wisdom (Scrollable) */}
                    <Widget title={t('dashboard_wisdom_title')} className="md:col-span-1" icon={<Icon className="w-5 h-5 text-orange-400"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4" /></Icon>}>
                         {userNuggets.length > 0 ? (
                            <div className="space-y-3 max-h-[150px] overflow-y-auto pr-2">
                                {userNuggets.slice().reverse().map((n, i) => (
                                    <div key={i} className="text-xs bg-white/5 p-2 rounded border border-white/5">
                                        <span className="text-orange-300 block mb-1 font-bold">{n.category}</span>
                                        <span className="text-zinc-300">{n.title}</span>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-zinc-500 text-sm text-center mt-8">{t('dashboard_no_wisdom')}</p>}
                    </Widget>

                    {/* Micro Victory */}
                    {lastCompletedToolId && (
                         <Widget title={t('dashboard_micro_victory_title')} className="md:col-span-1 lg:col-span-2 bg-gradient-to-r from-green-900/20 to-emerald-900/10 border-green-500/20" icon={<Icon className="w-5 h-5 text-green-400"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9 9 0 1 1 9 0Z" /></Icon>}>
                            <p className="text-green-100 text-lg font-medium">{t('dashboard_micro_victory_text').replace('{toolName}', t(TOOL_REGISTRY[lastCompletedToolId]?.titleKey))}</p>
                        </Widget>
                    )}

                </div>
            </div>
        </div>
    );
};