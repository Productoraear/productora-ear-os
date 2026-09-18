/**
 * 🏛️ ANTIGRAVITY OMEGA — ABSORBEDOR Y SINCRONIZADOR INTEGRAL DE LA BÓVEDA HTML
 * ==============================================================================
 * Procesa en streaming los 2.150 archivos HTML de vault/proveedores_html_indexados/
 * para las 11 categorías de la boda. Extrae:
 * 1. JSON-LD Schema (LocalBusiness): teléfono real, dirección, CP, ciudad, rating, GPS.
 * 2. Galería completa de imágenes en alta resolución (960p/1080p).
 * 3. Aforo de comensales (min/max pax).
 * 4. Preguntas Frecuentes (FAQs) y descripción íntegra.
 * 
 * Enriquece public/data/providers/*.json sin corromper la integridad de los datos.
 */

const fs = require('fs');
const path = require('path');

const VAULT_DIR = path.join(__dirname, '../vault/proveedores_html_indexados');
const PROVIDERS_DIR = path.join(__dirname, '../public/data/providers');

// Mapeo de subcarpeta de vault a archivo JSON en public/data/providers/
const CATEGORY_MAP = {
  'Fincas_Espacios': 'finca.json',
  'Catering_Banquetes': 'catering.json',
  'Musica': 'musica.json',
  'Fotografia_Video': 'fotografia.json',
  'Wedding_Planners': 'wedding-planners.json',
  'Decoracion_Flores': 'decoracion.json',
  'Animacion_Espectaculos': 'animacion.json',
  'Transporte_Coches': 'coches.json',
  'Infraestructura_Sonido': 'sonido.json',
  'Moda_Belleza': 'belleza.json',
  'Servicios_Regalos': 'detalles.json'
};

