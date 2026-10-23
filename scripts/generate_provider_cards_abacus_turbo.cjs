#!/usr/bin/env node
/**
 * GENERADOR TURBO DE FICHAS HTML - ABACUS.AI DEEPSEEK-CHAT
 * Generación masiva paralela de fichas HTML semánticas premium
 * Target: 5926 proveedores en < 2 horas
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════════════════

const ABACUS_API_KEY = process.env.ABACUS_API_KEY;
const ABACUS_BASE_URL = 'https://apps.abacus.ai/api/chatllm/v1';
const ABACUS_MODEL = 'deepseek-chat';

const INVENTARIO_PATH = 'reports/INVENTARIO_PROVEEDORES_MVP_2026.json';
const OUTPUT_DIR = 'public/fichas-proveedores';
const RESUMEN_PATH = 'reports/RESUMEN_GENERACION_FICHAS_HTML_2026.json';

const BATCH_SIZE = 20; // Procesar 20 proveedores simultáneamente
const MIN_SIZE_BYTES = 2048;
const MAX_JACCARD = 0.10;

// ═══════════════════════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════════════════════

function slugify(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function calculateJaccard(text1, text2, n = 5) {
    const getNGrams = (text, n) => {
        const grams = new Set();
        const clean = text.toLowerCase().replace(/\s+/g, ' ');
        for (let i = 0; i <= clean.length - n; i++) {
            grams.add(clean.substring(i, i + n));
        }
        return grams;
    };

    const grams1 = getNGrams(text1, n);
    const grams2 = getNGrams(text2, n);

    const intersection = new Set([...grams1].filter(x => grams2.has(x)));
    const union = new Set([...grams1, ...grams2]);

    return union.size === 0 ? 0 : intersection.size / union.size;
}

async function callAbacusAPI(prompt, systemPrompt) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
            model: ABACUS_MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            max_tokens: 4096,
            temperature: 0.7
        });

        const options = {
            hostname: 'apps.abacus.ai',
            path: '/api/chatllm/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ABACUS_API_KEY}`,
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.choices && response.choices[0]) {
                        resolve(response.choices[0].message.content);
                    } else {
                        reject(new Error('Respuesta inválida de Abacus.ai'));
                    }
                } catch (err) {
                    reject(err);
                }
            });
        });

        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERACIÓN DE FICHAS
// ═══════════════════════════════════════════════════════════════════════════════

async function generateProviderCard(proveedor) {
    const systemPrompt = `Eres un redactor SEO experto especializado en eventos, bodas y entretenimiento premium en España.
Tu misión es crear fichas HTML semánticas de máxima calidad que:
1. Resuelvan TODAS las intenciones de búsqueda del usuario
2. Incluyan schema.org LocalBusiness/MusicGroup válido
3. Optimicen para long-tail keywords específicas
4. Generen conversión con CTAs estratégicos
5. Mantengan tono profesional, aspiracional y premium

PROHIBIDO: Clichés genéricos, promesas vacías, contenido duplicado.`;

    const userPrompt = `Genera una ficha HTML completa y semántica para:

PROVEEDOR: ${proveedor.nombre}
CATEGORÍA: ${proveedor.categoria}
UBICACIÓN: ${proveedor.ciudad || 'España'}, ${proveedor.provincia || ''}
TELÉFONO: ${proveedor.telefono || 'Consultar'}
EMAIL: ${proveedor.email || ''}
WEB: ${proveedor.web || ''}

REQUISITOS TÉCNICOS:
- HTML5 semántico con schema.org (LocalBusiness o MusicGroup según categoría)
- Descripción 400-600 palabras con keywords long-tail naturales
- Secciones: Servicios, Zona de cobertura, Precios orientativos, Propuesta de valor única
- 3 CTAs estratégicos (solicitar presupuesto, ver portfolio, contactar)
- Meta description optimizada (150-160 caracteres)
- Estructura H1 > H2 > H3 correcta
- Datos de contacto verificables

INTENCIONES DE BÚSQUEDA A RESOLVER:
- "${proveedor.categoria} ${proveedor.ciudad || 'España'}"
- "${proveedor.categoria} para bodas ${proveedor.provincia || ''}"
- "precio ${proveedor.categoria} ${proveedor.ciudad || ''}"
- "mejor ${proveedor.categoria} ${proveedor.provincia || ''}"

TONO: Profesional, premium, aspiracional. Sin clichés.

Devuelve SOLO el HTML completo, sin explicaciones adicionales.`;

    try {
        const html = await callAbacusAPI(userPrompt, systemPrompt);
        return html;
    } catch (error) {
        console.error(`   ❌ Error generando ${proveedor.nombre}:`, error.message);
        return null;
    }
}

async function processBatch(proveedores, batchNum, totalBatches) {
    console.log(`\n📦 Procesando lote ${batchNum}/${totalBatches} (${proveedores.length} proveedores)...`);

    const promises = proveedores.map(async (proveedor) => {
        try {
            console.log(`   🤖 Generando: ${proveedor.nombre} (${proveedor.categoria})...`);

            const html = await generateProviderCard(proveedor);
            if (!html) return { success: false, proveedor };

            // Validar tamaño mínimo
            if (html.length < MIN_SIZE_BYTES) {
                console.log(`   ⚠️  Ficha muy corta (${html.length} bytes): ${proveedor.nombre}`);
                return { success: false, proveedor, reason: 'too_short' };
            }

            // Validar schema.org
            if (!html.includes('schema.org')) {
                console.log(`   ⚠️  Sin schema.org: ${proveedor.nombre}`);
                return { success: false, proveedor, reason: 'no_schema' };
            }

            // Guardar ficha
            const categoria = slugify(proveedor.categoria);
            const slug = proveedor.slug || slugify(proveedor.nombre);
            const outputPath = path.join(OUTPUT_DIR, categoria, `${slug}.html`);

            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
            fs.writeFileSync(outputPath, html, 'utf-8');

            console.log(`   ✅ Generada: ${outputPath} (${(html.length / 1024).toFixed(2)} KB)`);

            return {
                success: true,
                proveedor,
                path: outputPath,
                size: html.length
            };
        } catch (error) {
            console.log(`   ❌ Error: ${proveedor.nombre} - ${error.message}`);
            return { success: false, proveedor, error: error.message };
        }
    });

    const results = await Promise.all(promises);
    return results;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
    console.log('🚀 GENERADOR TURBO DE FICHAS HTML - ABACUS.AI DEEPSEEK-CHAT');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📦 Modelo: ${ABACUS_MODEL}`);
    console.log(`🎯 Paralelización: ${BATCH_SIZE} proveedores simultáneos`);
    console.log(`📏 Tamaño mínimo: ${MIN_SIZE_BYTES} bytes`);
    console.log(`🔍 Jaccard máximo: ${MAX_JACCARD}`);
    console.log('');

    // Verificar API key
    if (!ABACUS_API_KEY) {
        console.error('❌ ERROR: ABACUS_API_KEY no configurada');
        process.exit(1);
    }

    // Leer inventario
    console.log('📖 Leyendo inventario...');
    const inventario = JSON.parse(fs.readFileSync(INVENTARIO_PATH, 'utf-8'));
    const proveedoresSinFicha = inventario.proveedores.filter(p => !p.tiene_ficha_html);

    console.log(`✅ Inventario cargado: ${proveedoresSinFicha.length} proveedores sin ficha HTML\n`);

    // Procesar en lotes
    const totalBatches = Math.ceil(proveedoresSinFicha.length / BATCH_SIZE);
    const stats = {
        total: proveedoresSinFicha.length,
        generadas: 0,
        fallidas: 0,
        tamano_promedio: 0,
        inicio: new Date().toISOString()
    };

    for (let i = 0; i < proveedoresSinFicha.length; i += BATCH_SIZE) {
        const batch = proveedoresSinFicha.slice(i, i + BATCH_SIZE);
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;

        const results = await processBatch(batch, batchNum, totalBatches);

        // Actualizar estadísticas
        const exitosas = results.filter(r => r.success);
        stats.generadas += exitosas.length;
        stats.fallidas += results.filter(r => !r.success).length;

        if (exitosas.length > 0) {
            const tamanos = exitosas.map(r => r.size);
            stats.tamano_promedio = tamanos.reduce((a, b) => a + b, 0) / tamanos.length;
        }

        console.log(`\n📊 Progreso: ${stats.generadas}/${stats.total} (${((stats.generadas / stats.total) * 100).toFixed(2)}%)`);

        // Pausa entre lotes para no saturar API
        if (i + BATCH_SIZE < proveedoresSinFicha.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    // Generar resumen
    stats.fin = new Date().toISOString();
    stats.duracion_minutos = ((new Date(stats.fin) - new Date(stats.inicio)) / 60000).toFixed(2);

    fs.writeFileSync(RESUMEN_PATH, JSON.stringify(stats, null, 2), 'utf-8');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ GENERACIÓN COMPLETADA');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Fichas generadas: ${stats.generadas}/${stats.total}`);
    console.log(`❌ Fallidas: ${stats.fallidas}`);
    console.log(`📏 Tamaño promedio: ${(stats.tamano_promedio / 1024).toFixed(2)} KB`);
    console.log(`⏱️  Duración: ${stats.duracion_minutos} minutos`);
    console.log(`📄 Resumen guardado en: ${RESUMEN_PATH}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main().catch(console.error);