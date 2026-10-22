"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Sparkles,
  Building2,
  Landmark,
  Music,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

type RoleId = "particular" | "artista" | "finca" | "gobierno";

interface RoleTab {
  id: RoleId;
  label: string;
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}

const ROLE_TABS: ReadonlyArray<RoleTab> = [
  { id: "particular", label: "Particular", Icon: Sparkles },
  { id: "artista", label: "Artista", Icon: Music },
  { id: "finca", label: "Finca", Icon: Building2 },
  { id: "gobierno", label: "Ayuntamiento", Icon: Landmark },
];

const BASE_SOLISTA_EUR = 350;
const DEPOSIT_EUR = 100;
const ARTIST_SPLIT = 0.8;
const AGENCY_SPLIT = 0.5;
const B2G_LIMIT_EUR = 14250;

const ATMOSPHERES = ["Cóctel de gala", "Ceremonia", "Banquete", "Fiesta final"] as const;
type Atmosphere = (typeof ATMOSPHERES)[number];

const eur = (value: number): string =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value);

type DossierStatus = "idle" | "loading" | "ok" | "error";

interface DossierResponse {
  ok?: boolean;
  message?: string;
}

const CARD =
  "rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 md:p-8 transition-all duration-300 ease-out";
const CTA =
  "inline-flex items-center gap-2 rounded-full bg-[#ecb613] px-6 py-3 text-sm font-semibold text-[#030305] transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_30px_rgba(236,182,19,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] disabled:opacity-50 disabled:hover:scale-100";

