import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ShieldCheck,
  MapPin,
  Award,
  Phone,
  Sparkles,
  CreditCard,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Flame,
  Volume2
} from 'lucide-react';
import {
  getOtzarretaLanding,
  getOtzarretaSlugs,
  OTZARRETA_CANONICAL_BASE
} from '@/lib/seo/otzarreta-dominance-engine';
import { DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';
import { OtzarretaExperienceExplorer } from '@/components/otzarreta/OtzarretaExperienceExplorer';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  // SSG completo del clúster: las 126 URLs (72 geo + 54 intención) se
  // pre-renderizan en build; cualquier slug fuera del catálogo responde 404.
  return getOtzarretaSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const landing = getOtzarretaLanding(slug);
  if (!landing) {
    return {
      title: 'Restaurante Otzarreta · Zarautz (Gipuzkoa)',
      description:
        'Cocina de cazuela vasca desde 1902 en Zarautz y banquetes de boda con ceremonia en jardín.'
    };
  }

  const canonicalUrl = `${OTZARRETA_CANONICAL_BASE}${landing.path}`;

  return {
    title: landing.title,
    description: landing.description,
    keywords: [...landing.keywords],
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: landing.title,
      description: landing.description,
      url: canonicalUrl,
      siteName: 'Productora EAR',
      locale: 'es_ES',
      type: 'website',
      images: [
        {
          url: 'https://www.ezkertzaberria.com/wp-content/uploads/2021/05/Fachada-Principal-1.jpg',
          width: 1200,
          height: 630,
          alt: `${landing.h1} · Ezkertza Berria & Restaurante Otzarreta`
        }
      ]
    }
  };
}

export default async function OtzarretaDynamicLandingPage({ params }: Props): Promise<React.JSX.Element> {
  const { slug } = await params;
  const landing = getOtzarretaLanding(slug);

  if (!landing) {
    notFound();
  }

  const whatsappUrl = `https://wa.me/34619455396?text=${encodeURIComponent(
    `Hola Eduardo, te contacto desde tu landing oficial de Productora EAR para consultar disponibilidad para "${landing.h1}".`
  )}`;

  return (
    <main className="min-h-screen bg-[#030305] text-white selection:bg-[#ecb613] selection:text-black pt-28 pb-24 overflow-x-hidden">
      {/* Schema.org JSON-LD estructurado */}
      {landing.schemaOrg.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, '\\u003c')
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Breadcrumb de navegación */}
        <nav className="flex flex-wrap items-center gap-2 text-xs text-gray-400 font-mono">
          <Link href="/" className="hover:text-white transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/otzarreta" className="hover:text-white transition-colors">
            Restaurante Otzarreta
          </Link>
          <span>/</span>
          <span className="text-[#ecb613]">{landing.municipalityName}</span>
        </nav>

        {/* Hero de la Landing Específica */}
        <div className="space-y-6 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
            <MapPin className="w-4 h-4 text-[#ecb613]" />
            <span>{landing.kicker.toUpperCase()}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-sans leading-[1.1]">
            {landing.h1}
            <span className="block text-xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-[#ecb613] font-serif italic font-normal mt-2">
              Restaurante Otzarreta · Eduardo Martínez
            </span>
          </h1>

          {/* Copy único e irrepetible generado por el motor (anti-duplicación ≤ 10%) */}
          <p className="text-gray-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            {landing.uniqueCopy}
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
              Consultar Vía WhatsApp
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-gray-400 font-mono">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Acústica Homologada ({landing.noiseRange})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Split Soberano 80/10/10</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ecb613]" />
              <span>Alianza Edwin Agudelo & Productora EAR</span>
            </div>
          </div>
        </div>

        {/* Bloques de Secciones Documentadas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {landing.sections.map((section, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-3 backdrop-blur-md"
            >
              <div className="w-10 h-10 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
                {idx === 0 ? (
                  <MapPin className="w-5 h-5" />
                ) : idx === 1 ? (
                  <Flame className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </div>
              <h2 className="text-lg font-bold text-white">{section.heading}</h2>
              <p className="text-xs text-gray-400 leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>

        {/* Explorador Interactivo de Menús & Calculadora */}
        <div className="space-y-6">
          <div className="text-center">
            <span className="text-xs font-mono text-[#ecb613] uppercase tracking-wider">
              PROPUESTA GASTRONÓMICA & HARDWARE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Menús Nupciales y Presupuesto al Instante
            </h2>
          </div>
          <OtzarretaExperienceExplorer />
        </div>

        {/* Preguntas Frecuentes Verificadas */}
        <div className="rounded-3xl bg-[#09090d]/90 border border-white/10 p-8 sm:p-12 space-y-8 backdrop-blur-md">
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#ecb613] uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              RESOLUCIÓN DE DUDAS OPERATIVAS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Preguntas Frecuentes sobre {landing.h1}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {landing.faqs.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs text-gray-400 pl-6 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sello de procedencia verificable (SHA-256) */}
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 sm:p-8 backdrop-blur-md space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#ecb613]">
            <ShieldCheck className="w-4 h-4" />
            SELLO DE PROCEDENCIA · SHA-256
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            La ficha del proveedor, el copy de esta URL y el precio-lock se firman en build. N reintentos de
            Stripe con la misma sesión producen un único bloqueo de fecha (idempotencia ACID).
          </p>
          <dl className="grid grid-cols-1 gap-2 font-mono text-[10px] text-gray-500">
            <div className="break-all">
              <dt className="text-gray-400">provenance</dt>
              <dd>{landing.provenanceHash}</dd>
            </div>
            <div className="break-all">
              <dt className="text-gray-400">stripeSessionId</dt>
              <dd>{landing.stripeSessionId}</dd>
            </div>
            <div className="break-all">
              <dt className="text-gray-400">priceLock</dt>
              <dd>{landing.priceLockSha256}</dd>
            </div>
          </dl>
          <p className="text-[10px] text-gray-500 font-mono break-all">
            Entidad verificada · {landing.phone} · {landing.email} · fuente: restauranteotzarreta.com
          </p>
        </div>

        {/* Malla de Enlaces Internos del Clúster (Anti-huérfano) */}
        {landing.related.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-white/10">
            <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">
              Otras Opciones en el Clúster de Restaurante Otzarreta en Gipuzkoa:
            </div>
            <div className="flex flex-wrap gap-3">
              {landing.related.map((rel, idx) => (
                <Link
                  key={idx}
                  href={`/otzarreta/${rel.slug}`}
                  className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-gray-300 hover:text-white hover:border-[#ecb613]/50 hover:bg-[#ecb613]/5 transition-all flex items-center gap-1.5 font-mono"
                >
                  <span>{rel.label}</span>
                  <ArrowRight className="w-3 h-3 text-[#ecb613]" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
