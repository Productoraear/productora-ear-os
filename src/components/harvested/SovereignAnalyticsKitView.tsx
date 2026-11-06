'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Volume2,
  Users,
  DollarSign,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { LIMITE_SPL_DB } from '@/lib/constants/ear-os-ssot';

export function SovereignAnalyticsKitView() {
  const [selectedPeriod, setSelectedPeriod] = useState<'30d' | '90d' | '1y'>('30d');

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Tarjetas KPI (KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Conversión de Fianza</span>
            <span className="text-emerald-400 flex items-center gap-1 font-bold">
              <TrendingUp className="w-3.5 h-3.5" /> +14.2%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-white">96.4%</div>
          <p className="text-[11px] text-zinc-500 font-mono">100 € Price-Lock vs Fugas</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Presión Media SPL</span>
            <span className="text-cyan-400 font-mono text-[11px]">Ley 37/2003</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-cyan-400">71.8 dBA</div>
          <p className="text-[11px] text-zinc-500 font-mono">Límite: &lt; {LIMITE_SPL_DB} dB SPL</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>SROI Social Certificado</span>
            <span className="text-emerald-400 flex items-center gap-1 font-bold">
              <TrendingUp className="w-3.5 h-3.5" /> 4.85x
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-[#ecb613]">4.85 : 1 €</div>
          <p className="text-[11px] text-zinc-500 font-mono">VIMUME Impacto Senior</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Retención del Lead</span>
            <span className="text-emerald-400 font-mono text-[11px]">0% Fuga Externa</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-white">100%</div>
          <p className="text-[11px] text-zinc-500 font-mono">Tráfico Propio en Finca</p>
        </div>
      </div>

      {/* 2. Gráfico de Área SPL & Gráfico de Barras SROI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Área (Presión Sonora a lo largo del Evento) */}
        <div className="p-6 rounded-3xl bg-zinc-950/80 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-display">Presión Acústica en Directo</h3>
              <p className="text-xs text-zinc-400 font-mono">Evolución en dBA por etapas del banquete</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-[10px]">
              Hardware Bose F1
            </span>
          </div>

          <div className="h-44 flex items-end gap-2 pt-6">
            {[
              { label: 'Recepción', dba: 62 },
              { label: 'Ceremonia', dba: 68 },
              { label: 'Cóctel', dba: 71 },
              { label: 'Banquete', dba: 74 },
              { label: 'Solista', dba: 78 },
              { label: 'Baile Ext.', dba: 74.8 },
            ].map((step, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-mono text-cyan-300 font-bold">{step.dba}</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-cyan-950 to-cyan-400 transition-all duration-500 hover:brightness-125"
                  style={{ height: `${(step.dba / 85) * 100}%` }}
                />
                <span className="text-[9px] font-mono text-zinc-500 truncate w-full text-center">
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico de Anillo Donut (Reparto Soberano 80/10/10) */}
        <div className="p-6 rounded-3xl bg-zinc-950/80 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-display">Split Soberano Inmutable</h3>
              <p className="text-xs text-zinc-400 font-mono">Reparto exacto sin comisiones de intermediario</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#ecb613] font-mono text-[10px]">
              SSOT S-Class
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-zinc-900 border border-emerald-500/30 text-center">
              <div className="text-2xl font-black text-emerald-400 font-mono">80%</div>
              <div className="text-xs font-bold text-white mt-1">Artista Ejecutor</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Edwin Agudelo</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-cyan-500/30 text-center">
              <div className="text-2xl font-black text-cyan-400 font-mono">10%</div>
              <div className="text-xs font-bold text-white mt-1">EAR OS Servidor</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Infraestructura</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-purple-500/30 text-center">
              <div className="text-2xl font-black text-purple-400 font-mono">10%</div>
              <div className="text-xs font-bold text-white mt-1">VIMUME Social</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Terapia 40 Hz</div>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 font-sans leading-relaxed pt-2">
            A diferencia de los portales de anuncios que cobran suscripciones a ciegas, cada euro que entra por EAR OS se reparte con transparencia matemática e inmutabilidad garantizada.
          </p>
        </div>
      </div>

      {/* 3. Embudo de Conversión & Mapa de Calor */}
      <div className="p-6 rounded-3xl bg-zinc-950/80 border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white font-display">Embudo de Reserva Inmediata (Funnel Chart)</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            { step: '01. Visita Finca / Landings', count: '4.341 visitas', width: '100%', color: 'bg-zinc-700' },
            { step: '02. Selector 10 Casillas', count: '1.280 packs', width: '75%', color: 'bg-amber-600' },
            { step: '03. Fecha Atómica Bloqueada', count: '320 citas', width: '45%', color: 'bg-amber-500' },
            { step: '04. Depósito 100 € Stripe', count: '100% Sin Fuga', width: '25%', color: 'bg-[#ecb613]' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2">
              <div className="text-[11px] font-mono text-zinc-400">{item.step}</div>
              <div className="text-base font-bold text-white font-mono">{item.count}</div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full`} style={{ width: item.width }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

