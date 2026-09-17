'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Activity, Gauge, AudioWaveform, ShieldCheck } from 'lucide-react';
import { VIMUME_SENIOR_SSOT } from '@/lib/vimume/vimumePatientEngine';

interface VimumeOscilloscope40HzProps {
  className?: string;
  live?: boolean;
}

/**
 * 🔬 VIMUME OSCILOSCOPIO 40 Hz GAMMA
 * Visualización reactiva con Web Audio. Pinta la onda gamma de estimulación
 * neuroacústica a 40 Hz y refuerza visualmente el limitador acústico < 75 dB SPL.
 */
export default function VimumeOscilloscope40Hz({
  className = '',
  live = true
}: VimumeOscilloscope40HzProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>(0);
  const [rmsLevel, setRmsLevel] = useState<number>(0);
  const [phase, setPhase] = useState<number>(0);
  const [audioBooted, setAudioBooted] = useState<boolean>(false);

  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let oscillator: OscillatorNode | null = null;
    let gainNode: GainNode | null = null;
    let analyser: AnalyserNode | null = null;
    let dataArray: Uint8Array<ArrayBuffer> | null = null;

    const bootAudio = async () => {
      if (audioBooted || typeof window === 'undefined') return;
      try {
        audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.82;

        if (live) {
          // Tono gamma de referencia a 40 Hz (nivel seguro, no audible en exceso).
          oscillator = audioContext.createOscillator();
          gainNode = audioContext.createGain();
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(VIMUME_SENIOR_SSOT.GAMMA_FREQUENCY_HZ, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime); // silencio de calibración
          oscillator.connect(gainNode);
          gainNode.connect(analyser);
          oscillator.start();
        } else {
          // Osciloscopio pasivo: solo dibuja la portadora matemática de 40 Hz.
        }

        dataArray = new Uint8Array(analyser.fftSize);
        analyserRef.current = analyser;
        setAudioBooted(true);
      } catch {
        setAudioBooted(false);
      }
    };

    bootAudio();

    return () => {
      cancelAnimationFrame(animationRef.current);
      if (oscillator) {
        try {
          oscillator.stop();
        } catch {
          //
        }
      }
      if (audioContext) {
        void audioContext.close().catch(() => undefined);
      }
    };
  }, [live, audioBooted]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const analyser = analyserRef.current;
      const timeData = analyser ? new Uint8Array(analyser.fftSize) : null;
      if (analyser && timeData) {
        analyser.getByteTimeDomainData(timeData);
      }

      // Rejilla OLED
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.06)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 28) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Línea central
      ctx.strokeStyle = 'rgba(236, 182, 19, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Onda gamma 40 Hz
      const mid = height / 2;
      const amplitude = height * 0.36;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 2) {
        const t = x / width;
        const liveSample = timeData
          ? (timeData[Math.floor((x / width) * (timeData.length - 1))] - 128) / 128
          : 0;
        const carrier = Math.sin(2 * Math.PI * VIMUME_SENIOR_SSOT.GAMMA_FREQUENCY_HZ * t * 0.08 + phase);
        const signal = analyser && live ? liveSample : carrier;
        const y = mid - signal * amplitude;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = '#00E5FF';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(0, 229, 255, 0.55)';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Nivel RMS estimado
      if (analyser && timeData) {
        let sum = 0;
        for (let i = 0; i < timeData.length; i++) {
          const v = (timeData[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / timeData.length);
        setRmsLevel(Math.min(100, Math.round(rms * 400)));
        setPhase((p) => p + 0.02);
      } else {
        setPhase((p) => p + 0.02);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationRef.current);
  }, [phase, live]);

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-[#8b5cf6]/25 bg-[#030305] p-5 text-white ${className}`}>
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#8b5cf6]/10 blur-[100px] pointer-events-none" />
      <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30">
            <AudioWaveform className="w-5 h-5 text-[#00E5FF]" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#00E5FF] font-bold">
              Osciloscopio Neuroacústico
            </p>
            <h4 className="text-2xl font-black font-syne tracking-tight">40 Hz GAMMA</h4>
          </div>
        </div>

        <div className="flex items-center gap-2 text-right">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-mono font-bold text-emerald-300">
              LIMITADOR ≤ {VIMUME_SENIOR_SSOT.MAX_SPL_DB} dB SPL
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 pt-5 items-center">
        <canvas
          ref={canvasRef}
          width={840}
          height={220}
          className="w-full h-auto rounded-2xl bg-black/60 border border-white/10"
          aria-label="Visualización de onda gamma a 40 Hz"
        />

        <div className="flex flex-row md:flex-col gap-4 md:gap-6">
          <MetricRing value={rmsLevel} label="Nivel RMS" accent="#00E5FF" />
          <MetricRing value={VIMUME_SENIOR_SSOT.GAMMA_FREQUENCY_HZ / 0.55} label="Portadora" accent="#8b5cf6" />
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap gap-3 pt-5 text-[10px] font-mono text-zinc-500">
        <span className="inline-flex items-center gap-2">
          <Gauge className="w-3.5 h-3.5 text-[#ecb613]" />
          {audioBooted ? 'WEB AUDIO ACTIVO' : 'MODO MATEMÁTICO PASIVO'}
        </span>
        <span className="inline-flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          PORTADORA {VIMUME_SENIOR_SSOT.GAMMA_FREQUENCY_HZ} HZ // ICOPE NO FARMACOLÓGICO
        </span>
      </div>
    </div>
  );
}

function MetricRing({ value, label, accent }: { value: number; label: string; accent: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="flex flex-row md:flex-col items-center gap-2">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke={accent}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 120ms linear' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-white">
          {Math.round(clamped)}%
        </span>
      </div>
      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">{label}</span>
    </div>
  );
}