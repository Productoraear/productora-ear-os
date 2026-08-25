import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    provincia: string;
    servicio: string;
  }>;
}

function formatText(slug: string): string {
  if (!slug) return '';
  return slug
    .split('-')
    .map(word => {
      const w = word.toLowerCase();
      if (w === 'led') return 'LED';
      if (w === 'p29') return 'P2.9';
      if (w === 'p26') return 'P2.6';
      if (w === 'p39') return 'P3.9';
      if (w === 'tv') return 'TV';
      if (w === 'pa') return 'PA';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function formatProvincia(slug: string): string {
  if (!slug) return 'España';
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { provincia, servicio } = await params;
  const provinciaFormatted = formatProvincia(provincia);
  const servicioFormatted = formatText(servicio);

  return {
    title: `Servicios de ${servicioFormatted} para Bodas en ${provinciaFormatted} | Productora EAR`,
    description: `Servicios profesionales de ${servicioFormatted} para bodas en ${provinciaFormatted}. Infraestructura técnica audiovisual S-Class, transporte homologado, montaje y técnico in-situ con garantía 0 Fallos.`,
    openGraph: {
      title: `Servicios de ${servicioFormatted} para Bodas en ${provinciaFormatted} - Productora EAR`,
      description: `Celebración perfecta de bodas con soluciones de sonorización, iluminación y producción audiovisual de alta gama.`,
    },
  };
}

export default async function BodasServiciosPage({ params }: PageProps) {
  const { provincia, servicio } = await params;
  const provinciaFormatted = formatProvincia(provincia);
  const servicioFormatted = formatText(servicio);

  const whatsappMessage = encodeURIComponent(
    `Hola, quiero verificar disponibilidad técnica para ${servicioFormatted} para bodas en ${provinciaFormatted}.`
  );
  const whatsappUrl = `https://wa.me/34693693048?text=${whatsappMessage}`;

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#ecb613] selection:text-black font-sans">
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-gradient-to-b from-[#ecb613]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ecb613]/30 bg-[#ecb613]/5 text-[#ecb613] text-xs uppercase tracking-widest mb-6">
          <span className="w-2 h-2 rounded-full bg-[#ecb613] animate-pulse" />
          S-Class Technical Services for Weddings B2B
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4">
          Servicios de <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#ecb613] to-amber-500">{servicioFormatted}</span> para Bodas en {provinciaFormatted}
        </h1>

        <p className="text-lg sm:text-xl text-neutral-400 max-w-3xl mb-8">
          Infraestructura técnica de alta gama con garantía de <strong className="text-white font-semibold">Cero Fallos</strong>. 
          Servicios profesionales, calibración acústica/visual y asistencia técnica in-situ para bodas de lujo en {provinciaFormatted}.
        </p>

        <div className="flex flex-wrap gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-black bg-gradient-to-r from-amber-300 via-[#ecb613] to-amber-500 hover:brightness-110 transition-all shadow-lg shadow-[#ecb613]/20 text-lg"
          >
            Verificar Disponibilidad VIP en WhatsApp
          </a>
          <Link href="/cotizador" className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-medium text-white border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 transition-all text-lg">
            Cotizador Dinámico B2B
          </Link>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-900">
        <h2 className="text-2xl font-bold text-white mb-8">Ficha Técnica y Protocolo de Garantía S-Class</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-[#ecb613]/30 transition-all">
            <div className="text-[#ecb613] font-bold text-lg mb-2">⚡ Rendimiento & Resolución</div>
            <h3 className="text-xl font-semibold text-white mb-2">{servicioFormatted} High-Refresh</h3>
            <p className="text-neutral-400 text-sm">
              Procesamiento 4K de baja latencia, tasa de refresco ultra-alta para cámaras y protección estructural antiviento e intemperie.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-[#ecb613]/30 transition-all">
            <div className="text-[#ecb613] font-bold text-lg mb-2">🛡️ Logística & Cobertura</div>
            <h3 className="text-xl font-semibold text-white mb-2">Despliegue Directo en {provinciaFormatted}</h3>
            <p className="text-neutral-400 text-sm">
              Transporte homologado, montadores certificados, seguro de Responsabilidad Civil de 600.000 € y pruebas previas al evento.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-[#ecb613]/30 transition-all">
            <div className="text-[#ecb613] font-bold text-lg mb-2">🎛️ Operativa In-Situ</div>
            <h3 className="text-xl font-semibold text-white mb-2">Técnico Dedicado S-Class</h3>
            <p className="text-neutral-400 text-sm">
              Control en vivo durante toda la jornada. Sin sorpresas, desintermediación ni fallos técnicos en momentos críticos.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 text-center border-t border-neutral-900 bg-gradient-to-b from-transparent to-[#ecb613]/5">
        <h2 className="text-3xl font-extrabold text-white mb-4">¿Tienes una fecha para tu boda en {provinciaFormatted}?</h2>
        <p className="text-neutral-400 mb-8 max-w-xl mx-auto">
          Reserva tus servicios audiovisuales para bodas con confirmación técnica inmediata.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-black bg-[#ecb613] hover:bg-amber-400 transition-all text-lg"
        >
          Consultar Disponibilidad de {servicioFormatted} para Bodas (+34 693 693 048)
        </a>
      </section>
    </main>
  );
}