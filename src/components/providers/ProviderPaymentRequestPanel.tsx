"use client";

import React, { useCallback, useState } from 'react';
import { requestProviderPaymentDataAction } from '@/app/actions/provider-payment-request';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * DATOS DE COBRO BAJO DEMANDA — «Pídeme el número de Bizum»
 * ════════════════════════════════════════════════════════════════════════════
 * El dato de cobro (Bizum, IBAN, PayPal...) NUNCA viaja en el HTML inicial.
 * Se entrega solo cuando el visitante se identifica: nombre + teléfono ⇒ lead
 * registrado en `ProviderPaymentRequestLog` ⇒ dato visible + aviso a n8n.
 * Cero clics muertos: el botón abre un formulario real y escribe de verdad.
 * ════════════════════════════════════════════════════════════════════════════
 */

/** Espejo estructural de `PublicPaymentMethodOffer` (sin arrastrar Prisma al cliente). */
export interface PaymentOfferLike {
  readonly kind: string;
  readonly label: string;
  readonly requiresLeadCapture: boolean;
}

interface DeliveredMethod {
  readonly kind: string;
  readonly label: string;
  readonly holder: string | null;
  readonly reference: string | null;
  readonly instructions: string | null;
}

interface ProviderPaymentRequestPanelProps {
  readonly providerSlug: string;
  readonly providerName: string;
  readonly offers: readonly PaymentOfferLike[];
}

const FIELD_CLASS =
  'w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-[#ecb613]/60 focus:outline-none transition-colors duration-300';
const LABEL_CLASS = 'text-[10px] font-mono uppercase tracking-widest text-zinc-400';

