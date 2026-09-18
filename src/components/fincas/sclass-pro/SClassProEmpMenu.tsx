"use client";

import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Inbox, 
  Store, 
  Star, 
  GraduationCap, 
  Receipt, 
  ShieldCheck, 
  Phone, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  UserCheck,
  CheckCircle2
} from "lucide-react";
import { ProDashboardTab } from "./ProDashboardTab";
import { ProSolicitudesTab } from "./ProSolicitudesTab";
import { ProEscaparateTab } from "./ProEscaparateTab";
import { ProReviewsTab } from "./ProReviewsTab";
import { ProCampusTab } from "./ProCampusTab";
import { ProBillingTab } from "./ProBillingTab";

export type ProTabId = "dashboard" | "solicitudes" | "escaparate" | "reviews" | "campus" | "billing";

interface SClassProEmpMenuProps {
  initialTab?: ProTabId;
}

export function SClassProEmpMenu({ initialTab = "dashboard" }: SClassProEmpMenuProps) {
  const [currentTab, setCurrentTab] = useState<ProTabId>(initialTab);

  const tabs = [
    { id: "dashboard", label: "Inicio / Telemetría", icon: LayoutDashboard, badge: "4.340 imp." },
    { id: "solicitudes", label: "Mis Solicitudes", icon: Inbox, badge: "223" },
    { id: "escaparate", label: "Mi Escaparate", icon: Store, badge: "80%" },
    { id: "reviews", label: "Opiniones", icon: Star, badge: "5.0 ★" },
    { id: "campus", label: "Campus & Playbook", icon: GraduationCap, badge: "5 módulos" },
    { id: "billing", label: "Facturación & Stripe", icon: Receipt, badge: "0€ cuota" },
  ];

  return (
    <div className="min-h-screen bg-[#030305] text-white flex flex-col selection:bg-[#ecb613] selection:text-black">
      {/* Top Cockpit Header Bar */}
      <header className="sticky top-0 z-40 bg-[#060609]/95 backdrop-blur-md border-b border-zinc-800/80 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Brand & Vendor Badge */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ecb613] to-[#8a6805] p-0.5 shadow-lg shadow-[#ecb613]/10">
              <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center font-['Syne'] font-black text-sm text-[#ecb613]">
                EAR
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold font-['Syne'] text-white">
                  Productora EAR
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Acreditado S-Class
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  ID: 78903
                </span>
              </div>
              <div className="text-xs text-zinc-400">
                Portal B2B de Proveedores & Fincas de Élite • Modo CEO
              </div>
            </div>
          </div>

          {/* Right Status Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
              <Phone className="w-3.5 h-3.5 text-[#ecb613]" />
              <span>Soporte Directo:</span>
              <a href="tel:+34693693048" className="text-white hover:text-[#ecb613] transition font-bold">
                +34 693 693 048
              </a>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 text-xs font-mono text-[#ecb613]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pack Soberano: 100% Abierto</span>
            </div>

            <a
              href="/edwin-agudelo"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 transition"
            >
              <span>Ver Público</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>
      </header>

      {/* Tabs Navigation Bar */}
      <div className="border-b border-zinc-800/80 bg-[#050508] px-4 lg:px-8 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as ProTabId)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-mono whitespace-nowrap transition border ${
                  isActive
                    ? "bg-[#ecb613] text-black border-[#ecb613] font-bold shadow-lg shadow-[#ecb613]/10"
                    : "bg-zinc-900/40 text-zinc-400 border-zinc-800/60 hover:text-zinc-200 hover:bg-zinc-800/50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-black" : "text-[#ecb613]"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isActive
                        ? "bg-black/20 text-black font-semibold"
                        : "bg-zinc-800 text-zinc-300 border border-zinc-700/50"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Render */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
        {currentTab === "dashboard" && <ProDashboardTab onNavigate={(tab) => setCurrentTab(tab as ProTabId)} />}
        {currentTab === "solicitudes" && <ProSolicitudesTab />}
        {currentTab === "escaparate" && <ProEscaparateTab />}
        {currentTab === "reviews" && <ProReviewsTab />}
        {currentTab === "campus" && <ProCampusTab />}
        {currentTab === "billing" && <ProBillingTab />}
      </main>

      {/* Footer Audit Bar */}
      <footer className="border-t border-zinc-900 bg-[#020204] py-4 px-4 lg:px-8 text-center text-xs font-mono text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Productora EAR • Sistema Operativo S-Class Pro v7.0
          </div>
          <div className="flex items-center gap-4">
            <span className="text-zinc-400">Split Canónico 80/10/10</span>
            <span className="text-zinc-400">•</span>
            <span className="text-zinc-400">Rider Bose &lt; 75 dB SPL</span>
            <span className="text-zinc-400">•</span>
            <span className="text-[#ecb613]">Depósito Stripe 100,00 € SHA-256</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
