"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { z } from 'zod';
import dynamic from 'next/dynamic';
import { BentoCard, StatBox, LogEntry, SmallKPI } from '@/modules/SClassScreens/components/SClassUI';

const Users = dynamic(() => import('lucide-react').then(m => m.Users), { ssr: false });
const Wallet = dynamic(() => import('lucide-react').then(m => m.Wallet), { ssr: false });
const Clock = dynamic(() => import('lucide-react').then(m => m.Clock), { ssr: false });
const ArrowUpRight = dynamic(() => import('lucide-react').then(m => m.ArrowUpRight), { ssr: false });
const ShieldCheck = dynamic(() => import('lucide-react').then(m => m.ShieldCheck), { ssr: false });

const AffiliateSchema = z.object({
  id: z.string(),
  name: z.string(),
  commission: z.number(),
  status: z.enum(['pending', 'approved', 'paid']),
  source: z.string(),
  date: z.string()
});

type Affiliate = z.infer<typeof AffiliateSchema>;

export const AffiliatesPanel = () => {
  const [referrals, setReferrals] = useState<Affiliate[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'ear_referrals'), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        try {
          return AffiliateSchema.parse({ id: doc.id, ...doc.data() });
        } catch (e) {
          return null;
        }
      }).filter(Boolean) as Affiliate[];
      setReferrals(data);
    }, (error) => {
        setReferrals([
            { id: '1', name: 'Alfonso R.', commission: 450, status: 'pending', source: 'IG Lead', date: '21/04' },
            { id: '2', name: 'Marta G.', commission: 1200, status: 'pending', source: 'Web Dir', date: '21/04' }
        ]);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-montserrat">
      {/* Commission Review Hub */}
      <div className="lg:col-span-3 space-y-6">
        <BentoCard title="PENDING SETTLEMENTS" subtitle="Payout Verification Phase">
            <div className="mt-8 flex items-center justify-between p-6 bg-ear-gold/5 rounded-3xl border border-ear-gold/10 mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-ear-gold text-black rounded-2xl">
                        <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Total to Disperse</p>
                        <p className="text-3xl font-black text-white italic tracking-tighter">
                            €{referrals.reduce((acc, r) => acc + r.commission, 0).toLocaleString()}
                        </p>
                    </div>
                </div>
                <button className="px-8 py-4 bg-ear-gold text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl">
                    Approve Batch
                </button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-4 scrollbar-hide">
                {referrals.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-5 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-ear-gold/30 transition-all">
                        <div className="flex items-center gap-5">
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs text-white group-hover:bg-ear-gold group-hover:text-black transition-all">
                                {item.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white italic tracking-tight">{item.name}</p>
                                <p className="text-[9px] text-white/30 uppercase font-black tracking-widest leading-none mt-1">{item.source}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-black text-ear-gold italic tracking-tighter leading-none">€{item.commission}</p>
                            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{item.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </BentoCard>

        {/* Global Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BentoCard title="AFFILIATE STATUTE" subtitle="Operational Rules">
                <div className="mt-8 space-y-4">
                    <p className="text-[11px] text-white/40 leading-relaxed uppercase tracking-tighter italic">
                        All payments are processed every Sunday at 23:59 GMT. 
                        KYC verification is required for withdrawals &gt; <span className="text-white">€3,000</span>.
                    </p>
                    <div className="flex gap-4">
                        <div className="bg-black/40 border border-white/5 p-5 rounded-2xl flex-1 text-center">
                            <p className="text-[8px] font-black text-white/20 uppercase mb-2">Next Payout</p>
                            <p className="text-lg font-black text-white italic underline decoration-ear-gold">21 APR</p>
                        </div>
                        <div className="bg-black/40 border border-white/5 p-5 rounded-2xl flex-1 text-center">
                            <p className="text-[8px] font-black text-white/20 uppercase mb-2">Network Health</p>
                            <p className="text-lg font-black text-emerald-500 italic">OPTIMAL</p>
                        </div>
                    </div>
                </div>
                <ShieldCheck className="absolute -right-8 -bottom-8 w-24 h-24 text-white/[0.02]" />
            </BentoCard>

            <BentoCard title="ELITE BASE" subtitle="Asset Hierarchy">
                <div className="mt-8 space-y-3">
                    {[
                        { label: 'Legend (S-Class)', value: 12 },
                        { label: 'Sovereign Master', value: 45 },
                        { label: 'Operative Junior', value: 140 }
                    ].map((rank, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 group hover:border-white/20 transition-all">
                            <span className="text-[10px] font-black uppercase text-white/40 group-hover:text-white transition-colors">{rank.label}</span>
                            <span className="text-sm font-black text-ear-gold italic">{rank.value}</span>
                        </div>
                    ))}
                </div>
            </BentoCard>
        </div>
      </div>

      {/* Network Stats S-Class */}
      <div className="space-y-6">
        <BentoCard title="ACTIVE NODES" subtitle="Neural Global Net">
            <div className="mt-8 space-y-8">
                <div className="text-center">
                    <StatBox label="ELITE AFFILIATES" value="842" color="text-white" />
                    <div className="mt-4">
                        <SmallKPI icon={ArrowUpRight} label="MONTHLY DELTA" value="+12%" trend="UP" color="text-emerald-500" />
                    </div>
                </div>

                <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                    <Users className="text-ear-gold w-8 h-8 opacity-20 mb-4" />
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-relaxed">
                        Desbloquea el nivel <span className="text-ear-gold italic">SYNDICATE</span> al llegar a 1,000 nodos activos.
                    </p>
                    <div className="h-1 w-full bg-white/5 mt-6 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "84.2%" }} className="h-full bg-ear-gold" />
                    </div>
                </div>

                <button className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-ear-gold hover:text-black">
                    Export Global CSV
                </button>
            </div>
        </BentoCard>
      </div>
    </div>
  );
};

export default AffiliatesPanel;
