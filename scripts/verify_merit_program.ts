/**
 * ════════════════════════════════════════════════════════════════════════════
 * W52_T01 · ARNÉS DEL PROGRAMA POR MÉRITO (66 / 99 DÍAS)
 * ════════════════════════════════════════════════════════════════════════════
 * Salida contractual:
 *   MERIT_ASSERTIONS=<n>
 *   MERIT_RESULT=PASS|FAIL
 * Exit 0 solo si todas las aserciones pasan.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  MERIT_PROGRAM_PRICING,
  MERIT_TRACKS,
  TRACK99_ENTRY_ASSESSMENT_ID,
  contentProvenanceSummary,
  describePendingEvidence,
  evaluateUnlock,
  type MeritEvidence,
} from '@/lib/academy/merit-program-ssot';

let assertions = 0;
const failures: string[] = [];

function check(condition: boolean, label: string): void {
  assertions += 1;
  if (!condition) failures.push(label);
}

const ARTIST = 'artista-prueba';
const MENTOR = 'mentor-edwin-agudelo';
const T = '2026-11-06T10:00:00.000Z';

const ev = (moduleId: string, kind: MeritEvidence['kind'], verifier = MENTOR, verifiedAt = T): MeritEvidence => ({
  moduleId,
  kind,
  verifier,
  verifiedAt,
});

// 1 · Estado inicial: solo el primer módulo de la pista 66 está abierto.
{
  const r = evaluateUnlock({ artistId: ARTIST, trackId: 'track66', evidence: [] });
  check(r.unlocked.length === 1 && r.unlocked[0] === 't66-m1-ikigai', 'inicio: solo Ikigai desbloqueado');
  check(r.completed.length === 0, 'inicio: nada completado');
  check(r.locked.length === MERIT_TRACKS.track66.modules.length - 1, 'inicio: resto bloqueado');
  check(r.progressPct === 0, 'inicio: progreso 0%');
}

// 2 · Caso negativo: evidencia sin verificador NO desbloquea.
{
  const r = evaluateUnlock({ artistId: ARTIST, trackId: 'track66', evidence: [ev('t66-m1-ikigai', 'exercise', '   ')] });
  check(!r.completed.includes('t66-m1-ikigai'), 'sin verificador: no completa');
  check(r.rejected.length === 1 && r.rejected[0].reason === 'SIN_VERIFICADOR', 'sin verificador: rechazada con causa');
}

// 3 · Caso negativo: autoverificación NO cuenta (sin distinguir mayúsculas).
{
  const r = evaluateUnlock({ artistId: ARTIST, trackId: 'track66', evidence: [ev('t66-m1-ikigai', 'exercise', 'ARTISTA-PRUEBA')] });
  check(!r.completed.includes('t66-m1-ikigai'), 'autoverificada: no completa');
  check(r.rejected[0]?.reason === 'AUTOVERIFICADA', 'autoverificada: rechazada con causa');
}

// 4 · Caso negativo: fecha inválida y tipo desconocido (p. ej. intentar "pagar").
{
  const payment = { moduleId: 't66-m1-ikigai', kind: 'payment', verifier: MENTOR, verifiedAt: T } as unknown as MeritEvidence;
  const r = evaluateUnlock({
    artistId: ARTIST,
    trackId: 'track66',
    evidence: [ev('t66-m1-ikigai', 'exercise', MENTOR, 'ayer'), payment],
  });
  check(r.completed.length === 0, 'pago/fecha inválida: no completa nada');
  check(r.rejected.some((x) => x.reason === 'FECHA_INVALIDA'), 'fecha inválida rechazada');
  check(r.rejected.some((x) => x.reason === 'TIPO_DESCONOCIDO'), 'pago rechazado como tipo desconocido');
}

// 5 · Caso negativo: evidencia de un módulo futuro NO salta prerequisitos.
{
  const r = evaluateUnlock({
    artistId: ARTIST,
    trackId: 'track66',
    evidence: [ev('t66-m3-marca-artistica', 'exercise'), ev('t66-m3-marca-artistica', 'mentor_review')],
  });
  check(!r.unlocked.includes('t66-m3-marca-artistica'), 'sin atajos: módulo 3 sigue bloqueado');
  check(!r.completed.includes('t66-m3-marca-artistica'), 'sin atajos: módulo 3 no completado');
}

// 6 · Camino feliz: completar el módulo 1 abre el 2.
{
  const r = evaluateUnlock({ artistId: ARTIST, trackId: 'track66', evidence: [ev('t66-m1-ikigai', 'exercise')] });
  check(r.completed.includes('t66-m1-ikigai'), 'mérito: Ikigai completado');
  check(r.unlocked.includes('t66-m2-rueda-vida'), 'mérito: rueda de la vida desbloqueada');
  check(r.progressPct === 20, 'mérito: progreso 20%');
}

// 7 · Evidencia incompleta: módulo 3 exige ejercicio + mentor.
{
  const base = [ev('t66-m1-ikigai', 'exercise'), ev('t66-m2-rueda-vida', 'exercise'), ev('t66-m3-marca-artistica', 'exercise')];
  const r = evaluateUnlock({ artistId: ARTIST, trackId: 'track66', evidence: base });
  check(r.unlocked.includes('t66-m3-marca-artistica') && !r.completed.includes('t66-m3-marca-artistica'), 'módulo 3 abierto pero incompleto');
  const pending = describePendingEvidence('track66', 't66-m3-marca-artistica', base, ARTIST);
  check(pending.length === 1 && pending[0] === 'revisión de mentor', 'pendiente explicado en lenguaje claro');
}

// 8 · Pista 66 completa al 100%.
{
  const all: MeritEvidence[] = [];
  for (const mod of MERIT_TRACKS.track66.modules) for (const k of mod.requiredEvidence) all.push(ev(mod.id, k));
  const r = evaluateUnlock({ artistId: ARTIST, trackId: 'track66', evidence: all });
  check(r.progressPct === 100 && r.locked.length === 0, 'pista 66 completa');
}

// 9 · Pista 99: cerrada sin evaluación de acceso revisada por mentor.
{
  const closed = evaluateUnlock({ artistId: ARTIST, trackId: 'track99', evidence: [] });
  check(closed.unlocked.length === 0, 'pista 99 cerrada sin evaluación de acceso');
  const selfGate = evaluateUnlock({
    artistId: ARTIST,
    trackId: 'track99',
    evidence: [ev(TRACK99_ENTRY_ASSESSMENT_ID, 'mentor_review', ARTIST)],
  });
  check(selfGate.unlocked.length === 0, 'pista 99: autoevaluación de acceso no abre');
  const open = evaluateUnlock({
    artistId: ARTIST,
    trackId: 'track99',
    evidence: [ev(TRACK99_ENTRY_ASSESSMENT_ID, 'mentor_review')],
  });
  check(open.unlocked.length === 1 && open.unlocked[0] === 't99-m1-diagnostico', 'pista 99 abierta con evaluación de mentor');
}

// 10 · Módulo desconocido rechazado.
{
  const r = evaluateUnlock({ artistId: ARTIST, trackId: 'track66', evidence: [ev('modulo-inventado', 'exercise')] });
  check(r.rejected[0]?.reason === 'MODULO_DESCONOCIDO', 'módulo inventado rechazado');
}

// 11 · Determinismo: misma entrada ⇒ misma salida.
{
  const input = { artistId: ARTIST, trackId: 'track66' as const, evidence: [ev('t66-m1-ikigai', 'exercise')] };
  check(JSON.stringify(evaluateUnlock(input)) === JSON.stringify(evaluateUnlock(input)), 'determinista');
}

// 12 · Precio: nunca inventado.
check(MERIT_PROGRAM_PRICING.track66.priceEur === null && MERIT_PROGRAM_PRICING.track66.status === 'SIN_EVIDENCIA', 'precio 66 SIN_EVIDENCIA');
check(MERIT_PROGRAM_PRICING.track99.priceEur === null && MERIT_PROGRAM_PRICING.track99.status === 'SIN_EVIDENCIA', 'precio 99 SIN_EVIDENCIA');

// 13 · Integridad estructural: ids únicos, días contiguos, prerequisitos existentes.
for (const track of Object.values(MERIT_TRACKS)) {
  const ids = track.modules.map((m) => m.id);
  check(new Set(ids).size === ids.length, `${track.id}: ids únicos`);
  check(track.modules[0].dayFrom === 1 && track.modules[track.modules.length - 1].dayTo === track.totalDays, `${track.id}: cubre día 1..${track.totalDays}`);
  for (let i = 1; i < track.modules.length; i += 1) {
    check(track.modules[i].dayFrom === track.modules[i - 1].dayTo + 1, `${track.id}: días contiguos en ${track.modules[i].id}`);
  }
  for (const mod of track.modules) {
    check(mod.requiredEvidence.length > 0, `${mod.id}: exige evidencia`);
    for (const pre of mod.prerequisites) check(ids.includes(pre), `${mod.id}: prerequisito ${pre} existe`);
    check(mod.provenance !== 'RECUPERADO_DISCO' || mod.sourceRef !== null, `${mod.id}: recuperado declara fuente`);
  }
}

// 14 · Resumen honesto de procedencia de contenidos.
{
  const s = contentProvenanceSummary();
  const total = s.RECUPERADO_DISCO + s.ASTRA_PENDIENTE_PORTAR + s.PENDIENTE_EXPORT_WP;
  check(total === MERIT_TRACKS.track66.modules.length + MERIT_TRACKS.track99.modules.length, 'resumen de procedencia cuadra');
  console.log(`MERIT_CONTENT=RECUPERADO:${s.RECUPERADO_DISCO} ASTRA:${s.ASTRA_PENDIENTE_PORTAR} PENDIENTE_WP:${s.PENDIENTE_EXPORT_WP}`);
}

console.log(`MERIT_ASSERTIONS=${assertions}`);
if (failures.length > 0) {
  for (const f of failures) console.error(`FAIL · ${f}`);
  console.log('MERIT_RESULT=FAIL');
  process.exit(1);
}
console.log('MERIT_RESULT=PASS');

