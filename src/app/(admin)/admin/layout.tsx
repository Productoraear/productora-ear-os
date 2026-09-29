"use client";

import React, { useState, useEffect } from 'react';
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
  Swords
} from 'lucide-react';
import OracleAmbientInterface from '@/components/admin/OracleAmbientInterface';
import { PROVIDERS_GRAND_TOTAL, formatProviderBadge } from '@/lib/constants/providers-manifest';

const PROVIDERS_BADGE = formatProviderBadge(PROVIDERS_GRAND_TOTAL);

interface SubTab {
  id: string;
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  description: string;
}

interface MasterTab {
  id: string;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  subTabs: SubTab[];
}

const MASTER_TABS: MasterTab[] = [
  {
    id: 'prospeccion',
    title: '🎯 Prospección & Leads',
    shortTitle: 'Prospección',
    icon: Compass,
    badge: 'LEADS',
    subTabs: [
      { id: 'mailerfind', name: '🎯 Mailerfind MCP Leads', href: '/admin/mailerfind', icon: Compass, badge: 'INSTAGRAM + MAPS', description: 'Extracción orgánica de @bodasnet y Google Maps' },
      { id: 'sclass-pro', name: '👑 Portal S-Class Pro', href: '/pro', icon: Sliders, badge: 'B2B', description: 'Portal directo de proveedores y fincas' },
      { id: 'sourcing', name: '🔥 Scala Leads & Sourcing', href: '/admin/sourcing', icon: Flame, badge: 'RADAR', description: 'Radar de nuevos negocios y prospección' },
      { id: 'cult-directory', name: '📁 Directorio & IA', href: '/admin/directorio', icon: Layers, badge: 'CULT UI', description: 'Directorio canónico asistido por IA' },
      { id: 'calibrador', name: '🎛️ Calibrador Proveedores', href: '/admin/calibrador-proveedores', icon: Sliders, badge: '200D', description: 'Calibración de especificaciones técnicas' }
    ]
  },
  {
    id: 'arena',
    title: '⚔️ Arena AI & Optimización',
    shortTitle: 'Arena AI',
    icon: Swords,
    badge: 'ELO K=32',
    subTabs: [
      { id: 'arena-main', name: '⚔️ Arena AI Elo Torneo', href: '/admin/arena', icon: Swords, badge: 'BATALLAS', description: 'Torneo Elo de conversión de copy y diseño' },
      { id: 'compiler', name: '⚡ Meta-Compiler DAG', href: '/admin/compiler', icon: Zap, badge: 'INTENT', description: 'Compilador semántico de intenciones' },
      { id: 'voice', name: '🎙️ Voice Studio IA', href: '/admin/voice-studio', icon: Mic, badge: '24GB VRAM', description: 'Estudio de síntesis vocal y microfonía' },
      { id: 'journey', name: '🧭 Journey Heatmap UX', href: '/admin/journey-heatmap', icon: Compass, badge: 'HEATMAP', description: 'Telemetría de navegación y puntos de fricción' },
      { id: 'aura', name: '✨ Aura Showcase', href: '/aura', icon: Sparkles, badge: 'DISEÑO', description: 'Catálogo de componentes visuales S-Class' }
    ]
  },
  {
    id: 'crm',
    title: '📞 Call Center & Red B2B',
    shortTitle: 'Call Center',
    icon: PhoneCall,
    badge: 'CRM',
    subTabs: [
      { id: 'call-center', name: '📞 Call Center Outbound', href: '/admin/call-center', icon: PhoneCall, badge: PROVIDERS_BADGE, description: 'Despacho de llamadas y cola de prospección' },
      { id: 'whatsapp', name: '💬 Centralita WhatsApp', href: '/admin/whatsapp', icon: MessageCircle, badge: '693 048', description: 'Recepción y cierre directo por WhatsApp' },
      { id: 'affiliates', name: '🏰 Red Afiliados Fincas', href: '/admin/afiliados', icon: Share2, badge: 'SPLIT 80/10', description: 'Gestión de fincas homologadas y comisiones' },
      { id: 'providers', name: '👥 Proveedores Edge CDN', href: '/admin/proveedores', icon: Users, badge: '75k CDN', description: 'Catálogo indexado de proveedores nacionales' },
      { id: 'simulador', name: '🗺️ Mapa & Simulador', href: '/admin/simulador', icon: Compass, badge: 'SIMULADOR', description: 'Simulación de rutas y logística de bodas' }
    ]
  },
  {
    id: 'b2g',
    title: '🏛️ Licitaciones & VIMUME',
    shortTitle: 'B2G & Social',
    icon: Landmark,
    badge: '<14.250€',
    subTabs: [
      { id: 'b2g-licitaciones', name: '🏛️ B2G Contratos Menores', href: '/admin/licitaciones', icon: Landmark, badge: 'ART. 118', description: 'Licitaciones menores de festejos y cultura' },
      { id: 'training', name: '🎓 Omni Training Center', href: '/admin/training', icon: GraduationCap, badge: 'SALES', description: 'Academia y formación de closers' },
      { id: 'manual', name: '📖 Manual Operaciones 360', href: '/admin/manual-operaciones', icon: BookOpen, badge: 'DOCS', description: 'Documentación viva de la productora' }
    ]
  },
  {
    id: 'tesoreria',
    title: '💳 Tesorería & Logística',
    shortTitle: 'Tesorería',
    icon: CreditCard,
    badge: '100€ STRIPE',
    subTabs: [
      { id: 'treasury', name: '💳 Tesorería & Stripe 100€', href: '/admin/tesoreria', icon: CreditCard, badge: 'PRICE-LOCK', description: 'Cobro de fianzas y depósitos de garantía' },
      { id: 'fleet', name: '🚚 Flota & Hub Méntrida', href: '/admin/flota', icon: Truck, badge: 'LOGÍSTICA', description: 'Vehículos y material técnico de Productora EAR' },
      { id: 'scheduler', name: '🤖 Qronos Scheduler', href: '/admin/scheduler', icon: Calendar, badge: 'CRON', description: 'Automatización de tareas programadas' },
      { id: 'cockpit', name: '📊 Dashboard Central', href: '/admin', icon: LayoutDashboard, badge: 'CORE', description: 'Panel principal de métricas y ventas' }
    ]
  },
  {
    id: 'telemetria',
    title: '🛰️ Telemetría & Sentinel',
    shortTitle: 'Gobernanza',
    icon: Satellite,
    badge: 'BARE-METAL',
    subTabs: [
      { id: 'telemetry', name: '📊 Telemetría Bare-Metal', href: '/admin/telemetria', icon: Activity, badge: 'OLLAMA', description: 'Monitorización de GPU y modelos locales' },
      { id: 'sentinel', name: '🛰️ Consola Sentinel ZTM', href: '/admin/sentinel', icon: Satellite, badge: 'ZERO-TKN', description: 'Vigilancia de memoria y árbol de Git' },
      { id: 'command', name: '🛡️ Centro de Mando & Skills', href: '/admin/command-center', icon: Shield, badge: 'ROOT', description: 'Auditoría de skills y directivas de gobernanza' }
    ]
  }
];

