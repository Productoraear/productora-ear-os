"use client";

import { useMemo, useState } from "react";

export type SupplierStage =
  | "identified"
  | "contacted"
  | "quoted"
  | "sampled"
  | "approved"
  | "rejected";

export interface Supplier {
  id: string;
  name: string;
  country: string;
  stage: SupplierStage;
  leadTimeDays: number;
  rating?: number;
  notes?: string;
}

interface SupplierPipelineProps {
  initialSuppliers?: Supplier[];
}

const STAGE_ORDER: SupplierStage[] = [
  "identified",
  "contacted",
  "quoted",
  "sampled",
  "approved",
  "rejected",
];

const STAGE_LABELS: Record<SupplierStage, string> = {
  identified: "Identified",
  contacted: "Contacted",
  quoted: "Quoted",
  sampled: "Sampled",
  approved: "Approved",
  rejected: "Rejected",
};

const STAGE_COLORS: Record<SupplierStage, string> = {
  identified: "bg-slate-100 text-slate-700",
  contacted: "bg-sky-100 text-sky-700",
  quoted: "bg-amber-100 text-amber-700",
  sampled: "bg-violet-100 text-violet-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

const DEFAULT_SUPPLIERS: Supplier[] = [
  {
    id: "acme-textiles",
    name: "Acme Textiles",
    country: "Portugal",
    stage: "approved",
    leadTimeDays: 21,
    rating: 4.6,
    notes: "Primary cotton supplier",
  },
  {
    id: "globalship",
    name: "GlobalShip Logistics",
    country: "Netherlands",
    stage: "quoted",
    leadTimeDays: 35,
    rating: 4.1,
    notes: "FCL sea freight",
  },
  {
    id: "shenzhen-parts",
    name: "Shenzhen Parts Co.",
    country: "China",
    stage: "sampled",
    leadTimeDays: 45,
    rating: 3.8,
    notes: "Hardware components",
  },
  {
    id: "mumbai-dye",
    name: "Mumbai Dye Works",
    country: "India",
    stage: "contacted",
    leadTimeDays: 30,
    notes: "Awaiting quote",
  },
];

export default function SupplierPipeline({
  initialSuppliers = DEFAULT_SUPPLIERS,
}: SupplierPipelineProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [search, setSearch] = useState("");

  const columns = useMemo(() => {
    const q = search.trim().toLowerCase();
    const visible = q
      ? suppliers.filter(
          (s) =>
            s.name.toLowerCase().includes(q) || s.country.toLowerCase().includes(q)
        )
      : suppliers;

    return STAGE_ORDER.map((stage) => ({
      stage,
      items: visible.filter((s) => s.stage === stage),
    }));
  }, [suppliers, search]);

  const moveSupplier = (id: string, stage: SupplierStage) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, stage } : s)));
  };

  const addSupplier = () => {
    const id = `supplier-${Date.now()}`;
    setSuppliers((prev) => [
      ...prev,
      {
        id,
        name: "New Supplier",
        country: "—",
        stage: "identified",
        leadTimeDays: 0,
      },
    ]);
  };

  const removeSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="flex items-center justify-between border-b border-slate-200 p-4">
        <h2 className="text-lg font-semibold text-slate-900">Supplier Pipeline</h2>
        <div className="flex items-center gap-2">
          <input
            type="search"
            placeholder="Search suppliers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
          />
          <button
            onClick={addSupplier}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Add Supplier
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
        {columns.map((col) => (
          <div key={col.stage} className="rounded-md bg-slate-50 p-3">
            <div className="mb-3 flex items-center justify-between">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STAGE_COLORS[col.stage]}`}
              >
                {STAGE_LABELS[col.stage]}
              </span>
              <span className="text-xs text-slate-400">{col.items.length}</span>
            </div>

            <ul className="space-y-2">
              {col.items.map((supplier) => (
                <li
                  key={supplier.id}
                  className="rounded-md border border-slate-200 bg-white p-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-900">{supplier.name}</p>
                      <p className="text-xs text-slate-500">
                        {supplier.country} · {supplier.leadTimeDays}d lead time
                      </p>
                      {supplier.rating != null && (
                        <p className="mt-1 text-xs text-amber-600">
                          ★ {supplier.rating.toFixed(1)}
                        </p>
                      )}
                      {supplier.notes && (
                        <p className="mt-1 text-xs text-slate-400">{supplier.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeSupplier(supplier.id)}
                      aria-label={`Remove ${supplier.name}`}
                      className="text-slate-300 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {STAGE_ORDER.filter((s) => s !== supplier.stage).map((stage) => (
                      <button
                        key={stage}
                        onClick={() => moveSupplier(supplier.id, stage)}
                        className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200"
                      >
                        → {STAGE_LABELS[stage]}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
              {col.items.length === 0 && (
                <li className="rounded-md border border-dashed border-slate-300 p-3 text-center text-xs text-slate-400">
                  No suppliers
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
