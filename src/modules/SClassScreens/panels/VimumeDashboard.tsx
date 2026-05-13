'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Heart, 
    Waves, 
    Activity, 
    Zap, 
    Brain, 
    Database, 
    Clock, 
    User, 
    ShieldCheck, 
    Activity as Pulse,
    Stethoscope,
    Microscope,
    Music,
    TrendingUp,
    CheckCircle2,
    Search
} from 'lucide-react';

/**
 * 🏛️ MODULE: VIMUME DASHBOARD (S-Class v5.0 GOLD)
 * "Viaje Musical por la Memoria" - Clinical Intelligence vertical.
 * Perspective: Clinical Accuracy, Human Empathy, S-Class Premium Aesthetics.
 */

interface Patient {
    id: string;
    name: string;
    diagnosis: string;
    status: 'Stabilized' | 'Monitoring' | 'Critical' | 'Optimization';
    sessionProgress: number;
    lastActivity: string;
    compatibility: string[];
}

const PATIENTS: Patient[] = [
    { id: 'PAT-8823', name: 'María G.', diagnosis: 'Alzheimer - Fase 1', status: 'Stabilized', sessionProgress: 72, lastActivity: '12 min ago', compatibility: ['Edwin Agudelo', 'Luan Sax'] },
    { id: 'PAT-8824', name: 'Antonio R.', diagnosis: 'Deterioro Cognitivo', status: 'Monitoring', sessionProgress: 45, lastActivity: '1h ago', compatibility: ['Elena S.', 'Edwin Agudelo'] },
    { id: 'PAT-8825', name: 'Carmen L.', diagnosis: 'Parkinson Temprano', status: 'Optimization', sessionProgress: 88, lastActivity: 'Active Now', compatibility: ['Luan Sax', 'Elena S.'] },
];

