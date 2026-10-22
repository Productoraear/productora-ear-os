import type { Metadata } from 'next';
import ProhibitedSongsVault from '@/components/music/ProhibitedSongsVault';

export const metadata: Metadata = {
  title: 'Bóveda de Canciones Prohibidas | Filtro Musical para DJs y Fincas | EAR OS',
  description:
    'Configura la lista negra de canciones que jamás deben sonar en tu boda o evento de alta gala, genera el código QR de peticiones para las mesas y filtra las solicitudes de los invitados en tiempo real con alternativas de gala.',
  alternates: { canonical: '/musica/canciones-prohibidas' },
  openGraph: {
    title: 'Bóveda de Canciones Prohibidas | Filtro Musical para DJs y Fincas | EAR OS',
    description:
      'Veta los temas que no quieres escuchar jamás, comparte un QR en cada mesa y filtra las peticiones de los invitados en tiempo real.',
    url: 'https://productoraear.com/musica/canciones-prohibidas',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Productora EAR',
  },
  keywords: [
    'canciones prohibidas bodas',
    'lista negra de canciones',
    'filtro musical DJ bodas',
    'QR peticiones invitados',
    'fincas para bodas',
    'EAR OS',
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Bóveda de Canciones Prohibidas | Filtro Musical para DJs y Fincas | EAR OS',
  url: 'https://productoraear.com/musica/canciones-prohibidas',
  description:
    'Herramienta para novios, DJs y fincas de alta gala: veta los temas que jamás deben sonar, genera un QR de peticiones para las mesas y filtra las solicitudes de los invitados en tiempo real.',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web',
  inLanguage: 'es-ES',
  provider: {
    '@type': 'Organization',
    name: 'Productora EAR',
    url: 'https://productoraear.com',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
  },
};

export default function ProhibitedSongsPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white font-inter overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section id="hero" className="relative w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-10">
          <span className="text-[#ecb613] text-xs font-mono tracking-[0.4em] uppercase">
            Filtro musical S-Class
          </span>
          <h1 className="font-syne text-4xl sm:text-6xl font-bold tracking-tight text-white mt-4 leading-none">
            Bóveda de Canciones <span className="text-[#ecb613]">Prohibidas</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base sm:text-lg text-zinc-400">
            La herramienta definitiva para novios, DJs y fincas de alta gala: veta los temas que no
            quieres escuchar jamás, comparte un QR en cada mesa y filtra las peticiones de los
            invitados en tiempo real.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {['Cero vetos olvidados', 'QR imprimible', 'Filtro en vivo', 'Alternativas de gala'].map(
              (badge) => (
                <span
                  key={badge}
                  className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-zinc-300"
                >
                  {badge}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      <ProhibitedSongsVault />

      {/* INSTRUCCIONES PARA PAREJAS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-8 transition-all duration-300 ease-out">
          <h2 className="font-syne text-2xl font-bold text-white mb-5">
            Instrucciones para parejas y anfitriones
          </h2>
          <ol className="space-y-3 text-sm text-zinc-300 list-decimal list-inside">
            <li>Marca los temas que jamás deben sonar y añade tus canciones personalizadas.</li>
            <li>Copia la URL de peticiones de tu evento y genera el código QR.</li>
            <li>
              Descarga o imprime el QR para colocarlo en las minutas de cada mesa de la finca.
            </li>
            <li>
              Los invitados escanean, piden su canción y el DJ recibe solo los temas aprobados.
            </li>
          </ol>
        </div>
      </section>
    </main>
  );
}
