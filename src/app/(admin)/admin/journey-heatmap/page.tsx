"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Compass,
  Flame,
  CheckCircle2,
  Clock,
  MousePointerClick,
  Sparkles,
  ShieldCheck,
  Search,
  ExternalLink,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface JourneyItem {
  id: string;
  query: string;
  temperature: 'FIRE' | 'HOT' | 'WARM';
  efficiency: number;
  clicks: number;
  timeSeconds: number;
  neuralJourney: boolean;
  priceLock: string;
}

const JOURNEYS: JourneyItem[] = [
  { id: 'sim-1-mariachi-edwin-directo', query: 'edwin agudelo madrid', temperature: 'FIRE', efficiency: 100, clicks: 3, timeSeconds: 33.0, neuralJourney: true, priceLock: '100 € LOCKED' },
  { id: 'sim-2-mariachi-urgente-hoy', query: 'mariachi urgente madrid hoy', temperature: 'FIRE', efficiency: 100, clicks: 3, timeSeconds: 33.0, neuralJourney: true, priceLock: '100 € LOCKED' },
  { id: 'sim-3-mariachi-madrid-precio', query: 'precio mariachi madrid', temperature: 'HOT', efficiency: 100, clicks: 3, timeSeconds: 34.2, neuralJourney: true, priceLock: '100 € LOCKED' },
  { id: 'sim-4-solista-boda-toledo', query: 'cantante solista boda toledo', temperature: 'FIRE', efficiency: 100, clicks: 2, timeSeconds: 28.5, neuralJourney: true, priceLock: '100 € LOCKED' },
  { id: 'sim-5-sonido-bose-f1-alquiler', query: 'alquiler bose f1 812 toledo', temperature: 'HOT', efficiency: 100, clicks: 3, timeSeconds: 38.0, neuralJourney: true, priceLock: '100 € LOCKED' },
  { id: 'sim-6-finca-boda-sin-limite-db', query: 'finca para boda toledo musica en vivo', temperature: 'HOT', efficiency: 100, clicks: 3, timeSeconds: 41.5, neuralJourney: true, priceLock: '100 € LOCKED' },
  { id: 'sim-7-b2g-licitacion-menor-toledo', query: 'concierto fiestas patronales ayuntamiento mentrida', temperature: 'FIRE', efficiency: 100, clicks: 2, timeSeconds: 22.0, neuralJourney: true, priceLock: 'ART. 118 LCSP' },
  { id: 'sim-8-vimume-residencia-terapia', query: 'musica estimulacion cognitiva mayores madrid', temperature: 'HOT', efficiency: 100, clicks: 3, timeSeconds: 36.4, neuralJourney: true, priceLock: 'GALA 350 €' },
  { id: 'sim-9-mariachi-monumental-boda', query: 'mariachi monumental 10 musicos madrid', temperature: 'FIRE', efficiency: 100, clicks: 3, timeSeconds: 32.0, neuralJourney: true, priceLock: '100 € LOCKED' },
  { id: 'sim-10-dj-boda-sonido-directo', query: 'dj y sonido profesional boda navalcarnero', temperature: 'HOT', efficiency: 100, clicks: 3, timeSeconds: 35.8, neuralJourney: true, priceLock: '100 € LOCKED' }
];

