'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// ─── Rider Acústico canónico (AGENTS.md · Ley 37/2003 del Ruido) ──────────────
// Contextos inmutables del SSOT EAR OS. Valores pedagógicos, no homologados.

type AcousticContextId = 'coctel' | 'bodas' | 'festejos' | 'senior';

interface AcousticContext {
  id: AcousticContextId;
  label: string;
  rangeText: string;
  description: string;
  minDb: number;
  maxDb: number;
}

const ACOUSTIC_CONTEXTS: ReadonlyArray<AcousticContext> = [
  {
    id: 'coctel',
    label: 'Cóctel Lírico / Solista',
    rangeText: '70 - 80 dBA',
    description: 'Acústica de gala',
    minDb: 70,
    maxDb: 80,
  },
  {
    id: 'bodas',
    label: 'Bodas & Fincas',
    rangeText: '85 - 90 dBA',
    description: '85 - 90 dBA exteriores · 80 - 85 dBA interiores',
    minDb: 85,
    maxDb: 90,
  },
  {
    id: 'festejos',
    label: 'Festejos Populares / Plazas',
    rangeText: '90 - 102 dBA',
    description: 'Limitador telemático homologado',
    minDb: 90,
    maxDb: 102,
  },
  {
    id: 'senior',
    label: 'Senior VIMUME',
    rangeText: '65 - 75 dBA',
    description: 'Protocolo 40 Hz no invasivo',
    minDb: 65,
    maxDb: 75,
  },
];

const DEFAULT_CONTEXT_ID: AcousticContextId = 'coctel';

const DISCLAIMER =
  'Herramienta pedagógica de autorregulación acústica conforme a la Ley 37/2003. No constituye medición oficial homologada.';

// ─── Geometría del vúmetro circular (aguja) ───────────────────────────────────
const GAUGE_MIN_DB = 25;
const GAUGE_MAX_DB = 120;
const CALIBRATION_OFFSET_DB = 100;
const GAUGE_CX = 150;
const GAUGE_CY = 150;
const GAUGE_RADIUS = 118;
const NEEDLE_RADIUS = 95;

const COLOR_GREEN = '#10b981';
const COLOR_AMBER = '#ecb613';
const COLOR_RUBY = '#FF2B44';
const COLOR_NEUTRAL = '#3f3f46';

type MeterStatus = 'idle' | 'requesting' | 'active' | 'denied' | 'unsupported';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function toT(db: number): number {
  return clamp((db - GAUGE_MIN_DB) / (GAUGE_MAX_DB - GAUGE_MIN_DB), 0, 1);
}

function gaugeAngle(t: number): number {
  return 180 + t * 180;
}

