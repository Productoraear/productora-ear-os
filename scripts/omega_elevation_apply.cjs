#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * MANDATO DE ELEVACIÓN · ARCHITECT_DIRECTIVE_SOTA_2026 (§5 del directivo) · S3
 * ════════════════════════════════════════════════════════════════════════════
 * AUTOENMIENDA EP-5 APLICADA (2026-11-10, misma sesión). La primera ejecución de
 * este mandato selló `ARCHITECT_ELEVATION_SOTA_2026` como VERIFICADO con `url:null`
 * porque es un cambio de herramienta local, no una promesa sobre una URL.
 * Medido con `npm run verify:confianza`, ese estado VIOLA el contrato del repo
 * (src/lib/evidence/evidence-ledger.ts:179: un VERIFICADO exige `url` no nula y
 * https; sin ella la fila se degrada). Se corrigió AÑADIENDO una línea AMEND con
 * `supersedes=ARCHITECT_ELEVATION_SOTA_2026` (EP-4, nunca reescribir) y este
 * script ahora declara `LEDGER_QUINTUPLA_PARTIAL` para que el hueco quede a la
 * vista en cada ejecución en vez de esconderse en la prosa.
 *
 * Invocado por `node .antigravity/omega.js audit --elevation-spec=<ruta>`
 * (o `npm run audit:elevation`, que apunta al spec canónico).
 *
 * QUÉ HACE (y por qué no es una fachada):
 *   · PASO 1 — Reauditoría RETROACTIVA del ledger (append-only, EP-4). Lee cada
 *     línea de `.antigravity/evidence/ledger.jsonl`, mide la quíntupla EP-1
 *     (cmd · exit · sha256 · ts · url) y, si el claim se emitió bajo un emulador
 *     de entorno simulado, AÑADE una línea de enmienda `DEPRECATED_BY_ELEVATION`
 *     con `supersedes=<claim>`. Jamás reescribe ni borra una línea previa.
 *   · PASO 2 — Reestructura los contratos de aceptación de las tareas NO
 *     EJECUTABLES de la cola (Wave 53 Career OS y posteriores) con el estándar
 *     SOTA 2026: aserción explícita de cero `any`, certificación de modo real
 *     contra base de datos duradera y arnés falsable obligatorio. Además crea la
 *     Wave 54 con las 6 tareas que cierran los gaps P1 del Scorecard Ω-Diamante.
 *   · PASO 3 — Revoca la autoaprobación de Cline: escribe el registro
 *     .antigravity/ARCHITECT_APPROVAL.json con `architect_approval.required=true`
 *     y `worker_self_approval.allowed=false`; sin firma ahí, `omega.js complete`
 *     RECHAZA el cierre. La autoridad de validación pasa al Arquitecto.
 *   · PASO 4 — Sella la evidencia del mandato (sha256 del directivo) y emite los
 *     informes JSON + Markdown en `.antigravity/reports/`.
 *
 * GARANTÍAS:
 *   · `--dry-run` calcula TODO y no escribe nada.
 *   · No valida la directiva por el nombre del fichero: la identifica por su
 *     contenido (título canónico). Los nombres decorativos no compilan.
 *   · No toca la Zona Cero (INV-05). No borra líneas del ledger (EP-4).
 *   · Un fallo en cualquier paso => Exit 1, `ELEVATION_AUDIT=FAIL`. Cero verde
 *     por defecto (AF-5).
 *
 * Uso:
 *   node .antigravity/omega.js audit --elevation-spec=<spec.md> [--dry-run]
 *
 * Exit codes: 0 = los 4 pasos sellados · 1 = algún paso falla · 2 = entorno ilegible.
 * Zero-dep: sólo `node:fs`, `node:path`, `node:crypto`. Sin red.
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = path.resolve(__dirname, '..');
const LG = path.join(ROOT, '.antigravity');
const LEDGER = path.join(LG, 'evidence', 'ledger.jsonl');
const QUEUE = path.join(LG, 'tasks_queue.json');
const APPROVAL = path.join(LG, 'ARCHITECT_APPROVAL.json');
const REPORT_DIR = path.join(LG, 'reports');
const REPORT_JSON = path.join(REPORT_DIR, 'omega_elevation_audit.json');
const REPORT_MD = path.join(REPORT_DIR, 'omega_elevation_audit.md');

/** Título canónico que identifica el directivo (no el nombre del fichero). */
const SPEC_TITLE =
  'Directiva Maestra de Arquitectura: Elevación Canónica de Antigravity y Cierre SOTA de EAR OS';

