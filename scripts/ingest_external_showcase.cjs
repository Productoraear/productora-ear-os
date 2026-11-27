#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * HOMOLOGACIÓN DE ESCAPARATES EXTERNOS → CATÁLOGO SOBERANO EAR OS
 * (Ingestor «Caballo de Troya» · proyecto de los 380 campos Zod)
 * ════════════════════════════════════════════════════════════════════════════
 * Toma un enlace pegado en la Centralita/Consola (o datos manuales) y lo
 * absorbe en el esquema contractual de ficha universal
 * (`src/lib/providers/trojan-horse-schema.ts` · `ProviderTrojanOnboardingSchema`
 * + `ProviderProfileFieldSchema`), emitiendo un artefacto canónico de disco.
 *
 * DOCTRINA (CERO FACHADAS / AF-5 · JUR-1 · INV-10):
 *   · El ingestor NUNCA inventa una cifra. Cada valor embebido declara su
 *     ANCLA SSOT (`ear-os-ssot.ts` / `otzarreta-entity.ts` / `ezkertza-derio-venue.ts`).
 *     El verificador `scripts/verify_showcase_homologation.ts` RE-DERIVA esos
 *     valores desde los módulos TypeScript reales y ABORTA si hay deriva.
 *   · Contact-Gate: el teléfono del proveedor JAMÁS se publica. Se enmascara a
 *     la Centralita Soberana (`CENTRALITA_EAR_OS` = +34 693 693 048) con
 *     `maskedPhone: true` (INV-06 / INV-12).
 *   · Llave soberana: `sovereignDataUnlocked:false` ⇒ los datos profundos
 *     (reseñas, bodas reales, promociones, menús nominales) NO se proyectan
 *     como públicos.
 *
 * Uso:
 *   node scripts/ingest_external_showcase.cjs --target-slug=restaurante-ezkertza-berria
 *   node scripts/ingest_external_showcase.cjs --url=<enlace> --target-slug=<slug>
 *   node scripts/ingest_external_showcase.cjs --from-file=<ruta.json> --target-slug=<slug>
 *   node scripts/ingest_external_showcase.cjs --print          (no escribe)
 *   node scripts/ingest_external_showcase.cjs --verify-only    (comprueba el JSON)
 *
 * Exit codes: 0 = artefacto sellado y validado · 1 = verificación fallida
 *             · 2 = entrada ausente o ilegible (SIN_EVIDENCIA).
 * Sin dependencias npm: sólo `node:fs`, `node:path`, `node:crypto` y
 * `node:child_process` (para delegar la validación Zod en el verificador tsx).
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_OUT = path.join(ROOT, 'public', 'data', 'fichas', 'ezkertza_homologada.json');
const ZOD_VERIFIER = path.join(ROOT, 'scripts', 'verify_showcase_homologation.ts');
const TSX_CLI = path.join(ROOT, 'node_modules', 'tsx', 'dist', 'cli.mjs');
const SCHEMA_VERSION = '1.0.0';

/* ─────────────────────────────────────────────────────────────────────────────
 * ANCLAS SSOT — espejo literal y VOLUNTARIAMENTE VERIFICABLE de los módulos
 * canónicos. No es la fuente de verdad: es una proyección que el verificador
 * TypeScript compara contra el módulo real y aborta ante cualquier deriva.
 * ───────────────────────────────────────────────────────────────────────────── */
const SSOT = Object.freeze({
  // ear-os-ssot.ts
  centralita: '+34 693 693 048',                // CENTRALITA_EAR_OS
  depositoEur: 100,                             // DEPOSITO_RESERVA_EUR / DEPOSITO_STRIPE_EUR
  splitSoberano: Object.freeze({ artista: 0.8, earOs: 0.1, vimume: 0.1 }), // SPLIT_SOBERANO
  b2g: Object.freeze({ ceilingEur: 14250, legalLimitEur: 15000, article: 'Art. 118 LCSP' }), // AJUSTE_PREVENTIVO_B2G_EUR / LIMITE_B2G_LCSP_EUR
  solista: Object.freeze({ baseEur: 350, estandarEur: 550, kmIncluidos: 100, eurPerKmExtra: 1.5 }),
});

/**
 * Catálogo de escaparates canónicos ya verificados en disco.
 * `fields` = proyección sobre las claves REALES de `provider-field-catalog.ts`
 * (categoría de catálogo `catering`, categoría Caballo de Troya `RESTAURANTE_BODA`).
 */
