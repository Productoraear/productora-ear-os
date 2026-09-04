'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Square, 
  Headphones, 
  Speaker, 
  Volume2, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Radio, 
  Zap,
  Sliders,
  Info
} from 'lucide-react';
import { VimumeNeuroacousticEngine, AcousticEngineState } from '@/core/audio/GammaWorklet';
import { AcousticVisualizer } from '@/components/vimume/AcousticVisualizer';

export const VimumeAcousticEngine: React.FC = () => {
  const [engineState, setEngineState] = useState<AcousticEngineState>({
    isPlaying: false,
    frequency: 40.0,
    carrierFrequency: 216.0,
    mode: 'combined',
    volume: 0.65,
    currentSplDb: 32.0,
    peakSplDb: 71.4,
    isLimiterEngaged: false
  });

  const [hasStartedOnce, setHasStartedOnce] = useState(false);

  useEffect(() => {
    const engine = VimumeNeuroacousticEngine.getInstance();
    const unsubscribe = engine.subscribe((state) => {
      setEngineState(state);
    });
    return () => unsubscribe();
  }, []);

  const handleTogglePlay = async () => {
    const engine = VimumeNeuroacousticEngine.getInstance();
    if (engineState.isPlaying) {
      engine.stop();
    } else {
      setHasStartedOnce(true);
      await engine.start(engineState.mode);
    }
  };

  const handleModeChange = (mode: 'isochronic' | 'binaural' | 'combined') => {
    const engine = VimumeNeuroacousticEngine.getInstance();
    engine.setMode(mode);
  };

  const handleCarrierChange = (freq: number) => {
    const engine = VimumeNeuroacousticEngine.getInstance();
    engine.setCarrierFrequency(freq);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    const engine = VimumeNeuroacousticEngine.getInstance();
    engine.setVolume(vol);
  };

  return (
    <div className="rounded-[2.5rem] bg-gradient-to-b from-[#0c0a17] via-[#07060f] to-[#040407] border border-[#8b5cf6]/40 p-6 sm:p-10 space-y-8 shadow-[0_0_80px_rgba(139,92,246,0.15)] relative overflow-hidden">
      {/* Glow ambiental */}
      <div className="absolute -top-24 right-0 w-96 h-96 bg-[#8b5cf6]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 left-0 w-96 h-96 bg-[#AAD6CD]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header & Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8b5cf6]/15 border border-[#8b5cf6]/40 text-[#8b5cf6] text-[10px] font-mono tracking-widest uppercase font-bold">
            <Radio size={13} className="animate-pulse" />
            <span>MOTOR NEUROACÚSTICO MULTIHILO // AUDIOWORKLET DSP</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-black uppercase text-white font-syne tracking-tight">
            Laboratorio Acústico <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] via-[#AAD6CD] to-[#ecb613]">Gamma 40 Hz</span>
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-2xl leading-relaxed">
            Experimenta en tu navegador el estímulo sonoro de grado clínico. Generamos algorítmicamente tonos puros entrelazados con modulación a 40 Hz y calibración de presión sonora infranqueable (&lt; 75 dB SPL).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleTogglePlay}
            className={`px-8 py-4 rounded-2xl font-mono text-xs uppercase font-black tracking-widest flex items-center gap-3 transition-all cursor-pointer shadow-xl ${
              engineState.isPlaying
                ? 'bg-red-500/20 text-red-300 border border-red-500/50 hover:bg-red-500/30'
                : 'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white hover:scale-105 shadow-[0_0_35px_rgba(139,92,246,0.6)] animate-pulse'
            }`}
          >
            {engineState.isPlaying ? (
              <>
                <Square size={16} className="fill-current text-red-400" />
                <span>Detener Estímulo</span>
              </>
            ) : (
              <>
                <Play size={16} className="fill-current" />
                <span>Iniciar Demo Sensorial 40Hz</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Osciloscopio + Controles DSP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Columna Izquierda: Osciloscopio y Sonómetro en Vivo (7 cols) */}
        <div className="lg:col-span-7">
          <AcousticVisualizer className="h-full flex flex-col justify-between" />
        </div>

        {/* Columna Derecha: Consola de Parámetros DSP (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-black/60 border border-white/10 p-6 space-y-6 flex flex-col justify-between">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono text-zinc-400 flex items-center gap-2 uppercase font-bold">
                <Sliders size={14} className="text-[#8b5cf6]" />
                Topología de Emisión
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                DSP ACTIVO
              </span>
            </div>

            {/* Selector de Modo */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
                Modo de Generación:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleModeChange('combined')}
                  className={`p-2.5 rounded-xl border text-[10px] font-mono font-bold uppercase transition-all text-center ${
                    engineState.mode === 'combined'
                      ? 'bg-[#8b5cf6] text-white border-[#8b5cf6] shadow-md shadow-[#8b5cf6]/30'
                      : 'bg-white/[0.02] text-zinc-400 border-white/10 hover:border-white/30'
                  }`}
                >
                  <Sparkles size={13} className="mx-auto mb-1" />
                  <span>S-Class</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleModeChange('binaural')}
                  className={`p-2.5 rounded-xl border text-[10px] font-mono font-bold uppercase transition-all text-center ${
                    engineState.mode === 'binaural'
                      ? 'bg-[#AAD6CD] text-black border-[#AAD6CD] shadow-md shadow-[#AAD6CD]/30'
                      : 'bg-white/[0.02] text-zinc-400 border-white/10 hover:border-white/30'
                  }`}
                >
                  <Headphones size={13} className="mx-auto mb-1" />
                  <span>Binaural</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleModeChange('isochronic')}
                  className={`p-2.5 rounded-xl border text-[10px] font-mono font-bold uppercase transition-all text-center ${
                    engineState.mode === 'isochronic'
                      ? 'bg-[#ecb613] text-black border-[#ecb613] shadow-md shadow-[#ecb613]/30'
                      : 'bg-white/[0.02] text-zinc-400 border-white/10 hover:border-white/30'
                  }`}
                >
                  <Speaker size={13} className="mx-auto mb-1" />
                  <span>Isocrónico</span>
                </button>
              </div>
            </div>

            {/* Selector de Frecuencia Portadora */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
                Frecuencia Base (Armónico Tenor):
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { freq: 216, label: '216 Hz (A3 Calibrada)' },
                  { freq: 432, label: '432 Hz (Pitagórica)' },
                  { freq: 528, label: '528 Hz (Bio-Resonancia)' }
                ].map((item) => (
                  <button
                    key={item.freq}
                    type="button"
                    onClick={() => handleCarrierChange(item.freq)}
                    className={`py-2 px-2 rounded-xl border text-[10px] font-mono font-bold transition-all text-center ${
                      engineState.carrierFrequency === item.freq
                        ? 'bg-white/15 text-white border-white/40'
                        : 'bg-white/[0.02] text-zinc-500 border-white/5 hover:border-white/20'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider de Ganancia / SPL */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-zinc-400 uppercase font-bold">Volumen / Potencia Sonora:</span>
                <span className="text-[#8b5cf6] font-bold">{Math.round(engineState.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={engineState.volume}
                onChange={handleVolumeChange}
                className="w-full accent-[#8b5cf6] cursor-pointer"
              />
            </div>
          </div>

          {/* Nota Clínica */}
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-start gap-3">
            <Info size={16} className="text-[#AAD6CD] shrink-0 mt-0.5" />
            <p className="text-[11px] text-zinc-400 leading-snug">
              <strong className="text-white font-mono">Prescripción Acústica:</strong> Si usas auriculares, el modo Binaural estimula cada hemisferio independientemente (Δf = 40 Hz). En altavoces institucionales Bose S1 Pro / F1 812, el pulso Isocrónico garantiza arrastre neural a cualquier distancia sin depender de balance estéreo.
            </p>
          </div>

        </div>

      </div>

      {/* Footer Banner: Protección y Protocolo Bose */}
      <div className="p-4 rounded-2xl bg-[#ecb613]/5 border border-[#ecb613]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-2.5 text-zinc-300">
          <ShieldCheck size={18} className="text-[#ecb613] shrink-0" />
          <span>Arreglos Acústicos Bose a 12 W/pax • Ponderación A calibrada &lt; 75 dB SPL • Certificado SHA-256</span>
        </div>
        <span className="text-[#ecb613] font-bold shrink-0">
          ESTÁNDAR GERIÁTRICO ACREDITADO
        </span>
      </div>

    </div>
  );
};
