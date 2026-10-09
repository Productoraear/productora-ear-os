// ════════════════════════════════════════════════════════════════════════════════
// OMNI-ROUTER v1 — Router Autónomo de Modelos (Local + Cloud) con Desborde VRAM
// Principio: analiza el prompt → calcula complejidad + peso/VRAM + salud del
// dispositivo → elige el mejor modelo. Aprende del histórico (UCB1) y recalibra solo.
// Uso:
//   node omni_router.cjs "hola"                       → enruta y ejecuta
//   node omni_router.cjs --dry-run "hola"             → solo decisión (sin ejecutar)
//   node omni_router.cjs --explain "crea una plataforma" → decisión + trazabilidad
//   node omni_router.cjs --bench                      → dry-run de los 3 retos
//   node omni_router.cjs --status                     → flota + memoria
//   node omni_router.cjs --ok | --bad                 → feedback de la última tirada
// ════════════════════════════════════════════════════════════════════════════════
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const OLLAMA = 'http://localhost:11434';
const LMS = 'http://localhost:1234'; // LM Studio (OpenAI-compatible)
const MEMORY = path.join(__dirname, 'omni_router_memory.json');
const LAST = path.join(__dirname, 'omni_router_last.json');
const VRAM_TOTAL_GB = 24; // AMD 7900 XTX
const UCBC = 1.41;        // factor de exploración UCB (balance explotar/explorar)
const GPU_MAX_FREE_SAFETY_GB = 1.5; // margen de seguridad en VRAM

// ─────────────────────────────── REGISTRO DE MODELOS ────────────────────────────
// tags de capacidad: text, reasoning, code, finance, vision, rag, video
const MODELS = {
    'qwen3.5-35b-a3b:latest': {
        label: '35B·MoE Generalista (El de Ricardo)', sizeGB: 22, kind: 'ollama',
        caps: ['text', 'reasoning', 'code', 'finance'], tier: 4, gpuProven: true,
        ctxKvGB: 1.2, ctxKvSmallGB: 0.25,
    },
    'ear-32b-arquitecto-sclass:latest': {
        label: '32B·Arquitecto S-Class', sizeGB: 19, kind: 'ollama',
        caps: ['text', 'reasoning', 'code', 'finance'], tier: 4, gpuProven: false,
        ctxKvGB: 1.0, ctxKvSmallGB: 0.20,
    },
    'ear-27b-apis-sclass:latest': {
        label: '27B·APIs S-Class', sizeGB: 16, kind: 'ollama',
        caps: ['text', 'code', 'finance'], tier: 3, gpuProven: false,
        ctxKvGB: 0.9, ctxKvSmallGB: 0.18,
    },
    'ear-14b-textos-sclass:latest': {
        label: '14B·Textos S-Class', sizeGB: 9.0, kind: 'ollama',
        caps: ['text'], tier: 2, gpuProven: false,
        ctxKvGB: 0.5, ctxKvSmallGB: 0.12,
    },
    'nimble:latest': {
        label: 'Nimble·9.5B Rápido', sizeGB: 9.5, kind: 'ollama',
        caps: ['text', 'chat'], tier: 1, gpuProven: true,
        ctxKvGB: 0.5, ctxKvSmallGB: 0.12,
    },
    // LM Studio (OpenAI-compatible en :1234) — detectado en workstation
    'lms:vlm-7b': {
        label: 'VL-7B·Visión (LM Studio)', sizeGB: 8, kind: 'lms',
        caps: ['vision', 'text'], tier: 2, gpuProven: true, ctxKvGB: 0.6, ctxKvSmallGB: 0.15,
    },
    'lms:embed': {
        label: 'Nomic-Embed·RAG (LM Studio)', sizeGB: 1, kind: 'lms',
        caps: ['rag'], tier: 1, gpuProven: true, ctxKvGB: 0.1, ctxKvSmallGB: 0.05,
    },
    // Nube (adaptadores con llave)
    'cloud:gemini': {
        label: 'Gemini (Nano Banana/Imagen/Veo)', sizeGB: 0, kind: 'cloud',
        caps: ['text', 'vision', 'image', 'video'], tier: 5, gpuProven: true, key: 'GEMINI_API_KEY',
    },
    'cloud:higgsfield': {
        label: 'Higgsfield (Video IA)', sizeGB: 0, kind: 'cloud',
        caps: ['video', 'image'], tier: 5, gpuProven: true, key: 'HIGGSFIELD_API_KEY',
    },
    'cloud:banana': {
        label: 'Nano Banana (Prompt xyz / Imagen)', sizeGB: 0, kind: 'cloud',
        caps: ['image'], tier: 5, gpuProven: true, key: 'BANANA_API_KEY',
    },
};

