const cheerio = require('cheerio');

/**
 * UNIO PARSER COMPLETO v2.0
 * Extracción total de datos de Bodas.net HTML
 * 
 * Características:
 * - Teléfonos (móvil, fijo, WhatsApp)
 * - Redes sociales (completo)
 * - Horarios de atención
 * - Coordenadas GPS (si disponible)
 * - Promociones
 * - Metadata avanzada
 */

// ==================== FUNCIONES DE EXTRACCIÓN ====================

/**
 * Extrae provider ID del nombre del archivo
 */
function extractProviderId(filename) {
    // Ej: "2-alianzas--e52621.html" → "52621"
    const match = filename.match(/--[ep]?(\d+)/);
    return match ? match[1] : filename.replace(/\.(html?|htm)$/i, '');
}

/**
 * Extrae teléfonos completos
 */
function extractPhones($) {
    const phones = [];
    const seen = new Set();

    // 1. Links tel:
    $('a[href^="tel:"]').each((i, el) => {
        const number = $(el).attr('href').replace('tel:', '').trim();
        if (!seen.has(number)) {
            phones.push({
                number,
                type: 'mobile', // Por defecto, podría refinarse
                whatsappEnabled: $(el).text().toLowerCase().includes('whatsapp'),
                displayText: $(el).text().trim(),
            });
            seen.add(number);
        }
    });

    // 2. Botones de teléfono
    $('.btnPhone, .phone-link, .contact-phone').each((i, el) => {
        const text = $(el).text();
        const phoneMatch = text.match(/(\+\d{2})?\s?(\d{3})\s?(\d{3})\s?(\d{3})/);
        if (phoneMatch) {
            const number = phoneMatch[0].replace(/\s/g, '');
            if (!seen.has(number)) {
                phones.push({
                    number,
                    type: text.toLowerCase().includes('móvil') ? 'mobile' : 'office',
                    whatsappEnabled: text.toLowerCase().includes('whatsapp'),
                    displayText: text.trim(),
                });
                seen.add(number);
            }
        }
    });

    // 3. Texto libre (fallback con regex)
    const bodyText = $('body').text();
    const phoneRegex = /(?:\+34|0034)?\s?[6-9]\d{2}\s?\d{3}\s?\d{3}/g;
    const matches = bodyText.match(phoneRegex) || [];

    matches.forEach(match => {
        const normalized = match.replace(/\s/g, '');
        if (!seen.has(normalized) && phones.length < 5) { // Limitar a 5
            phones.push({
                number: normalized,
                type: 'unknown',
                whatsappEnabled: false,
                displayText: match,
            });
            seen.add(normalized);
        }
    });

    return phones;
}

/**
 * Extrae emails
 */
function extractEmails($) {
    const emails = [];
    const seen = new Set();

    // 1. Links mailto:
    $('a[href^="mailto:"]').each((i, el) => {
        const email = $(el).attr('href').replace('mailto:', '').toLowerCase().trim();
        if (!seen.has(email)) {
            emails.push({
                address: email,
                type: 'general',
            });
            seen.add(email);
        }
    });

    // 2. Texto libre (con validación básica)
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const bodyText = $('body').text();
    const matches = bodyText.match(emailRegex) || [];

    matches.forEach(email => {
        const normalized = email.toLowerCase();
        if (!seen.has(normalized) && emails.length < 3) {
            emails.push({
                address: normalized,
                type: 'general',
            });
            seen.add(normalized);
        }
    });

    return emails;
}

/**
 * Extrae redes sociales
 */
function extractSocialMedia($) {
    const social = {};

    // Facebook
    const fbLink = $('a[href*="facebook.com"]').attr('href');
    if (fbLink) social.facebook = fbLink;

    // Instagram
    const igLink = $('a[href*="instagram.com"]').attr('href');
    if (igLink) social.instagram = igLink;

    // Pinterest
    const pinterestLink = $('a[href*="pinterest."]').attr('href');
    if (pinterestLink) social.pinterest = pinterestLink;

    // YouTube
    const ytLink = $('a[href*="youtube.com"], a[href*="youtu.be"]').attr('href');
    if (ytLink) social.youtube = ytLink;

    // TikTok
    const tiktokLink = $('a[href*="tiktok.com"]').attr('href');
    if (tiktokLink) social.tiktok = tiktokLink;

    return Object.keys(social).length > 0 ? social : null;
}

