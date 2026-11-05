'use client';

import React, { useState, useMemo } from 'react';
import {
  Mic,
  Disc,
  DollarSign,
  Radio,
  Music,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  calculateArtistQuote,
  settleArtistSplit,
  validateIsrc,
  generateCanonicalIsrc,
  MIN_CACHE_BY_FORMAT,
  type ArtistFormat,
  EDWIN_AGUDELO_PROFILE_360,
} from '@/lib/artists/artist-360-contract';

export default function Artist360ControlHub() {
  const [activeTab, setActiveTab] = useState<'CACHE' | 'ISRC' | 'SPLIT'>('CACHE');
  const [selectedFormat, setSelectedFormat] = useState<ArtistFormat>('SOLISTA');
  const [distanceKm, setDistanceKm] = useState<number>(85);
  const [endHour24, setEndHour24] = useState<number>(2);
  const [customBaseCache, setCustomBaseCache] = useState<number>(350);

  // Capa B: ISRC state
  const [testIsrc, setTestIsrc] = useState<string>('ES-EAR-26-00001');

  // Cálculos dinámicos
  const quote = useMemo(() => {
    return calculateArtistQuote({
      format: selectedFormat,
      distanceKm,
      endHour24,
      customBaseCacheEur: customBaseCache,
    });
  }, [selectedFormat, distanceKm, endHour24, customBaseCache]);

  const split = useMemo(() => {
    return settleArtistSplit(quote.totalEventEur);
  }, [quote.totalEventEur]);

  const isrcAudit = useMemo(() => {
    return validateIsrc(testIsrc);
  }, [testIsrc]);

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-[#030305] border border-white/10 p-6 sm:p-8 space-y-6 text-white font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Portal Soberano de Artistas Europa · 360°
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-syne tracking-tight text-white">
            {EDWIN_AGUDELO_PROFILE_360.artistName} // Hub de Control
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Sede: {EDWIN_AGUDELO_PROFILE_360.fiscalCity} ({EDWIN_AGUDELO_PROFILE_360.fiscalProvince}) · 0% Fuga a Intermediarios · Split 80/10/10 Inmutable
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-950 border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('CACHE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'CACHE'
                ? 'bg-[#ecb613] text-black shadow-md shadow-[#ecb613]/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Caché & Logística</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ISRC')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'ISRC'
                ? 'bg-[#ecb613] text-black shadow-md shadow-[#ecb613]/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
            <span>ISRC & Distribución</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SPLIT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'SPLIT'
                ? 'bg-[#ecb613] text-black shadow-md shadow-[#ecb613]/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Liquidación 80/10/10</span>
          </button>
        </div>
      </div>

      {/* PESTAÑA 1: CACHÉ INDIVIDUAL Y LOGÍSTICA */}
      {activeTab === 'CACHE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          <div className="space-y-4 rounded-2xl bg-[#09090d]/80 border border-white/10 p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 font-mono flex items-center gap-2">
              <Mic className="w-4 h-4 text-[#ecb613]" /> Configuración de Formato
            </h3>

            <div>
              <label className="text-xs text-zinc-400 font-mono block mb-1.5">Formato del Espectáculo</label>
              <div className="grid grid-cols-3 gap-2">
                {(['SOLISTA', 'DUO', 'MARIACHI', 'ORQUESTA', 'DJ'] as ArtistFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => {
                      setSelectedFormat(fmt);
                      setCustomBaseCache(Math.max(customBaseCache, MIN_CACHE_BY_FORMAT[fmt]));
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      selectedFormat === fmt
                        ? 'bg-[#ecb613] text-black'
                        : 'bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-400 font-mono block mb-1">
                Caché Base Solicitado (Mínimo: {MIN_CACHE_BY_FORMAT[selectedFormat]} €)
              </label>
              <input
                type="number"
                min={MIN_CACHE_BY_FORMAT[selectedFormat]}
                value={customBaseCache}
                onChange={(e) => setCustomBaseCache(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-[#ecb613]"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 font-mono block mb-1">
                Distancia al Evento: {distanceKm} km (50 km exentos)
              </label>
              <input
                type="range"
                min={0}
                max={400}
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full accent-[#ecb613]"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 font-mono block mb-1">
                Hora Prevista de Cierre: {endHour24}:00 h
              </label>
              <input
                type="range"
                min={0}
                max={6}
                value={endHour24}
                onChange={(e) => setEndHour24(Number(e.target.value))}
                className="w-full accent-[#ecb613]"
              />
            </div>
          </div>

          {/* Desglose en vivo */}
          <div className="rounded-2xl bg-[#09090d]/80 border border-white/10 p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 font-mono flex items-center justify-between pb-3 border-b border-white/10">
                <span>Resumen Económico</span>
                <span className="text-[10px] text-[#ecb613] font-bold">LEY 37/2003 · 12W/PAX</span>
              </h3>

              <div className="space-y-2.5 mt-4 text-xs font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>Caché Base Homologado:</span>
                  <span className="text-white font-bold">{quote.baseCacheEur.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Kilometraje facturable ({quote.chargeableKm} km x 1,50 €):</span>
                  <span className="text-white">{quote.logisticsTotalEur.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Suplemento hotelero (hora &gt;= 3:00 o &gt; 200 km):</span>
                  <span className="text-white">{quote.hotelSupplementEur.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-emerald-400 pt-2 border-t border-white/5 font-bold">
                  <span>Depósito Stripe (100% deducible):</span>
                  <span>- {quote.depositDeductibleEur.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-1">
              <div className="text-[11px] font-mono text-zinc-500 uppercase">Total Evento Cliente</div>
              <div className="text-3xl font-black font-mono text-[#ecb613]">
                {quote.totalEventEur.toFixed(2)} €
              </div>
              <div className="text-[10px] font-mono text-zinc-400">
                Liquidación restante tras fianza: {quote.pendingFinalSettlementEur.toFixed(2)} €
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: ISRC Y DISTRIBUCIÓN */}
      {activeTab === 'ISRC' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="rounded-2xl bg-[#09090d]/80 border border-white/10 p-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 font-mono flex items-center gap-2">
              <Disc className="w-4 h-4 text-[#ecb613]" /> Auditor y Generador ISRC (ISO 3901)
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Prefijo Registrante Oficial: <span className="text-[#ecb613] font-bold">ES-EAR</span> (España · Productora EAR).
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <input
                type="text"
                value={testIsrc}
                onChange={(e) => setTestIsrc(e.target.value)}
                placeholder="ES-EAR-26-00001"
                className="w-full sm:flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#ecb613]"
              />
              <button
                type="button"
                onClick={() => setTestIsrc(generateCanonicalIsrc(26, Math.floor(Math.random() * 90000) + 10000))}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono font-bold text-white transition-all flex items-center justify-center gap-2"
              >
                <Music className="w-3.5 h-3.5 text-[#ecb613]" /> Generar Aleatorio
              </button>
            </div>

            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              isrcAudit.valid
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                : 'bg-red-500/10 border-red-500/20 text-red-300'
            }`}>
              {isrcAudit.valid ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              )}
              <div className="text-xs font-mono space-y-1">
                <div className="font-bold uppercase tracking-wider">
                  {isrcAudit.valid ? 'Código ISRC Válido e Indexable' : 'Código No Homologado'}
                </div>
                {isrcAudit.valid ? (
                  <div>
                    País: {isrcAudit.country} · Registrante: {isrcAudit.registrant} · Año: 20{isrcAudit.year} · Designación: #{isrcAudit.designation}
                  </div>
                ) : (
                  <div>{isrcAudit.reason}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 3: LIQUIDACIÓN SPLIT SOBERANO 80/10/10 */}
      {activeTab === 'SPLIT' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
          {/* 80% Artista */}
          <div className="p-5 rounded-3xl bg-[#09090d]/80 border border-emerald-500/30 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                80% Caché Soberano
              </div>
              <h4 className="text-lg font-bold font-syne text-white mt-1">Artista Ejecutor</h4>
              <p className="text-[11px] text-zinc-400 font-mono mt-1">
                Retribución neta directa sin descuentos ni comisiones de agencia.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="text-2xl font-black font-mono text-emerald-400">
                {split.artistAmountEur.toFixed(2)} €
              </div>
              <div className="text-[9px] font-mono text-zinc-500 mt-1">
                Pendiente tras depósito: {split.artistNetPendingEur.toFixed(2)} €
              </div>
            </div>
          </div>

          {/* 10% EAR OS */}
          <div className="p-5 rounded-3xl bg-[#09090d]/80 border border-[#ecb613]/30 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono text-[#ecb613] font-bold uppercase tracking-wider">
                10% Infraestructura
              </div>
              <h4 className="text-lg font-bold font-syne text-white mt-1">EAR OS Infra</h4>
              <p className="text-[11px] text-zinc-400 font-mono mt-1">
                Stripe Price-Lock, servidor bare-metal y telemetría en tiempo real.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="text-2xl font-black font-mono text-[#ecb613]">
                {split.earOsAmountEur.toFixed(2)} €
              </div>
              <div className="text-[9px] font-mono text-zinc-500 mt-1">
                0 € cuotas fijas mensuales
              </div>
            </div>
          </div>

          {/* 10% VIMUME */}
          <div className="p-5 rounded-3xl bg-[#09090d]/80 border border-cyan-500/30 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                10% Obra Social
              </div>
              <h4 className="text-lg font-bold font-syne text-white mt-1">VIMUME Mayor</h4>
              <p className="text-[11px] text-zinc-400 font-mono mt-1">
                Neuroacústica 40 Hz y deducción hasta el 80% IRPF (Ley 49/2002).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="text-2xl font-black font-mono text-cyan-400">
                {split.vimumeAmountEur.toFixed(2)} €
              </div>
              <div className="text-[9px] font-mono text-zinc-500 mt-1">
                SROI Social 4.85x acreditado
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
