"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import dynamic from 'next/dynamic';
import { BentoCard, StatBox, SmallKPI, LogEntry } from '@/modules/SClassScreens/components/SClassUI';

const GraduationCap = dynamic(() => import('lucide-react').then(m => m.GraduationCap), { ssr: false });
const Trophy = dynamic(() => import('lucide-react').then(m => m.Trophy), { ssr: false });
const Brain = dynamic(() => import('lucide-react').then(m => m.Brain), { ssr: false });
const Lock = dynamic(() => import('lucide-react').then(m => m.Lock), { ssr: false });
const BookOpen = dynamic(() => import('lucide-react').then(m => m.BookOpen), { ssr: false });
const Play = dynamic(() => import('lucide-react').then(m => m.Play), { ssr: false });

const LessonSchema = z.object({
  title: z.string(),
  progress: z.number(),
  xp: z.number()
});

export const AcademyPanel = () => {
  const [xp, setXp] = useState(1450);
  const lesson = LessonSchema.parse({
    title: "Mentalidad de Guerra Artística",
    progress: 85,
    xp: 250
  });

  const missions = [
    { title: 'The Trinity Protocol', status: 'COMPLETED', xp: '+120' },
    { title: 'War Mindset II', status: 'IN_PROGRESS', xp: '85%' },
    { title: 'System Domination', status: 'LOCKED', xp: 'Tier 3' },
    { title: 'Vampire Ingestion', status: 'LOCKED', xp: 'Tier 4' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-montserrat">
      {/* core Learning Area */}
      <div className="lg:col-span-3 space-y-6">
        <BentoCard title="TACTICAL CORE" subtitle="S-Class Alpha Module">
            <div className="mt-8 flex flex-col h-full">
                <div className="flex items-center gap-6 mb-12">
                     <div className="w-16 h-16 rounded-3xl bg-ear-gold/10 flex items-center justify-center border border-ear-gold/20 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                        <GraduationCap className="text-ear-gold w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-4xl font-black italic text-white uppercase tracking-tighter leading-none">{lesson.title}</h3>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mt-2">Current Objective: Master the Void</p>
                    </div>
                </div>

                <div className="aspect-video bg-black/40 rounded-[2.5rem] border border-white/5 flex items-center justify-center relative overflow-hidden group/video shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className="w-20 h-20 rounded-full bg-ear-gold flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.4)] cursor-pointer z-10"
                    >
                        <Play className="w-8 h-8 text-black ml-1 fill-black" />
                    </motion.div>
                    <div className="absolute bottom-10 left-10 right-10 z-10 flex justify-between items-end">
                        <div className="w-2/3">
                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${lesson.progress}%` }}
                                    className="h-full bg-ear-gold"
                                />
                            </div>
                            <p className="text-[10px] text-white font-black mt-2 uppercase tracking-widest">{lesson.progress}% Completed</p>
                        </div>
                        <StatBox label="XP REWARD" value={`+${lesson.xp}`} color="text-ear-gold" />
                    </div>
                </div>
            </div>
        </BentoCard>

        <BentoCard title="TACTICAL CHALLENGES" subtitle="Quick Synapse Tasks">
            <div className="mt-6 flex gap-6">
                <div className="flex-1 space-y-4">
                    <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.3em] block ml-2">Define tu "Rigor de Guerra":</label>
                    <input 
                        type="text" 
                        placeholder="Introduce tu valor..."
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-8 py-5 text-white italic placeholder:text-white/5 focus:outline-none focus:border-ear-gold/50 transition-all font-medium"
                    />
                </div>
                <div className="flex items-end">
                    <button className="h-16 px-12 bg-ear-gold text-black text-[11px] font-black uppercase tracking-[0.4em] rounded-2xl shadow-2xl hover:scale-105 transition-all active:scale-95">
                        Transmitir
                    </button>
                </div>
            </div>
        </BentoCard>
      </div>

      {/* Side Stats */}
      <div className="space-y-6">
        <BentoCard title="COMMAND XP" subtitle="Neural Growth Status">
            <div className="mt-8 flex flex-col items-center">
                <p className="text-6xl font-black text-white italic tracking-tighter mb-4">{xp.toLocaleString()}</p>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "65%" }}
                        className="h-full bg-ear-gold"
                    />
                </div>
                <div className="flex justify-between w-full mt-4">
                    <p className="text-[9px] font-black text-gray-600 uppercase">Lv. 14 Sovereign</p>
                    <p className="text-[9px] font-black text-ear-gold uppercase italic">Goal: 2,000</p>
                </div>
            </div>
        </BentoCard>

        <BentoCard title="MISSION MAP" subtitle="Operational Hierarchy">
            <div className="mt-6 space-y-2">
                {missions.map((m, i) => (
                    <LogEntry 
                        key={i}
                        time={m.xp}
                        type={m.status === 'LOCKED' ? 'LOCKED' : 'CORE'}
                        msg={m.title}
                        color={m.status === 'COMPLETED' ? 'text-emerald-500' : m.status === 'IN_PROGRESS' ? 'text-ear-gold' : 'text-gray-600'}
                    />
                ))}
            </div>
        </BentoCard>

        <div className="p-8 bg-ear-gold/5 border border-ear-gold/10 rounded-[2.5rem] flex flex-col items-center gap-4 text-center">
            <Trophy className="text-ear-gold w-10 h-10 opacity-20" />
            <p className="text-[10px] font-black text-white uppercase tracking-widest leading-relaxed">
                Desbloquea el nivel <span className="text-ear-gold italic">ARCHON</span> completando 5 lecciones más.
            </p>
        </div>
      </div>
    </div>
  );
};

export default AcademyPanel;
