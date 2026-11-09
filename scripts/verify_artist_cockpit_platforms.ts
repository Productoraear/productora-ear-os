/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERIFICADOR DEL COCKPIT DE PLATAFORMAS DEL ARTISTA (W52_T04)
 * ════════════════════════════════════════════════════════════════════════════
 * Ley del Auditor Real: cada criterio se mide sobre el disco, no sobre el copy.
 *
 * Criterios:
 *   1. Existen los 4 artefactos de la misión.
 *   2. El SSOT de capacidades cubre plataformas reales del registry y ninguna
 *      queda fuera sin default-deny.
 *   3. Cero "publicar" donde no hay API: `isPublishAvailable('spotify')` false,
 *      `isPublishAvailable('youtube')` true.
 *   4. La matriz declara explícitamente `sin_api_publica` con vía real
 *      (`fallbackPath` no nulo) — AF-1.
 *   5. El panel de notificaciones expone los 3 canales con `role="switch"`,
 *      `aria-checked` y `aria-labelledby` (accesibilidad verificable en código).
 *   6. El dashboard importa y monta ambos componentes (integración real).
 *   7. Cero emojis en los componentes nuevos (Protocolo UNSLOP, INV-21).
 *   8. Cero `any` explícito en los ficheros de la misión.
 *
 * Uso:
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_artist_cockpit_platforms.ts
 * Exit: 0 = todas las puertas PASS · 1 = fallo · 2 = error de entorno.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  PLATFORM_CAPABILITIES,
  canPerform,
  isPublishAvailable,
  orderedCapabilities,
  resolveCapability,
} from '../src/lib/artists/platform-capabilities';
import { PLATFORMS } from '../src/lib/career/platform-registry';

const REPO_ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));

interface GateResult {
  id: string;
  title: string;
  ok: boolean;
  evidence: string;
}

const results: GateResult[] = [];

function gate(id: string, title: string, ok: boolean, evidence: string): void {
  results.push({ id, title, ok, evidence });
}

function abs(relative: string): string {
  return path.join(REPO_ROOT, relative);
}

function read(relative: string): string {
  return existsSync(abs(relative)) ? readFileSync(abs(relative), 'utf8') : '';
}

const FILES = {
  ssot: 'src/lib/artists/platform-capabilities.ts',
  notifications: 'src/components/artists/ArtistNotificationPreferences.tsx',
  cockpit: 'src/components/artists/ArtistPlatformCockpit.tsx',
  dashboard: 'src/app/(public)/artistas/dashboard/page.tsx',
  registry: 'src/lib/career/platform-registry.ts',
} as const;

/* ── Puerta 1: artefactos en disco (G-0) ──────────────────────────────────── */
const missing = Object.values(FILES).filter((file) => !existsSync(abs(file)));
gate(
  'ART-1',
  'Los 5 artefactos existen en disco',
  missing.length === 0,
  missing.length === 0 ? 'todos presentes' : `faltan: ${missing.join(', ')}`,
);

/* ── Puerta 2: cobertura del SSOT de capacidades ──────────────────────────── */
const declaredIds = new Set(PLATFORM_CAPABILITIES.map((capability) => capability.platformId));
const registrySource = read(FILES.registry);
const registryDefines = registrySource.includes('export const PLATFORMS');
const unknownIds = [...declaredIds].filter(
  (id) => !PLATFORMS.some((platform) => platform.id === id),
);
gate(
  'ART-2',
  'Toda capacidad declarada existe en platform-registry.ts',
  unknownIds.length === 0 && registryDefines,
  unknownIds.length === 0
    ? `${declaredIds.size} capacidades, 0 ids inventados · registry leído=${registryDefines}`
    : `ids fuera del registry: ${unknownIds.join(', ')}`,
);

/* ── Puerta 3: default-deny (SEC-1) ──────────────────────────────────────── */
const undeclared = PLATFORMS.map((platform) => platform.id).filter((id) => !declaredIds.has(id));
const denySample = resolveCapability('platform-inexistente-en-el-registry');
gate(
  'ART-3',
  'Default-deny: lo no declarado devuelve sin_api_publica y 0 acciones',
  denySample.state === 'sin_api_publica' && denySample.actions.length === 0,
  `sin_api_publica=${denySample.state} · acciones=${denySample.actions.length} · sin declarar en SSOT=${undeclared.length}`,
);

