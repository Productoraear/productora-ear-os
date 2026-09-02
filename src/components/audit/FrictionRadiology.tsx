import React, { useState } from 'react';
import { HelpCircle, Activity, ShieldX, Info, AlertTriangle } from 'lucide-react';

export const FrictionRadiology = () => {
    const [selectedFriction, setSelectedFriction] = useState('');

    const frictions = [
        { id: 'connection', label: 'Falta de conexión emocional', description: 'La audiencia no vibra con tu propuesta sonora.', severity: 'CRITICO' },
        { id: 'consistency', label: 'Inconsistencia en el mensaje', description: 'Tu identidad cambia según el canal o el momento.', severity: 'ALTA' },
        { id: 'technical', label: 'Inestabilidad Técnica', description: 'Problemas de calidad en audio/video/plataformas.', severity: 'MODERADA' }
    ];

    return (
        <section className="max-w-4xl mx-auto p-12 bg-[#050505] border-2 border-red-500/10 rounded-[3rem] relative animate-in zoom-in duration-500 shadow-[0_0_60px_rgba(239,68,68,0.05)]">
            <div className="absolute top-0 right-0 p-8">
                <ShieldX size={80} className="text-red-500 opacity-10" />
            </div>

            <header className="space-y-4 mb-12">
                <div className="flex items-center gap-3">
                    <Activity className="text-red-500 animate-pulse" />
                    <span className="text-red-500 text-[10px] font-black uppercase tracking-[0.4em]">Diagnóstico de Fricción V2.0</span>
                </div>
                <h3 className="text-4xl font-black uppercase tracking-tighter">Radiografía de Punto de Dolor</h3>
                <p className="text-gray-500 max-w-lg font-light text-sm italic">Detectando la interferencia que impide la señal pura.</p>
            </header>

            <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                    <HelpCircle size={18} className="text-gold-500" />
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-300">¿Cuál es el dolor principal que tu audiencia expresa?</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {frictions.map((f) => (
                        <label key={f.id} className={`p-8 bg-black/50 border rounded-2xl cursor-pointer transition-all flex items-center justify-between group ${selectedFriction === f.id ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.1)] translate-x-3' : 'border-white/5 hover:border-white/20'}`}>
                            <div className="flex items-center gap-6">
                                <input 
                                    type="radio" 
                                    name="friction" 
                                    className="w-6 h-6 accent-red-500 appearance-none border-2 border-white/10 rounded-full checked:bg-red-500 checked:border-transparent transition-all"
                                    onChange={() => setSelectedFriction(f.id)}
                                />
                                <div className="space-y-1">
                                    <h6 className="text-lg font-bold uppercase tracking-tighter">{f.label}</h6>
                                    <p className="text-xs text-gray-500 font-light max-w-sm">{f.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`text-[8px] font-black p-2 px-4 rounded-full ${f.severity === 'CRITICO' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}`}>
                                    {f.severity}
                                </span>
                                <div className="group/tooltip relative">
                                    <Info size={16} className="text-gray-700 hover:text-white transition-colors" />
                                    <div className="absolute bottom-full right-0 mb-4 w-64 p-6 bg-white text-black text-[10px] font-bold uppercase leading-relaxed rounded-2xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none shadow-2xl z-50">
                                        <div className="flex items-center gap-2 mb-2">
                                            <AlertTriangle size={14} className="text-red-600" />
                                            <span className="text-red-600">Metodología EAR Analysis</span>
                                        </div>
                                        Este punto de dolor indica una pérdida de GMV del 24% anual por falta de retención emocional.
                                        <div className="absolute w-4 h-4 bg-white rotate-45 bottom-[-8px] right-2" />
                                    </div>
                                </div>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            <div className="mt-12 flex items-center justify-between gap-8">
                <p className="text-[10px] text-gray-600 italic max-w-sm">
                    Inferencia calculada mediante el protocolo de diagnóstico estratégico EAR. <br />
                    Latencia de inferencia: <span className="text-green-500">~184ms</span>.
                </p>
                <button className="px-12 py-6 bg-gold-500 text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-white transition-all shadow-[0_0_40px_rgba(196,163,0,0.2)]">
                    Generar RX de Fricción
                </button>
            </div>
        </section>
    );
};
