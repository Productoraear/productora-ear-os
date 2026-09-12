"use client";

import React, { useMemo, useState } from 'react';
import { Radio, Activity, Zap, Clock, AlertTriangle, CheckCircle, Layers } from 'lucide-react';
import { UberFleetVisualizer } from '@/components/neural/UberFleetVisualizer';
import {
  runHighTrafficMariachiSimulation,
  type MariachiSimulationReport
} from '@/lib/matchmaker/mariachiHighTrafficSimulator';
import { ARSENAL_WAREHOUSE_NETWORK } from '@/lib/engines/arsenalGpsRoutingEngine';

interface LiveCommandCenterProps {
  tourId: string;
}

/**
 * Pantalla NASA — Radar Nacional Multiorigen en Vivo.
 *
 * Sustituye el radar CSS estático por el mapa táctico HD (UberFleetVisualizer)
 * alimentado con telemetría multi-origen real: convoyes desde Madrid, Valencia,
 * Toledo y Sevilla convergiendo sobre las producciones activas.
 */
export const LiveCommandCenter: React.FC<LiveCommandCenterProps> = ({ tourId }) => {
  const [isRunning, setIsRunning] = useState(true);
  const [injectOvertime, setInjectOvertime] = useState(false);

  // Reporte de telemetría multi-origen (32 producciones simuladas en alta demanda)
  const report: MariachiSimulationReport = useMemo(
    () => runHighTrafficMariachiSimulation(injectOvertime),
    [injectOvertime]
  );

  const activeConvoys = report.bookings.filter(
    (b) => b.status === 'IN_PROGRESS' || b.status === 'SCHEDULED'
  ).length;

  const totalKm = useMemo(
    () =>
      Math.round(
        report.bookings.reduce((acc, b) => acc + b.distanceFromPlazaElipticaKm, 0)
      ),
    [report]
  );

  return (
    <div className="bg-[#050507] rounded-3xl border border-white/10 flex flex-col gap-6 overflow-hidden">
      {/* Header Logístico */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/10 p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#00E5FF]/10 rounded-xl flex items-center justify-center border border-[#00E5FF]/30">
            <Radio className="text-[#00E5FF] animate-pulse" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white font-syne">
              Radar Nacional <span className="text-[#00E5FF]">Multiorigen</span>
            </h2>
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40 font-mono">
              Telemetría de Gira: {tourId}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRunning((v) => !v)}
            className="px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] text-[10px] font-black tracking-widest uppercase text-white/70 hover:text-white hover:border-[#00E5FF]/40 transition-all cursor-pointer"
          >
            {isRunning ? '⏸ Pausar' : '▶ Reanudar'}
          </button>
          <button
            onClick={() => setInjectOvertime((v) => !v)}
            className={`px-4 py-2 rounded-full border text-[10px] font-black tracking-widest uppercase transition-all cursor-pointer ${
              injectOvertime
                ? 'border-[#FF2B44]/50 bg-[#FF2B44]/10 text-[#FF2B44]'
                : 'border-white/10 bg-white/[0.02] text-white/70 hover:text-white'
            }`}
          >
            ⚡ Inyectar Overtime
          </button>
        </div>
      </div>

      {/* Grid de Sensores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6">
        <div className="bg-white/[0.02] p-5 rounded-2xl flex items-center gap-4 border border-white/5">
          <Zap className="text-[#00E5FF]" size={28} />
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1 font-mono">
              Convoyes Activos
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {activeConvoys}
              <span className="text-sm text-white/30"> / {report.totalBookings}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.02] p-5 rounded-2xl flex items-center gap-4 border border-white/5">
          <Clock className="text-[#ecb613]" size={28} />
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1 font-mono">
              SLA Compliance
            </div>
            <div className="text-2xl font-black text-[#ecb613] font-mono">
              {report.slaCompliance}
            </div>
          </div>
        </div>

        <div className="bg-white/[0.02] p-5 rounded-2xl flex items-center gap-4 border border-white/5">
          <Activity className="text-emerald-500" size={28} />
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1 font-mono">
              Km Totales
            </div>
            <div className="text-2xl font-black text-emerald-500 font-mono">
              {totalKm.toLocaleString('es-ES')}
            </div>
          </div>
        </div>

        <div className="bg-white/[0.02] p-5 rounded-2xl flex items-center gap-4 border border-white/5">
          <Layers className="text-[#FF2B44]" size={28} />
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1 font-mono">
              Bases Arsenal
            </div>
            <div className="text-2xl font-black text-[#FF2B44] font-mono">
              {ARSENAL_WAREHOUSE_NETWORK.length}
            </div>
          </div>
        </div>
      </div>

      {/* Mapa Táctico HD Multiorigen */}
      <div className="px-6">
        <div className="h-[560px] rounded-2xl overflow-hidden border border-white/10">
          <UberFleetVisualizer
            report={report}
            isRunning={isRunning}
            onTogglePlay={() => setIsRunning((v) => !v)}
            onToggleOvertime={() => setInjectOvertime((v) => !v)}
            injectOvertime={injectOvertime}
          />
        </div>
      </div>

      {/* Anomalías y Logs */}
      <div className="bg-black/50 rounded-2xl p-6 border border-white/5 mx-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle
            size={16}
            className={report.successfulReassignments > 0 ? 'text-[#FF2B44]' : 'text-emerald-500'}
          />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60 font-mono">
            Registro Forense de Reasignaciones
          </span>
        </div>

        {report.successfulReassignments === 0 ? (
          <div className="flex items-center gap-2 text-emerald-500/60 text-xs font-mono">
            <CheckCircle size={14} /> Sistema Operando en Parámetros S-Class. Tasa de
            cancelación: {report.cancellationRate}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-[#FF2B44] text-xs font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2B44] animate-pulse" />
              {report.successfulReassignments} reasignaciones Uber Failover ejecutadas con
              éxito. Tasa de cancelación: {report.cancellationRate}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
