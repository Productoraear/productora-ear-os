"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { z } from 'zod';
import dynamic from 'next/dynamic';
import { BentoCard, StatBox, LogEntry, SmallKPI } from '@/modules/SClassScreens/components/SClassUI';

const ShoppingBag = dynamic(() => import('lucide-react').then(m => m.ShoppingBag), { ssr: false });
const Send = dynamic(() => import('lucide-react').then(m => m.Send), { ssr: false });
const Award = dynamic(() => import('lucide-react').then(m => m.Award), { ssr: false });
const Clock = dynamic(() => import('lucide-react').then(m => m.Clock), { ssr: false });
const Zap = dynamic(() => import('lucide-react').then(m => m.Zap), { ssr: false });

const CheckoutSchema = z.object({
  id: z.string(),
  email: z.string().email().default('no-email@ear.pro'),
  value: z.number().default(0),
  timestamp: z.any().optional()
});

const LoyaltySchema = z.object({
  id: z.string(),
  user: z.string().default('Unknown Fan'),
  xp: z.number().default(0),
  reason: z.string().default('Interaction')
});

type AbandonedCheckout = z.infer<typeof CheckoutSchema>;
type LoyaltyLog = z.infer<typeof LoyaltySchema>;

export const CRMPanel = () => {
  const [abandoned, setAbandoned] = useState<AbandonedCheckout[]>([]);
  const [loyalty, setLoyalty] = useState<LoyaltyLog[]>([]);

  useEffect(() => {
    const unsubA = onSnapshot(collection(db, 'ear_abandoned_checkouts'), (snap) => {
      setAbandoned(snap.docs.map(doc => {
        try {
          return CheckoutSchema.parse({ id: doc.id, ...doc.data() });
        } catch (e) {
            const data = doc.data();
            return { id: doc.id, email: data.email || 'error@parse.com', value: Number(data.value) || 0 } as AbandonedCheckout;
        }
      }));
    });

    const unsubL = onSnapshot(collection(db, 'ear_loyalty_logs'), (snap) => {
      setLoyalty(snap.docs.map(doc => {
        try {
          return LoyaltySchema.parse({ id: doc.id, ...doc.data() });
        } catch (e) {
          return { id: doc.id, user: 'Parsing Error', xp: 0, reason: 'Invalid Format' } as LoyaltyLog;
        }
      }));
    });

    return () => { unsubA(); unsubL(); };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 font-montserrat">
      {/* Recovery Hub */}
      <BentoCard title="RECOVERY MATRIX" subtitle="Leads Extraction" className="lg:col-span-3">
        <div className="mt-8 flex items-center justify-between p-6 bg-ear-gold/5 rounded-3xl border border-ear-gold/10 mb-6">
            <div className="flex items-center gap-4">
                <ShoppingBag className="text-ear-gold w-6 h-6" />
                <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Net Potential Recovery</p>
            </div>
            <p className="text-3xl font-black text-ear-gold italic tracking-tighter">€5,412</p>
        </div>
        
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-4 scrollbar-hide">
            {abandoned.length > 0 ? abandoned.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-5 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-ear-gold/30 transition-all">
                    <div>
                        <p className="text-sm font-bold text-white group-hover:text-ear-gold transition-colors">{item.email}</p>
                        <p className="text-[9px] text-white/20 font-mono tracking-tighter mt-1 italic uppercase">ID: {item.id.slice(0, 10)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-black text-white italic tracking-tighter leading-none">€{item.value.toLocaleString()}</p>
                        <div className="flex items-center justify-end gap-1 mt-2 text-amber-500">
                            <Clock className="w-2.5 h-2.5 animate-pulse" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Pending</span>
                        </div>
                    </div>
                </div>
            )) : (
                <div className="py-20 text-center text-white/5 uppercase tracking-[0.5em] text-[10px] font-black">
                    Awaiting Target Interception...
                </div>
            )}
        </div>
      </BentoCard>

      {/* Automata & Loyalty */}
      <div className="lg:col-span-2 space-y-6">
        <BentoCard title="EMAIL AUTOMATA" subtitle="Behavioral Triggers">
            <div className="mt-8 space-y-3">
                {[
                    { type: 'Cart Recovery #1', status: 'SENT', time: '2m', color: 'text-emerald-500' },
                    { type: 'Retention N1', status: 'WAIT', time: '1h', color: 'text-ear-gold' },
                    { type: 'Order Fail Notify', status: 'SENT', time: '4h', color: 'text-emerald-500' }
                ].map((mail, i) => (
                    <LogEntry 
                        key={i}
                        time={mail.time}
                        type={mail.status === 'SENT' ? 'CORE' : 'LOCKED'}
                        msg={mail.type}
                        color={mail.color}
                    />
                ))}
            </div>
        </BentoCard>

        <BentoCard title="LOYALTY STREAM" subtitle="Engagement Rewards">
            <div className="mt-8 space-y-4">
                {loyalty.length > 0 ? loyalty.map((log, i) => (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={log.id} 
                        className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5"
                    >
                        <div className="w-10 h-10 rounded-xl bg-ear-gold/10 border border-ear-gold/20 flex items-center justify-center text-ear-gold font-black text-xs">
                            +{log.xp}
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-white leading-none mb-1">{log.user}</p>
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">{log.reason}</p>
                        </div>
                    </motion.div>
                )) : (
                    <div className="py-12 text-center text-white/5 flex flex-col items-center gap-3">
                        <Award className="w-8 h-8 opacity-20" />
                        <span className="text-[9px] font-black uppercase tracking-widest">No XP Transmissions</span>
                    </div>
                )}
            </div>
        </BentoCard>
      </div>
    </div>
  );
};

export default CRMPanel;
