'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowRight,
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  Info,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';
import { ALL_SPANISH_PROVINCES } from '@/lib/constants/spain-regions-and-categories';
import {
  buildAdvisorMessage,
  describeBrief,
  displayProvince,
  evaluateJourney,
  JOURNEY_WISHES,
  type CoupleJourneyBrief,
  type JourneyEvaluation,
  type JourneyVenueRecord,
  type JourneyWishId,
  type VenueMatch,
} from '@/lib/journey/couple-journey-engine';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ASISTENTE DEL VIAJE DEL CLIENTE — PAREJA DECIDIDA
 * ════════════════════════════════════════════════════════════════════════════
 * Sustituye el salto ciego a WhatsApp por el recorrido completo:
 *
 *   1. SUEÑO             · provincia + fecha
 *   2. NECESIDADES       · invitados + deseos
 *   3. PRESUPUESTO       · presupuesto realista
 *   4. ALTERNATIVAS      · el sistema cruza el brief con el catálogo real y
 *                          explica encaje, carencias y lo que no puede verificar.
 *
 * WhatsApp aparece SOLO al final, con el brief dentro del mensaje: el asesor
 * recibe el contexto y la pareja no repite nada.
 * ════════════════════════════════════════════════════════════════════════════
 */

const CLEAN_PHONE: string = CENTRALITA_EAR_OS.replace(/\D/g, '');

type Step = 0 | 1 | 2 | 3;

const STEP_LABELS: readonly string[] = [
  'Vuestro sueño',
  'Lo que necesitáis',
  'Vuestro presupuesto',
  'Vuestras fincas',
];

/** Carga los chunks reales del Data Lake publicados en `/data/providers`. */
async function loadVenuePool(category: 'finca' | 'catering'): Promise<JourneyVenueRecord[]> {
  const manifestRes = await fetch('/data/providers/manifest.json');
  const manifest: unknown = manifestRes.ok ? await manifestRes.json() : null;
  let files: string[] = [category + '.json'];

  if (manifest && typeof manifest === 'object') {
    const entry = (manifest as Record<string, { chunks?: string[] } | undefined>)[category];
    if (entry && Array.isArray(entry.chunks) && entry.chunks.length > 0) {
      files = entry.chunks;
    }
  }

  const parts = await Promise.all(
    files.map(async (file): Promise<JourneyVenueRecord[]> => {
      try {
        const res = await fetch('/data/providers/' + file);
        if (!res.ok) return [];
        const json: unknown = await res.json();
        return Array.isArray(json) ? (json as JourneyVenueRecord[]) : [];
      } catch {
        return [];
      }
    }),
  );
  return parts.flat();
}

function TierBadge({ tier }: { readonly tier: VenueMatch['tier'] }): React.JSX.Element {
  const map: Record<VenueMatch['tier'], { label: string; className: string }> = {
    TU_FINCA: { label: 'Encaja con lo que pedís', className: 'bg-[#9A7B1C] text-white' },
    ALTERNATIVA_FIRME: { label: 'Alternativa firme', className: 'border border-[#9A7B1C] text-[#9A7B1C]' },
    EXPLORAR: { label: 'Para explorar', className: 'border border-[#E7E2D6] text-[#5B6472]' },
  };
  const item = map[tier];
  return (
    <span className={'rounded-full px-2.5 py-1 text-[11px] font-medium ' + item.className}>
      {item.label}
    </span>
  );
}

export interface CoupleJourneyWizardProps {
  /** Etiqueta del botón que abre el asistente. */
  readonly triggerLabel?: string;
  /** Categoría del catálogo real: fincas (por defecto) o catering. */
  readonly category?: 'finca' | 'catering';
  readonly className?: string;
  /**
   * Contador externo para abrir el asistente desde fuera (p. ej. desde un CTA
   * «Listo para cerrar» de la página). Cada incremento abre el modal una vez.
   */
  readonly openSignal?: number;
}

