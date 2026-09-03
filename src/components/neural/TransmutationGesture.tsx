'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Compass, Radio } from 'lucide-react';

interface TransmutationGestureProps {
  currentMode: 'neural' | 'traditional';
  onToggleMode: () => void;
}

export default function TransmutationGesture({
  currentMode,
  onToggleMode
}: TransmutationGestureProps) {
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [touchPos, setTouchPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const targetMode = currentMode === 'neural' ? 'TRADICIONAL' : 'NEURAL';
  const REQUIRED_DURATION = 8000; // 8 segundos continuos

  const triggerHaptic = (pattern: number | number[]) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {}
    }
  };

  const startPress = (clientX: number, clientY: number) => {
    startTimeRef.current = Date.now();
    setTouchPos({ x: clientX, y: clientY });
    setIsPressing(true);
    setProgress(0);

    triggerHaptic(40); // feedback inicial

    let lastMilestone = 0;

    const updateLoop = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentProgress = Math.min((elapsed / REQUIRED_DURATION) * 100, 100);
      setProgress(currentProgress);

      // Micro-hápticos progresivos cada 2 segundos
      const secondsPassed = Math.floor(elapsed / 2000);
      if (secondsPassed > lastMilestone && secondsPassed < 4) {
        lastMilestone = secondsPassed;
        triggerHaptic([30, 20, 30]);
      }

      if (elapsed >= REQUIRED_DURATION) {
        // Transmutación completada
        triggerHaptic([100, 60, 200, 80, 300]);
        cancelPress();
        onToggleMode();
      } else {
        animFrameRef.current = requestAnimationFrame(updateLoop);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);
  };

  const cancelPress = () => {
    setIsPressing(false);
    setProgress(0);
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const t = e.touches[0];
        startPress(t.clientX, t.clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isPressing) {
        const t = e.touches[0];
        const dist = Math.sqrt(
          Math.pow(t.clientX - touchPos.x, 2) + Math.pow(t.clientY - touchPos.y, 2)
        );
        // Si el usuario arrastra más de 25px, se cancela para permitir scroll nativo
        if (dist > 25) {
          cancelPress();
        }
      }
    };

    const handleTouchEnd = () => {
      cancelPress();
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      cancelPress();
    };
  }, [isPressing, touchPos, currentMode]);

  if (!isPressing) return null;

  const secondsRemaining = Math.max(0, ((REQUIRED_DURATION * (1 - progress / 100)) / 1000)).toFixed(1);
  const circumference = 2 * Math.PI * 48; // radio = 48
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="flex flex-col items-center gap-5 p-8 rounded-3xl bg-black/85 border border-white/15 shadow-[0_0_80px_rgba(236,182,19,0.3)] text-center max-w-xs mx-4">
        {/* Anillo de Carga Radial Cinemático */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            {/* Círculo Base */}
            <circle
              cx="64"
              cy="64"
              r="48"
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="4"
            />
            {/* Círculo Progreso */}
            <circle
              cx="64"
              cy="64"
              r="48"
              fill="none"
              stroke="#ecb613"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-[stroke-dashoffset] duration-75 ease-linear"
            />
          </svg>

          {/* Icono Central e Indicador de Segundos */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Radio size={20} className="text-[#ecb613] animate-pulse mb-1" />
            <span className="text-xl font-bold font-mono text-white tracking-tight">
              {secondsRemaining}s
            </span>
          </div>
        </div>

        {/* Textos Tácticos de Protocolo */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-bold">
            <Sparkles size={12} />
            <span>TRANSMUTACIÓN ACTIVA</span>
          </div>
          <h4 className="text-sm font-bold text-white tracking-tight">
            CAMBIANDO A MODO {targetMode}
          </h4>
          <p className="text-[11px] text-zinc-400 font-mono leading-relaxed">
            Mantén presionado {secondsRemaining}s para reconfigurar la arquitectura de navegación.
          </p>
        </div>
      </div>
    </div>
  );
}
