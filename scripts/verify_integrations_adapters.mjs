import assert from 'node:assert/strict';
import { existsSync, statSync } from 'node:fs';
import { registerHooks } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CANDIDATES = [
  '',
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.cjs',
  '.json',
  '/index.ts',
  '/index.tsx',
  '/index.js',
];

function isFile(p) {
  try {
    return existsSync(p) && statSync(p).isFile();
  } catch {
    return false;
  }
}

function resolveCandidateFile(basePath) {
  for (const suffix of CANDIDATES) {
    const candidate = `${basePath}${suffix}`;
    if (isFile(candidate)) {
      return candidate;
    }
  }
  return null;
}

function resolveAliasPath(specifier) {
  const prefixes = [
    ['@/components/', ['src/components/', 'src/app/components/']],
    ['@/contexts/', ['src/context/']],
    ['@/context/', ['src/context/']],
    ['@/stores/', ['src/store/']],
    ['@/store/', ['src/store/']],
    ['@/', ['src/', 'src/app/']],
  ];
  for (const [prefix, targets] of prefixes) {
    if (specifier.startsWith(prefix)) {
      const rest = specifier.slice(prefix.length);
      for (const target of targets) {
        const hit = resolveCandidateFile(path.join(ROOT, target, rest));
        if (hit) return hit;
      }
    }
  }
  return null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'server-only') {
      return {
        url: 'data:text/javascript,export default {};',
        shortCircuit: true,
        format: 'module',
      };
    }

    if (specifier.startsWith('next/')) {
      const nextJsFile = path.join(ROOT, 'node_modules', `${specifier}.js`);
      if (isFile(nextJsFile)) {
        return {
          url: pathToFileURL(nextJsFile).href,
          shortCircuit: true,
          format: 'commonjs',
        };
      }
    }

    if (specifier.startsWith('@/')) {
      const hit = resolveAliasPath(specifier);
      if (hit) {
        return {
          url: pathToFileURL(hit).href,
          shortCircuit: true,
        };
      }
    }

    if (
      (specifier.startsWith('./') || specifier.startsWith('../')) &&
      context.parentURL &&
      context.parentURL.startsWith('file:')
    ) {
      const parentDir = path.dirname(fileURLToPath(context.parentURL));
      const hit = resolveCandidateFile(path.resolve(parentDir, specifier));
      if (hit) {
        return {
          url: pathToFileURL(hit).href,
          shortCircuit: true,
        };
      }
    }

    return nextResolve(specifier, context);
  },

  load(url, context, nextLoad) {
    if (url.includes('/node_modules/next/') && url.endsWith('.js')) {
      return nextLoad(url, { ...context, format: 'commonjs' });
    }
    return nextLoad(url, context);
  },
});

const contract = await import('../src/lib/integrations/adapter-contract.ts');
const gws = await import('../src/lib/integrations/gws-adapter.ts');
const zapier = await import('../src/lib/integrations/zapier-mcp-adapter.ts');
const kling = await import('../src/lib/integrations/kling-fal-adapter.ts');
const registry = await import('../src/lib/integrations/capabilities-registry.ts');
const route = await import('../src/app/api/integrations/readiness/route.ts');
const { NextRequest } = await import('next/server');

let passed = 0;
async function check(name, fn) {
  await fn();
  passed += 1;
  console.log(`PASS [${passed}] ${name}`);
}

const CANARY_GWS = 'GOCSPX-canary_gws_secret_987654321';
const CANARY_ZAPIER = 'zapier_canary_bearer_token_987654321';
const CANARY_FAL = 'fal_canary_secret_key_987654321';
const CANARY_KLING = 'kling_canary_secret_key_987654321';

// 1. Adapter Contract: Env placeholders & readiness
await check('adapter-contract: placeholder and empty env values fail closed', () => {
  const r = contract.checkEnvReadiness('test', ['A', 'B', 'C', 'D'], {
    A: '',
    B: '   ',
    C: 'sk_test_dummy_key_for_build',
    D: 'your_sample_key_here',
  });
  assert.equal(r.configured, false);
  assert.equal(r.mode, 'UNCONFIGURED');
  assert.deepEqual(r.missingVars, ['A', 'B', 'C', 'D']);

  const ok = contract.checkEnvReadiness('test', ['A'], { A: ' real_val ' });
  assert.equal(ok.configured, true);
  assert.equal(ok.mode, 'READY');
});

