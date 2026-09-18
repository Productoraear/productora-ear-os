"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Cpu,
  Layers,
  Music,
  Building2,
  HeartPulse,
  Landmark,
  CreditCard,
  MessageCircle,
  PhoneIncoming,
  Share2,
  CheckCircle2,
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Truck,
  DollarSign,
  Lock,
  RefreshCcw,
  Users
} from 'lucide-react';

interface PackOption {
  id: string;
  name: string;
  base: number;
  desc: string;
}

const PACKS: PackOption[] = [
  { id: 'solista', name: 'Edwin Agudelo (Tenor Insignia)', base: 350, desc: 'Voz lírica, sonido Bose F1 812 · 12 W/pax' },
  { id: 'trio', name: 'Mariachi Trío Tradición', base: 550, desc: 'Guitarra, vihuela y trompeta de gala' },
  { id: 'imperial', name: 'Mariachi Imperial (6 músicos)', base: 850, desc: 'Show de gala completo para bodas y galas' },
  { id: 'cuarteto', name: 'Cuarteto de Cuerdas Sinfonía', base: 650, desc: '2 violines, viola y chelo clásico' },
  { id: 'djsax', name: 'DJ Profesional + Saxo Directo', base: 750, desc: 'Sonido e iluminación LED de alta gama' },
  { id: 'pantallas', name: 'Pantalla LED Gigante 4x2m', base: 1200, desc: 'Calibración exterior P3.9 waterproof' }
];