export default function CatminAdminMasterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabId, setActiveTabId] = useState<string>('prospeccion');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Sincronizar automáticamente la pestaña activa según la URL actual
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdownId(null);

    for (const tab of MASTER_TABS) {
      if (tab.subTabs.some(st => st.href === pathname || (st.href !== '/admin' && pathname.startsWith(st.href)))) {
        setActiveTabId(tab.id);
        break;
      }
    }
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
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#181824] to-[#0a0a10] border border-[#ecb613]/40 flex items-center justify-center shadow-[0_0_10px_rgba(236,182,19,0.15)]">
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

            {/* Buscador Rápido */}
            <div className="relative hidden md:block w-56 lg:w-72">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar herramientas... (Ctrl+K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs font-mono bg-zinc-950/80 border border-zinc-800/80 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#ecb613] transition-colors"
              />
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
              className="p-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-cyan-400 transition-colors"
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
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold tracking-tight transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#ecb613] text-black shadow-[0_0_12px_rgba(236,182,19,0.3)]'
                        : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-[#ecb613]'}`} />
                    <span>{tab.title}</span>
                    <span className={`text-[9px] px-1 py-0.2 rounded border ${
                      isSelected
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
                          className={`flex items-start gap-2.5 p-2 rounded-xl text-xs transition-colors group ${
                            isSubActive
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
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono shrink-0 transition-all ${
                  isSubActive
                    ? 'bg-[#ecb613]/20 text-[#ecb613] font-bold border border-[#ecb613]/50 shadow-[0_0_8px_rgba(236,182,19,0.2)]'
                    : 'bg-zinc-950/70 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800/60'
                }`}
              >
                <SubIcon className={`w-3.5 h-3.5 ${isSubActive ? 'text-[#ecb613]' : 'text-zinc-500'}`} />
                <span>{sub.name}</span>
                <span className={`text-[9px] px-1 py-0.2 rounded border ${
                  isSubActive
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
          className={`fixed lg:sticky top-28 h-[calc(100vh-7rem)] bg-[#050508] border-r border-[#1a1a24] z-40 transition-all duration-300 flex flex-col justify-between overflow-hidden ${
            mobileOpen ? 'left-0 w-72 shadow-2xl' : '-left-72 lg:left-0'
          } ${collapsed ? 'lg:w-16' : 'lg:w-64'}`}
        >
          {/* Header del Sidebar con Marca */}
          <div className="p-3 border-b border-[#1a1a24] flex items-center justify-between">
            {(!collapsed || mobileOpen) ? (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#141420] to-[#0a0a10] border border-[#ecb613]/30 flex items-center justify-center shrink-0 shadow-sm">
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
                        className={`flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs transition-all group ${
                          isActive
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
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ml-1.5 shrink-0 ${
                                isActive
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
          {children}
        </main>
      </div>

      {/* Oráculo Flotante S-Class */}
      <OracleAmbientInterface />
    </div>
  );
}