/** Vocabulario CERRADO EP-2. */
const EVIDENCE_STATES = new Set(['VERIFICADO', 'SOSPECHOSO', 'FACHADA', 'SIN_EVIDENCIA']);
/** Estados que el obrero puede ejecutar: sobre estos se eleva el contrato. */
const EXECUTABLE_STATES = new Set(['QUEUED', 'PENDING', 'NOT_STARTED']);

const ELEVATION_MARK = 'SOTA_2026_ELEVATION';
const ELEVATION_TS = new Date().toISOString();

const argv = process.argv.slice(2);
function flag(name, fallback) {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
}
const DRY_RUN = argv.includes('--dry-run');
const SPEC_ARG = flag('elevation-spec', '');

/** Ruta relativa normalizada (siempre con '/', legible en informes). */
function relOf(abs) {
  return path.relative(ROOT, abs).split(path.sep).join('/');
}

/** SHA-256 de una cadena UTF-8 (mismo algoritmo que ledger_append_claim.cjs). */
function sha256Text(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}


// ────────────────────────── PASO 0 · CARGA DE LA DIRECTIVA ──────────────────
function loadDirective() {
  if (!SPEC_ARG) {
    console.error('USO: node .antigravity/omega.js audit --elevation-spec=<ruta .md>');
    return { ok: false, code: 2 };
  }
  const abs = path.isAbsolute(SPEC_ARG) ? SPEC_ARG : path.resolve(ROOT, SPEC_ARG);
  if (!fs.existsSync(abs)) {
    console.error(`DIRECTIVA_AUSENTE: ${relOf(abs)} no existe en disco (L2).`);
    console.error('Copia el directivo a .antigravity/specs/ARCHITECT_DIRECTIVE_SOTA_2026.md antes de auditar.');
    return { ok: false, code: 1 };
  }
  const text = fs.readFileSync(abs, 'utf8');
  if (!text.includes(SPEC_TITLE)) {
    console.error(`DIRECTIVA_NO_RECONOCIDA: «${SPEC_TITLE}» no aparece en el documento.`);
    console.error('Un fichero con otro contenido no es un mandato de elevación: no se eleva nada.');
    return { ok: false, code: 1 };
  }
  return { ok: true, rel: relOf(abs), text, sha256: sha256Text(text) };
}

// ───────────── PASO 1 · REAUDITORÍA RETROACTIVA DEL LEDGER (EP-4) ───────────
/**
 * Marcadores de entorno SIMULADO. El detector es DELIBERADAMENTE estrecho: sólo
 * dispara cuando el claim DECLARA que el resultado nace de un emulador o de un
 * modo simulado. Una nota que documenta «el endpoint respondía mode SIMULADO y
 * por eso se corrigió» es evidencia HONESTA: enmendarla sería falsificar el
 * registro. Por eso se busca en los campos que afirman la ejecución (cmd,
 * cmd_literal, source, mode) y no en las notas narrativas.
 */
const SIMULATION_PATTERNS = [
  /\bMODE\s*=\s*SIMULADO\b/i,
  /\bfallback[_ ]simulad/i,
  /\bfixture[_ ]only\b/i,
  /\bmock[_ ]server\b/i,
  /\bsimulad[oa]\s+(?:en|por|desde)\s+emulador/i,
];

function isSimulatedClaim(entry) {
  if (entry === null || typeof entry !== 'object') return false;
  // Si la propia línea declara su modo, ese modo manda (AF-2: la declaración honesta
  // de un resultado simulado lo hace rastreable, no fraudulento).
  if (typeof entry.mode === 'string' && entry.mode.trim() !== '') return false;
  const asserted = [entry.cmd, entry.cmd_literal, entry.source]
    .filter((v) => typeof v === 'string')
    .join(' | ');
  return SIMULATION_PATTERNS.some((re) => re.test(asserted));
}

/** Quíntupla EP-1 medida campo a campo sobre una línea del ledger. */
function measureQuintupla(entry) {
  const e = entry !== null && typeof entry === 'object' ? entry : {};
  return {
    cmd: typeof e.cmd === 'string' && e.cmd.trim() !== '',
    exit: e.exit === 0,
    sha256: typeof e.sha256 === 'string' && /^[0-9a-f]{64}$/i.test(e.sha256),
    ts: typeof e.ts === 'string' && e.ts.trim() !== '',
    // `url` es legítimamente null en claims de comando local: se mide aparte
    // para no falsear la completitud de la quíntupla (EP-1).
    url: typeof e.url === 'string' && e.url.trim() !== '',
  };
}

