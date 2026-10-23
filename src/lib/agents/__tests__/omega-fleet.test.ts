/**
 * OMEGA FLEET — TEST DE AUDITORÍA DE HUÉRFANOS (Ω-Diamante, scorecard 20/20).
 * ----------------------------------------------------------------------------
 * Verifica que:
 *   1. Todo `AgentId` del roster tiene handler registrado (0 huérfanos).
 *   2. El censo es íntegro (48 agentes, 6 divisiones, sin duplicados).
 *   3. La traza end-to-end de gestión de carrera 360° delega sin rechazos.
 *
 * Ejecución: npx tsx src/lib/agents/__tests__/omega-fleet.test.ts
 * Salida: Exit Code 0 si todas las aserciones pasan.
 */
import assert from 'node:assert/strict';
import { createOmegaFleet, OMEGA_FLEET_ROSTER, OMEGA_DIVISION_COUNT } from '../omegaFleet';
import type { AgentId } from '../agentBus';
import { isKillSwitchActive } from '../killSwitch';

// Aísla el test de la red: los despachos n8n fallan rápido (conexión rechazada).
process.env.N8N_BASE_URL = 'http://127.0.0.1:9';

let passed = 0;

async function check(label: string, fn: () => void | Promise<void>): Promise<void> {
  await fn();
  passed += 1;
  console.log(`  ✓ ${label}`);
}

async function main(): Promise<void> {
  console.log('OMEGA FLEET — Auditoría de huérfanos y estándar Ω-Diamante');

  const bus = createOmegaFleet();
  const rosterIds: readonly AgentId[] = OMEGA_FLEET_ROSTER.map((spec) => spec.id);

  await check(`roster con ${OMEGA_FLEET_ROSTER.length} agentes en ${OMEGA_DIVISION_COUNT} divisiones`, () => {
    assert.equal(OMEGA_FLEET_ROSTER.length, 48);
    assert.equal(OMEGA_DIVISION_COUNT, 6);
  });

  await check('0 huérfanos: todo AgentId del roster tiene handler registrado', () => {
    const orphans = rosterIds.filter((id) => !bus.hasHandler(id));
    assert.deepEqual(orphans, []);
  });

  await check('el censo no contiene IDs duplicados', () => {
    assert.equal(new Set(rosterIds).size, rosterIds.length);
  });

  await check('las 6 divisiones tienen el tamaño esperado (8/8/8/8/6/10)', () => {
    const counts = new Map<string, number>();
    for (const spec of OMEGA_FLEET_ROSTER) {
      counts.set(spec.division, (counts.get(spec.division) ?? 0) + 1);
    }
    assert.equal(counts.get('Comercial'), 8);
    assert.equal(counts.get('Técnica'), 8);
    assert.equal(counts.get('Jurídica/B2G/Financiera'), 8);
    assert.equal(counts.get('VIMUME/B2B'), 8);
    assert.equal(counts.get('Sector'), 6);
    assert.equal(counts.get('Artist Career'), 10);
  });

  if (isKillSwitchActive()) {
    console.log('  ⚠ Kill-switch ACTIVO (.antigravity/STOP): se omite la prueba de traza end-to-end.');
  } else {
    await check('traza end-to-end de gestión de carrera 360° sin rechazos', async () => {
      const trace = await bus.send('omni-supervisor-daemon', 'artist-career-manager', 'manage_career', {
        artistName: 'Artista Test',
        monthlyListeners: 120000,
        socialFollowers: 50000,
        liveGigsPerYear: 24,
        catalogSize: 12,
        ownsMasters: true,
        hasLegalEntity: true,
      });
      const rejected = trace.filter((t) => t.rejected).map((t) => t.rejected);
      assert.deepEqual(rejected, []);
      const destinations = trace.map((t) => t.message.to);
      assert.ok(destinations.includes('artist-scout'), 'debe delegar en artist-scout');
      assert.ok(destinations.includes('release-strategist'), 'debe delegar en release-strategist');
      assert.ok(destinations.includes('business-affairs-agent'), 'debe delegar en business-affairs-agent');
    });

    await check('traza de pricing SSOT sin rechazos', async () => {
      const trace = await bus.send('supervisor', 'logistics-pricer', 'quote_solo', {
        distanceKm: 120,
        endHour: 3,
      });
      assert.ok(trace.length >= 1, 'la traza debe contener al menos un paso');
      assert.equal(trace[0].rejected, undefined);
      assert.equal(trace[0].reply?.ok, true);
    });
  }

  console.log(
    `\n✅ OMEGA FLEET OK — ${passed} aserciones superadas · ${OMEGA_FLEET_ROSTER.length} agentes · 0 huérfanos`,
  );
  process.exit(0);
}

void main().catch((err: unknown) => {
  console.error('❌ Fallo en auditoría de flota:', err instanceof Error ? err.message : err);
  process.exit(1);
});
