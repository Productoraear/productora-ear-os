// Configuración mejorada para extraer datos de bodas.net
module.exports = {
  // Extrae ID del proveedor
  extractProviderId: (filename) => {
    // Intentar sacar del nombre del archivo primero
    const match = filename.match(/--e(\d+)/);
    if (match) return match[1];
    return filename.replace('.html', '').replace('.htm', '');
  },
  
  // Extrae nombre
  extractName: ($) => {
    // Selector específico del título en la cabecera
    const name = $('.storefrontHeading__title').text().trim();
    if (name) return name;
    
    // Fallback al título de la página
    const title = $('title').text();
    return title.split(' - ')[0].trim();
  },
  
  // Extrae categoría
  extractCategory: ($) => {
    // 1. Intentar desde el input de búsqueda (suele tener la categoría correcta)
    const searchInputVal = $('.storefrontFullSearcher__category input[name="txtStrSearch"]').val();
    if (searchInputVal) return module.exports.normalizeCategory(searchInputVal);

    // 2. Intentar desde breadcrumbs
    const breadcrumb = $('.breadcrumb__list li:nth-child(2) a').text().trim();
    if (breadcrumb) return module.exports.normalizeCategory(breadcrumb);

    // 3. Fallback a la URL canonical
    const canonical = $('link[rel="canonical"]').attr('href');
    if (canonical) {
      const match = canonical.match(/bodas\.net\/([^\/]+)\//);
      if (match) return module.exports.normalizeCategory(match[1]);
    }
    
    return 'Otros';
  },
  
  // Extrae ubicación
  extractLocation: ($) => {
    // Selector específico de ubicación en la cabecera
    const location = $('.storefrontHeadingLocation__label').text().trim();
    if (location) return location;

    // Fallback a meta tags
    const keywords = $('meta[name="keywords"]').attr('content') || '';
    const parts = keywords.split(',');
    // Buscar algo que parezca una ubicación (generalmente al final)
    return parts.length > 1 ? parts[parts.length - 1].trim() : null;
  },
  
  // Extrae descripción
  extractDescription: ($) => {
    // Contenido principal de la descripción
    const desc = $('.storefrontDescription__content').first().text().trim();
    if (desc) return desc;
    
    return $('meta[name="description"]').attr('content');
  },
  
  // Normaliza categorías
  normalizeCategory: (rawCategory) => {
    if (!rawCategory) return 'Otros';
    
    const categoryMap = {
      'wedding-planner': 'Wedding Planner',
      'wedding-planners': 'Wedding Planner',
      'organizacion-bodas': 'Wedding Planner',
      'fotografos': 'Fotógrafo',
      'fotografo': 'Fotógrafo',
      'video': 'Videógrafo',
      'catering': 'Catering',
      'fincas': 'Finca',
      'banquetes': 'Banquete',
      'floristerias': 'Florista',
      'floristeria': 'Florista',
      'musica': 'Música',
      'dj': 'DJ',
      'vestidos-novia': 'Vestidos de Novia',
      'trajes-novio': 'Trajes de Novio',
      'invitaciones': 'Invitaciones',
      'invitaciones-de-boda': 'Invitaciones',
      'decoracion': 'Decoración',
      'decoracion-para-bodas': 'Decoración',
      'pasteleria': 'Pastelería',
      'tartas-de-boda': 'Pastelería',
      'joyerias': 'Joyería',
      'belleza-novias': 'Belleza',
      'coches-de-boda': 'Transporte',
      'autobuses': 'Transporte',
      'animacion': 'Animación',
      'viaje-de-novios': 'Luna de Miel'
    };
    
    const normalized = rawCategory.toLowerCase().trim();
    // Buscar coincidencia exacta o parcial
    for (const [key, value] of Object.entries(categoryMap)) {
      if (normalized.includes(key)) return value;
    }
    
    // Capitalizar si no se encuentra
    return rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1);
  },
  
  // Extrae teléfono (generalmente oculto o en botón)
  extractPhone: ($) => {
    // A veces está en un botón con 'tel:'
    const telLink = $('a[href^="tel:"]').attr('href');
    if (telLink) return telLink.replace('tel:', '').trim();
    return null;
  },
  
  // Extrae email
  extractEmail: ($) => {
    const emailLink = $('a[href^="mailto:"]').attr('href');
    if (emailLink) return emailLink.replace('mailto:', '').trim();
    return null;
  },
  
  // Extrae web
  extractWebsite: ($) => {
    // Buscar enlaces externos que no sean redes sociales comunes
    let website = null;
    $('a[target="_blank"]').each((i, el) => {
      const href = $(el).attr('href');
      if (href && !href.includes('facebook') && !href.includes('instagram') && !href.includes('twitter') && !href.includes('bodas.net')) {
        website = href;
        return false; // break
      }
    });
    return website;
  },
  
  // Extrae imágenes
  extractImages: ($) => {
    const images = [];
    // Selector para la galería principal
    $('.storefrontMultiGallery__item img').each((i, el) => {
      // Preferir data-src o src, buscando la versión de mayor resolución si es posible
      let src = $(el).attr('src') || $(el).attr('data-src');
      
      // A veces viene en srcset, intentamos coger la más grande
      const srcset = $(el).attr('srcset');
      if (srcset) {
        const parts = srcset.split(',');
        const lastPart = parts[parts.length - 1].trim(); // La última suele ser la más grande
        src = lastPart.split(' ')[0];
      }
      
      if (src && !src.includes('placeholder') && !src.includes('svg')) {
        images.push(src);
      }
    });
    
    return images.length > 0 ? [...new Set(images)] : null; // Eliminar duplicados
  },
  
  // Extrae rango de precios - LÓGICA MEJORADA
  extractPriceRange: ($) => {
    let min = null;
    let max = null;
    
    // 1. Buscar en la tarjeta de FAQs/Precios (Selector más fiable)
    // Ejemplo: "Precio desde 15€"
    const priceLabel = $('.storefrontHeadingFaqsCard__label').text().trim();
    if (priceLabel) {
      const match = priceLabel.match(/(\d+([.,]\d+)?)/);
      if (match) {
        min = parseFloat(match[1].replace(',', '.'));
      }
    }
    
    // 2. Si no se encuentra, buscar en el texto del cuerpo pero con contexto
    if (!min) {
      const menuText = $('.storefrontFaqs__item:contains("precio"), .storefrontFaqs__item:contains("Precio")').text();
      if (menuText) {
        const match = menuText.match(/(\d+([.,]\d+)?)\s*€/);
        if (match) {
          min = parseFloat(match[1].replace(',', '.'));
        }
      }
    }

    return { min, max };
  },
  
  // Extrae FAQs
  extractFaqs: ($) => {
    const faqs = [];
    $('.storefrontFaqs__item').each((i, el) => {
      const question = $(el).find('.storefrontFaqs__itemTitle').text().trim();
      const answer = $(el).find('.storefrontFaqs__itemContent').text().trim();
      if (question && answer) {
        faqs.push({ question, answer });
      }
    });
    return faqs.length > 0 ? faqs : null;
  }
};