// 2. Adapter Contract: Evidence SHA-256 deterministic, DAG-canonical & circular-safe
await check('adapter-contract: computeEvidenceSha256 handles sorted keys, BigInt, shared DAG & circular refs', () => {
  const h1 = contract.computeEvidenceSha256({ b: 2, a: 1n, c: undefined });
  const h2 = contract.computeEvidenceSha256({ a: 1n, c: undefined, b: 2 });
  assert.equal(h1, h2);
  assert.match(h1, /^[a-f0-9]{64}$/);

  const shared = { x: 42, y: 'ok' };
  const hDag = contract.computeEvidenceSha256({ a: shared, b: shared });
  const hExpanded = contract.computeEvidenceSha256({ a: { x: 42, y: 'ok' }, b: { x: 42, y: 'ok' } });
  assert.equal(hDag, hExpanded);

  const circ = { name: 'node' };
  circ.self = circ;
  const hCirc = contract.computeEvidenceSha256(circ);
  assert.match(hCirc, /^[a-f0-9]{64}$/);
  assert.notEqual(hCirc, contract.computeEvidenceSha256({ name: 'node', self: { name: 'node' } }));
});

// 3. Adapter Contract: Layered INV-14 redaction before 600-char slicing
await check('adapter-contract: INV-14 scrubs secrets, Key id:secret, query/fragment tokens & phones before slice', () => {
  const padding = 'x'.repeat(585);
  const raw = `${padding} Bearer ${CANARY_ZAPIER} https://example.com?token=secret999&x=1 +34 612 345 678 centralita +34 693 693 048`;
  const redacted = contract.redactSecretsAndPii(raw, [CANARY_ZAPIER]);
  assert.equal(redacted.includes(CANARY_ZAPIER), false);
  assert.equal(redacted.includes('secret999'), false);
  assert.equal(redacted.includes('612 345 678'), false);
  assert.ok(redacted.length <= 600);

  const keyColonRedacted = contract.redactSecretsAndPii(
    'Header Authorization: Key fal_id_abc123:fal_secret_xyz987 failed',
  );
  assert.equal(keyColonRedacted.includes('fal_id_abc123'), false);
  assert.equal(keyColonRedacted.includes('fal_secret_xyz987'), false);

  const fragmentRedacted = contract.redactSecretsAndPii(
    'Redirect https://app.example.com/cb?client_secret=cs_secret_555#access_token=frag_tok_777&state=ok',
  );
  assert.equal(fragmentRedacted.includes('cs_secret_555'), false);
  assert.equal(fragmentRedacted.includes('frag_tok_777'), false);
  assert.ok(fragmentRedacted.includes('state=ok'));

  const centralitaPreserved = contract.redactSecretsAndPii(
    'Centralita +34 693 693 048 y móvil +34 611 222 333',
  );
  assert.ok(centralitaPreserved.includes('+34 693 693 048'));
  assert.equal(centralitaPreserved.includes('611 222 333'), false);
});

// 4. Adapter Contract: SSRF-safe HTTPS public URL validation
await check('adapter-contract: validateSafeHttpsPublicUrl blocks non-HTTPS, credentials, ports, multi-dots & private/reserved IPv4/IPv6', () => {
  const badUrls = [
    '',
    'http://cdn.example.com/a.jpg',
    'javascript:alert(1)',
    'data:text/html,<script>1</script>',
    'file:///etc/passwd',
    '//cdn.example.com/a.jpg',
    'https://user:pass@cdn.example.com/a.jpg',
    'https://cdn.example.com:8443/a.jpg',
    'https://localhost/a.jpg',
    'https://localhost./a.jpg',
    'https://localhost../a.jpg',
    'https://api.internal/a.jpg',
    'https://printer.local/a.jpg',
    'https://metadata.google.internal/computeMetadata/v1/',
    'https://intranet/a.jpg',
    'https://0.0.0.1/a.jpg',
    'https://127.0.0.1/a.jpg',
    'https://10.0.0.5/a.jpg',
    'https://172.16.0.1/a.jpg',
    'https://192.168.1.10/a.jpg',
    'https://169.254.169.254/latest/meta-data',
    'https://100.64.0.1/a.jpg',
    'https://224.0.0.1/a.jpg',
    'https://[::1]/a.jpg',
    'https://[::]/a.jpg',
    'https://[::ffff:127.0.0.1]/a.jpg',
    'https://[::127.0.0.1]/a.jpg',
    'https://[::169.254.169.254]/a.jpg',
    'https://[fe80::1]/a.jpg',
    'https://[fc00::1]/a.jpg',
    'https://[64:ff9b::127.0.0.1]/a.jpg',
    'https://[2002:7f00:1::]/a.jpg',
    'https://[2001:0:4136:e378:8000:63bf:3fff:fdd2]/a.jpg',
    'https://[100::1]/a.jpg',
  ];
  for (const url of badUrls) {
    const res = contract.validateSafeHttpsPublicUrl(url);
    assert.equal(res.ok, false, `Expected rejection for ${url}`);
  }
  const good = contract.validateSafeHttpsPublicUrl('https://cdn.productoraear.com/media/hero.jpg');
  assert.equal(good.ok, true);
  const goodIpv6 = contract.validateSafeHttpsPublicUrl('https://[2606:4700:4700::1111]/a.jpg');
  assert.equal(goodIpv6.ok, true);
});

