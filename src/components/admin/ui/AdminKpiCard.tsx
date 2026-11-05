import type { AdminMetric } from '@/lib/admin/metrics-provenance';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ADMIN KPI CARD — Tarjeta única de indicador del cockpit (Server Component).
 * Recibe `AdminMetric` de `metrics-provenance.ts` y NUNCA inventa cifras:
 *   - `source` declara la procedencia (EN VIVO / SSOT / SIN DATOS);
 *   - `mode: 'SIMULADO'` se etiqueta en rojo (anti-fachada AF-2);
 *   - `probed: false` fuerza `SIN DATOS` (el valor ya es 0 por contrato).
 * Estética OLED: fondo `#09090d`, borde `border-white/10`, `rounded-3xl`, oro
 * `#ecb613`. Sin animación de layout (cero CLS).
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const SOURCE_LABEL: Record<AdminMetric['source'], string> = {
  live: 'EN VIVO',
  static: 'SSOT',
  empty: 'SIN DATOS',
};

export default function AdminKpiCard({ metric }: { metric: AdminMetric }) {
  const probed = metric.probed;
  const isSimulado = metric.mode === 'SIMULADO';

  return (
    <div className="flex flex-col gap-2 rounded-3xl border border-white/10 bg-[#09090d]/80 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-mono text-[10px] uppercase tracking-widest text-zinc-400">
          {metric.label}
        </span>
        <span
          className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px] ${
            probed ? 'border-[#ecb613]/40 text-[#ecb613]' : 'border-zinc-700 text-zinc-500'
          }`}
        >
          {SOURCE_LABEL[metric.source]}
        </span>
      </div>

      <div className="font-mono text-2xl font-bold tabular-nums text-white">
        {metric.formattedValue ?? String(metric.value)}
      </div>

      <div className="flex items-center justify-between gap-2 font-mono text-[9px] text-zinc-500">
        <span className="truncate" title={metric.ref}>
          {metric.ref}
        </span>
        {isSimulado ? <span className="shrink-0 text-[#FF2B44]">SIMULADO</span> : null}
      </div>
    </div>
  );
}
