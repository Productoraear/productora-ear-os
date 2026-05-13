"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import dynamic from 'next/dynamic';
import { BentoCard, StatBox, LogEntry, SmallKPI } from '@/modules/SClassScreens/components/SClassUI';

const Building2 = dynamic(() => import('lucide-react').then(m => m.Building2), { ssr: false });
const FileText = dynamic(() => import('lucide-react').then(m => m.FileText), { ssr: false });
const Landmark = dynamic(() => import('lucide-react').then(m => m.Landmark), { ssr: false });
const Scaling = dynamic(() => import('lucide-react').then(m => m.Scaling), { ssr: false });
const ExternalLink = dynamic(() => import('lucide-react').then(m => m.ExternalLink), { ssr: false });
const ShieldCheck = dynamic(() => import('lucide-react').then(m => m.ShieldCheck), { ssr: false });

const InstitutionSchema = z.object({
  name: z.string(),
  status: z.enum(['Active', 'Under Review', 'Draft']),
  amount: z.string(),
  impact: z.string()
});

export const InstitucionalPanel = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-montserrat">
      {/* VIMUME Impact Core */}
      <div className="lg:col-span-3 space-y-6">
        <BentoCard title="INSTITUTIONAL CORE" subtitle="Ocean VIMUME Protocol">
            <div className="mt-8 flex flex-col md:flex-row justify-between items-start gap-8 px-4">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl bg-white text-black flex items-center justify-center border border-white shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        <Landmark className="w-10 h-10" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-ear-gold uppercase tracking-[0.4em] mb-1">Priority National Program</p>
                        <h3 className="text-5xl font-black italic text-white uppercase tracking-tighter leading-none">VIMUME LEGACY</h3>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="px-4 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                        Protocol: ACTIVE
                    </div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest italic">Institutional Tier v4</p>
                </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <BentoCard title="PARTNERS" subtitle="Global Municipalities">
                    <div className="mt-6 text-center">
                        <StatBox label="ACTIVE AGREEMENTS" value="42" color="text-white" />
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-2 leading-relaxed px-4">Direct Collaboration & Funding Agreements</p>
                    </div>
                </BentoCard>
                <BentoCard title="SUBSIDIES" subtitle="R+D Strategic Grants">
                    <div className="mt-6 text-center">
                        <StatBox label="FUNDS GRANTED" value="€2.4M" color="text-ear-gold" />
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-2 px-4 leading-relaxed">Innovation & Sovereignty Impact Budget</p>
                    </div>
                </BentoCard>
                <BentoCard title="IFEMA CORE" subtitle="Operation Continuous">
                    <div className="mt-6 text-center">
                        <StatBox label="SERVICE DAYS" value="365" color="text-white" />
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-2 px-4 leading-relaxed">Active Deployment in IFEMA Nexus</p>
                    </div>
                </BentoCard>
            </div>

            <div className="mt-8 flex items-center gap-6">
                <button className="flex items-center gap-4 bg-white text-black px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-ear-gold transition-all shadow-xl">
                    <FileText className="w-4 h-4" />
                    Request VIMUME Certificate
                </button>
                <div className="h-px flex-1 bg-white/5" />
            </div>
        </BentoCard>

        {/* Pipeline & Tenders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BentoCard title="OPEN TENDERS" subtitle="Government Procurement">
                <div className="mt-8 space-y-2">
                    {[
                        { name: 'Cultura Digital Madrid', amount: '€180k', status: 'REVIEW' },
                        { name: 'Plan Sostenibilidad IFEMA', amount: '€420k', status: 'APPROVED' }
                    ].map((t, i) => (
                        <LogEntry 
                            key={i}
                            time={t.amount}
                            type={t.status === 'APPROVED' ? 'CORE' : 'LOCKED'}
                            msg={t.name}
                            color={t.status === 'APPROVED' ? 'text-emerald-500' : 'text-ear-gold'}
                        />
                    ))}
                </div>
            </BentoCard>

            <BentoCard title="IFEMA 365 PIPELINE" subtitle="Neural Smart Venue Integration">
                <div className="mt-8 space-y-6">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[9px] font-black text-white/30 uppercase mb-1">Current Implementation</p>
                            <p className="text-2xl font-black text-white italic tracking-tighter">Phase 3: Deployment</p>
                        </div>
                        <SmallKPI label="STATUS" value="82%" trend="UP" color="text-ear-gold" />
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "82%" }} className="h-full bg-ear-gold" />
                    </div>
                    <p className="text-[10px] text-white/30 uppercase tracking-tighter italic leading-relaxed">
                        Coordinating with Innovation Board for <span className="text-white">Smart Protocol</span>.
                    </p>
                </div>
            </BentoCard>
        </div>
      </div>

      {/* Lateral Governance Info */}
      <div className="space-y-6">
        <BentoCard title="ANATOMY HUB" subtitle="Institutional Sovereignty">
            <div className="mt-8 space-y-8">
                <div className="p-8 bg-black/40 border border-white/5 rounded-[2.5rem] text-center">
                    <StatBox label="GRC COMPLIANCE" value="A+" color="text-white" />
                    <div className="mt-4 flex items-center justify-center gap-2">
                        <ShieldCheck className="w-3 h-3 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Global Sovereign Certified</span>
                    </div>
                </div>

                <div className="space-y-4 px-2">
                    {[
                        'Transparencia 2024',
                        'Sostenibilidad ESG',
                        'Impacto Social Alpha',
                        'Diversidad VIMUME'
                    ].map((metric, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                            <span className="text-[9px] font-black text-white/30 uppercase tracking-tighter italic">{metric}</span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <div key={s} className={`w-0.5 h-3 rounded-full ${s <= 4 ? 'bg-ear-gold' : 'bg-white/5'}`} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center opacity-20">
                    <p className="text-[8px] font-black text-white uppercase tracking-[0.5em] mb-4 text-center">DynaRoot Auth 2024</p>
                    <Scaling className="w-12 h-12 mx-auto text-ear-gold animate-spin-slow" />
                </div>
            </div>
        </BentoCard>
      </div>
    </div>
  );
};

export default InstitucionalPanel;
