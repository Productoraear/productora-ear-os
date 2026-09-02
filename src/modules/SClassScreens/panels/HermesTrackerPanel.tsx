'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Users, 
    Search, 
    AlertTriangle, 
    CheckCircle2, 
    MapPin, 
    TrendingUp, 
    Globe, 
    Activity,
    Lock
} from 'lucide-react';

/**
 * 🏛️ MODULE: HERMES TRACKER (S-Class v3.0)
 * Global Artist and Talent Monitoring System.
 * Protocol: M-30 Traffic Simulation & Resolution.
 */

const mockArtists = [
    { id: 1, name: 'S-Class Alpha', status: 'Operational', location: 'Madrid | HQ', traffic: 'Fluid', activity: 98 },
    { id: 2, name: 'VIMUME Unit 04', status: 'In Transit', location: 'Barcelona', traffic: 'Congested (M-30)', activity: 45 },
    { id: 3, name: 'Nexus Talent G', status: 'Active', location: 'Global Remote', traffic: 'Encrypted', activity: 72 },
    { id: 4, name: 'Protocol Z-99', status: 'On Hold', location: 'Unknown', traffic: 'Silent', activity: 0 },
];

export default HermesTrackerPanel;
export function HermesTrackerPanel() {
    const [search, setSearch] = useState('');
    const [selectedId, setSelectedId] = useState<number | null>(null);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
            
            {/* Left Wing: Monitoring Board */}
            <div className="lg:col-span-8 space-y-8 flex flex-col h-full">
                <div className="p-10 bg-black/40 border border-white/5 rounded-[3rem] backdrop-blur-xl shadow-2xl relative overflow-hidden flex-1 flex flex-col">
                    <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                        <Globe size={180} className="text-[#d4af37]" />
                    </div>

                    <div className="flex items-center justify-between mb-12 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-[#d4af37]/10 rounded-2xl border border-[#d4af37]/20">
                                <Users size={28} className="text-[#d4af37]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">
                                    PROTOCOLO <span className="text-[#d4af37]">HERMES</span>
                                </h3>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]">
                                    Talent Fleet Tracking & Logistics
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                            <input 
                                type="text"
                                placeholder="LOCALIZAR ACTIVO..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-6 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#d4af37]/40 w-64 transition-all"
                            />
                        </div>
                    </div>

                    <div className="overflow-hidden flex-1">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-[#d4af37]">Activo</th>
                                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-[#d4af37]">Estado</th>
                                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-[#d4af37]">Ubicación</th>
                                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-[#d4af37]">Tráfico</th>
                                    <th className="pb-6 text-right text-[10px] font-black uppercase tracking-widest text-[#d4af37]">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {mockArtists.map((artist) => (
                                    <motion.tr 
                                        key={artist.id}
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        className={`group hover:bg-white/[0.02] transition-colors cursor-pointer ${selectedId === artist.id ? 'bg-[#d4af37]/5' : ''}`}
                                        onClick={() => setSelectedId(artist.id)}
                                    >
                                        <td className="py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-xs font-black text-zinc-400">
                                                    {artist.id < 10 ? `0${artist.id}` : artist.id}
                                                </div>
                                                <div className="text-sm font-bold text-white group-hover:text-[#d4af37] transition-colors uppercase">
                                                    {artist.name}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${artist.status === 'Operational' || artist.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : artist.status === 'In Transit' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'}`} />
                                                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">{artist.status}</span>
                                            </div>
                                        </td>
                                        <td className="py-6">
                                            <div className="flex items-center gap-2 text-zinc-400">
                                                <MapPin size={12} className="text-zinc-600" />
                                                <span className="text-[10px] font-medium uppercase">{artist.location}</span>
                                            </div>
                                        </td>
                                        <td className="py-6">
                                            <div className={`text-[9px] font-black px-2 py-1 rounded border ${artist.traffic === 'Fluid' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : artist.traffic === 'Congested (M-30)' ? 'text-amber-500 border-amber-500/20 bg-amber-500/5 animate-pulse' : 'text-zinc-500 border-zinc-500/20'}`}>
                                                {artist.traffic.toUpperCase()}
                                            </div>
                                        </td>
                                        <td className="py-6 text-right">
                                            <button className="text-[9px] font-black uppercase tracking-widest px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-[#d4af37] hover:text-black transition-all">
                                                Ver Telemetría
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tactical Footer */}
                <div className="grid grid-cols-4 gap-6">
                    {[
                        { label: 'Unidades Activas', val: '24', icon: Activity, color: 'text-emerald-500' },
                        { label: 'Conflictos Red', val: '0', icon: CheckCircle2, color: 'text-[#d4af37]' },
                        { label: 'Alerta M-30', val: '2', icon: AlertTriangle, color: 'text-red-500' },
                        { label: 'Trending', val: '+12%', icon: TrendingUp, color: 'text-[#d4af37]' }
                    ].map((st, i) => (
                        <div key={i} className="p-6 bg-zinc-900/60 border border-white/5 rounded-3xl flex flex-col items-center justify-center text-center shadow-xl">
                            <st.icon size={20} className={`${st.color} mb-3`} />
                            <div className="text-2xl font-black text-white italic tracking-tighter">{st.val}</div>
                            <div className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mt-1">{st.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Wing: Detail / Simulation */}
            <div className="lg:col-span-4 flex flex-col gap-8">
                
                {/* Crisis Simulator View */}
                <div className="flex-1 p-10 bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <Lock size={14} className="text-zinc-700" />
                    </div>
                    <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 italic flex items-center gap-3">
                         <span className="w-2 h-2 bg-[#d4af37] rounded-full" />
                         Resolución de Tráfico M-30
                    </h4>
                    
                    <div className="space-y-8">
                        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
                            <div className="text-[10px] text-red-500 font-black uppercase tracking-widest mb-2">Evento Crítico Detectado</div>
                            <p className="text-sm text-zinc-200 font-bold leading-relaxed italic">
                                "Colapso en nodo M-30 Sur. Unidad VIMUME-04 comprometida en tiempos de llegada."
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest italic">Protocolos Disponibles:</div>
                            {[
                                'Recalcular Ruta (Nexus OS)',
                                'Despliegue de Unidad Auxiliar',
                                'Modo Prioridad Alpha (VIP)',
                                'Sincronizar con Infrastructure'
                            ].map((opt, i) => (
                                <button 
                                    key={i}
                                    className="w-full text-left p-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-zinc-400 hover:border-[#d4af37]/50 hover:text-white transition-all group flex items-center justify-between"
                                >
                                    {opt.toUpperCase()}
                                    <div className="w-2 h-2 rounded-full bg-zinc-800 group-hover:bg-[#d4af37] transition-all" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Confianza del Sistema</span>
                            <span className="text-[10px] font-black text-[#d4af37]">98.2%</span>
                        </div>
                        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[#d4af37] w-[98%] shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                        </div>
                    </div>
                </div>

                {/* System Stats Mini-Panel */}
                <div className="p-8 bg-zinc-900/40 border border-white/5 rounded-[2.5rem] flex items-center gap-6">
                    <div className="p-4 bg-emerald-500/10 rounded-2xl">
                        <Activity className="text-emerald-500" size={24} />
                    </div>
                    <div>
                        <div className="text-xs font-black text-white uppercase italic tracking-tighter">Latencia Telemetría</div>
                        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">0.4ms Synchronized</div>
                    </div>
                </div>
            </div>

        </div>
    );
}
