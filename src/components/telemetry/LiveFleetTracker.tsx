"use client";

import React, { useEffect, useState } from "react";
import { Truck, CheckCircle2, Clock, Volume2, Phone } from "lucide-react";

interface MissionStage {
  readonly key: string;
  readonly label: string;
}

interface LiveFleetTrackerProps {
  readonly missionId: string;
  readonly initialStage?: number;
  readonly etaMinutes?: number;
}

const STAGES: readonly MissionStage[] = [
  { key: "contract", label: "Contrato y Depósito Firmado" },
  { key: "route", label: "En Ruta (GPS Hub Méntrida)" },
  { key: "setup", label: "Llegada y Montaje" },
  { key: "soundcheck", label: "Soundcheck Acústico (<85 dB)" },
  { key: "show", label: "Show en Curso" },
];

const EMERGENCY_WHATSAPP = "https://wa.me/34693693048";
const ACOUSTIC_LIMIT_DB = 85;

export function LiveFleetTracker({
  missionId,
  initialStage = 1,
  etaMinutes = 45,
}: LiveFleetTrackerProps): React.JSX.Element {
  const lastIndex = STAGES.length - 1;
  const [stage, setStage] = useState<number>(
    Math.min(Math.max(Math.trunc(initialStage), 0), lastIndex)
  );
  const [eta, setEta] = useState<number>(Math.max(0, Math.trunc(etaMinutes)));
  const [spl, setSpl] = useState<number>(78);

  useEffect(() => {
    if (stage !== 1 || eta <= 0) return;
    const timer = window.setInterval(() => {
      setEta((prev) => Math.max(0, prev - 1));
    }, 60000);
    return () => window.clearInterval(timer);
  }, [stage, eta]);

  useEffect(() => {
    if (stage < 3) return;
    const timer = window.setInterval(() => {
      setSpl(Math.round((76 + Math.random() * 8) * 10) / 10);
    }, 2000);
    return () => window.clearInterval(timer);
  }, [stage]);

  const compliant = spl < ACOUSTIC_LIMIT_DB;
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
          const active = i === stage;
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
            <Clock className="h-4 w-4" aria-hidden="true" /> ETA de llegada
          </p>
          <p className="font-mono text-3xl font-bold text-[#00E5FF]">
            {stage <= 1 ? `${eta} min` : "Llegado"}
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 p-5">
          <p className="mb-1 flex items-center gap-2 text-sm text-white/70">
            <Volume2 className="h-4 w-4" aria-hidden="true" /> Certificado acústico
          </p>
          {stage >= 3 ? (
            <p
              className={`font-mono text-3xl font-bold ${
                compliant ? "text-[#00E5FF]" : "text-[#FF2B44]"
              }`}
            >
              {spl.toFixed(1)} dBA
            </p>
          ) : (
            <p className="font-mono text-lg text-white/60">Pendiente de soundcheck</p>
          )}
          <p className="mt-1 text-xs text-white/60">
            Límite {ACOUSTIC_LIMIT_DB} dBA · Ley 37/2003
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
        <a
          href={EMERGENCY_WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-3xl bg-[#FF2B44] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-out hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <Phone className="h-4 w-4" aria-hidden="true" /> Emergencia WhatsApp
        </a>
        {stage < lastIndex && (
          <button
            type="button"
            onClick={() => setStage((prev) => Math.min(prev + 1, lastIndex))}
            className="rounded-3xl border border-white/10 px-5 py-3 text-sm text-white/80 transition-all duration-300 ease-out hover:bg-white/10"
          >
            Avanzar fase (demo)
          </button>
        )}
      </div>
    </section>
  );
}

export default LiveFleetTracker;
