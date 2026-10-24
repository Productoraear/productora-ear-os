'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Sparkles,
  MapPin,
  ArrowRight,
  Star,
  X,
  RotateCcw,
} from 'lucide-react';
import { WeddingFacetedFilterBar } from './WeddingFacetedFilterBar';
import { filterWeddingProviders } from '@/features/wedding/lib/wedding-provider-facets';
import type { WeddingProviderCardData } from '@/features/wedding/lib/wedding-provider-facets';
import {
  getPriceTierById,
  getMomentById,
  RADIO_OPTIONS,
} from '@/lib/constants/wedding-taxonomy';
import type {
  WeddingFacetState,
  PriceTierId,
  WeddingMomentId,
} from '@/lib/constants/wedding-taxonomy';

interface WeddingProviderGridProps {
  cards: WeddingProviderCardData[];
  provinceName: string;
  provinceSlug: string;
  serviceTitle: string;
  basePrice: number;
}

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop';

const DEFAULT_RADIO_KM = 100;

const PRICE_TIER_IDS: ReadonlySet<string> = new Set(['economico', 'premium', 'lujo']);
const MOMENT_IDS: ReadonlySet<string> = new Set([
  'ceremonia-civil',
  'coctel',
  'banquete',
  'barra-libre',
]);

function readInitialFacet(searchParams: URLSearchParams, provinceSlug: string): WeddingFacetState {
  const precioRaw = searchParams.get('precio');
  const momentoRaw = searchParams.get('momento');
  const fechaRaw = searchParams.get('fecha');
  const radioRaw = Number(searchParams.get('radioKm'));

  return {
    gremio: 'musica',
    categoria: null,
    provincia: provinceSlug,
    precio: precioRaw && PRICE_TIER_IDS.has(precioRaw) ? (precioRaw as PriceTierId) : 'all',
    fecha: fechaRaw && !Number.isNaN(Date.parse(fechaRaw)) ? fechaRaw : null,
    radioKm: Number.isFinite(radioRaw) && RADIO_OPTIONS.includes(radioRaw) ? radioRaw : DEFAULT_RADIO_KM,
    momento: momentoRaw && MOMENT_IDS.has(momentoRaw) ? (momentoRaw as WeddingMomentId) : 'all',
  };
}

function buildFacetQuery(facet: WeddingFacetState): string {
  const params = new URLSearchParams();
  if (facet.precio !== 'all') params.set('precio', facet.precio);
  if (facet.momento !== 'all') params.set('momento', facet.momento);
  if (facet.fecha) params.set('fecha', facet.fecha);
  if (facet.radioKm !== DEFAULT_RADIO_KM) params.set('radioKm', String(facet.radioKm));
  return params.toString();
}

/**
 * 👥 ROSTER DE PROVEEDORES + FILTROS FACETADOS (reactivo vía URL Search Params).
 * El grid re-filtra por Precio y Momento (dato real del proveedor). Fecha y Radio
 * persisten en la URL y contextualizan el flujo sin simular calendarios ni GPS.
 */
