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
  Mic
} from 'lucide-react';

const KPI_CARDS = [
  {
    title: "Catálogo de Proveedores",
    value: "45.666",
    detail: "45.666 en Call Center / 2.300 Edge CDN",
    badge: "74.845 en Bóveda",
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
        </div>
      </div>
    </div>
  );
}
