// ════════════════════════════════════════════════════════════════════════════════
// RETOS ULTRA-COMPLEJOS PARA FLOTA LOCAL (35B · 32B · 27B) — Benchmark objetivo
// Modos: node reto_local_35_32_27.cjs solve | 35b | 32b | 27b
// Cada reto tiene verificador determinista. Todo < 300s (5 min).
// ════════════════════════════════════════════════════════════════════════════════
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const OLLAMA = 'http://localhost:11434';
const DESKTOP = path.join(os.homedir(), 'Desktop');
const DEADLINE_MS = 295000; // < 5 min c/u

const MODELS = {
    '35b': 'qwen3.5-35b-a3b:latest',
    '32b': 'ear-32b-arquitecto-sclass:latest',
    '27b': 'ear-27b-apis-sclass:latest',
};

function round2(x) { return Math.round(x * 100) / 100; }
function norm(s) {
    return String(s).toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');
}

// ═══════════════════════════════════ PERMUTACIONES ═════════════════════════════
function allPerms(arr) {
    const res = [];
    function heap(k) {
        if (k === 1) { res.push(arr.slice()); return; }
        heap(k - 1);
        for (let i = 0; i < k - 1; i++) {
            if (k % 2 === 0) { const t = arr[i]; arr[i] = arr[k - 1]; arr[k - 1] = t; }
            else { const t = arr[0]; arr[0] = arr[k - 1]; arr[k - 1] = t; }
            heap(k - 1);
        }
    }
    heap(arr.length);
    return res;
}
const posMap = p => { const m = {}; p.forEach((v, i) => { m[v] = i; }); return m; };

// ───────────── RETO 1 (35B): "CÓDIGO DEL ZAR" — Zebra clásico de Einstein (5 atributos) ─────
const PUZZLE_TXT = `Resuelve el acertijo de lógica de Einstein (Zebra Puzzle). Hay 5 casas en fila, numeradas 1 a 5 de izquierda a derecha.
Categorías (una por casa, sin repetir en cada categoría):
- Colores: roja, verde, blanca, amarilla, azul
- Nacionalidades: británico, sueco, danés, noruego, alemán
- Bebidas: té, café, leche, cerveza, agua
- Cigarrillos: Pall Mall, Dunhill, Blend, Blue Master, Prince
- Mascotas: perro, pájaro, gato, caballo, pez

Pistas:
1. El británico vive en la casa roja.
2. El sueco tiene un perro.
3. El danés bebe té.
4. La casa verde está inmediatamente a la izquierda de la casa blanca.
5. El dueño de la casa verde bebe café.
6. El que fuma Pall Mall tiene un pájaro.
7. El dueño de la casa amarilla fuma Dunhill.
8. El de la casa del centro (casa 3) bebe leche.
9. El noruego vive en la primera casa (casa 1).
10. El que fuma Blend vive al lado del que tiene un gato.
11. El que tiene un caballo vive al lado del que fuma Dunhill.
12. El que fuma Blue Master bebe cerveza.
13. El alemán fuma Prince.
14. El noruego vive al lado de la casa azul.
15. El que fuma Blend tiene un vecino que bebe agua.

PREGUNTA: ¿Quién tiene el PEZ y en qué casa (1-5) vive?
Responde ÚNICAMENTE con el código estricto en minúsculas SIN tildes, formato NACION-CASA (ej: aleman-4). No añadas nada más.`;

