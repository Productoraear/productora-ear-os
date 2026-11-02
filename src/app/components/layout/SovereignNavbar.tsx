"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Search,
  Menu,
  ChevronDown,
  Activity,
  Sparkles,
  Calculator,
  Handshake
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSharedContext } from '@/app/context/SharedContext';
import { useSovereignRole } from '@/shared/hooks/useSovereignRole';
import { usePathname } from 'next/navigation';
import { MENU_FOLDERS, MOBILE_MENU_EVENT, SPOTLIGHT_LINKS } from '@/lib/config/sovereign-navigation';

const SovereignNavbar = () => {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  // W46_T01 · Panel único de exploración para la franja 1024–1279 px. Un solo
  // disparador no puede solaparse consigo mismo: es la garantía estructural de
  // que el rótulo «Catering & Servicios» no volverá a montarse sobre «VIMUME».
  const [exploreOpen, setExploreOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { setIsSearchOpen } = useSharedContext();
  const { scrollY } = useScroll();
  const { role, isAdmin } = useSovereignRole();
  // Zonas privadas: el SovereignMobileHUD no se monta ahí, así que la hamburguesa
  // no puede quedar como clic muerto (Doctrina de Fricción Cero).
  const isPrivateZone = Boolean(
    pathname?.startsWith('/admin') || pathname?.startsWith('/panel')
  );

  const navY = useTransform(scrollY, [0, 300], [0, -5]);
  const shadowOpacity = useTransform(scrollY, [0, 100], [0.1, 0.8]);

  // Atajo ⌘K/Ctrl+K: POTESTAD ÚNICA en <UnifiedSearch /> (@/lib/search).
  // Aquí sólo se abre desde los botones de la UI para no duplicar toggles.

  // Cerrar desplegables al cambiar de ruta
  useEffect(() => {
    setActiveDropdown(null);
    setExploreOpen(false);
  }, [pathname]);

  // Escape cierra el panel de exploración (teclado = misma potencia que ratón).
  useEffect(() => {
    if (!exploreOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExploreOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [exploreOpen]);

  if (
    pathname === '/' ||
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/panel') ||
    pathname?.startsWith('/pro') ||
    pathname?.startsWith('/emp-menu') ||
    pathname?.startsWith('/fincasparaboda')
  ) {
    return null;
  }

  // Opacidad reforzada a /95: el texto que pasa por detrás de la cabecera nunca
  // debe asomar cortado (Doctrina de Fricción Cero · cabecera opaca + blur real).
  const roleStyles: Record<string, string> = {
    ROLE_B2G: "border-[#ecb613]/40 bg-[#0c0a05]/95 shadow-[0_0_30px_rgba(236,182,19,0.2)]",
    ROLE_B2B: "border-[#ecb613]/25 bg-[#050507]/95 shadow-[0_0_30px_rgba(236,182,19,0.05)]",
    ROLE_B2C: "border-white/15 bg-[#050507]/95",
    ROLE_ADMIN: "border-[#ecb613]/50 bg-black/95 shadow-[0_0_40px_rgba(236,182,19,0.3)]",
    ROLE_GUEST: "border-white/15 bg-[#050507]/95",
    ROLE_ARTIST: "border-[#FF2B44]/30 bg-[#0f0507]/95",
    ROLE_PROVIDER: "border-[#ecb613]/25 bg-[#0a0805]/95",
    ROLE_AFFILIATE: "border-[#ecb613]/25 bg-[#0a0805]/95",
    ROLE_CLIENT: "border-white/15 bg-[#050507]/95"
  };

  const handleMouseEnter = (folderId: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(folderId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  return (
    <motion.header
      style={{ y: navY }}
      className="fixed top-0 left-0 w-full z-[100] bg-black/95 backdrop-blur-2xl border-b border-white/10 px-3 py-3 md:px-8"
    >
      <motion.nav
        style={{ boxShadow: `0 20px 40px -10px rgba(0,0,0, ${shadowOpacity.get()})` }}
        className={cn(
          "max-w-7xl 2xl:max-w-[1500px] mx-auto flex items-center justify-between px-3 xl:px-5 py-2.5 transition-all duration-700 rounded-full border backdrop-blur-2xl",
          roleStyles[role] || roleStyles.ROLE_GUEST
        )}
      >
        {/* LOGO & BRAND */}
        <Link href="/" className="flex items-center gap-2.5 xl:gap-3 group shrink-0">
          <div className={cn(
            "w-9 h-9 rounded-2xl overflow-hidden border p-0.5 flex items-center justify-center transition-all group-hover:scale-105 bg-black",
            pathname?.startsWith('/vimume')
              ? "border-[#00E5FF]/60 shadow-[0_0_20px_rgba(0,229,255,0.4)]"
              : role === 'ROLE_B2G'
                ? "border-[#ecb613]/60 shadow-[0_0_20px_rgba(236,182,19,0.4)]"
                : "border-[#FF2B44]/70 shadow-[0_0_20px_rgba(255,43,68,0.45)]"
          )}>
            <img
              src={pathname?.startsWith('/vimume') ? "/images/brand/colibri_isotipo.png" : "/images/brand/ear_logo_official_diamond.png"}
              alt={pathname?.startsWith('/vimume') ? "VIMUME Logo Colibrí" : "Productora EAR Logotipo Oficial Diamante"}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm md:text-base font-black font-syne tracking-tight text-white leading-none">
              {pathname?.startsWith('/vimume') ? (
                <>VIMUME <span className="text-[#00E5FF]">OS</span></>
              ) : role === 'ROLE_B2G' ? (
                <>EAR OS <span className="text-[#ecb613]">B2G</span></>
              ) : (
                <>PRODUCTORA <span className="text-[#FF2B44]">EAR</span></>
              )}
            </span>
            <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest mt-0.5">
              {pathname?.startsWith('/vimume') ? "Neuroacústica 40Hz" : "Infraestructura S-Class"}
            </span>
          </div>
        </Link>

        {/* RUTAS CON SISTEMA DE SUBMENÚS Y SUBCARPETAS (ESCRITORIO · 2xl+)
            Presupuesto medido: 4 carpetas en rótulo corto (453 px) + 3
            destacados (335 px) + marca (~190 px) + acciones (~260 px) ≈ 1.240 px.
            Solo a partir de 1.536 px hay margen real; por debajo manda el
            disparador compacto. Los 4.000 px de rótulos largos que había antes
            no caben ni en un monitor de 1.920 px. */}
        <div className="hidden 2xl:flex items-center justify-center gap-1 2xl:gap-2 flex-1 min-w-0 px-2">
          {MENU_FOLDERS.map((folder, index) => {
            const isCurrentSection = pathname?.startsWith(folder.href);
            const isOpen = activeDropdown === folder.id;

            return (
              <div
                key={folder.id}
                className="relative shrink-0"
                onMouseEnter={() => handleMouseEnter(folder.id)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={folder.href}
                  onFocus={() => handleMouseEnter(folder.id)}
                  className={cn(
                    "flex items-center gap-1 xl:gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                    isCurrentSection
                      ? "text-white bg-white/10 border border-white/20"
                      : "text-white/70 hover:text-white hover:bg-white/5",
                    isOpen && "bg-white/10 text-white"
                  )}
                >
                  <span className="whitespace-nowrap">{folder.shortLabel}</span>
                  <ChevronDown size={13} className={cn("transition-transform duration-200 text-white/50", isOpen && "rotate-180 text-[#FF2B44]")} />
                </Link>

                {/* DESPLEGABLE CON SUBCARPETAS */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className={cn(
                        // Los dos últimos desplegables se anclan a la derecha:
                        // abiertos desde el borde del viewport ya no se salen
                        // de pantalla (causa real de recortes en 1280–1400 px).
                        "absolute top-full mt-3 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-white/15 bg-[#08080c]/95 backdrop-blur-2xl p-2.5 shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-50 space-y-1",
                        index >= MENU_FOLDERS.length - 2 ? "right-0" : "left-0"
                      )}
                    >
                      <div className="px-3 py-1.5 border-b border-white/10 mb-1 flex items-center justify-between">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400">
                          Subcarpetas · {folder.label}
                        </span>
                        <Link href={folder.href} className="text-[10px] text-[#AAD6CD] hover:underline font-mono">
                          Ver Todo →
                        </Link>
                      </div>

                      {folder.subitems.map((subitem, idx) => {
                        const Icon = subitem.icon || Sparkles;
                        return (
                          <Link
                            key={idx}
                            href={subitem.href}
                            onClick={() => setActiveDropdown(null)}
                            className="group/item flex items-start gap-3 p-2.5 rounded-xl transition-all hover:bg-white/5"
                          >
                            <div className="w-8 h-8 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center shrink-0 group-hover/item:border-[#FF2B44]/50 group-hover/item:text-[#FF2B44] text-white/70 transition-colors">
                              <Icon size={14} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-syne text-xs font-bold text-white group-hover/item:text-[#FF2B44] transition-colors truncate">
                                  {subitem.title}
                                </span>
                                {subitem.badge && (
                                  <span className="shrink-0 font-mono text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-[#FF2B44]/20 text-[#FF2B44] border border-[#FF2B44]/30">
                                    {subitem.badge}
                                  </span>
                                )}
                              </div>
                              <p className="font-sans text-[11px] text-zinc-400 line-clamp-1 mt-0.5 leading-snug">
                                {subitem.desc}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* VIMUME HIGHLIGHT */}
          <Link href="/vimume" className={cn(
            "shrink-0 flex items-center gap-1.5 text-xs font-mono font-bold px-2.5 xl:px-3 py-1.5 rounded-full border transition-all uppercase tracking-wider whitespace-nowrap",
            role === 'ROLE_B2G'
              ? "border-[#ecb613]/50 bg-[#ecb613]/10 hover:bg-[#ecb613]/20 text-[#ecb613]"
              : "border-[#00E5FF]/30 hover:border-[#00E5FF] hover:bg-[#00E5FF]/10 text-[#00E5FF]"
          )}>
            <Activity size={13} className="shrink-0" />
            <span>VIMUME</span>
          </Link>

          {/* ALIANZAS ESTRATÉGICAS */}
          <Link
            href="/alianzas"
            className="shrink-0 flex items-center gap-1.5 text-xs font-mono font-bold px-2.5 xl:px-3 py-1.5 rounded-full border transition-all uppercase tracking-wider border-[#FF2B44]/30 hover:border-[#FF2B44] hover:bg-[#FF2B44]/10 text-[#FF2B44] whitespace-nowrap"
          >
            <Handshake size={13} className="shrink-0" />
            <span>Alianzas</span>
          </Link>

          {/* PRESUPUESTADOR S-CLASS HIGHLIGHT */}
          <Link
            href="/calculadora"
            className={cn(
              "shrink-0 flex items-center gap-1.5 text-xs font-mono font-bold px-2.5 xl:px-3.5 py-1.5 rounded-full border transition-all uppercase tracking-wider whitespace-nowrap",
              pathname === '/calculadora'
                ? "bg-[#ecb613] text-black border-[#ecb613] shadow-[0_0_15px_rgba(236,182,19,0.35)]"
                : "border-[#ecb613]/40 bg-[#ecb613]/10 text-[#ecb613] hover:bg-[#ecb613] hover:text-black hover:border-[#ecb613]"
            )}
          >
            <Calculator size={13} className="shrink-0" />
            {/* Rótulo corto también en 2xl: «Presupuestador» añadía 32 px que
                el botón ADMIN necesita cuando hay sesión iniciada. */}
            <span className="whitespace-nowrap">Presupuesto</span>
          </Link>
        </div>

        {/* DISPARADOR COMPACTO · franja 1024–1535 px (lg → 2xl).
            Antes vivía aquí la franja completa con `shrink-0`: 4 carpetas + 3
            destacados no caben en 1024 px y desbordaban sobre el buscador y el
            teléfono (el «Frankenstein» reportado en /otzarreta). Ahora la
            navegación de escritorio estrecha se resuelve con UN disparador y su
            panel, que jamás excede el viewport. */}
        <div className="hidden lg:flex 2xl:hidden items-center justify-center flex-1 min-w-0 px-2 relative">
          <button
            type="button"
            onClick={() => setExploreOpen((open) => !open)}
            aria-expanded={exploreOpen}
            aria-controls="ear-explore-panel"
            aria-haspopup="true"
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap",
              exploreOpen
                ? "bg-white/10 border-white/25 text-white"
                : "border-white/15 text-white/75 hover:text-white hover:bg-white/5"
            )}
          >
            <Menu size={13} className="shrink-0" />
            <span>Explorar</span>
            <ChevronDown
              size={13}
              className={cn("shrink-0 transition-transform duration-200 text-white/50", exploreOpen && "rotate-180 text-[#FF2B44]")}
            />
          </button>

          <AnimatePresence>
            {exploreOpen && (
              <motion.div
                id="ear-explore-panel"
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-4 z-50 w-[min(92vw,46rem)] max-w-[calc(100vw-2rem)] rounded-3xl border border-white/15 bg-[#08080c]/95 backdrop-blur-2xl p-4 shadow-[0_30px_80px_rgba(0,0,0,0.95)]"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MENU_FOLDERS.map((folder) => (
                    <div key={folder.id} className="rounded-2xl border border-white/10 bg-black/30 p-3">
                      <Link
                        href={folder.href}
                        onClick={() => setExploreOpen(false)}
                        className="flex items-center justify-between gap-2 group/folder"
                      >
                        <span className="font-syne text-xs font-bold text-white group-hover/folder:text-[#FF2B44] transition-colors">
                          {folder.label}
                        </span>
                        <span className="font-mono text-[10px] text-[#AAD6CD] shrink-0">Ver todo →</span>
                      </Link>
                      <div className="mt-2 space-y-1">
                        {folder.subitems.map((subitem) => (
                          <Link
                            key={subitem.href}
                            href={subitem.href}
                            onClick={() => setExploreOpen(false)}
                            className="block px-2 py-1.5 rounded-lg text-[11px] text-zinc-300 hover:text-white hover:bg-white/5 transition-colors truncate"
                          >
                            {subitem.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {SPOTLIGHT_LINKS.map((link) => (
                    <Link
                      key={link.id}
                      href={link.href}
                      onClick={() => setExploreOpen(false)}
                      className={cn(
                        "flex flex-col rounded-xl border px-3 py-2 transition-colors",
                        link.accent === 'gold'
                          ? "border-[#ecb613]/40 text-[#ecb613] hover:bg-[#ecb613]/10"
                          : link.accent === 'cyan'
                            ? "border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF]/10"
                            : "border-[#FF2B44]/40 text-[#FF2B44] hover:bg-[#FF2B44]/10"
                      )}
                    >
                      <span className="text-xs font-mono font-bold uppercase tracking-wider">{link.label}</span>
                      <span className="text-[10px] text-zinc-400 font-sans">{link.hint}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* OMNI-SEARCH & WALLET */}
        <div className="hidden md:flex items-center gap-2 xl:gap-3 shrink-0">
          <button
            className="flex items-center gap-1.5 xl:gap-2 bg-black/50 border border-white/10 hover:border-[#FF2B44]/50 px-2.5 xl:px-3.5 py-1.5 rounded-full text-white/50 text-xs font-mono transition-all group cursor-pointer shrink-0"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Buscar servicio"
          >
            <Search size={13} className="group-hover:text-[#FF2B44] transition-colors shrink-0" />
            {/* En 2xl el teléfono y las carpetas ya ocupan su espacio: el texto
                del buscador se retira y queda icono + ⌘K (cero solapes). */}
            <span className="hidden lg:inline 2xl:hidden">Buscar...</span>
            <kbd className="hidden lg:inline bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono text-white/70">⌘K</kbd>
          </button>

          {/* ACCIÓN DE LLAMADA INMEDIATA S-CLASS */}
          <a
            href="tel:+34693693048"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-[11px] font-mono text-white/80 hover:text-white transition-all shrink-0 whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>693 693 048</span>
          </a>

          {/* ADMIN O LOGOUT */}
          {(isAdmin || role === 'ROLE_B2B' || role === 'ROLE_ADMIN') && (
            <div className="flex items-center gap-2">
              <Link href="/admin" className="px-4 py-1.5 bg-[#FF2B44] text-white rounded-full font-bold text-xs hover:scale-105 shadow-[0_0_15px_rgba(255,43,68,0.4)] transition-all font-mono uppercase tracking-wider">
                ADMIN
              </Link>
              <button
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' });
                  document.cookie = 'ear_auth_signal=; path=/; max-age=0';
                  document.cookie = 'ear_os_auth_token=; path=/; max-age=0';
                  window.location.href = '/login';
                }}
                className="px-2.5 py-1.5 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-400 rounded-full text-xs font-mono transition-all"
                title="Cerrar Sesión"
              >
                Salir
              </button>
            </div>
          )}
        </div>

        {/* MOBILE TOGGLE — dispara el menú ÚNICO del SovereignMobileHUD (< lg) */}
        {!isPrivateZone && (
          <button
            type="button"
            aria-label="Abrir menú de navegación"
            aria-controls="ear-mobile-menu-sheet"
            className="lg:hidden -mr-1 flex h-11 w-11 items-center justify-center rounded-xl text-white transition-colors hover:text-[#FF2B44] active:bg-white/10 touch-manipulation"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent(MOBILE_MENU_EVENT));
              }
            }}
          >
            <Menu size={22} />
          </button>
        )}
      </motion.nav>

    </motion.header>
  );
};

export default SovereignNavbar;