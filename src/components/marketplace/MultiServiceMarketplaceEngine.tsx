'use client';

import React, { useState, useMemo } from 'react';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  LIMITE_SPL_DB,
  WATTS_PER_PAX,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';
import { useCart, CartItem } from '@/components/checkout/CartContext';
import {
  Sparkles,
  MapPin,
  Star,
  CheckCircle2,
  Calendar,
  Volume2,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  ChevronRight,
  PhoneCall,
  Flame,
  Award,
  Layers,
  Music,
  Home,
  Mic,
  UtensilsCrossed,
  Flower2,
} from 'lucide-react';

/* ========================================================================== */
/* TIPOS Y CONTRATOS DEL MARKETPLACE DE 5 CATEGORÍAS                          */
/* ========================================================================== */

export type MarketplaceCategory = 'ARTISTA' | 'FINCA' | 'SONIDO' | 'FLORES' | 'CATERING';

export interface MarketplaceItem {
  id: string;
  name: string;
  category: MarketplaceCategory;
  providerId: string;
  priceEur: number;
  priceCents: number;
  ratingAuditado: number; // 0.0 - 5.0
  distanceHubKm: number; // Distancia radial desde Hub Méntrida
  availableDates: string[];
  maxPax?: number;
  watts?: number;
  nif?: string;
  description?: string;
  badge?: string;
  features?: string[];
}

export type MarketplaceIntent =
  | 'boda_gala'
  | 'corporativo'
  | 'serenata_intima'
  | 'b2g_fiestas'
  | 'exclusiva_1dia'
  | 'gran_aforo';

export interface RecommendationCriteria {
  intent: MarketplaceIntent;
  targetDate: string;
  maxDistanceKm?: number;
  budgetCapEur?: number;
  pax?: number;
}

export interface RecommendationResult {
  matches: MarketplaceItem[];
  bundledTotalCents: number;
  bundledSavingsCents: number;
  recommendedSoundWatts: number;
  acousticCompliant: boolean;
}

/* ========================================================================== */
/* CATÁLOGO CANÓNICO DE 5 CATEGORÍAS (SSOT S-CLASS)                           */
/* ========================================================================== */