// 5. Adapter Contract: HITL Policy Gate (AGENTS.md §2 & §3)
await check('adapter-contract: evaluateHitlPolicyGate enforces 0/5/25/60/90 tiers, fail-closed catch-all & SSOT invariants', () => {
  const closeNoConsent = contract.evaluateHitlPolicyGate({
    actionKind: 'contract_close',
    bilateralConsentConfirmed: false,
    humanApproved: true,
  });
  assert.equal(closeNoConsent.allowed, false);
  assert.equal(closeNoConsent.tier, '0_FORBIDDEN');

  const closeBilateralUnapproved = contract.evaluateHitlPolicyGate({
    actionKind: 'contract_close',
    bilateralConsentConfirmed: true,
    amountEur: 1200,
    humanApproved: false,
  });
  assert.equal(closeBilateralUnapproved.allowed, false);
  assert.equal(closeBilateralUnapproved.tier, '25_REVIEW');
  assert.equal(closeBilateralUnapproved.requiresHuman, true);

  const closeBilateralApproved = contract.evaluateHitlPolicyGate({
    actionKind: 'contract_close',
    bilateralConsentConfirmed: true,
    amountEur: 1200,
    humanApproved: true,
  });
  assert.equal(closeBilateralApproved.allowed, true);
  assert.equal(closeBilateralApproved.tier, '25_REVIEW');

  const closeBilateralHighAmount = contract.evaluateHitlPolicyGate({
    actionKind: 'contract_close',
    bilateralConsentConfirmed: true,
    amountEur: 6000,
    humanApproved: false,
  });
  assert.equal(closeBilateralHighAmount.allowed, false);
  assert.equal(closeBilateralHighAmount.tier, '5_HITL_TOTAL');

  const edwinBelowFloor = contract.evaluateHitlPolicyGate({
    actionKind: 'express_quote',
    artistId: 'e78903',
    amountEur: 349,
    humanApproved: true,
  });
  assert.equal(edwinBelowFloor.allowed, false);
  assert.equal(edwinBelowFloor.tier, '0_FORBIDDEN');

  const unclaimedDossier = contract.evaluateHitlPolicyGate({
    actionKind: 'paid_provider_dossier',
    providerTier: 'DIRECTORY_UNCLAIMED',
  });
  assert.equal(unclaimedDossier.allowed, false);
  assert.equal(unclaimedDossier.tier, '0_FORBIDDEN');

  const b2gLowUnapproved = contract.evaluateHitlPolicyGate({
    actionKind: 'b2g_contract',
    amountEur: 3000,
    humanApproved: false,
  });
  assert.equal(b2gLowUnapproved.allowed, false);
  assert.equal(b2gLowUnapproved.tier, '25_REVIEW');
  assert.equal(b2gLowUnapproved.requiresHuman, true);

  const b2gLowApproved = contract.evaluateHitlPolicyGate({
    actionKind: 'b2g_contract',
    amountEur: 3000,
    humanApproved: true,
  });
  assert.equal(b2gLowApproved.allowed, true);
  assert.equal(b2gLowApproved.tier, '25_REVIEW');

  const b2gNullUnapproved = contract.evaluateHitlPolicyGate({
    actionKind: 'b2g_contract',
    amountEur: null,
    humanApproved: false,
  });
  assert.equal(b2gNullUnapproved.allowed, false);
  assert.equal(b2gNullUnapproved.tier, '5_HITL_TOTAL');

  const b2gAbovePreventive = contract.evaluateHitlPolicyGate({
    actionKind: 'b2g_contract',
    amountEur: 14500,
    humanApproved: true,
  });
  assert.equal(b2gAbovePreventive.allowed, false);
  assert.equal(b2gAbovePreventive.tier, '5_HITL_TOTAL');

  const b2gAboveLegal = contract.evaluateHitlPolicyGate({
    actionKind: 'b2g_contract',
    amountEur: 15001,
    humanApproved: true,
  });
  assert.equal(b2gAboveLegal.allowed, false);
  assert.equal(b2gAboveLegal.tier, '0_FORBIDDEN');

  const unknownAction = contract.evaluateHitlPolicyGate({
    actionKind: 'unhandled_custom_action',
    humanApproved: false,
  });
  assert.equal(unknownAction.allowed, false);
  assert.equal(unknownAction.tier, '25_REVIEW');

  const stripeUnapproved = contract.evaluateHitlPolicyGate({
    actionKind: 'stripe_price_lock',
    humanApproved: false,
  });
  assert.equal(stripeUnapproved.allowed, false);
  assert.equal(stripeUnapproved.tier, '25_REVIEW');

  const longDistance = contract.evaluateHitlPolicyGate({
    actionKind: 'express_quote',
    distanceKm: 350,
    humanApproved: false,
  });
  assert.equal(longDistance.allowed, false);
  assert.equal(longDistance.tier, '25_REVIEW');

  const faq = contract.evaluateHitlPolicyGate({ actionKind: 'catalog_faq' });
  assert.equal(faq.allowed, true);
  assert.equal(faq.tier, '90_AUTO');
});

