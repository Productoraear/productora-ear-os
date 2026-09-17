"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AudioLines,
  Download,
  Gauge,
  Headphones,
  Mic2,
  Music2,
  Radio,
  SlidersHorizontal,
  Volume2,
  type LucideIcon,
} from "lucide-react";
import {
  buildSunoPrompt,
  masterToAesTd1004,
  renderStems,
  type MusicalGenre,
  type StemTrack,
  type SunoMasterFormat,
  type SunoSampleRate,
  type SunoTrackConfig,
} from "@/lib/audio/sunoKillerEngine";

const GENRES: MusicalGenre[] = [
  "balada_romantica",
  "mariachi_tradicional",
  "pop_acustico",
  "bolero_gala",
  "electronica_dark",
  "corrido_soberano",
];

const KEYS = [
  "C Mayor",
  "G Mayor",
  "D Mayor",
  "A Mayor",
  "E Mayor",
  "F Mayor",
  "A Menor",
  "E Menor",
];

const DEFAULT_TRACK_STATE: SunoTrackConfig = {
  title: "Canción Soberana EAR OS",
  genre: "bolero_gala",
  bpm: 90,
  key: "C Mayor",
  language: "es-ES",
  mood: "Íntimo y emotivo",
  voiceProfileId: "edwin_agudelo_gala",
  lyrics: "El amor verdadero no se apaga,\nbrillará para ti en esta noche sagrada…",
};

const STEM_ICONS: Record<StemTrack["role"], LucideIcon> = {
  "Lead Vocal": Mic2,
  Percusión: Activity,
  Bajo: SlidersHorizontal,
  Armonía: AudioLines,
};

const STEM_COLORS: Record<StemTrack["role"], string> = {
  "Lead Vocal": "#ecb613",
  Percusión: "#00E5FF",
  Bajo: "#FF2B44",
  Armonía: "#10B981",
};

