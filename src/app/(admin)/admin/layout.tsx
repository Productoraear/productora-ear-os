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
  Sliders
} from 'lucide-react';
import OracleAmbientInterface from '@/components/admin/OracleAmbientInterface';
import { PROVIDERS_GRAND_TOTAL, formatProviderBadge } from '@/lib/constants/providers-manifest';

const PROVIDERS_BADGE = formatProviderBadge(PROVIDERS_GRAND_TOTAL);

interface NavItem {
  id: string;
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  group: '1. COCKPIT & CORE' | '2. TESORERÍA & LEGAL' | '3. PROSPECCIÓN & FINCAS' | '4. VIMUME & COMERCIAL' | '5. AI & TELEMETRÍA';
}

const NAVIGATION_GROUPS = [
  '1. COCKPIT & CORE',
  '2. TESORERÍA & LEGAL',
  '3. PROSPECCIÓN & FINCAS',
  '4. VIMUME & COMERCIAL',
  '5. AI & TELEMETRÍA'
] as const;

const NAVIGATION_MODULES: NavItem[] = [
  // 1. COCKPIT & CORE
  { id: 'cockpit', name: 'Dashboard Central', href: '/admin', icon: LayoutDashboard, badge: 'CORE', group: '1. COCKPIT & CORE' },
  { id: 'simulador', name: '🗺️ Mapa & Simulador', href: '/admin/simulador', icon: Compass, badge: '21ST.DEV', group: '1. COCKPIT & CORE' },
  { id: 'aura', name: '✨ Aura Showcase', href: '/aura', icon: Sparkles, badge: 'AURA', group: '1. COCKPIT & CORE' },
  { id: 'scheduler', name: '🤖 Qronos Scheduler', href: '/admin/scheduler', icon: Calendar, badge: 'QRONOS', group: '1. COCKPIT & CORE' },

  // 2. TESORERÍA & LEGAL
  { id: 'treasury', name: 'Tesorería & Stripe 100€', href: '/admin/tesoreria', icon: CreditCard, badge: '100€', group: '2. TESORERÍA & LEGAL' },
  { id: 'affiliates', name: 'Red Afiliados Fincas', href: '/admin/afiliados', icon: Share2, badge: 'SPLIT 80/10', group: '2. TESORERÍA & LEGAL' },
  { id: 'b2g', name: 'B2G Licitaciones <14.250€', href: '/admin/licitaciones', icon: Landmark, badge: 'LEGAL', group: '2. TESORERÍA & LEGAL' },
  { id: 'fleet', name: 'Flota & Logística Méntrida', href: '/admin/flota', icon: Truck, badge: 'KM 0', group: '2. TESORERÍA & LEGAL' },

  // 3. PROSPECCIÓN & CRM FINCAS
  { id: 'sclass-pro', name: '👑 S-Class Pro B2B', href: '/pro', icon: Sliders, badge: 'PORTAL', group: '3. PROSPECCIÓN & FINCAS' },
  { id: 'call-center', name: 'Call Center Outbound', href: '/admin/call-center', icon: PhoneCall, badge: PROVIDERS_BADGE, group: '3. PROSPECCIÓN & FINCAS' },
  { id: 'whatsapp', name: 'Centralita WhatsApp', href: '/admin/whatsapp', icon: MessageCircle, badge: '693 048', group: '3. PROSPECCIÓN & FINCAS' },
  { id: 'cult-directory', name: '📁 Directorio & IA', href: '/admin/directorio', icon: Layers, badge: 'CULT UI', group: '3. PROSPECCIÓN & FINCAS' },
  { id: 'sourcing', name: 'Scala Leads & Sourcing', href: '/admin/sourcing', icon: Flame, badge: 'LEADS', group: '3. PROSPECCIÓN & FINCAS' },
  { id: 'providers', name: 'Proveedores Edge CDN', href: '/admin/proveedores', icon: Users, badge: `${PROVIDERS_BADGE} CDN`, group: '3. PROSPECCIÓN & FINCAS' },
  { id: 'calibrador', name: '🎛️ Calibrador Proveedores', href: '/admin/calibrador-proveedores', icon: Sliders, badge: '200D', group: '3. PROSPECCIÓN & FINCAS' },

  // 4. VIMUME & COMERCIAL
  { id: 'training', name: 'Omni Training Center', href: '/admin/training', icon: GraduationCap, badge: 'SALES', group: '4. VIMUME & COMERCIAL' },
  { id: 'manual', name: 'Manual Operaciones 360', href: '/admin/manual-operaciones', icon: BookOpen, badge: 'DOCS', group: '4. VIMUME & COMERCIAL' },

  // 5. AI & TELEMETRÍA
  { id: 'compiler', name: '⚡ Meta-Compiler', href: '/admin/compiler', icon: Zap, badge: 'DAG', group: '5. AI & TELEMETRÍA' },
  { id: 'voice', name: 'Voice Studio IA', href: '/admin/voice-studio', icon: Mic, badge: 'GPU 24GB', group: '5. AI & TELEMETRÍA' },
  { id: 'journey', name: 'Journey Heatmap UX', href: '/admin/journey-heatmap', icon: Compass, badge: 'HEATMAP', group: '5. AI & TELEMETRÍA' },
  { id: 'telemetry', name: 'Telemetría Bare-Metal', href: '/admin/telemetria', icon: Activity, badge: 'OLLAMA', group: '5. AI & TELEMETRÍA' },
  { id: 'sentinel', name: 'Consola Sentinel ZTM', href: '/admin/sentinel', icon: Satellite, badge: 'ZERO-TKN', group: '5. AI & TELEMETRÍA' },
  { id: 'command', name: 'Centro de Mando & Skills', href: '/admin/command-center', icon: Shield, badge: 'ROOT', group: '5. AI & TELEMETRÍA' }
];

