'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calculator,
  Compass,
  ShieldCheck,
  Layers,
  MapPin,
  MessageCircle,
  ArrowRight,
  Volume2,
  Building2,
  Music,
  Sliders,
  CheckCircle2,
  UserCheck,
} from 'lucide-react';
import { TWELVE_CANONICAL_HUBS } from '@/lib/config/twelve-canonical-hubs';

export type IntentVertical = 'ARTISTAS' | 'FINCAS' | 'PROVEEDORES' | 'B2G';

export type PricingScopeMode = 'EDWIN_AGUDELO_HUB_MENTRIDA' | 'PROVEEDOR_SEDE_PROPIA';

export interface SovereignIntentHubViewProps {
  readonly title?: string;
  readonly description?: string;
  readonly location: string;
  readonly province?: string;
  readonly serviceId?: string;
  readonly category?: string;
  readonly providerName?: string;
  readonly providerHeadquarters?: string;
  readonly providerBasePriceEur?: number;
  readonly providerFreeKm?: number;
  readonly providerKmRateEur?: number;
}

const OFFICIAL_WHATSAPP = 'https://wa.me/34693693048';
const OFFICIAL_PHONE_DISPLAY = '+34 693 693 048';

// SSOT Inmutable (AGENTS.md §4) — Aplica EXCLUSIVAMENTE a Edwin Agudelo / Productora EAR (Hub Méntrida)
const SOLOIST_BASE_CENTS = 35000; // 350,00 €
const EDWIN_FREE_KM = 50;
const EDWIN_KM_RATE_CENTS = 150; // 1,50 €/km
const HOTEL_SUPPLEMENT_CENTS = 12000; // 120,00 €
const DEPOSIT_CENTS = 10000; // 100,00 €
const B2G_MAX_CENTS = 1425000; // 14.250,00 €

function detectVertical(serviceId?: string, category?: string, title?: string): IntentVertical {
  const combined = `${serviceId || ''} ${category || ''} ${title || ''}`.toLowerCase();
  if (/ayuntamiento|b2g|licitacion|festejo|patronal|vimume|mayor|residencia/.test(combined)) {
    return 'B2G';
  }
  if (/finca|boda|espacio|banquete|hacienda|masia|menu|restaurante/.test(combined)) {
    return 'FINCAS';
  }
  if (/pantalla|led|sonido|altavo|iluminacion|alquiler|chofer|transporte|catering|brasa|foto|video|truss|escenario/.test(combined)) {
    return 'PROVEEDORES';
  }
  return 'ARTISTAS';
}

function detectInitialScope(
  serviceId?: string,
  title?: string,
  providerName?: string,
  vertical?: IntentVertical,
): PricingScopeMode {
  const combined = `${serviceId || ''} ${title || ''} ${providerName || ''}`.toLowerCase();
  if (
    /edwin|agudelo|solista|tenor|productora ear|mariachi/.test(combined) &&
    !providerName
  ) {
    return 'EDWIN_AGUDELO_HUB_MENTRIDA';
  }
  if (providerName && !/edwin|productora ear/i.test(providerName)) {
    return 'PROVEEDOR_SEDE_PROPIA';
  }
  if (vertical && vertical !== 'ARTISTAS') {
    return 'PROVEEDOR_SEDE_PROPIA';
  }
  return 'EDWIN_AGUDELO_HUB_MENTRIDA';
}

function formatEurFromCents(cents: number): string {
  return (
    (cents / 100).toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' €'
  );
}

