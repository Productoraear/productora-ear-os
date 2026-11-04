"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Flame,
  Users,
  Truck,
  Share2,
  Landmark,
  CreditCard,
  Mic,
  Activity,
  Shield,
  PhoneCall,
  Compass,
  GraduationCap,
  Zap,
  MessageCircle,
  Satellite,
  Sparkles,
  PanelLeft,
  Search,
  Globe,
  Bell,
  User,
  LogOut,
  ChevronDown,
  ChevronsUpDown,
  X,
  Cpu,
  Radio,
  ExternalLink,
  Calendar,
  BookOpen,
  Layers,
  Sliders,
  Swords,
  FileText
} from 'lucide-react';
import OracleAmbientInterface from '@/components/admin/OracleAmbientInterface';
import { AdminSessionBridge } from '@/components/admin/AdminSessionBridge';
import { SilentPanicDetector } from '@/components/security/SilentPanicDetector';
import {
  ADMIN_MASTER_TABS,
  getAdminTabByPathname,
  searchAdminNav,
} from '@/lib/config/admin-navigation';

// Navegación del cockpit: ÚNICA fuente en `@/lib/config/admin-navigation`.
// Prohibido volver a declarar arrays de pestañas/módulos en este componente.
const MASTER_TABS = ADMIN_MASTER_TABS;

