"use client";

/**
 * 📊 SPOTIFY ALGORITHM AUDITOR — CALCULADORA DE SALUD ALGORÍTMICA
 * Ingresa tus métricas reales y obtén el score 0-100 con el desglose
 * ponderado de señales y el exportador de auditoría con sello EAR OS.
 */

import React, { useMemo, useState } from 'react';
import { Activity, Download, Gauge, ShieldCheck } from 'lucide-react';
import {
  calculateAlgorithmHealth,
  buildAuditReport,
  type AlgorithmHealthInput,
} from '@/lib/academia/oraculoEngine';

const TIER_STYLE: Record<string, string> = {
  DIAMANTE: 'text-[#00E5FF] border-[#00E5FF]/40 bg-[#00E5FF]/5',
  ORO: 'text-amber-300 border-amber-300/40 bg-amber-300/5',
  PLATA: 'text-slate-200 border-slate-200/30 bg-slate-200/5',
  'EN RIESGO': 'text-[#FF2B44] border-[#FF2B44]/40 bg-[#FF2B44]/5',
};

interface FieldConfig {
  key: keyof AlgorithmHealthInput;
  label: string;
  min: number;
  max: number;
  step: number;
  suffix: string;
}

const FIELDS: FieldConfig[] = [
  { key: 'saveRate', label: 'Tasa de Guardado', min: 0, max: 60, step: 1, suffix: '%' },
  { key: 'completionRate', label: 'Reproducción Completa', min: 0, max: 100, step: 1, suffix: '%' },
  { key: 'followerGrowthRate', label: 'Crecimiento de Seguidores', min: 0, max: 20, step: 0.5, suffix: '%' },
  { key: 'playlistAdds', label: 'Playlists Activas', min: 0, max: 30, step: 1, suffix: '' },
  { key: 'monthlyListeners', label: 'Oyentes Mensuales', min: 0, max: 100000, step: 500, suffix: '' },
];

export default function SpotifyAlgorithmAuditor() {
  const [input, setInput] = useState<AlgorithmHealthInput>({
    saveRate: 18,
    completionRate: 38,
    followerGrowthRate: 3,
    playlistAdds: 5,
    monthlyListeners: 12000,
  });
  const [artistName, setArtistName] = useState('Artista EAR');
  const [exported, setExported] = useState(false);

  const result = useMemo(() => calculateAlgorithmHealth(input), [input]);

  const handleExport = () => {
    const report = buildAuditReport(input, artistName);
    const blob = new Blob([JSON.stringify({ report, hash: report.firmaInterna }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `auditoria-oraculo-${artistName.toLowerCase().replace(/\s+/g, '-')}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setExported(true);
  };

  return (
    <div className="rounded-[2rem] border border-[#FF2B44]/20 bg-[#030305] p-6 md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl border border-[#FF2B44]/30 bg-[#FF2B44]/5 p-2 text-[#FF2B44]">
          <Gauge size={18} />
        </div>
        <div>
          <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-white">
            Auditoría de Salud Algorítmica
          </h3>
          <p className="text-[11px] text-white/40">
            Score ponderado 0-100 sobre las cinco señales de descubrimiento.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Controles */}
        <div className="space-y-5">
          {FIELDS.map((field) => (
            <label key={field.key} className="block space-y-2">
              <span className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-white/50">
                {field.label}
                <span className="text-[#FF2B44]">
                  {input[field.key]}
                  {field.suffix}
                </span>
              </span>
              <input
                type="range"
                min={field.min}
                max={field.max}
                step={field.step}
                value={input[field.key]}
                onChange={(e) =>
                  setInput((prev) => ({
                    ...prev,
                    [field.key]: Number(e.target.value),
                  }))
                }
                className="w-full accent-[#FF2B44]"
                aria-label={field.label}
              />
            </label>
          ))}
        </div>

        {/* Resultado */}
        <div className="space-y-5">
          <div className={`rounded-2xl border p-6 text-center ${TIER_STYLE[result.tier]}`}>
            <div className="font-mono text-5xl font-black">{result.score}</div>
            <div className="mt-1 font-mono text-xs uppercase tracking-[0.3em]">
              {result.tier}
            </div>
          </div>

          <div className="space-y-2">
            {result.breakdown.map((item) => (
              <div key={item.signal} className="space-y-1">
                <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-white/50">
                  <span>{item.signal}</span>
                  <span>{item.normalized}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-[#FF2B44]"
                    style={{ width: `${item.normalized}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-xs italic text-white/70">{result.verdict}</p>
            <ul className="mt-3 space-y-1.5">
              {result.nextActions.map((action) => (
                <li key={action} className="flex gap-2 text-[11px] text-white/50">
                  <Activity size={12} className="mt-0.5 shrink-0 text-[#FF2B44]" />
                  {action}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="Nombre del artista"
              aria-label="Nombre del artista"
              className="flex-1 rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-[#FF2B44]/50 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF2B44] px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-[#ff5063]"
            >
              <Download size={14} /> Exportar
            </button>
          </div>

          {exported && (
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#00E5FF]">
              <ShieldCheck size={12} /> Auditoría sellada por EAR OS
            </p>
          )}
        </div>
      </div>
    </div>
  );
}