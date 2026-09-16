import type { Metadata } from 'next';
import DecisionBelt from '@/components/acg/DecisionBelt';
import {
  getFincaBySlug,
  buildAcgGraph,
  buildTerritorialInterlinks,
} from '@/lib/acg/acgSemanticGraph';
import { ACG_ARTIST_OFFERS, DECISION_STEPS } from '@/lib/acg/acgDecisionEngine';

export const metadata: Metadata = {
  title: 'Autonomous Commerce Grid · Reserva Directa en 60 segundos | EAR OS',
  description:
    'Cinta de Decisión S-Class: Ruta Uber desde Méntrida, Match Tinder con audio en caliente, Reserva Airbnb con Price-Lock 100 € y Plan Bodas.net con acústica legal. Split Soberano 80/10/10.',
};

export default function AcgPage() {
  // Finca de referencia real para el grafo semántico (hub conceptual del ACG).
  const hubFinca = getFincaBySlug('finca-valduerna');
  const heroOffer = ACG_ARTIST_OFFERS[0];
  const graph = buildAcgGraph(hubFinca, heroOffer);

  // Interlinks territoriales canónicos (Toledo/Madrid/Guadalajara → 52 provincias vía SSOT).
  const territories = ['Toledo', 'Madrid', 'Guadalajara'];
  const interlinks = territories.flatMap((province) => buildTerritorialInterlinks(province));

  return (
    <main className="min-h-screen bg-[#030305] text-[#f5f1e8] pt-28 pb-24 px-4 md:px-8 selection:bg-[#ecb613] selection:text-black">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
      />

      <div className="max-w-7xl mx-auto">
        <DecisionBelt />

        {/* Grafo de interlinking tridimensional visible */}
        <section className="mt-16 pt-10 border-t border-white/10">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-5">
            Grafo Semántico Transaccional · Geografía × Gremio × Formato
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DECISION_STEPS.map((step) => (
              <div key={step.id} className="rounded-2xl bg-[#050507] border border-white/10 p-5">
                <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: step.accent }}>
                  {step.nickname} Layer · {step.label}
                </span>
                <p className="font-body text-sm text-white/60 mt-2 leading-relaxed">{step.hint}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {interlinks.map((link) => (
              <a
                key={`${link.anchor}-${link.href}`}
                href={link.href}
                className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.06] font-mono text-[10px] transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>
        </section>

        {/* Blindaje doctrinal */}
        <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-[#050507] border border-white/10 p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#ecb613]">Split Soberano</p>
            <p className="font-body text-sm text-white/60 mt-2 leading-relaxed">80% Artista / 10% EAR OS / 10% VIMUME. Inmutable en cada liquidación.</p>
          </div>
          <div className="rounded-2xl bg-[#050507] border border-white/10 p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#00E5FF]">Price-Lock 100 €</p>
            <p className="font-body text-sm text-white/60 mt-2 leading-relaxed">Firma SHA-256 válida 24-72h. Depósito 100% reembolsable si no encaja la fecha.</p>
          </div>
          <div className="rounded-2xl bg-[#050507] border border-white/10 p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#10B981]">{'Acústica Legal <75 dB'}</p>
            <p className="font-body text-sm text-white/60 mt-2 leading-relaxed">Rider Bose F1 812 / S1 Pro, Shure Beta 87A. Cálculo 12 W/pax con límite B2G Art. 118 LCSP.</p>
          </div>
        </section>
      </div>
    </main>
  );
}