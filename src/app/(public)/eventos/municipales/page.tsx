import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  LIMITE_B2G_LCSP_EUR, 
  SAFE_LCSP_CEILING_EUR, 
  WATTS_PER_PAX, 
  TARIFA_BASE_SOLISTA_EUR, 
  CENTRALITA_EAR_OS 
} from '@/lib/constants/ear-os-ssot';
import { Shield, Volume2, PhoneCall, FileText, ArrowRight, Sparkles, Building2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Fiestas Patronales y Festivales Municipales B2G | Productora EAR',
  description: 'Gestión integral, licitaciones menores y contratación artística para ayuntamientos bajo Art. 118 LCSP con techo preventivo.',
  keywords: ['contratos menores ayuntamientos', 'fiestas patronales lcsp', 'licitaciones sonido ferias', 'productora ear b2g']
};

const B2G_MUNICIPAL_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'GovernmentService',
  name: 'Contratación Técnica & Producción para Festejos Municipales',
  serviceType: 'Producción Audiovisual y Conciertos B2G',
  provider: {
    '@type': 'Organization',
    name: 'Productora EAR',
    telephone: CENTRALITA_EAR_OS,
    url: 'https://productoraear.com'
  },
  offers: {
    '@type': 'Offer',
    price: SAFE_LCSP_CEILING_EUR,
    priceCurrency: 'EUR',
    description: `Licitación menor preventivamente ajustada a ${SAFE_LCSP_CEILING_EUR.toLocaleString('es-ES')} € según Art. 118 LCSP.`,
    availability: 'https://schema.org/InStock',
    url: 'https://productoraear.com/b2g'
  }
};

export default function EventosMunicipalesPage() {
  const whatsappDigits = CENTRALITA_EAR_OS.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent('Hola Productora EAR, deseo cotizar producción y festejos municipales (B2G - Art. 118 LCSP).')}`;

  return (
    <main className="bg-[#030305] text-white min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto font-sans selection:bg-[#ecb613] selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(B2G_MUNICIPAL_SCHEMA) }}
      />

      {/* Header Badge */}
      <div className="mb-6 text-center sm:text-left">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-widest text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/20">
          <Building2 size={13} /> GESTIÓN INSTITUCIONAL &bull; B2G COMPLIANCE
        </span>
        <h1 className="text-3xl sm:text-5xl font-black font-syne uppercase tracking-tight text-white mt-4 leading-tight">
          Fiestas Patronales, Semanas Culturales y Festivales de Ayuntamientos
        </h1>
        <p className="text-zinc-400 text-base sm:text-lg font-light mt-3 max-w-3xl leading-relaxed">
          Producción técnica homologada, acústica de alta fidelidad y contratación artística con estricta conformidad a la normativa de contratación pública.
        </p>
      </div>
      
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-8 space-y-3 transition-all duration-300 ease-out hover:border-[#00E5FF]/40">
          <div className="w-10 h-10 rounded-2xl bg-[#00E5FF]/10 text-[#00E5FF] flex items-center justify-center">
            <Shield size={20} />
          </div>
          <h2 className="text-xl font-bold font-syne text-white uppercase tracking-tight">Pliegos y Normativa B2G (LCSP)</h2>
          <p className="text-sm text-zinc-400 leading-relaxed font-sans">
            Presupuestos ajustados al marco <span className="text-[#00E5FF] font-mono font-bold">Art. 118 LCSP</span> para contratos menores con límite legal de <span className="text-white font-mono">{LIMITE_B2G_LCSP_EUR.toLocaleString('es-ES')} €</span> y ajuste preventivo al 95% (<span className="text-[#ecb613] font-mono font-bold">{SAFE_LCSP_CEILING_EUR.toLocaleString('es-ES')} €</span>). Facturación electrónica FACe, certificados de estar al corriente de pagos y cero reparos de intervención.
          </p>
        </div>

        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-8 space-y-3 transition-all duration-300 ease-out hover:border-[#ecb613]/40">
          <div className="w-10 h-10 rounded-2xl bg-[#ecb613]/10 text-[#ecb613] flex items-center justify-center">
            <Volume2 size={20} />
          </div>
          <h2 className="text-xl font-bold font-syne text-white uppercase tracking-tight">Rider Acústico y Confort Ciudadano</h2>
          <p className="text-sm text-zinc-400 leading-relaxed font-sans">
            Calibración acústica de precisión a <span className="text-[#ecb613] font-mono font-bold">{WATTS_PER_PAX} W/pax</span> conforme a la Ley 37/2003 del Ruido. Sistemas Bose F1 Model 812 y S1 Pro con dispersión controlada para recintos feriales y plazas mayores, protegiendo el descanso vecinal.
          </p>
        </div>
      </div>

      {/* Conversion Banner */}
      <div className="rounded-3xl bg-[#09090d]/90 border border-white/10 p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 text-center lg:text-left">
          <span className="text-xs font-mono uppercase tracking-widest text-[#ecb613]">Contratación Artística Directa</span>
          <h3 className="text-2xl font-black font-syne uppercase text-white">Show Solista Premium &bull; Desde {TARIFA_BASE_SOLISTA_EUR} €</h3>
          <p className="text-xs text-zinc-400 max-w-xl">
            Disponible para semanas culturales, homenajes a mayores y recepciones oficiales con dossier técnico completo.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center justify-center shrink-0">
          <Link
            href="/b2g"
            className="px-5 py-3 rounded-2xl bg-[#00E5FF] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#66efff] transition-all duration-300 ease-out flex items-center gap-1.5"
          >
            <FileText size={14} />
            <span>Portal Licitaciones B2G</span>
          </Link>

          <Link
            href="/reservar/solista"
            className="px-5 py-3 rounded-2xl bg-[#ecb613] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#ffe066] transition-all duration-300 ease-out flex items-center gap-1.5"
          >
            <Sparkles size={14} />
            <span>Reservar Artista ({TARIFA_BASE_SOLISTA_EUR} €)</span>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/40 text-emerald-400 font-bold text-xs uppercase tracking-wider transition-all duration-300 ease-out flex items-center gap-1.5"
          >
            <PhoneCall size={14} />
            <span>{CENTRALITA_EAR_OS}</span>
          </a>
        </div>
      </div>
    </main>
  );
}