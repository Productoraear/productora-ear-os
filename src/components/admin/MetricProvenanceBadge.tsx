import React from 'react';
import type { AdminMetric } from '@/lib/admin/metrics-provenance';

export interface MetricProvenanceBadgeProps {
  readonly metric: AdminMetric;
  readonly showRef?: boolean;
  readonly size?: 'sm' | 'md';
}

/**
 * MetricProvenanceBadge — Componente Presentacional Puro Anti-Vanidad (S-Class)
 * Funciona indistintamente en Server Components (RSC) y Client Components (CSC).
 * Garantía: NUNCA renderiza verde ni estado optimista si probed === false.
 */
export function MetricProvenanceBadge({
  metric,
  showRef = true,
  size = 'md',
}: MetricProvenanceBadgeProps) {
  const isOnlineAndProbed = metric.probed && metric.source !== 'empty';

  // Contenedor visual
  const isSmall = size === 'sm';

  return (
    <div
      className={`inline-flex items-center gap-1.5 font-mono ${
        isSmall ? 'text-[10px]' : 'text-xs'
      }`}
      title={`Fuente: ${metric.source} | Ref: ${metric.ref} | Sondeado: ${metric.probed ? 'Sí' : 'No'} (${metric.checkedAt})`}
    >
      {/* Indicador de procedencia */}
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border transition-colors ${
          isOnlineAndProbed
            ? metric.source === 'live'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-semibold'
              : 'bg-[#ecb613]/10 border-[#ecb613]/30 text-[#ecb613] font-semibold'
            : 'bg-zinc-900 border-zinc-800 text-zinc-500 font-medium'
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isOnlineAndProbed
              ? metric.source === 'live'
                ? 'bg-emerald-400 animate-pulse'
                : 'bg-[#ecb613]'
              : 'bg-zinc-600'
          }`}
        />
        <span className="uppercase tracking-wider">
          {isOnlineAndProbed
            ? metric.source === 'live'
              ? 'LIVE · VERIFICADO'
              : 'SSOT · MANIFIESTO'
            : '0 · SIN_DATOS'}
        </span>
      </span>

      {/* Referencia técnica si se solicita */}
      {showRef && (
        <span className="text-[10px] text-zinc-600 truncate max-w-[140px]">
          [{metric.ref}]
        </span>
      )}
    </div>
  );
}

export default MetricProvenanceBadge;
