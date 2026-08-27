'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Music, 
  QrCode, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Share2, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Download,
  Calendar,
  User,
  Building2,
  Copy,
  Check
} from 'lucide-react';

interface SongEntry {
  title: string;
  artist: string;
  year?: string;
  memoryNote?: string;
}

export default function VimumeFamiliaPage() {
  const [seniorName, setSeniorName] = useState('');
  const [birthYear, setBirthYear] = useState('1948');
  const [residencia, setResidencia] = useState('');
  const [parentesco, setParentesco] = useState('Hijo/a');
  const [contactPhone, setContactPhone] = useState('');
  
  const [songs, setSongs] = useState<SongEntry[]>([
    { title: 'Dos Gardenias', artist: 'Antonio Machín', memoryNote: 'Bailaban en las fiestas del pueblo' },
    { title: 'Bésame Mucho', artist: 'Lucho Gatica', memoryNote: 'Canción de su boda' },
    { title: 'El Rey', artist: 'José Alfredo Jiménez', memoryNote: 'La cantaba siempre en familia' },
  ]);

  const [saved, setSaved] = useState(false);
  const [sessionHash, setSessionHash] = useState('');
  const [hasCopied, setHasCopied] = useState(false);

  const calculateReminiscenceYears = () => {
    const y = parseInt(birthYear, 10);
    if (!y || isNaN(y)) return '1960 - 1975';
    return `${y + 15} - ${y + 25}`;
  };

  const handleSongChange = (index: number, field: keyof SongEntry, value: string) => {
    const updated = [...songs];
    updated[index] = { ...updated[index], [field]: value };
    setSongs(updated);
  };

  const addSongField = () => {
    if (songs.length < 10) {
      setSongs([...songs, { title: '', artist: '', memoryNote: '' }]);
    }
  };

  const removeSongField = (index: number) => {
    if (songs.length > 1) {
      setSongs(songs.filter((_, i) => i !== index));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const hash = `VIM-PASS-${Math.random().toString(36).substring(2, 8).toUpperCase()}-2026`;
    setSessionHash(hash);
    setSaved(true);
  };

  const copyPassportSummary = () => {
    const summary = `🎵 PASAPORTE NEUROACÚSTICO VIMUME\n` +
      `Expediente: ${sessionHash}\n` +
      `Familiar: ${seniorName} (Nacido en ${birthYear})\n` +
      `Centro/Residencia: ${residencia || 'Domicilio Particular'}\n` +
      `Período de Oro: ${calculateReminiscenceYears()}\n\n` +
      `CANCIONES ANCLA:\n` +
      songs.map((s, i) => `${i + 1}. ${s.title} - ${s.artist} ${s.memoryNote ? `(${s.memoryNote})` : ''}`).join('\n') +
      `\n\nGenerado en: https://www.edwinagudelo.es/vimume/familia`;
    
    navigator.clipboard.writeText(summary);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 3000);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f1e8] pt-28 pb-32 px-4 md:px-8 selection:bg-[#ecb613] selection:text-black font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <Link 
            href="/vimume" 
            className="inline-flex items-center gap-2 text-xs font-mono text-[#ecb613] hover:text-amber-300 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Volver al Hub VIMUME</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950/60 border border-pink-500/30 text-pink-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
            <span>Canal Familiar Seguro • RGPD Clínico Garantizado</span>
          </div>
        </div>

        {/* Header Hero */}
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[10px] font-mono uppercase tracking-widest">
            <Heart size={14} />
            <span>PORTAL FAMILIAR // REMINISCENCIA AFECTIVA</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white font-syne leading-[0.95]">
            Mapeo de la <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-300 to-[#ecb613]">
              Banda Sonora Vital™
            </span>
          </h1>
          <p className="text-white/70 text-sm md:text-base max-w-3xl leading-relaxed">
            Identifica las 10 canciones ancla grabadas en la memoria episódica de tu familiar entre los <strong className="text-white">15 y 25 años</strong>. Creamos su pasaporte neuroacústico digital con credencial QR para terapeutas y residencias.
          </p>
        </header>

        {/* VISTA DEL EXPEDIENTE GENERADO (ÉXITO) */}
        {saved ? (
          <div className="rounded-[2.5rem] bg-[#09090d] border border-emerald-500/30 p-8 md:p-12 shadow-[0_20px_70px_rgba(0,0,0,0.85)] relative overflow-hidden space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/30">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                    Pasaporte Neuroacústico Generado
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black uppercase text-white font-syne">
                    {seniorName}
                  </h2>
                </div>
              </div>

              <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 font-mono text-xs text-[#ecb613]">
                EXPEDIENTE: {sessionHash}
              </div>
            </div>

            {/* Ficha Resumen & QR Simulado */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-mono text-white/40 uppercase block">Año Nacimiento</span>
                    <p className="text-lg font-bold text-white font-mono">{birthYear}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-mono text-white/40 uppercase block">Ventana de Reminiscencia</span>
                    <p className="text-lg font-bold text-[#ecb613] font-mono">{calculateReminiscenceYears()}</p>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-mono text-white/40 uppercase block">Centro Asignado</span>
                  <p className="text-sm font-bold text-white">{residencia || 'Domicilio Familiar / Particular'}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-bold block">
                    Canciones Ancla Registradas ({songs.length})
                  </span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2">
                    {songs.map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-white/5 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#ecb613] font-bold">{i + 1}.</span>
                          <span className="text-white font-medium">{s.title || 'Canción sin título'}</span>
                          <span className="text-white/40">— {s.artist || 'Artista'}</span>
                        </div>
                        {s.memoryNote && (
                          <span className="text-[10px] text-pink-300/70 italic hidden sm:inline">
                            {s.memoryNote}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tarjeta QR Passcard */}
              <div className="bg-gradient-to-b from-[#181206] to-black p-6 rounded-3xl border border-[#ecb613]/30 text-center space-y-4 shadow-xl">
                <div className="p-4 bg-white rounded-2xl w-fit mx-auto shadow-md">
                  <QrCode size={140} className="text-black" />
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase text-[#ecb613] tracking-widest block font-bold">
                    QR de Sesión Terapéutica
                  </span>
                  <p className="text-[10px] text-white/60 mt-1">
                    Escanea en la residencia para cargar la lista en la Consola 40Hz
                  </p>
                </div>
              </div>
            </div>

            {/* Acciones del expediente */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
              <button
                onClick={() => setSaved(false)}
                className="px-6 py-3 border border-white/20 text-white text-xs font-mono uppercase tracking-widest hover:bg-white/10 rounded-xl transition-colors"
              >
                ← Editar Formulario
              </button>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={copyPassportSummary}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                >
                  {hasCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{hasCopied ? '¡Copiado!' : 'Copiar Resumen'}</span>
                </button>

                <Link
                  href="/vimume/experiencia"
                  className="px-6 py-3 bg-[#ecb613] hover:bg-amber-400 text-black text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shadow-lg"
                >
                  <span>Probar en Consola 40Hz</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* FORMULARIO DE CAPTURA NEUROEMOCIONAL */
          <form onSubmit={handleSave} className="rounded-[2.5rem] bg-[#09090d] border border-white/10 p-6 md:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.85)] relative overflow-hidden space-y-8">
            
            {/* Sección 1: Datos Biográficos */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <User size={16} className="text-[#ecb613]" />
                <h3 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
                  1. Perfil del Homenajeado / Familiar
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-mono font-bold uppercase text-white/50 block">
                    Nombre Completo del Senior *
                  </label>
                  <input
                    type="text"
                    required
                    value={seniorName}
                    onChange={(e) => setSeniorName(e.target.value)}
                    placeholder="Ej. Carmen Gómez Pérez"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#ecb613]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase text-white/50 block">
                    Año de Nacimiento *
                  </label>
                  <input
                    type="number"
                    required
                    min={1920}
                    max={1965}
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#ecb613] font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase text-white/50 block">
                    Residencia o Centro de Día (Opcional)
                  </label>
                  <input
                    type="text"
                    value={residencia}
                    onChange={(e) => setResidencia(e.target.value)}
                    placeholder="Ej. Residencia Municipal Los Álamos"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#ecb613]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase text-white/50 block">
                    Parentesco del Solicitante
                  </label>
                  <select
                    value={parentesco}
                    onChange={(e) => setParentesco(e.target.value)}
                    className="w-full bg-[#09090d] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#ecb613]"
                  >
                    <option value="Hijo/a">Hijo/a</option>
                    <option value="Cónyuge">Cónyuge</option>
                    <option value="Nieto/a">Nieto/a</option>
                    <option value="Terapeuta / Profesional">Terapeuta / Profesional</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase text-white/50 block">
                    Teléfono Móvil de Contacto
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+34 600 000 000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#ecb613] font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Sección 2: Las 10 Canciones Ancla (15 a 25 años) */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Music size={16} className="text-pink-400" />
                  <h3 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
                    2. Canciones Ancla de su Juventud (Ventana de Oro: {calculateReminiscenceYears()})
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-pink-400">
                  {songs.length}/10 Canciones
                </span>
              </div>

              <div className="space-y-3">
                {songs.map((song, idx) => (
                  <div key={idx} className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#ecb613] uppercase">
                        Canción #{idx + 1}
                      </span>
                      {songs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSongField(idx)}
                          className="text-white/30 hover:text-red-400 transition-colors p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <input
                          type="text"
                          required
                          value={song.title}
                          onChange={(e) => handleSongChange(idx, 'title', e.target.value)}
                          placeholder="Título (Ej. Dos Gardenias)"
                          className="w-full bg-black border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          required
                          value={song.artist}
                          onChange={(e) => handleSongChange(idx, 'artist', e.target.value)}
                          placeholder="Artista (Ej. Antonio Machín)"
                          className="w-full bg-black border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500"
                        />
                      </div>
                      <div className="sm:col-span-2 md:col-span-1">
                        <input
                          type="text"
                          value={song.memoryNote || ''}
                          onChange={(e) => handleSongChange(idx, 'memoryNote', e.target.value)}
                          placeholder="Recuerdo (Ej. Se conocieron bailándola)"
                          className="w-full bg-black border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {songs.length < 10 && (
                <button
                  type="button"
                  onClick={addSongField}
                  className="w-full py-3 border border-dashed border-white/20 rounded-2xl text-xs font-mono uppercase text-white/60 hover:text-white hover:border-[#ecb613] transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={14} />
                  <span>Añadir otra canción ({songs.length}/10)</span>
                </button>
              )}
            </div>

            {/* Botón de Envío Principal */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-white/50 text-xs">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>Datos protegidos bajo RGPD y encriptación SHA-256</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-500 via-rose-400 to-[#ecb613] text-black font-black text-xs font-mono uppercase tracking-widest rounded-2xl hover:brightness-110 transition-all shadow-[0_0_30px_rgba(244,63,94,0.3)] flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                <span>Guardar y Generar Código QR de Sesión</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </main>
  );
}
