"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { z } from 'zod';
import dynamic from 'next/dynamic';
import { BentoCard, StatBox, LogEntry, SmallKPI } from '@/modules/SClassScreens/components/SClassUI';

const TrendingUp = dynamic(() => import('lucide-react').then(m => m.TrendingUp), { ssr: false });
const MousePointer2 = dynamic(() => import('lucide-react').then(m => m.MousePointer2), { ssr: false });
const ShoppingCart = dynamic(() => import('lucide-react').then(m => m.ShoppingCart), { ssr: false });
const Zap = dynamic(() => import('lucide-react').then(m => m.Zap), { ssr: false });
const Eye = dynamic(() => import('lucide-react').then(m => m.Eye), { ssr: false });
const Activity = dynamic(() => import('lucide-react').then(m => m.Activity), { ssr: false });

const EventSchema = z.object({
  id: z.string(),
  type: z.string().default('VISIT'),
  user_id: z.string().optional().default('Anonymous'),
  path: z.string().optional().default('/'),
  timestamp: z.any().optional()
});

type UserEvent = z.infer<typeof EventSchema>;

export const CROPanel = () => {
  const [events, setEvents] = useState<UserEvent[]>([]);
  const stats = { visits: 12482, checkout: 1452, paid: 384 };

  useEffect(() => {
    const q = query(collection(db, 'user_events'), orderBy('timestamp', 'desc'), limit(15));
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => {
        try {
          return EventSchema.parse({ id: doc.id, ...doc.data() });
        } catch (e) {
          return { id: doc.id, type: 'UNKNOWN', user_id: 'Error', path: '/' } as UserEvent;
        }
      });
      setEvents(data);
    }, (err) => {
      console.warn('⚠️ [CROPanel] Firestore fallback activo:', err.message);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6 font-montserrat">
      {/* Conversion Funnel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BentoCard title="VISITS" subtitle="Top Funnel Volume">
          <div className="mt-8">
            <StatBox label="TOTAL SESSIONS" value={stats.visits.toLocaleString()} color="text-white" />
            <div className="mt-4">
              <SmallKPI icon={Activity} label="CONV. RATE" value="100%" trend="UP" color="text-gray-500" />
            </div>
          </div>
        </BentoCard>
        <BentoCard title="CHECKOUTS" subtitle="Intent Indicators">
          <div className="mt-8">
            <StatBox label="ACTIVE CARTS" value={stats.checkout.toLocaleString()} color="text-ear-gold" />
            <div className="mt-4">
              <SmallKPI icon={MousePointer2} label="DROP OFF" value="88.3%" trend="DOWN" color="text-ear-gold" />
            </div>
          </div>
        </BentoCard>
        <BentoCard title="SALES" subtitle="Net Liquidity">
          <div className="mt-8">
            <StatBox label="CONVERSIONS" value={stats.paid.toLocaleString()} color="text-emerald-500" />
            <div className="mt-4">
              <SmallKPI icon={TrendingUp} label="ARPU" value="€24.2" trend="UP" color="text-emerald-500" />
            </div>
          </div>
        </BentoCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* A/B Testing Matrix */}
        <BentoCard title="BETA TESTS" subtitle="Matrix Optimization" className="lg:col-span-1">
          <div className="mt-8 space-y-4">
            <div className="p-5 bg-black/40 rounded-3xl border border-white/5 group cursor-pointer hover:border-ear-gold/20 transition-all">
              <div className="flex justify-between mb-2">
                <p className="text-[9px] font-black uppercase text-white/40">Checkout 2.4</p>
                <Zap className="w-3 h-3 text-ear-gold animate-pulse" />
              </div>
              <p className="text-xl font-black text-white italic">+14.2%</p>
              <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Winning Variation</p>
            </div>
            <button className="w-full py-4 rounded-2xl bg-ear-gold text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
              Deploy Rollout
            </button>
          </div>
        </BentoCard>

        {/* Behavioral Feed */}
        <BentoCard title="LIVE ENGINE FEED" subtitle="Global Ingestion Stream" className="lg:col-span-3">
          <div className="mt-6 h-[400px] overflow-y-auto pr-4 scrollbar-hide">
            <div className="space-y-2">
              {events.length > 0 ? events.map((ev) => (
                <LogEntry
                  key={ev.id}
                  time={ev.type}
                  type={ev.type === 'PURCHASE' ? 'ALERT' : ev.type === 'CHECKOUT' ? 'CORE' : 'UNKNOWN'}
                  msg={`${ev.user_id.slice(0, 12)} -> ${ev.path}`}
                  color={ev.type === 'PURCHASE' ? 'text-emerald-500' : ev.type === 'CHECKOUT' ? 'text-ear-gold' : 'text-gray-500'}
                />
              )) : (
                <div className="py-20 text-center text-white/10 uppercase tracking-[0.5em] text-[10px] font-black">
                  Synchronizing VIMUME Stream...
                </div>
              )}
            </div>
          </div>
        </BentoCard>
      </div>
    </div>
  );
};

export default CROPanel;
