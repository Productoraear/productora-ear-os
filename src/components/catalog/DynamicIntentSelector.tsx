"use client";

import React, { useState } from "react";
import {
  Heart,
  Building2,
  Music,
  Landmark,
  Crown,
  Users2,
  Volume2,
  Hotel,
  Activity,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";

export type CatalogVertical = "all" | "artistas" | "fincas";

export interface IntentDefinition {
  id: string;
  name: string;
  verticals: CatalogVertical[];
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const CANONICAL_INTENTS: readonly IntentDefinition[] = Object.freeze([
  {
    id: "boda_gala",
    name: "Boda de Gala",
    verticals: ["all", "artistas", "fincas"],
    badge: "Solista 350 € • Bose F1",
    description: "Ceremonia, cóctel y banquete con solista y rider acústico 12 W/pax.",
    icon: Heart,
  },
  {
    id: "corporativo",
    name: "Evento Corporativo",
    verticals: ["all", "artistas", "fincas"],
    badge: "Microfonía Axient • NIF",
    description: "Convenciones y cenas de gala con facturación desglosada y sonido blindado.",
    icon: Building2,
  },
  {
    id: "serenata_intima",
    name: "Serenata Íntima",
    verticals: ["all", "artistas"],
    badge: "Sorpresa GPS • Acústico",
    description: "Actuación cercana y personalizada con llegada sincronizada vía satélite.",
    icon: Music,
  },
  {
    id: "b2g_fiestas",
    name: "Festejos B2G",
    verticals: ["all", "artistas"],
    badge: "Art. 118 LCSP < 14.250 €",
    description: "Plazas mayores y conciertos patronales bajo el techo legal de contrato menor.",
    icon: Landmark,
  },
  {
    id: "exclusiva_1dia",
    name: "Exclusiva 1 Día",
    verticals: ["all", "fincas"],
    badge: "1 Evento por Jornada",
    description: "Fincas de élite que garantizan exclusividad absoluta de la propiedad para la pareja.",
    icon: Crown,
  },
  {
    id: "gran_aforo",
    name: "Gran Aforo",
    verticals: ["all", "fincas"],
    badge: "> 300 Pax • Bus 55 Plazas",
    description: "Espacios de alta capacidad con logística de accesos, parking y potencia CETAC 32A.",
    icon: Users2,
  },
  {
    id: "sin_limitador",
    name: "Sin Limitador",
    verticals: ["all", "fincas"],
    badge: "90 dBA Aislamiento",
    description: "Propiedades con aislamiento natural certificadas para presión acústica de 90 dBA.",
    icon: Volume2,
  },
  {
    id: "alojamiento_vip",
    name: "Alojamiento VIP",
    verticals: ["all", "fincas"],
    badge: "Suites Integradas",
    description: "Complejos con alojamiento in-situ para familiares e invitados sin necesidad de desplazamiento nocturno.",
    icon: Hotel,
  },
  {
    id: "vimume_clinico",
    name: "VIMUME Clínico",
    verticals: ["all", "artistas"],
    badge: "Protocolo 40 Hz < 75 dB",
    description: "Intervenciones neuroacústicas para bienestar cognitivo en centros asistenciales y personas mayores.",
    icon: Activity,
  },
]);

export interface DynamicIntentSelectorProps {
  vertical?: CatalogVertical;
  activeIntent?: string;
  selectedIntent?: string;
  onIntentChange?: (intentId: string) => void;
  onSelectIntent?: (intentId: string) => void;
  onChange?: (intentId: string) => void;
  className?: string;
  showBadges?: boolean;
}

export function DynamicIntentSelector({
  vertical = "all",
  activeIntent,
  selectedIntent,
  onIntentChange,
  onSelectIntent,
  onChange,
  className = "",
  showBadges = true,
}: DynamicIntentSelectorProps) {
  // Determine controlled vs uncontrolled state
  const controlledValue = activeIntent ?? selectedIntent;
  const [internalIntent, setInternalIntent] = useState<string>("boda_gala");
  const currentActive = controlledValue ?? internalIntent;

  // Filter available intents based on vertical
  const availableIntents = CANONICAL_INTENTS.filter(
    (item) => vertical === "all" || item.verticals.includes(vertical)
  );

  const handleSelect = (intentId: string) => {
    if (controlledValue === undefined) {
      setInternalIntent(intentId);
    }
    onIntentChange?.(intentId);
    onSelectIntent?.(intentId);
    onChange?.(intentId);
  };

  const selectedDef = CANONICAL_INTENTS.find((i) => i.id === currentActive) || availableIntents[0];

  return (
    <div
      role="region"
      aria-label="Selector Dinámico de Intención"
      className={`w-full space-y-3 ${className}`}
    >
      {/* Header bar with indicator */}
      <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#ecb613]" />
          <span className="uppercase tracking-wider text-zinc-300 font-semibold">
            Selector de Intención • {vertical === "artistas" ? "Artistas de Gala" : vertical === "fincas" ? "Fincas de Élite" : "Catálogo Unificado"}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#ecb613]">
          <Sparkles className="w-3 h-3" />
          <span>Filtro reactivo activo</span>
        </div>
      </div>

      {/* Horizontal Scrollable Bar */}
      <div className="relative w-full">
        <div
          role="tablist"
          aria-label="Intenciones de búsqueda"
          className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent -mx-1 px-1"
        >
          {availableIntents.map((intent) => {
            const Icon = intent.icon;
            const isSelected = intent.id === currentActive;

            return (
              <button
                key={intent.id}
                role="tab"
                id={`tab-intent-${intent.id}`}
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => handleSelect(intent.id)}
                className={`group flex items-center gap-2.5 px-4 py-2.5 min-h-[46px] rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 border shrink-0 ${
                  isSelected
                    ? "bg-gradient-to-r from-[#ecb613] to-[#d4a010] text-black border-[#ecb613] shadow-lg shadow-[#ecb613]/15 font-semibold"
                    : "bg-[#08080c]/80 text-zinc-300 border-zinc-800/80 hover:border-zinc-700 hover:text-white hover:bg-zinc-900/60"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isSelected ? "text-black" : "text-[#ecb613]"
                  }`}
                />
                <span className="font-['Syne'] font-semibold tracking-wide">
                  {intent.name}
                </span>

                {showBadges && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full transition-colors ${
                      isSelected
                        ? "bg-black/20 text-black font-bold border border-black/10"
                        : "bg-zinc-900/90 text-zinc-400 border border-zinc-800 group-hover:text-zinc-200 group-hover:border-zinc-700"
                    }`}
                  >
                    {intent.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Intent Description Box */}
      {selectedDef && (
        <div className="rounded-xl border border-zinc-800/70 bg-[#060609]/70 px-4 py-2.5 flex items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ecb613] shrink-0" />
            <span className="truncate">
              <strong className="text-zinc-200 font-['Syne']">{selectedDef.name}:</strong>{" "}
              {selectedDef.description}
            </span>
          </div>
          <span className="shrink-0 font-mono text-[10px] text-zinc-400 uppercase tracking-widest hidden md:inline-block">
            Modo: {selectedDef.id}
          </span>
        </div>
      )}
    </div>
  );
}
