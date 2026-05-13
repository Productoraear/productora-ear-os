"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import dynamic from 'next/dynamic';
import { BentoCard, StatBox, LogEntry, SmallKPI } from '@/modules/SClassScreens/components/SClassUI';

const Milestone = dynamic(() => import('lucide-react').then(m => m.Milestone), { ssr: false });
const Rocket = dynamic(() => import('lucide-react').then(m => m.Rocket), { ssr: false });
const Terminal = dynamic(() => import('lucide-react').then(m => m.Terminal), { ssr: false });
const LayoutGrid = dynamic(() => import('lucide-react').then(m => m.LayoutGrid), { ssr: false });
const Activity = dynamic(() => import('lucide-react').then(m => m.Activity), { ssr: false });
import { OpalEngine } from '@/lib/intelligence/opalEngine';

const MilestoneSchema = z.object({
  title: z.string(),
  date: z.string(),
  status: z.enum(['Done', 'Development', 'Planning']),
  desc: z.string()
});

export const RoadmapPanel = () => {
  const milestones = [
    { title: 'Base Core EAR OS', date: 'Q1 2024', status: 'Done', desc: 'SClass Central Nucleus & Sovereign Auth.' },
    { title: 'Vampire Ingestion', date: 'Q2 2024', status: 'Done', desc: 'Massive Data Sync & Neural Cleaning.' },
    { title: 'Astra Neural Link', date: 'Q2 2024', status: 'Development', desc: 'Full Gemini AI Intelligence Integration.' },
    { title: 'OPAL Matrix Activation', date: 'Q2 2024', status: 'Done', desc: 'Predictive Success Algorithm Implemented.' },
    { title: 'Global Deployment', date: 'Q3 2024', status: 'Planning', desc: 'Public Launch & IFEMA 365 Nexus Scaling.' }
  ];

  const opalHealth = OpalEngine.getGlobalHealth();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-montserrat">
      {/* Tactical Timeline */}
      <div className="lg:col-span-3 space-y-6">
        <BentoCard title="DOMINION STRATEGY" subtitle="Tactical Roadmap Execution">
            <div className="mt-8 flex items-center gap-6 mb-12">
                <div className="w-16 h-16 rounded-2xl bg-ear-gold/10 flex items-center justify-center border border-ear-gold/20">
                    <Milestone className="text-ear-gold w-8 h-8" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-ear-gold uppercase tracking-[0.4em] mb-1">Timeline Protocol v1.4</p>
                   <h3 className="text-4xl font-black italic text-white uppercase tracking-tighter leading-none">OPERATION SEQUENCE</h3>
                </div>
            </div>

            <div className="space-y-6 pl-4 border-l border-white/5 ml-8 mt-12 mb-8">
                {milestones.map((ms, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative pl-12"
                    >
                        <div className={`absolute left-[-11px] top-6 w-5 h-5 rounded-full border-4 border-[#050505] ${
                            ms.status === 'Done' ? 'bg-ear-gold' : ms.status === 'Development' ? 'bg-blue-400' : 'bg-white/10'
                        }`} />
                        
                        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl group hover:border-ear-gold/30 transition-all cursor-crosshair">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[10px] font-black text-ear-gold uppercase tracking-widest">{ms.date}</p>
                                <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                                    ms.status === 'Done' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                                    ms.status === 'Development' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                                    'bg-white/5 text-white/30 border border-white/5'
                                }`}>
                                    {ms.status}
                                </span>
                            </div>
                            <h4 className="text-xl font-black italic text-white uppercase tracking-tighter mb-2 group-hover:text-ear-gold transition-colors">{ms.title}</h4>
                            <p className="text-[11px] font-medium text-white/40 uppercase tracking-tighter leading-relaxed">{ms.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none pr-12 pb-12 rotate-[-15deg]">
                <Rocket className="w-64 h-64 text-white" />
            </div>
        </BentoCard>
      </div>

      {/* Module Registry & Status */}
      <div className="space-y-6">
        <BentoCard title="MODULE REGISTRY" subtitle="Infrastructure Status">
            <div className="mt-8 space-y-4">
                {[
                    { name: 'Financial Core', status: 'ACTIVE', color: 'text-emerald-500' },
                    { name: 'OPAL Intelligence', status: 'ACTIVE', color: 'text-ear-gold' },
                    { name: 'Vampire Protocol', status: 'ACTIVE', color: 'text-emerald-500' },
                    { name: 'Astra Neural', status: 'STABILIZING', color: 'text-amber-500' },
                    { name: 'Stitch MCM Nexus', status: 'ACTIVE', color: 'text-ear-gold' },
                    { name: 'Artist Hub', status: 'ACTIVE', color: 'text-emerald-500' }
                ].map((mod, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-[10px] font-black text-white/60 uppercase italic tracking-tighter">{mod.name}</span>
                        <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full bg-current ${mod.color} shadow-[0_0_8px_rgba(255,255,255,0.2)]`} />
                             <span className={`text-[8px] font-black uppercase ${mod.color}`}>{mod.status}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 mb-6">
                    <Terminal className="text-ear-gold/30 w-4 h-4" />
                    <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Deployment History</h4>
                </div>
                <div className="space-y-2">
                    {[
                        { time: '19/04', type: 'CORE', msg: 'v1.4.2 STABLE DEPLOY' },
                        { time: '18/04', type: 'LOCK', msg: 'v1.4.1 EMERGENCY FIX' },
                        { time: '16/04', type: 'DATA', msg: 'v1.4.0 ALPHA RELEASE' }
                    ].map((log, i) => (
                        <LogEntry 
                            key={i}
                            time={log.time}
                            type={log.type}
                            msg={log.msg}
                            color="text-white/40"
                        />
                    ))}
                </div>
            </div>
        </BentoCard>

        <BentoCard title="OPAL VITALITY" subtitle="Predictive Engine Health">
            <div className="mt-4 space-y-4">
                {[
                    { label: 'OPPORTUNITY', value: opalHealth.opportunity, color: 'bg-emerald-500' },
                    { label: 'PRICE', value: opalHealth.price, color: 'bg-ear-gold' },
                    { label: 'AUTHORITY', value: opalHealth.authority, color: 'bg-blue-400' },
                    { label: 'LEGACY', value: opalHealth.legacy, color: 'bg-purple-500' }
                ].map((m, i) => (
                    <div key={i}>
                        <div className="flex justify-between mb-1">
                            <span className="text-[8px] font-black text-white/40">{m.label}</span>
                            <span className="text-[8px] font-black text-white">{m.value}%</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: `${m.value}%` }} 
                                className={`h-full ${m.color}`} 
                            />
                        </div>
                    </div>
                ))}
            </div>
        </BentoCard>
      </div>
    </div>
  );
};

export default RoadmapPanel;
