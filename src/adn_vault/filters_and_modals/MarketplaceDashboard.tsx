/**
 * 📊 MARKETPLACE DASHBOARD - S-CLASS ANALYTICS
 * Purpose: Visualize intention signals and detect market opportunities.
 */

"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Map, Briefcase, Zap, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export const MarketplaceDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchAnalytics = async () => {
      const { data, error } = await supabase
        .from('marketplace_analytics_summary')
        .select('*');

      if (!error && data) {
        setAnalytics(data);
      }
      setLoading(false);
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-20 text-center animate-pulse">Analizando señales del mercado...</div>;

  return (
    <div className="space-y-12">
      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Intenciones" 
          val={analytics.reduce((acc, curr) => acc + curr.total_events, 0)} 
          icon={Zap} 
          color="#d4a855" 
        />
        <StatCard 
          title="Sesiones Únicas" 
          val={analytics.reduce((acc, curr) => acc + curr.unique_sessions, 0)} 
          icon={TrendingUp} 
          color="#10b981" 
        />
        <StatCard 
          title="Top Ocasión" 
          val={analytics.find(a => a.type === 'search_submitted')?.occasion || 'N/A'} 
          icon={Briefcase} 
          color="#3b82f6" 
        />
        <StatCard 
          title="Provincia Hot" 
          val={analytics.find(a => a.type === 'search_submitted')?.province || 'N/A'} 
          icon={Map} 
          color="#ef4444" 
        />
      </div>

      {/* INSIGHTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="glass-panel p-10 rounded-[3rem]">
          <h3 className="text-xl font-black uppercase tracking-widest mb-8 flex items-center gap-4">
            <BarChart3 className="text-[#d4a855]" /> Rendimiento por Occasión
          </h3>
          <div className="space-y-6">
            {analytics
              .filter(a => a.type === 'search_submitted')
              .slice(0, 5)
              .map((a, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                    {a.occasion || 'Sin definir'}
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(a.total_events / 100) * 100}%` }}
                        className="h-full bg-[#d4a855]"
                      />
                    </div>
                    <span className="text-[10px] font-black text-[#d4a855]">{a.total_events}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="glass-panel p-10 rounded-[3rem] border-red-500/10">
          <h3 className="text-xl font-black uppercase tracking-widest mb-8 flex items-center gap-4">
            <AlertCircle className="text-red-500" /> Hubs Huérfanos Detectados
          </h3>
          <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-8 leading-relaxed">
            Rutas con impresiones pero 0 conversiones. Requieren ajuste quirúrgico de copy o trust signals.
          </p>
          <div className="space-y-4">
            {analytics
              .filter(a => a.type === 'card_impression' && !analytics.some(b => b.service_id === a.service_id && b.type === 'card_clicked'))
              .slice(0, 3)
              .map((a, i) => (
                <div key={i} className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl flex items-center justify-between">
                  <span className="text-[10px] font-black text-red-400">{a.service_id}</span>
                  <span className="text-[8px] font-black uppercase tracking-tighter text-white/20">Impresiones: {a.total_events}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, val, icon: Icon, color }: any) => (
  <div className="glass-panel p-8 rounded-3xl border-white/5 relative overflow-hidden group">
    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon size={80} color={color} />
    </div>
    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-2 block">{title}</span>
    <span className="text-2xl font-black text-white">{val}</span>
  </div>
);