export function SovereignIntentHubView({
  title = 'Productora EAR · Soluciones S-Class',
  description = 'Cotización inmediata en céntimos enteros, Match Bilateral de Expectativas y bloqueo de fecha con depósito deducible.',
  location,
  province,
  serviceId,
  category,
  providerName,
  providerHeadquarters,
  providerBasePriceEur,
  providerFreeKm = 30,
  providerKmRateEur = 1.2,
}: SovereignIntentHubViewProps): React.ReactElement {
  const detectedVertical = useMemo(
    () => detectVertical(serviceId, category, title),
    [serviceId, category, title]
  );

  const [activeTab, setActiveTab] = useState<'calculator' | 'catalog' | 'acoustics' | 'hubs'>('calculator');
  const [selectedVertical, setSelectedVertical] = useState<IntentVertical>(detectedVertical);
  const [pricingScope, setPricingScope] = useState<PricingScopeMode>(() =>
    detectInitialScope(serviceId, title, providerName, detectedVertical)
  );
  const [distanceKm, setDistanceKm] = useState<number>(35);
  const [lateNight, setLateNight] = useState<boolean>(false);
  const [guestsPax, setGuestsPax] = useState<number>(120);
  const [formatMultiplier, setFormatMultiplier] = useState<number>(1);
  const [customProviderBaseEur, setCustomProviderBaseEur] = useState<number>(() => {
    if (providerBasePriceEur && providerBasePriceEur > 0) return providerBasePriceEur;
    if (detectedVertical === 'FINCAS') return 95;
    return 600;
  });

  const isEdwinScope = pricingScope === 'EDWIN_AGUDELO_HUB_MENTRIDA';
  const registeredOriginLabel = isEdwinScope
    ? 'Hub Méntrida (Exclusivo Edwin Agudelo)'
    : providerHeadquarters || `Sede Registrada del Proveedor en ${province || location}`;

  const calculation = useMemo(() => {
    const activeFreeKm = isEdwinScope ? EDWIN_FREE_KM : providerFreeKm;
    const activeKmRateCents = isEdwinScope
      ? EDWIN_KM_RATE_CENTS
      : Math.round(providerKmRateEur * 100);

    const appliesLogistics = selectedVertical !== 'FINCAS';
    const billableKm = appliesLogistics ? Math.max(0, distanceKm - activeFreeKm) : 0;
    const logisticsCents = appliesLogistics ? billableKm * activeKmRateCents : 0;
    const hotelCents = appliesLogistics && (lateNight || distanceKm > 200) ? HOTEL_SUPPLEMENT_CENTS : 0;

    let baseServiceCents = isEdwinScope
      ? SOLOIST_BASE_CENTS * formatMultiplier
      : Math.round(customProviderBaseEur * 100) * formatMultiplier;

    if (selectedVertical === 'FINCAS') {
      baseServiceCents = guestsPax * (isEdwinScope ? 11500 : Math.round(customProviderBaseEur * 100));
    } else if (selectedVertical === 'PROVEEDORES') {
      baseServiceCents = (isEdwinScope ? 42000 : Math.round(customProviderBaseEur * 100)) * formatMultiplier;
    } else if (selectedVertical === 'B2G') {
      baseServiceCents = Math.min(B2G_MAX_CENTS, 280000 * formatMultiplier);
    }

    const totalCents = baseServiceCents + logisticsCents + hotelCents;
    const artist80Cents = Math.round(totalCents * 0.8);
    const earOs10Cents = Math.round(totalCents * 0.1);
    const vimume10Cents = totalCents - artist80Cents - earOs10Cents;
    const remainingAfterDepositCents = Math.max(0, totalCents - DEPOSIT_CENTS);
    const maxRecommendedWatts = guestsPax * 12;

    return {
      activeFreeKm,
      activeKmRateCents,
      baseServiceCents,
      billableKm,
      logisticsCents,
      hotelCents,
      totalCents,
      artist80Cents,
      earOs10Cents,
      vimume10Cents,
      remainingAfterDepositCents,
      maxRecommendedWatts,
    };
  }, [
    isEdwinScope,
    providerFreeKm,
    providerKmRateEur,
    customProviderBaseEur,
    providerBasePriceEur,
    selectedVertical,
    distanceKm,
    lateNight,
    guestsPax,
    formatMultiplier,
  ]);

  const canonicalDestination = useMemo(() => {
    switch (selectedVertical) {
      case 'FINCAS':
        return { href: '/fincas', label: 'Abrir Explorador Nacional de Fincas (HUB 04)' };
      case 'PROVEEDORES':
        return { href: '/proveedores', label: 'Abrir Super-Directorio de Proveedores (HUB 05)' };
      case 'B2G':
        return { href: '/b2g', label: 'Abrir Portal Institucional B2G & VIMUME (HUB 08)' };
      default:
        return { href: '/artistas', label: 'Abrir Catálogo Nacional de Artistas (HUB 02)' };
    }
  }, [selectedVertical]);

  const whatsappText = encodeURIComponent(
    isEdwinScope
      ? `Hola Edwin, consulto desde ${location} por "${title}" (Origen: Hub Méntrida). Presupuesto calculado: ${formatEurFromCents(calculation.totalCents)} (${guestsPax} pax, ${distanceKm} km). Quiero confirmar disponibilidad.`
      : `Hola, consulto en ${location} por "${providerName || title}" (Origen: ${registeredOriginLabel}). Presupuesto estimado según ficha del proveedor: ${formatEurFromCents(calculation.totalCents)} (${guestsPax} pax, ${distanceKm} km desde sede del proveedor).`
  );

  return (
    <main className="w-full overflow-x-hidden bg-[#030305] text-white min-h-screen pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* CABECERA CONTEXTUAL DE INTENCIÓN */}
        <header className="p-6 sm:p-8 rounded-3xl bg-[#050507] border border-white/10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] font-mono text-xs uppercase tracking-wider">
              <MapPin size={14} strokeWidth={1.75} />
              <span>Cobertura Verificada · {location}{province && province !== location ? ` (${province})` : ''}</span>
            </div>
            <div className="font-mono text-xs text-white/60">
              Match Bilateral de Expectativas · Fianza Deducible 100,00 € · Centralita {OFFICIAL_PHONE_DISPLAY}
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-white/70 max-w-3xl leading-relaxed">
            {description}
          </p>

          {/* REGLA DE ORIGEN LOGÍSTICO DIFERENCIADA (EDWIN VS RESTO DE PROVEEDORES) */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-mono uppercase tracking-wider text-[#ecb613] font-bold flex items-center gap-1.5">
                <UserCheck size={14} strokeWidth={1.75} />
                <span>Regla de Origen Logístico y Tarifario:</span>
              </div>
              <p className="text-xs text-white/70">
                {isEdwinScope
                  ? 'Modo Roster Propio (Edwin Agudelo): Aplica suelo canónico de 350,00 € y logística desde Hub Méntrida (50 km exentos + 1,50 €/km).'
                  : `Modo Red Nacional de Proveedores: El kilometraje, tarifas, FAQs y disponibilidad se calculan desde la sede registrada en la ficha de cada proveedor (${registeredOriginLabel}).`}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setPricingScope('EDWIN_AGUDELO_HUB_MENTRIDA')}
                className={`px-3 py-2 rounded-xl font-mono text-[11px] font-bold border transition-all ${
                  isEdwinScope
                    ? 'bg-[#ecb613] text-black border-[#ecb613]'
                    : 'bg-black/40 text-white/60 border-white/10 hover:text-white'
                }`}
              >
                Edwin Agudelo (Hub Méntrida)
              </button>
              <button
                type="button"
                onClick={() => setPricingScope('PROVEEDOR_SEDE_PROPIA')}
                className={`px-3 py-2 rounded-xl font-mono text-[11px] font-bold border transition-all ${
                  !isEdwinScope
                    ? 'bg-[#ecb613] text-black border-[#ecb613]'
                    : 'bg-black/40 text-white/60 border-white/10 hover:text-white'
                }`}
              >
                Otro Proveedor (Sede Propia)
              </button>
            </div>
          </div>

          {/* BARRA DE PESTAÑAS SINGLE-PAGE (ZERO-RELOAD) */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2" role="tablist" aria-label="Secciones de la solución">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'calculator'}
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-colors ${
                activeTab === 'calculator'
                  ? 'bg-[#ecb613] text-black font-bold'
                  : 'bg-white/[0.03] text-white/70 hover:text-white border border-white/10'
              }`}
            >
              <Calculator size={15} strokeWidth={1.75} />
              <span>1. Calculadora & Origen Real</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'catalog'}
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-colors ${
                activeTab === 'catalog'
                  ? 'bg-[#ecb613] text-black font-bold'
                  : 'bg-white/[0.03] text-white/70 hover:text-white border border-white/10'
              }`}
            >
              <Compass size={15} strokeWidth={1.75} />
              <span>2. Catálogo Verificado en {location}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'acoustics'}
              onClick={() => setActiveTab('acoustics')}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-colors ${
                activeTab === 'acoustics'
                  ? 'bg-[#ecb613] text-black font-bold'
                  : 'bg-white/[0.03] text-white/70 hover:text-white border border-white/10'
              }`}
            >
              <ShieldCheck size={15} strokeWidth={1.75} />
              <span>3. Garantía de Match Bilateral & Acústica</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'hubs'}
              onClick={() => setActiveTab('hubs')}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-colors ${
                activeTab === 'hubs'
                  ? 'bg-[#ecb613] text-black font-bold'
                  : 'bg-white/[0.03] text-white/70 hover:text-white border border-white/10'
              }`}
            >
              <Layers size={15} strokeWidth={1.75} />
              <span>4. Mapa de las 12 Super-Pantallas</span>
            </button>
          </div>
        </header>

        {/* PESTAÑA 1: CALCULADORA TRANSACCIONAL DIFERENCIADA POR ORIGEN */}
        {activeTab === 'calculator' && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#050507] border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {isEdwinScope
                      ? 'Configurador Oficial · Edwin Agudelo (Hub Méntrida)'
                      : `Simulador según Ficha del Proveedor (${registeredOriginLabel})`}
                  </h2>
                  <p className="text-xs text-white/60 mt-1">
                    {isEdwinScope
                      ? `Tarifa base 350,00 € + 1,50 €/km desde km 50 hacia ${location}.`
                      : `Calcula sobre las condiciones declaradas por el proveedor desde su propia sede registrada hasta ${location}.`}
                  </p>
                </div>
                <Sliders size={18} strokeWidth={1.75} className="text-[#ecb613]" />
              </div>

              {/* Selector de Vertical */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60">
                  Vertical de Servicio
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      { id: 'ARTISTAS', label: 'Artistas & Música' },
                      { id: 'FINCAS', label: 'Fincas & Menús' },
                      { id: 'PROVEEDORES', label: 'Sonido & Arsenal' },
                      { id: 'B2G', label: 'Ayuntamientos B2G' },
                    ] as const
                  ).map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVertical(v.id)}
                      className={`py-2.5 px-3 rounded-xl font-mono text-xs font-bold border transition-colors ${
                        selectedVertical === v.id
                          ? 'bg-[#ecb613]/15 border-[#ecb613] text-[#ecb613]'
                          : 'bg-white/[0.02] border-white/10 text-white/70 hover:border-white/20'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Si es Proveedor Externo, permitir ajustar la tarifa base declarada en su ficha */}
              {!isEdwinScope && (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#ecb613]">TARIFA BASE DECLARADA EN LA FICHA DEL PROVEEDOR</span>
                    <span className="text-white font-bold">{customProviderBaseEur} €</span>
                  </div>
                  <input
                    type="range"
                    min={150}
                    max={3500}
                    step={50}
                    value={customProviderBaseEur}
                    onChange={(e) => setCustomProviderBaseEur(Number(e.target.value))}
                    className="w-full accent-[#ecb613]"
                  />
                  <p className="text-[11px] text-white/50">
                    Cada proveedor del directorio define su propio caché mínimo, suplementos, calendario y preguntas frecuentes.
                  </p>
                </div>
              )}

              {/* Formato / Escala */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60">
                  {isEdwinScope ? 'Formato Oficial Edwin Agudelo (5 Formatos Bodas.net)' : 'Escala / Pack del Proveedor'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      mult: 1,
                      label: isEdwinScope ? 'Solista (350 € · 2x30m Bose)' : 'Pack Base Ficha',
                    },
                    {
                      mult: 2,
                      label: isEdwinScope ? 'Agrupación 6 Músicos' : 'Pack Intermedio',
                    },
                    {
                      mult: 3,
                      label: isEdwinScope ? 'Mariachi 9-13 Músicos Premium' : 'Pack Completo / Gala',
                    },
                  ].map((f) => (
                    <button
                      key={f.mult}
                      type="button"
                      onClick={() => setFormatMultiplier(f.mult)}
                      className={`py-2.5 px-3 rounded-xl font-mono text-xs border transition-colors ${
                        formatMultiplier === f.mult
                          ? 'bg-white/10 border-white text-white font-bold'
                          : 'bg-white/[0.02] border-white/10 text-white/60 hover:border-white/20'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders de Aforo y Distancia */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-white/60">AFORO ESTIMADO</span>
                    <span className="text-white font-bold">{guestsPax} pax ({calculation.maxRecommendedWatts} W acústicos)</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={800}
                    step={10}
                    value={guestsPax}
                    onChange={(e) => setGuestsPax(Number(e.target.value))}
                    className="w-full accent-[#ecb613]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-white/60">
                      {isEdwinScope
                        ? 'DISTANCIA DESDE HUB MÉNTRIDA (50 KM EXENTOS)'
                        : `DISTANCIA DESDE SEDE DEL PROVEEDOR (${calculation.activeFreeKm} KM EXENTOS)`}
                    </span>
                    <span className="text-white font-bold">{distanceKm} km</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={500}
                    step={5}
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(Number(e.target.value))}
                    className="w-full accent-[#ecb613]"
                  />
                </div>
              </div>

              {/* Checkbox nocturnidad */}
              <div className="pt-2 flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                <div>
                  <div className="text-xs font-bold text-white">Finalización a partir de las 03:00 AM o &gt;200 km</div>
                  <div className="text-xs text-white/50 font-mono">Aplica suplemento reglamentario de dieta/hotel (+120,00 €)</div>
                </div>
                <input
                  type="checkbox"
                  checked={lateNight || distanceKm > 200}
                  onChange={(e) => setLateNight(e.target.checked)}
                  className="h-5 w-5 accent-[#ecb613]"
                />
              </div>
            </div>

            {/* Columna Derecha: Desglose en Céntimos + CTAs de Conversión */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#050507] border border-[#ecb613]/40 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#ecb613]">
                    {isEdwinScope ? 'Liquidación Oficial Edwin Agudelo' : 'Estimación según Ficha del Proveedor'}
                  </span>
                  <span className="text-xs font-mono text-white/50">Origen: {isEdwinScope ? 'Hub Méntrida' : 'Sede Propia'}</span>
                </div>

                <div className="font-mono text-4xl sm:text-5xl font-bold text-white">
                  {formatEurFromCents(calculation.totalCents)}
                </div>

                <div className="space-y-2 pt-4 border-t border-white/10 text-xs font-mono">
                  <div className="flex justify-between text-white/70">
                    <span>{isEdwinScope ? 'Tarifa Base Edwin Agudelo' : 'Tarifa Base en Ficha del Proveedor'}</span>
                    <span>{formatEurFromCents(calculation.baseServiceCents)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>
                      Logística ({calculation.billableKm} km facturables × {(calculation.activeKmRateCents / 100).toFixed(2).replace('.', ',')} €/km)
                    </span>
                    <span>{formatEurFromCents(calculation.logisticsCents)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Suplemento Hotel / Nocturnidad</span>
                    <span>{formatEurFromCents(calculation.hotelCents)}</span>
                  </div>
                </div>

                {/* Split Soberano 80/10/10 */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs font-mono">
                  <div className="text-white/60 uppercase tracking-wider">Reparto Transparente 80 / 10 / 10</div>
                  <div className="flex justify-between text-white">
                    <span>80% Artista / Proveedor Ejecutor</span>
                    <span>{formatEurFromCents(calculation.artist80Cents)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>10% Infraestructura & Match EAR OS</span>
                    <span>{formatEurFromCents(calculation.earOs10Cents)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>10% Obra Social Neuroacústica VIMUME</span>
                    <span>{formatEurFromCents(calculation.vimume10Cents)}</span>
                  </div>
                </div>
              </div>

              {/* Doble Vía de Cierre */}
              <div className="space-y-3 pt-2">
                <Link
                  href={`/presupuesto?location=${encodeURIComponent(location)}&vertical=${selectedVertical.toLowerCase()}&totalCents=${calculation.totalCents}`}
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#ecb613] hover:bg-[#d9a40e] text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Bloquear Fecha con Depósito 100,00 € (Deducible)</span>
                  <ArrowRight size={15} strokeWidth={1.75} />
                </Link>

                <a
                  href={`${OFFICIAL_WHATSAPP}?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle size={15} strokeWidth={1.75} className="text-[#ecb613]" />
                  <span>Asesoría Rápida WhatsApp ({OFFICIAL_PHONE_DISPLAY})</span>
                </a>

                <Link
                  href={canonicalDestination.href}
                  className="w-full py-2.5 px-4 rounded-xl text-center block font-mono text-xs text-[#ecb613] hover:underline"
                >
                  {canonicalDestination.label} →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* PESTAÑA 2: CATÁLOGO DIRECTO */}
        {activeTab === 'catalog' && (
          <section className="p-6 sm:p-8 rounded-3xl bg-[#050507] border border-white/10 space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Acceso Directo a los Centros Gravitacionales en {location}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/artistas"
                className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-[#ecb613]/40 transition-colors space-y-2"
              >
                <Music size={20} strokeWidth={1.75} className="text-[#ecb613]" />
                <div className="font-bold text-white">Catálogo de Artistas</div>
                <p className="text-xs text-white/60">Solistas, mariachis, DJs y bandas con Panel 360 y condiciones propias.</p>
              </Link>

              <Link
                href="/fincas"
                className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-[#ecb613]/40 transition-colors space-y-2"
              >
                <Building2 size={20} strokeWidth={1.75} className="text-[#ecb613]" />
                <div className="font-bold text-white">Explorador de Fincas</div>
                <p className="text-xs text-white/60">Espacios homologados con simulador de menús 2026 desde su sede.</p>
              </Link>

              <Link
                href="/proveedores"
                className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-[#ecb613]/40 transition-colors space-y-2"
              >
                <Sliders size={20} strokeWidth={1.75} className="text-[#ecb613]" />
                <div className="font-bold text-white">Directorio Multiservicio</div>
                <p className="text-xs text-white/60">Sonido Bose F1, pantallas LED, catering, foto y transporte VIP.</p>
              </Link>

              <Link
                href="/b2g"
                className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-[#ecb613]/40 transition-colors space-y-2"
              >
                <ShieldCheck size={20} strokeWidth={1.75} className="text-[#ecb613]" />
                <div className="font-bold text-white">Ayuntamientos B2G & VIMUME</div>
                <p className="text-xs text-white/60">Contratos menores &lt;14.250 € (Art. 118 LCSP) y SROI 4.85x.</p>
              </Link>
            </div>
          </section>
        )}

        {/* PESTAÑA 3: GARANTÍA DE MATCH BILATERAL DE EXPECTATIVAS & ACÚSTICA */}
        {activeTab === 'acoustics' && (
          <section className="p-6 sm:p-8 rounded-3xl bg-[#050507] border border-white/10 space-y-6">
            <div className="p-5 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 space-y-2">
              <div className="flex items-center gap-2 text-[#ecb613] font-mono text-xs font-bold uppercase">
                <CheckCircle2 size={16} strokeWidth={1.75} />
                <span>Garantía de Match Bilateral de Expectativas</span>
              </div>
              <p className="text-sm text-white/90 leading-relaxed">
                En EAR OS protegemos a ambas partes con filtrado determinista: <strong>a un proveedor jamás le llegan solicitudes de clientes que no cumplen su presupuesto mínimo, radio logístico y condiciones</strong>, y <strong>a un cliente jamás se le muestran proveedores que no encajan exactamente con sus expectativas, aforo y requisitos técnicos</strong>.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Volume2 size={22} strokeWidth={1.75} className="text-[#ecb613]" />
              <h2 className="text-2xl font-bold text-white">Planificación Acústica Preventiva (Ley 37/2003 del Ruido)</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="text-[#ecb613] font-bold">CÓCTEL / GALA SOLISTA</div>
                <div className="text-2xl font-bold text-white">70 – 80 dBA</div>
                <p className="text-white/60 font-sans">Cobertura direccional cilíndrica Bose F1 calibrada para conversación cómoda de los invitados.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="text-[#ecb613] font-bold">BODAS & FINCAS</div>
                <div className="text-2xl font-bold text-white">80 – 90 dBA</div>
                <p className="text-white/60 font-sans">Dimensionamiento previo de 12 W/pax adaptado a las condiciones acústicas declaradas por cada espacio.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="text-[#ecb613] font-bold">RESIDENCIAS VIMUME 40 HZ</div>
                <div className="text-2xl font-bold text-white">65 – 75 dBA</div>
                <p className="text-white/60 font-sans">Protocolo neuroacústico no invasivo de salud pública (&lt;75 dB SPL).</p>
              </div>
            </div>
          </section>
        )}

        {/* PESTAÑA 4: MAPA DE LAS 12 SUPER-PANTALLAS */}
        {activeTab === 'hubs' && (
          <section className="p-6 sm:p-8 rounded-3xl bg-[#050507] border border-white/10 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Arquitectura Unificada de 12 Super-Pantallas (Single-Page Hubs)</h2>
              <p className="text-xs text-white/60 mt-1">
                Navegación directa sin fricción entre todos los departamentos de EAR OS.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TWELVE_CANONICAL_HUBS.map((hub) => (
                <Link
                  key={hub.id}
                  href={hub.route}
                  className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-[#ecb613]/40 transition-colors flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="font-mono text-xs text-[#ecb613] font-bold">{hub.title}</div>
                    <p className="text-xs text-white/70 leading-relaxed">{hub.summary}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-2 border-t border-white/5">
                    {hub.tabs.map((t) => (
                      <span
                        key={t.id}
                        className="px-2 py-0.5 rounded bg-white/[0.04] font-mono text-[10px] text-white/60"
                      >
                        {t.label}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
