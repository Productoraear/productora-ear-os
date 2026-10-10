import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aviso Legal | Productora EAR',
  description:
    'Información societaria, propiedad intelectual y responsabilidad operativa de Productora EAR bajo el estándar de transparencia EAR OS.',
};

interface LegalSection {
  readonly id: string;
  readonly heading: string;
  readonly body: string;
}

interface LegalEntity {
  readonly label: string;
  readonly value: string;
}

const LEGAL_ENTITY: readonly LegalEntity[] = [
  { label: 'Razón social', value: 'Productora EAR' },
  { label: 'Actividad', value: 'Ingeniería de eventos y management artístico' },
  { label: 'Sede central', value: 'Méntrida, Toledo (España)' },
  { label: 'Estándar operativo', value: 'EAR OS · S-Class' },
] as const;

const LEGAL_SECTIONS: readonly LegalSection[] = [
  {
    id: 'titularidad',
    heading: 'Titularidad del Ecosistema',
    body: 'Productora EAR es una entidad dedicada a la ingeniería de eventos y management artístico. Sede central en Méntrida, Toledo.',
  },
  {
    id: 'propiedad-intelectual',
    heading: 'Propiedad Intelectual',
    body: "Todo el contenido, arquitectura visual y protocolos 'S-Class' son propiedad exclusiva de Productora EAR. Queda prohibida la replicación sin autorización expresa.",
  },
  {
    id: 'responsabilidad-operativa',
    heading: 'Responsabilidad Operativa',
    body: 'La ejecución de servicios está sujeta a auditoría previa de viabilidad por nuestro departamento técnico.',
  },
] as const;

export default function AvisoLegalPage() {
  return (
    <main className="min-h-screen bg-[#030305] pt-40 pb-20 px-6">
      <div className="max-w-4xl mx-auto glass-panel p-12 lg:p-20 rounded-[4rem] border-white/5 bg-white/[0.01] transition-all duration-700 ease-out hover:border-[#d4a855]/20 hover:bg-white/[0.02] hover:shadow-[0_0_80px_-20px_rgba(212,168,85,0.15)]">
        <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-12">
          Aviso <span className="text-[#d4a855]">Legal</span>
        </h1>

        <div className="space-y-8 text-white/60 font-medium leading-relaxed">
          <p className="transition-colors duration-500 hover:text-white/80">
            Información societaria y legal bajo el estándar de transparencia EAR OS.
          </p>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 border-y border-white/5 py-8">
            {LEGAL_ENTITY.map((item) => (
              <div
                key={item.label}
                className="group flex flex-col gap-1 transition-transform duration-500 ease-out hover:translate-x-1"
              >
                <dt className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4a855] transition-colors duration-500 group-hover:text-[#e8c47a]">
                  {item.label}
                </dt>
                <dd className="text-sm text-white/80 font-semibold transition-colors duration-500 group-hover:text-white">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>

          {LEGAL_SECTIONS.map((section) => (
            <section
              key={section.id}
              aria-labelledby={`legal-${section.id}`}
              className="group relative pl-0 transition-all duration-500 ease-out hover:pl-4"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 h-full w-[2px] bg-[#d4a855] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
              />
              <h3
                id={`legal-${section.id}`}
                className="text-xl font-black uppercase tracking-widest text-white transition-colors duration-500 group-hover:text-[#d4a855]"
              >
                {section.heading}
              </h3>
              <p className="transition-colors duration-500 group-hover:text-white/80">
                {section.body}
              </p>
            </section>
          ))}

          <div className="pt-8 border-t border-white/5">
            <a
              href="/contacto"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-[#d4a855]/30 bg-[#d4a855]/5 px-8 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-[#d4a855] transition-all duration-500 ease-out hover:border-[#d4a855]/60 hover:bg-[#d4a855]/10 hover:text-[#e8c47a] hover:shadow-[0_0_40px_-10px_rgba(212,168,85,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a855]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] active:scale-[0.98]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#d4a855]/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
              />
              <span className="relative transition-transform duration-500 ease-out group-hover:translate-x-0.5">
                Contactar con el equipo
              </span>
              <span
                aria-hidden="true"
                className="relative inline-block transition-transform duration-500 ease-out group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}