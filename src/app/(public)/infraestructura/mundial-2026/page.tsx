'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Shield, CalendarDays, Archive, ChevronRight } from 'lucide-react';
import { PredatorNav } from '@/widgets/navigation/PredatorNav';
import Link from 'next/link';

export default function Mundial2026Page() {
  const [isHistorical, setIsHistorical] = useState(false);

  useEffect(() => {
    // Táctica del "Time-Bomb" - Expiration Engine
    // 20 de Julio de 2026 (Fin del Mundial)
    const expirationDate = new Date('2026-07-20T00:00:00Z').getTime();
    if (Date.now() > expirationDate) {
      setIsHistorical(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      <PredatorNav />

      {isHistorical ? <HistoricalArchiveView /> : <SalesView />}
      
    </div>
  );
}

function SalesView() {
  return (
    <section className="relative pt-48 pb-32 px-8 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-900/20 to-transparent blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 mb-8">
            <Clock className="text-blue-500" size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">
              Ventana de Licitación Abierta
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase mb-8">
            Infraestructura para <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-white">
              Eventos Masivos 2026
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl font-light text-white/50 max-w-3xl mx-auto italic mb-12">
            Despliegue táctico de sonido, iluminación y logística redundante para fan zones, estadios y celebraciones satélite.
          </p>

          <Link href="/cotizador" className="inline-flex items-center gap-4 px-12 py-6 bg-blue-600 text-white font-black text-xs tracking-widest uppercase rounded-full hover:bg-white hover:text-black transition-all shadow-[0_0_40px_rgba(37,99,235,0.3)]">
            Asegurar Logística S-Class
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function HistoricalArchiveView() {
  return (
    <section className="relative pt-48 pb-32 px-8 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-yellow-900/10 to-transparent blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 mb-8">
            <Archive className="text-yellow-500" size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500">
              Archivo Histórico Institucional
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase mb-8 text-white/80">
            Caso de Éxito: <br />
            <span className="text-white">Cobertura 2026</span>
          </h1>
          
          <p className="text-xl text-white/40 max-w-3xl mx-auto font-medium mb-12">
            Este nodo conserva el registro del despliegue logístico realizado durante la temporada 2026. La capacidad técnica empleada (Subwoofers FBT 118 SA, redes redundantes) sigue disponible para nuevas licitaciones B2G.
          </p>

          <Link href="/infraestructura" className="inline-flex items-center gap-2 text-yellow-500 hover:text-white font-black text-xs tracking-widest uppercase transition-all">
            Ver Infraestructura Actual <ChevronRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
