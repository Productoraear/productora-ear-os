"use client";

/**
 * 📊 SPOTIFY ALGORITHM AUDITOR — CALCULADORA DE SALUD ALGORÍTMICA
 * Ingresa tus métricas reales y obtén el score 0-100 con el desglose
 * ponderado de señales y el exportador de auditoría con sello EAR OS.
 */

import { useMemo, useState } from 'react';
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
    <section
      aria-labelledby="spotify-auditor-title"
      aria-describedby="spotify-auditor-desc"
      className="rounded-[2rem] border border-[#FF2B44]/20 bg-[#030305] p-6 md:p-8"
    >
      <header className="mb-6 flex items-center gap-3">
        <div
          aria-hidden="true"
          className="rounded-xl border border-[#FF2B44]/30 bg-[#FF2B44]/5 p-2 text-[#FF2B44]"
        >
          <Gauge size={18} aria-hidden="true" focusable="false" />
        </div>
        <div>
          <h3
            id="spotify-auditor-title"
            className="font-mono text-sm font-bold uppercase tracking-widest text-white"
          >
            Auditoría de Salud Algorítmica
          </h3>
          <p id="spotify-auditor-desc" className="text-[11px] text-white/40">
            Score ponderado 0-100 sobre las cinco señales de descubrimiento.
          </p>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Controles */}
        <div
          role="group"
          aria-label="Controles de métricas algorítmicas"
          className="space-y-5"
        >
          {FIELDS.map((field) => {
            const fieldId = `spotify-auditor-field-${field.key}`;
            const valueId = `${fieldId}-value`;
            return (
              <div key={field.key} className="block space-y-2">
                <label
                  htmlFor={fieldId}
                  className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-white/50"
                >
                  <span>{field.label}</span>
                  <span id={valueId} className="text-[#FF2B44]" aria-hidden="true">
                    {input[field.key]}
                    {field.suffix}
                  </span>
                </label>
                <input
                  id={fieldId}
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
                  aria-valuemin={field.min}
                  aria-valuemax={field.max}
                  aria-valuenow={input[field.key]}
                  aria-valuetext={`${input[field.key]}${field.suffix}`}
                  aria-describedby={valueId}
                />
              </div>
            );
          })}
        </div>

        {/* Resultado */}
        <div className="space-y-5">
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            aria-label={`Score algorítmico: ${result.score} sobre 100. Nivel ${result.tier}`}
            className={`rounded-2xl border p-6 text-center ${TIER_STYLE[result.tier]}`}
          >
            <div className="font-mono text-5xl font-black" aria-hidden="true">
              {result.score}
            </div>
            <div
              className="mt-1 font-mono text-xs uppercase tracking-[0.3em]"
              aria-hidden="true"
            >
              {result.tier}
            </div>
          </div>

          <div
            role="list"
            aria-label="Desglose de señales algorítmicas"
            className="space-y-2"
          >
            {result.breakdown.map((item) => (
              <div key={item.signal} role="listitem" className="space-y-1">
                <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-white/50">
                  <span>{item.signal}</span>
                  <span aria-hidden="true">{item.normalized}%</span>
                </div>
                <div
                  role="progressbar"
                  aria-label={`${item.signal}: ${item.normalized} por ciento`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={item.normalized}
                  aria-valuetext={`${item.normalized}%`}
                  className="h-1.5 overflow-hidden rounded-full bg-white/5"
                >
                  <div
                    aria-hidden="true"
                    className="h-full rounded-full bg-[#FF2B44]"
                    style={{ width: `${item.normalized}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div
            role="region"
            aria-label="Veredicto y próximas acciones"
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
          >
            <p className="text-xs italic text-white/70">{result.verdict}</p>
            <ul
              role="list"
              aria-label="Próximas acciones recomendadas"
              className="mt-3 space-y-1.5"
            >
              {result.nextActions.map((action) => (
                <li
                  key={action}
                  role="listitem"
                  className="flex gap-2 text-[11px] text-white/50"
                >
                  <Activity
                    size={12}
                    aria-hidden="true"
                    focusable="false"
                    className="mt-0.5 shrink-0 text-[#FF2B44]"
                  />
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
              aria-label="Nombre del artista para el reporte de auditoría"
              autoComplete="off"
              className="flex-1 rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-[#FF2B44]/50 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleExport}
              aria-label="Exportar auditoría algorítmica en formato JSON"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF2B44] px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-[#ff5063] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2B44] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
            >
              <Download size={14} aria-hidden="true" focusable="false" /> Exportar
            </button>
          </div>

          {exported && (
            <p
              role="status"
              aria-live="polite"
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#00E5FF]"
            >
              <ShieldCheck size={12} aria-hidden="true" focusable="false" /> Auditoría sellada por EAR OS
            </p>
          )}
        </div>
      </div>
    </section>
  );
}