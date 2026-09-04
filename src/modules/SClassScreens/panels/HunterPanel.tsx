"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { BentoCard, StatBox, LogEntry, SmallKPI } from '@/modules/SClassScreens/components/SClassUI';

const Zap = dynamic(() => import('lucide-react').then(m => m.Zap), { ssr: false });
const Activity = dynamic(() => import('lucide-react').then(m => m.Activity), { ssr: false });
const Globe = dynamic(() => import('lucide-react').then(m => m.Globe), { ssr: false });
const Terminal = dynamic(() => import('lucide-react').then(m => m.Terminal), { ssr: false });
const Hash = dynamic(() => import('lucide-react').then(m => m.Hash), { ssr: false });
const Search = dynamic(() => import('lucide-react').then(m => m.Search), { ssr: false });
const Briefcase = dynamic(() => import('lucide-react').then(m => m.Briefcase), { ssr: false });

interface Lead {
    id: string;
    company: string;
    website: string;
    status: string;
    detectedAt: any;
    source?: string;
}

export const HunterPanel = () => {
    const [targetUrl, setTargetUrl] = useState('');
    const [isHunting, setIsHunting] = useState(false);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        if (!db || typeof window === 'undefined') return;
        
        let unsubscribe = () => {};
        try {
            const q = query(
                collection(db, 'ear_leads'),
                orderBy('detectedAt', 'desc'),
                limit(20)
            );

            unsubscribe = onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Lead[];
                setLeads(data);
            }, (err) => {
                console.warn('⚠️ [HunterPanel] Firestore fallback activo:', err.message);
            });
        } catch (e: any) {
            console.warn('⚠️ [HunterPanel] Listener safe fallback:', e.message);
        }

        return () => {
            try { unsubscribe(); } catch (e) {}
        };
    }, []);

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
    };

    const handlePhantomHunt = async () => {
        if (!targetUrl) return;
        setIsHunting(true);
        addLog(`INICIANDO PROTOCOLO PHANTOM EN: ${targetUrl}`);
        
        try {
            const res = await fetch('/api/hunter/phantom', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: targetUrl })
            });

            const result = await res.json();
            if (result.success) {
                addLog(`PHANTOM HUNT COMPLETADO. ${result.count} LEADS DETECTADOS.`);
            } else {
                addLog(`ERROR EN PHANTOM: ${result.error}`);
            }
        } catch (error) {
            addLog(`FALLO CRÍTICO EN CONEXIÓN PHANTOM.`);
        } finally {
            setIsHunting(false);
        }
    };

    const handleAstraExecute = async () => {
        addLog("SOLICITANDO EJECUCIÓN AESTRA CORE (PYTHON)...");
        // Placeholder para integración con el motor legacy si fuera necesario
    };

    return (
        <div className="space-y-6 font-montserrat">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-10 gap-6">
                <div>
                    <h3 className="text-5xl font-black uppercase italic tracking-tighter text-white leading-none">
                        HUNTER <span className="text-ear-gold">ENGINE</span>
                    </h3>
                    <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.5em] mt-3 italic">
                        S-Class Infiltration & Intelligence Gathering
                    </p>
                </div>
                <StatBox 
                    label="ACTIVE LEADS" 
                    value={leads.length.toString()} 
                    color="text-ear-gold shadow-[0_0_30px_rgba(212,175,55,0.2)]" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Control Center */}
                <div className="lg:col-span-1 space-y-6">
                    <BentoCard title="CAZADOR FANTASMA" subtitle="Node.js Stealth Scraper">
                        <div className="space-y-4 mt-6">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={targetUrl}
                                    onChange={(e) => setTargetUrl(e.target.value)}
                                    placeholder="URL DE INFILTRACIÓN..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black text-white uppercase tracking-widest focus:border-ear-gold outline-none transition-all"
                                />
                                <div className="absolute right-3 top-3">
                                    <Globe className={`w-4 h-4 ${isHunting ? 'text-ear-gold animate-spin' : 'text-white/20'}`} />
                                </div>
                            </div>
                            
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handlePhantomHunt}
                                disabled={isHunting || !targetUrl}
                                className="w-full bg-white text-black py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 disabled:opacity-30 transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-ear-gold"
                            >
                                {isHunting ? <Activity className="w-4 h-4 animate-spin text-black" /> : <Zap className="w-4 h-4" />}
                                {isHunting ? "ESCANEANDO..." : "INICIAR CACERÍA"}
                            </motion.button>
                        </div>
                    </BentoCard>

                    <BentoCard title="ASTRA CORE (LEGACY)" subtitle="Python Distributed Cluster">
                        <div className="mt-6 flex flex-col gap-3">
                            <button 
                                onClick={handleAstraExecute}
                                className="w-full border border-white/10 hover:border-ear-gold/50 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                <Hash className="w-3 h-3" />
                                Run Python Scrapers
                            </button>
                            <p className="text-[8px] text-white/10 uppercase text-center italic">
                                Use for massive background ingestion
                            </p>
                        </div>
                    </BentoCard>

                    <BentoCard title="OPERATION LOGS" subtitle="Real-time Feed">
                        <div className="mt-4 h-[250px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            <AnimatePresence>
                                {logs.map((log, i) => (
                                    <motion.p 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        key={i} 
                                        className="text-[9px] font-mono text-white/30 border-l border-white/5 pl-3 py-1"
                                    >
                                        {log}
                                    </motion.p>
                                ))}
                            </AnimatePresence>
                            {logs.length === 0 && <p className="text-[9px] text-white/10 italic">Waiting for signals...</p>}
                        </div>
                    </BentoCard>
                </div>

                {/* Leads Table */}
                <div className="lg:col-span-2">
                    <BentoCard title="DETECTED ASSETS" subtitle="Encryption Protocol Active">
                        <div className="mt-8 overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="pb-4 text-[9px] font-black text-white/20 uppercase tracking-widest">Hash</th>
                                        <th className="pb-4 text-[9px] font-black text-white/20 uppercase tracking-widest">Source/Target</th>
                                        <th className="pb-4 text-[9px] font-black text-white/20 uppercase tracking-widest">Status</th>
                                        <th className="pb-4 text-[9px] font-black text-white/20 uppercase tracking-widest text-right">Detected</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {leads.map((lead) => (
                                        <tr key={lead.id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="py-4 font-mono text-[9px] text-white/40 group-hover:text-ear-gold">
                                                {lead.id.slice(-6).toUpperCase()}
                                            </td>
                                            <td className="py-4">
                                                <p className="text-[11px] font-black text-white uppercase italic leading-none">{lead.company || 'Unknown Entity'}</p>
                                                <p className="text-[8px] text-white/20 uppercase tracking-tighter mt-1 truncate max-w-[200px] hover:text-ear-gold/50 cursor-help">
                                                    {lead.website || lead.source || 'No Source'}
                                                </p>
                                            </td>
                                            <td className="py-4">
                                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${
                                                    lead.status === 'NEW' ? 'bg-ear-gold/10 text-ear-gold border-ear-gold/20' : 'bg-white/5 text-white/20 border-white/5'
                                                }`}>
                                                    {lead.status || 'NEW'}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <span className="text-[9px] font-black italic text-white/30 uppercase">
                                                    {lead.detectedAt ? new Date(lead.detectedAt.seconds * 1000).toLocaleDateString() : 'REALTIME'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {leads.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-20 text-center text-white/10 italic uppercase font-black tracking-widest text-[10px]">
                                                The hunting grounds are empty.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </BentoCard>
                </div>
            </div>
        </div>
    );
};

export default HunterPanel;
