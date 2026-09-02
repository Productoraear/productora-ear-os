'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTripwire } from '@/hooks/useTripwire';
import { 
    Truck, 
    MapPin, 
    Navigation, 
    Activity, 
    Shield, 
    Zap, 
    Clock, 
    AlertTriangle, 
    CheckCircle2, 
    Globe, 
    Users,
    TrendingUp,
    Briefcase,
    Radio,
    Terminal,
    Eye
} from 'lucide-react';

/**
 * 🏛️ MODULE: OMNIBUS TRACKER (S-Class v5.0 GOLD)
 * Imperial Logistics & Fleet Operations Command.
 */

interface FleetUnit {
    id: string;
    name: string;
    type: 'VAN' | 'TRUCK' | 'VIP_CAR' | 'CARGO';
    status: 'Fluid' | 'Congested' | 'Critical' | 'Standby';
    location: string;
    destination: string;
    load: number;
    latency: string;
    operator: string;
}

const INITIAL_FLEET: FleetUnit[] = [
    { id: 'OMN-01', name: 'Alpha Logistics', type: 'TRUCK', status: 'Fluid', location: 'M-30 Sur, Madrid', destination: 'EAR HQ', load: 84, latency: '12ms', operator: 'J. Morales' },
    { id: 'VIM-04', name: 'VIMUME Unit 04', type: 'VAN', status: 'Congested', location: 'Gran Via, Barcelona', destination: 'Residencia Royal', load: 45, latency: '48ms', operator: 'A. Sanz' },
    { id: 'TAL-09', name: 'Nexus Talent G', type: 'VIP_CAR', status: 'Fluid', location: 'E-15, Valencia', destination: 'Festival Gold', load: 12, latency: '8ms', operator: 'L. Mendez' },
    { id: 'CAR-22', name: 'Cargo Nexus', type: 'CARGO', status: 'Critical', location: 'A-2, Guadalajara', destination: 'Logistics Hub 3', load: 99, latency: '250ms', operator: 'M. Ruiz' },
];

