"use client";

import React, { useEffect, useState } from "react";
import {
  Truck,
  CheckCircle2,
  Clock,
  Volume2,
  Phone,
  Radio,
  LoaderCircle,
  MapPin,
  Activity,
  TriangleAlert,
} from "lucide-react";

interface MissionStage {
  readonly key: string;
  readonly label: string;
}

interface LiveFleetTrackerProps {
  readonly missionId: string;
  readonly initialStage?: number;
  readonly etaMinutes?: number;
}

type TelemetryResponse = {
  id: string;
  last: {
    lat: number;
    lng: number;
    accuracy: number;
    status: string;
    at: string;
  } | null;
  count: number;
  live: boolean;
};

type TrackerState = "cargando" | "sin_senal" | "en_vivo" | "error";

const STAGES: readonly MissionStage[] = [
  { key: "contract", label: "Contrato y Depósito Firmado" },
  { key: "route", label: "En Ruta (GPS Hub Méntrida)" },
  { key: "setup", label: "Llegada y Montaje" },
  { key: "soundcheck", label: "Soundcheck Acústico" },
  { key: "show", label: "Show en Curso" },
];

const EMERGENCY_WHATSAPP = "https://wa.me/34693693048";
const POLL_INTERVAL_MS = 15_000;

// Rango normativo SSOT por contexto (Solista / Edwin Agudelo, Ley 37/2003).
// Se muestra como texto estático de referencia, nunca como medición en vivo.
const NORMATIVE_RANGE_LABEL = "70–80 dBA · Solista (acústica de gala)";

// Mapea el estado real de telemetría al índice de etapa visual (0-based).
const STATUS_TO_STAGE: Readonly<Record<string, number>> = {
  EN_RUTA: 1,
  EN_RECINTO: 2,
  MONTAJE: 2,
  LISTO: 3,
  EN_VIVO: 4,
  FINALIZADO: 4,
};

function stageFromStatus(status: string): number {
  return STATUS_TO_STAGE[status] ?? 0;
}

function formatSignalTime(iso: string | null): string {
  if (iso === null) {
    return "Sin señal aún";
  }
  const ts = new Date(iso).getTime();
  if (!Number.isFinite(ts)) {
    return "Sin señal aún";
  }
  return new Intl.DateTimeFormat("es-ES", { timeStyle: "short" }).format(ts);
}

