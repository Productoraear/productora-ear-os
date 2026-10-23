import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ear-os-production.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error('Supabase no configurado en entorno de servidor.');
  }
  return createClient(url, key);
}

// ============================================================================
// 🌌 CAZADOR FANTASMA - MOTOR DE INGESTIÓN
// ============================================================================
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== 'Bearer ' + process.env.HUNTER_API_KEY) {
      return NextResponse.json({ error: 'Acceso Denegado. Protocolo S-Class requerido.' }, { status: 401 });
    }

    const payload = await req.json();
    const { source_url, entity_name, extracted_data } = payload;

    if (!source_url || !entity_name || !extracted_data) {
      return NextResponse.json({ error: 'Payload Incompleto. Se requiere source_url, entity_name y extracted_data.' }, { status: 400 });
    }

    // 1. Inyectar inteligencia en Supabase de forma segura en runtime
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('hunter_intel')
      .insert([
        { source_url, entity_name, extracted_data, confidence_score: 0.95 }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Inteligencia ingerida correctamente en la Bóveda.', data });
  } catch (error: unknown) {
    console.error('❌ [HUNTER INGEST ERROR]', error);
    return NextResponse.json({ error: 'Fallo crítico en el motor de ingestión' }, { status: 500 });
  }
}