export default function OmnibusTracker() {
    const { igniteTripwire } = useTripwire();
    const [fleet, setFleet] = useState<FleetUnit[]>(INITIAL_FLEET);
    const [selectedId, setSelectedId] = useState<string | null>(INITIAL_FLEET[0].id);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
        const interval = setInterval(() => {
            setFleet(prev => prev.map(u => ({
                ...u,
                load: Math.min(100, Math.max(0, u.load + (Math.random() * 2 - 1)))
            })));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const selectedUnit = fleet.find(u => u.id === selectedId) || fleet[0];

    const handleSelectUnit = (id: string) => {
        setSelectedId(id);
        igniteTripwire('fleet_unit_select', { unitId: id });
    };

    const handleRedeploy = () => {
        igniteTripwire('fleet_redeploy_trigger', { unitId: selectedId, location: selectedUnit.location });
        alert(`PROTOCOLO OMEGA: Redespliegue de la unidad ${selectedId} iniciado.`);
    };

    if (!isHydrated) return null;

    return (
        <div className="flex flex-col gap-6 h-full text-white font-inter">
            {/* Header: Command Center Pulse */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-8 bg-black/60 backdrop-blur-3xl border border-white/5 rounded-[3rem] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#d4a855]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center text-[#d4a855] border border-[#d4a855]/30 shadow-[0_0_40px_rgba(212,168,85,0.1)] relative">
                        <div className="absolute inset-0 bg-[#d4a855]/5 rounded-3xl animate-pulse" />
                        <Truck size={40} className="relative z-10" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
                            Omnibus <span className="text-[#d4a855]">Tracker</span>
                        </h1>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.5em] mt-3">
                            Imperial Logistics {"//"} Fleet Operations Command
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                    {[
                        { label: 'Unidades', val: '24', icon: Activity, color: 'text-emerald-500' },
                        { label: 'Conflictos', val: '2', icon: AlertTriangle, color: 'text-[#d4a855]' },
                        { label: 'Latencia', val: '14ms', icon: Radio, color: 'text-blue-500' },
                        { label: 'Seguridad', val: 'LVL 10', icon: Shield, color: 'text-zinc-500' }
                    ].map((st, i) => (
                        <div key={i} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center min-w-[100px]">
                            <div className="text-[8px] font-black uppercase text-zinc-600 mb-1 tracking-widest">{st.label}</div>
                            <div className={`text-sm font-black italic ${st.color}`}>{st.val}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
                
                {/* Left: Tactical Fleet List */}
                <div className="lg:col-span-4 flex flex-col min-h-0">
                    <div className="p-8 bg-zinc-950/40 border border-white/5 rounded-[3.5rem] backdrop-blur-3xl flex flex-col flex-1 overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] italic text-zinc-400">
                                Monitoreo <span className="text-white">Tiempo Real</span>
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Global Link</span>
                            </div>
                        </div>

                        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                            {fleet.map((unit) => (
                                <motion.div
                                    key={unit.id}
                                    onClick={() => handleSelectUnit(unit.id)}
                                    className={`p-5 rounded-[2rem] border cursor-pointer transition-all relative overflow-hidden group ${
                                        selectedId === unit.id 
                                        ? 'bg-[#d4a855] border-[#d4a855] text-black shadow-[0_0_30px_rgba(212,168,85,0.2)]' 
                                        : 'bg-white/5 border-white/5 hover:border-white/20'
                                    }`}
                                >
                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                                                selectedId === unit.id ? 'bg-black text-[#d4a855]' : 'bg-white/5 text-zinc-500'
                                            }`}>
                                                {unit.id.split('-')[1]}
                                            </div>
                                            <div>
                                                <div className="text-xs font-black uppercase tracking-tight italic leading-none">{unit.name}</div>
                                                <div className={`text-[8px] font-bold uppercase tracking-[0.2em] mt-1.5 ${selectedId === unit.id ? 'text-black/60' : 'text-zinc-500'}`}>
                                                    {unit.type} {"//"} {unit.status}
                                                </div>
                                            </div>
                                        </div>
                                        {selectedId === unit.id && <Navigation size={14} className="text-black animate-bounce" />}
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 relative z-10">
                                        <div className="flex-1 h-1 bg-black/10 rounded-full overflow-hidden">
                                            <motion.div 
                                                animate={{ width: `${unit.load}%` }}
                                                className={`h-full ${selectedId === unit.id ? 'bg-black' : 'bg-[#d4a855]'}`} 
                                            />
                                        </div>
                                        <span className="text-[8px] font-black uppercase">{Math.round(unit.load)}%</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Tactical HUD & Telemetry */}
                <div className="lg:col-span-8 flex flex-col gap-6 min-h-0">
                    
                    {/* Unit Deep Dive */}
                    <div className="p-10 bg-gradient-to-br from-zinc-900/90 to-black border border-white/5 rounded-[4rem] relative overflow-hidden group flex-1">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,168,85,0.05),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-transform duration-1000">
                            <Globe size={300} className="text-[#d4a855]" />
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start mb-12 relative z-10">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <span className="px-5 py-2 bg-[#d4a855]/10 border border-[#d4a855]/30 rounded-full text-[9px] font-black text-[#d4a855] uppercase tracking-[0.3em]">
                                        ACTIVO {selectedUnit.id} {"//"} SECURE_FLEET
                                    </span>
                                    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-white/5 border border-white/10 ${
                                        selectedUnit.status === 'Fluid' ? 'text-emerald-500' : selectedUnit.status === 'Congested' ? 'text-amber-500' : 'text-red-500'
                                    }`}>
                                        {selectedUnit.status}
                                    </span>
                                </div>
                                <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                                    {selectedUnit.name}
                                </h2>
                                <div className="flex items-center gap-6 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={12} className="text-[#d4a855]" /> {selectedUnit.location}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={12} className="text-[#d4a855]" /> ETA: 14:30
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 md:mt-0 text-right">
                                <div className="text-7xl font-black italic text-[#d4a855] tracking-tighter drop-shadow-[0_0_20px_rgba(212,168,85,0.3)]">
                                    {selectedUnit.latency}
                                </div>
                                <div className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em] mt-3">Latencia de Red</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                            {[
                                { label: 'Carga Actual', val: `${Math.round(selectedUnit.load)}%`, icon: Zap },
                                { label: 'Operador', val: selectedUnit.operator, icon: Users },
                                { label: 'Combustible', val: '72%', icon: TrendingUp },
                                { label: 'Estatus Hub', val: 'SYNCED', icon: CheckCircle2 }
                            ].map((stat, i) => (
                                <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-3xl group/stat hover:border-[#d4a855]/40 transition-all hover:-translate-y-2">
                                    <stat.icon size={20} className="text-zinc-600 mb-4 group-hover/stat:text-[#d4a855] transition-colors" />
                                    <div className="text-lg font-black text-white italic tracking-tight uppercase">{stat.val}</div>
                                    <div className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-1.5">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Visualizer Mockup */}
                        <div className="mt-12 h-32 w-full bg-white/5 border border-white/5 rounded-3xl relative overflow-hidden flex items-end gap-1 p-6 group-hover:border-[#d4a855]/20 transition-colors">
                            {Array.from({ length: 40 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ 
                                        height: [Math.random() * 20 + 20, Math.random() * 60 + 20, Math.random() * 20 + 20],
                                        opacity: [0.3, 0.6, 0.3]
                                    }}
                                    transition={{ duration: 1 + Math.random(), repeat: Infinity, ease: 'easeInOut' }}
                                    className="flex-1 bg-gradient-to-t from-[#d4a855] to-[#d4a855]/20 rounded-full"
                                />
                            ))}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[10px] font-black uppercase tracking-[1em] text-white/10">Telemetría S-Class</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Console */}
                    <div className="p-8 bg-black/40 border border-white/5 rounded-[3rem] backdrop-blur-2xl flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-4">
                                <Terminal size={18} className="text-zinc-600" />
                                <span className="text-[10px] font-mono text-zinc-500 uppercase">SYS_LOG: Protocolo Omega activo en Nodo {selectedUnit.id}</span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => igniteTripwire('fleet_forensic_open', { unitId: selectedId })}
                                className="px-8 py-3 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#d4a855] hover:text-black transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <Eye size={14} /> Abrir Panel Forense
                                </div>
                            </button>
                            <button 
                                onClick={handleRedeploy}
                                className="px-8 py-3 bg-[#d4a855] text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#d4a855]/10"
                            >
                                Ejecutar Redespliegue
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
