import { NextResponse } from 'next/server';
import { supabase } from '@/lib/services/auth_nexus';
import { gravitationalIngestor, DocumentNode } from '@/lib/services/rag/GravitationalIngestionEngine';
import { eternalMemory } from '@/lib/intelligence/EternalMemory';
import fs from 'fs';
import path from 'path';

// ============================================================================
// 🌌 SANITIZADOR DE PAYLOAD RAG S-CLASS (TOKEN & NETWORK EFFICIENCY)
// ============================================================================
function sanitizeRagNode(node: DocumentNode) {
  const text = node.texto || node.text || node.content || node.preview || '';
  const snippet = text.length > 250 ? text.slice(0, 250).trim() + '...' : text.trim();
  
  return {
    id: node.id || node.archivo || node.title || 'rag_node',
    title: node.title || node.archivo || 'Documento EAR OS',
    path: node.path || node.ruta || node.archivo || 'bunker',
    adjustedScore: Number((node.adjustedScore || node.score || 0).toFixed(4)),
    similarity: Number((node.score || 0).toFixed(4)),
    tags: node.tags || [],
    snippet
  };
}

function loadLocalRagFallback(): any[] {
  try {
    const dbPath = path.join(process.cwd(), 'src', 'data', 'ear-rag-database.json');
    if (fs.existsSync(dbPath)) {
      const raw = fs.readFileSync(dbPath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('⚠️ [RAG FALLBACK] No se pudo leer ear-rag-database.json desde disco:', err);
  }
  return [];
}

async function executeRagSearch(query: string, limit: number = 10) {
  const cacheKey = `rag:query:${query.trim().toLowerCase()}:lim:${limit}`;
  const cached = eternalMemory.get<any>(cacheKey);
  if (cached) {
    return { ...cached, cached: true };
  }

  const searchResult = await gravitationalIngestor.search(query, limit);

  let payload: any;

  if (searchResult.results.length > 0) {
    payload = {
      success: true,
      source: searchResult.source,
      totalIndexed: searchResult.totalIndexed,
      totalFiltered: searchResult.totalFiltered,
      results: searchResult.results.map(sanitizeRagNode),
      cached: false
    };
  } else {
    // Fallback secundario directo sobre ear-rag-database.json leído bajo demanda
    const localDb = loadLocalRagFallback();
    const lowerQuery = query.toLowerCase();
    const terms = lowerQuery.split(/\s+/).filter(t => t.length > 2);

    const scored = localDb
      .map(node => {
        let score = 0;
        const text = `${node.title || ''} ${node.content || ''} ${node.tags?.join(' ') || ''}`.toLowerCase();
        terms.forEach(term => {
          if (text.includes(term)) score += 1;
        });
        return { ...node, matchScore: score, adjustedScore: score };
      })
      .filter(node => node.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);

    payload = {
      success: true,
      source: 'local_rag_database_direct',
      totalIndexed: localDb.length,
      totalFiltered: scored.length,
      results: scored.map(sanitizeRagNode),
      cached: false
    };
  }

  // Guardar en memoria soberana con TTL de 10 minutos
  eternalMemory.set(cacheKey, payload, 600 * 1000, ['rag', 'search']);
  return payload;
}

// ============================================================================
// 📡 GET HANDLER (LIVIANO CON CACHE HTTP & MEMORY)
// ============================================================================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || searchParams.get('query') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 50);

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Parámetro ?q= requerido para búsqueda semántica.' },
        { status: 400 }
      );
    }

    const start = performance.now();
    const result = await executeRagSearch(query, limit);
    const durationMs = Number((performance.now() - start).toFixed(2));

    return NextResponse.json(
      { ...result, latencyMs: durationMs },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          'X-RAG-Latency': `${durationMs}ms`,
          'X-Memory-Hit': result.cached ? 'HIT' : 'MISS'
        }
      }
    );
  } catch (error: any) {
    console.error('❌ [RAG GET ERROR]', error);
    return NextResponse.json({ error: 'Fallo en la extracción RAG', details: error.message }, { status: 500 });
  }
}

// ============================================================================
// 🌌 POST HANDLER (SOPORTA EMBEDDINGS & BÚSQUEDA VECTORIAL)
// ============================================================================
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { query, embedding, limit = 10 } = body;

    // 1. Recuperación vía Supabase pgvector si hay embedding disponible
    if (embedding && Array.isArray(embedding)) {
      try {
        const { data, error } = await supabase.rpc('match_knowledge', {
          query_embedding: embedding,
          match_threshold: 0.75,
          match_count: limit
        });

        if (!error && data && data.length > 0) {
          return NextResponse.json({
            success: true,
            source: 'pgvector',
            results: data.map(sanitizeRagNode)
          });
        }
      } catch (err) {
        console.warn('⚠️ [RAG PGVECTOR FALLBACK] Supabase offline, derivando a Motor Gravitacional Local.');
      }
    }

    if (query && typeof query === 'string') {
      const start = performance.now();
      const result = await executeRagSearch(query, limit);
      const durationMs = Number((performance.now() - start).toFixed(2));

      return NextResponse.json({ ...result, latencyMs: durationMs });
    }

    return NextResponse.json({ error: 'Se requiere query o vector de embedding válido.' }, { status: 400 });
  } catch (error: any) {
    console.error('❌ [RAG POST ERROR]', error);
    return NextResponse.json({ error: 'Fallo en la extracción RAG', details: error.message }, { status: 500 });
  }
}
