"use client";

import React from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { BentoCard, StatBox, LogEntry, SmallKPI } from '@/modules/SClassScreens/components/SClassUI';

const Globe = dynamic(() => import('lucide-react').then(m => m.Globe), { ssr: false });
const Search = dynamic(() => import('lucide-react').then(m => m.Search), { ssr: false });
const Zap = dynamic(() => import('lucide-react').then(m => m.Zap), { ssr: false });

export const UrlIndexPanel = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-montserrat">
      {/* Search Console Integration / Indexing Hub */}
      <div className="lg:col-span-3 space-y-6">
        <BentoCard title="CENTRO SEO VAMPIRO" subtitle="Indexación Masiva y Dominancia de Búsqueda">
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 bg-black/40 border border-white/5 rounded-3xl text-center group hover:border-ear-gold/30 transition-all">
                    <StatBox label="URLS INDEXADAS" value="15.2k" color="text-white" />
                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-2 animate-pulse">En vivo desde Google Nexus</p>
                </div>
                <div className="p-8 bg-black/20 border border-white/5 rounded-3xl text-center">
                    <StatBox label="IMPRESIONES DE BÚSQUEDA" value="1.2M" color="text-ear-gold" />
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-2">Telemetría 24h</p>
                </div>
                <div className="p-8 bg-black/20 border border-white/5 rounded-3xl text-center">
                    <StatBox label="CTR ALFA" value="8.4%" color="text-white" />
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-2 leading-relaxed italic">Métrica de Inevitabilidad Matemática</p>
                </div>
            </div>

            <div className="mt-8 space-y-4">
                <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-6 pl-2 flex items-center gap-3">
                    <Zap className="w-4 h-4 text-ear-gold" />
                    Nodos de Ingestión Pendientes
                </h4>
                {[
                    { node: '/events/wedding-madrid-2026', priority: 'ALFA', status: 'RASTREANDO' },
                    { node: '/artists/dj-vault-series', priority: 'BETA', status: 'VALIDADO' },
                    { node: '/venues/toledo-office-v1', priority: 'ALFA', status: 'INDEXANDO' }
                ].map((n, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all">
                        <div className="flex items-center gap-4">
                            <SmallKPI label="PRIORIDAD" value={n.priority} color={n.priority === 'ALFA' ? 'text-ear-gold' : 'text-white/40'} />
                            <span className="text-sm font-black text-white italic lowercase tracking-tight">https://productora-ear.web.app{n.node}</span>
                        </div>
                        <span className="text-[9px] font-black px-4 py-1.5 bg-black/40 border border-white/10 rounded-full text-white/60 tracking-widest uppercase italic">
                            {n.status}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 flex gap-4">
                <button className="flex-1 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-ear-gold transition-all shadow-lg italic">Forzar Regeneración de Sitemap</button>
                <button className="flex-1 py-4 bg-white/5 border border-white/5 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-white/10 transition-all text-white/40 italic">Auditoría de Fugas 404</button>
            </div>
        </BentoCard>
      </div>

      {/* Global Metadata Segment */}
      <div className="space-y-6">
        <BentoCard title="SALUD DEL DOMINIO" subtitle="Puntuación SEO Soberana">
            <div className="mt-8 space-y-8">
                <div className="flex justify-center relative">
                    <Globe className="w-32 h-32 text-ear-gold opacity-10 animate-spin-slow rotate-12" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-6xl font-black italic text-white tracking-widest">98</p>
                    </div>
                </div>
                <div className="text-center pt-4">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-2 leading-relaxed">Performance, Accessibility, Best Practices, SEO</p>
                    <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "98%" }} className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
                    </div>
                </div>
            </div>
        </BentoCard>

        <BentoCard title="LOGS DE INGESTIÓN" subtitle="Pulso de Sincronización Vampiro">
            <div className="mt-6 space-y-4">
                <LogEntry time="15:02" type="DATA" msg="Sincronizando Metadatos de Maps API" color="text-white/40" />
                <LogEntry time="14:55" type="CORE" msg="Protocolo de Identidad SSL OK" color="text-emerald-500" />
                <LogEntry time="14:30" type="LOCK" msg="Intercepción de Bots: 42 Evitados" color="text-ear-gold" />
                <LogEntry time="12:00" type="DATA" msg="Sitemap Semanal Enviado a GSC" color="text-emerald-500" />
            </div>
        </BentoCard>
      </div>
    </div>
  );
};

export default UrlIndexPanel;
