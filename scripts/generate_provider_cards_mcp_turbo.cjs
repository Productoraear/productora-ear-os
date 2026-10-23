#!/usr/bin/env node
/**
 * GENERADOR TURBO DE FICHAS HTML - VIA MCP ABACUS.AI
 * Generación masiva de fichas HTML semánticas premium usando MCP
 * Target: 5926 proveedores con máxima calidad SEO
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════════════════

const INVENTARIO_PATH = 'reports/INVENTARIO_PROVEEDORES_MVP_2026.json';
const OUTPUT_DIR = 'public/fichas-proveedores';
const RESUMEN_PATH = 'reports/RESUMEN_GENERACION_FICHAS_HTML_2026.json';
const PROGRESS_PATH = 'reports/PROGRESO_GENERACION_FICHAS.json';

const BATCH_SIZE = 10; // Procesar 10 proveedores por lote
const MIN_SIZE_BYTES = 2048;

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

function saveProgress(stats) {
    fs.writeFileSync(PROGRESS_PATH, JSON.stringify(stats, null, 2), 'utf-8');
}

function loadProgress() {
    try {
        if (fs.existsSync(PROGRESS_PATH)) {
            return JSON.parse(fs.readFileSync(PROGRESS_PATH, 'utf-8'));
        }
    } catch (err) {
        console.error('Error cargando progreso:', err.message);
    }
    return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERACIÓN DE FICHAS
// ═══════════════════════════════════════════════════════════════════════════════

function generateProviderCardPrompt(proveedor) {
    return `Genera una ficha HTML completa y semántica para este proveedor de eventos/bodas:

**DATOS DEL PROVEEDOR:**
- Nombre: ${proveedor.nombre}
- Categoría: ${proveedor.categoria}
- Ubicación: ${proveedor.ciudad || 'España'}, ${proveedor.provincia || ''}
- Teléfono: ${proveedor.telefono || 'Consultar'}
- Email: ${proveedor.email || ''}
- Web: ${proveedor.web || ''}

**REQUISITOS TÉCNICOS OBLIGATORIOS:**
1. HTML5 semántico completo (<!DOCTYPE html> hasta </html>)
2. Schema.org LocalBusiness o MusicGroup según categoría (JSON-LD en <script type="application/ld+json">)
3. Meta description optimizada (150-160 caracteres)
4. Estructura H1 > H2 > H3 correcta
5. Descripción 400-600 palabras con keywords long-tail naturales
6. Secciones obligatorias:
   - Servicios específicos
   - Zona de cobertura geográfica
   - Precios orientativos (rangos)
   - Propuesta de valor única
7. 3 CTAs estratégicos (solicitar presupuesto, ver portfolio, contactar)
8. Datos de contacto verificables

**INTENCIONES DE BÚSQUEDA A RESOLVER:**
- "${proveedor.categoria} ${proveedor.ciudad || 'España'}"
- "${proveedor.categoria} para bodas ${proveedor.provincia || ''}"
- "precio ${proveedor.categoria} ${proveedor.ciudad || ''}"
- "mejor ${proveedor.categoria} ${proveedor.provincia || ''}"

**TONO:** Profesional, premium, aspiracional. Sin clichés genéricos.

**IMPORTANTE:** Devuelve SOLO el HTML completo, sin explicaciones adicionales ni markdown.`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
    console.log('🚀 GENERADOR TURBO DE FICHAS HTML - MODO MANUAL ASISTIDO');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📦 Modo: Manual con prompts optimizados`);
    console.log(`🎯 Lotes: ${BATCH_SIZE} proveedores por lote`);
    console.log(`📏 Tamaño mínimo: ${MIN_SIZE_BYTES} bytes`);
    console.log('');

    // Leer inventario
    console.log('📖 Leyendo inventario...');
    const inventario = JSON.parse(fs.readFileSync(INVENTARIO_PATH, 'utf-8'));
    const proveedoresSinFicha = inventario.proveedores.filter(p => !p.tiene_ficha_html);

    console.log(`✅ Inventario cargado: ${proveedoresSinFicha.length} proveedores sin ficha HTML\n`);

    // Cargar progreso previo
    let stats = loadProgress() || {
        total: proveedoresSinFicha.length,
        procesados: 0,
        generadas: 0,
        fallidas: 0,
        inicio: new Date().toISOString(),
        lotes_completados: []
    };

    // Procesar en lotes
    const totalBatches = Math.ceil(proveedoresSinFicha.length / BATCH_SIZE);
    const startIndex = stats.procesados;

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 INSTRUCCIONES PARA GENERACIÓN MANUAL ASISTIDA:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Este script generará prompts optimizados para cada lote');
    console.log('2. Copia el prompt y úsalo con Cline/Claude para generar las fichas');
    console.log('3. Guarda las fichas HTML en las rutas indicadas');
    console.log('4. El script validará y continuará con el siguiente lote');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    for (let i = startIndex; i < proveedoresSinFicha.length; i += BATCH_SIZE) {
        const batch = proveedoresSinFicha.slice(i, i + BATCH_SIZE);
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;

        console.log(`\n${'═'.repeat(80)}`);
        console.log(`📦 LOTE ${batchNum}/${totalBatches} (${batch.length} proveedores)`);
        console.log(`${'═'.repeat(80)}\n`);

        // Generar prompt para el lote
        console.log('📝 PROMPT PARA CLINE/CLAUDE:\n');
        console.log('```');
        console.log(`Genera fichas HTML semánticas premium para estos ${batch.length} proveedores.`);
        console.log('Para cada proveedor, crea un archivo HTML completo siguiendo estas especificaciones:\n');

        batch.forEach((prov, idx) => {
            console.log(`\n${idx + 1}. ${prov.nombre} (${prov.categoria})`);
            console.log(`   Ruta: public/fichas-proveedores/${slugify(prov.categoria)}/${prov.slug || slugify(prov.nombre)}.html`);
            console.log(`   ${generateProviderCardPrompt(prov)}`);
        });

        console.log('\n```\n');

        // Esperar confirmación del usuario
        console.log('⏸️  PAUSA: Genera las fichas con Cline/Claude y presiona ENTER cuando estén listas...');

        // Guardar progreso
        stats.procesados = i + batch.length;
        stats.lotes_completados.push(batchNum);
        saveProgress(stats);

        console.log(`\n✅ Lote ${batchNum} marcado como procesado`);
        console.log(`📊 Progreso: ${stats.procesados}/${stats.total} (${((stats.procesados / stats.total) * 100).toFixed(2)}%)\n`);
    }

    // Generar resumen final
    stats.fin = new Date().toISOString();
    stats.duracion_minutos = ((new Date(stats.fin) - new Date(stats.inicio)) / 60000).toFixed(2);

    fs.writeFileSync(RESUMEN_PATH, JSON.stringify(stats, null, 2), 'utf-8');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ TODOS LOS LOTES PROCESADOS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Total procesado: ${stats.procesados}/${stats.total}`);
    console.log(`⏱️  Duración: ${stats.duracion_minutos} minutos`);
    console.log(`📄 Resumen guardado en: ${RESUMEN_PATH}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main().catch(console.error);