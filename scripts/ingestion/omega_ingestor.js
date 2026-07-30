import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
// 🏛️ EAR OS GOLD - OMEGA RAG INGESTOR (S-CLASS)
// Motor de Asimilación Neural para las 118 Indicaciones Maestras
dotenv.config({ path: '.env.local' });
if (!process.env.GEMINI_API_KEY || !process.env.SUPABASE_URL) {
    console.error('❌ [ERROR] Faltan variables de entorno (GEMINI_API_KEY o SUPABASE_URL).');
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "models/gemini-embedding-001" });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY);
const SOURCE_DIR = path.join(process.cwd(), 'BASE_DE_CONOCIMIENTO', 'INDICACIONES_MAESTRAS');
const IS_TEST = process.argv.includes('--test');
/**
 * Genera el vector de embedding usando Gemini (768 dims)
 */
async function getEmbedding(text) {
    try {
        const result = await embeddingModel.embedContent(text);
        // Matryoshka Slicing (S-Class fallback for 768 dims)
        return result.embedding.values.slice(0, 768);
    }
    catch (error) {
        console.error('❌ [EMBEDDING ERROR]', error);
        return [];
    }
}
/**
 * Fragmentación Táctica (Chunking) con solapamiento
 */
function chunkText(text, size = 3000, overlap = 500) {
    const chunks = [];
    let i = 0;
    while (i < text.length) {
        chunks.push(text.slice(i, i + size));
        i += size - overlap;
    }
    return chunks;
}
async function startAssimilation() {
    console.log(`--- 🧬 INICIANDO ASIMILACIÓN NEURAL OMEGA ${IS_TEST ? '(MODO TEST)' : ''} ---`);
    if (!fs.existsSync(SOURCE_DIR)) {
        console.error(`❌ [ERROR] No se encuentra el directorio: ${SOURCE_DIR}`);
        return;
    }
    const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.md')).sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
    });
    console.log(`[ORÁCULO] Detectadas ${files.length} partes del Códice Maestro.`);
    for (const file of files) {
        console.log(`\n[ASSIMILATING] Sector: ${file}`);
        const content = fs.readFileSync(path.join(SOURCE_DIR, file), 'utf-8');
        const chunks = chunkText(content);
        console.log(`[STATS] ${chunks.length} fragmentos detectados.`);
        for (let i = 0; i < (IS_TEST ? 1 : chunks.length); i++) {
            const chunk = chunks[i];
            process.stdout.write(`  > Vectorizando fragmento ${i + 1}/${chunks.length}... `);
            const embedding = await getEmbedding(chunk);
            if (embedding.length === 0) {
                console.log('SKIP');
                continue;
            }
            if (IS_TEST) {
                console.log('✅ VECTOR GENERADO EXITOSAMENTE (MODO TEST)');
                console.log(`[DIMENSIONES] ${embedding.length} dimensiones`);
                console.log(`[VECTOR SAMPLE] [${embedding.slice(0, 5).join(', ')} ... ${embedding.slice(-5).join(', ')}]`);
                return;
            }
            const { error } = await supabase.from('ear_knowledge_base').upsert({
                file_path: `BASE_DE_CONOCIMIENTO/INDICACIONES_MAESTRAS/${file}`,
                content: chunk,
                chunk_index: i,
                embedding,
                metadata: {
                    part: file.match(/\d+/)?.[0] || 'unknown',
                    source: 'INDICACIONES_MAESTRAS',
                    timestamp: new Date().toISOString(),
                    charCount: chunk.length
                }
            }, { onConflict: 'file_path,chunk_index' });
            if (error) {
                console.log(`\n❌ [ERROR] DB Upsert failed: ${error.message}`);
            }
            else {
                console.log('DONE');
            }
        }
        if (IS_TEST)
            break;
    }
    console.log('\n--- ✅ ASIMILACIÓN COMPLETADA: MEMORIA SOBERANA ESTABLECIDA ---');
}
startAssimilation().catch(console.error);
