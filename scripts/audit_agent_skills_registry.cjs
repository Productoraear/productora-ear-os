#!/usr/bin/env node
/**
 * scripts/audit_agent_skills_registry.cjs
 * ════════════════════════════════════════════════════════════════════════════
 * VERIFICADOR DEL REGISTRO DE SKILLS DE AGENTE (`.agents/skills/`)
 * ════════════════════════════════════════════════════════════════════════════
 * Un skill sin frontmatter válido NO se indexa en el panel de Skills del agente:
 * es documentación muerta con formato de autoridad. Este arnés convierte ese
 * contrato en una compuerta ejecutable.
 *
 * CONTRATO VERIFICADO POR SKILL
 *   1. Existe `.agents/skills/<slug>/SKILL.md`.
 *   2. Bloque frontmatter delimitado por `---` … `---` en las primeras líneas.
 *   3. `name:` presente, igual al nombre del directorio, `^[a-z0-9-]+$`.
 *   4. `description:` presente, NO vacía, en UNA sola línea, entre 40 y 500
 *      caracteres (lo que el panel indexa como disparador del skill).
 *   5. `name` único en todo el registro (sin colisiones de slug).
 *
 * SKILLS REQUERIDAS (directiva del Director Generalista)
 *   seo-optimizer · security-auditor · wcag-accessibility · git-atomic-commit
 *
 * USO
 *   node scripts/audit_agent_skills_registry.cjs           # tabla · exit 0/1
 *   node scripts/audit_agent_skills_registry.cjs --json    # sólo JSON
 *
 * SALIDA CONTRACTUAL
 *   AGENT_SKILLS_TOTAL=<n> AGENT_SKILLS_OK=<n> REQUIRED_OK=<n>/<m>
 *   AGENT_SKILLS_VIOLATIONS=<n> AGENT_SKILLS_VERDICT=PASS|FAIL
 * Zero-dep · sin red · sólo lectura.
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(ROOT, '.agents', 'skills');
const JSON_ONLY = process.argv.slice(2).includes('--json');

const REQUIRED = ['seo-optimizer', 'security-auditor', 'wcag-accessibility', 'git-atomic-commit'];
const DESCRIPTION_MIN = 40;
const DESCRIPTION_MAX = 500;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

if (!fs.existsSync(SKILLS_DIR)) {
  console.error(`FATAL: no existe ${path.relative(ROOT, SKILLS_DIR)}`);
  process.exit(2);
}

/** Extrae `clave: valor` del frontmatter YAML plano de un SKILL.md. */
function parseFrontmatter(text) {
  const lines = text.split(/\r?\n/);
  if ((lines[0] || '').trim() !== '---') return { ok: false, reason: 'falta el delimitador inicial ---' };
  let end = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === '---') {
      end = i;
      break;
    }
  }
  if (end === -1) return { ok: false, reason: 'falta el delimitador final ---' };

  const fields = {};
  const duplicated = [];
  for (const raw of lines.slice(1, end)) {
    if (raw.trim() === '' || raw.trimStart().startsWith('#')) continue;
    const match = /^([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(raw);
    if (match === null) return { ok: false, reason: `línea de frontmatter no reconocida: "${raw.trim()}"` };
    if (Object.prototype.hasOwnProperty.call(fields, match[1])) duplicated.push(match[1]);
    fields[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
  }
  return { ok: true, fields, duplicated };
}

const violations = [];
const skills = [];
const seenNames = new Map();

const entries = fs
  .readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

for (const slug of entries) {
  const file = path.join(SKILLS_DIR, slug, 'SKILL.md');
  const record = { skill: slug, file: `.agents/skills/${slug}/SKILL.md`, name: null, descriptionChars: 0, ok: false };

  if (!fs.existsSync(file)) {
    violations.push({ skill: slug, code: 'SKILL_MD_ABSENT', detail: record.file + ' no existe' });
    skills.push(record);
    continue;
  }

  const parsed = parseFrontmatter(fs.readFileSync(file, 'utf8'));
  if (!parsed.ok) {
    violations.push({ skill: slug, code: 'FRONTMATTER_INVALID', detail: parsed.reason });
    skills.push(record);
    continue;
  }

  const name = parsed.fields.name;
  const description = parsed.fields.description;

  if (name === undefined || name === '') {
    violations.push({ skill: slug, code: 'NAME_ABSENT', detail: 'frontmatter sin `name:`' });
  } else {
    record.name = name;
    if (name !== slug) {
      violations.push({ skill: slug, code: 'NAME_DIR_MISMATCH', detail: `name="${name}" ≠ directorio "${slug}"` });
    }
    if (!SLUG_PATTERN.test(name)) {
      violations.push({ skill: slug, code: 'NAME_NOT_SLUG', detail: `"${name}" no cumple ^[a-z0-9]+(-[a-z0-9]+)*$` });
    }
    if (seenNames.has(name)) {
      violations.push({ skill: slug, code: 'NAME_DUPLICATED', detail: `"${name}" ya lo declara ${seenNames.get(name)}` });
    } else {
      seenNames.set(name, slug);
    }
  }

  if (description === undefined || description === '') {
    violations.push({ skill: slug, code: 'DESCRIPTION_ABSENT', detail: 'frontmatter sin `description:` indexable' });
  } else {
    record.descriptionChars = description.length;
    if (description.length < DESCRIPTION_MIN) {
      violations.push({ skill: slug, code: 'DESCRIPTION_TOO_SHORT', detail: `${description.length} < ${DESCRIPTION_MIN} caracteres` });
    } else if (description.length > DESCRIPTION_MAX) {
      violations.push({ skill: slug, code: 'DESCRIPTION_TOO_LONG', detail: `${description.length} > ${DESCRIPTION_MAX} caracteres` });
    }
  }

  if (parsed.duplicated.length > 0) {
    violations.push({ skill: slug, code: 'FRONTMATTER_DUPLICATED_KEY', detail: parsed.duplicated.join(', ') });
  }

  record.ok = !violations.some((item) => item.skill === slug);
  skills.push(record);
}

const missingRequired = REQUIRED.filter((slug) => !entries.includes(slug));
for (const slug of missingRequired) {
  violations.push({ skill: slug, code: 'REQUIRED_SKILL_ABSENT', detail: `.agents/skills/${slug}/SKILL.md no registrado` });
}

const requiredOk = REQUIRED.length - missingRequired.length;
const verdict = violations.length === 0 ? 'PASS' : 'FAIL';

const report = {
  auditedAt: new Date().toISOString(),
  directory: '.agents/skills',
  contract: {
    frontmatter: `name (== slug, ^[a-z0-9-]+$) + description (1 línea, ${DESCRIPTION_MIN}-${DESCRIPTION_MAX} chars)`,
    required: REQUIRED,
  },
  totals: {
    total: skills.length,
    ok: skills.filter((skill) => skill.ok).length,
    requiredOk,
    requiredTotal: REQUIRED.length,
    violations: violations.length,
  },
  verdict,
  skills,
  violations,
};

if (JSON_ONLY) {
  console.log(JSON.stringify(report, null, 2));
} else {
  const line = '─'.repeat(74);
  console.log(line);
  console.log('REGISTRO DE SKILLS DE AGENTE · .agents/skills/');
  console.log(line);
  console.log(`${'SKILL'.padEnd(26)}${'NAME'.padEnd(26)}DESC`);
  for (const skill of skills) {
    const label = skill.name === null ? '—' : skill.name;
    console.log(`${skill.skill.padEnd(26)}${label.padEnd(26)}${skill.descriptionChars} chars${skill.ok ? '' : '  [VIOLACION]'}`);
  }
  console.log(line);
  console.log(`Skills registradas : ${report.totals.total} (válidas ${report.totals.ok})`);
  console.log(`Requeridas         : ${requiredOk}/${REQUIRED.length} → ${REQUIRED.join(', ')}`);
  console.log(`Violaciones        : ${violations.length}`);
  for (const item of violations) {
    console.log(`  [${item.code}] ${item.skill} :: ${item.detail}`);
  }
}

console.log(
  `AGENT_SKILLS_TOTAL=${report.totals.total} AGENT_SKILLS_OK=${report.totals.ok} ` +
    `REQUIRED_OK=${requiredOk}/${REQUIRED.length} AGENT_SKILLS_VIOLATIONS=${violations.length} ` +
    `AGENT_SKILLS_VERDICT=${verdict}`,
);

process.exit(verdict === 'PASS' ? 0 : 1);