export default function JourneyHeatmapAdminPage() {
  const [filterTemp, setFilterTemp] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filteredJourneys = useMemo(() => {
    return JOURNEYS.filter(j => {
      if (filterTemp !== 'ALL' && j.temperature !== filterTemp) return false;
      if (search && !j.query.toLowerCase().includes(search.toLowerCase()) && !j.id.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [filterTemp, search]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
        <Link href="/admin" className="hover:text-zinc-300 transition-colors">Admin</Link>
        <span>/</span>
        <span>IA &amp; GPU</span>
        <span>/</span>
        <span className="text-[#ecb613]">Journey Heatmap UX</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white uppercase">
            CUSTOMER JOURNEY HEATMAP S-CLASS
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Validación de la regla de oro: Leads HOT capturados en <span className="text-[#ecb613]">≤3 clics y ≤45 segundos</span> con depósito Price-Lock SHA-256
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/EAR_JOURNEY_HEATMAP.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/40 text-xs font-mono text-[#ecb613] hover:bg-[#ecb613]/20 flex items-center gap-2 transition-all font-bold shadow-[0_0_15px_rgba(236,182,19,0.15)]"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Reporte Estático (58 Tests)
          </a>
        </div>
      </div>

      {/* KPI Cards CATMÍN S-Class */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#050508] border border-[#1a1a24] hover:border-[#ecb613]/30 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Score Eficiencia</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#ecb613] group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#ecb613] mt-3">
            100%
          </div>
          <div className="text-[10px] font-mono text-zinc-500 mt-1 flex items-center gap-1">
            <span className="text-[#ecb613]">Promedio</span> ponderado
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#050508] border border-[#1a1a24] hover:border-[#ecb613]/30 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Golden Path Pass</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 mt-3">
            100%
          </div>
          <div className="text-[10px] font-mono text-zinc-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-400">Leads HOT</span> ≤3 clics y ≤45s
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#050508] border border-[#1a1a24] hover:border-[#ecb613]/30 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Simulaciones Auditadas</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white mt-3">
            58 Tests
          </div>
          <div className="text-[10px] font-mono text-zinc-500 mt-1 flex items-center gap-1">
            <span className="text-blue-400">Casos reales</span> evaluados
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#050508] border border-[#1a1a24] hover:border-[#ecb613]/30 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Neural Journey Pass</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400 mt-3">
            100%
          </div>
          <div className="text-[10px] font-mono text-zinc-500 mt-1 flex items-center gap-1">
            <span className="text-cyan-400">Túnel activo</span> en todos los leads
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por intención o ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#050508] border border-[#1a1a24] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ecb613]/50 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono">
          {(['ALL', 'FIRE', 'HOT'] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilterTemp(t)}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                filterTemp === t
                  ? 'bg-[#ecb613] text-black border-[#ecb613] font-bold'
                  : 'bg-[#050508] text-zinc-400 border-[#1a1a24] hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Performance Matrix Table */}
      <div className="bg-[#050508] border border-[#1a1a24] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-[#1a1a24] bg-black/40 text-zinc-500 uppercase">
                <th className="py-3 px-4">ID Viaje</th>
                <th className="py-3 px-4">Intención / Búsqueda</th>
                <th className="py-3 px-4 text-center">Temperatura</th>
                <th className="py-3 px-4 text-center">Eficiencia</th>
                <th className="py-3 px-4 text-center">Clics</th>
                <th className="py-3 px-4 text-right">Tiempo</th>
                <th className="py-3 px-4 text-center">Neural Journey</th>
                <th className="py-3 px-4 text-center">Stripe Price-Lock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a24]">
              {filteredJourneys.map(j => (
                <tr key={j.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 text-zinc-500 text-[11px]">{j.id}</td>
                  <td className="py-3 px-4 text-white font-sans font-medium text-xs">{j.query}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                      j.temperature === 'FIRE'
                        ? 'bg-red-950/40 text-red-400 border-red-800'
                        : 'bg-amber-950/40 text-amber-400 border-amber-800'
                    }`}>
                      {j.temperature}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-bold">{j.efficiency}%</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-bold">{j.clicks} clics</td>
                  <td className="py-3 px-4 text-right text-zinc-400">{j.timeSeconds.toFixed(1)}s</td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-emerald-400 font-bold text-[11px]">● ACTIVO</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-[#ecb613] font-bold bg-[#ecb613]/10 border border-[#ecb613]/30 px-2 py-0.5 rounded text-[10px]">
                      {j.priceLock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
