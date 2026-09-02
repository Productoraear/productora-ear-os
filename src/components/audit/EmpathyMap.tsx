import React, { useState } from 'react';
import { Eye, Volume2, HelpCircle, User, CheckCircle, BrainCircuit } from 'lucide-react';

export const EmpathyMap = () => {
    const [pains, setPains] = useState([
        { id: 1, text: 'Inexistencia de marca sonora' },
        { id: 2, text: 'Falta de conexión institucional' },
        { id: 3, text: 'Ruido en la comunicación digital' }
    ]);
    const [gains, setGains] = useState([
        { id: 4, text: 'Reconocimiento de legado (VIMUME)' },
        { id: 5, text: 'Monetización Soberana' },
        { id: 6, text: 'Ecosistema EAR Pro' }
    ]);

    return (
        <section className="space-y-16 max-w-5xl mx-auto p-12 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl animate-in fade-in slide-in-from-bottom duration-700">
            <header className="text-center space-y-4">
                <span className="text-gold-500 text-[10px] font-black uppercase tracking-[0.5em]">Fan Profile 2.4 Audit</span>
                <h3 className="text-4xl font-black uppercase tracking-tighter">Radiografía del Perfil</h3>
                <p className="text-gray-500 max-w-lg mx-auto font-light italic text-sm">Analizando la psique de tu audiencia a través de la metodología EAR.</p>
            </header>

            {/* 🎯 Empatía Quadrant Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-white/10 hidden md:block" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-px w-full bg-white/10 hidden md:block" />

                <div className="p-8 space-y-4 bg-black/50 rounded-2xl border border-white/10 group hover:border-gold-500/50 transition-all">
                    <div className="flex items-center gap-4">
                        <User className="text-gold-500" />
                        <h6 className="text-[10px] font-black uppercase tracking-widest text-gray-500">¿Qué Ve?</h6>
                    </div>
                    <textarea className="w-full bg-transparent p-4 text-xs font-light text-gray-300 outline-none resize-none h-24" placeholder="Entorno, competidores, estímulos visuales..." />
                </div>
                <div className="p-8 space-y-4 bg-black/50 rounded-2xl border border-white/10 group hover:border-gold-500/50 transition-all">
                    <div className="flex items-center gap-4">
                        <HelpCircle className="text-gold-500" />
                        <h6 className="text-[10px] font-black uppercase tracking-widest text-gray-500">¿Qué Oye?</h6>
                    </div>
                    <textarea className="w-full bg-transparent p-4 text-xs font-light text-gray-300 outline-none resize-none h-24" placeholder="Opiniones, rumores, influencia de terceros..." />
                </div>
                <div className="p-8 space-y-4 bg-black/50 rounded-2xl border border-white/10 group hover:border-gold-500/50 transition-all">
                    <div className="flex items-center gap-4">
                        <BrainCircuit className="text-gold-500" />
                        <h6 className="text-[10px] font-black uppercase tracking-widest text-gray-500">¿Qué Piensa?</h6>
                    </div>
                    <textarea className="w-full bg-transparent p-4 text-xs font-light text-gray-300 outline-none resize-none h-24" placeholder="Emociones profundas, dudas, sueños no expresados..." />
                </div>
                <div className="p-8 space-y-4 bg-black/50 rounded-2xl border border-white/10 group hover:border-gold-500/50 transition-all">
                    <div className="flex items-center gap-4">
                        <CheckCircle className="text-gold-500" />
                        <h6 className="text-[10px] font-black uppercase tracking-widest text-gray-500">¿Qué Dice/Hace?</h6>
                    </div>
                    <textarea className="w-full bg-transparent p-4 text-xs font-light text-gray-300 outline-none resize-none h-24" placeholder="Comportamiento público, acciones, contradicciones..." />
                </div>
            </div>

            {/* 📉 Pains & Gains */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white/5 p-12 rounded-[2rem] border border-white/10">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <h6 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500">Pains / Fricción</h6>
                    </div>
                    <div className="space-y-4">
                        {pains.map((p) => (
                            <div key={p.id} className="p-6 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between group">
                                <span className="text-sm font-light text-gray-400 group-hover:text-white transition-colors">{p.text}</span>
                                <input type="checkbox" className="w-4 h-4 accent-red-500 bg-transparent border border-white/20" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <h6 className="text-[10px] font-black uppercase tracking-[0.4em] text-green-500">Gains / Propósito</h6>
                    </div>
                    <div className="space-y-4">
                        {gains.map((g) => (
                            <div key={g.id} className="p-6 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between group">
                                <span className="text-sm font-light text-gray-400 group-hover:text-white transition-colors">{g.text}</span>
                                <input type="checkbox" className="w-4 h-4 accent-green-500 bg-transparent border border-white/20" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <button className="w-full py-8 bg-gold-500 text-black font-black uppercase tracking-[0.5em] text-xs rounded-3xl hover:bg-white transition-all shadow-[0_20px_60px_rgba(196,163,0,0.3)]">
                Inyectar Auditoría al Núcleo de Memoria
            </button>
        </section>
    );
};
