#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERIFICADOR DE ALINEACIÓN REPO ↔ ORIGIN ↔ PRODUCCIÓN (ley del auditor real)
 * ════════════════════════════════════════════════════════════════════════════
 * Problema que cierra: `prod_deploy_freshness.cjs` es el auditor del pipeline de
 * CI (compara /api/health con el SHA que ese run construyó). Ejecutado desde la
 * máquina del operador NO es una puerta: se queda en `MODO_DIAGNOSTICO` salvo
 * que se le pase `--expect=<sha>` a mano, y no audita los ejes que también
 * pueden desalinearse: el árbol de trabajo sucio (lo que se prueba en local no
 * es lo que está en origin) ni el SSOT servido (si la imagen viva publica otro
 * hash canónico, producción corre otro `ear-os-ssot.ts` — INV-05).
 *
 * Cuatro ejes medidos, un único veredicto:
 *   1. ARBOL   · `git status --porcelain` vacío (0 ficheros sin commitear)
 *   2. ORIGIN  · HEAD local == origin/<branch> tras `git fetch` (0 delante, 0 detrás)
 *   3. COMMIT  · /api/health `buildSha` == HEAD local (o == --expect)
 *   4. SSOT    · /api/health `sre.ssotIntegrity.computedSha256` == hash canónico
 *                local del módulo SSOT (via `tsx`, el mismo runtime de audit:ssot)
 *
 * Vocabulario de estado CERRADO (EP-2): VERIFICADO · SOSPECHOSO · FACHADA ·
 * SIN_EVIDENCIA. Nunca hay "verde por defecto": un eje sin medición se firma
 * SIN_EVIDENCIA y bloquea (AF-5).
 *
 * Exit codes:
 *   0  ALINEADO          los cuatro ejes VERIFICADO
 *   1  ERROR             /api/health sin respuesta útil o repo ilegible
 *   3  DRIFT_LOCAL       árbol sucio o HEAD ≠ origin: el código no está publicado
 *   4  STALE             producción sirve otro commit (o ninguno): deploy no aplicado
 *   5  SSOT_DESALINEADO  producción publica otro hash canónico del SSOT
 *
 * Uso:
 *   node scripts/verify_prod_alignment.cjs                  # puerta contra HEAD
 *   node scripts/verify_prod_alignment.cjs --wait=120       # espera al redeploy
 *   node scripts/verify_prod_alignment.cjs --expect=<sha>   # contra otra ref
 *   node scripts/verify_prod_alignment.cjs --allow-dirty    # inspección: sólo avisa
 *   node scripts/verify_prod_alignment.cjs --skip-fetch     # sin red de git
 *   node scripts/verify_prod_alignment.cjs --json           # salida máquina
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const { execFileSync } = require('node:child_process');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const BASE = process.env.EAR_PROD_BASE_URL || 'https://www.productoraear.com';

function arg(name, fallback) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
}

function flag(name) {
  return process.argv.includes(`--${name}`);
}

const WAIT = Number(arg('wait', process.env.EAR_ALIGNMENT_WAIT || '0')) || 0;
const INTERVAL = 15000;
const PROBE_TIMEOUT_MS = 20000;
const CHILD_TIMEOUT_MS = 60000;
const JSON_OUT = flag('json');
const SKIP_FETCH = flag('skip-fetch');
const ALLOW_DIRTY = flag('allow-dirty');

const REDEPLOY_REMEDY =
  'REMEDIACION (despliegue): en Coolify > app > Deployments, redeploy del commit indicado. ' +
  'Si el trigger API es la via: Coolify > Settings > Advanced > API access = Enabled y key ' +
  'con permiso Deploy guardada como COOLIFY_API_TOKEN. Re-medir: ' +
  'node scripts/verify_prod_alignment.cjs';

const PUSH_REMEDY =
  'REMEDIACION (publicacion): git push origin main. Mientras origin no reciba el commit, ' +
  'Coolify (que compila desde Git) no puede construirlo y produccion seguira sirviendo la imagen vieja.';

const DIRTY_REMEDY =
  'REMEDIACION (arbol): commitear o descartar los cambios listados. Con arbol sucio, lo que se ' +
  'prueba en local NO es lo que se despliega: la alineacion se firma sobre disco.';

const SSOT_REMEDY =
  'REMEDIACION (SSOT): la imagen viva se compilo con otro ear-os-ssot.ts. Confirmar con ' +
  '`npm run audit:ssot` que el local coincide con el sello canonico y redeploy del commit correcto. ' +
  'Prohibido re-sellar para tapar la deriva (INV-05, sancion del CEO).';

