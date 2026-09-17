"use client";

import React from 'react';
import Link from 'next/link';
import {
  Users,
  CreditCard,
  Truck,
  Landmark,
  Cpu,
  ShieldCheck,
  ArrowUpRight,
  Flame,
  Activity,
  Mic,
  Sparkles,
  Compass,
  ExternalLink,
  Globe
} from 'lucide-react';
import { PROVIDERS_GRAND_TOTAL, formatProviderCount, formatProviderBadge } from '@/lib/constants/providers-manifest';

// SSOT ÚNICO: contadores derivados del manifest, jamás hardcodeados.
const GRAND_TOTAL_FORMATTED = formatProviderCount(PROVIDERS_GRAND_TOTAL);
const GRAND_TOTAL_BADGE = formatProviderBadge(PROVIDERS_GRAND_TOTAL);

const KPI_CARDS = [
  {
    title: "Catálogo de Proveedores",
    value: GRAND_TOTAL_FORMATTED,
    detail: `${GRAND_TOTAL_FORMATTED} en Bóveda SSOT / 150 Featured CDN`,
    badge: "100% Auditado",
    icon: Users,
    href: "/admin/call-center"
  },
  {
    title: "Price-Lock Inmutable",
    value: "100,00 €",
    detail: "Depósito Stripe con hash SHA-256",
    badge: "Activo 48h",
    icon: CreditCard,
    href: "/admin/tesoreria"
  },
  {
    title: "Logística Méntrida Km 0",
    value: "1,50 €/km",
    detail: "A partir de km 50 (+120€ hotel >200km)",
    badge: "En Vivo",
    icon: Truck,
    href: "/admin/flota"
  },
  {
    title: "Licitaciones Menores B2G",
    value: "< 14.250 €",
    detail: "Ajuste preventivo Art. 118 LCSP",
    badge: "Acústico <75dB",
    icon: Landmark,
    href: "/admin/licitaciones"
  }
];

