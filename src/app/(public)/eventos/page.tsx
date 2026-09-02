import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Calendar, Sparkles, Heart, Building2, ShieldCheck, 
  Music, ArrowRight, CheckCircle2, Phone, Star, Flame
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';

export const metadata: Metadata = {
  title: 'Producción de Eventos Propios y de Terceros | Productora EAR',
  description: 'Conciertos, festivales de autor, bodas de alta distinción, serenatas y galas corporativas. Producción integral acústica y técnica.',
  alternates: {
    canonical: 'https://www.productoraear.com/eventos',
  },
  openGraph: {
    title: 'Producción de Eventos Propios y de Terceros · Productora EAR',
    description: 'Gestión integral de espectáculos, música en directo y producción técnica.',
    url: 'https://www.productoraear.com/eventos',
    siteName: 'Productora EAR',
    locale: 'es_ES',
    type: 'website'
  }
};

const EVENT_SECTIONS = [
  {
    title: 'Eventos Propios (Producción EAR)',
    badge: 'AUTOR & MONUMENTAL',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    description: 'Festivales de autor, conciertos líricos de gala, espectáculos cantando a caballo y la gala anual "Nuestros Héroes". Diseño escenográfico completo y dirección artística.',
    items: [
      'Gira Acompáñame de Edwin Agudelo',
      'Festivales Internacionales de Mariachi',
      'Gala Anual Benéfica VIMUME',
      'Ciclos de Música Clásica y Lírica'
    ],
    ctaText: 'Ver Agenda de Producciones',
    ctaHref: '/artistas/edwin-agudelo'
  },
  {
    title: 'Eventos de Terceros (Particulares / B2C)',
    badge: 'B2C ÉLITE',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    description: 'Parejas y enlaces nupciales exclusivos, serenatas sorpresa a domicilio, aniversarios íntimos y fiestas privadas con Price-Lock blindado de 72 horas.',
    items: [
      'Bodas y enlaces en fincas exclusivas',
      'Serenatas sorpresa y pedidas de mano',
      'Aniversarios y bodas de plata / oro',
      'Celebraciones y fiestas de autor'
    ],
    ctaText: 'Ir a Portal de Bodas',
    ctaHref: '/bodas'
  },
  {
    title: 'Eventos Corporativos (B2B Empresas)',
    badge: 'B2B ENTERPRISE',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    description: 'Galas de empresa, cenas de gala, stands interactivos en ferias IFEMA, congresos y presentaciones de producto con sonorización Bose y pantallas LED.',
    items: [
      'Galas y cenas anuales de empresa',
      'Congresos, convenciones y ferias IFEMA',
      'Lanzamientos de producto y marca',
      'Audiovisuales y pantallas LED P2/P3'
    ],
    ctaText: 'Acceso Corporativo',
    ctaHref: '/ocasiones/corporativo'
  },
  {
    title: 'Eventos Institucionales (B2G Ayuntamientos)',
    badge: 'B2G SECTOR PÚBLICO',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    description: 'Fiestas patronales, alumbrado navideño, cumbres diplomáticas, FITUR y conciertos de gran formato adaptados al Art. 118 LCSP.',
    items: [
      'Fiestas patronales y semanas culturales',
      'Alumbrado y conciertos de Navidad',
      'Cenas de estado y recepciones diplomáticas',
      'Corredor comarcal Navalcarnero - Méntrida'
    ],
    ctaText: 'Contratación Ayuntamientos',
    ctaHref: '/contratacion/ayuntamientos'
  }
];

export default function MasterEventosPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-amber-500 selection:text-black pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-widest mb-4">
            <Calendar className="w-3.5 h-3.5" />
            <span>Vertical Eventos · Producción 360°</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase font-serif">
            Producción de <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">Eventos Soberanos</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
            Desde serenatas y bodas de alta distinción hasta festivales monumentales y festejos patronales con solvencia técnica homologada.
          </p>
        </div>

        {/* Las 4 Grandes Categorías de Eventos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EVENT_SECTIONS.map((sec, idx) => (
            <div 
              key={idx}
              className="rounded-3xl p-6 sm:p-8 bg-zinc-900/50 border border-zinc-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border font-bold ${sec.badgeColor}`}>
                    {sec.badge}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white font-serif mb-2 group-hover:text-amber-300 transition-colors">
                  {sec.title}
                </h2>

                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  {sec.description}
                </p>

                <ul className="space-y-2.5 mb-8">
                  {sec.items.map((it, iIdx) => (
                    <li key={iIdx} className="flex items-center gap-2.5 text-xs text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={sec.ctaHref}
                className="w-full py-3 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-200 transition-all shadow-md"
              >
                <span>{sec.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

        {/* Banner de Contacto */}
        <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-zinc-900 to-amber-500/10 border border-amber-500/30 text-center">
          <h3 className="text-xl font-bold text-white font-serif mb-2">
            ¿Necesitas una propuesta a medida para tu evento?
          </h3>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto mb-6">
            Te asesoramos sobre sonorización, iluminación y contratación de artistas con presupuesto cerrado en menos de 24 horas.
          </p>
          <a
            href={CENTRALITA.href}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
          >
            <Phone className="w-4 h-4" />
            <span>Hablar con un Productor Técnico: {CENTRALITA.display}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