export function WeddingProviderGrid({
  cards,
  provinceName,
  provinceSlug,
  serviceTitle,
  basePrice,
}: WeddingProviderGridProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [facet, setFacet] = useState<WeddingFacetState>(() =>
    readInitialFacet(searchParams, provinceSlug),
  );
  const mountedRef = useRef(false);

  const handleFacetChange = (patch: Partial<WeddingFacetState>) => {
    setFacet((prev) => ({ ...prev, ...patch }));
  };

  // Sincroniza el estado de facetas con la URL (deep-linkable y compartible).
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    const qs = buildFacetQuery(facet);
    router.replace(qs ? `?${qs}` : window.location.pathname, { scroll: false });
  }, [facet, router]);

  const filtered = useMemo(() => filterWeddingProviders(cards, facet), [cards, facet]);

  const hasActiveFacets =
    facet.precio !== 'all' ||
    facet.momento !== 'all' ||
    facet.fecha !== null ||
    facet.radioKm !== DEFAULT_RADIO_KM;

  const resetFacets = () => {
    setFacet((prev) => ({
      ...prev,
      precio: 'all',
      fecha: null,
      radioKm: DEFAULT_RADIO_KM,
      momento: 'all',
    }));
  };

  const clearOne = (key: 'precio' | 'fecha' | 'radioKm' | 'momento') => {
    setFacet((prev) => ({
      ...prev,
      [key]: key === 'radioKm' ? DEFAULT_RADIO_KM : key === 'fecha' ? null : 'all',
    }));
  };

  const cotizadorHref = `/cotizador?provincia=${encodeURIComponent(provinceName)}&ocasion=${encodeURIComponent(serviceTitle)}`;

  // Sin proveedores en absoluto → cobertura oficial (estado previo a los filtros).
  if (cards.length === 0) {
    return (
      <div className="p-12 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-4">
        <Sparkles size={32} className="mx-auto text-[#ecb613]" />
        <h3 className="text-lg font-bold font-syne uppercase">Cobertura Oficial Activa en {provinceName}</h3>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto">
          Despachamos unidades móviles y agrupaciones artísticas directas desde nuestro Hub Central con el SLA de 12 W/pax y Price-Lock 100€.
        </p>
        <Link
          href={cotizadorHref}
          className="inline-block px-6 py-3 bg-[#ecb613] text-black font-mono text-xs font-bold uppercase rounded-xl transition-all hover:scale-105"
        >
          Solicitar Reserva Directa
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WeddingFacetedFilterBar state={facet} onChange={handleFacetChange} totalResults={filtered.length} />

      {/* Barra de resultados + chips activos */}
      <div className="flex flex-col gap-3 rounded-2xl bg-white/[0.02] border border-white/10 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-mono text-zinc-400">
            <span className="text-[#ecb613] font-bold">{filtered.length}</span> de {cards.length} opciones
            {hasActiveFacets && ' · filtros activos'}
          </span>

          {hasActiveFacets && (
            <button
              type="button"
              onClick={resetFacets}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 hover:text-[#ecb613] transition-colors cursor-pointer"
            >
              <RotateCcw size={13} />
              Restablecer
            </button>
          )}
        </div>

        {hasActiveFacets && (
          <div className="flex flex-wrap items-center gap-2">
            {facet.precio !== 'all' && (
              <button
                type="button"
                onClick={() => clearOne('precio')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[11px] font-mono font-bold uppercase tracking-wide cursor-pointer hover:bg-[#ecb613]/20 transition-colors"
              >
                {getPriceTierById(facet.precio).glyph} {getPriceTierById(facet.precio).name}
                <X size={12} />
              </button>
            )}
            {facet.momento !== 'all' && (
              <button
                type="button"
                onClick={() => clearOne('momento')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[11px] font-mono font-bold uppercase tracking-wide cursor-pointer hover:bg-[#ecb613]/20 transition-colors"
              >
                {getMomentById(facet.momento as WeddingMomentId)?.name ?? facet.momento}
                <X size={12} />
              </button>
            )}
            {facet.fecha && (
              <button
                type="button"
                onClick={() => clearOne('fecha')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[11px] font-mono font-bold uppercase tracking-wide cursor-pointer hover:bg-[#ecb613]/20 transition-colors"
              >
                {new Date(facet.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                <X size={12} />
              </button>
            )}
            {facet.radioKm !== DEFAULT_RADIO_KM && (
              <button
                type="button"
                onClick={() => clearOne('radioKm')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[11px] font-mono font-bold uppercase tracking-wide cursor-pointer hover:bg-[#ecb613]/20 transition-colors"
              >
                {facet.radioKm} km
                <X size={12} />
              </button>
            )}
          </div>
        )}

        {/* Contexto honesto de conversión (sin simular calendarios ni GPS) */}
        {facet.fecha && (
          <p className="text-[11px] font-mono text-white/40 leading-relaxed">
            📅 Fecha objetivo registrada. La disponibilidad real se verifica bajo demanda con
            bloqueo atómico Price-Lock 100 € — no simulamos calendarios de proveedores.
          </p>
        )}
        {facet.radioKm !== DEFAULT_RADIO_KM && (
          <p className="text-[11px] font-mono text-white/40 leading-relaxed">
            📍 Radio de cobertura declarado: {facet.radioKm} km. La logística exacta se calcula
            en el cotizador (1,50 €/km a partir del km 50 para desplazamientos desde el Hub).
          </p>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((card) => {
            const catLabel = (card.category || 'Servicio Homologado').toUpperCase();
            const tier = card.priceTier ? getPriceTierById(card.priceTier) : null;

            return (
              <div
                key={card.id}
                className="rounded-3xl bg-[#09090d] border border-white/10 hover:border-[#ecb613]/50 transition-all flex flex-col justify-between group overflow-hidden shadow-lg shadow-black/40 hover:-translate-y-1 duration-300"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#050505]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.imageUrl || FALLBACK_IMG}
                    alt={card.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090d] via-transparent to-black/40 pointer-events-none" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md border border-[#ecb613]/40 text-[#ecb613] rounded-full text-[10px] font-mono uppercase font-bold tracking-wider">
                      {catLabel}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/80 backdrop-blur-md rounded-full text-white text-[10px] font-mono font-bold">
                    <Star size={10} className="fill-[#ecb613] text-[#ecb613]" />
                    <span>{card.rating || 4.9}</span>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold font-syne text-white group-hover:text-[#ecb613] transition-colors">
                      {card.name}
                    </h3>
                    <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed font-light">
                      {card.description || `Servicio profesional homologado en la provincia de ${provinceName} con calibración acústica S-Class.`}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="flex items-center gap-1 text-xs font-mono text-zinc-400">
                        <MapPin size={12} className="text-[#ecb613] shrink-0" />
                        <span className="truncate">{card.province || provinceName}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-white/50">
                        {tier ? `${tier.glyph} ${tier.name}` : 'Precio bajo demanda'}
                        {card.priceEur !== null && (
                          <span className="text-[#ecb613]"> · Desde {card.priceEur.toLocaleString('es-ES')} €</span>
                        )}
                      </span>
                    </div>
                    <Link
                      href={`/proveedores/${card.slug}`}
                      className="px-3 py-1.5 bg-white/5 hover:bg-[#ecb613] text-white hover:text-black font-mono text-[11px] font-bold uppercase rounded-lg transition-all flex items-center gap-1 shrink-0"
                    >
                      <span>Ver Ficha</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-10 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-4">
          <Sparkles size={28} className="mx-auto text-[#ecb613]" />
          <h3 className="text-lg font-bold font-syne uppercase">Sin resultados con estos filtros</h3>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto">
            Ajusta el rango de precio o el momento del evento, o restablece los filtros para ver
            el roster completo en {provinceName}.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={resetFacets}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all cursor-pointer"
            >
              Restablecer filtros
            </button>
            <Link
              href={cotizadorHref}
              className="px-6 py-3 bg-[#ecb613] hover:bg-[#ecb613]/90 text-black font-mono text-xs font-black uppercase tracking-wider rounded-xl transition-all"
            >
              Desde {basePrice} € · Solicitar Presupuesto
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}