function solveZebra() {
    const colors = ['roja', 'verde', 'blanca', 'amarilla', 'azul'];
    const nations = ['británico', 'sueco', 'danés', 'noruego', 'alemán'];
    const drinks = ['té', 'café', 'leche', 'cerveza', 'agua'];
    const smokes = ['pallmall', 'dunhill', 'blend', 'bluemaster', 'prince'];
    const pets = ['perro', 'pájaro', 'gato', 'caballo', 'pez'];
    const N = allPerms(nations);
    const C = allPerms(colors);
    const D = allPerms(drinks);
    const S = allPerms(smokes);
    const P = allPerms(pets);
    const sols = [];
    for (const n of N) {
        const np = posMap(n);
        if (np['noruego'] !== 0) continue;                                             // pista 9
        for (const c of C) {
            const cp = posMap(c);
            if (cp['verde'] + 1 !== cp['blanca']) continue;                            // pista 4
            if (np['británico'] !== cp['roja']) continue;                              // pista 1
            if (Math.abs(np['noruego'] - cp['azul']) !== 1) continue;                  // pista 14
            for (const d of D) {
                const dp = posMap(d);
                if (dp['leche'] !== 2) continue;                                       // pista 8
                if (np['danés'] !== dp['té']) continue;                                // pista 3
                if (cp['verde'] !== dp['café']) continue;                              // pista 5
                for (const s of S) {
                    const sp = posMap(s);
                    if (cp['amarilla'] !== sp['dunhill']) continue;                    // pista 7
                    if (np['alemán'] !== sp['prince']) continue;                       // pista 13
                    if (sp['bluemaster'] !== dp['cerveza']) continue;                  // pista 12
                    for (const p of P) {
                        const pp = posMap(p);
                        if (np['sueco'] !== pp['perro']) continue;                     // pista 2
                        if (sp['pallmall'] !== pp['pájaro']) continue;                 // pista 6
                        if (Math.abs(pp['caballo'] - sp['dunhill']) !== 1) continue;   // pista 11
                        if (Math.abs(sp['blend'] - pp['gato']) !== 1) continue;        // pista 10
                        if (Math.abs(sp['blend'] - dp['agua']) !== 1) continue;        // pista 15
                        sols.push({ nation: n, color: c, drink: d, smoke: s, pet: p, np, cp, dp, sp, pp });
                    }
                }
            }
        }
    }
    if (sols.length === 0) return { count: 0, fish: null, all: [] };
    const s = sols[0];
    const fishHouse = s.pp['pez'];
    const fishNation = s.nation[fishHouse];
    const all = sols.map((sol) => {
        const fh = sol.pp['pez'];
        return { fish: sol.nation[fh] + '-' + (fh + 1), nation: sol.nation, color: sol.color, drink: sol.drink, smoke: sol.smoke, pet: sol.pet };
    });
    return {
        count: sols.length,
        fish: { nation: fishNation, house: fishHouse + 1 },
        full: { nation: s.nation, color: s.color, drink: s.drink, smoke: s.smoke, pet: s.pet },
        all,
    };
}

// ───────────── RETO 2 (32B): "MOTOR DE LIQUIDACIÓN SSOT" ────────────────────────
const LIQ_TXT = `Eres un motor financiero. Aplica EXACTAMENTE estas reglas de negocio y produce un JSON.

REGLAS:
- Base solista: 350.00 €.
- Logística: si distancia > 50 km, cargo = (distancia - 50) × 1.50 €. Si distancia <= 50 km, cargo = 0.00 €.
- Hotel: +120.00 € si la hora de fin es 03:00 o más tarde (formato 24h HH:MM) O si distancia > 200 km.
- Total del evento = Base + Logística + Hotel.
- Split Soberano sobre el Total: 80% artista / 10% EAR OS / 10% VIMUME.
- El cliente ya pagó 100.00 € de depósito. Saldo pendiente del cliente = Total - 100.00.
- El artista ya recibió esos 100.00 € como parte de su 80%. Liquidación final al artista = (80% del Total) - 100.00.

Calcula los 4 escenarios. Todos los importes redondeados a 2 decimales.

ESCENARIOS:
A) km=50.00, fin="02:59"
B) km=50.10, fin="02:30"
C) km=200.00, fin="03:00"
D) km=200.10, fin="02:59"

Responde ÚNICAMENTE con un JSON válido (sin markdown, sin comentarios), un array llamado "escenarios" con 4 objetos, cada uno con estas claves exactas:
"escenario", "km", "fin", "logistica", "hotel", "total_evento", "split_artista", "split_ear", "split_vimume", "liquidacion_artista", "saldo_cliente".
Ejemplo de una entrada: {"escenario":"A","km":50,"fin":"02:59","logistica":0,"hotel":0,"total_evento":350,"split_artista":280,"split_ear":35,"split_vimume":35,"liquidacion_artista":180,"saldo_cliente":250}`;

function liquida(km, fin) {
    const log = km > 50 ? (km - 50) * 1.5 : 0;
    const [h, m] = fin.split(':').map(Number);
    const tarde = h >= 3;
    const hotel = (tarde || km > 200) ? 120 : 0;
    const total = round2(350 + log + hotel);
    const artista = round2(total * 0.8);
    const ear = round2(total * 0.1);
    const vimume = round2(total * 0.1);
    const liqArt = round2(artista - 100);
    const saldo = round2(total - 100);
    return { logistica: round2(log), hotel: round2(hotel), total_evento: total, split_artista: artista, split_ear: ear, split_vimume: vimume, liquidacion_artista: liqArt, saldo_cliente: saldo };
}
const LIQ_CASES = [
    { escenario: 'A', km: 50.00, fin: '02:59' },
    { escenario: 'B', km: 50.10, fin: '02:30' },
    { escenario: 'C', km: 200.00, fin: '03:00' },
    { escenario: 'D', km: 200.10, fin: '02:59' },
];

