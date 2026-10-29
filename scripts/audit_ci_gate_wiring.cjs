#!/usr/bin/env node
/**
 * AUDITOR DE CABLEADO CI/CD — EAR OS · S-CLASS
 * ============================================================================
 * El agujero que este gate cierra, medido en disco el 2026-10-29: el auditor
 * forense de /admin/control devolvia Exit 0, pero NADIE lo ejecutaba (no existia
 * `.husky/` ni `core.hooksPath`, y el unico workflow iba directo a Docker). Un
 * gate que nadie ejecuta es una fachada de papel (.clinerules §9 · AGENTS.md §15).
 *
 * Este script audita el propio workflow para que el cableado no pueda degradarse
 * en silencio: si alguien borra un `needs`, condiciona un gate con `if:`, lo
 * convierte en best-effort con `continue-on-error` o deja de typechequear, el
 * pre-push y el job `contract-gate` abortan con Exit Code 1.
 *
 * Cero dependencias (solo node:fs / node:path). Solo lectura.
 *
 *   node scripts/audit_ci_gate_wiring.cjs
 *   node scripts/audit_ci_gate_wiring.cjs --workflow=.antigravity/ev/broken.yml
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_WORKFLOW = '.github/workflows/deploy-ghcr.yml';
const argWorkflow = process.argv.slice(2).find((a) => a.startsWith('--workflow='));
const WORKFLOW = argWorkflow
    ? path.resolve(ROOT, argWorkflow.slice('--workflow='.length))
    : path.join(ROOT, DEFAULT_WORKFLOW);

/** Ids de job declarados bajo `jobs:` (claves a 2 espacios). */
function jobIds(text) {
    const lines = text.split(/\r?\n/);
    const start = lines.findIndex((l) => /^jobs:\s*$/.test(l));
    if (start === -1) return [];
    const ids = [];
    for (let i = start + 1; i < lines.length; i += 1) {
        const m = /^ {2}([A-Za-z0-9_.-]+):\s*$/.exec(lines[i]);
        if (m) ids.push(m[1]);
        else if (/^\S/.test(lines[i])) break;
    }
    return ids;
}

/** Bloque completo de un job: desde `  <id>:` hasta el siguiente job o EOF. */
function jobBlock(text, jobId) {
    const lines = text.split(/\r?\n/);
    const start = lines.findIndex((l) => new RegExp(`^ {2}${jobId}:\\s*$`).test(l));
    if (start === -1) return null;
    let end = lines.length;
    for (let i = start + 1; i < lines.length; i += 1) {
        if (/^ {2}[A-Za-z0-9_.-]+:\s*$/.test(lines[i])) { end = i; break; }
    }
    return lines.slice(start, end).join('\n');
}

