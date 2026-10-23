#!/usr/bin/env node
// Verificación de existencia — sin volcar secretos ni data lakes.
const fs = require('fs');
const path = require('path');

function exists(p) { return fs.existsSync(p); }
function sizeMB(p) { try { return (fs.statSync(p).size / 1048576).toFixed(2) + ' MB'; } catch { return '?'; } }

const out = [];
out.push('=== SSOT / FUENTES ===');
for (const p of [
    'src/data/all_providers_database.json',
    'src/data/vampirized_providers.json',
    'src/lib/constants/ear-os-ssot.ts',
    'src/lib/security/ssotIntegrityGuard.ts',
    'src/lib/availability/atomicDateLockEngine.ts',
    'src/lib/vimume/b2g-tender-engine.ts',
    'src/lib/astra/astra-conversation-engine.ts',
]) {
    out.push(`${exists(p) ? 'OK ' : 'XX '}${p}${exists(p) ? ' (' + sizeMB(p) + ')' : ''}`);
}

out.push('');
out.push('=== ENV (solo presencia de claves, sin valores) ===');
for (const f of ['.env', '.env.local', '.env.production']) {
    if (!exists(f)) { out.push(`XX ${f} (no existe)`); continue; }
    const raw = fs.readFileSync(f, 'utf8');
    const keys = [];
    for (const k of ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID', 'STRIPE_SECRET_KEY', 'CRON_SECRET', 'N8N_WEBHOOK', 'POSTGRES', 'DATABASE_URL', 'OLLAMA']) {
        const re = new RegExp('^' + k + '=', 'm');
        if (re.test(raw)) keys.push(k + '=SET');
    }
    const lines = raw.split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith('#')).length;
    out.push(`OK ${f}: ${lines} lineas | ${keys.join(', ') || 'sin claves conocidas'}`);
}

out.push('');
out.push('=== ARCHIVOS B2G MOCK (fuente de la fachada) ===');
for (const p of [
    'src/data/b2g/placsp_harvested_tenders.json',
    'src/data/b2g/b2g_active_tenders.json',
    'src/data/b2g/b2g_doble_impacto_municipal.json',
    'src/data/b2g_opportunities_database.json',
]) {
    if (exists(p)) {
        try {
            const j = JSON.parse(fs.readFileSync(p, 'utf8'));
            const n = Array.isArray(j) ? j.length : Object.keys(j).length;
            const sample = Array.isArray(j) && j[0] ? JSON.stringify(j[0]).slice(0, 160) : 'obj';
            out.push(`OK ${p} | ${n} regs | sample: ${sample}...`);
        } catch { out.push(`OK ${p} | parse err`); }
    } else out.push(`XX ${p}`);
}

console.log(out.join('\n'));