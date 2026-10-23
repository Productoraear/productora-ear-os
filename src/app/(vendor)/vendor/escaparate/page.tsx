'use client';

import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Check,
  ExternalLink,
  HeartPulse,
  Loader2,
  Music,
  Play,
  Save,
  Sparkles,
  Store,
} from 'lucide-react';

import VendorShowcaseCard, {
  type VendorProfilePublic,
  type VendorTier,
} from '@/components/vendor/VendorShowcaseCard';
import type { VendorMediaAssetRecord } from '@/lib/vendor/vendorCrmTypes';

// Anti-Sabotaje (réplica cliente de los patrones server-side; sin flag `g` para `.test()`).
const URL_PATTERN = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/i;
const PHONE_PATTERN = /(?:\d[\s-]*){9,}/;

interface ProfileApiItem {
  id: string;
  slug: string | null;
  stageName: string | null;
  bio: string | null;
  baseRateEur: number | null;
  soundLimitDba: number | null;
  youtubeUrl: string | null;
  spotifyUrl: string | null;
  tier: VendorTier;
  isVimumeActive: boolean;
  status: string;
  strikes: number;
  createdAt: string;
  updatedAt: string;
}

interface MediaApiItem {
  id: string;
  providerId: string | null;
  vendorId: string | null;
  url: string;
  type: string;
  sizeBytes: number;
  fileName: string | null;
  fileHashSha256: string | null;
  displayOrder: number;
  createdAt: string;
}

interface ProfileApiResponse {
  success: boolean;
  profile: ProfileApiItem;
  quota: { quotaUsedMb: number; quotaMaxMb: number; usagePct: number };
  showcaseMetrics: { mediaCount: number; bookingCount: number; clientCount: number; leadCount: number };
  media: MediaApiItem[];
}

interface LoadedMeta {
  id: string;
  slug: string | null;
  tier: VendorTier;
  status: string;
}

