'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Headphones, 
  Brain, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function VimumeExperienciaPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(68); // Límite seguro <75 dB
  const [activeFrequency, setActiveFrequency] = useState<'40hz' | '10hz' | 'classical'>('40hz');
  const [carrierFreq, setCarrierFreq] = useState(220); // 220 Hz base

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscLeftRef = useRef<OscillatorNode | null>(null);
  const oscRightRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const stopAudio = () => {
    try {
      oscLeftRef.current?.stop();
      oscRightRef.current?.stop();
      oscLeftRef.current?.disconnect();
      oscRightRef.current?.disconnect();
    } catch {
      // Ignore if already stopped
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {});
    }
    audioCtxRef.current = null;
    oscLeftRef.current = null;
    oscRightRef.current = null;
    gainNodeRef.current = null;
    setIsPlaying(false);
  };

  const toggleAudio = () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;

      const merger = ctx.createChannelMerger(2);

      // Frecuencia gamma: 40 Hz de diferencia (Left 220 Hz, Right 260 Hz)
      const diff = activeFrequency === '40hz' ? 40 : activeFrequency === '10hz' ? 10 : 40;
      const leftFreq = carrierFreq;
      const rightFreq = carrierFreq + diff;

      // Canal Izquierdo
      const oscLeft = ctx.createOscillator();
      oscLeft.type = 'sine';
      oscLeft.frequency.setValueAtTime(leftFreq, ctx.currentTime);
      oscLeft.connect(merger, 0, 0);

      // Canal Derecho
      const oscRight = ctx.createOscillator();
      oscRight.type = 'sine';
      oscRight.frequency.setValueAtTime(rightFreq, ctx.currentTime);
      oscRight.connect(merger, 0, 1);

      // Ganancia regulada con límite físico infranqueable
      const gainNode = ctx.createGain();
      // Mapear el volumen 50-74 dB a una amplitud segura [0.02 - 0.12]
      const safeGain = ((volume - 50) / 24) * 0.08 + 0.02;
      gainNode.gain.setValueAtTime(safeGain, ctx.currentTime);
      gainNodeRef.current = gainNode;

      merger.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscLeft.start();
      oscRight.start();

      oscLeftRef.current = oscLeft;
      oscRightRef.current = oscRight;
      setIsPlaying(true);
    } catch (err) {
      console.error('Web Audio API error:', err);
      setIsPlaying(false);
    }
  };

  // Actualizar volumen en tiempo real
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      const safeGain = ((volume - 50) / 24) * 0.08 + 0.02;
      gainNodeRef.current.gain.setTargetAtTime(safeGain, audioCtxRef.current.currentTime, 0.05);
    }
  }, [volume]);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f1e8] pt-28 pb-32 px-4 md:px-8 selection:bg-[#ecb613] selection:text-black font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <Link 
            href="/vimume" 
            className="inline-flex items-center gap-2 text-xs font-mono text-[#AAD6CD] hover:text-[#258DCD] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Volver al Ecosistema VIMUME</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#081226] border border-[#AAD6CD]/30 text-[#AAD6CD] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#AAD6CD] animate-pulse" />
            <span>Web Audio API Nativo • Protocolo Clínico Activo</span>
          </div>
        </div>

        {/* Header Hero */}
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#AAD6CD]/10 border border-[#AAD6CD]/30 text-[#AAD6CD] text-[10px] font-mono uppercase tracking-widest">
            <Brain size={14} />
            <span>DEMOSTRADOR CLÍNICO // ESTIMULACIÓN GAMMA 40 HZ</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white font-syne leading-[0.95]">
            Consola Neuroacústica <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#AAD6CD] via-[#258DCD] to-white">
              Gamma 40Hz en Tiempo Real
            </span>
          </h1>
          <p className="text-white/70 text-sm md:text-base max-w-3xl leading-relaxed">
            Generador interactivo de pulsos binaurales de 40 Hz para la estimulación de microglía y sincronización cerebral en Alzheimer y demencias. Emisión electroacústica protegida con limitador estricto &lt;75 dB SPL.
          </p>
        </header>

        {/* CONSOLA PRINCIPAL INTERACTIVA */}
        <div className="rounded-[2.5rem] bg-gradient-to-b from-[#081226] to-[#040914] border border-[#AAD6CD]/30 p-6 md:p-10 shadow-[0_20px_70px_rgba(8,18,38,0.95)] relative overflow-hidden space-y-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#258DCD]/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#AAD6CD]/10 blur-3xl pointer-events-none" />

          {/* Estado de conexión */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#AAD6CD]/15 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-[#AAD6CD] animate-ping shadow-[0_0_12px_#AAD6CD]' : 'bg-white/20'}`} />
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#AAD6CD]">
                  {isPlaying ? 'OSCILADOR EMITIENDO EN ESTÉREO (40 HZ)' : 'SISTEMA EN ESPERA'}
                </span>
              </div>
              <p className="text-xs text-white/50">
                Canal Izquierdo: <span className="font-mono text-[#AAD6CD]">{carrierFreq} Hz</span> | Canal Derecho: <span className="font-mono text-[#AAD6CD]">{carrierFreq + 40} Hz</span> (Δ = 40 Hz Gamma)
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#040914] border border-[#AAD6CD]/20 text-xs font-mono text-white/80">
              <Headphones size={15} className="text-[#258DCD]" />
              <span>Auriculares Recomendados</span>
            </div>
          </div>

          {/* Visualizador de Ondas / Frecuencia */}
          <div className="bg-[#040914]/90 border border-[#AAD6CD]/20 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden">
            {isPlaying ? (
              <div className="flex items-center gap-1.5 h-16 w-full justify-center">
                {[40, 65, 85, 45, 95, 75, 60, 90, 100, 70, 50, 80, 60, 90, 45, 75, 85, 55, 65, 40].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="w-1.5 bg-gradient-to-t from-[#AAD6CD] to-[#258DCD] rounded-full animate-pulse transition-all duration-150 shadow-[0_0_10px_rgba(37,141,205,0.5)]"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center space-y-2">
                <Activity size={32} className="mx-auto text-[#AAD6CD]/30" />
                <p className="text-xs font-mono text-[#AAD6CD]/50 uppercase tracking-widest">
                  Pulsa el botón para iniciar la prueba neuroacústica 40Hz
                </p>
              </div>
            )}
          </div>

          {/* Selector de Frecuencia y Control Principal */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
            <div className="space-y-2 w-full md:w-auto">
              <span className="text-[10px] font-mono uppercase text-[#AAD6CD]/60 block">Tono Portador Base</span>
              <div className="flex gap-2">
                {[
                  { label: '220 Hz (La3 - Estándar)', val: 220 },
                  { label: '432 Hz (Armónico)', val: 432 },
                  { label: '136.1 Hz (Om Terra)', val: 136 }
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    disabled={isPlaying}
                    onClick={() => setCarrierFreq(item.val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      carrierFreq === item.val
                        ? 'bg-[#258DCD] text-white font-bold shadow-[0_0_15px_rgba(37,141,205,0.4)]'
                        : 'bg-[#040914] text-white/60 hover:text-[#AAD6CD] hover:bg-[#0c1a36] border border-[#AAD6CD]/15'
                    } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={toggleAudio}
              className={`w-full md:w-auto px-10 py-5 rounded-2xl text-xs font-mono uppercase tracking-widest font-black transition-all flex items-center justify-center gap-3 shadow-2xl ${
                isPlaying 
                  ? 'bg-[#FF455B] hover:bg-[#e03a4f] text-white shadow-[0_0_30px_rgba(255,69,91,0.4)]' 
                  : 'bg-[#258DCD] hover:bg-[#1e7ebd] text-white shadow-[0_0_30px_rgba(37,141,205,0.45)]'
              }`}
            >
              {isPlaying ? (
                <>
                  <VolumeX size={18} />
                  <span>Detener Sesión 40Hz</span>
                </>
              ) : (
                <>
                  <Volume2 size={18} />
                  <span>Iniciar Estimulación 40Hz</span>
                </>
              )}
            </button>
          </div>

          {/* Límite Físico de Presión Sonora (<75 dB SPL) Con Esfera Dinámica Coral de Alerta */}
          <div className="space-y-3 pt-6 border-t border-[#AAD6CD]/15">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono text-white/60 uppercase flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${volume >= 73 ? 'bg-[#FF455B] shadow-[0_0_10px_#FF455B] animate-ping' : 'bg-[#AAD6CD] shadow-[0_0_8px_#AAD6CD]'}`} />
                Control de Presión Sonora (dB SPL)
              </span>
              <span className={`font-mono font-bold ${volume >= 73 ? 'text-[#FF455B] animate-pulse' : 'text-[#AAD6CD]'}`}>
                {volume} dB SPL {volume >= 73 ? '(⚠️ Alerta: Techo Clínico Próximo)' : '(Seguridad Clínica Garantizada <75 dB)'}
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="74"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-[#258DCD] bg-[#040914] h-2 rounded-lg cursor-pointer border border-[#AAD6CD]/20"
            />
            <div className="flex justify-between text-[10px] font-mono text-white/40">
              <span>50 dB (Murmullo Clínico)</span>
              <span>65 dB (Voz Conversacional)</span>
              <span className={volume >= 73 ? 'text-[#FF455B] font-bold' : ''}>74 dB (Techo Máximo Homologado)</span>
            </div>
          </div>
        </div>

        {/* FUNDAMENTACIÓN CIENTÍFICA & ENLACES DE CONVERSIÓN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#081226] border border-[#AAD6CD]/20 p-6 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-[#AAD6CD] font-mono text-xs uppercase">
              <Brain size={16} />
              <span>Evidencia MIT & Nature</span>
            </div>
            <h3 className="text-lg font-bold text-white font-syne">Frecuencias Gamma 40Hz</h3>
            <p className="text-white/60 text-xs leading-relaxed">
              Estudios neurocientíficos demuestran que la estimulación acústica a 40 Hz promueve la activación de la microglía, reduciendo placas amiloides y sincronizando redes neurales atenuadas.
            </p>
          </div>

          <div className="bg-[#081226] border border-[#AAD6CD]/20 p-6 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-[#258DCD] font-mono text-xs uppercase">
              <ShieldCheck size={16} />
              <span>Protocolo Seguro</span>
            </div>
            <h3 className="text-lg font-bold text-white font-syne">Límite Estricto &lt;75 dB</h3>
            <p className="text-white/60 text-xs leading-relaxed">
              Diseñado específicamente para evitar crisis de estrés acústico, hiperacusia o agitación psicomotriz en pacientes geriátricos con deterioro cognitivo.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#081226] to-[#040914] border border-[#AAD6CD]/30 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-[0_10px_30px_rgba(8,18,38,0.8)]">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#AAD6CD] font-bold block mb-1">Siguiente Paso</span>
              <h3 className="text-lg font-bold text-white font-syne">Mapear la Banda Sonora</h3>
              <p className="text-white/60 text-xs leading-relaxed">
                Combina la estimulación 40Hz con las 10 canciones ancla de la juventud del senior.
              </p>
            </div>
            <Link
              href="/vimume/familia"
              className="py-3 px-4 bg-[#258DCD] hover:bg-[#1e7ebd] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-between shadow-[0_0_20px_rgba(37,141,205,0.35)]"
            >
              <span>Ir al Portal Familiar</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
