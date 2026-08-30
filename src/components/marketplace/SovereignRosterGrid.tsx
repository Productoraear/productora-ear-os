"use client";

import { useMemo, useState } from "react";

type Category = "voces" | "vimume" | "tecnica" | "especiales";

interface RosterFormat {
  id: string;
  name: string;
  provider: string;
  category: Category;
  price: number;
  distanceKm: number;
  description: string;
  durationSec: number;
}

const CATEGORY_LABELS: Record<Category, string> = {
  voces: "Voces & Ensembles",
  vimume: "VIMUME B2G",
  tecnica: "Técnica & Eventos",
  especiales: "Formatos Especiales",
};

const WHATSAPP_NUMBER = "34693693048";

const ROSTER: readonly RosterFormat[] = [
  {
    id: "solista",
    name: "Solista",
    provider: "Edwin Agudelo",
    category: "voces",
    price: 350,
    distanceKm: 0,
    description:
      "Voz y guitarra en directo. El formato insignia de Productora EAR, base fija en el Hub Central de Méntrida (Toledo).",
    durationSec: 24,
  },
  {
    id: "duo",
    name: "Dúo",
    provider: "Productora EAR",
    category: "voces",
    price: 480,
    distanceKm: 35,
    description:
      "Voz y piano o guitarra con arreglos de cámara para eventos íntimos, cenas y actos corporativos.",
    durationSec: 26,
  },
  {
    id: "trio",
    name: "Trío",
    provider: "Productora EAR",
    category: "voces",
    price: 600,
    distanceKm: 60,
    description:
      "Voz, guitarra y percusión. Cobertura completa de cócteles, ceremonias y celebraciones familiares.",
    durationSec: 28,
  },
  {
    id: "cuarteto",
    name: "Cuarteto",
    provider: "Productora EAR",
    category: "voces",
    price: 750,
    distanceKm: 80,
    description:
      "Formación de cámara con cuerdas y vientos para galas, presentaciones y eventos premium.",
    durationSec: 30,
  },
  {
    id: "quinteto",
    name: "Quinteto",
    provider: "Productora EAR",
    category: "voces",
    price: 900,
    distanceKm: 120,
    description:
      "Cinco músicos en escena con sonido de banda para bodas y eventos corporativos de alto nivel.",
    durationSec: 32,
  },
  {
    id: "gran-ensemble",
    name: "Gran Ensamble",
    provider: "Productora EAR",
    category: "voces",
    price: 1400,
    distanceKm: 150,
    description:
      "Ensemble completo con sección rítmica y vientos para festivales, salones y grandes celebraciones.",
    durationSec: 36,
  },
  {
    id: "vimume",
    name: "VIMUME",
    provider: "VIMUME B2G",
    category: "vimume",
    price: 480,
    distanceKm: 45,
    description:
      "Formato homologado para residencias de mayores y centros de día. Nivel sonoro < 75 dB SPL garantizado.",
    durationSec: 25,
  },
  {
    id: "pantallas-led",
    name: "Pantallas LED",
    provider: "Técnica EAR",
    category: "tecnica",
    price: 250,
    distanceKm: 25,
    description:
      "Pared de vídeo modular para mapping, directos, señalización y experiencias visuales en eventos.",
    durationSec: 18,
  },
  {
    id: "mariachi-femenino",
    name: "Mariachi Femenino",
    provider: "Productora EAR",
    category: "especiales",
    price: 700,
    distanceKm: 90,
    description:
      "Tradición mexicana con voz femenina principal para celebraciones, mañanitas y momentos únicos.",
    durationSec: 34,
  },
  {
    id: "discomovil-bose-f1",
    name: "Discomóvil Bose F1",
    provider: "Técnica EAR",
    category: "tecnica",
    price: 450,
    distanceKm: 30,
    description:
      "DJ set con columnas Bose F1 812 y microfonía Shure Axient RF. Presión acústica de 12 W/pax.",
    durationSec: 27,
  },
  {
    id: "duo-clasico",
    name: "Dúo Clásico",
    provider: "Productora EAR",
    category: "especiales",
    price: 380,
    distanceKm: 70,
    description:
      "Voz y piano con repertorio de clásicos universales para momentos solemnes y elegantes.",
    durationSec: 29,
  },
  {
    id: "saxo-lounge",
    name: "Saxo Lounge",
    provider: "Productora EAR",
    category: "especiales",
    price: 400,
    distanceKm: 55,
    description:
      "Saxofón en directo con base electrónica para cócteles, aperturas y ambientes lounge.",
    durationSec: 23,
  },
  {
    id: "flamenco-pop",
    name: "Flamenco Pop",
    provider: "Productora EAR",
    category: "especiales",
    price: 650,
    distanceKm: 65,
    description:
      "Fusión de flamenco y pop con palmas, guitarra española y voz protagonista.",
    durationSec: 31,
  },
  {
    id: "coro-rociero",
    name: "Coro Rociero",
    provider: "Productora EAR",
    category: "especiales",
    price: 800,
    distanceKm: 110,
    description:
      "Coro de voces para hermandades, romerías y actos religiosos al aire libre.",
    durationSec: 33,
  },
];

