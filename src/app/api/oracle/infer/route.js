import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import genomeData from '@/app/data/genome_sessions.json';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    try {
        // 1. INTENTO DE INFERENCIA EN DB (SOBERANÍA TOTAL)
        const { data, error } = await supabase
            .from('ear_knowledge_base')
            .select('*')
            .or(`content.ilike.%${query}%, metadata->>source.ilike.%${query}%`)
            .limit(5);
        if (!error && data && data.length > 0) {
            return NextResponse.json(data.map(item => ({
                id: item.id,
                category: item.metadata?.sector || 'CONOCIMIENTO',
                title: item.metadata?.filename || item.metadata?.source || 'Documento Forense',
                relevance: "98%",
                content: item.content,
                path: item.file_path
            })));
        }
        // 2. FALLBACK TÁCTICO: GENOMA H (JSON ESTÁTICO)
        console.warn("[ORÁCULO] DB no disponible o vacía. Activando Fallback de Genoma H.");
        const fallbackResults = (genomeData?.sessions || [])
            .filter((s) => s.title.toLowerCase().includes(query) || s.type.toLowerCase().includes(query))
            .map((s) => ({
            id: s.id,
            category: s.type,
            title: s.title,
            relevance: "85% (Fallback)",
            content: `Sesión de Genoma: ${s.title}. XP: ${s.xp}. Registrada en el núcleo local.`,
            path: 'local://genome_sessions.json'
        }));
        return NextResponse.json(fallbackResults);
    }
    catch (err) {
        return NextResponse.json({ error: "SISTEMA_DEGRADADO", details: err.message }, { status: 200 });
    }
}
