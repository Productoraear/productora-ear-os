/**
 * ════════════════════════════════════════════════════════════════════════════
 * W52_T02 · ARNÉS AUTOMATIZADO DE VERIFICACIÓN S-CLASS (EAR OS V2)
 * ARTIST ACHIEVEMENT LEDGER & NEGATIVE-FIRST SECURITY GATES
 * ════════════════════════════════════════════════════════════════════════════
 * Invariantes Verificados:
 *   1. Caso negativo 401 en peticiones anónimas (GET y POST) y 403 cross-tenant.
 *   2. Rechazo estricto de evidencia sin verificador (SIN_VERIFICADOR),
 *      autoverificada (AUTOVERIFICADA), fecha inválida (FECHA_INVALIDA),
 *      tipo desconocido (TIPO_DESCONOCIDO) y módulo desconocido (MODULO_DESCONOCIDO).
 *   3. Lectura determinista y cadena criptográfica SHA-256 append-only inmutable.
 *   4. Segregación estricta de vista pública (?public=true) con cero filtración
 *      de registros pendientes o rechazados.
 *   5. Resiliencia de base de datos con classifyDbFailure, cero cifras fabricadas
 *      y cero filtración de secretos/credenciales.
 *   6. Conformidad estricta TypeScript (0 any) y directivas App Router Next.js 16.
 *
 * Salida Contractual Requerida:
 *   ACHIEVEMENT_LEDGER_ASSERTIONS=<n>
 *   ACHIEVEMENT_LEDGER_FAILURES=0
 *   ACHIEVEMENT_LEDGER_RESULT=PASS
 * ════════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NextRequest } from 'next/server';
import {
  appendAchievementEvidence,
  recordAchievement,
  getArtistAchievements,
  getAchievementsByArtist,
  computeRecordHash,
  computeEntryHash,
  validateEvidenceInput,
  clearLedgerForTesting,
  reloadStoreFromDisk,
  type AchievementLedgerEntry,
} from '../src/lib/academy/achievement-ledger';
import { GET, POST } from '../src/app/api/artist/achievements/route';
import { classifyDbFailure } from '../src/lib/db/dbFailureClassifier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Usar almacén aislado para pruebas deterministas
const TEST_STORE_PATH = path.join(projectRoot, '.data', 'test-artist-achievements-ledger.json');
process.env.EAR_ACHIEVEMENT_LEDGER_STORE = TEST_STORE_PATH;

interface Metrics {
  assertions: number;
  failures: number;
  failureDetails: string[];
}

const metrics: Metrics = {
  assertions: 0,
  failures: 0,
  failureDetails: [],
};

function assert(condition: boolean, label: string): void {
  metrics.assertions += 1;
  if (condition) {
    console.log(`  [PASS] ${label}`);
  } else {
    metrics.failures += 1;
    metrics.failureDetails.push(label);
    console.error(`  [FAIL] ${label}`);
  }
}

function createMockRequest(
  url: string,
  options?: {
    method?: string;
    headers?: Record<string, string>;
    body?: unknown;
    rawBody?: string;
  }
): NextRequest {
  const reqHeaders = new Headers(options?.headers || {});
  if (options?.body !== undefined && !reqHeaders.has('content-type')) {
    reqHeaders.set('content-type', 'application/json');
  }

  let bodyPayload: BodyInit | undefined;
  if (options?.rawBody !== undefined) {
    bodyPayload = options.rawBody;
  } else if (options?.body !== undefined) {
    bodyPayload = JSON.stringify(options.body);
  }

  const reqInit: RequestInit = {
    method: options?.method || 'GET',
    headers: reqHeaders,
    body: bodyPayload,
  };

  return new NextRequest(new URL(url, 'http://localhost:3000'), reqInit);
}

async function runSuites(): Promise<void> {
  console.log('\n════════════════════════════════════════════════════════════════════');
  console.log(' INICIO DE AUDITORÍA S-CLASS: ARTIST ACHIEVEMENT LEDGER');
  console.log('════════════════════════════════════════════════════════════════════\n');

  // Limpiar fixture previo
  try {
    if (fs.existsSync(TEST_STORE_PATH)) {
      fs.unlinkSync(TEST_STORE_PATH);
    }
  } catch {}
  clearLedgerForTesting();

  // ────────────────────────────────────────────────────────────────────────────
  // SUITE 1: AUTHENTICATION & AUTHORIZATION (NEGATIVE CASE HTTP 401 & 403)
  // ────────────────────────────────────────────────────────────────────────────
  console.log('[SUITE 1] Autenticación y Autorización (Caso Negativo 401 & 403)');

  // 1.1: GET privado sin credenciales -> HTTP 401
  {
    const req = createMockRequest('http://localhost:3000/api/artist/achievements?artistSlug=edwin-agudelo');
    const res = await GET(req);
    const json = (await res.json()) as { ok?: boolean; error?: string };
    assert(res.status === 401, '1.1 GET privado sin sesión devuelve HTTP 401');
    assert(json.ok === false && json.error === 'UNAUTHORIZED', '1.1 GET privado sin sesión devuelve error UNAUTHORIZED');
  }

  // 1.2: GET explícito public=false sin credenciales -> HTTP 401
  {
    const req = createMockRequest('http://localhost:3000/api/artist/achievements?artistSlug=edwin-agudelo&public=false');
    const res = await GET(req);
    assert(res.status === 401, '1.2 GET con public=false sin sesión devuelve HTTP 401');
  }

  // 1.3: POST sin credenciales -> HTTP 401
  {
    const req = createMockRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      body: {
        artistSlug: 'edwin-agudelo',
        achievementId: 'ach-001',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
        verifiedBy: 'mentor-test',
      },
    });
    const res = await POST(req);
    const json = (await res.json()) as { ok?: boolean; error?: string };
    assert(res.status === 401, '1.3 POST sin sesión devuelve HTTP 401');
    assert(json.ok === false && json.error === 'UNAUTHORIZED', '1.3 POST sin sesión devuelve error UNAUTHORIZED');
  }

  // 1.4: POST con Bearer token inválido -> HTTP 401
  {
    const req = createMockRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: {
        authorization: 'Bearer invalid_forged_token',
      },
      body: {
        artistSlug: 'edwin-agudelo',
        achievementId: 'ach-001',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
        verifiedBy: 'mentor-test',
      },
    });
    const res = await POST(req);
    assert(res.status === 401, '1.4 POST con token inválido devuelve HTTP 401');
  }

  // 1.5: GET con cabeceras de artista válidas -> HTTP 200
  {
    const req = createMockRequest('http://localhost:3000/api/artist/achievements?artistSlug=edwin-agudelo', {
      headers: {
        'x-artist-slug': 'edwin-agudelo',
        'x-artist-token': 'token_artista_valido_sclass',
      },
    });
    const res = await GET(req);
    const json = (await res.json()) as { ok?: boolean; artistSlug?: string };
    assert(res.status === 200, '1.5 GET con credenciales de artista devuelve HTTP 200');
    assert(json.ok === true && json.artistSlug === 'edwin-agudelo', '1.5 GET devuelve datos del artista solicitado');
  }

  // 1.6: GET privado de otro artista con rol no-admin -> HTTP 403 Forbidden
  {
    const req = createMockRequest('http://localhost:3000/api/artist/achievements?artistSlug=otro-artista', {
      headers: {
        'x-artist-slug': 'edwin-agudelo',
        'x-artist-token': 'token_artista_valido_sclass',
      },
    });
    const res = await GET(req);
    const json = (await res.json()) as { ok?: boolean; error?: string };
    assert(res.status === 403, '1.6 GET privado de otro artista devuelve HTTP 403');
    assert(json.error === 'FORBIDDEN', '1.6 GET cruzado devuelve error FORBIDDEN');
  }

  // 1.7: POST para otro artista como no-admin -> HTTP 403 Forbidden
  {
    const req = createMockRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: {
        'x-artist-slug': 'edwin-agudelo',
        'x-artist-token': 'token_artista_valido_sclass',
      },
      body: {
        artistSlug: 'otro-artista',
        achievementId: 'ach-002',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
        verifiedBy: 'mentor-test',
      },
    });
    const res = await POST(req);
    assert(res.status === 403, '1.7 POST para otro artista devuelve HTTP 403');
  }

  // 1.8: GET privado con x-artist-slug sin token -> HTTP 401 (Anti-Spoofing)
  {
    const req = createMockRequest('http://localhost:3000/api/artist/achievements?artistSlug=edwin-agudelo', {
      headers: {
        'x-artist-slug': 'edwin-agudelo',
      },
    });
    const res = await GET(req);
    const json = (await res.json()) as { ok?: boolean; error?: string };
    assert(res.status === 401, '1.8 GET con x-artist-slug sin token devuelve HTTP 401');
    assert(json.error === 'UNAUTHORIZED', '1.8 GET con x-artist-slug sin token devuelve UNAUTHORIZED');
  }

  // 1.9: GET privado con x-ear-role: admin sin secreto -> HTTP 401 (Anti-Role-Spoofing)
  {
    const req = createMockRequest('http://localhost:3000/api/artist/achievements?artistSlug=edwin-agudelo', {
      headers: {
        'x-ear-role': 'admin',
      },
    });
    const res = await GET(req);
    const json = (await res.json()) as { ok?: boolean; error?: string };
    assert(res.status === 401, '1.9 GET con x-ear-role sin token devuelve HTTP 401');
    assert(json.error === 'UNAUTHORIZED', '1.9 GET con x-ear-role sin token devuelve UNAUTHORIZED');
  }

  // 1.10: POST con x-artist-slug sin token -> HTTP 401 (Anti-Spoofing)
  {
    const req = createMockRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: {
        'x-artist-slug': 'edwin-agudelo',
      },
      body: {
        artistSlug: 'edwin-agudelo',
        achievementId: 'ach-spoof-01',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
        verifiedBy: 'mentor-test',
      },
    });
    const res = await POST(req);
    const json = (await res.json()) as { ok?: boolean; error?: string };
    assert(res.status === 401, '1.10 POST con x-artist-slug sin token devuelve HTTP 401');
    assert(json.error === 'UNAUTHORIZED', '1.10 POST con x-artist-slug sin token devuelve UNAUTHORIZED');
  }

  // 1.11: POST con x-ear-role: admin sin token -> HTTP 401 (Anti-Role-Spoofing)
  {
    const req = createMockRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: {
        'x-ear-role': 'admin',
      },
      body: {
        artistSlug: 'edwin-agudelo',
        achievementId: 'ach-spoof-02',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
        verifiedBy: 'mentor-test',
      },
    });
    const res = await POST(req);
    const json = (await res.json()) as { ok?: boolean; error?: string };
    assert(res.status === 401, '1.11 POST con x-ear-role sin token devuelve HTTP 401');
    assert(json.error === 'UNAUTHORIZED', '1.11 POST con x-ear-role sin token devuelve UNAUTHORIZED');
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SUITE 2: EVIDENCE VERIFICATION & ANTI-FRAUD RULES (HTTP 422)
  // ────────────────────────────────────────────────────────────────────────────
  console.log('\n[SUITE 2] Reglas Antifraude y Validación de Evidencias (HTTP 422)');

  const adminHeaders = {
    'x-ear-role': 'admin',
    authorization: 'Bearer ear_admin_master_sclass',
  };

  // 2.1: Logro sin verifiedBy -> HTTP 422 SIN_VERIFICADOR
  {
    const req = createMockRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: adminHeaders,
      body: {
        artistSlug: 'edwin-agudelo',
        achievementId: 'ach-fraud-01',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
      },
    });
    const res = await POST(req);
    const json = (await res.json()) as { ok?: boolean; error?: string; reason?: string };
    assert(res.status === 422, '2.1 Evidencia sin verifiedBy devuelve HTTP 422');
    assert(json.reason === 'SIN_VERIFICADOR', '2.1 Motivo de rechazo es SIN_VERIFICADOR');
  }

  // 2.2: Logro con verifiedBy en blanco -> HTTP 422 SIN_VERIFICADOR
  {
    const req = createMockRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: adminHeaders,
      body: {
        artistSlug: 'edwin-agudelo',
        achievementId: 'ach-fraud-02',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
        verifiedBy: '     ',
      },
    });
    const res = await POST(req);
    const json = (await res.json()) as { ok?: boolean; error?: string; reason?: string };
    assert(res.status === 422, '2.2 Evidencia con verifiedBy whitespace devuelve HTTP 422');
    assert(json.reason === 'SIN_VERIFICADOR', '2.2 Motivo de rechazo whitespace es SIN_VERIFICADOR');
  }

  // 2.3: Autoverificación (verifiedBy === artistSlug) -> HTTP 422 AUTOVERIFICADA
  {
    const req = createMockRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: adminHeaders,
      body: {
        artistSlug: 'edwin-agudelo',
        achievementId: 'ach-fraud-03',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'mentor_review',
        verifiedBy: 'EDWIN-AGUDELO',
      },
    });
    const res = await POST(req);
    const json = (await res.json()) as { ok?: boolean; error?: string; reason?: string };
    assert(res.status === 422, '2.3 Autoverificación (case-insensitive) devuelve HTTP 422');
    assert(json.reason === 'AUTOVERIFICADA', '2.3 Motivo de rechazo es AUTOVERIFICADA');
  }

  // 2.4: Fecha inválida ('ayer') -> HTTP 422 FECHA_INVALIDA
  {
    const req = createMockRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: adminHeaders,
      body: {
        artistSlug: 'edwin-agudelo',
        achievementId: 'ach-fraud-04',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'exercise',
        verifiedBy: 'mentor-edwin-agudelo',
        verifiedAt: 'ayer_por_la_tarde',
      },
    });
    const res = await POST(req);
    const json = (await res.json()) as { ok?: boolean; error?: string; reason?: string };
    assert(res.status === 422, '2.4 Fecha inválida devuelve HTTP 422');
    assert(json.reason === 'FECHA_INVALIDA', '2.4 Motivo de rechazo es FECHA_INVALIDA');
  }

  // 2.5: Tipo desconocido ('payment_bribe') -> HTTP 422 TIPO_DESCONOCIDO
  {
    const req = createMockRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: adminHeaders,
      body: {
        artistSlug: 'edwin-agudelo',
        achievementId: 'ach-fraud-05',
        moduleId: 't66-m1-ikigai',
        evidenceKind: 'payment_bribe',
        verifiedBy: 'mentor-edwin-agudelo',
      },
    });
    const res = await POST(req);
    const json = (await res.json()) as { ok?: boolean; error?: string; reason?: string };
    assert(res.status === 422, '2.5 Tipo desconocido devuelve HTTP 422');
    assert(json.reason === 'TIPO_DESCONOCIDO', '2.5 Motivo de rechazo es TIPO_DESCONOCIDO');
  }

  // 2.6: Módulo desconocido ('modulo-inexistente') -> HTTP 422 MODULO_DESCONOCIDO
  {
    const req = createMockRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: adminHeaders,
      body: {
        artistSlug: 'edwin-agudelo',
        achievementId: 'ach-fraud-06',
        moduleId: 'modulo-inexistente-123',
        evidenceKind: 'exercise',
        verifiedBy: 'mentor-edwin-agudelo',
      },
    });
    const res = await POST(req);
    const json = (await res.json()) as { ok?: boolean; error?: string; reason?: string };
    assert(res.status === 422, '2.6 Módulo desconocido devuelve HTTP 422');
    assert(json.reason === 'MODULO_DESCONOCIDO', '2.6 Motivo de rechazo es MODULO_DESCONOCIDO');
  }

  // 2.7: Evidencia verificada legítima -> HTTP 201
  {
    const req = createMockRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: adminHeaders,
      body: {
        artistSlug: 'edwin-agudelo',
        achievementId: 'ach-legit-01',
        title: 'Taller Ikigai Verificado',
        moduleId: 't66-m1-ikigai',
        trackId: 'track66',
        evidenceKind: 'exercise',
        evidencePayload: { score: 100 },
        verifiedBy: 'mentor-director-ear',
        verifiedAt: '2026-11-09T10:00:00.000Z',
      },
    });
    const res = await POST(req);
    const json = (await res.json()) as { ok?: boolean; entry?: AchievementLedgerEntry };
    assert(res.status === 201, '2.7 Evidencia legítima devuelve HTTP 201 Created');
    assert(json.ok === true && json.entry?.status === 'VERIFIED', '2.7 Registro emitido con estado VERIFIED');
    assert(json.entry?.verifiedBy === 'mentor-director-ear', '2.7 Verificador correctamente asignado');
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SUITE 3: DETERMINISTIC READS & IMMUTABILITY (SHA-256 APPEND-ONLY CHAIN)
  // ────────────────────────────────────────────────────────────────────────────
  console.log('\n[SUITE 3] Lecturas Deterministas e Inmutabilidad Criptográfica SHA-256');

  // Insertar un segundo registro legítimo para comprobar encadenamiento
  const entry2 = await recordAchievement({
    artistSlug: 'edwin-agudelo',
    achievementId: 'ach-legit-02',
    title: 'Rueda de la Vida Verificada',
    moduleId: 't66-m2-rueda-vida',
    trackId: 'track66',
    evidenceKind: 'exercise',
    evidencePayload: { score: 95 },
    verifiedBy: 'mentor-director-ear',
    verifiedAt: '2026-11-09T11:00:00.000Z',
  });

  // 3.1: Lecturas consecutivas son byte-for-byte idénticas
  {
    const r1 = await getArtistAchievements('edwin-agudelo', { publicOnly: false });
    const r2 = await getArtistAchievements('edwin-agudelo', { publicOnly: false });
    const r3 = await getAchievementsByArtist('edwin-agudelo', { publicOnly: false });
    assert(
      JSON.stringify(r1) === JSON.stringify(r2) && JSON.stringify(r2) === JSON.stringify(r3),
      '3.1 Lecturas consecutivas producen exactamente la misma serialización JSON'
    );
  }

  // 3.2: Incremento monótono del entryIndex
  {
    const result = await getArtistAchievements('edwin-agudelo', { publicOnly: false });
    assert(result.achievements.length >= 2, '3.2 Existen al menos 2 registros en el ledger');
    const first = result.achievements[0];
    const second = result.achievements[1];
    assert(first.entryIndex === 1, '3.2 El primer registro tiene entryIndex 1');
    assert(second.entryIndex === 2, '3.2 El segundo registro tiene entryIndex 2 (monotonía estricta)');
  }

  // 3.3: SHA-256 matemáticamente reproducible con computeRecordHash
  {
    const result = await getArtistAchievements('edwin-agudelo', { publicOnly: false });
    const first = result.achievements[0];
    const recomputed = computeRecordHash(first);
    assert(recomputed === first.hash, '3.3 Hash SHA-256 coincide con computeRecordHash');
    assert(recomputed === first.sha256, '3.3 Alias sha256 coincide con el hash calculado');
  }

  // 3.4: Encadenamiento de hashes SHA-256 (genesis: 64 ceros; previousHash -> hash)
  {
    const result = await getArtistAchievements('edwin-agudelo', { publicOnly: false });
    const first = result.achievements[0];
    const second = result.achievements[1];
    assert(first.previousHash === '0'.repeat(64), '3.4 Registro génesis apunta a 64 ceros');
    assert(second.previousHash === first.hash, '3.4 Registro 2 apunta al hash exacto del registro 1 (cadena inmutable)');
  }

  // 3.5: Soporte append-only con supersedes
  {
    const updateEntry = await recordAchievement({
      artistSlug: 'edwin-agudelo',
      achievementId: 'ach-legit-02',
      title: 'Rueda de la Vida (Actualizada)',
      moduleId: 't66-m2-rueda-vida',
      trackId: 'track66',
      evidenceKind: 'exercise',
      verifiedBy: 'mentor-director-ear',
      supersedes: entry2.id,
    });
    const all = await getArtistAchievements('edwin-agudelo', { publicOnly: false });
    const withActive = await getArtistAchievements('edwin-agudelo', { publicOnly: false, activeOnly: true });
    assert(all.achievements.some((a) => a.id === entry2.id), '3.5 Registro original permanece intacto en historial');
    assert(all.achievements.some((a) => a.id === updateEntry.id), '3.5 Nuevo registro se anexa al historial');
    assert(!withActive.achievements.some((a) => a.id === entry2.id), '3.5 activeOnly resuelve la actualización suprimiendo el anterior');
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SUITE 4: PUBLIC VS PRIVATE SEGREGATION (ZERO-LEAKAGE INVARIANT)
  // ────────────────────────────────────────────────────────────────────────────
  console.log('\n[SUITE 4] Segregación Pública vs Privada (Cero Filtración)');

  const testArtist = 'artista-segregacion-test';

  // 4.1: Construir fixture con estados mixtos: 2 VERIFIED, 2 PENDING, 1 REJECTED
  await recordAchievement({
    artistSlug: testArtist,
    achievementId: 'ach-mix-01',
    moduleId: 't66-m1-ikigai',
    evidenceKind: 'exercise',
    status: 'VERIFIED',
    verifiedBy: 'mentor-test',
    verifiedAt: '2026-11-09T10:00:00.000Z',
  });
  await recordAchievement({
    artistSlug: testArtist,
    achievementId: 'ach-mix-02',
    moduleId: 't66-m2-rueda-vida',
    evidenceKind: 'exercise',
    status: 'VERIFIED',
    verifiedBy: 'mentor-test',
    verifiedAt: '2026-11-09T10:30:00.000Z',
  });
  await recordAchievement({
    artistSlug: testArtist,
    achievementId: 'ach-mix-03',
    moduleId: 't66-m3-marca-artistica',
    evidenceKind: 'exercise',
    status: 'PENDING_VERIFICATION',
    verifiedBy: null,
  });
  await recordAchievement({
    artistSlug: testArtist,
    achievementId: 'ach-mix-04',
    moduleId: 't66-m4-presencia-digital',
    evidenceKind: 'exercise',
    status: 'PENDING',
    verifiedBy: null,
  });
  await recordAchievement({
    artistSlug: testArtist,
    achievementId: 'ach-mix-05',
    moduleId: 't66-m5-primer-contrato',
    evidenceKind: 'metric',
    status: 'REJECTED',
    verifiedBy: 'mentor-test',
  });

  // 4.2: Consulta privada devuelve los 5 registros
  {
    const req = createMockRequest(`http://localhost:3000/api/artist/achievements?artistSlug=${testArtist}`, {
      headers: adminHeaders,
    });
    const res = await GET(req);
    const json = (await res.json()) as { ok?: boolean; achievements?: AchievementLedgerEntry[]; totalEntries?: number };
    assert(res.status === 200, '4.2 Consulta privada autenticada devuelve HTTP 200');
    assert(json.achievements?.length === 5, '4.2 Consulta privada devuelve los 5 registros completos');
  }

  // 4.3: Consulta pública (public=true) no requiere sesión (devuelve HTTP 200)
  {
    const req = createMockRequest(`http://localhost:3000/api/artist/achievements?artistSlug=${testArtist}&public=true`);
    const res = await GET(req);
    assert(res.status === 200, '4.3 Consulta pública devuelve HTTP 200 sin credenciales');
  }

  // 4.4: Consulta pública devuelve estrictamente los 2 registros VERIFICADOS
  {
    const req = createMockRequest(`http://localhost:3000/api/artist/achievements?artistSlug=${testArtist}&public=true`);
    const res = await GET(req);
    const json = (await res.json()) as {
      ok?: boolean;
      achievements?: AchievementLedgerEntry[];
      totalVisible?: number;
      verifiedCount?: number;
    };
    assert(json.achievements?.length === 2, '4.4 Consulta pública contiene exactamente 2 logros');
    assert(json.verifiedCount === 2, '4.4 verifiedCount reporta exactamente 2');
    assert(
      json.achievements?.every((a) => a.status === 'VERIFIED') === true,
      '4.5 El 100% de los logros devueltos en la vista pública tienen status VERIFIED'
    );
    assert(
      (json.achievements?.filter((a) => a.status !== 'VERIFIED').length ?? 0) === 0,
      '4.6 Cero filtración: 0 logros pendientes o rechazados filtrados a la vista pública'
    );
  }

  // 4.7: Consulta pública sin artistSlug devuelve HTTP 400
  {
    const req = createMockRequest('http://localhost:3000/api/artist/achievements?public=true');
    const res = await GET(req);
    assert(res.status === 400, '4.7 Consulta pública sin artistSlug devuelve HTTP 400');
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SUITE 5: DATABASE RESILIENCE & ANTI-FABRICATION (CLASSIFY_DB_FAILURE)
  // ────────────────────────────────────────────────────────────────────────────
  console.log('\n[SUITE 5] Resiliencia de Base de Datos y Cero Cifras Fabricadas');

  // 5.1: Clasificación de P1001 o ECONNREFUSED como DB_UNREACHABLE
  {
    const fakePrismaErr = {
      code: 'P1001',
      message: "Can't reach database server at 82.29.179.172:5432",
    };
    const report = classifyDbFailure(fakePrismaErr);
    assert(report.kind === 'DB_UNREACHABLE', '5.1 P1001 clasificado como DB_UNREACHABLE');
    assert(report.code === 'P1001', '5.1 Código de máquina preservado');
  }

  // 5.2: Clasificación de variable de entorno faltante como DB_URL_MISSING
  {
    const missingEnvErr = {
      message: 'Environment variable not found: POSTGRES_PRISMA_URL',
    };
    const report = classifyDbFailure(missingEnvErr);
    assert(report.kind === 'DB_URL_MISSING', '5.2 Variable faltante clasificada como DB_URL_MISSING');
  }

  // 5.3: Cero cifras fabricadas ante artista sin méritos registrados
  {
    const emptyResult = await getArtistAchievements('artista-inexistente-sin-logros', { publicOnly: true });
    assert(emptyResult.achievements.length === 0, '5.3 Lista de logros vacía para artista sin registros');
    assert(emptyResult.verifiedCount === 0, '5.3 verifiedCount es exactamente 0 (cero cifras inventadas)');
    assert(emptyResult.progressPct === 0, '5.3 progressPct es exactamente 0% (cero progreso inventado)');
    assert(emptyResult.completedModules.length === 0, '5.3 0 módulos completados');
  }

  // 5.4: Remediación accionable incluida en el reporte de error
  {
    const report = classifyDbFailure({ code: 'P1001' });
    assert(typeof report.action === 'string' && report.action.length >= 20, '5.4 Remediación contiene guía accionable');
  }

  // 5.5: Cero filtración de credenciales en classifyDbFailure
  {
    const sensitiveErr = {
      message: 'Connection failed to postgresql://postgres:super_secret_pw@db.productoraear.com:5432/ear_os',
    };
    const report = classifyDbFailure(sensitiveErr);
    const serialized = JSON.stringify(report);
    assert(!serialized.includes('super_secret_pw'), '5.5 Contraseña excluida del reporte');
    assert(!serialized.includes('postgresql://'), '5.5 URL de conexión excluida del reporte');
    assert(!serialized.includes('@db.productoraear.com'), '5.5 Host sensible excluido del reporte');
  }

  // 5.6: Persistencia offline en disco durable opera correctamente
  {
    await reloadStoreFromDisk();
    const diskResult = await getArtistAchievements(testArtist, { publicOnly: false });
    assert(diskResult.achievements.length === 5, '5.6 Persistencia en disco recargada sin pérdida de registros');
    assert(diskResult.storageMode === 'FALLBACK_OFFLINE_DISK', '5.6 Modo de almacenamiento declarado honestamente');
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SUITE 6: STATIC CODE QUALITY, SECURITY HEADERS & APP ROUTER STRICTNESS
  // ────────────────────────────────────────────────────────────────────────────
  console.log('\n[SUITE 6] Calidad Estática, Cabeceras de Seguridad y Directivas');

  const ledgerFilePath = path.join(projectRoot, 'src', 'lib', 'academy', 'achievement-ledger.ts');
  const routeFilePath = path.join(projectRoot, 'src', 'app', 'api', 'artist', 'achievements', 'route.ts');

  const ledgerSource = fs.readFileSync(ledgerFilePath, 'utf8');
  const routeSource = fs.readFileSync(routeFilePath, 'utf8');

  // 6.1: Cero ': any' en achievement-ledger.ts
  {
    const hasAny = /:\s*any\b/.test(ledgerSource);
    assert(!hasAny, '6.1 achievement-ledger.ts tiene 0 `: any`');
  }

  // 6.2: Cero ': any' en route.ts
  {
    const hasAny = /:\s*any\b/.test(routeSource);
    assert(!hasAny, '6.2 route.ts tiene 0 `: any`');
  }

  // 6.3: export const dynamic = 'force-dynamic' en route.ts
  {
    assert(
      routeSource.includes("export const dynamic = 'force-dynamic'"),
      "6.3 route.ts exporta dynamic = 'force-dynamic'"
    );
  }

  // 6.4: export const runtime = 'nodejs' en route.ts
  {
    assert(
      routeSource.includes("export const runtime = 'nodejs'"),
      "6.4 route.ts exporta runtime = 'nodejs'"
    );
  }

  // 6.5: Cabecera Cache-Control: no-store en respuestas
  {
    const req = createMockRequest(`http://localhost:3000/api/artist/achievements?artistSlug=${testArtist}`, {
      headers: adminHeaders,
    });
    const res = await GET(req);
    const cacheControl = res.headers.get('cache-control');
    assert(
      cacheControl !== null && cacheControl.includes('no-store'),
      '6.5 Respuesta incluye Cache-Control: no-store'
    );
  }

  // 6.6: Content-Type no-JSON en POST devuelve HTTP 415
  {
    const req = createMockRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: {
        'content-type': 'text/plain',
        'x-ear-role': 'admin',
      },
      rawBody: 'raw text payload',
    });
    const res = await POST(req);
    assert(res.status === 415, '6.6 POST con Content-Type text/plain devuelve HTTP 415');
  }

  // 6.7: Payload superior a 8192 bytes devuelve HTTP 413
  {
    const largeString = 'a'.repeat(9000);
    const req = createMockRequest('http://localhost:3000/api/artist/achievements', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-ear-role': 'admin',
      },
      rawBody: JSON.stringify({ huge: largeString }),
    });
    const res = await POST(req);
    assert(res.status === 413, '6.7 POST con payload > 8KB devuelve HTTP 413 Payload Too Large');
  }

  // Limpiar archivo de test temporal
  try {
    if (fs.existsSync(TEST_STORE_PATH)) {
      fs.unlinkSync(TEST_STORE_PATH);
    }
  } catch {}

  // ────────────────────────────────────────────────────────────────────────────
  // RESUMEN FINAL Y SALIDA CONTRACTUAL
  // ────────────────────────────────────────────────────────────────────────────
  console.log('\n════════════════════════════════════════════════════════════════════');
  console.log(` RESULTADO FINAL: ${metrics.failures === 0 ? 'PASS (VERDE)' : 'FAIL (ROJO)'}`);
  console.log(` Aserciones Evaluadas: ${metrics.assertions}`);
  console.log(` Fallos Detectados:    ${metrics.failures}`);
  console.log('════════════════════════════════════════════════════════════════════');

  console.log(`ACHIEVEMENT_LEDGER_ASSERTIONS=${metrics.assertions}`);
  console.log(`ACHIEVEMENT_LEDGER_FAILURES=${metrics.failures}`);

  if (metrics.failures > 0) {
    console.error('\nDETALLE DE FALLOS:');
    for (const f of metrics.failureDetails) {
      console.error(`  - ${f}`);
    }
    console.log('ACHIEVEMENT_LEDGER_RESULT=FAIL');
    process.exit(1);
  }

  console.log('ACHIEVEMENT_LEDGER_RESULT=PASS');
  process.exit(0);
}

runSuites().catch((err: unknown) => {
  console.error('[CRITICAL_UNHANDLED_EXCEPTION]:', err);
  console.log('ACHIEVEMENT_LEDGER_RESULT=FAIL');
  process.exit(1);
});
