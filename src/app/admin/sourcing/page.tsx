"use client";

import { useMemo, useState } from "react";
import BudgetMatrix from "./components/BudgetMatrix";
import SupplierPipeline from "./components/SupplierPipeline";
import ProductionChecklist from "./components/ProductionChecklist";

export default function SourcingPage() {
  const [activeTab, setActiveTab] = useState<"budget" | "suppliers" | "production">("budget");

  const tabs = useMemo(
    () => [
      { id: "budget" as const, label: "Budget Matrix" },
      { id: "suppliers" as const, label: "Supplier Pipeline" },
      { id: "production" as const, label: "Production Checklist" },
    ],
    []
  );

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Sourcing</h1>
        <p className="text-sm text-slate-500">
          Manage budgets, supplier pipeline, and production readiness.
        </p>
      </header>

      <nav className="mb-6 flex gap-2" role="tablist" aria-label="Sourcing sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <section role="tabpanel">
        {activeTab === "budget" && <BudgetMatrix />}
        {activeTab === "suppliers" && <SupplierPipeline />}
        {activeTab === "production" && <ProductionChecklist />}
      </section>
    </main>
  );
}
