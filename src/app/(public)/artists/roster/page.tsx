import React from 'react';
import Link from 'next/link';
import { SEED_ARTISTS } from '@/lib/artists/schema';
import { MapPin, ArrowRight, Users, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

interface ArtistRecord {
  id: string;
  slug: string;
  displayName: string;
  role: string;
  homeBase: string;
  bioShort: string;
}

interface RosterStats {
  totalArtists: number;
  totalRoles: number;
  totalCities: number;
  topRoles: Array<[string, number]>;
  topCities: Array<[string, number]>;
}

function computeRosterStats(artists: readonly ArtistRecord[]): RosterStats {
  const totalArtists = artists.length;
  const totalRoles = new Set(artists.map((artist) => artist.role)).size;
  const totalCities = new Set(artists.map((artist) => artist.homeBase)).size;

  const roleBreakdown = artists.reduce<Record<string, number>>((acc, artist) => {
    acc[artist.role] = (acc[artist.role] ?? 0) + 1;
    return acc;
  }, {});

  const cityBreakdown = artists.reduce<Record<string, number>>((acc, artist) => {
    acc[artist.homeBase] = (acc[artist.homeBase] ?? 0) + 1;
    return acc;
  }, {});

  const topRoles = Object.entries(roleBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const topCities = Object.entries(cityBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return { totalArtists, totalRoles, totalCities, topRoles, topCities };
}

function LoadingState(): React.ReactElement {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="bg-[#0b0b0b] border border-white/5 rounded-[3rem] p-16 flex flex-col items-center justify-center text-center space-y-6"
    >
      <div className="w-16 h-16 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/20 flex items-center justify-center">
        <Loader2 size={24} className="text-[#ecb613] animate-spin" aria-hidden="true" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white font-syne">
          Cargando roster
        </h2>
        <p className="text-white/40 text-sm max-w-md italic">
          Recuperando el catálogo de artistas firmados del sello Productora EAR.
        </p>
      </div>
      <div className="w-full max-w-md space-y-3" aria-hidden="true">
        <div className="h-3 rounded-full bg-white/5 animate-pulse" />
        <div className="h-3 rounded-full bg-white/5 animate-pulse w-4/5 mx-auto" />
        <div className="h-3 rounded-full bg-white/5 animate-pulse w-3/5 mx-auto" />
      </div>
    </div>
  );
}

function EmptyState(): React.ReactElement {
  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-[#0b0b0b] border border-white/5 rounded-[3rem] p-16 flex flex-col items-center justify-center text-center space-y-6"
    >
      <div className="w-16 h-16 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/20 flex items-center justify-center">
        <Users size={24} className="text-[#ecb613]" aria-hidden="true" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white font-syne">
          Roster en preparación
        </h2>
        <p className="text-white/40 text-sm max-w-md italic">
          Aún no hay artistas firmados publicados. Vuelve pronto para descubrir el talento del sello Productora EAR.
        </p>
      </div>
      <Link
        href="/"
        className="bg-white/5 hover:bg-white text-white hover:text-black px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/60"
      >
        Volver al inicio <ArrowRight size={12} aria-hidden="true" />
      </Link>
    </div>
  );
}

function ErrorState({ message }: { message: string }): React.ReactElement {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="bg-[#0b0b0b] border border-red-500/20 rounded-[3rem] p-16 flex flex-col items-center justify-center text-center space-y-6"
    >
      <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <AlertCircle size={24} className="text-red-400" aria-hidden="true" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white font-syne">
          No se pudo cargar el roster
        </h2>
        <p className="text-white/40 text-sm max-w-md italic">{message}</p>
      </div>
      <Link
        href="/artists/roster"
        className="bg-white/5 hover:bg-white text-white hover:text-black px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
      >
        <RefreshCw size={12} aria-hidden="true" /> Reintentar
      </Link>
    </div>
  );
}

function RosterHeader({
  totalArtists,
  totalCities,
  totalRoles,
  subtitle,
}: {
  totalArtists: number;
  totalCities: number;
  totalRoles: number;
  subtitle?: string;
}): React.ReactElement {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
          Roster
        </span>
        <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
          {totalArtists} Firmados
        </span>
      </div>
      <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne">
        Artistas &amp; Creadores
      </h1>
      <p className="text-white/40 text-lg max-w-xl italic">
        {subtitle ??
          `${totalArtists} artistas firmados en ${totalCities} ciudades, cubriendo ${totalRoles} roles dentro del sello Productora EAR.`}
      </p>
    </div>
  );
}

