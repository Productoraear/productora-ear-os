'use client';

/**
 * 🧾 RECIBO DE AGENTES — prueba visible de que el formulario habló con la flota.
 * ----------------------------------------------------------------------------
 * Presentacional puro (cero estado, cero efectos): recibe el `FormIntakeResult`
 * ya calculado en servidor y lo muestra con estética OLED S-Class.
 * Reserva altura mínima propia para no aportar CLS al modal que lo hospeda.
 * ----------------------------------------------------------------------------
 */
import Link from 'next/link';
import type { ReactElement } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Euro,
  MessageCircle,
  Radar,
  ShieldCheck,
  Volume2,
} from 'lucide-react';
import type { FormIntakeResult, IntakeStep } from '@/lib/agents/formIntakeTypes';

interface AgentIntakeReceiptProps {
  readonly result: FormIntakeResult;
  readonly className?: string;
}

function formatEur(value: number): string {
  return `${value.toFixed(2).replace('.', ',')} €`;
}

const DISTANCE_LABEL: Readonly<Record<string, string>> = {
  explicit: 'distancia declarada',
  city: 'población verificada',
  category: 'recinto homologado',
  default: 'estimación de red',
};

const ACTION_ICON = {
  stripe: ShieldCheck,
  whatsapp: MessageCircle,
} as const;

export function AgentIntakeReceipt({ result, className = '' }: AgentIntakeReceiptProps): ReactElement {
  const ActionIcon = ACTION_ICON[result.nextAction.kind];
  const quote = result.quote;

  return (
    <section
      aria-live="polite"
      aria-label="Veredicto de la flota de agentes"
      className={`min-h-[220px] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#09090d]/80 p-5 text-left backdrop-blur-md transition-all duration-300 ease-out ${className}`}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 rounded-2xl border border-[#ecb613]/30 bg-[#ecb613]/10 p-2 text-[#ecb613]">
            <Radar className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ecb613]">
              Flota Ω · {result.qualified ? 'lead cualificado' : 'solicitud en revisión'}
            </p>
            <p className="mt-1 text-sm font-semibold text-white">{result.headline}</p>
            <p className="mt-1 font-mono text-[11px] text-white/45">
              {result.agentUsed} · {result.intakeId}
            </p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-mono text-xl font-bold text-white">{result.score}</p>
          <p className="text-[10px] uppercase tracking-[0.14em] text-white/40">score</p>
        </div>
      </header>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10" role="presentation">
        <div
          className="h-full rounded-full bg-[#ecb613] transition-all duration-500 ease-out"
          style={{ width: `${Math.max(4, Math.min(100, result.score))}%` }}
        />
      </div>

      <ul className="mt-4 space-y-2">
        {result.steps.map((step: IntakeStep) => (
          <li
            key={`${step.agent}-${step.intent}`}
            className="flex items-start gap-2 rounded-2xl border border-white/5 bg-white/[0.02] px-3 py-2"
          >
            {step.ok ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
            ) : (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#FF2B44]" aria-hidden="true" />
            )}
            <span className="min-w-0">
              <span className="block font-mono text-[11px] text-white/70">{step.agent}</span>
              <span className="block text-xs text-white/55">{step.summary}</span>
            </span>
          </li>
        ))}
      </ul>

      {quote ? (
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-3 sm:grid-cols-4">
          <div>
            <p className="flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] text-white/40">
              <Euro className="h-3 w-3" aria-hidden="true" /> Total
            </p>
            <p className="mt-0.5 font-mono text-sm font-bold text-white">{formatEur(quote.total)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] text-white/40">Depósito</p>
            <p className="mt-0.5 font-mono text-sm font-bold text-[#ecb613]">{formatEur(quote.deposito)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] text-white/40">Resto</p>
            <p className="mt-0.5 font-mono text-sm text-white/80">{formatEur(quote.restoTrasDeposito)}</p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] text-white/40">
              <Volume2 className="h-3 w-3" aria-hidden="true" /> Rider
            </p>
            <p className="mt-0.5 font-mono text-sm text-white/80">
              {quote.minDba}-{quote.maxDba} dBA
            </p>
          </div>
          <p className="col-span-2 text-[11px] text-white/40 sm:col-span-4">
            {quote.distanceKm} km · {DISTANCE_LABEL[quote.distanceSource] ?? 'estimación'} · {quote.watts} W
          </p>
        </div>
      ) : null}

      <Link
        href={result.nextAction.href}
        className="mt-4 flex w-full items-center justify-between gap-2 rounded-2xl border border-[#ecb613]/40 bg-[#ecb613]/10 px-4 py-3 text-sm font-semibold text-[#ecb613] transition-all duration-300 ease-out hover:border-[#ecb613] hover:bg-[#ecb613]/20"
      >
        <span className="flex items-center gap-2">
          <ActionIcon className="h-4 w-4" aria-hidden="true" />
          {result.nextAction.label}
        </span>
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>

      <p className="mt-3 font-mono text-[10px] text-white/30">
        {result.duplicate ? 'idempotente · ya registrado · ' : ''}
        {result.ledgered ? 'traza sellada en ledger' : 'traza no persistida (solo memoria)'}
      </p>
    </section>
  );
}
