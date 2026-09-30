'use client';

import React, { useState } from 'react';
import { Store, Music, Sparkles, Check, Save, Play, ExternalLink } from 'lucide-react';

export default function VendorEscaparatePage() {
  const [stageName, setStageName] = useState('Edwin Agudelo (Guitarra & Voz)');
  const [bio, setBio] = useState('Solista acústico profesional con más de 12 años de trayectoria en eventos de gala, bodas exclusivas y recitales de alta fidelidad sonora. Repertorio adaptable desde pop internacional, flamenco pop hasta baladas románticas.');
  const [youtubeUrl, setYoutubeUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [spotifyUrl, setSpotifyUrl] = useState('https://open.spotify.com/artist/example');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[10px] font-mono text-amber-300 font-bold uppercase mb-2">
            <Store size={12} />
            <span>Perfil Público Estilo Bodas.net 100D</span>
          </div>
          <h1 className="text-3xl font-black font-syne text-white tracking-tight">
            Gestión del Escaparate Público
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
            Optimiza tu ficha comercial, biografía, repertorio, fotos de alta calidad y enlaces audiovisuales.
          </p>
        </div>

        <a
          href="/artistas/edwin-agudelo"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[#ecb613] font-mono text-xs font-bold rounded-2xl transition-all self-start sm:self-auto"
        >
          <span>Vista Previa Escaparate</span>
          <ExternalLink size={14} />
        </a>
      </header>

      {saved && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs font-mono text-emerald-400 flex items-center gap-2 animate-in fade-in">
          <Check size={16} />
          <span>¡Escaparate actualizado correctamente con certificación S-Class!</span>
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
                className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#ecb613] text-sm"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-2 font-bold uppercase">Biografía Comercial y Propuesta de Valor</label>
              <textarea
                rows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
                className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#ecb613] text-xs font-sans leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Bloque 2: Integración Audiovisual (YouTube / Spotify) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-xl space-y-6">
          <h3 className="text-lg font-bold font-syne text-white flex items-center gap-2 border-b border-white/10 pb-4">
            <Music size={16} className="text-[#ecb613]" />
            <span>Muestras de Demostración (Vídeo & Audio)</span>
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
        </div>

        {/* Botón de Guardado */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#ecb613] hover:bg-amber-400 text-black font-mono text-xs font-black uppercase rounded-2xl transition-all shadow-xl shadow-amber-950/40 hover:scale-105"
          >
            <Save size={16} />
            <span>Guardar Cambios en Escaparate</span>
          </button>
        </div>

      </form>

    </div>
  );
}
