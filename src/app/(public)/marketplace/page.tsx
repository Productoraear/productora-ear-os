'use client';

import React from 'react';
import SovereignNavbar from '@/app/components/layout/SovereignNavbar';
import { motion } from 'framer-motion';
import { ShoppingCart, Zap, Star, ShieldCheck } from 'lucide-react';
import AdditionalServices from '@/features/marketplace/AdditionalServices';

/**
 * 🏛️ MARKETPLACE S-CLASS - EL ARSENAL DE PRODUCCIÓN
 * Hub central de servicios vampirizados del legado EAR.
 */
export default function MarketplacePage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#ecb613] selection:text-black">
      <SovereignNavbar />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-[#ecb613]/10 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#ecb613]/30 bg-[#ecb613]/5 text-[#ecb613] text-xs font-bold tracking-widest uppercase mb-6">
              Servicios de Élite
            </span>
            <h1 className="text-5xl md:text-7xl font-bold font-syne tracking-tighter mb-8">
              EL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] to-[#8a6b0d]">MARKETPLACE</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
              Accede al arsenal completo de Productora EAR. Desde logística técnica hasta mentoría estratégica, todo en un solo ecosistema soberano.
            </p>
          </motion.div>

          {/* QUICK FEATURES */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-16">
            {[
              { icon: Zap, label: "Entrega Ágil" },
              { icon: ShieldCheck, label: "Seguridad S-Class" },
              { icon: Star, label: "Calidad Premium" },
              { icon: ShoppingCart, label: "Checkout Unificado" }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/5 flex flex-col items-center gap-3 hover:bg-[#ecb613]/5 transition-colors">
                <item.icon className="text-[#ecb613]" size={24} />
                <span className="text-sm font-bold tracking-tight text-white/80">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE MARKETPLACE COMPONENTS (VAMPIRIZED) */}
      <div className="space-y-24 pb-32">
        <AdditionalServices />
        
        {/* Placeholder para futuras secciones del marketplace */}
        <section className="py-20 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 text-center">
             <p className="text-white/30 italic">Más módulos de producción en proceso de vampirización estructural...</p>
          </div>
        </section>
      </div>
    </main>
  );
}
