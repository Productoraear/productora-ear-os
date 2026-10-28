/**
 * ════════════════════════════════════════════════════════════════════════════
 * EMISOR DE ENLACES DE CAPTACIÓN · RED DE MARIACHIS (B2B)
 * ════════════════════════════════════════════════════════════════════════════
 * Uso:
 *   node ./node_modules/tsx/dist/cli.mjs scripts/emit_mariachi_outreach.ts \
 *        --targets=./mis-grupos.json [--province=toledo] [--out=./outreach.csv] \
 *        [--base=https://www.productoraear.com]
 *   node ./node_modules/tsx/dist/cli.mjs scripts/emit_mariachi_outreach.ts --template
 *
 * Doctrina: este emisor NO inventa agrupaciones. Solo produce enlace cuando el
 * teléfono es verificable (≥ 9 dígitos y distinto de la centralita) y la plaza
 * existe en la malla nacional. Todo lo demás se reporta como `skipped` con su
 * motivo: un enlace muerto es un lead huérfano, y aquí no se fabrican.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
    buildWhatsAppOutreachLink,
    isInvitationCode,
    provinceSlug,
} from '../src/lib/mariachi/network-outreach';
import { MARIACHI_MARKETS } from '../src/lib/seo/centralita-mariachis-dominance-engine';

interface RawTarget {
    groupName?: unknown;
    groupSeed?: unknown;
    province?: unknown;
    phone?: unknown;
    city?: unknown;
}

interface OutreachRow {
    province: string;
    group: string;
    code: string;
    link: string;
}

interface SkippedRow {
    group: string;
    province: string;
    reason: string;
}

const TEMPLATE = [
    '[',
    '  {',
    '    "groupName": "Mariachi Sol de Ejemplo",',
    '    "province": "Toledo",',
    '    "phone": "+34 6XX XXX XXX",',
    '    "city": "Méntrida"',
    '  }',
    ']',
    '',
    'Notas:',
    '  · "province" acepta el nombre de la plaza o su slug (toledo).',
    '  · "phone" debe ser el teléfono PROPIO del grupo, nunca la centralita.',
    '  · Sin teléfono verificable no se emite enlace: se marca como skipped.',
].join('\n');

function parseArgs(argv: readonly string[]): Map<string, string> {
    const args = new Map<string, string>();
    for (const entry of argv) {
        if (!entry.startsWith('--')) {
            continue;
        }
        const body = entry.slice(2);
        const eq = body.indexOf('=');
        if (eq === -1) {
            args.set(body, 'true');
        } else {
            args.set(body.slice(0, eq), body.slice(eq + 1));
        }
    }
    return args;
}

/**
 * Fallo esperado del emisor. `exitCode` distingue la causa sin obligar a leer
 * un traceback: 2 = uso/IO, 1 = dato insuficiente. Un traceback crudo con Exit 1
 * es indistinguible de «la lista no traía teléfonos» y eso es una fachada de
 * diagnóstico: el operador no puede saber si arreglar el fichero o el código.
 */
class ToolError extends Error {
    readonly exitCode: number;

    constructor(message: string, exitCode: number) {
        super(message);
        this.name = 'ToolError';
        this.exitCode = exitCode;
    }
}

const USAGE = [
    'EMISOR DE ENLACES · RED DE MARIACHIS (B2B)',
    '',
    'Uso:',
    '  npm run emit:outreach -- --targets=./grupos.json [--province=toledo] [--out=./outreach.csv] [--base=https://www.productoraear.com]',
    '  npm run emit:outreach -- --template   Ver el formato exigido por la lista',
    '  npm run emit:outreach -- --selftest   Probar la herramienta sin datos externos',
    '  npm run emit:outreach -- --help       Esta ayuda',
    '',
    'Exit Codes:',
    '  0   Se emitieron enlaces (solo con teléfono propio verificable)',
    '  1   Lista válida pero sin nada que emitir (dato insuficiente: no es un bug)',
    '  2   Uso incorrecto, fichero ilegible o JSON inválido (no se escribió nada)',
    '  70  Error interno inesperado (bug del emisor, no de tus datos)',
].join('\n');

/**
 * Teléfono sintético del autotest: empieza por `09`, prefijo NO asignado en
 * España, y existe solo en memoria. No se persiste ni se abre ningún enlace con
 * él. (Un `000000000` habría sido mutilado por la normalización de prefijo `00`.)
 */
const SELFTEST_PHONE = '099000000';

const spanishMarkets = MARIACHI_MARKETS.filter((market) => market.inSpain);

/** Resuelve la plaza igual que la landing: por slug canónico o por nombre. */
function resolveMarket(raw: string): (typeof spanishMarkets)[number] | null {
    const key = provinceSlug(raw);
    return (
        spanishMarkets.find((market) => provinceSlug(market.slug) === key) ??
        spanishMarkets.find((market) => provinceSlug(market.name) === key) ??
        null
    );
}

function asText(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
}