export default function DawWorkspace() {
  const [trackState, setTrackState] = useState(DEFAULT_TRACK_STATE);
  const [stems, setStems] = useState<StemTrack[]>(() => renderStems(DEFAULT_TRACK_STATE));
  const [masterFormat, setMasterFormat] = useState<SunoMasterFormat>("WAV 24-bit");
  const [sampleRate, setSampleRate] = useState<SunoSampleRate>(48000);
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const prompt = useMemo(() => buildSunoPrompt(trackState), [trackState]);
  const mastering = useMemo(
    () => masterToAesTd1004(stems, masterFormat, sampleRate),
    [stems, masterFormat, sampleRate]
  );
  const audibleStems = stems.filter((stem) => !stem.muted).length;

  const updateStem = (id: string, patch: Partial<StemTrack>) => {
    setStems((current) => {
      const next = current.map((stem) => {
        if (stem.id !== id) return stem;
        const merged = { ...stem, ...patch };

        // Solo mutua: al activar solo, se silencian las demás (manteniendo su máscara)
        if (patch.solo && merged.solo) {
          return { ...merged, muted: false };
        }
        return merged;
      });

      const anySolo = next.some((stem) => stem.solo);
      return next.map((stem) => (anySolo && !stem.solo ? { ...stem, muted: true } : stem));
    });
  };

  const toggleMute = (id: string) => {
    const target = stems.find((stem) => stem.id === id);
    if (target) updateStem(id, { muted: !target.muted });
  };

  const toggleSolo = (id: string) => {
    const target = stems.find((stem) => stem.id === id);
    if (target) updateStem(id, { solo: !target.solo });
  };

  const handleRender = () => {
    setStems(renderStems(trackState));
    setExportStatus(null);
  };

  const handleExport = () => {
    const blob = new Blob(
      [
        `EAR OS DAW :: Export ${mastering.format}\n`,
        `Título: ${trackState.title}\n`,
        `BPM: ${trackState.bpm} | Tono: ${trackState.key}\n`,
        `Master: ${mastering.standard} ${mastering.integratedLufs} LUFS\n`,
        prompt,
      ],
      { type: "application/octet-stream" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${trackState.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.daw-master.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setExportStatus(`Exportador ${mastering.format} listo · ${mastering.integratedLufs} LUFS`);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#050507] p-6">
      {/* Cabecera de la mesa de trabajo */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-[#ecb613]">
            <Radio size={12} />
            Suno-Killer DAW
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-1 leading-tight">
            Mesa de Producción Soberana
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            GPU Local RX 7900 XTX
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Gauge size={14} />
            {trackState.bpm} BPM
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        {/* Configuración de canción */}
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1.5">
              Título
            </label>
            <input
              value={trackState.title}
              onChange={(e) => setTrackState((s) => ({ ...s, title: e.target.value }))}
              className="w-full bg-[#0D0D15] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#ecb613]/60"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1.5">
              Género
            </label>
            <select
              value={trackState.genre}
              onChange={(e) => setTrackState((s) => ({ ...s, genre: e.target.value as MusicalGenre }))}
              className="w-full bg-[#0D0D15] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#ecb613]/60"
            >
              {GENRES.map((genre) => (
                <option key={genre} value={genre} className="bg-[#0D0D15]">
                  {genre.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1.5">
                BPM
              </label>
              <input
                type="number"
                min={60}
                max={180}
                value={trackState.bpm}
                onChange={(e) => setTrackState((s) => ({ ...s, bpm: Number(e.target.value) }))}
                className="w-full bg-[#0D0D15] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#ecb613]/60"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1.5">
                Tonalidad
              </label>
              <select
                value={trackState.key}
                onChange={(e) => setTrackState((s) => ({ ...s, key: e.target.value }))}
                className="w-full bg-[#0D0D15] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#ecb613]/60"
              >
                {KEYS.map((key) => (
                  <option key={key} value={key} className="bg-[#0D0D15]">
                    {key}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1.5">
              Letra / Prompt
            </label>
            <textarea
              rows={6}
              value={trackState.lyrics}
              onChange={(e) => setTrackState((s) => ({ ...s, lyrics: e.target.value }))}
              className="w-full bg-[#0D0D15] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#ecb613]/60 resize-none"
            />
          </div>
        </div>

        {/* Faders de mezcla */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">
              Mezclador de 4 Stems
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              {audibleStems}/{stems.length} pistas activas
            </span>
          </div>

          {stems.map((stem) => {
            const Icon = STEM_ICONS[stem.role] || Music2;
            const color = STEM_COLORS[stem.role];

            return (
              <div
                key={stem.id}
                className="rounded-2xl border border-white/10 bg-[#0D0D15] p-4"
                style={{ borderColor: stem.solo ? `${color}88` : undefined }}
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${color}1A`, border: `1px solid ${color}44` }}
                    >
                      <Icon size={15} style={{ color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{stem.role}</p>
                      <p className="text-[10px] font-mono text-zinc-500">
                        Peak {stem.estimatedPeakDb} dB · {stem.estimatedLufs} LUFS
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleMute(stem.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors ${
                        stem.muted ? "bg-[#FF2B44] text-white" : "bg-white/5 text-zinc-400 hover:text-white"
                      }`}
                    >
                      Mute
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSolo(stem.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors ${
                        stem.solo ? "bg-[#ecb613] text-black" : "bg-white/5 text-zinc-400 hover:text-white"
                      }`}
                    >
                      Solo
                    </button>
                  </div>
                </div>

                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(stem.volume * 100)}
                  disabled={stem.muted}
                  onChange={(e) => updateStem(stem.id, { volume: Number(e.target.value) / 100 })}
                  className="w-full h-1.5 appearance-none rounded-full outline-none cursor-pointer"
                  style={{ accentColor: color }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Master y exportación */}
      <div className="mt-6 pt-6 border-t border-white/10 grid md:grid-cols-[1fr_auto] gap-6 items-end">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-[#00E5FF]">
            <Headphones size={12} />
            Master AES TD1004
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-white/10 bg-[#0D0D15] p-3">
              <p className="text-[10px] font-mono text-zinc-500">Loudness</p>
              <p className="text-lg font-bold text-white font-mono">{mastering.integratedLufs} LUFS</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#0D0D15] p-3">
              <p className="text-[10px] font-mono text-zinc-500">True Peak</p>
              <p className="text-lg font-bold text-white font-mono">{mastering.truePeakDb} dB</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#0D0D15] p-3">
              <p className="text-[10px] font-mono text-zinc-500">Rango Dinámico</p>
              <p className="text-lg font-bold text-white font-mono">{mastering.dynamicRangeDb} dB</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#0D0D15] p-3">
              <p className="text-[10px] font-mono text-zinc-500">Estéreo</p>
              <p className="text-lg font-bold text-white font-mono">{Math.round(mastering.stereoWidth * 100)}%</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={masterFormat}
            onChange={(e) => setMasterFormat(e.target.value as SunoMasterFormat)}
            className="bg-[#0D0D15] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#00E5FF]/60"
          >
            <option value="WAV 24-bit" className="bg-[#0D0D15]">WAV 24-bit</option>
            <option value="FLAC 24-bit" className="bg-[#0D0D15]">FLAC 24-bit</option>
          </select>
          <select
            value={sampleRate}
            onChange={(e) => setSampleRate(Number(e.target.value) as SunoSampleRate)}
            className="bg-[#0D0D15] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#00E5FF]/60"
          >
            <option value={44100} className="bg-[#0D0D15]">44.1 kHz</option>
            <option value={48000} className="bg-[#0D0D15]">48 kHz</option>
            <option value={96000} className="bg-[#0D0D15]">96 kHz</option>
          </select>
          <button
            type="button"
            onClick={handleRender}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:border-[#ecb613]/60 transition-colors"
          >
            <Volume2 size={16} />
            Renderizar Stems
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-xl bg-[#ecb613] px-4 py-2.5 text-sm font-bold text-black hover:bg-[#f2c936] transition-colors"
          >
            <Download size={16} />
            Exportar {masterFormat}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {exportStatus && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-xs font-mono text-[#10B981]"
          >
            {exportStatus}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Prompt cuántico */}
      <div className="mt-6 rounded-xl border border-white/10 bg-[#0D0D15] p-4 overflow-x-auto">
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500 mb-2">
          Prompt Cuántico
        </p>
        <pre className="text-[11px] font-mono text-zinc-400 whitespace-pre-wrap leading-relaxed">{prompt}</pre>
      </div>
    </div>
  );
}