// 6. GWS Adapter: fail-closed, scope firewall, HITL & mocked transports
await check('gws-adapter: fails closed UNCONFIGURED (503), enforces least-privilege scopes & HITL', async () => {
  const r = gws.checkGwsReadiness({}, { commandExists: () => false, existsSync: () => false });
  assert.equal(r.configured, false);
  assert.equal(r.mode, 'UNCONFIGURED');

  const unconf = await gws.executeGwsAction(
    {
      action: 'gmail.messages.list',
      scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
    },
    { env: {}, probeDeps: { commandExists: () => false, existsSync: () => false } },
  );
  assert.equal(unconf.ok, false);
  assert.equal(unconf.mode, 'UNCONFIGURED');
  assert.equal(unconf.statusCode, 503);

  const forbiddenScopes = [
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/admin.directory.user',
    'https://www.googleapis.com/auth/cloud-platform',
  ];
  for (const scope of forbiddenScopes) {
    const scopeFail = await gws.executeGwsAction(
      { action: 'gmail.messages.list', scopes: [scope] },
      { env: {} },
    );
    assert.equal(scopeFail.statusCode, 403, `Expected 403 for forbidden scope ${scope}`);
    assert.equal(scopeFail.errorCode, 'GWS_SCOPE_VIOLATION');
  }

  const hitlBlocked = await gws.executeGwsAction(
    {
      action: 'gmail.drafts.send',
      scopes: ['gmail.compose'],
      hitlApproved: false,
    },
    {
      env: {
        GOOGLE_WORKSPACE_CLIENT_ID: 'cid',
        GOOGLE_WORKSPACE_CLIENT_SECRET: CANARY_GWS,
        GOOGLE_WORKSPACE_REFRESH_TOKEN: 'rtok',
      },
    },
  );
  assert.equal(hitlBlocked.ok, false);
  assert.equal(hitlBlocked.mode, 'HITL_BLOCKED');
  assert.equal(hitlBlocked.statusCode, 403);

  let callCount = 0;
  const okOauth = await gws.executeGwsAction(
    {
      action: 'gmail.messages.list',
      scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
    },
    {
      env: {
        GOOGLE_WORKSPACE_CLIENT_ID: 'cid',
        GOOGLE_WORKSPACE_CLIENT_SECRET: CANARY_GWS,
        GOOGLE_WORKSPACE_REFRESH_TOKEN: 'rtok',
      },
      transport: {
        async send(req) {
          callCount += 1;
          if (req.url.includes('oauth2.googleapis.com')) {
            return {
              status: 200,
              headers: { get: () => 'application/json' },
              text: JSON.stringify({ access_token: 'ya29.mock_access_token_123456' }),
            };
          }
          return {
            status: 200,
            headers: { get: () => 'application/json' },
            text: JSON.stringify({ messages: [{ id: 'm1' }] }),
          };
        },
      },
    },
  );
  assert.equal(callCount, 2);
  assert.equal(okOauth.ok, true);
  assert.equal(okOauth.mode, 'REAL');
  assert.equal(okOauth.statusCode, 200);
  assert.equal(okOauth.data?.transportUsed, 'oauth_rest');

  const leakCheck = await gws.executeGwsAction(
    {
      action: 'gmail.messages.list',
      scopes: ['gmail.readonly'],
    },
    {
      env: {
        GOOGLE_WORKSPACE_CLIENT_ID: 'cid',
        GOOGLE_WORKSPACE_CLIENT_SECRET: CANARY_GWS,
        GOOGLE_WORKSPACE_REFRESH_TOKEN: 'rtok',
      },
      transport: {
        async send() {
          throw new Error(`Boom with secret ${CANARY_GWS}`);
        },
      },
    },
  );
  assert.equal(leakCheck.ok, false);
  assert.equal(JSON.stringify(leakCheck).includes(CANARY_GWS), false);

  // GWS_ALLOWED_SCOPES subset & invalid readiness integrity
  const envSubsetFail = await gws.executeGwsAction(
    {
      action: 'gmail.drafts.create',
      scopes: ['gmail.compose'],
    },
    {
      env: {
        GOOGLE_WORKSPACE_CLIENT_ID: 'cid',
        GOOGLE_WORKSPACE_CLIENT_SECRET: CANARY_GWS,
        GOOGLE_WORKSPACE_REFRESH_TOKEN: 'rtok',
        GWS_ALLOWED_SCOPES: 'gmail.readonly',
      },
    },
  );
  assert.equal(envSubsetFail.ok, false);
  assert.equal(envSubsetFail.statusCode, 403);
  assert.equal(envSubsetFail.errorCode, 'GWS_SCOPE_VIOLATION');

  const invalidEnvReadiness = gws.checkGwsReadiness({
    GOOGLE_WORKSPACE_CLIENT_ID: 'cid',
    GOOGLE_WORKSPACE_CLIENT_SECRET: CANARY_GWS,
    GOOGLE_WORKSPACE_REFRESH_TOKEN: 'rtok',
    GWS_ALLOWED_SCOPES: 'gmail.readonly, https://mail.google.com/',
  });
  assert.equal(invalidEnvReadiness.configured, false);
  assert.equal(invalidEnvReadiness.mode, 'UNCONFIGURED');
  assert.match(invalidEnvReadiness.details ?? '', /GWS_SCOPE_VIOLATION/);

  // B2G export ALWAYS requires hitlApproved + hitlReviewerId even when amount <= 5000 or omitted
  const b2gOmitted = await gws.executeGwsAction(
    {
      action: 'docs.b2g_contract_export',
      scopes: ['documents'],
      hitlApproved: true,
    },
    {
      env: {
        GOOGLE_WORKSPACE_CLIENT_ID: 'cid',
        GOOGLE_WORKSPACE_CLIENT_SECRET: CANARY_GWS,
        GOOGLE_WORKSPACE_REFRESH_TOKEN: 'rtok',
      },
    },
  );
  assert.equal(b2gOmitted.ok, false);
  assert.equal(b2gOmitted.mode, 'HITL_BLOCKED');
  assert.equal(b2gOmitted.statusCode, 403);

  const b2gLowNoReviewer = await gws.executeGwsAction(
    {
      action: 'docs.b2g_contract_export',
      scopes: ['documents'],
      estimatedAmountEur: 3000,
      hitlApproved: true,
    },
    {
      env: {
        GOOGLE_WORKSPACE_CLIENT_ID: 'cid',
        GOOGLE_WORKSPACE_CLIENT_SECRET: CANARY_GWS,
        GOOGLE_WORKSPACE_REFRESH_TOKEN: 'rtok',
      },
    },
  );
  assert.equal(b2gLowNoReviewer.ok, false);
  assert.equal(b2gLowNoReviewer.mode, 'HITL_BLOCKED');
  assert.equal(b2gLowNoReviewer.statusCode, 403);

  // Windows .cmd/.bat shims must NOT be treated as runnable CLI under shell: false
  assert.equal(
    gws.defaultCommandExists(
      'gws',
      { PATH: 'C:\\npm', PATHEXT: '.EXE;.CMD;.BAT;.COM' },
      (p) => p === 'C:\\npm\\gws.cmd',
      'win32',
    ),
    false,
  );
  assert.equal(
    gws.defaultCommandExists('C:\\npm\\gws.cmd', {}, () => true, 'win32'),
    false,
  );
  assert.equal(
    gws.defaultCommandExists(
      'gws',
      { PATH: 'C:\\bin', PATHEXT: '.EXE;.CMD' },
      (p) => p === 'C:\\bin\\gws.exe',
      'win32',
    ),
    true,
  );

  // safeResourceId rejects '..' and '.' path traversal
  for (const badId of ['..', '.', 'foo..bar']) {
    const traversal = await gws.executeGwsAction(
      {
        action: 'gmail.messages.get',
        scopes: ['gmail.readonly'],
        params: { messageId: badId },
      },
      {
        env: {
          GOOGLE_WORKSPACE_CLIENT_ID: 'cid',
          GOOGLE_WORKSPACE_CLIENT_SECRET: CANARY_GWS,
          GOOGLE_WORKSPACE_REFRESH_TOKEN: 'rtok',
        },
      },
    );
    assert.equal(traversal.ok, false);
    assert.equal(traversal.statusCode, 400);
    assert.equal(traversal.errorCode, 'GWS_MISSING_RESOURCE_ID');
  }
});