const CATEGORY_FILTERS: ReadonlyArray<{ id: Category | "todos"; label: string }> = [
  { id: "todos", label: "Todos" },
  { id: "voces", label: CATEGORY_LABELS.voces },
  { id: "vimume", label: CATEGORY_LABELS.vimume },
  { id: "tecnica", label: CATEGORY_LABELS.tecnica },
  { id: "especiales", label: CATEGORY_LABELS.especiales },
];

const BUDGET_OPTIONS = [
  { label: "Presupuesto: sin límite", value: 0 },
  { label: "Hasta 400 €", value: 400 },
  { label: "Hasta 600 €", value: 600 },
  { label: "Hasta 900 €", value: 900 },
  { label: "Hasta 1.500 €", value: 1500 },
] as const;

const DISTANCE_OPTIONS = [
  { label: "Distancia desde Méntrida: cualquier", value: 0 },
  { label: "≤ 50 km de Méntrida", value: 50 },
  { label: "≤ 100 km de Méntrida", value: 100 },
  { label: "≤ 200 km de Méntrida", value: 200 },
] as const;

const BADGES = [
  { label: "RIDER ACÚSTICO · 12 W/PAX", color: "#AAD6CD" },
  { label: "SPLIT SOBERANO · 80/10/10", color: "#ecb613" },
  { label: "DEPÓSITO STRIPE · 100 € SHA-256", color: "#AAD6CD" },
] as const;

const GLOBAL_CSS = `
@keyframes eq-bounce { 0%, 100% { transform: scaleY(0.25); } 50% { transform: scaleY(1); } }
.eq { display: flex; align-items: flex-end; gap: 3px; height: 20px; }
.eq-bar { width: 3px; border-radius: 2px; background: linear-gradient(180deg, #AAD6CD 0%, #ecb613 100%); transform-origin: center bottom; animation: eq-bounce 1s ease-in-out infinite; }
.eq-paused .eq-bar { animation-play-state: paused; transform: scaleY(0.22); opacity: 0.45; }
.roster-card { background: linear-gradient(160deg, #0b0b10 0%, #050505 65%); border: 1px solid rgba(236, 182, 19, 0.16); border-radius: 18px; transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; }
.roster-card:hover { transform: translateY(-4px); border-color: rgba(236, 182, 19, 0.5); box-shadow: 0 18px 48px rgba(0, 0, 0, 0.55), 0 0 32px rgba(236, 182, 19, 0.1); }
.roster-select { background: #09090d; color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.14); border-radius: 10px; padding: 10px 12px; font-size: 13px; outline: none; }
.roster-select:focus { border-color: #ecb613; }
`;

function formatPrice(value: number): string {
  return `${value.toLocaleString("es-ES")} €`;
}

