"use client";

import React from 'react';
import {
  BodasNetVsEarOsRow,
  formatEuros,
} from '@/lib/fincas/fincaMetricsEngine';
import { CheckCircle2, XCircle, TrendingUp, Scale } from 'lucide-react';

interface BodasNetVsEarOsComparatorProps {
  rows: BodasNetVsEarOsRow[];
}

const BodasNetVsEarOsComparator: React.FC<BodasNetVsEarOsComparatorProps> = ({ rows }) => {
  const hasRows = Array.isArray(rows) && rows.length > 0;

  return (
    <section
      className="bg-[#050507] border border-white/10 rounded-2xl overflow-hidden"
      aria-labelledby="bodasnet-vs-earos-title"
      role="region"
    >
      <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">
        <Scale
          size={18}
          className="text-[#ecb613]"
          aria-hidden="true"
          focusable="false"
          role="img"
        />
        <h2
          id="bodasnet-vs-earos-title"
          className="font-syne text-lg font-black uppercase tracking-tight text-white"
        >
          Bodas.net vs EAR OS · Duelo de Rentabilidad
        </h2>
      </div>

      {/* Header columns */}
      <div
        className="grid grid-cols-[1.4fr_1fr_1fr] gap-4 px-6 py-3 bg-white/[0.03] border-b border-white/10 font-mono text-[10px] uppercase tracking-widest text-white/40"
        role="row"
        aria-hidden="true"
      >
        <span role="columnheader">Concepto ejecutivo</span>
        <span className="text-center" role="columnheader">Bodas.net</span>
        <span className="text-center text-[#ecb613]" role="columnheader">EAR OS</span>
      </div>

      <div
        className="divide-y divide-white/5"
        role="table"
        aria-label="Comparativa de rentabilidad entre Bodas.net y EAR OS"
        aria-rowcount={hasRows ? rows.length : 0}
        aria-colcount={3}
      >
        {hasRows ? (
          rows.map((row, index) => {
            const rowLabel = `Fila ${index + 1}: ${row.concepto}`;
            const bodasNetValue =
              typeof row.bodasNet === 'number' ? formatEuros(row.bodasNet) : row.bodasNet;
            const earOsValue =
              typeof row.earOs === 'number' ? formatEuros(row.earOs) : row.earOs;
            return (
              <div
                key={row.concepto}
                className="grid grid-cols-[1.4fr_1fr_1fr] gap-4 px-6 py-4 items-start"
                role="row"
                aria-label={rowLabel}
                aria-rowindex={index + 1}
              >
                <div role="cell" aria-label={`Concepto: ${row.concepto}`}>
                  <p className="text-sm font-body font-bold text-white">{row.concepto}</p>
                  {row.ahorroAnualEstimado !== undefined && row.ahorroAnualEstimado > 0 && (
                    <p
                      className="mt-1 font-mono text-[10px] text-emerald-400 uppercase tracking-wide"
                      aria-label={`Ahorro anual estimado de ${formatEuros(row.ahorroAnualEstimado)}`}
                    >
                      Ahorro {formatEuros(row.ahorroAnualEstimado)}/año
                    </p>
                  )}
                </div>
                <div
                  className="flex flex-col items-center gap-1 text-center"
                  role="cell"
                  aria-label={`Bodas.net: ${bodasNetValue}`}
                >
                  {typeof row.bodasNet === 'number' ? (
                    <span className="text-sm font-mono text-white/50">{formatEuros(row.bodasNet)}</span>
                  ) : (
                    <span className="text-xs font-body text-white/50 leading-snug">{row.bodasNet}</span>
                  )}
                  <XCircle
                    size={14}
                    className="text-white/20"
                    aria-hidden="true"
                    focusable="false"
                    role="img"
                  />
                </div>
                <div
                  className="flex flex-col items-center gap-1 text-center"
                  role="cell"
                  aria-label={`EAR OS: ${earOsValue}`}
                >
                  {typeof row.earOs === 'number' ? (
                    <span className="text-sm font-mono font-black text-[#ecb613]">{formatEuros(row.earOs)}</span>
                  ) : (
                    <span className="text-xs font-body font-bold text-[#ecb613] leading-snug">{row.earOs}</span>
                  )}
                  <CheckCircle2
                    size={14}
                    className="text-[#ecb613]"
                    aria-hidden="true"
                    focusable="false"
                    role="img"
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div
            className="px-6 py-6 text-center text-xs font-body text-white/50"
            role="row"
            aria-label="Sin datos comparativos disponibles"
          >
            Sin datos comparativos disponibles.
          </div>
        )}
      </div>

      <div
        className="px-6 py-4 bg-[#ecb613]/5 border-t border-[#ecb613]/20 flex items-start gap-3"
        role="note"
        aria-label="Conclusión ejecutiva EAR OS"
      >
        <TrendingUp
          size={16}
          className="text-[#ecb613] shrink-0 mt-0.5"
          aria-hidden="true"
          focusable="false"
          role="img"
        />
        <p className="text-xs font-body text-white/70 leading-relaxed">
          <strong className="text-[#ecb613]">EAR OS transforma el directorio en un motor de cierre real:</strong>{' '}
          depósito inmutable de 100 €, liquidación en 7 días hábiles y blindaje acústico certificado
          que elimina multas y quejas vecinales. Sin cuotas, sin leads fríos.
        </p>
      </div>
    </section>
  );
};

export default BodasNetVsEarOsComparator;