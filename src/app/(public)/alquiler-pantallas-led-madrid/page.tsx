import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Tv, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  MapPin, 
  Phone, 
  Layers, 
  Cpu, 
  Zap, 
  Award,
  CreditCard
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Alquiler de Pantallas LED en Madrid y Toledo | Productora EAR',
  description: 'Alquiler de pantallas LED gigantes de alta definición (P2.9, P3.9) para bodas, conciertos y eventos corporativos en Madrid. Montaje técnico profesional, seguro de RC y soporte en vivo.',
  alternates: {
    canonical: 'https://productoraear.com/alquiler-pantallas-led-madrid'
  },
  openGraph: {
    title: 'Alquiler de Pantallas LED en Madrid | Productora EAR',
    description: 'Pantallas LED gigantes para eventos, bodas y galas con sonido profesional Bose.',
    url: 'https://productoraear.com/alquiler-pantallas-led-madrid',
    type: 'website'
  }
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Alquiler de Pantallas LED para Eventos en Madrid',
  provider: {
    '@type': 'LocalBusiness',
    name: 'Productora EAR — Producciones y Sonorización',
    telephone: '+34693693048',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Méntrida',
      addressRegion: 'Toledo / Madrid',
      addressCountry: 'ES'
    }
  },
  areaServed: ['Madrid', 'Toledo', 'Castilla-La Mancha', 'Comunidad de Madrid'],
  description: 'Servicio integral de alquiler y montaje de pantallas LED modulares P2.9 y P3.9 para galas, bodas y eventos institucionales.'
};

export default function AlquilerPantallasLedMadridPage() {
  const specs = [
    { title: 'Pitch P2.9 / P3.9 Indoor & Outdoor', desc: 'Calidad 4K con brillo ultrabrillante de hasta 5.000 nits para luz solar directa.' },
    { title: 'Estructura Modular Rápida', desc: 'Configuración personalizada desde 2x1m hasta formatos gigantes de 6x3m.' },
    { title: 'Técnico de Vídeo & Sonido Incluido', desc: 'Operador cualificado durante todo el evento para sincronización de contenido.' },
    { title: 'Cobertura & Logística Inmediata', desc: 'Despacho directo desde el Hub Central en Méntrida a cualquier punto de Madrid.' }
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f1e8] pt-28 pb-32 px-4 md:px-8 font-sans selection:bg-[#ecb613] selection:text-black">
      {/* Inyección Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Hero Section S-Class */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0d0d14] via-[#161624] to-[#0d0d14] border border-[#ecb613]/30 p-8 md:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#258DCD]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="px-3.5 py-1 bg-[#258DCD]/15 text-[#258DCD] border border-[#258DCD]/40 rounded-full text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Cobertura Integral Madrid & Toledo
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-serif leading-tight">
              Alquiler de Pantallas LED Gigantes para Bodas y Eventos en Madrid
            </h1>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Transforma la experiencia visual de tu gala o boda con pantallas modulares de alta definición P2.9 y P3.9. Montaje certificado, procesadores Novastar y operadores de vídeo en vivo.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/checkout/presupuesto"
                className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#ecb613] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-black font-bold text-sm tracking-wide transition-all shadow-[0_10px_30px_rgba(236,182,19,0.3)] flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" /> Configurar Presupuesto en Vivo
              </Link>
              <a
                href="https://wa.me/34693693048?text=Hola%20Edwin,%20deseo%20informaci%C3%B3n%20sobre%20el%20alquiler%20de%20pantallas%20LED%20en%20Madrid"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-6 rounded-xl bg-[#121218] hover:bg-[#1a1a24] border border-white/15 text-white font-medium text-sm flex items-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400" /> WhatsApp Directo (+34 693 693 048)
              </a>
            </div>
          </div>
        </div>

        {/* Especificaciones Técnicas */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest">Rider Audiovisual Homologado</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white font-serif">
              Tecnología de Pantalla & Procesamiento Profesional
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {specs.map((spec, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#09090d] border border-white/10 space-y-2 hover:border-[#ecb613]/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">{spec.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{spec.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Banner de Integración con el Repertorio de Edwin Agudelo */}
        <div className="p-8 rounded-3xl bg-[#09090d] border border-[#ecb613]/30 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-white font-serif">¿Deseas combinar Pantallas LED con Música en Vivo?</h3>
            <p className="text-xs text-gray-400">
              Añade a Edwin Agudelo Solista (350 €) o Gran Ensamble Imperial para una puesta en escena completa con sonorización Bose F1.
            </p>
          </div>
          <Link
            href="/checkout/presupuesto"
            className="py-3 px-6 rounded-xl bg-[#ecb613] hover:bg-amber-400 text-black font-bold text-xs tracking-wider uppercase transition-all shrink-0"
          >
            Ir al Cotizador S-Class
          </Link>
        </div>
      </div>
    </main>
  );
}
