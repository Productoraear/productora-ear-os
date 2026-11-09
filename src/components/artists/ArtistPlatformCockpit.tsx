"use client";

/**
 * ════════════════════════════════════════════════════════════════════════════
 * COCKPIT DE PLATAFORMAS DEL ARTISTA — ESTADO HONESTO, CERO BOTONES FANTASMA
 * ════════════════════════════════════════════════════════════════════════════
 * Consume `src/lib/artists/platform-capabilities.ts` (SSOT de capacidades).
 * Regla dura (AF-1/AF-5 + INV-09):
 *   · El botón "Publicar" SÓLO se renderiza si `isPublishAvailable(id)` es true.
 *   · "Conectar" sólo aparece si hay OAuth real disponible (`conectada`).
 *   · Donde no hay API pública se muestra la VÍA REAL (distribuidor / CSV),
 *     que es texto, no un botón que no lleva a ninguna parte.
 *
 * Taste Engine OLED: fondo #030305, acento único oro #ecb613, sin emojis.
 * ════════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from "react";
import {
  ArrowUpTrayIcon,
  ArrowPathIcon,
  LinkIcon,
  NoSymbolIcon,
  EyeIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import {
  type CapabilityState,
  isPublishAvailable,
  orderedCapabilities,
  stateLabel,
} from "@/lib/artists/platform-capabilities";

export interface ArtistPlatformCockpitProps {
  /**
   * Publicador real inyectado por el Server Component. Si es `undefined`,
   * el panel NO pinta el botón de publicar (no se inventa un handler vacío).
   */
  readonly onPublish?: (platformId: string) => Promise<boolean>;
  /** Conector OAuth real. Si falta, "Conectar" se convierte en texto informativo. */
  readonly onConnect?: (platformId: string) => Promise<boolean>;
  /** Sincronización de métricas por API (sólo plataformas de lectura). */
  readonly onSync?: (platformId: string) => Promise<boolean>;
}

const STATE_STYLE: Record<CapabilityState, string> = {
  conectada: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  solo_lectura: "bg-[#ecb613]/10 text-[#ecb613] border-[#ecb613]/30",
  sin_api_publica: "bg-zinc-800/60 text-zinc-400 border-white/10",
};

const STATE_ICON: Record<CapabilityState, typeof LinkIcon> = {
  conectada: LinkIcon,
  solo_lectura: EyeIcon,
  sin_api_publica: NoSymbolIcon,
};

interface PlatformActionsProps {
  readonly platformId: string;
  readonly platformLabel: string;
  readonly busy: boolean;
  readonly open: boolean;
  readonly canPublish: boolean;
  readonly canConnect: boolean;
  readonly canSync: boolean;
  readonly onPublish?: (platformId: string) => Promise<boolean>;
  readonly onConnect?: (platformId: string) => Promise<boolean>;
  readonly onSync?: (platformId: string) => Promise<boolean>;
  readonly onToggleDetail: () => void;
}

/**
 * Bloque de acciones. Los botones se ejecutan SOLO si su handler existe;
 * ningún botón se pinta "decorativo" (INV-09).
 */
