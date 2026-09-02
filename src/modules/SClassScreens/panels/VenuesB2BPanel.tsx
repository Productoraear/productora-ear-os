"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import dynamic from 'next/dynamic';
import { BentoCard, StatBox, LogEntry, SmallKPI } from '@/modules/SClassScreens/components/SClassUI';

const Building2 = dynamic(() => import('lucide-react').then(m => m.Building2), { ssr: false });
const CreditCard = dynamic(() => import('lucide-react').then(m => m.CreditCard), { ssr: false });
const Percent = dynamic(() => import('lucide-react').then(m => m.Percent), { ssr: false });
const ShieldCheck = dynamic(() => import('lucide-react').then(m => m.ShieldCheck), { ssr: false });
const Globe = dynamic(() => import('lucide-react').then(m => m.Globe), { ssr: false });
const FileText = dynamic(() => import('lucide-react').then(m => m.FileText), { ssr: false });

const VenueSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['ACTIVE', 'PENDING', 'MAINTENANCE']),
  tier: z.string()
});

type Venue = z.infer<typeof VenueSchema>;

export const VenuesB2BPanel = () => {
  const venues: Venue[] = [
    { id: 'VN-M-001', name: 'Sky Lounge Madrid', status: 'ACTIVE', tier: 'Premium Diamond' },
    { id: 'VN-B-042', name: 'Teatro Imperial BCN', status: 'MAINTENANCE', tier: 'High-Class' },
    { id: 'VN-M-088', name: 'Club Trinity Gold', status: 'ACTIVE', tier: 'Elite Alpha' },
    { id: 'VN-V-012', name: 'Palacio Altea', status: 'PENDING', tier: 'Event S-Class' }
  ];

  return (
    <div className="space-y-6 font-montserrat">
      {/* Upper Command Deck */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <BentoCard title="CONTRACTS" subtitle="Active B2B Nodes">
            <div className="mt-8">
                <StatBox label="SECURED DEALS" value="24/30" color="text-white" />
                <div className="mt-4">
                    <SmallKPI label="CAPACITY" value="80%" trend="UP" color="text-gray-500" />
                </div>
            </div>
        </BentoCard>
        
        <BentoCard title="ROI REVENUE" subtitle="30D Royalty Return">
            <div className="mt-8">
                <StatBox label="NET LIQUID" value="€12.8k" color="text-ear-gold" />
                <div className="mt-4">
                    <SmallKPI label="MONTHLY GROWTH" value="+15%" trend="UP" color="text-ear-gold" />
                </div>
            </div>
        </BentoCard>

        {/* Institutional Control Console */}
        <BentoCard title="INSTITUTIONAL HUB" subtitle="B2B Sovereignty Control" className="md:col-span-2">
            <div className="mt-8 flex flex-col justify-between h-full">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-ear-gold" />
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">Global Control Cabin</p>
                </div>
                <div className="flex gap-4 mt-12 pb-4">
                    <button className="flex-1 bg-white/5 border border-white/5 py-5 px-6 rounded-2xl flex items-center justify-between group hover:bg-ear-gold/10 transition-all transition-all">
                        <span className="text-[10px] font-black uppercase text-white/60 group-hover:text-ear-gold tracking-widest">Investment Dossier</span>
                        <FileText className="w-4 h-4 text-white/20 group-hover:text-ear-gold transition-colors" />
                    </button>
                    <button className="flex-1 bg-white/5 border border-white/5 py-5 px-6 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all transition-all">
                        <span className="text-[10px] font-black uppercase text-white/60 tracking-widest">Node Audit</span>
                        <Globe className="w-4 h-4 text-white/20" />
                    </button>
                </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-ear-gold/5 blur-[80px] pointer-events-none" />
        </BentoCard>
      </div>

      {/* Directory Console */}
      <BentoCard title="PREMIUM VENUES" subtitle="Verified Global Network">
        <div className="mt-8 space-y-3">
            {venues.map((venue) => (
                <div key={venue.id} className="flex justify-between items-center p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] group hover:border-ear-gold/30 transition-all">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-[10px] text-white group-hover:bg-ear-gold group-hover:text-black transition-all">
                            {venue.id.split('-').pop()}
                        </div>
                        <div>
                            <p className="text-lg font-black text-white italic leading-none mb-1">{venue.name}</p>
                            <p className="text-[9px] text-ear-gold font-black uppercase tracking-widest leading-none opacity-40">{venue.tier}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                            venue.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                            venue.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                            'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                            {venue.status}
                        </div>
                        <LogEntry 
                            time={venue.id}
                            type={venue.status === 'ACTIVE' ? 'CORE' : venue.status === 'PENDING' ? 'LOCKED' : 'ALERT'}
                            msg="Verified"
                            color={venue.status === 'ACTIVE' ? 'text-emerald-500' : 'text-gray-500'}
                        />
                    </div>
                </div>
            ))}
        </div>
      </BentoCard>
    </div>
  );
};

export default VenuesB2BPanel;