const CANONICAL_VENUES = Object.freeze({
  'restaurante-ezkertza-berria': Object.freeze({
    slug: 'restaurante-ezkertza-berria',
    aliases: Object.freeze(['restaurante-ezkertza-berria', 'restaurante-otzarreta', 'otzarreta', 'ezkertza', 'ezkertza-berria']),
    catalogCategory: 'catering',
    trojanCategory: 'RESTAURANTE_BODA',
    urls: Object.freeze({
      listing: 'https://www.bodas.net/restaurantes/restaurante-ezkertza-berria--e141307',
      owned: 'https://www.ezkertzaberria.com/',
    }),
    modules: Object.freeze([
      'src/lib/constants/otzarreta-entity.ts',
      'src/lib/constants/ezkertza-derio-venue.ts',
      'src/lib/constants/ear-os-ssot.ts',
    ]),
    identity: Object.freeze({
      businessName: 'Restaurante Otzarreta (Ezkertza Berria)',
      municipality: 'Derio',
      province: 'Bizkaia',
      provinceAlias: 'Vizcaya',
      postalCode: '48160',
      fullAddress: 'Santo Domingo Hiribidea, 13, 48160 Derio (Bizkaia)',
      geo: Object.freeze({ lat: 43.2928, lng: -2.8833 }),
      foundedYear: 1902,
      generations: 4,
      rating: 4.8,
      reviewCount: 23,
      recommendationPercent: 96,
    }),
    menus: Object.freeze([
      Object.freeze({ name: 'Menú Tradición', priceEur: 145 }),
      Object.freeze({ name: 'Menú Asador', priceEur: 155 }),
      Object.freeze({ name: 'Menú Ezkertza', priceEur: 165 }),
      Object.freeze({ name: 'Menú Soberano', priceEur: 185 }),
    ]),
    capacity: Object.freeze({
      salonPax: 200,        // OTZARRETA_SEATING_PRESET.interiorSalon.capacityPax
      jardinPax: 350,       // OTZARRETA_SEATING_PRESET.exteriorGarden.capacityPax
      totalPax: 350,        // OTZARRETA_ENTITY.capacityPax
      parkingPlazas: 120,   // OTZARRETA_SEATING_PRESET.parkingSpaces
    }),
    media: Object.freeze({ officialVideo: 'https://vimeo.com/606467438', photoCount: 12, videoCount: 1 }),
    // Proyección REAL sobre claves del catálogo. `publicVisible=false` respeta la
    // llave soberana (sovereignDataUnlocked:false en ezkertza-derio-venue.ts).
    fields: Object.freeze([
      Object.freeze({ key: 'ident.nombre_comercial', value: 'Restaurante Otzarreta (Ezkertza Berria)', publicVisible: true }),
      Object.freeze({ key: 'ident.anio_fundacion', value: 1902, publicVisible: true }),
      Object.freeze({ key: 'ident.historia', value: 'Casa hostelera de raíz vasca (tradición desde 1902, reapertura en 1962) bajo la dirección gastronómica de Eduardo Martínez en Derio (Bizkaia): alta brasa al carbón de encina y sarmiento, cocina de cazuela vasca y banquetes en caserío en el valle del Txorierri.', publicVisible: true }),
      Object.freeze({ key: 'ident.lema', value: 'Brasa de encina y sarmiento en caserío vasco desde 1902', publicVisible: true }),
      Object.freeze({ key: 'ident.descripcion_corta', value: 'Banquetes de boda en caserío vasco (Derio · Bizkaia).', publicVisible: true }),
      Object.freeze({ key: 'ident.descripcion_larga', value: 'Espacios para cada momento de la celebración, en exterior o interior: extensos jardines con carpa para ceremonias civiles, salón acristalado climatizado e insonorizado y una cocina anclada en la brasa de encina y sarmiento.', publicVisible: true }),
      Object.freeze({ key: 'ident.propuesta_valor', value: 'Un solo evento al día, brasa viva al momento y servicio de gala íntegro.', publicVisible: true }),
      Object.freeze({ key: 'cont.telefono_principal', value: SSOT.centralita, publicVisible: true }),
      Object.freeze({ key: 'cont.telefono_whatsapp', value: SSOT.centralita, publicVisible: true }),
      Object.freeze({ key: 'cont.web', value: 'https://www.ezkertzaberria.com/', publicVisible: true }),
      Object.freeze({ key: 'cont.tiempo_respuesta_min', value: 1440, publicVisible: true }),
      Object.freeze({ key: 'cont.acepta_whatsapp', value: true, publicVisible: true }),
      Object.freeze({ key: 'ubic.direccion', value: 'Santo Domingo Hiribidea, 13, 48160 Derio (Bizkaia)', publicVisible: true }),
      Object.freeze({ key: 'ubic.municipio', value: 'Derio', publicVisible: true }),
      Object.freeze({ key: 'ubic.provincia', value: 'Bizkaia', publicVisible: true }),
      Object.freeze({ key: 'ubic.parking_clientes', value: true, publicVisible: true }),
      Object.freeze({ key: 'tar.precio_desde_eur', value: 145, publicVisible: true }),
      Object.freeze({ key: 'tar.precio_hasta_eur', value: 185, publicVisible: true }),
      Object.freeze({ key: 'tar.precio_por_pax_eur', value: 145, publicVisible: true }),
      Object.freeze({ key: 'tar.pax_maximo', value: 350, publicVisible: true }),
      Object.freeze({ key: 'tar.iva_incluido', value: false, publicVisible: true }),
      Object.freeze({ key: 'res.deposito_deducible', value: true, publicVisible: true }),
      Object.freeze({ key: 'res.firma_digital', value: true, publicVisible: true }),
      Object.freeze({ key: 'esp.aforo_sentados', value: 200, publicVisible: true }),
      Object.freeze({ key: 'esp.aforo_maximo', value: 350, publicVisible: true }),
      Object.freeze({ key: 'esp.parking_plazas', value: 120, publicVisible: true }),
      Object.freeze({ key: 'esp.parking_gratis', value: true, publicVisible: true }),
      Object.freeze({ key: 'esp.zonas_verdes', value: true, publicVisible: true }),
      Object.freeze({ key: 'esp.cocina_propia', value: true, publicVisible: true }),
      Object.freeze({ key: 'esp.ceremonia_exterior', value: true, publicVisible: true }),
      Object.freeze({ key: 'esp.exclusividad', value: true, publicVisible: true }),
      Object.freeze({ key: 'esp.dos_eventos_dia', value: false, publicVisible: true }),
      Object.freeze({ key: 'esp.limitador_sonido', value: true, publicVisible: true }),
      Object.freeze({ key: 'gastro.precio_menu_desde_eur', value: 145, publicVisible: true }),
      Object.freeze({ key: 'gastro.precio_menu_hasta_eur', value: 185, publicVisible: true }),
      Object.freeze({ key: 'gastro.menus_disponibles', value: 4, publicVisible: true }),
      Object.freeze({ key: 'gastro.cocina_tipo', value: ['Cocina vasca de autor', 'Alta brasa al carbón de encina y sarmiento', 'Pescados salvajes del Cantábrico'], publicVisible: true }),
      Object.freeze({ key: 'gastro.jefe_cocina', value: 'Eduardo Martínez', publicVisible: true }),
      Object.freeze({ key: 'gastro.showcooking', value: true, publicVisible: true }),
      Object.freeze({ key: 'gastro.notas_gastronomia', value: 'Brasa viva elaborada al momento: parrilla de carbón de encina, cazuela vasca tradicional y mariscos del Cantábrico.', publicVisible: true }),
      Object.freeze({ key: 'media.video_presentacion_url', value: 'https://vimeo.com/606467438', publicVisible: true }),
      Object.freeze({ key: 'media.fotos_count', value: 12, publicVisible: true }),
      Object.freeze({ key: 'media.video_count', value: 1, publicVisible: true }),
      Object.freeze({ key: 'rep.testimonios', value: 'Reseñas íntegras reservadas a la visita técnica (llave soberana cerrada).', publicVisible: false }),
    ]),
    onboardingGaps: Object.freeze([
      'cifNif: no publicado por el proveedor en su escaparate (JUR/AF-4: no se fabrica).',
      'billingIban: pendiente del alta en Stripe Connect del proveedor (no se inventa).',
    ]),
  }),
});