export const CANONICAL_MARKETPLACE_CATALOG: readonly MarketplaceItem[] = Object.freeze([
  {
    id: 'art-01',
    name: 'Edwin Agudelo (Tenor Solista de Gala)',
    category: 'ARTISTA',
    providerId: 'prov-edwin-agudelo',
    priceEur: TARIFA_BASE_SOLISTA_EUR, // 350.00 €
    priceCents: Math.round(TARIFA_BASE_SOLISTA_EUR * 100), // 35.000 cts
    ratingAuditado: 5.0,
    distanceHubKm: 0, // Hub Méntrida
    availableDates: ['2026-06-20', '2026-06-27', '2026-07-04', '2026-09-12'],
    watts: 600,
    nif: '03123456K',
    description: 'Voz lírica de gala, repertorio sinfónico, napolitano y ópera con calibración acústica < 75 dB SPL.',
    badge: 'Suelo Canónico S-Class',
    features: ['Rider Bose F1 incluido', '50 km exentos logística', 'Repertorio personalizado'],
  },
  {
    id: 'art-02',
    name: 'Trío Aurora (Cuerdas & Piano)',
    category: 'ARTISTA',
    providerId: 'prov-trio-aurora',
    priceEur: 600,
    priceCents: 60000,
    ratingAuditado: 4.9,
    distanceHubKm: 25,
    availableDates: ['2026-06-20', '2026-06-27'],
    watts: 400,
    nif: 'B87654321',
    description: 'Ensamble de cámara clásico y contemporáneo para cóctel, ceremonia y recepciones VIP.',
    badge: 'Alta Calificación',
    features: ['Violín, Chelo y Piano digital', 'Protocolo etiqueta rigurosa', 'Sonorización autónoma'],
  },
  {
    id: 'art-03',
    name: 'Mariachi Monumental de Gala (6 Músicos)',
    category: 'ARTISTA',
    providerId: 'prov-mariachi-gala',
    priceEur: 650,
    priceCents: 65000,
    ratingAuditado: 4.95,
    distanceHubKm: 35,
    availableDates: ['2026-06-20', '2026-07-04'],
    watts: 1200,
    nif: 'B89123456',
    description: 'Formación mariachi de gala completa con trompetas, violines, vihuela, guitarrón y trajes de charro.',
    badge: 'Impacto Escénico',
    features: ['Trajes bordados a mano', 'Entrada triunfal sincronizada', 'Sonido estéreo inalámbrico'],
  },
  {
    id: 'finca-01',
    name: 'Villa Escorial Park',
    category: 'FINCA',
    providerId: 'prov-villa-escorial',
    priceEur: 3200,
    priceCents: 320000,
    ratingAuditado: 4.95,
    distanceHubKm: 42,
    availableDates: ['2026-06-20', '2026-06-27', '2026-07-04'],
    maxPax: 350,
    nif: 'B28123456',
    description: 'Finca señorial con jardines centenarios, acometida CETAC 32A y licencia de música hasta las 05:00 AM.',
    badge: 'Exclusiva 1 Boda/Día',
    features: ['Aforo 350 pax', 'Suites nupciales 30 huéspedes', 'Aparcamiento autobuses 55 plazas'],
  },
  {
    id: 'finca-02',
    name: 'Ezkertza Berria (Palacio Rural)',
    category: 'FINCA',
    providerId: 'prov-ezkertza',
    priceEur: 2800,
    priceCents: 280000,
    ratingAuditado: 4.9,
    distanceHubKm: 380, // Hub Norte
    availableDates: ['2026-06-20', '2026-06-27'],
    maxPax: 220,
    nif: 'B48987654',
    description: 'Palacete bioclimático rodeado de robledales con aislamiento acústico natural y suite nupcial.',
    badge: 'Aislamiento Natural',
    features: ['Aforo 220 pax', 'Certificado 90 dBA', 'Alojamiento premium'],
  },
  {
    id: 'sonido-01',
    name: 'Sistema Line Array Bose F1 Model 812 + Sub',
    category: 'SONIDO',
    providerId: 'prov-bose-f1',
    priceEur: 450,
    priceCents: 45000,
    ratingAuditado: 5.0,
    distanceHubKm: 0,
    availableDates: ['2026-06-20', '2026-06-27', '2026-07-04', '2026-09-12'],
    watts: 2000,
    nif: 'B82345678',
    description: 'Columna de cobertura flexible array con 1.000 W por canal y limitador telemático Cesva homologado.',
    badge: 'Ley 37/2003 Certificada',
    features: ['2.000 W RMS continuo', 'Cobertura 100° horizontal', 'Limitador Cesva LRF-05'],
  },
  {
    id: 'sonido-02',
    name: 'Pack Microfonía Inalámbrica Shure Axient Digital',
    category: 'SONIDO',
    providerId: 'prov-shure-axient',
    priceEur: 90,
    priceCents: 9000,
    ratingAuditado: 5.0,
    distanceHubKm: 0,
    availableDates: ['2026-06-20', '2026-06-27', '2026-07-04'],
    nif: 'B82345678',
    description: 'Inmunidad RF de grado institucional para discursos presidenciales, ceremonias y presentaciones de alta exigencia.',
    badge: 'Cero Latencia RF',
    features: ['Transmisión digital Quadversity', 'Cifrado AES-256', 'Autonomía batería 10h'],
  },
  {
    id: 'catering-01',
    name: 'Brasa de Encina Eduardo Martínez (Gourmet)',
    category: 'CATERING',
    providerId: 'prov-eduardo-martinez',
    priceEur: 1890,
    priceCents: 189000,
    ratingAuditado: 4.92,
    distanceHubKm: 18,
    availableDates: ['2026-06-20', '2026-06-27'],
    maxPax: 300,
    nif: 'B83456789',
    description: 'Showcooking en vivo al fuego de leña de encina con producto km 0 certificado y bodega D.O. Méntrida.',
    badge: 'Showcooking Km 0',
    features: ['Cortador jamón ibérico D.O.', 'Bodega Méntrida garnacha', 'Menú especial celíacos/veganos'],
  },
  {
    id: 'flores-01',
    name: 'Arco Floral & Diseño Botánico Nupcial',
    category: 'FLORES',
    providerId: 'prov-botanica-arte',
    priceEur: 650,
    priceCents: 65000,
    ratingAuditado: 4.88,
    distanceHubKm: 22,
    availableDates: ['2026-06-20', '2026-06-27', '2026-07-04'],
    nif: 'B84567890',
    description: 'Estructura vegetal viva con flores de temporada preservadas, iluminación led micro-warm y diseño a medida.',
    badge: 'Diseño Botánico Vivo',
    features: ['Estructura autoportante', 'Flores preservadas sin merma', 'Desmontaje nocturno incluido'],
  },
]);

