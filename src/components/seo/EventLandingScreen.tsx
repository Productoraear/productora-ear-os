import Link from 'next/link';
import { EVENT_SSOT_COPY } from '@/lib/seo/eventPricingCopy';
import type { EventLandingModel } from '@/lib/seo/eventLandingModel';

/**
 * PANTALLA ÚNICA DE LAS LANDINGS DE EVENTOS.
 *
 * Server Component puro: cero `use client`, cero estado, cero fetch en cliente.
 * Motivo medido: el 99,95% de las sesiones rebotaba con CLS 0,87; añadir
 * JavaScript aquí repetiría el error. El HTML viaja completo y el CLS es 0 por
 * construcción (sin media sin reservar espacio, sin animación de layout).
 *
 * El JSON-LD se serializa y se escapa `<` → `\u003c` antes de inyectarse:
 * SEC-4 prohíbe `dangerouslySetInnerHTML` con datos no confiables, y aquí el
 * único contenido es el modelo generado en servidor desde el SSOT.
 *
 * SEC-2 · role: public | tenant: global. Cero datos personales.
 */
export interface EventLandingScreenProps {
  model: EventLandingModel;
}

export default function EventLandingScreen({ model }: EventLandingScreenProps) {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#030305] text-[#f5f5f7]">
      {model.structuredData.map((block, index) => (
        <script
          key={`ld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(block).replace(/</g, '\\u003c'),
          }}
        />
      ))}

      <div className="mx-auto w-full max-w-5xl px-5 py-14 sm:px-8">
        <nav aria-label="Miga de pan" className="mb-8">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] uppercase tracking-[0.18em] text-[#71717a]">
            {model.breadcrumbs.map((crumb, index) => (
              <li key={crumb.href} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                <Link
                  href={crumb.href}
                  className="transition-colors duration-300 ease-out hover:text-[#ecb613]"
                >
                  {crumb.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <header className="mb-12">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#ecb613]">
            {model.eyebrow}
          </p>
          <h1 className="text-balance text-3xl font-semibold leading-tight text-[#f5f5f7] sm:text-4xl">
            {model.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#a1a1aa]">{model.lede}</p>
        </header>

        <section
          aria-label="Datos verificables"
          className="mb-12 rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 backdrop-blur-md"
        >
          <dl className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {model.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-[10px] uppercase tracking-[0.18em] text-[#71717a]">
                  {fact.label}
                </dt>
                <dd className="mt-1 font-mono text-sm text-[#f5f5f7]">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="space-y-6">
          {model.sections.map((section) => (
            <section
              key={section.title}
              className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 backdrop-blur-md transition-all duration-300 ease-out hover:border-white/20"
            >
              <h2 className="text-lg font-semibold text-[#f5f5f7]">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-sm leading-relaxed text-[#a1a1aa]">
                  {paragraph}
                </p>
              ))}
              {section.bullets.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-[#d4d4d8]">
                      <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ecb613]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <section aria-labelledby="enlaces-relacionados" className="mt-14">
          <h2
            id="enlaces-relacionados"
            className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#71717a]"
          >
            Sigue explorando
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {model.links.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className="group rounded-2xl border border-white/10 bg-[#09090d]/60 px-5 py-4 transition-all duration-300 ease-out hover:border-[#ecb613]/40 hover:bg-[#09090d]"
              >
                <span className="block text-sm font-medium text-[#f5f5f7] group-hover:text-[#ecb613]">
                  {link.label}
                </span>
                <span className="mt-1 block text-xs text-[#71717a]">{link.hint}</span>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="preguntas-frecuentes" className="mt-14">
          <h2 id="preguntas-frecuentes" className="mb-5 text-lg font-semibold text-[#f5f5f7]">
            Preguntas frecuentes
          </h2>
          <div className="space-y-3">
            {model.faq.map((item) => (
              <details
                key={item.question}
                className="rounded-2xl border border-white/10 bg-[#09090d]/60 px-5 py-4"
              >
                <summary className="cursor-pointer list-none text-sm font-medium text-[#f5f5f7]">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[#a1a1aa]">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-[#ecb613]/30 bg-[#09090d]/80 p-7 backdrop-blur-md">
          <h2 className="text-xl font-semibold text-[#f5f5f7]">{model.ctaLabel}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#a1a1aa]">
            Tarifa base {EVENT_SSOT_COPY.basePrice}. Depósito de {EVENT_SSOT_COPY.deposit}{' '}
            deducible íntegro del total. Presupuesto desglosado y rider por escrito antes de
            cualquier pago.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/reservar/solista"
              className="inline-flex items-center justify-center rounded-full bg-[#ecb613] px-6 py-3 text-sm font-semibold text-[#030305] transition-all duration-300 ease-out hover:bg-[#f5cf5b]"
            >
              Ver disponibilidad real
            </Link>
            <a
              href={model.whatsappUrl}
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-[#f5f5f7] transition-all duration-300 ease-out hover:border-[#ecb613]/50 hover:text-[#ecb613]"
              rel="noopener noreferrer"
              target="_blank"
            >
              Consultar por WhatsApp
            </a>
            <a
              href={`tel:${EVENT_SSOT_COPY.CENTRALITA.replace(/[^0-9+]/g, '')}`}
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3 font-mono text-sm text-[#a1a1aa] transition-all duration-300 ease-out hover:text-[#f5f5f7]"
            >
              {EVENT_SSOT_COPY.CENTRALITA}
            </a>
          </div>
        </section>

        <footer className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-xs text-[#71717a]">
          <Link href="/eventos" className="transition-colors duration-300 hover:text-[#ecb613]">
            Catálogo de eventos
          </Link>
          <Link href="/confianza" className="transition-colors duration-300 hover:text-[#ecb613]">
            Registro público de pruebas
          </Link>
          <Link href="/precios" className="transition-colors duration-300 hover:text-[#ecb613]">
            Precios
          </Link>
          <span className="font-mono">
            {EVENT_SSOT_COPY.wattsPerPax} W/pax · &lt; {EVENT_SSOT_COPY.splLimit} dB SPL
          </span>
        </footer>
      </div>
    </main>
  );
}
