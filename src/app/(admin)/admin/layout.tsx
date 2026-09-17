"use client";

import React, { useState } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Zap,
  MessageCircle,
  Satellite
} from 'lucide-react';
import OracleAmbientInterface from '@/components/admin/OracleAmbientInterface';

const NAVIGATION_MODULES = [
  { id: 'cockpit', name: 'Omni-Cockpit Central', href: '/admin', icon: LayoutDashboard, badge: 'CORE' },
  { id: 'simulador', name: '🗺️ Mapa & Simulador EAR OS', href: '/admin/simulador', icon: Compass, badge: '21ST.DEV' },
  { id: 'call-center', name: 'Call Center Outbound', href: '/admin/call-center', icon: PhoneCall, badge: '45.6K' },
  { id: 'whatsapp', name: 'Centralita WhatsApp', href: '/admin/whatsapp', icon: MessageCircle, badge: '693 048' },
  { id: 'sourcing', name: 'Scala Leads & Sourcing', href: '/admin/sourcing', icon: Flame, badge: 'LEADS' },
  { id: 'providers', name: 'Proveedores (Edge CDN)', href: '/admin/proveedores', icon: Users, badge: '2.3K CDN' },
  { id: 'b2g', name: 'B2G & Licitaciones <14.250€', href: '/admin/licitaciones', icon: Landmark, badge: 'LEGAL' },
  { id: 'fleet', name: 'Flota & Logística en Vivo', href: '/admin/flota', icon: Truck, badge: 'KM 0' },
  { id: 'affiliates', name: 'Red de Afiliados', href: '/admin/afiliados', icon: Share2, badge: 'SPLIT' },
  { id: 'treasury', name: 'Tesorería & Stripe', href: '/admin/tesoreria', icon: CreditCard, badge: '100€' },
  { id: 'compiler', name: '⚡ Meta-Compiler (Vibe Coding)', href: '/admin/compiler', icon: Zap, badge: 'DAG' },
  { id: 'voice', name: 'Voice Studio IA', href: '/admin/voice-studio', icon: Mic, badge: 'GPU' },
  { id: 'journey', name: 'Journey Heatmap UX', href: '/admin/journey-heatmap', icon: Compass, badge: 'HEATMAP' },
  { id: 'training', name: 'Omni Training Center', href: '/admin/training', icon: GraduationCap, badge: 'SALES' },
  { id: 'telemetry', name: 'Telemetría Bare-Metal', href: '/admin/telemetria', icon: Activity, badge: 'OLLAMA' },
  { id: 'sentinel', name: 'Consola Sentinel', href: '/admin/sentinel', icon: Satellite, badge: 'ZERO-TKN' },
  { id: 'command', name: 'Centro de Mando & Skills', href: '/admin/command-center', icon: Shield, badge: 'ROOT' }
];

export default function AdminMasterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#030305] text-zinc-100 flex overflow-x-hidden font-sans">
      {/* Sidebar OLED */}
      <aside
        className={`sticky top-0 h-screen bg-[#050508] border-r border-[#1a1a24] transition-all duration-300 z-40 flex flex-col justify-between ${
          collapsed ? 'w-20' : 'w-72'
        }`}
      >
        <div>
          {/* Header Marca */}
          <div className="h-16 border-b border-[#1a1a24] flex items-center justify-between px-4">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ecb613] shadow-[0_0_8px_#ecb613]" />
                <span className="font-bold tracking-wider text-sm text-white font-mono">
                  EAR OS <span className="text-[#ecb613]">S-CLASS</span>
                </span>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-[#ecb613]/50 transition-colors mx-auto"
              title={collapsed ? "Expandir panel" : "Colapsar panel"}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navegación 10 Módulos */}
          <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)]">
            {NAVIGATION_MODULES.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/30 shadow-[0_0_15px_rgba(236,182,19,0.15)] font-semibold'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 border border-transparent'
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#ecb613]' : 'group-hover:text-[#ecb613] transition-colors'}`} />
                  {!collapsed && (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs truncate">{item.name}</span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
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
          </nav>
        </div>

        {/* Footer Soberano */}
        <div className="p-3 border-t border-[#1a1a24] bg-[#030305]">
          {!collapsed ? (
            <div className="text-[10px] font-mono text-zinc-500 flex flex-col gap-1">
              <div className="flex justify-between">
                <span>SOBERANÍA:</span>
                <span className="text-emerald-400">BARE-METAL</span>
              </div>
              <div className="flex justify-between">
                <span>SPLIT:</span>
                <span className="text-[#ecb613]">80 / 10 / 10</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-400" title="Sistema Soberano Activo" />
            </div>
          )}
        </div>
      </aside>

      {/* Área Principal de Contenido */}
      <main className="flex-1 min-w-0 bg-[#030305] p-6 lg:p-8 relative">
        {children}
      </main>

      {/* Oráculo Flotante S-Class */}
      <OracleAmbientInterface />
    </div>
  );
}