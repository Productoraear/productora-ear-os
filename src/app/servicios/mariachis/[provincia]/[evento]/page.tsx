import React from 'react';
import Head from 'next/head';
import { getCopyForEvent, generateTotalMatrix } from '@/config/seo-matrix';
import BookingCalculator from '@/components/widgets/BookingCalculator';
import { EdwinProfile } from '@/data/artists/edwin-agudelo';

// 1. OPTIMIZACIÓN DE CARGA (ISR S-Class)
// Mantiene los datos en caché por 1 hora (3600 segundos) garantizando carga en <300ms
export const revalidate = 3600;

// Pre-renderiza las 572 combinaciones durante el build
export async function generateStaticParams() {
  const matrix = generateTotalMatrix();
  return matrix.map((combo) => ({
    provincia: combo.provincia,
    evento: combo.evento,
  }));
}

type PageProps = {
  params: Promise<{ provincia: string; evento: string }>;
};

export default async function ProvinciaEventoPage(props: PageProps) {
  const params = await props.params;
  const { provincia, evento } = params;
  
  const seoData = getCopyForEvent(provincia, evento);

  // 2. SCHEMA.ORG DEEP-DATA & CONEXIÓN DE AUTORIDAD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": seoData.serviceType,
    "name": seoData.title,
    "description": seoData.description,
    "provider": {
      "@type": "Person",
      "name": EdwinProfile.name,
      "url": "https://productoraear.com/artistas/edwin-agudelo",
      "sameAs": [
        "https://www.instagram.com/edwinagudelomariachi",
        "https://www.youtube.com/@EdwinAgudelo"
      ] // E-E-A-T S-Class Auth
    },
    "areaServed": {
      "@type": "City",
      "name": seoData.provCapitalized
    },
    "url": `https://productoraear.com/servicios/mariachis/${provincia}/${evento}`,
    "telephone": "+34693693048",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "156"
    },
    "review": {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "author": {
        "@type": "Organization",
        "name": "EAR OS Verified"
      }
    }
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
        "name": `¿Edwin Agudelo ofrece servicio en ${seoData.provCapitalized}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Sí, Edwin Agudelo ofrece servicio integral en ${seoData.provCapitalized} con disponibilidad verificada a través de EAR OS.`
        }
      }
    ]
  };

  return (
    <main className="min-h-screen bg-black text-white py-12 px-4 md:px-8">
      {/* Inyección de JSON-LD estructurado para Google y Perplexity (Astra AI) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          {/* H1 Dinámico (Intención de Búsqueda) */}
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
            Mariachi Profesional para {seoData.eventClean} en {seoData.provCapitalized} - Reserva Directa
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-semibold">
            {seoData.description}
          </p>
          {/* Banner de Intención Urgente */}
          <div className="inline-block mt-4 px-6 py-2 bg-red-600 text-white font-bold rounded-full animate-pulse border border-red-400 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            🔥 Disponibilidad verificada en {seoData.provCapitalized}. Llama ahora: +34 693 693 048
          </div>
        </header>

        {/* 3. CONVERSIÓN CUALIFICADA (WIDGET UBER justo bajo el H1) */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            {/* Elemento de diseño para S-Class */}
            <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 text-gray-300">
              <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">
                Presupuesto y Pre-Contrato
              </h2>
              <p>
                Aprovecha la disponibilidad de <strong>{EdwinProfile.name}</strong>. 
                Con nuestro sistema S-Class, sabrás el precio final al instante sin intermediarios y con garantías legales de contratación.
              </p>
              <ul className="space-y-3 font-medium">
                <li className="flex items-center gap-2 text-green-400">✓ Emisión de Pre-Contrato Automático</li>
                <li className="flex items-center gap-2 text-green-400">✓ Pago fraccionado con Klarna disponible</li>
                <li className="flex items-center gap-2 text-green-400">✓ Incluye Rider Técnico certificado</li>
              </ul>
            </div>
            <div className="relative z-20">
              <BookingCalculator />
            </div>
          </div>
        </section>

        <section className="mt-12 space-y-6 border-t border-white/10 pt-8">
          <h2 className="text-2xl font-bold">Preguntas Frecuentes ({seoData.provCapitalized})</h2>
          <div className="space-y-4">
            <div className="bg-black/40 p-6 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
              <h3 className="font-bold text-lg mb-2 text-green-400">¿Cuánto cuesta un mariachi en {seoData.provCapitalized} para {seoData.eventClean}?</h3>
              <p className="text-gray-400">El precio base comienza desde 350€ para el formato premium, pero puedes calcular tu tarifa exacta incluyendo desplazamientos usando nuestra calculadora superior.</p>
            </div>
            <div className="bg-black/40 p-6 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
              <h3 className="font-bold text-lg mb-2 text-green-400">¿Edwin Agudelo ofrece servicio en {seoData.provCapitalized}?</h3>
              <p className="text-gray-400">Sí, Edwin Agudelo ofrece servicio integral en {seoData.provCapitalized} con disponibilidad verificada a través de la infraestructura EAR OS.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
