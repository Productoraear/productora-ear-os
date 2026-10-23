#!/usr/bin/env node
/**
 * GENERADOR DE FICHAS HTML CON OLLAMA QWEN 3.8 27B-FAST
 * Wave 22 Task 02: Generación masiva de fichas HTML para proveedores
 * Modelo: qwen3.8:27b-fast (localhost:11434)
 * Target: 6419 proveedores sin ficha HTML
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════════════════

const OLLAMA_HOST = 'localhost';
const OLLAMA_PORT = 11434;
const MODEL = 'ear-27b-apis-sclass:latest';
const INVENTORY_PATH = path.join(__dirname, '..', 'reports', 'INVENTARIO_PROVEEDORES_MVP_2026.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'fichas-proveedores');
const BATCH_SIZE = 50; // Procesar en lotes para evitar saturar Ollama
const MIN_HTML_SIZE = 2048; // 2KB mínimo
const MAX_JACCARD = 0.10; // Máximo 10% similitud

// ═══════════════════════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════════════════════

function generateNGrams(text, n = 5) {
    const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
    const ngrams = new Set();
    for (let i = 0; i <= words.length - n; i++) {
        ngrams.add(words.slice(i, i + n).join(' '));
    }
    return ngrams;
}

function calculateJaccard(set1, set2) {
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return union.size === 0 ? 0 : intersection.size / union.size;
}

function sanitizeSlug(slug) {
    return slug.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
}

async function callOllama(prompt) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            model: MODEL,
            prompt: prompt,
            stream: false,
            options: {
                temperature: 0.7,
                top_p: 0.9,
                top_k: 40
            }
        });

        const options = {
            hostname: OLLAMA_HOST,
            port: OLLAMA_PORT,
            path: '/api/generate',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    resolve(response.response || '');
                } catch (err) {
                    reject(new Error(`Error parsing Ollama response: ${err.message}`));
                }
            });
        });

        req.on('error', (err) => reject(err));
        req.write(postData);
        req.end();
    });
}

function buildPrompt(provider) {
    const { nombre, categoria, ubicacion, telefono, servicios, descripcion } = provider;

    return `Eres un redactor SEO experto especializado en eventos y bodas de lujo en España.

TAREA: Genera una ficha HTML completa y profesional para el siguiente proveedor:

DATOS DEL PROVEEDOR:
- Nombre: ${nombre}
- Categoría: ${categoria}
- Ubicación: ${ubicacion || 'España'}
- Teléfono: ${telefono || 'Consultar'}
- Servicios: ${servicios || 'Servicios profesionales'}
- Descripción base: ${descripcion || 'Proveedor profesional de eventos'}

REQUISITOS OBLIGATORIOS:
1. Descripción comercial de 300-500 palabras (tono profesional, aspiracional, conversión)
2. Lista específica de servicios ofrecidos (mínimo 5 servicios concretos)
3. Zona de cobertura geográfica detallada
4. Rango de precios orientativos (sin comprometer negociación)
5. Propuesta de valor única (qué diferencia a este proveedor)
6. CTA claro y directo (llamada a la acción)
7. HTML semántico con schema.org (LocalBusiness o MusicGroup según categoría)

FORMATO DE SALIDA:
Devuelve ÚNICAMENTE el código HTML completo, sin explicaciones adicionales.
El HTML debe incluir:
- DOCTYPE, html, head con meta tags SEO
- body con estructura semántica (header, main, section, footer)
- Schema.org JSON-LD embebido
- Estilos inline mínimos (el sitio usa Tailwind CSS)

PROHIBICIONES ABSOLUTAS:
- NO uses clichés genéricos ("revoluciona tu experiencia", "soluciones innovadoras")
- NO inventes datos que no están en los DATOS DEL PROVEEDOR
- NO uses placeholder text (Lorem Ipsum)
- NO copies contenido de otros proveedores

GENERA EL HTML AHORA:`;
}

function validateSchemaOrg(html) {
    // Validación básica de schema.org
    return html.includes('@type') &&
        (html.includes('LocalBusiness') || html.includes('MusicGroup') || html.includes('Organization'));
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROCESO PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
    console.log('🚀 GENERADOR DE FICHAS HTML CON OLLAMA');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📦 Modelo: ${MODEL}`);
    console.log(`🎯 Target: Proveedores sin ficha HTML`);
    console.log(`📏 Tamaño mínimo: ${MIN_HTML_SIZE} bytes`);
    console.log(`🔍 Jaccard máximo: ${MAX_JACCARD}`);
    console.log('');

    // 1. Leer inventario
    console.log('📖 Leyendo inventario...');
    if (!fs.existsSync(INVENTORY_PATH)) {
        console.error('❌ ERROR: Inventario no encontrado');
        process.exit(1);
    }

    const inventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf8'));
    const providers = inventory.proveedores.filter(p =>
        !p.tiene_ficha_html &&
        p.verified &&
        p.telefono_real
    );

    console.log(`✅ Inventario cargado: ${providers.length} proveedores sin ficha HTML`);
    console.log('');

    // 2. Crear directorio de salida
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // 3. Procesar proveedores en lotes
    const stats = {
        total: providers.length,
        generadas: 0,
        errores: 0,
        tamaños: [],
        jaccards: [],
        categorias: {}
    };

    const existingNGrams = new Map(); // Cache de n-gramas para comparación

    for (let i = 0; i < providers.length; i += BATCH_SIZE) {
        const batch = providers.slice(i, i + BATCH_SIZE);
        console.log(`📦 Procesando lote ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(providers.length / BATCH_SIZE)} (${batch.length} proveedores)...`);

        for (const provider of batch) {
            try {
                const { id, nombre, categoria, slug } = provider;
                const safeSlug = sanitizeSlug(slug || id);
                const categoryDir = path.join(OUTPUT_DIR, categoria);
                const outputPath = path.join(categoryDir, `${safeSlug}.html`);

                // Crear directorio de categoría si no existe
                if (!fs.existsSync(categoryDir)) {
                    fs.mkdirSync(categoryDir, { recursive: true });
                }

                // Generar prompt y llamar a Ollama
                const prompt = buildPrompt(provider);
                console.log(`   🤖 Generando: ${nombre} (${categoria})...`);

                const html = await callOllama(prompt);

                // Validaciones
                if (html.length < MIN_HTML_SIZE) {
                    console.log(`   ⚠️  SKIP: HTML muy corto (${html.length} bytes < ${MIN_HTML_SIZE})`);
                    stats.errores++;
                    continue;
                }

                if (!validateSchemaOrg(html)) {
                    console.log(`   ⚠️  SKIP: Schema.org inválido o ausente`);
                    stats.errores++;
                    continue;
                }

                // Calcular Jaccard con fichas existentes
                const ngrams = generateNGrams(html);
                let maxJaccard = 0;

                for (const [existingId, existingNGrams] of existingNGrams.entries()) {
                    const jaccard = calculateJaccard(ngrams, existingNGrams);
                    if (jaccard > maxJaccard) {
                        maxJaccard = jaccard;
                    }
                }

                if (maxJaccard > MAX_JACCARD) {
                    console.log(`   ⚠️  SKIP: Jaccard muy alto (${maxJaccard.toFixed(3)} > ${MAX_JACCARD})`);
                    stats.errores++;
                    continue;
                }

                // Guardar ficha
                fs.writeFileSync(outputPath, html, 'utf8');
                existingNGrams.set(id, ngrams);

                // Actualizar estadísticas
                stats.generadas++;
                stats.tamaños.push(html.length);
                stats.jaccards.push(maxJaccard);
                stats.categorias[categoria] = (stats.categorias[categoria] || 0) + 1;

                console.log(`   ✅ Generada: ${safeSlug}.html (${html.length} bytes, Jaccard: ${maxJaccard.toFixed(3)})`);

            } catch (err) {
                console.error(`   ❌ ERROR: ${provider.nombre} - ${err.message}`);
                stats.errores++;
            }
        }

        // Pausa entre lotes para no saturar Ollama
        if (i + BATCH_SIZE < providers.length) {
            console.log('   ⏸️  Pausa 2s entre lotes...');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    // 4. Generar resumen
    const avgSize = stats.tamaños.length > 0
        ? Math.round(stats.tamaños.reduce((a, b) => a + b, 0) / stats.tamaños.length)
        : 0;
    const maxJaccardFound = stats.jaccards.length > 0
        ? Math.max(...stats.jaccards)
        : 0;

    const summary = {
        timestamp: new Date().toISOString(),
        modelo: MODEL,
        total_proveedores: stats.total,
        fichas_generadas: stats.generadas,
        errores: stats.errores,
        tasa_exito: ((stats.generadas / stats.total) * 100).toFixed(2) + '%',
        tamaño_promedio_bytes: avgSize,
        jaccard_maximo: maxJaccardFound.toFixed(3),
        fichas_por_categoria: stats.categorias
    };

    const summaryPath = path.join(__dirname, '..', 'reports', 'RESUMEN_GENERACION_FICHAS_HTML_2026.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf8');

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RESUMEN FINAL:');
    console.log(`   ✅ Fichas generadas: ${stats.generadas}/${stats.total}`);
    console.log(`   ❌ Errores: ${stats.errores}`);
    console.log(`   📏 Tamaño promedio: ${avgSize} bytes`);
    console.log(`   🔍 Jaccard máximo: ${maxJaccardFound.toFixed(3)}`);
    console.log(`   📁 Resumen guardado: ${summaryPath}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// ═══════════════════════════════════════════════════════════════════════════════
// EJECUCIÓN
// ═══════════════════════════════════════════════════════════════════════════════

main().catch(err => {
    console.error('💥 ERROR FATAL:', err);
    process.exit(1);
});