/** Fila de una finca: encaje, precio honesto, motivos y carencias. */
function VenueRow({
  match,
  active,
  onSelect,
}: {
  readonly match: VenueMatch;
  readonly active: boolean;
  readonly onSelect: () => void;
}): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={
        'w-full rounded-xl border p-3 text-left transition-colors ' +
        (active ? 'border-[#9A7B1C] bg-white' : 'border-[#E7E2D6] bg-white/60 hover:border-[#9A7B1C]')
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-semibold">{match.name}</span>
        <span className="flex items-center gap-2">
          {match.isTied ? (
            <span className="rounded-full border border-[#E7E2D6] px-2 py-0.5 text-[10px] text-[#5B6472]">
              Empatada
            </span>
          ) : null}
          <TierBadge tier={match.tier} />
          <span className="text-[13px] font-bold text-[#9A7B1C]">{match.score} %</span>
        </span>
      </div>
      <p className="mt-1 text-[11px] text-[#5B6472]">
        {match.municipality ?? displayProvince(match.province)} · {match.priceNote}
      </p>
      <ul className="mt-2 space-y-1">
        {match.matched.slice(0, 2).map((reason) => (
          <li key={reason.code} className="flex items-start gap-1.5 text-[11px] text-[#14141A]">
            <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-700" />
            {reason.detail}
          </li>
        ))}
        {match.gaps.slice(0, 2).map((gap) => (
          <li key={gap.code} className="flex items-start gap-1.5 text-[11px] text-[#5B6472]">
            <Info className="mt-0.5 h-3 w-3 shrink-0 text-[#9A7B1C]" />
            {gap.detail}
          </li>
        ))}
      </ul>
    </button>
  );
}

