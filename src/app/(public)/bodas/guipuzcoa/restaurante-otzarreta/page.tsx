import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Flame,
  Music,
  ShieldCheck,
  MapPin,
  Phone,
  ArrowRight,
  CreditCard
} from 'lucide-react';
import { CENTRALITA_EAR_OS, DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';
import { OtzarretaExperienceExplorer } from '@/components/otzarreta/OtzarretaExperienceExplorer';

export const metadata: Metadata = {
  title: 'Bodas en Guipúzcoa · Restaurante Otzarreta (Zarautz) | Parrilla & Acústica de Gala',
  description:
    'El restaurante de referencia para banquetes de boda en Guipúzcoa. Parrilla tradicional vasca al carbón por Eduardo Martínez, salones climatizados y sonido homologado Bose F1 por Edwin Agudelo. Reserva garantizada con 100 €.',
  alternates: {
    canonical: 'https://productoraear.com/otzarreta'
  },
  openGraph: {
    title: 'Bodas en Guipúzcoa · Restaurante Otzarreta (Zarautz)',
    description:
      'Banquetes nupciales en Guipúzcoa: Parrilla vasca al carbón de encina, cóctel en jardines de Santa Clara y fiesta blindada bajo la Ley 37/2003.',
    url: 'https://productoraear.com/bodas/guipuzcoa/restaurante-otzarreta',
    siteName: 'Productora EAR',
    locale: 'es_ES',
    type: 'website'
  }
};

export default function GuipuzcoaOtzarretaDominationPage(): React.JSX.Element {
  const whatsappUrl = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Hola, deseo información para celebrar mi boda en Guipúzcoa en Restaurante Otzarreta (Zarautz).'
  )}`;

  return (
    <main className="min-h-screen bg-[#030305] text-white selection:bg-[#ecb613] selection:text-black pt-28 pb-24 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Breadcrumb S-Class */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 font-mono">
          <Link href="/" className="hover:text-white transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/bodas" className="hover:text-white transition-colors">
            Bodas
          </Link>
          <span>/</span>
          <Link href="/bodas/guipuzcoa" className="hover:text-white transition-colors">
            Guipúzcoa
          </Link>
          <span>/</span>
          <span className="text-[#ecb613]">Restaurante Otzarreta (Zarautz)</span>
        </nav>

        {/* Hero Provincial */}
        <div className="space-y-6 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
            <MapPin className="w-4 h-4" />
            <span>EL REFERENTE GASTRONÓMICO DE BODAS EN GUIPÚZCOA / GIPUZKOA</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Bodas en Guipúzcoa con Parrilla Vasca de Autor
            <span className="block text-[#ecb613] text-2xl sm:text-4xl font-serif italic mt-2">
              Restaurante Otzarreta · Eduardo Martínez (Zarautz)
            </span>
          </h1>

          <p className="text-gray-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            ¿Buscas un espacio singular en Guipúzcoa donde el banquete nupcial se recuerde durante décadas? En
            Restaurante Otzarreta no hay comida precocinada ni cortes de fiesta. Disfruta de la mejor brasa al carbón a
            15 minutos de San Sebastián, con jardines privados y la sonorización de gala de Edwin Agudelo.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="/reservar/solista"
              className="px-8 py-3.5 rounded-xl bg-[#ecb613] text-black font-extrabold text-sm hover:bg-[#ffe066] transition-all flex items-center gap-2 shadow-lg shadow-[#ecb613]/20"
            >
              <CreditCard className="w-4 h-4" />
              Bloquear Fecha con {DEPOSITO_STRIPE_EUR} € (Deducible)
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-[#25D366] text-black font-bold text-sm hover:brightness-110 transition-all flex items-center gap-2 shadow-lg"
            >
              <Phone className="w-4 h-4" />
              Hablar con Eduardo por WhatsApp
            </a>
          </div>
        </div>

        {/* Las 4 Ventajas Decisivas frente a otros espacios de Guipúzcoa */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Carbón de Encina en Vivo</h3>
            <p className="text-xs text-gray-400">
              Rodaballos salvajes y chuletones asados al segundo en parrilla vista. Cero catering recalentado.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Acústica Ley 37/2003</h3>
              <p className="text-xs text-gray-400">
                Limitador telemático y hardware Bose calibrado a 12 W/pax. Fiesta continua sin denuncias ni cortes de policía.
              </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Ubicación Inmejorable</h3>
            <p className="text-xs text-gray-400">
              En Zarautz, a 2 min de la playa y a 15 min de Donostia. Parking privado propio para vehículos y autocares.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Music className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Edwin Agudelo (Voz Lírica)</h3>
            <p className="text-xs text-gray-400">
              Pack conjunto con el tenor solista de conservatorio para ceremonia civil y cóctel de gran gala.
            </p>
          </div>
        </div>

        {/* Menús y Calculadora */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Menús Nupciales & Calculadora para Parejas de Guipúzcoa
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Consulta el precio exacto por comensal y los platos estrella seleccionados por Eduardo Martínez.
            </p>
          </div>
          <OtzarretaExperienceExplorer />
        </div>

        {/* Botón de Enlace a la Ficha Maestra */}
        <div className="text-center pt-8 border-t border-white/10">
          <Link
            href="/otzarreta"
            className="inline-flex items-center gap-2 text-sm text-[#ecb613] hover:underline font-mono"
          >
            <span>Ver dossier completo de Restaurante Otzarreta</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
