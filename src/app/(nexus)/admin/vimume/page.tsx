'use client';

import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Heart, Sparkles, RefreshCw, FileText, Play, Users } from 'lucide-react';

export default function AdminVimumePage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'metrics'>('overview');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-neutral-950 text-amber-500 flex items-center justify-center font-mono text-xs">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>CARGANDO PROTOCOLO VIMUME S-CLASS...</span>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className="min-h-screen bg-neutral-950 text-white p-6 font-sans">
      {/* CABECERA DE MÓDULO */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-neutral-800 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                REACTOR VIMUME <span className="text-xs font-mono bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">MUSICOTERAPIA SENIOR</span>
              </h1>
              <p className="text-xs text-neutral-400 mt-0.5">
                Plataforma de Estimulación Sensorial, Protocolos Institucionales y B2G
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> ESTADO: PRE-LANZAMIENTO · NO DESPLEGADO EN CALLE
          </span>
        </div>
      </header>

      {/* METRICAS DE IMPACTO VIMUME */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl">
          <div className="text-[10px] font-mono text-neutral-500 uppercase mb-1">Sesiones Impartidas</div>
          <div className="text-2xl font-black text-white">0</div>
          <div className="text-[10px] text-amber-400 mt-1">Fase Pre-Operativa / En Homologación</div>
        </div>

        <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl">
          <div className="text-[10px] font-mono text-neutral-500 uppercase mb-1">Impacto Beneficiarios</div>
          <div className="text-2xl font-black text-white">0</div>
          <div className="text-[10px] text-neutral-400 mt-1">Pendiente de Despliegue en Calle</div>
        </div>

        <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl">
          <div className="text-[10px] font-mono text-neutral-500 uppercase mb-1">Fondo VIMUME (10%)</div>
          <div className="text-2xl font-black text-amber-400">0 €</div>
          <div className="text-[10px] text-neutral-500 mt-1">Sin Ventas Imputadas Aún</div>
        </div>

        <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl">
          <div className="text-[10px] font-mono text-neutral-500 uppercase mb-1">Dossiers B2G Adjudicables</div>
          <div className="text-2xl font-black text-white">14</div>
          <div className="text-[10px] text-emerald-400 mt-1">Catálogo Homologado Art. 118 LCSP</div>
        </div>
      </div>

      {/* PANEL DE CONTROL DE SESIONES Y HERRAMIENTAS */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-8 bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Matriz de Protocolos de Estimulación Musical
          </h2>

          <div className="space-y-3">
            <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-white">Protocolo 01 — Evocación Sonora Emocional</div>
                <div className="text-[10px] text-neutral-500">Repertorio Bolero / Ranchera con estimulación cognitiva de memoria a largo plazo.</div>
              </div>
              <button className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-black rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer">
                <Play className="w-3 h-3" /> Ejecutar
              </button>
            </div>

            <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-white">Protocolo 02 — Ritmatoria Sensoriomotriz Senior</div>
                <div className="text-[10px] text-neutral-500">Ejercicios de movilidad asistida mediante percusión suave y acompañamiento en vivo.</div>
              </div>
              <button className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-black rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer">
                <Play className="w-3 h-3" /> Ejecutar
              </button>
            </div>
          </div>
        </section>

        <aside className="lg:col-span-4 bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            Generador B2G Art. 118
          </h2>

          <p className="text-xs text-neutral-400 mb-4">
            Emisión de memorias justificativas para contratos menores de servicios culturales en Ayuntamientos.
          </p>

          <button className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer">
            + Exportar Dossier Institucional (PDF)
          </button>
        </aside>
      </main>
    </div>
  );
}
