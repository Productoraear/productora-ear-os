'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  ArrowRight,
  Building2,
  Calculator,
  ChevronDown,
  Compass,
  Handshake,
  Home,
  Menu,
  MessageCircle,
  Music,
  Phone,
  Search,
  ShieldCheck,
  Sliders,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { useSharedContext } from '@/app/context/SharedContext';
import { useTheme } from '@/app/context/ThemeContext';
import { useSovereignRole } from '@/shared/hooks/useSovereignRole';
import { playHapticClick } from '@/lib/audio/AuraAudioSynth';
import {
  MENU_FOLDERS,
  MOBILE_MENU_EVENT,
  SPOTLIGHT_LINKS,
  type SpotlightAccent,
} from '@/lib/config/sovereign-navigation';
import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';
import { cn } from '@/lib/utils';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SOVEREIGN MOBILE HUD v2 — ÚNICA superficie de navegación móvil de EAR OS.
 *
 * Antes existían 9 barras flotantes compitiendo por el mismo píxel (dock HUD,
 * EarBottomNav, SovereignBottomNav, call bar, urgencias, WhatsApp, Astra,
 * OmniAgent, theme toggle). Ahora hay UNA: 1 dock + 1 panel exclusivo.
 *
 * ESCALERA Z (única y documentada):
 *   backdrop = 60 · panel = 70 · dock = 80 · SovereignNavbar (top) = 100
 *
 * Reglas duras:
 *   · Estado `sheet` único ⇒ es imposible que un menú tape a otro.
 *   · El dock NUNCA queda sepultado: el panel se ancla 5rem + safe-area arriba.
 *   · Todo disparador es <button type="button"> o <Link>; cero divs clicables.
 *   · Todos los hooks se ejecutan antes de cualquier return (Rules of Hooks).
 * ═══════════════════════════════════════════════════════════════════════════════
 */

type MobileRole = 'B2G' | 'B2C' | 'ARTISTA' | 'PROVIDER';
type SheetId = 'menu' | 'contact' | 'cockpit';

interface QuickAction {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface RoleInsight {
  title: string;
  badge: string;
  badgeClass: string;
  ticket: string;
  split: string;
  summary: string;
  keyAction: string;
  actionHref: string;
}

const SHEET_TITLES: Record<SheetId, string> = {
  menu: 'Menú de navegación',
  contact: 'Contacto directo',
  cockpit: 'Oráculo Astra',
};

const TEL_HREF = `tel:${CENTRALITA_EAR_OS.replace(/[^\d+]/g, '')}`;

const waLink = (text: string) =>
  `https://wa.me/34693693048?text=${encodeURIComponent(text)}`;

const SPOTLIGHT_STYLES: Record<SpotlightAccent, string> = {
  gold: 'border-[#ecb613]/30 bg-[#ecb613]/10 text-[#ecb613]',
  ruby: 'border-[#FF2B44]/30 bg-[#FF2B44]/10 text-[#FF2B44]',
  cyan: 'border-[#00E5FF]/30 bg-[#00E5FF]/10 text-[#00E5FF]',
};

const ROLE_INSIGHTS: Record<MobileRole, RoleInsight> = {
  B2G: {
    title: 'Instituciones & FITUR 2026',
    badge: 'Contrato Menor Art. 118 LCSP',
    badgeClass: 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/30',
    ticket: '< 14.250 € (Sin Concurso)',
    split: 'E-Manager + 8 Mentorías Diáspora',
    summary:
      'Rider técnico homologado Bose F1 (<75 dB SPL) para recepciones oficiales y festejos con limitador telemático.',
    keyAction: 'Ver Protocolo B2G',
    actionHref: '/b2g',
  },
  B2C: {
    title: 'Parejas & Bodas S-Class',
    badge: 'Solista Edwin Agudelo',
    badgeClass: 'bg-[#ecb613]/20 text-[#ecb613] border-[#ecb613]/30',
    ticket: 'Desde 350,00 € Base',
    split: 'Split Soberano 80/10/10',
    summary:
      'Sonorización profesional Bose F1 y microfonía de estudio. Bloqueo de fecha inmediato con depósito deducible.',
    keyAction: 'Explorar Matcher',
    actionHref: '/bodas/parejas',
  },
  ARTISTA: {
    title: 'Artistas & Roster Diáspora',
    badge: 'Gobernanza Soberana',
    badgeClass: 'bg-[#FF2B44]/20 text-[#FF2B44] border-[#FF2B44]/30',
    ticket: 'Split 80% Artista Directo',
    split: '10% EAR OS / 10% VIMUME',
    summary:
      'Protección contra intermediarios abusivos. Asignación de microfonía Shure Axient y liquidación inmediata.',
    keyAction: 'Consultar Condiciones Roster',
    actionHref: '/artistas',
  },
  PROVIDER: {
    title: 'Fincas & Proveedores de Red',
    badge: 'Red Territorial Homologada',
    badgeClass: 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/30',
    ticket: '10% Comisión Transparente',
    split: 'Póliza RC 1.000.000 €',
    summary:
      'Sincronización técnica directa con bodas y eventos. Radar en vivo de horas muertas para alianzas B2B.',
    keyAction: 'Área de Proveedor',
    actionHref: '/bodas/proveedor',
  },
};

const ROLE_LABELS: Record<MobileRole, { name: string; icon: LucideIcon }> = {
  B2G: { name: 'FITUR B2G', icon: Building2 },
  B2C: { name: 'Bodas', icon: Users },
  ARTISTA: { name: 'Artistas', icon: Music },
  PROVIDER: { name: 'Proveedor', icon: Compass },
};

/** Título de menú sin el paréntesis de métricas (el dato va en el badge). */
const cleanTitle = (title: string) => title.replace(/\s*\([^)]*\)\s*$/, '').trim();

