"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Compass, LayoutGrid } from "lucide-react";
import {
  MARIACHI_VIEW_STORAGE_KEY,
  isMariachiExperienceView,
  type MariachiExperienceView,
} from "@/lib/mariachi/mariachi-experience-view";

/**
 * ════════════════════════════════════════════════════════════════════════════
 * SELECTOR DUAL — CATÁLOGO (AIRBNB) ↔ DESCUBRIMIENTO (TINDER)
 * ════════════════════════════════════════════════════════════════════════════
 * Conmutador de vista de `/mariachis`:
 *  - Vista A `catalog`: grid de packs con desglose y bloqueo de fecha (Stripe).
 *  - Vista B `discovery`: mazo de cartas con gesto de arrastre.
 *
 * Persistencia en dos niveles:
 *  1. `initialView` llega resuelto del servidor (flag `MARIACHI_DEFAULT_VIEW`).
 *  2. La elección explícita del visitante se guarda en `localStorage` y manda
 *     sobre el flag de plataforma en visitas posteriores.
 *
 * Higiene de fricción: sin `useState` decorativo, sin animación de layout
 * (sólo color/opacidad/transform), paneles con `min-h` para no provocar CLS y
 * semántica `tablist`/`tabpanel` con `aria-selected` + `aria-controls`.
 * ════════════════════════════════════════════════════════════════════════════
 */

interface MariachiViewSwitcherProps {
  readonly catalog: React.ReactNode;
  readonly discovery: React.ReactNode;
  readonly initialView: MariachiExperienceView;
}

const VIEW_COPY: Readonly<Record<MariachiExperienceView, string>> = {
  catalog: "Catálogo",
  discovery: "Descubrir",
};

export default function MariachiViewSwitcher({
  catalog,
  discovery,
  initialView,
}: MariachiViewSwitcherProps): React.ReactElement {
  const [view, setView] = useState<MariachiExperienceView>(initialView);
  const [preferenceRestored, setPreferenceRestored] = useState<boolean>(false);

  // 1. Restaurar la preferencia del visitante (una sola vez, tras hidratar).
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(MARIACHI_VIEW_STORAGE_KEY);
      if (isMariachiExperienceView(stored)) setView(stored);
    } catch {
      // Almacenamiento bloqueado (modo privado): se mantiene el flag del servidor.
    } finally {
      setPreferenceRestored(true);
    }
  }, []);

  // 2. Persistir sólo cuando la preferencia ya fue restaurada: nunca pisar el
  //    valor guardado con el default del servidor antes de leerlo.
  useEffect(() => {
    if (!preferenceRestored) return;
    try {
      window.localStorage.setItem(MARIACHI_VIEW_STORAGE_KEY, view);
    } catch {
      // Silencioso por diseño: la vista sigue funcionando sin persistencia.
    }
  }, [view, preferenceRestored]);

  const selectView = useCallback((next: MariachiExperienceView) => {
    setView(next);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        selectView("discovery");
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        selectView("catalog");
      }
    },
    [selectView],
  );

  return (
    <div className="w-full">
      <div className="flex justify-center mb-8">
        <div
          role="tablist"
          aria-label="Modo de exploración del catálogo de mariachis"
          onKeyDown={handleKeyDown}
          className="inline-flex items-center gap-1 p-1.5 rounded-2xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md"
        >
          <button
            type="button"
            role="tab"
            id="mariachi-tab-catalog"
            aria-selected={view === "catalog"}
            aria-controls="mariachi-panel-catalog"
            tabIndex={view === "catalog" ? 0 : -1}
            onClick={() => selectView("catalog")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-mono uppercase tracking-[0.2em] transition-colors duration-300 ease-out ${
              view === "catalog"
                ? "bg-[#ecb613] text-[#030305] font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <LayoutGrid size={13} />
            {VIEW_COPY.catalog}
          </button>
          <button
            type="button"
            role="tab"
            id="mariachi-tab-discovery"
            aria-selected={view === "discovery"}
            aria-controls="mariachi-panel-discovery"
            tabIndex={view === "discovery" ? 0 : -1}
            onClick={() => selectView("discovery")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-mono uppercase tracking-[0.2em] transition-colors duration-300 ease-out ${
              view === "discovery"
                ? "bg-[#ecb613] text-[#030305] font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Compass size={13} />
            {VIEW_COPY.discovery}
          </button>
        </div>
      </div>

      <div
        id="mariachi-panel-catalog"
        role="tabpanel"
        aria-labelledby="mariachi-tab-catalog"
        hidden={view !== "catalog"}
        className="min-h-[420px]"
      >
        {catalog}
      </div>

      <div
        id="mariachi-panel-discovery"
        role="tabpanel"
        aria-labelledby="mariachi-tab-discovery"
        hidden={view !== "discovery"}
        className="min-h-[420px]"
      >
        {discovery}
      </div>
    </div>
  );
}
