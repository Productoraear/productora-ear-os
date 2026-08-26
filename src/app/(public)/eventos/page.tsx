'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function EventosRouter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const activeTab = searchParams.get('tipo') || 'bodas';

  const handleTabChange = (tab: string) => {
    router.push(`/eventos?tipo=${tab}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl lg:text-6xl font-syne font-bold mb-8">Arquitectura de Eventos</h1>
        
        <div className="flex space-x-4 border-b border-white/10 pb-4 mb-8 overflow-x-auto no-scrollbar">
          {['bodas', 'corporativo', 'patronales'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeTab === tab 
                  ? 'bg-[#ecb613] text-black shadow-[0_0_15px_rgba(236,182,19,0.4)]' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full"
          >
            {activeTab === 'bodas' && (
              <div className="p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md">
                <h2 className="text-2xl font-bold text-[#ecb613] mb-4">The VIP Wedding Gala</h2>
                <p className="text-gray-400">Motor de reservas S-Class activo. Logística a 12 W/pax habilitada.</p>
              </div>
            )}
            
            {activeTab === 'corporativo' && (
              <div className="p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md">
                <h2 className="text-2xl font-bold text-blue-400 mb-4">High-End B2B Corporativo</h2>
                <p className="text-gray-400">Rider técnico corporativo y facturación FACe para administraciones.</p>
              </div>
            )}

            {activeTab === 'patronales' && (
              <div className="p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md">
                <h2 className="text-2xl font-bold text-rose-400 mb-4">Festivales y Patronales</h2>
                <p className="text-gray-400">Despliegue de infraestructura masiva y matrices Line Array.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function EventosPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-[#050505]" />}>
      <EventosRouter />
    </Suspense>
  );
}