export default function VimumeDashboard() {
    const [selectedPatient, setSelectedPatient] = useState<Patient>(PATIENTS[0]);
    const [isHydrated, setIsHydrated] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    if (!isHydrated) return null;

    return (
        <div className="flex flex-col gap-6 h-full text-white font-inter">
            {/* Header: Clinical Intelligence Pulse */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-8 bg-black/60 backdrop-blur-3xl border border-white/5 rounded-[3rem] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center text-[#d4a855] border border-[#d4a855]/30 shadow-[0_0_40px_rgba(212,168,85,0.1)]">
                        <Waves size={40} className="text-blue-400 animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
                            Vimume <span className="text-blue-400">Dashboard</span>
                        </h1>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.5em] mt-3">
                            Clinical Intelligence {"//"} Memory Recovery Vertical
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                    {[
                        { label: 'Pacientes', val: '128', icon: User, color: 'text-blue-400' },
                        { label: 'Sesiones', val: '2,450', icon: Activity, color: 'text-[#d4a855]' },
                        { label: 'Sincronía', val: '99.8%', icon: ShieldCheck, color: 'text-emerald-500' },
                        { label: 'ROI Social', val: '€50K+', icon: TrendingUp, color: 'text-zinc-500' }
                    ].map((st, i) => (
                        <div key={i} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center min-w-[100px]">
                            <div className="text-[8px] font-black uppercase text-zinc-600 mb-1 tracking-widest">{st.label}</div>
                            <div className={`text-sm font-black italic ${st.color}`}>{st.val}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
                
                {/* Left: Patient List */}
                <div className="lg:col-span-4 flex flex-col min-h-0">
                    <div className="p-8 bg-zinc-950/40 border border-white/5 rounded-[3.5rem] backdrop-blur-3xl flex flex-col flex-1 overflow-hidden">
                        <div className="mb-8 space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] italic text-zinc-400">
                                Directorio <span className="text-white">Forense</span>
                            </h3>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                                <input 
                                    type="text"
                                    placeholder="BUSCAR PACIENTE..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-500/40 transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                            {PATIENTS.map((patient) => (
                                <motion.div
                                    key={patient.id}
                                    onClick={() => setSelectedPatient(patient)}
                                    className={`p-5 rounded-[2rem] border cursor-pointer transition-all relative overflow-hidden group ${
                                        selectedPatient.id === patient.id 
                                        ? 'bg-blue-500 border-blue-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.2)]' 
                                        : 'bg-white/5 border-white/5 hover:border-white/20 text-zinc-400'
                                    }`}
                                >
                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                                                selectedPatient.id === patient.id ? 'bg-white text-blue-500' : 'bg-white/5 text-zinc-600'
                                            }`}>
                                                <User size={16} />
                                            </div>
                                            <div>
                                                <div className="text-xs font-black uppercase tracking-tight italic leading-none">{patient.name}</div>
                                                <div className={`text-[8px] font-bold uppercase tracking-[0.2em] mt-1.5 ${selectedPatient.id === patient.id ? 'text-white/70' : 'text-zinc-600'}`}>
                                                    {patient.diagnosis}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`text-[8px] font-black uppercase tracking-widest ${selectedPatient.id === patient.id ? 'text-white/60' : 'text-zinc-700'}`}>
                                            {patient.status}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Clinical Analysis & Telemetry */}
                <div className="lg:col-span-8 flex flex-col gap-6 min-h-0">
                    
                    {/* Patient Deep Dive */}
                    <div className="p-10 bg-gradient-to-br from-zinc-900/90 to-black border border-white/5 rounded-[4rem] relative overflow-hidden group flex-1">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-transform duration-1000">
                            <Brain size={300} className="text-blue-400" />
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start mb-12 relative z-10">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <span className="px-5 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-[9px] font-black text-blue-400 uppercase tracking-[0.3em]">
                                        EXPEDIENTE {selectedPatient.id} {"//"} VIMUME_SECURE
                                    </span>
                                    <span className="px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-emerald-500">
                                        ESTABILIDAD: 98.4%
                                    </span>
                                </div>
                                <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                                    {selectedPatient.name}
                                </h2>
                                <div className="flex items-center gap-6 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <div className="flex items-center gap-2">
                                        <Microscope size={12} className="text-blue-400" /> {selectedPatient.diagnosis}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={12} className="text-blue-400" /> LAST: {selectedPatient.lastActivity}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 md:mt-0 text-right">
                                <div className="text-7xl font-black italic text-blue-400 tracking-tighter drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                    {selectedPatient.sessionProgress}%
                                </div>
                                <div className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em] mt-3">Progreso de Terapia</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                            {/* Diagnosis Box */}
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">Diagnóstico Clínico</h4>
                                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4">
                                    <p className="text-sm text-zinc-300 font-bold leading-relaxed italic uppercase">
                                        "Estabilidad observada en el lóbulo temporal tras 4 semanas de estimulación auditiva controlada. El paciente responde positivamente a frecuencias de 40Hz Gamma."
                                    </p>
                                    <div className="pt-4 flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-[#d4a855]">
                                        <Zap size={14} /> Recomendación: Incrementar Doppler Sónico
                                    </div>
                                </div>
                            </div>

                            {/* Compatibility Box */}
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">Artistas Compatibles S-Class</h4>
                                <div className="space-y-3">
                                    {selectedPatient.compatibility.map((artist, i) => (
                                        <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group/artist hover:border-blue-500/40 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center">
                                                    <Music size={14} className="text-zinc-600 group-hover/artist:text-blue-400 transition-colors" />
                                                </div>
                                                <span className="text-xs font-black uppercase tracking-tighter italic">{artist}</span>
                                            </div>
                                            <div className="text-[8px] font-black uppercase tracking-widest text-zinc-700">92% Match</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Telemetry Footer */}
                    <div className="p-8 bg-black/40 border border-white/5 rounded-[3rem] backdrop-blur-2xl flex items-center justify-between">
                        <div className="flex items-center gap-10">
                            <div className="flex items-center gap-4">
                                <Pulse size={20} className="text-red-500 animate-pulse" />
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-white">BPM: 72</div>
                                    <div className="text-[8px] font-bold uppercase text-zinc-600 tracking-[0.2em]">Ritmo Cardíaco</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Activity size={20} className="text-emerald-500" />
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-white">40Hz</div>
                                    <div className="text-[8px] font-bold uppercase text-zinc-600 tracking-[0.2em]">Estimulación Gamma</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button className="px-8 py-3 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-500 transition-all group">
                                <div className="flex items-center gap-3">
                                    <Stethoscope size={14} /> Iniciar Sesión Live
                                </div>
                            </button>
                            <button className="px-8 py-3 bg-[#d4a855] text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#d4a855]/10">
                                Generar Reporte Médico
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
