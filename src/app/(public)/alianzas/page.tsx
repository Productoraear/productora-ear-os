import type { Metadata } from 'next';
import Link from 'next/link';
import { AllianceNetwork } from '@/modules/SClassScreens/AllianceNetwork';
import { 
  TARIFA_BASE_SOLISTA_EUR, 
  DEPOSITO_STRIPE_EUR, 
  CENTRALITA_EAR_OS,
  WATTS_PER_PAX
} from '@/lib/constants/ear-os-ssot';
import { MessageCircle, ArrowRight, Handshake } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Red de Alianzas Estratégicas S-Class | Productora EAR',
  description: 'Red de colaboradores, fincas monumentales, wedding planners y empresas de catering de alta fidelidad homologadas en EAR OS.',
  keywords: ['alianzas bodas', 'fincas colaboradoras madrid', 'partners productora ear', 'catering homologado', 'wedding planners espana']
};

const ALIANZAS_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Programa de Alianzas Estratégicas & Prescriptores B2B EAR OS',
  description: 'Alianzas comerciales para fincas, wedding planners y prescriptores con liquidación de comisiones Split 80/10/10 y reserva protegida.',
  provider: {
    '@type': 'Organization',
    name: 'Productora EAR',
    telephone: CENTRALITA_EAR_OS,
    url: 'https://productoraear.com'
  },
  offers: {
    '@type': 'Offer',
    price: TARIFA_BASE_SOLISTA_EUR,
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    url: 'https://productoraear.com/reservar/solista'
  }
};

export default function AlianzasPage() {
  const whatsappDigits = CENTRALITA_EAR_OS.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent('Hola Productora EAR, deseo activar una alianza estratégica B2B como prescriptor o finca homologada.')}`;

  return (
    <div className="min-h-screen bg-[#030305] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ALIANZAS_JSON_LD) }}
      />

      <div className="mb-8">
        <span className="text-xs uppercase font-mono tracking-widest text-[#00E5FF] px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20">
          ECOSISTEMA S-CLASS
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-syne uppercase tracking-tight text-white mt-3">
          Red Soberana de Alianzas & Fincas Homologadas
        </h1>
        <p className="text-sm text-zinc-400 font-mono mt-1">
          Infraestructura de colaboración B2B con Split garantizado (80/10/10) y certificación de calidad técnica.
        </p>
      </div>

      <AllianceNetwork />

      {/* 🛡️ Alianzas / Prescriptores — Conversión & Presupuesto SSOT S-Class */}
      <section className="mt-14 rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-10 transition-all duration-300 ease-out hover:border-[#00E5FF]/40 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/20">
              <Handshake size={14} /> Split Soberano 80/10/10 &bull; Sin Intermediarios
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-syne uppercase tracking-tight text-white">
              Prescribe con Garantía Técnica & Comisión Inmutable
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed font-sans">
              Cada prescripción queda blindada con contrato inteligente y depósito de retención ({DEPOSITO_STRIPE_EUR} € deducible).
              Tarifa Solista Premium oficial desde <span className="text-white font-bold">{TARIFA_BASE_SOLISTA_EUR} €</span> y sonorización calibrada a {WATTS_PER_PAX} W/pax.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto shrink-0">
            <Link
              href="/reservar/solista"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#ecb613] via-[#ffcf4d] to-[#ecb613] text-black font-bold text-xs uppercase tracking-wider text-center transition-all duration-300 ease-out hover:brightness-110 shadow-lg shadow-[#ecb613]/20 flex items-center justify-center gap-2"
            >
              <span>Contratar Solista ({TARIFA_BASE_SOLISTA_EUR} €)</span>
              <ArrowRight size={14} />
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-[#092215] border border-emerald-500/40 text-emerald-400 font-bold text-xs uppercase tracking-wider text-center transition-all duration-300 ease-out hover:bg-emerald-500/20 flex items-center justify-center gap-2"
            >
              <MessageCircle size={14} className="text-[#25D366]" />
              <span>WhatsApp Alianzas ({CENTRALITA_EAR_OS})</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
