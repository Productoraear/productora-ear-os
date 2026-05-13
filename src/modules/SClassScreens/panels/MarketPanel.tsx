"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import dynamic from 'next/dynamic';
import { BentoCard, StatBox, SmallKPI, LogEntry } from '@/modules/SClassScreens/components/SClassUI';

const TrendingUp = dynamic(() => import('lucide-react').then(m => m.TrendingUp), { ssr: false });
const Map = dynamic(() => import('lucide-react').then(m => m.Map), { ssr: false });
const Target = dynamic(() => import('lucide-react').then(m => m.Target), { ssr: false });
const Zap = dynamic(() => import('lucide-react').then(m => m.Zap), { ssr: false });
const Globe = dynamic(() => import('lucide-react').then(m => m.Globe), { ssr: false });
const Activity = dynamic(() => import('lucide-react').then(m => m.Activity), { ssr: false });

const MarketIntelCharts = () => {
    return (
        <div className="w-full h-full flex flex-col justify-end gap-2 p-4">
            <div className="flex items-end gap-2 h-44">
                {[40, 65, 45, 90, 85, 60, 95, 75, 55, 80, 100, 70].map((h, i) => (
                   <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 1, delay: i * 0.05 }}
                        className="flex-1 bg-gradient-to-t from-ear-gold/20 to-ear-gold rounded-[4px]"
                   />
                ))}
            </div>
            <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-widest mt-2 px-2">
                <span>JAN</span><span>MẠR</span><span>MAY</span><span>JUL</span><span>SEP</span><span>DEC</span>
            </div>
        </div>
    );
};

export const MarketPanel = () => {
  const [activeSector, setActiveSector] = useState("Management Artístico");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-montserrat">
      {/* Primary Intelligence Core */}
      <div className="lg:col-span-3 space-y-6">
        <BentoCard title="MARKET INTEL" subtitle="Neural Global Matrix">
            <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-8">
                <div className="md:col-span-3 bg-black/40 rounded-[2.5rem] border border-white/5 p-8 h-80 relative group overflow-hidden">
                    <div className="absolute top-6 left-8 flex items-center gap-2 z-10">
                        <Activity className="w-4 h-4 text-ear-gold" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Global Volume Ingestion</span>
                    </div>
                    <MarketIntelCharts />
                </div>
                <div className="md:col-span-2 space-y-6">
                    <div className="p-8 bg-ear-gold rounded-[2rem] text-black relative overflow-hidden group shadow-2xl">
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-60">Projected Revenue Q4</p>
                        <p className="text-4xl font-black italic tracking-tighter mb-4">+€42.8M</p>
                        <Zap className="absolute right-8 top-8 w-6 h-6 opacity-20" />
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Target Confirmed</span>
                        </div>
                    </div>
                    <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] relative overflow-hidden">
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Avg. Market Ticket</p>
                        <p className="text-4xl font-black text-white italic tracking-tighter">€68.50</p>
                        <div className="mt-4 flex items-center gap-2">
                            <SmallKPI label="ANNUAL DELTA" value="+5.2%" trend="UP" color="text-emerald-500" />
                        </div>
                        <Globe className="absolute -right-8 -bottom-8 w-24 h-24 text-white/[0.03] rotate-12" />
                    </div>
                </div>
            </div>
        </BentoCard>

        {/* Tactical Heatmap & Ops */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BentoCard title="DEMAND HEATMAP" subtitle="Geolocated Vibrations">
                <div className="mt-8 grid grid-cols-8 grid-rows-4 gap-2 h-44 opacity-60">
                    {Array.from({ length: 32 }).map((_, i) => (
                        <div 
                            key={i} 
                            className={`rounded-[4px] border border-white/5 transition-all duration-1000 ${
                                i % 7 === 0 ? 'bg-red-500/40' : 
                                i % 4 === 0 ? 'bg-ear-gold/40' : 
                                'bg-ear-gold/10 hover:bg-ear-gold/20'
                            }`} 
                        />
                    ))}
                </div>
                <div className="mt-6 flex justify-between items-center text-[8px] font-black text-white/20 uppercase tracking-widest">
                    <span>Region Alpha</span>
                    <span>Density Scale: High</span>
                </div>
            </BentoCard>

            <BentoCard title="TACTICAL OPS" subtitle="Dispatch Control">
                <div className="mt-8 space-y-2">
                    {[
                        { op: 'VIMUME Ingestion', priority: 'CRITICAL', user: 'EAR_AI' },
                        { op: 'ArtistHub Sync', priority: 'HIGH', user: 'ASTRA' },
                        { op: 'Venue Mapping', priority: 'MEDIUM', user: 'STITCH' }
                    ].map((op, i) => (
                        <LogEntry 
                            key={i}
                            time={op.user}
                            type={op.priority === 'CRITICAL' ? 'ALERT' : 'CORE'}
                            msg={op.op}
                            color={op.priority === 'CRITICAL' ? 'text-red-500' : op.priority === 'HIGH' ? 'text-orange-500' : 'text-blue-500'}
                        />
                    ))}
                </div>
            </BentoCard>
        </div>
      </div>

      {/* Lateral Selector */}
      <div className="space-y-6">
        <BentoCard title="SECTOR ANALYSIS" subtitle="Operational Focus">
          <div className="mt-8 space-y-2">
            {[
                'Management Artístico',
                'Producción Eventos',
                'Consultoría B2B',
                'Academy Formación',
                'SaaS Infrastructure'
            ].map((sector) => (
                <button 
                  key={sector}
                  onClick={() => setActiveSector(sector)}
                  className={`w-full p-5 rounded-2xl text-left transition-all duration-300 relative overflow-hidden group ${
                    activeSector === sector ? 'bg-ear-gold text-black scale-[1.02]' : 'bg-white/5 text-white/40 hover:bg-white/10 border border-white/5'
                  }`}
                >
                    <span className="text-[10px] font-black uppercase tracking-tighter italic relative z-10">{sector}</span>
                    {activeSector === sector && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <TrendingUp className="w-3 h-3 text-black" />
                        </div>
                    )}
                </button>
            ))}
          </div>

          <div className="mt-8 bg-black/40 p-8 rounded-[2rem] border border-white/5 text-center">
             <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Market Dominance</p>
             <p className="text-5xl font-black text-white italic tracking-tighter">72<span className="text-ear-gold ml-1 text-2xl">%</span></p>
             <div className="h-1.5 w-full bg-white/5 mt-4 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "72%" }}
                    className="h-full bg-ear-gold shadow-[0_0_15px_rgba(212,175,55,0.5)]" 
                />
             </div>
          </div>
        </BentoCard>
      </div>
    </div>
  );
};

export default MarketPanel;
