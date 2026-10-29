'use client';

import React from 'react';
import { useTheme } from '@/app/context/ThemeContext';
import { Moon, Flame } from 'lucide-react';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * TOGGLE FLOTANTE DE DISEÑO — SOLO ENTORNO DE PRUEBAS
 * ════════════════════════════════════════════════════════════════════════════
 * El diseño ya NO se cambia con botones visibles: el gesto soberano es mantener
 * pulsada 5 s la portada del dock móvil (`SovereignMobileHUD`).
 *
 * Este componente queda como utensilio de QA (comparativa OLED S-Class vs
 * Airbnb Test) y devuelve `null` en producción salvo habilitación expresa:
 *   NEXT_PUBLIC_EAR_THEME_SELECTOR=1
 * Así ninguna ruta comercial puede mostrar el selector al cliente final.
 * ════════════════════════════════════════════════════════════════════════════
 */
const THEME_SELECTOR_ENABLED =
  process.env.NODE_ENV !== 'production' ||
  process.env.NEXT_PUBLIC_EAR_THEME_SELECTOR === '1';

/** Punto de corte único del escritorio: mismo breakpoint `lg` de Tailwind (1024px). */
const DESKTOP_MEDIA_QUERY = '(min-width: 1024px)';

export const AirbnbThemeToggleFloating: React.FC = () => {
  const { setTheme, isAirbnb } = useTheme();
  // Doble cerrojo (JS + CSS): el selector QA no debe existir en móvil ni siquiera
  // en el DOM, porque a z-[45] competía con el dock soberano en la base del viewport.
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const sync = (event: MediaQueryListEvent | MediaQueryList) => setIsDesktop(event.matches);
    sync(media);
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  // Fuera del entorno de pruebas o por debajo de 1024px: no se pinta nada en el DOM.
  if (!THEME_SELECTOR_ENABLED || !isDesktop) return null;

  return (
    <aside
      aria-label="Selector de diseño experimental"
      data-ear-surface="theme-toggle-qa"
      className="hidden lg:block fixed bottom-6 left-6 z-[45] pointer-events-auto"
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