export default function AdminSimulatorCatminPage() {
  const [selectedPack, setSelectedPack] = useState<PackOption>(PACKS[0]);
  const [distanceKm, setDistanceKm] = useState<number>(35);
  const [isLateNight, setIsLateNight] = useState<boolean>(false);
  const [extraVimume, setExtraVimume] = useState<boolean>(false);

  // Cálculos Logística S-Class (Méntrida Km 0)
  const billableKm = distanceKm > 50 ? distanceKm - 50 : 0;
  const kmCost = billableKm * 1.50;
  const needsHotel = distanceKm > 200 || isLateNight;
  const hotelCost = needsHotel ? 120 : 0;
  const vimumeAddon = extraVimume ? 150 : 0;

  const totalEventCost = selectedPack.base + kmCost + hotelCost + vimumeAddon;

  // Split Soberano 80/10/10
  const artistFee = selectedPack.base * 0.80;
  const earFee = selectedPack.base * 0.10;
  const vimumeFee = (selectedPack.base * 0.10) + vimumeAddon;
  const vimumeTaxBenefit = vimumeFee * 0.80; // 80% desgravación IRPF Ley 49/2002

  const whatsappMessage = encodeURIComponent(
    `¡Hola Productora EAR! Solicito presupuesto oficial para ${selectedPack.name} a ${distanceKm} km de Méntrida. Total estimado: ${totalEventCost.toFixed(2)} € (incluye depósito de 100 € y Split 80/10/10).`
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      
      {/* ===================================================================== */}
      {/* 1. HEADER DE PÁGINA CATMÍN                                            */}
      {/* ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a1a24] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>Admin</span>
            <span>/</span>
            <span>Núcleo</span>
            <span>/</span>
            <span className="text-[#ecb613] font-bold">Mapa & Simulador S-Class</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-syne uppercase mt-1">
            Academia & Simulador de Ventas
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/simulador-ear-os.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-mono text-zinc-200 flex items-center gap-2 transition-all"
          >
            <span>Modo Standalone 21st</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#ecb613]" />
          </a>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. CATMÍN ROW 1: 4 MÉTRICAS CLAVE DEL NEGOCIO                         */}
      {/* ===================================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        
        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-[#ecb613]/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Tarifa Base Solista</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">350,00 €</div>
          <p className="text-[11px] text-zinc-400 mt-1">Edwin Agudelo (Tenor Insignia)</p>
          <div className="mt-2 flex items-center text-xs font-mono text-emerald-400 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Bose F1 812 · 12 W/pax
          </div>
        </div>

        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-[#ecb613]/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Logística Méntrida Km 0</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Truck className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">1,50 €/km</div>
          <p className="text-[11px] text-zinc-400 mt-1">A partir del km 50 (+120€ hotel)</p>
          <div className="mt-2 flex items-center text-xs font-mono text-cyan-400 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Calculador Activo
          </div>
        </div>

        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-[#ecb613]/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Price-Lock Inmutable</span>
            <div className="w-8 h-8 rounded-lg bg-[#ecb613]/10 flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#ecb613]" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">100,00 €</div>
          <p className="text-[11px] text-zinc-400 mt-1">Stripe con hash SHA-256</p>
          <div className="mt-2 flex items-center text-xs font-mono text-[#ecb613] font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Cierre en 48 Horas
          </div>
        </div>

        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-[#ecb613]/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Tope Licitación Menor</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Landmark className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">&lt; 14.250 €</div>
          <p className="text-[11px] text-zinc-400 mt-1">Art. 118 LCSP (&lt;75 dB SPL)</p>
          <div className="mt-2 flex items-center text-xs font-mono text-purple-400 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            SROI 4.85x VIMUME
          </div>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* 3. SIMULADOR INTERACTIVO DE COTIZACIÓN EN VIVO (ESTILO CATMÍN)        */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Controles del Simulador (Span 7) */}
        <div className="lg:col-span-7 rounded-2xl border border-[#1a1a24] bg-[#050508] p-6 space-y-6 shadow-sm">
          <div>
            <span className="text-xs font-mono uppercase font-bold text-[#ecb613] tracking-wider">
              PASO 1
            </span>
            <h3 className="text-lg font-bold font-syne text-white uppercase mt-0.5">
              Selecciona Artista o Formación Musical
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PACKS.map(pack => (
              <button
                key={pack.id}
                onClick={() => setSelectedPack(pack)}
                className={`p-3.5 rounded-xl text-left font-mono transition-all border ${
                  selectedPack.id === pack.id
                    ? 'bg-[#ecb613] text-black border-[#ecb613] font-bold shadow-md shadow-[#ecb613]/20'
                    : 'bg-zinc-950 text-white border-zinc-900 hover:border-zinc-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs truncate">{pack.name}</span>
                  <span className="text-xs font-black shrink-0 ml-1">{pack.base} €</span>
                </div>
                <div className={`text-[10px] mt-1 line-clamp-1 ${selectedPack.id === pack.id ? 'text-black/80' : 'text-zinc-400'}`}>
                  {pack.desc}
                </div>
              </button>
            ))}
          </div>

          {/* Slider de Kilómetros desde Méntrida */}
          <div className="space-y-2 pt-4 border-t border-zinc-900">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-300 font-bold">Distancia desde Méntrida Km 0:</span>
              <span className="text-xl font-black text-[#ecb613]">{distanceKm} km</span>
            </div>
            <input
              type="range"
              min="0"
              max="400"
              step="5"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseInt(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#ecb613]"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>0-50 km: 0 € (Exento)</span>
              <span>&gt; 50 km: 1,50 €/km</span>
              <span>&gt; 200 km: +120 € Hotel</span>
            </div>
          </div>

          {/* Switches Opcionales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-zinc-900">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-900 cursor-pointer hover:border-zinc-800">
              <input
                type="checkbox"
                checked={isLateNight}
                onChange={(e) => setIsLateNight(e.target.checked)}
                className="w-4 h-4 rounded text-[#ecb613] accent-[#ecb613]"
              />
              <div>
                <div className="text-xs font-bold text-white">Fin después de las 3:00 AM</div>
                <div className="text-[10px] font-mono text-zinc-500">+120 € dieta/hotel</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-900 cursor-pointer hover:border-zinc-800">
              <input
                type="checkbox"
                checked={extraVimume}
                onChange={(e) => setExtraVimume(e.target.checked)}
                className="w-4 h-4 rounded text-[#ecb613] accent-[#ecb613]"
              />
              <div>
                <div className="text-xs font-bold text-white">Addon VIMUME Solidario</div>
                <div className="text-[10px] font-mono text-cyan-400">+150 € (80% deducible)</div>
              </div>
            </label>
          </div>
        </div>

        {/* Desglose de Liquidación S-Class (Span 5) */}
        <div className="lg:col-span-5 rounded-2xl border border-[#ecb613]/40 bg-[#080811] p-6 space-y-5 shadow-xl">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#ecb613] font-bold tracking-wider">
                LIQUIDACIÓN OFICIAL
              </span>
              <h3 className="text-xl font-bold font-syne text-white uppercase">
                Presupuesto S-Class
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-400 font-mono block">TOTAL ESTIMADO</span>
              <span className="text-3xl font-black font-mono text-[#ecb613]">
                {totalEventCost.toFixed(2)} €
              </span>
            </div>
          </div>

          {/* Desglose de Gastos */}
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between text-zinc-300">
              <span>Caché Base {selectedPack.name.split(' ')[0]}:</span>
              <span>{selectedPack.base.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Portes Logística ({billableKm} km x 1,50 €):</span>
              <span>{kmCost.toFixed(2)} €</span>
            </div>
            {needsHotel && (
              <div className="flex justify-between text-amber-300">
                <span>Hotel y Dietas S-Class:</span>
                <span>{hotelCost.toFixed(2)} €</span>
              </div>
            )}
            {extraVimume && (
              <div className="flex justify-between text-cyan-400">
                <span>Aportación Extra VIMUME:</span>
                <span>{vimumeAddon.toFixed(2)} €</span>
              </div>
            )}
            <div className="flex justify-between text-[#ecb613] pt-2 border-t border-white/10 font-bold">
              <span>Señal Stripe Price-Lock (SHA-256):</span>
              <span>100,00 €</span>
            </div>
          </div>

          {/* Desglose Split 80/10/10 */}
          <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-2">
            <div className="text-[10px] font-mono uppercase font-bold text-zinc-400 tracking-wider">
              DESGLOSE SPLIT SOBERANO 80 / 10 / 10
            </div>
            <div className="flex justify-between text-xs font-mono text-emerald-400">
              <span>80% Artista Ejecutor (Edwin Agudelo):</span>
              <span className="font-bold">{artistFee.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-xs font-mono text-[#ecb613]">
              <span>10% Plataforma EAR OS:</span>
              <span className="font-bold">{earFee.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-xs font-mono text-cyan-400">
              <span>10% Impacto Social VIMUME:</span>
              <span className="font-bold">{vimumeFee.toFixed(2)} €</span>
            </div>
            <div className="text-[10px] font-mono text-zinc-500 pt-1 border-t border-white/5">
              ✓ Desgravación fiscal IRPF: -{vimumeTaxBenefit.toFixed(2)} €
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="space-y-2 pt-2">
            <a
              href={`https://wa.me/34693693048?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Despachar por WhatsApp (+34 693 693 048)</span>
            </a>

            <Link
              href="/admin/tesoreria"
              className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <CreditCard className="w-4 h-4 text-[#ecb613]" />
              <span>Generar Enlace Stripe 100€</span>
            </Link>
          </div>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* 4. LOS 5 DOMINIOS SOBERANOS (ESTILO CATMÍN)                            */}
      {/* ===================================================================== */}
      <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-6 space-y-4 shadow-sm">
        <div>
          <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest">
            ARQUITECTURA DE MARCA
          </span>
          <h2 className="text-xl font-bold font-syne text-white uppercase mt-1">
            Los 5 Dominios Soberanos de EAR OS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-[#ecb613]/50 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold font-mono text-[#ecb613]">CORE HUB</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <h3 className="text-sm font-bold text-white">productoraear.com</h3>
            <p className="text-[11px] text-zinc-400 mt-1 font-light">
              Sonido e iluminación, pantallas LED exterior, rider 12 W/pax y centralita oficial.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-emerald-500/50 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold font-mono text-emerald-400">ROSTER ARTISTAS</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <h3 className="text-sm font-bold text-white">artistaseuropa.com</h3>
            <p className="text-[11px] text-zinc-400 mt-1 font-light">
              Edwin Agudelo (Tenor 350 €), Mariachis y Cuartetos. Bloqueo 100 € en Stripe.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-cyan-500/50 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold font-mono text-cyan-400">FINCAS B2B</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <h3 className="text-sm font-bold text-white">fincasparaboda.com</h3>
            <p className="text-[11px] text-zinc-400 mt-1 font-light">
              Alianzas nupciales, cero cuota fija y liquidación automática de comisión del 10%.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-purple-500/50 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold font-mono text-purple-400">IMPACTO VIMUME</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <h3 className="text-sm font-bold text-white">viajemusicalporlamemoria.com</h3>
            <p className="text-[11px] text-zinc-400 mt-1 font-light">
              Neuro-musicoterapia (40 Hz Gamma) para Alzheimer. Deducción fiscal 80% IRPF.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 md:col-span-2 hover:border-blue-500/50 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold font-mono text-blue-400">LICITACIONES B2G</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <h3 className="text-sm font-bold text-white">productoraear.com/ayuntamientos</h3>
            <p className="text-[11px] text-zinc-400 mt-1 font-light">
              Contratos menores Art. 118 LCSP (&lt; 14.250 €), acústica &lt;75 dB SPL y código DIR3 FacturaE.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
