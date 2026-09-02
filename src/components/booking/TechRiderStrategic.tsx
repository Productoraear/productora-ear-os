'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Info, FileText, Settings, Radio, Zap, Layout, Monitor, ClipboardCheck, Lock, Activity } from 'lucide-react';

export const TechRiderStrategic = () => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<'IDLE' | 'ANALYSING' | 'DONE'>('IDLE');

    useEffect(() => {
        if (status === 'ANALYSING') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setStatus('DONE');
                        return 100;
                    }
                    return prev + 1;
                });
            }, 50);
            return () => clearInterval(interval);
        }
    }, [status]);

    const handleStartAudit = () => {
        setProgress(0);
        setStatus('ANALYSING');
    };

    return (
        <section className="bg-black/50 border border-white/10 rounded-[4rem] p-16 relative overflow-hidden group/container shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <ShieldCheck size={200} className="text-gold-500" />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start gap-12 relative z-10">
                <div className="space-y-6 flex-1 max-w-xl">
                    <header className="space-y-2">
                        <div className="flex items-center gap-3">
                            <Activity className="text-gold-500 animate-pulse" />
                            <span className="text-gold-500 text-[10px] font-black uppercase tracking-[0.4em]">Strategic Tech Validation</span>
                        </div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">Viabilidad de Venue & Rider</h2>
                        <p className="text-gray-500 font-light italic text-sm">Validación quirúrgica de infraestructura técnica mediante IA predictiva.</p>
                    </header>

                    <div className="space-y-8">
                        {/* Status Progress */}
                        <div className="p-8 bg-white/5 border border-white/5 rounded-3xl space-y-4">
                            <div className="flex justify-between items-end">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${status === 'ANALYSING' ? 'text-gold-500 animate-pulse' : 'text-gray-500'}`}>
                                    {status === 'IDLE' ? 'Esperando Señal...' : status === 'ANALYSING' ? 'Extrayendo Metadata...' : 'Auditoría Completada | V05'}
                                </span>
                                <span className="text-xs font-mono text-white">{progress}%</span>
                            </div>
                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full bg-gold-500 transition-all duration-300 shadow-[0_0_15px_rgba(196,163,0,0.5)]`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Checklist Section */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: 'sound', label: 'Refuerzo Sonoro (L-Acoustics)', icon: Radio, checked: true },
                                { id: 'light', label: 'Iluminación Espectacular', icon: Zap, checked: progress > 40 },
                                { id: 'backline', label: 'Backline & Rigging', icon: Layout, checked: progress > 70 },
                                { id: 'logistics', label: 'Logística de Carga', icon: Settings, checked: progress > 90 }
                            ].map((item) => (
                                <div key={item.id} className={`p-4 rounded-xl border flex items-center gap-4 transition-all duration-500 ${item.checked ? 'bg-gold-500/10 border-gold-500/30' : 'bg-black/40 border-white/5 opacity-40'}`}>
                                    <div className={`p-2 rounded-lg ${item.checked ? 'bg-gold-500 text-black' : 'bg-white/5 text-gray-700'}`}>
                                        <item.icon size={14} />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-wider">{item.label}</span>
                                    {item.checked && <ClipboardCheck size={14} className="text-gold-500 ml-auto" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side Info & Action */}
                <div className="w-full md:w-80 space-y-4 pt-12">
                    <div className="p-8 bg-gold-500/5 border border-gold-500/20 rounded-3xl space-y-6">
                        <div className="flex items-center gap-3">
                            <Monitor size={18} className="text-gold-500" />
                            <h5 className="text-[10px] font-black uppercase tracking-widest">Sincronización Cloud</h5>
                        </div>
                        <p className="text-[10px] text-gray-400 leading-relaxed uppercase font-bold tracking-tighter">Integrando L-Acoustics Soundvision? & Vectorworks para validación de señal en tiempo real.</p>
                        
                        <div className="h-px bg-gold-500/10" />

                        <div className="space-y-2">
                            <div className="flex justify-between text-[8px] font-black text-gray-500 uppercase">
                                <span>Carga Crítica</span>
                                <span>84%</span>
                            </div>
                            <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-[84%] bg-gold-500/50" />
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleStartAudit}
                        disabled={status === 'ANALYSING'}
                        className="w-full py-8 bg-gold-500 text-black font-black uppercase tracking-[0.4em] text-[10px] rounded-[2rem] hover:bg-white transition-all shadow-[0_20px_60px_rgba(196,163,0,0.2)] flex items-center justify-center gap-4 overflow-hidden relative group/btn"
                    >
                        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                        <Lock size={14} className="group-hover/btn:rotate-12 transition-transform" />
                        <span className="relative z-10">{status === 'ANALYSING' ? 'Procesando...' : 'Validar Señal del Show'}</span>
                    </button>

                    <div className="flex items-center gap-2 justify-center py-4 opacity-50">
                        <Info size={12} className="text-gray-500" />
                        <span className="text-[8px] font-black uppercase text-gray-500 tracking-widest leading-none">Solo personal técnico EAR autorizado</span>
                    </div>
                </div>
            </div>
        </section>
    );
};
