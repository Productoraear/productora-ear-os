"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Layers,
  Users,
  ClipboardCheck,
  Sparkles,
  Activity,
} from "lucide-react";
import BudgetMatrix from "./components/BudgetMatrix";
import SupplierPipeline from "./components/SupplierPipeline";
import ProductionChecklist from "./components/ProductionChecklist";
import LeadOutreachCopilot from "./components/LeadOutreachCopilot";

type TabId = "budget" | "pipeline" | "checklist" | "outreach";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "budget", label: "Matriz Presupuestaria", icon: <Layers className="w-3.5 h-3.5" /> },
  { id: "pipeline", label: "Pipeline Proveedores", icon: <Users className="w-3.5 h-3.5" /> },
  { id: "checklist", label: "Checklist Producción", icon: <ClipboardCheck className="w-3.5 h-3.5" /> },
  { id: "outreach", label: "Copiloto Outreach LTV", icon: <Sparkles className="w-3.5 h-3.5" /> },
];

export default function SourcingPage() {
  const [activeTab, setActiveTab] = useState<TabId>("budget");

  return (
    <div className="min-h-screen bg-[#030303] text-[#fcfbf9] p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ── HEADER ── */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f1f1f] pb-5">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 hover:text-[#d4ac0d] transition-colors mb-3"
            >
              <ArrowLeft className="w-4 h-4" /> Volver al Centro de Mando
            </Link>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#d4ac0d] animate-pulse" />
              SOURCING & CONTROL FINANCIERO
            </h1>
            <p className="text-sm text-gray-400 mt-1 max-w-2xl">
              Gobierno centralizado de tesorería, homologación de proveedores, puertas de producción y retención LTV.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#121212] border border-[#222] px-3 py-1.5 rounded-lg text-xs text-[#d4ac0d] shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-[#27ae60]" />
            <span className="font-mono font-bold">MÓDULO S-CLASS ACTIVO</span>
          </div>
        </header>

        {/* ── TABS ── */}
        <div className="inline-flex p-1 rounded-xl bg-[#0a0a0a] border border-[#1f1f1f] flex-wrap gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#d4ac0d] text-black shadow-md shadow-amber-400/20"
                  : "text-gray-400 hover:text-white hover:bg-[#121212]"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── CONTENIDO ACTIVO ── */}
        <div>
          {activeTab === "budget" && <BudgetMatrix />}
          {activeTab === "pipeline" && <SupplierPipeline />}
          {activeTab === "checklist" && <ProductionChecklist />}
          {activeTab === "outreach" && <LeadOutreachCopilot />}
        </div>

        {/* ── FOOTER ── */}
        <footer className="flex items-center justify-between pt-4 border-t border-[#1f1f1f] text-[10px] font-mono text-gray-500">
          <span className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-[#27ae60]" />
            EAR OS V2.4 — CABINA SOURCING SOBERANA
          </span>
          <span>Split 80/10/10 · Price-Lock SHA-256 · CAC = 0 €</span>
        </footer>
      </div>
    </div>
  );
}