function formatDuration(totalSec: number): string {
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function checkoutLink(format: RosterFormat): string {
  return `/checkout/presupuesto?format=${encodeURIComponent(format.id)}&base=${format.price}`;
}

function whatsappLink(format: RosterFormat): string {
  const text = encodeURIComponent(
    `Hola EAR OS, quiero contratar el formato ${format.name} (${format.price} € base) para mi evento.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

const EQ_BARS: readonly number[] = [0.9, 1.25, 0.7, 1.45, 1.05];

function Equalizer({ active }: { active: boolean }) {
  return (
    <div className={`eq ${active ? "" : "eq-paused"}`} aria-hidden="true">
      {EQ_BARS.map((duration, index) => (
        <span
          key={index}
          className="eq-bar"
          style={{ animationDuration: `${duration}s`, animationDelay: `${index * 0.12}s` }}
        />
      ))}
    </div>
  );
}

interface RosterCardProps {
  format: RosterFormat;
  isPlaying: boolean;
  onTogglePlay: (id: string) => void;
}

function RosterCard({ format, isPlaying, onTogglePlay }: RosterCardProps) {
  return (
    <article className="roster-card flex flex-col p-6">
      <div className="flex items-start justify-between gap-4">
        <span
          style={{ color: "#AAD6CD", fontSize: 11, letterSpacing: "0.18em" }}
          className="uppercase"
        >
          {CATEGORY_LABELS[format.category]}
        </span>
        <span
          style={{
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            color: "#ecb613",
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          {formatPrice(format.price)}
        </span>
      </div>

      <h3
        style={{ fontFamily: '"Syne", "Inter", sans-serif', color: "#ffffff" }}
        className="mt-2 text-2xl font-bold tracking-tight"
      >
        {format.name}
      </h3>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }} className="mt-1 uppercase tracking-widest">
        {format.provider}
      </p>
      <p style={{ color: "rgba(255,255,255,0.72)" }} className="mt-3 text-sm leading-relaxed">
        {format.description}
      </p>

      {/* Reproductor de audio simulado */}
      <div
        className="mt-5 flex items-center gap-3 px-4 py-3"
        style={{ background: "#09090d", border: "1px solid rgba(170,214,205,0.18)", borderRadius: 12 }}
      >
        <button
          type="button"
          onClick={() => onTogglePlay(format.id)}
          aria-label={isPlaying ? `Pausar demo de ${format.name}` : `Reproducir demo de ${format.name}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-105"
          style={{ background: "#ecb613", color: "#050505" }}
        >
          {isPlaying ? (
            <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" aria-hidden="true">
              <rect x="0" y="0" width="4" height="14" rx="1" />
              <rect x="8" y="0" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="13" height="14" viewBox="0 0 13 14" fill="currentColor" aria-hidden="true">
              <path d="M0 0 L13 7 L0 14 Z" />
            </svg>
          )}
        </button>

        <Equalizer active={isPlaying} />

        <span
          style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace', color: "rgba(255,255,255,0.6)", fontSize: 12 }}
        >
          {formatDuration(format.durationSec)}
        </span>

        <div
          className="h-[3px] flex-1 overflow-hidden rounded-full"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <div
            style={{
              width: isPlaying ? "100%" : "0%",
              height: "100%",
              background: "linear-gradient(90deg, #AAD6CD, #ecb613)",
              transition: `width ${format.durationSec}s linear`,
            }}
          />
        </div>
      </div>

      {/* Badges de gobernanza */}
      <ul className="mt-4 flex flex-wrap gap-2">
        {BADGES.map((badge) => (
          <li
            key={badge.label}
            style={{
              border: `1px solid ${badge.color}55`,
              color: badge.color,
              fontSize: 10,
              letterSpacing: "0.08em",
            }}
            className="rounded-full px-3 py-1"
          >
            {badge.label}
          </li>
        ))}
      </ul>

      <p
        style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: "0.1em" }}
        className="mt-4 uppercase"
      >
        {format.distanceKm === 0
          ? "Base en Hub Central · Méntrida (Toledo)"
          : `Hub Méntrida → ${format.distanceKm} km`}
      </p>

      {/* CTAs */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <a
          href={checkoutLink(format)}
          style={{ background: "#ecb613", color: "#050505" }}
          className="rounded-xl px-4 py-3 text-center text-sm font-bold tracking-wide transition-opacity hover:opacity-90"
        >
          Contratar en 1-Clic
        </a>
        <a
          href={whatsappLink(format)}
          target="_blank"
          rel="noopener noreferrer"
          style={{ border: "1px solid rgba(170,214,205,0.4)", color: "#AAD6CD" }}
          className="rounded-xl px-4 py-3 text-center text-sm font-semibold tracking-wide transition-colors hover:bg-[#AAD6CD]/10"
        >
          WhatsApp +34 693 693 048
        </a>
      </div>
    </article>
  );
}