// 7. Zapier MCP Adapter: fail-closed, HITL, JSON + SSE parsing, strict Zod, INV-14
await check('zapier-mcp-adapter: fails closed UNCONFIGURED, enforces HITL, parses JSON & SSE, scrubs secrets', async () => {
  assert.equal(zapier.checkZapierMcpReadiness({}).configured, false);

  const listUnconf = await zapier.listZapierMcpTools({ env: {} });
  assert.equal(listUnconf.statusCode, 503);
  assert.equal(listUnconf.mode, 'UNCONFIGURED');

  const hitlBlocked = await zapier.callZapierMcpTool(
    { toolName: 'gmail_send_email', arguments: { to: 'a@b.com' } },
    { env: { ZAPIER_MCP_TOKEN: CANARY_ZAPIER } },
  );
  assert.equal(hitlBlocked.statusCode, 403);
  assert.equal(hitlBlocked.mode, 'HITL_BLOCKED');

  const badInput = await zapier.callZapierMcpTool(
    { toolName: 'x', extraUnexpectedKey: true },
    { env: { ZAPIER_MCP_TOKEN: CANARY_ZAPIER } },
  );
  assert.equal(badInput.statusCode, 400);

  let seenAuthHeader = '';
  const sseOk = await zapier.callZapierMcpTool(
    {
      toolName: 'calendar_find_event',
      actionCategory: 'read_only',
      arguments: { q: 'Otzarreta' },
    },
    {
      env: { ZAPIER_MCP_TOKEN: CANARY_ZAPIER },
      transport: {
        async send(req) {
          seenAuthHeader = req.headers.Authorization ?? '';
          assert.equal(req.url, zapier.ZAPIER_MCP_ENDPOINT);
          return {
            status: 200,
            headers: {
              get: (name) =>
                name.toLowerCase() === 'content-type'
                  ? 'text/event-stream'
                  : name.toLowerCase() === 'mcp-session-id'
                    ? 'sess-123'
                    : null,
            },
            text:
              'event: message\n' +
              'data: {"jsonrpc":"2.0","id":"1","result":{"content":[{"type":"text","text":"ok"}]}}\n\n',
          };
        },
      },
    },
  );
  assert.equal(seenAuthHeader, `Bearer ${CANARY_ZAPIER}`);
  assert.equal(sseOk.ok, true);
  assert.equal(sseOk.mode, 'REAL');
  assert.equal(sseOk.data?.sessionId, 'sess-123');
  assert.equal(JSON.stringify(sseOk).includes(CANARY_ZAPIER), false);

  const badUpstream = await zapier.listZapierMcpTools({
    env: { ZAPIER_MCP_TOKEN: CANARY_ZAPIER },
    transport: {
      async send() {
        return {
          status: 200,
          headers: { get: () => 'application/json' },
          text: JSON.stringify({
            jsonrpc: '2.0',
            id: '1',
            result: { tools: [], unexpectedField: 'boom' },
          }),
        };
      },
    },
  });
  assert.equal(badUpstream.ok, false);
  assert.equal(badUpstream.statusCode, 502);
  assert.equal(badUpstream.errorCode, 'ZAPIER_INVALID_PAYLOAD');

  // ZAPIER_MCP_URL SSRF/invalid endpoint returns 400 ZAPIER_INVALID_ENDPOINT before 503 UNCONFIGURED
  const ssrfEndpointList = await zapier.listZapierMcpTools({
    env: { ZAPIER_MCP_URL: 'https://127.0.0.1/connect' },
  });
  assert.equal(ssrfEndpointList.ok, false);
  assert.equal(ssrfEndpointList.statusCode, 400);
  assert.equal(ssrfEndpointList.errorCode, 'ZAPIER_INVALID_ENDPOINT');

  const ssrfEndpointCall = await zapier.callZapierMcpTool(
    { toolName: 'calendar_find_event', actionCategory: 'read_only' },
    { env: { ZAPIER_MCP_TOKEN: CANARY_ZAPIER, ZAPIER_MCP_URL: 'https://evil.com/connect' } },
  );
  assert.equal(ssrfEndpointCall.ok, false);
  assert.equal(ssrfEndpointCall.statusCode, 400);
  assert.equal(ssrfEndpointCall.errorCode, 'ZAPIER_INVALID_ENDPOINT');

  // SSE parser preserves valid JSON-RPC response before trailing notification & ignores non-JSON pings
  const sseTrailingNotif = await zapier.callZapierMcpTool(
    {
      toolName: 'calendar_find_event',
      actionCategory: 'read_only',
      arguments: { q: 'Derio' },
    },
    {
      env: { ZAPIER_MCP_TOKEN: CANARY_ZAPIER },
      transport: {
        async send() {
          return {
            status: 200,
            headers: {
              get: (name) =>
                name.toLowerCase() === 'content-type' ? 'text/event-stream' : null,
            },
            text:
              'event: ping\n' +
              'data: keepalive\n\n' +
              'event: message\n' +
              'data: {"jsonrpc":"2.0","id":"1","result":{"content":[{"type":"text","text":"ok-preserved"}]}}\n\n' +
              'event: notification\n' +
              'data: {"jsonrpc":"2.0","method":"notifications/progress","params":{"progress":100}}\n\n' +
              'data: [DONE]\n\n',
          };
        },
      },
    },
  );
  assert.equal(sseTrailingNotif.ok, true);
  assert.equal(sseTrailingNotif.data?.result.content[0]?.text, 'ok-preserved');
});