function PlatformActions({
  platformId,
  platformLabel,
  busy,
  open,
  canPublish,
  canConnect,
  canSync,
  onPublish,
  onConnect,
  onSync,
  onToggleDetail,
}: PlatformActionsProps) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      {canPublish && onPublish && (
        <button
          type="button"
          disabled={busy}
          onClick={() => void onPublish(platformId)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#ecb613] text-black text-[11px] font-mono font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
        >
          <ArrowUpTrayIcon className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden="true" />
          Publicar
        </button>
      )}
      {canConnect && onConnect && (
        <button
          type="button"
          disabled={busy}
          onClick={() => void onConnect(platformId)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-white text-[11px] font-mono font-bold uppercase tracking-wider hover:bg-white/5 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <LinkIcon className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden="true" />
          Conectar
        </button>
      )}
      {canSync && onSync && (
        <button
          type="button"
          disabled={busy}
          onClick={() => void onSync(platformId)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-zinc-300 text-[11px] font-mono font-bold uppercase tracking-wider hover:bg-white/5 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <ArrowPathIcon className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden="true" />
          Sincronizar
        </button>
      )}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`platform-detail-${platformId}`}
        onClick={onToggleDetail}
        className="inline-flex items-center gap-1 px-2 py-2 rounded-xl text-zinc-500 hover:text-white transition-colors cursor-pointer"
      >
        <span className="sr-only">
          {open ? 'Ocultar detalle de' : 'Ver detalle de'} {platformLabel}
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

export default function ArtistPlatformCockpit({
  onPublish,
  onConnect,
  onSync,
}: ArtistPlatformCockpitProps) {
  const platforms = orderedCapabilities();
  const [busyPlatform, setBusyPlatform] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const runAction = async (
    platformId: string,
    action: ((platformId: string) => Promise<boolean>) | undefined,
  ): Promise<boolean> => {
    if (!action) return false;
    setBusyPlatform(platformId);
    try {
      return await action(platformId);
    } catch {
      return false;
    } finally {
      setBusyPlatform(null);
    }
  };

  const handlePublish = onPublish
    ? (platformId: string) => runAction(platformId, onPublish)
    : undefined;
  const handleConnect = onConnect
    ? (platformId: string) => runAction(platformId, onConnect)
    : undefined;
  const handleSync = onSync ? (platformId: string) => runAction(platformId, onSync) : undefined;

  return (
    <section
      aria-labelledby="artist-platform-cockpit-title"
      className="bg-[#030305] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6"
    >
      <header className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2
            id="artist-platform-cockpit-title"
            className="text-lg sm:text-xl font-bold text-white font-syne"
          >
            Estado real de tus plataformas
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Cada plataforma declara lo que permite su API. Donde no existe API pública se indica
            la vía real: distribuidor, importación CSV o publicación manual.
          </p>
        </div>
        <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
          {platforms.length} plataformas
        </span>
      </header>

      <ul className="divide-y divide-white/5">
        {platforms.map((capability) => {
          const StateIcon = STATE_ICON[capability.state];
          const open = expanded === capability.platformId;
          const busy = busyPlatform === capability.platformId;
          const canPublish = isPublishAvailable(capability.platformId) && Boolean(onPublish);
          const canConnect = capability.state === 'conectada' && Boolean(onConnect);
          const canSync =
            (capability.state === 'conectada' || capability.state === 'solo_lectura') &&
            Boolean(onSync);

          return (
            <li key={capability.platformId} className="py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white font-syne truncate">
                    {capability.label}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono uppercase tracking-wider ${STATE_STYLE[capability.state]}`}
                    >
                      <StateIcon className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" />
                      {stateLabel(capability.state)}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      API: {capability.actions.length} acciones
                    </span>
                  </div>
                </div>
                <PlatformActions
                  platformId={capability.platformId}
                  platformLabel={capability.label}
                  busy={busy}
                  open={open}
                  canPublish={canPublish}
                  canConnect={canConnect}
                  canSync={canSync}
                  onPublish={handlePublish}
                  onConnect={handleConnect}
                  onSync={handleSync}
                  onToggleDetail={() =>
                    setExpanded(open ? null : capability.platformId)
                  }
                />
              </div>

              {open && (
                <div
                  id={`platform-detail-${capability.platformId}`}
                  className="mt-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2"
                >
                  <p className="text-xs text-zinc-300 leading-relaxed">{capability.reason}</p>
                  {capability.fallbackPath && (
                    <p className="text-xs text-zinc-400">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#ecb613] mr-2">
                        Vía real
                      </span>
                      {capability.fallbackPath}
                    </p>
                  )}
                  {capability.docs && (
                    <a
                      href={capability.docs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-[11px] font-mono text-cyan-400 hover:underline"
                    >
                      Documentación oficial
                    </a>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