// ───────────── RETO 3 (27B): "CONTRATO OPENAPI 3.1 IDEMPOTENTE" ─────────────────
const API_TXT = `Genera un contrato OpenAPI 3.1.0 completo y válido en JSON para un endpoint de cierre de depósito.

REQUISITOS ESTRICTOS:
- "openapi": "3.1.0".
- "info": {"title": "...", "version": "..."} con título y versión no vacíos.
- "paths" con EXACTAMENTE una ruta: "POST /v1/price-lock".
- La operación debe tener:
  * "operationId": "createPriceLock"
  * "summary" no vacío
  * "requestBody" con "required": true, contenido "application/json" cuyo "schema" es {"$ref":"#/components/schemas/PriceLockRequest"}
  * "responses" con códigos "200", "400" y "409" (cada uno con "description" no vacía)
  * "security": [{"bearerAuth": []}]
- "components.schemas.PriceLockRequest":
  * "type": "object"
  * "required": ["event_date","amount_eur","idempotency_key"]
  * "properties.event_date": {"type":"string","format":"date-time"}
  * "properties.amount_eur": {"type":"number","minimum":100}
  * "properties.idempotency_key": {"type":"string","minLength":16}
- "components.securitySchemes.bearerAuth": {"type":"http","scheme":"bearer","bearerFormat":"JWT"}

Responde ÚNICAMENTE con el JSON del documento OpenAPI 3.1.0 completo (sin markdown, sin comentarios, sin texto adicional).`;

