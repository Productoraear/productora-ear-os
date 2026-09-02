"use client";

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, Menu, X, Command, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSharedContext } from '@/app/context/SharedContext';
import { useSovereignRole } from '@/shared/hooks/useSovereignRole';

import { usePathname } from 'next/navigation';

const SovereignNavbar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSearchOpen, setIsSearchOpen } = useSharedContext();
  const { scrollY } = useScroll();
  const { role, isAdmin } = useSovereignRole();

  // Efectos Parallax y Contraste Dinámico (declarados incondicionalmente)
  const navY = useTransform(scrollY, [0, 300], [0, -5]); 
  const shadowOpacity = useTransform(scrollY, [0, 100], [0.1, 0.8]);

  // Omni-Search Shortcut Listener (declarado incondicionalmente)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // En la raíz inicial y en rutas de administración (/admin) no se muestra la barra pública
  if (pathname === '/' || pathname?.startsWith('/admin')) {
    return null;
  }

  // Configuración de Estilo por Rol
  const roleStyles: Record<string, string> = {
    ROLE_B2G: "border-blue-500/30 bg-[#0a1128]/70 shadow-[0_0_30px_rgba(59,130,246,0.2)]",
    ROLE_B2B: "border-[#ecb613]/20 bg-[#050505]/70 shadow-[0_0_30px_rgba(236,182,19,0.1)]",
    ROLE_B2C: "border-pink-500/20 bg-[#0f0a0a]/70 shadow-[0_0_30px_rgba(236,72,153,0.1)]",
    ROLE_ADMIN: "border-red-500/40 bg-black/80 shadow-[0_0_40px_rgba(239,68,68,0.3)]",
    ROLE_GUEST: "border-[#ecb613]/20 bg-[#050505]/70",
    ROLE_ARTIST: "border-purple-500/20 bg-[#0a0f0a]/70",
    ROLE_PROVIDER: "border-green-500/20 bg-[#0a0f0a]/70",
    ROLE_AFFILIATE: "border-orange-500/20 bg-[#0a0f0a]/70",
    ROLE_CLIENT: "border-[#ecb613]/20 bg-[#050505]/70"
  };

  return (
    <motion.header 
      style={{ y: navY }}
      className="fixed top-0 left-0 w-full z-[100] px-4 py-4 md:px-10"
    >
      <motion.nav 
        style={{ boxShadow: `0 20px 40px -10px rgba(0,0,0, ${shadowOpacity.get()})` }}
        className={cn(
          "max-w-7xl mx-auto flex items-center justify-between px-6 py-3 transition-all duration-700 rounded-full border backdrop-blur-2xl",
          roleStyles[role] || roleStyles.ROLE_GUEST
        )}
      >
        {/* LOGO & BRAND */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className={cn(
            "w-10 h-10 rounded-full overflow-hidden border p-0.5 flex items-center justify-center transition-transform group-hover:scale-105",
            role === 'ROLE_B2G' ? "border-blue-400/60 shadow-[0_0_20px_rgba(59,130,246,0.4)]" : "border-[#ecb613]/60 shadow-[0_0_20px_rgba(236,182,19,0.4)]"
          )}>
            <img 
              src="https://lh3.googleusercontent.com/a/ACg8ocJF7O8ZaJG4WsLPfVaVe5f5Gmu80nOoea2teuOAs-s9sq53uNk=s288-c-no" 
              alt="EAR OS Logo" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span className="text-lg md:text-xl font-bold font-syne tracking-tighter text-white">
            {role === 'ROLE_B2G' ? "EarOS B2G" : "EarOS"}
          </span>
        </Link>

        {/* RUTAS S-CLASS & VIMUME */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/eventos" className="text-sm font-medium text-white/80 hover:text-[#ecb613] transition-colors uppercase tracking-widest">Producción</Link>
          <Link href="/artistas" className="text-sm font-medium text-white/80 hover:text-[#ecb613] transition-colors uppercase tracking-widest">Artistas</Link>
          
          {/* VIMUME HIGHLIGHT (Adapta color según rol) */}
          <Link href="/vimume" className={cn(
            "flex items-center gap-2 text-sm font-bold text-white bg-white/5 px-4 py-1.5 rounded-full border transition-all uppercase tracking-widest",
            role === 'ROLE_B2G' ? "border-blue-400/50 bg-blue-500/10 hover:bg-blue-500/20" : "border-white/10 hover:border-[#ecb613]/50 hover:bg-[#ecb613]/10"
          )}>
            <Activity size={14} className={role === 'ROLE_B2G' ? "text-blue-400" : "text-[#ecb613]"} />
            <span>VIMUME</span>
          </Link>
        </div>

        {/* OMNI-SEARCH & WALLET */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            className="flex items-center gap-2 bg-black/50 border border-white/10 hover:border-[#ecb613]/50 px-4 py-2 rounded-full text-white/50 text-sm transition-all group"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search size={14} className="group-hover:text-[#ecb613] transition-colors" />
            <span>Buscar servicio...</span>
            <kbd className="ml-2 bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono text-white/70">⌘K</kbd>
          </button>

          {/* NEXUS & LOGOUT (Solo visible para Admin o B2B identificados) */}
          {(isAdmin || role === 'ROLE_B2B' || role === 'ROLE_ADMIN') && (
            <div className="flex items-center gap-2">
              <Link href="/admin" className="px-5 py-2 bg-gradient-to-r from-[#ecb613] to-[#b38805] text-black rounded-full font-bold text-xs hover:scale-105 shadow-[0_0_15px_rgba(236,182,19,0.3)] transition-all uppercase tracking-widest">
                ADMIN
              </Link>
              <button 
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' });
                  document.cookie = 'ear_auth_signal=; path=/; max-age=0';
                  document.cookie = 'ear_os_auth_token=; path=/; max-age=0';
                  window.location.href = '/login';
                }}
                className="px-3 py-2 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-400 rounded-full text-xs font-mono transition-all"
                title="Cerrar Sesión"
              >
                Salir
              </button>
            </div>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button className="md:hidden text-white hover:text-[#ecb613] transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.nav>

      {/* MOBILE MENU (Drop-down contrastado) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-4 right-4 bg-[#050505]/95 backdrop-blur-3xl border border-[#ecb613]/20 rounded-2xl p-6 flex flex-col gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)] md:hidden"
          >
            <button 
              className="flex items-center justify-between bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white/70 text-sm"
              onClick={() => {
                setIsSearchOpen(true);
                setMobileMenuOpen(false);
              }}
            >
              <span className="flex items-center gap-2"><Search size={16} /> Buscar en el ecosistema...</span>
            </button>
            <hr className="border-white/10" />
            <Link href="/eventos" className="text-lg font-bold text-white hover:text-[#ecb613] uppercase tracking-tighter">Producción</Link>
            <Link href="/artistas" className="text-lg font-bold text-white hover:text-[#ecb613] uppercase tracking-tighter">Artistas</Link>
            <Link href="/vimume" className="text-lg font-bold text-[#ecb613] flex items-center gap-2 uppercase tracking-tighter"><Activity size={18} /> VIMUME</Link>
            <hr className="border-white/10" />
            {(isAdmin || role === 'ROLE_B2B') && (
              <Link href="/dashboard" className="text-center py-3 bg-[#ecb613] text-black rounded-xl font-bold uppercase tracking-widest">ENTRAR AL PANEL</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default SovereignNavbar;