const ALL_ADMIN_DIRECT_URLS = [
  // NÚCLEO Y SIMULACIÓN
  { category: "Núcleo & Simulación", name: "🗺️ Mapa & Simulador S-Class", url: "/admin/simulador", badge: "21ST.DEV", desc: "Simulador de eventos, Split 80/10/10, logística Méntrida y los 5 dominios." },
  { category: "Núcleo & Simulación", name: "Omni-Cockpit Central", url: "/admin", badge: "CORE", desc: "Panel de control central, KPIs de negocio y GPU local." },
  { category: "Núcleo & Simulación", name: "Simulador HTML Standalone", url: "/simulador-ear-os.html", badge: "HTML5", desc: "Vista interactiva de vanguardia inspirada en templates 21st.dev." },
  { category: "Núcleo & Simulación", name: "Manual de Operaciones 360", url: "/admin/manual-operaciones", badge: "DOCTRINA", desc: "Protocolos canónicos para ventas, call center, grabación y contingencias." },

  // VENTAS, LEADS & CONVERSIÓN
  { category: "Ventas & Conversión", name: "Call Center Outbound", url: "/admin/call-center", badge: GRAND_TOTAL_BADGE, desc: "Despacho telefónico de novios y base de datos auditada." },
  { category: "Ventas & Conversión", name: "Centralita WhatsApp", url: "/admin/whatsapp", badge: "693 048", desc: "Monitor de mensajes directos y cierre de depósitos vía WhatsApp." },
  { category: "Ventas & Conversión", name: "Scala Leads & Sourcing", url: "/admin/sourcing", badge: "LEADS", desc: "Prospección automática y absorción de centros senior y fincas." },
  { category: "Ventas & Conversión", name: "Directorio Proveedores CDN", url: "/admin/proveedores", badge: `${GRAND_TOTAL_BADGE} CDN`, desc: "Fichas públicas de proveedores y homologación técnica." },
  { category: "Ventas & Conversión", name: "Omni Training Center", url: "/admin/training", badge: "SALES", desc: "Academia de ventas, scripts comerciales y manejo de objeciones." },

  // FINANZAS, LEGAL & INSTITUCIONAL
  { category: "Finanzas & Legal B2G", name: "B2G & Licitaciones <14.250€", url: "/admin/licitaciones", badge: "LEGAL", desc: "Contratos menores Art. 118 LCSP y pliegos acústicos <75 dB SPL." },
  { category: "Finanzas & Legal B2G", name: "Tesorería & Stripe Price-Lock", url: "/admin/tesoreria", badge: "100€", desc: "Depósitos inmutables de 100 €, pasarela Stripe y ledger de tesorería." },
  { category: "Finanzas & Legal B2G", name: "Red de Afiliados y Fincas", url: "/admin/afiliados", badge: "SPLIT 80/10/10", desc: "Gestión de partners nupciales y liquidación de comisiones del 10%." },
  { category: "Finanzas & Legal B2G", name: "Flota & Logística Méntrida", url: "/admin/flota", badge: "KM 0", desc: "Calculadora de distancias, portes 1,50 €/km y estado de vehículos." },

  // INTELIGENCIA, IA & CONSOLAS DIRECTAS
  { category: "Inteligencia & GPU", name: "Voice Studio IA", url: "/admin/voice-studio", badge: "GPU 24GB", desc: "Modelos de voz locales operando en la AMD RX 7900 XTX." },
  { category: "Inteligencia & GPU", name: "Meta-Compiler (Vibe Coding)", url: "/admin/compiler", badge: "DAG", desc: "Orquestador de micro-servicios y compilación reactiva." },
  { category: "Inteligencia & GPU", name: "Journey Heatmap UX", url: "/admin/journey-heatmap", badge: "HEATMAP", desc: "Mapas de calor y telemetría de interacción de usuarios." },
  { category: "Inteligencia & GPU", name: "Consola Sentinel ZTM", url: "/admin/sentinel", badge: "ZERO-TKN", desc: "Protección contra saturación de memoria de Ollama." },
  { category: "Inteligencia & GPU", name: "Centro de Mando & Skills", url: "/admin/command-center", badge: "ROOT", desc: "Gobernanza del sistema y catálogo de skills autónomos." },
  { category: "Inteligencia & GPU", name: "Radar de Demanda Directo", url: "/radar", badge: "EXP", desc: "Consola de radar de demanda y palabras clave nupciales." },
  { category: "Inteligencia & GPU", name: "Agent Skills Directo", url: "/agent-skills", badge: "SKILLS", desc: "Directorio de habilidades de los agentes autónomos." },
  { category: "Inteligencia & GPU", name: "Voice Studio Directo", url: "/voice-studio", badge: "DIRECT", desc: "Consola de voz desacoplada para locuciones y grabaciones." },
  { category: "Inteligencia & GPU", name: "Sourcing Directo", url: "/sourcing", badge: "DIRECT", desc: "Consola independiente de captura masiva de proveedores." }
];

