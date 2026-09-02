"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { syncSClassAuth } from '@/lib/services/auth_nexus';
import { User } from 'firebase/auth';
import { MotorTactico } from '@/app/components/MotorTactico';
import BespokeConfigurator from '@/app/components/sections/BespokeConfigurator';
import SimuladorEscenarios from '@/app/components/SimuladorEscenarios';
import BucleAprendizaje from '@/app/components/BucleAprendizaje';
import { SovereignSkeleton } from '@/app/components/SovereignSkeleton';
import { DemandEngine } from '@/app/components/DemandEngine';
import AllianceNetwork from '@/app/components/AllianceNetwork';
import AstraNeuralTwin from '@/app/components/AstraNeuralTwin';
import AutonomousOrchestrator from '@/app/components/AutonomousOrchestrator';
import { NexusMissionTracker } from './NexusMissionTracker';

/**
 * 🏛️ CENTRO DE MANDO FÉNIX - NEXUS DASHBOARD
 * Punto central de gobernanza para usuarios S-Class Gold.
 * Integra el Nexus Mission Tracker, Feature Flags e Infraestructura Crítica.
 */
export default function EarCommandCenter() {
    const [user, setUser] = useState<User | null>(null);
    const [estaInicializando, setEstaInicializando] = useState(true);

    useEffect(() => {
        const unsubscribe = syncSClassAuth((currentUser) => {
            setUser(currentUser);
            setEstaInicializando(false);
        });
        return () => unsubscribe();
    }, []);

    if (estaInicializando) {
        return <SovereignSkeleton />;
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 selection:bg-[#d4a855]/30">
            {/* Header Soberano */}
            <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-8 gap-6">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none">
                        CENTRO DE MANDO <span className="text-[#d4a855]">FÉNIX</span>
                    </h1>
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] mt-3 font-black">
                        Protocolo S-Class Gold Activo • Ecosistema Soberano EAR OS
                    </p>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-[#d4a855] animate-pulse" />
                        <span className="text-[10px] uppercase tracking-widest text-[#d4a855] font-black">Sincronización Nexus: Activa</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 border-l border-white/10 pl-6">
                        {user ? user.email : 'ACCESO INVITADO'}
                    </div>
                </div>
            </header>

            {/* Nexus Mission Tracker - Capa de Gobernanza Principal */}
            <div className="mb-12">
                <NexusMissionTracker />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Suspense fallback={<SovereignSkeleton />}>
                    <MotorTactico />
                </Suspense>
                <Suspense fallback={<SovereignSkeleton />}>
                    <SimuladorEscenarios />
                </Suspense>
                <Suspense fallback={<SovereignSkeleton />}>
                    <BucleAprendizaje />
                </Suspense>
            </div>

            {/* Infraestructura de Sistema y Feature Flags */}
            <div className="mt-12">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-[1px] flex-grow bg-white/5" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#d4a855] whitespace-nowrap">Infraestructura de Sistema</h2>
                    <div className="h-[1px] flex-grow bg-white/5" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { id: 'EAR_PAY_UI', label: 'Pasarela EAR Pay', desc: 'Control de Checkout y Pagos', active: false },
                        { id: 'ASTRA_VOICE', label: 'Astra Neural Voice', desc: 'Motor de Inteligencia B2B', active: false },
                        { id: 'VIMUME_BOOKING', label: 'VIMUME Booking', desc: 'Gestión Clínica B2G', active: false }
                    ].map((feature) => (
                        <div key={feature.id} className="glass-pane p-8 border-white/5 hover:border-[#d4a855]/20 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4a855]/5 blur-3xl -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div>
                                    <h3 className="text-base font-black text-white uppercase tracking-tight">{feature.label}</h3>
                                    <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mt-1.5 leading-relaxed">{feature.desc}</p>
                                </div>
                                <div className="w-12 h-6 bg-white/5 rounded-full relative cursor-pointer overflow-hidden border border-white/10 group">
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white/10 rounded-full transition-all group-hover:bg-[#d4a855]/40" />
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 relative z-10">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500/30" />
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 italic">Offline / Scaffolding Mode</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Módulos de Expansión */}
            <div className="mt-12 space-y-12">
                <Suspense fallback={<SovereignSkeleton />}>
                    <BespokeConfigurator />
                </Suspense>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <Suspense fallback={<SovereignSkeleton />}>
                        <DemandEngine />
                    </Suspense>
                    <Suspense fallback={<SovereignSkeleton />}>
                        <AllianceNetwork />
                    </Suspense>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <Suspense fallback={<SovereignSkeleton />}>
                        <AstraNeuralTwin />
                    </Suspense>
                    <Suspense fallback={<SovereignSkeleton />}>
                        <AutonomousOrchestrator />
                    </Suspense>
                </div>
            </div>

            {/* Footer Forense */}
            <footer className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
                    Sovereign Core v.97 • © 2026 Productora EAR
                </p>
                <div className="flex gap-8">
                    <span className="text-[8px] font-black uppercase tracking-widest">Auth: Encrypted</span>
                    <span className="text-[8px] font-black uppercase tracking-widest">Build: S-Class</span>
                </div>
            </footer>
        </div>
    );
}