/** Panel de transparencia: lo que el catálogo no permite afirmar. */
function DisclosurePanel({ notes }: { readonly notes: readonly string[] }): React.JSX.Element {
  return (
    <div className="rounded-xl border border-[#E7E2D6] bg-white p-3">
      <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[#5B6472]">
        <ShieldCheck className="h-3.5 w-3.5 text-[#9A7B1C]" /> Lo que no os vamos a inventar
      </p>
      <ul className="mt-2 space-y-1.5">
        {notes.map((note) => (
          <li key={note} className="text-[11px] leading-[1.5] text-[#5B6472]">
            · {note}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CoupleJourneyWizard({
  triggerLabel = 'Buscar mis fincas',
  category = 'finca',
  className,
  openSignal = 0,
}: CoupleJourneyWizardProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>(0);
  const [mounted, setMounted] = useState(false);

  // Apertura gobernada desde fuera (CTA de la etapa HOT).
  useEffect(() => {
    if (openSignal > 0) setOpen(true);
  }, [openSignal]);

  // El brief declarado por la pareja.
  const [province, setProvince] = useState<string>('');
  const [locality, setLocality] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [guests, setGuests] = useState<number>(120);
  const [budgetEur, setBudgetEur] = useState<number>(18000);
  const [wishes, setWishes] = useState<JourneyWishId[]>(['EXCLUSIVITY', 'GARDENS']);

  // Catálogo real y evaluación.
  const [pool, setPool] = useState<JourneyVenueRecord[]>([]);
  const [poolError, setPoolError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<JourneyEvaluation | null>(null);
  const [selected, setSelected] = useState<VenueMatch | null>(null);

  useEffect(() => setMounted(true), []);

  // Bloqueo de scroll + cierre con Escape mientras está abierto.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const brief: CoupleJourneyBrief = useMemo(
    () => ({ province, date, guests, budgetEur, wishes, locality }),
    [province, date, guests, budgetEur, wishes, locality],
  );

  const toggleWish = useCallback((wish: JourneyWishId) => {
    setWishes((current) =>
      current.includes(wish) ? current.filter((w) => w !== wish) : [...current, wish],
    );
  }, []);

  /** Paso 4: carga el catálogo real y cruza el brief contra él. */
  const runMatching = useCallback(async () => {
    setLoading(true);
    setPoolError(null);
    try {
      const venues = pool.length > 0 ? pool : await loadVenuePool(category);
      if (venues.length === 0) {
        setPoolError('No hemos podido cargar el catálogo en este momento.');
        return;
      }
      setPool(venues);
      const result = evaluateJourney(venues, brief, 6);
      setEvaluation(result);
      setSelected(result.results.length > 0 ? result.results[0] : null);
      setStep(3);
    } catch {
      setPoolError('No hemos podido cargar el catálogo en este momento.');
    } finally {
      setLoading(false);
    }
  }, [brief, category, pool]);

  const restart = useCallback(() => {
    setStep(0);
    setEvaluation(null);
    setSelected(null);
  }, []);

  const waHref = useMemo(() => {
    if (!evaluation) return null;
    return (
      'https://wa.me/' +
      CLEAN_PHONE +
      '?text=' +
      encodeURIComponent(buildAdvisorMessage(evaluation, selected))
    );
  }, [evaluation, selected]);

  const briefSummary = evaluation ? describeBrief(evaluation.brief) : [];

  const trigger = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={
        className ??
        'inline-flex items-center gap-2 rounded-full bg-[#9A7B1C] px-5 py-3 text-[13px] font-medium text-white'
      }
    >
      <Search className="h-4 w-4" />
      {triggerLabel}
    </button>
  );

  if (!mounted) return trigger;

  return (
    <>
      {trigger}
      {open
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="journey-title"
              className="fixed inset-0 z-[120] overflow-y-auto bg-black/70 p-3 sm:p-6"
            >
              <div className="mx-auto w-full max-w-3xl rounded-2xl bg-[#FAF8F3] text-[#14141A] shadow-2xl">
                {/* Cabecera */}
                <div className="flex items-start justify-between gap-4 border-b border-[#E7E2D6] p-5">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9A7B1C]">
                      Paso {step + 1} de 4
                    </p>
                    <h2 id="journey-title" className="mt-1 text-[19px] font-semibold tracking-[-0.01em]">
                      {STEP_LABELS[step]}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Cerrar el asistente"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E7E2D6] hover:border-[#9A7B1C]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Progreso */}
                <div className="flex gap-1.5 px-5 pt-4">
                  {STEP_LABELS.map((label, index) => (
                    <span
                      key={label}
                      aria-hidden="true"
                      className={
                        'h-1 flex-1 rounded-full ' + (index <= step ? 'bg-[#9A7B1C]' : 'bg-[#E7E2D6]')
                      }
                    />
                  ))}
                </div>

                <div className="p-5">
                  {/* ── PASO 1 · SUEÑO ─────────────────────────────────── */}
                  {step === 0 ? (
                    <div className="space-y-5">
                      <p className="text-[13px] leading-[1.6] text-[#5B6472]">
                        Empezamos por lo que ya sabéis. Si aún no tenéis fecha, dejadla en blanco: os
                        enseñaremos igual las fincas y el asesor confirma disponibilidad.
                      </p>

                      <label className="block">
                        <span className="flex items-center gap-2 text-[12px] font-medium">
                          <MapPin className="h-4 w-4 text-[#9A7B1C]" /> ¿Dónde os gustaría celebrarlo?
                        </span>
                        <select
                          value={province}
                          onChange={(event) => setProvince(event.target.value)}
                          className="mt-2 w-full rounded-xl border border-[#E7E2D6] bg-white px-3 py-2.5 text-[13px] outline-none focus:border-[#9A7B1C]"
                        >
                          <option value="">Toda España (que me sorprendan)</option>
                          {ALL_SPANISH_PROVINCES.map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="block">
                        <span className="flex items-center gap-2 text-[12px] font-medium">
                          <MapPin className="h-4 w-4 text-[#9A7B1C]" /> Pueblo o comarca (opcional)
                        </span>
                        <input
                          type="text"
                          value={locality}
                          onChange={(event) => setLocality(event.target.value)}
                          placeholder="Ej. El Escorial, Colmenar Viejo…"
                          className="mt-2 w-full rounded-xl border border-[#E7E2D6] bg-white px-3 py-2.5 text-[13px] outline-none focus:border-[#9A7B1C]"
                        />
                      </label>

                      <label className="block">
                        <span className="flex items-center gap-2 text-[12px] font-medium">
                          <CalendarDays className="h-4 w-4 text-[#9A7B1C]" /> Fecha (opcional)
                        </span>
                        <input
                          type="date"
                          value={date}
                          onChange={(event) => setDate(event.target.value)}
                          className="mt-2 w-full rounded-xl border border-[#E7E2D6] bg-white px-3 py-2.5 text-[13px] outline-none focus:border-[#9A7B1C]"
                        />
                      </label>
                    </div>
                  ) : null}

                  {/* ── PASO 2 · NECESIDADES ───────────────────────────── */}
                  {step === 1 ? (
                    <div className="space-y-5">
                      <div>
                        <span className="flex items-center gap-2 text-[12px] font-medium">
                          <Users className="h-4 w-4 text-[#9A7B1C]" /> ¿Cuántos seréis?
                        </span>
                        <div className="mt-2 flex items-center gap-3">
                          <input
                            type="range"
                            min={20}
                            max={600}
                            step={10}
                            value={guests}
                            aria-label="Número de comensales"
                            onChange={(event) => setGuests(Number(event.target.value))}
                            className="w-full accent-[#9A7B1C]"
                          />
                          <span className="w-24 shrink-0 text-right text-[13px] font-semibold">
                            {guests} pers.
                          </span>
                        </div>
                      </div>

                      <fieldset>
                        <legend className="text-[12px] font-medium">Lo que no queréis negociar</legend>
                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                          {JOURNEY_WISHES.map((wish) => {
                            const active = wishes.includes(wish.id);
                            return (
                              <button
                                key={wish.id}
                                type="button"
                                aria-pressed={active}
                                onClick={() => toggleWish(wish.id)}
                                className={
                                  'rounded-xl border p-3 text-left transition-colors ' +
                                  (active
                                    ? 'border-[#9A7B1C] bg-[#9A7B1C]/5'
                                    : 'border-[#E7E2D6] hover:border-[#9A7B1C]')
                                }
                              >
                                <span className="flex items-center gap-2 text-[13px] font-medium">
                                  {active ? <Check className="h-3.5 w-3.5 text-[#9A7B1C]" /> : null}
                                  {wish.label}
                                </span>
                                <span className="mt-1 block text-[11px] leading-[1.5] text-[#5B6472]">
                                  {wish.hint}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </fieldset>
                    </div>
                  ) : null}

                  {/* ── PASO 3 · PRESUPUESTO ───────────────────────────── */}
                  {step === 2 ? (
                    <div className="space-y-5">
                      <p className="text-[13px] leading-[1.6] text-[#5B6472]">
                        Decid un presupuesto realista para todo el evento. No es un compromiso: sirve para
                        que no os enseñemos fincas que no podéis pagar, ni os escondamos las que sí.
                      </p>
                      <div>
                        <span className="flex items-center gap-2 text-[12px] font-medium">
                          <Wallet className="h-4 w-4 text-[#9A7B1C]" /> Presupuesto total
                        </span>
                        <div className="mt-2 flex items-center gap-3">
                          <input
                            type="range"
                            min={3000}
                            max={60000}
                            step={500}
                            value={budgetEur}
                            aria-label="Presupuesto total en euros"
                            onChange={(event) => setBudgetEur(Number(event.target.value))}
                            className="w-full accent-[#9A7B1C]"
                          />
                          <span className="w-28 shrink-0 text-right text-[13px] font-semibold">
                            {new Intl.NumberFormat('es-ES').format(budgetEur)} €
                          </span>
                        </div>
                      </div>

                      <p className="flex items-start gap-2 rounded-xl border border-[#E7E2D6] bg-white p-3 text-[11px] leading-[1.5] text-[#5B6472]">
                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#9A7B1C]" />
                        Solo usamos precios que el proveedor publica. Si una finca no publica tarifa, lo
                        veréis marcado y el precio se cierra con vosotros.
                      </p>
                      {poolError ? (
                        <p className="text-[12px] text-red-700" role="alert">
                          {poolError}
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  {/* ── PASO 4 · ALTERNATIVAS ──────────────────────────── */}
                  {step === 3 && evaluation ? (
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {briefSummary.map((item) => (
                          <div key={item.label} className="rounded-xl border border-[#E7E2D6] bg-white p-2.5">
                            <span className="block text-[10px] uppercase tracking-[0.12em] text-[#5B6472]">
                              {item.label}
                            </span>
                            <span className="mt-0.5 block text-[12px] font-semibold">{item.value}</span>
                          </div>
                        ))}
                      </div>

                      <p className="text-[12px] leading-[1.6] text-[#5B6472]">
                        Hemos analizado <strong>{evaluation.totalPool}</strong> fincas del catálogo real y
                        ordenado las que mejor encajan con lo que nos habéis contado.
                      </p>

                      {evaluation.results.length === 0 ? (
                        <p className="rounded-xl border border-[#E7E2D6] bg-white p-4 text-[12px]">
                          No hemos encontrado fincas que encajen con estos criterios. Ampliad la provincia o
                          el presupuesto, o hablad con el asesor.
                        </p>
                      ) : (
                        <ul className="space-y-2">
                          {evaluation.results.map((match) => (
                            <li key={match.slug}>
                              <VenueRow
                                match={match}
                                active={selected?.slug === match.slug}
                                onSelect={() => setSelected(match)}
                              />
                            </li>
                          ))}
                        </ul>
                      )}

                      {evaluation.disclosures.length > 0 ? (
                        <DisclosurePanel notes={evaluation.disclosures} />
                      ) : null}
                    </div>
                  ) : null}

                  {/* Navegación */}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#E7E2D6] pt-4">
                    <div className="flex gap-2">
                      {step > 0 ? (
                        <button
                          type="button"
                          onClick={() => (evaluation ? restart() : setStep((s) => (s - 1) as Step))}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E2D6] px-4 py-2 text-[12px] font-medium hover:border-[#9A7B1C]"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                          {evaluation ? 'Empezar de nuevo' : 'Atrás'}
                        </button>
                      ) : null}
                    </div>

                    <div className="flex gap-2">
                      {step === 0 ? (
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="inline-flex items-center gap-2 rounded-full bg-[#9A7B1C] px-5 py-2.5 text-[13px] font-medium text-white"
                        >
                          Continuar <ArrowRight className="h-4 w-4" />
                        </button>
                      ) : null}
                      {step === 1 ? (
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="inline-flex items-center gap-2 rounded-full bg-[#9A7B1C] px-5 py-2.5 text-[13px] font-medium text-white"
                        >
                          Continuar <ArrowRight className="h-4 w-4" />
                        </button>
                      ) : null}
                      {step === 2 ? (
                        <button
                          type="button"
                          onClick={() => void runMatching()}
                          disabled={loading}
                          className="inline-flex items-center gap-2 rounded-full bg-[#9A7B1C] px-5 py-2.5 text-[13px] font-medium text-white disabled:opacity-60"
                        >
                          {loading ? 'Analizando el catálogo…' : 'Ver mis fincas'}
                          {loading ? null : <Sparkles className="h-4 w-4" />}
                        </button>
                      ) : null}
                      {step === 3 && waHref ? (
                        <a
                          href={waHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-[#14141A] px-5 py-2.5 text-[13px] font-medium text-white"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Cerrar con un asesor
                        </a>
                      ) : null}
                    </div>
                  </div>

                  {step === 3 && evaluation ? (
                    <p className="mt-3 text-[11px] leading-[1.5] text-[#5B6472]">
                      El asesor recibe vuestro brief completo; no tendréis que repetirlo. La reserva se
                      bloquea con un depósito de {evaluation.depositEur} €, deducible del importe final.{' '}
                      <Link href="/confianza" className="underline hover:text-[#14141A]">
                        Cómo funciona
                      </Link>
                    </p>
                  ) : null}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

export default CoupleJourneyWizard;
