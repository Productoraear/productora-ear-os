import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

const VAULT_DIR = 'H:/00_PRODUCTORA_EAR/EAR_ABSORBED_VAULT/vendors_html';
const HARVEST_FILE = 'src/data/bodas-vendors-harvested.json';
const NEW_ONLINE_FILE = 'scripts/nightcrawler_results/new_online_providers.json';
const ENRICHED_FILE = 'src/data/vendors-enriched-night.json';

function getSlugFromFilename(filename) {
    return filename.replace('.html', '');
}

function cleanText(str) {
    if (!str) return '';
    return str.replace(/\s+/g, ' ').trim();
}

function loadJSON(filepath) {
    try {
        if (fs.existsSync(filepath)) {
            const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
            if (data.providers) return data.providers; // Handle new_online_providers.json format
            return data;
        }
    } catch (e) {
        console.error(`Error loading ${filepath}: ${e.message}`);
    }
    return [];
}

async function main() {
    console.log('[START] Iniciando enriquecimiento nocturno con Cheerio...');
    
    // 1. Cargar proveedores existentes para hacer merge
    let baseProviders = loadJSON(HARVEST_FILE);
    let newProviders = loadJSON(NEW_ONLINE_FILE);
    
    // Crear un mapa por slug normalizado
    const providerMap = new Map();
    const normalizeSlug = (nameOrUrl) => {
        if (!nameOrUrl) return null;
        let s = nameOrUrl.split('/').pop().split('?')[0];
        if (s && s.includes('--')) return s;
        return nameOrUrl.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase().replace(/^-|-$/g, '');
    };

    const addProvidersToMap = (list) => {
        for (const p of list) {
            const slug = normalizeSlug(p.sourceUrl || p.url || p.name);
            if (slug && !providerMap.has(slug)) {
                providerMap.set(slug, { ...p, slug });
            }
        }
    };
    
    addProvidersToMap(baseProviders);
    addProvidersToMap(newProviders);
    
    if (!fs.existsSync(VAULT_DIR)) {
        console.error('[FATAL] Vault no existe:', VAULT_DIR);
        process.exit(1);
    }
    
    const htmlFiles = fs.readdirSync(VAULT_DIR).filter(f => f.endsWith('.html'));
    console.log(`[ENRICH] Encontrados ${htmlFiles.length} HTMLs descargados en el vault.`);
    
    let totalEnriched = 0;
    
    for (const filename of htmlFiles) {
        const slug = getSlugFromFilename(filename);
        const filepath = path.join(VAULT_DIR, filename);
        
        const html = fs.readFileSync(filepath, 'utf8');
        const $ = cheerio.load(html);
        
        let provider = providerMap.get(slug) || { slug, captured_at: new Date().toISOString() };
        
        // 1. Nombre comercial real
        const realName = $('h1').first().text().trim() || $('title').text().split('-')[0].trim();
        if (realName && !provider.name) provider.name = realName;
        
        // 2. Descripción larga
        const desc = $('#info, .storefront-about__text, .vendor-description').text();
        if (desc) provider.description_full = cleanText(desc);
        
        // 3. Servicios y 4. Precios
        const services = [];
        const prices = [];
        $('.storefront-faq__question, .faq-question').each((i, el) => {
            const q = cleanText($(el).text());
            const a = cleanText($(el).next('.storefront-faq__answer, .faq-answer').text());
            if (q.toLowerCase().includes('precio') || q.toLowerCase().includes('cuesta')) {
                prices.push(`${q}: ${a}`);
            } else {
                services.push(`${q}: ${a}`);
            }
        });
        if (!provider.services) provider.services = services;
        if (!provider.prices) provider.prices = prices;
        
        // 5. Teléfono / Email
        if (!provider.telephone) {
            const phoneLinks = $('a[href^="tel:"]').map((i, el) => $(el).attr('href').replace('tel:', '')).get();
            if (phoneLinks.length > 0) provider.telephone = cleanText(phoneLinks[0]);
            else {
                // regex estricto
                const phoneMatch = html.match(/(?:\+34|0034)?[ -]?[6789]\d{2}[ -]?\d{3}[ -]?\d{3}/);
                if (phoneMatch) provider.telephone = phoneMatch[0].replace(/[- ]/g, '');
            }
        }
        
        const emailLinks = $('a[href^="mailto:"]').map((i, el) => $(el).attr('href').replace('mailto:', '')).get();
        if (emailLinks.length > 0 && !provider.email) provider.email = cleanText(emailLinks[0]);
        
        // 6. Dirección completa
        const address = $('.storefront__address, .storefront-map__address, .address').text();
        if (address) provider.address = cleanText(address);
        
        // 7. URLs de imágenes y videos
        const images = new Set(provider.images || []);
        $('img').each((i, el) => {
            const src = $(el).attr('src') || $(el).attr('data-src');
            if (src && src.startsWith('http') && !src.includes('avatar') && !src.includes('icon')) {
                images.add(src);
            }
        });
        provider.images = Array.from(images);
        
        const videos = new Set(provider.videos || []);
        $('iframe, video').each((i, el) => {
            let src = $(el).attr('src') || $(el).attr('data-src');
            if (src && (src.includes('youtube.com') || src.includes('vimeo.com') || src.endsWith('.mp4'))) {
                // Si es un iframe de youtube sin http, añadirlo
                if (src.startsWith('//')) src = 'https:' + src;
                videos.add(src);
            }
        });
        if (videos.size > 0) provider.videos = Array.from(videos);
        
        // 8. Enlaces a redes sociales
        const socials = provider.social_links || {};
        $('a[href*="instagram.com"], a[href*="facebook.com"], a[href*="tiktok.com"], a[href*="youtube.com"]').each((i, el) => {
            const href = $(el).attr('href');
            if (href.includes('instagram.com')) socials.instagram = href;
            if (href.includes('facebook.com')) socials.facebook = href;
            if (href.includes('tiktok.com')) socials.tiktok = href;
            if (href.includes('youtube.com')) socials.youtube = href;
        });
        if (Object.keys(socials).length > 0) provider.social_links = socials;

        // Evitar artículos que no son proveedores (Títulos como 'La ceremonia de boda')
        if (realName && (realName.toLowerCase().includes('la ceremonia de boda') || 
                         realName.toLowerCase().includes('protocolo para bodas') ||
                         realName.toLowerCase().includes('13 mejores lecturas') ||
                         realName.toLowerCase().includes('bodas de invierno a un precio increible') ||
                         realName.toLowerCase().includes('grupo ceremonia nupcial'))) {
            return; // Skip este provider porque es un artículo del blog
        }
        
        // 9. Reseñas / testimonios
        const reviews = [];
        $('.review__text, .storefront-reviews__text').each((i, el) => {
            reviews.push(cleanText($(el).text()));
        });
        provider.reviews = reviews.slice(0, 5); // Max 5
        
        // 10. Especialidades
        const specialties = new Set(provider.specialties || []);
        $('.storefront-about__tags .tag, .specialty-tag').each((i, el) => {
            specialties.add(cleanText($(el).text()));
        });
        if (specialties.size > 0) provider.specialties = Array.from(specialties);
        
        providerMap.set(slug, provider);
        totalEnriched++;
    }
    
    console.log(`[DONE] ${totalEnriched} HTMLs procesados y enriquecidos.`);
    
    // Guardar resultados
    const allProviders = Array.from(providerMap.values());
    fs.writeFileSync(ENRICHED_FILE, JSON.stringify(allProviders, null, 2), 'utf8');
    
    console.log(`[SAVE] Guardados ${allProviders.length} proveedores en ${ENRICHED_FILE}.`);
}

main().catch(console.error);
