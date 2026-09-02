
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Truck, MapPin, BarChart3, Clock, CheckCircle2 } from 'lucide-react';
import { logisticsService, LogisticsFleet } from '@/services/logisticsService';

export const LogisticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState(logisticsService.getDeploymentStatus('event_current'));
  const [fleet, setFleet] = useState<LogisticsFleet[]>([
    { id: 'FL-01', type: 'TECHNICAL_TEAM', status: 'ON_ROUTE', location: { lat: 40.4168, lng: -3.7038 } },
    { id: 'FL-02', type: 'ARTIST_TRANSPORT', status: 'ON_SITE', location: { lat: 40.4168, lng: -3.7038 } },
    { id: 'FL-03', type: 'CATERING', status: 'IDLE', location: { lat: 0, lng: 0 } },
  ]);

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'EFICIENCIA TÁCTICA', value: `${metrics.efficiency}%`, icon: Zap, color: 'text-blue-500' },
          { label: 'PUNTUALIDAD EAR', value: `${metrics.punctuality}%`, icon: Clock, color: 'text-green-500' },
          { label: 'READINESS', value: `${metrics.readiness}%`, icon: BarChart3, color: 'text-gold-500' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/[0.03] border border-white/5 p-4 rounded-xl flex items-center justify-between"
          >
            <div>
              <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">{item.label}</p>
              <p className="text-xl font-black text-white mt-1">{item.value}</p>
            </div>
            <item.icon className={item.color} size={20} />
          </motion.div>
        ))}
      </div>

      <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl p-6 overflow-y-auto space-y-4">
        <h3 className="text-xs font-bold text-white/60 flex items-center gap-2 mb-4 uppercase tracking-widest">
          <Truck size={14} className="text-blue-500" /> Estado de Flota (Uber Style)
        </h3>
        
        {fleet.map((unit, i) => (
          <motion.div
            key={unit.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-xl hover:border-gold-500/20 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${unit.status === 'ON_ROUTE' ? 'bg-blue-500/20 text-blue-500 animate-pulse' : 'bg-green-500/20 text-green-500'}`}>
                <Truck size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">{unit.id} // {unit.type}</p>
                <p className="text-[10px] text-white/40 font-medium uppercase">{unit.status} - Localización Madrid-01</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-gold-500 font-bold tracking-tighter">OPTIMIZADO</span>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 bg-blue-600/20 border border-blue-500/30 rounded-xl text-[11px] font-black text-blue-400 uppercase tracking-[0.3em] hover:bg-blue-600/30 transition-all flex items-center justify-center gap-3"
      >
        <MapPin size={14} /> Lanzar Despliegue Automático
      </motion.button>
    </div>
  );
};