// ═══════════════════════════════ CHECKERS ═══════════════════════════════════════
function parseJson(raw) {
    let t = String(raw).trim();
    if (t.startsWith('```')) {
        const m = t.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (m) t = m[1].trim();
        else t = t.replace(/```/g, '').trim();
    }
    const start = t.indexOf('{');
    if (start === -1) return { err: 'no-json', obj: null };
    const arrStart = t.indexOf('[');
    let idx = start;
    if (arrStart !== -1 && (start === -1 || arrStart < start)) idx = arrStart;
    let obj = null;
    try { obj = JSON.parse(t.slice(idx)); } catch (e) { return { err: 'parse-fail', obj: null }; }
    return { err: null, obj };
}

function check35(zebra, out) {
    const z = zebra.fish;
    const m = out.match(/([a-záéíóúñü]+)\s*-\s*(\d)/i);
    if (!m) return { pass: false, detail: `No se halló código NACION-CASA. Zebra solución real: ${z.nation}-${z.house}.`, gt: z };
    const nation = norm(m[1]);
    const house = parseInt(m[2], 10);
    const ok = nation === norm(z.nation) && house === z.house;
    return { pass: ok, detail: `Modelo: ${m[1]}-${m[2]} | Solución real: ${z.nation}-${z.house}`, gt: z };
}

function check32(raw) {
    const { obj, err } = parseJson(raw);
    if (err) return { pass: false, detail: `JSON inválido: ${err}`, gt: null };
    let arr = obj;
    if (Array.isArray(obj.escenarios)) arr = obj.escenarios;
    if (!Array.isArray(arr)) return { pass: false, detail: 'No se halló array "escenarios"', gt: null };
    const keys = ['logistica', 'hotel', 'total_evento', 'split_artista', 'split_ear', 'split_vimume', 'liquidacion_artista', 'saldo_cliente'];
    let ok = true;
    const report = [];
    for (let i = 0; i < LIQ_CASES.length; i++) {
        const c = LIQ_CASES[i];
        const got = arr.find(x => String(x && x.escenario).toUpperCase() === c.escenario);
        if (!got) { ok = false; report.push(`${c.escenario}: faltante`); continue; }
        const gt = liquida(c.km, c.fin);
        const diffs = [];
        for (const k of keys) {
            const g = gt[k]; const v = Number(got[k]);
            if (!Number.isFinite(v) || Math.abs(v - g) > 1e-6) diffs.push(`${k}=${got[k]} (esperado ${g})`);
        }
        if (diffs.length) { ok = false; report.push(`${c.escenario}: ${diffs.join(', ')}`); }
        else report.push(`${c.escenario}: OK (total ${gt.total_evento})`);
    }
    const gtAll = Object.fromEntries(LIQ_CASES.map(c => [c.escenario, liquida(c.km, c.fin)]));
    return { pass: ok, detail: report.join(' | '), gt: gtAll };
}

function check27(raw) {
    const { obj, err } = parseJson(raw);
    if (err) return { pass: false, detail: `JSON inválido: ${err}`, gt: null };
    const fails = [];
    const need = (cond, msg) => { if (!cond) fails.push(msg); };
    need(obj.openapi === '3.1.0', `openapi != 3.1.0 (${obj.openapi})`);
    need(obj.info && typeof obj.info.title === 'string' && obj.info.title.trim() !== '', 'info.title vacío');
    need(obj.info && typeof obj.info.version === 'string' && obj.info.version.trim() !== '', 'info.version vacío');
    const keys = obj.paths ? Object.keys(obj.paths) : [];
    need(keys.length === 1 && keys[0] === '/v1/price-lock', `paths debe ser solo ['/v1/price-lock'] (${JSON.stringify(keys)})`);
    const op = obj.paths && obj.paths['/v1/price-lock'] && obj.paths['/v1/price-lock'].post;
    need(!!op, 'falta POST /v1/price-lock');
    if (op) {
        need(op.operationId === 'createPriceLock', `operationId=${op.operationId}`);
        need(typeof op.summary === 'string' && op.summary.trim() !== '', 'summary vacío');
        need(op.requestBody && op.requestBody.required === true, 'requestBody.required != true');
        const sch = op.requestBody && op.requestBody.content && op.requestBody.content['application/json'] && op.requestBody.content['application/json'].schema;
        need(!!sch && sch.$ref === '#/components/schemas/PriceLockRequest', 'schema $ref incorrecto');
        need(!!op.responses, 'falta responses');
        for (const code of ['200', '400', '409']) {
            const r = op.responses && op.responses[code];
            need(!!r && typeof r.description === 'string' && r.description.trim() !== '', `respuesta ${code} inválida`);
        }
        need(Array.isArray(op.security) && JSON.stringify(op.security) === JSON.stringify([{ bearerAuth: [] }]), 'security incorrecto');
    }
    const s = obj.components && obj.components.schemas && obj.components.schemas.PriceLockRequest;
    need(!!s, 'falta components.schemas.PriceLockRequest');
    if (s) {
        need(s.type === 'object', `PriceLockRequest.type=${s.type}`);
        need(Array.isArray(s.required) && ['event_date', 'amount_eur', 'idempotency_key'].every(r => s.required.includes(r)), `required=${JSON.stringify(s.required)}`);
        need(s.properties && s.properties.event_date && s.properties.event_date.type === 'string' && s.properties.event_date.format === 'date-time', 'event_date inválido');
        need(s.properties && s.properties.amount_eur && s.properties.amount_eur.type === 'number' && s.properties.amount_eur.minimum === 100, 'amount_eur inválido');
        need(s.properties && s.properties.idempotency_key && s.properties.idempotency_key.type === 'string' && s.properties.idempotency_key.minLength === 16, 'idempotency_key inválido');
    }
    const sec = obj.components && obj.components.securitySchemes && obj.components.securitySchemes.bearerAuth;
    need(sec && sec.type === 'http' && sec.scheme === 'bearer' && sec.bearerFormat === 'JWT', 'bearerAuth inválido');
    return { pass: fails.length === 0, detail: fails.length ? fails.join(' | ') : 'Contrato 100% válido', gt: null };
}

// ═══════════════════════════════ RUNNER ════════════════════════════════════════
async function generate(model, prompt, opts) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), DEADLINE_MS);
    const started = Date.now();
    let out = '';
    let fin = null;
    try {
        const res = await fetch(`${OLLAMA}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model, prompt, stream: true, options: opts }),
            signal: ctrl.signal,
        });
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let buf = '';
        for (; ;) {
            const { done, value } = await reader.read();
            if (done) break;
            buf += dec.decode(value, { stream: true });
            let i;
            while ((i = buf.indexOf('\n')) >= 0) {
                const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
                if (!line) continue;
                let j; try { j = JSON.parse(line); } catch { continue; }
                if (typeof j.response === 'string') out += j.response;
                if (j.done) fin = j;
            }
        }
    } catch (e) {
        clearTimeout(timer);
        return { out, fin, timedOut: true, wallMs: Date.now() - started, error: String(e && e.message || e) };
    }
    clearTimeout(timer);
    return { out, fin, timedOut: false, wallMs: Date.now() - started, error: null };
}

