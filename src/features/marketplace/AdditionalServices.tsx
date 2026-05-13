'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { EXPERTISE_SERVICES } from '@/data/expertise';
import { cn } from '@/lib/utils';
import Link from 'next/link';

/**
 * 🛠️ ADDITIONAL SERVICES (VAMPIRIZED)
 * Módulo de servicios periféricos adaptado al estándar Aura Onyx.
 */
const AdditionalServices: React.FC = () => {
  return (
    <section className="py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="mb-16 md:flex justify-between items-end border-b border-white/10 pb-8">
          <div className="max-w-2xl">
            <span className="text-[#ecb613] font-bold tracking-[0.2em] uppercase text-xs mb-3 block">
              El Arsenal Completo
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight font-syne">
              SERVICIOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] to-[#8a6b0d]">ADICIONALES</span>
            </h2>
          </div>
          <p className="text-white/40 text-sm mt-6 md:mt-0 max-w-sm text-right font-light">
            Soluciones periféricas para centralizar toda tu producción en un solo ecosistema de confianza.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EXPERTISE_SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link 
                key={index} 
                href="/admin/configurador"
                className="group relative p-8 rounded-3xl border border-white/5 bg-white/5 hover:bg-[#ecb613]/5 transition-all duration-700 hover:border-[#ecb613]/30 backdrop-blur-sm block"
              >
                <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <ArrowUpRight className="text-[#ecb613]" size={24} />
                </div>

                <div className="flex items-start gap-6">
                  <div className={cn(
                    "p-4 rounded-2xl bg-black/50 border border-white/10 group-hover:border-[#ecb613]/50 transition-colors",
                    "shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                  )}>
                    <Icon className="text-[#ecb613]" size={32} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[#ecb613] transition-colors font-syne">
                      {service.title}
                    </h3>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4">
                      {service.subtitle}
                    </p>
                    
                    <p className="text-white/60 text-sm leading-relaxed mb-6 font-light">
                      {service.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      {service.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-white/40">
                          <span className="w-1 h-1 rounded-full bg-[#ecb613]"></span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center">
            <p className="text-white/80 mb-8 text-xl font-light">
              ¿Tienes un proyecto que requiere una combinación de estos servicios?
            </p>
            <Link 
              href="/admin/configurador"
              className="px-12 py-4 bg-gradient-to-r from-[#ecb613] to-[#b38805] text-black font-black tracking-widest uppercase transition-all duration-500 rounded-full shadow-[0_10px_30px_rgba(236,182,19,0.3)] hover:scale-105 active:scale-95 text-center flex items-center justify-center"
            >
              Personalizar mi Producción
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AdditionalServices;
