'use client';

import React, { useState } from 'react';
import { ArtistSignalHero } from '@/components/booking/ArtistSignalHero';
import { SceneConfigurator } from '@/components/booking/SceneConfigurator';
import { ServiceCarousel } from '@/components/booking/ServiceCarousel';
import { TourBudgetWidget } from '@/components/booking/TourBudgetWidget';
import { ShieldCheck, Cpu, Award, Globe } from 'lucide-react';

export default function TourEngineeringPage() {
    const [baseInvestment] = useState(2450);

    return (
        <main className="min-h-screen bg-[#0A0A0A] text-white pt-24 pb-40 overflow-x-hidden">
            {/* Background Texture & Grain */}
            <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden mix-blend-overlay">
                <div className="absolute top-0 left-[-10%] w-[120%] h-[120%] bg-gradient-to-br from-amber-500/5 via-transparent to-purple-500/5 blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 sm:px-12 relative z-10 space-y-24 sm:space-y-32">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 group">
                    <div className="space-y-4 sm:space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-400">
                                <Cpu size={18} className="animate-pulse" />
                            </div>
                            <span className="text-amber-400 text-[10px] font-black uppercase tracking-[0.5em] leading-none">
                                EAR OS Engineering Systems
                            </span>
                        </div>
                        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                            Booking <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/30">Engineering</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-zinc-400 font-light italic max-w-2xl leading-relaxed">
                            Sistemas de despliegue técnico y logístico para artistas e instituciones de alto impacto.
                        </p>
                    </div>

                    <div className="flex gap-6 sm:gap-12 border border-white/5 p-6 sm:p-10 rounded-3xl bg-white/5 backdrop-blur-3xl group-hover:border-amber-500/20 transition-all">
                        <div className="text-center">
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Técnicos Senior</span>
                            <div className="text-3xl sm:text-4xl font-black mt-2 text-white">42+</div>
                            <p className="text-[8px] font-bold text-zinc-600 uppercase mt-1">Personal Certificado</p>
                        </div>
                        <div className="w-px h-16 sm:h-20 bg-white/10" />
                        <div className="text-center">
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Disponibilidad Cloud</span>
                            <div className="text-3xl sm:text-4xl font-black mt-2 text-emerald-400">99%</div>
                            <p className="text-[8px] font-bold text-zinc-600 uppercase mt-1">Sync Logístico JIT</p>
                        </div>
                        <div className="w-px h-16 sm:h-20 bg-white/10" />
                        <div className="text-center">
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Cobertura Global</span>
                            <div className="text-3xl sm:text-4xl font-black mt-2 text-white">EU/LAT</div>
                            <p className="text-[8px] font-bold text-zinc-600 uppercase mt-1">Logística Predictiva</p>
                        </div>
                    </div>
                </header>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
                    <div className="lg:col-span-8 space-y-20 sm:space-y-28">
                        {/* Section 0: Visual Signal Preview */}
                        <div className="space-y-8">
                            <ArtistSignalHero />
                        </div>

                        {/* Section 1: Scene Configuration */}
                        <div className="space-y-8">
                            <SceneConfigurator />
                        </div>

                        {/* Section 2: Technical Equipment */}
                        <div className="space-y-8">
                            <ServiceCarousel />
                        </div>

                        {/* Additional Logistics Footer */}
                        <footer className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 border-t border-white/10">
                            {[
                                { icon: Globe, label: 'Geo-Mapping API', desc: 'Rutas dinámicas con optimización de tráfico y clima en tiempo real.' },
                                { icon: Award, label: 'Technical Riders', desc: 'Validación automática de riders técnicos con inventario físico EAR.' },
                                { icon: ShieldCheck, label: 'Strategic Insurance', desc: 'Pólizas automáticas activadas por predicción climática avanzada.' }
                            ].map((item, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl w-fit text-amber-400">
                                        <item.icon size={22} />
                                    </div>
                                    <div className="space-y-1">
                                        <h5 className="text-xs font-black uppercase tracking-widest text-white">{item.label}</h5>
                                        <p className="text-[10px] text-zinc-500 font-mono leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </footer>
                    </div>

                    <div className="lg:col-span-4 h-full relative">
                        <TourBudgetWidget baseInvestment={baseInvestment} />
                    </div>
                </div>
            </div>
        </main>
    );
}
