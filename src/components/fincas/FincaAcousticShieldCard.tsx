"use client";

import React from 'react';
import {
  AcousticShieldMetrics,
  calcularRiderAcustico,
} from '@/lib/fincas/fincaMetricsEngine';
import { ShieldCheck, ShieldAlert, Volume2, Zap } from 'lucide-react';

interface FincaAcousticShieldCardProps {
  shield: AcousticShieldMetrics;
  capacidadMaxPax: number;
}

const FincaAcousticShieldCard: React.FC<FincaAcousticShieldCardProps> = ({
  shield,
  capacidadMaxPax,
}) => {
  const rider = calcularRiderAcustico(capacidadMaxPax);
  const blindada = shield.cumple75Db;

  const estadoLabel = blindada ? 'Blindada Gold Master' : 'Requiere atenuación';
  const margenLabel = shield.cumple75Db
    ? `+${shield.margenSeguridadDb} dB`
    : `${shield.exteriorDBA - 75} dB exceso`;
  const selloLabel = blindada
    ? 'Cero multas garantizadas'
    : 'Plan de atenuación incluido';

  const wattsFormateados = rider.wattsTotales.toLocaleString('es-ES');

  return (
    <article
      className="bg-[#050507] border border-white/10 rounded-2xl p-6 flex flex-col gap-4"
      role="region"
      aria-label={`Ficha acústica de ${shield.fincaName}: ${shield.exteriorDBA} decibelios en exterior, estado ${estadoLabel}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
              blindada
                ? 'bg-[#ecb613]/10 border-[#ecb613]/30'
                : 'bg-white/[0.03] border-white/10'
            }`}
            role="img"
            aria-label={
              blindada
                ? 'Estado acústico: blindada, cumple con el límite de 75 decibelios'
                : 'Estado acústico: alerta, requiere atenuación'
            }
          >
            {blindada ? (
              <ShieldCheck
                size={20}
                className="text-[#ecb613]"
                aria-hidden="true"
                focusable="false"
              />
            ) : (
              <ShieldAlert
                size={20}
                className="text-white/40"
                aria-hidden="true"
                focusable="false"
              />
            )}
          </span>
          <div>
            <h3 className="font-syne text-sm font-black uppercase tracking-tight text-white leading-tight">
              {shield.fincaName}
            </h3>
            <span
              className={`font-mono text-[9px] uppercase tracking-widest ${
                blindada ? 'text-[#ecb613]' : 'text-white/40'
              }`}
            >
              {estadoLabel}
            </span>
          </div>
        </div>
        <span
          className="font-mono text-3xl font-black text-white tabular-nums"
          aria-label={`Nivel exterior: ${shield.exteriorDBA} decibelios`}
        >
          {shield.exteriorDBA}
          <span className="text-sm text-white/40" aria-hidden="true">
            {' '}
            dB
          </span>
        </span>
      </div>

      <div
        className="grid grid-cols-2 gap-3"
        role="group"
        aria-label="Métricas acústicas y eléctricas"
      >
        <div
          className="rounded-xl bg-white/[0.03] border border-white/10 p-3"
          role="group"
          aria-label={`Rider acústico: ${wattsFormateados} vatios totales`}
        >
          <div className="flex items-center gap-1.5 text-white/40 font-mono text-[9px] uppercase tracking-widest mb-1">
            <Volume2 size={12} aria-hidden="true" focusable="false" />
            <span>Rider 12 W/pax</span>
          </div>
          <p className="font-mono text-sm text-white font-bold">
            {wattsFormateados} W
          </p>
        </div>
        <div
          className="rounded-xl bg-white/[0.03] border border-white/10 p-3"
          role="group"
          aria-label={`Margen SPL: ${margenLabel}`}
        >
          <div className="flex items-center gap-1.5 text-white/40 font-mono text-[9px] uppercase tracking-widest mb-1">
            <Zap size={12} aria-hidden="true" focusable="false" />
            <span>Margen SPL</span>
          </div>
          <p className="font-mono text-sm text-white font-bold">
            {margenLabel}
          </p>
        </div>
      </div>

      <p className="text-xs font-body text-white/60 leading-relaxed">
        {shield.estrategia}
      </p>

      <span
        className={`inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full border font-mono text-[9px] uppercase tracking-widest ${
          blindada
            ? 'border-[#ecb613]/30 bg-[#ecb613]/10 text-[#ecb613]'
            : 'border-white/10 bg-white/[0.03] text-white/50'
        }`}
        role="status"
        aria-label={`Sello acústico: ${selloLabel}`}
      >
        {selloLabel}
      </span>
    </article>
  );
};

export default FincaAcousticShieldCard;