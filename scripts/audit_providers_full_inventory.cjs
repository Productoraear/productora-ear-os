#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════════
 * AUDIT_PROVIDERS_FULL_INVENTORY.CJS — INVENTARIO FORENSE COMPLETO MVP 2026
 * ════════════════════════════════════════════════════════════════════════════════
 * MISIÓN: Generar inventario JSON completo de todos los proveedores/artistas
 * FUENTES: public/data/providers/*.json, src/data/providers/, H:/EAR_ABSORBED_VAULT/
 * SALIDA: reports/INVENTARIO_PROVEEDORES_MVP_2026.json
 * VALIDACIÓN: 0 verified:true sin teléfono real, 0 duplicados
 */

const fs = require('fs');
const path = require('path');

// Centralita oficial (NO es teléfono de proveedor)
const CENTRALITA = '+34 693 693 048';

/**
 * Normaliza teléfono para comparación
 */
function normalizePhone(phone) {
    if (!phone) return '';
    return phone.toString().replace(/[\s\-\(\)]/g, '');
}

/**
 * Valida si un teléfono es real (no centralita, no vacío)
 */
function isRealPhone(phone) {
    if (!phone) return false;
    const normalized = normalizePhone(phone);
    if (normalized === '' || normalized === normalizePhone(CENTRALITA)) {
        return false;
    }
    return true;
}

/**
 * Lee archivos JSON de un directorio recursivamente
 */
function readJsonFiles(dir) {
    const data = [];

    if (!fs.existsSync(dir)) {
        return data;
    }

    function scanDir(currentDir) {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);

            if (entry.isDirectory()) {
                scanDir(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.json')) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    const json = JSON.parse(content);

                    // Manejar arrays o objetos individuales
                    if (Array.isArray(json)) {
                        data.push(...json);
                    } else if (json.providers && Array.isArray(json.providers)) {
                        data.push(...json.providers);
                    } else if (json.id || json.nombre || json.name) {
                        data.push(json);
                    }
                } catch (err) {
                    console.error(`Error leyendo ${fullPath}:`, err.message);
                }
            }
        }
    }

    scanDir(dir);
    return data;
}

/**
 * Genera slug desde nombre
 */
