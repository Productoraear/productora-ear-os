"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Crown, LayoutGrid, Database, Users, Landmark, 
  ShieldCheck, Activity, Layers, ChevronDown, 
  Briefcase, Percent, FileText, Zap, Settings,
  Radio, Sliders, BrainCircuit, Search, Music,
  Sparkles, Lock, ArrowUpRight, FolderGit2
} from 'lucide-react';

interface SubItem {
  name: string;
  path: string;
  badge?: string;
  badgeColor?: string;
}

interface NavCategory {
  id: string;
  title: string;
  icon: any;
  items: SubItem[];
}

export default function AdminNasaLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Estados de acordeón para las 11 divisiones de control
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    core: true,
    bigdata: true,
    fincas: true,
    finanzas: true,
    b2g: false,
    audio: false,
    afiliados: false,
    crm: false,
    studio: false,
    vimume: false,
    seguridad: false,
  });

  const toggle = (sec: string) => {
    setOpenSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  const isActive = (p: string) => pathname === p;

  const navigation: NavCategory[] = [
    {
      id: "core",
      title: "1. Core & Telemetría",
      icon: LayoutGrid,
      items: [
        { name: "Dashboard Central", path: "/admin", badge: "SOBERANO", badgeColor: "text-[#d4ac0d] bg-[#d4ac0d]/10 border-[#d4ac0d]/30" },
        { name: "Omni-Cockpit Dinámico", path: "/admin/omni-cockpit", badge: "DRAG&DROP" },
        { name: "Telemetría Bare-Metal", path: "/admin/telemetria", badge: "REAL-TIME", badgeColor: "text-cyan-400 bg-cyan-950/40 border-cyan-800" },
      ]
    },
    {
      id: "bigdata",
      title: "2. Big Data & Vampiro",
      icon: Users,
      items: [
        { name: "Directorio Global (26K)", path: "/admin/directorio", badge: "26.420", badgeColor: "text-emerald-400 bg-emerald-950/40 border-emerald-800" },
        { name: "Vampiro de Proveedores", path: "/admin/vampiro", badge: "LAVADO SEMÁNTICO" },
        { name: "Homologación 52 Provincias", path: "/admin/proveedores-homologados" },
      ]
    },
    {
      id: "fincas",
      title: "3. Fincas Singulares B2B",
      icon: Landmark,
      items: [
        { name: "fincasparaboda.com", path: "/fincasparaboda", badge: "PORTAL" },
        { name: "Fincas Fundadoras (15)", path: "/admin/fincas", badge: "ZONA CENTRO", badgeColor: "text-[#d4ac0d] bg-[#d4ac0d]/10 border-[#d4ac0d]/30" },
        { name: "Pipeline de Admisión", path: "/admin/fincas-pipeline" },
        { name: "Auditoría Arquitectónica", path: "/admin/fichas" },
      ]
    },
    {
      id: "finanzas",
      title: "4. Sourcing & Tesorería",
      icon: Database,
      items: [
        { name: "Matriz Presupuestaria", path: "/admin/sourcing", badge: "CASHFLOW" },
        { name: "Split Soberano 80/10/10", path: "/admin/split", badge: "80% NETO", badgeColor: "text-emerald-400 bg-emerald-950/40 border-emerald-800" },
        { name: "Price-Lock (Stripe SHA-256)", path: "/admin/price-lock" },
      ]
    },
    {
      id: "b2g",
      title: "5. B2G & Contratación",
      icon: FileText,
      items: [
        { name: "Cockpit B2G & NDA", path: "/admin/cockpit", badge: "< 14.250€", badgeColor: "text-red-400 bg-red-950/40 border-red-800" },
        { name: "Expedientes Art. 118 LCSP", path: "/admin/iluminacion" },
        { name: "Contratos Ultra-Lujo NDA", path: "/admin/nda-contratos" },
      ]
    },
    {
      id: "audio",
      title: "6. Riders & Producción",
      icon: Radio,
      items: [
        { name: "Rider Homologado 12 W/pax", path: "/admin/riders", badge: "BOSE/SHURE" },
        { name: "Roster de Solistas & Tenores", path: "/admin/artistas" },
        { name: "EAR Academy (Talent Campus)", path: "/admin/academy" },
      ]
    },
    {
      id: "afiliados",
      title: "7. Red de Afiliados",
      icon: Percent,
      items: [
        { name: "Simulador de Comisiones", path: "/admin/afiliados", badge: "TIERS" },
        { name: "Embajadores & Agencias", path: "/admin/afiliados-partners" },
        { name: "Liquidación Cero-Fricción", path: "/admin/afiliados-liquidaciones" },
      ]
    },
    {
      id: "crm",
      title: "8. CRM & Outreach LTV",
      icon: Briefcase,
      items: [
        { name: "Fichas de Parejas (VIP)", path: "/admin/clientes", badge: "HIGH-TICKET" },
        { name: "Copiloto de Aniversarios", path: "/admin/copiloto-ltv", badge: "RECOMPRA" },
      ]
    },
    {
      id: "studio",
      title: "9. Experience Studio",
      icon: Layers,
      items: [
        { name: "Mobile Fusion Studio", path: "/admin/mobile-studio", badge: "10 ARQUETIPOS" },
        { name: "Selector OLED 4 Perfiles", path: "/admin/configurador-portada" },
      ]
    },
    {
      id: "vimume",
      title: "10. Proyecto VIMUME",
      icon: Music,
      items: [
        { name: "Neuroacústica 40 Hz", path: "/admin/vimume", badge: "SENIOR" },
        { name: "Piloto 5 Centros Residenciales", path: "/admin/vimume-piloto" },
        { name: "Fondos Europeos NextGen", path: "/admin/vimume-fondos" },
      ]
    },
    {
      id: "seguridad",
      title: "11. Oráculo & Seguridad",
      icon: ShieldCheck,
      items: [
        { name: "Oráculo Cognitivo (IA Local)", path: "/admin/oraculo", badge: "RX 7900 XTX", badgeColor: "text-[#d4ac0d] bg-[#d4ac0d]/10 border-[#d4ac0d]/30" },
        { name: "Tripwires & Guardrails", path: "/admin/seguridad-tripwires" },
        { name: "Autenticación TOTP 2FA", path: "/admin/seguridad-totp" },
      ]
    },
  ];

  return (
    <div className="flex h-screen bg-[#030303] text-[#fcfbf9] overflow-hidden font-sans selection:bg-[#d4ac0d] selection:text-black">
      
      {/* SIDEBAR NASA MULTI-SUBSISTEMA */}
      <aside className="w-72 bg-[#070707] border-r border-[#1a1a1a] flex flex-col h-full shrink-0 z-50">
        
        {/* Cabecera de Mando */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#1a1a1a] shrink-0 bg-[#0a0a0a]">
          <Link href="/admin" className="flex items-center gap-2 text-[#d4ac0d] font-black tracking-wider text-xs uppercase">
            <Crown className="w-4 h-4" />
            <span>EAR OS <span className="text-white">v2.4 NASA</span></span>
          </Link>
          <span className="text-[9px] font-mono text-[#27ae60] bg-[#27ae60]/10 border border-[#27ae60]/30 px-2 py-0.5 rounded">
            ONLINE
          </span>
        </div>

        {/* Listado de Categorías con Scroll Optimizado */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 custom-scrollbar">
          {navigation.map((cat) => {
            const isOpen = openSections[cat.id];
            const hasActiveChild = cat.items.some(it => it.path === pathname);

            return (
              <div key={cat.id} className="border border-[#141414] bg-[#0a0a0a]/60 rounded-xl overflow-hidden">
                <button 
                  onClick={() => toggle(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${hasActiveChild ? 'text-[#d4ac0d] bg-[#121212]' : 'text-gray-400 hover:text-white hover:bg-[#0f0f0f]'}`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <cat.icon className="w-3.5 h-3.5 shrink-0 text-gray-500" />
                    <span className="truncate">{cat.title}</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-white' : ''}`} />
                </button>

                {isOpen && (
                  <div className="p-1.5 space-y-0.5 bg-[#050505] border-t border-[#121212]">
                    {cat.items.map((it) => {
                      const active = isActive(it.path);
                      return (
                        <Link 
                          key={it.path} 
                          href={it.path}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${active ? 'bg-[#181818] text-white border border-[#333]' : 'text-gray-400 hover:text-gray-200 hover:bg-[#0e0e0e]'}`}
                        >
                          <span className="truncate pr-2">{it.name}</span>
                          {it.badge && (
                            <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded border shrink-0 ${it.badgeColor || 'text-gray-400 bg-[#121212] border-[#252525]'}`}>
                              {it.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Operador de Cabina */}
        <div className="p-3 border-t border-[#1a1a1a] bg-[#050505]">
          <div className="flex items-center gap-3 bg-[#0a0a0a] p-2.5 rounded-xl border border-[#1a1a1a]">
            <div className="w-7 h-7 rounded-lg bg-[#d4ac0d]/10 flex items-center justify-center text-[#d4ac0d] font-bold text-xs border border-[#d4ac0d]/30 font-mono shrink-0">
              EA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Edwin Agudelo</p>
              <p className="text-[9px] text-gray-500 font-mono truncate">Méntrida (Toledo) • S-Class</p>
            </div>
            <Settings className="w-3.5 h-3.5 text-gray-500 hover:text-white transition-colors cursor-pointer" />
          </div>
        </div>

      </aside>

      {/* ÁREA DE TRABAJO (Full Width, Cero Pantalla Negra) */}
      <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden bg-[#030303] custom-scrollbar block w-full">
        {children}
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #050505; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4ac0d; }
      `}} />
    </div>
  );
}
