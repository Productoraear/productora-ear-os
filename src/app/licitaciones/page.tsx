import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ArrowRight, ShieldCheck, Scale, Landmark } from 'lucide-react';
import B2GInstitutionalPortal from '@/components/b2g/B2GInstitutionalPortal';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export const metadata: Metadata = {
  title: 'Licitaciones Menores B2G & Contratación LCSP Art. 118 (< 14.250 €) | Productora EAR',
  description:
    'Portal de licitaciones y contratos menores de servicios técnicos y culturales para Ayuntamientos, Diputaciones y Entidades Públicas. Ajuste preventivo a 14.250 € bajo Art. 118 LCSP, facturación FACe con códigos DIR3 y trazabilidad ODS 2030.',
  keywords: [
    'licitaciones menores ayuntamientos',
    'contrato menor lcsp art 118',
    'pliego tecnico sonorizacion municipal',
    'face dir3 facturacion publica',
    'licitacion festejos patronales',
    'contratacion menor espectaculos',
    'productora ear b2g'
  ],
  alternates: {
    canonical: 'https://productoraear.com/licitaciones',
  },
  openGraph: {
    title: 'Licitaciones Menores B2G & Contratación LCSP Art. 118 | Productora EAR',
    description:
      'Infraestructura técnica para contratación menor de administraciones públicas. Blindaje legal a 14.250 €, facturación FACe y memorias técnicas inmediatas.',
    url: 'https://productoraear.com/licitaciones',
    siteName: 'Productora EAR — EAR OS',
    locale: 'es_ES',
    type: 'website',
  },
};

const licitacionesSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'GovernmentService',
      name: 'Portal de Licitaciones Menores y Contratación LCSP Art. 118',
      serviceType: 'Licitación de Producción Técnica Audiovisual, Eventos y Acción Social',
      provider: {
        '@type': 'Organization',
        name: 'Productora EAR Audiovisual S.L.',
        telephone: CENTRALITA_EAR_OS,
        email: 'direccion@productoraear.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Calle La Fuente 12',
          addressLocality: 'Méntrida',
          addressRegion: 'Toledo',
          postalCode: '45930',
          addressCountry: 'ES',
        },
      },
    },
  ],
};

export default function LicitacionesPage(): React.JSX.Element {
  return (
    <main className="w-full max-w-full overflow-x-hidden bg-[#030305] text-white pt-24 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(licitacionesSchema) }}
      />

      {/* BANNER INSTITUCIONAL DE NAVEGACIÓN RÁPIDA */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
        <div className="rounded-3xl bg-[#09090d]/90 border border-white/10 p-6 sm:p-8 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-wider">
              <Landmark size={14} />
              Marco Legal LCSP Art. 118 · Límite 14.250 €
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-syne text-white tracking-tight">
              Licitaciones Menores & Expedientes B2G
            </h1>
            <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Tramitación acelerada para técnicos de cultura, secretarios e interventores. Pliegos modelo, códigos DIR3 pre-validados y dossier descargable al instante.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/licitaciones/expediente"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#ecb613] text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#ffe066] transition-all shadow-[0_0_20px_rgba(236,182,19,0.3)] hover:scale-105"
            >
              <FileText size={15} />
              <span>Ver Expediente Tipo</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/b2g"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Scale size={15} className="text-[#00E5FF]" />
              <span>Portal Institucional B2G</span>
            </Link>
          </div>
        </div>
      </section>

      {/* PORTAL INTERACTIVO B2G S-CLASS */}
      <B2GInstitutionalPortal />

      {/* BLINDAJE JURÍDICO & TARIFA SSOT */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 sm:p-12 transition-all duration-500 hover:border-white/20">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#ecb613] font-mono font-bold">
            <ShieldCheck size={16} />
            Garantía Jurídica & Trazabilidad FACe
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-semibold text-white font-syne">
            Ajuste Preventivo Legal: 14.250 € (Bypass LCSP)
          </h2>
          <p className="mt-4 max-w-3xl text-sm sm:text-base text-zinc-300 leading-relaxed">
            La Ley 9/2017 de Contratos del Sector Público (LCSP) fija en 15.000,00 € el techo de contratación menor de servicios. EAR OS ajusta preventivamente cada propuesta a un máximo estricto de 14.250,00 € para garantizar margen de seguridad jurídica y cero reparos de intervención municipal. Tarifa base artística desde {TARIFA_BASE_SOLISTA_EUR} €, reserva con depósito deducible de {DEPOSITO_STRIPE_EUR} € y seguro de RC de 1.000.000 €.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/licitaciones/expediente"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-mono text-xs uppercase tracking-wider transition-all"
            >
              <FileText size={15} />
              Dossier de Contratación
            </Link>
            <a
              href={`tel:${CENTRALITA_EAR_OS.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono text-xs uppercase tracking-wider transition-all"
            >
              <span>Atención Técnica Institucional: {CENTRALITA_EAR_OS}</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