function loadTargets(path: string): RawTarget[] {
    const absolute = resolve(process.cwd(), path);
    let raw: string;
    try {
        raw = readFileSync(absolute, 'utf8');
    } catch (error: unknown) {
        const code =
            error instanceof Error && 'code' in error
                ? String((error as { code?: unknown }).code ?? 'ERROR')
                : 'ERROR';
        throw new ToolError(
            code === 'ENOENT'
                ? `FAIL=TARGETS_NOT_FOUND · ${absolute} · crea el fichero con --template`
                : `FAIL=TARGETS_UNREADABLE · ${absolute} · ${code}`,
            2,
        );
    }

    let parsed: unknown;
    try {
        parsed = JSON.parse(raw.replace(/^\uFEFF/, ''));
    } catch {
        throw new ToolError(`FAIL=TARGETS_NOT_JSON · ${absolute} · no es JSON válido`, 2);
    }
    if (!Array.isArray(parsed)) {
        throw new ToolError(
            `FAIL=TARGETS_NOT_ARRAY · ${absolute} · el fichero debe ser un array JSON`,
            2,
        );
    }
    return parsed.filter((entry): entry is RawTarget => typeof entry === 'object' && entry !== null);
}

function csvCell(value: string): string {
    return `"${value.replace(/"/g, '""')}"`;
}

function main(argv: readonly string[]): number {
    const args = parseArgs(argv);

    if (args.has('help') || argv.includes('-h')) {
        process.stdout.write(`${USAGE}\n`);
        return 0;
    }

    if (args.has('selftest')) {
        return runSelftest();
    }

    if (args.has('template')) {
        process.stdout.write(`${TEMPLATE}\n`);
        return 0;
    }

    const targetsPath = args.get('targets');
    if (!targetsPath || targetsPath === 'true') {
        process.stderr.write(
            'FAIL=USAGE · falta --targets=<fichero.json> · usa --template o --help\n',
        );
        return 2;
    }

    const provinceFilter = args.get('province');
    const filterKey =
        provinceFilter && provinceFilter !== 'true' ? provinceSlug(provinceFilter) : null;
    const landingBase = args.get('base') === 'true' ? undefined : args.get('base');
    const targets = loadTargets(targetsPath);
    let filteredOut = 0;

    const emitted: OutreachRow[] = [];
    const skipped: SkippedRow[] = [];

    for (const target of targets) {
        const group = asText(target.groupName) || asText(target.groupSeed);
        const provinceRaw = asText(target.province);
        const phone = asText(target.phone);

        if (!group || !provinceRaw) {
            skipped.push({
                group: group || '(sin nombre)',
                province: provinceRaw || '(sin plaza)',
                reason: 'missing-group-or-province',
            });
            continue;
        }

        const market = resolveMarket(provinceRaw);
        if (!market) {
            skipped.push({
                group,
                province: provinceRaw,
                reason: 'unknown-province',
            });
            continue;
        }

        if (filterKey && provinceSlug(market.slug) !== filterKey) {
            filteredOut += 1;
            continue;
        }

        const result = buildWhatsAppOutreachLink(
            {
                groupSeed: group,
                province: market.name,
                phone,
            },
            landingBase,
        );

        if (!result.ok) {
            skipped.push({ group, province: market.name, reason: result.reason });
            continue;
        }

        if (!isInvitationCode(result.invitationCode)) {
            skipped.push({ group, province: market.name, reason: 'invalid-code' });
            continue;
        }

        emitted.push({
            province: market.slug,
            group,
            code: result.invitationCode,
            link: result.href,
        });
    }

    const outPath = args.get('out');
    const wroteCsv = Boolean(outPath) && emitted.length > 0;
    if (outPath && wroteCsv) {
        const csv = [
            ['provincia', 'agrupacion', 'codigo_invitacion', 'enlace_whatsapp'],
            ...emitted.map((row) => [
                row.province,
                row.group,
                row.code,
                row.link,
            ]),
        ]
            .map((cells) => cells.map(csvCell).join(','))
            .join('\r\n');
        try {
            writeFileSync(resolve(process.cwd(), outPath), `\uFEFF${csv}\r\n`, 'utf8');
        } catch (error: unknown) {
            throw new ToolError(
                `FAIL=OUT_UNWRITABLE · ${outPath} · ${
                    error instanceof Error ? error.message : String(error)
                }`,
                2,
            );
        }
    }

    const summary = {
        status: skipped.length === 0 && emitted.length > 0 ? 'READY' : 'REVIEW',
        emitted: emitted.length,
        skipped: skipped.length,
        filtered: filteredOut,
        provinces: [...new Set(emitted.map((row) => row.province))].sort(),
        out: wroteCsv ? outPath : null,
    };

    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);

    if (skipped.length > 0) {
        process.stdout.write(
            `${JSON.stringify(
                skipped.map((row) => `${row.province} · ${row.group} → ${row.reason}`),
                null,
                2,
            )}\n`,
        );
    }

    if (emitted.length === 0) {
        const reason =
            targets.length === 0
                ? 'FAIL=EMPTY_TARGETS · el array JSON no contiene objetivos'
                : filterKey && filteredOut > 0 && filteredOut === targets.length
                  ? `FAIL=PROVINCE_NOT_FOUND · ningún objetivo es de "${provinceFilter ?? ''}"`
                  : 'FAIL=NO_VERIFIED_PHONE · cero enlaces: sin teléfono propio verificable no hay captación';
        process.stderr.write(`${reason}\n`);
        return 1;
    }

    return 0;
}

