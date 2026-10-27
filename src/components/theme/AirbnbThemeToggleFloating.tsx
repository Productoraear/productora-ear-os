'use client';

import React from 'react';
import { useTheme } from '@/app/context/ThemeContext';
import { Sparkles, Moon, Sun, Flame } from 'lucide-react';

export const AirbnbThemeToggleFloating: React.FC = () => {
  const { theme, setTheme, isAirbnb } = useTheme();

  return (
    <aside 
      aria-label="Selector de diseño experimental"
      className="fixed bottom-6 left-6 z-[9999] pointer-events-auto"
    >
      <div className="flex items-center gap-2 p-1.5 rounded-full bg-white/95 text-[#222222] shadow-[0_8px_30px_rgba(0,0,0,0.22)] border border-[#EBEBEB] backdrop-blur-md transition-all hover:scale-105">
        
        {/* BOTÓN MODO OLED */}
        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            !isAirbnb
              ? 'bg-[#030305] text-white shadow-sm'
              : 'text-[#484848] hover:text-[#222222]'
          }`}
          title="Activar diseño Canónico OLED S-Class"
        >
          <Moon size={13} className={!isAirbnb ? 'text-[#ecb613]' : ''} />
          <span>OLED S-Class</span>
        </button>

        {/* BOTÓN MODO AIRBNB */}
        <button
          type="button"
          onClick={() => setTheme('airbnb')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            isAirbnb
              ? 'bg-gradient-to-r from-[#D91E3F] via-[#C2185B] to-[#B00354] text-white shadow-sm'
              : 'text-[#484848] hover:text-[#222222]'
          }`}
          title="Activar diseño Experimental Frontend Airbnb"
        >
          <Flame size={13} className={isAirbnb ? 'text-white' : 'text-[#C2185B]'} />
          <span>Airbnb Test</span>
        </button>

      </div>
    </aside>
  );
};