export default function CatminAdminMasterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeTabId, setActiveTabId] = useState<string>('prospeccion');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Resultados del buscador: derivados del SSOT de navegación, nunca de listas paralelas.
  const searchResults = useMemo(() => searchAdminNav(searchQuery, 8), [searchQuery]);

  // Atajo REAL ⌘K / Ctrl+K (antes el placeholder prometía un atajo inexistente).
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
        setSearchOpen(true);
        return;
      }
      if (event.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Sincronizar automáticamente la pestaña activa según la URL actual
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdownId(null);
    setSearchOpen(false);
    setSearchQuery('');
    setActiveTabId(getAdminTabByPathname(pathname).id);
  }, [pathname]);

  const currentTab = MASTER_TABS.find(t => t.id === activeTabId) || MASTER_TABS[0];

  return (
    <div className="min-h-screen bg-[#030305] text-zinc-100 flex flex-col font-sans antialiased overflow-x-hidden" suppressHydrationWarning>

      {/* ===================================================================== */}
      {/* 1. HEADER SUPERIOR STICKY                                             */}
      {/* ===================================================================== */}
      <header className="sticky top-0 z-50 w-full bg-[#06060a]/95 backdrop-blur-md border-b border-[#1a1a24] px-4 flex flex-col justify-center">

        {/* FILA 1: LOGO, BUSCADOR, STATUS GPU & PERFIL */}
        <div className="h-14 flex items-center justify-between gap-3 border-b border-white/[0.04]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setMobileOpen(!mobileOpen);
                } else {
                  setCollapsed(!collapsed);
                }
              }}
              className="p-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Alternar Menú Lateral"
            >
              <PanelLeft className="w-4 h-4 text-[#ecb613]" />
            </button>

            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#0d0d10] border border-[#ecb613]/40 flex items-center justify-center shadow-[0_0_10px_rgba(236,182,19,0.15)]">
                <span className="text-[#ecb613] font-mono font-black text-xs">EAR</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-white font-mono tracking-wider">
                  EAR OS <span className="text-[#ecb613]">MASTER COCKPIT</span>
                </div>
                <div className="text-[10px] font-mono text-zinc-400">
                  Sistema de Navegación por Pestañas & Sub-Menús
                </div>
              </div>
            </Link>

            <div className="hidden md:block w-[1px] h-5 bg-zinc-800 mx-1" />

            {/* Buscador Soberano (⌘K / Ctrl+K) — navegación real, 0 clics muertos */}
            <div className="relative hidden md:block w-56 lg:w-72">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar herramientas... (Ctrl+K)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setSearchOpen(false);
                    e.currentTarget.blur();
                  }
                  if (e.key === 'Enter' && searchResults.length > 0) {
                    window.location.assign(searchResults[0].href);
                  }
                }}
                aria-label="Buscar módulos del cockpit EAR OS"
                aria-expanded={searchOpen}
                aria-controls="admin-cockpit-search-results"
                className="w-full h-8 pl-8 pr-12 text-xs font-mono bg-black/60 border border-white/10 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#ecb613] transition-colors"
              />
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-white/10 px-1 text-[10px] font-mono text-zinc-500">
                Ctrl K
              </span>

              {searchOpen && (
                <div
                  id="admin-cockpit-search-results"
                  role="listbox"
                  aria-label="Resultados del buscador del cockpit"
                  className="absolute left-0 top-full z-50 mt-2 max-h-80 w-[22rem] overflow-y-auto rounded-xl border border-[#ecb613]/30 bg-[#09090f] p-1.5 shadow-2xl custom-scrollbar"
                >
                  {searchResults.length === 0 ? (
                    <p className="px-3 py-2 text-[11px] font-mono text-zinc-500">
                      Sin resultados. Prueba «tesorería», «licitaciones» o «proveedores».
                    </p>
                  ) : (
                    searchResults.map((result) => {
                      const ResultIcon = result.icon;
                      return (
                        <Link
                          key={`${result.tabId}-${result.id}`}
                          href={result.href}
                          role="option"
                          aria-selected={pathname === result.href}
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="flex items-start gap-2 rounded-lg px-2 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-zinc-800/80 hover:text-white"
                        >
                          <ResultIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#ecb613]" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate">{result.name}</span>
                            <span className="block truncate text-[10px] font-mono text-zinc-500">
                              {result.tabTitle} · {result.href}
                            </span>
                          </span>
                        </Link>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* DERECHA: TELEMETRÍA Y PERFIL */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono text-zinc-300">
              <Cpu className="w-3.5 h-3.5 text-[#ecb613]" />
              <span>GPU RX 7900 XTX:</span>
              <span className="text-emerald-400 font-bold">24GB VRAM</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#ecb613]/10 border border-[#ecb613]/30 text-[11px] font-mono text-[#ecb613]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ecb613] animate-pulse" />
              <span>SPLIT 80/10/10</span>
            </div>

            <Link
              href="/admin/command-center"
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-zinc-900 transition-colors group"
              title="Perfil de Edwin Agudelo (CEO)"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#ecb613] to-amber-200 text-black font-black text-xs flex items-center justify-center shadow-sm">
                EA
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-bold text-white group-hover:text-[#ecb613] transition-colors leading-none">
                  Edwin Agudelo
                </div>
                <div className="text-[10px] font-mono text-zinc-500 leading-none mt-1">
                  CEO · Productora EAR
                </div>
              </div>
            </Link>

            <Link
              href="/"
              className="p-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-[#ecb613] transition-colors"
              title="Ir a la Web Pública"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* FILA 2: BARRA DE PESTAÑAS MAESTRAS (TOP TABS RIBBON)                  */}
        {/* ===================================================================== */}
        <div className="py-2 flex items-center gap-1.5 overflow-x-auto custom-scrollbar relative">
          {MASTER_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTabId === tab.id;
            const isDropdownOpen = openDropdownId === tab.id;

            return (
              <div key={tab.id} className="relative shrink-0">
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      setActiveTabId(tab.id);
                      setOpenDropdownId(openDropdownId === tab.id ? null : tab.id);
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold tracking-tight transition-all cursor-pointer ${isSelected
                      ? 'bg-[#ecb613] text-black shadow-[0_0_12px_rgba(236,182,19,0.3)]'
                      : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800'
                      }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-[#ecb613]'}`} />
                    <span>{tab.title}</span>
                    <span className={`text-[9px] px-1 py-0.2 rounded border ${isSelected
                      ? 'bg-black/20 border-black/30 text-black'
                      : 'bg-black/40 border-white/10 text-zinc-400'
                      }`}>
                      {tab.badge}
                    </span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* DROPDOWN SUB-MENÚ FLOTANTE */}
                {isDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-72 p-2 bg-[#09090f] border border-[#ecb613]/30 rounded-2xl shadow-2xl z-50 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-mono text-[#ecb613] font-bold uppercase tracking-wider border-b border-white/5 flex items-center justify-between">
                      <span>Sub-menús de {tab.shortTitle}</span>
                      <span className="text-zinc-500">{tab.subTabs.length} módulos</span>
                    </div>

                    {tab.subTabs.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = pathname === sub.href;

                      return (
                        <Link
                          key={sub.id}
                          href={sub.href}
                          onClick={() => setOpenDropdownId(null)}
                          className={`flex items-start gap-2.5 p-2 rounded-xl text-xs transition-colors group ${isSubActive
                            ? 'bg-[#ecb613]/15 text-[#ecb613] font-bold border border-[#ecb613]/30'
                            : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                            }`}
                        >
                          <SubIcon className={`w-4 h-4 mt-0.5 shrink-0 ${isSubActive ? 'text-[#ecb613]' : 'text-zinc-400 group-hover:text-[#ecb613]'}`} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="truncate">{sub.name}</span>
                              <span className="text-[9px] font-mono text-zinc-500 group-hover:text-zinc-300">{sub.badge}</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">{sub.description}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ===================================================================== */}
        {/* FILA 3: BARRA DE SUB-PESTAÑAS DINÁMICA (SUB-TABS DIRECTAS)            */}
        {/* ===================================================================== */}
        <div className="py-2 border-t border-white/[0.04] flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase shrink-0 mr-1">
            {currentTab.shortTitle} →
          </span>
          {currentTab.subTabs.map((sub) => {
            const SubIcon = sub.icon;
            const isSubActive = pathname === sub.href;

            return (
              <Link
                key={sub.id}
                href={sub.href}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono shrink-0 transition-all ${isSubActive
                  ? 'bg-[#ecb613]/20 text-[#ecb613] font-bold border border-[#ecb613]/50 shadow-[0_0_8px_rgba(236,182,19,0.2)]'
                  : 'bg-zinc-950/70 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800/60'
                  }`}
              >
                <SubIcon className={`w-3.5 h-3.5 ${isSubActive ? 'text-[#ecb613]' : 'text-zinc-500'}`} />
                <span>{sub.name}</span>
                <span className={`text-[9px] px-1 py-0.2 rounded border ${isSubActive
                  ? 'bg-[#ecb613]/30 border-[#ecb613]/40 text-[#ecb613]'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                  }`}>
                  {sub.badge}
                </span>
              </Link>
            );
          })}
        </div>

      </header>

      {/* ===================================================================== */}
      {/* 2. CUERPO PRINCIPAL (SIDEBAR + CONTENIDO FLEXIBLE)                     */}
      {/* ===================================================================== */}
      <div className="flex flex-1 relative min-h-[calc(100vh-7rem)]">

        {/* BACKDROP PARA MÓVILES */}
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}

        {/* SIDEBAR CATMÍN RESPONSIVE */}
        <aside
          className={`fixed lg:sticky top-28 h-[calc(100vh-7rem)] bg-[#050508] border-r border-[#1a1a24] z-40 transition-all duration-300 flex flex-col justify-between overflow-hidden ${mobileOpen ? 'left-0 w-72 shadow-2xl' : '-left-72 lg:left-0'
            } ${collapsed ? 'lg:w-16' : 'lg:w-64'}`}
        >
          {/* Header del Sidebar con Marca */}
          <div className="p-3 border-b border-[#1a1a24] flex items-center justify-between">
            {(!collapsed || mobileOpen) ? (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0d0d10] border border-[#ecb613]/30 flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-[#ecb613] font-mono font-black text-xs">EAR</span>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white font-mono truncate">
                    CATMİN <span className="text-[#ecb613]">S-CLASS</span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500 truncate">
                    Navegación 2050
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 mx-auto rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center">
                <span className="text-[#ecb613] font-mono font-bold text-xs">E</span>
              </div>
            )}

            {mobileOpen && (
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white lg:hidden"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Menú de Navegación Scrolleable agrupado por Pestañas */}
          <nav className="flex-1 overflow-y-auto p-2 space-y-4 custom-scrollbar">
            {MASTER_TABS.map((tab) => {
              const isColl = collapsed && !mobileOpen;

              return (
                <div key={tab.id} className="space-y-1">
                  {!isColl && (
                    <div className="px-2 pt-2 pb-1 text-[9px] font-mono font-black uppercase tracking-widest text-[#ecb613]/70 border-b border-white/5 flex items-center justify-between">
                      <span>{tab.title}</span>
                      <span className="text-zinc-600">{tab.subTabs.length}</span>
                    </div>
                  )}
                  {tab.subTabs.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs transition-all group ${isActive
                          ? 'bg-[#ecb613]/15 text-[#ecb613] font-bold border border-[#ecb613]/30 shadow-[0_0_12px_rgba(236,182,19,0.1)]'
                          : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 border border-transparent'
                          }`}
                        title={isColl ? item.name : undefined}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#ecb613]' : 'group-hover:text-[#ecb613] transition-colors'}`} />

                        {!isColl && (
                          <div className="flex items-center justify-between w-full min-w-0">
                            <span className="truncate">{item.name}</span>
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ml-1.5 shrink-0 ${isActive
                                ? 'bg-[#ecb613]/20 border-[#ecb613]/40 text-[#ecb613]'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-500 group-hover:text-zinc-300'
                                }`}
                            >
                              {item.badge}
                            </span>
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </nav>

          {/* Footer del Sidebar Catmín (Perfil Edwin Agudelo) */}
          <div className="p-3 border-t border-[#1a1a24] bg-[#030305]">
            {(!collapsed || mobileOpen) ? (
              <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/80 border border-zinc-900">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-zinc-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    EA
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="text-[11px] font-bold text-white truncate">
                      Edwin Agudelo
                    </div>
                    <div className="text-[9px] font-mono text-zinc-500 truncate">
                      edwin@productoraear.com
                    </div>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Online" />
              </div>
            ) : (
              <div className="flex justify-center py-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400" title="Sistema Soberano Activo" />
              </div>
            )}
          </div>
        </aside>

        {/* ÁREA DE CONTENIDO PRINCIPAL */}
        <main className="flex-1 min-w-0 bg-[#030305] p-4 sm:p-6 lg:p-8 relative overflow-y-auto">
          {/* Puente de sesión: mantiene __session/ear_role sincronizadas con Firebase */}
          <AdminSessionBridge />
          {children}
        </main>
      </div>

      {/* Oráculo Flotante S-Class */}
      <OracleAmbientInterface />
      
      {/* Sensor de Emergencia SOS Silencioso e Indetectable (40s ratón / 60s táctil) */}
      <SilentPanicDetector />
    </div>
  );
}