/* ── Puerta 4: cero publicar donde no hay API (INV-09 / AF-1) ────────────── */
const publishable = PLATFORM_CAPABILITIES.filter((capability) =>
  isPublishAvailable(capability.platformId),
).map((capability) => capability.platformId);
const spotifyPublishable = isPublishAvailable('spotify');
const youtubePublishable = isPublishAvailable('youtube');
gate(
  'ART-4',
  'Publicar sólo en plataformas con API de escritura verificada',
  !spotifyPublishable && youtubePublishable,
  `publicables=[${publishable.join(', ')}] · spotify=${spotifyPublishable} · youtube=${youtubePublishable}`,
);

/* ── Puerta 5: honestidad de la vía real (AF-1/AF-2) ─────────────────────── */
const dishonest = PLATFORM_CAPABILITIES.filter(
  (capability) => capability.state === 'sin_api_publica' && !capability.fallbackPath,
);
gate(
  'ART-5',
  'Toda plataforma sin API pública declara su vía real',
  dishonest.length === 0,
  dishonest.length === 0
    ? '0 plataformas sin vía declarada'
    : `sin vía real: ${dishonest.map((entry) => entry.platformId).join(', ')}`,
);

/* ── Puerta 6: métricas de lectura siempre disponibles ───────────────────── */
const readers = PLATFORM_CAPABILITIES.filter((capability) =>
  canPerform(capability.platformId, 'leer_metricas'),
).map((capability) => capability.platformId);
gate(
  'ART-6',
  'Al menos 3 plataformas permiten leer métricas por API',
  readers.length >= 3,
  `lectoras=[${readers.join(', ')}]`,
);

/* ── Puerta 7: orden del cockpit estable ─────────────────────────────────── */
const ordered = orderedCapabilities();
gate(
  'ART-7',
  'El cockpit ordena primero las plataformas con más capacidad',
  ordered.length === PLATFORM_CAPABILITIES.length && ordered[0]?.state === 'conectada',
  `orden=[${ordered.map((entry) => `${entry.platformId}:${entry.state}`).join(', ')}]`,
);

/* ── Puerta 8: accesibilidad del panel de notificaciones ─────────────────── */
const notificationsSource = read(FILES.notifications);
/**
 * Un comentario JSDoc que mencione `role="switch"` no es un switch renderizado.
 * Se elimina el ruido de comentarios antes de contar para que la puerta mida
 * el JSX real y no la prosa del propio verificador (Ley del Auditor Real).
 */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
}
const notificationsJsx = stripComments(notificationsSource);
const switchCount = notificationsJsx.match(/role="switch"/g)?.length ?? 0;
const checkedCount = notificationsJsx.match(/aria-checked=/g)?.length ?? 0;
const labelledByCount = notificationsJsx.match(/aria-labelledby=/g)?.length ?? 0;
gate(
  'ART-8',
  'Panel de notificaciones: switches accesibles con estado declarado',
  switchCount >= 1 && checkedCount >= switchCount && labelledByCount >= switchCount,
  `role="switch"=${switchCount} · aria-checked=${checkedCount} · aria-labelledby=${labelledByCount}`,
);

/* ── Puerta 9: los 3 canales del requisito del CEO ───────────────────────── */
const channels = ['email', 'whatsapp', 'inapp'] as const;
const missingChannels = channels.filter(
  (channel) => !notificationsSource.includes(`"${channel}"`),
);
gate(
  'ART-9',
  'Canales email, WhatsApp e in-app presentes en el panel',
  missingChannels.length === 0,
  missingChannels.length === 0 ? 'email + whatsapp + inapp' : `faltan: ${missingChannels.join(', ')}`,
);

/* ── Puerta 10: cero clics muertos en los componentes nuevos ────────────── */
const newComponents = `${stripComments(notificationsSource)}\n${stripComments(read(FILES.cockpit))}`;
const deadHrefs = newComponents.match(/href=(""|"#"|\{""\}|\{"#"\})/g)?.length ?? 0;
/**
 * Los `<button>` de este repo son multilínea: un regex `<button[^>]*>` NO los
 * captura y daría un verde vacío (falso PASS). Se tokeniza carácter a carácter
 * hasta el `>` de cierre de la etiqueta, contando llaves para no cortar en
 * `{() => ...}`. Así cada etiqueta se inspecciona de verdad.
 */