export function ProviderPaymentRequestPanel({
  providerSlug,
  providerName,
  offers,
}: ProviderPaymentRequestPanelProps): React.ReactElement | null {
  const [openKind, setOpenKind] = useState<string | null>(null);
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [eventDate, setEventDate] = useState<string>('');
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [delivered, setDelivered] = useState<readonly DeliveredMethod[] | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const copyReference = useCallback((kind: string, reference: string): void => {
    if (typeof navigator === 'undefined' || navigator.clipboard === undefined) return;
    void navigator.clipboard.writeText(reference).then(() => {
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 2000);
    });
  }, []);

  const submit = useCallback(
    (event: React.FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      if (openKind === null || pending) return;
      setPending(true);
      setError(null);
      void requestProviderPaymentDataAction({
        providerSlug,
        providerName,
        clientName,
        clientPhone,
        clientEmail,
        eventDate,
        methodKinds: [openKind],
      })
        .then((result) => {
          if (!result.ok) {
            setError(result.error ?? 'No hemos podido entregarte los datos de cobro.');
            return;
          }
          setDelivered(result.methods);
          setOpenKind(null);
        })
        .catch((reason: unknown) => {
          console.error('[PAYMENT_PANEL] Error inesperado:', reason);
          setError('Fallo de conexión. Vuelve a intentarlo en unos segundos.');
        })
        .finally(() => {
          setPending(false);
        });
    },
    [clientEmail, clientName, clientPhone, eventDate, openKind, pending, providerName, providerSlug],
  );

  if (offers.length === 0 && delivered === null) return null;

  const activeLabel = openKind === null
    ? null
    : offers.find((offer) => offer.kind === openKind)?.label ?? openKind;

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md space-y-4">
      <div className="space-y-1">
        <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-bold">
          Cobro directo con el proveedor
        </span>
        <h4 className="text-base font-bold text-white font-syne">
          Pide los datos de pago (Bizum, transferencia…)
        </h4>
        <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
          Déjanos tu nombre y teléfono: te mostramos el dato de cobro al instante y el proveedor recibe tu solicitud
          para confirmar fecha y disponibilidad.
        </p>
      </div>

      {delivered === null && openKind === null && (
        <div className="flex flex-wrap gap-2">
          {offers.map((offer) => (
            <button
              key={offer.kind}
              type="button"
              onClick={() => {
                setOpenKind(offer.kind);
                setError(null);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/40 text-[#ecb613] text-xs font-bold hover:bg-[#ecb613]/25 transition-all duration-300 ease-out"
            >
              Pedir {offer.label}
            </button>
          ))}
        </div>
      )}

      {openKind !== null && (
        <form onSubmit={submit} className="space-y-3">
          <p className="text-[11px] font-mono text-zinc-300">
            Solicitando: <span className="text-[#ecb613] font-bold">{activeLabel}</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <label className="space-y-1 block">
              <span className={LABEL_CLASS}>Nombre completo</span>
              <input
                required
                minLength={2}
                maxLength={120}
                value={clientName}
                onChange={(event) => setClientName(event.target.value)}
                className={FIELD_CLASS}
                placeholder="Tu nombre"
                autoComplete="name"
              />
            </label>
            <label className="space-y-1 block">
              <span className={LABEL_CLASS}>Teléfono / WhatsApp</span>
              <input
                required
                inputMode="tel"
                maxLength={40}
                value={clientPhone}
                onChange={(event) => setClientPhone(event.target.value)}
                className={FIELD_CLASS}
                placeholder="+34 …"
                autoComplete="tel"
              />
            </label>
            <label className="space-y-1 block">
              <span className={LABEL_CLASS}>Email (opcional)</span>
              <input
                type="email"
                maxLength={160}
                value={clientEmail}
                onChange={(event) => setClientEmail(event.target.value)}
                className={FIELD_CLASS}
                placeholder="tu@email.com"
                autoComplete="email"
              />
            </label>
            <label className="space-y-1 block">
              <span className={LABEL_CLASS}>Fecha del evento (opcional)</span>
              <input
                type="date"
                value={eventDate}
                onChange={(event) => setEventDate(event.target.value)}
                className={FIELD_CLASS}
              />
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="submit"
              disabled={pending}
              className="px-4 py-2.5 rounded-xl bg-[#ecb613] text-black text-xs font-black uppercase tracking-wide hover:bg-[#f5c62a] transition-colors duration-300 disabled:opacity-60"
            >
              {pending ? 'Verificando…' : 'Ver datos de pago'}
            </button>
            <button
              type="button"
              onClick={() => setOpenKind(null)}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 text-xs font-bold hover:bg-white/10 transition-colors duration-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {error !== null && (
        <p role="alert" className="text-xs text-[#FF2B44] font-mono leading-relaxed">
          {error}
        </p>
      )}

      {delivered !== null && (
        <div className="space-y-2.5" aria-live="polite">
          {delivered.map((method) => (
            <div key={method.kind} className="p-3.5 rounded-2xl bg-black/40 border border-[#ecb613]/30 space-y-1.5">
              <span className="block text-[10px] font-mono uppercase tracking-widest text-[#ecb613] font-bold">
                {method.label}
              </span>
              {method.reference !== null && (
                <div className="flex items-center justify-between gap-3">
                  <code className="text-sm text-white font-mono break-all">{method.reference}</code>
                  <button
                    type="button"
                    onClick={() => copyReference(method.kind, method.reference ?? '')}
                    className="shrink-0 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-300 hover:bg-white/10 transition-colors duration-300"
                  >
                    {copied === method.kind ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
              )}
              {method.holder !== null && (
                <p className="text-[11px] text-zinc-400 font-light">
                  Titular: <span className="text-zinc-200">{method.holder}</span>
                </p>
              )}
              {method.instructions !== null && (
                <p className="text-[11px] text-zinc-400 font-light whitespace-pre-line">{method.instructions}</p>
              )}
            </div>
          ))}
          <p className="text-[10px] font-mono text-zinc-500 leading-relaxed">
            Tu solicitud ha quedado registrada con referencia de lead. El proveedor confirmará la fecha antes de
            cualquier pago.
          </p>
        </div>
      )}
    </div>
  );
}

export default ProviderPaymentRequestPanel;
