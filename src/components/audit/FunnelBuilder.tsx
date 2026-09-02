import React, { useState } from 'react';
import { Filter, Zap, Target, DollarSign, Edit3, Save, Heart } from 'lucide-react';

export const FunnelBuilder = () => {
    const [funnel, setFunnel] = useState({
        attention: { hook: '¡DESPIERTA TU LEGADO!', copy: 'Nace VIMUME: La reconexión con el origen.' },
        interest: { hook: 'SOLUCIÓN SONORA PHOENIX', copy: 'Recuperamos la memoria emocional con tecnología 40Hz.' },
        desire: { hook: 'ESTÁNDAR SILICON VALLEY', copy: 'Unimos el lujo institucional con el impacto social real.' },
        action: { hook: 'INYECCIÓN AL SISTEMA', copy: 'Únete a la elite de Productora EAR ahora.' }
    });

    return (
        <section className="space-y-16 max-w-5xl mx-auto p-12 bg-white/5 border border-white/10 rounded-[4rem] backdrop-blur-2xl">
            <header className="text-center space-y-4">
                <span className="text-gold-500 text-[10px] font-black uppercase tracking-[0.5em]">Funnel Designer Sincrónico</span>
                <h3 className="text-4xl font-black uppercase tracking-tighter">Embudo de Conversión AIDA</h3>
                <p className="text-gray-500 max-w-lg mx-auto font-light text-sm italic italic">Diseñando el viaje desde la atención hasta la acción.</p>
            </header>

            {/* 🔽 Inverted Pyramid Visualization */}
            <div className="flex flex-col gap-4 py-10 relative">
                <div className="absolute left-[-40px] top-0 h-full w-px bg-gold-500/20 hidden lg:block" />
                
                {Object.entries(funnel).map(([phase, data], index) => (
                    <div 
                        key={phase} 
                        className="flex flex-col lg:flex-row items-center gap-8 group"
                        style={{ paddingLeft: `${index * 8}%`, paddingRight: `${index * 8}%` }}
                    >
                        <div className={`p-8 bg-black/50 border border-white/10 rounded-2xl flex-1 hover:border-gold-500/50 transition-all flex justify-between items-center group relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Filter size={48} className="text-gold-500" />
                            </div>
                            
                            <div className="space-y-3 relative z-10 w-full">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gold-500/60">{phase}</span>
                                <div className="flex items-center gap-4">
                                    <input 
                                        value={data.hook} 
                                        onChange={(e) => setFunnel({...funnel, [phase]: {...data, hook: e.target.value.toUpperCase()}})}
                                        className="bg-transparent border-none outline-none text-2xl font-black uppercase tracking-tighter text-white w-full"
                                    />
                                    <Edit3 size={14} className="text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <textarea 
                                    value={data.copy} 
                                    onChange={(e) => setFunnel({...funnel, [phase]: {...data, copy: e.target.value}})}
                                    className="bg-transparent border-none outline-none text-xs text-gray-500 italic w-full h-12"
                                />
                            </div>
                        </div>

                        <div className="hidden lg:flex flex-col items-center gap-2 opacity-20 group-hover:opacity-100 transition-opacity">
                            <div className="w-10 h-10 rounded-full border border-gold-500 flex items-center justify-center">
                                {index === 0 && <Target size={16} className="text-gold-500" />}
                                {index === 1 && <Zap size={16} className="text-gold-500" />}
                                {index === 2 && <Heart size={16} className="text-gold-500" />}
                                {index === 3 && <DollarSign size={16} className="text-gold-500" />}
                            </div>
                            <div className="h-12 w-px bg-gold-500/40" />
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full py-8 bg-gold-500 text-black font-black uppercase tracking-[0.5em] text-xs rounded-3xl hover:bg-white transition-all shadow-2xl flex items-center justify-center gap-4">
                <Save size={18} />
                Guardar Sincronicidad del Funnel
            </button>
        </section>
    );
};