function ParticularPanel(): React.JSX.Element {
  const [atmosphere, setAtmosphere] = useState<Atmosphere>("Cóctel de gala");
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h3 className="font-semibold text-xl text-white">Atmosphere Matcher</h3>
        <p className="mt-2 text-sm text-white/70">
          Elige el momento del evento y reserva con fecha blindada.
        </p>
        <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Ambiente">
          {ATMOSPHERES.map((a) => (
            <button
              key={a}
              type="button"
              role="radio"
              aria-checked={atmosphere === a}
              onClick={() => setAtmosphere(a)}
              className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 ease-out ${
                atmosphere === a
                  ? "border-[#ecb613] bg-[#ecb613]/10 text-[#ecb613]"
                  : "border-white/10 text-white/70 hover:border-white/30 hover:text-white"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-[#030305] p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-white/50">Blindaje VIP</p>
        <p className="mt-2 text-4xl font-bold text-[#ecb613]">{eur(DEPOSIT_EUR)}</p>
        <p className="mt-1 text-sm text-white/70">
          100% deducible de los {eur(BASE_SOLISTA_EUR)} base del show ({atmosphere}).
        </p>
        <Link href="/reservar/solista" className={`${CTA} mt-5`}>
          Pagar depósito con Stripe <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

function ArtistaPanel(): React.JSX.Element {
  const [gross, setGross] = useState<number>(BASE_SOLISTA_EUR);
  const safeGross = Number.isFinite(gross) && gross > 0 ? gross : 0;
  const ours = safeGross * ARTIST_SPLIT;
  const agency = safeGross * AGENCY_SPLIT;
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h3 className="font-semibold text-xl text-white">Calculador de Split Soberano</h3>
        <label htmlFor="hub-gross" className="mt-4 block text-sm text-white/70">
          Caché del show (€)
        </label>
        <input
          id="hub-gross"
          type="number"
          min={0}
          step={10}
          value={gross}
          onChange={(e) => setGross(Number(e.target.value))}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-[#030305] px-4 py-3 font-mono text-white focus:border-[#ecb613] focus:outline-none transition-all duration-300 ease-out"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-3xl border border-[#ecb613]/40 bg-[#030305] p-5">
          <p className="font-mono text-xs uppercase text-white/50">EAR OS · 80%</p>
          <p className="mt-2 text-2xl font-bold text-[#ecb613]">{eur(ours)}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-[#030305] p-5">
          <p className="font-mono text-xs uppercase text-white/50">Agencia · 50%</p>
          <p className="mt-2 text-2xl font-bold text-white/60">{eur(agency)}</p>
        </div>
        <p className="col-span-2 text-sm text-white/70">
          Ganas <span className="text-[#ecb613]">{eur(ours - agency)}</span> más por show.
        </p>
      </div>
    </div>
  );
}

function FincaPanel(): React.JSX.Element {
  const points: ReadonlyArray<string> = [
    "Escudo Acústico Ley 37/2003: limitador telemático homologado.",
    "Bodas y fincas: 85-90 dBA exterior · 80-85 dBA interior.",
    "Autofactura B2B emitida y liquidada a 7 días.",
  ];
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <ul className="space-y-3">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-3 text-sm text-white/80">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#ecb613]" aria-hidden />
            {p}
          </li>
        ))}
      </ul>
      <div className="rounded-3xl border border-white/10 bg-[#030305] p-6">
        <Shield className="h-8 w-8 text-[#ecb613]" aria-hidden />
        <p className="mt-3 text-sm text-white/70">
          Califica tu finca y activa el acuerdo de colaboración.
        </p>
        <Link href="/fincas" className={`${CTA} mt-4`}>
          Cualificar mi finca <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

function GobiernoPanel(): React.JSX.Element {
  const [amount, setAmount] = useState<number>(8000);
  const [status, setStatus] = useState<DossierStatus>("idle");
  const [feedback, setFeedback] = useState<string>("");
  const valid = Number.isFinite(amount) && amount > 0 && amount < B2G_LIMIT_EUR;

  const generate = async (): Promise<void> => {
    if (!valid) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/b2g/dossier-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = (await res.json().catch(() => ({}))) as DossierResponse;
      if (!res.ok) throw new Error(data.message ?? "Error generando dossier");
      setStatus("ok");
      setFeedback(data.message ?? "Dossier generado.");
    } catch (err: unknown) {
      setStatus("error");
      setFeedback(err instanceof Error ? err.message : "Error de red");
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h3 className="font-semibold text-xl text-white">Simulador contrato menor</h3>
        <label htmlFor="hub-b2g" className="mt-4 block text-sm text-white/70">
          Importe (€) · límite Art. 118 LCSP: {eur(B2G_LIMIT_EUR)}
        </label>
        <input
          id="hub-b2g"
          type="number"
          min={0}
          step={250}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          aria-invalid={!valid}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-[#030305] px-4 py-3 font-mono text-white focus:border-[#ecb613] focus:outline-none transition-all duration-300 ease-out"
        />
        <p className={`mt-2 text-sm ${valid ? "text-[#ecb613]" : "text-[#FF2B44]"}`} role="status">
          {valid ? "Apto como contrato menor." : "Supera el límite de contrato menor."}
        </p>
      </div>
      <div className="rounded-3xl border border-white/10 bg-[#030305] p-6">
        <button type="button" onClick={generate} disabled={!valid || status === "loading"} className={CTA}>
          {status === "loading" ? "Generando…" : "Generar dossier B2G"}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
        {feedback !== "" && (
          <p
            role="status"
            className={`mt-3 text-sm ${status === "error" ? "text-[#FF2B44]" : "text-white/80"}`}
          >
            {feedback}
          </p>
        )}
      </div>
    </div>
  );
}

export function OmniChannelHub360(): React.JSX.Element {
  const [role, setRole] = useState<RoleId>("particular");

  return (
    <section
      aria-labelledby="hub360-title"
      className="w-full overflow-x-hidden bg-[#030305] py-16 px-4"
    >
      <div className="mx-auto max-w-5xl">
        <h2 id="hub360-title" className="font-bold text-3xl md:text-4xl text-white">
          Hub 360° <span className="text-[#ecb613]">EAR OS</span>
        </h2>
        <div role="tablist" aria-label="Perfiles" className="mt-8 flex flex-wrap gap-2">
          {ROLE_TABS.map(({ id, label, Icon }) => {
            const active = role === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                id={`hub-tab-${id}`}
                aria-selected={active}
                aria-controls={`hub-panel-${id}`}
                onClick={() => setRole(id)}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition-all duration-300 ease-out ${
                  active
                    ? "border-[#ecb613] bg-[#ecb613]/10 text-[#ecb613]"
                    : "border-white/10 text-white/70 hover:border-white/30 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </button>
            );
          })}
        </div>
        <div
          role="tabpanel"
          id={`hub-panel-${role}`}
          aria-labelledby={`hub-tab-${role}`}
          className={`${CARD} mt-6`}
        >
          {role === "particular" && <ParticularPanel />}
          {role === "artista" && <ArtistaPanel />}
          {role === "finca" && <FincaPanel />}
          {role === "gobierno" && <GobiernoPanel />}
        </div>
      </div>
    </section>
  );
}

export default OmniChannelHub360;