// ─────────────────────────── CLASIFICADOR DE INTENCIÓN + COMPLEJIDAD ─────────────
const INTENTS = {
    chat: { weight: 0.05, label: 'chat trivial' },
    finance: { weight: 0.35, label: 'dinero/SSOT' },
    code: { weight: 0.40, label: 'ingeniería/código' },
    reasoning: { weight: 0.45, label: 'razonamiento profundo' },
    video: { weight: 0.50, label: 'generación de video' },
    image: { weight: 0.40, label: 'generación de imagen' },
    rag: { weight: 0.30, label: 'recuperación/embedding' },
    vision: { weight: 0.30, label: 'comprensión visual' },
};

function classify(prompt) {
    const p = String(prompt).toLowerCase();
    const t = String(prompt);

    const has = (re) => re.test(t);

    // Multimodal / nube (palabras clave de ecosistemas concretos)
    if (has(/(higgsfield|nano banana|banana prompt|prompt xyz|veo|runway|sora|kling|pixverse|video ia|genera un video|crea un video|clip de video)/i)) {
        const goal = has(/higgsfield/i) ? 'cloud:higgsfield'
            : has(/veo/i) ? 'cloud:gemini'
                : (has(/banana|prompt xyz|imagen/i) ? 'cloud:banana' : 'cloud:higgsfield');
        return { intent: has(/imagen|banana/) && !has(/video/i) ? 'image' : 'video', goal, streaming: false };
    }
    if (has(/(comprende|analiza|describe|lee) (la |esta |el )?(imagen|foto|captura|diagrama)/i)) {
        return { intent: 'vision', goal: 'lms:vlm-7b', streaming: true };
    }
    if (has(/(embedding|vectoriza|rag|recupera|busca en|consulta el |knowledge base|índice semántico)/i)) {
        return { intent: 'rag', goal: 'lms:embed', streaming: false };
    }

    // Dinero / negocio
    const money = has(/(€|eur|precio|presupuesto|cotiza|split|80\/10|liquidación|liquidacion|factura|depósito|deposito|stripe|ssot|tarifa|comisión|comision)/i);

    // Ingeniería / código
    const code = has(/(openapi|json|typescript|código|codigo|api|endpoint|schema|function|clase|componente|next\.js|react|sql|prisma|server action|refactoriza|implementa|bug|test|migrar)/i);

    // Razonamiento profundo
    const deep = has(/(razona|deduce|resuelve|acertijo|zebra|einstein|demuestra|arquitecta|diseña|máximo|maximo|complejo|complejidad|élite|elite|vanguardista|a prueba de|irrompible)/i);

    // Señales de construcción masiva → sube el listón
    const massive = has(/(plataforma web|saas|app completa|sistema|motor|orquestador|arquitectura|microservicios|full.?stack|producción|produccion|blindaje)/i);

    let intent = 'chat';
    if (money) intent = 'finance';
    if (code) intent = 'code';
    if (deep && !code) intent = 'reasoning';
    if (deep && code) intent = 'reasoning';

    // complejidad estructural
    let complexity = 0.1;
    complexity += Math.min(0.5, t.length / 4000);
    complexity += Math.min(0.2, (t.match(/[•*\-]\s/g) || []).length / 20);
    complexity += Math.min(0.3, (t.match(/\d/g) || []).length / 60);
    if (massive) complexity += 0.35;
    if (money) complexity += 0.15;
    if (code) complexity += 0.20;
    if (deep) complexity += 0.25;
    complexity = Math.max(0.05, Math.min(1.0, complexity));

    return { intent, goal: null, streaming: true, complexity };
}

// ─────────────────────────── SONDA DE FLOTA + VRAM ───────────────────────────────
function shell(cmd) {
    try { return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); }
    catch { return ''; }
}

function listOllama() {
    const out = shell('ollama list');
    const map = {};
    for (const line of out.split(/\r?\n/)) {
        const m = line.match(/^(\S+)\s+\S+\s+([\d.]+)\s*GB/i);
        if (m) map[m[1]] = parseFloat(m[2]);
    }
    return map;
}

