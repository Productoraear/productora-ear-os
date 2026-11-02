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
  Lock,
  Unlock,
} from "lucide-react";
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  SAFE_LCSP_CEILING_EUR,
  SPLIT_SOBERANO,
} from "@/lib/constants/ear-os-ssot";
import {
  BUDGET_CATEGORIES,
  BudgetEngineError,
  TRADITIONAL_AGENCY_SPLIT,
  assertBalanced,
  centsToEur,
  createAllocation,
  setCategoryAmount,
  toggleLock,
  type BudgetAllocation,
  type BudgetCategoryId,
} from "@/lib/budget/budget-allocator-engine";

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

/**
 * Los importes canónicos NO viven aquí: se leen del SSOT (INV-10).
 * El reparto del presupuesto lo calcula `budget-allocator-engine` en céntimos.
 */

/**
 * Etiqueta del reparto canónico derivada del motor, no escrita a mano.
 * Si mañana cambia un peso en `BUDGET_CATEGORIES`, el titular cambia con él:
 * un porcentaje en copy que no nace de la fuente es una promesa que miente sola.
 */
const CANONICAL_SHARES_LABEL: string = BUDGET_CATEGORIES.map((rule) => String(rule.weight)).join(
  " / ",
);

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

/** Traduce un error del motor a copy de interfaz, sin jerga y sin ocultar la causa. */
function readableEngineError(error: unknown): string {
  if (error instanceof BudgetEngineError) {
    switch (error.code) {
      case "LOCKED_CATEGORY":
        return "Esa categoría tiene candado: desbloquéala para mover el importe.";
      case "INVALID_TOTAL":
        return "Importe no válido: debe ser un número positivo y caber en el presupuesto.";
      case "BALANCE_VIOLATION":
        return "El reparto no cuadra al céntimo. Operación cancelada.";
      case "NEGATIVE_AMOUNT":
        return "Una oferta no puede ser negativa.";
      case "UNKNOWN_CATEGORY":
        return "Categoría desconocida.";
      default:
        return "Operación rechazada por el motor de reparto.";
    }
  }
  return "Operación rechazada por el motor de reparto.";
}

/**
 * Motor Magia Negra (§5 MASTER AUDIT): reparto 50/15/15/10/10 con candados 🔒.
 * Todo el cálculo ocurre en céntimos enteros dentro de `budget-allocator-engine`;
 * este componente solo pinta y dispara operaciones inmutables.
 */