export default function VendorEscaparatePage() {
  const [stageName, setStageName] = useState('');
  const [bio, setBio] = useState('');
  const [baseRateEur, setBaseRateEur] = useState('');
  const [soundLimitDba, setSoundLimitDba] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [vimumeEnabled, setVimumeEnabled] = useState(false);

  const [loaded, setLoaded] = useState<LoadedMeta | null>(null);
  const [media, setMedia] = useState<VendorMediaAssetRecord[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/vendor/profile', { cache: 'no-store' });
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error ?? `Error ${res.status}`);
        }
        const data = (await res.json()) as ProfileApiResponse;
        if (cancelled) return;

        setStageName(data.profile?.stageName ?? '');
        setBio(data.profile?.bio ?? '');
        setBaseRateEur(data.profile?.baseRateEur != null ? String(data.profile.baseRateEur) : '');
        setSoundLimitDba(data.profile?.soundLimitDba != null ? String(data.profile.soundLimitDba) : '');
        setYoutubeUrl(data.profile?.youtubeUrl ?? '');
        setSpotifyUrl(data.profile?.spotifyUrl ?? '');
        setVimumeEnabled(Boolean(data.profile?.isVimumeActive));
        setLoaded({
          id: data.profile?.id ?? '',
          slug: data.profile?.slug ?? null,
          tier: data.profile?.tier ?? 'FREE',
          status: data.profile?.status ?? 'ACTIVE',
        });
        setMedia(
          (data.media ?? []).map((item) => ({
            ...item,
            createdAt: new Date(item.createdAt),
          })),
        );
      } catch (err) {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Error al cargar el perfil.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const bioHasLink = URL_PATTERN.test(bio);
  const bioHasPhone = PHONE_PATTERN.test(bio);
  const bioBlocked = bioHasLink || bioHasPhone;
  const canSave = !bioBlocked && stageName.trim().length >= 2 && !saving && !loading;

  const previewVendor: VendorProfilePublic = {
    id: loaded?.id ?? '',
    slug: loaded?.slug ?? null,
    stageName: stageName.trim() || 'Tu Nombre Artístico',
    bio: bio.trim() || 'Describe tu propuesta de valor…',
    baseRateEur: baseRateEur.trim() === '' ? null : Number(baseRateEur.replace(',', '.')),
    soundLimitDba: soundLimitDba.trim() === '' ? null : Number.parseInt(soundLimitDba, 10),
    youtubeUrl: youtubeUrl.trim() || null,
    spotifyUrl: spotifyUrl.trim() || null,
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (bioBlocked) return;

    setSaving(true);
    setSaved(false);
    setSaveError(null);

    try {
      const res = await fetch('/api/vendor/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stageName: stageName.trim(),
          bio: bio.trim(),
          baseRateEur: baseRateEur.trim() === '' ? undefined : Number(baseRateEur.replace(',', '.')),
          soundLimitDba: soundLimitDba.trim() === '' ? undefined : Number.parseInt(soundLimitDba, 10),
          youtubeUrl: youtubeUrl.trim() === '' ? undefined : youtubeUrl.trim(),
          spotifyUrl: spotifyUrl.trim() === '' ? undefined : spotifyUrl.trim(),
          isVimumeActive: vimumeEnabled,
        }),
      });
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) throw new Error(body?.error ?? `Error ${res.status}`);
      setSaved(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-zinc-400" aria-busy="true">
        <Loader2 size={28} className="animate-spin text-[#ecb613]" />
        <span className="text-xs font-mono uppercase tracking-widest">Cargando escaparate…</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm font-mono flex items-center gap-3">
        <AlertTriangle size={18} />
        <span>No se pudo cargar el perfil: {loadError}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[10px] font-mono text-amber-300 font-bold uppercase mb-2">
            <Store size={12} />
            <span>Perfil Público · Datos reales en PostgreSQL</span>
          </div>
          <h1 className="text-3xl font-black font-syne text-white tracking-tight">
            Gestión del Escaparate Público
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
            Optimiza tu ficha comercial, biografía, tarifa, rider acústico y enlaces audiovisuales.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-[#ecb613] font-mono text-xs font-bold rounded-2xl self-start sm:self-auto">
          <ExternalLink size={14} />
          <span>Tier: {(loaded?.tier ?? 'FREE').toUpperCase()}</span>
        </span>
      </header>

      {saved && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs font-mono text-emerald-400 flex items-center gap-2 animate-in fade-in">
          <Check size={16} />
          <span>¡Escaparate actualizado y persistido en base de datos!</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs font-mono text-rose-300 flex items-center gap-2 animate-in fade-in">
          <AlertTriangle size={16} />
          <span>{saveError}</span>
        </div>
      )}

      {/* Formulario Principal */}
      <form onSubmit={handleSave} className="space-y-8">
        {/* Bloque 1: Datos Principales */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-xl space-y-6">
          <h3 className="text-lg font-bold font-syne text-white flex items-center gap-2 border-b border-white/10 pb-4">
            <Sparkles size={16} className="text-[#ecb613]" />
            <span>Información Básica de Marca</span>
          </h3>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-zinc-400 mb-2 font-bold uppercase">Nombre Artístico / Nombre Comercial</label>
              <input
                type="text"
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                required
                minLength={2}
                maxLength={80}
                className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#ecb613] text-sm"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-2 font-bold uppercase">Biografía Comercial y Propuesta de Valor</label>
              <textarea
                rows={6}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={5000}
                className={`w-full bg-black/60 border rounded-2xl p-4 text-white focus:outline-none text-xs font-sans leading-relaxed ${
                  bioBlocked ? 'border-rose-500/60' : 'border-white/10 focus:border-[#ecb613]'
                }`}
              />
              {bioBlocked && (
                <div className="mt-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-2">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <span>
                    {bioHasLink
                      ? 'No se permiten enlaces o URLs en la biografía.'
                      : 'No se permiten números de teléfono en la biografía.'}
                    {' '}El guardado queda bloqueado hasta corregirlo.
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 mb-2 font-bold uppercase">Tarifa Base (€)</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={baseRateEur}
                  onChange={(e) => setBaseRateEur(e.target.value)}
                  placeholder="350"
                  className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#ecb613]"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-2 font-bold uppercase">Límite Acústico (dBA)</label>
                <input
                  type="number"
                  min={40}
                  max={130}
                  value={soundLimitDba}
                  onChange={(e) => setSoundLimitDba(e.target.value)}
                  placeholder="75"
                  className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#ecb613]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bloque 2: Integración Audiovisual (YouTube / Spotify) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-xl space-y-6">
          <h3 className="text-lg font-bold font-syne text-white flex items-center gap-2 border-b border-white/10 pb-4">
            <Music size={16} className="text-[#ecb613]" />
            <span>Muestras de Demostración (Vídeo &amp; Audio)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
            <div>
              <label className="block text-zinc-400 mb-2 font-bold uppercase flex items-center gap-1.5">
                <Play size={12} className="text-rose-500" />
                <span>Vídeo Destacado (YouTube URL)</span>
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#ecb613]"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-2 font-bold uppercase flex items-center gap-1.5">
                <Music size={12} className="text-emerald-400" />
                <span>Audio / Perfil (Spotify URL)</span>
              </label>
              <input
                type="url"
                value={spotifyUrl}
                onChange={(e) => setSpotifyUrl(e.target.value)}
                placeholder="https://open.spotify.com/..."
                className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#ecb613]"
              />
            </div>
          </div>

          {/* Toggle VIMUME (impacto social 10% · protocolo 40 Hz) */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center gap-3">
              <HeartPulse size={18} className="text-emerald-300" />
              <div>
                <span className="block text-white font-bold text-xs font-mono uppercase">Sello VIMUME (Impacto Social 10%)</span>
                <span className="block text-zinc-400 text-[11px] font-light mt-0.5">
                  Sesiones neuroacústicas para mayores · Protocolo 40 Hz · deducible Ley 49/2002.
                </span>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={vimumeEnabled}
              onClick={() => setVimumeEnabled((prev) => !prev)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                vimumeEnabled ? 'bg-emerald-500' : 'bg-white/10'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                  vimumeEnabled ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Botón de Guardado */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!canSave}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#ecb613] hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-mono text-xs font-black uppercase rounded-2xl transition-all shadow-xl shadow-amber-950/40 hover:scale-105"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{saving ? 'Guardando…' : 'Guardar Cambios en Escaparate'}</span>
          </button>
        </div>
      </form>

      {/* Previsualización en vivo del escaparate público */}
      <section aria-label="Previsualización en vivo" className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
          <ExternalLink size={14} className="text-[#ecb613]" />
          <span>Previsualización en vivo del escaparate público</span>
        </div>
        <VendorShowcaseCard
          vendor={previewVendor}
          media={media}
          vimumeEnabled={vimumeEnabled}
          tier={loaded?.tier ?? 'FREE'}
        />
      </section>
    </div>
  );
}




