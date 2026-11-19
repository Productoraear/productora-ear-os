/**
 * ════════════════════════════════════════════════════════════════════════════
 * TIER 4 — REAL-WORLD APPLICATION SCENARIOS (6 SCENARIOS)
 * ════════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import {
  FORBIDDEN_OTZARRETA_TOKENS_RE,
  GWS_LEAST_PRIVILEGE_SCOPES,
  KNOWN_GOOD_SSOT_HASH,
  assert,
  assertAdapterEnvelope,
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
  tryImportTs,
  withMockFetch,
} from './helpers.mjs';

const MASTER_PLAN_PATH = 'docs/specs/PLAN_MAESTRO_16_CAPACIDADES_DOMINO_EAR_OS.md';

export async function runTier4() {
  const results = [];

  results.push(
    await runCase(
      'T4-01',
      'T4',
      'R4,R5',
      'End-to-End Otzarreta Derio Discovery, Search, Concierge & Checkout Journey',
      async () => {
        // Step 1: Sitemap discovery
        const sitemapImp = await tryImportTs('src/app/sitemap.ts');
        assert(sitemapImp.ok, 'Cannot import src/app/sitemap.ts');
        const entries = await sitemapImp.mod.default();
        const urls = entries.map((e) => String(e?.url || ''));
        assert(urls.some((u) => /\/otzarreta\/?$/i.test(u)), 'Sitemap missing /otzarreta');
        assert(urls.some((u) => /\/otzarreta\/bodas-caserio-derio/i.test(u)), 'Sitemap missing /otzarreta/bodas-caserio-derio');
        assert(urls.some((u) => /\/otzarreta\/.*uribe-kosta/i.test(u)), 'Sitemap missing Uribe Kosta URL');

        // Step 2: Search API discovery
        const searchRes = await invokeRoute('src/app/api/profiles/search/route.ts', 'GET', {
          url: 'http://127.0.0.1:3007/api/profiles/search?q=otzarreta&province=Bizkaia',
        });
        assert(searchRes.ok && searchRes.status === 200, 'Search API failed');
        const rec = (searchRes.json?.providers || searchRes.json?.items || []).find((p) =>
          /otzarreta/i.test(JSON.stringify(p)),
        );
        assert(rec, 'Otzarreta not returned in Bizkaia search');
        assertEqual(rec.municipality, 'Derio', 'Search municipality');
        assertMatch(rec.address, /Santo Domingo Hiribidea,?\s*13/i, 'Search address');
        assertIncludes(rec.address, '48160', 'Search postalCode');

        // Step 3: Concierge pageContext
        const ctxImp = await tryImportTs('src/lib/agents/pageContext.ts');
        assert(ctxImp.ok, 'Cannot import pageContext.ts');
        const ctx = ctxImp.mod.resolvePageContext({ pathname: '/otzarreta' });
        assertEqual(ctx.kind, 'venue', 'Concierge kind');
        assertEqual(ctx.municipality, 'Derio', 'Concierge municipality');
        assertEqual(ctx.province, 'Bizkaia', 'Concierge province');

        // Step 4: /otzarreta page & checkout/presupuesto SSOT deposit 100 EUR
        const otzPage = readText('src/app/(public)/otzarreta/page.tsx');
        const checkoutPage = readText('src/app/(public)/checkout/presupuesto/page.tsx');
        const ssotImp = await tryImportTs('src/lib/constants/ear-os-ssot.ts');
        assert(otzPage.exists && checkoutPage.exists && ssotImp.ok, 'Missing page/SSOT files');
        assertEqual(ssotImp.mod.DEPOSITO_STRIPE_EUR, 100, 'SSOT deposit 100 EUR');
        assert(
          /DEPOSITO_STRIPE_EUR|DEPOSITO_RESERVA_EUR|100(?:,00)?\s*€/i.test(checkoutPage.content),
          'checkout/presupuesto must reference 100 EUR deposit (DEPOSITO_STRIPE_EUR / 100 €)',
        );

        const surfaceTexts = [
          JSON.stringify(urls.filter((u) => /otzarreta/i.test(u))),
          JSON.stringify(rec),
          JSON.stringify(ctx),
          stripCodeComments(otzPage.content),
          stripCodeComments(checkoutPage.content),
        ].join('\n');
        assert(
          !FORBIDDEN_OTZARRETA_TOKENS_RE.test(surfaceTexts),
          'End-to-end Otzarreta journey still contains Zarautz/Gipuzkoa/Zizurkil conflation',
        );
      },
    ),
  );

  results.push(
    await runCase(
      'T4-02',
      'T4',
      'R2,R3,R4',
      'B2G Municipal Tender > 5.000 EUR & > 14.250 EUR Autonomous HITL Stop',
      async () => {
        const gwsImp = await tryImportTs('src/lib/integrations/gws-adapter.ts');
        const zapImp = await tryImportTs('src/lib/integrations/zapier-mcp-adapter.ts');
        assert(gwsImp.ok && zapImp.ok, 'Missing GWS or Zapier adapter');

        const gwsExec = findExportedFn(gwsImp.mod, ['executeGwsAction'], /execute/i, 'executeGwsAction');
        const zapExec = findExportedFn(zapImp.mod, ['callZapierMcpTool'], /callZapier/i, 'callZapierMcpTool');

        const gwsEnv = {
          GOOGLE_WORKSPACE_CLIENT_ID: 'cid',
          GOOGLE_WORKSPACE_CLIENT_SECRET: 'csec',
          GOOGLE_WORKSPACE_REFRESH_TOKEN: 'rtok',
          GWS_ALLOWED_SCOPES: GWS_LEAST_PRIVILEGE_SCOPES.join(','),
        };
        const zapEnv = {
          ZAPIER_MCP_URL: 'https://mcp.zapier.com/api/v1/connect',
          ZAPIER_MCP_TOKEN: 'test-token',
        };

        let outboundCalled = false;
        await withMockFetch(
          async () => {
            outboundCalled = true;
            throw new Error('Autonomous HITL-blocked B2G call must never reach network');
          },
          async () => {
            for (const amountEur of [6500, 14500]) {
              const gRes = await gwsExec(
                {
                  action: 'docs.b2g_contract_export',
                  scopes: ['documents'],
                  estimatedAmountEur: amountEur,
                  hitlApproved: false,
                },
                { env: gwsEnv },
              );
              assertAdapterEnvelope(gRes, { ok: false, mode: 'HITL_BLOCKED', statusCode: 403 });
              assert(
                /5_HITL_TOTAL|5\.?000|HITL/i.test(JSON.stringify(gRes)),
                `GWS B2G ${amountEur} EUR must cite HITL stop`,
              );

              const zRes = await zapExec(
                {
                  toolName: 'dispatch_tender_webhook',
                  isB2gContract: true,
                  amountEur,
                  humanApproved: false,
                  arguments: { amountEur },
                },
                { env: zapEnv },
              );
              assertAdapterEnvelope(zRes, { ok: false, mode: 'HITL_BLOCKED', statusCode: 403 });
            }

            // Override-resistance: > 14.250 EUR B2G ceiling cannot be bypassed even with humanApproved: true
            const gCeiling = await gwsExec(
              {
                action: 'docs.b2g_contract_export',
                scopes: ['documents'],
                estimatedAmountEur: 14500,
                hitlApproved: true,
                hitlReviewerId: 'ceo-edwin',
              },
              { env: gwsEnv },
            );
            assertAdapterEnvelope(gCeiling, { ok: false, mode: 'HITL_BLOCKED', statusCode: 403 });

            const zCeiling = await zapExec(
              {
                toolName: 'dispatch_tender_webhook',
                isB2gContract: true,
                amountEur: 14500,
                humanApproved: true,
                arguments: { amountEur: 14500 },
              },
              { env: zapEnv },
            );
            assertAdapterEnvelope(zCeiling, { ok: false, mode: 'HITL_BLOCKED', statusCode: 403 });
          },
        );
        assert(!outboundCalled, 'B2G HITL stop failed to prevent outbound fetch');
      },
    ),
  );

  results.push(
    await runCase(
      'T4-03',
      'T4',
      'R1,R3,R4',
      'Zero-Credential Local Workstation Boot & Readiness Probe',
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
        assertEqual(run.status, 0, `Zero-cred workstation boot failed: ${run.stderr || run.stdout}`);
        const payload = JSON.parse(run.stdout.trim().split(/\r?\n/).pop());
        assertEqual(payload.status, 200, 'readiness HTTP 200');
        assertIncludes(payload.text.toLowerCase(), 'unconfigured', 'Adapters must report UNCONFIGURED');
        assert(!payload.text.includes(cronSecret), 'CRON_SECRET leaked in readiness response');
        assert(!/Bearer\s+|sk_live_|AIza/i.test(payload.text), 'Secret leaked in readiness response');

        const envEx = readText('.env.example');
        assert(envEx.exists, 'Missing .env.example');
        for (const k of ['GOOGLE_WORKSPACE_CLIENT_ID', 'ZAPIER_MCP_URL', 'FAL_KEY']) {
          assertIncludes(envEx.content, k, '.env.example onboarding key');
        }
      },
    ),
  );

  results.push(
    await runCase(
      'T4-04',
      'T4',
      'R3',
      'Video Factory (fal.ai / Kling O1) 25_REVIEW HITL, Validation, SSRF & Upstream Receipt Workload',
      async () => {
        const imp = await tryImportTs('src/lib/integrations/kling-fal-adapter.ts');
        assert(imp.ok, 'Missing kling-fal-adapter.ts');
        const submitFn = findExportedFn(imp.mod, ['submitKlingFalVideoJob'], /submitKling/i, 'submitKlingFalVideoJob');

        const validJob = {
          provider: 'fal',
          operation: 'image-to-video',
          imageUrl: 'https://www.ezkertzaberria.com/images/fachada.jpg',
          prompt: 'Elegant wedding garden aerial pan in Derio Bizkaia',
        };

        // (a) Unconfigured -> UNCONFIGURED, no fake MP4
        const unconf = await submitFn(validJob, { env: {} });
        assertAdapterEnvelope(unconf, { ok: false, mode: 'UNCONFIGURED', statusCode: 503 });
        assert(!/\.mp4/i.test(JSON.stringify(unconf)), 'No fake MP4 allowed');

        // (b) Input SSRF -> 400
        const ssrf = await submitFn(
          {
            ...validJob,
            imageUrl: 'http://169.254.169.254/latest/meta-data',
          },
          { env: { FAL_KEY: 'test-fal' } },
        );
        assertAdapterEnvelope(ssrf, { ok: false, statusCode: 400 });

        const validEnv = { FAL_KEY: 'test-fal' };
        const failures = [];

        // (c) Upstream returned URL SSRF validation (status_url, response_url, video.url) -> 502/ERROR
        const unsafeUpstreamPayloads = [
          { request_id: 'job_ssrf_1', status: 'IN_QUEUE', status_url: 'http://169.254.169.254/latest/meta-data' },
          { request_id: 'job_ssrf_2', status: 'IN_QUEUE', response_url: 'https://127.0.0.1/callback' },
          { request_id: 'job_ssrf_3', status: 'COMPLETED', video: { url: 'https://10.0.0.1/out.mp4' } },
        ];
        for (const body of unsafeUpstreamPayloads) {
          await withMockFetch(
            async () =>
              new Response(JSON.stringify(body), {
                status: 200,
                headers: { 'content-type': 'application/json' },
              }),
            async () => {
              const probe = await submitFn({ ...validJob, humanApproved: true }, { env: validEnv });
              if (probe.ok || probe.mode !== 'ERROR' || probe.statusCode !== 502) {
                failures.push(
                  `Upstream SSRF response (${JSON.stringify(body)}) expected 502 ERROR, got ${probe.statusCode} ${probe.mode}`,
                );
              }
            },
          );
        }

        // (d) 25_REVIEW HITL policy on paid video jobs (PLAN_MAESTRO §2.2 / Grill Me §2):
        //     Unapproved submission must be blocked (403 HITL_BLOCKED) without calling fetch;
        //     humanApproved: true must be accepted and produce VideoJobReceipt or 502 on bad JSON.
        let unapprovedFetchCalled = false;
        await withMockFetch(
          async () => {
            unapprovedFetchCalled = true;
            return new Response(
              JSON.stringify({ request_id: 'job_derio_unapproved', status: 'IN_QUEUE' }),
              { status: 200, headers: { 'content-type': 'application/json' } },
            );
          },
          async () => {
            const unapprovedRes = await submitFn(validJob, { env: validEnv });
            if (
              unapprovedRes.ok !== false ||
              unapprovedRes.mode !== 'HITL_BLOCKED' ||
              unapprovedRes.statusCode !== 403 ||
              unapprovedFetchCalled
            ) {
              failures.push(
                `Paid video job without humanApproved: true must fail closed with 403 HITL_BLOCKED (25_REVIEW) without outbound fetch; got statusCode=${unapprovedRes.statusCode}, mode=${unapprovedRes.mode}, fetchCalled=${unapprovedFetchCalled}`,
              );
            }
          },
        );

        await withMockFetch(
          async () =>
            new Response(
              JSON.stringify({ request_id: 'job_derio_001', status: 'IN_QUEUE' }),
              { status: 200, headers: { 'content-type': 'application/json' } },
            ),
          async () => {
            const approvedRes = await submitFn(
              { ...validJob, humanApproved: true },
              { env: validEnv },
            );
            if (
              !approvedRes.ok ||
              approvedRes.mode !== 'REAL' ||
              approvedRes.statusCode !== 200 ||
              approvedRes.data?.requestId !== 'job_derio_001' ||
              approvedRes.data?.videoUrl !== null
            ) {
              failures.push(
                `Approved video job (humanApproved: true) expected 200 REAL receipt with videoUrl=null; got ${approvedRes.statusCode} ${approvedRes.mode} (${approvedRes.errorCode}: ${approvedRes.message})`,
              );
            }
          },
        );

        await withMockFetch(
          async () =>
            new Response(JSON.stringify({ unexpectedGarbageField: 123 }), {
              status: 200,
              headers: { 'content-type': 'application/json' },
            }),
          async () => {
            const badRes = await submitFn({ ...validJob, humanApproved: true }, { env: validEnv });
            if (badRes.ok !== false || badRes.mode !== 'ERROR' || (badRes.statusCode !== 502 && badRes.statusCode !== 503)) {
              failures.push(
                `Malformed upstream JSON expected 502/503 ERROR; got ${badRes.statusCode} ${badRes.mode}`,
              );
            }
          },
        );

        assertEqual(failures.length, 0, failures.join(' | '));
      },
    ),
  );

  results.push(
    await runCase(
      'T4-05',
      'T4',
      'R1,R2,R4',
      'Autonomous Domino Local Tooling Loop (Grill Me -> Graphify -> Master Plan -> SSOT)',
      async () => {
        // 1. Grill Me checkpoint
        const dir = repoPath('.antigravity/brainstorms');
        assert(fs.existsSync(dir), 'Missing .antigravity/brainstorms');
        const cp = fs.readdirSync(dir).find((f) => /16[-_]?capacidades.*domino.*\.md$/i.test(f));
        assert(cp, 'Missing Grill Me checkpoint');

        // 2. Graphify query
        assert(fileExists('graphify-out/graph.json'), 'Missing graphify-out/graph.json');
        const gq = runCmd('graphify', ['query', 'ear-os-ssot'], {
          timeoutMs: 30_000,
          cacheKey: 'graphify_query_ssot',
        });
        assertEqual(gq.status, 0, `graphify query failed: ${gq.stderr}`);

        // 3. Master Plan domino stage mapping
        const plan = readText(MASTER_PLAN_PATH);
        assert(plan.exists, `Missing Master Plan: ${MASTER_PLAN_PATH}`);
        const norm = normText(plan.content);
        assert(norm.includes('domino') && norm.includes('graphify'), 'Master Plan missing domino/graphify loop');

        // 4. SSOT audit
        const ssot = runCmd('npm', ['run', 'audit:ssot'], {
          timeoutMs: 60_000,
          cacheKey: 'audit_ssot',
        });
        assertEqual(ssot.status, 0, 'npm run audit:ssot failed');
      },
    ),
  );

  results.push(
    await runCase(
      'T4-06',
      'T4',
      'R2,R4',
      'Full Constitutional & 17-Gate Production Release Certification',
      async () => {
        const ssot = runCmd('npm', ['run', 'audit:ssot'], { timeoutMs: 60_000, cacheKey: 'audit_ssot' });
        assertEqual(ssot.status, 0, 'audit:ssot failed');

        const tc = runCmd('npm', ['run', 'typecheck'], { timeoutMs: 240_000, cacheKey: 'typecheck' });
        assertEqual(tc.status, 0, 'typecheck failed');

        const lint = runCmd('npm', ['run', 'lint'], { timeoutMs: 240_000, cacheKey: 'lint' });
        assertEqual(lint.status, 0, 'lint failed');

        const sv = runCmd(process.execPath, ['scripts/run_sv_protocol_15_gates.cjs'], {
          timeoutMs: 420_000,
          cacheKey: 'sv_protocol_17_gates',
        });
        assertEqual(sv.status, 0, 'run_sv_protocol_15_gates.cjs failed');

        const guard = await tryImportTs('src/lib/security/ssotIntegrityGuard.ts');
        assert(guard.ok, 'Cannot import ssotIntegrityGuard.ts');
        assertEqual(guard.mod.verifySsotIntegrity().computedHash, KNOWN_GOOD_SSOT_HASH, 'SSOT hash');

        const pkg = readJson('package.json');
        assert(!/\b(pnpm|yarn|bun)\b/i.test(JSON.stringify(pkg.data?.scripts || {})), 'Foreign pkg manager in scripts');
      },
    ),
  );

  return results;
}
