'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, MapPin, Radio, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';

interface LiveCommandCenterProps {
  tourId: string;
}

export const LiveCommandCenter: React.FC<LiveCommandCenterProps> = ({ tourId }) => {
  const [status, setStatus] = useState({
    phase: 'EN_RUTA',
    speed: 92,
    estimatedArrival: '19:45 CET',
    progress: 68,
    currentLocation: { lat: 40.4168, lng: -3.7038 },
    anomalies: [] as string[],
    lastPing: new Date()
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        lastPing: new Date(),
        speed: 88 + Math.floor(Math.random() * 10)
      }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const getPhaseColor = () => {
    switch (status.phase) {
      case 'EN_RUTA': return 'text-blue-500';
      case 'SOUNDCHECK': return 'text-yellow-500';
      case 'LIVE': return 'text-green-500';
      case 'EXTRACTION': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="bg-[#050505] p-6 rounded-3xl border border-white/5 flex flex-col gap-8">
      {/* Header Logístico */}
      <div className="flex justify-between items-center border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#d4a855]/10 rounded-xl flex items-center justify-center">
            <Radio className="text-[#d4a855] animate-pulse" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Pantalla NASA</h2>
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40">Telemetría de Gira: {tourId}</span>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 ${getPhaseColor()} bg-white/[0.02]`}>
          <div className="w-2 h-2 rounded-full bg-current animate-ping" />
          <span className="text-[10px] font-black tracking-widest uppercase">{status.phase}</span>
        </div>
      </div>

      {/* Grid de Sensores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Velocidad / ETA */}
        <div className="bg-white/[0.02] p-6 rounded-2xl flex items-center gap-4 border border-white/5">
          <Zap className="text-blue-500" size={32} />
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Velocidad de Convoy</div>
            <div className="text-2xl font-black text-white">{status.speed} <span className="text-sm text-white/30">KM/H</span></div>
          </div>
        </div>

        {/* ETA */}
        <div className="bg-white/[0.02] p-6 rounded-2xl flex items-center gap-4 border border-white/5">
          <Clock className="text-[#d4a855]" size={32} />
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">ETA Objetivo</div>
            <div className="text-2xl font-black text-[#d4a855]">{status.estimatedArrival}</div>
          </div>
        </div>

        {/* Progreso */}
        <div className="bg-white/[0.02] p-6 rounded-2xl flex items-center gap-4 border border-white/5 relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-green-500/10 transition-all duration-1000" 
            style={{ width: `${status.progress}%` }}
          />
          <Activity className="text-green-500 relative z-10" size={32} />
          <div className="relative z-10">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Completado</div>
            <div className="text-2xl font-black text-green-500">{status.progress}%</div>
          </div>
        </div>
      </div>

      {/* Mapa Táctico Simulado */}
      <div className="h-64 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-center relative overflow-hidden group">
        <div className="flex flex-col items-center gap-4 z-10">
          <MapPin size={48} className="text-[#d4a855] animate-bounce" />
          <div className="text-center">
            <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#d4a855]">Coordenadas Activas</span>
            <span className="block text-sm font-mono text-white/60">LAT: {status.currentLocation.lat.toFixed(4)} | LNG: {status.currentLocation.lng.toFixed(4)}</span>
          </div>
        </div>
        
        {/* Radar Scanner Line */}
        <motion.div 
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-[#d4a855]/20 to-transparent skew-x-12"
        />
      </div>

      {/* Anomalías y Logs */}
      <div className="bg-black/50 rounded-2xl p-6 border border-white/5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={16} className={status.anomalies.length > 0 ? 'text-red-500' : 'text-green-500'} />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Registro Forense</span>
        </div>
        
        {status.anomalies.length === 0 ? (
          <div className="flex items-center gap-2 text-green-500/60 text-xs font-mono">
            <CheckCircle size={14} /> Sistema Operando en Parámetros S-Class. Último ping: {status.lastPing.toLocaleTimeString()}
          </div>
        ) : (
          <div className="space-y-2">
            {status.anomalies.map((anom, i) => (
              <div key={i} className="text-red-400 text-xs font-mono flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {anom}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
