import Link from 'next/link';
import { ArrowRight, ShieldCheck, Music2, Sparkles } from 'lucide-react';
import { HeroWeddingCinematic } from '@/components/home/HeroWeddingCinematic';
import QuantumRoleCockpit from '@/components/home/QuantumRoleCockpit';
import { CENTRALITA_EAR_OS, TARIFA_BASE_SOLISTA_EUR, DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';
import SovereignEntryBifurcation from '@/components/home/SovereignEntryBifurcation';

export default function Home() {
  return (
    <main className="bg-black/95 backdrop-blur-2xl relative w-full max-w-full min-h-screen overflow-x-hidden transition-colors duration-500 bg-[var(--background)] text-[var(--foreground)] font-sans selection:bg-[#ecb613] selection:text-black">
      {/* Puerta de Entrada Unificada: embudo bifurcado Cliente ↔ Artista (3 clics).
          pt-28/pt-32 = altura real de la cabecera opaca SovereignNavbar para
          que el primer titular nunca nazca debajo de ella. */}
      <div className="relative pt-28 sm:pt-32">
        <SovereignEntryBifurcation />
      </div>

      {/* Selector Multirol Quantum: cabecera inmersiva de arquetipos EAR OS */}
      <div className="relative pt-10 sm:pt-14">
        <QuantumRoleCockpit />
      </div>

      {/* Hero de Alta Conversión: voz de Edwin + precio 350 € + bloqueo de fecha sin riesgo */}
      <div className="relative">
        <HeroWeddingCinematic />
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