// 8. Kling/fal.ai Adapter: fail-closed, anti-SSRF, honest VideoJobReceipt, direct provider
await check('kling-fal-adapter: fails closed UNCONFIGURED, rejects SSRF, returns honest VideoJobReceipt', async () => {
  assert.equal(kling.checkKlingFalReadiness({}).configured, false);

  const unconf = await kling.submitKlingFalVideoJob(
    {
      operation: 'image-to-video',
      prompt: 'Plano cinematográfico de txalaparta en Derio',
      imageUrl: 'https://cdn.productoraear.com/images/otzarreta.jpg',
    },
    { env: {} },
  );
  assert.equal(unconf.statusCode, 503);
  assert.equal(unconf.mode, 'UNCONFIGURED');

  const ssrfInputs = [
    'http://cdn.productoraear.com/a.jpg',
    'javascript:alert(1)',
    'data:image/png;base64,AAAA',
    'https://127.0.0.1/a.jpg',
    'https://169.254.169.254/latest/meta-data',
    'https://192.168.1.50/a.jpg',
    'https://localhost/a.jpg',
  ];
  for (const mediaUrl of ssrfInputs) {
    const rejected = await kling.submitKlingFalVideoJob(
      {
        operation: 'image-to-video',
        prompt: 'test',
        imageUrl: mediaUrl,
      },
      { env: { FAL_KEY: CANARY_FAL } },
    );
    assert.equal(rejected.ok, false);
    assert.equal(rejected.statusCode, 400, `Expected 400 SSRF rejection for ${mediaUrl}`);
  }

  const invalidBaseUrl = await kling.submitKlingFalVideoJob(
    {
      provider: 'kling-direct',
      operation: 'image-to-video',
      prompt: 'test base url precedence',
      imageUrl: 'https://cdn.productoraear.com/images/otzarreta.jpg',
    },
    {
      env: { KLING_API_BASE_URL: 'https://127.0.0.1' },
    },
  );
  assert.equal(invalidBaseUrl.ok, false);
  assert.equal(invalidBaseUrl.statusCode, 400);
  assert.equal(invalidBaseUrl.errorCode, 'KLING_INVALID_BASE_URL');

  let hitlBlockedTransportCalls = 0;
  for (const approval of [undefined, false]) {
    const hitlBlocked = await kling.submitKlingFalVideoJob(
      {
        operation: 'image-to-video',
        prompt: 'Escena bloqueada por HITL sin aprobación humana',
        imageUrl: 'https://cdn.productoraear.com/images/otzarreta.jpg',
        ...(approval === false ? { humanApproved: false } : {}),
      },
      {
        env: { FAL_KEY: CANARY_FAL },
        transport: {
          async send() {
            hitlBlockedTransportCalls += 1;
            throw new Error('Transport must not be called when HITL blocks');
          },
        },
      },
    );
    assert.equal(hitlBlocked.ok, false);
    assert.equal(hitlBlocked.statusCode, 403);
    assert.equal(hitlBlocked.mode, 'HITL_BLOCKED');
    assert.equal(hitlBlocked.errorCode, '25_REVIEW');
  }
  assert.equal(hitlBlockedTransportCalls, 0);

  let seenFalAuth = '';
  const queued = await kling.submitKlingFalVideoJob(
    {
      operation: 'reference-to-video',
      prompt: 'Escena Otzarreta Derio atardecer',
      referenceImageUrls: ['https://cdn.productoraear.com/images/ref1.jpg'],
      humanApproved: true,
    },
    {
      env: { FAL_KEY: CANARY_FAL },
      transport: {
        async send(req) {
          seenFalAuth = req.headers.Authorization ?? '';
          assert.equal(
            req.url,
            'https://queue.fal.run/fal-ai/kling-video/o1/standard/reference-to-video',
          );
          return {
            status: 200,
            headers: { get: () => 'application/json' },
            text: JSON.stringify({
              request_id: 'req-fal-001',
              status: 'IN_QUEUE',
              status_url: 'https://queue.fal.run/requests/req-fal-001/status',
            }),
          };
        },
      },
    },
  );
  assert.equal(seenFalAuth, `Key ${CANARY_FAL}`);
  assert.equal(queued.ok, true);
  assert.equal(queued.data?.status, 'queued');
  assert.equal(queued.data?.videoUrl, null);
  assert.equal(JSON.stringify(queued).includes(CANARY_FAL), false);

  const directOk = await kling.submitKlingFalVideoJob(
    {
      provider: 'kling-direct',
      operation: 'video-to-video/edit',
      prompt: 'Añadir luz cálida institucional',
      videoUrl: 'https://cdn.productoraear.com/video/clip.mp4',
      humanApproved: true,
    },
    {
      env: {
        KLING_ACCESS_KEY: 'kling_ak_123',
        KLING_SECRET_KEY: CANARY_KLING,
      },
      transport: {
        async send(req) {
          assert.ok((req.headers.Authorization ?? '').startsWith('Bearer '));
          return {
            status: 200,
            headers: { get: () => 'application/json' },
            text: JSON.stringify({
              code: 0,
              data: { task_id: 'kling-task-99', task_status: 'submitted' },
            }),
          };
        },
      },
    },
  );
  assert.equal(directOk.ok, true);
  assert.equal(directOk.data?.provider, 'kling-direct');
  assert.equal(directOk.data?.videoUrl, null);
  assert.equal(JSON.stringify(directOk).includes(CANARY_KLING), false);
});

