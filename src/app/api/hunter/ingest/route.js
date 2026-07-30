import { NextResponse } from 'next/server';
import { supabase } from '@/lib/services/auth_nexus';
export const runtime = 'edge';
// ============================================================================
// 🌌 CAZADOR FANTASMA - MOTOR DE INGESTIÓN
// ============================================================================
export async function POST(req) {
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
        // 1. Inyectar inteligencia en Supabase
        const { data, error } = await supabase
            .from('hunter_intel')
            .insert([
            { source_url, entity_name, extracted_data, confidence_score: 0.95 }
        ])
            .select()
            .single();
        if (error)
            throw error;
        return NextResponse.json({ success: true, message: 'Inteligencia ingerida correctamente en la Bóveda.', data });
    }
    catch (error) {
        console.error('❌ [HUNTER INGEST ERROR]', error);
        return NextResponse.json({ error: 'Fallo crítico en el motor de ingestión', details: error.message }, { status: 500 });
    }
}
