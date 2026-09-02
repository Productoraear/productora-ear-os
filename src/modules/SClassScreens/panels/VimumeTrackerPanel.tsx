'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    Activity, 
    Heart, 
    Globe, 
    Building2, 
    ShieldCheck, 
    Layers, 
    Brain, 
    Zap,
    TrendingUp,
    ChevronRight,
    Target,
    Puzzle,
    Music,
    Stethoscope,
    Microscope,
    Clock
} from 'lucide-react';

/**
 * 🏛️ MODULE: VIMUME TRACKER (S-Class v5.0 GOLD)
 * "Viaje Musical por la Memoria" - Blue Ocean Project.
 * Vertical: Proyectos Silver Economy.
 * 10-Level Cascading Node Management & 52 Sessions Forensic Protocol.
 */

interface VimumeNode {
    id: number;
    name: string;
    type: string;
    status: string;
    impact: string;
    color: string;
    description: string;
}

const VIMUME_LEVELS: VimumeNode[] = [
    { id: 1, name: 'IMSERSO & ODS', type: 'Marco Global', status: 'AUDITORÍA', impact: '0.0%', color: 'text-zinc-500', description: 'Alineación con Objetivos de Desarrollo Sostenible y marco regulatorio estatal.' },
    { id: 2, name: 'Asociaciones & Fundaciones', type: 'Alianzas Estratégicas', status: 'PENDIENTE', impact: '0.0%', color: 'text-zinc-500', description: 'Red de colaboración con entidades del tercer sector y fundaciones de impacto.' },
    { id: 3, name: 'Residencias & Centros de Día', type: 'Infraestructura', status: 'PENDIENTE', impact: '0.0%', color: 'text-zinc-500', description: 'Nodos de intervención física para el cuidado y monitorización de mayores.' },
    { id: 4, name: 'Hogares del Jubilado', type: 'Centros Sociales', status: 'PENDIENTE', impact: '0.0%', color: 'text-zinc-500', description: 'Puntos de interacción social y dinamización de la memoria colectiva.' },
    { id: 5, name: 'Familiares & Cuidadores', type: 'Círculo de Apoyo', status: 'PENDIENTE', impact: '0.0%', color: 'text-zinc-500', description: 'Integración del núcleo familiar y cuidadores en el proceso terapéutico.' },
    { id: 6, name: 'Terapeutas & Musicoterapia', type: 'Cuerpo Técnico', status: 'FASE DISEÑO', impact: '0.0%', color: 'text-zinc-500', description: 'Protocolos clínicos de musicoterapia aplicados por expertos titulados.' },
    { id: 7, name: 'Alzheimer Protocol', type: 'Impacto Cognitivo', status: 'PENDIENTE', impact: '0.0%', color: 'text-zinc-500', description: 'Tratamiento neuro-musical específico para demencias y deterioro cognitivo.' },
    { id: 8, name: 'Mayores, Abuelos & Abuelas', type: 'Activos VIMUME', status: 'BLOQUEADO', impact: '0.0%', color: 'text-zinc-500', description: 'Protagonistas y beneficiarios directos del Viaje Musical por la Memoria.' },
    { id: 9, name: 'Viaje Musical x Memoria', type: 'Implementación Táctica', status: 'FASE DISEÑO', impact: '0.0%', color: 'text-zinc-500', description: 'Ejecución de las 52 sesiones de inmersión sónica y emocional.' },
    { id: 10, name: 'Mega Puzzle Solution', type: 'Omega Level', status: 'POR RESOLVER', impact: '0.0%', color: 'text-white', description: 'Integración total del ecosistema para la solución soberana de impacto social.' },
];