/**
 * Autotest hermético: ejercita la MISMA ruta de código que la ejecución real
 * (`resolveMarket` → `buildWhatsAppOutreachLink` → `isInvitationCode`) sin leer
 * ni escribir ficheros y sin abrir ningún enlace. Sirve para demostrar que la
 * herramienta está operativa incluso cuando la lista de agrupaciones no existe
 * todavía: el bloqueo es el dato, nunca el motor.
 */
function runSelftest(): number {
    const checks: string[] = [];
    const fail = (reason: string): number => {
        process.stderr.write(`FAIL=SELFTEST · ${reason}\n`);
        return 1;
    };

    // 1. La plaza se resuelve igual por nombre y por slug (nunca un 404 por acentos).
    const byName = resolveMarket('Toledo');
    const bySlug = resolveMarket('toledo');
    if (!byName || !bySlug || byName.slug !== bySlug.slug) {
        return fail('resolveMarket no resuelve "Toledo" y "toledo" a la misma plaza');
    }
    checks.push('market-resolution');

    // 2. Plaza inexistente: se rechaza. No se inventan mercados.
    if (resolveMarket('Atlantida') !== null) {
        return fail('resolveMarket aceptó una plaza inexistente');
    }
    checks.push('unknown-market-rejected');

    // 3. Teléfono verificable => enlace a la landing con código de invitación.
    const verified = buildWhatsAppOutreachLink({
        groupSeed: 'Agrupacion Prueba',
        province: byName.name,
        phone: SELFTEST_PHONE,
    });
    if (!verified.ok) {
        return fail('el motor rechazó un teléfono de 9 dígitos verificable');
    }
    if (!verified.href.startsWith(`https://wa.me/34${SELFTEST_PHONE}?text=`)) {
        return fail(`enlace mal formado: ${verified.href.slice(0, 48)}`);
    }
    if (!isInvitationCode(verified.invitationCode)) {
        return fail('el código de invitación no cumple el formato');
    }
    const decoded = decodeURIComponent(verified.href.split('?text=')[1] ?? '');
    if (!decoded.includes(`/mariachis/red/${byName.slug}?inv=${verified.invitationCode}`)) {
        return fail('el mensaje no apunta a la plaza con su código');
    }
    if (!decoded.includes('BAJA')) {
        return fail('el mensaje perdió la baja inmediata (RGPD art. 21)');
    }
    checks.push('verified-link');

    // 4. Determinismo: misma agrupación y plaza => mismo código.
    const again = buildWhatsAppOutreachLink({
        groupSeed: 'Agrupacion Prueba',
        province: byName.name,
        phone: SELFTEST_PHONE,
    });
    if (!again.ok || again.invitationCode !== verified.invitationCode) {
        return fail('el código de invitación no es determinista');
    }
    checks.push('determinism');

    // 5. Sin teléfono verificable no hay enlace (invariante anti-huérfano).
    for (const phone of ['', '600 12']) {
        const blocked = buildWhatsAppOutreachLink({
            groupSeed: 'Agrupacion Prueba',
            province: byName.name,
            phone,
        });
        if (blocked.ok) {
            return fail(`se emitió enlace con teléfono no verificable: "${phone}"`);
        }
    }
    checks.push('phone-guard');

    // 6. Normalización: 9 dígitos nacionales y formato internacional deben
    // aterrizar en el MISMO destinatario wa.me (nunca un enlace muerto).
    const international = buildWhatsAppOutreachLink({
        groupSeed: 'Agrupacion Prueba',
        province: byName.name,
        phone: '+34 099 000 000',
    });
    if (!international.ok) {
        return fail('el motor rechazó un teléfono internacional válido');
    }
    const target = (href: string): string => href.slice(0, href.indexOf('?'));
    if (target(international.href) !== target(verified.href)) {
        return fail(
            `normalización incoherente: ${target(international.href)} != ${target(verified.href)}`,
        );
    }
    checks.push('phone-normalization');

    process.stdout.write(
        `${JSON.stringify(
            {
                status: 'SELFTEST_OK',
                checks,
                checksPassed: checks.length,
                note: 'Teléfono sintético en memoria: no se escribió ningún fichero ni se abrió ningún enlace.',
            },
            null,
            2,
        )}\n`,
    );
    return 0;
}

/**
 * Envoltorio único: convierte cualquier fallo en UNA línea de stderr + Exit Code
 * explícito. Un traceback de 40 líneas con Exit 1 es un diagnóstico falso.
 */
try {
    process.exitCode = main(process.argv.slice(2));
} catch (error: unknown) {
    if (error instanceof ToolError) {
        process.stderr.write(`${error.message}\n`);
        process.exitCode = error.exitCode;
    } else {
        process.stderr.write(
            `FAIL=UNEXPECTED · ${error instanceof Error ? error.message : String(error)}\n`,
        );
        process.exitCode = 70;
    }
}