const CHALLENGES = {
    '35b': {
        title: 'RETO 1 — CÓDIGO DEL ZAR (Zebra clásico de Einstein, 5 atributos)',
        model: MODELS['35b'],
        prompt: PUZZLE_TXT,
        opts: { temperature: 0, num_predict: 1400 },
        check: (out, zebra) => check35(zebra, out),
        file: 'RETO_35B_CODIGO_DEL_ZAR.md',
    },
    '32b': {
        title: 'RETO 2 — MOTOR DE LIQUIDACIÓN SSOT (Aritmética exacta + reglas de negocio)',
        model: MODELS['32b'],
        prompt: LIQ_TXT,
        opts: { temperature: 0, num_predict: 900, num_ctx: 1024 },
        check: (out) => check32(out),
        file: 'RETO_32B_MOTOR_LIQUIDACION_SSOT.md',
    },
    '27b': {
        title: 'RETO 3 — CONTRATO OPENAPI 3.1 IDEMPOTENTE (JSON estricto)',
        model: MODELS['27b'],
        prompt: API_TXT,
        opts: { temperature: 0, num_predict: 1400, num_ctx: 1024 },
        check: (out) => check27(out),
        file: 'RETO_27B_CONTRATO_OPENAPI.md',
    },
};

function fmtNs(ns) { return ns ? (ns / 1e9).toFixed(2) : '0'; }

async function run(key) {
    const ch = CHALLENGES[key];
    const zebra = key === '35b' ? solveZebra() : null;
    const gtPreview = key === '35b'
        ? (zebra.count === 0 ? 'PUZZLE INCONSISTENTE (0 soluciones)' : `pez=${zebra.fish.nation}-${zebra.fish.house} (${zebra.count} soluciones)`)
        : (key === '32b' ? JSON.stringify(Object.fromEntries(LIQ_CASES.map(c => [c.escenario, liquida(c.km, c.fin)]))) : 'verificador estructural');

    const r = await generate(ch.model, ch.prompt, ch.opts);
    const wallSec = (r.wallMs / 1000).toFixed(2);
    const evalSec = r.fin && r.fin.eval_duration ? (r.fin.eval_duration / 1e9).toFixed(2) : null;
    const tokens = r.fin && r.fin.eval_count ? r.fin.eval_count : 0;
    const tps = evalSec && Number(evalSec) > 0 ? (tokens / Number(evalSec)).toFixed(1) : null;
    const verdict = r.timedOut ? 'TIMEOUT (>5min)' : (ch.check(r.out, zebra).pass ? '✅ PASS' : '❌ FAIL');
    const check = ch.check(r.out, zebra);

    // Escribir informe MD en Escritorio
    const md = `# ${ch.title}
**Modelo:** \`${ch.model}\`
**Veredicto:** ${verdict}
**Tiempo total (pared):** ${wallSec} s | **Evaluación (GPU):** ${evalSec ?? 'n/d'} s | **Tokens generados:** ${tokens} | **Velocidad:** ${tps ?? 'n/d'} tok/s
**Deadline:** ${DEADLINE_MS / 1000}s (5 min)

## Verificación
${check.detail}
- Ground truth del verificador: \`${gtPreview}\`

## Prompt enviado
\`\`\`
${ch.prompt}
\`\`\`

## Respuesta cruda del modelo
\`\`\`
${r.out || (r.timedOut ? '<< TIMEOUT — sin salida completa >>' : '')}
\`\`\`

## Telemetría Ollama (final line)
\`\`\`
${r.fin ? JSON.stringify(r.fin, null, 2) : 'n/d'}
\`\`\`
`;
    fs.writeFileSync(path.join(DESKTOP, ch.file), md, 'utf8');

    const summary = {
        key, model: ch.model, verdict: verdict, pass: check.pass,
        wallSec: Number(wallSec), evalSec: evalSec ? Number(evalSec) : null, tokens, tps: tps ? Number(tps) : null,
        gt: gtPreview, timedOut: r.timedOut, error: r.error || null, file: path.join(DESKTOP, ch.file),
    };
    console.log('RESULT_JSON:' + JSON.stringify(summary));
}

// ───────── modos ─────────
const mode = process.argv[2];
(async () => {
    if (mode === 'solve' || mode === 'sols') {
        const z = solveZebra();
        const fishOwners = [...new Set((z.all || []).map(s => s.fish))];
        console.log(JSON.stringify({
            zebra: z.count === 0 ? null : { count: z.count, fish: z.fish, full: z.full },
            all_solutions: z.all,
            unique_fish_answers: fishOwners,
            fish_is_unambiguous: fishOwners.length === 1,
            liq: Object.fromEntries(LIQ_CASES.map(c => [c.escenario, liquida(c.km, c.fin)])),
        }, null, 2));
        return;
    }
    if (CHALLENGES[mode]) { await run(mode); return; }
    console.error('Uso: node reto_local_35_32_27.cjs solve|35b|32b|27b');
    process.exit(1);
})();