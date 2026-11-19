/**
 * ════════════════════════════════════════════════════════════════════════════
 * TIER 1 — FEATURE COVERAGE (30 TESTS: 6 × R1, 6 × R2, 6 × R3, 6 × R4, 6 × R5)
 * ════════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import {
  FORBIDDEN_OTZARRETA_TOKENS_RE,
  GWS_LEAST_PRIVILEGE_SCOPES,
  GWS_SHORT_SCOPE_TOKENS,
  KNOWN_GOOD_SSOT_HASH,
  REQUIRED_OTZARRETA_AREAS,
  assert,
  assertAdapterEnvelope,
  assertAdapterReadiness,
  assertEqual,
  assertIncludes,
  assertMatch,
  fileExists,
  findExportedFn,
  invokeRoute,
  normText,
  readJson,
  readText,
  repoPath,
  runCase,
  runCmd,
  runTsInline,
  stripCodeComments,
  stripOtzarretaPurgeClauses,
  tryImportTs,
  walkFiles,
  withMockFetch,
} from './helpers.mjs';

const MASTER_PLAN_PATH = 'docs/specs/PLAN_MAESTRO_16_CAPACIDADES_DOMINO_EAR_OS.md';

const CAPABILITY_TOKENS = [
  ['1. Claude Video', ['claude video']],
  ['2. NotebookLM', ['notebooklm']],
  ['3. Graphify', ['graphify']],
  ['4. Impeccable', ['impeccable']],
  ['5. Ponytail', ['ponytail']],
  ['6. Last30days', ['last30days', 'last 30 days']],
  ['7. Skill Theory', ['skill theory']],
  ['8. Grill Me', ['grill me', 'grill-me']],
  ['9. Superpowers', ['superpowers']],
  ['10. Playwright Browser', ['playwright']],
  ['11. Obsidian', ['obsidian']],
  ['12. GBrain', ['gbrain']],
  ['13. Google Stitch', ['google stitch', 'stitch']],
  ['14. Scroll World / fal.ai / Kling O1', ['scroll world', 'fal.ai', 'kling']],
  ['15. HyperFrames', ['hyperframes', 'hyper frames']],
  ['16. GWS', ['gws', 'google workspace']],
  ['Zapier MCP', ['zapier mcp', 'zapier']],
];

const LOCAL_PRIORITIZED = ['ponytail', 'graphify', 'impeccable', 'grill me', 'superpowers', 'gws'];

function findBrainstormCheckpoint() {
  const exact = '.antigravity/brainstorms/2026-11-18_16-CAPACIDADES_DOMINO_DECISIONS.md';
  if (fileExists(exact)) return exact;
  const dir = repoPath('.antigravity/brainstorms');
  if (!fs.existsSync(dir)) return null;
  const match = fs
    .readdirSync(dir)
    .find((f) => /16[-_]?capacidades.*domino.*\.md$/i.test(f));
  return match ? `.antigravity/brainstorms/${match}` : null;
}

function parseMarkdownTableRows(markdown) {
  const rows = [];
  for (const line of String(markdown ?? '').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) continue;
    const cells = trimmed
      .slice(1, -1)
      .split('|')
      .map((c) => c.trim());
    if (cells.every((c) => /^:?-{2,}:?$/.test(c))) continue;
    rows.push({ raw: trimmed, cells });
  }
  return rows;
}

export async function runTier1() {
  const results = [];

  // ── R1: Mechanical Viability of 16 Capabilities, Local Tools, Graphify & Grill Me ──

  results.push(
    await runCase(
      'T1-R1-01',
      'T1',
      'R1',
      'Master Plan 16 Capabilities + Zapier MCP Rubric Completeness',
      async () => {
        const doc = readText(MASTER_PLAN_PATH);
        assert(doc.exists, `Missing Master Plan: ${MASTER_PLAN_PATH}`);
        const lines = doc.content.split(/\r?\n/);
        assert(lines.length >= 150, `Master Plan must have >= 150 lines, found ${lines.length}`);
        const tableRows = parseMarkdownTableRows(doc.content);
        const rubricRows = tableRows.filter(
          (r) => r.cells.length >= 5 && /^(?:\d+|—|-|zapier)$/i.test(r.cells[0]),
        );
        assert(
          rubricRows.length >= 17,
          `Expected >= 17 dedicated rubric rows (16 capabilities + Zapier MCP), found ${rubricRows.length}`,
        );
        const verdictRe =
          /(priorizada local|local parcial|diferida|externa|conector externo|puente cloud|viable|parcial|no viable|condicional)/i;
        const usedRowIndices = new Set();
        for (const [label, tokens] of CAPABILITY_TOKENS) {
          const rowIdx = rubricRows.findIndex((r, idx) => {
            if (usedRowIndices.has(idx)) return false;
            const capCell = normText(r.cells[1] || '');
            return tokens.some((t) => capCell.includes(t));
          });
          assert(rowIdx !== -1, `Master Plan rubric missing dedicated table row for: ${label}`);
          usedRowIndices.add(rowIdx);
          const row = rubricRows[rowIdx];
          const tierCell = normText(row.cells[2] || '');
          const evidenceCell = (row.cells[3] || '').trim();
          assert(
            verdictRe.test(tierCell),
            `Rubric row for ${label} missing explicit viability verdict in Tier column (got: ${row.cells[2]})`,
          );
          assert(
            evidenceCell.length >= 15,
            `Rubric row for ${label} missing mechanical evidence column content`,
          );
        }
      },
    ),
  );

  results.push(
    await runCase(
      'T1-R1-02',
      'T1',
      'R1',
      'Prioritized Local Tools vs Deferred/External Separation',
      async () => {
        const doc = readText(MASTER_PLAN_PATH);
        assert(doc.exists, `Missing Master Plan: ${MASTER_PLAN_PATH}`);
        const tableRows = parseMarkdownTableRows(doc.content);
        const tierRows = tableRows.filter((r) => r.cells.length === 3);
        const prioritizedSummary = tierRows.find((r) => /priorizad/i.test(normText(r.cells[0])));
        const deferredSummary = tierRows.find((r) => /diferid|extern/i.test(normText(r.cells[0])));
        assert(prioritizedSummary, 'Master Plan §1.1 missing Priorizadas Locales tier row');
        assert(deferredSummary, 'Master Plan §1.1 missing Diferidas / Externas tier row');

        const prioText = normText(prioritizedSummary.cells[2] || '');
        const defText = normText(deferredSummary.cells[2] || '');
        const rubricRows = tableRows.filter(
          (r) => r.cells.length >= 5 && /^(?:\d+|—|-|zapier)$/i.test(r.cells[0]),
        );

        for (const tool of LOCAL_PRIORITIZED) {
          const matchesTool = (txt) =>
            txt.includes(tool) || (tool === 'grill me' && txt.includes('grill-me'));
          assert(matchesTool(prioText), `Prioritized Local tier row omits ${tool}`);
          assert(!matchesTool(defText), `Deferred/External tier row must not contain local tool ${tool}`);
          const rubricRow = rubricRows.find((r) => matchesTool(normText(r.cells[1] || '')));
          assert(rubricRow, `Rubric table missing row for prioritized local tool ${tool}`);
          assert(
            /priorizada local/i.test(normText(rubricRow.cells[2] || '')),
            `Rubric row for ${tool} must be classified Priorizada Local (got: ${rubricRow.cells[2]})`,
          );
        }

        const deferredOrExternal = [
          'claude video',
          'notebooklm',
          'last30days',
          'skill theory',
          'gbrain',
          'google stitch',
          'kling',
          'hyperframes',
          'zapier',
        ];
        for (const ext of deferredOrExternal) {
          assert(defText.includes(ext), `Deferred/External tier row omits ${ext}`);
          assert(!prioText.includes(ext), `Prioritized Local tier row must not include external tool ${ext}`);
          const rubricRow = rubricRows.find((r) => normText(r.cells[1] || '').includes(ext));
          assert(rubricRow, `Rubric table missing row for deferred/external tool ${ext}`);
          assert(
            /(diferida|extern|conector externo)/i.test(normText(rubricRow.cells[2] || '')),
            `Rubric row for ${ext} must be classified Diferida/Externa (got: ${rubricRow.cells[2]})`,
          );
        }
      },
    ),
  );

  results.push(
    await runCase(
      'T1-R1-03',
      'T1',
      'R1',
      'Local Prioritized Skills On-Disk Verification',
      async () => {
        const requiredSkills = [
          '.agents/skills/ponytail/SKILL.md',
          '.agents/skills/grill-me/SKILL.md',
          '.agents/skills/unslop/SKILL.md',
          '.agents/skills/superpowers/SKILL.md',
        ];
        for (const rel of requiredSkills) {
          const file = readText(rel);
          assert(file.exists, `Missing local prioritized skill file: ${rel}`);
          assert(file.bytes > 100, `Skill file ${rel} must be > 100 bytes (got ${file.bytes})`);
        }
        const graphifyGlobal = 'C:\\Users\\Productora Ear\\.gemini\\config\\skills\\graphify\\SKILL.md';
        const graphifyRule = readText('.agents/rules/graphify.md');
        const hasGraphifySkill =
          (fs.existsSync(graphifyGlobal) && fs.statSync(graphifyGlobal).size > 100) ||
          (graphifyRule.exists && graphifyRule.bytes > 100);
        assert(hasGraphifySkill, 'Missing Graphify skill/rule file on disk');
      },
    ),
  );

  results.push(
    await runCase(
      'T1-R1-04',
      'T1',
      'R1',
      'Graphify Knowledge Graph Build & graphify query Exit 0',
      async () => {
        const graph = readJson('graphify-out/graph.json');
        assert(graph.exists, 'Missing graphify-out/graph.json');
        assert(graph.data && typeof graph.data === 'object', graph.error || 'Malformed graph.json');
        assert(
          Array.isArray(graph.data.nodes) && graph.data.nodes.length > 0,
          'graphify-out/graph.json must have non-empty nodes[]',
        );
        const hasLinks =
          (Array.isArray(graph.data.links) && graph.data.links.length > 0) ||
          (Array.isArray(graph.data.edges) && graph.data.edges.length > 0);
        assert(hasLinks, 'graphify-out/graph.json must have non-empty links[] or edges[]');

        const q = runCmd('graphify', ['query', 'otzarreta'], {
          timeoutMs: 30_000,
          cacheKey: 'graphify_query_otzarreta',
        });
        assertEqual(q.status, 0, `graphify query "otzarreta" exit code (stderr: ${q.stderr})`);
        assert(q.stdout.trim().length > 0, 'graphify query "otzarreta" produced empty stdout');
      },
    ),
  );

  results.push(
    await runCase(
      'T1-R1-05',
      'T1',
      'R1',
      'Grill Me Decisions Checkpoint On Disk',
      async () => {
        const pathFound = findBrainstormCheckpoint();
        assert(pathFound, 'Missing Grill Me checkpoint under .antigravity/brainstorms/');
        const doc = readText(pathFound);
        assert(doc.exists, `Cannot read ${pathFound}`);
        const lines = doc.content.split(/\r?\n/);
        assert(lines.length >= 30, `Checkpoint ${pathFound} must have >= 30 lines (got ${lines.length})`);
        const norm = normText(doc.content);
        assert(norm.includes('gws'), 'Checkpoint must record GWS/adapters decision');
        assert(
          norm.includes('derio') &&
            norm.includes('bizkaia') &&
            /(zarautz|fuera de bizkaia|anclaje unico)/.test(norm),
          'Checkpoint must record canonical Derio (Bizkaia) territorial decision',
        );
        assert(
          /(local|unconfigured|adaptador|adapter)/.test(norm),
          'Checkpoint must record local vs external tooling/adapter decisions',
        );
      },
    ),
  );

  results.push(
    await runCase(
      'T1-R1-06',
      'T1',
      'R1',
      'Mechanical Evidence Backing (No Unverified Claims)',
      async () => {
        const doc = readText(MASTER_PLAN_PATH);
        assert(doc.exists, `Missing Master Plan: ${MASTER_PLAN_PATH}`);
        const evidenceTokens = [
          '.agents/skills/',
          'package.json',
          'graphify-out',
          '.env.example',
          'src/lib/',
          'scripts/',
          'ear-os-ssot.ts',
          'otzarreta',
          'node ',
          'npm ',
          'python',
          'playwright',
          'tsx',
          'next.config.ts',
        ];
        const lower = doc.content.toLowerCase();
        const matched = evidenceTokens.filter((t) => lower.includes(t));
        assert(
          matched.length >= 12,
          `Expected >= 12 verifiable workspace paths/CLI probes in Master Plan, found ${matched.length}: ${matched.join(', ')}`,
        );
        assert(
          !/\b(?:TODO|TBD)\b/.test(doc.content) &&
            !/pendiente de comprobar|por verificar/i.test(doc.content),
          'Master Plan must not contain TODO/TBD/"pendiente de comprobar"/"por verificar" placeholders',
        );
      },
    ),
  );

  // ── R2: Chained Domino Execution, AGENTS.md Fit, gws Least-Privilege, 17-Gate Loop ──

  results.push(
    await runCase(
      'T1-R2-01',
      'T1',
      'R2',
      'Chained Domino /goal Autonomous Sequence Definition',
      async () => {
        const doc = readText(MASTER_PLAN_PATH);
        assert(doc.exists, `Missing Master Plan: ${MASTER_PLAN_PATH}`);
        const norm = normText(doc.content);
        const stageMatches = doc.content.match(/(?:fase|domino|step|etapa|secuencia)\s*[#0-9]+/gi) || [];
        assert(
          stageMatches.length >= 4,
          `Expected >= 4 chained domino stages in Master Plan, found ${stageMatches.length}`,
        );
        for (const stageWord of ['brainstorm', 'graph', 'spec', 'build', 'verify', 'ship']) {
          assert(norm.includes(stageWord), `Domino pipeline missing stage: ${stageWord}`);
        }
        assert(norm.includes('/goal') && norm.includes('domino'), 'Master Plan must specify /goal domino chaining');
        assert(norm.includes('coolify'), 'Master Plan must include Coolify Bare-Metal rollout phases');
        assert(
          /(trigger|dispara|precondicion|salida|output)/.test(norm),
          'Domino stages must define pre-conditions, outputs, and next-stage triggers',
        );
      },
    ),
  );

  results.push(
    await runCase(
      'T1-R2-02',
      'T1',
      'R2',
      'AGENTS.md Constitutional Fit Across All 16 Capabilities + Zapier',
      async () => {
        const doc = readText(MASTER_PLAN_PATH);
        assert(doc.exists, `Missing Master Plan: ${MASTER_PLAN_PATH}`);
        const norm = normText(doc.content);
        assert(norm.includes('agents.md'), 'Master Plan must reference AGENTS.md');
        assert(norm.includes('hitl'), 'Master Plan must classify HITL boundaries');
        for (const tierPct of ['0%', '5%', '25%', '60%', '90%']) {
          assertIncludes(
            doc.content,
            tierPct,
            `Master Plan must explicitly define AGENTS.md §2 HITL tier ${tierPct}`,
          );
        }
        assert(
          norm.includes('zona cero') || norm.includes('ear-os-ssot.ts'),
          'Master Plan must reference Zona Cero protection',
        );
        assert(
          /(coolify|1 vcpu|4 gb)/.test(norm),
          'Master Plan must consider Coolify 1 vCPU / 4 GB constraints',
        );
      },
    ),
  );

  results.push(
    await runCase(
      'T1-R2-03',
      'T1',
      'R2',
      'gws Least-Privilege Scopes Contract (Gmail, Drive, Docs, Sheets, Calendar)',
      async () => {
        const doc = readText(MASTER_PLAN_PATH);
        assert(doc.exists, `Missing Master Plan: ${MASTER_PLAN_PATH}`);
        for (const token of GWS_SHORT_SCOPE_TOKENS) {
          assertIncludes(doc.content, token, 'Master Plan gws scope');
        }
        assert(
          !/mail\.google\.com|gmail\.modify|gmail\.send|googleapis\.com\/auth\/drive(?![.\w])|googleapis\.com\/auth\/calendar(?![.\w])|\badmin\.[a-z]+/i.test(
            doc.content,
          ),
          'Master Plan must NOT prescribe broad GWS OAuth scopes',
        );
        const imp = await tryImportTs('src/lib/integrations/gws-adapter.ts');
        assert(imp.ok, imp.error?.message || 'Cannot import src/lib/integrations/gws-adapter.ts');
        const serialized = JSON.stringify(imp.mod) + '\n' + readText('src/lib/integrations/gws-adapter.ts').content;
        for (const token of GWS_SHORT_SCOPE_TOKENS) {
          assertIncludes(serialized, token, 'gws-adapter.ts declared scope');
        }
        const checkReadiness = findExportedFn(
          imp.mod,
          ['checkReadiness', 'checkGwsReadiness'],
          /readiness/i,
          'checkGwsReadiness',
        );
        const ready = checkReadiness({
          GOOGLE_WORKSPACE_CLIENT_ID: 'cid',
          GOOGLE_WORKSPACE_CLIENT_SECRET: 'csec',
          GOOGLE_WORKSPACE_REFRESH_TOKEN: 'rtok',
          GWS_ALLOWED_SCOPES: GWS_LEAST_PRIVILEGE_SCOPES.join(','),
        });
        assertAdapterReadiness(ready, true);
      },
    ),
  );

  results.push(
    await runCase(
      'T1-R2-04',
      'T1',
      'R2',
      '17-Gate Verification Loop Execution (run_sv_protocol_15_gates.cjs)',
      async () => {
        const res = runCmd(process.execPath, ['scripts/run_sv_protocol_15_gates.cjs'], {
          timeoutMs: 420_000,
          cacheKey: 'sv_protocol_17_gates',
        });
        assert(!res.timedOut, 'run_sv_protocol_15_gates.cjs timed out (>420s)');
        assertEqual(res.status, 0, `run_sv_protocol_15_gates.cjs exit code (${res.stdout.slice(-400)})`);
        const log = readText('.antigravity/reports/gate_output.log');
        const combined = `${res.stdout}\n${log.content}`;
        assert(
          /17\/17\s*EXIT\s*CODE\s*0|TODAS LAS 17 PUERTAS:\s*EXIT CODE 0/i.test(combined),
          'Expected 17/17 EXIT CODE 0 confirmation in gate output/log',
        );
      },
    ),
  );

  results.push(
    await runCase(
      'T1-R2-05',
      'T1',
      'R2',
      'Agent Teams + Skills Orchestration Mapping',
      async () => {
        const doc = readText(MASTER_PLAN_PATH);
        assert(doc.exists, `Missing Master Plan: ${MASTER_PLAN_PATH}`);
        const norm = normText(doc.content);
        const requiredSkills = [
          'grill-me',
          'ponytail',
          'graphify',
          'spec-driven-development',
          'verification-and-testing',
          'superpowers',
        ];
        for (const s of requiredSkills) {
          assert(
            norm.includes(s) || (s === 'grill-me' && norm.includes('grill me')),
            `Master Plan missing skill mapping: ${s}`,
          );
        }
        assert(
          /(agent team|arquitecto|obrero|spec|auditor|qa|subagent)/.test(norm),
          'Master Plan must map Agent Team roles',
        );
        assert(norm.includes('coolify'), 'Master Plan must map Coolify deployment/CI integration');
      },
    ),
  );

  results.push(
    await runCase(
      'T1-R2-06',
      'T1',
      'R2',
      'Gate 11 (audit:tariff-copy) Unblock & Non-Weakening',
      async () => {
        const res = runCmd('npm', ['run', 'audit:tariff-copy'], {
          timeoutMs: 30_000,
          cacheKey: 'audit_tariff_copy',
        });
        assert(!res.timedOut, 'npm run audit:tariff-copy timed out (>30s)');
        assert(res.durationMs < 30_000, `audit:tariff-copy took ${res.durationMs}ms (>= 30s)`);
        assertEqual(res.status, 0, `audit:tariff-copy exit code: ${res.stderr}`);

        const jsonRun = runCmd(process.execPath, ['scripts/audit_tariff_copy_drift.cjs', '--json'], {
          timeoutMs: 30_000,
          cacheKey: 'audit_tariff_copy_json',
        });
        assert(!jsonRun.timedOut, 'audit_tariff_copy_drift.cjs --json timed out');
        assertEqual(jsonRun.status, 0, 'audit_tariff_copy_drift.cjs --json exit code');
        const parsed = JSON.parse(jsonRun.stdout);
        assertEqual(parsed.canonicalRateEurPerKm, 1.5, 'canonicalRateEurPerKm from SSOT');
        assert(parsed.mentionsTotal > 0, 'audit_tariff_copy_drift must actually scan repo mentions (>0)');
      },
    ),
  );

  // ── R3: Typed External Integration Adapters, UNCONFIGURED Safe Mode, HITL/HTTPS/Redaction & Readiness API ──

  results.push(
    await runCase(
      'T1-R3-01',
      'T1',
      'R3',
      'Zero-Env Clean Import & Public Contract Exports',
      async () => {
        const modules = [
          'src/lib/integrations/adapter-contract.ts',
          'src/lib/integrations/gws-adapter.ts',
          'src/lib/integrations/zapier-mcp-adapter.ts',
          'src/lib/integrations/kling-fal-adapter.ts',
          'src/lib/integrations/capabilities-registry.ts',
        ];
        for (const m of modules) {
          assert(fileExists(m), `Missing M2 module: ${m}`);
        }
        const script = `
          import * as contract from './src/lib/integrations/adapter-contract.ts';
          import * as gws from './src/lib/integrations/gws-adapter.ts';
          import * as zapier from './src/lib/integrations/zapier-mcp-adapter.ts';
          import * as kling from './src/lib/integrations/kling-fal-adapter.ts';
          import * as registry from './src/lib/integrations/capabilities-registry.ts';
          console.log(JSON.stringify({
            contract: Object.keys(contract),
            gws: Object.keys(gws).filter((k) => /readiness/i.test(k)),
            zapier: Object.keys(zapier).filter((k) => /readiness/i.test(k)),
            kling: Object.keys(kling).filter((k) => /readiness/i.test(k)),
            registryKeys: Object.keys(registry),
          }));
        `;
        const run = runTsInline(script);
        assertEqual(run.status, 0, `Clean zero-env import failed: ${run.stderr || run.stdout}`);
        const parsed = JSON.parse(run.stdout.trim().split(/\r?\n/).pop());
        assert(parsed.gws.length > 0, 'gws-adapter must export readiness checker');
        assert(parsed.zapier.length > 0, 'zapier-mcp-adapter must export readiness checker');
        assert(parsed.kling.length > 0, 'kling-fal-adapter must export readiness checker');
        assert(
          parsed.contract.some((k) => /hitl/i.test(k)),
          'adapter-contract.ts must export HITL gate helper',
        );
        assert(
          parsed.registryKeys.some((k) => /readiness|capabilit|snapshot/i.test(k)),
          'capabilities-registry.ts must export readiness aggregator',
        );
      },
    ),
  );

  results.push(
    await runCase(
      'T1-R3-02',
      'T1',
      'R3',
      'Injectable EnvSource Fail-Closed UNCONFIGURED Envelope',
      async () => {
        const gwsImp = await tryImportTs('src/lib/integrations/gws-adapter.ts');
        const zapImp = await tryImportTs('src/lib/integrations/zapier-mcp-adapter.ts');
        const klingImp = await tryImportTs('src/lib/integrations/kling-fal-adapter.ts');
        assert(gwsImp.ok && zapImp.ok && klingImp.ok, 'Missing one or more M2 adapters');

        const gwsReadiness = findExportedFn(gwsImp.mod, ['checkGwsReadiness', 'checkReadiness'], /readiness/i, 'gws readiness');
        const zapReadiness = findExportedFn(zapImp.mod, ['checkZapierMcpReadiness', 'checkReadiness'], /readiness/i, 'zapier readiness');
        const klingReadiness = findExportedFn(klingImp.mod, ['checkKlingFalReadiness', 'checkReadiness'], /readiness/i, 'kling readiness');

        assertAdapterReadiness(gwsReadiness({}), false);
        assertAdapterReadiness(zapReadiness({}), false);
        assertAdapterReadiness(klingReadiness({}), false);

        const gwsExec = findExportedFn(gwsImp.mod, ['executeGwsAction'], /execute/i, 'executeGwsAction');
        const zapExec = findExportedFn(zapImp.mod, ['callZapierMcpTool'], /callZapier/i, 'callZapierMcpTool');
        const klingExec = findExportedFn(klingImp.mod, ['submitKlingFalVideoJob'], /submitKling/i, 'submitKlingFalVideoJob');

        const gEnv = await gwsExec({ action: 'gmail.messages.list', scopes: ['gmail.readonly'] }, { env: {} });
        assertAdapterEnvelope(gEnv, { ok: false, mode: 'UNCONFIGURED', statusCode: 503 });

        const zEnv = await zapExec({ toolName: 'health_check', arguments: {}, actionCategory: 'read_only' }, { env: {} });
        assertAdapterEnvelope(zEnv, { ok: false, mode: 'UNCONFIGURED', statusCode: 503 });

        const kEnv = await klingExec(
          {
            provider: 'fal',
            operation: 'image-to-video',
            prompt: 'Test unconfigured probe',
            imageUrl: 'https://www.ezkertzaberria.com/images/fachada.jpg',
          },
          { env: {} },
        );
        assertAdapterEnvelope(kEnv, { ok: false, mode: 'UNCONFIGURED', statusCode: 503 });
      },
    ),
  );

  results.push(
    await runCase(
      'T1-R3-03',
      'T1',
      'R3',
      'GWS Adapter Configured Readiness & Draft/Read Scope Contract',
      async () => {
        const imp = await tryImportTs('src/lib/integrations/gws-adapter.ts');
        assert(imp.ok, imp.error?.message || 'Missing gws-adapter.ts');
        const checkReadiness = findExportedFn(imp.mod, ['checkGwsReadiness', 'checkReadiness'], /readiness/i, 'checkGwsReadiness');
        const validEnv = {
          GOOGLE_WORKSPACE_CLIENT_ID: 'test-client-id',
          GOOGLE_WORKSPACE_CLIENT_SECRET: 'test-client-secret',
          GOOGLE_WORKSPACE_REFRESH_TOKEN: 'test-refresh-token',
          GWS_ALLOWED_SCOPES: GWS_LEAST_PRIVILEGE_SCOPES.join(','),
        };
        const readiness = checkReadiness(validEnv);
        assertAdapterReadiness(readiness, true);

        const execFn = findExportedFn(imp.mod, ['executeGwsAction'], /execute/i, 'executeGwsAction');
        const sendBlocked = await execFn(
          {
            action: 'gmail.drafts.send',
            scopes: ['gmail.compose'],
            hitlApproved: false,
            params: { draftId: 'draft_123' },
          },
          { env: validEnv },
        );
        assertAdapterEnvelope(sendBlocked, { ok: false, mode: 'HITL_BLOCKED', statusCode: 403 });
      },
    ),
  );

  results.push(
    await runCase(
      'T1-R3-04',
      'T1',
      'R3',
      'Zapier MCP Adapter Streamable HTTP & Validation Contract',
      async () => {
        const imp = await tryImportTs('src/lib/integrations/zapier-mcp-adapter.ts');
        assert(imp.ok, imp.error?.message || 'Missing zapier-mcp-adapter.ts');
        const checkReadiness = findExportedFn(imp.mod, ['checkZapierMcpReadiness', 'checkReadiness'], /readiness/i, 'checkZapierMcpReadiness');
        const validEnv = {
          ZAPIER_MCP_URL: 'https://mcp.zapier.com/api/v1/connect',
          ZAPIER_MCP_TOKEN: 'test-zapier-token',
        };
        const readiness = checkReadiness(validEnv);
        assertAdapterReadiness(readiness, true);

        const execFn = findExportedFn(imp.mod, ['callZapierMcpTool'], /callZapier/i, 'callZapierMcpTool');

        let seenAuth = '';
        let seenUrl = '';
        await withMockFetch(
          async (input, init) => {
            seenUrl = typeof input === 'string' ? input : input.url;
            const h = new Headers(init?.headers || {});
            seenAuth = h.get('authorization') || '';
            return new Response(
              JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                result: {
                  content: [{ type: 'text', text: 'queued' }],
                },
              }),
              {
                status: 200,
                headers: { 'content-type': 'application/json' },
              },
            );
          },
          async () => {
            const res = await execFn(
              { toolName: 'ping', arguments: { q: 'otzarreta' }, actionCategory: 'read_only' },
              { env: validEnv },
            );
            assertAdapterEnvelope(res, { ok: true, mode: 'REAL', statusCode: 200 });
            assert(seenUrl.startsWith('https://'), 'Zapier MCP must enforce HTTPS endpoint');
            assertIncludes(seenAuth, 'Bearer test-zapier-token', 'Zapier Bearer header');
          },
        );
      },
    ),
  );

  results.push(
    await runCase(
      'T1-R3-05',
      'T1',
      'R3',
      'fal.ai & Kling O1 Adapter 3-Endpoint Contract & Honest Receipt',
      async () => {
        const imp = await tryImportTs('src/lib/integrations/kling-fal-adapter.ts');
        assert(imp.ok, imp.error?.message || 'Missing kling-fal-adapter.ts');
        const checkReadiness = findExportedFn(imp.mod, ['checkKlingFalReadiness', 'checkReadiness'], /readiness/i, 'checkKlingFalReadiness');
        const readiness = checkReadiness({
          FAL_KEY: 'test-fal-key',
          KLING_ACCESS_KEY: 'test-kling-ak',
          KLING_SECRET_KEY: 'test-kling-sk',
        });
        assertAdapterReadiness(readiness, true);

        const submitFn = findExportedFn(imp.mod, ['submitKlingFalVideoJob'], /submitKling/i, 'submitKlingFalVideoJob');
        const payloads = [
          {
            provider: 'fal',
            operation: 'image-to-video',
            prompt: 'Cinematic aerial pan of caserio in Derio Bizkaia',
            imageUrl: 'https://www.ezkertzaberria.com/images/fachada.jpg',
          },
          {
            provider: 'fal',
            operation: 'video-to-video/edit',
            prompt: 'Warm golden hour lighting for caserio garden',
            videoUrl: 'https://www.ezkertzaberria.com/videos/jardin.mp4',
          },
          {
            provider: 'fal',
            operation: 'reference-to-video',
            prompt: 'Wedding banquet showcase at Otzarreta Derio',
            referenceImageUrls: ['https://www.ezkertzaberria.com/images/fachada.jpg'],
          },
        ];
        for (const payload of payloads) {
          const res = await submitFn(payload, { env: {} });
          assertAdapterEnvelope(res, { ok: false, mode: 'UNCONFIGURED', statusCode: 503 });
          assert(!/\.mp4/i.test(JSON.stringify(res)), 'Unconfigured adapter must never fabricate .mp4 URL');
        }
      },
    ),
  );

  results.push(
    await runCase(
      'T1-R3-06',
      'T1',
      'R3',
      'Capabilities Registry + /api/integrations/readiness + .env.example',
      async () => {
        const cronSecret = 'test-cron-secret-32-chars-minimum-12345';
        const script = `
          import { GET } from './src/app/api/integrations/readiness/route.ts';
          (async () => {
            const req = new Request('http://127.0.0.1:3007/api/integrations/readiness', {
              headers: { authorization: 'Bearer ${cronSecret}' },
            });
            const res = await GET(req as any);
            const text = await res.text();
            console.log(JSON.stringify({ status: res.status, text }));
          })().catch((err) => {
            console.error(err);
            process.exit(1);
          });
        `;
        const run = runTsInline(script, {
          env: { CRON_SECRET: cronSecret, NODE_ENV: 'test' },
        });
        assertEqual(run.status, 0, `readiness inline run failed: ${run.stderr || run.stdout}`);
        const payload = JSON.parse(run.stdout.trim().split(/\r?\n/).pop());
        assertEqual(payload.status, 200, 'readiness HTTP status');
        assert(!payload.text.includes(cronSecret), 'readiness must not echo CRON_SECRET');
        const bodyText = payload.text.toLowerCase();
        for (const id of ['gws', 'zapier', 'kling']) {
          assert(bodyText.includes(id), `readiness JSON missing adapter: ${id}`);
        }

        const envExample = readText('.env.example');
        assert(envExample.exists, 'Missing .env.example');
        const envNonComment = envExample.content
          .split(/\r?\n/)
          .filter((l) => !/^\s*#/.test(l))
          .join('\n');
        for (const key of ['GWS_', 'ZAPIER_', 'FAL_', 'KLING_']) {
          assertIncludes(envNonComment, key, '.env.example server integration var');
          assert(
            !new RegExp(`NEXT_PUBLIC_${key}`).test(envNonComment),
            `Secret key ${key} must NOT have NEXT_PUBLIC_ prefix in .env.example`,
          );
        }
      },
    ),
  );

  // ── R4: Constitutional Shield (ear-os-ssot.ts, audit:ssot, typecheck, lint, npm-only) ──

  results.push(
    await runCase(
      'T1-R4-01',
      'T1',
      'R4',
      'ear-os-ssot.ts Canonical Constants Verification',
      async () => {
        const imp = await tryImportTs('src/lib/constants/ear-os-ssot.ts');
        assert(imp.ok, imp.error?.message || 'Cannot import ear-os-ssot.ts');
        const ssot = imp.mod.EAR_OS_SSOT;
        assertEqual(ssot.TARIFA_BASE_SOLISTA_EUR, 350, 'TARIFA_BASE_SOLISTA_EUR');
        assertEqual(ssot.TARIFA_ESTANDAR_SOLISTA_EUR, 550, 'TARIFA_ESTANDAR_SOLISTA_EUR');
        assertEqual(ssot.AJUSTE_PREVENTIVO_B2G_EUR, 14250, 'AJUSTE_PREVENTIVO_B2G_EUR');
        assertEqual(ssot.SAFE_LCSP_CEILING_EUR, 14250, 'SAFE_LCSP_CEILING_EUR');
        assertEqual(ssot.LIMITE_B2G_LCSP_EUR, 15000, 'LIMITE_B2G_LCSP_EUR');
        assertEqual(ssot.DEPOSITO_STRIPE_EUR, 100, 'DEPOSITO_STRIPE_EUR');
        assertEqual(ssot.SPLIT_SOBERANO.artista, 0.8, 'SPLIT_SOBERANO.artista');
        assertEqual(ssot.SPLIT_SOBERANO.earOs, 0.1, 'SPLIT_SOBERANO.earOs');
        assertEqual(ssot.SPLIT_SOBERANO.vimume, 0.1, 'SPLIT_SOBERANO.vimume');
        assertEqual(ssot.CENTRALITA_EAR_OS, '+34 693 693 048', 'CENTRALITA_EAR_OS');
      },
    ),
  );

  results.push(
    await runCase(
      'T1-R4-02',
      'T1',
      'R4',
      'npm run audit:ssot Exit 0 & Known-Good Hash Match',
      async () => {
        const cliRes = runCmd('npm', ['run', 'audit:ssot'], {
          timeoutMs: 60_000,
          cacheKey: 'audit_ssot',
        });
        assertEqual(cliRes.status, 0, `npm run audit:ssot failed: ${cliRes.stderr || cliRes.stdout}`);

        const guard = await tryImportTs('src/lib/security/ssotIntegrityGuard.ts');
        assert(guard.ok, guard.error?.message || 'Cannot import ssotIntegrityGuard.ts');
        const report = guard.mod.verifySsotIntegrity();
        assertEqual(report.intact, true, 'SSOT intact');
        assertEqual(report.invariantsOk, true, 'SSOT invariantsOk');
        assertEqual(report.computedHash, KNOWN_GOOD_SSOT_HASH, 'SSOT SHA-256 hash');
      },
    ),
  );

  results.push(
    await runCase(
      'T1-R4-03',
      'T1',
      'R4',
      'npm run typecheck Strict Exit 0',
      async () => {
        const res = runCmd('npm', ['run', 'typecheck'], {
          timeoutMs: 240_000,
          cacheKey: 'typecheck',
        });
        assert(!res.timedOut, 'npm run typecheck timed out (>240s)');
        assertEqual(res.status, 0, `typecheck failed:\n${res.stdout.slice(0, 500)}\n${res.stderr.slice(0, 500)}`);
      },
    ),
  );

  results.push(
    await runCase(
      'T1-R4-04',
      'T1',
      'R4',
      'npm run lint Exit 0',
      async () => {
        const res = runCmd('npm', ['run', 'lint'], {
          timeoutMs: 240_000,
          cacheKey: 'lint',
        });
        assert(!res.timedOut, 'npm run lint timed out (>240s)');
        assertEqual(res.status, 0, `lint failed:\n${res.stdout.slice(0, 500)}\n${res.stderr.slice(0, 500)}`);
      },
    ),
  );

  results.push(
    await runCase(
      'T1-R4-05',
      'T1',
      'R4',
      'AGENTS.md Strict npm Governance Compliance',
      async () => {
        const pkg = readJson('package.json');
        assert(pkg.exists && pkg.data, 'Cannot parse package.json');
        const scriptsStr = JSON.stringify(pkg.data.scripts || {});
        assert(!/\b(pnpm|yarn|bun)\b/i.test(scriptsStr), 'package.json scripts must not invoke pnpm/yarn/bun');

        const integrationFiles = walkFiles('src/lib/integrations', new Set(['.ts', '.tsx']));
        for (const f of integrationFiles) {
          const text = stripCodeComments(readText(f).content);
          assert(!/\b(pnpm|yarn|bun)\b/i.test(text), `${f} must not reference pnpm/yarn/bun`);
        }

        const plan = readText(MASTER_PLAN_PATH);
        assert(plan.exists, `Missing Master Plan: ${MASTER_PLAN_PATH}`);
        const badCmdLines = [];
        for (const line of plan.content.split(/\r?\n/)) {
          const matches = line.match(/\b(pnpm|yarn|bun)\s+(install|add|remove|run|exec|dlx|create)\b/gi);
          if (matches && !/prohibid|no usar|evitar|nunca|jam[aá]s|vetado|excluid/i.test(line)) {
            badCmdLines.push(`${matches.join(', ')} -> ${line.trim().slice(0, 80)}`);
          }
        }
        assertEqual(
          badCmdLines.length,
          0,
          `Master Plan prescribes forbidden package managers: ${badCmdLines.join(' | ')}`,
        );
      },
    ),
  );

  results.push(
    await runCase(
      'T1-R4-06',
      'T1',
      'R4',
      'Patient Zero & Catalog Isolation Audits',
      async () => {
        const pricing = runCmd('npm', ['run', 'verify:pricing'], {
          timeoutMs: 60_000,
          cacheKey: 'verify_pricing',
        });
        assertEqual(pricing.status, 0, `verify:pricing failed: ${pricing.stderr || pricing.stdout}`);

        const isolation = runCmd('npm', ['run', 'verify:catalog-isolation'], {
          timeoutMs: 60_000,
          cacheKey: 'verify_catalog_isolation',
        });
        assertEqual(isolation.status, 0, `verify:catalog-isolation failed: ${isolation.stderr || isolation.stdout}`);
      },
    ),
  );

  // ── R5: Canonical Otzarreta Derio Grounding ──

  results.push(
    await runCase(
      'T1-R5-01',
      'T1',
      'R5',
      'OTZARRETA_ENTITY Derio (Bizkaia) Canonical Identity',
      async () => {
        const imp = await tryImportTs('src/lib/constants/otzarreta-entity.ts');
        assert(imp.ok, imp.error?.message || 'Cannot import otzarreta-entity.ts');
        const e = imp.mod.OTZARRETA_ENTITY;
        assert(e && typeof e === 'object', 'OTZARRETA_ENTITY missing');
        assertEqual(e.municipality, 'Derio', 'OTZARRETA_ENTITY.municipality');
        assertEqual(e.province, 'Bizkaia', 'OTZARRETA_ENTITY.province');
        assertEqual(e.postalCode, '48160', 'OTZARRETA_ENTITY.postalCode');
        assertMatch(e.streetAddress, /Santo Domingo Hiribidea,?\s*13/i, 'OTZARRETA_ENTITY.streetAddress');
        assertIncludes(normText(e.fullAddress), 'derio', 'OTZARRETA_ENTITY.fullAddress');
        assertIncludes(normText(e.fullAddress), 'bizkaia', 'OTZARRETA_ENTITY.fullAddress');
        assertEqual(e.capacityPax, 350, 'OTZARRETA_ENTITY.capacityPax');
        assert(e.parkingSpaces >= 120, `parkingSpaces expected >= 120, got ${e.parkingSpaces}`);
        assertEqual(e.verified, true, 'OTZARRETA_ENTITY.verified');
        const digits = String(e.primaryPhone || '').replace(/\D/g, '');
        assert(digits.length >= 9 && !digits.endsWith('693693048'), 'primaryPhone must be valid and distinct from Centralita');
      },
    ),
  );

  results.push(
    await runCase(
      'T1-R5-02',
      'T1',
      'R5',
      'Required Area of Influence Coverage (incl. Uribe Kosta & Bizkaia Central)',
      async () => {
        const c126 = await tryImportTs('src/lib/seo/otzarreta-126-cluster-engine.ts');
        const dom = await tryImportTs('src/lib/seo/otzarreta-dominance-engine.ts');
        assert(c126.ok, c126.error?.message || 'Cannot import otzarreta-126-cluster-engine.ts');
        assert(dom.ok, dom.error?.message || 'Cannot import otzarreta-dominance-engine.ts');
        const c126Serialized = JSON.stringify(
          c126.mod.OTZARRETA_126_LANDINGS || c126.mod.OTZARRETA_BIZKAIA_MUNICIPALITIES || c126.mod,
        );
        const domSerialized = JSON.stringify(
          dom.mod.OTZARRETA_LANDINGS || dom.mod.OTZARRETA_MUNICIPALITIES || dom.mod,
        );
        assert(
          !FORBIDDEN_OTZARRETA_TOKENS_RE.test(c126Serialized),
          'OTZARRETA_126_LANDINGS contains forbidden Zarautz/Gipuzkoa/Zizurkil tokens',
        );
        assert(
          !FORBIDDEN_OTZARRETA_TOKENS_RE.test(domSerialized),
          'OTZARRETA_LANDINGS contains forbidden Zarautz/Gipuzkoa/Zizurkil tokens',
        );
        const combined = normText(`${c126Serialized}\n${domSerialized}`);
        for (const area of REQUIRED_OTZARRETA_AREAS) {
          const hyphenated = area.replace(/\s+/g, '-');
          assert(
            combined.includes(area) || combined.includes(hyphenated),
            `Otzarreta cluster engines missing required area of influence: ${area}`,
          );
        }
      },
    ),
  );

  results.push(
    await runCase(
      'T1-R5-03',
      'T1',
      'R5',
      'Main Otzarreta Public Pages, Master Plan & Cockpit Derio Grounding',
      async () => {
        const derioAndBizkaiaFiles = [
          'src/app/(public)/otzarreta/page.tsx',
          'src/app/(public)/fincas/restaurante-eduardo-martinez/page.tsx',
          'src/app/(public)/checkout/presupuesto/page.tsx',
          'src/app/(public)/proveedores/page.tsx',
          'src/components/providers/ProviderUniversalCockpit.tsx',
          'src/lib/constants/ezkertza-derio-venue.ts',
          'src/lib/constants/ezkertza-storytelling-chapters.ts',
        ];
        const additionalCleanFiles = [
          'src/components/checkout/SovereignCollectiveEventBuilder.tsx',
          'src/app/(public)/bodas/guipuzcoa/restaurante-otzarreta/page.tsx',
          'src/components/providers/VendorClaimProposalCard.tsx',
          'src/lib/agents/pageContext.ts',
          'src/app/api/profiles/search/route.ts',
          ...walkFiles('src/components/otzarreta', new Set(['.ts', '.tsx'])),
        ];

        for (const rel of derioAndBizkaiaFiles) {
          const file = readText(rel);
          assert(file.exists, `Missing public Otzarreta file: ${rel}`);
          const cleaned = stripCodeComments(file.content);
          assert(
            /derio/i.test(cleaned) && /bizkaia/i.test(cleaned),
            `Otzarreta surface missing explicit Derio + Bizkaia grounding: ${rel}`,
          );
          const m = cleaned.match(FORBIDDEN_OTZARRETA_TOKENS_RE);
          assert(!m, `Territorial conflation token "${m?.[0]}" still present in ${rel}`);
        }

        for (const rel of additionalCleanFiles) {
          const file = readText(rel);
          assert(file.exists, `Missing Otzarreta-coupled file: ${rel}`);
          const cleaned = stripCodeComments(file.content);
          if (rel.endsWith('SovereignCollectiveEventBuilder.tsx')) {
            assert(/derio/i.test(cleaned), `Otzarreta-coupled builder missing Derio grounding: ${rel}`);
          }
          const m = cleaned.match(FORBIDDEN_OTZARRETA_TOKENS_RE);
          assert(!m, `Territorial conflation token "${m?.[0]}" still present in ${rel}`);
        }

        const plan = readText(MASTER_PLAN_PATH);
        assert(plan.exists, `Missing Master Plan: ${MASTER_PLAN_PATH}`);
        const planNorm = normText(plan.content);
        for (const requiredToken of [
          'derio',
          'bizkaia',
          'txorierri',
          'gran bilbao',
          'santo domingo hiribidea, 13',
          '48160',
          ...REQUIRED_OTZARRETA_AREAS,
        ]) {
          assert(
            planNorm.includes(requiredToken),
            `Master Plan R5 grounding missing required token/area: ${requiredToken}`,
          );
        }
        const planClean = stripOtzarretaPurgeClauses(plan.content);
        const planBad = planClean.match(FORBIDDEN_OTZARRETA_TOKENS_RE);
        assert(
          !planBad,
          `Master Plan contains positive Zarautz/Gipuzkoa/Zizurkil attribution: "${planBad?.[0]}"`,
        );
      },
    ),
  );

  results.push(
    await runCase(
      'T1-R5-04',
      'T1',
      'R5',
      'sitemap.ts Canonical Otzarreta URL Grounding',
      async () => {
        const imp = await tryImportTs('src/app/sitemap.ts');
        assert(imp.ok, imp.error?.message || 'Cannot import src/app/sitemap.ts');
        const entries = await imp.mod.default();
        assert(Array.isArray(entries) && entries.length > 0, 'sitemap() must return non-empty array');
        const otzUrls = entries
          .map((e) => String(e?.url || ''))
          .filter((u) => /otzarreta|eduardo-martinez/i.test(u));
        assert(otzUrls.some((u) => /\/otzarreta\/?$/i.test(u)), 'sitemap() missing /otzarreta root URL');
        assert(
          otzUrls.some((u) => /derio|uribe-kosta/i.test(u)),
          'sitemap() missing Derio / Uribe Kosta Otzarreta URLs',
        );
        const badUrls = otzUrls.filter((u) => FORBIDDEN_OTZARRETA_TOKENS_RE.test(u));
        assertEqual(badUrls.length, 0, `sitemap() still emits Zarautz/Gipuzkoa/Zizurkil Otzarreta URLs: ${badUrls.slice(0, 3).join(', ')}`);
      },
    ),
  );

  results.push(
    await runCase(
      'T1-R5-05',
      'T1',
      'R5',
      'GET /api/profiles/search?q=otzarreta Canonical API Output',
      async () => {
        const res = await invokeRoute('src/app/api/profiles/search/route.ts', 'GET', {
          url: 'http://127.0.0.1:3007/api/profiles/search?q=otzarreta',
        });
        assert(res.ok, res.error || 'Failed to invoke /api/profiles/search');
        assertEqual(res.status, 200, 'profiles/search status');
        const list = res.json?.providers || res.json?.items || [];
        const otzRecords = list.filter((p) => /otzarreta|ezkertza/i.test(JSON.stringify(p)));
        assert(otzRecords.length > 0, 'Expected at least 1 Otzarreta record from /api/profiles/search?q=otzarreta');
        for (const rec of otzRecords) {
          assertEqual(rec.municipality, 'Derio', 'Otzarreta API municipality');
          assertMatch(rec.province, /Bizkaia|Vizcaya/i, 'Otzarreta API province');
          assertMatch(rec.address, /Santo Domingo Hiribidea,?\s*13/i, 'Otzarreta API street');
          assertIncludes(rec.address, '48160', 'Otzarreta API postalCode');
          assertEqual(rec.capacidadMaxPax, 350, 'Otzarreta API capacidadMaxPax');
          assert(
            !FORBIDDEN_OTZARRETA_TOKENS_RE.test(JSON.stringify(rec)),
            `Otzarreta API record still leaks Zarautz/Gipuzkoa: ${JSON.stringify(rec).slice(0, 200)}`,
          );
        }
      },
    ),
  );

  results.push(
    await runCase(
      'T1-R5-06',
      'T1',
      'R5',
      'Concierge pageContext.ts + Otzarreta Manifest & Anti-Cannibalization Audit',
      async () => {
        const imp = await tryImportTs('src/lib/agents/pageContext.ts');
        assert(imp.ok, imp.error?.message || 'Cannot import pageContext.ts');
        const ctx = imp.mod.resolvePageContext({ pathname: '/otzarreta' });
        assertEqual(ctx.kind, 'venue', 'pageContext.kind');
        assertEqual(ctx.municipality, 'Derio', 'pageContext.municipality');
        assertEqual(ctx.province, 'Bizkaia', 'pageContext.province');
        const joined = `${ctx.facts.join('\n')}\n${ctx.guidance}`;
        assert(
          !FORBIDDEN_OTZARRETA_TOKENS_RE.test(joined),
          `pageContext facts/guidance still contain Zarautz/Gipuzkoa: ${joined.slice(0, 240)}`,
        );

        const audit = runCmd(process.execPath, ['scripts/audit_otzarreta_landings.cjs'], {
          timeoutMs: 60_000,
          cacheKey: 'audit_otzarreta_landings',
        });
        assert(!audit.timedOut, 'audit_otzarreta_landings.cjs timed out');
        assertEqual(audit.status, 0, `audit_otzarreta_landings.cjs exit code: ${audit.stderr}`);
      },
    ),
  );

  return results;
}