export default function CatminAdminMasterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Cerrar drawer móvil al cambiar de ruta
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#030305] text-zinc-100 flex flex-col font-sans antialiased overflow-x-hidden" suppressHydrationWarning>

      {/* ===================================================================== */}
      {/* 1. HEADER SUPERIOR STICKY (ESTILO CATMÍN TEMPLATE 21ST.DEV)           */}
      {/* ===================================================================== */}
      <header className="sticky top-0 z-50 w-full h-14 bg-[#06060a]/90 backdrop-blur-md border-b border-[#1a1a24] px-4 flex items-center justify-between">

        {/* Izquierda: Toggle Sidebar + Separador + Buscador */}
        <div className="flex items-center gap-3">
          {/* Botón Toggle Desktop & Mobile */}
          <button
            onClick={() => {
              if (window.innerWidth < 1024) {
                setMobileOpen(!mobileOpen);
              } else {
                setCollapsed(!collapsed);
              }
            }}
            className="p-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Alternar Menú Lateral"
          >
            <PanelLeft className="w-4 h-4 text-[#ecb613]" />
          </button>

          <div className="hidden sm:block w-[1px] h-5 bg-zinc-800" />

          {/* Buscador Rápido Catmín */}
          <div className="relative hidden md:block w-64 lg:w-80">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar en el sistema... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-xs font-mono bg-zinc-950/80 border border-zinc-800/80 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#ecb613] transition-colors"
            />
          </div>
        </div>

        {/* Centro / Badge de Marca Móvil */}
        <div className="flex md:hidden items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#ecb613] shadow-[0_0_8px_#ecb613]" />
          <span className="text-xs font-bold font-mono tracking-wider text-white">
            EAR OS <span className="text-[#ecb613]">CATMÍN</span>
          </span>
        </div>

        {/* Derecha: Acciones de Estado, Notificaciones, Avatar y Perfil */}
        <div className="flex items-center gap-2">
          {/* Badge Telemetría GPU */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono text-zinc-300">
            <Cpu className="w-3.5 h-3.5 text-[#ecb613]" />
            <span>AMD RX 7900 XTX:</span>
            <span className="text-emerald-400 font-bold">24GB VRAM</span>
          </div>

          {/* Píldora Split Soberano */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#ecb613]/10 border border-[#ecb613]/30 text-[11px] font-mono text-[#ecb613]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ecb613] animate-pulse" />
            <span>SPLIT 80/10/10</span>
          </div>

          {/* Botón Notificaciones */}
          <button
            className="relative p-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="5 Alertas Activas"
          >
            <Bell className="w-4 h-4 text-zinc-300" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ecb613] text-black font-mono font-black text-[9px] flex items-center justify-center shadow-md">
              5
            </span>
          </button>

          <div className="w-[1px] h-5 bg-zinc-800 mx-1" />

          {/* Perfil Usuario Catmín (Edwin Agudelo) */}
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
                CEO & Solista S-Class
              </div>
            </div>
          </Link>

          {/* Enlace Salir a Web Pública */}
          <Link
            href="/"
            className="p-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-cyan-400 transition-colors"
            title="Ir a la Web Pública"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* 2. CUERPO PRINCIPAL (SIDEBAR + CONTENIDO FLEXIBLE)                     */}
      {/* ===================================================================== */}
      <div className="flex flex-1 relative min-h-[calc(100vh-3.5rem)]">

        {/* BACKDROP PARA MÓVILES */}
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}

        {/* =================================================================== */}
        {/* SIDEBAR CATMÍN RESPONSIVE                                           */}
        {/* =================================================================== */}
        <aside
          className={`fixed lg:sticky top-14 h-[calc(100vh-3.5rem)] bg-[#050508] border-r border-[#1a1a24] z-50 transition-all duration-300 flex flex-col justify-between overflow-hidden ${mobileOpen ? 'left-0 w-72 shadow-2xl' : '-left-72 lg:left-0'
            } ${collapsed ? 'lg:w-16' : 'lg:w-64'
            }`}
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
                    v7.0 Bare-Metal
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

          {/* Menú de Navegación Scrolleable por 5 Bloques */}
          <nav className="flex-1 overflow-y-auto p-2 space-y-4 custom-scrollbar">
            {NAVIGATION_GROUPS.map((groupName) => {
              const groupItems = NAVIGATION_MODULES.filter(m => m.group === groupName);
              const isColl = collapsed && !mobileOpen;

              return (
                <div key={groupName} className="space-y-1">
                  {!isColl && (
                    <div className="px-2 pt-2 pb-1 text-[9px] font-mono font-black uppercase tracking-widest text-[#ecb613]/70 border-b border-white/5">
                      {groupName}
                    </div>
                  )}
                  {groupItems.map((item) => {
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

        {/* =================================================================== */}
        {/* ÁREA DE CONTENIDO PRINCIPAL (NUNCA EXPULSADA FUERA DE PANTALLA)     */}
        {/* =================================================================== */}
        <main className="flex-1 min-w-0 bg-[#030305] p-4 sm:p-6 lg:p-8 relative overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Oráculo Flotante S-Class */}
      <OracleAmbientInterface />
    </div>
  );
}