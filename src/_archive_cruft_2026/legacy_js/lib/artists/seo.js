export function generateArtistSEOMeta(eventType, location, artistName = 'Edwin Agudelo') {
    const eventClean = eventType.charAt(0).toUpperCase() + eventType.slice(1);
    const locClean = location.charAt(0).toUpperCase() + location.slice(1);
    const title = `Mariachis para ${eventClean} en ${locClean} | Contratar ${artistName} Oficial`;
    const description = `Contrata la excelencia sónica de ${artistName} para tu ${eventType} en ${location}. Espectáculo premium Aura Onyx, repertorio tradicional mexicano personalizado y sonido impecable.`;
    const keywords = [
        `mariachi para ${eventType} en ${location}`,
        `contratar mariachi ${location}`,
        `mariachis profesionales ${location}`,
        `${artistName} ${location}`,
        `mariachi ${eventType} de lujo`,
        `precio mariachis ${location}`
    ];
    const canonical = `https://productoraear.com/artistas/${eventType.toLowerCase()}/${location.toLowerCase()}`;
    return { title, description, keywords, canonical };
}
export function generateEventSchema(eventType, location, artistName = 'Edwin Agudelo') {
    return {
        '@context': 'https://schema.org',
        '@type': 'Event',
        'name': `Espectáculo de Mariachi para ${eventType} en ${location}`,
        'startDate': new Date().toISOString().split('T')[0],
        'location': {
            '@type': 'Place',
            'name': `Zonas de actuación en ${location}`,
            'address': {
                '@type': 'PostalAddress',
                'addressLocality': location,
                'addressCountry': 'ES'
            }
        },
        'performer': {
            '@type': 'PerformingGroup',
            'name': artistName,
            'url': 'https://productoraear.com/artistas/edwin-agudelo'
        },
        'offers': {
            '@type': 'AggregateOffer',
            'priceCurrency': 'EUR',
            'lowPrice': '350',
            'highPrice': '2500',
            'offerCount': '3'
        }
    };
}
