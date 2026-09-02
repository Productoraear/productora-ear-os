import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Project, PredictiveInsight } from '../types';
import { generatePredictiveAnalysis } from '../services/geminiService';
import { Icon } from './Icon';
import { useTranslations } from '../contexts/LanguageContext';

interface PredictiveWidgetProps {
    projects: Project[];
    dataContextString: string;
}

export const PredictiveWidget: React.FC<PredictiveWidgetProps> = ({ projects, dataContextString }) => {
    const { language } = useTranslations();
    const [insight, setInsight] = useState<PredictiveInsight | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInsight = async () => {
            setIsLoading(true);
            try {
                const result = await generatePredictiveAnalysis(projects, dataContextString, language);
                setInsight(result);
            } catch (error) {
                console.error("Predictive error", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (projects.length > 0) {
            fetchInsight();
        } else {
            setIsLoading(false);
        }
    }, [projects, dataContextString, language]);

    if (isLoading) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-900/10 animate-pulse" />
                {/* Scanner Effect */}
                <motion.div 
                    className="absolute top-0 left-0 w-full h-1 bg-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.8)]"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <Icon className="w-8 h-8 text-blue-400 mb-3 animate-spin"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5-.5 1.5m0 0 .5 1.5m-1.5-.5-1.5-1.5m-6-3h12" /></Icon>
                <p className="text-xs font-mono text-blue-300 tracking-widest uppercase">Escaneo Predictivo...</p>
            </div>
        );
    }

    if (!insight) return (
        <div className="h-full flex items-center justify-center p-4">
            <p className="text-zinc-500 text-xs text-center">Datos insuficientes para predicción cuántica.</p>
        </div>
    );

    const getTrendColor = (trend: string) => {
        switch(trend) {
            case 'POSITIVE': return 'text-green-400 bg-green-900/20 border-green-500/30';
            case 'NEGATIVE': return 'text-red-400 bg-red-900/20 border-red-500/30';
            default: return 'text-blue-400 bg-blue-900/20 border-blue-500/30';
        }
    };

    const trendStyle = getTrendColor(insight.trend);

    return (
        <div className="h-full flex flex-col p-5 relative overflow-hidden group">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-30 pointer-events-none" />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Horizonte de Eventos</h3>
                    <div className={`text-xs font-bold px-2 py-0.5 rounded border inline-flex items-center gap-1 ${trendStyle}`}>
                        {insight.trend === 'POSITIVE' ? '▲' : insight.trend === 'NEGATIVE' ? '▼' : '●'} {insight.trend}
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-mono font-bold text-white">{insight.probability}%</span>
                    <p className="text-[10px] text-zinc-500 uppercase">Probabilidad</p>
                </div>
            </div>

            <p className="text-sm text-zinc-200 leading-snug mb-4 relative z-10 font-medium">
                {insight.insight}
            </p>

            <div className="mt-auto relative z-10">
                <div className="p-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md">
                    <p className="text-[10px] text-zinc-400 uppercase mb-1 font-bold">Acción Micro-Correctiva</p>
                    <p className="text-xs text-blue-300 font-mono">
                        {">"} {insight.actionableTrigger}
                    </p>
                </div>
            </div>
        </div>
    );
};