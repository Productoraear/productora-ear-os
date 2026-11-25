"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Cpu,
  Layers,
  Music,
  Building2,
  HeartPulse,
  Landmark,
  CreditCard,
  MessageCircle,
  PhoneIncoming,
  Share2,
  CheckCircle2,
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Truck,
  DollarSign,
  Lock,
  RefreshCcw,
  Users,
  Download,
  X,
  FileCheck,
} from 'lucide-react';
import { z } from 'zod';
import {
  TARIFA_BASE_SOLISTA_EUR,
  TARIFA_ESTANDAR_SOLISTA_EUR,
  SOLISTA_KM_INCLUIDOS,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  LOGISTICA_KM_HOTEL,
  SUPLEMENTO_HOTEL_EUR,
  HORA_FIN_HOTEL,
  DEPOSITO_STRIPE_EUR,
  SPLIT_SOBERANO,
  SAFE_LCSP_CEILING_EUR,
  LIMITE_SPL_DB,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';
import {
  GLOBAL_SYSTEM_INVARIANTS,
  resolveEntityContext,
} from '@/lib/oraculo/entity-resolver';
import {
  executeStripeCheckout,
  executeEidasContract,
  type MultiRailExecutionResult,
} from '@/lib/compiler/multi-rail-execution';

/* ========================================================================== */
/* CONTRATO DE DATOS ZOD ESTRICTO (NIVEL 5)                                   */
/* ========================================================================== */

export const SimulatorQuoteSchema = z
  .object({
    packId: z.string(),
    packName: z.string(),
    baseRateEur: z.number().min(TARIFA_BASE_SOLISTA_EUR),
    distanceKm: z.number(),
    billableKm: z.number(),
    kmCostEur: z.number(),
    needsHotel: z.boolean(),
    hotelCostEur: z.number(),
    vimumeAddonEur: z.number(),
    totalEventCostEur: z.number(),
    depositStripeEur: z.number(),
    artistSplitEur: z.number(),
    earOsSplitEur: z.number(),
    vimumeSplitEur: z.number(),
  })
  .strict();

export type SimulatorQuote = z.infer<typeof SimulatorQuoteSchema>;

interface PackOption {
  id: string;
  name: string;
  base: number;
  desc: string;
}

const PACKS: readonly PackOption[] = [
  {
    id: 'solista',
    name: 'Edwin Agudelo (Tenor Insignia)',
    base: TARIFA_BASE_SOLISTA_EUR,
    desc: `Suelo canónico inviolable · Voz lírica, Bose F1 812 < ${LIMITE_SPL_DB} dB`,
  },
  {
    id: 'solista-estandar',
    name: 'Edwin Agudelo (Gala Estándar 100 km)',
    base: TARIFA_ESTANDAR_SOLISTA_EUR,
    desc: `Tarifa oficial con ${SOLISTA_KM_INCLUIDOS} km incluidos desde Méntrida`,
  },
  {
    id: 'trio',
    name: 'Mariachi Trío Tradición',
    base: 650,
    desc: 'Guitarra, vihuela y trompeta de gala',
  },
  {
    id: 'imperial',
    name: 'Mariachi Imperial (6 músicos)',
    base: 950,
    desc: 'Show de gala completo para bodas y recepciones',
  },
  {
    id: 'cuarteto',
    name: 'Cuarteto de Cuerdas Sinfonía',
    base: 750,
    desc: '2 violines, viola y chelo clásico',
  },
  {
    id: 'djsax',
    name: 'DJ Profesional + Saxo Directo',
    base: 850,
    desc: 'Sonido e iluminación LED de alta gama',
  },
];

export default function AdminSimulatorCatminPage() {
  const [selectedPack, setSelectedPack] = useState<PackOption>(PACKS[0]);
  const [distanceKm, setDistanceKm] = useState<number>(35);
  const [isLateNight, setIsLateNight] = useState<boolean>(false);
  const [extraVimume, setExtraVimume] = useState<boolean>(false);
  const [activeResult, setActiveResult] = useState<MultiRailExecutionResult | null>(null);

  // Cálculos Logística S-Class (Méntrida Km 0) anclados a SSOT
  const baseKmFree = selectedPack.id === 'solista-estandar' ? SOLISTA_KM_INCLUIDOS : LOGISTICA_KM_EXENTOS;
  const billableKm = Math.max(0, distanceKm - baseKmFree);
  const kmCost = billableKm * LOGISTICA_EUR_PER_KM;
  const needsHotel = distanceKm > LOGISTICA_KM_HOTEL || isLateNight;
  const hotelCost = needsHotel ? SUPLEMENTO_HOTEL_EUR : 0;
  const vimumeAddon = extraVimume ? 150 : 0;

  const totalEventCost = selectedPack.base + kmCost + hotelCost + vimumeAddon;

  // Split Soberano 80/10/10
  const artistFee = selectedPack.base * SPLIT_SOBERANO.artista;
  const earFee = selectedPack.base * SPLIT_SOBERANO.earOs;
  const vimumeFee = (selectedPack.base * SPLIT_SOBERANO.vimume) + vimumeAddon;
  const vimumeTaxBenefit = vimumeFee * 0.80; // 80% desgravación IRPF Ley 49/2002

  // Validación estricta por Zod
  const validatedQuote = SimulatorQuoteSchema.parse({
    packId: selectedPack.id,
    packName: selectedPack.name,
    baseRateEur: selectedPack.base,
    distanceKm,
    billableKm,
    kmCostEur: kmCost,
    needsHotel,
    hotelCostEur: hotelCost,
    vimumeAddonEur: vimumeAddon,
    totalEventCostEur: totalEventCost,
    depositStripeEur: DEPOSITO_STRIPE_EUR,
    artistSplitEur: artistFee,
    earOsSplitEur: earFee,
    vimumeSplitEur: vimumeFee,
  });

  const artistPct = Math.round(SPLIT_SOBERANO.artista * 100);
  const earOsPct = Math.round(SPLIT_SOBERANO.earOs * 100);
  const vimumePct = Math.round(SPLIT_SOBERANO.vimume * 100);

  const handleTriggerStripe = () => {
    const res = executeStripeCheckout({
      eventId: `SIM-${selectedPack.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
      clientName: 'Cliente Particular / Cotización Simulador',
      venue: `Evento a ${distanceKm} km de Méntrida`,
      eventDate: new Date().toISOString().slice(0, 10),
      grossEur: DEPOSITO_STRIPE_EUR,
      dimensionId: 'ARTISTAS_ESCENARIO',
      entityContext: resolveEntityContext('e78903', 'ARTISTAS_ESCENARIO'),
      pepitaDeOro: `Fianza deducible Price-Lock de ${DEPOSITO_STRIPE_EUR} € para ${selectedPack.name}`,
      rawVision: `Reserva garantizada con suelo canónico ${TARIFA_BASE_SOLISTA_EUR} € y split ${artistPct}/${earOsPct}/${vimumePct}`,
    });
    setActiveResult(res);
  };

  const handleTriggerEidas = () => {
    const res = executeEidasContract({
      eventId: `CONTRATO-${selectedPack.id.toUpperCase()}`,
      clientName: 'Cliente Contratante',
      venue: `Evento a ${distanceKm} km de Méntrida`,
      eventDate: new Date().toISOString().slice(0, 10),
      grossEur: totalEventCost,
      dimensionId: 'ARTISTAS_ESCENARIO',
      entityContext: resolveEntityContext('e78903', 'ARTISTAS_ESCENARIO'),
      pepitaDeOro: `Contrato Oficial de Actuación Artística con Edwin Agudelo`,
      rawVision: `Acuerdo con rider acústico < ${LIMITE_SPL_DB} dB SPL y formalización eIDAS`,
    });
    setActiveResult(res);
  };

  const whatsappMessage = encodeURIComponent(
    `¡Hola Productora EAR! Solicito presupuesto oficial para ${selectedPack.name} a ${distanceKm} km de Méntrida. Total estimado: ${totalEventCost.toFixed(2)} € (incluye depósito de ${DEPOSITO_STRIPE_EUR.toFixed(0)} € y Split ${artistPct}/${earOsPct}/${vimumePct}).`
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      
      {/* ===================================================================== */}
      {/* 1. HEADER DE PÁGINA CATMÍN                                            */}
      {/* ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a1a24] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>Admin</span>
            <span>/</span>
            <span>Núcleo</span>
            <span>/</span>
            <span className="text-[#ecb613] font-bold">Mapa &amp; Simulador S-Class</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-syne uppercase mt-1">
            Academia &amp; Simulador de Ventas
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleTriggerStripe}
            className="px-4 py-2 rounded-xl bg-[#ecb613] hover:bg-[#d8a40f] text-black font-extrabold text-xs font-mono flex items-center gap-2 shadow-md shadow-[#ecb613]/20 transition-all"
          >
            <CreditCard className="w-4 h-4" />
            <span>Stripe Price-Lock ({DEPOSITO_STRIPE_EUR.toFixed(0)} €)</span>
          </button>

          <button
            type="button"
            onClick={handleTriggerEidas}
            className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-mono font-bold flex items-center gap-2 transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Contrato eIDAS</span>
          </button>

          <a
            href="/simulador-ear-os.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-mono text-zinc-200 flex items-center gap-2 transition-all"
          >
            <span>Modo Standalone 21st</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#ecb613]" />
          </a>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. CATMÍN ROW 1: 4 MÉTRICAS CLAVE DEL NEGOCIO                         */}
      {/* ===================================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 font-mono">
        
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 shadow-sm hover:border-[#ecb613]/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Tarifa Base Solista</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {TARIFA_BASE_SOLISTA_EUR.toFixed(2).replace('.', ',')} €
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Edwin Agudelo (Suelo Inviolable)</p>
          <div className="mt-2 flex items-center text-xs font-mono text-emerald-400 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Bose F1 812 · &lt; {LIMITE_SPL_DB} dB
          </div>
        </div>

        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 shadow-sm hover:border-[#ecb613]/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Logística Méntrida Km 0</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Truck className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {LOGISTICA_EUR_PER_KM.toFixed(2).replace('.', ',')} €/km
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            A partir del km {LOGISTICA_KM_EXENTOS} (+{SUPLEMENTO_HOTEL_EUR.toFixed(0)}€ hotel)
          </p>
          <div className="mt-2 flex items-center text-xs font-mono text-cyan-400 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Calculador Activo
          </div>
        </div>

        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 shadow-sm hover:border-[#ecb613]/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Price-Lock Inmutable</span>
            <div className="w-8 h-8 rounded-lg bg-[#ecb613]/10 flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#ecb613]" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {DEPOSITO_STRIPE_EUR.toFixed(2).replace('.', ',')} €
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Stripe con hash SHA-256</p>
          <div className="mt-2 flex items-center text-xs font-mono text-[#ecb613] font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Cierre en 48 Horas
          </div>
        </div>

        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 shadow-sm hover:border-[#ecb613]/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Tope Licitación Menor</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Landmark className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            &lt; {SAFE_LCSP_CEILING_EUR.toLocaleString('es-ES')} €
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Art. 118 LCSP (&lt;{LIMITE_SPL_DB} dB SPL)</p>
          <div className="mt-2 flex items-center text-xs font-mono text-purple-400 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            SROI 4.85x VIMUME
          </div>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* 3. SIMULADOR INTERACTIVO DE COTIZACIÓN EN VIVO                        */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono">
        
        {/* Controles del Simulador (Span 7) */}
        <div className="lg:col-span-7 rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 space-y-6 shadow-sm">
          <div>
            <span className="text-xs uppercase font-bold text-[#ecb613] tracking-wider">
              PASO 1
            </span>
            <h3 className="text-lg font-bold font-syne text-white uppercase mt-0.5">
              Selecciona Artista o Formación Musical
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PACKS.map(pack => (
              <button
                key={pack.id}
                onClick={() => setSelectedPack(pack)}
                className={`p-3.5 rounded-xl text-left font-mono transition-all border ${
                  selectedPack.id === pack.id
                    ? 'bg-[#ecb613] text-black border-[#ecb613] font-bold shadow-md shadow-[#ecb613]/20'
                    : 'bg-zinc-950 text-white border-zinc-900 hover:border-zinc-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs truncate">{pack.name}</span>
                  <span className="text-xs font-black shrink-0 ml-1">{pack.base} €</span>
                </div>
                <div className={`text-[10px] mt-1 line-clamp-1 ${selectedPack.id === pack.id ? 'text-black/80' : 'text-zinc-400'}`}>
                  {pack.desc}
                </div>
              </button>
            ))}
          </div>

          {/* Slider de Kilómetros desde Méntrida */}
          <div className="space-y-2 pt-4 border-t border-zinc-900">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-300 font-bold">Distancia desde Méntrida Km 0:</span>
              <span className="text-xl font-black text-[#ecb613]">{distanceKm} km</span>
            </div>
            <input
              type="range"
              min="0"
              max="400"
              step="5"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseInt(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#ecb613]"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>0-{baseKmFree} km: 0 € (Exento)</span>
              <span>&gt; {baseKmFree} km: {LOGISTICA_EUR_PER_KM.toFixed(2).replace('.', ',')} €/km</span>
              <span>&gt; {LOGISTICA_KM_HOTEL} km: +{SUPLEMENTO_HOTEL_EUR.toFixed(0)} € Hotel</span>
            </div>
          </div>

          {/* Switches Opcionales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-zinc-900">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-900 cursor-pointer hover:border-zinc-800">
              <input
                type="checkbox"
                checked={isLateNight}
                onChange={(e) => setIsLateNight(e.target.checked)}
                className="w-4 h-4 rounded text-[#ecb613] accent-[#ecb613]"
              />
              <div>
                <div className="text-xs font-bold text-white">Fin después de las 0{HORA_FIN_HOTEL}:00 AM</div>
                <div className="text-[10px] text-zinc-500">+{SUPLEMENTO_HOTEL_EUR.toFixed(0)} € dieta/hotel</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-900 cursor-pointer hover:border-zinc-800">
              <input
                type="checkbox"
                checked={extraVimume}
                onChange={(e) => setExtraVimume(e.target.checked)}
                className="w-4 h-4 rounded text-[#ecb613] accent-[#ecb613]"
              />
              <div>
                <div className="text-xs font-bold text-white">Addon VIMUME Solidario</div>
                <div className="text-[10px] text-cyan-400">+150 € (80% deducible IRPF)</div>
              </div>
            </label>
          </div>
        </div>

        {/* Desglose de Liquidación S-Class (Span 5) */}
        <div className="lg:col-span-5 rounded-2xl border border-[#ecb613]/40 bg-[#080811] p-6 space-y-5 shadow-xl">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] uppercase text-[#ecb613] font-bold tracking-wider">
                LIQUIDACIÓN OFICIAL
              </span>
              <h3 className="text-xl font-bold font-syne text-white uppercase">
                Presupuesto S-Class
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-400 block">TOTAL ESTIMADO</span>
              <span className="text-3xl font-black text-[#ecb613]">
                {totalEventCost.toFixed(2)} €
              </span>
            </div>
          </div>

          {/* Desglose de Gastos */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-zinc-300">
              <span>Caché Base {selectedPack.name.split(' ')[0]}:</span>
              <span>{selectedPack.base.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Portes Logística ({billableKm} km x {LOGISTICA_EUR_PER_KM.toFixed(2)} €):</span>
              <span>{kmCost.toFixed(2)} €</span>
            </div>
            {needsHotel && (
              <div className="flex justify-between text-amber-300">
                <span>Hotel y Dietas S-Class:</span>
                <span>{hotelCost.toFixed(2)} €</span>
              </div>
            )}
            {extraVimume && (
              <div className="flex justify-between text-cyan-400">
                <span>Aportación Extra VIMUME:</span>
                <span>{vimumeAddon.toFixed(2)} €</span>
              </div>
            )}
            <div className="flex justify-between text-[#ecb613] pt-2 border-t border-white/10 font-bold">
              <span>Señal Stripe Price-Lock (SHA-256):</span>
              <span>{DEPOSITO_STRIPE_EUR.toFixed(2).replace('.', ',')} €</span>
            </div>
          </div>

          {/* Desglose Split 80/10/10 */}
          <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-2">
            <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              DESGLOSE SPLIT SOBERANO {artistPct} / {earOsPct} / {vimumePct}
            </div>
            <div className="flex justify-between text-xs text-emerald-400">
              <span>{artistPct}% Artista Ejecutor (Edwin Agudelo):</span>
              <span className="font-bold">{artistFee.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-xs text-[#ecb613]">
              <span>{earOsPct}% Plataforma EAR OS:</span>
              <span className="font-bold">{earFee.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-xs text-cyan-400">
              <span>{vimumePct}% Impacto Social VIMUME:</span>
              <span className="font-bold">{vimumeFee.toFixed(2)} €</span>
            </div>
            <div className="text-[10px] text-zinc-500 pt-1 border-t border-white/5">
              ✓ Desgravación fiscal IRPF: -{vimumeTaxBenefit.toFixed(2)} €
            </div>
          </div>

          {/* Botones de Acción Multi-Rail */}
          <div className="space-y-2 pt-2">
            <a
              href={`https://wa.me/34693693048?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Despachar por WhatsApp ({CENTRALITA_EAR_OS})</span>
            </a>

            <button
              type="button"
              onClick={handleTriggerStripe}
              className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <CreditCard className="w-4 h-4 text-[#ecb613]" />
              <span>Generar Checkout Stripe {DEPOSITO_STRIPE_EUR.toFixed(0)}€</span>
            </button>
          </div>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* 4. MODAL MULTI-RAIL ARTIFACT (STRIPE / CONTRATO EIDAS)                */}
      {/* ===================================================================== */}
      {activeResult && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
          <div className="w-full max-w-2xl bg-[#09090d] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold font-syne text-white uppercase tracking-wider">
                  {activeResult.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveResult(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-900">
                <span className="text-zinc-400">Documento / Sesión:</span>
                <span className="text-white font-bold">{activeResult.filename}</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <span className="text-zinc-500 text-[10px] block">SELLO SHA-256</span>
                <span className="text-[#ecb613] text-[11px] break-all">{activeResult.sha256}</span>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-400 text-[11px]">Detalle de Riel:</span>
                <pre className="p-3 rounded-xl bg-black border border-zinc-900 text-[11px] text-zinc-300 overflow-x-auto max-h-48 font-mono">
                  {activeResult.previewContent}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveResult(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs transition-colors"
              >
                Cerrar
              </button>
              {activeResult.downloadUrl && (
                <a
                  href={activeResult.downloadUrl}
                  target={activeResult.artifactKind !== 'pdf' ? '_blank' : undefined}
                  download={activeResult.artifactKind === 'pdf' ? activeResult.filename : undefined}
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#ecb613] hover:bg-[#d8a40f] text-black font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  {activeResult.artifactKind === 'pdf' ? <Download className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                  <span>Abrir / Descargar</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. LOS 5 DOMINIOS SOBERANOS                                           */}
      {/* ===================================================================== */}
      <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 space-y-4 shadow-sm font-mono">
        <div>
          <span className="text-xs text-[#ecb613] uppercase tracking-widest">
            ARQUITECTURA DE MARCA
          </span>
          <h2 className="text-xl font-bold font-syne text-white uppercase mt-1">
            Los 5 Dominios Soberanos de EAR OS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-[#ecb613]/50 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-[#ecb613]">CORE HUB</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <h3 className="text-sm font-bold text-white">productoraear.com</h3>
            <p className="text-[11px] text-zinc-400 mt-1 font-light">
              Sonido e iluminación, pantallas LED exterior, rider 12 W/pax y centralita oficial.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-emerald-500/50 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-emerald-400">ROSTER ARTISTAS</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <h3 className="text-sm font-bold text-white">artistaseuropa.com</h3>
            <p className="text-[11px] text-zinc-400 mt-1 font-light">
              Edwin Agudelo (Tenor {TARIFA_BASE_SOLISTA_EUR.toFixed(0)} €), Mariachis y Cuartetos. Bloqueo {DEPOSITO_STRIPE_EUR.toFixed(0)} € en Stripe.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-cyan-500/50 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-cyan-400">FINCAS B2B</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <h3 className="text-sm font-bold text-white">fincasparaboda.com</h3>
            <p className="text-[11px] text-zinc-400 mt-1 font-light">
              Alianzas nupciales, cero cuota fija y liquidación automática de comisión del 10%.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-purple-500/50 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-purple-400">IMPACTO VIMUME</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <h3 className="text-sm font-bold text-white">viajemusicalporlamemoria.com</h3>
            <p className="text-[11px] text-zinc-400 mt-1 font-light">
              Neuro-musicoterapia (40 Hz Gamma) para Alzheimer. Deducción fiscal 80% IRPF.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 md:col-span-2 hover:border-blue-500/50 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-blue-400">LICITACIONES B2G</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <h3 className="text-sm font-bold text-white">productoraear.com/ayuntamientos</h3>
            <p className="text-[11px] text-zinc-400 mt-1 font-light">
              Contratos menores Art. 118 LCSP (&lt; {SAFE_LCSP_CEILING_EUR.toLocaleString('es-ES')} €), acústica &lt;{LIMITE_SPL_DB} dB SPL y código DIR3 FacturaE.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