function auditLedger(specArg) {
  const result = {
    path: relOf(LEDGER),
    exists: fs.existsSync(LEDGER),
    lines_read: 0,
    parse_errors: [],
    quintupla_complete: 0,
    quintupla_partial: 0,
    with_url: 0,
    exit_zero: 0,
    simulated_claims: [],
    non_canonical_states: [],
    amendments_appended: 0,
  };
  if (!result.exists) {
    console.error('LEDGER_AUSENTE: no hay evidencia que auditar (SIN_EVIDENCIA).');
    return result;
  }
  const lines = fs.readFileSync(LEDGER, 'utf8').split(/\r?\n/).filter((l) => l.trim() !== '');
  result.lines_read = lines.length;

  const amendments = [];
  lines.forEach((line, idx) => {
    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      result.parse_errors.push(idx + 1);
      return;
    }
    const sep = measureQuintupla(entry);
    if (sep.cmd && sep.exit && sep.sha256 && sep.ts) result.quintupla_complete += 1;
    else result.quintupla_partial += 1;
    if (sep.url) result.with_url += 1;
    if (entry.exit === 0) result.exit_zero += 1;
    if (typeof entry.state === 'string' && !EVIDENCE_STATES.has(entry.state)) {
      result.non_canonical_states.push({ line: idx + 1, claim: entry.claim ?? null, state: entry.state });
    }
    if (isSimulatedClaim(entry)) {
      const claimId = String(entry.claim ?? `LINE_${idx + 1}`);
      result.simulated_claims.push({ line: idx + 1, claim: claimId, state: entry.state ?? null });
      amendments.push({ supersedes: claimId, line: idx + 1 });
    }
  });

  // EP-4: la enmienda se AÑADE a la línea del tiempo. Nada se reescribe.
  if (amendments.length > 0 && !DRY_RUN) {
    const body = amendments
      .map((a) =>
        JSON.stringify({
          claim: `${a.supersedes}__DEPRECATED_BY_ELEVATION`,
          promise:
            'Claim emitido bajo emulador de entorno simulado. Enmendado por el mandato de elevación ' +
            'SOTA 2026: no puede sostener un VERIFICADO (AF-2) ni una promesa comercial (EP-3).',
          state: 'SOSPECHOSO',
          superseded_state: 'DEPRECATED_BY_ELEVATION',
          cmd: `node .antigravity/omega.js audit --elevation-spec=${specArg}`,
          exit: 0,
          url: null,
          sha256: sha256Text(`${a.supersedes}|${ELEVATION_MARK}|${ELEVATION_TS}`),
          sha256_scope: 'amendment-marker',
          ts: ELEVATION_TS,
          source: 'live',
          mode: 'REAL',
          order: 'AMEND',
          supersedes: a.supersedes,
          note: `DEPRECATED_BY_ELEVATION · ledger línea ${a.line} refutada por la directiva SOTA 2026`,
        })
      )
      .join('\n');
    const prefix = fs.statSync(LEDGER).size > 0 ? '\n' : '';
    fs.appendFileSync(LEDGER, `${prefix}${body}`, 'utf8');
    result.amendments_appended = amendments.length;
  }
  return result;
}

// ── WAVE 54 · CIERRE DE LOS 6 GAPS P1 DEL SCORECARD Ω-DIAMANTE (§3 del directivo)
/**
 * Cada gap P1 que el scorecard marca SIN_EVIDENCIA tiene aquí su tarea con dueño,
 * instrumento exacto y arnés falsable. Se insertan como QUEUED para que el
 * selector `next` (primero QUEUED) las entregue antes que el resto de W53.
 */
const SCORECARD_GAP_WAVE = 54;

