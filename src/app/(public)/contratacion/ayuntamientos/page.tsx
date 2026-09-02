import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contratación Mariachi y Conciertos para Ayuntamientos | Edwin Agudelo',
  description:
    'Solución cultural autónoma para Fiestas Patronales en toda España. Sonido Bose F1 integrado, programa de Doble Impacto (Mayores y Plaza Mayor) y factura electrónica FACE.',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://productoraear.com/contratacion/ayuntamientos',
  },
};

export default function AyuntamientosPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'PerformingGroup',
    name: 'Edwin Agudelo - Mariachi y Canción Mexicana',
    founder: {
      '@type': 'Person',
      name: 'Edwin Agudelo',
      jobTitle: 'Tenor y Productor Musical',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Spain',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Programación Cultural Municipal',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Programa Doble Impacto Municipal (Fiestas Patronales + Sesión Mayores)',
            description:
              'Concierto en Plaza Mayor con sonido autónomo Bose F1 y sesión acústica previa en Centro de Mayores.',
          },
        },
      ],
    },
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 py-16 px-6 sm:px-12 lg:px-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto">
        <div className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-6">
          Solución Cultural B2G Oficial
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
          Espectáculo de Canción Mexicana & Mariachi de Concierto
        </h1>
        <p className="text-lg text-neutral-400 mb-10">
          Programa Municipal de Doble Impacto: Tradición Popular en Plaza Mayor y Cohesión Intergeneracional con la Tercera Edad.
        </p>

        <section className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-8 mb-8">
          <h2 className="text-xl font-semibold text-amber-400 mb-4">1. El Modelo de Doble Impacto</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="border-l-2 border-amber-500/50 pl-4">
              <h3 className="font-medium text-white mb-1">Tarde: Sesión en Residencia / Mayores</h3>
              <p className="text-sm text-neutral-400">
                Programa acústico <em>Viaje Musical por la Memoria</em>, reactivación emocional y canciones universales para los mayores de la localidad.
              </p>
            </div>
            <div className="border-l-2 border-amber-500/50 pl-4">
              <h3 className="font-medium text-white mb-1">Noche: Gran Concierto en Plaza Mayor</h3>
              <p className="text-sm text-neutral-400">
                Directo de gran aforo con la voz lírica de Edwin Agudelo arropada por la majestuosidad de la ranchera y el mariachi.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-8 mb-8">
          <h2 className="text-xl font-semibold text-amber-400 mb-4">2. Autonomía Técnica Completa (Ahorro Directo)</h2>
          <ul className="space-y-3 text-sm text-neutral-300">
            <li className="flex items-start">
              <span className="text-amber-400 mr-2">✓</span>
              <span><strong>Sonido Bose F1 812:</strong> Cobertura lineal optimizada para espacios exteriores y plazas públicas hasta 1.000 personas. El consistorio no requiere contratar empresas de PA externas.</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-400 mr-2">✓</span>
              <span><strong>Captación Shure Beta 87A y Consola XR18:</strong> Calidad de audio con procesado dinámico de condensador.</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-400 mr-2">✓</span>
              <span><strong>Máster de Audio Incluido:</strong> Entrega de la grabación multipista en directo al departamento de prensa municipal para archivo y difusión.</span>
            </li>
          </ul>
        </section>

        <section className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-8 mb-8">
          <h2 className="text-xl font-semibold text-amber-400 mb-4">3. Logística Nacional y Marco Administrativo</h2>
          <p className="text-sm text-neutral-300 mb-4">
            Base central en Méntrida (Toledo) con disponibilidad para actuar en cualquier pueblo o ciudad de España. En desplazamientos fuera del radio de proximidad, se aplican estrictamente los baremos oficiales de kilometraje y dietas mínimas.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-neutral-800 text-neutral-300 px-3 py-1 rounded">Facturación Electrónica FACE</span>
            <span className="bg-neutral-800 text-neutral-300 px-3 py-1 rounded">Códigos DIR3</span>
            <span className="bg-neutral-800 text-neutral-300 px-3 py-1 rounded">Ley 9/2017 de Contratos Públicos</span>
            <span className="bg-neutral-800 text-neutral-300 px-3 py-1 rounded">Seguro RC en Vigor</span>
          </div>
        </section>

        <div className="border border-amber-500/40 bg-gradient-to-r from-amber-500/10 to-transparent p-6 rounded-xl text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Contacto Directo para Comisiones y Concejalías</h3>
          <p className="text-sm text-neutral-300 mb-4">Atención inmediata 24/7 para formalización de fechas y expedientes menores.</p>
          <a
            href="tel:+34693693048"
            className="inline-block bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-6 py-3 rounded-lg text-sm transition-colors"
          >
            Llamar al +34 693 693 048
          </a>
        </div>
      </div>
    </main>
  );
}
