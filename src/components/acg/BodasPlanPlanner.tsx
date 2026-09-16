"use client";

import React, { useMemo } from 'react';
import { LayoutDashboard, AlertTriangle, ShieldCheck, FileDown, CheckCircle2 } from 'lucide-react';
import type { AcgState } from '@/lib/acg/acgDecisionEngine';
import {
  computeAcgQuote,
  getSelectedArtist,
  evaluateAcousticZones,
  calculateAcousticAcg,
  formatEur,
} from '@/lib/acg/acgDecisionEngine';
import { SCLASS_12_FINCAS_HOMOLOGADAS } from '@/lib/constants/fincas-catalog';

interface BodasPlanPlannerProps {
  state: AcgState;
}

export default function BodasPlanPlanner({ state }: BodasPlanPlannerProps) {
  const selectedArtist = getSelectedArtist(state.match.selectedArtistId);
  const selectedFinca = SCLASS_12_FINCAS_HOMOLOGADAS.find((f) => f.id === state.finca.fincaId);

  const quote = useMemo(
    () =>
      computeAcgQuote(
        selectedArtist.basePriceEur,
        state.finca.distanceKm,
        state.space.endHour,
        state.space.pax,
        state.space.venueType,
      ),
    [selectedArtist.basePriceEur, state.finca.distanceKm, state.space.endHour, state.space.pax, state.space.venueType],
  );

  const acoustic = useMemo(
    () => calculateAcousticAcg(state.space.pax, state.space.venueType),
    [state.space.pax, state.space.venueType],
  );

  const zones = state.plan.seatingZones;
  const evaluation = useMemo(() => evaluateAcousticZones(zones, acoustic.maxSplDb), [zones, acoustic.maxSplDb]);
  const zonesAtRisk = evaluation.filter((z) => z.isTooLoud);

  const handleExportDossier = () => {
    const content = [
      '═══════════════════════════════════════════════════════════════',
      '  DOSSIER TÉCNICO EJECUTIVO · EAR OS AUTONOMOUS COMMERCE GRID',
      '═══════════════════════════════════════════════════════════════',
      '',
      `Finca destino   : ${selectedFinca?.name ?? 'No asignada'}`,
      `Provincia       : ${selectedFinca?.provincia ?? '-'}`,
      `Capacidad       : ${selectedFinca?.capacidadMaxPax ?? '-'} pax`,
      `Distancia Hub   : ${state.finca.distanceKm} km desde Méntrida`,
      '',
      `Formato musical : ${selectedArtist.name} (${selectedArtist.formatLabel})`,
      `Tarifa artista  : ${formatEur(quote.artistBasePrice)} €`,
      `Logística total : ${formatEur(quote.logistics.totalLogistics)} €`,
      `Total base      : ${formatEur(quote.totalBase)} €`,
      '',
      `Potencia RMS    : ${quote.acoustic.totalWatts} W (${quote.acoustic.wattsPerPax} W/pax)`,
      `Sistema asignado: ${quote.acoustic.recommendedSystem}`,
      `Microfonía      : ${quote.acoustic.microphones}`,
      `Límite SPL      : ${quote.acoustic.maxSplDb} dB`,
      '',
      '── SPLIT SOBERANO 80 / 10 / 10 ────────────────────────────────',
      `  80% Artista  : ${formatEur(quote.split.artista)} €`,
      `  10% EAR OS   : ${formatEur(quote.split.earOs)} €`,
      `  10% VIMUME   : ${formatEur(quote.split.vimume)} €`,
      '',
      '── PLANO ACÚSTICO DE MESAS ────────────────────────────────────',
      ...evaluation.map(
        (z) =>
          `  ${z.label.padEnd(10)} | ${z.splExposureDb} dB SPL ${z.isTooLoud ? '⚠ REUBICAR' : '✓ OK'} ${z.isSeniorZone ? '(zona sénior)' : ''}`,
      ),
      '',
      '  Firma Price-Lock: ' + (state.space.priceLockHash ?? 'Pendiente (emitida al bloquear fecha)'),
      '----------------------------------------------------------------',
      '  Documento generado por EAR OS. Split inmutable y acústica legal.',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dossier-${selectedFinca?.slug ?? 'ear-os'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Columna presupuestador */}
      <div className="lg:col-span-5 space-y-5">
        <div className="rounded-2xl bg-[#050507] border border-white/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <LayoutDashboard size={15} className="text-[#10B981]" />
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Presupuestador Soberano</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-white/50">Tarifa artista ({selectedArtist.formatLabel})</span>
              <span className="text-white font-bold">{formatEur(quote.artistBasePrice)} €</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-white/50">Logística Méntrida ({quote.logistics.billableKm} km fact.)</span>
              <span className="text-white font-bold">{formatEur(quote.logistics.totalLogistics)} €</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-[#10B981]/5 border border-[#10B981]/20">
              <span className="text-white/60">Total base del evento</span>
              <span className="text-[#10B981] font-black text-lg">{formatEur(quote.totalBase)} €</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportDossier}
            className="w-full mt-4 py-4 rounded-xl bg-[#10B981] text-black font-black text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2"
          >
            <FileDown size={16} /> Exportar Dossier Técnico Ejecutivo
          </button>
        </div>

        <div className={`rounded-2xl border p-5 ${zonesAtRisk.length > 0 ? 'border-[#FF2B44]/40 bg-[#FF2B44]/5' : 'border-emerald-500/30 bg-emerald-950/20'}`}>
          <div className="flex items-start gap-3">
            {zonesAtRisk.length > 0 ? (
              <AlertTriangle size={18} className="text-[#FF2B44] shrink-0" />
            ) : (
              <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
            )}
            <div>
              <p className="font-mono text-xs font-bold text-white uppercase tracking-widest">
                {zonesAtRisk.length > 0 ? `${zonesAtRisk.length} mesa(s) requieren reubicación` : 'Plano acústico conforme'}
              </p>
              <p className="font-mono text-[11px] text-white/60 leading-relaxed mt-1">
                {zonesAtRisk.length > 0
                  ? zonesAtRisk.map((z) => z.label).join(', ') + ' superan los 75 dB SPL.'
                  : `Todas las mesas por debajo de ${acoustic.maxSplDb} dB SPL a distancia segura del escenario.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Columna plano de mesas */}
      <div className="lg:col-span-7">
        <div className="rounded-2xl bg-[#050507] border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LayoutDashboard size={15} className="text-[#10B981]" />
              <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Plano de Mesas · Simulación isofónica</span>
            </div>
            <span className="font-mono text-[10px] text-white/40">Escenario arriba · dB por mesa</span>
          </div>

          <div className="relative w-full aspect-[4/3] rounded-2xl bg-[#030305] border border-white/10 overflow-hidden">
            {/* Escenario */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2/3 h-10 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center">
              <span className="font-mono text-[10px] text-[#10B981] uppercase tracking-widest">Escenario</span>
            </div>

            {/* Mesas */}
            {evaluation.map((zone) => (
              <div
                key={zone.id}
                className={`absolute w-14 h-14 rounded-lg border flex flex-col items-center justify-center transition-all ${
                  zone.isTooLoud
                    ? 'border-[#FF2B44]/60 bg-[#FF2B44]/15'
                    : 'border-emerald-500/30 bg-emerald-950/20'
                }`}
                style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
              >
                <span className={`font-mono text-[9px] font-bold ${zone.isTooLoud ? 'text-[#FF2B44]' : 'text-white/70'}`}>
                  {zone.splExposureDb} dB
                </span>
                <span className="font-mono text-[8px] text-white/40 truncate px-1">{zone.label}</span>
                {zone.isSeniorZone && <span className="font-mono text-[7px] text-[#10B981]">SÉNIOR</span>}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-4 font-mono text-[10px] text-white/50">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/50" /> Conforme</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#FF2B44]/20 border border-[#FF2B44]/60" /> Reubicar</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-[#10B981]" /> Split 80/10/10 liquidado</span>
          </div>
        </div>
      </div>
    </div>
  );
}