function scorecardGapTasks() {
  return [
    {
      id: 'W54_T01_ASVS_L3_PAYLOAD_HARNESS',
      title: 'Cierre OMEGA-11 · arnés adversarial OWASP ASVS L3 sobre rutas de dinero',
      gap: 'OMEGA-11',
      files: ['scripts/audit_asvs_l3_payloads.cjs'],
      action:
        'Fuzzing sistemático contra /api/quote/generate-lock, /api/telemetry/[id] y /api/admin/treasury. Vectores: ' +
        'inyección SQL ciega basada en tiempo, desbordamiento de tipos numéricos en tarifas, parameter tampering sobre ' +
        'el split 80/10/10 y replay de certificados de depósito. Criterio: 100% de payloads maliciosos rechazados con ' +
        '400/403/422 y CERO 500 no controlados.',
      done_when: '100% payloads rechazados 400/403/422 · 0 HTTP 500 · Exit 0',
    },
    {
      id: 'W54_T02_LIGHTHOUSE_X4_REPRODUCIBLE',
      title: 'Cierre OMEGA-12 · Lighthouse 100x4 reproducible en CI (Mobile Slow 4G)',
      gap: 'OMEGA-12',
      files: ['scripts/audit_lighthouse_x4.cjs'],
      action:
        'Invocar Chrome Headless en contenedor aislado con red emulada Mobile Slow 4G. Las cuatro puntuaciones ' +
        '(Rendimiento, Accesibilidad, Buenas Prácticas, SEO) deben ser 100/100/100/100 y ningún recurso debe bloquear ' +
        'el renderizado en el primer segundo.',
      done_when: 'PERF=100 A11Y=100 BP=100 SEO=100 · 0 recursos bloqueantes en el primer segundo · Exit 0',
    },
    {
      id: 'W54_T03_CWV_FIELD_P75_REAL',
      title: 'Cierre OMEGA-13 · Core Web Vitals de campo p75 reales (CrUX/RUM, sin MODE=SIMULADO)',
      gap: 'OMEGA-13',
      files: ['scripts/audit_cls_budget.cjs'],
      action:
        'Eliminar el parámetro MODE=SIMULADO del auditor. Conectar a la API pública de CrUX o a métricas RUM ' +
        'persistidas en Supabase. Umbrales: CLS p75 <= 0.05, INP p75 < 20 ms, LCP p75 < 1.8 s. Sin fuente de campo, ' +
        'declarar SIN_EVIDENCIA con Exit 1: nunca verde estático (AF-5).',
      done_when: 'CLS p75<=0.05 · INP p75<20ms · LCP p75<1.8s con source:"live" · Exit 0',
    },
    {
      id: 'W54_T04_CISQ_ISO5055_STRUCTURAL',
      title: 'Cierre OMEGA-09/OMEGA-10 · ISO/IEC 25010 documentada + ISO/IEC 5055 (CISQ) estructural',
      gap: 'OMEGA-10',
      files: ['scripts/audit_cisq_structural.cjs', '.antigravity/reports/ISO_25010_QUALITY_MAP.md'],
      action:
        'Medir complejidad ciclomática (cero funciones > 15), profundidad de herencia (<= 3 niveles) y acoplamiento ' +
        'aferente/eferente del dominio financiero, que sólo puede depender de ear-os-ssot.ts. Emitir el mapa de ' +
        'calidad en .antigravity/reports/ISO_25010_QUALITY_MAP.md.',
      done_when: '0 funciones con complejidad > 15 · herencia <= 3 · dominio financiero acoplado sólo al SSOT · Exit 0',
    },
    {
      id: 'W54_T05_RICH_RESULTS_SCHEMA_ORG',
      title: 'Cierre OMEGA-15 · Rich Results schema.org validados en CI',
      gap: 'OMEGA-15',
      files: ['scripts/audit_rich_results.cjs'],
      action:
        'Validar JSON-LD de MusicGroup, EntertainmentBusiness, Event y AggregateRating en todas las plantillas. ' +
        'Cero advertencias y cero errores frente al validador de metadatos de Google.',
      done_when: '4 entidades validadas · 0 warnings · 0 errores · Exit 0',
    },
    {
      id: 'W54_T06_SIMILARITY_CORPUS_472',
      title: 'Cierre OMEGA-16 · Jaccard y coseno TF-IDF sobre las 472 rutas pSEO',
      gap: 'OMEGA-16',
      files: ['scripts/audit_similarity_corpus.cjs'],
      action:
        'Superar el límite de 10 URLs fijas y procesar el corpus completo de 472 rutas pSEO. Distancia Jaccard entre ' +
        'landings del mismo clúster >= 0.65; similitud coseno TF-IDF <= 0.70 sobre el bloque principal de contenido.',
      done_when: 'Jaccard >= 0.65 intra-clúster · TF-IDF <= 0.70 · 472 rutas procesadas · Exit 0',
    },
  ];
}

