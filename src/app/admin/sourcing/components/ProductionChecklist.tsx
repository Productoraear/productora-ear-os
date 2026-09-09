"use client";

import { useMemo, useState } from "react";

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
  owner?: string;
  dueDate?: string;
}

interface ProductionChecklistProps {
  initialItems?: ChecklistItem[];
}

const DEFAULT_ITEMS: ChecklistItem[] = [
  {
    id: "po-issued",
    label: "Purchase orders issued to approved suppliers",
    done: true,
    owner: "Purchasing",
    dueDate: "2026-09-01",
  },
  {
    id: "samples-approved",
    label: "Pre-production samples approved",
    done: true,
    owner: "QA",
    dueDate: "2026-09-05",
  },
  {
    id: "materials-inbound",
    label: "Raw materials received and inspected",
    done: false,
    owner: "Warehouse",
    dueDate: "2026-09-15",
  },
  {
    id: "line-setup",
    label: "Production line setup and calibration",
    done: false,
    owner: "Operations",
    dueDate: "2026-09-20",
  },
  {
    id: "qc-audit",
    label: "In-process QC audit completed",
    done: false,
    owner: "QA",
    dueDate: "2026-09-25",
  },
  {
    id: "final-inspection",
    label: "Final inspection and packing",
    done: false,
    owner: "QA",
    dueDate: "2026-09-30",
  },
];

export default function ProductionChecklist({
  initialItems = DEFAULT_ITEMS,
}: ProductionChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);
  const [newLabel, setNewLabel] = useState("");

  const progress = useMemo(() => {
    if (items.length === 0) return 0;
    const done = items.filter((i) => i.done).length;
    return Math.round((done / items.length) * 100);
  }, [items]);

  const toggleItem = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  };

  const addItem = () => {
    const label = newLabel.trim();
    if (!label) return;
    const id = `item-${Date.now()}`;
    setItems((prev) => [...prev, { id, label, done: false }]);
    setNewLabel("");
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const sorted = useMemo(
    () =>
      [...items].sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;
        const aDate = a.dueDate ?? "9999-12-31";
        const bDate = b.dueDate ?? "9999-12-31";
        return aDate.localeCompare(bDate);
      }),
    [items]
  );

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Production Checklist</h2>
          <span className="text-sm font-medium text-slate-500">{progress}% complete</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      <ul className="divide-y divide-slate-200">
        {sorted.map((item) => (
          <li key={item.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50">
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => toggleItem(item.id)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              aria-label={`Mark "${item.label}" as ${item.done ? "incomplete" : "complete"}`}
            />
            <div className="flex-1">
              <p
                className={`text-sm ${
                  item.done ? "text-slate-400 line-through" : "text-slate-900"
                }`}
              >
                {item.label}
              </p>
              {(item.owner || item.dueDate) && (
                <p className="text-xs text-slate-400">
                  {item.owner && <span>{item.owner}</span>}
                  {item.owner && item.dueDate && " · "}
                  {item.dueDate && <span>Due {item.dueDate}</span>}
                </p>
              )}
            </div>
            <button
              onClick={() => removeItem(item.id)}
              aria-label={`Remove "${item.label}"`}
              className="text-slate-300 hover:text-red-600"
            >
              ✕
            </button>
          </li>
        ))}
        {sorted.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-slate-400">
            No checklist items yet.
          </li>
        )}
      </ul>

      <div className="flex gap-2 border-t border-slate-200 p-4">
        <input
          type="text"
          placeholder="Add a checklist item…"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addItem();
          }}
          className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
        />
        <button
          onClick={addItem}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Add
        </button>
      </div>
    </div>
  );
}
