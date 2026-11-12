'use client';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * SEATING HEADER ACTIONS — LAS DOS ACCIONES DE CABECERA
 * ════════════════════════════════════════════════════════════════════════════
 * 1 · "Descargar plano / tarjetas de sitio": descarga el plano en `.svg`
 *     (vectorial, sin pérdida) y abre el diálogo de impresión para PDF A4.
 *     Sin librerías de PDF: `print()` es nativo y produce un PDF real con
 *     "Guardar como PDF" en Chrome / Edge / Safari.
 * 2 · CTA principal: "Bloquear distribución y reservar fecha". Serializa el
 *     plano y aterriza en `/presupuesto?seatingPlan=<hash>&leadMagnet=true`.
 *     La cortesía de la herramienta se declara AL LADO del botón, no en un pie
 *     de página: es la condición del cierre, no letra pequeña.
 *
 * Invariante de dinero: aquí NO se escribe ningún importe. `toolValueEur` y
 * `depositEur` llegan formateados desde la ruta, que los lee del SSOT.
 * ════════════════════════════════════════════════════════════════════════════
 */

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileDown, Lock, Printer } from 'lucide-react';
import { buildBudgetHrefWithPlan, encodePlan } from '@/lib/seating/seating-codec';
import { TABLE_METRICS, type SeatingPlan } from '@/lib/seating/seating-plan';

export interface SeatingHeaderActionsProps {
  readonly plan: SeatingPlan;
  /** Valor de catálogo de la herramienta, YA formateado desde la ruta. */
  readonly toolValueEur: string;
  /** Depósito canónico, YA formateado desde la ruta (SSOT). */
  readonly depositEur: string;
  /** Nombre base del archivo descargado (sin extensión). */
  readonly downloadBaseName: string;
}

/**
 * Serializa el plano a un SVG autónomo descargable.
 *
 * No reutiliza el componente React (que es DOM): emite las mismas primitivas
 * desde el MISMO estado, así que lo que se ve, lo que se descarga y lo que se
 * imprime no puede divergir. Rotación, escala y plazas se respetan.
 */
export function buildPlanSvg(plan: SeatingPlan, pxPerM = 46): string {
  const extentX = plan.tables.map((table) => {
    const metrics = TABLE_METRICS[table.shape];
    return table.x + Math.max(metrics.width, metrics.height) * table.scale;
  });
  const extentY = plan.tables.map((table) => {
    const metrics = TABLE_METRICS[table.shape];
    return table.y + Math.max(metrics.width, metrics.height) * table.scale;
  });
  const widthM = Math.max(8, ...extentX) + 2;
  const heightM = Math.max(6, ...extentY) + 2;
  const svgW = Math.round(widthM * pxPerM);
  const svgH = Math.round(heightM * pxPerM);
  const escape = (value: string): string =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">`,
    `<rect width="100%" height="100%" fill="#ffffff"/>`,
    `<text x="12" y="20" font-family="monospace" font-size="11" font-weight="bold" fill="#18181b">${escape(
      plan.eventName || 'Plano de mesas',
    )} · ${plan.tables.length} mesas</text>`,
  ];

  for (const table of plan.tables) {
    const metrics = TABLE_METRICS[table.shape];
    const w = metrics.width * table.scale * pxPerM;
    const h = metrics.height * table.scale * pxPerM;
    const x = table.x * pxPerM;
    const y = table.y * pxPerM;
    const cx = x + w / 2;
    const cy = y + h / 2;
    const shape =
      table.shape === 'round'
        ? `<ellipse cx="${cx}" cy="${cy}" rx="${w / 2}" ry="${h / 2}" fill="none" stroke="#18181b" stroke-width="1.5"/>`
        : `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="none" stroke="#18181b" stroke-width="1.5"/>`;
    parts.push(
      `<g transform="rotate(${table.rotation} ${cx} ${cy})">${shape}</g>`,
      `<text x="${cx}" y="${cy}" text-anchor="middle" font-family="monospace" font-size="9" font-weight="bold" fill="#18181b">${escape(
        table.label,
      )}</text>`,
      `<text x="${cx}" y="${cy + 10}" text-anchor="middle" font-family="monospace" font-size="7" fill="#52525b">${table.seats} plazas</text>`,
    );
  }
  parts.push('</svg>');
  return parts.join('');
}

export default function SeatingHeaderActions({
  plan,
  toolValueEur,
  depositEur,
  downloadBaseName,
}: SeatingHeaderActionsProps) {
  const router = useRouter();
  const [lockState, setLockState] = useState<'idle' | 'blocked'>('idle');

  const downloadSvg = useCallback(() => {
    const blob = new Blob([buildPlanSvg(plan)], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${downloadBaseName}.svg`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [plan, downloadBaseName]);

  /**
   * Bloqueo: primero se persiste el token canónico en `sessionStorage` (el
   * cotizador puede releerlo), después se navega con el hash. Si el navegador
   * no deja escribir, el hash de la URL sigue siendo válido: no hay estado a
   * medias ni un "bloqueado" que no haya ocurrido.
   */
  const blockAndReserve = useCallback(() => {
    setLockState('blocked');
    try {
      window.sessionStorage.setItem('ear-os:seating-blocked', encodePlan(plan));
    } catch {
      // Modo privado sin almacenamiento: el hash de la URL basta.
    }
    router.push(buildBudgetHrefWithPlan(plan));
  }, [plan, router]);

  return (
    <section className="space-y-3 rounded-2xl border border-[#ecb613]/30 bg-[#ecb613]/5 p-4 print:hidden">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={downloadSvg}
          className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-white/50"
        >
          <FileDown size={14} strokeWidth={1.75} aria-hidden="true" />
          Descargar plano / tarjetas de sitio
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 transition-colors hover:border-white/50"
        >
          <Printer size={14} strokeWidth={1.75} aria-hidden="true" />
          Imprimir / PDF A4
        </button>

        <button
          type="button"
          onClick={blockAndReserve}
          className="ml-auto inline-flex items-center gap-2 rounded-xl bg-[#ecb613] px-4 py-2 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-[#f5c94a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
        >
          <Lock size={14} strokeWidth={2} aria-hidden="true" />
          {lockState === 'blocked' ? 'Abriendo presupuesto…' : 'Bloquear distribución y reservar fecha'}
        </button>
      </div>

      <p className="text-[11px] leading-relaxed text-zinc-400">
        <span className="font-bold text-[#ecb613]">
          Herramienta Seating Planner Pro ({toolValueEur} €) incluida de cortesía
        </span>{' '}
        con tu depósito de reserva de <span className="font-mono text-white">{depositEur} €</span>, 100 % deducible
        del importe del evento. Bloquear la distribución vincula el plano a tu expediente y a la fecha.
      </p>
    </section>
  );
}