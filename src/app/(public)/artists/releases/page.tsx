import React from 'react';
import { SEED_ARTISTS } from '@/lib/artists/schema';
import { Disc, Play, Calendar, AlertTriangle, Inbox } from 'lucide-react';

interface ReleaseWithArtist {
  id: string;
  title: string;
  format: string;
  releaseDate: string;
  artistName: string;
  artistSlug: string;
}

interface FormatCount {
  format: string;
  count: number;
}

interface YearCount {
  year: string;
  count: number;
}

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
}

function StatCard({ label, value, hint }: StatCardProps): React.JSX.Element {
  return (
    <div className="group border border-white/5 rounded-2xl p-4 bg-[#0b0b0b] transition-all duration-300 hover:border-[#ecb613]/30 hover:bg-[#0d0d0d] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-12px_rgba(236,182,19,0.15)]">
      <dt className="text-[9px] font-black uppercase tracking-widest text-white/30 font-mono transition-colors duration-300 group-hover:text-white/50">
        {label}
      </dt>
      <dd className="text-sm font-bold text-white mt-1 truncate transition-colors duration-300">
        {value}
      </dd>
      {hint ? (
        <dd className="text-[10px] text-[#ecb613] font-mono mt-0.5 truncate transition-opacity duration-300 group-hover:opacity-100 opacity-80">
          {hint}
        </dd>
      ) : null}
    </div>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function EmptyState({ icon, title, description }: EmptyStateProps): React.JSX.Element {
  return (
    <div
      role="status"
      aria-live="polite"
      className="border border-white/5 rounded-[2.5rem] p-16 bg-[#0b0b0b] text-center transition-all duration-500 hover:border-white/10"
    >
      <div className="mx-auto text-white/10 mb-4 flex items-center justify-center transition-all duration-500 hover:text-white/20 hover:scale-105">
        {icon}
      </div>
      <p className="text-white/60 text-sm font-black uppercase tracking-widest font-mono">
        {title}
      </p>
      <p className="text-white/30 text-xs font-mono mt-2 max-w-md mx-auto">{description}</p>
    </div>
  );
}

interface ErrorStateProps {
  title: string;
  description: string;
}

function ErrorState({ title, description }: ErrorStateProps): React.JSX.Element {
  return (
    <div
      role="alert"
      className="border border-red-500/20 rounded-[2.5rem] p-16 bg-[#0b0b0b] text-center transition-all duration-500 hover:border-red-500/40"
    >
      <div className="mx-auto text-red-500/40 mb-4 flex items-center justify-center transition-all duration-500 hover:text-red-500/60 hover:scale-105">
        <AlertTriangle size={48} />
      </div>
      <p className="text-red-400/80 text-sm font-black uppercase tracking-widest font-mono">
        {title}
      </p>
      <p className="text-white/30 text-xs font-mono mt-2 max-w-md mx-auto">{description}</p>
    </div>
  );
}

export default function PublicReleasesListPage(): React.JSX.Element {
  let allReleases: ReleaseWithArtist[] = [];
  let loadError: string | null = null;

  try {
    allReleases = SEED_ARTISTS.flatMap((artist) =>
      artist.releases.map((release) => ({
        ...release,
        artistName: artist.displayName,
        artistSlug: artist.slug,
      }))
    );
  } catch (err) {
    loadError = err instanceof Error ? err.message : 'Error desconocido al cargar el catálogo';
  }

  const totalReleases: number = allReleases.length;
  const totalArtists: number = new Set(allReleases.map((r) => r.artistSlug)).size;
  const formats: string[] = Array.from(new Set(allReleases.map((r) => r.format)));

  const sortedReleases: ReleaseWithArtist[] = [...allReleases].sort((a, b) =>
    a.releaseDate < b.releaseDate ? 1 : a.releaseDate > b.releaseDate ? -1 : 0
  );

  const latestRelease: ReleaseWithArtist | undefined = sortedReleases[0];
  const earliestRelease: ReleaseWithArtist | undefined =
    sortedReleases[sortedReleases.length - 1];

  const formatCounts: FormatCount[] = formats
    .map((format) => ({
      format,
      count: allReleases.filter((r) => r.format === format).length,
    }))
    .sort((a, b) => b.count - a.count);

  const formatBreakdown: string = formatCounts
    .map((f) => `${f.count} ${f.format}`)
    .join(' · ');

  const yearCounts: Map<string, number> = new Map<string, number>();
  for (const release of allReleases) {
    const year: string = release.releaseDate.slice(0, 4);
    yearCounts.set(year, (yearCounts.get(year) ?? 0) + 1);
  }
  const activeYears: string[] = Array.from(yearCounts.keys()).sort();
  const yearRange: string =
    activeYears.length > 0
      ? `${activeYears[0]}–${activeYears[activeYears.length - 1]}`
      : '—';

  const yearCountList: YearCount[] = activeYears.map((year) => ({
    year,
    count: yearCounts.get(year) ?? 0,
  }));

  const hasReleases: boolean = totalReleases > 0;
  const hasRange: boolean = Boolean(latestRelease && earliestRelease);

  return (
    <main className="min-h-screen bg-[#030305] text-white pt-40 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20 transition-all duration-300 hover:bg-[#ecb613]/20 hover:border-[#ecb613]/40 hover:shadow-[0_0_20px_-4px_rgba(236,182,19,0.4)]">
              Releases
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              {totalReleases} {totalReleases === 1 ? 'Título' : 'Títulos'} · {totalArtists}{' '}
              {totalArtists === 1 ? 'Artista' : 'Artistas'}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne">
            Catálogo Musical
          </h1>
          <p className="text-white/40 text-lg max-w-xl italic">
            {hasReleases
              ? `${totalReleases} lanzamientos de ${totalArtists} ${
                  totalArtists === 1 ? 'artista' : 'artistas'
                } entre ${yearRange}. Distribución por formato: ${formatBreakdown}.`
              : 'Aún no hay lanzamientos registrados en el catálogo público.'}
          </p>
          {hasRange && latestRelease && earliestRelease && (
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 max-w-3xl">
              <StatCard
                label="Último lanzamiento"
                value={latestRelease.title}
                hint={latestRelease.releaseDate}
              />
              <StatCard
                label="Primer lanzamiento"
                value={earliestRelease.title}
                hint={earliestRelease.releaseDate}
              />
              <StatCard
                label="Formatos activos"
                value={String(formats.length)}
                hint={formats.join(', ') || '—'}
              />
              <StatCard
                label="Años con actividad"
                value={String(activeYears.length)}
                hint={yearRange}
              />
            </dl>
          )}
        </div>

        {/* Error state */}
        {loadError ? (
          <ErrorState
            title="No se pudo cargar el catálogo"
            description={loadError}
          />
        ) : (
          <>
            {/* Year distribution */}
            {yearCountList.length > 0 && (
              <section
                aria-label="Distribución por año"
                className="border border-white/5 rounded-[2rem] p-6 bg-[#0b0b0b] transition-all duration-500 hover:border-white/10"
              >
                <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30 font-mono mb-4">
                  Distribución por año
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {yearCountList.map((yc: YearCount) => (
                    <li
                      key={yc.year}
                      className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest font-mono border border-white/5 bg-black/40 text-white/60 transition-all duration-300 hover:border-[#ecb613]/30 hover:bg-[#ecb613]/5 hover:text-white hover:-translate-y-0.5 cursor-default"
                    >
                      <span className="text-[#ecb613]">{yc.year}</span>
                      <span className="text-white/30 mx-1.5">·</span>
                      <span>{yc.count}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Grid */}
            {hasReleases ? (
              <div className="grid md:grid-cols-3 gap-8">
                {sortedReleases.map((release: ReleaseWithArtist) => (
                  <article
                    key={release.id}
                    className="bg-[#0b0b0b] border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between transition-all duration-500 group hover:border-[#ecb613]/20 hover:bg-[#0d0d0d] hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(236,182,19,0.15)]"
                  >
                    <div className="space-y-6">
                      <div className="aspect-square bg-gradient-to-br from-[#121212] to-[#222222] border border-white/5 rounded-2xl flex items-center justify-center text-white/5 group-hover:text-[#ecb613] transition-colors duration-500 relative overflow-hidden">
                        <Disc
                          size={120}
                          className="transition-transform duration-700 group-hover:animate-spin"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-black/60 text-white border border-white/10 transition-all duration-300 group-hover:border-[#ecb613]/40 group-hover:text-[#ecb613]">
                            {release.format}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl font-black uppercase tracking-tight text-white font-syne transition-colors duration-300 group-hover:text-[#ecb613]">
                          {release.title}
                        </h3>
                        <span className="text-[10px] font-bold text-[#ecb613] uppercase tracking-widest block transition-opacity duration-300 group-hover:opacity-100 opacity-80">
                          {release.artistName}
                        </span>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40 font-bold uppercase tracking-widest font-mono transition-colors duration-300 group-hover:border-white/10">
                      <span className="flex items-center gap-1.5 transition-colors duration-300 group-hover:text-white/60">
                        <Calendar size={12} /> {release.releaseDate}
                      </span>
                      <button
                        type="button"
                        aria-label={`Reproducir ${release.title} de ${release.artistName}`}
                        className="p-3 bg-white/5 hover:bg-[#ecb613] text-white hover:text-black rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0b] hover:shadow-[0_0_24px_-4px_rgba(236,182,19,0.6)]"
                      >
                        <Play size={12} fill="currentColor" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Inbox size={48} />}
                title="Sin lanzamientos disponibles"
                description="Cuando se publiquen nuevos títulos aparecerán automáticamente en este catálogo."
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}