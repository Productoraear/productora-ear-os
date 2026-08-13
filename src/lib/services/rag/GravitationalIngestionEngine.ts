import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// ============================================================================
// 🌌 GRAVITATIONAL KNOWLEDGE & VAMPIRIZATION ENGINE (S-CLASS V2.2)
// Silicon Valley Architecture: Cosine Similarity + Domain Signal Boosting
// Deduplication by Content Hash + Versioned Copy Pruning
// ============================================================================

export interface DocumentNode {
  id?: string;
  ruta?: string;
  path?: string;
  archivo?: string;
  title?: string;
  texto?: string;
  text?: string;
  content?: string;
  preview?: string;
  embedding?: number[];
  tags?: string[];
  hash_fuente?: string;
  score?: number;
  adjustedScore?: number;
  matchScore?: number;
  metadata?: Record<string, any>;
}

export interface IngestionConfig {
  bunkerPath?: string;
  dbPath?: string;
  localApiUrl?: string;
  embeddingModel?: string;
  topK?: number;
}

export const DEFAULT_CLINICOS = [
  'musicoterapia',
  'alzheimer',
  'demencia',
  'mayores',
  'geriatr',
  'memoria',
  'sensorial',
  'neuro',
  'terapia ocupacional',
  '40 hz',
  'protocolo',
  'sesion',
  'sesión',
  'residencia',
  'cognitiv',
  'clinical',
  'clinico',
  'clínico',
  'vimume',
  'edwin agudelo',
  'mariachi',
  's-class',
  'l-acoustics',
  'axient',
  'soberania'
] as const;

export const DEFAULT_EXCLUIR = [
  '01_vertical_eventos',
  '\\bodas\\',
  'eve_miboda',
  'identidad_ear',
  'ear-intelligence',
  'ear_uber',
  'earaitwinservice',
  'earops',
  'earroutes',
  'eardynamiccalculator',
  'earbusinesssimulator',
  'earartisttracker',
  'earhubtalent',
  'heartbeatservice',
  'productora-ear-types',
  'pricingear',
  'wearyourstory',
  'knowledgearchitect',
  'node_modules',
  '.d.ts',
  '.tmp',
  '.git'
] as const;

export class GravitationalIngestionEngine {
  private bunkerPath: string;
  private dbPath: string;
  private localApiUrl: string;
  private embeddingModel: string;
  private topK: number;

  constructor(config?: IngestionConfig) {
    this.bunkerPath = config?.bunkerPath || 'D:\\EAR_OS_INTEL_BUNKER';
    this.dbPath = config?.dbPath || path.join(this.bunkerPath, '_vector_db', 'embeddings.json');
    this.localApiUrl = config?.localApiUrl || 'http://127.0.0.1:1234/v1/embeddings';
    this.embeddingModel = config?.embeddingModel || 'nomic-embed-text';
    this.topK = config?.topK || 20;
  }

  /**
   * 📐 Similitud Coseno pura entre dos vectores flotantes.
   */
  public cosineSimilarity(vectorA: number[], vectorB: number[]): number {
    if (!vectorA || !vectorB || vectorA.length === 0 || vectorB.length === 0) {
      return 0.0;
    }

    const minLen = Math.min(vectorA.length, vectorB.length);
    let dotProduct = 0.0;
    let normA = 0.0;
    let normB = 0.0;

    for (let i = 0; i < minLen; i++) {
      const a = vectorA[i];
      const b = vectorB[i];
      dotProduct += a * b;
      normA += a * a;
      normB += b * b;
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
      return 0.0;
    }

    return dotProduct / (normA * normB);
  }

