'use client';

import React, { useState } from 'react';
import { Layers, CheckCircle2, Package, HardDrive, Volume2, Lightbulb, Monitor, Cpu, Shield, Zap, ChevronRight, ChevronLeft, Plus } from 'lucide-react';

const SERVICES = [
    { id: 'pa_system', name: 'L-Acoustics K2 System', type: 'Audio / PA', icon: Volume2, specs: ['Full Range', '96kHz DSP', 'Precision Coverage'], investment: 1200 },
    { id: 'led_wall', name: 'Absen PL2.5 Pro', type: 'Visual / LED', icon: Monitor, specs: ['4K Processing', 'HDR Ready', 'Indoor/Outdoor'], investment: 1800 },
    { id: 'lighting', name: 'Robe MegaPointe', type: 'Iluminación', icon: Lightbulb, specs: ['Hybrid Beam', 'Custom Gobos', '3D Mapping'], investment: 950 },
    { id: 'fOH_console', name: 'DiGiCo SD12', type: 'Control / Mix', icon: HardDrive, specs: ['Dual Screens', '96 Channels', 'Stealth Core'], investment: 650 },
    { id: 'server', name: 'Disguise vx4', type: 'Media Server', icon: Cpu, specs: ['Real-time VFX', 'Low Latency', 'Multi-layer'], investment: 1400 }
];

export const ServiceCarousel = () => {
    const [selected, setSelected] = useState<string[]>(['pa_system', 'lighting']);

    const toggleService = (id: string) => {
        setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    };

    return (
        <section className="space-y-12">
            <header className="flex justify-between items-end px-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Layers className="text-gold-500 animate-slide-up" />
                        <span className="text-gold-500 text-[10px] font-black uppercase tracking-[0.4em]">Optimización de Inventario v0.2</span>
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Equipamiento Técnico</h2>
                </div>
                <div className="flex gap-4">
                    <button className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-gold-500 hover:text-black transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <button className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-gold-500 hover:text-black transition-all">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </header>

            <div className="flex gap-8 overflow-x-auto pb-12 px-4 no-scrollbar">
                {SERVICES.map((service) => (
                    <div 
                        key={service.id}
                        onClick={() => toggleService(service.id)}
                        className={`min-w-[340px] p-10 rounded-[3.5rem] border-2 transition-all duration-700 cursor-pointer relative group flex flex-col gap-10 ${
                            selected.includes(service.id) ? 'bg-gold-500/10 border-gold-500 shadow-[0_40px_80px_rgba(196,163,0,0.2)]' : 'bg-black/40 border-white/5 hover:border-white/10 hover:bg-white/5'
                        }`}
                    >
                        {/* Status Badge */}
                        <div className="absolute top-8 right-8 transition-transform group-hover:scale-110">
                            {selected.includes(service.id) ? (
                                <div className="p-3 bg-gold-500 rounded-2xl text-black">
                                    <CheckCircle2 size={18} strokeWidth={3} />
                                </div>
                            ) : (
                                <div className="p-3 bg-white/10 rounded-2xl text-gray-700 group-hover:bg-white/20 transition-all">
                                    <Plus size={18} strokeWidth={3} />
                                </div>
                            )}
                        </div>

                        {/* Visual Asset Name */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <service.icon size={20} className={selected.includes(service.id) ? 'text-gold-500' : 'text-gray-400'} />
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${selected.includes(service.id) ? 'text-gold-500' : 'text-gray-500'}`}>
                                    {service.type}
                                </span>
                            </div>
                            <h4 className="text-2xl font-black uppercase tracking-tighter leading-none pr-8">
                                {service.name}
                            </h4>
                        </div>

                        {/* Specs List */}
                        <div className="space-y-4 flex-1">
                            {service.specs.map((spec, i) => (
                                <div key={i} className="flex items-center gap-4 group/spec">
                                    <div className={`w-1 h-1 rounded-full ${selected.includes(service.id) ? 'bg-gold-500' : 'bg-white/20'}`} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover/spec:text-gray-300 transition-colors">
                                        {spec}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Bottom Bar: Investment */}
                        <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1">Fee Adicional</p>
                                <p className="text-xl font-black">{service.investment}€</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Zap size={16} className="text-gold-500 animate-pulse" />
                            </div>
                        </div>

                        {/* Hover Overlay Light */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-[3.5rem]" />
                    </div>
                ))}

                {/* Custom Asset Request Card */}
                <div className="min-w-[340px] p-10 rounded-[3.5rem] border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center gap-8 text-center cursor-pointer hover:bg-white/[0.08] hover:border-gold-500 transition-all group">
                    <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/10 group-hover:scale-110 transition-transform">
                        <Package size={32} className="text-gray-700 group-hover:text-gold-500 transition-colors" />
                    </div>
                    <div className="space-y-2">
                        <h5 className="text-[11px] font-black uppercase tracking-widest text-white">Requerimiento Especial</h5>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 leading-relaxed px-12">Solicita equipamiento específico L-Acoustics o Meyer Sound.</p>
                    </div>
                    <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gold-500 mt-4 group-hover:gap-6 transition-all">
                        Solicitar <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            {/* Selection Summary Mini Tab */}
            <div className={`fixed bottom-12 right-12 z-50 p-6 bg-gold-500 text-black rounded-3xl shadow-[0_20px_60px_rgba(196,163,0,0.4)] flex items-center gap-8 transition-all duration-700 translate-y-20 ${selected.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-40 opacity-0'}`}>
                <div className="flex -space-x-4">
                    {selected.map((s, i) => {
                        const icon_data = SERVICES.find(serv => serv.id === s)?.icon;
                        const IconComponent = icon_data || Shield;
                        return (
                            <div key={i} className="w-14 h-14 bg-black border-4 border-gold-500 rounded-2xl flex items-center justify-center text-gold-500 shadow-xl">
                                <IconComponent size={20} strokeWidth={3} />
                            </div>
                        );
                    })}
                </div>
                <div className="h-10 w-px bg-black/10" />
                <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest">Inversión Técnica</p>
                    <p className="text-2xl font-black leading-none">
                        {selected.reduce((acc, curr) => acc + (SERVICES.find(s => s.id === curr)?.investment || 0), 0)}€
                    </p>
                </div>
            </div>
        </section>
    );
};
