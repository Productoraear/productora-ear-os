"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import dynamic from 'next/dynamic';
import { BentoCard, StatBox, LogEntry, SmallKPI } from '@/modules/SClassScreens/components/SClassUI';

// Dynamic Lucide Icons
const Flame = dynamic(() => import('lucide-react').then(m => m.Flame), { ssr: false });
const Database = dynamic(() => import('lucide-react').then(m => m.Database), { ssr: false });
const Zap = dynamic(() => import('lucide-react').then(m => m.Zap), { ssr: false });
const Activity = dynamic(() => import('lucide-react').then(m => m.Activity), { ssr: false });
const ShieldAlert = dynamic(() => import('lucide-react').then(m => m.ShieldAlert), { ssr: false });
const Target = dynamic(() => import('lucide-react').then(m => m.Target), { ssr: false });
const Crosshair = dynamic(() => import('lucide-react').then(m => m.Crosshair), { ssr: false });

// Validaciones S-Class
const IntelSchema = z.object({
  id: z.string(),
  name: z.string().default('Origen Desconocido'),
  category: z.string().default('General Intel'),
  status: z.enum(['OPPORTUNITY', 'STABLE', 'VULNERABLE', 'VERIFIED']).default('STABLE'),
  timestamp: z.any().optional()
});

type Intel = z.infer<typeof IntelSchema>;

export const VampirePanel = () => {
    const [intelFeed, setIntelFeed] = useState<Intel[]>([]);
    const [loading, setLoading] = useState(true);
    const [isTransmuting, setIsTransmuting] = useState(false);
    const [stats, setStats] = useState({
        scanned: 14041,
        efficiency: 98.4,
        threats: 3
    });

    const handleTransmute = async () => {
        setIsTransmuting(true);
        try {
            const response = await fetch('/api/vampire/transmute', { method: 'POST' });
            const data = await response.json();
            if (data.success) {
                alert(`Protocolo completado: ${data.message}`);
            } else {
                alert(`Error en transmutación: ${data.error}`);
            }
        } catch (error) {
            console.error("Vampire Synapse Error:", error);
        } finally {
            setIsTransmuting(false);
        }
    };

    useEffect(() => {
        const q = query(collection(db, 'ear_vendors'), limit(10));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => {
                try {
                    return IntelSchema.parse({ id: doc.id, ...doc.data() });
                } catch (e) {
                    return { id: doc.id, name: 'Vendor Externo', category: 'Inyección H:', status: 'VERIFIED' } as Intel;
                }
            });
            setIntelFeed(data);
            setLoading(false);
        }, (err) => {
            console.error("Vampire Synapse Error:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="space-y-6 font-montserrat p-4">
            {/* Header / Odometer Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2">
                    <BentoCard title="VAMPIRE ENGINE" subtitle="Market Absorption & Data Ingestion v3">
                        <div className="mt-8 flex flex-col justify-center h-full">
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-7xl font-black text-white italic tracking-tighter">
                                    {stats.scanned.toLocaleString()}
                                </span>
                                <span className="text-red-500 font-bold text-xl uppercase italic">NODOS</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: "85%" }}
                                    className="h-full bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                                />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-4 uppercase font-bold tracking-[0.2em]">
                                Tasa de Ingestión: <span className="text-white">4.2 GB/sec</span> · Latencia: <span className="text-emerald-500">Sub-1ms</span>
                            </p>
                        </div>
                    </BentoCard>
                </div>
                
                <BentoCard title="EFFICIENCY" subtitle="Neural Processing Stability">
                    <div className="flex flex-col justify-between h-full py-4">
                        <StatBox label="Stability" value={`${stats.efficiency}%`} color="text-emerald-500" />
                        <div className="mt-8 flex items-center gap-2">
                            <Activity size={16} className="text-red-500 animate-pulse" />
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Active Link</span>
                        </div>
                    </div>
                </BentoCard>

                <BentoCard title="THREATS" subtitle="Market Friction Clusters" danger={stats.threats > 0}>
                    <div className="flex flex-col justify-between h-full py-4">
                        <StatBox label="Active Clusters" value={stats.threats} color="text-red-500" />
                        <p className="text-[9px] text-red-500/60 font-medium italic mt-2">
                            * Se detectaron puntos de saturación en el sector Venues Madrid.
                        </p>
                    </div>
                </BentoCard>
            </div>

            {/* Ingestion Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <BentoCard title="REAL-TIME INGESTION" subtitle="Forensic Data Stream">
                        <div className="space-y-2 mt-6">
                            {loading ? (
                                Array(6).fill(0).map((_, i) => (
                                    <div key={i} className="h-10 bg-white/5 rounded-lg animate-pulse" />
                                ))
                            ) : (
                                intelFeed.map((intel, idx) => (
                                    <LogEntry 
                                        key={intel.id}
                                        time={new Date().toLocaleTimeString('es-ES', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'})}
                                        type={intel.category === 'Guerrilla' ? 'ALERT' : intel.status}
                                        msg={`${intel.name} | ${intel.category}`}
                                        color={intel.category === 'Guerrilla' ? 'text-red-500 font-bold underline' : intel.status === 'VULNERABLE' ? 'text-red-500' : intel.status === 'OPPORTUNITY' ? 'text-emerald-500' : 'text-ear-gold'}
                                    />
                                ))
                            )}
                        </div>
                    </BentoCard>
                </div>

                <div className="space-y-6">
                    <BentoCard title="KPI MATRIX" subtitle="Strategic Pulse">
                        <div className="space-y-4 mt-4">
                            <SmallKPI icon={Zap} label="Direct Leads" value="1,240" />
                            <SmallKPI icon={Target} label="Guerrilla Intercepts" value="482" color="text-red-500" />
                            <SmallKPI icon={Database} label="Sync Status" value="Optimized" />
                        </div>
                    </BentoCard>

                    <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="p-8 bg-gradient-to-br from-red-600/40 to-transparent border border-red-500/40 rounded-[2.5rem] backdrop-blur-xl group overflow-hidden relative shadow-[0_0_50px_rgba(239,68,68,0.2)]"
                    >
                        <div className="relative z-10">
                            <h4 className="text-white font-black italic uppercase tracking-tighter text-2xl mb-2">VAMPIRE TRANSMUTER</h4>
                            <p className="text-[10px] text-zinc-300 uppercase tracking-widest leading-relaxed mb-6">
                                Transmutación semántica de leads brutos. <br />
                                <span className="text-red-500 font-black">Procesamiento RAG activo via Astra.</span>
                            </p>
                            
                            <button 
                                onClick={handleTransmute}
                                disabled={isTransmuting}
                                className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black uppercase italic tracking-widest rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn flex items-center justify-center gap-3"
                            >
                                {isTransmuting ? (
                                    <>
                                        <Activity className="animate-spin" size={18} />
                                        TRANSMUTANDO...
                                    </>
                                ) : (
                                    <>
                                        <Flame size={18} className="group-hover/btn:animate-pulse" />
                                        INICIAR ABSORCIÓN
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Crosshair size={120} className="text-red-500" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default VampirePanel;