export function LiveFleetTracker({
  missionId,
  initialStage = 0,
}: LiveFleetTrackerProps): React.JSX.Element {
  const lastIndex = STAGES.length - 1;
  const baselineStage = Math.min(Math.max(Math.trunc(initialStage), 0), lastIndex);

  const [state, setState] = useState<TrackerState>("cargando");
  const [lastSignalAt, setLastSignalAt] = useState<string | null>(null);
  const [liveStatus, setLiveStatus] = useState<string | null>(null);
  const [lastPosition, setLastPosition] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
  } | null>(null);
  const [pingCount, setPingCount] = useState<number>(0);

  useEffect(() => {
    const controller = new AbortController();
    let timer: number | undefined;

    const load = async (): Promise<void> => {
      try {
        const res = await fetch(`/api/telemetry/${encodeURIComponent(missionId)}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = (await res.json()) as TelemetryResponse;
        if (controller.signal.aborted) {
          return;
        }
        setLastSignalAt(data.last?.at ?? null);
        setPingCount(data.count);
        setLiveStatus(data.last?.status ?? null);
        setLastPosition(
          data.last
            ? { lat: data.last.lat, lng: data.last.lng, accuracy: data.last.accuracy }
            : null
        );
        setState(data.live ? "en_vivo" : "sin_senal");
      } catch {
        if (controller.signal.aborted) {
          return;
        }
        setState("error");
      }
    };

    void load();
    timer = window.setInterval(() => {
      void load();
    }, POLL_INTERVAL_MS);

    return () => {
      controller.abort();
      if (timer !== undefined) {
        window.clearInterval(timer);
      }
    };
  }, [missionId]);

  const stage =
    state === "en_vivo" && liveStatus !== null
      ? stageFromStatus(liveStatus)
      : baselineStage;
  const pct = Math.round((stage / lastIndex) * 100);

  return (
    <section
      className="w-full overflow-x-hidden rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 text-white backdrop-blur-md transition-all duration-300 ease-out md:p-10"
      aria-label={`Seguimiento de la misión ${missionId}`}
    >
      <header className="mb-8 flex items-center gap-3">
        <Truck className="h-8 w-8 text-[#00E5FF]" aria-hidden="true" />
        <div>
          <h2 className="text-xl font-bold tracking-tight">Radar del Día D</h2>
          <p className="font-mono text-xs text-white/70">Misión {missionId}</p>
        </div>
      </header>

      {state === "cargando" && (
        <div className="mb-8 flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.02] px-5 py-4">
          <LoaderCircle className="h-5 w-5 animate-spin text-[#00E5FF]" aria-hidden="true" />
          <p className="text-sm text-white/70">Conectando con el radar de telemetría…</p>
        </div>
      )}

      {state === "error" && (
        <div className="mb-8 rounded-3xl border border-[#FF2B44]/40 bg-[#FF2B44]/10 px-5 py-4">
          <p className="flex items-center gap-2 text-sm text-white">
            <TriangleAlert className="h-5 w-5 text-[#FF2B44]" aria-hidden="true" />
            No se pudo leer la telemetría en este momento. Reintentando automáticamente…
          </p>
        </div>
      )}

      {state === "sin_senal" && (
        <div
          role="status"
          className="mb-8 rounded-3xl border border-white/10 bg-white/[0.02] px-5 py-4"
        >
          <p className="flex items-center gap-2 text-sm text-white">
            <Radio className="h-5 w-5 text-[#00E5FF]" aria-hidden="true" />
            Sin señal en vivo todavía. El seguimiento se activa automáticamente a la hora pactada.
          </p>
        </div>
      )}

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="Progreso de la misión"
        className="mb-6 h-2 w-full overflow-hidden rounded-full bg-white/10"
      >
        <div
          className="h-full rounded-full bg-[#00E5FF] transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      <ol className="mb-8 space-y-3">
        {STAGES.map((s, i) => {
          const reached = i <= stage;
          const active = state === "en_vivo" && i === stage;
          return (
            <li
              key={s.key}
              aria-current={active ? "step" : undefined}
              className={`flex items-center gap-3 rounded-3xl border px-4 py-3 transition-all duration-300 ease-out hover:scale-[1.01] ${
                active
                  ? "border-[#00E5FF]/60 bg-[#00E5FF]/10"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <CheckCircle2
                className={`h-5 w-5 ${reached ? "text-[#00E5FF]" : "text-white/30"}`}
                aria-hidden="true"
              />
              <span className={reached ? "text-white" : "text-white/60"}>{s.label}</span>
              {active && (
                <span className="ml-auto font-mono text-xs text-[#00E5FF]">EN VIVO</span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-white/10 p-5">
          <p className="mb-1 flex items-center gap-2 text-sm text-white/70">
            <Clock className="h-4 w-4" aria-hidden="true" /> Última señal
          </p>
          <p className="font-mono text-3xl font-bold text-[#00E5FF]">
            {formatSignalTime(lastSignalAt)}
          </p>
          {state === "en_vivo" && lastPosition !== null && (
            <p className="mt-2 font-mono text-xs text-white/60">
              <MapPin className="mr-1 inline h-3 w-3" aria-hidden="true" />
              {lastPosition.lat.toFixed(4)}, {lastPosition.lng.toFixed(4)} ·{" "}
              <Activity className="mr-1 inline h-3 w-3" aria-hidden="true" />±
              {Math.round(lastPosition.accuracy)} m · {pingCount} pings
            </p>
          )}
        </div>
        <div className="rounded-3xl border border-white/10 p-5">
          <p className="mb-1 flex items-center gap-2 text-sm text-white/70">
            <Volume2 className="h-4 w-4" aria-hidden="true" /> Rango normativo
          </p>
          <p className="font-mono text-lg text-white/60">{NORMATIVE_RANGE_LABEL}</p>
          <p className="mt-1 text-xs text-white/60">
            Ley 37/2003 del Ruido · referencia estática, no medición
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
        <a
          href={EMERGENCY_WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp ante cualquier incidencia del seguimiento"
          className="inline-flex items-center gap-2 rounded-3xl bg-[#FF2B44] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-out hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <Phone className="h-4 w-4" aria-hidden="true" /> Emergencia WhatsApp
        </a>
      </div>
    </section>
  );
}

export default LiveFleetTracker;
