"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  Target, 
  Zap, 
  Search, 
  Globe, 
  BarChart3, 
  Cpu, 
  CheckCircle2,
  RefreshCw,
  Layout,
  ExternalLink,
  Bot
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// --- TIPOS ---
interface FunnelMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

interface LandingPage {
  id: string;
  title: string;
  url: string;
  persona: string;
  performance: number; // 0-100
  status: 'active' | 'generating' | 'optimizing';
}

// --- COMPONENTES ATÓMICOS ---
const MetricCard = ({ metric }: { metric: FunnelMetric }) => (
  <div className="glass-pane p-4 flex flex-col justify-between border-white/5 bg-white/[0.02]">
    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">{metric.label}</span>
    <div className="flex items-baseline gap-2 mt-1">
      <span className="text-2xl font-black text-white tracking-tighter">{metric.value}</span>
      <span className={`text-[10px] font-bold ${metric.trend === 'up' ? 'text-[#4ade80]' : 'text-red-400'}`}>
        {metric.change}
      </span>
    </div>
  </div>
);

// --- MOTOR DE DEMANDA PRINCIPAL ---
export const DemandEngine = () => {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [landings, setLandings] = useState<LandingPage[]>([
    { id: '1', title: 'Bodas de Lujo Madrid', url: '/madrid/dj-premium', persona: 'Novia de Alto Ticket', performance: 94, status: 'active' },
    { id: '2', title: 'Gala Corporativa Élite', url: '/barcelona/produccion-audiovisual', persona: 'CEO de Tech/SaaS', performance: 88, status: 'active' },
    { id: '3', title: 'Experiencia Finca Bespoke', url: '/toledo/configurador-bespoke', persona: 'Planner Premium', performance: 91, status: 'active' },
  ]);

  const metrics: FunnelMetric[] = [
    { label: 'Costo x Contacto', value: '€42.30', change: '-12%', trend: 'up' },
    { label: 'Tasa de Conversión', value: '8.4%', change: '+2.1%', trend: 'up' },
    { label: 'Presencia Digital', value: '98%', change: 'Autoridad', trend: 'up' },
    { label: 'Impactos x Sem', value: '24', change: '+5', trend: 'up' },
  ];

  const handleIgnition = () => {
    setIsGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGenerating(false);
            setLandings(prevL => [
              { 
                id: Math.random().toString(36).substr(2, 9), 
                title: 'Diseño de Eventos Destino', 
                url: '/ibiza/sonorizacion-eventos', 
                persona: 'Planner Influencer', 
                performance: 0, 
                status: 'active' 
              },
              ...prevL
            ]);
          }, 1000);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-pane p-8 relative overflow-hidden border-white/5"
    >
      {/* DECORACIÓN DE FONDO */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#ecb613]/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR: CONTROL DE MISIÓN */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#ecb613] rounded-lg shadow-lg shadow-[#ecb613]/20">
              <Globe className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter text-white">GESTOR DE IMPACTO</h2>
              <p className="text-[10px] text-white/40 tracking-widest uppercase font-bold">Protocolo Institucional</p>
            </div>
          </div>

          <p className="text-xs text-white/60 leading-relaxed uppercase tracking-wider font-medium">
            El sistema gestiona, optimiza y garantiza la visibilidad de programas de impacto social, 
            asegurando una presencia de alta autoridad en entornos digitales y buscadores.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {metrics.map((m, i) => <MetricCard key={i} metric={m} />)}
          </div>

          <button 
            onClick={handleIgnition}
            disabled={isGenerating}
            className={`w-full py-5 rounded-xl font-black text-[10px] tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-3 ${
              isGenerating 
              ? 'bg-white/5 text-white/40 border border-white/10 cursor-not-allowed' 
              : 'bg-[#ecb613] text-black hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(236,182,19,0.3)] border-none'
            }`}
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {isGenerating ? `OPTIMIZANDO IMPACTO: ${progress}%` : 'ACTUALIZAR PRESENCIA DIGITAL'}
          </button>
        </div>

        {/* PANEL PRINCIPAL: VISUALIZACIÓN DE ACTIVOS */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-white/80 uppercase tracking-widest flex items-center gap-2">
              <Layout className="w-4 h-4 text-[#ecb613]" />
              Nodos de Impacto Activos
            </h3>
            <div className="flex gap-2">
              <div className="px-3 py-1 bg-[#4ade80]/10 border border-[#4ade80]/20 rounded-full flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                <span className="text-[10px] text-[#4ade80] uppercase tracking-tighter font-black">AEO EN VIVO</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode='popLayout'>
              {landings.map((lp, idx) => (
                <motion.div 
                  key={lp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-pane border-white/5 p-5 flex items-center justify-between hover:bg-white/5 transition-all group cursor-pointer"
                  onClick={() => router.push(lp.url)}
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#ecb613]/30 group-hover:bg-[#ecb613]/5 transition-all">
                      <Target className="w-6 h-6 text-white/30 group-hover:text-[#ecb613]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-white tracking-wider group-hover:text-[#ecb613] transition-colors">{lp.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-white/20 font-mono tracking-tighter">{lp.url}</span>
                        <span className="text-[8px] px-2 py-0.5 bg-white/5 text-white/40 rounded border border-white/10 font-black uppercase group-hover:border-[#ecb613]/30 group-hover:text-[#ecb613]">
                          {lp.persona}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-10">
                    <div className="text-right hidden sm:block">
                      <span className="text-[9px] text-white/20 uppercase block font-black">Rendimiento</span>
                      <span className="text-base font-black text-white">{lp.performance}%</span>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#ecb613]/50 transition-all bg-white/[0.02] group-hover:bg-[#ecb613]/10">
                      <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-[#ecb613]" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* MONITOR DE INDEXACIÓN IA */}
          <div className="mt-8 glass-pane bg-white/[0.01] p-8 border-dashed border-white/10 rounded-[2rem]">
            <div className="flex items-center gap-3 mb-6">
              <Bot className="w-6 h-6 text-[#4ade80]" />
              <h3 className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">Monitor de Visibilidad Institucional (IA & Buscadores)</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] uppercase text-white/30 font-black">
                  <span>Knowledge Graph Sync</span>
                  <span className="text-[#4ade80]">98%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '98%' }}
                    className="h-full bg-[#4ade80]"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] uppercase text-white/30 font-black">
                  <span>Semantic Authority</span>
                  <span className="text-[#ecb613]">Élite</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    className="h-full bg-[#ecb613]"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] uppercase text-white/30 font-black">
                  <span>Answer Probability</span>
                  <span className="text-blue-500">Crítica</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '92%' }}
                    className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
