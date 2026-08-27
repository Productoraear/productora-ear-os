'use client';

import React from 'react';
import Link from 'next/link';
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { ArrowRight, Sparkles, Sliders, ShieldCheck } from 'lucide-react';

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
  title = "Ecosistema 3D",
  subtitle = "Cinemático & En Vivo",
  description = "Visualización interactiva en tiempo real del arsenal audiovisual LED P2.9 Novastar, catering de brasas ancestrales y lírica de autor con Edwin Agudelo.",
  primaryCtaText = "Cotizador Bespoke",
  primaryCtaLink = "/cotizador",
  secondaryCtaText = "Ver Arsenal LED",
  secondaryCtaLink = "/arsenal",
  sceneUrl = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
}: SplineHeroSClassProps) {
  return (
    <section className="w-full max-w-[1280px] mx-auto py-8 sm:py-12 px-4 relative z-20">
      <Card className="w-full min-h-[580px] bg-black/[0.96] border-white/10 relative overflow-hidden group rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          size={450}
        />
        
        <div className="flex flex-col lg:flex-row h-full min-h-[580px]">
          {/* Columna Izquierda: Editorial EAR OS V2 */}
          <div className="flex-1 p-8 sm:p-12 lg:p-14 relative z-10 flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-[10px] font-mono uppercase tracking-widest w-fit">
              <Sparkles size={12} className="text-[#ecb613]" />
              <span>Productora EAR · Visual & Hardware S-Class</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-[-0.05em] leading-[0.95] text-white font-syne">
              {title} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white font-normal">
                {subtitle}
              </span>
            </h1>

            <p className="text-neutral-400 text-sm sm:text-base max-w-lg leading-relaxed font-light">
              {description}
            </p>

            {/* Micro métricas */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10 max-w-md">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 block">Presión Acústica</span>
                <span className="text-sm font-mono font-bold text-white">12 W/pax Homologado</span>
              </div>
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 block">Resolución Visual</span>
                <span className="text-sm font-mono font-bold text-[#ecb613]">LED P2.9 Novastar 4K</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href={primaryCtaLink}
                className="px-6 py-3.5 rounded-none bg-[#ecb613] text-black text-xs font-mono uppercase tracking-widest font-bold hover:bg-white transition-colors flex items-center gap-2 shadow-xl"
              >
                <span>{primaryCtaText}</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href={secondaryCtaLink}
                className="px-6 py-3.5 rounded-none border border-white/20 text-white text-xs font-mono uppercase tracking-widest font-medium hover:bg-white/10 transition-colors"
              >
                <span>{secondaryCtaText}</span>
              </Link>
            </div>
          </div>

          {/* Columna Derecha: Renderizado 3D Spline */}
          <div className="flex-1 relative h-[350px] lg:h-auto min-h-[350px] overflow-hidden">
            <SplineScene 
              scene={sceneUrl}
              className="w-full h-full"
            />
          </div>
        </div>
      </Card>
    </section>
  );
}

export default SplineHeroSClass;
