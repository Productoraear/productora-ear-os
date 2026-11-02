"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  Mic2,
  Tv,
  Sparkles,
  ShieldCheck,
  Zap,
  Truck,
  CheckCircle2,
  ArrowRight,
  Plus,
  ShoppingCart
} from "lucide-react";
import { TARIFA_BASE_SOLISTA_EUR, DEPOSITO_STRIPE_EUR } from "@/lib/constants/ear-os-ssot";

/**
 * ══════════════════════════════════════════════════════════════════════════════
 * SOVEREIGN ARSENAL COMMERCE HUB — OMEGA DIAMANTE V10
 * ══════════════════════════════════════════════════════════════════════════════
 * Componente híbrido: E-commerce Audiovisual + SaaS Calibrador + Directorio de Stock.
 * Diseñado con estética OLED ultra-profunda (#030305), acentos oro (#ecb613) y rubí (#ff2b44).
 * Código 100% offline, adaptado con micro-interacciones inspiradas en 21st.dev.
 */

export interface ArsenalItem {
  id: string;
  name: string;
  category: "sonido" | "microfonia" | "iluminacion" | "video" | "escenario";
  brand: string;
  specs: string;
  wattsPax?: number;
  dbSpl?: number;
  pricePerDayEur: number;
  stockAvailable: number;
  popular?: boolean;
}

const ARSENAL_CATALOG: ArsenalItem[] = [
  {
    id: "bose-f1-model-812",
    name: "Line Array Bose F1 Model 812",
    category: "sonido",
    brand: "Bose Professional",
    specs: "1000W Bi-amplificado · Array flexible 4 patrones (Straight, C, J, Reverse J)",
    wattsPax: 12,
    dbSpl: 132,
    pricePerDayEur: 180,
    stockAvailable: 14,
    popular: true
  },
  {
    id: "bose-f1-subwoofer",
    name: "Subwoofer Bose F1 Dual 10''",
    category: "sonido",
    brand: "Bose Professional",
    specs: "1000W Graves profundos hasta 40 Hz · Soporte integrado para Model 812",
    wattsPax: 8,
    dbSpl: 130,
    pricePerDayEur: 140,
    stockAvailable: 10,
    popular: true
  },
  {
    id: "shure-axient-beta87a",
    name: "Shure Axient Digital + Beta 87A",
    category: "microfonia",
    brand: "Shure Axient",
    specs: "Cápsula condensador supercardioide · Salto de frecuencia anti-interferencias",
    pricePerDayEur: 95,
    stockAvailable: 24,
    popular: true
  },
  {
    id: "dpa-4099-instrumental",
    name: "Microfonía DPA 4099 Core (Violín/Trompeta)",
    category: "microfonia",
    brand: "DPA Microphones",
    specs: "Condensador miniatura con soporte anti-vibración acústico de estudio",
    pricePerDayEur: 65,
    stockAvailable: 18
  },
  {
    id: "pantalla-led-p26-curva",
    name: "Muro Pantalla LED P2.6 Gran Formato",
    category: "video",
    brand: "Novastar UltraHD",
    specs: "Frecuencia 3840Hz · Brillo 1200 nits · Configurable por m² (Interior/Exterior)",
    pricePerDayEur: 450,
    stockAvailable: 40,
    popular: true
  },
  {
    id: "robotica-beam-wash-350w",
    name: "Robótica Móvil Híbrida Beam/Wash 350W",
    category: "iluminacion",
    brand: "Chauvet Pro DMX",
    specs: "Prisma 8 facetas · Zoom 3° a 36° · Control inalámbrico WDMX",
    pricePerDayEur: 85,
    stockAvailable: 32
  }
];

const CATEGORIES = [
  { id: "todos", label: "Catálogo Completo", icon: Sparkles },
  { id: "sonido", label: "PA & Sonorización (12 W/pax)", icon: Volume2 },
  { id: "microfonia", label: "Microfonía de Gala", icon: Mic2 },
  { id: "video", label: "Pantallas LED Novastar", icon: Tv },
  { id: "iluminacion", label: "Iluminación Escénica", icon: Zap }
];

