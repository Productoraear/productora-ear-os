"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  AlertTriangle,
  Loader2,
  Inbox,
} from 'lucide-react';
import { ACG_ARTIST_OFFERS } from '@/lib/acg/acgDecisionEngine';
import { normalizeForUrl } from '@/lib/acg/acgSemanticGraph';

const PROVINCIAS = [
  'Madrid',
  'Barcelona',
  'Sevilla',
  'Valencia',
  'Zaragoza',
  'Málaga',
  'Alicante',
  'Murcia',
  'Cádiz',
  'Vizcaya',
  'Toledo',
  'Guadalajara',
  'Granada',
  'Córdoba',
  'Baleares',
  'Girona',
  'Tarragona',
  'Asturias',
  'Cantabria',
  'Valladolid',
  'Burgos',
  'Salamanca',
  'Ávila',
  'Segovia',
  'Soria',
  'León',
  'Palencia',
  'Zamora',
  'Cáceres',
  'Badajoz',
  'Ciudad Real',
  'Cuenca',
  'Albacete',
  'Almería',
  'Jaén',
  'Huelva',
  'La Rioja',
  'Navarra',
  'Huesca',
  'Teruel',
  'Castellón',
  'Lugo',
  'Ourense',
  'Pontevedra',
  'A Coruña',
  'Álava',
  'Gipuzkoa',
  'Las Palmas',
  'Santa Cruz de Tenerife',
  'Melilla',
  'Ceuta',
] as const;

type Provincia = (typeof PROVINCIAS)[number];

interface ArtistOffer {
  id: string;
  name: string;
  formatLabel: string;
  basePriceEur: number;
}

const ARTIST_OFFERS: readonly ArtistOffer[] = ACG_ARTIST_OFFERS as readonly ArtistOffer[];

const TOTAL_PROVINCIAS: number = PROVINCIAS.length;
const TOTAL_OFERTAS: number = ARTIST_OFFERS.length;

const PRECIO_MINIMO: number = ARTIST_OFFERS.reduce<number>(
  (min, o) => (o.basePriceEur < min ? o.basePriceEur : min),
  Number.POSITIVE_INFINITY
);

const PRECIO_MAXIMO: number = ARTIST_OFFERS.reduce<number>(
  (max, o) => (o.basePriceEur > max ? o.basePriceEur : max),
  Number.NEGATIVE_INFINITY
);

const BASE_FORMAT: ArtistOffer | undefined = ARTIST_OFFERS[0];