const sessions = Array.from({ length: 52 }, (_, i) => {
    const milestones = [
        "Mapeo de Bóveda H:", "Sincronización Astra", "Estructura Silver Economy", 
        "Protocolo S-Class", "Limpieza de TSX Legacy", "Ignición de Firebase",
        "RAG Bóveda 39MB", "Optimización de Latencia", "Aura Onyx Design",
        "Refactor de AdminLayout", "Módulo El Cazador", "Integración Stripe",
        "Auditoría Forense I", "Purga de Basura TS", "Mapa de 10 Niveles",
        "VIMUME Tracker Beta", "Estabilización de Rutas", "Consolidación de Estilos"
    ];
    
    return {
        id: i + 1,
        title: milestones[i] || `Protocolo Paso ${i + 1}`,
        status: 'Pendiente',
        type: i % 10 === 0 ? 'Hito Crítico' : 'Recuperación',
        date: `Abril 2026`
    };
});

export default function VimumeTrackerPanel() {
    const [selectedLevel, setSelectedLevel] = useState<VimumeNode>(VIMUME_LEVELS[0]);
    const [isHydrated, setIsHydrated] = useState(false);
    const [activeTab, setActiveTab] = useState('hierarchy'); // hierarchy | sessions | impact

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    if (!isHydrated) return null;

    return (
        <div className="flex flex-col gap-6 h-full text-white font-inter">
            {/* Header: Estatus Global */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-8 bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem]">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-[#d4af37]/10 rounded-2xl flex items-center justify-center border border-[#d4af37]/30 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                        <Puzzle size={32} className="text-[#d4af37]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-none">
                            Vimume <span className="text-[#d4af37]">Tracker</span>
                        </h1>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.4em] mt-2">
                            Viaje Musical por la Memoria {"//"} Silver Economy OS
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    {['hierarchy', 'sessions', 'impact'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                activeTab === tab 
                                ? 'bg-[#d4af37] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]' 
                                : 'bg-white/5 text-zinc-500 hover:bg-white/10'
                            }`}
                        >
                            {tab === 'hierarchy' ? 'Cascada 10 Niveles' : tab === 'sessions' ? '52 Sesiones' : 'ROI Social'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
                
                {/* Left Column: Cascading Hierarchy */}
                <div className="lg:col-span-4 flex flex-col min-h-0">
                    <div className="p-8 bg-black/60 border border-white/5 rounded-[3rem] backdrop-blur-3xl flex flex-col flex-1 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                            <Layers size={120} className="text-white" />
                        </div>

                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black uppercase tracking-tighter italic text-zinc-400">
                                Estructura en <span className="text-white">Cascada</span>
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[8px] font-bold text-zinc-500 uppercase">Live Feed</span>
                            </div>
                        </div>

                        <div className="space-y-2.5 overflow-y-auto pr-2 custom-scrollbar flex-1">
                            {VIMUME_LEVELS.map((level, idx) => (
                                <motion.div
                                    key={level.id}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.04 }}
                                    onClick={() => setSelectedLevel(level)}
                                    className={`p-4 rounded-2xl border cursor-pointer transition-all group relative overflow-hidden ${
                                        selectedLevel.id === level.id 
                                        ? 'bg-[#d4af37] border-[#d4af37] text-black' 
                                        : 'bg-white/5 border-white/5 hover:border-white/20'
                                    }`}
                                >
                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                                                selectedLevel.id === level.id ? 'bg-black text-[#d4af37]' : 'bg-white/5 text-zinc-500'
                                            }`}>
                                                {level.id < 10 ? `0${level.id}` : level.id}
                                            </div>
                                            <div>
                                                <div className="text-[11px] font-black uppercase tracking-tight italic leading-none">{level.name}</div>
                                                <div className={`text-[8px] font-bold uppercase tracking-widest mt-1 ${selectedLevel.id === level.id ? 'text-black/60' : 'text-zinc-500'}`}>
                                                    {level.type}
                                                </div>
                                            </div>
                                        </div>
                                        {selectedLevel.id === level.id && <Zap size={14} className="text-black fill-current animate-pulse" />}
                                    </div>
                                    {selectedLevel.id === level.id && (
                                        <motion.div 
                                            layoutId="level-glow-active"
                                            className="absolute inset-0 bg-white/5 backdrop-blur-sm"
                                        />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-8 flex flex-col gap-6 min-h-0">
                    
                    {/* Level Detail Card */}
                    <div className="p-10 bg-gradient-to-br from-zinc-900/80 to-black border border-white/5 rounded-[3.5rem] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-transform duration-1000">
                            <Brain size={220} className="text-[#d4af37]" />
                        </div>

                        <div className="flex justify-between items-start mb-10 relative z-10">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="px-4 py-1.5 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-full text-[9px] font-black text-[#d4af37] uppercase tracking-[0.2em]">
                                        NIVEL {selectedLevel.id < 10 ? `0${selectedLevel.id}` : selectedLevel.id} {/* SECURE_ID */}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 ${selectedLevel.color}`}>
                                        {selectedLevel.status}
                                    </span>
                                </div>
                                <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                                    {selectedLevel.name}
                                </h2>
                                <p className="text-xs text-zinc-400 font-bold max-w-lg leading-relaxed uppercase tracking-wide">
                                    {selectedLevel.description} <br/>
                                    <span className="text-zinc-600 italic">Lógica S-Class aplicada para la normalización de datos en el Silver Ecosystem.</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-6xl font-black italic text-[#d4af37] tracking-tighter drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                                    {selectedLevel.impact}
                                </div>
                                <div className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] mt-3">Impacto Realizado</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                            {[
                                { label: 'ROI Social', val: '€0.00 (Audit)', icon: TrendingUp },
                                { label: 'Mayores Activos', val: '0', icon: Users },
                                { label: 'Frecuencia Terapia', val: '0hz', icon: Music },
                                { label: 'Integridad RAG', val: '0.0%', icon: ShieldCheck }
                            ].map((stat, i) => (
                                <div key={i} className="p-5 bg-white/5 border border-white/10 rounded-3xl group/stat hover:border-[#d4af37]/40 transition-all hover:-translate-y-1">
                                    <stat.icon size={18} className="text-zinc-600 mb-3 group-hover/stat:text-[#d4af37] transition-colors" />
                                    <div className="text-sm font-black text-white italic tracking-tight">{stat.val}</div>
                                    <div className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content View Based on Tabs */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'hierarchy' && (
                            <motion.div 
                                key="hierarchy-view"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex-1 p-10 bg-black/40 border border-white/5 rounded-[3.5rem] backdrop-blur-xl relative overflow-hidden"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/30">
                                        <Globe size={20} className="text-blue-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">
                                            Mapa del <span className="text-blue-500">Mega Puzzle</span>
                                        </h3>
                                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.3em]">
                                            Conectividad Global Silver Economy
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {[
                                        { title: 'IMSERSO Data Link', desc: 'Sincronización vía API con marcos legales.' },
                                        { title: 'Red de Fundaciones', desc: '54 entidades conectadas bajo protocolo.' },
                                        { title: 'Day Care Hubs', desc: 'Gestión de plazas y perfiles clínicos.' },
                                        { title: 'Empresarios Portal', desc: 'Marketplace de servicios para el mayor.' },
                                        { title: 'Family Dashboard', desc: 'Acceso privado para reporte de avances.' },
                                        { title: 'Alzheimer Engine', desc: 'Lógica predictiva de deterioro cognitivo.' },
                                    ].map((item, i) => (
                                        <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-colors">
                                            <div className="text-xs font-black text-[#d4af37] uppercase mb-2 italic">{item.title}</div>
                                            <p className="text-[10px] text-zinc-500 leading-relaxed font-bold uppercase tracking-wide">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'sessions' && (
                            <motion.div 
                                key="sessions-view"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex-1 p-10 bg-black/40 border border-white/5 rounded-[3.5rem] backdrop-blur-xl flex flex-col overflow-hidden"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-pink-500/10 rounded-xl border border-pink-500/30">
                                            <Activity size={20} className="text-pink-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">
                                                Protocolo <span className="text-pink-500">52 Sesiones</span>
                                            </h3>
                                            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.3em]">
                                                Intervención Musical Forense
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="text-xs font-black text-white italic tracking-tighter">0 / 52</div>
                                            <div className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Reconstrucción Real</div>
                                        </div>
                                        <div className="w-32 h-2 bg-zinc-950 rounded-full overflow-hidden border border-white/5">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: '0%' }}
                                                className="h-full bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]" 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
                                    {sessions.map((session) => (
                                        <div 
                                            key={session.id}
                                            className={`aspect-square rounded-xl border flex flex-col items-center justify-center relative group transition-all cursor-pointer ${
                                                session.status === 'Completada' 
                                                ? 'bg-pink-500/10 border-pink-500/40 hover:border-pink-500' 
                                                : session.status === 'En Proceso'
                                                ? 'bg-amber-500/10 border-amber-500/40 animate-pulse'
                                                : 'bg-white/5 border-white/5 opacity-40 hover:opacity-100 hover:border-white/20 grayscale hover:grayscale-0'
                                            }`}
                                        >
                                            <span className={`text-[10px] font-black ${session.status === 'Completada' ? 'text-pink-500' : 'text-zinc-500'}`}>
                                                {session.id < 10 ? `0${session.id}` : session.id}
                                            </span>
                                            {session.status === 'Completada' && (
                                                <div className="absolute -top-1 -right-1">
                                                    <div className="w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                                        <Zap size={8} className="text-white fill-current" />
                                                    </div>
                                                </div>
                                            )}
                                            {session.type === 'Evaluación' && (
                                                <div className="absolute bottom-1">
                                                    <Target size={8} className="text-[#d4af37]" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                                     <div className="flex items-center gap-6">
                                         <div className="flex -space-x-3">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-zinc-900 flex items-center justify-center overflow-hidden">
                                                    <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center">
                                                        <Users size={12} className="text-zinc-500" />
                                                    </div>
                                                </div>
                                            ))}
                                         </div>
                                         <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                                             <span className="text-white">0</span> Beneficiarios Reales en Fase Audit
                                         </div>
                                     </div>
                                     <button className="px-8 py-3 bg-[#d4af37] text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#d4af37]/10">
                                         Generar Reporte Forense
                                     </button>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'impact' && (
                            <motion.div 
                                key="impact-view"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex-1 p-10 bg-black/40 border border-white/5 rounded-[3.5rem] backdrop-blur-xl relative overflow-hidden"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                                                <TrendingUp size={20} className="text-emerald-500" />
                                            </div>
                                            <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">Impacto <span className="text-emerald-500">ROI Social</span></h3>
                                        </div>
                                        <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Ahorro Sanitario</span>
                                                <span className="text-emerald-400 font-black italic">€0.00 / Audit</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                                                <div className="w-[0%] h-full bg-emerald-500" />
                                            </div>
                                            <p className="text-[9px] text-zinc-500 font-bold uppercase leading-relaxed">
                                                Sin telemetría activa. Esperando enlace gubernamental para validación de impacto real.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
                                                <Heart size={20} className="text-cyan-500" />
                                            </div>
                                            <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">Bienestar <span className="text-cyan-500">Cognitivo</span></h3>
                                        </div>
                                        <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Estabilidad Emocional</span>
                                                <span className="text-cyan-400 font-black italic">0% Sync</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                                                <div className="w-[0%] h-full bg-cyan-400" />
                                            </div>
                                            <p className="text-[9px] text-zinc-500 font-bold uppercase leading-relaxed">
                                                Protocolo de estabilización S-Class en curso. Datos clínicos insuficientes para diagnóstico.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
