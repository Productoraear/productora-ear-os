import React, { useState } from 'react';
import { Target, Heart, Briefcase, Zap, Globe, Sparkles } from 'lucide-react';

export const IkigaiCompass = () => {
    const [points, setPoints] = useState({
        pasion: 'Innovación Sonora',
        mision: 'Dignificar el Legado',
        profesion: 'Producción de Élite',
        vocacion: 'Arquitectura Institucional'
    });

    return (
        <section className="space-y-16 max-w-5xl mx-auto p-12 bg-[#0A0A0A] border border-white/5 rounded-[4rem] relative overflow-hidden group shadow-2xl">
            {/* 🌀 Fondo Dinámico Ikigai */}
            <div className="absolute inset-0 opacity-10 flex items-center justify-center animate-spin-slow">
                <div className="relative w-[120%] aspect-square border-4 border-dashed border-gold-500 rounded-full" />
            </div>

            <header className="text-center space-y-4 relative z-10">
                <span className="text-gold-500 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">SISTEMA CUÁNTICO EMANAGER V2.4</span>
                <h3 className="text-5xl font-black uppercase tracking-tighter">Brújula Ikigai / Propósito</h3>
                <p className="text-gray-500 max-w-lg mx-auto font-light text-sm italic">Sincronizando la pasión con el mercado en el Nodo EAR.</p>
            </header>

            {/* 🎡 Venn Diagram Visualization */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-16 relative z-10 py-10">
                <div className="relative w-96 h-96 scale-110">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-500/20 border-2 border-red-500/50 rounded-full flex items-center justify-center backdrop-blur-sm shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                        <Heart className="text-red-500 bottom-8 absolute opacity-40" />
                        <span className="text-[10px] uppercase font-bold text-red-500/80 -translate-y-4">Lo que AMAS</span>
                    </div>
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-48 h-48 bg-blue-500/20 border-2 border-blue-500/50 rounded-full flex items-center justify-center backdrop-blur-sm shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                        <Globe className="text-blue-500 left-4 absolute opacity-40 shrink-0" />
                        <span className="text-[10px] uppercase font-bold text-blue-500/80 translate-x-4">El MUNDO Necesita</span>
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-gold-500/20 border-2 border-gold-500/50 rounded-full flex items-center justify-center backdrop-blur-sm shadow-[0_0_30px_rgba(196,163,0,0.2)]">
                        <Briefcase className="text-gold-500 top-8 absolute opacity-40" />
                        <span className="text-[10px] uppercase font-bold text-gold-500/80 translate-y-4">Por lo que cobras</span>
                    </div>
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-48 h-48 bg-green-500/20 border-2 border-green-500/50 rounded-full flex items-center justify-center backdrop-blur-sm shadow-[0_0_30_rgba(34,197,94,0.2)]">
                         <Zap className="text-green-500 right-4 absolute opacity-40" />
                         <span className="text-[10px] uppercase font-bold text-green-500/80 -translate-x-4">Lo que haces bien</span>
                    </div>
                    {/* ❇️ Centro Ikigai */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/10 border-2 border-white/50 rounded-full flex items-center justify-center backdrop-blur-3xl shadow-[0_0_60px_rgba(255,255,255,0.2)] animate-pulse">
                        <Target className="text-white" size={32} />
                    </div>
                </div>

                {/* 📝 Input Panel */}
                <div className="flex-1 w-full space-y-6">
                    {Object.entries(points).map(([key, value]) => (
                        <div key={key} className="p-6 bg-white/5 rounded-2xl border border-white/10 flex flex-col gap-2 hover:border-gold-500/50 transition-all shadow-xl group">
                            <label className="text-[10px] uppercase font-black text-gold-500 tracking-widest">{key}</label>
                            <input 
                                value={value} 
                                onChange={(e) => setPoints({...points, [key]: e.target.value})}
                                className="bg-transparent border-none outline-none text-xl font-bold uppercase tracking-tighter text-white"
                                placeholder={`Nombra tu ${key}...`}
                            />
                            <div className="w-full h-px bg-white/5 group-focus-within:bg-gold-500/30 transition-colors" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="p-8 bg-black/50 border border-white/10 rounded-3xl flex items-center space-x-6 group hover:translate-y-[-4px] transition-transform">
                    <div className="w-12 h-12 bg-gold-500/10 rounded-xl flex items-center justify-center group-hover:bg-gold-500/20 transition-all">
                        <Sparkles className="text-gold-500" />
                    </div>
                    <div>
                        <h6 className="text-md font-bold uppercase">Análisis Cuántico</h6>
                        <p className="text-xs text-gray-500 font-light">Calculando zona de genio con precisión Sonora.</p>
                    </div>
                </div>
                <button className="py-8 bg-gold-500 text-black font-black uppercase tracking-[0.5em] text-xs rounded-3xl hover:bg-white transition-all shadow-2xl">
                    VALIDAR SEÑAL DE PROPÓSITO
                </button>
            </div>
        </section>
    );
};
