"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";

interface ThemeToggleProps {
  isVimumeContext?: boolean;
}

export default function ThemeToggle({ isVimumeContext = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pressStartTime = useRef<number>(0);

  const LONG_PRESS_DURATION = 3000; // 3 seconds

  const startPress = (e: React.PointerEvent) => {
    // Only respond to main click/touch
    if (e.button !== 0) return;
    
    setIsPressing(true);
    setProgress(0);
    pressStartTime.current = Date.now();

    // Start 3-second long-press timer
    timerRef.current = setTimeout(() => {
      triggerVibration();
      toggleTheme();
      endPress(true);
    }, LONG_PRESS_DURATION);

    // Track smooth progress bar rendering (100ms intervals)
    const step = 100;
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - pressStartTime.current;
      const pct = Math.min((elapsed / LONG_PRESS_DURATION) * 100, 100);
      setProgress(pct);
    }, step);
  };

  const endPress = (wasTriggeredByLongPress = false) => {
    setIsPressing(false);
    setProgress(0);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // If it was a quick touch/click (not held for 3 seconds), do an instant toggle
    if (!wasTriggeredByLongPress) {
      const elapsed = Date.now() - pressStartTime.current;
      if (elapsed < 500 && pressStartTime.current > 0) {
        toggleTheme();
      }
    }
    
    pressStartTime.current = 0;
  };

  const triggerVibration = () => {
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([100, 50, 100]); // S-Class double vibration pulse
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const isLightMode = theme === "light";

  // Compute adaptive styles
  const btnClass = isVimumeContext
    ? "border-black/10 bg-black/5 text-[#1a1a1a] hover:bg-black/10"
    : "border-white/10 bg-white/5 text-white hover:bg-white/10";

  return (
    <div className="relative inline-block select-none">
      <button
        onPointerDown={startPress}
        onPointerUp={() => endPress(false)}
        onPointerLeave={() => endPress(false)}
        onPointerCancel={() => endPress(false)}
        title="Pulsar para cambiar de tema / Mantener 3 segundos en móvil"
        className={`w-12 h-12 rounded-full border flex items-center justify-center relative overflow-hidden transition-all duration-300 active:scale-95 ${btnClass}`}
      >
        {/* Glow behind when pressing */}
        {isPressing && (
          <span className="absolute inset-0 bg-[#ecb613]/20 animate-pulse rounded-full" />
        )}

        {/* SVG Progress Circle for 3s Long Press */}
        {isPressing && (
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="#ecb613"
              strokeWidth="2"
              strokeDasharray="138"
              strokeDashoffset={138 - (138 * progress) / 100}
              className="transition-all duration-100 ease-out"
            />
          </svg>
        )}

        {/* Icons */}
        <div className="relative z-10">
          {isLightMode ? (
            <Sun className="w-5 h-5 text-[#ecb613] animate-spin-slow" />
          ) : (
            <Moon className="w-5 h-5 text-white" />
          )}
        </div>
      </button>

      {/* Secret Gestural Tooltip Hint */}
      {isPressing && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/90 border border-[#ecb613]/30 rounded-lg text-[8px] font-mono font-bold uppercase tracking-widest text-[#ecb613] whitespace-nowrap z-50 pointer-events-none animate-bounce">
          Hold {Math.max(3 - Math.floor((progress * 3) / 100), 1)}s to toggle
        </div>
      )}
    </div>
  );
}
