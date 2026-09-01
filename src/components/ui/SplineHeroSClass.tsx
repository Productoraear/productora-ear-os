'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { 
  ArrowRight, 
  Sparkles, 
  Sliders, 
  ShieldCheck, 
  Volume2, 
  Cpu, 
  Radio, 
  Activity, 
  CheckCircle2,
  Tv
} from 'lucide-react';

interface SplineHeroSClassProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  sceneUrl?: string;
}

export function SplineHeroSClass({
  title = "Arsenal Audiovisual",
  subtitle = "3D & Hardware de Élite",
  description = "Pantallas LED P2.9 Novastar HDR de alto brillo, procesado 4K, sonido Line Array d&b / Bose F1 a 12 W/pax y microfonía inalámbrica Shure Axient con técnico in situ.",
  primaryCtaText = "Calcular Presupuesto",
  primaryCtaLink = "/cotizador",
  secondaryCtaText = "Consultar por WhatsApp",
  secondaryCtaLink = "https://wa.me/34693693048?text=Hola%20Productora%20EAR%2C%20deseo%20consultar%20disponibilidad%20del%20Arsenal%20Audiovisual%20LED%20y%20Sonido."
}: SplineHeroSClassProps) {
  return (
    <section className="w-full max-w-[1280px] mx-auto py-6 sm:py-10 px-4 relative z-20">
      <Card className="w-full min-h-[540px] bg-gradient-to-br from-[#06060a] via-[#0b0b14] to-[#06060a] border border-white/10 relative overflow-hidden group rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.9)]">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          size={450}
        />
        
        <div className="flex flex-col lg:flex-row h-full min-h-[540px]">
          {/* Columna Izquierda: Editorial EAR OS V2 */}
          <div className="flex-1 p-6 sm:p-10 lg:p-12 relative z-10 flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-[10px] font-mono uppercase tracking-widest w-fit">
              <Sparkles size={12} className="text-[#ecb613]" />
              <span>Productora EAR · Visual & Hardware S-Class</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-[-0.03em] leading-[1.05] text-white font-syne">
              {title} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white font-bold">
                {subtitle}
              </span>
            </h1>

            <p className="text-neutral-400 text-xs sm:text-sm max-w-lg leading-relaxed font-light">
              {description}
            </p>

            {/* Micro métricas */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10 max-w-md">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 block">Presión Acústica</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-white">12 W/pax Homologado</span>
              </div>
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 block">Resolución Visual</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-[#ecb613]">LED P2.9 Novastar 4K</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href={primaryCtaLink}
                className="px-5 py-3 rounded-xl bg-[#ecb613] text-black text-xs font-mono uppercase tracking-wider font-bold hover:bg-white transition-colors flex items-center gap-2 shadow-xl shadow-amber-500/10"
              >
                <span>{primaryCtaText}</span>
                <ArrowRight size={14} />
              </Link>
              <a
                href={secondaryCtaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl border border-white/20 text-white text-xs font-mono uppercase tracking-wider font-medium hover:bg-white/10 transition-colors"
              >
                <span>{secondaryCtaText}</span>
              </a>
            </div>
          </div>

          {/* Columna Derecha: Consola Cinemática de Hardware y Espectro de Audio (100% Nativo, Cero Fallos Externos) */}
          <div className="flex-1 p-6 sm:p-10 flex flex-col justify-center items-center relative z-10">
            <div className="w-full max-w-md bg-[#050508]/90 border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4 backdrop-blur-xl relative overflow-hidden">
              {/* Glow decorativo */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#ecb613]/5 rounded-full blur-2xl pointer-events-none" />

              {/* Cabecera del Rack de Hardware */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                    Rack Operativo En Vivo
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">SLA 99.9% · T-120 Min</span>
              </div>

              {/* Pantalla Virtual LED P2.9 Novastar con Espectro Dinámico */}
              <div className="p-4 rounded-xl bg-black border border-white/15 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-mono">
                    <Tv size={14} className="text-[#ecb613]" />
                    <span>LED WALL P2.9 Novastar HDR</span>
                  </div>
                  <span className="text-[9px] font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    3840Hz Refresh
                  </span>
                </div>

                {/* Visualizador de Ecualizador de Frecuencias en Tiempo Real */}
                <div className="h-16 flex items-end justify-between gap-1 pt-2 px-1">
                  {[45, 68, 85, 30, 92, 54, 76, 100, 62, 88, 40, 72, 95, 50, 80, 60].map((height, i) => (
                    <div
                      key={i}
                      style={{ height: `${height}%` }}
                      className={`w-full rounded-t-sm transition-all duration-500 ${
                        i % 3 === 0 
                          ? 'bg-[#ecb613]' 
                          : i % 2 === 0 
                            ? 'bg-amber-400/80' 
                            : 'bg-emerald-400/70'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 pt-1">
                  <span>20 Hz</span>
                  <span className="text-zinc-400">12 W/pax Homologado</span>
                  <span>20 kHz</span>
                </div>
              </div>

              {/* Fichas Técnicas del Rack */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-zinc-400 text-[10px]">
                    <Volume2 size={12} className="text-[#ecb613]" />
                    <span>Audio Master</span>
                  </div>
                  <div className="font-bold text-white text-[11px]">Bose F1 Model 812</div>
                  <div className="text-[9px] text-emerald-400">Calibración &lt; 75 dB SPL</div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-zinc-400 text-[10px]">
                    <Radio size={12} className="text-sky-400" />
                    <span>Microfonía RF</span>
                  </div>
                  <div className="font-bold text-white text-[11px]">Shure Axient Beta 87A</div>
                  <div className="text-[9px] text-sky-300">Cero Interferencias RF</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-1 border-t border-white/5">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-emerald-400" /> Póliza RC 1.000.000 €
                </span>
                <span className="text-amber-400">Hub Central Méntrida // Madrid</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}

export default SplineHeroSClass;
