import React from 'react';
import Head from 'next/head';
import { getCopyForEvent } from '@/config/seo-matrix';
import BookingCalculator from '@/components/widgets/BookingCalculator';
import { EdwinProfile } from '@/data/artists/edwin-agudelo';

// Next.js 15+ Server Component Params
type PageProps = {
  params: Promise<{ provincia: string; evento: string }>;
};

export default async function ProvinciaEventoPage(props: PageProps) {
  const params = await props.params;
  const { provincia, evento } = params;
  
  const seoData = getCopyForEvent(provincia, evento);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": seoData.serviceType,
    "name": seoData.title,
    "description": seoData.description,
    "provider": {
      "@type": "Person",
      "name": EdwinProfile.name,
      "url": "https://productoraear.com/artistas/edwin-agudelo"
    },
    "areaServed": {
      "@type": "City",
      "name": seoData.provCapitalized
    },
    "url": `https://productoraear.com/servicios/mariachis/${provincia}/${evento}`,
    "telephone": "+34693693048"
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `¿Cuánto cuesta un mariachi en ${seoData.provCapitalized} para ${seoData.eventClean}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `El precio base en ${seoData.provCapitalized} comienza desde 350€ para el formato premium, pero puedes calcular tu tarifa exacta incluyendo desplazamientos con nuestra calculadora en tiempo real.`
        }
      },
      {
        "@type": "Question",
        "name": `¿Tocan Las Mañanitas para cumpleaños o serenatas en ${seoData.provCapitalized}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Sí, Edwin Agudelo es especialista en 'Las Mañanitas' y serenatas románticas con un repertorio completo que incluye clásicos como 'El Rey'.`
        }
      }
    ]
  };

  return (
    <main className="min-h-screen bg-black text-white py-12 px-4 md:px-8">
      {/* Inyección de JSON-LD estructurado para Google y Perplexity (Astra AI) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
            {seoData.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {seoData.description}
          </p>
        </header>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-4">
            Reserva Inmediata en {seoData.provCapitalized}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6 text-gray-300">
              <p>
                Aprovecha la disponibilidad de <strong>{EdwinProfile.name}</strong> para tu evento. 
                Con nuestro sistema S-Class, sabrás el precio final al instante sin esperas.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">✅ Pago 100% seguro con tarjeta o Klarna</li>
                <li className="flex items-center gap-2">✅ Emisión de Pre-Contrato Automático</li>
                <li className="flex items-center gap-2">✅ Incluye "El Rey", "Las Mañanitas" y más</li>
              </ul>
            </div>
            <div>
              {/* Render del Widget S-Class */}
              <BookingCalculator />
            </div>
          </div>
        </section>

        <section className="mt-12 space-y-6 border-t border-white/10 pt-8">
          <h2 className="text-2xl font-bold">Preguntas Frecuentes ({seoData.provCapitalized})</h2>
          <div className="space-y-4">
            <div className="bg-black/40 p-6 rounded-xl border border-white/5">
              <h3 className="font-bold text-lg mb-2 text-green-400">¿Cuánto cuesta un mariachi en {seoData.provCapitalized} para {seoData.eventClean}?</h3>
              <p className="text-gray-400">El precio base comienza desde 350€ para el formato premium, pero puedes calcular tu tarifa exacta incluyendo desplazamientos usando nuestra calculadora superior.</p>
            </div>
            <div className="bg-black/40 p-6 rounded-xl border border-white/5">
              <h3 className="font-bold text-lg mb-2 text-green-400">¿Tocan Las Mañanitas para cumpleaños?</h3>
              <p className="text-gray-400">Sí, somos especialistas en 'Las Mañanitas' y serenatas románticas con un repertorio completo que incluye clásicos como 'El Rey'.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
