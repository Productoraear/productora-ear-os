"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  Activity, 
  Sparkles, 
  Music, 
  Users, 
  Building2, 
  Sliders, 
  Radio, 
  Heart, 
  Flame, 
  Camera, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSharedContext } from '@/app/context/SharedContext';
import { useSovereignRole } from '@/shared/hooks/useSovereignRole';
import { usePathname } from 'next/navigation';

interface SubmenuItem {
  title: string;
  desc: string;
  href: string;
  badge?: string;
  icon?: any;
}

interface MenuFolder {
  id: string;
  label: string;
  href: string;
  subitems: SubmenuItem[];
}

const MENU_FOLDERS: MenuFolder[] = [
  {
    id: 'produccion',
    label: 'Producción',
    href: '/eventos',
    subitems: [
      {
        title: 'Bodas & Ceremonias',
        desc: 'Producción de alta costura nupcial y sonido en vivo',
        href: '/eventos?tipo=bodas',
        icon: Heart
      },
      {
        title: 'Cumpleaños & Fiestas',
        desc: 'Serenatas de gala, aniversarios y momentos íntimos',
        href: '/eventos?tipo=cumpleanos',
        icon: Sparkles
      },
      {
        title: 'Ayuntamientos & B2G',
        desc: 'Licitaciones oficiales menores de 15.000 € (Art. 118 LCSP)',
        href: '/ayuntamientos',
        badge: 'B2G',
        icon: Building2
      },
      {
        title: 'Alquiler Sonido Bose 2.000W',
        desc: 'Sistemas F1 Model 812 y S1 Pro con técnico de sala',
        href: '/alquiler-equipos-sonido-audiovisuales',
        icon: Radio
      },
      {
        title: 'Catering & Brasas S-Class',
        desc: 'Showcooking de paellas gigantes y cortes ibéricos',
        href: '/catering-brasas',
        icon: Flame
      }
    ]
  },
  {
    id: 'artistas',
    label: 'Artistas',
    href: '/artistas',
    subitems: [
      {
        title: 'Edwin Agudelo · Solista Premium',
        desc: 'Show 1h (2 pases), Bose 2.000W, sombreros charros, flores y fotos',
        href: '/artistas',
        badge: '350 €',
        icon: Music
      },
      {
        title: 'Mariachi 6 Músicos de Gala',
        desc: 'Edwin + 5 acompañantes (trompeta, vihuela, guitarrón, violín)',
        href: '/artistas#formatos-oficiales',
        badge: '600 €',
        icon: Users
      },
      {
        title: 'Mariachi 9 Músicos Pro',
        desc: 'Edwin + 8 acompañantes con sección armónica completa',
        href: '/artistas#formatos-oficiales',
        badge: '900 €',
        icon: Users
      },
      {
        title: 'Gran Ensamble 13 Músicos',
        desc: 'Edwin + 12 maestros para recintos mayores y apoteosis',
        href: '/artistas#formatos-oficiales',
        badge: '1.300 €',
        icon: Users
      },
      {
        title: 'Cotizador Rápido con Kilometraje',
        desc: 'Cálculo transparente desde Méntrida con reserva de 100 €',
        href: '/artistas#cotizador-cierre',
        icon: Lock
      }
    ]
  },
  {
    id: 'proveedores',
    label: 'Proveedores',
    href: '/proveedores',
    subitems: [
      {
        title: 'Fincas & Espacios Monumentales',
        desc: 'Cortijos, haciendas y salones auditados',
        href: '/proveedores?cat=finca',
        icon: Building2
      },
      {
        title: 'Música en Vivo & Mariachis',
        desc: 'Solistas, agrupaciones y músicos verificados',
        href: '/proveedores?cat=musica',
        icon: Music
      },
      {
        title: 'Catering & Gastronomía',
        desc: 'Banquetería, showcooking y bodegas seleccionadas',
        href: '/proveedores?cat=catering',
        icon: Flame
      },
      {
        title: 'Fotografía & Cinematografía',
        desc: 'Cobertura visual documental y fotomatones',
        href: '/proveedores?cat=foto',
        icon: Camera
      },
      {
        title: 'Ver Todo el Directorio Nacional',
        desc: 'Catálogo de profesionales homologados en España',
        href: '/proveedores',
        badge: 'Directorio',
        icon: ArrowRight
      }
    ]
  }
];