/** Dependencias declaradas en `needs:` (soporta lista en linea y escalar). */
function needsOf(block) {
    const m = /^ {4}needs:\s*(.+)$/m.exec(block);
    if (!m) return [];
    const raw = m[1].trim();
    if (raw.startsWith('[')) {
        return raw.replace(/[[\]]/g, '').split(',').map((s) => s.trim().replace(/['"]/g, '')).filter(Boolean);
    }
    return [raw.replace(/['"]/g, '')];
}

/**
 * Comandos REALMENTE ejecutados por un job: solo lineas `run:`, nunca `name:`
 * ni comentarios. Sin esto el auditor se autosatisface: renombrar un step a
 * "Typecheck (tsc --noEmit)" haria pasar el gate aunque el `run:` no ejecute
 * nada. Un gate que se cree a si mismo por una etiqueta es una fachada.
 */
function runCommands(block) {
    const lines = block.split(/\r?\n/);
    const cmds = [];
    for (let i = 0; i < lines.length; i += 1) {
        const m = /^\s*run:\s*(.*)$/.exec(lines[i]);
        if (!m) continue;
        const inline = m[1].trim();
        if (inline && !/^[|>]/.test(inline)) {
            cmds.push(inline);
            continue;
        }
        for (let j = i + 1; j < lines.length; j += 1) {
            if (/^\s*$/.test(lines[j])) continue;
            const indent = lines[j].match(/^\s*/)[0].length;
            if (indent <= 8) break;
            cmds.push(lines[j].trim());
        }
    }
    return cmds.join('\n');
}

const failures = [];
function check(ok, label, detail) {
    if (ok) {
        console.log(`[CI-GATE][OK]   ${label}`);
        return;
    }
    console.log(`[CI-GATE][FAIL] ${label}${detail ? ` — ${detail}` : ''}`);
    failures.push(label);
}

function main() {
    if (!fs.existsSync(WORKFLOW)) {
        console.error(`[CI-GATE][FALLO] No existe el workflow: ${path.relative(ROOT, WORKFLOW)}`);
        process.exit(1);
    }
    const text = fs.readFileSync(WORKFLOW, 'utf8');

    console.log(`[CI-GATE] Auditando ${path.relative(ROOT, WORKFLOW).split(path.sep).join('/')}`);
    console.log('');

    const ids = jobIds(text);
    const REQUIRED_JOBS = ['contract-gate', 'typecheck-gate', 'build-and-push', 'production-smoke'];
    for (const id of REQUIRED_JOBS) {
        check(ids.includes(id), `job '${id}' declarado`, `jobs encontrados: [${ids.join(', ')}]`);
    }

    const contract = jobBlock(text, 'contract-gate');
    const typecheck = jobBlock(text, 'typecheck-gate');
    const build = jobBlock(text, 'build-and-push');
    const smoke = jobBlock(text, 'production-smoke');

    // Solo comandos ejecutados: `name:` y comentarios no cuentan como evidencia.
    const contractRuns = contract ? runCommands(contract) : '';
    const typecheckRuns = typecheck ? runCommands(typecheck) : '';

    // 1. Gate forense (0 fachadas) ejecutado de verdad, en modo estricto.
    check(/audit_admin_control_forensics\.cjs\s+--strict/.test(contractRuns), 'contract-gate ejecuta el auditor forense con --strict');
    check(/audit_ci_gate_wiring\.cjs/.test(contractRuns), 'contract-gate se autovalida (ejecuta audit_ci_gate_wiring.cjs)');

    // 2. Gate de tipos real sobre maquina limpia.
    check(/\btsc\b[^\n]*--noEmit/.test(typecheckRuns), 'typecheck-gate ejecuta tsc --noEmit');
    check(/\bprisma\b[^\n]*\bgenerate\b/.test(typecheckRuns), 'typecheck-gate genera el cliente Prisma antes de typechequear');
    check(/\bnpm ci\b/.test(typecheckRuns), 'typecheck-gate instala con lock exacto (npm ci)');

    // 3. Ningun gate puede fugarse por la puerta de atras.
    //    `|| true`, `|| exit 0` y `set +e` convierten un gate en teatro: el step
    //    termina en verde aunque tsc vomite 300 errores. Es el modo mas silencioso
    //    de degradar un CI y no lo detecta ni el ojo ni `actions/checkout`.
    const SWALLOW = /\|\|\s*(?:true|:|exit\s+0)\b|set\s+\+e/i;
    for (const [name, block, runs] of [
        ['contract-gate', contract, contractRuns],
        ['typecheck-gate', typecheck, typecheckRuns],
    ]) {
        check(block !== null && !/continue-on-error:\s*true/.test(block), `${name} es bloqueante (sin continue-on-error)`);
        check(block !== null && !/^ {4}if:/m.test(block), `${name} no esta condicionado por if:`);
        check(!SWALLOW.test(runs), `${name} no silencia el exit code (|| true / || exit 0 / set +e)`);
    }

    // 4. La imagen NO se construye ni se publica si un gate falla.
    const buildNeeds = build ? needsOf(build) : [];
    for (const gate of ['contract-gate', 'typecheck-gate']) {
        check(buildNeeds.includes(gate), `build-and-push declara needs: ${gate}`, `needs actual = [${buildNeeds.join(', ')}]`);
    }

    // 5. El smoke de produccion es el juez unico y corre siempre.
    const smokeNeeds = smoke ? needsOf(smoke) : [];
    check(smoke !== null && /^ {4}if:\s*always\(\)/m.test(smoke), 'production-smoke corre con if: always()');
    check(smokeNeeds.includes('build-and-push'), 'production-smoke declara needs: build-and-push', `needs actual = [${smokeNeeds.join(', ')}]`);

    console.log('');
    if (failures.length > 0) {
        console.log(`[CI-GATE][FALLO] ${failures.length} asercion(es) rota(s): el CI puede publicar sin gate.`);
        process.exit(1);
    }
    console.log(`[CI-GATE][OK] Cableado verificado: ${ids.length} jobs, 2 gates bloqueantes, 0 fugas (Exit 0).`);
}

main();