function BudgetAllocatorPanel(): React.JSX.Element {
  const [allocation, setAllocation] = useState<BudgetAllocation>(() => createAllocation(20_000));
  const [error, setError] = useState<string>("");

  const apply = (operation: () => BudgetAllocation): void => {
    try {
      setAllocation(operation());
      setError("");
    } catch (err) {
      setError(readableEngineError(err));
    }
  };

  const handleTotal = (value: number): void => {
    apply(() => createAllocation(value, allocation.locked));
  };

  const handleAmount = (id: BudgetCategoryId, value: number): void => {
    apply(() => setCategoryAmount(allocation, id, value));
  };

  const handleLock = (id: BudgetCategoryId): void => {
    apply(() => toggleLock(allocation, id, !allocation.locked.includes(id)));
  };

  let balanced = false;
  try {
    balanced = assertBalanced(allocation);
  } catch {
    balanced = false;
  }

  let statusText = "El reparto no cuadra.";
  if (error !== "") {
    statusText = error;
  } else if (balanced) {
    statusText = "Cuadre exacto al céntimo: la suma de las 5 categorías es el presupuesto total.";
  }
  return (
    <div className="rounded-3xl border border-white/10 bg-[#030305] p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-white/50">
            Motor Magia Negra · Reparto de presupuesto
          </p>
          <h3 className="mt-2 font-semibold text-xl text-white">
            {CANONICAL_SHARES_LABEL}, al céntimo
          </h3>
        </div>
        <div>
          <label htmlFor="hub-budget-total" className="block text-sm text-white/70">
            Presupuesto total (€)
          </label>
          <input
            id="hub-budget-total"
            type="number"
            min={0}
            step={500}
            value={centsToEur(allocation.totalCents)}
            onChange={(event) => handleTotal(Number(event.target.value))}
            className="mt-2 w-40 rounded-2xl border border-white/10 bg-[#09090d] px-4 py-3 font-mono text-white focus:border-[#ecb613] focus:outline-none transition-all duration-300 ease-out"
          />
        </div>
      </div>

      <ul className="mt-6 space-y-3">
        {BUDGET_CATEGORIES.map((rule) => {
          const amountCents = allocation.amountsCents[rule.id];
          const share = allocation.totalCents === 0 ? 0 : (amountCents / allocation.totalCents) * 100;
          const isLocked = allocation.locked.includes(rule.id);
          return (
            <li key={rule.id} className="rounded-2xl border border-white/10 bg-[#09090d]/80 p-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="min-w-[9rem] flex-1 text-sm text-white/80">{rule.label}</span>
                <input
                  aria-label={`Importe de ${rule.label}`}
                  type="number"
                  min={0}
                  step={50}
                  value={centsToEur(amountCents)}
                  onChange={(event) => handleAmount(rule.id, Number(event.target.value))}
                  disabled={isLocked}
                  className="w-32 rounded-xl border border-white/10 bg-[#030305] px-3 py-2 text-right font-mono text-sm text-[#ecb613] focus:border-[#ecb613] focus:outline-none disabled:opacity-50 transition-all duration-300 ease-out"
                />
                <button
                  type="button"
                  onClick={() => handleLock(rule.id)}
                  aria-pressed={isLocked}
                  aria-label={isLocked ? `Desbloquear ${rule.label}` : `Bloquear ${rule.label}`}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 ease-out ${
                    isLocked
                      ? "border-[#ecb613] bg-[#ecb613]/15 text-[#ecb613]"
                      : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {isLocked ? <Lock className="h-4 w-4" aria-hidden /> : <Unlock className="h-4 w-4" aria-hidden />}
                </button>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#ecb613]"
                  style={{ width: `${Math.min(share, 100)}%` }}
                />
              </div>
              <p className="mt-1 font-mono text-[11px] text-white/40">{share.toFixed(1)}% del total</p>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p role="status" className={`text-sm ${error === "" ? "text-white/60" : "text-[#FF2B44]"}`}>
          {statusText}
        </p>
        <p className="font-mono text-xs text-white/50">
          SSOT: {eur(TARIFA_BASE_SOLISTA_EUR)} solista · {eur(DEPOSITO_STRIPE_EUR)} depósito
        </p>
      </div>
    </div>
  );
}

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
        <p className="mt-2 text-4xl font-bold text-[#ecb613]">{eur(DEPOSITO_STRIPE_EUR)}</p>
        <p className="mt-1 text-sm text-white/70">
          100% deducible de los {eur(TARIFA_BASE_SOLISTA_EUR)} base del show ({atmosphere}).
        </p>
        <Link href="/reservar/solista" className={`${CTA} mt-5`}>
          Pagar depósito con Stripe <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
      <div className="md:col-span-2">
        <BudgetAllocatorPanel />
      </div>
    </div>
  );
}

function ArtistaPanel(): React.JSX.Element {
  const [gross, setGross] = useState<number>(TARIFA_BASE_SOLISTA_EUR);
  const safeGross = Number.isFinite(gross) && gross > 0 ? gross : 0;
  const ours = safeGross * SPLIT_SOBERANO.artista;
  const agency = safeGross * TRADITIONAL_AGENCY_SPLIT;
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
          <p className="font-mono text-xs uppercase text-white/50">
            Artista · {Math.round(SPLIT_SOBERANO.artista * 100)}%
          </p>
          <p className="mt-2 text-2xl font-bold text-[#ecb613]">{eur(ours)}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-[#030305] p-5">
          <p className="font-mono text-xs uppercase text-white/50">
            Agencia tradicional · {Math.round(TRADITIONAL_AGENCY_SPLIT * 100)}%
          </p>
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
  const valid = Number.isFinite(amount) && amount > 0 && amount < SAFE_LCSP_CEILING_EUR;

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
          Importe (€) · límite Art. 118 LCSP: {eur(SAFE_LCSP_CEILING_EUR)}
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