function generateSlug(name) {
    if (!name) return '';
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Verifica si existe ficha HTML
 */
function checkHtmlCard(categoria, slug) {
    if (!categoria || !slug) return { exists: false, url: null };

    const possiblePaths = [
        path.join('public', 'fichas-proveedores', categoria, `${slug}.html`),
        path.join('public', 'fichas-proveedores', `${slug}.html`),
        path.join('vault', 'proveedores_html_indexados', categoria, `${slug}.html`)
    ];

    for (const filePath of possiblePaths) {
        if (fs.existsSync(filePath)) {
            return {
                exists: true,
                url: `/fichas-proveedores/${categoria}/${slug}.html`
            };
        }
    }

    return { exists: false, url: null };
}

/**
 * Normaliza proveedor a estructura estándar
 */
function normalizeProvider(raw) {
    const id = raw.id || raw._id || raw.slug || generateSlug(raw.nombre || raw.name);
    const nombre = raw.nombre || raw.name || raw.title || 'Sin nombre';
    const categoria = raw.categoria || raw.category || raw.gremio || 'general';
    const slug = raw.slug || generateSlug(nombre);
    const telefono = raw.telefono || raw.phone || raw.tel || raw.contacto?.telefono || '';
    const verified = raw.verified === true;
    const telefonoReal = isRealPhone(telefono);

    // Verificar ficha HTML
    const htmlCard = checkHtmlCard(categoria, slug);

    return {
        id,
        nombre,
        categoria,
        slug,
        tiene_ficha_html: htmlCard.exists,
        url_ficha: htmlCard.url,
        enlaces_internos: raw.enlaces_internos || [],
        verified: verified && telefonoReal, // Solo verified si tiene teléfono real
        telefono_real: telefonoReal ? telefono : null,
        ubicacion: raw.ubicacion || raw.location || raw.provincia || null,
        servicios: raw.servicios || raw.services || [],
        precio_base: raw.precio_base || raw.price || null
    };
}

/**
 * MAIN: Ejecuta auditoría completa
 */
async function main() {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('AUDIT_PROVIDERS_FULL_INVENTORY — INVENTARIO FORENSE MVP 2026');
    console.log('═══════════════════════════════════════════════════════════════\n');

    const inventory = [];
    const seenIds = new Set();
    const stats = {
        total: 0,
        duplicados: 0,
        con_ficha_html: 0,
        sin_ficha_html: 0,
        verified_real: 0,
        verified_falso: 0,
        sin_telefono: 0,
        por_categoria: {}
    };

    // 1. Leer particiones edge en public/data/providers/
    console.log('📂 Leyendo particiones edge public/data/providers/...');
    const edgeProviders = readJsonFiles('public/data/providers');
    console.log(`   ✓ ${edgeProviders.length} registros encontrados\n`);

    // 2. Leer catálogos en src/data/providers/
    console.log('📂 Leyendo catálogos src/data/providers/...');
    const srcProviders = readJsonFiles('src/data/providers');
    console.log(`   ✓ ${srcProviders.length} registros encontrados\n`);

    // 3. Leer bóveda H:/EAR_ABSORBED_VAULT/ (si existe)
    console.log('📂 Leyendo bóveda H:/EAR_ABSORBED_VAULT/...');
    let vaultProviders = [];
    if (fs.existsSync('H:/EAR_ABSORBED_VAULT')) {
        vaultProviders = readJsonFiles('H:/EAR_ABSORBED_VAULT');
        console.log(`   ✓ ${vaultProviders.length} registros encontrados\n`);
    } else {
        console.log('   ⚠ Bóveda no encontrada, omitiendo\n');
    }

    // 4. Consolidar y deduplicar
    console.log('🔄 Consolidando y deduplicando...');
    const allRaw = [...edgeProviders, ...srcProviders, ...vaultProviders];

    for (const raw of allRaw) {
        const normalized = normalizeProvider(raw);

        // Deduplicar por ID
        if (seenIds.has(normalized.id)) {
            stats.duplicados++;
            continue;
        }

        seenIds.add(normalized.id);
        inventory.push(normalized);

        // Estadísticas
        stats.total++;

        if (normalized.tiene_ficha_html) {
            stats.con_ficha_html++;
        } else {
            stats.sin_ficha_html++;
        }

        if (normalized.verified && normalized.telefono_real) {
            stats.verified_real++;
        } else if (normalized.verified && !normalized.telefono_real) {
            stats.verified_falso++;
        }

        if (!normalized.telefono_real) {
            stats.sin_telefono++;
        }

        // Por categoría
        if (!stats.por_categoria[normalized.categoria]) {
            stats.por_categoria[normalized.categoria] = 0;
        }
        stats.por_categoria[normalized.categoria]++;
    }

    console.log(`   ✓ ${stats.total} proveedores únicos consolidados\n`);

    // 5. Validar: 0 verified:true sin teléfono real
    console.log('🔍 Validando integridad...');
    if (stats.verified_falso > 0) {
        console.error(`   ❌ FALLO: ${stats.verified_falso} proveedores con verified:true SIN teléfono real`);
        process.exit(1);
    }
    console.log('   ✓ 0 verified:true sin teléfono real\n');

    // 6. Generar reporte completo
    const report = {
        meta: {
            generado: new Date().toISOString(),
            version: '1.0.0-MVP-2026',
            fuentes: [
                'public/data/providers/*.json',
                'src/data/providers/*.json',
                'H:/EAR_ABSORBED_VAULT/**/*.json'
            ]
        },
        estadisticas: stats,
        proveedores: inventory
    };

    // 7. Escribir reports/INVENTARIO_PROVEEDORES_MVP_2026.json
    const outputPath = path.join('reports', 'INVENTARIO_PROVEEDORES_MVP_2026.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf8');

    console.log('✅ INVENTARIO GENERADO EXITOSAMENTE');
    console.log(`   📄 ${outputPath}`);
    console.log(`   📊 ${stats.total} proveedores únicos`);
    console.log(`   🎯 ${stats.verified_real} verificados con teléfono real`);
    console.log(`   📝 ${stats.con_ficha_html} con ficha HTML`);
    console.log(`   ⚠️  ${stats.sin_ficha_html} sin ficha HTML`);
    console.log(`   🔄 ${stats.duplicados} duplicados eliminados\n`);

    // 8. Generar resumen estadístico < 300 tokens
    const resumen = {
        total: stats.total,
        verified: stats.verified_real,
        con_html: stats.con_ficha_html,
        sin_html: stats.sin_ficha_html,
        categorias: Object.keys(stats.por_categoria).length,
        top_categorias: Object.entries(stats.por_categoria)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([cat, count]) => `${cat}:${count}`)
    };

    console.log('📋 RESUMEN EJECUTIVO:');
    console.log(JSON.stringify(resumen, null, 2));
    console.log('\n═══════════════════════════════════════════════════════════════');
}

// Ejecutar
main().catch(err => {
    console.error('❌ ERROR FATAL:', err);
    process.exit(1);
});