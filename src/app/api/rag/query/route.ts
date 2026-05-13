import { NextResponse } from 'next/server';
import { supabase } from '@/lib/services/auth_nexus';

export const runtime = 'edge';

// ============================================================================
// 🌌 BÓVEDA DE CONOCIMIENTO - EXTRACCIÓN RAG
// ============================================================================
export async function POST(req: Request) {
  try {
    const { query, embedding } = await req.json();

    if (!embedding || !Array.isArray(embedding)) {
      return NextResponse.json({ error: 'Se requiere un vector de embedding válido para la consulta.' }, { status: 400 });
    }

    // Ejecutar búsqueda de similitud usando pgvector en Supabase
    const { data, error } = await supabase.rpc('match_knowledge', {
      query_embedding: embedding,
      match_threshold: 0.78,
      match_count: 5
    });

    if (error) throw error;

    return NextResponse.json({ success: true, results: data });
  } catch (error: any) {
    console.error('❌ [RAG QUERY ERROR]', error);
    return NextResponse.json({ error: 'Fallo en la extracción de la Bóveda de Conocimiento', details: error.message }, { status: 500 });
  }
}