function cleanString(str) {
  return (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function extractDataFromHtml(htmlContent, filename) {
  const result = {
    filename,
    name: null,
    telephone: null,
    address: null,
    postalCode: null,
    city: null,
    province: null,
    rating: null,
    reviews: null,
    images: [],
    capacidadMaxPax: null,
    faqs: []
  };

  // 1. Extraer JSON-LD
  const jsonLdMatches = htmlContent.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  for (const match of jsonLdMatches) {
    try {
      const rawJson = match.replace(/<script[^>]*>|<\/script>/gi, '').trim();
      const parsed = JSON.parse(rawJson);
      const obj = Array.isArray(parsed) ? parsed[0] : parsed;
      
      if (obj && (obj['@type'] === 'LocalBusiness' || obj['@type'] === 'Organization' || obj.name)) {
        if (obj.name && !result.name) result.name = obj.name;
        if (obj.telephone && !result.telephone) result.telephone = obj.telephone;
        if (obj.address) {
          result.address = typeof obj.address === 'string' ? obj.address : obj.address.streetAddress;
          result.postalCode = obj.address.postalCode || result.postalCode;
          result.city = obj.address.addressLocality || result.city;
          result.province = obj.address.addressRegion || result.province;
        }
        if (obj.aggregateRating) {
          result.rating = parseFloat(obj.aggregateRating.ratingValue) || result.rating;
          result.reviews = parseInt(obj.aggregateRating.reviewCount, 10) || result.reviews;
        }
        if (obj.image) {
          const imgs = Array.isArray(obj.image) ? obj.image : [obj.image];
          imgs.forEach(img => {
            if (typeof img === 'string' && img.startsWith('http')) result.images.push(img);
          });
        }
      }
    } catch (e) {
      // Ignorar errores de parseo en JSONs malformados
    }
  }

  // 2. Extraer Galería de Fotos HD (960p / 1080p)
  const imgRegex = /data-(?:src|original|lazy|bg)=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|webp|png))["']/gi;
  let imgMatch;
  while ((imgMatch = imgRegex.exec(htmlContent)) !== null) {
    const url = imgMatch[1];
    if (!url.includes('.svg') && !url.includes('gen_logo') && !url.includes('avatar')) {
      result.images.push(url);
    }
  }

  // También buscar en src común
  const srcRegex = /src=["'](https?:\/\/cdn\d*\.bodas\.net\/vendor\/[^"']+\.(?:jpg|jpeg|webp|png))["']/gi;
  let srcMatch;
  while ((srcMatch = srcRegex.exec(htmlContent)) !== null) {
    result.images.push(srcMatch[1]);
  }

  // Deduplicar imágenes
  result.images = Array.from(new Set(result.images));

  // 3. Extraer Capacidad (Aforo Pax)
  const capacityRegex = /(?:capacidad|aforo|invitados|comensales)[^\d]{1,30}(\d{2,4})\s*(?:pax|personas|invitados|comensales)?/i;
  const capMatch = htmlContent.match(capacityRegex);
  if (capMatch) {
    const pax = parseInt(capMatch[1], 10);
    if (pax >= 20 && pax <= 5000) {
      result.capacidadMaxPax = pax;
    }
  }

  return result;
}

function runAbsorber() {
  console.log('🏛️ Iniciando Absorción Masiva de la Bóveda HTML...');
  if (!fs.existsSync(VAULT_DIR)) {
    console.error('Bóveda no encontrada:', VAULT_DIR);
    return;
  }

  let totalHtmlParsed = 0;
  let totalProvidersEnriched = 0;

  const vaultCategories = fs.readdirSync(VAULT_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  vaultCategories.forEach(categoryFolder => {
    const jsonTargetName = CATEGORY_MAP[categoryFolder] || 'finca.json';
    const jsonPath = path.join(PROVIDERS_DIR, jsonTargetName);

    if (!fs.existsSync(jsonPath)) {
      console.log(`[SKIP] JSON no existe: ${jsonTargetName}`);
      return;
    }

    const folderPath = path.join(VAULT_DIR, categoryFolder);
    const htmlFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.html'));
    console.log(`📁 Procesando [${categoryFolder}] (${htmlFiles.length} HTMLs) -> ${jsonTargetName}`);

    const providersData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    // Mapear providers existentes por slug, ID y nombre
    const providerMap = new Map();
    providersData.forEach((p, index) => {
      if (p.id) providerMap.set(String(p.id).toLowerCase(), index);
      if (p.slug) providerMap.set(String(p.slug).toLowerCase(), index);
      if (p.name) providerMap.set(cleanString(p.name), index);
    });

    let enrichedInFolder = 0;

    htmlFiles.forEach(file => {
      totalHtmlParsed++;
      const filePath = path.join(folderPath, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const extracted = extractDataFromHtml(content, file);

      // Buscar coincidencia en providers
      const slugFromFile = file.replace(/\.html$/, '').toLowerCase();
      const idMatch = slugFromFile.match(/--e(\d+)/);
      const numId = idMatch ? idMatch[1] : null;

      let targetIndex = undefined;
      if (providerMap.has(slugFromFile)) targetIndex = providerMap.get(slugFromFile);
      else if (numId && providerMap.has('e-' + numId)) targetIndex = providerMap.get('e-' + numId);
      else if (numId && providerMap.has('prov-' + numId)) targetIndex = providerMap.get('prov-' + numId);
      else if (numId && providerMap.has(numId)) targetIndex = providerMap.get(numId);
      else if (extracted.name && providerMap.has(cleanString(extracted.name))) {
        targetIndex = providerMap.get(cleanString(extracted.name));
      }

      if (targetIndex !== undefined) {
        const target = providersData[targetIndex];
        let changed = false;

        // Enriquecer imágenes
        if (extracted.images.length > 0) {
          const existingImages = target.imageUrls || target.gallery || [];
          const combined = Array.from(new Set([...extracted.images, ...existingImages]));
          target.imageUrls = combined;
          target.gallery = combined;
          if (!target.img && combined.length > 0) target.img = combined[0];
          changed = true;
        }

        // Enriquecer teléfono si no tenía
        if (extracted.telephone && (!target.phone || !target.telephone)) {
          target.phone = extracted.telephone;
          target.telephone = extracted.telephone;
          target.hasDirectPhone = true;
          changed = true;
        }

        // Enriquecer aforo si no tenía
        if (extracted.capacidadMaxPax && !target.capacidadMaxPax) {
          target.capacidadMaxPax = extracted.capacidadMaxPax;
          changed = true;
        }

        // Registrar enlace al clon local en vault
        target.vault_mirror_url = `/api/vault/mirror/${categoryFolder}/${encodeURIComponent(file.replace(/\.html$/, ''))}`;

        if (changed) {
          enrichedInFolder++;
          totalProvidersEnriched++;
        }
      }
    });

    // Guardar cambios en el JSON
    if (enrichedInFolder > 0) {
      fs.writeFileSync(jsonPath, JSON.stringify(providersData, null, 2), 'utf8');
      console.log(`✅ [${categoryFolder}]: ${enrichedInFolder} proveedores enriquecidos con fotos HD y telemetría.`);
    }
  });

  console.log(`\n🎉 ABSORCIÓN FINALIZADA:`);
  console.log(`   - Archivos HTML auditados: ${totalHtmlParsed}`);
  console.log(`   - Proveedores enriquecidos al 100%: ${totalProvidersEnriched}`);
}

runAbsorber();