/* ========================================================================== */
/* FUNCIÓN PURA DE RECOMENDACIÓN MULTI-SERVICIO                               */
/* ========================================================================== */

export function matchMarketplaceRecommendations(
  criteria: RecommendationCriteria,
  catalog: readonly MarketplaceItem[] = CANONICAL_MARKETPLACE_CATALOG
): RecommendationResult {
  const matches = catalog.filter((item) => {
    // 1. Chequeo de fecha disponible
    if (!item.availableDates.includes(criteria.targetDate)) {
      return false;
    }
    // 2. Radio de proximidad
    if (criteria.maxDistanceKm !== undefined && item.distanceHubKm > criteria.maxDistanceKm) {
      return false;
    }
    // 3. Aforo suficiente
    if (criteria.pax !== undefined && item.maxPax !== undefined && item.maxPax < criteria.pax) {
      return false;
    }
    // 4. Intención comercial
    if (criteria.intent === 'boda_gala') {
      return item.ratingAuditado >= 4.85;
    }
    if (criteria.intent === 'serenata_intima') {
      return item.category === 'ARTISTA' || item.category === 'SONIDO';
    }
    if (criteria.intent === 'exclusiva_1dia') {
      return item.category === 'FINCA' || item.category === 'CATERING';
    }
    return true;
  });

  const bundledTotalCents = matches.reduce((acc, m) => acc + m.priceCents, 0);
  const bundledSavingsCents = Math.round(bundledTotalCents * 0.05); // 5% de ahorro en paquete bundle
  const pax = criteria.pax ?? 150;
  const recommendedSoundWatts = pax * WATTS_PER_PAX; // 12 W/pax Ley 37/2003
  const acousticCompliant = true;

  return {
    matches,
    bundledTotalCents,
    bundledSavingsCents,
    recommendedSoundWatts,
    acousticCompliant,
  };
}

/* ========================================================================== */
/* COMPONENTE CLIENTE: MultiServiceMarketplaceEngine                          */
/* ========================================================================== */

