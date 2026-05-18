# 🧬 EAR OS GOLD V2 - PROTOCOLO DE INGESTIÓN MASIVA (OMEGA INDEXER)
# Ejecución de Fuerza Bruta Computacional para Carga Forense de Datos

$targetDir = "C:\EAR_OS_V2\scripts\ingestion"
if (!(Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    Write-Host "[S-CLASS] Directorio de ingesta creado: $targetDir" -ForegroundColor Cyan
}

# 1. GENERACIÓN DEL INDEXADOR OMEGA (TYPESCRIPT)
$indexerPath = Join-Path $targetDir "omega_indexer.ts"
$indexerContent = @"
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

// ============================================================================
// 🌌 OMEGA INDEXER: MOTOR DE INGESTIÓN FORENSE (S-CLASS)
// ============================================================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SOURCE_PATH = 'H:\\00_PRODUCTORA_EAR';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[ERROR] Faltan variables de entorno de Supabase.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

/**
 * Fragmentación de texto (Chunking) con solapamiento táctico
 */
function createChunks(text: string, size: number = 1000, overlap: number = 200): string[] {
    const chunks: string[] = [];
    let i = 0;
    while (i < text.length) {
        chunks.push(text.slice(i, i + size));
        i += size - overlap;
    }
    return chunks;
}

/**
 * Rastreo recursivo y asimilación de sectores
 */
async function ingestDirectory(dir: string) {
    console.log(`[ORÁCULO] Analizando Sector: \${dir}...`);
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
            await ingestDirectory(fullPath);
            continue;
        }

        const ext = path.extname(entry.name).toLowerCase();
        if (['.txt', '.md', '.json'].includes(ext)) {
            try {
                console.log(`[ORÁCULO] Ingestando Sector: \${entry.name}...`);
                const content = fs.readFileSync(fullPath, 'utf-8');
                const chunks = createChunks(content);

                for (const [index, chunk] of chunks.entries()) {
                    const { error } = await supabase
                        .from('ear_knowledge_base')
                        .upsert({
                            file_path: fullPath,
                            content: chunk,
                            chunk_index: index,
                            metadata: {
                                filename: entry.name,
                                extension: ext,
                                sector: path.basename(dir),
                                timestamp: new Date().toISOString()
                            }
                        }, { onConflict: 'file_path,chunk_index' });

                    if (error) throw error;
                }
            } catch (err: any) {
                console.warn(`[WARNING] Degradación graciosa en \${entry.name}: \${err.message}`);
            }
        }
    }
}

async function main() {
    console.log('--- 🧬 INICIANDO IGNICIÓN DE MEMORIA OMEGA ---');
    if (!fs.existsSync(SOURCE_PATH)) {
        console.error(`[ERROR] No se encuentra la unidad H: en \${SOURCE_PATH}`);
        return;
    }
    
    await ingestDirectory(SOURCE_PATH);
    console.log('--- ✅ INGESTIÓN COMPLETADA: MEMORIA SOBERANA ESTABLECIDA ---');
}

main().catch(console.error);
"@

Set-Content -Path $indexerPath -Value $indexerContent -Encoding utf8
Write-Host "[S-CLASS] Indexador Omega generado en: $indexerPath" -ForegroundColor Cyan

# 2. ACTUALIZACIÓN DE PACKAGE.JSON (BATCHING MASIVO)
$packagePath = "C:\EAR_OS_V2\package.json"
$package = Get-Content $packagePath | ConvertFrom-Json
$package.scripts | Add-Member -MemberType NoteProperty -Name "ingest:omega" -Value "ts-node scripts/ingestion/omega_indexer.ts" -Force
$package | ConvertTo-Json -Depth 100 | Set-Content $packagePath
Write-Host "[S-CLASS] Script 'ingest:omega' inyectado en package.json" -ForegroundColor Cyan

Write-Host "`n[SINGULARIDAD] Infraestructura V5 preparada para ignición masiva." -ForegroundColor Gold
