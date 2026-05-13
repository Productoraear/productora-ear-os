/**
 * EAR OS GOLD - FENIX v2.0 COMMAND CENTER
 * S-Class Engineering | Silicon Valley Standard
 * 
 * Componente: FenixCommandCenter
 * Estética: Aura Onyx (Obsidian / Gold / Glassmorphism)
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';

// --- Types & Constants ---
interface TelemetryLog {
  operation: string;
  latency: string;
  tokens: number;
  cacheStatus: 'HIT' | 'MISS';
}

const TELEMETRY_DATA: TelemetryLog[] = [
  { operation: 'ASTRA_CHAT', latency: '340ms', tokens: 450, cacheStatus: 'HIT' },
  { operation: 'RAG_QUERY', latency: '12ms', tokens: 0, cacheStatus: 'MISS' },
  { operation: 'SKILL_LOAD', latency: '45ms', tokens: 1200, cacheStatus: 'HIT' },
  { operation: 'ASTRA_CHAT', latency: '210ms', tokens: 320, cacheStatus: 'HIT' },
];

const INDEX_HEALTH = [
  { name: 'Eventos', value: 94 },
  { name: 'Vimume', value: 78 },
  { name: 'Artistas', value: 91 },
  { name: 'Skills', value: 62 },
];

// --- Sub-components ---

const MetricCard = ({ title, value, subtext, icon }: { title: string, value: string, subtext: string, icon: string }) => (
  <motion.div 
    whileHover={{ scale: 1.02, borderColor: 'rgba(242, 202, 80, 0.4)' }}
    className="p-6 bg-[#1C1B1B] border border-transparent transition-all group"
  >
    <div className="flex justify-between items-start mb-4">
      <span className="font-mono text-[0.65rem] tracking-widest text-[#C6C6C6] uppercase">{title}</span>
      <span className="material-symbols-outlined text-[#F2CA50] text-sm">{icon}</span>
    </div>
    <div className="font-serif italic text-4xl text-[#F2CA50] drop-shadow-[0_0_15px_rgba(242, 202, 80, 0.4)]">{value}</div>
    <div className="font-mono text-[0.6rem] text-[#C6C6C6] mt-1 uppercase tracking-tighter">{subtext}</div>
  </motion.div>
);

const FenixCommandCenter: React.FC = () => {
  return (
    <div className="space-y-12 max-w-7xl mx-auto w-full text-[#E5E2E1] font-sans selection:bg-[#F2CA50]/30">
      
      {/* Hero Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Sesiones Neurales" value="342" subtext="Status: Active Link" icon="analytics" />
        <MetricCard title="Pepitas de Oro" value="99+" subtext="Extracción en Curso" icon="database" />
        <MetricCard title="Índices RAG" value="4" subtext="Eventos, Vimume, Artistas, Skills" icon="schema" />
        <MetricCard title="KV-Cache Hit Rate" value="68.4%" subtext="Protocol: Stable" icon="memory" />
      </section>

      {/* Operational View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Telemetry Logs */}
        <section className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-end border-b border-[#4D4635]/20 pb-2">
            <h2 className="font-serif italic text-2xl uppercase tracking-tight text-white">Telemetry Logs</h2>
            <span className="font-mono text-[0.6rem] text-[#F2CA50] tracking-[0.2rem]">LIVE_FEED_01</span>
          </div>
          <div className="overflow-x-auto bg-[#0A0A0A] border border-[#4D4635]/10 rounded-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1C1B1B] font-mono text-[0.65rem] tracking-widest text-[#C6C6C6] uppercase">
                  <th className="px-4 py-3 font-medium">Operation</th>
                  <th className="px-4 py-3 font-medium">Latency</th>
                  <th className="px-4 py-3 font-medium">Tokens</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="font-mono text-[0.75rem] divide-y divide-[#4D4635]/5">
                {TELEMETRY_DATA.map((log, i) => (
                  <tr key={i} className="hover:bg-[#1C1B1B] transition-colors">
                    <td className="px-4 py-4 text-[#F2CA50]">{log.operation}</td>
                    <td className="px-4 py-4 text-[#E5E2E1]">{log.latency}</td>
                    <td className="px-4 py-4 text-[#E5E2E1]">{log.tokens}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 text-[0.6rem] border ${
                        log.cacheStatus === 'HIT' 
                          ? 'bg-[#F2CA50]/10 text-[#F2CA50] border-[#F2CA50]/30' 
                          : 'bg-red-500/10 text-red-400 border-red-500/30'
                      }`}>
                        {log.cacheStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* RAG Index Health */}
        <section className="lg:col-span-4 space-y-6">
          <div className="flex justify-between items-end border-b border-[#4D4635]/20 pb-2">
            <h2 className="font-serif italic text-2xl uppercase tracking-tight text-white">Index Health</h2>
            <span className="material-symbols-outlined text-[#C6C6C6]">query_stats</span>
          </div>
          <div className="space-y-6">
            {INDEX_HEALTH.map((index) => (
              <div key={index.name} className="space-y-2">
                <div className="flex justify-between font-mono text-[0.65rem] tracking-widest text-[#C6C6C6] uppercase">
                  <span>{index.name}</span>
                  <span>{index.value}%</span>
                </div>
                <div className="h-1 w-full bg-[#1C1B1B] overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${index.value}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-[#F2CA50]"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-[#0A0A0A] border border-[#4D4635]/10 border-l-2 border-l-[#F2CA50] italic">
            <p className="font-mono text-[0.7rem] text-[#C6C6C6] leading-relaxed">
              Integration threshold reached for all active neural sectors. ASTRA is currently processing RAG background optimization.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FenixCommandCenter;
