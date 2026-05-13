"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { BentoCard, StatBox, LogEntry, SmallKPI } from '@/modules/SClassScreens/components/SClassUI';

const Users = dynamic(() => import('lucide-react').then(m => m.Users), { ssr: false });
const MonitorIcon = dynamic(() => import('lucide-react').then(m => m.MonitorIcon), { ssr: false });
const Terminal = dynamic(() => import('lucide-react').then(m => m.Terminal), { ssr: false });
const Cpu = dynamic(() => import('lucide-react').then(m => m.Cpu), { ssr: false });
const ActivitySquare = dynamic(() => import('lucide-react').then(m => m.ActivitySquare), { ssr: false });

export const StitchConsole = () => {
    const [emails] = useState([
        { id: 1, from: "j.garcia@ayto-madrid.es", subject: "Propuesta Fiestas 2026", status: "NEW", time: "02m" },
        { id: 2, from: "info@hotelpalace.com", subject: "Reserva Artista Vault", status: "URGENT", time: "15m" },
        { id: 3, from: "artist@talent.ear", subject: "Actualización Kit de Marca", status: "DONE", time: "01h" },
    ]);

    const partners = [
        { name: "Influencer Alpha", leads: 45, conv: "12%", trend: "UP" },
        { name: "Wedding Planner Beta", leads: 22, conv: "08%", trend: "STABLE" },
        { name: "Hotel Group Gamma", leads: 89, conv: "15%", trend: "UP" },
    ];

    return (
        <div className="space-y-6 font-montserrat">
            {/* Header / NASA Control Title */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
                <div>
                    <h3 className="text-5xl font-black uppercase italic tracking-tighter text-white leading-none">
                        STITCH <span className="text-ear-gold">NEXUS</span>
                    </h3>
                    <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.6em] mt-3 italic">
                        United Assets Orchestration & Neural Intercept
                    </p>
                </div>
                <div className="flex items-center gap-4 px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Sovereign Link Stable</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Communications Segment */}
                <div className="space-y-6">
                    <BentoCard title="NEURAL INTERCEPT" subtitle="Messaging Inbox">
                        <div className="mt-8 space-y-3">
                            {emails.map(email => (
                                <div key={email.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-ear-gold/30 transition-all cursor-crosshair">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[8px] font-mono text-white/20 uppercase">{email.time} AGO</span>
                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded ${email.status === 'URGENT' ? 'bg-red-500 text-black' : 'bg-ear-gold text-black'}`}>
                                            {email.status}
                                        </span>
                                    </div>
                                    <h4 className="text-[11px] font-black text-white italic truncate uppercase">{email.from}</h4>
                                    <p className="text-[9px] text-white/40 mt-1 uppercase truncate font-medium">{email.subject}</p>
                                </div>
                            ))}
                            <button className="w-full py-4 mt-2 bg-white/5 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white hover:bg-white/10 transition-all">
                                Open Secure Terminal
                            </button>
                        </div>
                    </BentoCard>

                    <BentoCard title="AI CLASSIFICATION" subtitle="Astra Mail Parser v12">
                        <div className="mt-8 flex items-center gap-6">
                            <ActivitySquare className="text-ear-gold w-12 h-12" />
                            <div>
                                <p className="text-3xl font-black text-white italic tracking-tighter leading-none">94.2%</p>
                                <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">Accuracy Index</p>
                            </div>
                        </div>
                    </BentoCard>
                </div>

                {/* Main Operations Terminal */}
                <div className="lg:col-span-2 space-y-6">
                    <BentoCard title="TACTICAL RESOURCE MATRIX" subtitle="Global Deployment Visualization">
                        <div className="mt-8 h-80 bg-black/40 border border-white/5 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center">
                            {/* Grid Overlay */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                                <div className="grid grid-cols-12 h-full w-full">
                                    {Array.from({ length: 144 }).map((_, i) => (
                                        <div key={i} className="border border-white/20" />
                                    ))}
                                </div>
                            </div>

                            <div className="relative z-10 text-center space-y-4">
                                <p className="text-ear-gold text-[10px] font-black uppercase tracking-[0.8em] animate-pulse">Syncing Stitch Nodes...</p>
                                <div className="flex gap-4 justify-center">
                                    <div className="w-2 h-2 bg-ear-gold rounded-full animate-ping" />
                                    <div className="w-2 h-2 bg-ear-gold rounded-full animate-ping [animation-delay:0.2s]" />
                                    <div className="w-2 h-2 bg-ear-gold rounded-full animate-ping [animation-delay:0.4s]" />
                                </div>
                            </div>
                            
                            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end border-t border-white/5 pt-6">
                                <div>
                                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Authenticated Root</p>
                                    <p className="text-[10px] font-black text-white/60 uppercase italic tracking-tighter">Edwin Agudelo • Alpha Level</p>
                                </div>
                                <Terminal className="w-4 h-4 text-ear-gold/20" />
                            </div>
                        </div>
                    </BentoCard>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <BentoCard title="TALENT LOAD" subtitle="Vanguard Artist Capacity">
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <SmallKPI icon={Users} label="Artists" value="128" />
                                <SmallKPI icon={MonitorIcon} label="Stream" value="98%" />
                            </div>
                         </BentoCard>
                         <BentoCard title="NEURAL LOAD" subtitle="Processor Saturation">
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <SmallKPI icon={Terminal} label="Astra" value="v10.2" />
                                <SmallKPI icon={Cpu} label="Load" value="42%" />
                            </div>
                         </BentoCard>
                    </div>
                </div>

                {/* Telemetry Segment */}
                <div className="space-y-6">
                    <BentoCard title="PARTNER TELEMETRY" subtitle="Sales Node Performance">
                        <div className="mt-8 space-y-6">
                            {partners.map((p, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[9px] font-black text-white uppercase italic tracking-widest leading-none">{p.name}</span>
                                        <SmallKPI label="CONV" value={p.conv} trend={p.trend as any} color="text-ear-gold" />
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }} 
                                            animate={{ width: p.conv }} 
                                            className="h-full bg-ear-gold shadow-[0_0_10px_rgba(212,175,55,0.3)]" 
                                        />
                                    </div>
                                    <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">{p.leads} Leads Segmented</p>
                                </div>
                            ))}
                        </div>
                    </BentoCard>

                    <BentoCard title="SYSTEM LOGS" subtitle="Nexus Pulse Monitoring">
                        <div className="mt-8 space-y-2">
                            <LogEntry time="12:04" type="CORE" msg="Stitch Nexus v4.2 Handshake Success" color="text-emerald-500" />
                            <LogEntry time="11:58" type="USER" msg="Root Access Granted: E. Agudelo" color="text-ear-gold" />
                            <LogEntry time="11:45" type="DATA" msg="Astra Mail Parser Syncing..." color="text-white/40" />
                        </div>
                    </BentoCard>
                </div>
            </div>
        </div>
    );
};

export default StitchConsole;