function ollamaPs() {
    const out = shell('ollama ps');
    const rows = [];
    for (const line of out.split(/\r?\n/)) {
        const m = line.match(/^(\S+)\s+\S+\s+([\d.]+)\s+GB\s+(\d+%)\s+(CPU|GPU|GPU\/CPU|100% CPU)/i);
        if (m) rows.push({ name: m[1], sizeGB: parseFloat(m[2]), cpu100: /CPU/i.test(m[3]) && !/GPU/i.test(m[3]), processor: m[3] });
    }
    return rows;
}

function freeVRAM() {
    const loaded = ollamaPs().reduce((a, r) => a + r.sizeGB, 0);
    return Math.max(0, VRAM_TOTAL_GB - loaded);
}

function lmsAlive() {
    try {
        execSync('curl -s -m 1 http://localhost:1234/v1/models', { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
        return true;
    } catch { return false; }
}

// ─────────────────────────── MEMORIA DE APRENDIZAJE (UCB1) ───────────────────────
function loadMemory() {
    try { return JSON.parse(fs.readFileSync(MEMORY, 'utf8')); }
    catch { return { arms: {}, plays: 0, version: 1 }; }
}
function saveMemory(m) { fs.writeFileSync(MEMORY, JSON.stringify(m, null, 2)); }

function ucbScore(arm) {
    const plays = arm.plays || 0;
    if (plays === 0) return (arm.prior || 0.5);
    const mean = (arm.wins || 0) / plays;
    const exploration = UCBC * Math.sqrt(Math.log(Math.max(1, global._plays || 1)) / plays);
    return mean + exploration;
}

function armKey(intent, model) { return intent + '::' + model; }

function getPrior(intent, model, complexity) {
    const m = MODELS[model];
    if (!m) return 0.3;
    const cap = INTENTS[intent] || { weight: 0.2 };
    let p = 0.3 + (m.tier || 2) * 0.08 + cap.weight;
    // El modelo debe saber hacer la tarea
    if (intent === 'chat') p = m.caps.includes('text') ? 0.65 : 0.1;
    if (intent === 'finance') p = m.caps.includes('finance') ? p : p - 0.35;
    if (intent === 'code') p = m.caps.includes('code') ? p : p - 0.35;
    if (intent === 'reasoning') p = m.caps.includes('reasoning') ? p : p - 0.4;
    if (intent === 'video') p = m.caps.includes('video') ? p + 0.4 : 0.05;
    if (intent === 'image') p = m.caps.includes('image') ? p + 0.4 : 0.05;
    if (intent === 'vision') p = m.caps.includes('vision') ? p + 0.4 : 0.05;
    if (intent === 'rag') p = m.caps.includes('rag') ? p + 0.4 : 0.05;
    // Complejidad empuja hacia modelos de más nivel
    if (complexity > 0.6) p += (m.tier >= 4 ? 0.2 : -0.15);
    if (complexity < 0.2) p -= (m.tier >= 4 ? 0.25 : -0.1);
    // Si no está probado en GPU y es pesado, penalizamos latencia
    if (m.sizeGB > 12 && m.gpuProven === false) p -= 0.15;
    return Math.max(0.0, Math.min(1.0, p));
}

// ─────────────────────────── DECISIÓN DE ENRUTAMIENTO ────────────────────────────
function route(prompt) {
    const cls = classify(prompt);
    const mem = loadMemory();
    const oils = listOllama();
    const free = freeVRAM();
    const lms = lmsAlive();

    // intención con destino fijo (nube / visión / rag)
    if (cls.goal) {
        const m = MODELS[cls.goal];
        const keyOk = m.key ? !!process.env[m.key] : true;
        return {
            cls, decision: {
                model: cls.goal, reason: `destino fijo por intención "${cls.intent}"`,
                cloudReady: m.kind === 'cloud' ? keyOk : null,
                cloudMissingKey: m.kind === 'cloud' && !keyOk ? m.key : null,
                gpuSafe: true, overflow: false, streaming: cls.streaming,
            }, mem,
        };
    }

    // candidatos locales disponibles
    const candidates = Object.keys(MODELS).filter((k) => {
        const m = MODELS[k];
        if (m.kind === 'cloud') return false;
        if (m.kind === 'ollama') return oils[k] !== undefined;
        if (m.kind === 'lms') return lms;
        return false;
    });

    // PRESUPUESTO DE COMPLEJIDAD (gate): trivial exige el nivel más ligero
    // disponible. El aprendizaje no puede anular esta frontera de desperdicio.
    let pool = candidates;
    if (cls.complexity < 0.2 && cls.intent === 'chat' && candidates.length) {
        const minTier = Math.min(...candidates.map((k) => MODELS[k].tier));
        pool = candidates.filter((k) => MODELS[k].tier === minTier);
    }

    // puntúa con UCB + prior + penalización por desborde previsible
    global._plays = mem.plays || 1;
    const scored = pool.map((model) => {
        const m = MODELS[model];
        const needed = m.sizeGB + (cls.complexity > 0.6 ? m.ctxKvGB : m.ctxKvSmallGB);
        const fitsGPU = needed <= (free + GPU_MAX_FREE_SAFETY_GB);
        const arm = (mem.arms && mem.arms[armKey(cls.intent, model)]) || { plays: 0, wins: 0, prior: getPrior(cls.intent, model, cls.complexity) };
        let score = ucbScore(arm);
        if (!fitsGPU && m.sizeGB > 12) score -= 0.3;   // desbordaría a CPU → penaliza
        if (cls.complexity > 0.6 && m.tier < 3) score -= 0.25; // tarea difícil exige nivel
        // chat trivial exige el modelo más rápido/ligero
        if (cls.intent === 'chat' && m.tier > 1) score -= 0.05 * (m.tier - 1);
        return { model, score, needed, tier: m.tier, fitsGPU, arms: arm };
    }).sort((a, b) => b.score - a.score || a.tier - b.tier || a.needed - b.needed);

    const best = scored[0];
    const overflow = best && !best.fitsGPU;

    return {
        cls,
        decision: {
            model: best ? best.model : null,
            reason: best
                ? `UCB=${best.score.toFixed(3)} · complejidad=${cls.complexity.toFixed(2)} · VRAM libre=${free.toFixed(1)}GB · cabe en GPU=${best.fitsGPU}`
                : 'sin flota local disponible',
            gpuSafe: best ? best.fitsGPU : false,
            overflow: overflow,
            streaming: true,
            fallback: overflow ? scored.slice(1, 4).map(s => s.model) : [],
        },
        ranked: scored.map(s => ({ model: s.model, score: +s.score.toFixed(3), fitsGPU: s.fitsGPU, plays: s.arms.plays || 0 })),
        mem,
    };
}

// ─────────────────────────── EJECUCIÓN (Ollama / LM Studio) ──────────────────────
async function execute(model, prompt, opts) {
    if (model.startsWith('lms:')) {
        const real = model === 'lms:vlm-7b' ? 'VL-7B' : 'nomic-embed';
        return { out: `[LM Studio/${real}] adaptador listo (llamada OpenAI-compatible a ${LMS}/v1/chat/completions)`, fin: null, kind: 'lms' };
    }
    if (model.startsWith('cloud:')) {
        return { out: `[CLOUD/${model}] adaptador listo — se dispararía al proveedor si la clave está presente.`, fin: null, kind: 'cloud' };
    }
    // Ollama real (stream)
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 280000);
    const started = Date.now();
    let out = '';
    let fin = null;
    try {
        const res = await fetch(`${OLLAMA}/api/generate`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model, prompt, stream: true, options: opts || { temperature: 0.6 } }),
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
        return { out, fin, kind: 'ollama', timedOut: true, wallMs: Date.now() - started };
    }
    clearTimeout(timer);
    return { out, fin, kind: 'ollama', timedOut: false, wallMs: Date.now() - started };
}

