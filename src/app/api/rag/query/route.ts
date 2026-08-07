import { NextResponse } from 'next/server';
import { supabase } from '@/lib/services/auth_nexus';
import ragDatabase from '@/data/ear-rag-database.json';

// ============================================================================
// 🌌 BÓVEDA DE CONOCIMIENTO - EXTRACCIÓN RAG (SUPABASE + LOCAL RAG DB FALLBACK)
// ============================================================================
export async function POST(req: Request) {
  try {
    const { query, embedding, limit = 5 } = await req.json();

    // 1. Intentar recuperación vía Supabase pgvector si hay embedding
    if (embedding && Array.isArray(embedding)) {
      try {
        const { data, error } = await supabase.rpc('match_knowledge', {
          query_embedding: embedding,
          match_threshold: 0.75,
          match_count: limit
        });

        if (!error && data && data.length > 0) {
          return NextResponse.json({ success: true, source: 'pgvector', results: data });
        }
      } catch (err) {
        console.warn('⚠️ [RAG PGVECTOR FALLBACK] Supabase offline, derivando a Local RAG DB.');
      }
    }

    // 2. Fallback determinista / Búsqueda Léxica Semántica sobre ear-rag-database.json (4.357 Chunks)
    if (query && typeof query === 'string') {
      const lowerQuery = query.toLowerCase();
      const terms = lowerQuery.split(/\s+/).filter(t => t.length > 2);

      const scored = (ragDatabase as any[]).map(node => {
        let score = 0;
        const text = `${node.title} ${node.content} ${node.tags.join(' ')}`.toLowerCase();
        
        terms.forEach(term => {
          if (text.includes(term)) score += 1;
        });

        return { ...node, matchScore: score };
      })
      .filter(node => node.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);

      return NextResponse.json({
        success: true,
        source: 'local_rag_database',
        totalIngestedChunks: ragDatabase.length,
        results: scored
      });
    }

    return NextResponse.json({ error: 'Se requiere query o vector de embedding válido.' }, { status: 400 });
  } catch (error: any) {
    console.error('❌ [RAG QUERY ERROR]', error);
    return NextResponse.json({ error: 'Fallo en la extracción RAG', details: error.message }, { status: 500 });
  }
}