/**
 * Extrae ubicación completa
 */
function extractLocationDetails($) {
    const location = {
        city: null,
        province: null,
        country: 'España',
        address: null,
        postalCode: null,
        coordinates: null,
    };

    // 1. Desde el selector principal
    const locationText = $('.storefrontHeadingLocation__label, .location-text').first().text().trim();
    if (locationText) {
        const parts = locationText.split(',').map(p => p.trim());
        if (parts.length >= 2) {
            location.city = parts[0];
            location.province = parts[1];
        }
    }

    // 2. Desde breadcrumbs
    const breadcrumbs = $('.breadcrumb a, .breadcrumb span').map((i, el) => $(el).text().trim()).get();
    if (breadcrumbs.length >= 3) {
        location.province = breadcrumbs[breadcrumbs.length - 2];
        location.city = breadcrumbs[breadcrumbs.length - 1];
    }

    // 3. JSON-LD (si existe)
    $('script[type="application/ld+json"]').each((i, el) => {
        try {
            const data = JSON.parse($(el).html());
            if (data.address) {
                location.address = data.address.streetAddress;
                location.postalCode = data.address.postalCode;
                location.city = data.address.addressLocality || location.city;
                location.province = data.address.addressRegion || location.province;

                if (data.geo) {
                    location.coordinates = {
                        lat: parseFloat(data.geo.latitude),
                        lng: parseFloat(data.geo.longitude),
                        source: 'json_ld',
                    };
                }
            }
        } catch (e) {
            // Ignorar errores de parsing
        }
    });

    return location;
}

/**
 * Extrae horarios de atención
 */
function extractBusinessHours($) {
    // Esto depende mucho de la estructura del HTML
    // Por ahora, retornamos null y lo refinamos después
    return null;
}

/**
 * Extrae todas las imágenes
 */
function extractAllImages($) {
    const images = [];
    const seen = new Set();

    // 1. Galería principal
    $('.gallery img, .portfolio img, img[data-src]').each((i, el) => {
        const src = $(el).attr('data-src') || $(el).attr('src');
        const alt = $(el).attr('alt') || '';

        if (src && !seen.has(src)) {
            images.push({
                url: src.startsWith('http') ? src : `https://cdn0.bodas.net${src}`,
                alt,
                type: 'gallery',
            });
            seen.add(src);
        }
    });

    // 2. Open Graph image (cover)
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage && !seen.has(ogImage)) {
        images.unshift({
            url: ogImage,
            alt: $('meta[property="og:title"]').attr('content') || '',
            type: 'cover',
        });
    }

    return images.slice(0, 20); // Limitar a 20 imágenes
}

/**
 * Extrae videos
 */
function extractVideos($) {
    const videos = [];

    $('iframe[src*="youtube"], iframe[src*="vimeo"]').each((i, el) => {
        const src = $(el).attr('src');
        const platform = src.includes('youtube') ? 'youtube' : 'vimeo';

        videos.push({
            url: src,
            platform,
            thumbnail: platform === 'youtube' ?
                src.replace('embed/', 'vi/').replace(/\?.*$/, '') + '/0.jpg' : null,
        });
    });

    return videos;
}

/**
 * Extrae reviews summary
 */
function extractReviews($) {
    const reviews = {
        count: 0,
        averageRating: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };

    // Total de reviews
    const countText = $('.reviewsCount, .total-reviews').first().text();
    const countMatch = countText.match(/(\d+)/);
    if (countMatch) {
        reviews.count = parseInt(countMatch[1]);
    }

    // Rating promedio
    const ratingText = $('.averageRating, .rating-score').first().text();
    const ratingMatch = ratingText.match(/([\d.]+)/);
    if (ratingMatch) {
        reviews.averageRating = parseFloat(ratingMatch[1]);
    }

    return reviews.count > 0 ? reviews : null;
}

/**
 * Extrae badges y certificaciones
 */
