import fs from 'fs';
import path from 'path';
// Memory caches to avoid reloading 116MB of files repeatedly
let fincasCache = null;
let legacyProvidersCache = null;
let arsenalEnrichedCache = null;
let arsenalCompletoCache = null;
let knowledgeGraphCache = null;
const BACKUPS_DIR = path.join(process.cwd(), 'data_vault', 'backups');
function readJsonFile(filename) {
    const filePath = path.join(BACKUPS_DIR, filename);
    try {
        if (!fs.existsSync(filePath)) {
            console.warn(`[BackupReader] File not found: ${filePath}`);
            return [];
        }
        const rawData = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(rawData);
    }
    catch (error) {
        console.error(`[BackupReader] Error reading ${filename}:`, error);
        return [];
    }
}
export const BackupReader = {
    /**
     * Load and cache all fincas
     */
    getFincas() {
        if (!fincasCache) {
            fincasCache = readJsonFile('fincas.json');
        }
        return fincasCache;
    },
    /**
     * Load and cache all legacy providers
     */
    getLegacyProviders() {
        if (!legacyProvidersCache) {
            legacyProvidersCache = readJsonFile('legacyproviders.json');
        }
        return legacyProvidersCache;
    },
    /**
     * Load and cache enriched arsenal profiles
     */
    getArsenalEnriched() {
        if (!arsenalEnrichedCache) {
            arsenalEnrichedCache = readJsonFile('arsenalenriched.json');
        }
        return arsenalEnrichedCache;
    },
    /**
     * Load and cache baseline arsenal list
     */
    getArsenalCompleto() {
        if (!arsenalCompletoCache) {
            arsenalCompletoCache = readJsonFile('arsenalcompleto.json');
        }
        return arsenalCompletoCache;
    },
    /**
     * Load and cache the full SEO knowledge graph
     */
    getKnowledgeGraph() {
        if (!knowledgeGraphCache) {
            knowledgeGraphCache = readJsonFile('knowledgegraph.json');
        }
        return knowledgeGraphCache;
    },
    /**
     * Search fincas by query and filters
     */
    searchFincas(query, provincia) {
        const all = this.getFincas();
        const cleanQuery = query.toLowerCase().trim();
        return all.filter(f => {
            const matchesQuery = !cleanQuery ||
                f.name.toLowerCase().includes(cleanQuery) ||
                (f.description && f.description.toLowerCase().includes(cleanQuery)) ||
                (f.tags && f.tags.some(t => t.toLowerCase().includes(cleanQuery)));
            const matchesProvincia = !provincia ||
                f.provincia.toLowerCase() === provincia.toLowerCase();
            return matchesQuery && matchesProvincia;
        });
    },
    /**
     * Search legacy providers
     */
    searchProviders(query, categoria) {
        const all = this.getLegacyProviders();
        const cleanQuery = query.toLowerCase().trim();
        return all.filter(p => {
            const matchesQuery = !cleanQuery ||
                p.nombre.toLowerCase().includes(cleanQuery) ||
                p.ubicacion.toLowerCase().includes(cleanQuery);
            const matchesCategoria = !categoria ||
                p.categoria.toLowerCase() === categoria.toLowerCase();
            return matchesQuery && matchesCategoria;
        });
    },
    /**
     * Find knowledge node by slug
     */
    findKnowledgeNode(slug) {
        const all = this.getKnowledgeGraph();
        // Normalize leading slash
        const cleanSlug = slug.startsWith('/') ? slug : `/${slug}`;
        return all.find(n => n.slug === cleanSlug || n.slug === slug) || null;
    }
};
