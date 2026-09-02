'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Tv, Volume2, ShieldCheck, Zap, Calculator, 
  CheckCircle2, ArrowRight, PhoneCall, Sparkles, Layers, Sliders
} from 'lucide-react';
import { AudiovisualFaqAccordion } from '@/components/seo/AudiovisualFaqAccordion';

export default function AlquilerAudiovisualesPage() {
  const [screenM2, setScreenM2] = useState<number>(6);
  const [attendees, setAttendees] = useState<number>(150);
  const [isOutdoor, setIsOutdoor] = useState<boolean>(false);

  // Lógica matemática de estimación audiovisual
  const ledCostPerM2 = isOutdoor ? 140 : 110;
  const ledPrice = screenM2 * ledCostPerM2;
  const soundPowerW = attendees * (isOutdoor ? 20 : 12);
  const soundPrice = Math.max(350, Math.floor(attendees * 2.8));
  const totalPrice = ledPrice + soundPrice;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* HEADER AUDIOVISUAL S-CLASS */}
        <div className="border-b border-white/10 pb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-[#ecb613]/10 border border-[#ecb613]/40 text-[#ecb613] text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Tv size={14} /> Arsenal Técnico B2B // Cobertura Nacional
            </span>
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono px-3 py-1 rounded-full uppercase">
              Pantallas LED P2.9 HDR
            </span>
            <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono px-3 py-1 rounded-full uppercase">
              Sonorización Bose F1 / L-Acoustics
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-fraunces font-black text-white leading-tight max-w-5xl">
            Alquiler de Equipos de Sonido, Pantallas LED Gigantes &amp; Iluminación DMX
          </h1>
          <p className="mt-4 text-white/60 font-montserrat text-base md:text-lg max-w-3xl leading-relaxed">
            Infraestructura escénica de alta definición para bodas de gala, convenciones corporativas, ferias y festejos públicos. Montaje certificado, técnicos titulados y microfonía de grado emisión.
          </p>
        </div>

        {/* SIMULADOR INTERACTIVO DE PANTALLAS LED & SONIDO */}
        <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest block mb-2">
                Simulador Audiovisual Instantáneo
              </span>
              <h2 className="text-2xl font-fraunces font-bold text-white uppercase">
                Calculadora de Pantallas LED &amp; Potencia Acústica
              </h2>
            </div>

            <div className="space-y-5">
              {/* Selector m2 Pantalla LED */}
              <div>
                <div className="flex justify-between text-xs text-white/60 mb-2 font-mono">
                  <span>Superficie de Pantalla LED (m²)</span>
                  <span className="text-[#ecb613] font-bold">{screenM2} m² ({screenM2 === 6 ? '3x2m' : screenM2 === 12 ? '4x3m' : `${screenM2}m²`})</span>
                </div>
                <input 
                  type="range" 
                  min="4" 
                  max="24" 
                  step="2" 
                  value={screenM2}
                  onChange={(e) => setScreenM2(Number(e.target.value))}
                  className="w-full accent-[#ecb613]"
                />
              </div>

              {/* Selector Aforo / Asistentes */}
              <div>
                <div className="flex justify-between text-xs text-white/60 mb-2 font-mono">
                  <span>Asistentes / Aforo</span>
                  <span className="text-[#ecb613] font-bold">{attendees} Pax ({soundPowerW}W RMS)</span>
                </div>
                <input 
                  type="range" 
                  min="30" 
                  max="1000" 
                  step="10" 
                  value={attendees}
                  onChange={(e) => setAttendees(Number(e.target.value))}
                  className="w-full accent-[#ecb613]"
                />
              </div>

              {/* Selector Interior / Exterior */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={() => setIsOutdoor(false)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                    !isOutdoor ? 'bg-[#ecb613]/10 border-[#ecb613] text-[#ecb613]' : 'bg-black/40 border-white/10 text-white/40'
                  }`}
                >
                  Recinto Interior (Indoor)
                </button>
                <button
                  onClick={() => setIsOutdoor(true)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                    isOutdoor ? 'bg-[#ecb613]/10 border-[#ecb613] text-[#ecb613]' : 'bg-black/40 border-white/10 text-white/40'
                  }`}
                >
                  Exterior (Outdoor &gt;4500 Nits)
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-black/60 border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs text-white/40 uppercase font-mono">Presupuesto Estimado Audiovisual</span>
              <div className="text-4xl font-black text-white font-fraunces">
                {totalPrice.toLocaleString('es-ES')} € <span className="text-xs text-white/40 font-normal">+ IVA</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed pt-2">
                Incluye pantalla LED P2.9 de {screenM2}m², sistema de sonido de {soundPowerW}W RMS, estructura Truss, cableado y técnico operador.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href="https://wa.me/34693693048?text=Hola,%20busco%20presupuesto%20para%20alquiler%20de%20pantalla%20LED%20y%20sonido"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-[#ecb613] hover:bg-yellow-400 text-black font-black uppercase text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <PhoneCall size={16} /> Bloquear Equipamiento
              </a>
              <Link 
                href="/checkout/presupuesto"
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-mono text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Abrir Cotizador Avanzado 360°
              </Link>
            </div>
          </div>
        </div>

        {/* MÓDULOS TÉCNICOS DESTACADOS (GSC KEYWORDS) */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-fraunces font-black text-white uppercase">
              Catálogo de Soluciones Audiovisuales
            </h2>
            <p className="text-white/50 text-xs">
              Equipamiento homologado de alta gama para todo tipo de producciones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#ecb613]">
                  <Tv size={24} />
                </div>
                <h3 className="text-xl font-bold font-fraunces text-white">Pantallas LED Gigantes P2.9</h3>
                <p className="text-white/60 text-xs leading-relaxed">
                  Módulos LED de alta tasa de refresco (3840Hz), contraste profundo y brillo para luz solar directa. Ideales para vídeos nupciales, presentaciones B2B y conciertos.
                </p>
                <ul className="space-y-2 text-xs text-white/50">
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#ecb613]" /> Resolución 4K HDR P2.9</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#ecb613]" /> Estructuras Truss en Aluminio</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#ecb613]" /> Escalador &amp; Procesador de Vídeo</li>
                </ul>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Volume2 size={24} />
                </div>
                <h3 className="text-xl font-bold font-fraunces text-white">Sonorización de Gala &amp; Conciertos</h3>
                <p className="text-white/60 text-xs leading-relaxed">
                  Sistemas Bose F1 Model 812, Bose S1 Pro y cajas de alineación de fase L-Acoustics K2 con mesas digitales Behringer XR18 y microfonía inalámbrica Shure Axient.
                </p>
                <ul className="space-y-2 text-xs text-white/50">
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-400" /> Cobertura Homogénea 12 W/pax</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-400" /> Microfonía Inalámbrica Shure/Neumann</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-400" /> Mesas de Mezcla Digitales DANTE</li>
                </ul>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-xl font-bold font-fraunces text-white">Iluminación Robótica &amp; DMX</h3>
                <p className="text-white/60 text-xs leading-relaxed">
                  Cabezas móviles Beam/Spot/Wash, focos de bañado arquitectónico LED a batería para jardines de fincas y puentes de luces para pista de baile.
                </p>
                <ul className="space-y-2 text-xs text-white/50">
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Control DMX con Escenas de Gala</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Iluminación Inalámbrica para Fincas</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Efectos de Humo denso &amp; Fuego Frío</li>
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* INYECCIÓN DEL ACORDEÓN DE FAQ JSON-LD */}
        <AudiovisualFaqAccordion />

        {/* GARANTÍAS TÉCNICAS */}
        <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-8">
          <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-6">
            Soberanía Técnica &amp; Garantía Operativa EAR OS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link 
              href="/soberania-tecnica" 
              className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-2 hover:border-emerald-500/50 hover:bg-white/5 transition-all group"
            >
              <ShieldCheck className="text-emerald-400 group-hover:scale-110 transition-transform" size={28} />
              <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">Póliza RC 1M€</h4>
              <p className="text-xs text-white/50">Cobertura civil completa en recintos e instalaciones.</p>
            </Link>

            <Link 
              href="/soberania-tecnica" 
              className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-2 hover:border-emerald-500/50 hover:bg-white/5 transition-all group"
            >
              <Zap className="text-emerald-400 group-hover:scale-110 transition-transform" size={28} />
              <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">Técnicos Titulados</h4>
              <p className="text-xs text-white/50">Personal cualificado con prevención de riesgos laborables.</p>
            </Link>

            <Link 
              href="/soberania-tecnica" 
              className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-2 hover:border-emerald-500/50 hover:bg-white/5 transition-all group"
            >
              <Layers className="text-emerald-400 group-hover:scale-110 transition-transform" size={28} />
              <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">Plan B por Clima</h4>
              <p className="text-xs text-white/50">Estructuras estancas e impermeables para exterior.</p>
            </Link>

            <Link 
              href="/soberania-tecnica" 
              className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-2 hover:border-emerald-500/50 hover:bg-white/5 transition-all group"
            >
              <CheckCircle2 className="text-emerald-400 group-hover:scale-110 transition-transform" size={28} />
              <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">Facturación FACe/DIR3</h4>
              <p className="text-xs text-white/50">Apto para contratos privados y licitaciones públicas.</p>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
