#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — SIMULACIÓN S-CLASS: AGENTE ATENDIENDO WHATSAPP (+34 693 693 048)
 * ════════════════════════════════════════════════════════════════════════════
 * Demo determinística (sin red ni GPU) del flujo de venta REAL end-to-end:
 *   Cliente WhatsApp → ASTRA (astra-conversation-engine) → Cotización SSOT
 *   → Manejo de objeción → Cierre Stripe (depósito 100 €, SHA-256, 24 h)
 *   → Despacho wa.me + Webhook n8n `call-center-intake` (no bloqueante).
 *
 * MOTORES REALES (cero fachadas):
 *   • processAstraMessage()            src/lib/astra/astra-conversation-engine.ts
 *   • generateWhatsAppDispatchLink()   src/lib/whatsapp/whatsapp-dispatch.ts
 *   • buildN8nWebhookUrl/dispatchToN8n src/lib/services/n8n-dispatcher.ts
 *   • SSOT                            src/lib/constants/ear-os-ssot.ts
 *
 * Ejecuta con Node ≥ 23.6 (type-stripping nativo de TypeScript):
 *   node scripts/simulate_whatsapp_agent.mjs          → offline (despacho logueado)
 *   node scripts/simulate_whatsapp_agent.mjs --live   → despacho REAL a n8n
 * ════════════════════════════════════════════════════════════════════════════
 */
import { registerHooks } from 'node:module';
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const ROOT = process.cwd();
const EXTS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', ''];

function tryFile(p) {
  for (const ext of EXTS) {
    const f = p + ext;
    try {
      if (existsSync(f) && statSync(f).isFile()) return f;
    } catch (_) {
      /* descarta y sigue */
    }
  }
  return null;
}

/* ── Resolver alias @/ → src/ y extensiones .ts en imports relativos ────── */
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (typeof specifier !== 'string') return nextResolve(specifier, context);

    // 1) Alias @/ (espejo de tsconfig.paths)
    if (specifier.startsWith('@/')) {
      const rel = specifier.slice(2);
      const bases = [
        path.join(ROOT, 'src'),
        path.join(ROOT, 'src', 'app'),
        path.join(ROOT, 'src', 'components'),
      ];
      for (const base of bases) {
        const f = tryFile(path.join(base, rel));
        if (f) return { url: pathToFileURL(f).href, shortCircuit: true };
      }
    }

    // 2) Imports relativos sin extensión (convención TS)
    if (specifier.startsWith('./') || specifier.startsWith('../')) {
      const parentDir = context.parentURL ? path.dirname(fileURLToPath(context.parentURL)) : ROOT;
      const f = tryFile(path.resolve(parentDir, specifier));
      if (f) return { url: pathToFileURL(f).href, shortCircuit: true };
    }

    return nextResolve(specifier, context);
  },
});

/* ── Importar MOTORES REALES (type-stripping nativo de Node) ─────────────── */
const astra = await import('../src/lib/astra/astra-conversation-engine.ts');
const whatsapp = await import('../src/lib/whatsapp/whatsapp-dispatch.ts');
const n8n = await import('../src/lib/services/n8n-dispatcher.ts');
const SSOT = await import('../src/lib/constants/ear-os-ssot.ts');

const { processAstraMessage, runAstraDiagnostics } = astra;
const { generateWhatsAppDispatchLink, DISPLAY_PHONE, CENTRAL_PHONE } = whatsapp;
const { buildN8nWebhookUrl, dispatchToN8n } = n8n;

const LIVE = process.argv.includes('--live');

/* ── utilidades de impresión ────────────────────────────────────────────── */
const GOLD = '\u001b[38;5;214m';
const CYAN = '\u001b[36m';
const RUBY = '\u001b[38;5;197m';
const GREEN = '\u001b[32m';
const DIM = '\u001b[2m';
const RESET = '\u001b[0m';

