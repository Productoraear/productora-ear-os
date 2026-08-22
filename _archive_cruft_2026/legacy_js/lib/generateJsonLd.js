import { seoMatrix } from '@/config/seo-matrix';
export function generateJsonLd(provincia, evento, artistName = "Edwin Agudelo") {
    const provCapitalized = provincia.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const eventClean = evento.replace(/-/g, ' ');
    const provKey = provincia.toLowerCase();
    // Estructura base S-Class
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": `Mariachis para ${eventClean} en ${provCapitalized} | ${artistName}`,
        "description": `Contratación de Mariachis profesionales para ${eventClean} en ${provCapitalized}. Servicio verificado S-Class con Edwin Agudelo.`,
        "url": `${process.env.NEXT_PUBLIC_BASE_URL}/servicios/mariachis/${provincia}/${evento}`,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": provCapitalized,
            "addressCountry": "ES"
        },
        "areaServed": {
            "@type": "AdministrativeArea",
            "name": provCapitalized
        },
        // Autoridad del Artista (AI-SEO)
        "knowsAbout": [
            "Música Folclórica Mexicana",
            "Entretenimiento Profesional en España",
            "Serenatas y Eventos Sociales"
        ],
        "image": `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?provincia=${provincia}&evento=${evento}`
    };
    // Inyección de Landmarks (Dominancia Local)
    if (seoMatrix[provKey]?.landmarks) {
        const landmarks = seoMatrix[provKey].landmarks;
        jsonLd["hasMap"] = `https://www.google.com/maps/search/?api=1&query=${landmarks.join('+OR+')}`;
        jsonLd["description"] += ` Servicio disponible en toda el área de ${provCapitalized}, desde ${landmarks[0]} hasta ${landmarks[1]}.`;
    }
    return jsonLd;
}
