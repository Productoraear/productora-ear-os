/**
 * ════════════════════════════════════════════════════════════════════════════
 * TIER 3 — CROSS-FEATURE PAIRWISE COMBINATIONS (7 TESTS)
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  FORBIDDEN_OTZARRETA_TOKENS_RE,
  GWS_LEAST_PRIVILEGE_SCOPES,
  assert,
  assertAdapterEnvelope,
  assertEqual,
  assertHitlDecision,
  assertIncludes,
  assertMatch,
  assertNoSecretsOrPii,
  captureConsole,
  findExportedFn,
  invokeRoute,
  normText,
  readJson,
  readText,
  runCase,
  runCmd,
  runTsInline,
  stripCodeComments,
  tryImportTs,
  withMockFetch,
} from './helpers.mjs';

const MASTER_PLAN_PATH = 'docs/specs/PLAN_MAESTRO_16_CAPACIDADES_DOMINO_EAR_OS.md';

export async function runTier3() {
  const results = [];

  results.push(
    await runCase(
      'T3-01',
      'T3',
      'R2xR3xR4',
      'GWS Adapter + HITL Gate + ear-os-ssot Thresholds',
      async () => {
        const ssotImp = await tryImportTs('src/lib/constants/ear-os-ssot.ts');
        const contractImp = await tryImportTs('src/lib/integrations/adapter-contract.ts');
        const gwsImp = await tryImportTs('src/lib/integrations/gws-adapter.ts');
        assert(ssotImp.ok, 'Cannot import ear-os-ssot.ts');
        assert(contractImp.ok, 'Missing adapter-contract.ts');
        assert(gwsImp.ok, 'Missing gws-adapter.ts');

        const hitl = findExportedFn(
          contractImp.mod,
          ['evaluateHitlPolicyGate', 'evaluateHitlGate', 'validateHitlGate'],
          /evaluate.*hitl/i,
          'evaluateHitlPolicyGate',
        );
        const gwsExec = findExportedFn(gwsImp.mod, ['executeGwsAction'], /execute/i, 'executeGwsAction');

        const validEnv = {
          GOOGLE_WORKSPACE_CLIENT_ID: 'cid',
          GOOGLE_WORKSPACE_CLIENT_SECRET: 'csec',
          GOOGLE_WORKSPACE_REFRESH_TOKEN: 'rtok',
          GWS_ALLOWED_SCOPES: GWS_LEAST_PRIVILEGE_SCOPES.join(','),
        };

        // (a) B2G tender above 5000 EUR and 14250 EUR ceiling
        const b2gAmount = ssotImp.mod.SAFE_LCSP_CEILING_EUR + 0.01;
        assertHitlDecision(
          hitl({ actionKind: 'b2g_contract', amountEur: b2gAmount }),
          { allowed: false, tier: '5_HITL_TOTAL' },
        );
        const envA = await gwsExec(
          {
            action: 'docs.b2g_contract_export',
            scopes: ['documents'],
            estimatedAmountEur: b2gAmount,
            hitlApproved: false,
          },
          { env: validEnv },
        );
        assertAdapterEnvelope(envA, { ok: false, mode: 'HITL_BLOCKED', statusCode: 403 });

        // (b) Stripe Price-Lock 100 EUR / mutating external send (25_REVIEW)
        const deposit = ssotImp.mod.DEPOSITO_STRIPE_EUR;
        assertHitlDecision(
          hitl({ actionKind: 'stripe_price_lock', amountEur: deposit }),
          { allowed: false, tier: '25_REVIEW' },
        );
        const envB = await gwsExec(
          {
            action: 'gmail.drafts.send',
            scopes: ['gmail.compose'],
            estimatedAmountEur: deposit,
            hitlApproved: false,
          },
          { env: validEnv },
        );
        assertAdapterEnvelope(envB, { ok: false, mode: 'HITL_BLOCKED', statusCode: 403 });

        // (c) Catalog FAQ / read_only (90_AUTO)
        assertHitlDecision(
          hitl({ actionKind: 'read_only' }),
          { allowed: true, tier: '90_AUTO' },
        );
      },
    ),
  );

  results.push(
    await runCase(
      'T3-02',
      'T3',
      'R1xR3xR4',
      'Zapier MCP + INV-14 PII Redaction + Registry Non-Blocking',
      async () => {
        const regImp = await tryImportTs('src/lib/integrations/capabilities-registry.ts');
        const zapImp = await tryImportTs('src/lib/integrations/zapier-mcp-adapter.ts');
        assert(regImp.ok, 'Missing capabilities-registry.ts');
        assert(zapImp.ok, 'Missing zapier-mcp-adapter.ts');

        const getRegistry = findExportedFn(
          regImp.mod,
          ['getCapabilitiesRegistrySnapshot', 'getCapabilitiesReadiness'],
          /(snapshot|readiness|capabilit)/i,
          'capabilities registry getter',
        );
        const report = await getRegistry({ env: {} });
        const reportStr = JSON.stringify(report).toLowerCase();
        assertIncludes(reportStr, 'zapier', 'Registry report zapier entry');
        assertIncludes(reportStr, 'unconfigured', 'Registry report UNCONFIGURED status');
        for (const local of ['ponytail', 'graphify', 'grill']) {
          assert(reportStr.includes(local), `Registry report missing local capability ${local}`);
        }

        const zapExec = findExportedFn(zapImp.mod, ['callZapierMcpTool'], /callZapier/i, 'callZapierMcpTool');
        const forbidden = ['edu@example.com', 'ceo@productoraear.com', 'sk_live_SECRET_999', 'zap_tok_SECRET_456', '612 345 678'];
        const leakPayload =
          'Upstream 500: Bearer sk_live_SECRET_999 Key zap_tok_SECRET_456 edu@example.com ceo@productoraear.com +34 612 345 678';
        const validZapEnv = {
          ZAPIER_MCP_URL: 'https://mcp.zapier.com/api/v1/connect',
          ZAPIER_MCP_TOKEN: 'zap_tok_SECRET_456',
        };
        const { captured, result } = await captureConsole(async () => {
          let rHttp;
          await withMockFetch(
            async () => new Response(leakPayload, { status: 500 }),
            async () => {
              rHttp = await zapExec(
                {
                  toolName: 'ping',
                  actionCategory: 'read_only',
                  arguments: { q: 'derio' },
                },
                { env: validZapEnv },
              );
            },
          );
          assertAdapterEnvelope(rHttp, { ok: false, mode: 'ERROR', statusCode: 502 });

          let rErr;
          await withMockFetch(
            async () => {
              throw new Error(leakPayload);
            },
            async () => {
              rErr = await zapExec(
                {
                  toolName: 'ping',
                  actionCategory: 'read_only',
                  arguments: { q: 'derio' },
                },
                { env: validZapEnv },
              );
            },
          );
          assertAdapterEnvelope(rErr, { ok: false, mode: 'ERROR', statusCode: 502 });
          return [rHttp, rErr];
        });
        assertNoSecretsOrPii(captured, forbidden, 'T3-02 console PII/secret leak');
        assertNoSecretsOrPii(JSON.stringify(result), forbidden, 'T3-02 envelope PII/secret leak');
      },
    ),
  );

  results.push(
    await runCase(
      'T3-03',
      'T3',
      'R4xR5',
      'Otzarreta Derio Entity + sitemap.ts + Search API + pageContext + SSOT Parity',
      async () => {
        const entityImp = await tryImportTs('src/lib/constants/otzarreta-entity.ts');
        const sitemapImp = await tryImportTs('src/app/sitemap.ts');
        const ctxImp = await tryImportTs('src/lib/agents/pageContext.ts');
        const ssotImp = await tryImportTs('src/lib/constants/ear-os-ssot.ts');
        assert(entityImp.ok && sitemapImp.ok && ctxImp.ok && ssotImp.ok, 'Missing R4/R5 modules');

        const e = entityImp.mod.OTZARRETA_ENTITY;
        assertEqual(e.municipality, 'Derio', 'Entity municipality');
        assertEqual(e.province, 'Bizkaia', 'Entity province');
        assertEqual(e.capacityPax, 350, 'Entity capacityPax');
        assertMatch(e.streetAddress, /Santo Domingo Hiribidea,?\s*13/i, 'Entity street');

        const entries = await sitemapImp.mod.default();
        const otzUrls = entries.map((x) => x.url).filter((u) => /otzarreta|eduardo-martinez/i.test(u));
        assert(otzUrls.some((u) => /\/otzarreta\/?$/i.test(u)), 'Sitemap missing /otzarreta');
        assert(!otzUrls.some((u) => FORBIDDEN_OTZARRETA_TOKENS_RE.test(u)), 'Sitemap has Zarautz/Gipuzkoa/Zizurkil Otzarreta URL');

        const searchRes = await invokeRoute('src/app/api/profiles/search/route.ts', 'GET', {
          url: 'http://127.0.0.1:3007/api/profiles/search?q=otzarreta',
        });
        assert(searchRes.ok && searchRes.status === 200, 'Search API failed');
        const otzRec = (searchRes.json?.providers || searchRes.json?.items || []).find((p) =>
          /otzarreta/i.test(JSON.stringify(p)),
        );
        assert(otzRec, 'Search API missing Otzarreta');
        assertEqual(otzRec.municipality, 'Derio', 'Search API municipality');
        assertEqual(otzRec.capacidadMaxPax, 350, 'Search API capacity');

        const ctx = ctxImp.mod.resolvePageContext({ pathname: '/otzarreta' });
        assertEqual(ctx.municipality, 'Derio', 'pageContext municipality');
        assertEqual(ctx.province, 'Bizkaia', 'pageContext province');
        assert(!FORBIDDEN_OTZARRETA_TOKENS_RE.test(JSON.stringify(ctx)), 'pageContext has Zarautz/Gipuzkoa');

        assertEqual(ssotImp.mod.DEPOSITO_STRIPE_EUR, 100, 'SSOT deposit');
        assertEqual(ssotImp.mod.TARIFA_BASE_SOLISTA_EUR, 350, 'SSOT base solista');
      },
    ),
  );

  results.push(
    await runCase(
      'T3-04',
      'T3',
      'R1xR2xR4',
      'Graphify + Master Plan + 17-Gate Verification Pipeline',
      async () => {
        const graph = readJson('graphify-out/graph.json');
        assert(graph.exists && graph.data, 'Missing/invalid graphify-out/graph.json');
        const gq = runCmd('graphify', ['query', 'ear-os-ssot'], {
          timeoutMs: 30_000,
          cacheKey: 'graphify_query_ssot',
        });
        assertEqual(gq.status, 0, `graphify query "ear-os-ssot" exit code: ${gq.stderr}`);

        const plan = readText(MASTER_PLAN_PATH);
        assert(plan.exists, `Missing Master Plan: ${MASTER_PLAN_PATH}`);
        const norm = normText(plan.content);
        assert(norm.includes('graphify'), 'Master Plan must reference graphify');
        assert(
          plan.content.includes('run_sv_protocol_15_gates.cjs'),
          'Master Plan must reference run_sv_protocol_15_gates.cjs',
        );

        for (const [script, timeoutMs, cacheKey] of [
          ['audit:ssot', 60_000, 'audit_ssot'],
          ['typecheck', 240_000, 'typecheck'],
          ['lint', 240_000, 'lint'],
        ]) {
          const res = runCmd('npm', ['run', script], { timeoutMs, cacheKey });
          assertEqual(res.status, 0, `npm run ${script} failed`);
        }
      },
    ),
  );

  results.push(
    await runCase(
      'T3-05',
      'T3',
      'R3xR5',
      'kling-fal-adapter + Otzarreta Derio Assets HTTPS Validation',
      async () => {
        const entityImp = await tryImportTs('src/lib/constants/otzarreta-entity.ts');
        const klingImp = await tryImportTs('src/lib/integrations/kling-fal-adapter.ts');
        assert(entityImp.ok, 'Cannot import otzarreta-entity.ts');
        assert(klingImp.ok, 'Missing kling-fal-adapter.ts');

        const facadeUrl =
          entityImp.mod.OTZARRETA_ENTITY?.scrapedAssets?.facade ||
          'https://www.ezkertzaberria.com/images/fachada.jpg';
        assert(String(facadeUrl).startsWith('https://'), 'Canonical Otzarreta facade asset must be HTTPS');

        const submitFn = findExportedFn(klingImp.mod, ['submitKlingFalVideoJob'], /submitKling/i, 'submitKlingFalVideoJob');

        const validUnconf = await submitFn(
          {
            provider: 'fal',
            operation: 'image-to-video',
            imageUrl: facadeUrl,
            prompt: 'Caserio Otzarreta Derio garden drone pan',
          },
          { env: {} },
        );
        assertAdapterEnvelope(validUnconf, { ok: false, mode: 'UNCONFIGURED', statusCode: 503 });
        assert(!/\.mp4/i.test(JSON.stringify(validUnconf)), 'Must not emit fake MP4');

        const legacyHttp = await submitFn(
          {
            provider: 'fal',
            operation: 'image-to-video',
            imageUrl: 'http://www.restauranteotzarreta.com/facade.jpg',
            prompt: 'Legacy HTTP URL check',
          },
          { env: { FAL_KEY: 'test-fal' } },
        );
        assertAdapterEnvelope(legacyHttp, { ok: false, statusCode: 400 });
      },
    ),
  );

  results.push(
    await runCase(
      'T3-06',
      'T3',
      'R1xR3',
      '/api/integrations/readiness + capabilities-registry + Master Plan Alignment',
      async () => {
        const cronSecret = 'test-cron-secret-32-chars-minimum-12345';
        const script = `
          import { GET } from './src/app/api/integrations/readiness/route.ts';
          (async () => {
            const res = await GET(new Request('http://127.0.0.1:3007/api/integrations/readiness', {
              headers: { authorization: 'Bearer ${cronSecret}' },
            }) as any);
            const text = await res.text();
            console.log(JSON.stringify({ status: res.status, text }));
          })().catch((err) => { console.error(err); process.exit(1); });
        `;
        const run = runTsInline(script, {
          env: { CRON_SECRET: cronSecret, NODE_ENV: 'test' },
        });
        assertEqual(run.status, 0, `readiness inline run failed: ${run.stderr || run.stdout}`);
        const payload = JSON.parse(run.stdout.trim().split(/\r?\n/).pop());
        assertEqual(payload.status, 200, 'readiness route status');
        assert(!payload.text.includes(cronSecret), 'readiness route leaked CRON_SECRET');
        const bodyNorm = normText(payload.text);
        for (const id of ['gws', 'zapier', 'kling']) {
          assert(bodyNorm.includes(id), `readiness missing ${id}`);
        }
        assert(bodyNorm.includes('unconfigured'), 'readiness must report UNCONFIGURED when env absent');

        const plan = readText(MASTER_PLAN_PATH);
        assert(plan.exists, `Missing Master Plan: ${MASTER_PLAN_PATH}`);
        const planNorm = normText(plan.content);
        assert(
          planNorm.includes('gws') && planNorm.includes('zapier') && planNorm.includes('kling'),
          'Master Plan missing external adapters documented in readiness API',
        );
      },
    ),
  );

  results.push(
    await runCase(
      'T3-07',
      'T3',
      'R4xR5',
      'Otzarreta 2026 Menus + Checkout Presupuesto + SSOT Deposit/Split/Logistics',
      async () => {
        const catalogImp = await tryImportTs('src/lib/fincas/fincaMenus2026Catalog.ts');
        const ssotImp = await tryImportTs('src/lib/constants/ear-os-ssot.ts');
        assert(catalogImp.ok, 'Cannot import fincaMenus2026Catalog.ts');
        assert(ssotImp.ok, 'Cannot import ear-os-ssot.ts');

        const validation = catalogImp.mod.validateFincaCatalogIntegrity();
        assertEqual(validation.isValid, true, `Finca catalog invalid: ${validation.errors.join('; ')}`);
        const solistaExtra = catalogImp.mod.getFincaExtraById('solista-edwin');
        assert(solistaExtra, 'Missing solista-edwin extra');
        assertEqual(solistaExtra.priceEur, ssotImp.mod.TARIFA_BASE_SOLISTA_EUR, 'Solista extra matches SSOT 350 EUR');

        const checkout = readText('src/app/(public)/checkout/presupuesto/page.tsx');
        assert(checkout.exists, 'Missing checkout/presupuesto/page.tsx');
        const cleaned = stripCodeComments(checkout.content);
        assert(
          !FORBIDDEN_OTZARRETA_TOKENS_RE.test(cleaned),
          'checkout/presupuesto/page.tsx still contains Zarautz/Zizurkil/Gipuzkoa copy',
        );
        assert(
          /ear-os-ssot|DEPOSITO_STRIPE_EUR|DEPOSITO_RESERVA_EUR|SPLIT_SOBERANO|LOGISTICA_EUR_PER_KM/.test(cleaned),
          'checkout/presupuesto/page.tsx must consume SSOT constants',
        );
      },
    ),
  );

  return results;
}
