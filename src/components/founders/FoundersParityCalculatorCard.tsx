'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Award,
  Handshake,
  Lock,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import {
  calculateFoundersParity,
  MARKET_REFERENCE_TIERS,
  MAX_FOUNDERS_SLOTS,
  type FounderEnrollmentMode,
  type MarketReferenceTierId,
} from '@/lib/founders/founders-parity-engine';

export interface FoundersParityCalculatorCardProps {
  readonly defaultProviderName?: string;
  readonly defaultCategory?: string;
  readonly defaultProvince?: string;
  readonly defaultTicketEur?: number;
}

export function FoundersParityCalculatorCard({
  defaultProviderName = 'Ezkertza Berria',
  defaultCategory = 'Finca & Restaurante Nupcial',
  defaultProvince = 'Bizkaia',
  defaultTicketEur = 12000,
}: FoundersParityCalculatorCardProps): React.JSX.Element {
  const [mode, setMode] = useState<FounderEnrollmentMode>('PARIDAD_FUNDADOR_VITALICIO');
  const [referenceTierId, setReferenceTierId] = useState<MarketReferenceTierId>('tier_plata_212');
  const [customMonthlyFeeEur, setCustomMonthlyFeeEur] = useState<number>(185);
  const [competitorsOnOldProfile, setCompetitorsOnOldProfile] = useState<number>(4);
  const [avgTicketEur, setAvgTicketEur] = useState<number>(defaultTicketEur);
  const [bookingsPerYear, setBookingsPerYear] = useState<number>(15);
  const [previousContractRef, setPreviousContractRef] = useState<string>('');

  const result = useMemo(
    () =>
      calculateFoundersParity({
        providerName: defaultProviderName,
        category: defaultCategory,
        province: defaultProvince,
        mode,
        referenceTierId,
        customMonthlyFeeEur,
        competitorsShownOnOldProfile: competitorsOnOldProfile,
        averageBookingTicketEur: avgTicketEur,
        estimatedBookingsPerYear: bookingsPerYear,
        previousContractRef,
        confirmedFoundersCount: 0,
      }),
    [
      defaultProviderName,
      defaultCategory,
      defaultProvince,
      mode,
      referenceTierId,
      customMonthlyFeeEur,
      competitorsOnOldProfile,
      avgTicketEur,
      bookingsPerYear,
      previousContractRef,
    ],
  );

  return (
    <div
      id="pacto-100-fundadores"
      className="w-full min-h-[430px] rounded-3xl bg-[#09090d] border border-[#ecb613]/40 p-6 sm:p-8 shadow-2xl space-y-6"
    >
      {/* Cabecera */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/15 border border-[#ecb613]/40 text-[#ecb613] text-[10px] font-mono uppercase tracking-widest">
            <Award className="w-3.5 h-3.5" /> Pacto de los {MAX_FOUNDERS_SLOTS} Fundadores Vitalicios · Doble Vía Soberana
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white font-syne">
            Validador de Paridad de Contrato & Puente Split 80/10/10
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl">
            Elige cómo entrar: <strong className="text-white">igualamos tu recibo anterior congelado de por vida</strong> (0% comisiones por boda) o entra con <strong className="text-[#ecb613]">0 € de cuota mensual bajo Split 80/10/10</strong> para que te demostremos resultados antes de cobrar un solo euro.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-2xl bg-black border border-white/10 text-right shrink-0">
          <span className="text-[10px] font-mono uppercase text-zinc-500 block">Cupo Fundadores Vitalicios</span>
          <span className="text-lg font-mono font-black text-[#ecb613]">
            {result.remainingFoundersSlots} / {result.maxFoundersSlots} plazas disponibles
          </span>
        </div>
      </div>

      {/* Selector de Modalidad (Las 2 Puertas del CEO) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setMode('PARIDAD_FUNDADOR_VITALICIO')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            mode === 'PARIDAD_FUNDADOR_VITALICIO'
              ? 'bg-[#ecb613]/15 border-[#ecb613] text-white shadow-lg shadow-amber-500/10'
              : 'bg-black/60 border-white/10 text-zinc-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono uppercase font-bold text-[#ecb613] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Vía 1 · Paridad Fundador Vitalicio
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ecb613] text-black font-black">
              0% COMISIÓN POR BODA
            </span>
          </div>
          <p className="text-xs text-zinc-300">
            Igualamos al céntimo tu factura del directorio anterior y la congelamos de por vida (0% subida IPC + 0% competencia en tu ficha).
          </p>
        </button>

        <button
          type="button"
          onClick={() => setMode('PUENTE_SPLIT_CERO_CUOTA')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            mode === 'PUENTE_SPLIT_CERO_CUOTA'
              ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-lg shadow-emerald-500/10'
              : 'bg-black/60 border-white/10 text-zinc-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono uppercase font-bold text-emerald-400 flex items-center gap-1.5">
              <Handshake className="w-3.5 h-3.5" /> Vía 2 · Puente Split 80/10/10 (Cero Cuota)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-400 text-black font-black">
              0,00 € / MES FIJOS
            </span>
          </div>
          <p className="text-xs text-zinc-300">
            Para quien prefiere hechos antes que palabras: 0 € de cuota mensual, Conserjería 24/7 incluida y solo liquidamos 80/10/10 cuando cobras una reserva real.
          </p>
        </button>
      </div>

      {/* Cuerpo de Cálculo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-4 bg-[#030305] p-5 rounded-2xl border border-white/10">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-zinc-400 block">
              Escalón que pagabas en el directorio tradicional (sin IVA)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MARKET_REFERENCE_TIERS.map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setReferenceTierId(tier.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    referenceTierId === tier.id
                      ? 'bg-[#ecb613]/15 border-[#ecb613] text-white'
                      : 'bg-zinc-900/60 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold">{tier.label}</div>
                  <div className="text-[10px] font-mono text-zinc-400 mt-0.5">{tier.description}</div>
                </button>
              ))}
            </div>
          </div>

          {referenceTierId === 'factura_personalizada' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                  Tu cuota mensual actual (€/mes)
                </label>
                <input
                  type="number"
                  min={30}
                  max={2000}
                  value={customMonthlyFeeEur}
                  onChange={(e) => setCustomMonthlyFeeEur(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                  Referencia de factura / contrato (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: FAC-2025-0981"
                  value={previousContractRef}
                  onChange={(e) => setPreviousContractRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-xs"
                />
              </div>
            </div>
          )}

          {/* Sliders de impacto de negocio */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-white/10">
            <div>
              <div className="flex justify-between text-[11px] font-mono text-zinc-300 mb-1">
                <span>Competidores en tu ficha vieja</span>
                <span className="text-[#ecb613] font-bold">{competitorsOnOldProfile}</span>
              </div>
              <input
                type="range"
                min={0}
                max={12}
                step={1}
                value={competitorsOnOldProfile}
                onChange={(e) => setCompetitorsOnOldProfile(Number(e.target.value))}
                aria-label="Competidores anunciados en la ficha antigua"
                className="w-full accent-[#ecb613]"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-mono text-zinc-300 mb-1">
                <span>Ticket Medio (€)</span>
                <span className="text-white font-bold">{avgTicketEur.toLocaleString('es-ES')} €</span>
              </div>
              <input
                type="range"
                min={350}
                max={30000}
                step={250}
                value={avgTicketEur}
                onChange={(e) => setAvgTicketEur(Number(e.target.value))}
                aria-label="Ticket medio por evento"
                className="w-full accent-[#ecb613]"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-mono text-zinc-300 mb-1">
                <span>Eventos / Año</span>
                <span className="text-white font-bold">{bookingsPerYear}</span>
              </div>
              <input
                type="range"
                min={2}
                max={80}
                step={1}
                value={bookingsPerYear}
                onChange={(e) => setBookingsPerYear(Number(e.target.value))}
                aria-label="Eventos estimados al año"
                className="w-full accent-[#ecb613]"
              />
            </div>
          </div>
        </div>

        {/* Columna Derecha: Certificado de Paridad y Cierre */}
        <div className="lg:col-span-5 bg-[#030305] p-5 rounded-2xl border border-[#ecb613]/40 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                {mode === 'PARIDAD_FUNDADOR_VITALICIO'
                  ? 'Cuota Fundador Congelada de por Vida'
                  : 'Cuota Fija Mensual (Modalidad Split)'}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                {result.frozenMonthlyFeeEur.toLocaleString('es-ES', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                €/mes
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-[#ecb613]/15 border border-[#ecb613]/40 text-[10px] font-mono text-[#ecb613] font-bold">
              {result.certificateCode}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between text-zinc-300">
              <span>Total anual congelado:</span>
              <span className="text-white font-bold">
                {result.frozenAnnualFeeEur.toLocaleString('es-ES', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                €/año
              </span>
            </div>

            <div className="flex justify-between text-emerald-400">
              <span>Ahorro 5 años (0% subida IPC):</span>
              <span className="font-bold">+{result.fiveYearIpcSavingsEur.toLocaleString('es-ES')} €</span>
            </div>

            <div className="flex justify-between text-[#ecb613]">
              <span>Facturación recuperada (0 fugas):</span>
              <span className="font-bold">
                +{result.recoveredRevenuePerYearEur.toLocaleString('es-ES')} €/año ({result.leakedLeadsRecoveredPerYear} bodas)
              </span>
            </div>

            {mode === 'PUENTE_SPLIT_CERO_CUOTA' && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] space-y-1 mt-2">
                <div className="text-emerald-300 font-bold">
                  Liquidación Split Soberano por reserva cerrada ({result.splitSimulationPerBooking.grossTicketEur.toLocaleString('es-ES')} €):
                </div>
                <div className="flex justify-between text-zinc-200">
                  <span>80% Neto Proveedor:</span>
                  <span className="font-bold">{result.splitSimulationPerBooking.providerNet80Eur.toLocaleString('es-ES')} €</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>10% EAR OS (Conserjería 24/7 + Tech):</span>
                  <span>{result.splitSimulationPerBooking.earOs10Eur.toLocaleString('es-ES')} €</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>10% Impacto Social VIMUME (Deducción Ley 49/2002):</span>
                  <span>{result.splitSimulationPerBooking.vimumeSocial10Eur.toLocaleString('es-ES')} €</span>
                </div>
              </div>
            )}
          </div>

          {/* CTAs de Activación */}
          <div className="space-y-2.5 pt-2">
            <a
              href={result.whatsappActivationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-[#ecb613] hover:bg-amber-400 text-black font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
            >
              <MessageCircle className="w-4 h-4" />
              <span>
                {mode === 'PARIDAD_FUNDADOR_VITALICIO'
                  ? 'Bloquear Plaza de Fundador Vitalicio (WhatsApp)'
                  : 'Activar Modalidad Split 0 €/mes (WhatsApp)'}
              </span>
            </a>

            <Link
              href={`/reservar/contrato?proveedor=${encodeURIComponent(defaultProviderName.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 font-mono text-[11px] font-bold flex items-center justify-center gap-2 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#ecb613]" />
              <span>Formalizar Contrato con Depósito Deducible ({result.splitSimulationPerBooking.clientDepositLockEur} €)</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
