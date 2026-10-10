'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Shield, CalendarDays, Archive, ChevronRight, Phone } from 'lucide-react';
import { PredatorNav } from '@/widgets/navigation/PredatorNav';
import Link from 'next/link';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

const WHATSAPP_HREF = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}`;

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
    <div className="min-h-screen w-full overflow-x-hidden bg-[#050505] text-white selection:bg-blue-500/30">
      <PredatorNav />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'Infraestructura S-Class para Eventos Masivos 2026',
            description:
              'Despliegue táctico de sonido, iluminación y logística redundante para fan zones, estadios y celebraciones satélite. Tarifa Solista con operador certificado.',
            brand: {
              '@type': 'Brand',
              name: 'EAR OS',
            },
            offers: {
              '@type': 'Offer',
              url: 'https://ear-os.com/reservar/solista',
              priceCurrency: 'EUR',
              price: TARIFA_BASE_SOLISTA_EUR.toFixed(2),
              availability: 'https://schema.org/InStock',
              priceValidUntil: '2026-07-20',
              eligibleQuantity: {
                '@type': 'QuantitativeValue',
                value: 1,
                unitCode: 'DAY',
              },
            },
          }),
        }}
      />

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
            <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 hover:border-blue-500/40 hover:bg-[#09090d] transition-all duration-500">
              <Shield className="text-blue-500 mb-4" size={20} />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">
                Tarifa Solista
              </p>
              <p className="text-4xl font-black tracking-tighter text-white">
                {TARIFA_BASE_SOLISTA_EUR} €
              </p>
              <p className="text-xs text-white/40 mt-2 font-medium">
                Operador certificado · Jornada completa
              </p>
            </div>

            <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 hover:border-blue-500/40 hover:bg-[#09090d] transition-all duration-500">
              <CalendarDays className="text-blue-500 mb-4" size={20} />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">
                Reserva Bloqueada
              </p>
              <p className="text-4xl font-black tracking-tighter text-white">
                {DEPOSITO_STRIPE_EUR} €
              </p>
              <p className="text-xs text-white/40 mt-2 font-medium">
                Depósito Stripe · Descontable del total
              </p>
            </div>

            <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 hover:border-blue-500/40 hover:bg-[#09090d] transition-all duration-500">
              <Phone className="text-blue-500 mb-4" size={20} />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">
                Centralita Directa
              </p>
              <p className="text-2xl font-black tracking-tighter text-white">
                {CENTRALITA_EAR_OS}
              </p>
              <p className="text-xs text-white/40 mt-2 font-medium">
                Coordinación B2G · 24/7
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/reservar/solista"
              className="inline-flex items-center gap-4 px-12 py-6 bg-blue-600 text-white font-black text-xs tracking-widest uppercase rounded-full hover:bg-white hover:text-black transition-all shadow-[0_0_40px_rgba(37,99,235,0.3)]"
            >
              Asegurar Logística S-Class
            </Link>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-6 rounded-full border border-white/15 bg-[#09090d]/80 text-white font-black text-xs tracking-widest uppercase hover:border-blue-500/50 hover:bg-[#09090d] transition-all"
            >
              <Phone size={14} />
              WhatsApp Directo
            </a>
          </div>
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

          <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 max-w-xl mx-auto mb-12 hover:border-yellow-500/40 transition-all duration-500">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">
              Tarifa Solista Vigente
            </p>
            <p className="text-4xl font-black tracking-tighter text-white">
              {TARIFA_BASE_SOLISTA_EUR} €
            </p>
            <p className="text-xs text-white/40 mt-2 font-medium">
              Depósito de bloqueo: {DEPOSITO_STRIPE_EUR} €
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/reservar/solista"
              className="inline-flex items-center gap-2 px-10 py-5 bg-yellow-500 text-black font-black text-xs tracking-widest uppercase rounded-full hover:bg-white transition-all"
            >
              Reservar Solista
            </Link>
            <Link
              href="/infraestructura"
              className="inline-flex items-center gap-2 text-yellow-500 hover:text-white font-black text-xs tracking-widest uppercase transition-all"
            >
              Ver Infraestructura Actual <ChevronRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}