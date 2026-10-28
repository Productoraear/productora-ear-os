/**
 * ════════════════════════════════════════════════════════════════════════════
 * CONSTRUCTOR DE OBJETIVOS DE CAPTACIÓN · MARIACHIS VERIFICADOS → EMISOR
 * ════════════════════════════════════════════════════════════════════════════
 * Uso: npm run targets:outreach
 *
 * Convierte las fichas de proveedor YA presentes en el repo (con procedencia) en
 * el fichero de objetivos que consume `emit_mariachi_outreach.ts`. Cierra el
 * hueco real del bloque: el emisor estaba listo y la lista no existía.
 *
 * Reglas (cero invención):
 *  · Solo se acepta un grupo con `verified === true` y teléfono de ≥ 9 dígitos.
 *  · La plaza se resuelve primero por `province`; si viene truncada (p. ej. "B")
 *    se cae al `municipality` declarado por la propia ficha, y la reparación se
 *    declara en `plazaVia` junto al `sourceId`. Sin plaza en la malla, se descarta.
 *  · La salida lleva `sourceFile` + `sourceId` para que cada enlace sea auditable.
 *
 * Exit Codes: 0 = hay objetivos · 1 = no se pudo emitir ninguno · 2 = lectura inválida.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { provinceSlug } from '../src/lib/mariachi/network-outreach';
import { MARIACHI_MARKETS } from '../src/lib/seo/centralita-mariachis-dominance-engine';

const SOURCE_FILE = 'public/data/providers/musica.json';
const OUT_FILE = 'reports/outreach/targets_mariachi.json';

interface RawProvider {
    readonly id?: unknown;
    readonly name?: unknown;
    readonly category?: unknown;
    readonly province?: unknown;
    readonly municipality?: unknown;
    readonly phone?: unknown;
    readonly verified?: unknown;
}

interface OutreachTargetRow {
    readonly groupName: string;
    /** Nombre canónico de la plaza: el emisor lo resuelve por nombre o slug. */
    readonly province: string;
    readonly phone: string;
    readonly city: string;
    readonly sourceFile: string;
    readonly sourceId: string;
    /** Por dónde se resolvió la plaza: `province` intacta o `municipality` reparada. */
    readonly plazaVia: 'province' | 'municipality';
}

const spanishMarkets = MARIACHI_MARKETS.filter((market) => market.inSpain);

function asText(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
}

function resolvePlaza(raw: string): (typeof spanishMarkets)[number] | null {
    const key = provinceSlug(raw);
    if (!key) return null;
    return (
        spanishMarkets.find((market) => provinceSlug(market.slug) === key) ??
        spanishMarkets.find((market) => provinceSlug(market.name) === key) ??
        null
    );
}

function phoneDigits(value: unknown): number {
    return asText(value).replace(/\D/g, '').length;
}

function main(): number {
    const absolute = resolve(process.cwd(), SOURCE_FILE);
    let parsed: unknown;
    try {
        parsed = JSON.parse(readFileSync(absolute, 'utf8').replace(/^\uFEFF/, ''));
    } catch (error: unknown) {
        process.stderr.write(
            `FAIL=SOURCE_UNREADABLE · ${absolute} · ${error instanceof Error ? error.message : String(error)}\n`,
        );
        return 2;
    }

    if (!Array.isArray(parsed)) {
        process.stderr.write(`FAIL=SOURCE_NOT_ARRAY · ${absolute} · se esperaba un array JSON\n`);
        return 2;
    }
    const records = parsed as readonly RawProvider[];

    const targets: OutreachTargetRow[] = [];
    const skipped: Array<{ group: string; reason: string }> = [];
    const seen = new Set<string>();

    for (const record of records) {
        const name = asText(record.name);
        const looksMariachi = /mariachi/i.test(name) || /mariachi/i.test(asText(record.category));
        if (!looksMariachi) {
            continue;
        }

        if (record.verified !== true) {
            skipped.push({ group: name, reason: 'not-verified' });
            continue;
        }
        if (phoneDigits(record.phone) < 9) {
            skipped.push({ group: name, reason: 'no-verifiable-phone' });
            continue;
        }

        const byProvince = resolvePlaza(asText(record.province));
        const byCity = byProvince ? null : resolvePlaza(asText(record.municipality));
        const plaza = byProvince ?? byCity;
        if (!plaza) {
            skipped.push({
                group: name,
                reason: `plaza-not-in-mesh (province="${asText(record.province)}", city="${asText(record.municipality)}")`,
            });
            continue;
        }

        const dedupeKey = `${provinceSlug(plaza.slug)}|${asText(record.phone)}`;
        if (seen.has(dedupeKey)) {
            skipped.push({ group: name, reason: 'duplicate' });
            continue;
        }
        seen.add(dedupeKey);

        targets.push({
            groupName: name,
            province: plaza.name,
            phone: asText(record.phone),
            city: asText(record.municipality),
            sourceFile: SOURCE_FILE,
            sourceId: asText(record.id) || provinceSlug(name),
            plazaVia: byProvince ? 'province' : 'municipality',
        });
    }

    if (targets.length > 0) {
        const outAbsolute = resolve(process.cwd(), OUT_FILE);
        mkdirSync(dirname(outAbsolute), { recursive: true });
        writeFileSync(outAbsolute, `${JSON.stringify(targets, null, 2)}\n`, 'utf8');
    }

    process.stdout.write(
        `${JSON.stringify(
            {
                status: targets.length > 0 ? 'READY' : 'NO_TARGETS',
                source: SOURCE_FILE,
                inspected: records.length,
                targets: targets.length,
                skipped: skipped.length,
                plazas: [...new Set(targets.map((row) => row.province))].sort(),
                repairedPlaza: targets
                    .filter((row) => row.plazaVia === 'municipality')
                    .map((row) => `${row.groupName} -> ${row.province}`),
                out: targets.length > 0 ? OUT_FILE : null,
                skippedDetail: skipped,
            },
            null,
            2,
        )}\n`,
    );

    return targets.length > 0 ? 0 : 1;
}

process.exitCode = main();
