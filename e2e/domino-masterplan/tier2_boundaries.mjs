/**
 * ════════════════════════════════════════════════════════════════════════════
 * TIER 2 — BOUNDARY & CORNER CASES (28 TESTS: 5 R1, 5 R2, 6 R3, 5 R4, 7 R5)
 * ════════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import {
  FORBIDDEN_OTZARRETA_TOKENS_RE,
  GWS_LEAST_PRIVILEGE_SCOPES,
  SSRF_UNSAFE_URLS,
  assert,
  assertAdapterEnvelope,
  assertAdapterReadiness,
  assertEqual,
  assertHitlDecision,
  assertMatch,
  assertNoPiiOrSecrets,
  assertNoSecretsOrPii,
  captureConsole,
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

export async function runTier2() {
  const results = [];

  // ── R1 Boundaries (5) ──

  results.push(
    await runCase(
      'T2-R1-01',
      'T2',
      'R1',
      'No Stale Graphify Rebuild Lock & Unknown Query Graceful Handling',
      async () => {
        assert(!fileExists('graphify-out/.rebuild.lock'), 'Stale graphify-out/.rebuild.lock still exists');
        assert(fileExists('graphify-out/graph.json'), 'graphify-out/graph.json must exist before query');
        const q = runCmd('graphify', ['query', 'nonexistent_symbol_xyz_99999'], {
          timeoutMs: 30_000,
        });
        assert(!q.timedOut, 'graphify query timed out on unknown symbol');
        assert(
          q.status === 0 || q.status === 4,
          `Unexpected graphify query exit code ${q.status}: ${q.stderr}`,
        );
        assert(
          !/Traceback \(most recent call last\)/i.test(`${q.stdout}\n${q.stderr}`),
          'graphify query emitted unhandled Python traceback',
        );
      },
    ),
  );

  results.push(
    await runCase(
      'T2-R1-02',
      'T2',
      'R1',
      'Unverified / Credential-Gated External Tools Honesty Boundary',
      async () => {
        const doc = readText(MASTER_PLAN_PATH);
        assert(doc.exists, `Missing Master Plan: ${MASTER_PLAN_PATH}`);
        const norm = normText(doc.content);
        assert(
          !/(lista sin credenciales|100% operativa local sin credenciales)/.test(norm),
          'External credential-gated tools must not be falsely marked ready without credentials',
        );
        for (const extTool of ['claude video', 'google stitch', 'kling', 'zapier']) {
          assert(norm.includes(extTool), `Master Plan missing external tool assessment: ${extTool}`);
        }
        assert(
          /(credencial|api key|oauth|token|externa|diferid)/.test(norm),
          'Master Plan must document external auth/API prerequisites',
        );
      },
    ),
  );

  results.push(
    await runCase(
      'T2-R1-03',
      'T2',
      'R1',
      'Zero-Omission 16-Capability Enumeration Boundary',
      async () => {
        const doc = readText(MASTER_PLAN_PATH);
        assert(doc.exists, `Missing Master Plan: ${MASTER_PLAN_PATH}`);
        const norm = normText(doc.content);
        const required17 = [
          'claude video',
          'notebooklm',
          'graphify',
          'impeccable',
          'ponytail',
          'last30days',
          'skill theory',
          'grill me',
          'superpowers',
          'playwright',
          'obsidian',
          'gbrain',
          'google stitch',
          'scroll world',
          'hyperframes',
          'gws',
          'zapier',
        ];
        for (const item of required17) {
          assert(
            norm.includes(item) || (item === 'grill me' && norm.includes('grill-me')),
            `Capability slot omitted from rubric: ${item}`,
          );
        }
        for (let i = 1; i <= 16; i += 1) {
          const slotRe = new RegExp(`(?:^|\\|\\s*|\\b)${i}(?:\\.|\\s*\\|)`, 'm');
          assert(slotRe.test(doc.content), `Missing numbered capability slot #${i} in Master Plan`);
        }
      },
    ),
  );

  results.push(
    await runCase(
      'T2-R1-04',
      'T2',
      'R1',
      'graphify query Special-Character / Empty-Input Boundary',
      async () => {
        const graphPath = repoPath('graphify-out/graph.json');
        assert(fs.existsSync(graphPath), 'Missing graphify-out/graph.json');
        const beforeStat = fs.statSync(graphPath);

        for (const degInput of ['', '&& || ;']) {
          const q = runCmd('graphify', ['query', degInput], { timeoutMs: 20_000 });
          assert(!q.timedOut, `graphify query hung on degenerate input ${JSON.stringify(degInput)}`);
          assert(
            !/Traceback \(most recent call last\)/i.test(`${q.stdout}\n${q.stderr}`),
            `graphify query crashed on ${JSON.stringify(degInput)}`,
          );
        }

        const afterStat = fs.statSync(graphPath);
        assertEqual(afterStat.size, beforeStat.size, 'graph.json size altered by query');
        assertEqual(afterStat.mtimeMs, beforeStat.mtimeMs, 'graph.json mtime altered by query');
      },
    ),
  );

  results.push(
    await runCase(
      'T2-R1-05',
      'T2',
      'R1',
      'Grill Me Checkpoint Tension Resolution Boundary',
      async () => {
        const dir = repoPath('.antigravity/brainstorms');
        assert(fs.existsSync(dir), 'Missing .antigravity/brainstorms directory');
        const file = fs.readdirSync(dir).find((f) => /16[-_]?capacidades.*domino.*\.md$/i.test(f));
        assert(file, 'Missing 16-CAPACIDADES_DOMINO decisions checkpoint');
        const doc = readText(`.antigravity/brainstorms/${file}`);
        const norm = normText(doc.content);
        assert(!/\btbd\b|pendiente de decidir/i.test(norm), 'Checkpoint must not leave unresolved TBD tensions');
        assert(norm.includes('gws') && /(scope|permiso)/.test(norm), 'Tension 1 (GWS scopes) missing');
        assert(
          norm.includes('derio') &&
            norm.includes('bizkaia') &&
            /(zarautz|fuera de bizkaia|anclaje unico)/.test(norm),
          'Tension 2 (Derio vs outside Bizkaia/Zarautz) missing',
        );
        assert(norm.includes('unconfigured'), 'Tension 3 (UNCONFIGURED adapter behavior) missing');
        assert(norm.includes('coolify') && norm.includes('standalone'), 'Tension 4 (Coolify/standalone) missing');
      },
    ),
  );

  // ── R2 Boundaries (5) ──

  results.push(
    await runCase(
      'T2-R2-01',
      'T2',
      'R2',
      'Disallowed Overly Broad gws OAuth Scopes Rejection',
      async () => {
        const imp = await tryImportTs('src/lib/integrations/gws-adapter.ts');
        assert(imp.ok, imp.error?.message || 'Missing gws-adapter.ts');
        const validateScopes = findExportedFn(imp.mod, ['validateGwsScopes'], /scope/i, 'validateGwsScopes');
        const checkReadiness = findExportedFn(imp.mod, ['checkGwsReadiness', 'checkReadiness'], /readiness/i, 'checkGwsReadiness');
        const execFn = findExportedFn(imp.mod, ['executeGwsAction'], /execute/i, 'executeGwsAction');
        const broadScopes = [
          'https://mail.google.com/',
          'gmail.modify',
          'gmail.send',
          'https://www.googleapis.com/auth/drive',
          'https://www.googleapis.com/auth/calendar',
        ];

        for (const scope of broadScopes) {
          const scopeRes = validateScopes([scope]);
          assertEqual(scopeRes.ok, false, `validateGwsScopes must reject broad scope ${scope}`);
          const envWithBroad = {
            GOOGLE_WORKSPACE_CLIENT_ID: 'cid',
            GOOGLE_WORKSPACE_CLIENT_SECRET: 'csec',
            GOOGLE_WORKSPACE_REFRESH_TOKEN: 'rtok',
            GWS_ALLOWED_SCOPES: scope,
          };
          const readyRes = checkReadiness(envWithBroad);
          assertEqual(readyRes.configured, false, `checkGwsReadiness must fail closed for broad scope ${scope}`);
          assertEqual(readyRes.mode, 'UNCONFIGURED', `checkGwsReadiness mode for broad scope ${scope}`);
          assertMatch(readyRes.details || '', /GWS_SCOPE_VIOLATION/i, `readiness details for ${scope}`);

          const execRes = await execFn(
            { action: 'gmail.messages.list', scopes: [scope] },
            { env: envWithBroad },
          );
          assertAdapterEnvelope(execRes, { ok: false, statusCode: 403 });
        }
      },
    ),
  );

  results.push(
    await runCase(
      'T2-R2-02',
      'T2',
      'R2',
      'BVA on Financial (5.000 EUR, 14.250 EUR, 15.000 EUR) & Distance (300 km) HITL Thresholds',
      async () => {
        const imp = await tryImportTs('src/lib/integrations/adapter-contract.ts');
        assert(imp.ok, imp.error?.message || 'Missing adapter-contract.ts');
        const hitl = findExportedFn(
          imp.mod,
          ['evaluateHitlPolicyGate', 'evaluateHitlGate', 'validateHitlGate'],
          /evaluate.*hitl/i,
          'evaluateHitlPolicyGate',
        );

        for (const amountEur of [5000.01, 14250, 14250.01]) {
          const dec = hitl({ actionKind: 'b2g_contract', amountEur });
          assertHitlDecision(dec, { allowed: false, tier: '5_HITL_TOTAL' });
        }
        assertHitlDecision(
          hitl({ actionKind: 'b2g_contract', amountEur: 14250.01, humanApproved: true }),
          { allowed: false, tier: '5_HITL_TOTAL' },
        );
        assertHitlDecision(
          hitl({ actionKind: 'b2g_contract', amountEur: 15000.01 }),
          { allowed: false, tier: '0_FORBIDDEN' },
        );
        assertHitlDecision(
          hitl({ actionKind: 'b2g_contract', amountEur: 15000.01, humanApproved: true }),
          { allowed: false, tier: '0_FORBIDDEN' },
        );
        assertHitlDecision(
          hitl({ actionKind: 'express_quote', artistId: 'e78903', amountEur: 349.99 }),
          { allowed: false, tier: '0_FORBIDDEN' },
        );
        assertHitlDecision(
          hitl({ actionKind: 'express_quote', artistId: 'e78903', amountEur: 349.99, humanApproved: true }),
          { allowed: false, tier: '0_FORBIDDEN' },
        );
        for (const amountEur of [4999.99, 5000]) {
          const dec = hitl({ actionKind: 'b2g_contract', amountEur });
          assertHitlDecision(dec);
          assert(
            !(dec.allowed === false && dec.tier === '5_HITL_TOTAL'),
            `B2G amount ${amountEur} <= 5000 must not trigger >5000 5_HITL_TOTAL block`,
          );
        }

        const over300 = hitl({ actionKind: 'express_quote', distanceKm: 301 });
        assertHitlDecision(over300, { allowed: false, tier: '25_REVIEW' });

        for (const km of [299, 300]) {
          const dec = hitl({ actionKind: 'express_quote', distanceKm: km });
          assertHitlDecision(dec);
          assert(
            !(dec.allowed === false && dec.tier === '25_REVIEW'),
            `Distance ${km}km <= 300km must not trigger >300km 25_REVIEW block`,
          );
        }
      },
    ),
  );

  results.push(
    await runCase(
      'T2-R2-03',
      'T2',
      'R2',
      'AGENTS.md §2 Forbidden & Mandatory HITL Action Classes',
      async () => {
        const imp = await tryImportTs('src/lib/integrations/adapter-contract.ts');
        assert(imp.ok, imp.error?.message || 'Missing adapter-contract.ts');
        const hitl = findExportedFn(
          imp.mod,
          ['evaluateHitlPolicyGate', 'evaluateHitlGate', 'validateHitlGate'],
          /evaluate.*hitl/i,
          'evaluateHitlPolicyGate',
        );

        assertHitlDecision(
          hitl({ actionKind: 'contract_close', bilateralConsentConfirmed: false }),
          { allowed: false, tier: '0_FORBIDDEN' },
        );
        assertHitlDecision(
          hitl({ actionKind: 'contract_close', bilateralConsentConfirmed: false, humanApproved: true }),
          { allowed: false, tier: '0_FORBIDDEN' },
        );
        assertHitlDecision(
          hitl({ actionKind: 'express_quote', artistId: 'e78903', amountEur: 349.99, humanApproved: true }),
          { allowed: false, tier: '0_FORBIDDEN' },
        );
        assertHitlDecision(
          hitl({ actionKind: 'b2g_contract', amountEur: 15000.01, humanApproved: true }),
          { allowed: false, tier: '0_FORBIDDEN' },
        );

        for (const actionKind of ['event_cancellation', 'litigation', 'vimume_clinical']) {
          assertHitlDecision(hitl({ actionKind }), {
            allowed: false,
            tier: '5_HITL_TOTAL',
          });
        }

        assertHitlDecision(
          hitl({ actionKind: 'stripe_price_lock' }),
          { allowed: false, tier: '25_REVIEW' },
        );
      },
    ),
  );

  results.push(
    await runCase(
      'T2-R2-04',
      'T2',
      'R2',
      'AGENTS.md §2 Permitted Low-Risk Autonomous / Semi-Auto Actions',
      async () => {
        const imp = await tryImportTs('src/lib/integrations/adapter-contract.ts');
        assert(imp.ok, imp.error?.message || 'Missing adapter-contract.ts');
        const hitl = findExportedFn(
          imp.mod,
          ['evaluateHitlPolicyGate', 'evaluateHitlGate', 'validateHitlGate'],
          /evaluate.*hitl/i,
          'evaluateHitlPolicyGate',
        );

        assertHitlDecision(hitl({ actionKind: 'read_only' }), {
          allowed: true,
          tier: '90_AUTO',
        });

        assertHitlDecision(hitl({ actionKind: 'express_quote', distanceKm: 50 }), {
          allowed: true,
          tier: '60_SEMI_AUTO',
        });
        assertHitlDecision(
          hitl({ actionKind: 'paid_provider_dossier', providerTier: 'SOVEREIGN' }),
          { allowed: true, tier: '60_SEMI_AUTO' },
        );

        const unpaidDossier = hitl({
          actionKind: 'paid_provider_dossier',
          providerTier: 'DIRECTORY_UNCLAIMED',
        });
        assertHitlDecision(unpaidDossier, { allowed: false, tier: '0_FORBIDDEN' });
      },
    ),
  );

  results.push(
    await runCase(
      'T2-R2-05',
      'T2',
      'R2',
      'Coolify 1 vCPU / 4 GB RAM Standalone Exclusion & Memory Budget Gate',
      async () => {
        const memGate = runCmd('npm', ['run', 'verify:build-memory'], {
          timeoutMs: 60_000,
          cacheKey: 'verify_build_memory',
        });
        assertEqual(memGate.status, 0, `verify:build-memory failed: ${memGate.stderr || memGate.stdout}`);

        const cfg = readText('next.config.ts');
        assert(cfg.exists, 'Missing next.config.ts');
        assertMatch(cfg.content, /output:\s*["']standalone["']/, 'next.config.ts standalone output');
        assertMatch(cfg.content, /cpus:\s*1\b/, 'next.config.ts experimental.cpus === 1');
        assertMatch(cfg.content, /workerThreads:\s*false\b/, 'next.config.ts experimental.workerThreads === false');
        for (const ex of ['./docs/**/*', './scripts/**/*', './vault/**/*', './src/data/**/*']) {
          assert(cfg.content.includes(ex), `next.config.ts missing outputFileTracingExcludes entry: ${ex}`);
        }
      },
    ),
  );

  // ── R3 Boundaries (6) ──

  results.push(
    await runCase(
      'T2-R3-01',
      'T2',
      'R3',
      'Whitespace-Only, Empty String, and Partial Env Vars Handling',
      async () => {
        const gwsImp = await tryImportTs('src/lib/integrations/gws-adapter.ts');
        const zapImp = await tryImportTs('src/lib/integrations/zapier-mcp-adapter.ts');
        const klingImp = await tryImportTs('src/lib/integrations/kling-fal-adapter.ts');
        assert(gwsImp.ok && zapImp.ok && klingImp.ok, 'Missing adapters');

        const gwsReadiness = findExportedFn(gwsImp.mod, ['checkGwsReadiness', 'checkReadiness'], /readiness/i, 'gws readiness');
        const zapReadiness = findExportedFn(zapImp.mod, ['checkZapierMcpReadiness', 'checkReadiness'], /readiness/i, 'zapier readiness');
        const klingReadiness = findExportedFn(klingImp.mod, ['checkKlingFalReadiness', 'checkReadiness'], /readiness/i, 'kling readiness');
        const klingExec = findExportedFn(klingImp.mod, ['submitKlingFalVideoJob'], /submitKling/i, 'submitKlingFalVideoJob');

        const cases = [
          [
            gwsReadiness,
            {
              GOOGLE_WORKSPACE_CLIENT_ID: '   ',
              GOOGLE_WORKSPACE_CLIENT_SECRET: '',
              GOOGLE_WORKSPACE_REFRESH_TOKEN: '\t\n',
            },
            ['GOOGLE_WORKSPACE_CLIENT_ID', 'GOOGLE_WORKSPACE_CLIENT_SECRET', 'GOOGLE_WORKSPACE_REFRESH_TOKEN'],
          ],
          [
            zapReadiness,
            { ZAPIER_MCP_URL: '  ', ZAPIER_MCP_TOKEN: '' },
            ['ZAPIER_MCP_TOKEN'],
          ],
          [
            zapReadiness,
            { ZAPIER_MCP_URL: 'https://mcp.zapier.com/api/v1/connect', ZAPIER_MCP_TOKEN: '   ' },
            ['ZAPIER_MCP_TOKEN'],
          ],
          [
            klingReadiness,
            { FAL_KEY: '   ', KLING_ACCESS_KEY: '', KLING_SECRET_KEY: '\t' },
            ['FAL_KEY'],
          ],
          [
            klingReadiness,
            { KLING_ACCESS_KEY: 'ak_valid', KLING_SECRET_KEY: '   ' },
            ['FAL_KEY'],
          ],
        ];
        for (const [fn, env, expectedMissing] of cases) {
          const r = fn(env);
          assertAdapterReadiness(r, false);
          for (const k of expectedMissing) {
            assert(
              r.missingVars.some((m) => m.includes(k)),
              `${r.adapterId} missingVars must include whitespace/empty key ${k} (got: ${r.missingVars.join(', ')})`,
            );
          }
        }

        const partialDirectEnv = await klingExec(
          {
            provider: 'kling-direct',
            operation: 'image-to-video',
            imageUrl: 'https://www.ezkertzaberria.com/images/fachada.jpg',
            prompt: 'Derio caserio aerial shot',
          },
          { env: { KLING_ACCESS_KEY: 'ak_valid', KLING_SECRET_KEY: '   ' } },
        );
        assertAdapterEnvelope(partialDirectEnv, { ok: false, mode: 'UNCONFIGURED', statusCode: 503 });
      },
    ),
  );

  results.push(
    await runCase(
      'T2-R3-02',
      'T2',
      'R3',
      'SSRF, Private IP, Localhost, Non-Zapier Exfil & Non-HTTPS URL Rejection',
      async () => {
        const klingImp = await tryImportTs('src/lib/integrations/kling-fal-adapter.ts');
        const zapierImp = await tryImportTs('src/lib/integrations/zapier-mcp-adapter.ts');
        assert(klingImp.ok && zapierImp.ok, 'Missing adapters');

        const klingExec = findExportedFn(klingImp.mod, ['submitKlingFalVideoJob'], /submitKling/i, 'submitKlingFalVideoJob');
        const zapierExec = findExportedFn(zapierImp.mod, ['callZapierMcpTool'], /callZapier/i, 'callZapierMcpTool');

        let fetchCalled = false;
        await withMockFetch(
          async () => {
            fetchCalled = true;
            throw new Error('Outbound network call must not happen for SSRF URL');
          },
          async () => {
            for (const badUrl of SSRF_UNSAFE_URLS) {
              const kr = await klingExec(
                {
                  provider: 'fal',
                  operation: 'image-to-video',
                  imageUrl: badUrl,
                  prompt: 'Valid test prompt',
                },
                { env: { FAL_KEY: 'test-fal' } },
              );
              assertAdapterEnvelope(kr, { ok: false, statusCode: 400 });

              const kDirectBase = await klingExec(
                {
                  provider: 'kling-direct',
                  operation: 'image-to-video',
                  imageUrl: 'https://www.ezkertzaberria.com/images/fachada.jpg',
                  prompt: 'Valid test prompt',
                },
                {
                  env: {
                    KLING_ACCESS_KEY: 'ak_test',
                    KLING_SECRET_KEY: 'sk_test',
                    KLING_API_BASE_URL: badUrl,
                  },
                },
              );
              assertAdapterEnvelope(kDirectBase, { ok: false, statusCode: 400 });

              const zr = await zapierExec(
                { toolName: 'ping', arguments: {}, actionCategory: 'read_only' },
                { env: { ZAPIER_MCP_URL: badUrl, ZAPIER_MCP_TOKEN: 'test-token' } },
              );
              assertAdapterEnvelope(zr, { ok: false, statusCode: 400 });
            }

            const exfilZapier = await zapierExec(
              { toolName: 'ping', arguments: {}, actionCategory: 'read_only' },
              { env: { ZAPIER_MCP_URL: 'https://evil.example.com/mcp', ZAPIER_MCP_TOKEN: 'test-token' } },
            );
            assertAdapterEnvelope(exfilZapier, { ok: false, statusCode: 400 });
          },
        );
        assert(!fetchCalled, 'SSRF validator triggered outbound fetch');
      },
    ),
  );

  results.push(
    await runCase(
      'T2-R3-03',
      'T2',
      'R3',
      'Malformed, Oversized, and Zod .strict() Extra-Key Payloads',
      async () => {
        const klingImp = await tryImportTs('src/lib/integrations/kling-fal-adapter.ts');
        const zapierImp = await tryImportTs('src/lib/integrations/zapier-mcp-adapter.ts');
        assert(klingImp.ok && zapierImp.ok, 'Missing adapters');

        const klingExec = findExportedFn(klingImp.mod, ['submitKlingFalVideoJob'], /submitKling/i, 'submitKlingFalVideoJob');
        const zapierExec = findExportedFn(zapierImp.mod, ['callZapierMcpTool'], /callZapier/i, 'callZapierMcpTool');

        const klingEnv = { FAL_KEY: 'test-fal' };
        const badJobs = [
          { provider: 'fal', operation: 'image-to-video', imageUrl: 'https://www.ezkertzaberria.com/images/fachada.jpg', prompt: '' },
          { provider: 'fal', operation: 'image-to-video', imageUrl: 'https://www.ezkertzaberria.com/images/fachada.jpg', prompt: 'x'.repeat(20000) },
          { provider: 'fal', operation: 'image-to-video', imageUrl: 'https://www.ezkertzaberria.com/images/fachada.jpg', prompt: 'Valid', durationSeconds: '-1' },
          { provider: 'fal', operation: 'image-to-video', imageUrl: 'https://www.ezkertzaberria.com/images/fachada.jpg', prompt: 'Valid', durationSeconds: '999' },
          { provider: 'fal', operation: 'text-to-3d', imageUrl: 'https://www.ezkertzaberria.com/images/fachada.jpg', prompt: 'Valid' },
        ];
        for (const payload of badJobs) {
          const r = await klingExec(payload, { env: klingEnv });
          assertAdapterEnvelope(r, { ok: false, statusCode: 400 });
        }

        const strictRes = await zapierExec(
          { toolName: 'ping', unknownStrictKey: true },
          { env: { ZAPIER_MCP_URL: 'https://mcp.zapier.com/api/v1/connect', ZAPIER_MCP_TOKEN: 'tok' } },
        );
        assertAdapterEnvelope(strictRes, { ok: false, statusCode: 400 });
      },
    ),
  );

  results.push(
    await runCase(
      'T2-R3-04',
      'T2',
      'R3',
      'INV-14 Secret & PII Redaction in Upstream Error Envelopes and Logs',
      async () => {
        const klingImp = await tryImportTs('src/lib/integrations/kling-fal-adapter.ts');
        const zapierImp = await tryImportTs('src/lib/integrations/zapier-mcp-adapter.ts');
        const gwsImp = await tryImportTs('src/lib/integrations/gws-adapter.ts');
        assert(klingImp.ok && zapierImp.ok && gwsImp.ok, 'Missing adapters');

        const klingExec = findExportedFn(klingImp.mod, ['submitKlingFalVideoJob'], /submitKling/i, 'submitKlingFalVideoJob');
        const zapierExec = findExportedFn(zapierImp.mod, ['callZapierMcpTool'], /callZapier/i, 'callZapierMcpTool');
        const gwsExec = findExportedFn(gwsImp.mod, ['executeGwsAction'], /execute/i, 'executeGwsAction');

        const forbidden = [
          'sk_live_SECRET_999',
          'fal_secret_12345',
          'gws_csec_SECRET_777',
          'gws_rtok_SECRET_888',
          'gws_access_SECRET_555',
          'ceo@productoraear.com',
          '612 345 678',
        ];
        const falLeakBody =
          'Upstream error echoing Key fal_secret_12345 Bearer sk_live_SECRET_999 contact ceo@productoraear.com +34 612 345 678';
        const zapLeakBody =
          'Upstream error echoing Bearer sk_live_SECRET_999 contact ceo@productoraear.com +34 612 345 678';
        const gwsLeakBody =
          'Upstream error echoing Bearer gws_access_SECRET_555 gws_csec_SECRET_777 gws_rtok_SECRET_888 contact ceo@productoraear.com +34 612 345 678';

        const { captured, result } = await captureConsole(async () => {
          let r1;
          await withMockFetch(
            async () => new Response(falLeakBody, { status: 500 }),
            async () => {
              r1 = await klingExec(
                {
                  provider: 'fal',
                  operation: 'image-to-video',
                  imageUrl: 'https://www.ezkertzaberria.com/images/fachada.jpg',
                  prompt: 'Aerial view of Derio caserio',
                  humanApproved: true,
                },
                { env: { FAL_KEY: 'fal_secret_12345' } },
              );
            },
          );
          assertAdapterEnvelope(r1, { ok: false, mode: 'ERROR', statusCode: 502 });

          let r2;
          await withMockFetch(
            async () => {
              throw new Error(falLeakBody);
            },
            async () => {
              r2 = await klingExec(
                {
                  provider: 'fal',
                  operation: 'image-to-video',
                  imageUrl: 'https://www.ezkertzaberria.com/images/fachada.jpg',
                  prompt: 'Aerial view of Derio caserio',
                  humanApproved: true,
                },
                { env: { FAL_KEY: 'fal_secret_12345' } },
              );
            },
          );
          assertAdapterEnvelope(r2, { ok: false, mode: 'ERROR', statusCode: 502 });

          let r3;
          await withMockFetch(
            async () => new Response(zapLeakBody, { status: 502 }),
            async () => {
              r3 = await zapierExec(
                {
                  toolName: 'ping',
                  actionCategory: 'read_only',
                  arguments: { q: 'derio' },
                },
                { env: { ZAPIER_MCP_URL: 'https://mcp.zapier.com/api/v1/connect', ZAPIER_MCP_TOKEN: 'sk_live_SECRET_999' } },
              );
            },
          );
          assertAdapterEnvelope(r3, { ok: false, mode: 'ERROR', statusCode: 502 });

          let r4;
          await withMockFetch(
            async () => {
              throw new Error(zapLeakBody);
            },
            async () => {
              r4 = await zapierExec(
                {
                  toolName: 'ping',
                  actionCategory: 'read_only',
                  arguments: { q: 'derio' },
                },
                { env: { ZAPIER_MCP_URL: 'https://mcp.zapier.com/api/v1/connect', ZAPIER_MCP_TOKEN: 'sk_live_SECRET_999' } },
              );
            },
          );
          assertAdapterEnvelope(r4, { ok: false, mode: 'ERROR', statusCode: 502 });

          const gwsEnv = {
            GOOGLE_WORKSPACE_CLIENT_ID: 'gws-cid',
            GOOGLE_WORKSPACE_CLIENT_SECRET: 'gws_csec_SECRET_777',
            GOOGLE_WORKSPACE_REFRESH_TOKEN: 'gws_rtok_SECRET_888',
            GWS_ALLOWED_SCOPES: GWS_LEAST_PRIVILEGE_SCOPES.join(','),
          };
          let r5;
          await withMockFetch(
            async (url) => {
              const target = typeof url === 'string' ? url : url.url;
              if (target.includes('oauth2.googleapis.com/token')) {
                return new Response(
                  JSON.stringify({ access_token: 'gws_access_SECRET_555', expires_in: 3600 }),
                  { status: 200, headers: { 'content-type': 'application/json' } },
                );
              }
              return new Response(gwsLeakBody, { status: 500 });
            },
            async () => {
              r5 = await gwsExec(
                { action: 'gmail.messages.list', scopes: ['gmail.readonly'], transportPreference: 'oauth_rest' },
                { env: gwsEnv },
              );
            },
          );
          assertAdapterEnvelope(r5, { ok: false, mode: 'ERROR', statusCode: 502 });

          return [r1, r2, r3, r4, r5];
        });

        assertNoPiiOrSecrets(captured, forbidden, 'INV-14 console log leak');
        assertNoSecretsOrPii(JSON.stringify(result), forbidden, 'INV-14 envelope leak');
      },
    ),
  );

  results.push(
    await runCase(
      'T2-R3-05',
      'T2',
      'R3',
      '/api/integrations/readiness Auth Enforcement, Strict Query, Method & Prototype Pollution Boundary',
      async () => {
        const cronSecret = 'test-cron-secret-32-chars-minimum-12345';

        // (a) Unauthenticated GET with CRON_SECRET set -> 401; (b) Authenticated GET, polluted query -> 400 + no proto pollution, POST -> 405
        const authScript = `
          import { GET, POST } from './src/app/api/integrations/readiness/route.ts';
          (async () => {
            const unauth = await GET(new Request('http://127.0.0.1:3007/api/integrations/readiness', {
              headers: { 'x-forwarded-for': '10.10.0.1' },
            }) as any);
            const authOk = await GET(new Request('http://127.0.0.1:3007/api/integrations/readiness', {
              headers: { authorization: 'Bearer ${cronSecret}', 'x-forwarded-for': '10.10.0.2' },
            }) as any);
            const authOkText = await authOk.text();
            const polluted = await GET(new Request('http://127.0.0.1:3007/api/integrations/readiness?verbose=true&__proto__=polluted', {
              headers: { 'x-cron-secret': '${cronSecret}', 'x-forwarded-for': '10.10.0.3' },
            }) as any);
            const pollutedText = await polluted.text();
            const postRes = await POST(new Request('http://127.0.0.1:3007/api/integrations/readiness', {
              method: 'POST',
              body: '{invalid-json',
              headers: { 'content-type': 'application/json', 'x-forwarded-for': '10.10.0.4' },
            }) as any);
            console.log(JSON.stringify({
              unauthStatus: unauth.status,
              authOkStatus: authOk.status,
              authOkText,
              pollutedStatus: polluted.status,
              pollutedText,
              protoPolluted: ({}).polluted === undefined ? false : true,
              postStatus: postRes.status,
            }));
          })().catch((err) => { console.error(err); process.exit(1); });
        `;
        const runAuth = runTsInline(authScript, {
          env: { CRON_SECRET: cronSecret, NODE_ENV: 'test' },
        });
        assertEqual(runAuth.status, 0, `readiness auth inline failed: ${runAuth.stderr || runAuth.stdout}`);
        const a = JSON.parse(runAuth.stdout.trim().split(/\r?\n/).pop());
        assertEqual(a.unauthStatus, 401, 'Unauthenticated GET with CRON_SECRET set must return 401');
        assertEqual(a.authOkStatus, 200, 'Authenticated GET with CRON_SECRET must return 200');
        assert(!a.authOkText.includes(cronSecret), 'Authenticated readiness leaked CRON_SECRET');
        assert(!/Bearer\s+[A-Za-z0-9_\-.]+|sk_live_/i.test(a.authOkText), 'readiness exposed raw secret');
        assertEqual(a.pollutedStatus, 400, 'Unknown/polluted query (?verbose=true&__proto__=polluted) must return strict 400');
        assertEqual(a.protoPolluted, false, 'Object.prototype.polluted must remain undefined');
        assert(!a.pollutedText.includes(cronSecret), 'Polluted error leaked CRON_SECRET');
        assertEqual(a.postStatus, 405, 'Unsupported POST method must return 405');

        // (c) Unauthenticated GET with NODE_ENV='production' and NO CRON_SECRET -> 503
        const prodScript = `
          import { GET } from './src/app/api/integrations/readiness/route.ts';
          (async () => {
            const res = await GET(new Request('http://127.0.0.1:3007/api/integrations/readiness', {
              headers: { 'x-forwarded-for': '10.10.0.5' },
            }) as any);
            console.log(JSON.stringify({ status: res.status }));
          })().catch((err) => { console.error(err); process.exit(1); });
        `;
        const runProd = runTsInline(prodScript, {
          env: { NODE_ENV: 'production' },
        });
        assertEqual(runProd.status, 0, `readiness prod fail-closed inline failed: ${runProd.stderr || runProd.stdout}`);
        const p = JSON.parse(runProd.stdout.trim().split(/\r?\n/).pop());
        assertEqual(p.status, 503, 'Unauthenticated GET in NODE_ENV=production without CRON_SECRET must fail closed with 503');
      },
    ),
  );

  results.push(
    await runCase(
      'T2-R3-06',
      'T2',
      'R3',
      'AbortSignal.timeout(8000) / Upstream Failure Handling',
      async () => {
        const files = walkFiles('src/lib/integrations', new Set(['.ts']));
        assert(files.length > 0, 'No files found under src/lib/integrations/');
        const combined = files.map((f) => readText(f).content).join('\n');
        assert(
          /ADAPTER_TIMEOUT_MS\s*=\s*8_?000/.test(combined) &&
            /AbortSignal\.timeout\s*\(\s*(?:8_?000|timeoutMs)\s*\)/.test(combined),
          'src/lib/integrations must enforce AbortSignal.timeout(8000)',
        );

        const klingImp = await tryImportTs('src/lib/integrations/kling-fal-adapter.ts');
        assert(klingImp.ok, 'Missing kling-fal-adapter.ts');
        const klingExec = findExportedFn(klingImp.mod, ['submitKlingFalVideoJob'], /submitKling/i, 'submitKlingFalVideoJob');
        const env = { FAL_KEY: 'test-fal' };
        const payload = {
          provider: 'fal',
          operation: 'image-to-video',
          imageUrl: 'https://www.ezkertzaberria.com/images/fachada.jpg',
          prompt: 'Derio caserio aerial shot',
          humanApproved: true,
        };

        // 1. Upstream HTTP 500
        await withMockFetch(
          async () => new Response('Internal Server Error', { status: 500 }),
          async () => {
            const res = await klingExec(payload, { env });
            assertAdapterEnvelope(res, { ok: false, mode: 'ERROR' });
            assert(res.statusCode === 502 || res.statusCode === 503, `Expected 502/503, got ${res.statusCode}`);
          },
        );

        // 2. Invalid JSON upstream
        await withMockFetch(
          async () => new Response('not-json{{{', { status: 200, headers: { 'content-type': 'application/json' } }),
          async () => {
            const res = await klingExec(payload, { env });
            assertAdapterEnvelope(res, { ok: false, mode: 'ERROR' });
          },
        );

        // 3. AbortError timeout
        await withMockFetch(
          async () => {
            const err = new Error('The operation was aborted due to timeout');
            err.name = 'TimeoutError';
            throw err;
          },
          async () => {
            const res = await klingExec(payload, { env });
            assertAdapterEnvelope(res, { ok: false, mode: 'ERROR' });
          },
        );
      },
    ),
  );

  // ── R4 Boundaries (5) ──

  results.push(
    await runCase(
      'T2-R4-01',
      'T2',
      'R4',
      'Edwin Agudelo (e78903) 350 EUR Floor Boundary',
      async () => {
        const res = runCmd('npm', ['run', 'verify:solista-pricing'], {
          timeoutMs: 60_000,
          cacheKey: 'verify_solista_pricing',
        });
        assertEqual(res.status, 0, `verify:solista-pricing failed: ${res.stderr || res.stdout}`);
        const imp = await tryImportTs('src/lib/constants/ear-os-ssot.ts');
        assert(imp.ok, 'Cannot import ear-os-ssot.ts');
        assertEqual(imp.mod.TARIFA_BASE_SOLISTA_EUR, 350, 'Solista base floor must be 350 EUR');
        assertEqual(imp.mod.TARIFA_ESTANDAR_SOLISTA_EUR, 550, 'Solista standard rate must be 550 EUR');
      },
    ),
  );

  results.push(
    await runCase(
      'T2-R4-02',
      'T2',
      'R4',
      'B2G 14.250 EUR / 15.000 EUR / 1.000.000 EUR Ceiling Boundaries',
      async () => {
        const imp = await tryImportTs('src/lib/constants/ear-os-ssot.ts');
        assert(imp.ok, 'Cannot import ear-os-ssot.ts');
        assertEqual(imp.mod.SAFE_LCSP_CEILING_EUR, 14250, 'SAFE_LCSP_CEILING_EUR');
        assertEqual(imp.mod.LIMITE_B2G_LCSP_EUR, 15000, 'LIMITE_B2G_LCSP_EUR');
        assertEqual(imp.mod.MAX_TOTAL_ESTIMADO_EUR, 1000000, 'MAX_TOTAL_ESTIMADO_EUR');
        assertEqual(
          imp.mod.SAFE_LCSP_CEILING_EUR,
          imp.mod.LIMITE_B2G_LCSP_EUR * 0.95,
          'Preventive ceiling must be 95% of 15.000 EUR',
        );

        const b2g = runCmd('npm', ['run', 'verify:b2g-fast-track'], {
          timeoutMs: 60_000,
          cacheKey: 'verify_b2g_fast_track',
        });
        assertEqual(b2g.status, 0, `verify:b2g-fast-track failed: ${b2g.stderr || b2g.stdout}`);

        const budget = runCmd('npm', ['run', 'verify:budget'], {
          timeoutMs: 60_000,
          cacheKey: 'verify_budget',
        });
        assertEqual(budget.status, 0, `verify:budget failed: ${budget.stderr || budget.stdout}`);
      },
    ),
  );

  results.push(
    await runCase(
      'T2-R4-03',
      'T2',
      'R4',
      'EAR_OS_SSOT Runtime Immutability (Object.freeze) & Split Arithmetic',
      async () => {
        const script = `
          'use strict';
          import { EAR_OS_SSOT, SPLIT_SOBERANO } from './src/lib/constants/ear-os-ssot.ts';
          let threw = false;
          try {
            (EAR_OS_SSOT as any).TARIFA_BASE_SOLISTA_EUR = 1;
          } catch (e) {
            threw = e instanceof TypeError;
          }
          const sum = SPLIT_SOBERANO.artista + SPLIT_SOBERANO.earOs + SPLIT_SOBERANO.vimume;
          console.log(JSON.stringify({
            ssotFrozen: Object.isFrozen(EAR_OS_SSOT),
            splitFrozen: Object.isFrozen(SPLIT_SOBERANO),
            threw,
            sumOk: Math.abs(sum - 1) <= 1e-4,
          }));
        `;
        const run = runTsInline(script);
        assertEqual(run.status, 0, `SSOT freeze check failed: ${run.stderr || run.stdout}`);
        const parsed = JSON.parse(run.stdout.trim().split(/\r?\n/).pop());
        assertEqual(parsed.ssotFrozen, true, 'EAR_OS_SSOT frozen');
        assertEqual(parsed.splitFrozen, true, 'SPLIT_SOBERANO frozen');
        assertEqual(parsed.threw, true, 'Mutating EAR_OS_SSOT must throw TypeError');
        assertEqual(parsed.sumOk, true, 'SPLIT_SOBERANO sum must equal 1.0');
      },
    ),
  );

  results.push(
    await runCase(
      'T2-R4-04',
      'T2',
      'R4',
      'INV-07 / SEC-3 Zero Client-Bundle Secret Exposure',
      async () => {
        const envEx = readText('.env.example');
        assert(envEx.exists, 'Missing .env.example');
        const envActiveLines = envEx.content
          .split(/\r?\n/)
          .filter((line) => !/^\s*#/.test(line))
          .join('\n');
        assert(
          !/(NEXT_PUBLIC_|VITE_)(GWS|ZAPIER|FAL|KLING)_[A-Z0-9_]+/i.test(envActiveLines),
          '.env.example exposes integration secret with NEXT_PUBLIC_ or VITE_ prefix',
        );

        const allSrcFiles = walkFiles('src', new Set(['.ts', '.tsx']));
        assert(allSrcFiles.length > 0, 'No TypeScript files found under src/');
        for (const f of allSrcFiles) {
          const cleaned = stripCodeComments(readText(f).content).trimStart();
          if (/^['"]use client['"]/.test(cleaned)) {
            assert(
              !/(?:from\s*|import\s*(?:\(\s*)?|require\s*\(\s*)['"][^'"]*(?:@\/lib\/integrations\/|(?:(?:\.\.?\/)+)(?:lib\/)?integrations\/|src\/lib\/integrations\/)/.test(
                cleaned,
              ),
              `Client component ${f} imports server-only integrations module`,
            );
            assert(
              !/process\.env\.(?:NEXT_PUBLIC_|VITE_)(?:GWS|ZAPIER|FAL|KLING)_/.test(cleaned),
              `Client component ${f} references client-exposed integration env var`,
            );
          }
        }

        const integrationFiles = walkFiles('src/lib/integrations', new Set(['.ts', '.tsx']));
        assert(integrationFiles.length > 0, 'Missing src/lib/integrations/*.ts');
        for (const f of integrationFiles) {
          const text = stripCodeComments(readText(f).content);
          assert(
            !/(NEXT_PUBLIC_|VITE_)(GWS|ZAPIER|FAL|KLING)_/.test(text),
            `${f} references client-exposed secret prefix`,
          );
        }

        const pubAudit = runCmd('npm', ['run', 'audit:public-secrets'], {
          timeoutMs: 60_000,
          cacheKey: 'audit_public_secrets',
        });
        assertEqual(
          pubAudit.status,
          0,
          `npm run audit:public-secrets failed: ${pubAudit.stdout || pubAudit.stderr}`,
        );
      },
    ),
  );

  results.push(
    await runCase(
      'T2-R4-05',
      'T2',
      'R4',
      'Zero Foreign Package Manager Lockfiles (pnpm/yarn/bun)',
      async () => {
        for (const lock of ['pnpm-lock.yaml', 'yarn.lock', 'bun.lock', 'bun.lockb']) {
          assert(!fileExists(lock), `Forbidden foreign lockfile exists: ${lock}`);
        }
        const pkg = readJson('package.json');
        assert(pkg.exists && pkg.data, 'Cannot read package.json');
        const pm = String(pkg.data.packageManager || '');
        assert(!/\b(pnpm|yarn|bun)\b/i.test(pm), `Forbidden packageManager in package.json: ${pm}`);
        const scriptsStr = JSON.stringify(pkg.data.scripts || {});
        assert(!/\b(pnpm|yarn|bun)\b/i.test(scriptsStr), 'package.json scripts reference pnpm/yarn/bun');
      },
    ),
  );

  // ── R5 Boundaries (7) ──

  results.push(
    await runCase(
      'T2-R5-01',
      'T2',
      'R5',
      'Negative Territorial Purge Across ALL Main Otzarreta Surfaces & Master Plan',
      async () => {
        const surfaces = [
          'src/lib/constants/otzarreta-entity.ts',
          'src/lib/constants/ezkertza-derio-venue.ts',
          'src/lib/constants/ezkertza-storytelling-chapters.ts',
          'src/lib/seo/otzarreta-126-cluster-engine.ts',
          'src/lib/seo/otzarreta-dominance-engine.ts',
          'src/app/(public)/fincas/restaurante-eduardo-martinez/page.tsx',
          'src/app/(public)/bodas/guipuzcoa/restaurante-otzarreta/page.tsx',
          'src/app/(public)/checkout/presupuesto/page.tsx',
          'src/app/(public)/proveedores/page.tsx',
          'src/components/checkout/SovereignCollectiveEventBuilder.tsx',
          'src/components/providers/ProviderUniversalCockpit.tsx',
          'src/components/providers/VendorClaimProposalCard.tsx',
          'src/lib/analytics/venue-showcase-telemetry.ts',
          'src/lib/fincas/fincaMenus2026Catalog.ts',
          'src/lib/agents/pageContext.ts',
          'src/app/api/profiles/search/route.ts',
          ...walkFiles('src/app/(public)/otzarreta', new Set(['.ts', '.tsx'])),
          ...walkFiles('src/components/otzarreta', new Set(['.ts', '.tsx'])),
        ];
        const hits = [];
        for (const rel of surfaces) {
          const file = readText(rel);
          assert(file.exists, `Missing R5 surface: ${rel}`);
          const cleaned = stripCodeComments(file.content);
          const m = cleaned.match(FORBIDDEN_OTZARRETA_TOKENS_RE);
          if (m) {
            hits.push(`${rel} -> "${m[0]}"`);
          }
        }
        const plan = readText(MASTER_PLAN_PATH);
        assert(plan.exists, `Missing Master Plan: ${MASTER_PLAN_PATH}`);
        const planClean = stripOtzarretaPurgeClauses(plan.content);
        const planMatch = planClean.match(FORBIDDEN_OTZARRETA_TOKENS_RE);
        if (planMatch) {
          hits.push(`${MASTER_PLAN_PATH} -> "${planMatch[0]}"`);
        }
        assertEqual(hits.length, 0, `Zarautz/Gipuzkoa/Zizurkil tokens remain in: ${hits.join('; ')}`);
      },
    ),
  );

  results.push(
    await runCase(
      'T2-R5-02',
      'T2',
      'R5',
      'Legacy /bodas/guipuzcoa/restaurante-otzarreta Route Neutralization',
      async () => {
        const rel = 'src/app/(public)/bodas/guipuzcoa/restaurante-otzarreta/page.tsx';
        const file = readText(rel);
        assert(file.exists, `Missing route file: ${rel}`);
        const cleaned = stripCodeComments(file.content);
        const redirectsToOtzarreta =
          /(?:permanentRedirect|redirect)\s*\(\s*['"]\/otzarreta['"]\s*\)/.test(cleaned) &&
          !/if\s*\(\s*false\s*\)/.test(cleaned);
        const hasConflation = FORBIDDEN_OTZARRETA_TOKENS_RE.test(cleaned);
        assert(
          redirectsToOtzarreta && !hasConflation,
          'Legacy /bodas/guipuzcoa/restaurante-otzarreta must unconditionally redirect to /otzarreta and contain zero Zarautz/Gipuzkoa/Zizurkil tokens',
        );
      },
    ),
  );

  results.push(
    await runCase(
      'T2-R5-03',
      'T2',
      'R5',
      '/otzarreta/[slug] Valid Derio/Uribe Kosta vs Zarautz/Invalid Slug Boundary',
      async () => {
        const pageImp = await tryImportTs('src/app/(public)/otzarreta/[slug]/page.tsx');
        const c126Imp = await tryImportTs('src/lib/seo/otzarreta-126-cluster-engine.ts');
        const domImp = await tryImportTs('src/lib/seo/otzarreta-dominance-engine.ts');
        assert(pageImp.ok, pageImp.error?.message || 'Cannot import /otzarreta/[slug]/page.tsx');
        assert(c126Imp.ok && domImp.ok, 'Cannot import Otzarreta SEO engines');

        const params = await pageImp.mod.generateStaticParams();
        assert(Array.isArray(params) && params.length > 0, 'generateStaticParams() returned empty');
        const slugs = new Set(params.map((p) => p.slug));

        assert(slugs.has('bodas-caserio-derio'), 'Missing bodas-caserio-derio in generateStaticParams()');
        const uribeSlug = [...slugs].find((s) => /uribe-kosta/i.test(s));
        assert(uribeSlug, 'Missing Uribe Kosta slug in /otzarreta/[slug] generateStaticParams()');
        assert(!slugs.has('bodas-gala-zarautz'), 'zarautz slug still present in generateStaticParams()');
        assert(!slugs.has('nonexistent-slug-999'), 'nonexistent slug unexpectedly present');

        const resolveAny = (slug) =>
          (c126Imp.mod.getOtzarreta126Landing?.(slug) ?? null) ||
          (domImp.mod.getOtzarretaLanding?.(slug) ?? null);

        assert(resolveAny('bodas-caserio-derio') !== null, 'bodas-caserio-derio resolved to null');
        assert(resolveAny(uribeSlug) !== null, `${uribeSlug} resolved to null`);
        assertEqual(resolveAny('bodas-gala-zarautz'), null, 'zarautz slug must resolve to null');
        assertEqual(resolveAny('nonexistent-slug-999'), null, 'unknown slug must resolve to null');
      },
    ),
  );

  results.push(
    await runCase(
      'T2-R5-04',
      'T2',
      'R5',
      '/api/profiles/search Province & Query Filter Boundary',
      async () => {
        for (const qs of ['q=otzarreta&province=Bizkaia', 'q=eduardo+martinez', 'q=ezkertza']) {
          const res = await invokeRoute('src/app/api/profiles/search/route.ts', 'GET', {
            url: `http://127.0.0.1:3007/api/profiles/search?${qs}`,
          });
          assert(res.ok && res.status === 200, `Search failed for ${qs}`);
          const items = (res.json?.providers || res.json?.items || []).filter((p) =>
            /otzarreta|ezkertza|eduardo martinez/i.test(JSON.stringify(p)),
          );
          assert(items.length > 0, `Expected Otzarreta/Ezkertza record for ${qs}`);
          for (const item of items) {
            assertEqual(item.municipality, 'Derio', `${qs} municipality`);
            assert(!FORBIDDEN_OTZARRETA_TOKENS_RE.test(JSON.stringify(item)), `${qs} leaked Zarautz/Gipuzkoa`);
          }
        }

        const gipRes = await invokeRoute('src/app/api/profiles/search/route.ts', 'GET', {
          url: 'http://127.0.0.1:3007/api/profiles/search?q=otzarreta&province=Gipuzkoa',
        });
        assert(gipRes.ok && gipRes.status === 200, 'Search Gipuzkoa filter failed');
        const gipItems = (gipRes.json?.providers || gipRes.json?.items || []).filter((p) =>
          /otzarreta|ezkertza|eduardo martinez/i.test(JSON.stringify(p)),
        );
        assertEqual(gipItems.length, 0, 'q=otzarreta&province=Gipuzkoa must return 0 Otzarreta records');
      },
    ),
  );

  results.push(
    await runCase(
      'T2-R5-05',
      'T2',
      'R5',
      'pageContext.ts Normalization, SSRF Guard & Anti-Picaresca Phone Boundary',
      async () => {
        const imp = await tryImportTs('src/lib/agents/pageContext.ts');
        assert(imp.ok, imp.error?.message || 'Cannot import pageContext.ts');

        let fetchAttempted = false;
        await withMockFetch(
          async () => {
            fetchAttempted = true;
            throw new Error('resolvePageContext must NEVER fetch URLs');
          },
          async () => {
            const ctxA = imp.mod.resolvePageContext({
              pathname: 'https://www.productoraear.com/otzarreta?fbclid=123#menu',
            });
            assertEqual(ctxA.municipality, 'Derio', 'ctxA.municipality');
            assertEqual(ctxA.province, 'Bizkaia', 'ctxA.province');

            const ctxB = imp.mod.resolvePageContext({
              pathname: '/fincas/restaurante-eduardo-martinez',
            });
            assertEqual(ctxB.municipality, 'Derio', 'ctxB.municipality');
            assertEqual(ctxB.province, 'Bizkaia', 'ctxB.province');

            const ctxC = imp.mod.resolvePageContext({
              pathname: 'http://169.254.169.254/otzarreta',
            });
            assertEqual(ctxC.pathname, '/otzarreta', 'SSRF URL must strip host to pathname only');

            const ctxD = imp.mod.resolvePageContext({
              pathname: '/otzarreta/unknown-xyz',
            });

            const ctxE = imp.mod.resolvePageContext({
              message: 'otzarreta zarautz',
            });
            assertEqual(ctxE.municipality, 'Derio', 'ctxE.municipality (message: otzarreta zarautz)');
            assertEqual(ctxE.province, 'Bizkaia', 'ctxE.province');

            const ctxF = imp.mod.resolvePageContext({
              pathname: '/bodas/guipuzcoa/restaurante-otzarreta',
            });
            assertEqual(ctxF.municipality, 'Derio', 'ctxF.municipality (legacy guipuzcoa route)');
            assertEqual(ctxF.province, 'Bizkaia', 'ctxF.province');

            const ctxG = imp.mod.resolvePageContext({
              pathname: '/otzarreta/bodas-gala-zarautz',
            });
            assertEqual(ctxG.municipality, 'Derio', 'ctxG.municipality (legacy zarautz slug)');
            assertEqual(ctxG.province, 'Bizkaia', 'ctxG.province');

            for (const ctx of [ctxA, ctxB, ctxC, ctxD, ctxE, ctxF, ctxG]) {
              const txt = `${ctx.facts.join('\n')}\n${ctx.guidance}`;
              assert(!FORBIDDEN_OTZARRETA_TOKENS_RE.test(txt), 'pageContext leaked Zarautz/Gipuzkoa');
              assert(
                !/943\s*131\s*243|944\s*\d{3}\s*\d{3}|688\s*\d{3}\s*\d{3}|619\s*455\s*396/.test(txt),
                'Anti-picaresca venue phone leaked in pageContext',
              );
            }
          },
        );
        assert(!fetchAttempted, 'resolvePageContext attempted outbound fetch');
      },
    ),
  );

  results.push(
    await runCase(
      'T2-R5-06',
      'T2',
      'R5',
      'Otzarreta Manifest & Anti-Cannibalization Threshold Boundary',
      async () => {
        const audit = runCmd(process.execPath, ['scripts/audit_otzarreta_landings.cjs'], {
          timeoutMs: 60_000,
          cacheKey: 'audit_otzarreta_landings',
        });
        assertEqual(audit.status, 0, `audit_otzarreta_landings.cjs failed: ${audit.stderr}`);

        const manifest = readJson('public/landings/otzarreta/manifest.json');
        assert(manifest.exists && manifest.data, 'Missing or malformed public/landings/otzarreta/manifest.json');
        assertEqual(manifest.data.depositEur, 100, 'manifest depositEur');
        const entries =
          manifest.data.payload ||
          manifest.data.landings ||
          manifest.data.entries ||
          manifest.data.items ||
          [];
        assert(Array.isArray(entries) && entries.length > 0, 'manifest must contain non-empty landings array');

        const slugs = new Set();
        const titles = new Set();
        const h1s = new Set();
        for (const entry of entries) {
          assert(entry.slug && !slugs.has(entry.slug), `Duplicate/missing slug: ${entry.slug}`);
          assert(entry.title && !titles.has(entry.title), `Duplicate/missing title: ${entry.title}`);
          assert(entry.h1 && !h1s.has(entry.h1), `Duplicate/missing h1: ${entry.h1}`);
          slugs.add(entry.slug);
          titles.add(entry.title);
          h1s.add(entry.h1);
        }
        assert(
          !FORBIDDEN_OTZARRETA_TOKENS_RE.test(manifest.content),
          'manifest.json still contains Zarautz/Gipuzkoa/Zizurkil tokens',
        );
      },
    ),
  );

  results.push(
    await runCase(
      'T2-R5-07',
      'T2',
      'R5',
      'Data Lake / editor_mutations.json Stale Override Prevention',
      async () => {
        if (fileExists('src/data/editor_mutations.json')) {
          const mut = readJson('src/data/editor_mutations.json');
          assert(mut.exists && mut.data && typeof mut.data === 'object', mut.error || 'Malformed editor_mutations.json');
          for (const [routeKey, entry] of Object.entries(mut.data)) {
            const entryJson = JSON.stringify(entry);
            if (/otzarreta|ezkertza|eduardo-martinez/i.test(routeKey) || /otzarreta|ezkertza|eduardo-martinez/i.test(entryJson)) {
              assert(
                !FORBIDDEN_OTZARRETA_TOKENS_RE.test(entryJson),
                `editor_mutations.json has stale Zarautz/Gipuzkoa/Zizurkil override under "${routeKey}": ${entryJson.slice(0, 180)}`,
              );
            }
          }
        }
        const searchRes = await invokeRoute('src/app/api/profiles/search/route.ts', 'GET', {
          url: 'http://127.0.0.1:3007/api/profiles/search?q=otzarreta',
        });
        assert(searchRes.ok && searchRes.status === 200, 'profiles/search failed');
        const otz = (searchRes.json?.providers || searchRes.json?.items || []).filter((p) =>
          /otzarreta/i.test(JSON.stringify(p)),
        );
        assert(otz.length > 0, 'No Otzarreta returned by profiles/search');
        for (const rec of otz) {
          assertEqual(rec.municipality, 'Derio', 'Canonical override municipality');
          assert(!FORBIDDEN_OTZARRETA_TOKENS_RE.test(JSON.stringify(rec)), 'Stale override leaked Zarautz');
        }
      },
    ),
  );

  return results;
}
