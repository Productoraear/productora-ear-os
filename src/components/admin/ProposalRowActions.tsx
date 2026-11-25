"use client";

import React, { useState } from 'react';
import { ShieldCheck, CreditCard, CheckCircle2, Download, ExternalLink, X } from 'lucide-react';
import { DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';
import { resolveEntityContext } from '@/lib/oraculo/entity-resolver';
import {
  executeEidasContract,
  executeStripeCheckout,
  type MultiRailExecutionResult,
} from '@/lib/compiler/multi-rail-execution';

interface ProposalRowActionsProps {
  readonly id: string;
  readonly numero: string;
  readonly clientName: string;
  readonly venue: string;
  readonly totalEur: number;
}

export function ProposalRowActions({
  id,
  numero,
  clientName,
  venue,
  totalEur,
}: ProposalRowActionsProps) {
  const [activeResult, setActiveResult] = useState<MultiRailExecutionResult | null>(null);

  const handleEidas = () => {
    const res = executeEidasContract({
      eventId: `PROP-${numero}`,
      clientName: clientName || 'Cliente Particular',
      venue: venue || 'Espacio Singular',
      eventDate: new Date().toISOString().slice(0, 10),
      grossEur: totalEur > 0 ? totalEur : undefined,
      dimensionId: 'TESORERIA_SPLIT',
      entityContext: resolveEntityContext('e78903', 'ARTISTAS_ESCENARIO'),
      pepitaDeOro: `Propuesta #${numero} convertida a Contrato eIDAS`,
      rawVision: `Contrato de producción para ${clientName} en ${venue}`,
    });
    setActiveResult(res);
  };

  const handleStripe = () => {
    const res = executeStripeCheckout({
      eventId: `LOCK-${numero}`,
      clientName: clientName || 'Cliente Particular',
      venue: venue || 'Espacio Singular',
      eventDate: new Date().toISOString().slice(0, 10),
      grossEur: DEPOSITO_STRIPE_EUR,
      dimensionId: 'TESORERIA_SPLIT',
      entityContext: resolveEntityContext('e78903', 'ARTISTAS_ESCENARIO'),
      pepitaDeOro: `Fianza deducible Price-Lock de ${DEPOSITO_STRIPE_EUR} €`,
      rawVision: `Enlace de pago Stripe para asegurar la fecha de la propuesta #${numero}`,
    });
    setActiveResult(res);
  };

  return (
    <>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleEidas}
          title="Emitir Contrato eIDAS Oficial con Sello SHA-256"
          className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:text-white text-[11px] font-mono flex items-center gap-1 transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>eIDAS</span>
        </button>

        <button
          type="button"
          onClick={handleStripe}
          title={`Disparar Enlace Stripe Price-Lock (${DEPOSITO_STRIPE_EUR.toFixed(0)} €)`}
          className="px-2.5 py-1.5 rounded-lg bg-[#ecb613]/10 hover:bg-[#ecb613]/20 border border-[#ecb613]/30 text-[#ecb613] hover:text-white text-[11px] font-mono flex items-center gap-1 transition-colors"
        >
          <CreditCard className="w-3.5 h-3.5 text-[#ecb613]" />
          <span>Stripe {DEPOSITO_STRIPE_EUR.toFixed(0)}€</span>
        </button>
      </div>

      {activeResult && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#09090d] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold font-syne text-white uppercase tracking-wider">
                  {activeResult.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveResult(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-900">
                <span className="text-zinc-400">Archivo:</span>
                <span className="text-white font-bold">{activeResult.filename}</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <span className="text-zinc-500 text-[10px] block">SELLO SHA-256</span>
                <span className="text-[#ecb613] text-[11px] break-all">{activeResult.sha256}</span>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-400 text-[11px]">Detalle del Riel:</span>
                <pre className="p-3 rounded-xl bg-black border border-zinc-900 text-[11px] text-zinc-300 overflow-x-auto max-h-40 font-mono">
                  {activeResult.previewContent}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveResult(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono transition-colors"
              >
                Cerrar
              </button>
              {activeResult.downloadUrl && (
                <a
                  href={activeResult.downloadUrl}
                  download={activeResult.artifactKind === 'pdf' ? activeResult.filename : undefined}
                  target={activeResult.artifactKind !== 'pdf' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#ecb613] hover:bg-[#d8a40f] text-black font-bold text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  {activeResult.artifactKind === 'pdf' ? <Download className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                  <span>Abrir / Descargar</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
