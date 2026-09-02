import fs from 'fs';
import path from 'path';

// Mark as server-only to prevent this massive dataset loading on the client
// import 'server-only';

export interface Finca {
  id: string;
  name: string;
  category: string;
  uicategory: string;
  provincia: string;
  capacidad_min: number;
  capacidad_max: number;
  precio_desde: number | null;
  verificado: boolean;
  nivel_perfil: string;
  rating: number;
  reviews: number;
  image: string;
  tags?: string[];
  description?: string;
  phone?: string;
  email?: string;
}

export interface LegacyProvider {
  id: string;
  nombre: string;
  categoria: string;
  ubicacion: string;
  gps?: { lat: number; lng: number };
  rating?: string;
  imagenes?: string[];
}

export interface ArsenalEnriched {
  id: string;
  name: string;
  image: string;
  phone: string;
  hash: number;
}

export interface ArsenalCompleto {
  id: string;
  name: string;
  category?: string;
  description?: string;
  specifications?: Record<string, any>;
  image?: string;
}

export interface KnowledgeNode {
  origen_absoluto?: string;
  slug: string;
  titulo_generado: string;
  estado: string;
  metadata_seo?: {
    keywords?: string[];
    description?: string;
    [key: string]: any;
  };
}

// Memory caches to avoid reloading 116MB of files repeatedly
let fincasCache: Finca[] | null = null;
let legacyProvidersCache: LegacyProvider[] | null = null;
let arsenalEnrichedCache: ArsenalEnriched[] | null = null;
let arsenalCompletoCache: ArsenalCompleto[] | null = null;
let knowledgeGraphCache: KnowledgeNode[] | null = null;

const BACKUPS_DIR = path.join(process.cwd(), 'data_vault', 'backups');

function readJsonFile<T>(filename: string): T[] {
  const filePath = path.join(BACKUPS_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`[BackupReader] File not found: ${filePath}`);
      return [];
    }
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData) as T[];
  } catch (error) {
    console.error(`[BackupReader] Error reading ${filename}:`, error);
    return [];
  }
}

export const BackupReader = {
  /**
   * Load and cache all fincas
   */
  getFincas(): Finca[] {
    if (!fincasCache) {
      fincasCache = readJsonFile<Finca>('fincas.json');
    }
    return fincasCache;
  },

  /**
   * Load and cache all legacy providers
   */
  getLegacyProviders(): LegacyProvider[] {
    if (!legacyProvidersCache) {
      legacyProvidersCache = readJsonFile<LegacyProvider>('legacyproviders.json');
    }
    return legacyProvidersCache;
  },

  /**
   * Load and cache enriched arsenal profiles
   */
  getArsenalEnriched(): ArsenalEnriched[] {
    if (!arsenalEnrichedCache) {
      arsenalEnrichedCache = readJsonFile<ArsenalEnriched>('arsenalenriched.json');
    }
    return arsenalEnrichedCache;
  },

  /**
   * Load and cache baseline arsenal list
   */
  getArsenalCompleto(): ArsenalCompleto[] {
    if (!arsenalCompletoCache) {
      arsenalCompletoCache = readJsonFile<ArsenalCompleto>('arsenalcompleto.json');
    }
    return arsenalCompletoCache;
  },

  /**
   * Load and cache the full SEO knowledge graph
   */
  getKnowledgeGraph(): KnowledgeNode[] {
    if (!knowledgeGraphCache) {
      knowledgeGraphCache = readJsonFile<KnowledgeNode>('knowledgegraph.json');
    }
    return knowledgeGraphCache;
  },

  /**
   * Search fincas by query and filters
   */
  searchFincas(query: string, provincia?: string): Finca[] {
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
  searchProviders(query: string, categoria?: string): LegacyProvider[] {
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
  findKnowledgeNode(slug: string): KnowledgeNode | null {
    const all = this.getKnowledgeGraph();
    // Normalize leading slash
    const cleanSlug = slug.startsWith('/') ? slug : `/${slug}`;
    return all.find(n => n.slug === cleanSlug || n.slug === slug) || null;
  }
};
