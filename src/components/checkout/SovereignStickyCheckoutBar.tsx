'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, CreditCard, Loader2, Lock } from 'lucide-react';
import {
  CENTRALITA_EAR_OS,
  DEPOSITO_STRIPE_EUR,
  TARIFA_BASE_SOLISTA_EUR,
} from '@/lib/constants/ear-os-ssot';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * TERMINAL DE PAGO FLOTANTE — SOVEREIGN STICKY CHECKOUT BAR
 * ════════════════════════════════════════════════════════════════════════════
 * BuyBox persistente del Scrollytelling Cash-Tunnel. NO es decoración: cada
 * acto tiene un único destino cableado a la pasarela real.
 *
 *   · Acto 01 → `/checkout/presupuesto` (banquete Otzarreta, depósito deducible).
 *   · Acto 02 → POST `/api/reservar/solista/deposit` → Stripe Checkout.
 *   · Acto 03 → POST `/api/reservar/solista/deposit` (planner + fianza).
 *   · Acto 04 → `/licitaciones/expediente` (pliego B2G · rider).
 *
 * INV-10 · AF-4: TODOS los importes nacen del SSOT (`ear-os-ssot.ts`). Prohibido
 * un literal de precio en la vista. El depósito se materializa contra la ruta de
 * cobro ya existente: cero botones huérfanos, cero redirecciones de fachada.
 *
 * GEOMETRÍA (INV-18 · G-7 · CLS 0.000): la capa es `fixed` (fuera del flujo) y
 * la altura interna está bloqueada; el aviso de estado vive en una línea de
 * alto fijo, por lo que ni la carga de Stripe ni un error mueven el layout.
 *
 * ZONA SEGURA (Ω-CTA · G01): el dock móvil ocupa `--ear-dock-h`. La barra se
 * ancla por encima en móvil y a `bottom-4` en escritorio, declarando su gate
 * de breakpoint para no solapar la superficie única del viewport.
 * ════════════════════════════════════════════════════════════════════════════
 */

/** Índice de acto del túnel (0-based), compartido con el orquestador. */
export type CashTunnelActIndex = 0 | 1 | 2 | 3;

interface ActTerminal {
  readonly code: string;
  readonly title: string;
  readonly label: string;
  readonly kind: 'navigate' | 'deposit';
  readonly href?: string;
  readonly formato?: string;
}

/** Etiqueta del depósito derivada del SSOT (jamás un «100 €» hardcodeado). */
const DEPOSITO_LABEL = `${DEPOSITO_STRIPE_EUR.toFixed(0)} €`;

/** Configuración canónica del botón primario por acto. */
const ACT_TERMINALS: readonly ActTerminal[] = Object.freeze([
  {
    code: '01',
    title: 'Restauración & Fincas Singulares',
    kind: 'navigate',
    href: '/checkout/presupuesto?venue=restaurante-otzarreta',
    label: `Bloquear Fecha Banquete (Depósito ${DEPOSITO_LABEL})`,
  },
  {
    code: '02',
    title: 'Música en Directo · Solista de Gala',
    kind: 'deposit',
    formato: 'solista',
    label: `Price-Lock Solista (Fianza ${DEPOSITO_LABEL} Deducible)`,
  },
  {
    code: '03',
    title: 'Seating Planner & Maître Digital',
    kind: 'deposit',
    formato: 'seating-planner',
    label: 'Bloquear Plano y Fecha (Planner 3D de Cortesía)',
  },
  {
    code: '04',
    title: 'Producción Técnica & Licitaciones B2G',
    kind: 'navigate',
    href: '/licitaciones/expediente',
    label: 'Descargar Pliego B2G o Reservar Rider',
  },
]);

/** Extrae la URL de checkout de la respuesta de la ruta de cobro (sin `any`). */
function readCheckoutUrl(payload: unknown): string | null {
  if (typeof payload !== 'object' || payload === null) return null;
  const url = (payload as Record<string, unknown>).url;
  return typeof url === 'string' && /^https?:\/\//i.test(url) ? url : null;
}

/** Extrae el mensaje de error declarado por la ruta de cobro (sin `any`). */
function readErrorMessage(payload: unknown): string | null {
  if (typeof payload !== 'object' || payload === null) return null;
  const error = (payload as Record<string, unknown>).error;
  return typeof error === 'string' && error.length > 0 ? error : null;
}

/** Próximo sábado determinista (día natural más cercano con agenda comercial). */
function nextSaturdayIso(from: Date): string {
  const day = from.getDay(); // 0 = domingo … 6 = sábado
  const delta = (6 - day + 7) % 7 || 7;
  return new Date(from.getTime() + delta * 86_400_000).toISOString().slice(0, 10);
}

