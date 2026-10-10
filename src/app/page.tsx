import Link from 'next/link';
import { Phone, ArrowRight, ShieldCheck, Music2, Sparkles } from 'lucide-react';
import NeuralConciergeFunnel2050 from '@/components/neural/NeuralConciergeFunnel2050';
import { CENTRALITA_EAR_OS, TARIFA_BASE_SOLISTA_EUR, DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';

export default function Home() {
  const telHref = `tel:${CENTRALITA_EAR_OS.replace(/\s+/g, '')}`;

  return (
    <main className="relative w-full max-w-full min-h-screen overflow-x-hidden transition-colors duration-500 bg-[var(--background)] text-[var(--foreground)] font-sans selection:bg-[#ecb613] selection:text-black">
      {/* Header Comercial S-Class: Marca, Teléfono y Acceso Rápido */}
      <header className="fixed top-0 left-0 right-0 z-40 p-3 sm:p-5 flex items-center justify-between gap-3">
        {/* Identidad de marca oficial */}
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2.5 bg-black/80 dark:bg-black/70 light:bg-white/90 backdrop-blur-xl border border-white/10 dark:border-white/10 light:border-zinc-200 px-3.5 py-1.5 rounded-full shadow-lg transition-all hover:border-[#ecb613]/50"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#ecb613]/70 shadow-[0_0_12px_rgba(236,182,19,0.45)] shrink-0 bg-black">
            <img
              src="/images/brand/ear_logo_official_diamond.png"
              alt="Productora EAR Logotipo Oficial"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs tracking-tight font-mono">PRODUCTORA</span>
            <span className="font-bold text-xs tracking-tight text-[#ecb613] font-mono">EAR</span>
          </div>
        </Link>

        {/* Contacto directo y botón de conversión */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          <a
            href={telHref}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 dark:bg-black/60 light:bg-white/90 hover:bg-white/10 backdrop-blur-xl border border-white/15 dark:border-white/15 light:border-zinc-200 text-xs font-mono transition-all shadow-sm"
          >
            <Phone size={13} className="text-[#ecb613]" />
            <span className="hidden sm:inline font-medium">{CENTRALITA_EAR_OS}</span>
          </a>

          <Link
            href="/reservar/solista"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#ecb613] hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-[0_0_20px_rgba(236,182,19,0.3)] hover:scale-105 cursor-pointer font-mono"
          >
            <ArrowRight size={13} className="text-black" />
            <span>Reservar {TARIFA_BASE_SOLISTA_EUR} €</span>
          </Link>
        </div>
      </header>

      {/* Hero Interactivo Neural 2050 (Viaje en 3 Clics) */}
      <div className="relative pt-16 sm:pt-20">
        <NeuralConciergeFunnel2050 />
      </div>

      {/* BLOQUE DE CONFIANZA EDITORIAL S-CLASS: 3 PILARES QUE CIERRAN VENTAS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 border-t border-zinc-200/50 dark:border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Pilar 1: Edwin Agudelo Tenor */}
          <div className="p-6 rounded-3xl border bg-zinc-50/50 dark:bg-zinc-900/40 border-zinc-200/80 dark:border-white/10 transition-all hover:border-amber-400/50">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4">
              <Music2 size={20} />
            </div>
            <h3 className="text-lg font-bold font-serif mb-2">Edwin Agudelo · Tenor Insignia</h3>
            <p className="text-xs opacity-75 leading-relaxed mb-4">
              Voz solista educada en lírica y mariachi de gala. Tarifa base oficial de <strong>{TARIFA_BASE_SOLISTA_EUR} €</strong> sin costes ocultos ni comisiones de agencia.
            </p>
            <Link
              href="/reservar/solista"
              className="text-xs font-mono font-bold text-amber-500 hover:underline inline-flex items-center gap-1"
            >
              <span>Ver Repertorio y Reserva</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Pilar 2: Blindaje Acústico Ley 37/2003 */}
          <div className="p-6 rounded-3xl border bg-zinc-50/50 dark:bg-zinc-900/40 border-zinc-200/80 dark:border-white/10 transition-all hover:border-amber-400/50">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-lg font-bold font-serif mb-2">Ingeniería Acústica &lt; 75 dB</h3>
            <p className="text-xs opacity-75 leading-relaxed mb-4">
              Protección legal homologada para fincas, salones y espacios al aire libre. Sonido Bose nítido a cualquier volumen sin riesgo de sanción policial.
            </p>
            <Link
              href="/fincas/portal-demostrativo"
              className="text-xs font-mono font-bold text-emerald-500 hover:underline inline-flex items-center gap-1"
            >
              <span>Homologación de Fincas</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Pilar 3: Garantía Stripe Price-Lock */}
          <div className="p-6 rounded-3xl border bg-zinc-50/50 dark:bg-zinc-900/40 border-zinc-200/80 dark:border-white/10 transition-all hover:border-amber-400/50">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 mb-4">
              <Sparkles size={20} />
            </div>
            <h3 className="text-lg font-bold font-serif mb-2">Bloqueo con {DEPOSITO_STRIPE_EUR} € Deducible</h3>
            <p className="text-xs opacity-75 leading-relaxed mb-4">
              Fianza segura con cifrado SHA-256 que bloquea tu fecha y hora en el calendario exclusivo del artista. Se resta íntegra del total de tu evento.
            </p>
            <Link
              href="/calculadora"
              className="text-xs font-mono font-bold text-cyan-500 hover:underline inline-flex items-center gap-1"
            >
              <span>Calcular Presupuesto Inmediato</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* JSON-LD Schema.org para SEO Enterprise */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'EntertainmentBusiness',
            name: 'Productora EAR',
            url: 'https://productoraear.com',
            telephone: CENTRALITA_EAR_OS,
            priceRange: '€€',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Méntrida',
              addressRegion: 'Toledo',
              postalCode: '45220',
              addressCountry: 'ES'
            },
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Servicios Musicales y Producción Técnica',
              itemListElement: [
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Show Edwin Agudelo Tenor Solista'
                  },
                  price: TARIFA_BASE_SOLISTA_EUR,
                  priceCurrency: 'EUR',
                  url: 'https://productoraear.com/reservar/solista'
                }
              ]
            }
          })
        }}
      />
    </main>
  );
}