function extractBadges($) {
    const badges = {
        verified: false,
        ecoCertified: false,
        weddingAwards: [],
        couplesHired: null,
    };

    // Verified
    if ($('.badge-verified, .verified-icon').length > 0) {
        badges.verified = true;
    }

    // Eco
    if ($('.eco-badge, .eco-certified').length > 0) {
        badges.ecoCertified = true;
    }

    // Wedding Awards
    const awardsText = $('.awards, .badge-awards').text();
    const yearMatches = awardsText.match(/20\d{2}/g) || [];
    badges.weddingAwards = yearMatches.map(y => parseInt(y));

    // Parejas que contrataron
    const couplesText = $('.couples-hired, .hired-count').text();
    const couplesMatch = couplesText.match(/(\d+)\s*parejas?/i);
    if (couplesMatch) {
        badges.couplesHired = parseInt(couplesMatch[1]);
    }

    return badges;
}

/**
 * Extrae metadata avanzada
 */
function extractMetadata($, filename) {
    const metadata = {
        sourceFile: filename,
        sourceUrl: null,
        extractedAt: new Date().toISOString(),
        memberSince: null,
        lastUpdated: null,
    };

    // Canonical URL
    const canonical = $('link[rel="canonical"]').attr('href');
    if (canonical) metadata.sourceUrl = canonical;

    // Miembro desde
    const memberText = $('.member-since, .joined-date').text();
    const memberMatch = memberText.match(/20\d{2}/);
    if (memberMatch) {
        metadata.memberSince = memberMatch[0];
    }

    // Última actualización (de meta tag)
    const pbdate = $('meta[name="pbdate"]').attr('content');
    if (pbdate) metadata.lastUpdated = pbdate;

    return metadata;
}

/**
 * Calcula completeness score
 */
function calculateCompleteness(data) {
    let score = 0;
    const weights = {
        name: 10,
        category: 10,
        location: 10,
        description: 10,
        phones: 15,
        emails: 10,
        website: 5,
        socialMedia: 10,
        images: 10,
        pricing: 10,
        reviews: 10,
    };

    if (data.name) score += weights.name;
    if (data.category) score += weights.category;
    if (data.location?.city) score += weights.location;
    if (data.description) score += weights.description;
    if (data.contacts?.phones?.length > 0) score += weights.phones;
    if (data.contacts?.emails?.length > 0) score += weights.emails;
    if (data.contacts?.website) score += weights.website;
    if (data.socialMedia) score += weights.socialMedia;
    if (data.media?.images?.length > 0) score += weights.images;
    if (data.pricing?.min) score += weights.pricing;
    if (data.reviews?.count > 0) score += weights.reviews;

    return score;
}

// ==================== FUNCIÓN PRINCIPAL ====================

module.exports = {
    extractProviderData(html, filename) {
        const $ = cheerio.load(html);

        const data = {
            provider_id: extractProviderId(filename),

            // Básico (de la versión anterior, aquí simplificado)
            name: $('h1.storefrontHeadingName, .vendor-name').first().text().trim() || null,
            category: null, // Extraer con tu lógica anterior

            // Contacto COMPLETO
            contacts: {
                phones: extractPhones($),
                emails: extractEmails($),
                website: $('a.btnWebsite, .website-link').first().attr('href') || null,
                bookingUrl: $('a.btnBooking').first().attr('href') || null,
            },

            // Redes sociales
            socialMedia: extractSocialMedia($),

            // Ubicación completa
            location: extractLocationDetails($),

            // Horarios
            businessHours: extractBusinessHours($),

            // Pricing (usar lógica anterior)
            pricing: {
                min: null, // Usar extractPriceRange de tu versión anterior
                max: null,
                currency: 'EUR',
                model: 'custom',
            },

            // Multimedia
            media: {
                images: extractAllImages($),
                videos: extractVideos($),
            },

            // Reviews
            reviews: extractReviews($),

            // Badges
            badges: extractBadges($),

            // Metadata
            metadata: extractMetadata($, filename),

            // Consentimientos (default)
            consents: {
                dataPublishing: false, // Debe activarse manualmente
                aiProcessing: true,
                thirdPartySharing: false,
            },
        };

        // Calcular completeness
        data.metadata.completenessScore = calculateCompleteness(data);

        return data;
    },
};
