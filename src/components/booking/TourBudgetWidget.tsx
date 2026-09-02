'use client';

import React from 'react';
import { DollarSign, ShieldCheck, TrendingUp, Zap, ChevronRight, Activity, Calendar, Award, Sparkles } from 'lucide-react';

interface TourBudgetWidgetProps {
    baseInvestment: number;
}

export const TourBudgetWidget = ({ baseInvestment }: TourBudgetWidgetProps) => {
    const techInvestment = 4250; // Mock derived from selections
    const taxes = (baseInvestment + techInvestment) * 0.21;
    const total = baseInvestment + techInvestment + taxes;
    
    // Strategic ROI Projection
    const estimatedROI = total * 1.85; 

    return (
        <aside className="w-full lg:w-[450px] space-y-8 sticky top-32">
            {/* Main Summary Card */}
            <div className="bg-black/80 border border-white/10 rounded-[4rem] p-12 space-y-12 relative overflow-hidden group shadow-[0_60px_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl hover:border-gold-500 transition-all duration-700">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                    <Sparkles size={250} className="text-gold-500 animate-spin-slow" />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Activity className="text-gold-500 animate-pulse" />
                        <span className="text-gold-500 text-[10px] font-black uppercase tracking-[0.4em]">Resumen Estratégico v0.5</span>
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Inversión Final</h2>
                </div>

                <div className="space-y-6">
                    <div className="flex justify-between items-baseline group/item">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover/item:text-gold-500 transition-colors">Despliegue Artístico</span>
                        <div className="flex-1 mx-4 border-b border-white/5 border-dotted group-hover/item:border-gold-500/20 transition-colors" />
                        <span className="text-xl font-bold">{baseInvestment.toLocaleString()}€</span>
                    </div>
                    <div className="flex justify-between items-baseline group/item">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover/item:text-gold-500 transition-colors">Equipamiento Técnico</span>
                        <div className="flex-1 mx-4 border-b border-white/5 border-dotted group-hover/item:border-gold-500/20 transition-colors" />
                        <span className="text-xl font-bold">{techInvestment.toLocaleString()}€</span>
                    </div>
                    <div className="flex justify-between items-baseline group/item">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover/item:text-gold-500 transition-colors">Impuestos (IVA 21%)</span>
                        <div className="flex-1 mx-4 border-b border-white/5 border-dotted group-hover/item:border-gold-500/20 transition-colors" />
                        <span className="text-xl font-bold text-gray-400">{taxes.toLocaleString()}€</span>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/10 flex flex-col gap-4">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold-500">Inversión Total EAR</span>
                            <div className="text-6xl font-black tracking-tighter text-white group-hover:scale-105 transition-transform origin-left">
                                {Math.round(total).toLocaleString()}€
                            </div>
                        </div>
                        <div className="p-5 bg-gold-500/20 border border-gold-500/30 rounded-3xl text-gold-500 animate-bounce">
                            <Zap size={24} />
                        </div>
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-600">Presupuesto sujeto a auditoría logística final.</p>
                </div>

                <div className="space-y-6 bg-white/5 p-8 rounded-[3rem] border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex items-center gap-4">
                        <TrendingUp size={18} className="text-green-500" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Proyección de Impacto (ROI)</h4>
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-600 block mb-1">Retorno Estimado</span>
                            <p className="text-2xl font-black text-green-500">+{estimatedROI.toLocaleString()}€</p>
                        </div>
                        <div className="text-right">
                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-600 block mb-1">Índice de Señal</span>
                            <p className="text-2xl font-black text-gold-500">92/100</p>
                        </div>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-gradient-to-r from-green-500 to-gold-500" />
                    </div>
                </div>

                <button className="w-full py-10 bg-gold-500 text-black font-black uppercase tracking-[0.4em] text-[11px] rounded-[2.5rem] hover:bg-white transition-all shadow-[0_20px_60px_rgba(196,163,0,0.3)] flex items-center justify-center gap-6 group/btn active:scale-95 transition-all">
                    <Calendar size={18} className="group-hover/btn:animate-pulse" />
                    BLOQUEAR FECHA AHORA
                    <ChevronRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                </button>
            </div>

            {/* Trust Seals and Badges */}
            <div className="flex justify-between items-center px-8">
                <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-gray-700">
                        <ShieldCheck size={20} />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-700">Secure Cloud Sync</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-gray-700">
                        <Award size={20} />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-700">Elite Standards</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-gray-700">
                        <DollarSign size={20} />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-700">Best ROI Guaranteed</span>
                </div>
            </div>
        </aside>
    );
};
