// Ruta: src/app/components/studio/AssetAnalyticsNASA.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, ShieldCheck } from 'lucide-react';

interface MetricProps {
  label: string;
  value: string;
  trend?: string;
  icon: any;
}

const NASAMetric = ({ label, value, trend, icon: Icon }: MetricProps) => (
  <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-white/5 rounded-lg text-[#D4AF37]">
          <Icon size={18} />
        </div>
        {trend && <span className="text-[8px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">{trend}</span>}
      </div>
      <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-white">{value}</p>
    </div>
  </div>
);

export const AssetAnalyticsNASA: React.FC = () => {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h3 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.4em] mb-2">Telemetría de Patrimonio</h3>
          <p className="text-2xl font-['Cinzel'] font-black text-white">Nivel 6: Ingeniería de Riqueza</p>
        </div>
        <Activity size={24} className="text-gray-800" />
      </header>

      <div className="grid grid-cols-2 gap-4">
        <NASAMetric label="Señal de Ingreso" value="$12,450.00" trend="↑ 8.4%" icon={TrendingUp} />
        <NASAMetric label="ROI Anualizado" value="18.2%" icon={ShieldCheck} />
      </div>

      <div className="bg-[#0A0A0A] border border-[#D4AF37]/20 p-8 rounded-[2.5rem] relative overflow-hidden mt-4">
        <div className="absolute top-0 right-0 p-6 opacity-5"><TrendingUp size={120} /></div>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 text-center">Proyección de Valor del Catálogo</p>
        <p className="text-5xl font-black text-white text-center mb-8 tracking-tighter">$450K</p>
        
        <div className="h-32 w-full flex items-end justify-between gap-1 px-2">
          {[40, 70, 45, 90, 65, 80, 55, 95].map((h, i) => (
            <motion.div 
              key={i} 
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.1, duration: 1 }}
              className="flex-1 bg-[#D4AF37] rounded-t-sm opacity-20 hover:opacity-100 transition-opacity"
            />
          ))}
        </div>
        <div className="flex justify-between mt-4 text-[8px] font-bold text-gray-600 uppercase tracking-widest font-mono">
          <span>Q1 2024</span>
          <span>ESTADO: ÓPTIMO</span>
          <span>Q4 2025</span>
        </div>
      </div>
    </div>
  );
};