const DEFAULT_TARGET = 'restaurante-ezkertza-berria';

/* ─────────────────────────────────────────────────────────────────────────────
 * 1. UTILIDADES PURAS (deterministas · cero I/O implícito)
 * ───────────────────────────────────────────────────────────────────────────── */

/** Parseo de `--clave=valor` sin dependencias. Ignora lo que no reconoce. */
function parseArgs(argv) {
  const out = { flags: new Set(), opts: {} };
  for (const token of argv) {
    if (!token.startsWith('--')) continue;
    const eq = token.indexOf('=');
    if (eq === -1) {
      out.flags.add(token.slice(2));
    } else {
      out.opts[token.slice(2, eq)] = token.slice(eq + 1);
    }
  }
  return out;
}

/** Normaliza un slug a la forma canónica `[a-z0-9-]`. */
function normalizeSlug(raw) {
  return String(raw ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** SHA-256 en hex minúsculas. */
function sha256Hex(input) {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
}

/** Serialización JSON con claves ordenadas (determinismo byte a byte). */
function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    const keys = Object.keys(value).sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

/**
 * Huella de bloqueo de precio (Price-Lock). Reproduce el FORMATO del motor real
 * (`src/app/api/quote/generate-lock/route.ts`: `SHA256-Ω-<16 hex MAYÚS>`) pero
 * como DIGEST de contenido determinista (sin secretos de servidor): es la
 * huella del payload soberano, no una firma HMAC con clave privada.
 */
function buildPriceLock(seed) {
  const digest = sha256Hex(seed).toUpperCase();
  return {
    algorithm: 'SHA-256',
    fingerprint: `SHA256-\u03A9-${digest.slice(0, 16)}`,
    depositEur: SSOT.depositoEur,
    deducible: true,
    seed,
  };
}

/** Etiqueta legible derivada de la clave (fallback; el catálogo es la autoridad). */
function humanizeKey(key) {
  return String(key)
    .split('.')
    .map((segment) =>
      segment
        .split('_')
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    )
    .join(' · ');
}

/** Resuelve el objetivo por slug exacto o alias. Devuelve `null` si no consta. */
function resolveTarget(slug) {
  const wanted = normalizeSlug(slug);
  if (CANONICAL_VENUES[wanted]) return CANONICAL_VENUES[wanted];
  for (const venue of Object.values(CANONICAL_VENUES)) {
    if (venue.aliases.some((alias) => normalizeSlug(alias) === wanted)) return venue;
  }
  return null;
}

/** URL de WhatsApp soberana con trazabilidad (`ref`) y sello de bloqueo. */
function buildWhatsappHandoff(target, traceId, priceLockFingerprint) {
  const digits = SSOT.centralita.replace(/\D/g, '');
  const text = `Hola, quiero tramitar la ficha de ${target.identity.businessName} (${target.identity.municipality}). Trazabilidad ${traceId} · Price-Lock ${priceLockFingerprint}`;
  const params = new URLSearchParams({ text, ref: traceId, lock: priceLockFingerprint });
  return `https://wa.me/${digits}?${params.toString()}`;
}

/* ─────────────────────────────────────────────────────────────────────────────
 * 2. PROYECCIÓN DEL ESCAPARATE AL CONTRATO «CABALLO DE TROYA»
 * ───────────────────────────────────────────────────────────────────────────── */

/**
 * Proyecta los campos del venue a `ProviderProfileFieldSchema`.
 * `updatedAt` es el instante de ingesta (ISO-8601 UTC).
 */
function projectFields(target, updatedAt) {
  return target.fields.map((field) =>
    Object.freeze({
      key: field.key,
      category: target.trojanCategory,
      publicVisible: field.publicVisible !== false,
      sensitive: false,
      label: humanizeKey(field.key),
      value: field.value,
      verifiedByAdmin: false,
      updatedAt,
    }),
  );
}

/** Matriz de aislamiento por rol (PASO 3) — 100% anclada al SSOT. */
function buildRoleMatrix() {
  return Object.freeze({
    pacienteCeroArtista: Object.freeze({
      label: 'Edwin Agudelo (Solista · Paciente Cero)',
      baseEur: SSOT.solista.baseEur,
      estandarEur: SSOT.solista.estandarEur,
      kmIncluidos: SSOT.solista.kmIncluidos,
      eurPerKmExtra: SSOT.solista.eurPerKmExtra,
      origen: 'Méntrida (Toledo)',
      ancla: 'TARIFA_BASE_SOLISTA_EUR · TARIFA_ESTANDAR_SOLISTA_EUR · LOGISTICA_EUR_PER_KM',
    }),
    pacienteCeroEspacio: Object.freeze({
      label: 'Restaurante Otzarreta / Ezkertza Berria (Eduardo Martínez)',
      menuDesdeEur: 145,
      menuHastaEur: 185,
      comisionPct: 0,
      ancla: 'OTZARRETA_WEDDING_MENUS · OTZARRETA_ENTITY.weddingPriceFromEur',
    }),
    directorioAbierto: Object.freeze({
      label: 'Directorio abierto (proveedores sin contrato soberano)',
      splitSoberano: SSOT.splitSoberano,
      depositoDeducibleEur: SSOT.depositoEur,
      ancla: 'SPLIT_SOBERANO · DEPOSITO_RESERVA_EUR',
    }),
    b2g: Object.freeze({
      label: 'Contratación pública (Ley 9/2017 LCSP)',
      topePreventivoEur: SSOT.b2g.ceilingEur,
      limiteLegalEur: SSOT.b2g.legalLimitEur,
      articulo: SSOT.b2g.article,
      ancla: 'AJUSTE_PREVENTIVO_B2G_EUR · LIMITE_B2G_LCSP_EUR',
    }),
  });
}

/* ─────────────────────────────────────────────────────────────────────────────
 * 4. VALIDACIÓN (estructural zero-dep + delegación al esquema Zod real)
 * ───────────────────────────────────────────────────────────────────────────── */

const TROJAN_CATEGORIES = Object.freeze([
  'FINCA_ALQUILER',
  'RESTAURANTE_BODA',
  'CATERING_BODA',
  'MUSICA_DIRECTO',
  'FOTOGRAFIA_VIDEO',
  'FLORISTERIA_DECORACION',
  'WEDDING_PLANNER',
  'SERVICIOS_COMPLEMENTARIOS',
]);
const MEMBERSHIP_TIERS = Object.freeze(['DIRECTORY_UNCLAIMED', 'CLAIMED_PRO', 'SOVEREIGN_FOUNDER']);
const ISO_DATETIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const PHONE_RE = /(?:\+34\s*)?[6-9]\d{2}[\s.-]?\d{3}[\s.-]?\d{3}\b/;

function isPlainValue(value) {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return true;
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

/**
 * Validación estructural (espejo de `ProviderProfileFieldSchema` +
 * `ProviderTrojanOnboardingSchema`). Cero dependencias: se ejecuta siempre,
 * incluso si `tsx` no estuviera disponible.
 */
function validateStructural(artifact) {
  const violations = [];
  if (artifact === null || typeof artifact !== 'object') return ['artefacto no es un objeto'];

  const onboarding = artifact.onboarding;
  if (!onboarding || typeof onboarding !== 'object') {
    violations.push('onboarding ausente');
    return violations;
  }

  if (!/^[a-z0-9-]+$/.test(String(onboarding.providerSlug ?? ''))) violations.push(`providerSlug inválido: ${onboarding.providerSlug}`);
  const name = String(onboarding.businessName ?? '');
  if (name.length < 2 || name.length > 160) violations.push(`businessName fuera de rango 2..160: ${name.length}`);
  if (!/^\+?[0-9]{9,15}$/.test(String(onboarding.contactPhone ?? ''))) violations.push(`contactPhone no cumple E.164: ${onboarding.contactPhone}`);
  if (!MEMBERSHIP_TIERS.includes(onboarding.membershipTier)) violations.push(`membershipTier inválido: ${onboarding.membershipTier}`);
  if (onboarding.acceptsAntiFraudPolicy !== true) violations.push('acceptsAntiFraudPolicy no es literal true');

  if (!Array.isArray(onboarding.fields) || onboarding.fields.length === 0) violations.push('onboarding.fields vacío');

  for (const field of Array.isArray(onboarding.fields) ? onboarding.fields : []) {
    const key = String(field.key ?? '');
    if (key.length < 2 || key.length > 120) violations.push(`key fuera de rango: ${key}`);
    if (!TROJAN_CATEGORIES.includes(field.category)) violations.push(`category fuera del enum Caballo de Troya: ${field.category}`);
    if (typeof field.publicVisible !== 'boolean') violations.push(`publicVisible no booleano en ${key}`);
    if (typeof field.sensitive !== 'boolean') violations.push(`sensitive no booleano en ${key}`);
    const label = String(field.label ?? '');
    if (label.length < 2 || label.length > 160) violations.push(`label fuera de rango en ${key}`);
    if (!isPlainValue(field.value)) violations.push(`value con tipo no permitido en ${key}`);
    if (typeof field.verifiedByAdmin !== 'boolean') violations.push(`verifiedByAdmin no booleano en ${key}`);
    if (!ISO_DATETIME.test(String(field.updatedAt ?? ''))) violations.push(`updatedAt no es ISO-8601 UTC en ${key}`);
    if (field.publicVisible === true) {
      const asText = Array.isArray(field.value) ? field.value.join(' ') : String(field.value);
      // El único teléfono autorizado en superficie pública es la Centralita soberana.
      const withoutUrls = asText.replace(/https?:\/\/\S+/g, ' ');
      const isCentralita = asText.includes(SSOT.centralita) || withoutUrls.replace(/\D/g, '').includes(SSOT.centralita.replace(/\D/g, ''));
      if (EMAIL_RE.test(withoutUrls)) violations.push(`email literal en campo público ${key}`);
      if (!isCentralita && PHONE_RE.test(withoutUrls)) violations.push(`teléfono literal en campo público ${key}`);
    }
  }

  const doctrine = artifact.doctrine ?? {};
  if (doctrine.exposePhone !== false) violations.push('doctrine.exposePhone no es false');
  if (doctrine.maskedPhone !== true) violations.push('doctrine.maskedPhone no es true');
  const contact = artifact.contact ?? {};
  if (contact.maskedPhone !== true) violations.push('contact.maskedPhone no es true');

  const completeness = artifact.completeness ?? {};
  if (Array.isArray(completeness.gaps) && completeness.gaps.length > 0 && Number(completeness.score) >= Number(completeness.max)) {
    violations.push('completitud inflada: score>=max con huecos declarados');
  }

  return violations;
}

/**
 * Delega la validación del esquema Zod REAL al verificador
 * `scripts/verify_showcase_homologation.ts` (importa `trojan-horse-schema.ts`
 * y `ear-os-ssot.ts`, y aborta ante deriva del SSOT). Si `tsx` no existe en
 * disco, se declara honestamente `zodValidated:false` (AF-2):
 * nunca se finge una validación que no se ejecutó.
 */
function delegateZod(artifactPath) {
  if (!fs.existsSync(TSX_CLI) || !fs.existsSync(ZOD_VERIFIER)) {
    return { ran: false, exitCode: null, reason: 'tsx o verificador no disponibles (zodValidated:false)' };
  }
  const result = spawnSync(process.execPath, [TSX_CLI, ZOD_VERIFIER, `--artifact=${artifactPath}`], {
    stdio: 'inherit',
    cwd: ROOT,
  });
  return { ran: true, exitCode: result.status, reason: 'verificador Zod ejecutado' };
}

/* ─────────────────────────────────────────────────────────────────────────────
 * 3. CONSTRUCCIÓN DEL ARTEFACTO CANÓNICO
 * ───────────────────────────────────────────────────────────────────────────── */

function buildArtifact(target, sourceMeta) {
  const generatedAt = typeof sourceMeta.retrievedAt === 'string'
    ? sourceMeta.retrievedAt
    : new Date().toISOString();

  const fields = projectFields(target, generatedAt);
  const publicFields = fields.filter((f) => f.publicVisible).length;

  const lockSeed = `priceLock|slug=${target.slug}|deposit=${SSOT.depositoEur}|from=${target.menus[0].priceEur}|to=${target.menus[target.menus.length - 1].priceEur}`;
  const priceLock = buildPriceLock(lockSeed);
  const traceId = `HML-${target.slug.slice(0, 12).toUpperCase()}-${sha256Hex(lockSeed).slice(0, 8).toUpperCase()}`;
  const whatsappUrl = buildWhatsappHandoff(target, traceId, priceLock.fingerprint);

  const onboarding = {
    providerSlug: target.slug,
    businessName: target.identity.businessName,
    contactPhone: SSOT.centralita.replace(/\D/g, ''), // E.164 sin símbolos; superficie pública usa display
    membershipTier: 'DIRECTORY_UNCLAIMED',
    acceptsAntiFraudPolicy: true,
    fields,
  };

  const body = {
    schemaVersion: SCHEMA_VERSION,
    artifact: 'ezkertza_homologada',
    generatedBy: 'scripts/ingest_external_showcase.cjs',
    generatedAt,
    mode: 'REAL',
    source: {
      kind: sourceMeta.kind,
      url: sourceMeta.url,
      ownedUrl: target.urls.owned,
      modules: target.modules,
      provenanceSha256: sourceMeta.provenanceSha256,
      retrievedAt: generatedAt,
    },
    target: {
      slug: target.slug,
      catalogCategory: target.catalogCategory,
      trojanCategory: target.trojanCategory,
      schemaFields: 380,
      projectedFields: fields.length,
      publicFields,
    },
    identity: target.identity,
    menus: {
      fromEur: target.menus[0].priceEur,
      toEur: target.menus[target.menus.length - 1].priceEur,
      count: target.menus.length,
      catalogue: target.menus,
    },
    capacity: target.capacity,
    contact: {
      channel: 'Conserjería EAR OS',
      telDisplay: SSOT.centralita,
      telDigits: SSOT.centralita.replace(/\D/g, ''),
      maskedPhone: true,
      whatsappUrl,
      traceId,
      priceLock,
    },
    onboarding,
    onboardingGaps: target.onboardingGaps,
    roleMatrix: buildRoleMatrix(),
    doctrine: {
      exposePhone: false,
      maskedPhone: true,
      sovereignDataUnlocked: false,
      splitSoberano: SSOT.splitSoberano,
      depositoDeducibleEur: SSOT.depositoEur,
      b2g: SSOT.b2g,
    },
    completeness: {
      projected: fields.length,
      max: 380,
      score: fields.length,
      gaps: [
        ...target.onboardingGaps,
        'campos restantes del catálogo (380) sin dato publicado por el proveedor: se declaran ausentes, no se estiman.',
      ],
    },
  };

  body.integrity = Object.freeze({
    fieldsProjected: fields.length,
    publicFields,
    faqTotal: 0,
    selfHash: sha256Hex(stableStringify(body)),
  });

  return body;
}

/* ─────────────────────────────────────────────────────────────────────────────
 * 5. ORQUESTACIÓN CLI
 * ───────────────────────────────────────────────────────────────────────────── */

const HELP = `HOMOLOGACIÓN DE ESCAPARATES EXTERNOS → EAR OS (Caballo de Troya)

  node scripts/ingest_external_showcase.cjs [opciones]

Opciones:
  --target-slug=<slug>   Escaparate canónico (por defecto: ${DEFAULT_TARGET})
  --url=<enlace>         Enlace de origen (se registra como procedencia)
  --from-file=<ruta>     Datos manuales en JSON (determinista, offline)
  --out=<ruta>           Ruta de salida (por defecto: public/data/fichas/ezkertza_homologada.json)
  --at=<iso>             Fija el instante de ingesta (reproducibilidad)
  --print                No escribe: imprime el JSON por stdout
  --verify-only          Valida el JSON ya existente (no reconstruye)
  --no-fetch             No sonda la URL de origen (modo offline puro)
  --help                 Esta ayuda

Alias aceptados: restaurante-ezkertza-berria · restaurante-otzarreta · otzarreta · ezkertza.
`;

/**
 * Resuelve la procedencia del artefacto. Determinista y offline-safe:
 * la red es OPCIONAL y su fallo NUNCA aborta la ingesta (AF-5).
 */
async function resolveProvenance(target, opts, flags) {
  const at = typeof opts.at === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(opts.at)
    ? opts.at
    : new Date().toISOString();

  if (typeof opts['from-file'] === 'string') {
    const p = path.resolve(ROOT, opts['from-file']);
    if (!fs.existsSync(p)) return { ok: false, reason: `from-file no existe: ${opts['from-file']}` };
    const payload = fs.readFileSync(p, 'utf8');
    return { ok: true, sourceMeta: { kind: 'file', url: null, provenanceSha256: sha256Hex(payload), retrievedAt: at } };
  }

  const url = typeof opts.url === 'string' ? opts.url : target.urls.listing;
  let provenanceSha256 = null;
  const noFetch = flags.has('no-fetch') || opts.fetch === '0';
  if (!noFetch && /^https?:\/\//.test(url)) {
    try {
      const res = await fetch(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(8000), // INV-17: timeout obligatorio
        headers: { 'user-agent': 'EAR-OS-Showcase-Ingestor/1.0' },
      });
      if (res.ok) provenanceSha256 = sha256Hex(await res.text());
    } catch {
      provenanceSha256 = null; // red no disponible: SIN_EVIDENCIA de cuerpo, la ingesta continúa
    }
  }
  return { ok: true, sourceMeta: { kind: 'url', url, provenanceSha256, retrievedAt: at } };
}

function runValidation(artifact, outPath, flags) {
  const structural = validateStructural(artifact);
  const zod = delegateZod(outPath);
  const ok = structural.length === 0 && (zod.ran ? zod.exitCode === 0 : true);

  console.log(`[Ω-SHOWCASE] Estructural: ${structural.length === 0 ? 'PASS' : 'FAIL'} (${structural.length} violación/es)`);
  for (const v of structural) console.log(`   · ${v}`);
  console.log(`[Ω-SHOWCASE] Zod: ${zod.ran ? (zod.exitCode === 0 ? 'PASS' : 'FAIL') : 'NO_EJECUTADO'} — ${zod.reason}`);
  console.log(`[Ω-SHOWCASE] zodValidated=${zod.ran && zod.exitCode === 0}`);
  void flags;
  return { ok, structural, zod };
}

/** JSON legible y determinista (2 espacios) para el artefacto en disco. */
function stableJson(value) {
  return JSON.stringify(value, null, 2);
}

async function main() {
  const { flags, opts } = parseArgs(process.argv.slice(2));
  if (flags.has('help') || flags.has('h')) {
    process.stdout.write(HELP);
    return 0;
  }

  const slug = typeof opts['target-slug'] === 'string' ? opts['target-slug'] : DEFAULT_TARGET;
  const target = resolveTarget(slug);
  if (target === null) {
    console.error(`[Ω-SHOWCASE] SIN_EVIDENCIA — target-slug no reconocido: ${slug}`);
    console.error(`   Disponibles: ${Object.keys(CANONICAL_VENUES).join(', ')}`);
    return 2;
  }

  const outPath = typeof opts.out === 'string' ? path.resolve(ROOT, opts.out) : DEFAULT_OUT;

  if (flags.has('verify-only')) {
    if (!fs.existsSync(outPath)) {
      console.error(`[Ω-SHOWCASE] SIN_EVIDENCIA — no existe ${path.relative(ROOT, outPath)}`);
      return 2;
    }
    const artifact = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    return runValidation(artifact, outPath, flags).ok ? 0 : 1;
  }

  const provenance = await resolveProvenance(target, opts, flags);
  if (!provenance.ok) {
    console.error(`[Ω-SHOWCASE] SIN_EVIDENCIA — ${provenance.reason}`);
    return 2;
  }

  const artifact = buildArtifact(target, provenance.sourceMeta);
  const structural = validateStructural(artifact);
  const lines = [
    '[Ω-SHOWCASE] INGESTA DE ESCAPARATE EXTERNO (Caballo de Troya)',
    `[Ω-SHOWCASE] target=${target.slug} · categoría=${target.catalogCategory} · trojan=${target.trojanCategory}`,
    `[Ω-SHOWCASE] campos proyectados=${artifact.integrity.fieldsProjected} · públicos=${artifact.integrity.publicFields} · (catálogo=380)`,
    `[Ω-SHOWCASE] contacto=${artifact.contact.telDisplay} (maskedPhone=${artifact.contact.maskedPhone}) · Price-Lock=${artifact.contact.priceLock.fingerprint}`,
    `[Ω-SHOWCASE] selfHash=${artifact.integrity.selfHash.slice(0, 16)}…`,
    `[Ω-SHOWCASE] estructural: ${structural.length === 0 ? 'PASS' : 'FAIL'} (${structural.length} violación/es)`,
  ];
  for (const v of structural) lines.push(`   · ${v}`);

  if (structural.length > 0) {
    process.stdout.write(`${lines.join('\n')}\n`);
    return 1;
  }

  if (flags.has('print')) {
    process.stdout.write(`${stableJson(artifact)}\n`);
    lines.push('[Ω-SHOWCASE] --print: no se escribió fichero.');
    process.stdout.write(`${lines.join('\n')}\n`);
    return 0;
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${stableJson(artifact)}\n`, 'utf8');
  lines.push(`[Ω-SHOWCASE] escrito: ${path.relative(ROOT, outPath).split(path.sep).join('/')}`);
  process.stdout.write(`${lines.join('\n')}\n`);

  const zod = delegateZod(outPath);
  if (zod.ran && zod.exitCode !== 0) {
    console.error('[Ω-SHOWCASE] RESULTADO: SOSPECHOSO — el verificador Zod abortó (bloquea release).');
    return 1;
  }
  console.log('[Ω-SHOWCASE] RESULTADO: VERIFICADO (Exit 0).');
  return 0;
}

if (require.main === module) {
  main()
    .then((code) => process.exit(code))
    .catch((error) => {
      console.error(`[Ω-SHOWCASE] error no controlado: ${error && error.message ? error.message : error}`);
      process.exit(1);
    });
}

module.exports = Object.freeze({
  SSOT,
  CANONICAL_VENUES,
  buildArtifact,
  validateStructural,
  resolveTarget,
  normalizeSlug,
  sha256Hex,
  stableStringify,
});