function capitalizeFirst(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

function EmptyState({ title, description, icon }: EmptyStateProps): React.JSX.Element {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-2xl border border-dashed border-white/10 bg-[#050507] p-10 flex flex-col items-center justify-center text-center gap-3"
    >
      <div className="text-[#ecb613]/70">
        {icon ?? <Inbox size={28} />}
      </div>
      <p className="font-syne text-lg font-black uppercase italic tracking-tight text-white">
        {title}
      </p>
      <p className="font-body text-sm text-white/40 max-w-md leading-relaxed">
        {description}
      </p>
    </div>
  );
}

interface ErrorStateProps {
  title: string;
  description: string;
  onRetry?: () => void;
}

function ErrorState({ title, description, onRetry }: ErrorStateProps): React.JSX.Element {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-2xl border border-red-500/30 bg-red-500/[0.04] p-8 flex flex-col items-center justify-center text-center gap-3"
    >
      <AlertTriangle size={26} className="text-red-400" />
      <p className="font-syne text-lg font-black uppercase italic tracking-tight text-white">
        {title}
      </p>
      <p className="font-body text-sm text-white/50 max-w-md leading-relaxed">
        {description}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 px-4 py-2 rounded-full border border-[#ecb613]/40 text-[#ecb613] font-mono text-[10px] uppercase tracking-widest hover:bg-[#ecb613]/10 transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}

function LoadingState(): React.JSX.Element {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="rounded-2xl border border-white/5 bg-[#050507] p-10 flex flex-col items-center justify-center gap-3"
    >
      <Loader2 size={26} className="text-[#ecb613] animate-spin" />
      <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
        Cargando nodo territorial…
      </p>
    </div>
  );
}

export default function ArtistasProvinciasClient(): React.JSX.Element {
  const searchParams = useSearchParams();
  const rawProvincia: string = searchParams.get('provincia') ?? '';
  const provinciaSlug: string = normalizeForUrl(rawProvincia);

  const activeProvincia: string | null = useMemo(() => {
    if (!provinciaSlug) return null;
    const match = PROVINCIAS.find(
      (p: Provincia) => normalizeForUrl(p) === provinciaSlug
    );
    if (match) return match;
    return rawProvincia ? capitalizeFirst(rawProvincia) : null;
  }, [provinciaSlug, rawProvincia]);

  const hasOffers: boolean = ARTIST_OFFERS.length > 0;
  const hasProvincias: boolean = PROVINCIAS.length > 0;
  const hasActiveOffers: boolean = hasOffers && activeProvincia !== null;

  return (
    <main className="min-h-screen bg-[#030305] text-white pt-28 pb-24 selection:bg-[#ecb613] selection:text-black">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="space-y-6 mb-14">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[9px] font-black uppercase tracking-[0.25em] font-mono">
              {TOTAL_PROVINCIAS} Provincias Autorizadas
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              National Coverage
            </span>
          </div>
          <h1 className="font-syne text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white leading-[0.95]">
            {activeProvincia ? (
              <>
                Artistas en{' '}
                <span className="text-[#ecb613]">{activeProvincia}</span>
              </>
            ) : (
              'Provincias Autorizadas'
            )}
          </h1>
          <p className="text-white/40 text-lg max-w-2xl italic font-body leading-relaxed">
            {TOTAL_PROVINCIAS} provincias operativas · {TOTAL_OFERTAS} formatos
            entre {PRECIO_MINIMO} € y {PRECIO_MAXIMO} € · logística desde Méntrida
            a 1,50 €/km (km 50 exento) · Split 80/10/10 · Price-Lock 100 € en
            Stripe.
          </p>
        </div>

        {/* Panel provincia activa */}
        {activeProvincia && (
          <section className="mb-12 rounded-2xl bg-[#050507] border border-[#ecb613]/30 p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#ecb613]">
              <MapPin size={14} /> Nodo territorial · {activeProvincia}
            </div>

            {hasActiveOffers ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ARTIST_OFFERS.map((offer: ArtistOffer) => (
                  <div
                    key={offer.id}
                    className="p-5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2"
                  >
                    <span className="block font-syne text-lg font-black text-white">
                      {offer.name}
                    </span>
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-white/40">
                      {offer.formatLabel}
                    </span>
                    <span className="block font-mono text-2xl text-[#ecb613] font-black">
                      {offer.basePriceEur} €
                    </span>
                    <Link
                      href={`/acg?step=match&artist=${offer.id}`}
                      className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-white hover:text-[#ecb613] transition-colors"
                    >
                      Reservar en 60s <ArrowRight size={13} />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Sin formatos disponibles"
                description={`No hay ofertas artísticas activas para ${activeProvincia}. Vuelve a intentarlo en unos minutos o explora otra provincia.`}
                icon={<Inbox size={28} />}
              />
            )}

            <div className="flex items-center gap-2 font-mono text-[10px] text-white/50">
              <ShieldCheck size={14} className="text-[#ecb613]" /> RC 300.000 € ·{' '}
              {BASE_FORMAT ? BASE_FORMAT.basePriceEur : 0} € base solista · SPL{' '}
              {'<'} 75 dB B2G
            </div>
          </section>
        )}

        {/* Swarm Grid */}
        {hasProvincias ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PROVINCIAS.map((prov: Provincia) => {
              const isActive: boolean = activeProvincia === prov;
              const slug: string = normalizeForUrl(prov);
              return (
                <Link
                  key={prov}
                  href={`/artistas/provincias?provincia=${slug}`}
                  className={`group rounded-2xl p-5 border flex items-center justify-between transition-colors ${
                    isActive
                      ? 'border-[#ecb613]/50 bg-[#ecb613]/10'
                      : 'border-white/5 bg-[#0b0b0b] hover:border-white/15'
                  }`}
                >
                  <span
                    className={`text-xs font-black uppercase font-mono tracking-wider ${
                      isActive ? 'text-[#ecb613]' : 'text-white'
                    }`}
                  >
                    {prov}
                  </span>
                  <MapPin
                    size={12}
                    className={
                      isActive
                        ? 'text-[#ecb613]'
                        : 'text-white/30 group-hover:text-[#ecb613]'
                    }
                  />
                </Link>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Cobertura no disponible"
            description="No hay provincias autorizadas cargadas en este momento. Contacta con soporte si el problema persiste."
            icon={<MapPin size={28} />}
          />
        )}

        {/* Garantías */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-[#050507] border border-white/10 p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#ecb613] flex items-center gap-1.5">
              <Zap size={12} /> Logística SSOT
            </p>
            <p className="font-body text-sm text-white/60 mt-2 leading-relaxed">
              1,50 €/km desde Méntrida a partir del km 50. Suplemento +120 € solo
              si fin {'>'} 03:00 AM o distancia {'>'} 200 km.
            </p>
          </div>
          <div className="rounded-2xl bg-[#050507] border border-white/10 p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#ecb613] flex items-center gap-1.5">
              <CheckCircle2 size={12} /> Split Soberano
            </p>
            <p className="font-body text-sm text-white/60 mt-2 leading-relaxed">
              80% Artista / 10% EAR OS / 10% VIMUME con retorno SROI 4.85× (Ley
              49/2002).
            </p>
          </div>
          <div className="rounded-2xl bg-[#050507] border border-white/10 p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#ecb613] flex items-center gap-1.5">
              <ShieldCheck size={12} /> Price-Lock 100 €
            </p>
            <p className="font-body text-sm text-white/60 mt-2 leading-relaxed">
              Firma SHA-256 emitida en servidor. Depósito reembolsable 24-72h en
              Stripe.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export { EmptyState, ErrorState, LoadingState };
export type { ArtistOffer, Provincia, EmptyStateProps, ErrorStateProps };