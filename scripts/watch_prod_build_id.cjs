#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * WATCH PROD BUILD ID — «¿se ha aplicado de verdad el despliegue?»
 * ════════════════════════════════════════════════════════════════════════════
 * El `buildId` de Next se extrae del payload RSC de la home y es la ÚNICA
 * huella fiable de «esta respuesta viene de una imagen nueva». El título, el
 * HTML o el ETag no sirven: cambian sin que cambie la imagen.
 *
 * Uso:
 *   node scripts/watch_prod_build_id.cjs [segundos] [--baseline=<buildId>]
 *   node scripts/watch_prod_build_id.cjs 900 --baseline=nHrWUpebp1pgCyx99K76a
 *
 * Exit codes:
 *   0 = imagen nueva viva y home 200 (el contenedor arrancó con el entrypoint)
 *   2 = timeout: la imagen NO cambió (build del VPS no promovido)
 *   3 = imagen nueva pero home != 200 (el arranque se rompió) ← ALARMA P0
 * ════════════════════════════════════════════════════════════════════════════
 */

const BASE = process.env.SMOKE_BASE_URL || 'https://www.productoraear.com';
const INTAKE = '/api/outreach/intake';
const POLL_MS = 30_000;

const args = process.argv.slice(2);
const limitSeconds = Number(args.find((a) => /^\d+$/.test(a)) || 900);
const baselineArg = args.find((a) => a.startsWith('--baseline='));
const baseline = baselineArg ? baselineArg.split('=')[1] : null;

// El buildId viaja escapado dentro del payload RSC: tolera 0..3 barras.
const BUILD_ID_RE = /\\{0,3}"b\\{0,3}":\\{0,3}"([A-Za-z0-9_-]{8,40})\\{0,3}"/;

function extractBuildId(html) {
    const match = html.match(BUILD_ID_RE);
    return match ? match[1] : 'UNKNOWN';
}

async function probe() {
    const home = await fetch(`${BASE}/`, { redirect: 'manual' });
    const html = await home.text();

    let intakeStatus = 0;
    let intakeBody = '';
    try {
        const intake = await fetch(`${BASE}${INTAKE}`, { redirect: 'manual' });
        intakeStatus = intake.status;
        intakeBody = (await intake.text()).slice(0, 120).replace(/\s+/g, ' ');
    } catch {
        intakeStatus = -1;
    }

    return { home: home.status, intake: intakeStatus, intakeBody, buildId: extractBuildId(html) };
}

async function main() {
    const startedAt = Date.now();
    let lastBuildId = null;

    console.log(`WATCH base=${BASE} limit=${limitSeconds}s baseline=${baseline ?? '(auto: primera lectura)'}`);

    while ((Date.now() - startedAt) / 1000 < limitSeconds) {
        let snapshot;
        try {
            snapshot = await probe();
        } catch (error) {
            console.log(`  [probe] error: ${error.message}`);
            await new Promise((r) => setTimeout(r, POLL_MS));
            continue;
        }

        const elapsed = Math.round((Date.now() - startedAt) / 1000);

        if (lastBuildId === null && baseline === null) {
            lastBuildId = snapshot.buildId;
            console.log(`BASELINE_DETECTED=${snapshot.buildId}`);
        }

        if (snapshot.buildId !== lastBuildId) {
            console.log(
                `[${elapsed}s] BUILD_ID_CHANGED ${lastBuildId} -> ${snapshot.buildId} ` +
                `home=${snapshot.home} intake=${snapshot.intake}`,
            );
            lastBuildId = snapshot.buildId;
        }

        const isNewImage = baseline !== null && snapshot.buildId !== baseline && snapshot.buildId !== 'UNKNOWN';

        if (isNewImage) {
            console.log(`>>> NEW_IMAGE_LIVE buildId=${snapshot.buildId} home=${snapshot.home} intake=${snapshot.intake}`);
            console.log(`>>> INTAKE_BODY="${snapshot.intakeBody}"`);
            console.log(`>>> ENTRYPOINT_OK=${snapshot.home === 200} (home 200 => el contenedor arrancó)`);
            process.exit(snapshot.home === 200 ? 0 : 3);
        }

        await new Promise((r) => setTimeout(r, POLL_MS));
    }

    console.log(`>>> TIMEOUT: la imagen no cambió en ${limitSeconds}s (build del VPS no promovido)`);
    process.exit(2);
}

main();