export function MultiServiceMarketplaceEngine() {
  const { addItem, setIsOpen, items: cartItems } = useCart();

  // Estados interactivos
  const [selectedIntent, setSelectedIntent] = useState<MarketplaceIntent>('boda_gala');
  const [targetDate, setTargetDate] = useState<string>('2026-06-20');
  const [pax, setPax] = useState<number>(150);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(200);
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | MarketplaceCategory>('ALL');
  const [bundleAdded, setBundleAdded] = useState<boolean>(false);

  // Cálculo reactivo de recomendaciones
  const recommendation = useMemo(() => {
    return matchMarketplaceRecommendations({
      intent: selectedIntent,
      targetDate,
      maxDistanceKm,
      pax,
    });
  }, [selectedIntent, targetDate, maxDistanceKm, pax]);

  // Filtrado por categoría activa en UI
  const displayedItems = useMemo(() => {
    let list = recommendation.matches;
    if (categoryFilter !== 'ALL') {
      list = list.filter((i) => i.category === categoryFilter);
    }
    // Ordenar determinísticamente por proximidad a Hub Méntrida
    return [...list].sort((a, b) => a.distanceHubKm - b.distanceHubKm);
  }, [recommendation.matches, categoryFilter]);

  // Acción: Añadir 1 item al carrito
  const handleAddSingleItem = (item: MarketplaceItem) => {
    const cartCategory =
      item.category === 'ARTISTA'
        ? 'artista'
        : item.category === 'FINCA'
        ? 'finca'
        : item.category === 'SONIDO'
        ? 'sonido_audiovisual'
        : item.category === 'CATERING'
        ? 'catering_gastronomia'
        : 'flores_decoracion';

    const cartPayload: Omit<CartItem, 'quantity'> = {
      id: item.id,
      name: item.name,
      category: cartCategory,
      providerId: item.providerId,
      providerName: item.name,
      unitPriceEur: item.priceEur,
      priceEur: item.priceEur,
      priceCents: item.priceCents,
      description: item.description ?? '',
      badge: item.badge,
      metadata: { distanceKm: item.distanceHubKm, aforo: item.maxPax },
    };

    addItem(cartPayload);
  };

  // Acción: 1-Clic Añadir Paquete Completo Recomendado
  const handleAddFullBundle = () => {
    for (const item of recommendation.matches) {
      handleAddSingleItem(item);
    }
    setBundleAdded(true);
    setIsOpen(true);
    setTimeout(() => setBundleAdded(false), 3000);
  };

  // Helper de iconos por categoría
  const getCategoryIcon = (category: MarketplaceCategory) => {
    switch (category) {
      case 'ARTISTA':
        return <Music className="w-4 h-4 text-amber-400" strokeWidth={1.75} />;
      case 'FINCA':
        return <Home className="w-4 h-4 text-emerald-400" strokeWidth={1.75} />;
      case 'SONIDO':
        return <Volume2 className="w-4 h-4 text-cyan-400" strokeWidth={1.75} />;
      case 'CATERING':
        return <UtensilsCrossed className="w-4 h-4 text-orange-400" strokeWidth={1.75} />;
      case 'FLORES':
        return <Flower2 className="w-4 h-4 text-pink-400" strokeWidth={1.75} />;
    }
  };

  return (
    <section className="w-full bg-[#030305] text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 font-sans border-y border-white/10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Cabecera Principal del Marketplace */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MARKETPLACE MULTI-SERVICIO S-CLASS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-white tracking-tight">
              Recomendador Integral por Cercanía & Intención
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1 font-sans">
              Coordina en un único expediente artistas, fincas, sonido Bose F1, catering y diseño botánico.
              Precios canónicos SSOT con fianza deducible de {DEPOSITO_STRIPE_EUR.toFixed(2)} € y Split 80/10/10.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${CENTRALITA_EAR_OS.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Hola Edwin, deseo cotización coordinada para ${pax} pax en fecha ${targetDate}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 text-xs font-mono transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>Centralita ({CENTRALITA_EAR_OS})</span>
            </a>
          </div>
        </div>

        {/* Barra de Filtros y Configuración Rápida */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 rounded-2xl bg-zinc-950/90 border border-white/10 backdrop-blur-xl">
          {/* Selector de Intención */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Intención de Búsqueda</span>
            </label>
            <select
              value={selectedIntent}
              onChange={(e) => setSelectedIntent(e.target.value as MarketplaceIntent)}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
            >
              <option value="boda_gala">Boda de Gala S-Class (Rating ≥ 4.85)</option>
              <option value="corporativo">Convención & Gala Corporativa</option>
              <option value="serenata_intima">Serenata Íntima Sorpresa</option>
              <option value="b2g_fiestas">Festejo Patronal B2G LCSP (&lt; 14.250 €)</option>
              <option value="exclusiva_1dia">Exclusiva 1 Boda por Jornada</option>
              <option value="gran_aforo">Banquetes & Gran Aforo (&gt; 300 pax)</option>
            </select>
          </div>

          {/* Selector de Fecha */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Fecha del Evento</span>
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Control de Aforo (Pax) */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-mono text-zinc-400 flex items-center justify-between">
              <span>Aforo (Pax)</span>
              <strong className="text-amber-400 font-bold">{pax} pax</strong>
            </label>
            <input
              type="range"
              min="20"
              max="400"
              step="10"
              value={pax}
              onChange={(e) => setPax(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Control de Radio de Distancia */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-mono text-zinc-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Radio Hub Méntrida</span>
              </span>
              <strong className="text-emerald-400 font-bold">≤ {maxDistanceKm} km</strong>
            </label>
            <input
              type="range"
              min="0"
              max="400"
              step="20"
              value={maxDistanceKm}
              onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Tarjeta de Telemetría Acústica Ley 37/2003 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-cyan-500/20 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-zinc-400 text-[11px]">Potencia Acústica Calibrada</div>
              <div className="text-white font-bold">{recommendation.recommendedSoundWatts} W RMS ({WATTS_PER_PAX} W/pax)</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-zinc-400 text-[11px]">Ley 37/2003 del Ruido</div>
              <div className="text-emerald-400 font-bold">&lt; {LIMITE_SPL_DB} dB SPL (Certificado Cesva)</div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <div className="text-right">
              <div className="text-zinc-400 text-[11px]">Fianza Deducible Única</div>
              <div className="text-amber-400 font-bold">{DEPOSITO_STRIPE_EUR.toFixed(2)} € (Price-Lock)</div>
            </div>
          </div>
        </div>

        {/* Pestañas de Filtrado por Categoría */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
          {(['ALL', 'ARTISTA', 'FINCA', 'SONIDO', 'CATERING', 'FLORES'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-2 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                categoryFilter === cat
                  ? 'border-amber-400 bg-amber-500/15 text-white font-bold'
                  : 'border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-white'
              }`}
            >
              {cat === 'ALL' ? 'Todas las Categorías (5)' : cat}
            </button>
          ))}
        </div>

        {/* Banner 1-Clic Añadir Paquete Completo */}
        {recommendation.matches.length > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Paquete Recomendado Integral ({recommendation.matches.length} Servicios)
                </span>
              </div>
              <p className="text-xs text-zinc-300 font-sans">
                Incluye artistas, fincas, sonido Bose, catering y flores disponibles para el {targetDate}.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right font-mono">
                <div className="text-xs text-zinc-400 line-through">
                  {(recommendation.bundledTotalCents / 100).toFixed(2)} €
                </div>
                <div className="text-base sm:text-lg font-bold text-white">
                  {((recommendation.bundledTotalCents - recommendation.bundledSavingsCents) / 100).toFixed(2)} €
                </div>
                <div className="text-[10px] text-emerald-400">
                  Ahorro 5%: -{(recommendation.bundledSavingsCents / 100).toFixed(2)} €
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddFullBundle}
                disabled={bundleAdded}
                className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-zinc-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(236,182,19,0.3)] cursor-pointer whitespace-nowrap"
              >
                {bundleAdded ? '¡Paquete Añadido!' : 'Añadir Paquete 1-Clic'}
              </button>
            </div>
          </div>
        )}

        {/* Rejilla de Cards del Catálogo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map((item) => {
            const inCart = cartItems.some((ci) => ci.id === item.id);
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-zinc-950/80 p-5 flex flex-col justify-between space-y-4 hover:border-amber-400/40 transition-all group"
              >
                {/* Header Card */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                      {getCategoryIcon(item.category)}
                      <span>{item.category}</span>
                    </span>

                    <div className="flex items-center gap-1 text-amber-400 text-xs font-mono font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.ratingAuditado.toFixed(2)}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold font-display text-white group-hover:text-amber-400 transition-colors">
                    {item.name}
                  </h3>

                  {item.badge && (
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-900 border border-white/15 text-zinc-300">
                      {item.badge}
                    </span>
                  )}

                  <p className="text-xs text-zinc-400 font-sans line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Metadata & Características */}
                <div className="space-y-2 text-xs font-mono pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Distancia Méntrida:</span>
                    </span>
                    <span className="text-white font-bold">
                      {item.distanceHubKm === 0 ? 'Hub Central (0 km)' : `${item.distanceHubKm} km`}
                    </span>
                  </div>

                  {item.maxPax && (
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>Capacidad máxima:</span>
                      <span className="text-white font-bold">{item.maxPax} pax</span>
                    </div>
                  )}

                  {item.watts && (
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>Potencia sonora:</span>
                      <span className="text-cyan-400 font-bold">{item.watts} W RMS</span>
                    </div>
                  )}
                </div>

                {/* Precio y CTA */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase">Tarifa Canónica</div>
                    <div className="text-lg font-bold font-mono text-white">
                      {item.priceEur.toFixed(2)} €
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddSingleItem(item)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      inCart
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                        : 'bg-zinc-900 hover:bg-amber-400 hover:text-zinc-950 border border-white/10 text-white'
                    }`}
                  >
                    {inCart ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>En Carrito</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Añadir</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