function polarPoint(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

function describeArc(
  cx: number,
  cy: number,
  radius: number,
  t0: number,
  t1: number,
): string {
  const a0 = gaugeAngle(t0);
  const a1 = gaugeAngle(t1);
  const start = polarPoint(cx, cy, radius, a0);
  const end = polarPoint(cx, cy, radius, a1);
  const largeArc = a1 - a0 > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function computeRms(samples: Uint8Array): number {
  let sumSquares = 0;
  for (let i = 0; i < samples.length; i += 1) {
    const normalized = (samples[i] - 128) / 128;
    sumSquares += normalized * normalized;
  }
  return Math.sqrt(sumSquares / samples.length);
}

function rmsToDb(rms: number): number {
  if (rms <= 0) return 0;
  return clamp(20 * Math.log10(rms) + CALIBRATION_OFFSET_DB, 0, GAUGE_MAX_DB);
}

function resolveAudioContextCtor(): typeof AudioContext | undefined {
  if (typeof window === 'undefined') return undefined;
  const w = window as unknown as {
    AudioContext?: typeof AudioContext;
    webkitAudioContext?: typeof AudioContext;
  };
  return w.AudioContext ?? w.webkitAudioContext;
}

function isPermissionError(err: unknown): boolean {
  return (
    err instanceof DOMException &&
    (err.name === 'NotAllowedError' || err.name === 'SecurityError')
  );
}

function formatDb(value: number): string {
  return value.toFixed(1);
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function needleColor(db: number, context: AcousticContext): string {
  if (db <= context.maxDb) return COLOR_GREEN;
  if (db <= context.maxDb + 5) return COLOR_AMBER;
  return COLOR_RUBY;
}

function zoneLabel(db: number, context: AcousticContext, active: boolean): string {
  if (!active) return 'Medición en pausa';
  if (db < context.minDb) return 'Por debajo del rango óptimo';
  if (db <= context.maxDb) return 'Rango óptimo';
  if (db <= context.maxDb + 5) return 'Advertencia de límite';
  return 'Saturación acústica';
}

export default function AcousticConscienceMeter() {
  const [status, setStatus] = useState<MeterStatus>('idle');
  const [selectedContextId, setSelectedContextId] =
    useState<AcousticContextId>(DEFAULT_CONTEXT_ID);
  const [currentDb, setCurrentDb] = useState<number>(0);
  const [peakDb, setPeakDb] = useState<number>(0);
  const [averageDb, setAverageDb] = useState<number>(0);
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const rafRef = useRef<number | null>(null);
  const rmsSumRef = useRef<number>(0);
  const rmsCountRef = useRef<number>(0);

  const context =
    ACOUSTIC_CONTEXTS.find((c) => c.id === selectedContextId) ?? ACOUSTIC_CONTEXTS[0];

  const tick = useCallback((): void => {
    const analyser = analyserRef.current;
    const data = dataArrayRef.current;
    if (!analyser || !data) return;
    analyser.getByteTimeDomainData(data);
    const rms = computeRms(data);
    const db = rmsToDb(rms);
    setCurrentDb(db);
    setPeakDb((prev) => Math.max(prev, db));
    rmsSumRef.current += rms;
    rmsCountRef.current += 1;
    setAverageDb(rmsToDb(rmsSumRef.current / rmsCountRef.current));
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stop = useCallback((): void => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    sourceRef.current?.disconnect();
    sourceRef.current = null;
    void audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;
    dataArrayRef.current = null;
    setStatus('idle');
  }, []);

  const start = useCallback(async (): Promise<void> => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setStatus('unsupported');
      return;
    }
    const AudioContextCtor = resolveAudioContextCtor();
    if (!AudioContextCtor) {
      setStatus('unsupported');
      return;
    }
    setStatus('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      const audioContext = new AudioContextCtor();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      streamRef.current = stream;
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;
      dataArrayRef.current = new Uint8Array(analyser.fftSize);
      rmsSumRef.current = 0;
      rmsCountRef.current = 0;
      setCurrentDb(0);
      setPeakDb(0);
      setAverageDb(0);
      setSessionSeconds(0);
      setStatus('active');
      rafRef.current = requestAnimationFrame(tick);
    } catch (err) {
      setStatus(isPermissionError(err) ? 'denied' : 'unsupported');
    }
  }, [tick]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      void audioContextRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (status !== 'active') return;
    const intervalId = window.setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [status]);

  const needleT = toT(currentDb);
  const needleAngle = gaugeAngle(needleT);
  const needleTip = polarPoint(GAUGE_CX, GAUGE_CY, NEEDLE_RADIUS, needleAngle);

  const zones = [
    { t0: toT(GAUGE_MIN_DB), t1: toT(context.minDb), color: COLOR_NEUTRAL },
    { t0: toT(context.minDb), t1: toT(context.maxDb), color: COLOR_GREEN },
    {
      t0: toT(context.maxDb),
      t1: toT(Math.min(context.maxDb + 5, GAUGE_MAX_DB)),
      color: COLOR_AMBER,
    },
    {
      t0: toT(Math.min(context.maxDb + 5, GAUGE_MAX_DB)),
      t1: toT(GAUGE_MAX_DB),
      color: COLOR_RUBY,
    },
  ].filter((zone) => zone.t1 > zone.t0);

  const isActive = status === 'active';

  return (
    <div className="w-full">
      <div className="print:hidden rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-8 transition-all duration-300">
        {/* Cabecera */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="m-0 text-xs uppercase tracking-[0.3em] text-[#a1a1aa]">
              EAR OS · Autorregulación acústica
            </p>
            <h2 className="m-0 mt-1 font-syne text-2xl font-bold tracking-tight text-white">
              Sonómetro de Conciencia
            </h2>
          </div>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
              isActive ? 'bg-[#10b981]/15 text-[#10b981]' : 'bg-white/5 text-[#a1a1aa]'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isActive ? 'animate-pulse bg-[#10b981]' : 'bg-[#52525b]'
              }`}
            />
            {isActive ? 'MIDIENDO' : 'EN PAUSA'}
          </span>
        </div>

        {/* Selector de contexto acústico */}
        <div
          role="radiogroup"
          aria-label="Contexto acústico"
          className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {ACOUSTIC_CONTEXTS.map((ctx) => {
            const selected = ctx.id === selectedContextId;
            return (
              <button
                key={ctx.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setSelectedContextId(ctx.id)}
                className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
                  selected
                    ? 'border-[#ecb613]/60 bg-[#ecb613]/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/25'
                }`}
              >
                <p className="m-0 text-sm font-semibold text-white">{ctx.label}</p>
                <p className="m-0 mt-1 font-mono text-xs text-[#ecb613]">{ctx.rangeText}</p>
                <p className="m-0 mt-1 text-xs text-[#a1a1aa]">{ctx.description}</p>
              </button>
            );
          })}
        </div>

        {/* Vúmetro circular de aguja */}
        <div className="flex flex-col items-center">
          <div
            role="meter"
            aria-label="Nivel de presión sonora estimado"
            aria-valuemin={GAUGE_MIN_DB}
            aria-valuemax={GAUGE_MAX_DB}
            aria-valuenow={Math.round(currentDb)}
            aria-valuetext={`${formatDb(currentDb)} decibelios`}
            className="w-full max-w-md"
          >
            <svg viewBox="0 0 300 170" className="w-full" role="img" aria-hidden="true">
              <path
                d={describeArc(GAUGE_CX, GAUGE_CY, GAUGE_RADIUS, 0, 1)}
                fill="none"
                stroke="#27272a"
                strokeWidth="16"
                strokeLinecap="round"
              />
              {zones.map((zone) => (
                <path
                  key={`${zone.t0}-${zone.t1}`}
                  d={describeArc(GAUGE_CX, GAUGE_CY, GAUGE_RADIUS, zone.t0, zone.t1)}
                  fill="none"
                  stroke={zone.color}
                  strokeWidth="16"
                  strokeLinecap="round"
                />
              ))}
              <line
                x1={GAUGE_CX}
                y1={GAUGE_CY}
                x2={needleTip.x}
                y2={needleTip.y}
                stroke={needleColor(currentDb, context)}
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle
                cx={GAUGE_CX}
                cy={GAUGE_CY}
                r="9"
                fill="#09090d"
                stroke={needleColor(currentDb, context)}
                strokeWidth="3"
              />
            </svg>
          </div>

          <p className="m-0 mt-2 font-mono text-5xl font-bold tracking-tight text-white">
            {formatDb(currentDb)} <span className="text-lg text-[#a1a1aa]">dBA</span>
          </p>
          <p
            className="m-0 mt-1 text-sm font-semibold"
            style={{ color: needleColor(currentDb, context) }}
          >
            {zoneLabel(currentDb, context, isActive)}
          </p>
          <p className="m-0 mt-1 text-xs text-[#a1a1aa]">
            Rango óptimo {context.label}: {context.rangeText}
          </p>
        </div>

        {/* Telemetría en directo */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <p className="m-0 text-xs uppercase tracking-[0.2em] text-[#a1a1aa]">Pico máximo</p>
            <p className="m-0 mt-1 font-mono text-2xl font-bold text-[#FF2B44]">
              {formatDb(peakDb)} dBA
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <p className="m-0 text-xs uppercase tracking-[0.2em] text-[#a1a1aa]">Promedio RMS</p>
            <p className="m-0 mt-1 font-mono text-2xl font-bold text-[#10b981]">
              {formatDb(averageDb)} dBA
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <p className="m-0 text-xs uppercase tracking-[0.2em] text-[#a1a1aa]">
              Tiempo de sesión
            </p>
            <p className="m-0 mt-1 font-mono text-2xl font-bold text-white">
              {formatTime(sessionSeconds)}
            </p>
          </div>
        </div>

        {/* Controles */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {status === 'requesting' ? (
            <button
              type="button"
              disabled
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-[#a1a1aa]"
            >
              Solicitando acceso al micrófono…
            </button>
          ) : isActive ? (
            <button
              type="button"
              onClick={stop}
              className="inline-flex items-center justify-center rounded-2xl border border-[#FF2B44]/50 bg-[#FF2B44]/10 px-6 py-3 text-sm font-semibold text-[#FF2B44] transition-all duration-300 hover:bg-[#FF2B44]/20"
            >
              Detener medición
            </button>
          ) : (
            <button
              type="button"
              onClick={start}
              className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-[#030305] transition-all duration-300 hover:bg-[#e5e5e7] hover:scale-[1.02]"
            >
              Iniciar medición de sonido
            </button>
          )}

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-transparent px-6 py-3 text-sm font-semibold text-[#f5f5f7] transition-all duration-300 hover:border-white/30 hover:bg-white/5"
          >
            Imprimir informe de soundcheck
          </button>
        </div>

        {/* Estado pedagógico de permisos */}
        {status === 'denied' && (
          <p className="m-0 mt-4 rounded-2xl border border-[#FF2B44]/30 bg-[#FF2B44]/10 p-4 text-sm text-[#fecaca]">
            Permiso de micrófono denegado. Actívalo en la configuración del navegador y vuelve a
            intentarlo. Sin tu permiso explícito, no se captura ningún audio.
          </p>
        )}
        {status === 'unsupported' && (
          <p className="m-0 mt-4 rounded-2xl border border-[#ecb613]/30 bg-[#ecb613]/10 p-4 text-sm text-[#fde68a]">
            Tu navegador no soporta Web Audio API o el acceso al micrófono. Prueba con Chrome, Edge
            o Safari actualizados y una conexión segura (HTTPS).
          </p>
        )}

        {/* Descargo pedagógico obligatorio */}
        <p className="m-0 mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-[#a1a1aa]">
          {DISCLAIMER}
        </p>
      </div>

      {/* Informe físico imprimible (window.print) */}
      <div className="hidden rounded-2xl border border-black/10 p-8 text-black print:block">
        <h2 className="m-0 text-2xl font-bold">Informe de Soundcheck · Sonómetro de Conciencia</h2>
        <p className="m-0 mt-1 text-sm text-neutral-600">
          Fecha: {new Date().toLocaleString('es-ES')} · EAR OS
        </p>
        <table className="mt-6 w-full border-collapse text-sm">
          <tbody>
            <tr className="border-b border-black/10">
              <td className="py-2 font-semibold">Contexto acústico</td>
              <td className="py-2 text-right">
                {context.label} ({context.rangeText})
              </td>
            </tr>
            <tr className="border-b border-black/10">
              <td className="py-2 font-semibold">Pico máximo</td>
              <td className="py-2 text-right font-mono">{formatDb(peakDb)} dBA</td>
            </tr>
            <tr className="border-b border-black/10">
              <td className="py-2 font-semibold">Promedio RMS</td>
              <td className="py-2 text-right font-mono">{formatDb(averageDb)} dBA</td>
            </tr>
            <tr className="border-b border-black/10">
              <td className="py-2 font-semibold">Duración de sesión</td>
              <td className="py-2 text-right font-mono">{formatTime(sessionSeconds)}</td>
            </tr>
          </tbody>
        </table>
        <p className="m-0 mt-6 text-xs text-neutral-500">{DISCLAIMER}</p>
      </div>
    </div>
  );
}