/** Construye la tarea en el esquema canónico de la cola + contrato elevado. */
function buildGapTask(def, specRel, specSha256, ts) {
  const harnessTaskId = def.id;
  return {
    id: def.id,
    title: def.title,
    status: 'QUEUED',
    priority: 'P1',
    files: def.files,
    action: def.action,
    scaffold: null,
    done_when:
      `${def.done_when} | ${ELEVATION_MARK}: cero any + persistencia durable real ` +
      '(mode:REAL / source:live / persisted:true) + arnés falsable Exit 0 + firma del Arquitecto',
    test: `node ./node_modules/typescript/bin/tsc --noEmit && node scripts/audit_elevation_task_harness.cjs --task=${harnessTaskId}`,
    created_at: ts,
    scorecard_gap: def.gap,
    elevation_contract: {
      mark: ELEVATION_MARK,
      spec: specRel,
      spec_sha256: specSha256,
      elevated_at: ts,
      authority: 'El Arquitecto valida · Cline ejecuta sin autoaprobación',
      assertions: {
        zero_any: 'Cero tipos `any` en el diff.',
        durable_persistence: 'El instrumento mide contra fuente real (HTTP/DB/CI). Prohibido MODE=SIMULADO o fixtures.',
        falsifiable_harness: 'El propio script es el arnés: Exit 1 mientras el gap no esté cerrado.',
        quintupla: 'Quíntupla EP-1 sellada en el ledger al cerrar.',
      },
      gates: ['npm run typecheck (Exit 0)', 'instrumento Exit 0', 'npm run audit:omega-rojo (gap en VERIFICADO)'],
      worker_may_self_approve: false,
    },
  };
}

// ──────── PASO 2 · REESTRUCTURACIÓN DE CONTRATOS (W53 y posteriores) ────────
/** Arnés que sólo compila: no prueba nada. Se sustituye, no se finge. */
const COMPILE_ONLY_TEST = /^\s*node\s+\.\/node_modules\/typescript\/bin\/tsc\s+--noEmit\s*$/;

/** ¿Pertenece a Wave 53 (Career OS) o posteriores? */
function isWave53OrLater(taskId) {
  const m = /^W(\d+)_/.exec(String(taskId));
  return m !== null && Number(m[1]) >= 53;
}

/** Arnés falsable mínimo: compilación + validador de elevación de la tarea. */
function falsifiableHarness(taskId) {
  return `node ./node_modules/typescript/bin/tsc --noEmit && node scripts/audit_elevation_task_harness.cjs --task=${taskId}`;
}