export default function SovereignRosterGrid() {
  const [category, setCategory] = useState<Category | "todos">("todos");
  const [maxBudget, setMaxBudget] = useState<number>(0);
  const [maxDistance, setMaxDistance] = useState<number>(0);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return ROSTER.filter((format) => {
      if (category !== "todos" && format.category !== category) return false;
      if (maxBudget > 0 && format.price > maxBudget) return false;
      if (maxDistance > 0 && format.distanceKm > maxDistance) return false;
      return true;
    });
  }, [category, maxBudget, maxDistance]);

  const handleTogglePlay = (id: string): void => {
    setPlayingId((previous) => (previous === id ? null : id));
  };

  const resetFilters = (): void => {
    setCategory("todos");
    setMaxBudget(0);
    setMaxDistance(0);
  };

  return (
    <section id="roster" style={{ background: "#050505", color: "#ffffff" }} className="px-6 py-16 sm:px-10">
      <style>{GLOBAL_CSS}</style>

      <div className="mx-auto max-w-7xl">
        <p style={{ color: "#ecb613", fontSize: 12, letterSpacing: "0.3em" }} className="uppercase">
          Roster Homologado · 14 Formatos
        </p>
        <h2
          style={{ fontFamily: '"Syne", "Inter", sans-serif' }}
          className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Roster Soberano de Productora EAR
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)" }} className="mt-3 max-w-2xl text-sm leading-relaxed">
          Proveedores y formatos certificados desde el Hub Central de Méntrida (Toledo). Rider acústico de 12 W/pax,
          Split Soberano inmutable 80/10/10 y cierre transaccional con depósito Stripe de 100 € firmado SHA-256.
        </p>

        {/* Filtros */}
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
            {CATEGORY_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setCategory(filter.id)}
                style={{
                  background: category === filter.id ? "#ecb613" : "transparent",
                  color: category === filter.id ? "#050505" : "rgba(255,255,255,0.7)",
                  border: `1px solid ${category === filter.id ? "#ecb613" : "rgba(255,255,255,0.18)"}`,
                }}
                className="rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-colors"
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <label className="sr-only" htmlFor="roster-budget">
              Filtrar por presupuesto máximo
            </label>
            <select
              id="roster-budget"
              className="roster-select"
              value={String(maxBudget)}
              onChange={(event) => setMaxBudget(Number(event.target.value))}
            >
              {BUDGET_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="roster-distance">
              Filtrar por distancia desde Méntrida
            </label>
            <select
              id="roster-distance"
              className="roster-select"
              value={String(maxDistance)}
              onChange={(event) => setMaxDistance(Number(event.target.value))}
            >
              {DISTANCE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((format) => (
              <RosterCard
                key={format.id}
                format={format}
                isPlaying={playingId === format.id}
                onTogglePlay={handleTogglePlay}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl p-10 text-center" style={{ border: "1px dashed rgba(236,182,19,0.35)" }}>
            <p style={{ color: "#AAD6CD" }} className="text-sm">
              Ningún formato coincide con los filtros seleccionados.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              style={{ background: "#ecb613", color: "#050505" }}
              className="mt-4 rounded-xl px-5 py-2 text-sm font-bold"
            >
              Restablecer filtros
            </button>
          </div>
        )}

        <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 12 }} className="mt-10 max-w-4xl leading-relaxed">
          Tarifas base desde el Hub Central de Méntrida (Toledo). Logística S-Class: +1,50 €/km a partir del km 50 ·
          Suplemento hotelero +120 € si la jornada finaliza ≥ 3:00 AM o supera los 200 km. Depósito de reserva de 100 €
          con Price-Lock SHA-256 (validez 24–72 h). Teléfono oficial de retención: +34 693 693 048.
        </p>
      </div>
    </section>
  );
}