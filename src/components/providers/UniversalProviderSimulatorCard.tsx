'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Calculator,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
  ShieldCheck,
  Sliders,
  Sparkles,
  Users,
  Volume2,
  MapPin,
} from 'lucide-react';
import {
  ELASTIC_TOLERANCE_STEPS,
  simulateUniversalProviderQuote,
  type ElasticTolerancePct,
  type UniversalProviderMetadata,
} from '@/lib/providers/universal-provider-simulator';
import {
  resolveProviderCalendarHref,
  resolveProviderContractHref,
} from '@/lib/providers/provider-cta-engine';

export interface UniversalProviderSimulatorCardProps {
  readonly provider: UniversalProviderMetadata;
  readonly initialGuestsPax?: number;
  readonly initialCoupleBudgetEur?: number;
}

export function UniversalProviderSimulatorCard({
  provider,
  initialGuestsPax = 120,
  initialCoupleBudgetEur = 24000,
}: UniversalProviderSimulatorCardProps): React.JSX.Element {
  const [guestsPax, setGuestsPax] = useState<number>(initialGuestsPax);
  const [coupleBudgetEur, setCoupleBudgetEur] = useState<number>(initialCoupleBudgetEur);
  const [tolerancePct, setTolerancePct] = useState<ElasticTolerancePct>(10);
  const [distanceKm, setDistanceKm] = useState<number>(30);
  const [durationHours, setDurationHours] = useState<number>(3);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState<number>(0);

  const simulation = useMemo(
    () =>
      simulateUniversalProviderQuote({
        provider,
        guestsPax,
        coupleTotalBudgetEur: coupleBudgetEur,
        tolerancePct,
        distanceKm,
        durationHours,
        selectedMenuIndex,
      }),
    [provider, guestsPax, coupleBudgetEur, tolerancePct, distanceKm, durationHours, selectedMenuIndex],
  );

  const calendarHref = useMemo(
    () =>
      resolveProviderCalendarHref(
        {
          slug: provider.slug,
          id: provider.id ?? provider.slug,
          name: provider.name,
          category: provider.category,
        },
        { intent: 'bloquear' },
      ),
    [provider],
  );

  const contractHref = useMemo(
    () =>
      resolveProviderContractHref(
        {
          slug: provider.slug,
          id: provider.id ?? provider.slug,
          name: provider.name,
          category: provider.category,
        },
        {
          city: provider.province,
          amount: simulation.totalEstimatedEur,
        },
      ),
    [provider, simulation.totalEstimatedEur],
  );

  const verdictStyles =
    simulation.elasticFit.verdict === 'ENCAJE_EXACTO'
      ? {
          badge: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
          bar: 'bg-emerald-400',
        }
      : simulation.elasticFit.verdict === 'ENCAJE_ELASTICO'
        ? {
            badge: 'bg-amber-500/15 border-amber-500/40 text-[#ecb613]',
            bar: 'bg-[#ecb613]',
          }
        : {
            badge: 'bg-[#FF2B44]/15 border-[#FF2B44]/40 text-[#FF2B44]',
            bar: 'bg-[#FF2B44]',
          };

  const menus = provider.menus ?? [];

  return (
    <section
      id="simulador-universal-proveedor"
      aria-label={`Simulador universal y encaje presupuestario para ${provider.name}`}
      data-ear-track="menu-simulator"
      className="w-full min-h-[440px] rounded-3xl bg-[#09090d]/90 border border-white/10 p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6 transition-all duration-300 ease-out"
    >
      {/* Cabecera Anti-Fricción */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono uppercase tracking-widest">
            <Calculator className="w-3.5 h-3.5" /> Motor Magia Negra · Simulación en Tiempo Real
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white font-syne tracking-tight">
            Calculadora & Matching Elástico — <span className="text-[#ecb613]">{provider.name}</span>
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400">
            {simulation.archetypeLabel} · <span className="font-mono text-zinc-300">{simulation.signatureHash}</span> · Cero anuncios de competidores en esta ficha.
          </p>
        </div>

        <div className={`px-3.5 py-2 rounded-2xl border text-xs font-mono font-bold flex items-center gap-2 self-start md:self-auto ${verdictStyles.badge}`}>
          {simulation.elasticFit.verdict === 'FUERA_DE_RANGO' ? (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{simulation.elasticFit.verdictLabel}</span>
        </div>
      </div>

      {/* Controles Interactivos + Desglose */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Sliders de Simulación */}
        <div className="lg:col-span-7 space-y-5 bg-[#030305]/90 p-5 rounded-2xl border border-white/10">
          {/* Selector de Menú si el proveedor tiene cartas oficiales */}
          {menus.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-zinc-400 block">
                Carta / Menú Oficial de la Ficha
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {menus.map((menu, idx) => (
                  <button
                    key={menu.id}
                    type="button"
                    onClick={() => setSelectedMenuIndex(idx)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedMenuIndex === idx
                        ? 'bg-[#ecb613]/15 border-[#ecb613] text-white'
                        : 'bg-zinc-900/60 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>{menu.name}</span>
                      <span className="font-mono text-[#ecb613]">{menu.pricePerPaxEur} €/pax</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Slider 1: Invitados (Pax) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#ecb613]" /> Número de Invitados (Pax)
              </span>
              <span className="text-white font-bold text-sm">{guestsPax} invitados</span>
            </div>
            <input
              type="range"
              min={20}
              max={450}
              step={5}
              value={guestsPax}
              onChange={(e) => setGuestsPax(Number(e.target.value))}
              aria-label="Número de invitados"
              className="w-full accent-[#ecb613] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>20 pax (Íntimo)</span>
              <span>150 pax (Estándar)</span>
              <span>450 pax (Gran Gala)</span>
            </div>
          </div>

          {/* Slider 2: Presupuesto Global de la Pareja */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#ecb613]" /> Presupuesto Total de la Boda / Evento
              </span>
              <span className="text-white font-bold text-sm">
                {coupleBudgetEur.toLocaleString('es-ES')} €
              </span>
            </div>
            <input
              type="range"
              min={4000}
              max={80000}
              step={1000}
              value={coupleBudgetEur}
              onChange={(e) => setCoupleBudgetEur(Number(e.target.value))}
              aria-label="Presupuesto total del evento"
              className="w-full accent-[#ecb613] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>4.000 €</span>
              <span>Partida {simulation.elasticFit.canonicalShareWeightPct}%: {simulation.elasticFit.canonicalAllocatedEur.toLocaleString('es-ES')} €</span>
              <span>80.000 €</span>
            </div>
          </div>

          {/* Selector 3: Tolerancia Elástica (±5%, ±10%, ±15%, ±20%) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#ecb613]" /> Flexibilidad de Matching (Tolerancia Elástica)
              </span>
              <span className="text-[#ecb613] font-bold">±{tolerancePct}%</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {ELASTIC_TOLERANCE_STEPS.map((step) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => setTolerancePct(step)}
                  className={`py-2 rounded-xl font-mono text-xs font-bold border transition-all ${
                    tolerancePct === step
                      ? 'bg-[#ecb613] text-black border-[#ecb613] shadow-md'
                      : 'bg-zinc-900/70 text-zinc-400 border-white/10 hover:text-white'
                  }`}
                >
                  ±{step}%
                </button>
              ))}
            </div>
          </div>

          {/* Controles adicionales si es Música / Producción */}
          {simulation.acousticLogistics.appliesLogistics && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono text-zinc-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#ecb613]" /> Distancia desde {simulation.acousticLogistics.originLabel}
                  </span>
                  <span className="font-bold text-white">{distanceKm} km</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={400}
                  step={10}
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  aria-label="Distancia en kilómetros"
                  className="w-full accent-[#ecb613] cursor-pointer"
                />
                <span className="text-[10px] font-mono text-zinc-500 block">
                  {simulation.acousticLogistics.freeKmIncluded} km exentos · {simulation.acousticLogistics.kmRateEur.toFixed(2).replace('.', ',')} €/km adicional
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono text-zinc-300">
                  <span>Duración / Cobertura</span>
                  <span className="font-bold text-white">{durationHours} h</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={1}
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  aria-label="Duración en horas"
                  className="w-full accent-[#ecb613] cursor-pointer"
                />
                <span className="text-[10px] font-mono text-zinc-500 block">
                  Rider: {simulation.acousticLogistics.wattsRequired} W (&lt; {simulation.acousticLogistics.maxSplDb} dB SPL)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Columna Derecha: Recibo Financiero SSOT & CTAs */}
        <div className="lg:col-span-5 bg-[#030305] p-5 rounded-2xl border border-[#ecb613]/30 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                Estimación Transparente SSOT
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                {simulation.totalEstimatedEur.toLocaleString('es-ES')} €
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-300">
              {simulation.priceProvenance === 'DATO_VERIFICADO_FICHA'
                ? 'Precio Ficha Verificado'
                : 'Referencia Sectorial'}
            </span>
          </div>

          {/* Líneas de Desglose */}
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between text-zinc-300">
              <span>{simulation.unitLabel}:</span>
              <span className="text-white font-bold">{simulation.unitBasePriceEur.toLocaleString('es-ES')} €</span>
            </div>

            {simulation.acousticLogistics.appliesLogistics && (
              <div className="flex justify-between text-zinc-400">
                <span>Logística ({simulation.acousticLogistics.billableKm} km facturables):</span>
                <span>{simulation.acousticLogistics.travelCostEur} €</span>
              </div>
            )}

            {simulation.acousticLogistics.hotelRequired && (
              <div className="flex justify-between text-zinc-400">
                <span>Suplemento Hotel S-Class (&gt;200 km):</span>
                <span>{simulation.acousticLogistics.hotelSupplementEur} €</span>
              </div>
            )}

            <div className="flex justify-between text-emerald-400 pt-2 border-t border-white/10">
              <span>Depósito Bloqueo (100% deducible):</span>
              <span className="font-bold">-{simulation.depositLockEur} €</span>
            </div>

            <div className="flex justify-between text-white font-bold">
              <span>Restante a liquidar en el evento:</span>
              <span>{simulation.remainingAfterDepositEur.toLocaleString('es-ES')} €</span>
            </div>
          </div>

          {/* Barra de Encaje en Motor Magia Negra */}
          <div className="p-3 rounded-xl bg-zinc-900/70 border border-white/5 space-y-1.5">
            <div className="flex justify-between text-[10px] font-mono text-zinc-400">
              <span>{simulation.elasticFit.budgetCategoryLabel}</span>
              <span className="text-white font-bold">
                Techo ±{tolerancePct}%: {simulation.elasticFit.elasticCeilingEur.toLocaleString('es-ES')} €
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-black overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${verdictStyles.bar}`}
                style={{
                  width: `${Math.min(100, Math.max(8, simulation.elasticFit.utilizationPctOfCategory))}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span className="flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-[#ecb613]" /> {simulation.acousticLogistics.wattsRequired} W · máx {simulation.acousticLogistics.maxSplDb} dB SPL
              </span>
              <span>Split 80/10/10: {simulation.split.provider80Eur.toLocaleString('es-ES')} € proveedor</span>
            </div>
          </div>

          {/* CTAs Reales (Cero Botones Huérfanos) */}
          <div className="space-y-2.5 pt-1">
            <Link
              href={calendarHref}
              data-ear-track="deposit-lock"
              className="w-full py-3.5 px-4 rounded-2xl bg-[#ecb613] hover:bg-amber-400 text-black font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
            >
              <Calendar className="w-4 h-4" />
              <span>Bloquear Fecha en Calendario ({simulation.depositLockEur} € deducibles)</span>
            </Link>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Link
                href={contractHref}
                className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#ecb613]" />
                <span>Ver Contrato 2h</span>
              </Link>

              <a
                href={simulation.whatsappConciergeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Conserjería 24/7</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

