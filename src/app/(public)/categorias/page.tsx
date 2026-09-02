"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { PredatorNav } from '@/widgets/navigation/PredatorNav';
import { NeuralFilters } from '@/features/search/NeuralFilters';
import { ProductNodeCard } from '@/entities/market/ui/ProductNodeCard';
import { useSovereignContext } from '@/shared/context/SovereignContext';

const MOCK_PRODUCTS = [
  { id: '1', title: 'Mariachi Continental', provider: 'Arsenal Producciones', roi: '140%', price: 2500 },
  { id: '2', title: 'Sonido S-Class 50kW', provider: 'Edwin Agudelo Audio', roi: '185%', price: 8500 },
  { id: '3', title: 'Iluminación Cinética', provider: 'VIMUME Lights', roi: '120%', price: 4200 },
  { id: '4', title: 'Protocolo VIMUME B2G', provider: 'Licitaciones GOLD', roi: '210%', price: 15000 },
  { id: '5', title: 'Mariachi Juvenil', provider: 'Arsenal Junior', roi: '95%', price: 1200 },
  { id: '6', title: 'Escenario Arsenal M1', provider: 'Infraestructura S-Class', roi: '160%', price: 12500 },
];

export default function CategoriasPage() {
  const { signal } = useSovereignContext();

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#d4a855] selection:text-black">
      {/* Navigation Layer */}
      <PredatorNav />

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-10 pt-10 pb-32">
        
        {/* Header Section */}
        <div className="mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="h-[1px] w-12 bg-[#d4a855]/40" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#d4a855]">
              {signal.isB2G ? 'CENTRO DE CONTRATACIÓN PÚBLICA' : 'S-CLASS MARKETPLACE'}
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl font-black tracking-tighter mb-6"
          >
            {signal.isB2G ? 'Protocolos de Impacto' : 'Catálogo de Activos'}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl text-lg font-medium leading-relaxed"
          >
            {signal.isB2G 
              ? 'Gestión soberana de infraestructuras culturales y servicios públicos bonificables bajo el estándar VIMUME.'
              : 'Acceda a la élite de la producción audiovisual y artística. Activos validados forensemente para máxima conversión.'}
          </motion.p>
        </div>

        {/* Neural Filtering Layer */}
        <div className="mb-20">
          <React.Suspense fallback={<div className="w-full h-20 animate-pulse bg-white/5 rounded-2xl" />}>
            <NeuralFilters />
          </React.Suspense>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_PRODUCTS.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (idx + 1) }}
            >
              <ProductNodeCard {...product} />
            </motion.div>
          ))}
        </div>

        {/* Footer Meta */}
        <div className="mt-32 pt-12 border-t border-white/5 flex justify-between items-center">
          <div className="flex gap-10">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Status</span>
              <span className="text-[10px] font-bold text-green-500">SISTEMA LIVE</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Capa de Seguridad</span>
              <span className="text-[10px] font-bold text-white/60">AURA ONYX SHIELD</span>
            </div>
          </div>
          <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.5em]">
            EAR OS GOLD — V142.1 — OMEGA CORE
          </span>
        </div>
      </main>
    </div>
  );
}
