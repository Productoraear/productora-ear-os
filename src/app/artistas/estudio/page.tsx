"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Disc3, Mic2, Music2, UserRound, Users } from "lucide-react";
import DawWorkspace from "@/components/voicestudio/DawWorkspace";
import AudioDragAndDrop from "@/components/voicestudio/AudioDragAndDrop";
import {
  getCatalogSummary,
  getArtistByIdentifier,
  listArtists,
  type ArtistRecord,
} from "@/lib/artists/artistCatalogEngine";

export default function ArtistStudioPage() {
  const summary = useMemo(() => getCatalogSummary(), []);
  const artists = useMemo(() => listArtists(), []);
  const [selectedId, setSelectedId] = useState<string>(summary.masterArtist?.id ?? artists[0]?.id ?? "");

  const selectedArtist: ArtistRecord | null = useMemo(
    () => getArtistByIdentifier(selectedId) ?? null,
    [selectedId]
  );

  return (
    <main className="w-full overflow-x-hidden bg-[#030305] text-white selection:bg-[#ecb613] selection:text-black min-h-screen py-24 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <Link
          href="/voice-studio"
          className="inline-flex items-center gap-2 text-xs font-mono text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Volver a Voice Studio
        </Link>

        {/* Cabecera del portal */}
        <section className="py-6">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-[#ecb613]">
            <Users size={12} />
            Portal Multi-Artista
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mt-3 max-w-4xl">
            Estudio del Artista
          </h1>
          <p className="text-zinc-400 max-w-2xl mt-4 leading-relaxed">
            Gestiona tu catálogo soberano, sube tus stems y masters en WAV/FLAC/MP3, y produce
            con el DAW Suno-Killer bajo el Split Soberano 80/10/10.
          </p>
        </section>

        {/* Selector de artista + métricas del catálogo */}
        <section className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 rounded-2xl border border-white/10 bg-[#050507] p-5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-2">
              Perfil de Artista
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full bg-[#0D0D15] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#ecb613]/60"
            >
              {artists.map((artist) => (
                <option key={artist.id} value={artist.id} className="bg-[#0D0D15]">
                  {artist.displayName}
                </option>
              ))}
            </select>

            {selectedArtist && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <UserRound size={14} className="text-[#ecb613]" />
                  <span className="text-sm font-semibold text-white">{selectedArtist.role}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mic2 size={14} className="text-[#00E5FF]" />
                  <span className="text-xs font-mono text-zinc-400">
                    {selectedArtist.voiceProfiles.length} timbres vocales
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Disc3 size={14} className="text-[#10B981]" />
                  <span className="text-xs font-mono text-zinc-400">
                    {selectedArtist.catalog.length} releases
                  </span>
                </div>
                {selectedArtist.isrcRegistrant && (
                  <div className="flex items-center gap-2">
                    <Music2 size={14} className="text-[#ecb613]" />
                    <span className="text-xs font-mono text-zinc-400">
                      Registrante ISRC: {selectedArtist.isrcRegistrant}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-white/10 bg-[#050507] p-5">
              <p className="text-[10px] font-mono text-zinc-500">Artistas</p>
              <p className="text-3xl font-bold text-white font-mono mt-1">{summary.totalArtists}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#050507] p-5">
              <p className="text-[10px] font-mono text-zinc-500">Releases</p>
              <p className="text-3xl font-bold text-white font-mono mt-1">{summary.totalReleases}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#050507] p-5">
              <p className="text-[10px] font-mono text-zinc-500">Timbres</p>
              <p className="text-3xl font-bold text-white font-mono mt-1">{summary.totalVoiceProfiles}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#050507] p-5">
              <p className="text-[10px] font-mono text-zinc-500">Split</p>
              <p className="text-sm font-bold text-[#ecb613] font-mono mt-2">
                {summary.splitSovereign.artista}/{summary.splitSovereign.earOs}/{summary.splitSovereign.vimume}
              </p>
            </div>
          </div>
        </section>

        <DawWorkspace />
        <AudioDragAndDrop artistId={selectedArtist?.id ?? "edwin-agudelo"} />
      </div>
    </main>
  );
}