const SovereignNavbar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileFolder, setExpandedMobileFolder] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { isSearchOpen, setIsSearchOpen } = useSharedContext();
  const { scrollY } = useScroll();
  const { role, isAdmin } = useSovereignRole();

  const navY = useTransform(scrollY, [0, 300], [0, -5]); 
  const shadowOpacity = useTransform(scrollY, [0, 100], [0.1, 0.8]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Cerrar menús al cambiar de ruta
  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  if (pathname === '/' || pathname?.startsWith('/admin')) {
    return null;
  }

  const roleStyles: Record<string, string> = {
    ROLE_B2G: "border-blue-500/30 bg-[#0a1128]/85 shadow-[0_0_30px_rgba(59,130,246,0.2)]",
    ROLE_B2B: "border-white/15 bg-[#050507]/90 shadow-[0_0_30px_rgba(255,255,255,0.05)]",
    ROLE_B2C: "border-white/15 bg-[#050507]/90",
    ROLE_ADMIN: "border-red-500/40 bg-black/90 shadow-[0_0_40px_rgba(239,68,68,0.3)]",
    ROLE_GUEST: "border-white/15 bg-[#050507]/90",
    ROLE_ARTIST: "border-purple-500/20 bg-[#0a0f0a]/90",
    ROLE_PROVIDER: "border-green-500/20 bg-[#0a0f0a]/90",
    ROLE_AFFILIATE: "border-orange-500/20 bg-[#0a0f0a]/90",
    ROLE_CLIENT: "border-white/15 bg-[#050507]/90"
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
      className="fixed top-0 left-0 w-full z-[100] px-3 py-3 md:px-8"
    >
      <motion.nav 
        style={{ boxShadow: `0 20px 40px -10px rgba(0,0,0, ${shadowOpacity.get()})` }}
        className={cn(
          "max-w-7xl mx-auto flex items-center justify-between px-5 py-2.5 transition-all duration-700 rounded-full border backdrop-blur-2xl",
          roleStyles[role] || roleStyles.ROLE_GUEST
        )}
      >
        {/* LOGO & BRAND */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className={cn(
            "w-9 h-9 rounded-2xl overflow-hidden border p-0.5 flex items-center justify-center transition-all group-hover:scale-105 bg-black",
            pathname?.startsWith('/vimume')
              ? "border-[#00E5FF]/60 shadow-[0_0_20px_rgba(0,229,255,0.4)]"
              : role === 'ROLE_B2G' 
                ? "border-blue-400/60 shadow-[0_0_20px_rgba(59,130,246,0.4)]" 
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
                <>EAR OS <span className="text-blue-400">B2G</span></>
              ) : (
                <>PRODUCTORA <span className="text-[#FF2B44]">EAR</span></>
              )}
            </span>
            <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest mt-0.5">
              {pathname?.startsWith('/vimume') ? "Neuroacústica 40Hz" : "Infraestructura S-Class"}
            </span>
          </div>
        </Link>

        {/* RUTAS CON SISTEMA DE SUBMENÚS Y SUBCARPETAS (ESCRITORIO) */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          {MENU_FOLDERS.map((folder) => {
            const isCurrentSection = pathname?.startsWith(folder.href);
            const isOpen = activeDropdown === folder.id;

            return (
              <div 
                key={folder.id} 
                className="relative"
                onMouseEnter={() => handleMouseEnter(folder.id)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={folder.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all",
                    isCurrentSection
                      ? "text-white bg-white/10 border border-white/20"
                      : "text-white/70 hover:text-white hover:bg-white/5",
                    isOpen && "bg-white/10 text-white"
                  )}
                >
                  <span>{folder.label}</span>
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
                      className="absolute top-full left-0 mt-3 w-80 rounded-2xl border border-white/15 bg-[#08080c]/95 backdrop-blur-2xl p-2.5 shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-50 space-y-1"
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
            "flex items-center gap-1.5 text-xs font-mono font-bold px-3.5 py-1.5 rounded-full border transition-all uppercase tracking-wider ml-1",
            role === 'ROLE_B2G' 
              ? "border-blue-400/50 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300" 
              : "border-[#00E5FF]/30 hover:border-[#00E5FF] hover:bg-[#00E5FF]/10 text-[#00E5FF]"
          )}>
            <Activity size={13} />
            <span>VIMUME</span>
          </Link>
        </div>

        {/* OMNI-SEARCH & WALLET */}
        <div className="hidden md:flex items-center gap-3">
          <button 
            className="flex items-center gap-2 bg-black/50 border border-white/10 hover:border-[#FF2B44]/50 px-3.5 py-1.5 rounded-full text-white/50 text-xs font-mono transition-all group cursor-pointer"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search size={13} className="group-hover:text-[#FF2B44] transition-colors" />
            <span className="hidden xl:inline">Buscar servicio...</span>
            <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono text-white/70">⌘K</kbd>
          </button>

          {/* ACCIÓN DE LLAMADA INMEDIATA S-CLASS */}
          <a
            href="tel:+34693693048"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-[11px] font-mono text-white/80 hover:text-white transition-all"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
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

        {/* MOBILE TOGGLE */}
        <button 
          aria-label="Abrir Menú de Navegación"
          className="lg:hidden text-white hover:text-[#FF2B44] transition-colors p-1" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </motion.nav>

      {/* MOBILE MENU (CON ACORDEONES POR SUBCARPETAS) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="absolute top-20 left-3 right-3 bg-[#07070b]/98 backdrop-blur-3xl border border-white/15 rounded-3xl p-5 flex flex-col gap-3 shadow-[0_25px_60px_rgba(0,0,0,0.95)] lg:hidden max-h-[85vh] overflow-y-auto z-50"
          >
            {/* Buscador Móvil */}
            <button 
              className="flex items-center justify-between bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-white/70 text-xs font-mono"
              onClick={() => {
                setIsSearchOpen(true);
                setMobileMenuOpen(false);
              }}
            >
              <span className="flex items-center gap-2"><Search size={14} /> Buscar en todo el ecosistema...</span>
              <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-white/60">⌘K</kbd>
            </button>

            <div className="border-t border-white/10 pt-2 space-y-1">
              {MENU_FOLDERS.map((folder) => {
                const isExpanded = expandedMobileFolder === folder.id;

                return (
                  <div key={folder.id} className="rounded-xl border border-white/5 bg-black/40 overflow-hidden">
                    <button
                      onClick={() => setExpandedMobileFolder(isExpanded ? null : folder.id)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="font-syne text-sm font-bold uppercase text-white tracking-wide">
                        {folder.label}
                      </span>
                      <ChevronDown size={16} className={cn("text-white/50 transition-transform", isExpanded && "rotate-180 text-[#FF2B44]")} />
                    </button>

                    {isExpanded && (
                      <div className="px-3 pb-3 pt-1 space-y-1 border-t border-white/5 bg-white/[0.02]">
                        <Link 
                          href={folder.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-xs font-mono text-[#AAD6CD] hover:underline py-1"
                        >
                          → Ver Portada de {folder.label}
                        </Link>
                        {folder.subitems.map((sub, sIdx) => (
                          <Link
                            key={sIdx}
                            href={sub.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-between py-2 px-2.5 rounded-lg hover:bg-white/5 text-xs text-white/80"
                          >
                            <span className="font-medium text-white">{sub.title}</span>
                            {sub.badge && (
                              <span className="font-mono text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-[#FF2B44]/20 text-[#FF2B44]">
                                {sub.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <Link 
                href="/vimume" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl border border-[#00E5FF]/20 bg-[#00E5FF]/5 text-[#00E5FF] font-syne text-sm font-bold uppercase"
              >
                <span className="flex items-center gap-2"><Activity size={16} /> VIMUME OS</span>
                <span className="font-mono text-[10px] text-white/60">Neuroacústica</span>
              </Link>
            </div>

            <div className="border-t border-white/10 pt-3 flex items-center justify-between font-mono text-xs text-white/60">
              <a href="tel:+34693693048" className="text-[#FF2B44] font-bold">
                Tel: +34 693 693 048
              </a>
              <span>Base: Méntrida (Toledo)</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default SovereignNavbar;