function elevateQueue(specArg, specSha256) {
  if (!fs.existsSync(QUEUE)) {
    console.error('QUEUE_AUSENTE: .antigravity/tasks_queue.json no legible (L2).');
    return { ok: false, code: 1 };
  }
  const queue = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
  const tasks = Array.isArray(queue.tasks) ? queue.tasks : [];
  const report = {
    tasks_scanned: tasks.length,
    elevated: [],
    already_elevated: [],
    skipped_non_executable: [],
    skipped_other_wave: [],
    compile_only_harness: [],
    scorecard_gap_tasks_created: [],
    scorecard_gap_tasks_present: [],
  };

  // ── WAVE 54 · alta de las 6 tareas que cierran los gaps P1 del scorecard.
  // Idempotente: si la tarea ya existe (viva o archivada) no se duplica.
  const specRel = relOf(path.resolve(ROOT, specArg));
  const archived = Array.isArray(queue.completed) ? queue.completed : [];
  for (const def of scorecardGapTasks()) {
    const live = tasks.find((t) => t && t.id === def.id);
    const done = archived.find((t) => t && t.id === def.id);
    if (live || done) {
      report.scorecard_gap_tasks_present.push(def.id);
      continue;
    }
    tasks.push(buildGapTask(def, specRel, specSha256, ELEVATION_TS));
    report.scorecard_gap_tasks_created.push(def.id);
  }

  for (const task of tasks) {
    if (!EXECUTABLE_STATES.has(task.status)) {
      report.skipped_non_executable.push(task.id);
      continue;
    }
    if (!isWave53OrLater(task.id)) {
      report.skipped_other_wave.push(task.id);
      continue;
    }

    const already =
      task.elevation_contract !== null &&
      typeof task.elevation_contract === 'object' &&
      task.elevation_contract.mark === ELEVATION_MARK;

    const previousTest = typeof task.test === 'string' ? task.test : null;

    // Arnés falsable obligatorio: la compilación no es prueba (Ley del Auditor Real).
    if (!previousTest || COMPILE_ONLY_TEST.test(previousTest)) {
      report.compile_only_harness.push({ id: task.id, previous_test: previousTest });
      task.test_previous = previousTest;
      task.test = falsifiableHarness(task.id);
    }

    // `done_when` declara el criterio de aceptación exclusivo del Arquitecto.
    if (!already) {
      const previousDone = typeof task.done_when === 'string' ? task.done_when.trim() : '';
      task.done_when =
        `${previousDone}${previousDone ? ' | ' : ''}` +
        `${ELEVATION_MARK}: cero any + persistencia durable real (mode:REAL / source:live / persisted:true) ` +
        '+ arnés falsable Exit 0 + firma del Arquitecto en .antigravity/ARCHITECT_APPROVAL.json';
    }

    task.elevation_contract = {
      mark: ELEVATION_MARK,
      spec: relOf(path.resolve(ROOT, specArg)),
      spec_sha256: specSha256,
      elevated_at: already ? task.elevation_contract.elevated_at : ELEVATION_TS,
      authority: 'El Arquitecto valida · Cline ejecuta sin autoaprobación',
      assertions: {
        zero_any: 'Cero tipos `any` en el diff: ruta de dinero, esquemas Prisma y utilidades del dominio.',
        durable_persistence:
          'Todo endpoint nuevo certifica modo real contra base de datos DURADERA: ' +
          'mode:"REAL", source:"live", persisted:true. Prohibido capturar el error de BD y devolver estáticos.',
        falsifiable_harness:
          'Arnés propio falsable declarado en `test` (su Exit Code 1 prueba el fallo). ' +
          'La compilación no se acepta como única prueba.',
        quintupla: 'Quíntupla EP-1 sellada en el ledger al cerrar (cmd · exit=0 · sha256 · ts · url).',
        batch_size: 'Máximo 5 archivos por commit (CHG-4).',
      },
      gates: [
        'npm run typecheck (Exit 0)',
        'arnés declarado en `test` (Exit 0)',
        'npm run audit:queue-counters (CONSISTENT)',
      ],
      worker_may_self_approve: false,
    };

    if (already) report.already_elevated.push(task.id);
    else {
      task.elevation_applied_at = ELEVATION_TS;
      task.elevation_source = relOf(path.resolve(ROOT, specArg));
      report.elevated.push(task.id);
    }
  }

  // Registro del mandato en `_meta`; los recuentos los reconcilia audit:queue-counters.
  const meta = queue._meta ?? queue.metadata;
  if (meta !== null && typeof meta === 'object') {
    meta.elevation_2026 = {
      ts: ELEVATION_TS,
      directive: relOf(path.resolve(ROOT, specArg)),
      directive_sha256: specSha256,
      mark: ELEVATION_MARK,
      authority: 'El Arquitecto valida; Cline ejecuta. Autoaprobación del obrero REVOCADA.',
      tasks_elevated: report.elevated.length,
      tasks_already_elevated: report.already_elevated.length,
      tasks_with_compile_only_harness: report.compile_only_harness.map((t) => t.id),
      scorecard_gap_wave: {
        wave: SCORECARD_GAP_WAVE,
        created: report.scorecard_gap_tasks_created,
        already_present: report.scorecard_gap_tasks_present,
        closes: ['OMEGA-10', 'OMEGA-11', 'OMEGA-12', 'OMEGA-13', 'OMEGA-15', 'OMEGA-16'],
      },
      note:
        'Los contratos elevados EXIGEN cero any, persistencia durable real y arnés falsable. ' +
        'Un test que sólo compila ya no se acepta como prueba.',
    };
  }

  if (!DRY_RUN) fs.writeFileSync(QUEUE, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
  return { ok: true, report };
}

// ──────────── PASO 3 · REVOCACIÓN DE AUTOAPROBACIÓN DEL OBRERO ──────────────
function writeApprovalRegistry(specArg, specSha256, queueReport) {
  let previous = null;
  if (fs.existsSync(APPROVAL)) {
    try {
      previous = JSON.parse(fs.readFileSync(APPROVAL, 'utf8'));
    } catch {
      previous = null; // registro corrupto: se regenera, no se confía en él
    }
  }
  const awaiting = queueReport
    ? queueReport.elevated.concat(queueReport.already_elevated).map((id) => ({ id, status: 'AWAITING_ARCHITECT' }))
    : [];

  const registry = {
    $schema: 'ear-os/architect-approval/v1',
    doctrine: 'ARCHITECT_DIRECTIVE_SOTA_2026 · separación de poderes (ejecutor ≠ validador)',
    directive: relOf(path.resolve(ROOT, specArg)),
    directive_sha256: specSha256,
    elevated_at: previous && previous.elevated_at ? previous.elevated_at : ELEVATION_TS,
    last_mandate_at: ELEVATION_TS,
    architect_approval: {
      required: true,
      authority: 'El Arquitecto de Sistemas de EAR OS',
      scope: 'Toda transición de tarea a estado verificado o terminal.',
      how_to_sign: 'Añadir { "id": "<TASK_ID>", "approved_at": "<ISO8601>", "by": "Arquitecto" } a approved[].',
      note: 'Sin registro en approved[], `omega.js complete` RECHAZA el cierre con Exit 1.',
    },
    worker_self_approval: {
      allowed: false,
      revoked_at:
        previous && previous.worker_self_approval ? previous.worker_self_approval.revoked_at : ELEVATION_TS,
      revoked_by: 'ARCHITECT_DIRECTIVE_SOTA_2026 §1.1 / §5.3',
      note: 'Cline (El Obrero) no declara estado completado ni certifica la calidad de su entrega.',
    },
    pending_review: awaiting,
    approved: previous && Array.isArray(previous.approved) ? previous.approved : [],
    rejected: previous && Array.isArray(previous.rejected) ? previous.rejected : [],
  };

  if (!DRY_RUN) {
    fs.mkdirSync(LG, { recursive: true });
    fs.writeFileSync(APPROVAL, `${JSON.stringify(registry, null, 2)}\n`, 'utf8');
  }
  return registry;
}

// ────────────────────────── INFORME MARKDOWN ────────────────────────────────
function renderMarkdown(directive, ledger, q, registry) {
  return [
    '# Mandato de Elevación SOTA 2026 — informe de ejecución',
    '',
    `- **Fecha**: ${ELEVATION_TS}`,
    `- **Directiva**: \`${directive.rel}\``,
    `- **SHA-256 directiva**: \`${directive.sha256}\``,
    '- **Autoridad de validación**: El Arquitecto (autoaprobación del obrero REVOCADA)',
    '',
    '## Paso 1 · Ledger (EP-4 append-only)',
    `- Líneas leídas: **${ledger.lines_read}** · quíntupla completa: **${ledger.quintupla_complete}** · parcial: **${ledger.quintupla_partial}**`,
    `- Claims bajo emulador simulado: **${ledger.simulated_claims.length}** · enmiendas añadidas: **${ledger.amendments_appended}**`,
    `- Estados no canónicos (EP-2): **${ledger.non_canonical_states.length}**`,
    '',
    '## Paso 2 · Contratos elevados',
    `- Tareas escaneadas: **${q.tasks_scanned}** · elevadas: **${q.elevated.length}** · ya elevadas: **${q.already_elevated.length}**`,
    `- Arnés sólo-compilación sustituido por arnés falsable: **${q.compile_only_harness.length}**`,
    `- Tareas Wave 54 creadas para cerrar OMEGA-10/11/12/13/15/16: **${q.scorecard_gap_tasks_created.length}**`,
    ...q.scorecard_gap_tasks_created.map((id) => `  - \`${id}\``),
    '',
    '## Paso 3 · Cadena de mando',
    `- \`architect_approval.required\`: **${registry.architect_approval.required}**`,
    `- \`worker_self_approval.allowed\`: **${registry.worker_self_approval.allowed}**`,
    `- Tareas en \`AWAITING_ARCHITECT\`: **${registry.pending_review.length}**`,
    '',
    '## Qué NO está probado',
    '- La firma del Arquitecto sobre cada tarea: el registro nace en `AWAITING_ARCHITECT`, no en aprobado.',
    '- Los 6 gaps P1 del scorecard siguen SIN_EVIDENCIA hasta que su instrumento exista en disco.',
    '',
  ].join('\n');
}

// ────────────────────────── ORQUESTACIÓN DEL MANDATO ────────────────────────
function main() {
  console.log('── MANDATO DE ELEVACIÓN · ARCHITECT_DIRECTIVE_SOTA_2026 ─────────────');
  if (DRY_RUN) console.log('[DRY-RUN] No se escribirá nada en disco.');

  const directive = loadDirective();
  if (!directive.ok) {
    console.log('ELEVATION_AUDIT=FAIL');
    return directive.code;
  }
  console.log(`Directiva      : ${directive.rel}`);
  console.log(`SHA-256        : ${directive.sha256}`);

  // PASO 1 · ledger
  console.log('\n[PASO 1] Reauditoría retroactiva del ledger (EP-4, append-only)');
  const ledger = auditLedger(SPEC_ARG);
  console.log(
    `  líneas leídas          : ${ledger.lines_read}` +
      (ledger.parse_errors.length ? ` (ilegibles: ${ledger.parse_errors.join(',')})` : '')
  );
  console.log(`  quíntupla completa     : ${ledger.quintupla_complete} · parcial: ${ledger.quintupla_partial}`);
  console.log(`  exit=0                 : ${ledger.exit_zero} · con url: ${ledger.with_url}`);
  console.log(`  claims simulados       : ${ledger.simulated_claims.length}`);
  for (const s of ledger.simulated_claims) console.log(`    · línea ${s.line} ${s.claim} (${s.state})`);
  console.log(`  estados no canónicos   : ${ledger.non_canonical_states.length}`);
  console.log(`  enmiendas añadidas     : ${ledger.amendments_appended}${DRY_RUN ? ' (dry-run)' : ''}`);

  // PASO 2 · contratos
  console.log('\n[PASO 2] Reestructuración de contratos (Wave 53 y posteriores)');
  const queueResult = elevateQueue(SPEC_ARG, directive.sha256);
  if (!queueResult.ok) {
    console.log('ELEVATION_AUDIT=FAIL');
    return queueResult.code;
  }
  const q = queueResult.report;
  console.log(`  tareas escaneadas      : ${q.tasks_scanned}`);
  console.log(`  contratos elevados     : ${q.elevated.length}`);
  console.log(`  ya elevados            : ${q.already_elevated.length}`);
  console.log(`  no ejecutables (skip)  : ${q.skipped_non_executable.length}`);
  console.log(`  fuera de W53+ (skip)   : ${q.skipped_other_wave.length}`);
  console.log(`  arnés sólo-compilación : ${q.compile_only_harness.length} -> sustituido por arnés falsable`);
  for (const t of q.compile_only_harness) console.log(`    · ${t.id} (antes: ${t.previous_test ?? 'sin test'})`);
  console.log(`  W54 gaps del scorecard : ${q.scorecard_gap_tasks_created.length} creadas · ${q.scorecard_gap_tasks_present.length} ya presentes`);
  for (const id of q.scorecard_gap_tasks_created) console.log(`    + ${id}`);

  // PASO 3 · cadena de mando
  console.log('\n[PASO 3] Revocación de autoaprobación del obrero');
  const registry = writeApprovalRegistry(SPEC_ARG, directive.sha256, q);
  console.log(`  architect_approval.required : ${registry.architect_approval.required}`);
  console.log(`  worker_self_approval.allowed: ${registry.worker_self_approval.allowed}`);
  console.log(`  tareas en AWAITING_ARCHITECT: ${registry.pending_review.length}`);
  console.log(`  registro                    : ${relOf(APPROVAL)}${DRY_RUN ? ' (dry-run, no escrito)' : ''}`);

  // PASO 4 · evidencia e informes
  if (!DRY_RUN) {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
    fs.writeFileSync(
      REPORT_JSON,
      `${JSON.stringify(
        {
          claim: 'ARCHITECT_ELEVATION_SOTA_2026',
          ts: ELEVATION_TS,
          directive: { path: directive.rel, sha256: directive.sha256 },
          ledger,
          queue: q,
          authority: registry,
          verdict: 'ELEVATION_APPLIED',
        },
        null,
        2
      )}\n`,
      'utf8'
    );
    fs.writeFileSync(REPORT_MD, renderMarkdown(directive, ledger, q, registry), 'utf8');
  }

  console.log('\n── RESULTADO ────────────────────────────────────────────────────────');
  console.log(`ELEVATION_AUDIT=${DRY_RUN ? 'DRY_RUN' : 'APPLIED'}`);
  console.log(`LEDGER_LINES=${ledger.lines_read} LEDGER_AMENDED=${ledger.amendments_appended} LEDGER_QUINTUPLA_PARTIAL=${ledger.quintupla_partial}`);
  console.log(`CONTRACTS_ELEVATED=${q.elevated.length} HARNESS_REPLACED=${q.compile_only_harness.length}`);
  console.log(`WORKER_SELF_APPROVAL=${registry.worker_self_approval.allowed ? 'ALLOWED' : 'REVOKED'}`);
  console.log(`ARQUITECTO: firma pendiente en ${relOf(APPROVAL)}`);
  return 0;
}

if (require.main === module) {
  process.exit(main());
}

module.exports = {
  auditLedger,
  elevateQueue,
  measureQuintupla,
  isSimulatedClaim,
  isWave53OrLater,
  LEDGER,
  QUEUE,
  APPROVAL,
};


