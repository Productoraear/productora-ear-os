#!/usr/bin/env node
/**
 * GUARDIÁN DE PUBLICACIÓN DE SITEMAP — NO DESTRUCTIVO Y AUTOCONTENIDO
 * -------------------------------------------------------------------
 * No depende de tsx/ts-node: genera y valida el índice semántico con
 * Node puro. Estrategia:
 *
 *  1. Copia de seguridad previa SIEMPRE (nunca se sobrescribe sin backup).
 *  2. Generación del índice con dominio canónico (productoraear.com).
 *  3. Validación estricta: JSON válido, URLs canónicas, sin duplicados.
 *  4. Solo con validación OK se deja el archivo publicado (Exit Code 0).
 *  5. Si algo falla, el índice anterior permanece intacto (Exit Code 1).
 *
 * El sitemap real de producción (/sitemap.xml) lo regenera Next.js en cada
 * `next build` desde src/app/sitemap.ts — es el que Google consume y ya
 * incluye /mariachis y /mariachis/unirse. Este script cubre el índice
 * semántico interno para pSEO y se programa como paso previo al build.
 *
 * Uso:
 *   node scripts/publish_sitemap_guard.cjs
 *   node scripts/publish_sitemap_guard.cjs --dry-run
 *
 * Automatización (Coolify / CI / n8n): ejecutar antes de `next build`.
 * Un exit != 0 aborta el despliegue y preserva la versión anterior.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'data');
const TARGET = path.join(DATA_DIR, 'sitemap_routes_index.json');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const DRY_RUN = process.argv.includes('--dry-run');
const BASE_URL = 'https://productoraear.com';

// Servicios pSEO canónicos (los mismos que alimentan el mesh semántico).
const SERVICIOS = [
    'mariachis',
    'musica-para-bodas',
    'sonorizacion-eventos',
    'conciertos-fiestas-patronales',
    'iluminacion-navidad',
    'viaje-musical-por-la-memoria',
];

// 52 provincias (formato slug). Provincias reales que renderizan rutas.
const PROVINCIAS = [
    'madrid', 'toledo', 'cadiz', 'sevilla', 'barcelona', 'valencia', 'malaga', 'alicante',
    'zaragoza', 'murcia', 'granada', 'cordoba', 'valladolid', 'baleares', 'las-palmas',
    'santa-cruz-de-tenerife', 'asturias', 'a-coruna', 'albacete', 'almeria', 'avila',
    'badajoz', 'burgos', 'caceres', 'cantabria', 'castellon', 'ciudad-real', 'cuenca',
    'girona', 'guadalajara', 'guipuzcoa', 'huelva', 'huesca', 'jaen', 'la-rioja', 'leon',
    'lleida', 'lugo', 'navarra', 'ourense', 'palencia', 'pontevedra', 'salamanca',
    'segovia', 'soria', 'tarragona', 'teruel', 'zamora', 'bizkaia', 'araba', 'ceuta', 'melilla',
];

function log(msg) {
    console.log(`[SITEMAP-GUARD] ${msg}`);
}

function timestamp() {
    return new Date().toISOString().replace(/[:.]/g, '-');
}

function buildRoutes() {
    const staticRoutes = [
        '',
        '/mariachis',
        '/mariachis/unirse',
        '/eventos/municipales',
        '/ayuntamientos',
        '/vimume',
        '/artistas',
        '/artistas/edwin-agudelo',
        '/academia',
        '/fincas',
        '/proveedores',
        '/bodas',
    ];

    const routes = staticRoutes.map((p) => `${BASE_URL}${p}`);

    // Cruce semántico servicio x provincia (pSEO real).
    for (const s of SERVICIOS) {
        for (const p of PROVINCIAS) {
            routes.push(`${BASE_URL}/servicios/${s}/${p}`);
        }
    }

    return routes;
}

function validateIndex(routes) {
    if (!Array.isArray(routes) || routes.length === 0) {
        throw new Error('El índice está vacío o no es un array.');
    }

    const canonicalRegex = /^https:\/\/[a-z0-9.-]+\.[a-z]{2,}(\/[^\s]*)?$/i;
    const seen = new Set();
    const duplicates = [];

    for (const route of routes) {
        if (typeof route !== 'string' || !canonicalRegex.test(route)) {
            throw new Error(`URL inválida detectada: ${String(route)}`);
        }
        if (seen.has(route)) {
            duplicates.push(route);
        }
        seen.add(route);
    }

    if (duplicates.length > 0) {
        throw new Error(`Duplicados detectados (${duplicates.length}): ${duplicates[0]}`);
    }

    return { total: routes.length };
}

function main() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // 1. Copia de seguridad previa (nunca destructivo).
    if (!DRY_RUN && fs.existsSync(TARGET)) {
        if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
        const backupPath = path.join(BACKUP_DIR, `sitemap_routes_index.${timestamp()}.json`);
        fs.copyFileSync(TARGET, backupPath);
        log(`Copia de seguridad: ${path.relative(ROOT, backupPath)}`);
    }

    // 2. Generar índice semántico.
    const routes = buildRoutes();
    const { total } = validateIndex(routes);

    const payload = JSON.stringify(routes, null, 2);

    if (DRY_RUN) {
        log(`[DRY-RUN] ${total} URLs válidas y sin duplicados. No se escribió nada.`);
        return;
    }

    // 3. Escritura atómica (temp + rename) tras validación.
    const tmp = `${TARGET}.tmp`;
    fs.writeFileSync(tmp, payload, 'utf-8');
    fs.renameSync(tmp, TARGET);

    log(`Publicación segura: ${total} URLs validadas. Exit Code 0.`);
}

try {
    main();
    process.exit(0);
} catch (err) {
    console.error('[SITEMAP-GUARD] ABORTADO. El índice anterior permanece intacto.');
    console.error(err && err.message ? err.message : err);
    process.exit(1);
}