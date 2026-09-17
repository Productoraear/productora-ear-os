"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  CheckCircle2,
  Copy,
  Disc3,
  Download,
  Globe2,
  Radio,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  XCircle,
} from "lucide-react";
import {
  exportDDEXManifest,
  exportDDEXManifestXML,
  generateSovereignISRC,
  generateSovereignUPC,
  type SovereignRelease,
} from "@/lib/distribution/aggregatorEngine";
import {
  getUnifiedRadarMetrics,
  type UnifiedSocialOverview,
} from "@/lib/social/socialRadarEngine";

type TabId = "agregadora" | "radar";

const PLATFORM_ACCENTS: Record<string, string> = {
  Spotify: "#10B981",
  "YouTube Music": "#FF2B44",
  TikTok: "#00E5FF",
  "Instagram Reels": "#ecb613",
};

export default function DistributionRadar() {
  const [activeTab, setActiveTab] = useState<TabId>("agregadora");
  const [release, setRelease] = useState<SovereignRelease>({
    id: "ear-release-001",
    title: "Canción Soberana EAR OS",
    artist: "Edwin Agudelo",
    album: "Bóveda de Crecimiento Musical",
    durationSeconds: 225,
    genre: "Bolero Gala",
    language: "es-ES",
    releaseDate: new Date().toISOString().slice(0, 10),
  });

  const isrc = useMemo(() => generateSovereignISRC(release), [release]);
  const upc = useMemo(() => generateSovereignUPC(release), [release]);
  const manifest = useMemo(() => exportDDEXManifest({ ...release, isrc, upc }), [release, isrc, upc]);
  const radar: UnifiedSocialOverview = useMemo(
    () => getUnifiedRadarMetrics(release.title, 640),
    [release.title]
  );

  const xmlPreview = useMemo(() => exportDDEXManifestXML({ ...release, isrc, upc }), [release, isrc, upc]);

  const copyManifest = async () => {
    try {
      await navigator.clipboard.writeText(xmlPreview);
    } catch {
      // Clipboard no disponible: no interrumpe el flujo
    }
  };

  const downloadXml = () => {
    const blob = new Blob([xmlPreview], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ddex-${release.id}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#050507] p-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-[#00E5FF]">
            <Globe2 size={12} />
            Distribución & Métricas
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-1 leading-tight">
            Agregadora Soberana
          </h2>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0D0D15] p-1">
          {(["agregadora", "radar"] as TabId[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${
                activeTab === tab ? "bg-[#ecb613] text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab === "agregadora" ? "Agregadora DDEX" : "Radar Métricas"}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "agregadora" ? (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Formulario de metadatos */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1.5">
                  Título
                </label>
                <input
                  value={release.title}
                  onChange={(e) => setRelease((r) => ({ ...r, title: e.target.value }))}
                  className="w-full bg-[#0D0D15] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#ecb613]/60"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1.5">
                  Artista
                </label>
                <input
                  value={release.artist}
                  onChange={(e) => setRelease((r) => ({ ...r, artist: e.target.value }))}
                  className="w-full bg-[#0D0D15] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#ecb613]/60"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1.5">
                Álbum
              </label>
              <input
                value={release.album}
                onChange={(e) => setRelease((r) => ({ ...r, album: e.target.value }))}
                className="w-full bg-[#0D0D15] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#ecb613]/60"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1.5">
                  Género
                </label>
                <input
                  value={release.genre}
                  onChange={(e) => setRelease((r) => ({ ...r, genre: e.target.value }))}
                  className="w-full bg-[#0D0D15] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#ecb613]/60"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1.5">
                  Duración (s)
                </label>
                <input
                  type="number"
                  min={30}
                  max={900}
                  value={release.durationSeconds}
                  onChange={(e) => setRelease((r) => ({ ...r, durationSeconds: Number(e.target.value) }))}
                  className="w-full bg-[#0D0D15] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#ecb613]/60"
                />
              </div>
            </div>

            {/* Códigos soberanos */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-[#0D0D15] p-4">
                <p className="text-[10px] font-mono text-zinc-500">ISRC Soberano</p>
                <p className="text-sm font-bold text-white font-mono mt-1">{isrc}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#0D0D15] p-4">
                <p className="text-[10px] font-mono text-zinc-500">UPC-A (Módulo 10)</p>
                <p className="text-sm font-bold text-white font-mono mt-1">{upc}</p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0D0D15] p-4">
              <div>
                <p className="text-[10px] font-mono text-zinc-500">Split Soberano</p>
                <p className="text-xs font-mono text-white mt-1">
                  {manifest.splitSovereign.artista}% Artista · {manifest.splitSovereign.earOs}% EAR OS · {manifest.splitSovereign.vimume}% VIMUME
                </p>
              </div>
              <Disc3 className="text-[#ecb613]" size={20} />
            </div>

            {/* Acciones */}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={downloadXml}
                className="inline-flex items-center gap-2 rounded-xl bg-[#ecb613] px-4 py-2.5 text-sm font-bold text-black hover:bg-[#f2c936] transition-colors"
              >
                <Download size={16} />
                Exportar DDEX XML
              </button>
              <button
                type="button"
                onClick={copyManifest}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:border-[#00E5FF]/60 transition-colors"
              >
                <Copy size={16} />
                Copiar Manifiesto
              </button>
            </div>
          </div>

          {/* Validación DSP */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3">Validación DSP</h3>
            <div className="space-y-3">
              {manifest.validation.map((item) => (
                <div
                  key={item.dsp}
                  className="rounded-xl border border-white/10 bg-[#0D0D15] p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{item.dsp}</span>
                    {item.valid ? (
                      <CheckCircle2 size={18} className="text-[#10B981]" />
                    ) : (
                      <XCircle size={18} className="text-[#FF2B44]" />
                    )}
                  </div>
                  {item.issues.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {item.issues.map((issue) => (
                        <li key={issue} className="text-xs font-mono text-[#FF2B44]">
                          · {issue}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-[#0D0D15] p-4 overflow-x-auto">
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500 mb-2">
                Vista previa DDEX ERN 4.3
              </p>
              <pre className="text-[11px] font-mono text-zinc-400 whitespace-pre-wrap leading-relaxed">
                {xmlPreview}
              </pre>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs font-mono text-zinc-400">
              Tracking omnicanal · {radar.generatedAt}
            </p>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-mono ${
                radar.trend === "ascendente"
                  ? "text-[#10B981]"
                  : radar.trend === "descendente"
                  ? "text-[#FF2B44]"
                  : "text-zinc-400"
              }`}
            >
              {radar.trend === "ascendente" ? (
                <TrendingUp size={14} />
              ) : radar.trend === "descendente" ? (
                <TrendingDown size={14} />
              ) : (
                <BarChart3 size={14} />
              )}
              {radar.trend} · {radar.totalWeeklyGrowthPct}%
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="rounded-xl border border-white/10 bg-[#0D0D15] p-4">
              <p className="text-[10px] font-mono text-zinc-500">Streams diarios</p>
              <p className="text-2xl font-bold text-white font-mono">{radar.totalDailyStreams}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#0D0D15] p-4">
              <p className="text-[10px] font-mono text-zinc-500">Saves</p>
              <p className="text-2xl font-bold text-white font-mono">{radar.totalSaves}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#0D0D15] p-4">
              <p className="text-[10px] font-mono text-zinc-500">Shares</p>
              <p className="text-2xl font-bold text-white font-mono">{radar.totalShares}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#0D0D15] p-4">
              <p className="text-[10px] font-mono text-zinc-500">Virality</p>
              <p className="text-2xl font-bold text-[#ecb613] font-mono">{radar.avgViralityScore}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {radar.profiles.map((profile) => {
              const accent = PLATFORM_ACCENTS[profile.platform] || "#ecb613";
              return (
                <motion.div
                  key={profile.platform}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-xl border border-white/10 bg-[#0D0D15] p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-white">{profile.platform}</span>
                    <Radio size={14} style={{ color: accent }} />
                  </div>
                  <div className="space-y-2 font-mono text-xs text-zinc-400">
                    <div className="flex justify-between">
                      <span>Streams</span>
                      <span className="text-white">{profile.dailyStreams}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saves</span>
                      <span className="text-white">{profile.saves}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shares</span>
                      <span className="text-white">{profile.shares}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Alcance</span>
                      <span className="text-white">{profile.estimatedReach}</span>
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${profile.viralityScore}%`, backgroundColor: accent }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors"
          >
            <RefreshCw size={14} />
            Refrescar telemetría
          </button>
        </div>
      )}
    </div>
  );
}