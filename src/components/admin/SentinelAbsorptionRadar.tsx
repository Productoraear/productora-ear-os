"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Radar,
  Activity,
  RefreshCw,
  Download,
  ShieldCheck,
  FileStack,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

type SampleItem = { path: string; bytes: number };

type ScanData = {
  action: 'scan';
  ts: string;
  pending: number;
  sizeMB: number;
  absorbed: number;
  absorptionPct: number;
  suggestions: string[];
  sample: SampleItem[];
};

type AbsorbData = {
  action: 'absorb';
  ts: string;
  moved: number;
  failed: number;
  status: 'ok' | 'partial' | 'idle';
  message: string;
  destRoot: string;
  errors?: string[];
};

type ApiError = { error: string; detail?: string };

function fmtBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatSize(mb: number): string {
  if (mb < 1) return `${Math.round(mb * 1024)} KB`;
  return `${mb.toFixed(2)} MB`;
}

export default function SentinelAbsorptionRadar() {
  const [scan, setScan] = useState<ScanData | null>(null);
  const [absorb, setAbsorb] = useState<AbsorbData | null>(null);
  const [loading, setLoading] = useState(false);
  const [absorbing, setAbsorbing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/sentinel?action=scan', { cache: 'no-store' });
      const data = (await res.json()) as ScanData | ApiError;

      if ('action' in data && data.action === 'scan') {
        setScan(data);
        setAbsorb(null);
      } else {
        const err = data as ApiError;
        setError(`${err.error}${err.detail ? ` — ${err.detail}` : ''}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo contactar con el motor Sentinel.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchScan();
  }, [fetchScan]);

  const runAbsorb = useCallback(async () => {
    setAbsorbing(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/sentinel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: [] }),
      });
      const data = (await res.json()) as AbsorbData | ApiError;

      if ('action' in data && data.action === 'absorb') {
        setAbsorb(data);
        await fetchScan();
      } else {
        const err = data as ApiError;
        setError(`${err.error}${err.detail ? ` — ${err.detail}` : ''}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fallo al absorber documentos.');
    } finally {
      setAbsorbing(false);
    }
  }, [fetchScan]);

  const pct = useMemo(() => scan?.absorptionPct ?? 0, [scan]);
  const normalizedPct = Math.max(0, Math.min(100, pct));

  return (
    <section
      aria-label="Radar de absorción Sentinel"
      className="space-y-6"
    >
      {/* Barra de estado OLED */}
      <div
        role="group"
        aria-label="Métricas de absorción"
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div
          role="group"
          aria-label="Documentos pendientes de absorción"
          className="p-5 rounded-2xl bg-[#050508] border border-[#1a1a24]"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Documentos pendientes</span>
            <FileStack className="w-4 h-4 text-[#00E5FF]" aria-hidden="true" />
          </div>
          <div
            className="text-3xl font-bold text-white font-mono"
            aria-live="polite"
            aria-atomic="true"
          >
            {scan ? scan.pending : '—'}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1 font-mono">en H:\ pendientes de absorción</p>
        </div>

        <div
          role="group"
          aria-label="Volumen escaneado"
          className="p-5 rounded-2xl bg-[#050508] border border-[#1a1a24]"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Volumen escaneado</span>
            <HardDrive className="w-4 h-4 text-[#00E5FF]" aria-hidden="true" />
          </div>
          <div
            className="text-3xl font-bold text-white font-mono"
            aria-live="polite"
            aria-atomic="true"
          >
            {scan ? formatSize(scan.sizeMB) : '—'}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1 font-mono">archivos ligeros {'(<1 MB)'}</p>
        </div>

        <div
          role="group"
          aria-label="Documentos absorbidos históricos"
          className="p-5 rounded-2xl bg-[#050508] border border-[#1a1a24]"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Absorbidos históricos</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          </div>
          <div
            className="text-3xl font-bold text-white font-mono"
            aria-live="polite"
            aria-atomic="true"
          >
            {scan ? scan.absorbed : '—'}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1 font-mono">en ARCHIVO_HISTORICO_EAR</p>
        </div>

        <div
          role="group"
          aria-label="Absorción en vivo"
          className="p-5 rounded-2xl bg-[#050508] border border-[#1a1a24]"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Absorción en vivo</span>
            <Activity className="w-4 h-4 text-[#00E5FF]" aria-hidden="true" />
          </div>
          <div
            className="text-3xl font-bold text-[#00E5FF] font-mono"
            aria-live="polite"
            aria-atomic="true"
          >
            {normalizedPct.toFixed(1)}%
          </div>
          <div
            role="progressbar"
            aria-label="Porcentaje de absorción"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={normalizedPct}
            aria-valuetext={`${normalizedPct.toFixed(1)}%`}
            className="w-full h-2 bg-zinc-900 rounded-full mt-3 overflow-hidden border border-zinc-800"
          >
            <div
              className="h-full bg-[#00E5FF] transition-all duration-700"
              style={{ width: `${normalizedPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Radar y sugerencias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          role="region"
          aria-label="Radar de absorción"
          className="p-6 rounded-2xl bg-[#050508] border border-[#1a1a24]"
        >
          <div className="flex items-center gap-2 mb-4">
            <Radar className="w-5 h-5 text-[#00E5FF]" aria-hidden="true" />
            <h2
              id="sentinel-radar-heading"
              className="text-sm font-bold text-white font-mono tracking-wide"
            >
              RADAR DE ABSORCIÓN
            </h2>
          </div>

          {loading ? (
            <div
              role="status"
              aria-live="polite"
              aria-label="Cargando radar de absorción"
              className="flex items-center justify-center py-16 text-zinc-500"
            >
              <Loader2 className="w-6 h-6 animate-spin text-[#00E5FF]" aria-hidden="true" />
              <span className="sr-only">Cargando…</span>
            </div>
          ) : scan && scan.sample.length > 0 ? (
            <ul
              aria-labelledby="sentinel-radar-heading"
              className="space-y-2"
            >
              {scan.sample.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between gap-3 rounded-lg bg-zinc-950 border border-zinc-900 px-3 py-2"
                >
                  <span
                    className="text-xs font-mono text-zinc-300 truncate"
                    title={item.path}
                  >
                    {item.path}
                  </span>
                  <span
                    className="text-[10px] font-mono text-[#00E5FF] shrink-0"
                    aria-label={`Tamaño: ${fmtBytes(item.bytes)}`}
                  >
                    {fmtBytes(item.bytes)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p
              role="status"
              aria-live="polite"
              className="text-xs text-zinc-500 py-8 text-center font-mono"
            >
              Sin documentos pendientes. Consola soberana limpia.
            </p>
          )}
        </div>

        <div
          role="region"
          aria-label="Sugerencias de negocio"
          className="p-6 rounded-2xl bg-[#050508] border border-[#1a1a24]"
        >
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-[#00E5FF]" aria-hidden="true" />
            <h2
              id="sentinel-suggestions-heading"
              className="text-sm font-bold text-white font-mono tracking-wide"
            >
              SUGERENCIAS DE NEGOCIO (A/B/C)
            </h2>
          </div>

          {scan && scan.suggestions.length > 0 ? (
            <ol
              aria-labelledby="sentinel-suggestions-heading"
              className="space-y-3"
            >
              {scan.suggestions.map((suggestion, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 rounded-lg bg-zinc-950 border border-zinc-900 px-3 py-3"
                >
                  <span
                    className="text-xs font-bold text-[#00E5FF] font-mono mt-0.5"
                    aria-hidden="true"
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-xs text-zinc-300 leading-relaxed">
                    <span className="sr-only">{`Sugerencia ${String.fromCharCode(65 + idx)}: `}</span>
                    {suggestion}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p
              role="status"
              aria-live="polite"
              className="text-xs text-zinc-500 py-8 text-center font-mono"
            >
              Ejecuta un escaneo para obtener sugerencias.
            </p>
          )}

          {absorb && (
            <div
              role={absorb.status === 'ok' ? 'status' : 'alert'}
              aria-live={absorb.status === 'ok' ? 'polite' : 'assertive'}
              aria-atomic="true"
              className={`mt-4 rounded-lg border px-3 py-3 text-xs font-mono flex items-start gap-2 ${absorb.status === 'ok'
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                }`}
            >
              {absorb.status === 'ok' ? (
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
              ) : (
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
              )}
              <span>{absorb.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Acciones */}
      <div
        role="region"
        aria-label="Acciones de absorción"
        className="flex flex-col sm:flex-row gap-4 items-center justify-between p-5 rounded-2xl bg-[#050508] border border-[#1a1a24]"
      >
        <p className="text-xs text-zinc-500 font-mono text-center sm:text-left">
          Mueve documentos ligeros a{' '}
          <span className="text-zinc-300">H:\ARCHIVO_HISTORICO_EAR\ABSORBIDOS_COMPLETOS\</span>{' '}
          y libera el repo Git.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => void fetchScan()}
            disabled={loading}
            aria-label="Escanear documentos pendientes"
            aria-busy={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono hover:border-[#00E5FF]/50 hover:text-white transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            Escanear
          </button>
          <button
            type="button"
            onClick={() => void runAbsorb()}
            disabled={absorbing || loading}
            aria-label="Absorber y mover documentos ligeros al archivo histórico"
            aria-busy={absorbing}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#00E5FF] text-[#030305] text-xs font-bold font-mono hover:bg-[#00c9e0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
          >
            {absorbing ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <Download className="w-4 h-4" aria-hidden="true" />
            )}
            {absorbing ? 'Absorbiendo…' : 'Absorber & Mover'}
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          className="p-4 rounded-xl border border-[#FF2B44]/40 bg-[#FF2B44]/10 text-[#FF2B44] text-xs font-mono flex items-start gap-2"
        >
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </section>
  );
}