export default function PublicArtistRosterPage(): React.ReactElement {
  let artists: readonly ArtistRecord[] = [];
  let loadError: string | null = null;

  try {
    artists = Array.isArray(SEED_ARTISTS) ? (SEED_ARTISTS as readonly ArtistRecord[]) : [];
  } catch {
    loadError = 'Ocurrió un error inesperado al recuperar los datos del roster.';
  }

  if (loadError) {
    return (
      <main className="min-h-screen bg-[#030305] text-white pt-40 pb-24 font-sans">
        <div className="max-w-7xl mx-auto px-6">
          <ErrorState message={loadError} />
        </div>
      </main>
    );
  }

  if (artists.length === 0) {
    return (
      <main className="min-h-screen bg-[#030305] text-white pt-40 pb-24 font-sans">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <RosterHeader
            totalArtists={0}
            totalCities={0}
            totalRoles={0}
            subtitle="Aún no hay artistas firmados publicados en el roster del sello Productora EAR."
          />
          <EmptyState />
        </div>
      </main>
    );
  }

  const { totalArtists, totalRoles, totalCities, topRoles, topCities } = computeRosterStats(artists);

  return (
    <main className="min-h-screen bg-[#030305] text-white pt-40 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Header */}
        <RosterHeader
          totalArtists={totalArtists}
          totalCities={totalCities}
          totalRoles={totalRoles}
        />

        {/* Datos reales del roster */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#0b0b0b] border border-white/5 rounded-3xl p-8 space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ecb613]">
              Distribución por rol
            </h2>
            {topRoles.length === 0 ? (
              <p className="text-white/30 text-xs italic">Sin datos de roles disponibles.</p>
            ) : (
              <ul className="space-y-3">
                {topRoles.map(([role, count]) => (
                  <li key={role} className="flex items-center justify-between text-sm">
                    <span className="text-white/70 uppercase tracking-widest text-[11px] font-bold">
                      {role}
                    </span>
                    <span className="text-white font-mono text-xs">
                      {count} {count === 1 ? 'artista' : 'artistas'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-[#0b0b0b] border border-white/5 rounded-3xl p-8 space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ecb613]">
              Base por ciudad
            </h2>
            {topCities.length === 0 ? (
              <p className="text-white/30 text-xs italic">Sin datos de ciudades disponibles.</p>
            ) : (
              <ul className="space-y-3">
                {topCities.map(([city, count]) => (
                  <li key={city} className="flex items-center justify-between text-sm">
                    <span className="text-white/70 uppercase tracking-widest text-[11px] font-bold">
                      {city}
                    </span>
                    <span className="text-white font-mono text-xs">
                      {count} {count === 1 ? 'artista' : 'artistas'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="bg-[#0b0b0b] border border-white/5 rounded-[3rem] p-10 flex flex-col justify-between hover:border-[#ecb613]/30 transition-all group"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  <MapPin size={12} className="text-[#ecb613]" aria-hidden="true" /> {artist.homeBase}
                </div>
                <h2 className="text-3xl md:text-4xl font-black uppercase text-white font-syne group-hover:text-[#ecb613] transition-colors">
                  {artist.displayName}
                </h2>
                <p className="text-white/50 text-sm leading-relaxed">
                  {artist.bioShort}
                </p>
              </div>

              <div className="pt-8 mt-8 border-t border-white/5 flex items-center justify-between">
                <Link
                  href={`/artists/${artist.slug}`}
                  className="bg-white/5 hover:bg-white text-white hover:text-black px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/60"
                >
                  Ver Perfil <ArrowRight size={12} aria-hidden="true" />
                </Link>
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest font-mono">
                  {artist.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export { LoadingState, EmptyState, ErrorState, RosterHeader, computeRosterStats };