// ─────────────────────────── APRENDIZAJE (registro + recalibración) ──────────────
function record(intent, model, success, latMs) {
    const mem = loadMemory();
    mem.plays = (mem.plays || 0) + 1;
    mem.arms = mem.arms || {};
    const k = armKey(intent, model);
    const a = mem.arms[k] || { plays: 0, wins: 0, prior: 0.5, latSum: 0 };
    a.plays += 1;
    if (success) a.wins += 1;
    a.latSum = (a.latSum || 0) + latMs;
    a.last = Date.now();
    mem.arms[k] = a;
    mem.lastRun = { intent, model, success, latMs, at: Date.now() };
    saveMemory(mem);
    return mem;
}

function forgetLast() {
    const mem = loadMemory();
    const last = mem.lastRun;
    if (!last) return mem;
    const k = armKey(last.intent, last.model);
    const a = mem.arms[k];
    if (a) {
        a.plays = Math.max(0, a.plays - 1);
        if (last.success) a.wins = Math.max(0, a.wins - 1);
        a.latSum = Math.max(0, (a.latSum || 0) - (last.latMs || 0));
    }
    mem.lastRun = null;
    saveMemory(mem);
    return mem;
}

// ─────────────────────────── CLI ────────────────────────────────────────────────
async function main() {
    const args = process.argv.slice(2);
    if (args[0] === '--status') {
        const mem = loadMemory();
        const oils = listOllama();
        const ps = ollamaPs();
        console.log(JSON.stringify({ fleet: oils, running: ps, freeVRAM: +freeVRAM().toFixed(1), lmsAlive: lmsAlive(), memory: mem }, null, 2));
        return;
    }
    if (args[0] === '--bench') {
        const cases = [
            'hola, ¿cómo estás?',
            'resuelve el acertijo del zebra de einstein y dime quién tiene el pez',
            'calcula la liquidación con split 80/10/10, base 350€, logística 1.50€/km a partir de 50km y hotel +120€ si fin >= 03:00',
            'genera un contrato OpenAPI 3.1 JSON con POST /v1/price-lock y bearer JWT',
            'crea un video con higgsfield de un artista en un escenario épico',
        ];
        for (const c of cases) {
            const r = route(c);
            console.log(`\nPROMPT: ${c}`);
            console.log(`  → ${r.decision.model}  [${r.cls.intent}]  ${r.decision.reason}`);
        }
        return;
    }
    if (args[0] === '--ok') { const m = record('__manual__', '__manual__', true, 0); m.lastRun && (m.lastRun.success = true); saveMemory(m); const r = route(''); console.log('feedback OK registrado'); return; }
    if (args[0] === '--bad') { forgetLast(); console.log('feedback BAD registrado (última tirada descontada)'); return; }

    const dry = args[0] === '--dry-run';
    const explain = args[0] === '--explain';
    const promptArg = dry || explain ? args.slice(1).join(' ') : args.join(' ');
    if (!promptArg) { console.error('Uso: node omni_router.cjs ["prompt"] | --dry-run "p" | --explain "p" | --bench | --status | --ok | --bad'); process.exit(1); }

    const r = route(promptArg);
    const d = r.decision;

    console.log('══════════ OMNI-ROUTER ══════════');
    console.log(`Intención     : ${r.cls.intent} (${(INTENTS[r.cls.intent] || {}).label || ''})`);
    console.log(`Complejidad   : ${r.cls.complexity.toFixed(2)}`);
    console.log(`Modelo elegido: ${d.model}`);
    console.log(`Motivo        : ${d.reason}`);
    if (d.overflow) console.log(`⚠ DESBORDE    : no cabe en GPU → fallback ${d.fallback.join(', ')}`);
    if (d.cloudMissingKey) console.log(`⚠ CLOUD       : falta clave ${d.cloudMissingKey} (adaptador listo, sin llave)`);
    if (explain) { console.log(`Ranking UCB   :`); r.ranked.forEach(x => console.log(`   - ${x.model}  score=${x.score}  GPU=${x.fitsGPU}  plays=${x.plays}`)); }

    if (dry) { console.log(`\n[DRY-RUN] no se ejecutó inferencia.`); return; }

    console.log(`\n── Respuesta ──\n`);
    const opts = r.cls.complexity > 0.6 ? { num_ctx: 2048, num_predict: 1600 } : { num_ctx: 1024, num_predict: 512 };
    const res = await execute(d.model, promptArg, opts);
    process.stdout.write(res.out || (res.timedOut ? '<< TIMEOUT >>' : ''));
    console.log(`\n\n── Telemetría ──`);
    console.log(JSON.stringify({ model: d.model, kind: res.kind, wallMs: res.wallMs || null, done: res.fin ? true : false, total_duration_ns: res.fin ? res.fin.total_duration : null, eval_count: res.fin ? res.fin.eval_count : null }, null, 2));

    // Registro en memoria (éxito inferido = emitió tokens)
    const success = !!res.out && res.out.trim().length > 0;
    record(r.cls.intent, d.model, success, res.wallMs || 0);
    fs.writeFileSync(LAST, JSON.stringify({ prompt: promptArg, intent: r.cls.intent, model: d.model, success }, null, 2));
}

main().catch((e) => { console.error('OMNI-ROUTER ERROR:', e); process.exit(1); });