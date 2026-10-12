"use client";

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isLightMode, setIsLightMode] = useState(true);

  useEffect(() => {
    // Leer preferencia guardada (default: light)
    const savedTheme = localStorage.getItem('ear-theme');
    if (savedTheme === 'dark') {
      setIsLightMode(false);
      document.documentElement.classList.remove('light-mode');
      document.documentElement.classList.add('dark');
    } else {
      setIsLightMode(true);
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isLightMode) {
      document.documentElement.classList.remove('light-mode');
      document.documentElement.classList.add('dark');
      localStorage.setItem('ear-theme', 'dark');
      setIsLightMode(false);
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('ear-theme', 'light');
      setIsLightMode(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all duration-200 flex items-center gap-2 text-xs font-mono cursor-pointer shadow-lg"
      aria-label="Cambiar entre modo oscuro y modo día"
      title="Cambiar entre modo oscuro y modo día de alto contraste"
    >
      {isLightMode ? (
        <>
          <Moon size={15} className="text-[#00E5FF]" />
          <span className="hidden sm:inline">Modo OLED</span>
        </>
      ) : (
        <>
          <Sun size={15} className="text-[#ecb613]" />
          <span className="hidden sm:inline">Modo Día</span>
        </>
      )}
    </button>
  );
}
