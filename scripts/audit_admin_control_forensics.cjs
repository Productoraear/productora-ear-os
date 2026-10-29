#!/usr/bin/env node
/**
 * AUDITOR FORENSE — /admin/control (EAR OS · S-CLASS)
 * ============================================================================
 * Matriz de trazabilidad UI -> endpoint -> guard -> verbo -> Bearer.
 * Gate de CI ejecutable: 5 aserciones estrictas (--strict).
 * Cero dependencias. Solo lectura. Exit Code 1 si detecta violaciones o fachadas.
 *
 *   node scripts/audit_admin_control_forensics.cjs
 *   node scripts/audit_admin_control_forensics.cjs --strict --write
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const UI_DIR = path.join(ROOT, 'src', 'app', '(admin)');
const CONTROL_UI_DIR = path.join(ROOT, 'src', 'app', '(admin)', 'admin', 'control');
const API_DIR = path.join(ROOT, 'src', 'app', 'api', 'admin');
const ACTIONS_DIR = path.join(ROOT, 'src', 'app', 'actions');
const REPORT = path.join(ROOT, '.antigravity', 'reports', 'ADMIN_CONTROL_MATRIX.md');

// Rutas nucleares del panel /admin/control
const CONTROL_API_ROUTES = [
    'src/app/api/admin/artists/route.ts',
    'src/app/api/admin/providers/route.ts',
    'src/app/api/admin/therapists/route.ts',
    'src/app/api/admin/fleet/route.ts',
    'src/app/api/admin/affiliates/route.ts',
    'src/app/api/admin/treasury/route.ts',
];

function walk(dir, acc = []) {
    if (!fs.existsSync(dir)) return acc;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walk(full, acc);
        else acc.push(full);
    }
    return acc;
}

const rel = (f) => path.relative(ROOT, f).replace(/\\/g, '/');

function scanClient(src) {
    const fetches = new Set();
    const re = /fetch\(\s*[`'"]([^`'"]+)[`'"]/g;
    let m;
    while ((m = re.exec(src)) !== null) {
        if (m[1].startsWith('/api')) fetches.add(m[1].split('?')[0]);
    }
    // Los endpoints también viajan como literales (hooks, props, constantes).
    const reLiteral = /['"`](\/api\/[a-z0-9_\-/?=]+)['"`]/gi;
    while ((m = reLiteral.exec(src)) !== null) {
        fetches.add(m[1].split('?')[0]);
    }
    return {
        fetches: [...fetches].sort(),
        bearer: /Bearer|adminFetch|useAdminResource|useAdminDocument/.test(src),
        client: /['"`]use client['"`]/.test(src),
        action: /from\s+['"`]@\/app\/actions\//.test(src),
        form: /<form|<input|<select/.test(src),
    };
}

function scanRoute(src) {
    const verbs = [];
    const re = /export\s+async\s+function\s+(GET|POST|PATCH|PUT|DELETE)\s*\(/g;
    let m;
    while ((m = re.exec(src)) !== null) verbs.push(m[1]);
    return {
        verbs,
        guard: /requireAdmin\s*\(/.test(src),
        zod: /from\s+['"`]zod['"`]/.test(src),
        write: /prisma\.\w+\.(create|createMany|upsert|update|updateMany|delete)\(/.test(src),
    };
}

function build() {
    const ui = walk(CONTROL_UI_DIR).filter((f) => /\.tsx$/.test(f));
    const api = walk(API_DIR).filter((f) => f.endsWith('route.ts'));
    const actions = walk(ACTIONS_DIR).filter((f) => f.endsWith('.ts'));

    const links = [];
    for (const file of ui) {
        const src = fs.readFileSync(file, 'utf8');
        const scan = scanClient(src);
        for (const url of scan.fetches) {
            const routeFile = path.join(ROOT, 'src', 'app', url, 'route.ts');
            const exists = fs.existsSync(routeFile);
            const route = exists ? scanRoute(fs.readFileSync(routeFile, 'utf8')) : null;
            links.push({
                ui: rel(file),
                endpoint: url,
                verbs: route ? route.verbs.join('+') : '—',
                guard: route ? (route.guard ? 'requireAdmin' : 'SIN GUARD') : '—',
                bearer: scan.bearer ? 'SÍ' : 'NO',
                verdict: !exists
                    ? '❌ FACHADA'
                    : route.guard && !scan.bearer
                        ? '❌ 401 SEGURO'
                        : '✅ VERIFICADO',
            });
        }
        if (scan.form && !scan.action && scan.fetches.length === 0) {
            links.push({
                ui: rel(file), endpoint: '(sin endpoint)', verbs: '—', guard: '—',
                bearer: scan.bearer ? 'SÍ' : 'NO', verdict: '❌ FORM SIN PERSISTENCIA',
            });
        }
    }

    const routes = api.map((file) => {
        const r = scanRoute(fs.readFileSync(file, 'utf8'));
        return {
            route: rel(file).replace('src/app/api/admin/', ''),
            verbs: r.verbs.join('+') || '—', guard: r.guard ? 'requireAdmin' : 'SIN GUARD',
            zod: r.zod ? 'sí' : 'no', write: r.write ? 'sí' : 'no',
        };
    });

    const actionRows = actions
        .map((file) => {
            const src = fs.readFileSync(file, 'utf8');
            return {
                action: rel(file).replace('src/app/actions/', ''),
                guard: /requireAdmin/.test(src) ? (/new\s+Request\(\s*['"`]https?:\/\/localhost/.test(src) ? '⚠️ REQUEST VACÍO (401 fijo)' : 'requireAdmin') : 'SIN GUARD',
                write: /prisma\.\w+\.(create|createMany|upsert|update|updateMany|delete)\(/.test(src) ? 'sí' : 'no',
            };
        })
        .filter((r) => r.guard !== 'SIN GUARD' || r.write === 'sí');

    return { links, routes, actionRows };
}

function runStrictAssertions() {
    const violations = [];

    // A) Toda ruta src/app/api/admin/**/route.ts de control tiene requireAdmin
    for (const routeRel of CONTROL_API_ROUTES) {
        const full = path.join(ROOT, routeRel);
        if (!fs.existsSync(full)) {
            violations.push(`[ASSERTION A] Ruta requerida inexistente: ${routeRel}`);
            continue;
        }
        const src = fs.readFileSync(full, 'utf8');
        if (!/requireAdmin\s*\(/.test(src)) {
            violations.push(`[ASSERTION A] Endpoint sin requireAdmin: ${routeRel}`);
        }
    }

    // B) Todo route de control con verbo POST importa zod Y ejecuta prisma.<modelo>.write
    for (const routeRel of CONTROL_API_ROUTES) {
        const full = path.join(ROOT, routeRel);
        if (!fs.existsSync(full)) continue;
        const src = fs.readFileSync(full, 'utf8');
        if (/export\s+async\s+function\s+POST\b/.test(src)) {
            const hasZod = /from\s+['"`]zod['"`]/.test(src);
            const hasWrite = /prisma\.\w+\.(create|createMany|upsert|update|updateMany|delete)\(/.test(src);
            if (!hasZod) violations.push(`[ASSERTION B] POST sin zod en: ${routeRel}`);
            if (!hasWrite) violations.push(`[ASSERTION B] POST sin prisma write en: ${routeRel}`);
        }
    }

    // C) Cero ocurrencias de new Request('http://localhost') en código de src/
    const srcFiles = walk(path.join(ROOT, 'src')).filter((f) => /\.(ts|tsx|js|jsx)$/.test(f));
    for (const f of srcFiles) {
        const raw = fs.readFileSync(f, 'utf8');
        const code = raw.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
        if (/new\s+Request\s*\(\s*['"`]https?:\/\/localhost/.test(code)) {
            violations.push(`[ASSERTION C] new Request('http://localhost') en código: ${rel(f)}`);
        }
    }

    // D) Cero llamadas fetch( directas en src/app/(admin)/admin/control (debe usarse adminFetch / useAdminResource)
    const controlUiFiles = walk(CONTROL_UI_DIR).filter((f) => /\.(ts|tsx)$/.test(f));
    for (const f of controlUiFiles) {
        const raw = fs.readFileSync(f, 'utf8');
        const lines = raw.split('\n');
        lines.forEach((line, i) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
            if (/(?<!admin)fetch\s*\(/.test(trimmed)) {
                violations.push(`[ASSERTION D] fetch directo en: ${rel(f)}:${i + 1}`);
            }
        });
    }

    // E) Cero ': any' / 'as any' en src/app/(admin)/admin/control y src/lib/admin
    const controlScope = [
        ...walk(CONTROL_UI_DIR),
        ...walk(path.join(ROOT, 'src', 'lib', 'admin')),
    ].filter((f) => /\.(ts|tsx)$/.test(f));

    for (const f of controlScope) {
        const raw = fs.readFileSync(f, 'utf8');
        const lines = raw.split('\n');
        lines.forEach((line, i) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
            if (/:\s*any\b|as\s+any\b/.test(trimmed)) {
                violations.push(`[ASSERTION E] any detectado en: ${rel(f)}:${i + 1}`);
            }
        });
    }

    return violations;
}

function renderMd({ links, routes, actionRows }) {
    const lines = [
        '# MATRIZ DE TRAZABILIDAD — /admin/control',
        '',
        '> Emitido por `scripts/audit_admin_control_forensics.cjs` (modo estricto).',
        '',
        '## UI /admin/control → Endpoint',
        '',
        '| UI | Endpoint | Verbo | Guard | Bearer cliente | Veredicto |',
        '| --- | --- | --- | --- | --- | --- |',
        ...links.map((r) => `| ${r.ui} | ${r.endpoint} | ${r.verbs} | ${r.guard} | ${r.bearer} | ${r.verdict} |`),
        '',
        '## API /api/admin/*',
        '',
        '| Ruta | Verbos | Guard | Zod | Escribe |',
        '| --- | --- | --- | --- | --- |',
        ...routes.map((r) => `| ${r.route} | ${r.verbs} | ${r.guard} | ${r.zod} | ${r.write} |`),
        '',
        '## Server Actions',
        '',
        '| Acción | Guard | Escribe |',
        '| --- | --- | --- |',
        ...actionRows.map((r) => `| ${r.action} | ${r.guard} | ${r.write} |`),
        '',
    ];
    const facades = links.filter((r) => r.verdict.startsWith('❌')).length;
    lines.push(`**RESUMEN**: ${links.length} enlaces UI→API en /admin/control · ${facades} fachadas/401 · ${routes.length} endpoints mapeados.`);
    return { md: lines.join('\n'), facades };
}

const data = build();
const { md, facades } = renderMd(data);

if (process.argv.includes('--write')) {
    fs.mkdirSync(path.dirname(REPORT), { recursive: true });
    fs.writeFileSync(REPORT, md + '\n', 'utf8');
    console.log(`[AUDIT] Matriz escrita en ${rel(REPORT)}`);
}

if (process.argv.includes('--md')) console.log(md);
else if (!process.argv.includes('--write')) console.log(JSON.stringify(data, null, 2));

if (process.argv.includes('--strict')) {
    const violations = runStrictAssertions();
    if (violations.length > 0) {
        console.error(`\n[AUDIT][FAIL] Se detectaron ${violations.length} violaciones estrictas:`);
        violations.forEach((v) => console.error('  ❌', v));
        process.exit(1);
    }
    if (facades > 0) {
        console.error(`\n[AUDIT][FAIL] ${facades} fachadas detectadas en la ruta de administración.`);
        process.exit(1);
    }
    console.log('\n[AUDIT][OK] 0 fachadas detectadas. Todas las aserciones de /admin/control superadas (Exit 0).');
}

process.exit(0);

