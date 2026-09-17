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
  ShieldCheck
} from 'lucide-react';

interface PackOption {
  id: string;
  name: string;
  base: number;
  desc: string;
}

const PACKS: PackOption[] = [
  { id: 'solista', name: 'Edwin Agudelo (Tenor Insignia)', base: 350, desc: 'Voz lírica, sonido Bose F1' },
  { id: 'trio', name: 'Mariachi Trío Tradición', base: 550, desc: 'Guitarra, vihuela y trompeta' },
  { id: 'imperial', name: 'Mariachi Imperial (6 músicos)', base: 850, desc: 'Show de gala completo' },
  { id: 'cuarteto', name: 'Cuarteto de Cuerdas Sinfonía', base: 650, desc: '2 violines, viola y chelo' },
  { id: 'djsax', name: 'DJ Profesional + Saxo Directo', base: 750, desc: 'Sonido e iluminación LED' },
  { id: 'pantallas', name: 'Pantalla LED Gigante 4x2m', base: 1200, desc: 'Calibración exterior P3.9' }
];

export default function AdminSimulatorPage() {
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

  const whatsappMessage = encodeURIComponent(
    `¡Hola Productora EAR! Solicito presupuesto oficial para ${selectedPack.name} a ${distanceKm} km de Méntrida. Total estimado: ${totalEventCost.toFixed(2)} € (incluye depósito de 100 € y Split 80/10/10).`
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      
      {/* Header Vanguardista 21st.dev Style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1a1a24] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono uppercase tracking-widest mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Simulador & Mapa de Dominancia S-Class</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-syne uppercase tracking-tight">
            Academia Operativa EAR OS
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Herramienta interactiva para que el CEO domine los 5 dominios, el Split 80/10/10, la logística y las licitaciones públicas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/simulador-ear-os.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-mono text-zinc-200 flex items-center gap-1.5 transition-all"
          >
            <span>Ver Modo Pantalla Completa (21st.dev)</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#ecb613]" />
          </a>
        </div>
      </div>

      {/* 🗺️ BENTO GRID: LOS 5 DOMINIOS SOBERANOS */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-syne text-white uppercase flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#ecb613]" />
          <span>Ecosistema de los 5 Dominios Soberanos</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <div className="p-6 rounded-3xl bg-[#08080d] border border-white/10 space-y-3 hover:border-[#ecb613]/40 transition-all">
            <div className="flex justify-between items-start">
              <span className="p-2.5 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/20 text-[#ecb613]">
                <Layers className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                CORE HUB
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Hub Central</span>
              <h3 className="text-lg font-bold font-syne text-white">productoraear.com</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Catálogo de sonido e iluminación, pantallas LED, rider 12 W/pax y centralita telefónica oficial.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#08080d] border border-white/10 space-y-3 hover:border-red-500/40 transition-all">
            <div className="flex justify-between items-start">
              <span className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                <Music className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/10 font-bold">
                ARTISTAS
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Roster en Vivo</span>
              <h3 className="text-lg font-bold font-syne text-white">artistaseuropa.com</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Edwin Agudelo (Tenor Insignia 350 €), Mariachis y Cuartetos. Bloqueo de fecha con 100 € Stripe.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#08080d] border border-white/10 space-y-3 hover:border-emerald-500/40 transition-all">
            <div className="flex justify-between items-start">
              <span className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Building2 className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/10 font-bold">
                B2B FINCAS
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Alianzas Nupciales</span>
              <h3 className="text-lg font-bold font-syne text-white">fincasparaboda.com</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Portal para fincas y cáterings. 0 € cuota fija, comisiones transparentes del 10% por evento.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#08080d] border border-white/10 space-y-3 hover:border-cyan-500/40 transition-all">
            <div className="flex justify-between items-start">
              <span className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <HeartPulse className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                ESG SOCIAL
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Impacto Sanitario</span>
              <h3 className="text-lg font-bold font-syne text-white">viajemusicalporlamemoria.com</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Neuro-musicoterapia (40 Hz Gamma) para Alzheimer. Financiado con el 10% y 80% deducción IRPF.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#08080d] border border-white/10 space-y-3 md:col-span-2 hover:border-blue-500/40 transition-all">
            <div className="flex justify-between items-start">
              <span className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Landmark className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                B2G PÚBLICO
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Sector Público</span>
              <h3 className="text-lg font-bold font-syne text-white">productoraear.com/ayuntamientos</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Contratos menores Art. 118 LCSP (&lt; 14.250 €), homologación acústica &lt; 75 dB SPL y facturación electrónica FacturaE (código DIR3).
            </p>
          </div>

        </div>
      </section>

      {/* 🧮 SIMULADOR INTERACTIVO DE COTIZACIONES EN VIVO */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-syne text-white uppercase flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#ecb613]" />
          <span>Simulador de Cotización & Logística Méntrida Km 0</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Controles del Simulador (Span 7) */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-[#08080d] border border-white/10 space-y-6">
            
            {/* Formaciones */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                1. Selección de Artista / Formación:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PACKS.map(pack => (
                  <button
                    key={pack.id}
                    onClick={() => setSelectedPack(pack)}
                    className={`p-3 rounded-2xl text-left font-mono text-xs transition-all border ${
                      selectedPack.id === pack.id
                        ? 'bg-[#ecb613] text-black border-[#ecb613] font-bold shadow-lg shadow-[#ecb613]/20'
                        : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-bold truncate">{pack.name.split(' ')[0]} {pack.name.split(' ')[1] || ''}</div>
                    <div className={`text-[10px] ${selectedPack.id === pack.id ? 'text-black/80' : 'text-zinc-400'}`}>
                      {pack.base} € Base
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Slider de Kilómetros desde Méntrida */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-300">2. Distancia desde Méntrida Km 0:</span>
                <span className="text-[#ecb613] font-bold">{distanceKm} km</span>
              </div>
              <input
                type="range"
                min="0"
                max="400"
                step="5"
                value={distanceKm}
                onChange={(e) => setDistanceKm(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ecb613]"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>0 km (Méntrida)</span>
                <span>50 km (Gratis)</span>
                <span>200 km (+120€ Hotel)</span>
                <span>400 km</span>
              </div>
            </div>

            {/* Selector de Horario Tardío */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                3. Horario de Finalización:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsLateNight(false)}
                  className={`p-3 rounded-2xl font-mono text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                    !isLateNight
                      ? 'bg-[#ecb613] text-black border-[#ecb613]'
                      : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  <span>Antes 3:00 AM</span>
                </button>
                <button
                  onClick={() => setIsLateNight(true)}
                  className={`p-3 rounded-2xl font-mono text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                    isLateNight
                      ? 'bg-[#ecb613] text-black border-[#ecb613]'
                      : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <span>Madrugada &gt;= 3:00 AM (+120€)</span>
                </button>
              </div>
            </div>

            {/* Checkbox VIMUME Adicional */}
            <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-cyan-400" />
                  Añadir Sesión VIMUME Mayor (+150 €)
                </span>
                <p className="text-[11px] text-zinc-400">
                  Deducción fiscal de hasta el 80% en IRPF vía Certificado Modelo 182 AEAT.
                </p>
              </div>
              <input
                type="checkbox"
                checked={extraVimume}
                onChange={(e) => setExtraVimume(e.target.checked)}
                className="w-5 h-5 accent-cyan-400 rounded cursor-pointer"
              />
            </div>

          </div>

          {/* Resultado & Desglose en Vivo (Span 5) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#08080d] border border-[#ecb613]/40 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Presupuesto Sugerido</span>
                <div className="text-3xl sm:text-4xl font-black font-syne text-white">
                  {totalEventCost.toFixed(2)} €
                </div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold block">
                  Price-Lock Activo
                </span>
                <span className="text-[10px] font-mono text-zinc-400 mt-1 block">Depósito: 100,00 €</span>
              </div>
            </div>

            {/* Desglose 80/10/10 */}
            <div className="space-y-2.5 font-mono text-xs">
              <span className="text-[10px] text-[#ecb613] uppercase tracking-widest font-bold block">
                Split Soberano 80/10/10:
              </span>
              <div className="flex justify-between p-2.5 rounded-xl bg-black/50 border border-white/5">
                <span className="text-zinc-300">👤 80% Artista Ejecutor:</span>
                <span className="text-white font-bold">{artistFee.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-black/50 border border-white/5">
                <span className="text-zinc-300">⚙️ 10% Infraestructura EAR OS:</span>
                <span className="text-white font-bold">{earFee.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-black/50 border border-white/5">
                <span className="text-zinc-300">❤️ 10% VIMUME Impacto Social:</span>
                <span className="text-cyan-400 font-bold">{vimumeFee.toFixed(2)} €</span>
              </div>
              {hotelCost > 0 && (
                <div className="flex justify-between p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-amber-400">
                  <span>🏨 Suplemento Hotel (&gt;200km / &gt;3am):</span>
                  <span className="font-bold">+120,00 €</span>
                </div>
              )}
              {kmCost > 0 && (
                <div className="flex justify-between p-2.5 rounded-xl bg-black/50 border border-white/5">
                  <span className="text-zinc-300">🚗 Portes ({billableKm} km @ 1.50€):</span>
                  <span className="text-white font-bold">+{kmCost.toFixed(2)} €</span>
                </div>
              )}
            </div>

            {/* Acciones del CEO */}
            <div className="space-y-2 pt-2">
              <a
                href={`https://wa.me/34693693048?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Despachar Presupuesto por WhatsApp</span>
              </a>

              <Link
                href="/reservar/solista"
                className="w-full py-3.5 px-4 rounded-2xl bg-[#ecb613] hover:bg-amber-400 text-black font-mono font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#ecb613]/20 transition-all text-center"
              >
                <CreditCard className="w-4 h-4" />
                <span>Abrir Checkout Stripe (100 € Depósito)</span>
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 🎯 SECCIÓN 3: GUÍA PRÁCTICA PARA EL CEO (CÓMO RESOLVER CASOS REALES) */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-syne text-white uppercase flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#ecb613]" />
          <span>Protocolos de Cierre para el CEO (3 Casos Reales)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-6 rounded-3xl bg-[#08080d] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-[#ecb613] font-mono text-xs font-bold">
              <PhoneIncoming className="w-4 h-4" />
              <span>CASO 1: Novia o Pareja Llama</span>
            </div>
            <h4 className="text-sm font-bold text-white font-syne">"¿Tenéis fecha para un evento en Toledo?"</h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              1. Abres <code className="text-white">/reservar/solista</code> y miras el calendario del mes.<br />
              2. Usas este simulador para calcular el kilometraje desde Méntrida.<br />
              3. Le das la tarifa en vivo y le envías el link de Stripe por WhatsApp para bloquear con <strong>100 €</strong>.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#08080d] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold">
              <Landmark className="w-4 h-4" />
              <span>CASO 2: Festejos / Concejalía</span>
            </div>
            <h4 className="text-sm font-bold text-white font-syne">"Queremos contratar sonido e iluminación"</h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              1. Vas a <code className="text-white">/admin/licitaciones</code>.<br />
              2. Ajustas el contrato menor bajo el límite preventivo de <strong>14.250 €</strong> (Art. 118 LCSP).<br />
              3. Generas la propuesta con la certificación técnica de &lt; 75 dB SPL y facturas vía DIR3.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#08080d] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
              <Share2 className="w-4 h-4" />
              <span>CASO 3: Dueño de Finca Exclusiva</span>
            </div>
            <h4 className="text-sm font-bold text-white font-syne">"¿Cómo colaboramos sin pagar cuotas?"</h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              1. Le explicas el <strong className="text-white">Split 80/10/10</strong>: no paga nada fijo.<br />
              2. Le creas su enlace de partner en <code className="text-white">/admin/afiliados</code>.<br />
              3. La finca cobra el <strong>10% neto</strong> de cada boda que se cierre en su espacio.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
