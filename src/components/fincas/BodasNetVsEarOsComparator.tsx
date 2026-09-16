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
  return (
    <section className="bg-[#050507] border border-white/10 rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">
        <Scale size={18} className="text-[#ecb613]" />
        <h2 className="font-syne text-lg font-black uppercase tracking-tight text-white">
          Bodas.net vs EAR OS · Duelo de Rentabilidad
        </h2>
      </div>

      {/* Header columns */}
      <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-4 px-6 py-3 bg-white/[0.03] border-b border-white/10 font-mono text-[10px] uppercase tracking-widest text-white/40">
        <span>Concepto ejecutivo</span>
        <span className="text-center">Bodas.net</span>
        <span className="text-center text-[#ecb613]">EAR OS</span>
      </div>

      <div className="divide-y divide-white/5">
        {rows.map((row) => (
          <div
            key={row.concepto}
            className="grid grid-cols-[1.4fr_1fr_1fr] gap-4 px-6 py-4 items-start"
          >
            <div>
              <p className="text-sm font-body font-bold text-white">{row.concepto}</p>
              {row.ahorroAnualEstimado !== undefined && row.ahorroAnualEstimado > 0 && (
                <p className="mt-1 font-mono text-[10px] text-emerald-400 uppercase tracking-wide">
                  Ahorro {formatEuros(row.ahorroAnualEstimado)}/año
                </p>
              )}
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              {typeof row.bodasNet === 'number' ? (
                <span className="text-sm font-mono text-white/50">{formatEuros(row.bodasNet)}</span>
              ) : (
                <span className="text-xs font-body text-white/50 leading-snug">{row.bodasNet}</span>
              )}
              <XCircle size={14} className="text-white/20" />
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              {typeof row.earOs === 'number' ? (
                <span className="text-sm font-mono font-black text-[#ecb613]">{formatEuros(row.earOs)}</span>
              ) : (
                <span className="text-xs font-body font-bold text-[#ecb613] leading-snug">{row.earOs}</span>
              )}
              <CheckCircle2 size={14} className="text-[#ecb613]" />
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 bg-[#ecb613]/5 border-t border-[#ecb613]/20 flex items-start gap-3">
        <TrendingUp size={16} className="text-[#ecb613] shrink-0 mt-0.5" />
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