import type { Metadata } from 'next';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '../../../lib/constants/ear-os-ssot';

export const metadata: Metadata = {
  title: 'Alquiler de Equipos y DJ | EAR OS',
  description:
    'Alquiler de equipos de sonido, DJ y solista premium en la red nacional EAR OS. Reserva con depósito 100% deducible y bloqueo de fecha.',
};

const PRECIO_SOLISTA = TARIFA_BASE_SOLISTA_EUR.toFixed(2).replace('.', ',');
const DEPOSITO = DEPOSITO_STRIPE_EUR.toFixed(2).replace('.', ',');
const WHATSAPP_TELEFONO = CENTRALITA_EAR_OS.replace(/[^0-9]/g, '');
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_TELEFONO}`;

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Reserva Solista Premium — Edwin Agudelo (EAR OS)',
  description:
    'Show de solista premium con rider acústico ajustado a contexto (Ley 37/2003) y bloqueo atómico de fecha en calendario.',
  brand: {
    '@type': 'Brand',
    name: 'EAR OS',
  },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'EUR',
    price: TARIFA_BASE_SOLISTA_EUR,
    availability: 'https://schema.org/InStock',
    url: 'https://www.productoraear.com/reservar/solista',
  },
};

const PRECIO_BASE_LABEL = `${PRECIO_SOLISTA} €`;
const DEPOSITO_LABEL = `${DEPOSITO} €`;

export default function AlquilerPage() {
  return (
    <main className="w-full overflow-x-hidden bg-[#030305] text-[#f5f5f5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#ecb613]">
          Alquiler · Equipos & DJ
        </p>
        <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          Sonido, luz y escena
          <span className="block text-[#00e5ff]">listos para tu evento.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#c9c9d1]">
          Equipos profesionales, DJ y solista premium con precio transparente,
          depósito 100% deducible y bloqueo atómico de fecha. Sin letra pequeña.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {/* Solista Premium — precio SSOT */}
          <article className="group rounded-3xl border border-white/10 bg-[#09090d]/80 p-8 backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#ecb613]/40">
            <span className="inline-flex rounded-full border border-[#ecb613]/30 bg-[#ecb613]/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-[#ecb613]">
              Solista Premium
            </span>
            <h2 className="mt-5 font-display text-3xl font-semibold">
              Edwin Agudelo — Show en vivo
            </h2>
            <p className="mt-3 text-[#c9c9d1]">
              Rider acústico ajustado a contexto (Ley 37/2003) y repertorio de
              gala. Tarifa oficial innegociable.
            </p>
            <p className="mt-6 font-display text-5xl font-semibold text-white">
              {PRECIO_BASE_LABEL}
            </p>
            <p className="mt-1 text-sm text-[#c9c9d1]">
              Depósito de cierre {DEPOSITO_LABEL} · 100% deducible del total
            </p>
            <a
              href="/reservar/solista"
              className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-[#ecb613] px-6 py-4 font-semibold text-[#030305] transition-all duration-300 ease-out hover:bg-[#ffd84d] hover:shadow-[0_0_28px_rgba(236,182,19,0.35)]"
            >
              Reservar fecha y hora
            </a>
          </article>

          {/* Alquiler de Equipos / DJ — CTA real a WhatsApp */}
          <article className="group rounded-3xl border border-white/10 bg-[#09090d]/80 p-8 backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#00e5ff]/40">
            <span className="inline-flex rounded-full border border-[#00e5ff]/30 bg-[#00e5ff]/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-[#00e5ff]">
              Equipos & DJ
            </span>
            <h2 className="mt-5 font-display text-3xl font-semibold">
              Sonido profesional y cabina DJ
            </h2>
            <p className="mt-3 text-[#c9c9d1]">
              Packs de sonorización, iluminación y DJ para festejos, bodas y
              eventos corporativos. Presupuesto inmediato por WhatsApp.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-[#c9c9d1]">
              <li className="flex items-center gap-2">
                <span className="text-[#00e5ff]">▸</span> Packs ajustados a tu aforo
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#00e5ff]">▸</span> Rider acústico por contexto
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#00e5ff]">▸</span> Logística S-Class 1,50 €/km desde km 50
              </li>
            </ul>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-semibold text-white transition-all duration-300 ease-out hover:bg-[#00e5ff]/10 hover:border-[#00e5ff]/40"
            >
              Solicitar presupuesto por WhatsApp
            </a>
          </article>
        </div>

        <p className="mt-10 text-center font-mono text-xs text-[#6b6b76]">
          Centralita oficial: {CENTRALITA_EAR_OS}
        </p>
      </section>
    </main>
  );
}