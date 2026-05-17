import React from 'react';
import { AnalyticsSummary } from '@/lib/artists/schema';
import { TrendingUp, Users, Play, Radio } from 'lucide-react';

interface ArtistAnalyticsProps {
  analytics: AnalyticsSummary;
}

export const ArtistAnalytics: React.FC<ArtistAnalyticsProps> = ({ analytics }) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white font-syne">Métricas y Streams</h3>
        <p className="text-white/40 text-xs uppercase tracking-widest font-bold mt-1">Sincronización mensual de DSPs y alcances</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#0b0b0b] border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
          <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-2">Oyentes Mensuales (DSPs)</span>
          <div>
            <span className="text-3xl font-black italic text-white font-mono">{analytics.monthlyListeners.toLocaleString()}</span>
            <span className="text-[10px] font-black text-emerald-400 ml-2">+{analytics.growthRate}%</span>
          </div>
        </div>

        <div className="bg-[#0b0b0b] border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
          <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-2">Total Reproducciones</span>
          <div>
            <span className="text-3xl font-black italic text-white font-mono">{analytics.totalStreams.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-[#0b0b0b] border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
          <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-2">Alcance en Listas de Reproducción</span>
          <div>
            <span className="text-3xl font-black italic text-white font-mono">{analytics.playlistReach.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-[#0b0b0b] border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
          <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-2">Crecimiento Promedio</span>
          <div>
            <span className="text-3xl font-black italic text-white font-mono">+{analytics.growthRate}%</span>
          </div>
        </div>
      </div>

      {/* Dynamic Graph Simulation */}
      <div className="bg-[#0b0b0b] border border-white/5 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ecb613]/5 blur-[90px] rounded-full pointer-events-none" />
        <h4 className="text-sm font-black uppercase tracking-widest text-white/40 mb-8">Tendencia Anual de Streams</h4>
        
        <div className="h-64 flex items-end gap-3 pt-6 border-b border-white/5">
          {[30, 45, 38, 55, 68, 60, 75, 88, 92, 85, 98, 100].map((val, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
              <div 
                className="w-full bg-white/5 group-hover:bg-[#ecb613] rounded-t-lg transition-all" 
                style={{ height: `${val * 1.8}px` }} 
              />
              <span className="text-[8px] font-black uppercase text-white/20 group-hover:text-white transition-colors font-mono">
                {['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][idx]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
