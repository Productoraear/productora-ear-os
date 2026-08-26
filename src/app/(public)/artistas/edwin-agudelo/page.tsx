import React from 'react';
import { EdwinPricingEngine } from '@/components/booking/EdwinPricingEngine';
import { Mic2, Star } from 'lucide-react';

export default function EdwinAgudeloPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Columna Izquierda: Identidad y Valor (Limpieza de Copy Técnico) */}
        <div className="space-y-8">
          <div>
            <span className="text-[#ecb613] text-sm font-mono tracking-widest uppercase border border-[#ecb613]/30 px-3 py-1 rounded-full">
              Tenor Lírico & Mariachi de Gala
            </span>
            <h1 className="text-5xl md:text-7xl font-fraunces font-black mt-6 mb-4 leading-tight">
              Edwin Agudelo
            </h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-lg font-montserrat">
              La vanguardia en música para eventos en España. Repertorio lírico de autor, elegancia escénica y calibración acústica de alta gama para ceremonias y veladas exclusivas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-start gap-4 hover:bg-white/10 transition-colors">
              <Star className="text-[#ecb613] shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">Reseñas Verificadas</h4>
                <p className="text-xs text-white/50">5.0/5 en bodas y eventos premium a nivel nacional.</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-start gap-4 hover:bg-white/10 transition-colors">
              <Mic2 className="text-[#ecb613] shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">Acústica Premium</h4>
                <p className="text-xs text-white/50">Sistemas Bose F1 & Microfonía Shure Axient Digital.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Motor de Cotización Integrado */}
        <div className="flex justify-center lg:justify-end">
          <EdwinPricingEngine />
        </div>

      </div>
    </div>
  );
}