export function SovereignArsenalCommerceHub(): React.JSX.Element {
  const [selectedCat, setSelectedCat] = useState<string>("todos");
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [guestsCount, setGuestsCount] = useState<number>(150);

  const filteredItems = selectedCat === "todos"
    ? ARSENAL_CATALOG
    : ARSENAL_CATALOG.filter(item => item.category === selectedCat);

  const addToCart = (id: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const copy = { ...prev };
      if (copy[id] > 1) copy[id]--;
      else delete copy[id];
      return copy;
    });
  };

  const cartTotalEur = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = ARSENAL_CATALOG.find(i => i.id === id);
    return sum + (item ? item.pricePerDayEur * qty : 0);
  }, 0);

  const totalItemsCount = Object.values(cart).reduce((a, b) => a + b, 0);

  // Calibración acústica telemática (SaaS Mode)
  const recommendedWatts = guestsCount * 12; // 12 W/pax Ley 37/2003

  return (
    <section className="relative mx-auto my-16 max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
      {/* 1. CABECERA & INTELIGENCIA ACÚSTICA */}
      <div className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-8 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ecb613]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] items-center">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ecb613]/30 bg-[#ecb613]/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-[#ecb613]">
              <ShieldCheck className="w-3.5 h-3.5" /> E-Commerce Audiovisual S-Class
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Arsenal Técnico de Élite & <span className="text-[#ecb613]">Stock en Tiempo Real</span>
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl">
              Alquiler directo sin intermediarios. Configura tu rider homologado bajo la Ley 37/2003 del Ruido.
              Tarifas transparentes por jornada, logística calculada por geolocalización y garantía de cero acoples.
            </p>
          </div>

          {/* SaaS WIDGET DE CALIBRACIÓN */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-zinc-400">Calibrador 12 W/pax</span>
              <span className="text-xs font-mono text-[#ecb613]">{guestsCount} Invitados</span>
            </div>
            <input
              type="range"
              min="30"
              max="1000"
              step="10"
              value={guestsCount}
              onChange={(e) => setGuestsCount(Number(e.target.value))}
              className="w-full accent-[#ecb613] bg-zinc-800 rounded-lg cursor-pointer h-2"
            />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl border border-white/5 bg-black/40 p-3 text-center">
                <span className="text-[10px] uppercase font-mono text-zinc-500">Potencia Óptima</span>
                <p className="text-lg font-bold text-white">{recommendedWatts} W</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-black/40 p-3 text-center">
                <span className="text-[10px] uppercase font-mono text-zinc-500">Presión Legal</span>
                <p className="text-lg font-bold text-[#ecb613]">&lt; 85 dBA</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SELECTOR DE CATEGORÍAS (TABS VANGUARDISTAS) */}
      <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCat === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`shrink-0 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all duration-300 ease-out border ${
                isActive
                  ? "bg-[#ecb613] text-[#030305] border-[#ecb613] shadow-[0_0_20px_rgba(236,182,19,0.3)]"
                  : "bg-white/[0.03] text-zinc-400 border-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 3. GRID DE PRODUCTOS E-COMMERCE CON MICRO-INTERACCIONES */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              key={item.id}
              className={`rounded-3xl border p-6 flex flex-col justify-between backdrop-blur-md relative transition-all duration-300 ${
                item.popular
                  ? "border-[#ecb613]/40 bg-[#09090d]/90 shadow-[0_4px_24px_-4px_rgba(236,182,19,0.1)]"
                  : "border-white/10 bg-[#09090d]/60 hover:border-white/20"
              }`}
            >
              {item.popular && (
                <span className="absolute top-5 right-5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[#ecb613]">
                  Rider Oficial
                </span>
              )}

              <div className="space-y-3">
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">{item.brand}</span>
                <h3 className="text-lg font-bold text-white leading-snug">{item.name}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{item.specs}</p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {item.wattsPax && (
                    <span className="rounded-md bg-white/5 px-2 py-1 text-[10px] font-mono text-zinc-300">
                      {item.wattsPax} W/pax
                    </span>
                  )}
                  {item.dbSpl && (
                    <span className="rounded-md bg-white/5 px-2 py-1 text-[10px] font-mono text-zinc-300">
                      Pico {item.dbSpl} dB SPL
                    </span>
                  )}
                  <span className="rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 text-[10px] font-mono">
                    {item.stockAvailable} uds. en nave
                  </span>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-white">{item.pricePerDayEur} €</span>
                  <span className="text-xs text-zinc-500"> / jornada</span>
                </div>

                <button
                  onClick={() => addToCart(item.id)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-[#ecb613] hover:text-[#030305] text-white px-4 py-2 text-xs font-bold transition-all duration-300"
                >
                  <Plus className="w-3.5 h-3.5" /> Añadir
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 4. BARRA DE CIERRE TRANSACCIONAL (STRIPE PRICE-LOCK DEDUCIBLE) */}
      {totalItemsCount > 0 && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 left-4 right-4 max-w-4xl mx-auto rounded-3xl border border-[#ecb613]/50 bg-[#030305]/95 p-5 backdrop-blur-xl shadow-2xl z-50 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                {totalItemsCount} elemento(s) configurados · Subtotal {cartTotalEur} € + IVA
              </p>
              <p className="text-xs text-zinc-400">
                Bloqueo atómico con depósito de {DEPOSITO_STRIPE_EUR} € (100% deducible de la liquidación final).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`/reservar/solista?items=${Object.keys(cart).join(",")}&intent=alquiler`}
              className="inline-flex items-center gap-2 rounded-full bg-[#ecb613] hover:bg-[#f5cf5b] text-[#030305] px-6 py-3 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(236,182,19,0.4)]"
            >
              Bloquear con {DEPOSITO_STRIPE_EUR} € <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      )}
    </section>
  );
}
export default SovereignArsenalCommerceHub;