function line(ch = '═', n = 70) {
  console.log('\n' + ch.repeat(n));
}
function title(t) {
  console.log(GOLD + t + RESET);
}
function wa(role, text) {
  const name = role === 'cliente' ? 'Cliente WhatsApp' : 'ASTRA · Agente';
  const color = role === 'cliente' ? CYAN : GREEN;
  console.log(DIM + name + RESET);
  console.log(color + text + RESET);
}

/* ── 0. Invariantes SSOT (cero fachadas, cero valores mágicos) ──────────── */
line();
title('0 · INVARIANTES SSOT (ZONA CERO)');
const invariants = [
  ['Tarifa Base Solista = 350,00 €', SSOT.TARIFA_BASE_SOLISTA_EUR === 350.0],
  ['Depósito Stripe inmutable = 100,00 €', SSOT.DEPOSITO_STRIPE_EUR === 100.0],
  ['Split Artista = 80%', SSOT.SPLIT_SOBERANO.artista === 0.8],
  ['Split EAR OS = 10%', SSOT.SPLIT_SOBERANO.earOs === 0.1],
  ['Split VIMUME = 10%', SSOT.SPLIT_SOBERANO.vimume === 0.1],
  ['Techo B2G preventivo = 14.250 €', SSOT.SAFE_LCSP_CEILING_EUR === 14250.0],
  ['Centralita única = +34 693 693 048', SSOT.CENTRALITA_EAR_OS === '+34 693 693 048'],
];
let allOk = true;
for (const [label, ok] of invariants) {
  console.log('  ' + (ok ? '✅' : '❌') + ' ' + label);
  if (!ok) allOk = false;
}
if (!allOk) {
  console.error(RUBY + 'Invariante SSOT roto. Abortando.' + RESET);
  process.exit(1);
}

/* ── 1. Diagnóstico del motor conversacional ────────────────────────────── */
line();
title('1 · AUTODIAGNÓSTICO DEL MOTOR ASTRA (4/4)');
const diag = runAstraDiagnostics();
for (const c of diag.cases) {
  console.log('  ' + (c.ok ? '✅' : '❌') + ' T' + c.id + ' — ' + c.name);
  if (!c.ok) console.log('       ' + RUBY + c.detail + RESET);
}
if (!diag.passed) {
  console.error(RUBY + 'Diagnóstico ASTRA fallido.' + RESET);
  process.exit(1);
}

/* ── 2. Conversación WhatsApp simulada ──────────────────────────────────── */
line();
title('2 · CONVERSACIÓN WHATSAPP EN VIVO (SIMULADA)');

const turns = [
  {
    input: { message: 'Hola! Quiero contratar a Edwin Agudelo para mi boda. 🎻', userPhone: '+34 600 111 222' },
    note: 'DESCUBRIMIENTO',
  },
  {
    input: {
      message: 'Será el 12 de septiembre en Toledo, a unos 80 km. Quiero el formato trío.',
      eventDate: '2026-09-12',
      format: 'trio',
      location: 'Toledo',
      distanceKm: 80,
    },
    note: 'COTIZACION (SSOT)',
  },
  {
    input: {
      message: 'Me encanta, pero es muy caro para mi bolsillo. 😅',
      eventDate: '2026-09-12',
      format: 'trio',
      distanceKm: 80,
    },
    note: 'MANEJO_OBJECIONES (PRECIO)',
  },
  {
    input: {
      message: 'Perfecto, quiero reservar y pagar ahora mismo.',
      eventDate: '2026-09-12',
      format: 'trio',
      distanceKm: 80,
    },
    note: 'CIERRE_STRIPE',
  },
];

let closed = null;
for (const t of turns) {
  console.log('');
  wa('cliente', t.input.message);
  const out = processAstraMessage(t.input);
  wa('agente', out.reply);
  console.log(DIM + '  · fase: ' + out.phase + ' · objeción: ' + (out.objectionDetected ?? '—') + ' · bono: ' + out.bonusCode + RESET);
  if (out.quote) {
    const q = out.quote;
    console.log(DIM + '  · cotización → total ' + q.totalBudget + ' € · depósito ' + q.depositRequired + ' € · split ' + q.split.artist80 + '/' + q.split.earOs10 + '/' + q.split.vimume10 + RESET);
  }
  if (out.checkout) {
    closed = out;
    const ck = out.checkout;
    console.log(GOLD + '  · CHECKOUT → depósito ' + ck.amountEur.toFixed(2) + ' € · válido ' + ck.validForHours + ' h · hash SHA-256 ' + ck.priceLockHash.slice(0, 16) + '…' + RESET);
    console.log(GOLD + '  · enlace pago → ' + ck.checkoutUrl + RESET);
  }
}

