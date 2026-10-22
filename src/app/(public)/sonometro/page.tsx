import type { Metadata } from 'next';
import AcousticConscienceMeter from '@/components/tools/AcousticConscienceMeter';
import { LIMITE_SPL_DB, WATTS_PER_PAX } from '@/lib/constants/ear-os-ssot';

export const metadata: Metadata = {
  title: 'Sonómetro de Conciencia PWA | Medidor Acústico Ley 37/2003 | EAR OS',
  description:
    'Medidor acústico pedagógico en tiempo real con Web Audio API. Autorregulación acústica conforme a la Ley 37/2003 del Ruido para cócteles, bodas, festejos populares y centros senior VIMUME.',
  openGraph: {
    title: 'Sonómetro de Conciencia PWA | Medidor Acústico Ley 37/2003 | EAR OS',
    description:
      'Mide el nivel sonoro ambiental en dBA y contrasta con los límites de la Ley 37/2003 según contexto. Herramienta pedagógica de autorregulación, no homologada.',
    type: 'website',
    locale: 'es_ES',
    url: 'https://ear-os.com/sonometro',
    siteName: 'EAR OS',
  },
  alternates: {
    canonical: '/sonometro',
  },
};

const DECIBEL_REFERENCE: ReadonlyArray<{
  context: string;
  range: string;
  note: string;
}> = [
  { context: 'Cóctel Lírico / Solista', range: '70 - 80 dBA', note: 'Acústica de gala' },
  {
    context: 'Bodas & Fincas',
    range: '85 - 90 dBA',
    note: 'Exteriores · 80 - 85 dBA interiores',
  },
  {
    context: 'Festejos Populares / Plazas',
    range: '90 - 102 dBA',
    note: 'Limitador telemático homologado',
  },
  { context: 'Senior VIMUME', range: '65 - 75 dBA', note: 'Protocolo 40 Hz no invasivo' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Sonómetro de Conciencia PWA',
  alternateName: 'Medidor Acústico Ley 37/2003',
  description:
    'Medidor acústico pedagógico en tiempo real con Web Audio API para autorregulación conforme a la Ley 37/2003 del Ruido.',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  additionalType: 'AcousticRegulation',
  inLanguage: 'es',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
  },
  author: {
    '@type': 'Organization',
    name: 'EAR OS',
    url: 'https://ear-os.com',
  },
};

export default function SonometroPage() {
  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-[#030305] text-[#f5f5f7] px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="mx-auto w-full max-w-5xl">
        {/* Hero pedagógico */}
        <header className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[#a1a1aa] mb-3">
            EAR OS · Herramienta interactiva · Ley 37/2003 del Ruido
          </p>
          <h1 className="m-0 text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-[-0.03em] font-semibold">
            Sonómetro de Conciencia
          </h1>
          <p className="mt-4 mb-0 text-[#a1a1aa] text-lg leading-relaxed max-w-2xl">
            Mide el nivel sonoro ambiental en tiempo real con el micrófono de tu dispositivo y
            contrasta con los límites de la Ley 37/2003 según el contexto del evento. Una
            herramienta de autorregulación responsable, no un limitador homologado.
          </p>
        </header>

        {/* Medidor interactivo */}
        <AcousticConscienceMeter />

        {/* Tabla de referencia de decibelios */}
        <section className="mt-10 rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 sm:p-8 transition-all duration-300">
          <h2 className="m-0 mb-4 text-xl font-semibold tracking-tight">
            Tabla de referencia de decibelios
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-[#a1a1aa]">
                  <th className="py-3 pr-4 font-medium">Contexto acústico</th>
                  <th className="py-3 pr-4 font-medium">Rango dBA</th>
                  <th className="py-3 font-medium">Nota</th>
                </tr>
              </thead>
              <tbody>
                {DECIBEL_REFERENCE.map((row) => (
                  <tr key={row.context} className="border-b border-white/5">
                    <td className="py-3 pr-4 font-semibold text-white">{row.context}</td>
                    <td className="py-3 pr-4 font-mono text-[#ecb613]">{row.range}</td>
                    <td className="py-3 text-[#a1a1aa]">{row.note}</td>
                  </tr>
                ))}
                <tr>
                  <td className="py-3 pr-4 font-semibold text-white">
                    Límite de salud pública general
                  </td>
                  <td className="py-3 pr-4 font-mono text-[#FF2B44]">
                    &lt; {LIMITE_SPL_DB} dB SPL
                  </td>
                  <td className="py-3 text-[#a1a1aa]">{WATTS_PER_PAX} W/pax</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Nota legal */}
        <p className="m-0 mt-8 text-xs leading-relaxed text-[#71717a]">
          Esta herramienta emplea el micrófono del dispositivo y una estimación RMS sin
          ponderación A certificada. Los valores mostrados son orientativos y de carácter
          pedagógico. Para mediciones oficiales con validez legal, se requiere un sonómetro
          homologado conforme a la Ley 37/2003 del Ruido.
        </p>
      </section>
    </main>
  );
}