const dockItemClass = (active: boolean) =>
  cn(
    'flex min-h-[56px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-1',
    'font-mono text-[9px] font-bold uppercase tracking-wider touch-manipulation select-none',
    'transition-all duration-300 ease-out active:scale-95',
    active ? 'bg-white/10 text-[#ecb613]' : 'text-zinc-400 hover:text-white'
  );

/**
 * GESTO OCULTO DE DISEÑO — pulsación sostenida exacta sobre la portada del dock.
 * No existe botón visible de tema: el operador mantiene 5 s y el HUD alterna
 * entre el tema canónico OLED S-Class y el tema experimental Airbnb.
 */
const LONG_PRESS_MS = 5000;

const sheetVariants: Variants = {
  hidden: { y: '110%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', damping: 30, stiffness: 300 },
  },
  exit: { y: '110%', opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } },
};

export const SovereignMobileHUD: React.FC = React.memo(function SovereignMobileHUD() {
  const pathname = usePathname() || '/';
  const { setIsSearchOpen } = useSharedContext();
  const { setTheme, isAirbnb } = useTheme();
  const { isAdmin } = useSovereignRole();

  /**
   * El gesto de diseño queda RESERVADO a operadores: sesión admin (/admin, /panel)
   * o sandbox QA con `NEXT_PUBLIC_EAR_THEME_SELECTOR=1`. El cliente final no puede
   * cambiar el tema ni por accidente ni manteniendo pulsado el dock: cero rastro
   * visible de selector de diseño en las hojas del menú (verificado por auditor).
   */
  const canToggleTheme =
    isAdmin || process.env.NEXT_PUBLIC_EAR_THEME_SELECTOR === '1';

  const [sheet, setSheet] = useState<SheetId | null>(null);
  const [roleOverride, setRoleOverride] = useState<MobileRole | null>(null);
  const [openFolder, setOpenFolder] = useState<string | null>(null);

  // ─── GESTO OCULTO 5 s (sin botones visibles de diseño) ─────────────────────
  // El temporizador vive en un ref: cero re-renders por tick y cancelación limpia.
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressFired = useRef(false);

  const clearLongPress = useCallback(() => {
    if (longPressTimer.current !== null) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const startLongPress = useCallback(() => {
    // Sin potestad de diseño no se arma el temporizador: la pulsación sigue
    // navegando con normalidad y nadie queda atrapado 5 s en un gesto vacío.
    if (!canToggleTheme) return;
    clearLongPress();
    longPressFired.current = false;
    longPressTimer.current = setTimeout(() => {
      longPressTimer.current = null;
      longPressFired.current = true;
      playHapticClick(900, 0.05);
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate([80, 40, 80]);
      }
      setTheme(isAirbnb ? 'dark' : 'airbnb');
    }, LONG_PRESS_MS);
  }, [canToggleTheme, clearLongPress, isAirbnb, setTheme]);

  const handleHomeClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      // Si el gesto de 5 s ya se consumió, la pulsación NO navega: alterna el tema.
      if (longPressFired.current) {
        event.preventDefault();
        longPressFired.current = false;
        return;
      }
      clearLongPress();
      playHapticClick(700, 0.02);
    },
    [clearLongPress]
  );

  // Ningún temporizador sobrevive al desmontaje del dock.
  useEffect(() => clearLongPress, [clearLongPress]);

  // 🧭 DETECCIÓN CONTEXTUAL ESTRICTA DE LA VERTICAL (CERO CONTAMINACIÓN CRUZADA)
  const isNovios =
    pathname.startsWith('/bodas') ||
    pathname.startsWith('/reservar') ||
    pathname.startsWith('/mobile-fusion') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/matcher');
  const isArtistas = pathname.startsWith('/artistas');
  const isFincas = pathname.startsWith('/fincas') || pathname.startsWith('/fincasparaboda');
  const isProveedor =
    pathname.startsWith('/bodas/proveedor') ||
    pathname.startsWith('/proveedores') ||
    pathname.startsWith('/arsenal');
  const isB2G =
    pathname.startsWith('/b2g') ||
    pathname.startsWith('/instituciones') ||
    pathname.startsWith('/ocasiones');

  // Un solo acento por vista (Taste Engine): oro · rubí · cyan
  const accentColor = useMemo(() => {
    if (isArtistas) return '#FF2B44';
    if (isProveedor || isB2G) return '#00E5FF';
    return '#ecb613';
  }, [isArtistas, isProveedor, isB2G]);

  const defaultRole = useMemo<MobileRole>(() => {
    if (isArtistas) return 'ARTISTA';
    if (isProveedor) return 'PROVIDER';
    if (isB2G) return 'B2G';
    return 'B2C';
  }, [isArtistas, isProveedor, isB2G]);

  // Filtrado hermético de roles visibles en el Cockpit (cero ruido cruzado)
  const allowedRoles = useMemo<MobileRole[]>(() => {
    if (isNovios || isFincas) return ['B2C', 'PROVIDER'];
    if (isArtistas) return ['ARTISTA', 'B2C'];
    if (isProveedor) return ['PROVIDER', 'ARTISTA'];
    if (isB2G) return ['B2G'];
    return ['B2C', 'PROVIDER', 'ARTISTA', 'B2G'];
  }, [isNovios, isFincas, isArtistas, isProveedor, isB2G]);

  const activeRole: MobileRole =
    roleOverride && allowedRoles.includes(roleOverride) ? roleOverride : defaultRole;
  const insight = ROLE_INSIGHTS[activeRole];

  const home = useMemo<{ href: string; label: string }>(() => {
    if (isNovios) return { href: '/bodas', label: 'Bodas' };
    if (isArtistas) return { href: '/artistas', label: 'Artistas' };
    if (isFincas) return { href: '/fincas', label: 'Fincas' };
    if (isProveedor) return { href: '/proveedores', label: 'Provee.' };
    if (isB2G) return { href: '/b2g', label: 'B2G' };
    return { href: '/', label: 'Inicio' };
  }, [isNovios, isArtistas, isFincas, isProveedor, isB2G]);

  // Accesos rápidos contextuales: nunca repiten el href de la portada activa
  const quickActions = useMemo<QuickAction[]>(() => {
    if (isNovios) {
      return [
        { label: 'Reservar solista', href: '/reservar/solista', icon: Music },
        { label: 'Parejas', href: '/bodas/parejas', icon: Sparkles },
        { label: 'Fincas', href: '/fincas', icon: Building2 },
        { label: 'Presupuesto', href: '/calculadora', icon: Calculator },
      ];
    }
    if (isArtistas) {
      return [
        { label: 'Solista 350 €', href: '/reservar/solista', icon: Music },
        { label: 'Rider técnico', href: '/rider-tecnico', icon: Sliders },
        { label: 'Mariachis', href: '/simulacion-mariachis', icon: Users },
        { label: 'Presupuesto', href: '/calculadora', icon: Calculator },
      ];
    }
    if (isProveedor) {
      return [
        { label: 'Mi panel', href: '/panel', icon: ShieldCheck },
        { label: 'Fincas', href: '/fincas', icon: Building2 },
        { label: 'Alianzas', href: '/alianzas', icon: Handshake },
        { label: 'Presupuesto', href: '/calculadora', icon: Calculator },
      ];
    }
    if (isB2G) {
      return [
        { label: 'Instituciones', href: '/instituciones', icon: Building2 },
        { label: 'VIMUME', href: '/vimume', icon: Activity },
        { label: 'Soberanía', href: '/soberania-tecnica', icon: ShieldCheck },
        { label: 'Presupuesto', href: '/calculadora', icon: Calculator },
      ];
    }
    if (isFincas) {
      return [
        { label: 'Reservar solista', href: '/reservar/solista', icon: Music },
        { label: 'Proveedores', href: '/proveedores', icon: Users },
        { label: 'Alianzas', href: '/alianzas', icon: Handshake },
        { label: 'Presupuesto', href: '/calculadora', icon: Calculator },
      ];
    }
    return [
      { label: 'Bodas', href: '/bodas', icon: Sparkles },
      { label: 'Artistas', href: '/artistas', icon: Music },
      { label: 'Fincas', href: '/fincas', icon: Building2 },
      { label: 'Proveedores', href: '/proveedores', icon: Users },
    ];
  }, [isNovios, isArtistas, isProveedor, isB2G, isFincas]);

  const closeSheet = useCallback(() => setSheet(null), []);

  const toggleSheet = useCallback((id: SheetId) => {
    playHapticClick(850, 0.02);
    setSheet((prev) => (prev === id ? null : id));
  }, []);

  const openConcierge = useCallback(() => {
    playHapticClick(900, 0.03);
    setSheet(null);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-ai-concierge'));
    }
  }, []);

  const openSearch = useCallback(() => {
    playHapticClick(800, 0.02);
    setSheet(null);
    setIsSearchOpen(true);
  }, [setIsSearchOpen]);

  // Al cambiar de ruta se cierra todo (cero paneles fantasma al navegar)
  useEffect(() => {
    setSheet(null);
    setOpenFolder(null);
    setRoleOverride(null);
  }, [pathname]);

  // Puente con la hamburguesa del SovereignNavbar (un solo menú real)
  useEffect(() => {
    const onToggle = () => {
      playHapticClick(850, 0.02);
      setSheet((prev) => (prev === 'menu' ? null : 'menu'));
    };
    window.addEventListener(MOBILE_MENU_EVENT, onToggle);
    return () => window.removeEventListener(MOBILE_MENU_EVENT, onToggle);
  }, []);

  // Scroll lock + Escape mientras hay un panel abierto
  useEffect(() => {
    if (!sheet) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSheet(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [sheet]);

  // El HUD público no interfiere en paneles privados
  if (pathname.startsWith('/admin') || pathname.startsWith('/panel')) {
    return null;
  }

  const isHomeCurrent = pathname === home.href;

  return (
    <>
      {/* ─── BACKDROP (z-60) ─── */}
      <AnimatePresence>
        {sheet && (
          <motion.button
            type="button"
            key="ear-hud-backdrop"
            aria-label="Cerrar panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeSheet}
            className="fixed inset-0 z-[60] cursor-default bg-black/70 backdrop-blur-[2px] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ─── PANEL EXCLUSIVO (z-70) · se ancla 5.25rem por encima del dock ─── */}
      <AnimatePresence>
        {sheet && (
          <motion.div
            key={`ear-hud-sheet-${sheet}`}
            id={sheet === 'menu' ? 'ear-mobile-menu-sheet' : undefined}
            role="dialog"
            aria-modal="true"
            aria-label={SHEET_TITLES[sheet]}
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-x-0 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-[70] mx-auto w-full max-w-lg px-2 lg:hidden"
          >
            <div className="max-h-[calc(100dvh-11rem)] overflow-y-auto overscroll-contain rounded-3xl border border-white/10 bg-[#07070b]/95 shadow-[0_0_80px_rgba(0,0,0,0.95)] backdrop-blur-2xl">
              <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-white/10 bg-[#07070b]/95 px-4 py-3 backdrop-blur-xl">
                <div className="flex min-w-0 flex-col">
                  <span
                    className="font-mono text-[9px] uppercase tracking-[0.28em]"
                    style={{ color: accentColor }}
                  >
                    EAR OS
                  </span>
                  <h2 className="truncate font-syne text-base font-bold text-white">
                    {SHEET_TITLES[sheet]}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closeSheet}
                  aria-label="Cerrar panel"
                  className="ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/70 transition-all duration-300 ease-out hover:bg-white/10 hover:text-white active:scale-95"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-3.5 pb-4 pt-3">
                {sheet === 'menu' && (
                  <>
                    {/* BUSCADOR GLOBAL CABLEADO A UnifiedSearch */}
                    <button
                      type="button"
                      onClick={openSearch}
                      className="mb-3 flex min-h-[52px] w-full items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 text-white/70 transition-all duration-300 ease-out hover:border-white/25 hover:text-white active:scale-[0.99]"
                    >
                      <span className="flex items-center gap-2 font-mono text-[11px]">
                        <Search size={14} />
                        Buscar en todo el ecosistema…
                      </span>
                      <kbd className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/60">
                        ⌘K
                      </kbd>
                    </button>

                    <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-400">
                      Accesos rápidos
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                          <Link
                            key={action.href}
                            href={action.href}
                            onClick={closeSheet}
                            className="group flex min-h-[56px] items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5 transition-all duration-300 ease-out hover:border-white/25 hover:bg-white/[0.07] active:scale-[0.98]"
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/50 text-white/70 transition-colors duration-300 group-hover:text-white">
                              <Icon size={15} />
                            </span>
                            <span className="truncate font-syne text-[11px] font-bold text-white/85">
                              {action.label}
                            </span>
                          </Link>
                        );
                      })}
                    </div>

                    {/* CATÁLOGO COMPLETO — CARPETAS SSOT (acordeón, sin animar layout) */}
                    <div className="mt-4 space-y-1.5 border-t border-white/10 pt-3">
                      <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-400">
                        Catálogo completo
                      </p>
                      {MENU_FOLDERS.map((folder) => {
                        const expanded = openFolder === folder.id;
                        return (
                          <div
                            key={folder.id}
                            className="overflow-hidden rounded-2xl border border-white/10 bg-black/40"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                playHapticClick(720, 0.02);
                                setOpenFolder(expanded ? null : folder.id);
                              }}
                              aria-expanded={expanded}
                              aria-controls={`ear-folder-${folder.id}`}
                              className="flex min-h-[52px] w-full items-center justify-between gap-2 px-3.5 py-3 text-left transition-colors duration-300 hover:bg-white/[0.04]"
                            >
                              <span className="truncate font-syne text-[13px] font-bold uppercase tracking-wide text-white">
                                {folder.label}
                              </span>
                              <ChevronDown
                                size={16}
                                className={cn(
                                  'shrink-0 transition-transform duration-300 ease-out',
                                  expanded ? 'rotate-180' : 'text-white/60'
                                )}
                                style={expanded ? { color: accentColor } : undefined}
                              />
                            </button>
                            {expanded && (
                              <div
                                id={`ear-folder-${folder.id}`}
                                className="border-t border-white/5 bg-white/[0.02] px-2 pb-2 pt-1"
                              >
                                {folder.subitems.map((item) => (
                                  <Link
                                    key={`${folder.id}-${item.href}`}
                                    href={item.href}
                                    onClick={closeSheet}
                                    className="flex min-h-[48px] items-center justify-between gap-2 rounded-xl px-2.5 py-2 transition-colors duration-300 hover:bg-white/[0.06]"
                                  >
                                    <span className="flex min-w-0 flex-col">
                                      <span className="truncate font-syne text-[12px] font-semibold text-white/90">
                                        {cleanTitle(item.title)}
                                      </span>
                                      <span className="truncate font-mono text-[10px] text-white/60">
                                        {item.desc}
                                      </span>
                                    </span>
                                    {item.badge && (
                                      <span
                                        className="shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold uppercase"
                                        style={{
                                          borderColor: `${accentColor}44`,
                                          backgroundColor: `${accentColor}14`,
                                          color: accentColor,
                                        }}
                                      >
                                        {item.badge}
                                      </span>
                                    )}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* DESTACADOS TRANSVERSALES (SPOTLIGHT SSOT) */}
                    <div className="mt-3 border-t border-white/10 pt-3">
                      <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-400">
                        Destacados
                      </p>
                      <div className="space-y-1.5">
                        {SPOTLIGHT_LINKS.map((spot) => (
                          <Link
                            key={spot.id}
                            href={spot.href}
                            onClick={closeSheet}
                            className={cn(
                              'flex min-h-[52px] items-center justify-between gap-2 rounded-2xl border px-3.5 py-2.5 transition-all duration-300 ease-out active:scale-[0.99]',
                              SPOTLIGHT_STYLES[spot.accent]
                            )}
                          >
                            <span className="flex min-w-0 flex-col">
                              <span className="truncate font-syne text-[13px] font-bold uppercase">
                                {spot.label}
                              </span>
                              <span className="truncate font-mono text-[10px] text-white/60">
                                {spot.hint}
                              </span>
                            </span>
                            <ArrowRight size={15} className="shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </div>

                  </>
                )}

                {sheet === 'contact' && (
                  <div className="space-y-2">
                    <a
                      href={TEL_HREF}
                      onClick={() => playHapticClick(900, 0.03)}
                      className="flex min-h-[60px] w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-300 ease-out active:scale-[0.99]"
                      style={{ backgroundColor: accentColor, boxShadow: `0 0 28px ${accentColor}55` }}
                    >
                      <Phone size={18} className="shrink-0 text-black" />
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate font-syne text-sm font-bold text-black">
                          Llamar ahora
                        </span>
                        <span className="truncate font-mono text-[10px] font-semibold text-black/70">
                          {CENTRALITA_EAR_OS}
                        </span>
                      </span>
                      <ArrowRight size={16} className="ml-auto shrink-0 text-black" />
                    </a>

                    <a
                      href={waLink('Hola, consulto disponibilidad y presupuesto para mi evento.')}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeSheet}
                      className="flex min-h-[56px] w-full items-center gap-3 rounded-2xl bg-[#25D366] px-4 py-3 transition-all duration-300 ease-out hover:brightness-110 active:scale-[0.99]"
                    >
                      <MessageCircle size={18} className="shrink-0 text-black" />
                      <span className="font-syne text-sm font-bold text-black">WhatsApp directo</span>
                      <span className="ml-auto font-mono text-[9px] font-bold uppercase text-black/60">
                        Ruta libre
                      </span>
                    </a>

                    <a
                      href={waLink('URGENCIA: mi evento es en menos de 7 días. Necesito confirmación hoy.')}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeSheet}
                      className="flex min-h-[56px] w-full items-center gap-3 rounded-2xl border border-[#FF2B44]/40 bg-[#FF2B44]/10 px-4 py-3 text-[#FF2B44] transition-all duration-300 ease-out hover:bg-[#FF2B44]/20 active:scale-[0.99]"
                    >
                      <Activity size={18} className="shrink-0" />
                      <span className="font-syne text-sm font-bold">Urgencia &lt; 7 días</span>
                    </a>

                    <Link
                      href="/reservar/solista"
                      onClick={closeSheet}
                      className="flex min-h-[56px] w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 transition-all duration-300 ease-out hover:border-white/25 hover:bg-white/[0.08] active:scale-[0.99]"
                    >
                      <ShieldCheck size={18} className="shrink-0" style={{ color: accentColor }} />
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate font-syne text-sm font-bold text-white">
                          Bloquear fecha · depósito 100 €
                        </span>
                        <span className="truncate font-mono text-[10px] text-white/45">
                          100% deducible · Price-Lock SHA-256
                        </span>
                      </span>
                    </Link>

                    <p className="pt-1 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-400">
                      Centralita CEO · respuesta &lt; 2 h
                    </p>

                  </div>
                )}

                {sheet === 'cockpit' && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {allowedRoles.map((role) => {
                        const RoleIcon = ROLE_LABELS[role].icon;
                        const active = role === activeRole;
                        return (
                          <button
                            key={role}
                            type="button"
                            aria-pressed={active}
                            onClick={() => {
                              playHapticClick(780, 0.02);
                              setRoleOverride(role);
                            }}
                            className={cn(
                              'flex min-h-[40px] items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ease-out active:scale-95',
                              active
                                ? 'text-black'
                                : 'border-white/10 bg-white/[0.04] text-white/60 hover:text-white'
                            )}
                            style={
                              active
                                ? { backgroundColor: accentColor, borderColor: accentColor }
                                : undefined
                            }
                          >
                            <RoleIcon size={12} />
                            {ROLE_LABELS[role].name}
                          </button>
                        );
                      })}
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="min-w-0 font-syne text-sm font-bold text-white">
                          {insight.title}
                        </h3>
                        <span
                          className={cn(
                            'shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold uppercase',
                            insight.badgeClass
                          )}
                        >
                          {insight.badge}
                        </span>
                      </div>
                      <dl className="mt-3 grid grid-cols-2 gap-2">
                        <div className="rounded-xl border border-white/5 bg-white/[0.03] px-2.5 py-2">
                          <dt className="font-mono text-[8px] uppercase tracking-widest text-zinc-400">
                            Ticket
                          </dt>
                          <dd className="mt-0.5 font-syne text-[11px] font-bold leading-tight text-white">
                            {insight.ticket}
                          </dd>
                        </div>
                        <div className="rounded-xl border border-white/5 bg-white/[0.03] px-2.5 py-2">
                          <dt className="font-mono text-[8px] uppercase tracking-widest text-zinc-400">
                            Split / Garantía
                          </dt>
                          <dd className="mt-0.5 font-syne text-[11px] font-bold leading-tight text-white">
                            {insight.split}
                          </dd>
                        </div>
                      </dl>
                      <p className="mt-3 font-mono text-[10px] leading-relaxed text-white/60">
                        {insight.summary}
                      </p>
                    </div>

                    <Link
                      href={insight.actionHref}
                      onClick={closeSheet}
                      className="flex min-h-[52px] w-full items-center gap-2 rounded-2xl border px-3.5 font-syne text-[13px] font-bold uppercase transition-all duration-300 ease-out active:scale-[0.99]"
                      style={{
                        borderColor: `${accentColor}55`,
                        backgroundColor: `${accentColor}14`,
                        color: accentColor,
                      }}
                    >
                      <Compass size={16} className="shrink-0" />
                      <span className="truncate">{insight.keyAction}</span>
                      <ArrowRight size={15} className="ml-auto shrink-0" />
                    </Link>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={openConcierge}
                        className="flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] font-mono text-[10px] font-bold uppercase tracking-wider text-white transition-all duration-300 ease-out hover:bg-white/10 active:scale-95"
                      >
                        <MessageCircle size={15} />
                        Hablar con IA
                      </button>
                      <a
                        href={waLink(`Hola, quiero información sobre ${insight.title}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={closeSheet}
                        className="flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-[#25D366] font-mono text-[10px] font-bold uppercase tracking-wider text-black transition-all duration-300 ease-out hover:brightness-110 active:scale-95"
                      >
                        <Phone size={15} />
                        WhatsApp
                      </a>
                    </div>

                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── DOCK ÚNICO (z-80) · lg:hidden ─── */}
      <nav
        aria-label="Navegación móvil unificada"
        className="fixed inset-x-0 bottom-0 z-[80] px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 lg:hidden"
      >
        <div className="mx-auto flex max-w-md items-stretch gap-0.5 rounded-[26px] border border-white/10 bg-[#09090d]/95 px-1.5 py-1.5 shadow-[0_-14px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
          {/* 1 · PORTADA CONTEXTUAL — gesto oculto: 5 s alterna tema de diseño */}
          <Link
            href={home.href}
            onClick={handleHomeClick}
            onMouseDown={startLongPress}
            onMouseUp={clearLongPress}
            onMouseLeave={clearLongPress}
            onTouchStart={startLongPress}
            onTouchEnd={clearLongPress}
            onTouchCancel={clearLongPress}
            onTouchMove={clearLongPress}
            onContextMenu={(event) => {
              if (longPressFired.current) event.preventDefault();
            }}
            aria-current={isHomeCurrent ? 'page' : undefined}
            className={dockItemClass(isHomeCurrent)}
          >
            <Home size={18} strokeWidth={2.2} />
            <span className="truncate">{home.label}</span>
          </Link>

          {/* 2 · MENÚ — abre el panel exclusivo `ear-mobile-menu-sheet` */}
          <button
            type="button"
            onClick={() => toggleSheet('menu')}
            aria-expanded={sheet === 'menu'}
            aria-controls="ear-mobile-menu-sheet"
            className={dockItemClass(sheet === 'menu')}
          >
            {sheet === 'menu' ? (
              <X size={18} strokeWidth={2.2} />
            ) : (
              <Menu size={18} strokeWidth={2.2} />
            )}
            <span>Menú</span>
          </button>

          {/* 3 · ORÁCULO ASTRA (único acento de la vista) */}
          <button
            type="button"
            onClick={() => toggleSheet('cockpit')}
            aria-expanded={sheet === 'cockpit'}
            aria-label="Oráculo Astra"
            className="flex min-h-[56px] w-[62px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-2xl transition-all duration-300 ease-out active:scale-95"
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-2xl text-black transition-all duration-300 ease-out"
              style={{ backgroundColor: accentColor, boxShadow: `0 0 22px ${accentColor}66` }}
            >
              <Sparkles size={19} strokeWidth={2.4} />
            </span>
            <span
              className="font-mono text-[8px] font-bold uppercase tracking-wider"
              style={{ color: accentColor }}
            >
              Astra
            </span>
          </button>

          {/* 4 · CONTACTO DIRECTO */}
          <button
            type="button"
            onClick={() => toggleSheet('contact')}
            aria-expanded={sheet === 'contact'}
            aria-label="Contacto directo"
            className={dockItemClass(sheet === 'contact')}
          >
            <Phone size={18} strokeWidth={2.2} />
            <span>Contacto</span>
          </button>

          {/* 5 · CONCIERGE IA (evento `open-ai-concierge`) */}
          <button
            type="button"
            onClick={openConcierge}
            aria-label="Abrir asesor IA"
            className={dockItemClass(false)}
          >
            <MessageCircle size={18} strokeWidth={2.2} />
            <span>Asesor</span>
          </button>
        </div>
      </nav>

    </>
  );
});