// ─── Utilidades de git ────────────────────────────────────────────────────────

function git(args, { optional = false } = {}) {
  try {
    return execFileSync('git', args, {
      cwd: ROOT,
      encoding: 'utf8',
      timeout: CHILD_TIMEOUT_MS,
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch (err) {
    if (optional) return '';
    const detail =
      err && err.stderr ? String(err.stderr).trim() : err instanceof Error ? err.message : String(err);
    throw new Error(`git ${args.join(' ')} fallo: ${detail}`);
  }
}

/** ¿HEAD es ancestro de `ref`? (true = el commit está publicado en esa ref). */
function isAncestor(ref) {
  try {
    execFileSync('git', ['merge-base', '--is-ancestor', 'HEAD', ref], {
      cwd: ROOT,
      stdio: 'ignore',
      timeout: CHILD_TIMEOUT_MS,
    });
    return true;
  } catch {
    return false;
  }
}

function readGitState() {
  const head = git(['rev-parse', 'HEAD']);
  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD'], { optional: true }) || 'HEAD';
  const headSubject = git(['log', '-1', '--format=%s', 'HEAD'], { optional: true });
  const headDate = git(['log', '-1', '--format=%cI', 'HEAD'], { optional: true });

  // `--untracked-files=no`: un directorio de artefactos no commiteado no es
  // deriva de código; se informa aparte en `untrackedCount`.
  const porcelain = git(['status', '--porcelain', '--untracked-files=no'], { optional: true });
  const dirtyFiles = porcelain.length === 0 ? [] : porcelain.split('\n').filter((l) => l.trim().length > 0);
  const untrackedRaw = git(['ls-files', '--others', '--exclude-standard'], { optional: true });
  const untrackedCount = untrackedRaw.length === 0 ? 0 : untrackedRaw.split('\n').filter(Boolean).length;

  let remoteRef = null;
  let fetchError = null;
  if (SKIP_FETCH) {
    remoteRef = `refs/remotes/origin/${branch}`;
    if (!git(['rev-parse', '--verify', '--quiet', remoteRef], { optional: true })) {
      fetchError = 'no existe origin/' + branch + ' en disco y --skip-fetch impide actualizarla';
    }
  } else {
    remoteRef = `refs/remotes/origin/${branch}`;
    try {
      git(['fetch', '--quiet', 'origin', branch]);
    } catch (err) {
      fetchError = err instanceof Error ? err.message.split('\n')[0] : String(err);
    }
  }

  const remoteSha = remoteRef ? git(['rev-parse', '--verify', '--quiet', remoteRef], { optional: true }) || null : null;

  let ahead = null;
  let behind = null;
  if (remoteSha) {
    const parts = git(['rev-list', '--left-right', '--count', `${remoteRef}...HEAD`], { optional: true })
      .split(/\s+/)
      .filter(Boolean);
    if (parts.length === 2) {
      behind = Number(parts[0]);
      ahead = Number(parts[1]);
    }
  }

  const publishedOnRemote = remoteSha ? isAncestor(remoteRef) : false;

  // Ficheros del commit HEAD que además están modificados en disco: el caso más
  // grave, porque ni el propio commit vivo coincide con lo que hay en disco.
  let dirtyInHeadCommit = [];
  if (dirtyFiles.length > 0) {
    const headFiles = new Set(
      git(['show', '--pretty=format:', '--name-only', 'HEAD'], { optional: true }).split('\n').filter(Boolean),
    );
    dirtyInHeadCommit = dirtyFiles.filter((entry) => headFiles.has(entry.slice(3).trim().replace(/^"|"$/g, '')));
  }

  return {
    head,
    headShort: head.slice(0, 7),
    headSubject,
    headDate,
    branch,
    remoteRef,
    remoteSha,
    ahead,
    behind,
    publishedOnRemote,
    fetchError,
    dirtyFiles,
    dirtyInHeadCommit,
    untrackedCount,
  };
}

// ─── Hash canónico del SSOT local (mismo runtime que `npm run audit:ssot`) ────

let localSsotCache = null;

/**
 * Importa el módulo real (`ssotIntegrityGuard`) con `tsx` y devuelve el hash de
 * la serialización canónica. No hay copia paralela del hash: si el SSOT cambia,
 * este valor cambia con él (SSOT único, cero deriva entre auditorías).
 */
function readLocalSsot() {
  if (localSsotCache) return localSsotCache;
  const script = [
    "import { verifySsotIntegrity } from '@/lib/security/ssotIntegrityGuard';",
    'const report = verifySsotIntegrity();',
    'process.stdout.write(JSON.stringify({',
    '  computed: report.computedHash,',
    '  reference: report.referenceHash,',
    '  intact: report.intact,',
    '  invariantsOk: report.invariantsOk,',
    '  violated: report.violatedInvariants',
    '}));',
  ].join('');
  try {
    const out = execFileSync(
      process.execPath,
      [path.join(ROOT, 'node_modules', 'tsx', 'dist', 'cli.mjs'), '--eval', script],
      { cwd: ROOT, encoding: 'utf8', timeout: CHILD_TIMEOUT_MS, stdio: ['ignore', 'pipe', 'pipe'] },
    ).trim();
    const parsed = JSON.parse(out);
    localSsotCache = { ok: true, ...parsed };
  } catch (err) {
    const raw = err && err.stderr ? String(err.stderr).trim() : '';
    localSsotCache = {
      ok: false,
      reason: raw ? raw.split('\n')[0] : err instanceof Error ? err.message.split('\n')[0] : String(err),
    };
  }
  return localSsotCache;
}

// ─── Sonda de producción ──────────────────────────────────────────────────────

async function probeHealth() {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), PROBE_TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE}/api/health`, {
      headers: { 'user-agent': 'EAR-OS-prod-alignment' },
      signal: ctrl.signal,
      cache: 'no-store',
    });
    const text = await res.text();
    try {
      return { http: res.status, json: JSON.parse(text), raw: '' };
    } catch {
      return { http: res.status, json: null, raw: text.slice(0, 160) };
    }
  } finally {
    clearTimeout(timer);
  }
}

function matchSha(live, expected) {
  if (!live || !expected) return false;
  const a = live.toLowerCase();
  const b = expected.toLowerCase();
  return a === b || (a.length >= 7 && b.startsWith(a)) || (b.length >= 7 && a.startsWith(b));
}

// ─── Veredictos (EP-2: vocabulario cerrado) ───────────────────────────────────

function verdictTree(state) {
  const detail = {
    dirtyFiles: state.dirtyFiles.length,
    dirtyInHeadCommit: state.dirtyInHeadCommit.slice(0, 10),
    untrackedCount: state.untrackedCount,
  };
  if (state.dirtyFiles.length === 0) return { state: 'VERIFICADO', detail };
  return { state: ALLOW_DIRTY ? 'SOSPECHOSO' : 'FACHADA', detail };
}

function verdictOrigin(state) {
  const detail = {
    branch: state.branch,
    remoteRef: state.remoteRef,
    remoteSha: state.remoteSha,
    ahead: state.ahead,
    behind: state.behind,
    publishedOnRemote: state.publishedOnRemote,
    fetchError: state.fetchError,
  };
  if (!state.remoteSha) return { state: 'SIN_EVIDENCIA', detail };
  if (state.publishedOnRemote && state.ahead === 0 && state.behind === 0) {
    return { state: 'VERIFICADO', detail };
  }
  return { state: 'FACHADA', detail };
}

function verdictCommit(live, health, expected) {
  const json = health && health.json ? health.json : null;
  const detail = {
    health_http: health ? health.http : 0,
    live_sha: live && live !== 'unknown' ? live : null,
    live_source: json && typeof json.buildSource === 'string' ? json.buildSource : null,
    live_build_time: json && typeof json.buildTime === 'string' ? json.buildTime : null,
    expected: expected.slice(0, 7),
  };
  if (!health || health.http !== 200 || !json) return { state: 'SIN_EVIDENCIA', detail };
  if (!live || live === 'unknown') return { state: 'SIN_EVIDENCIA', detail };
  if (matchSha(live, expected)) return { state: 'VERIFICADO', detail };
  return { state: 'FACHADA', detail };
}

function verdictSsot(live, local) {
  const detail = {
    live: live || null,
    local: local && local.ok ? local.computed : null,
    localOk: Boolean(local && local.ok),
    localIntact: local && local.ok ? Boolean(local.intact) : null,
    reason: local && !local.ok ? local.reason : null,
  };
  if (!live) return { state: 'SIN_EVIDENCIA', detail };
  if (!local || !local.ok) return { state: 'SIN_EVIDENCIA', detail };
  if (live === local.computed) return { state: 'VERIFICADO', detail };
  return { state: 'FACHADA', detail };
}

// ─── Presentación ─────────────────────────────────────────────────────────────

function pad(value, width) {
  return String(value).padEnd(width, ' ');
}

function shortSha(sha) {
  return sha ? sha.slice(0, 7) : '<desconocido>';
}

function printReport(report) {
  const g = report.git;
  const l = report.live;
  console.log('');
  console.log('══ ALINEACION REPO <-> ORIGIN <-> PRODUCCION ══');
  console.log(`BASE    ${report.base}`);
  console.log(`LOCAL   ${g.headShort} (${g.branch}) · ${g.headSubject}`);
  console.log(`        commit ${g.headDate}`);
  console.log(
    `ORIGIN  ${shortSha(g.remoteSha)} (${g.remoteRef || 'sin ref'}) ` +
      `ahead=${g.ahead === null ? '?' : g.ahead} behind=${g.behind === null ? '?' : g.behind}` +
      (g.fetchError ? ` FETCH_ERROR=${g.fetchError}` : ''),
  );
  console.log(
    `PROD    ${l.live_sha || '<ausente>'} (source=${l.live_source || '<ausente>'} ` +
      `buildTime=${l.live_build_time || '<ausente>'}) esperado=${l.expected}`,
  );
  console.log(`SSOT    prod=${l.live_ssot || '<ausente>'} local=${l.local_ssot || '<ausente>'}`);
  console.log('');
  console.log('EJES:');
  console.log(
    `  1 ARBOL   ${pad(report.tree.state, 14)} sin commitear=${report.tree.detail.dirtyFiles} ` +
      `untracked=${report.tree.detail.untrackedCount}`,
  );
  for (const f of g.dirtyFiles.slice(0, 20)) console.log(`            ${f}`);
  if (g.dirtyFiles.length > 20) console.log(`            ... +${g.dirtyFiles.length - 20} mas`);
  console.log(`  2 ORIGIN  ${pad(report.origin.state, 14)} origin=${shortSha(g.remoteSha)}`);
  console.log(
    `  3 COMMIT  ${pad(report.commit.state, 14)} prod=${l.live_sha || '<ausente>'} esperado=${l.expected}`,
  );
  console.log(
    `  4 SSOT    ${pad(report.ssot.state, 14)} prod=${String(l.live_ssot || '<ausente>').slice(0, 16)} ` +
      `local=${String(l.local_ssot || '<ausente>').slice(0, 16)}`,
  );
  console.log('');
  console.log(`VERDICT=${report.verdict} exit=${report.exit}`);

  if (report.verdict === 'ALINEADO') return;

  if (report.tree.state !== 'VERIFICADO') console.log(DIRTY_REMEDY);
  if (report.origin.state === 'FACHADA') console.log(PUSH_REMEDY);
  if (report.origin.state === 'SIN_EVIDENCIA') {
    console.log(
      `SIN_EVIDENCIA (origin): no se pudo resolver la ref remota ` +
        `(${report.origin.detail.fetchError || 'sin ref'}). Reintentar con red, o ` +
        '`--skip-fetch` si el origin local ya esta actualizado.',
    );
  }
  if (report.commit.state === 'FACHADA') console.log(REDEPLOY_REMEDY);
  if (report.commit.state === 'SIN_EVIDENCIA') {
    console.log(
      'SIN_EVIDENCIA (commit): /api/health no publica un buildSha utilizable ' +
        `(http=${report.commit.detail.health_http}). Sin sello no se puede afirmar que commit sirve produccion.`,
    );
  }
  if (report.ssot.state === 'FACHADA') console.log(SSOT_REMEDY);
  if (report.ssot.state === 'SIN_EVIDENCIA' && report.ssot.detail.reason) {
    console.log(`SIN_EVIDENCIA (SSOT): no se pudo calcular el hash local -> ${report.ssot.detail.reason}`);
  }
}

// ─── Ejecución ────────────────────────────────────────────────────────────────

/**
 * Orden de severidad: sin commit publicado no hay nada que verificar a
 * distancia (3); si el commit vivo no coincide, el cliente consume otro código
 * (4); con el commit alineado, sólo queda que el SSOT servido difiera (5).
 */
function decideExit({ health, tree, origin, commit, ssot }) {
  if (!health || health.http === 0) return { exit: 1, verdict: 'ERROR_SONDA' };
  if (tree.state === 'FACHADA') {
    return { exit: 3, verdict: commit.state === 'VERIFICADO' ? 'DRIFT_LOCAL' : 'DRIFT_LOCAL_Y_STALE' };
  }
  if (origin.state === 'FACHADA') {
    return { exit: 3, verdict: commit.state === 'VERIFICADO' ? 'DRIFT_ORIGIN' : 'DRIFT_ORIGIN_Y_STALE' };
  }
  if (origin.state === 'SIN_EVIDENCIA') return { exit: 3, verdict: 'DRIFT_ORIGIN_SIN_EVIDENCIA' };
  if (commit.state !== 'VERIFICADO') return { exit: 4, verdict: 'STALE' };
  if (ssot.state !== 'VERIFICADO') return { exit: 5, verdict: 'SSOT_DESALINEADO' };
  return { exit: 0, verdict: 'ALINEADO' };
}

(async () => {
  let gitState;
  try {
    gitState = readGitState();
  } catch (err) {
    console.error(`ALIGNMENT_CRASH git: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }

  const expectedFromArg = (arg('expect', '') || process.env.EAR_EXPECTED_SHA || '').trim();
  const expected = expectedFromArg || gitState.head;
  const expectedKind = expectedFromArg ? 'arg' : 'HEAD';
  const localSsot = readLocalSsot();

  const deadline = Date.now() + WAIT * 1000;
  let attempt = 0;
  let health = null;
  let liveSha = null;
  let liveSsot = null;

  for (;;) {
    attempt += 1;
    try {
      health = await probeHealth();
      const json = health.json || {};
      liveSha = typeof json.buildSha === 'string' ? json.buildSha.trim() : null;
      liveSsot =
        json.sre && json.sre.ssotIntegrity && typeof json.sre.ssotIntegrity.computedSha256 === 'string'
          ? json.sre.ssotIntegrity.computedSha256.trim()
          : null;
    } catch (err) {
      console.log(`HEALTH_ERROR intento ${attempt}: ${err instanceof Error ? err.message : String(err)}`);
      health = { http: 0, json: null, raw: 'red' };
      liveSha = null;
      liveSsot = null;
    }
    console.log(
      `HEALTH intento ${attempt} http=${health.http} buildSha=${liveSha || '<ausente>'} ` +
        `buildSource=${(health.json && health.json.buildSource) || '<ausente>'} ` +
        `ssot=${liveSsot ? liveSsot.slice(0, 16) : '<ausente>'}`,
    );

    const converged =
      health.http === 200 &&
      matchSha(liveSha, expected) &&
      liveSsot !== null &&
      localSsot.ok &&
      liveSsot === localSsot.computed;
    if (converged || WAIT === 0 || Date.now() >= deadline) break;
    await new Promise((r) => setTimeout(r, INTERVAL));
  }

  const tree = verdictTree(gitState);
  const origin = verdictOrigin(gitState);
  const commit = verdictCommit(liveSha, health, expected);
  const ssot = verdictSsot(liveSsot, localSsot);
  const { exit, verdict } = decideExit({ health, tree, origin, commit, ssot });

  // Quíntupla contractual (EP-1): probed/source/mode/checkedAt acompañan siempre
  // la salida máquina para que nadie pueda leer el JSON como si fuera estático.
  const report = {
    probed: true,
    source: 'live',
    mode: 'REAL',
    checkedAt: new Date().toISOString(),
    base: BASE,
    expected: { sha: expected, kind: expectedKind },
    git: {
      head: gitState.head,
      headShort: gitState.headShort,
      branch: gitState.branch,
      headSubject: gitState.headSubject,
      headDate: gitState.headDate,
      remoteRef: gitState.remoteRef,
      remoteSha: gitState.remoteSha,
      ahead: gitState.ahead,
      behind: gitState.behind,
      publishedOnRemote: gitState.publishedOnRemote,
      fetchError: gitState.fetchError,
      dirtyFiles: gitState.dirtyFiles,
    },
    live: {
      health_http: health ? health.http : 0,
      live_sha: liveSha,
      live_source: commit.detail.live_source,
      live_build_time: commit.detail.live_build_time,
      live_ssot: liveSsot,
      local_ssot: localSsot.ok ? localSsot.computed : null,
      expected: expected.slice(0, 7),
    },
    tree,
    origin,
    commit,
    ssot,
    verdict,
    exit,
  };

  if (JSON_OUT) console.log(JSON.stringify(report, null, 2));
  else printReport(report);

  process.exit(exit);
})().catch((err) => {
  console.error('ALIGNMENT_CRASH', err);
  process.exit(1);
});