export default function OmniCockpitPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1a1a24] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#ecb613] uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-[#ecb613]" />
            Panel Soberano Omega v7.0
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-1 font-mono">
            Omni-Cockpit Central
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Gobierno unificado de EAR OS. Control de proveedores, finanzas y telemetría de inferencia local.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#ecb613]" />
            AMD RX 7900 XTX: <span className="text-emerald-400 font-semibold">24GB VRAM</span>
          </div>
        </div>
      </div>

      {/* Tarjetas KPI Superiores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              href={card.href}
              className="p-5 rounded-2xl bg-[#050508] border border-[#1a1a24] hover:border-[#ecb613]/50 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="flex items-center justify-between text-zinc-400 mb-3">
                <span className="text-xs font-medium">{card.title}</span>
                <Icon className="w-4 h-4 text-[#ecb613] group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-bold text-white font-mono tracking-tight group-hover:text-[#ecb613] transition-colors">
                {card.value}
              </div>
              <div className="flex items-center justify-between mt-3 text-[11px] text-zinc-500">
                <span>{card.detail}</span>
                <span className="text-emerald-400 font-mono font-medium">{card.badge}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 🗺️ BANNER DESTACADO SIMULADOR OPERATIVO 21ST.DEV */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d0d14] via-[#141420] to-[#0a0a0f] border border-[#ecb613]/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NUEVO ENTORNO INTERACTIVO S-CLASS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-syne uppercase tracking-tight">
            Mapa de los 5 Dominios & Simulador de Ventas
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
            Aprende a operar el motor completo de EAR OS: cotiza actuaciones con logística Méntrida Km 0, visualiza el Split 80/10/10 en vivo y simula licitaciones B2G (&lt;14.250 €).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
          <Link
            href="/admin/simulador"
            className="py-3.5 px-6 rounded-2xl bg-[#ecb613] hover:bg-amber-400 text-black font-extrabold text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#ecb613]/20 transition-all"
          >
            <span>Abrir Simulador</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <a
            href="/simulador-ear-os.html"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3.5 px-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs font-mono uppercase tracking-wider transition-all"
          >
            <span>Modo 21st.dev Full</span>
          </a>
        </div>
      </div>

      {/* Grid de Acceso Rápido a Módulos */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
          <Flame className="w-5 h-5 text-[#ecb613]" />
          Subsistemas de Dominancia
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/sourcing"
            className="p-5 rounded-2xl bg-[#050508] border border-[#1a1a24] hover:border-[#ecb613]/40 transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-mono text-[#ecb613] font-semibold">LEADS SOURCING</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-500" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Scala Leads & Prospección</h3>
            <p className="text-xs text-zinc-400">
              Integración con API Scala Leads para prospección continua y absorción de centros senior.
            </p>
          </Link>

          <Link
            href="/admin/voice-studio"
            className="p-5 rounded-2xl bg-[#050508] border border-[#1a1a24] hover:border-[#ecb613]/40 transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-mono text-purple-400 font-semibold">VOICE STUDIO</span>
              <Mic className="w-4 h-4 text-zinc-500" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Inferencia de Voz IA</h3>
            <p className="text-xs text-zinc-400">
              Modelos de voz y concierge multimodal operando en GPU local soberana.
            </p>
          </Link>

          <Link
            href="/admin/telemetria"
            className="p-5 rounded-2xl bg-[#050508] border border-[#1a1a24] hover:border-[#ecb613]/40 transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-mono text-cyan-400 font-semibold">TELEMETRÍA</span>
              <Activity className="w-4 h-4 text-zinc-500" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Bare-Metal Ollama</h3>
            <p className="text-xs text-zinc-400">
              Monitorización de modelos tiered (14B/27B/32B) y consumo de VRAM en tiempo real.
            </p>
          </Link>

          <Link
            href="/admin/manual-operaciones"
            className="p-5 rounded-2xl bg-[#050508] border border-[#ecb613]/30 hover:border-[#ecb613] transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-mono text-[#ecb613] font-semibold">DOCTRINA 2030-2050</span>
              <ArrowUpRight className="w-4 h-4 text-[#ecb613]" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Manual de Operaciones 360</h3>
            <p className="text-xs text-zinc-400">
              Protocolos militares para Call Center, Marketing & Growth, Grabación 4K y CEO.
            </p>
          </Link>
        </div>
      </div>

      {/* 🗺️ DIRECTORIO MAESTRO DE ACCESO DIRECTO A TODAS LAS 22 URLS */}
      <div className="space-y-6 pt-6 border-t border-[#1a1a24]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#ecb613] uppercase tracking-widest">
              <Compass className="w-4 h-4 text-[#ecb613]" />
              Índice Canónico Completo // EAR OS v7.0
            </div>
            <h2 className="text-2xl font-bold font-syne text-white uppercase mt-1">
              Directorio de Acceso Directo (Todas las 22 URLs del Admin)
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            22 Rutas de Mando Verificadas
          </span>
        </div>

        {/* Agrupación por Categorías */}
        {["Núcleo & Simulación", "Ventas & Conversión", "Finanzas & Legal B2G", "Inteligencia & GPU"].map((category) => (
          <div key={category} className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#ecb613] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ecb613]"></span>
              {category}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ALL_ADMIN_DIRECT_URLS.filter((r) => r.category === category).map((route, idx) => (
                <Link
                  key={idx}
                  href={route.url}
                  className="p-4 rounded-2xl bg-[#050508] border border-[#1a1a24] hover:border-[#ecb613]/50 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-zinc-300 border border-white/10 group-hover:border-[#ecb613]/30 group-hover:text-[#ecb613] transition-colors">
                        {route.badge}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#ecb613] transition-colors" />
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#ecb613] transition-colors mt-2">
                      {route.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400 font-light line-clamp-2">
                      {route.desc}
                    </p>
                  </div>
                  <div className="pt-2 mt-2 border-t border-white/5 text-[10px] font-mono text-zinc-500 truncate group-hover:text-zinc-300">
                    {route.url}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

