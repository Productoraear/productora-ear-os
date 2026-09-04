'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, ShieldAlert, ShieldCheck, Activity, Radio, Cpu } from 'lucide-react';
import { VimumeNeuroacousticEngine, AcousticEngineState } from '@/core/audio/GammaWorklet';

interface AcousticVisualizerProps {
  className?: string;
  showDetails?: boolean;
}

export const AcousticVisualizer: React.FC<AcousticVisualizerProps> = ({
  className = '',
  showDetails = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
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

  useEffect(() => {
    const engine = VimumeNeuroacousticEngine.getInstance();
    const unsubscribe = engine.subscribe((state) => {
      setEngineState(state);
    });

    const canvas = canvasRef.current;
    if (!canvas) return unsubscribe;
    const ctx = canvas.getContext('2d');
    if (!ctx) return unsubscribe;

    // Buffer temporal para animación fluida
    const dataArray = new Uint8Array(1024);
    let phaseOffset = 0;

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      const width = canvas.width;
      const height = canvas.height;

      // Limpiar lienzo con efecto de estela fosfórica oscura
      ctx.fillStyle = 'rgba(5, 5, 8, 0.35)';
      ctx.fillRect(0, 0, width, height);

      const analyser = engine.getAnalyser();

      // Cuadrícula médica / osciloscópica sutil
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridStepX = width / 10;
      const gridStepY = height / 6;
      for (let x = 0; x <= width; x += gridStepX) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += gridStepY) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Línea central de referencia
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      if (analyser && engineState.isPlaying) {
        analyser.getByteTimeDomainData(dataArray);
      } else {
        // Onda suave de stand-by (latido basal a 40 Hz simulado)
        phaseOffset += 0.035;
        for (let i = 0; i < 1024; i++) {
          const mod = Math.sin(phaseOffset * 2.5);
          dataArray[i] = 128 + Math.sin(i * 0.03 + phaseOffset) * (8 + mod * 4);
        }
      }

      // Dibujar trazo del osciloscopio con degradado Ice Cyan -> Violeta Neón
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, '#AAD6CD');     // Ice Cyan
      gradient.addColorStop(0.5, '#8b5cf6');   // Neon Violet
      gradient.addColorStop(1, '#ecb613');     // Gold Accent

      ctx.lineWidth = engineState.isPlaying ? 2.5 : 1.5;
      ctx.strokeStyle = gradient;
      ctx.shadowColor = engineState.isPlaying ? 'rgba(139, 92, 246, 0.65)' : 'transparent';
      ctx.shadowBlur = engineState.isPlaying ? 12 : 0;

      ctx.beginPath();
      const sliceWidth = width / dataArray.length;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow para rendimiento
    };

    render();

    return () => {
      unsubscribe();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [engineState.isPlaying]);

  return (
    <div className={`rounded-3xl bg-[#06060a] border border-[#8b5cf6]/30 p-5 sm:p-7 space-y-5 relative overflow-hidden shadow-[0_0_60px_rgba(139,92,246,0.12)] ${className}`}>
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#8b5cf6]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#AAD6CD]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className={`w-3 h-3 rounded-full ${engineState.isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-zinc-600'}`} />
          <span className="font-mono text-xs uppercase font-bold tracking-widest text-zinc-300">
            Osciloscopio DSP // 40.00 Hz Gamma Realtime
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#AAD6CD] font-bold">
            Carrier: {engineState.carrierFrequency.toFixed(0)} Hz
          </span>
          <span className={`px-2.5 py-1 rounded-full border font-bold ${
            engineState.currentSplDb >= 74.5
              ? 'bg-red-500/20 border-red-500 text-red-400'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}>
            SPL: {engineState.currentSplDb.toFixed(1)} dB (&lt;75 dB)
          </span>
        </div>
      </div>

      {/* Canvas Osciloscopio 60 FPS */}
      <div className="relative w-full h-40 sm:h-48 rounded-2xl overflow-hidden bg-black/80 border border-white/10 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={800}
          height={200}
          className="w-full h-full object-cover"
        />

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
          <span className="px-2 py-0.5 rounded bg-black/70 border border-white/10 text-[9px] font-mono text-zinc-400">
            TIME DOMAIN (2048 SAMPLES)
          </span>
        </div>

        <div className="absolute bottom-3 right-3 flex items-center gap-2 pointer-events-none">
          <span className="px-2.5 py-1 rounded-md bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 text-[#8b5cf6] text-[10px] font-mono font-bold tracking-wider">
            Δf = 40.0 Hz [MIT PICOWER]
          </span>
        </div>
      </div>

      {/* Sonómetro & VU Meter Bar */}
      {showDetails && (
        <div className="space-y-2 pt-1">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Activity size={13} className="text-[#AAD6CD]" />
              Presión Acústica en Sala (Leq, A-Weighting):
            </span>
            <span className="font-bold text-white">
              {engineState.currentSplDb.toFixed(1)} <span className="text-zinc-500 text-[10px]">/ 75.0 dB SPL MAX</span>
            </span>
          </div>

          {/* Barra VU con marcas de seguridad */}
          <div className="w-full bg-zinc-900 h-3.5 rounded-full overflow-hidden relative p-0.5 border border-white/10">
            {/* Porcentaje normalizado de 30 dB a 80 dB */}
            <div
              className={`h-full rounded-full transition-all duration-150 ${
                engineState.currentSplDb >= 74.5
                  ? 'bg-gradient-to-r from-emerald-500 via-yellow-400 to-red-500'
                  : 'bg-gradient-to-r from-emerald-500 via-[#AAD6CD] to-[#8b5cf6]'
              }`}
              style={{
                width: `${Math.min(100, Math.max(8, ((engineState.currentSplDb - 30) / (80 - 30)) * 100))}%`
              }}
            />
            {/* Marcador inmutable de límite 75 dB */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 shadow-[0_0_8px_#ef4444]"
              style={{ left: `${((75 - 30) / (80 - 30)) * 100}%` }}
              title="Corte Clínico Inviolable: 75 dB SPL"
            />
          </div>

          <div className="flex justify-between text-[9px] font-mono text-zinc-500">
            <span>30 dB (Reposo)</span>
            <span className="text-emerald-400 font-bold">65 - 72 dB (Zona Terapéutica Óptima)</span>
            <span className="text-red-400 font-bold">75 dB (Limitador Brickwall DSP)</span>
          </div>
        </div>
      )}
    </div>
  );
};
