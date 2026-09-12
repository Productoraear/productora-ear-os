// src/features/landing/HormoziGrandSlamLanding.tsx
//
// INTEGRADOR MAESTRO S-CLASS OLED
// Hook instantáneo (<3s) con badge dinámico, Bento Grid de respuesta a intención,
// los 5 componentes WOW y Sticky CTA flotante a checkout.

import type { SearchIntentProfile } from '@/lib/seo/searchIntentEngine';
import AcousticSpatialSim from './components/AcousticSpatialSim';
import MentridaFleetTracker from './components/MentridaFleetTracker';
import LocalProofGallery from './components/LocalProofGallery';
import HormoziOfferStack from './components/HormoziOfferStack';
import SchemaOrgMarkup from './components/SchemaOrgMarkup';

const ACCENT = '#ecb613';

interface HormoziGrandSlamLandingProps {
  profile: SearchIntentProfile;
}

export default function HormoziGrandSlamLanding({ profile }: HormoziGrandSlamLandingProps) {
  const ctaHref = `/checkout/presupuesto?servicio=${encodeURIComponent(profile.gremio)}&provincia=${encodeURIComponent(profile.provincia)}`;

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#030305] text-white">
      <SchemaOrgMarkup profile={profile} />

      {/* HERO / HOOK */}
      <section className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#050507] px-4 py-2 font-mono text-xs" style={{ color: ACCENT }}>
            <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: ACCENT }} />
            1 Fecha Libre para Sábado en {profile.provinciaName}
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            {profile.gremioLabel} en {profile.provinciaName}
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-white/70 leading-relaxed">{profile.dreamOutcome}</p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-black transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: ACCENT }}
            >
              Congelar fecha desde {profile.basePrice} €
            </a>
            <a
              href={`/servicios/${profile.gremio}/${profile.provincia}#telemetria`}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 px-6 py-3 font-semibold text-white transition-colors hover:border-white/30"
            >
              Ver telemetría y logística
            </a>
          </div>
        </div>
      </section>

      {/* BENTO GRID DE INTENCIÓN */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: ACCENT }}>
            Intención resuelta
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold mt-1" style={{ fontFamily: 'Syne, sans-serif' }}>
            Lo que realmente te preocupa, resuelto
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {profile.leadPainPoints.map((pain, i) => (
            <div key={pain} className="rounded-2xl border border-white/10 bg-[#050507] p-6">
              <span className="font-mono text-xs" style={{ color: ACCENT }}>
                Dolor {String(i + 1).padStart(2, '0')}
              </span>
              <p className="mt-3 text-white/80 leading-relaxed">{pain}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMPONENTES WOW */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 space-y-8">
        <AcousticSpatialSim />
        <MentridaFleetTracker logistics={profile.logistics} />
        <LocalProofGallery provinceName={profile.provinciaName} photos={profile.proofPhotos} />
        <HormoziOfferStack
          valueStack={profile.hormoziValueStack}
          valueTotal={profile.hormoziValueTotal}
          basePrice={profile.basePrice}
          deposit={profile.deposit}
        />
      </section>

      {/* FAQ */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>
            Preguntas frecuentes
          </h2>
          <div className="mt-8 space-y-3">
            {profile.faqs.map((q, i) => (
              <details key={q} className="group rounded-xl border border-white/10 bg-[#050507] p-4">
                <summary className="flex cursor-pointer items-center justify-between font-medium text-white/90">
                  <span>{q}</span>
                  <span className="text-white/40 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-white/60 leading-relaxed">
                  Respuesta verificada de Productora EAR para {profile.gremioLabel} en {profile.provinciaName}. Presupuesto cerrado
                  con depósito de {profile.deposit} € (item {i + 1} de {profile.faqs.length}).
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* STICKY CTA */}
      <div className="sticky bottom-0 z-20 border-t border-white/10 bg-[#030305]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <div className="min-w-0">
            <p className="truncate font-mono text-xs text-white/50">
              {profile.gremioLabel} · {profile.provinciaName}
            </p>
            <p className="text-lg font-bold" style={{ color: ACCENT }}>
              Desde {profile.basePrice} € <span className="text-sm font-normal text-white/50">+ fianza {profile.deposit} €</span>
            </p>
          </div>
          <a
            href={ctaHref}
            className="shrink-0 rounded-xl px-5 py-3 font-semibold text-black"
            style={{ backgroundColor: ACCENT }}
          >
            Reservar ahora
          </a>
        </div>
      </div>
    </main>
  );
}