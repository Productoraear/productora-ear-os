import { seoMatrix } from '@/config/seo-matrix';

export function generateJsonLd(provincia: string, evento: string, artistName: string = "Edwin Agudelo") {
  const provCapitalized = provincia.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const eventClean = evento.replace(/-/g, ' ');
  const provKey = provincia.toLowerCase();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.productoraear.com';
  const canonicalUrl = `${baseUrl}/servicios/mariachis/${provincia}/${evento}`;

  // Estructura base S-Class
  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${canonicalUrl}#service`,
    "name": `Mariachis para ${eventClean} en ${provCapitalized} | ${artistName}`,
    "description": `Contratación de Mariachis profesionales para ${eventClean} en ${provCapitalized}. Servicio verificado S-Class con Edwin Agudelo.`,
    "url": canonicalUrl,
    "telephone": "+34 693 693 048",
    "email": "hola@productoraear.com",
    "priceRange": "0.50€ - 3.500€",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": provCapitalized,
      "addressCountry": "ES"
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": provCapitalized
    },
    "knowsAbout": [
      "Música Folclórica Mexicana",
      "Entretenimiento Profesional en España",
      "Serenatas y Eventos Sociales",
      "Edwin Agudelo Mariachi de Gala"
    ],
    "image": `${baseUrl}/og-image-vimume.jpg`,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "48",
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": {
      "@type": "Offer",
      "url": canonicalUrl,
      "priceCurrency": "EUR",
      "price": "0.50",
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock",
      "description": "Garantía de Depósito Instantánea para bloqueo de fecha con Price-Lock 72h vía Stripe Live."
    }
  };

  // Inyección de Landmarks (Dominancia Local)
  if (seoMatrix[provKey as keyof typeof seoMatrix]?.landmarks) {
    const landmarks = seoMatrix[provKey as keyof typeof seoMatrix].landmarks;
    jsonLd["hasMap"] = `https://www.google.com/maps/search/?api=1&query=${landmarks.join('+OR+')}`;
    jsonLd["description"] += ` Servicio disponible en toda el área de ${provCapitalized}, desde ${landmarks[0]} hasta ${landmarks[1]}.`;
  }

  return jsonLd;
}