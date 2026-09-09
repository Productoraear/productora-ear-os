"use client";

import { useMemo, useState } from "react";

export interface BudgetLine {
  id: string;
  category: string;
  supplier: string;
  unitCost: number;
  quantity: number;
  currency: string;
  notes?: string;
}

interface BudgetMatrixProps {
  initialLines?: BudgetLine[];
}

const DEFAULT_LINES: BudgetLine[] = [
  {
    id: "raw-materials",
    category: "Raw Materials",
    supplier: "Acme Textiles",
    unitCost: 12.5,
    quantity: 1000,
    currency: "USD",
    notes: "Cotton blend, 240gsm",
  },
  {
    id: "labor",
    category: "Labor",
    supplier: "In-house",
    unitCost: 8.0,
    quantity: 500,
    currency: "USD",
    notes: "Assembly + QC",
  },
  {
    id: "freight",
    category: "Freight",
    supplier: "GlobalShip",
    unitCost: 2.25,
    quantity: 1000,
    currency: "USD",
    notes: "Sea freight, FCL",
  },
];

export default function BudgetMatrix({ initialLines = DEFAULT_LINES }: BudgetMatrixProps) {
  const [lines, setLines] = useState<BudgetLine[]>(initialLines);
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return lines;
    return lines.filter(
      (l) =>
        l.category.toLowerCase().includes(q) || l.supplier.toLowerCase().includes(q)
    );
  }, [lines, filter]);

  const totals = useMemo(() => {
    const byCurrency = new Map<string, number>();
    for (const line of filtered) {
      const total = line.unitCost * line.quantity;
      byCurrency.set(line.currency, (byCurrency.get(line.currency) ?? 0) + total);
    }
    return Array.from(byCurrency.entries()).map(([currency, amount]) => ({
      currency,
      amount,
    }));
  }, [filtered]);

  const updateLine = (id: string, patch: Partial<BudgetLine>) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const removeLine = (id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  };

  const addLine = () => {
    const id = `line-${Date.now()}`;
    setLines((prev) => [
      ...prev,
      {
        id,
        category: "New Category",
        supplier: "TBD",
        unitCost: 0,
        quantity: 0,
        currency: "USD",
      },
    ]);
  };

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="flex items-center justify-between border-b border-slate-200 p-4">
        <h2 className="text-lg font-semibold text-slate-900">Budget Matrix</h2>
        <div className="flex items-center gap-2">
          <input
            type="search"
            placeholder="Filter by category or supplier…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
          />
          <button
            onClick={addLine}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Add Line
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Supplier</th>
              <th className="px-4 py-3 text-right">Unit Cost</th>
              <th className="px-4 py-3 text-right">Qty</th>
              <th className="px-4 py-3">Currency</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.map((line) => (
              <tr key={line.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <input
                    value={line.category}
                    onChange={(e) => updateLine(line.id, { category: e.target.value })}
                    className="w-full rounded border border-transparent bg-transparent px-1 py-0.5 hover:border-slate-300 focus:border-indigo-500 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    value={line.supplier}
                    onChange={(e) => updateLine(line.id, { supplier: e.target.value })}
                    className="w-full rounded border border-transparent bg-transparent px-1 py-0.5 hover:border-slate-300 focus:border-indigo-500 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={line.unitCost}
                    onChange={(e) =>
                      updateLine(line.id, { unitCost: Number(e.target.value) || 0 })
                    }
                    className="w-24 rounded border border-transparent bg-transparent px-1 py-0.5 text-right hover:border-slate-300 focus:border-indigo-500 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <input
                    type="number"
                    min={0}
                    step="1"
                    value={line.quantity}
                    onChange={(e) =>
                      updateLine(line.id, { quantity: Number(e.target.value) || 0 })
                    }
                    className="w-20 rounded border border-transparent bg-transparent px-1 py-0.5 text-right hover:border-slate-300 focus:border-indigo-500 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-3">
                  <select
                    value={line.currency}
                    onChange={(e) => updateLine(line.id, { currency: e.target.value })}
                    className="rounded border border-transparent bg-transparent px-1 py-0.5 hover:border-slate-300 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CNY">CNY</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-right font-medium text-slate-900">
                  {(line.unitCost * line.quantity).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-4 py-3">
                  <input
                    value={line.notes ?? ""}
                    placeholder="—"
                    onChange={(e) => updateLine(line.id, { notes: e.target.value })}
                    className="w-full rounded border border-transparent bg-transparent px-1 py-0.5 hover:border-slate-300 focus:border-indigo-500 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => removeLine(line.id)}
                    aria-label={`Remove ${line.category}`}
                    className="text-slate-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                  No budget lines match your filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="flex flex-wrap items-center justify-end gap-4 border-t border-slate-200 p-4 text-sm">
        {totals.map((t) => (
          <span key={t.currency} className="font-medium text-slate-900">
            {t.currency}: {t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        ))}
        {totals.length === 0 && <span className="text-slate-400">No totals</span>}
      </footer>
    </div>
  );
}