// 9. Capabilities Registry & /api/integrations/readiness route
await check('capabilities-registry & readiness route: AF-1 compliant, fail-closed prod, zero secret leakage', async () => {
  const snap = registry.getCapabilitiesRegistrySnapshot({
    env: {
      GOOGLE_WORKSPACE_CLIENT_ID: 'cid',
      GOOGLE_WORKSPACE_CLIENT_SECRET: CANARY_GWS,
      GOOGLE_WORKSPACE_REFRESH_TOKEN: 'rtok',
      ZAPIER_MCP_TOKEN: CANARY_ZAPIER,
      FAL_KEY: CANARY_FAL,
      KLING_SECRET_KEY: CANARY_KLING,
    },
  });
  assert.equal(snap.ok, true);
  assert.equal(snap.probed, true);
  assert.equal(snap.source, 'live');
  assert.equal(snap.mode, 'REAL');
  assert.equal(snap.summary.adaptersTotal, 3);
  assert.equal(snap.summary.adaptersReady, 3);
  assert.ok(snap.skillsAlignment.localSkillsPresent.length >= 7);

  const snapJson = JSON.stringify(snap);
  for (const secret of [CANARY_GWS, CANARY_ZAPIER, CANARY_FAL, CANARY_KLING]) {
    assert.equal(snapJson.includes(secret), false, 'Snapshot must never leak env secrets');
  }

  const prevNodeEnv = process.env.NODE_ENV;
  const prevCron = process.env.CRON_SECRET;
  const prevFal = process.env.FAL_KEY;
  try {
    process.env.FAL_KEY = CANARY_FAL;

    // Dev bypass when CRON_SECRET unset and NODE_ENV=development
    process.env.NODE_ENV = 'development';
    delete process.env.CRON_SECRET;
    const devRes = await route.GET(
      new NextRequest('http://localhost:3000/api/integrations/readiness'),
    );
    assert.equal(devRes.status, 200);
    assert.match(devRes.headers.get('cache-control') ?? '', /no-store/i);
    const devBody = await devRes.text();
    assert.equal(devBody.includes(CANARY_FAL), false);
    const devJson = JSON.parse(devBody);
    assert.equal(devJson.probed, true);
    assert.equal(devJson.mode, 'REAL');

    // Production fail-closed without auth (503 when CRON_SECRET unset, 401 when set)
    process.env.NODE_ENV = 'production';
    const prodNoSecret = await route.GET(
      new NextRequest('http://localhost:3000/api/integrations/readiness'),
    );
    assert.equal(prodNoSecret.status, 503);

    process.env.CRON_SECRET = 'cron_canary_secret_for_readiness_verification_32chars';
    const prodUnauth = await route.GET(
      new NextRequest('http://localhost:3000/api/integrations/readiness'),
    );
    assert.equal(prodUnauth.status, 401);

    const prodAuth = await route.GET(
      new NextRequest('http://localhost:3000/api/integrations/readiness?adapter=kling-fal', {
        headers: {
          Authorization: `Bearer ${process.env.CRON_SECRET}`,
        },
      }),
    );
    assert.equal(prodAuth.status, 200);
    const prodJson = await prodAuth.json();
    assert.equal(prodJson.adapters.length, 1);
    assert.equal(prodJson.adapters[0].adapterId, 'kling-fal');
    assert.equal(JSON.stringify(prodJson).includes(CANARY_FAL), false);

    // Invalid query rejected with 400
    const badQuery = await route.GET(
      new NextRequest('http://localhost:3000/api/integrations/readiness?unknown=1', {
        headers: {
          Authorization: `Bearer ${process.env.CRON_SECRET}`,
        },
      }),
    );
    assert.equal(badQuery.status, 400);

    // POST returns 405 Allow: GET
    const postRes = await route.POST();
    assert.equal(postRes.status, 405);
    assert.equal(postRes.headers.get('allow'), 'GET');
  } finally {
    if (prevNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = prevNodeEnv;
    if (prevCron === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = prevCron;
    if (prevFal === undefined) delete process.env.FAL_KEY;
    else process.env.FAL_KEY = prevFal;
  }
});

console.log(`ALL_INTEGRATION_ADAPTER_CHECKS_PASSED (${passed}/${passed})`);
