'use client';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * EMBUDO TRANSACCIONAL DE FICHA (ORDEN 2026-11-11 §1)
 * ════════════════════════════════════════════════════════════════════════════
 * Toda ficha de proveedor y landing pSEO deja de ser un callejón sin salida:
 * este bloque inyecta el CONTEXTO de la ficha (`providerId`, `slug`, categoría
 * y servicios seleccionados) en la simulación canónica de `/presupuesto` y en
 * un enlace de WhatsApp ya redactado con la centralita oficial del SSOT.
 *
 * NO duplica precios: recibe los servicios ya resueltos por la ficha
 * (céntimos enteros) y sólo compone la navegación con `buildProviderFunnelHref`.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';

import { buildProviderFunnelHref, type FichaService } from '@/lib/budget/form-bridge';

export interface ProviderFunnelCtaProps {
  readonly providerId: string;
  readonly providerSlug: string;
  readonly providerName: string;
  /** Macro-partida canónica de la ficha (`espacio_banquete`, `musica_produccion`…). */
  readonly category: string;
  readonly services: readonly FichaService[];
}

export function ProviderFunnelCta({
  providerId,
  providerSlug,
  providerName,
  category,
  services,
}: ProviderFunnelCtaProps) {
  const links = useMemo(
    () => buildProviderFunnelHref({ providerId, providerSlug, providerName, category, services }),
    [providerId, providerSlug, providerName, category, services],
  );

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <Link
        href={links.simulationHref}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ecb613] px-6 py-3 text-xs font-black uppercase tracking-wider text-black transition-all hover:brightness-110"
      >
        <span>Cotizar en el Terminal</span>
        <ArrowRight size={14} strokeWidth={1.75} />
      </Link>
      <a
        href={links.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-xs font-black uppercase tracking-wider text-white transition-colors hover:border-[#ecb613]/60 hover:text-[#ecb613]"
      >
        <MessageCircle size={14} strokeWidth={1.75} />
        <span>WhatsApp con esta ficha</span>
      </a>
    </div>
  );
}

export default ProviderFunnelCta;
