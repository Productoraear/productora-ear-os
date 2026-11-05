'use client';

import React, { useState, useMemo } from 'react';
import {
  Landmark,
  FileCheck2,
  Clock,
  Phone,
  ShieldCheck,
  AlertTriangle,
  Download,
  Building2
} from 'lucide-react';
import {
  generateMunicipalExpediente,
  buildMariachiRelayCascade,
  getActiveRelayProvider,
  type B2GProgramType,
} from '@/lib/b2g/municipal-fast-track-engine';
import {
  AJUSTE_PREVENTIVO_B2G_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export default function MunicipalFastTrackDrawer() {
  const [municipality, setMunicipality] = useState<string>('Méntrida');
  const [province, setProvince] = useState<string>('Toledo');
  const [programType, setProgramType] = useState<B2GProgramType>('FESTEJOS_POPULARES');
  const [amountEur, setAmountEur] = useState<number>(8500);
  const [activeTab, setActiveTab] = useState<'EXPEDIENTE' | 'MARIACHI_SLA'>('EXPEDIENTE');

  // Estado SLA 15-min
  const [elapsedMinutes, setElapsedMinutes] = useState<number>(0);

  const expediente = useMemo(() => {
    return generateMunicipalExpediente({
      municipality,
      province,
      programType,
      requestedAmountEur: amountEur,
      targetAudienceEstimate: 450,
      eventDateIso: '2026-08-15',
    });
  }, [municipality, province, programType, amountEur]);

  const mariachiCascade = useMemo(() => {
    return buildMariachiRelayCascade('BOOK-MAR-2026-01', province, [
      { id: 'mariachi-1', name: 'Mariachi Imperial de España', phone: '+34 600 000 001' },
      { id: 'mariachi-2', name: 'Mariachi Sol de Méntrida', phone: '+34 600 000 002' },
      { id: 'mariachi-3', name: 'Mariachi Gala Real Madrid', phone: '+34 600 000 003' },
    ]);
  }, [province]);

  const activeMariachi = useMemo(() => {
    return getActiveRelayProvider(mariachiCascade, elapsedMinutes);
  }, [mariachiCascade, elapsedMinutes]);

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-[#030305] border border-white/10 p-6 sm:p-8 space-y-6 text-white font-sans min-h-[380px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Landmark className="w-3.5 h-3.5" />
            Adjudicación Rápida B2G · Art. 118 LCSP (&lt; 14.250 €)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-syne tracking-tight text-white">
            Expediente Municipal & Despacho 15-Min SLA
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Intervención Municipal Blindada · Justificación de No Fraccionamiento · Cascada SLA Automática
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-950 border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('EXPEDIENTE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'EXPEDIENTE'
                ? 'bg-[#ecb613] text-black shadow-md shadow-[#ecb613]/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Expediente Art. 118</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('MARIACHI_SLA')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'MARIACHI_SLA'
                ? 'bg-[#ecb613] text-black shadow-md shadow-[#ecb613]/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Relevo 15-Min Mariachi</span>
          </button>
        </div>
      </div>

      {activeTab === 'EXPEDIENTE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          {/* Configuración */}
          <div className="space-y-4 rounded-2xl bg-[#09090d]/80 border border-white/10 p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 font-mono flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#ecb613]" /> Parámetros de la Entidad Local
            </h3>

            <div>
              <label className="text-xs text-zinc-400 font-mono block mb-1">Municipio / Ayuntamiento</label>
              <input
                type="text"
                value={municipality}
                onChange={(e) => setMunicipality(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-[#ecb613]"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 font-mono block mb-1">Provincia</label>
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-[#ecb613]"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 font-mono block mb-1.5">Programa Artístico / Asistencial</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(['FESTEJOS_POPULARES', 'VIMUME_SENIOR_40HZ', 'GALA_CULTURAL'] as B2GProgramType[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setProgramType(p)}
                    className={`py-2 px-2 rounded-xl text-[10px] font-mono font-bold uppercase transition-all ${
                      programType === p
                        ? 'bg-[#ecb613] text-black'
                        : 'bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {p.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-400 font-mono block mb-1">
                Importe del Contrato Menor (€ IVA excl.): {amountEur.toFixed(2)} €
              </label>
              <input
                type="range"
                min={1000}
                max={16000}
                step={250}
                value={amountEur}
                onChange={(e) => setAmountEur(Number(e.target.value))}
                className="w-full accent-[#ecb613]"
              />
              <div className="text-[10px] font-mono text-zinc-500 mt-1 flex justify-between">
                <span>Mínimo: 1.000 €</span>
                <span className={amountEur > AJUSTE_PREVENTIVO_B2G_EUR ? 'text-[#FF2B44] font-bold' : 'text-zinc-400'}>
                  Techo Preventivo: {AJUSTE_PREVENTIVO_B2G_EUR.toFixed(2)} €
                </span>
              </div>
            </div>
          </div>

          {/* Expediente resultante */}
          <div className="rounded-2xl bg-[#09090d]/80 border border-white/10 p-5 flex flex-col justify-between">
            {expediente.valid ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> EXPEDIENTE APTO INTERVENCIÓN
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">{expediente.expedienteId}</span>
                </div>

                <div className="text-xs font-mono space-y-2 text-zinc-300">
                  <div>
                    <span className="text-zinc-500">CPV Oficial:</span> {expediente.cpvCode} ({expediente.cpvDescription})
                  </div>
                  <div>
                    <span className="text-zinc-500">Límite Acústico:</span> {expediente.acousticProtocol.maxDba} dBA ({expediente.acousticProtocol.lawReference})
                  </div>
                  <div>
                    <span className="text-zinc-500">Retorno Social (SROI {expediente.socialImpactSroi.ratio}x):</span>{' '}
                    <span className="text-cyan-400 font-bold">{expediente.socialImpactSroi.socialReturnEur.toFixed(2)} €</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-zinc-400 italic">
                    &quot;{expediente.legalJustificationNonFractioning}&quot;
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 space-y-2 font-mono text-xs">
                <div className="flex items-center gap-2 font-bold text-red-400">
                  <AlertTriangle className="w-4 h-4" /> REPARO PREVENTIVO DE INTERVENCIÓN
                </div>
                <p>{expediente.reason}</p>
              </div>
            )}

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="text-xs font-mono text-zinc-400">
                Conserjería B2G: <span className="text-white font-bold">{CENTRALITA_EAR_OS}</span>
              </div>
              <button
                type="button"
                disabled={!expediente.valid}
                onClick={() => alert(`Expediente ${expediente.expedienteId} listo para firma digital eIDAS.`)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                  expediente.valid
                    ? 'bg-[#ecb613] text-black hover:bg-amber-400'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Memoria B2G</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'MARIACHI_SLA' && (
        <div className="rounded-2xl bg-[#09090d]/80 border border-white/10 p-5 space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 font-mono flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#ecb613]" /> Cascada de Relevo Automático 15-Minutos
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                Fianza de 100 € bloqueada · Si la agrupación #1 no acepta en 15 min, salta a la #2 sin perder el evento.
              </p>
            </div>
            <div className="text-right font-mono">
              <span className="text-[10px] text-zinc-500 block">Tiempo Transcurrido</span>
              <span className="text-lg font-bold text-[#ecb613]">{elapsedMinutes} min</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-mono block">Simular Reloj de SLA (0 a 45 minutos)</label>
            <input
              type="range"
              min={0}
              max={45}
              value={elapsedMinutes}
              onChange={(e) => setElapsedMinutes(Number(e.target.value))}
              className="w-full accent-[#ecb613]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {mariachiCascade.roster.map((group, idx) => {
              const isActive = activeMariachi?.id === group.id;
              const isPassed = elapsedMinutes >= (idx + 1) * 15;
              return (
                <div
                  key={group.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isActive
                      ? 'bg-[#ecb613]/10 border-[#ecb613] shadow-lg shadow-[#ecb613]/15'
                      : isPassed
                      ? 'bg-zinc-950/40 border-zinc-800/40 opacity-50'
                      : 'bg-zinc-900/60 border-white/5'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] font-mono mb-2">
                    <span className="font-bold uppercase text-zinc-400">Prioridad #{group.priorityOrder}</span>
                    <span className={isActive ? 'text-[#ecb613] font-bold animate-pulse' : 'text-zinc-600'}>
                      {isActive ? 'EN ALERTA (15M)' : isPassed ? 'RELEVO EXPIRADO' : 'EN COLA'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold font-syne text-white">{group.groupName}</h4>
                  <div className="text-xs font-mono text-zinc-400 mt-1 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-zinc-500" />
                    <span>{isActive ? group.maskedPhone : CENTRALITA_EAR_OS}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