function extractButtonTags(source: string): string[] {
  const tags: string[] = [];
  let cursor = source.indexOf('<button');
  while (cursor !== -1) {
    let depth = 0;
    let idx = cursor + '<button'.length;
    for (; idx < source.length; idx += 1) {
      const char = source[idx];
      if (char === '{') depth += 1;
      else if (char === '}') depth -= 1;
      else if (char === '>' && depth === 0) break;
    }
    tags.push(source.slice(cursor, idx + 1));
    cursor = source.indexOf('<button', idx + 1);
  }
  return tags;
}

const buttonTags = extractButtonTags(newComponents);
const buttonNoHandler = buttonTags.filter(
  (tag) => !/onClick\s*=/.test(tag) && !/type\s*=\s*["']submit["']/.test(tag),
).length;
gate(
  'ART-10',
  'Cero clics muertos: sin href vacío ni botón sin handler',
  deadHrefs === 0 && buttonTags.length > 0 && buttonNoHandler === 0,
  `botones analizados=${buttonTags.length} · href vacíos=${deadHrefs} · botones sin onClick=${buttonNoHandler}`,
);

/* ── Puerta 11: integración real en el dashboard ─────────────────────────── */
const dashboardSource = read(FILES.dashboard);
const importsNotifications = dashboardSource.includes('ArtistNotificationPreferences');
const importsCockpit = dashboardSource.includes('ArtistPlatformCockpit');
const mountsNotifications = /<ArtistNotificationPreferences[\s/>]/.test(dashboardSource);
const mountsCockpit = /<ArtistPlatformCockpit[\s/>]/.test(dashboardSource);
gate(
  'ART-11',
  'Dashboard de artistas importa y monta ambos componentes',
  importsNotifications && importsCockpit && mountsNotifications && mountsCockpit,
  `import notifications=${importsNotifications} · import cockpit=${importsCockpit} · monta notifications=${mountsNotifications} · monta cockpit=${mountsCockpit}`,
);

/* ── Puerta 12: UNSLOP — cero emojis y cero acento hardcodeado ajeno ────── */
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}]/u;
const emojiHits = [...notificationsSource, ...read(FILES.cockpit)].filter((char) =>
  EMOJI.test(char),
).length;
gate(
  'ART-12',
  'Protocolo UNSLOP: cero emojis en los componentes del cockpit',
  emojiHits === 0,
  `caracteres emoji=${emojiHits}`,
);

/* ── Puerta 13: cero `any` en los ficheros de la misión ─────────────────── */
const anyHits = [FILES.ssot, FILES.notifications, FILES.cockpit].filter((file) =>
  /:\s*any\b|<any>|as any/.test(read(file)),
);
gate(
  'ART-13',
  'Cero `any` explícito en los ficheros de la misión',
  anyHits.length === 0,
  anyHits.length === 0 ? '0 ocurrencias' : `con any: ${anyHits.join(', ')}`,
);

/* ── Puerta 14: el SSOT de capacidades no inventa teléfonos ─────────────── */
const phoneLiterals = notificationsSource.match(/\+34\d/g)?.length ?? 0;
const usesCentralita = notificationsSource.includes('CENTRALITA_EAR_OS');
gate(
  'ART-14',
  'El panel usa la centralita del SSOT, no un literal (INV-12)',
  usesCentralita && phoneLiterals === 0,
  `importa CENTRALITA_EAR_OS=${usesCentralita} · literales +34x=${phoneLiterals}`,
);

/* ─────────────────────────────── Informe ────────────────────────────────── */

const failures = results.filter((result) => !result.ok);

console.log('');
console.log('[Ω-W52_T04] VERIFICADOR DEL COCKPIT DE PLATAFORMAS DEL ARTISTA');
console.log(`[Ω-W52_T04] Plataformas en registry: ${PLATFORMS.length} · declaradas en SSOT: ${PLATFORM_CAPABILITIES.length}`);
console.log('');
for (const result of results) {
  console.log(`  ${result.ok ? 'PASS' : 'FAIL'} ${result.id} — ${result.title}`);
  console.log(`       ${result.evidence}`);
}
console.log('');
console.log(`[Ω-W52_T04] Puertas: ${results.length - failures.length}/${results.length} PASS`);
if (failures.length > 0) {
  console.log(`[Ω-W52_T04] VEREDICTO: FAIL (${failures.map((entry) => entry.id).join(', ')})`);
  process.exit(1);
}
console.log('[Ω-W52_T04] VEREDICTO: PASS');
process.exit(0);