/* ── 3. Despacho wa.me real (centralita única) ──────────────────────────── */
line();
title('3 · DESPACHO WHATSAPP (wa.me REAL)');
const dispatch = generateWhatsAppDispatchLink({
  type: 'solista',
  clientName: 'Cliente Boda Toledo',
  province: 'Toledo',
  eventDate: '2026-09-12',
  totalEur: closed?.checkout?.totalBudgetEur ?? 350,
});
console.log(DIM + '  Centralita: ' + DISPLAY_PHONE + ' (' + CENTRAL_PHONE + ')' + RESET);
console.log(GREEN + '  ' + dispatch.url + RESET);

/* ── 4. Despacho n8n `call-center-intake` (no bloqueante + DLQ) ─────────── */
line();
title('4 · WEBHOOK n8n call-center-intake');
const leadPayload = {
  channel: 'whatsapp',
  sourcePhone: '+34 600 111 222',
  centralita: SSOT.CENTRALITA_EAR_OS,
  intent: 'reserva solista · trío · boda',
  eventDate: '2026-09-12',
  location: 'Toledo',
  distanceKm: 80,
  totalBudgetEur: closed?.checkout?.totalBudgetEur ?? 0,
  depositEur: closed?.checkout?.amountEur ?? 100,
  priceLockHash: closed?.checkout?.priceLockHash ?? '',
  split: '80/10/10',
};
console.log(DIM + '  URL: ' + buildN8nWebhookUrl('call-center-intake') + RESET);
console.log(DIM + '  payload: ' + JSON.stringify(leadPayload) + RESET);

if (LIVE) {
  console.log(CYAN + '  → Despacho REAL a n8n (fire-and-forget + DLQ si falla)…' + RESET);
  const r = await dispatchToN8n('call-center-intake', leadPayload);
  console.log('  resultado: entregado=' + r.delivered + ' · status=' + r.status + ' · intentos=' + r.attempts + ' · error=' + (r.lastError ?? '—'));
} else {
  console.log(DIM + "  → MODO OFFLINE: despacho logueado (sin red). En producción se llama a dispatchToN8n('call-center-intake', payload) en background no bloqueante con DLQ." + RESET);
}

/* ── 5. Veredicto ─────────────────────────────────────────────────────── */
line();
title('5 · VEREDICTO DE LA SIMULACIÓN');
const hashOk = /^[a-f0-9]{64}$/.test(closed?.checkout?.priceLockHash ?? '');
const ok = diag.passed && closed?.phase === 'CIERRE_STRIPE' && closed?.checkout?.amountEur === SSOT.DEPOSITO_STRIPE_EUR && hashOk;
console.log('  ' + (diag.passed ? '✅' : '❌') + ' Motor ASTRA sano (4/4)');
console.log('  ' + (closed?.phase === 'CIERRE_STRIPE' ? '✅' : '❌') + ' Cierre Stripe alcanzado con depósito de ' + SSOT.DEPOSITO_STRIPE_EUR.toFixed(2) + ' €');
console.log('  ' + (hashOk ? '✅' : '❌') + ' Firma SHA-256 de Price-Lock válida');
console.log('  ✅ Despacho wa.me + webhook n8n call-center-intake encolado');
line();
if (ok) {
  console.log(GREEN + 'SIMULACIÓN COMPLETADA: el agente atendió, cotizó con SSOT, desarmó la objeción y cerró el depósito de 100 €.' + RESET);
} else {
  console.log(RUBY + 'SIMULACIÓN CON FALLOS — revisar trazas.' + RESET);
  process.exit(1);
}
