/**
 * 📈 CLOSING ANALYTICS - S-CLASS CONVERSION TRACKING
 * Purpose: Visualize lead conversion funnel from generated to pre-closed.
 */

"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, TrendingUp, DollarSign, Target, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export const ClosingAnalytics: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from('dossier_proposals')
        .select('channel, status, priority_score, created_at');

      if (!error && data) {
        // Agregación simple
        const total = data.length;
        const approved = data.filter((d: any) => d.status === 'pre-closed').length;
        const conversionRate = total > 0 ? (approved / total) * 100 : 0;
        
        const byChannel = data.reduce((acc: any, curr: any) => {
          acc[curr.channel] = (acc[curr.channel] || 0) + 1;
          return acc;
        }, {});

        setStats({ total, approved, conversionRate, byChannel });
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading || !stats) return null;

  return (
    <div className="space-y-10 pt-12 border-t border-white/5">
      <h2 className="text-2xl font-black uppercase italic tracking-widest flex items-center gap-4">
        <PieChart className="text-[#d4a855]" /> Embudo de <span className="text-white/20">Cierre</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* KPI: CONVERSION RATE */}
        <div className="glass-panel p-10 rounded-[3rem] border-[#10b981]/20">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Conversion Rate</span>
            <CheckCircle2 className="text-[#10b981]" size={20} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-white">{stats.conversionRate.toFixed(1)}</span>
            <span className="text-xl font-black text-[#10b981]">%</span>
          </div>
          <div className="mt-6 w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${stats.conversionRate}%` }}
              className="h-full bg-[#10b981]"
            />
          </div>
        </div>

        {/* KPI: PIPELINE VOLUME */}
        <div className="glass-panel p-10 rounded-[3rem] border-[#3b82f6]/20">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Pipeline Volume</span>
            <Target className="text-[#3b82f6]" size={20} />
          </div>
          <span className="text-5xl font-black text-white">{stats.total}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 ml-4">Dossiers</span>
        </div>

        {/* KPI: CHANNEL MIX */}
        <div className="glass-panel p-10 rounded-[3rem]">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-8 block">Channel Distribution</span>
          <div className="space-y-4">
            {Object.entries(stats.byChannel).map(([channel, count]: any, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{channel}</span>
                <span className="text-xs font-black text-[#d4a855]">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
