import React, { useState } from 'react';
import { Image as ImageIcon, Palette, ShieldCheck, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

const ARCHETYPES = [
    { id: 'visionary', name: 'El Visionario', description: 'El que ve lo que otros no ven. Estrategia y horizonte.', color: 'text-blue-500' },
    { id: 'rebel', name: 'El Rebelde', description: 'Rompiendo patrones. Vanguardia y desafío.', color: 'text-red-500' },
    { id: 'magician', name: 'El Mago', description: 'Transformación y asombro. Momentos WOW.', color: 'text-purple-500' },
    { id: 'ruler', name: 'El Soberano', description: 'Excelencia y control. Estándar S-Class.', color: 'text-gold-500' }
];

export const IdentityAudit = () => {
    const [selectedArchetype, setSelectedArchetype] = useState(0);

    const handleNext = () => setSelectedArchetype((prev) => (prev + 1) % ARCHETYPES.length);
    const handlePrev = () => setSelectedArchetype((prev) => (prev - 1 + ARCHETYPES.length) % ARCHETYPES.length);

    return (
        <section className="space-y-16 max-w-4xl mx-auto">
            {/* 📸 Moodboard Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1,2,3,4].map((i) => (
                    <div key={i} className="aspect-square bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group relative overflow-hidden cursor-pointer">
                        <ImageIcon className="text-gray-700 brightness-150 rotate-6 group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>

            {/* 🎨 Color Extraction Widget */}
            <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-black/50 border border-white/10 rounded-3xl gap-8 backdrop-blur-xl">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center animate-pulse">
                        <Palette className="text-black" />
                    </div>
                    <div>
                        <h5 className="text-xl font-black uppercase tracking-tighter">Detector Cromático Estratégico</h5>
                        <p className="text-xs text-gray-400">Analizando identidad sonora y visual...</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="w-10 h-10 bg-gold-500 rounded-full border border-white/20" />
                    <div className="w-10 h-10 bg-[#0A0A0A] rounded-full border border-white/20" />
                    <div className="w-10 h-10 bg-gray-500 rounded-full border border-white/20" />
                </div>
            </div>

            {/* 🎭 Archetype Swipe Emulator */}
            <div className="relative p-12 bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Sparkles size={120} className="text-gold-500" />
                </div>
                
                <div className="flex items-center justify-between gap-8 relative z-10">
                    <button onClick={handlePrev} className="p-4 hover:bg-white/10 rounded-full transition-all">
                        <ChevronLeft size={32} className="text-gold-500" />
                    </button>

                    <div className="flex-1 text-center space-y-4 animate-in slide-in-from-right duration-300">
                        <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${ARCHETYPES[selectedArchetype].color}`}>
                            Arquetipo de Marca
                        </span>
                        <h3 className="text-5xl font-black tracking-tighter uppercase">
                            {ARCHETYPES[selectedArchetype].name}
                        </h3>
                        <p className="text-gray-400 text-lg font-light max-w-md mx-auto italic">
                            "{ARCHETYPES[selectedArchetype].description}"
                        </p>
                    </div>

                    <button onClick={handleNext} className="p-4 hover:bg-white/10 rounded-full transition-all">
                        <ChevronRight size={32} className="text-gold-500" />
                    </button>
                </div>

                <div className="flex justify-center gap-2 mt-12">
                    {ARCHETYPES.map((_, i) => (
                        <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === selectedArchetype ? 'w-12 bg-gold-500' : 'w-4 bg-white/20'}`} />
                    ))}
                </div>
            </div>

            <button className="w-full py-8 bg-gold-500 text-black font-black uppercase tracking-[0.5em] text-xs rounded-3xl hover:bg-white transition-all shadow-[0_20px_60px_rgba(196,163,0,0.3)]">
                Blindar Estética de Marca
            </button>
        </section>
    );
};