export interface SovereignStickyCheckoutBarProps {
  readonly activeAct: CashTunnelActIndex;
}

export function SovereignStickyCheckoutBar({
  activeAct,
}: SovereignStickyCheckoutBarProps): React.JSX.Element {
  const terminal = ACT_TERMINALS[activeAct] ?? ACT_TERMINALS[0];
  const [fecha, setFecha] = useState<string>('');
  const [minDate, setMinDate] = useState<string>('');
  const [pending, setPending] = useState<boolean>(false);
  const [notice, setNotice] = useState<string>('');

  // Fechas resueltas en cliente tras hidratar: markup servidor ↔ cliente idéntico
  // (cero avisos de hidratación, cero parpadeo de layout).
  useEffect(() => {
    const now = new Date();
    setMinDate(now.toISOString().slice(0, 10));
    setFecha(nextSaturdayIso(now));
  }, []);

  const startDeposit = useCallback(
    async (formato: string): Promise<void> => {
      if (fecha.trim().length === 0) {
        setNotice('Selecciona la fecha del evento para bloquearla con la fianza.');
        return;
      }
      setPending(true);
      setNotice('');
      try {
        const response = await fetch('/api/reservar/solista/deposit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fecha,
            formato,
            // Metadatos del candado: la fianza es fija (SSOT); la distancia se
            // refina en el configurador completo antes de la liquidación.
            distanciaKm: 0,
            totalEstimado: TARIFA_BASE_SOLISTA_EUR,
            idempotencyKey: `cashtunnel-${formato}-${fecha}`.replace(/[^A-Za-z0-9_-]/g, '-'),
          }),
        });
        const payload: unknown = await response.json().catch(() => null);
        const url = readCheckoutUrl(payload);
        if (url !== null) {
          window.location.assign(url);
          return;
        }
        setNotice(
          readErrorMessage(payload) ??
            `No se pudo abrir la pasarela. Reintenta o llama al ${CENTRALITA_EAR_OS}.`
        );
      } catch {
        setNotice(`Sin conexión con la pasarela. Reintenta o llama al ${CENTRALITA_EAR_OS}.`);
      } finally {
        setPending(false);
      }
    },
    [fecha]
  );

  const handleDeposit = useCallback((): void => {
    void startDeposit(terminal.formato ?? 'solista');
  }, [startDeposit, terminal.formato]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(1rem+var(--ear-dock-h,0px))] z-50 px-3 lg:bottom-4">
      <div className="pointer-events-auto mx-auto flex w-full max-w-3xl flex-col gap-1 rounded-2xl border border-white/10 bg-[#030305]/95 px-3 py-2.5 shadow-[0_-12px_44px_-14px_rgba(0,0,0,0.92)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="hidden min-w-0 flex-1 flex-col sm:flex">
            <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#ecb613]/80">
              Acto {terminal.code}
            </span>
            <span className="truncate text-[11px] font-medium text-white/70">{terminal.title}</span>
          </div>

          {terminal.kind === 'deposit' && (
            <label className="flex shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5">
              <CalendarDays size={14} className="text-[#ecb613]" aria-hidden="true" />
              <span className="sr-only">Fecha del evento</span>
              <input
                type="date"
                value={fecha}
                min={minDate.length > 0 ? minDate : undefined}
                onChange={(event) => {
                  setFecha(event.target.value);
                  setNotice('');
                }}
                className="h-6 w-[7.5rem] bg-transparent font-mono text-[11px] text-white/85 outline-none [color-scheme:dark]"
              />
            </label>
          )}

          {terminal.kind === 'deposit' ? (
            <button
              type="button"
              onClick={handleDeposit}
              disabled={pending}
              aria-busy={pending}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#ecb613] px-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#030305] transition-colors hover:bg-[#f5d97a] disabled:cursor-progress disabled:opacity-70 sm:flex-none"
            >
              {pending ? (
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              ) : (
                <Lock size={15} aria-hidden="true" />
              )}
              <span className="truncate">{terminal.label}</span>
            </button>
          ) : (
            <Link
              href={terminal.href ?? '/'}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#ecb613] px-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#030305] transition-colors hover:bg-[#f5d97a] sm:flex-none"
            >
              <CreditCard size={15} aria-hidden="true" />
              <span className="truncate">{terminal.label}</span>
            </Link>
          )}
        </div>

        {/* Línea de estado de alto fijo: ni carga ni error mueven el layout. */}
        <p
          role="status"
          aria-live="polite"
          className="h-4 truncate text-center font-mono text-[10px] text-[#ecb613]/80"
        >
          {notice}
        </p>
      </div>
    </div>
  );
}

export default SovereignStickyCheckoutBar;