  /**
   * 🔍 Normalización de ruta Windows / POSIX
   */
  public normalizePath(filePath: string): string {
    return filePath.replace(/\//g, '\\').toLowerCase();
  }

  /**
   * 🏷️ Detecta si un archivo es una copia versionada con sufijos numéricos (ej. file_20260731)
   */
  public isVersionedCopy(filePath: string): boolean {
    const filename = path.parse(filePath).name.toLowerCase();
    const parts = filename.split('_');

    if (parts.length < 2) return false;

    return parts.slice(1).some(part => /^\d{4,}$/.test(part));
  }

  /**
   * 🔑 Clave de deduplicación canónica para fusionar variantes
   */
  public deduplicationKey(filePath: string): string {
    const filename = path.parse(filePath).name.toLowerCase();
    const parts = filename.split('_');

    while (parts.length > 0 && /^\d{4,}$/.test(parts[parts.length - 1])) {
      parts.pop();
    }

    return parts.join('_');
  }

  /**
   * ⚡ Puntuación ajustada de alta señal gravitacional
   */
  public adjustedScore(rawScore: number, filePath: string, previewText: string): number | null {
    const normPath = this.normalizePath(filePath);
    const filename = path.basename(filePath).toLowerCase();
    const fullText = `${normPath} ${previewText}`.toLowerCase();

    // 1. Filtro de exclusión estricto
    if (DEFAULT_EXCLUIR.some(p => normPath.includes(p) || filename.includes(p))) {
      return null;
    }

    // 2. Conteo de coincidencias clínicas / estratégicas
    const clinicalMatches = DEFAULT_CLINICOS.reduce((acc, term) => {
      return acc + (fullText.includes(term) ? 1 : 0);
    }, 0);

    if (clinicalMatches === 0 && rawScore < 0.65) {
      return null;
    }

    let bonus = 0.0;

    if (filename.includes('vimume')) bonus += 0.08;
    if (filename.includes('clinical') || filename.includes('clinico') || filename.includes('clínico')) bonus += 0.12;
    if (fullText.includes('protocolo') || fullText.includes('protocol')) bonus += 0.06;
    if (fullText.includes('edwin agudelo') || fullText.includes('agudelo')) bonus += 0.15;
    if (clinicalMatches >= 2) bonus += 0.05;
    if (clinicalMatches >= 4) bonus += 0.05;

    // Penalización por ser copia versionada redundante
    if (this.isVersionedCopy(filePath)) {
      bonus -= 0.20;
    }

    return rawScore + bonus;
  }

  /**
   * 🧬 Hash criptográfico SHA-256 de contenido para evitar duplicación física
   */
  public computeContentHash(content: string): string {
    return crypto.createHash('sha256').update(content.trim().toLowerCase()).digest('hex');
  }

  /**
   * 🌐 Solicita embedding vectorial a LM Studio / Nomic Local si está activo
   */
  public async fetchLocalEmbedding(text: string): Promise<number[] | null> {
    try {
      const response = await fetch(this.localApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: text,
          model: this.embeddingModel,
        }),
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) return null;

      const data = await response.json();
      if (data?.data?.[0]?.embedding) {
        return data.data[0].embedding;
      }
    } catch {
      // LM Studio offline, fallback silencioso
    }
    return null;
  }

  /**
   * 🗄️ Carga de documentos desde la base vectorial del búnker
   */
  public loadBunkerDocuments(): DocumentNode[] {
    const possiblePaths = [
      this.dbPath,
      path.join(this.bunkerPath, '_vector_db', 'vimume_clinico_v1.json'),
      path.join(process.cwd(), 'src', 'data', 'ear-rag-database.json')
    ];

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        try {
          const raw = fs.readFileSync(p, 'utf-8');
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed;
          if (parsed?.documentos && Array.isArray(parsed.documentos)) return parsed.documentos;
        } catch {
          // Continuar con el siguiente candidato
        }
      }
    }

    return [];
  }

  /**
   * 🎯 Búsqueda semántica gravitacional completa
   */
  public async search(query: string, limit: number = this.topK): Promise<{
    results: DocumentNode[];
    totalIndexed: number;
    totalFiltered: number;
    source: string;
  }> {
    const documents = this.loadBunkerDocuments();
    if (documents.length === 0) {
      return { results: [], totalIndexed: 0, totalFiltered: 0, source: 'none' };
    }

    // 1. Intentar embedding del query
    const queryEmbedding = await this.fetchLocalEmbedding(query);

    const results: DocumentNode[] = [];
    const seenKeys = new Set<string>();
    const seenHashes = new Set<string>();

    for (const doc of documents) {
      const filePath = doc.ruta || doc.path || doc.archivo || doc.title || 'unknown';
      const text = doc.texto || doc.text || doc.content || doc.preview || '';
      const preview = text.slice(0, 500);

      // Deduplicación por hash de contenido
      const hash = doc.hash_fuente || this.computeContentHash(text);
      if (seenHashes.has(hash)) continue;
      seenHashes.add(hash);

      // Deduplicación por clave de nombre canónico
      const key = this.deduplicationKey(filePath);
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);

      let rawScore = 0.0;

      if (queryEmbedding && doc.embedding && doc.embedding.length > 0) {
        rawScore = this.cosineSimilarity(queryEmbedding, doc.embedding);
      } else {
        // Fallback Léxico Semántico Gravitacional
        const lowerQ = query.toLowerCase();
        const terms = lowerQ.split(/\s+/).filter(t => t.length > 2);
        const lowerDoc = `${filePath} ${text} ${(doc.tags || []).join(' ')}`.toLowerCase();

        let termMatches = 0;
        for (const term of terms) {
          if (lowerDoc.includes(term)) termMatches++;
        }

        rawScore = terms.length > 0 ? termMatches / terms.length : 0.0;
      }

      const scoreAjustado = this.adjustedScore(rawScore, filePath, preview);
      if (scoreAjustado === null || scoreAjustado <= 0) continue;

      results.push({
        ...doc,
        path: filePath,
        preview,
        score: rawScore,
        adjustedScore: scoreAjustado,
        matchScore: scoreAjustado
      });
    }

    results.sort((a, b) => (b.adjustedScore || 0) - (a.adjustedScore || 0));

    return {
      results: results.slice(0, limit),
      totalIndexed: documents.length,
      totalFiltered: results.length,
      source: queryEmbedding ? 'local_nomic_vector' : 'gravitational_lexical_fallback'
    };
  }
}

export const gravitationalIngestor = new GravitationalIngestionEngine();
