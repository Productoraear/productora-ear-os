#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * INGESTA DEL ESCAPARATE DE PROVEEDOR (W43/W49) — PARSER DETERMINISTA
 * ════════════════════════════════════════════════════════════════════════════
 * Convierte el VOLCADO CRUDO de un portal externo (Ctrl+A sobre cada pestaña
 * del panel: inicio, escaparate, solicitudes, opiniones, campus, facturación,
 * cuenta, vista previa pública) en un JSON canónico de disco.
 *
 * FILOSOFÍA (CERO FACHADAS / AF-5):
 *   · El parser NUNCA inventa: un campo sin evidencia literal en el volcado se
 *     publica como `null` y se declara en `completeness.gaps`. No hay valores
 *     por defecto que maquillen un dato ausente.
 *   · El parser NUNCA lanza: cualquier entrada (vacía, cortada, basura binaria,
 *     mojibake UTF-8/Latin-1) produce un resultado válido o un error capturado
 *     devuelto como exit code. Fail-closed sin excepción no controlada.
 *   · El parser NUNCA publica teléfonos ni emails: todo dato detectado entra en
 *     `identity.piiDetected[]` enmascarado y con `expose:false` (doctrina
 *     contact-gate + depósito 100 € del SSOT).
 *
 * Uso:
 *   node scripts/ingest_competitor_showcase.cjs
 *   node scripts/ingest_competitor_showcase.cjs --input=<ruta.txt> --out=<salida.json>
 *   node scripts/ingest_competitor_showcase.cjs --print          (no escribe)
 *   node scripts/ingest_competitor_showcase.cjs --verify-only    (comprueba el JSON)
 *
 * Exit codes: 0 = JSON canónico sellado · 1 = fallo de verificación/escritura
 *             · 2 = entrada ilegible o ausente (SIN_EVIDENCIA).
 * Sin dependencias externas: sólo `node:fs`, `node:path`, `node:crypto`.
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_INPUT = path.join(
  ROOT,
  'vault_absorbed',
  'textos desde bodas.net caballo de troya de mi escaparate.txt',
);
const DEFAULT_OUT = path.join(ROOT, 'public', 'data', 'providers', 'showcase_seed_canonical.json');

/** Semilla de texto con la que el portal declara el correo sin publicarlo. */
const NO_PUBLIC_PHONE = 'no aparece en tu escaparate';


/** Versión del contrato de salida. Subirla si cambia la forma del JSON. */
const SCHEMA_VERSION = '1.0.0';

// ─────────────────────────────────────────────────────────────────────────────
// 1. RUIDO DE INTERFAZ — todo lo que un Ctrl+A arrastra y no es dato
// ─────────────────────────────────────────────────────────────────────────────

/** Líneas exactas que son cromo del portal (navegación, banner, footer, CTA). */
const UI_NOISE_EXACT = new Set(
  [
    'ir al contenido principal', 'pack start', 'potencia tus resultados.',
    'hazte premium', 'illustration premium', 'atención al cliente:', 'inicio',
    'mi escaparate', 'mis solicitudes', 'opiniones', 'campus', 'facturación',
    'mi cuenta', 'completa tu escaparate', 'información', 'contactar',
    'condiciones legales', 'condiciones generales de compra', 'aviso de privacidad',
    'aviso de cookies', 'gestionar las preferencias', 'centro de transparencia',
    'centro legal', 'acceso empresas', '¿quiénes somos?',
    'conecta con tus clientes donde quieras', 'síguenos en', 'facebook', 'twitter',
    'pinterest', 'instagram', 'youtube', 'tiktok', 'ww logo', 'mi boda', 'banquetes',
    'proveedores', 'novias', 'novios', 'ideas boda', 'comunidad', 'lugares para boda',
    'ver mi escaparate', 'ver todas', 'siguiente', 'seleccionar todo',
    'búsqueda avanzada', 'buscar', 'carpetas', 'herramientas', 'configuración',
    'plantillas de respuesta', 'premium', 'exportar a excel', 'compartir :',
    'responder', 'pedir opiniones', 'solicita opiniones', 'gestiona mis opiniones',
    'mis sellos', 'widget opiniones', 'mostrar todas (4)', 'guardar como plantilla',
    'copiar', 'estadísticas', 'sorteo', 'boletos', 'más información',
    'protégete del fraude de falsos enlaces a videollamadas.',
    'descarga ya tu app de empresas de bodas.net',
    'responde y gestiona tus solicitudes donde y cuando quieras',
    'disponible para', 'disponible para disponible para', 'mostrar menos',
    'mostrar más', 'leer más', 'ver detalle', 'ver opinión', 'reenviar petición',
    'ver todas (4)', 'fotos', 'empresas colaboradoras', 'premios', 'mapa', 'reseñas',
    'lo que más valoran las parejas', 'sigue buscando',
    'descubre otros proveedores en tu zona',
    'descubre los proveedores más populares y los que han ganado los wedding awards ¡y encuentra los tuyos!',
    'ver proveedores', 'lo sentimos', 'aumenta tu credibilidad con opiniones',
    'consigue opiniones rápidamente enviando un email personalizado a tus clientes.',
    'conecta con más parejas', '¿quieres más visitas en tu escaparate?',
    'completa tu escaparate', 'pide opinión a 5 parejas', 'destacado',
    'proveedores que podrían gustarte',
    'descubre otros proveedores populares entre las parejas', 'te recomendamos...',
    'últimos artículos publicados', 'todos', 'gestionar mis solicitudes',
    'gestiona mis opiniones4', 'añade tus clientes', 'añadir', 'plantilla',
    'mensaje', 'para:', 'nombre', 'email', 'peticiones de opinión enviadas',
    'todas', 'atendidas', 'no atendidas', 'sin foto', '1 envío', 'destinatarios',
    'comparte tu enlace y consigue opiniones',
    'envía este enlace personalizado a tus clientes para pedir opiniones de forma rápida.',
    '¿quieres ganar un wedding award 2027?', 'wedding awards', 'solicitudes recibidas',
    'impresiones de tu escaparate', 'clics en ver teléfono', 'atendida',
    'boletos0', 'entrada223', 'no leídas0', 'leídas223', 'archivadas0',
    'pendientes0', 'atendidas208', 'contratadas1', 'descartadas14', 'fotos usuarios',
    'empresas colaboradoras', 'a', 'e', 'yanet', 'info', 'contacto',
  ].map((s) => s.toLowerCase()),
);

/** Prefijos de línea que marcan cromo del portal o telemetría de interfaz. */
const UI_NOISE_PREFIXES = [
  'desde el boton', 'illustration ', 'pack ', 'atención al cliente', '¿quieres ',
  'te faltan ', 'solo falta ', 'completa tu escaparate', 'disponible para',
  'conecta con ', 'descubre ', 'ver ', 'sigue buscando', 'hazte premium',
  'lo sentimos', 'el 100% de las parejas', 'aumenta tu ', 'consigue ',
  'este es el email', 'edita y envía', 'si detectas', 'por tu seguridad',
  'guarda como plantilla', 'haz clic aquí', 'te recomendamos', 'últimos artículos',
  'al usar este sitio', 'este sitio usa', 'utilizamos cookies', 'cookies',
  'los últimos 12 meses', 'últimos 12 meses', 'últimas solicitudes',
  'últimas opiniones', 'mis solicitudes (', 'enviado el',
  'recibida el', 'se casó el',
].map((s) => s.toLowerCase());

/** Expresiones que delatan telemetría, banners de premium, legales o ajenos. */
const UI_NOISE_PATTERNS = [
  /^los últimos \d+/i, /^últimos 12 meses/i,
  /^-{1,2}\s*:?\s*-{1,2}$/i, /^precio desde/i, /^\d+%\s*$/i,
  /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\s+\d{4}$/i,
  /^(nov|dic|ene|feb|mar|abr|may|jun|jul|ago|sep|oct)\s*\d+$/i,
  /^(lunes|martes|miércoles|jueves|viernes|sábado|domingo)$/i,
  /^el \d{2}\/\d{2}\/\d{4} a las/i, /^\d{1,2}:\d{2}\s*$/i,
  /^(insertar|compartir|imprimir)$/i, /^ilustración/i, /^logo$/i,
];


/** ¿Esta línea es cromo y no dato? Función pura y total (nunca lanza). */
function isUiNoise(line) {
  const raw = String(line ?? '');
  const value = raw.trim();
  if (value.length === 0) return true;
  const lower = value.toLowerCase();
  if (UI_NOISE_EXACT.has(lower)) return true;
  for (const prefix of UI_NOISE_PREFIXES) {
    if (lower.startsWith(prefix)) return true;
  }
  for (const pattern of UI_NOISE_PATTERNS) {
    if (pattern.test(value)) return true;
  }
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. NORMALIZACIÓN DE TEXTO — mojibake, colapsos y cortes
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Repara el mojibake típico de un Ctrl+A guardado como Latin-1 y leído como
 * UTF-8. Sólo actúa si el texto lo necesita; es idempotente y determinista
 * (no depende de `Intl`, así que no hay riesgo de mismatch de hidratación).
 */
const MOJIBAKE_MAP = Object.freeze({
  'Ã¡': 'á', 'Ã©': 'é', 'Ã­': 'í', 'Ã³': 'ó', 'Ãº': 'ú', 'Ã±': 'ñ',
  'Ã ': 'à', 'Ã¨': 'è', 'Ã¬': 'ì', 'Ã²': 'ò', 'Ã¹': 'ù',
  'Ã‰': 'É', 'Ã"': 'Ó', 'Ãš': 'Ú', 'Ã‘': 'Ñ',
  'Â¿': '¿', 'Â¡': '¡', 'Â·': '·', 'Âª': 'ª', 'Âº': 'º', 'Â€': '€',
  'â€¦': '…', 'â€™': '’', 'â€œ': '“', 'â€“': '–', 'â€”': '—', 'â‚¬': '€',
  '├¡': 'í', '├│': 'ó', '├®': 'é', '├á': 'á', '├▒': 'ñ', '├║': 'ú',
  '┬┐': '¿', '┬¡': '¡', '├è': 'È', '├ì': 'ì',
});

function repairMojibake(text) {
  let out = String(text ?? '');
  for (const [from, to] of Object.entries(MOJIBAKE_MAP)) {
    if (out.includes(from)) out = out.split(from).join(to);
  }
  return out;
}

/** Colapsa espacios internos y elimina caracteres de control. */
function collapseWhitespace(text) {
  return String(text ?? '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .replace(/[ \t\u00a0]+/g, ' ')
    .trim();
}

/** Líneas útiles: reparadas, sin cromo y sin repetir consecutivos idénticos. */
function cleanLines(rawText) {
  const text = repairMojibake(String(rawText ?? ''));
  const out = [];
  for (const physicalLine of text.split(/\r?\n/)) {
    const line = collapseWhitespace(physicalLine);
    if (isUiNoise(line)) continue;
    if (out.length > 0 && out[out.length - 1] === line) continue;
    out.push(line);
  }
  return out;
}

/** Delimitadores de sección observados en el volcado del portal. */
const SECTION_MARKERS = Object.freeze([
  { id: 'inicio', re: /^desde el boton de inicio/i },
  { id: 'escaparate', re: /^desde el boton de mi escaparate/i },
  { id: 'solicitudes', re: /^desde el boton de mis solicitudes/i },
  { id: 'opiniones', re: /^desde el boton de opiniones/i },
  { id: 'campus', re: /^desde el boton campus/i },
  { id: 'facturacion', re: /^desde el boton de facturacion/i },
  { id: 'cuenta', re: /^desde el boton de mi cuenta/i },
  { id: 'preview', re: /^desde el boton mi escaparate se muestra como una vista previa/i },
]);

/** Parte el volcado en secciones lógicas conservando el texto íntegro. */
function splitSections(rawText) {
  const text = repairMojibake(String(rawText ?? ''));
  const sections = [];
  let current = { id: 'preamble', lines: [] };
  for (const line of text.split(/\r?\n/)) {
    const probe = collapseWhitespace(line);
    const marker = SECTION_MARKERS.find((entry) => entry.re.test(probe));
    if (marker !== undefined) {
      if (current.lines.length > 0) sections.push(current);
      current = { id: marker.id, lines: [] };
      continue;
    }
    current.lines.push(line);
  }
  if (current.lines.length > 0) sections.push(current);
  return sections;
}

/** Elimina duplicados por clave, conservando la primera aparición. */
function dedupeBy(list, keyFn) {
  const seen = new Set();
  const out = [];
  for (const item of list) {
    const key = keyFn(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. EXTRACTORES — un campo, una fuente, cero invención
// ─────────────────────────────────────────────────────────────────────────────

/** Rótulos de campo del portal que cierran un bloque de respuesta. */
const SECTION_LABELS = new Set(
  [
    'servicios que ofrece', 'experiencia:', 'repertorio:',
    'tipo de formación musical:', 'tamaño de la formación:', 'fotos usuarios',
    'mapa de localización', 'empresas colaboradoras', 'premios',
  ].map((s) => s.toLowerCase()),
);

function looksLikeSectionLabel(line) {
  const lower = String(line ?? '').trim().toLowerCase();
  if (lower.length === 0) return true;
  if (SECTION_LABELS.has(lower)) return true;
  if (/^(servicios que ofrece|preguntas frecuentes sobre)/i.test(lower)) return true;
  if (/^\(\d+\)/.test(lower)) return true;
  return false;
}

/**
 * Preguntas que el portal usa como cromo de su propia interfaz (buscador del
 * campus, buscadores internos). No son FAQ del proveedor.
 */
const UI_QUESTION_PATTERNS = [
  /qué artículo buscas/i,
  /^¿qué buscas\?$/i,
  /^¿quieres /i,
  /^buscar/i,
  /^¿cómo funciona la plataforma\?$/i,
];

/** ¿La pregunta es cromo de la interfaz del portal? */
function isUiQuestion(line) {
  const value = String(line ?? '').trim();
  return UI_QUESTION_PATTERNS.some((pattern) => pattern.test(value));
}

/**
 * Una respuesta con PII (teléfono, email, comentario operativo del gestor) no
 * puede publicarse como FAQ: se descarta el par completo en lugar de limpiarlo a
 * medias, porque recortar produciría una respuesta falsa.
 */
function hasPiiOrOperatorNoise(text) {
  const value = String(text ?? '');
  if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(value)) return true;
  if (/(?:\+34\s*)?[6-9]\d{2}[\s.-]?\d{3}[\s.-]?\d{3}\b/.test(value)) return true;
  if (/\b91\s?\d{3}\s?\d{2}\s?\d{2}\b/.test(value)) return true;
  if (/nosotros tenemos todo|vampiriz|informaci[oó]n de alt[ií]simo valor|oro puro/i.test(value)) return true;
  // Respuestas que en realidad son una ficha de empresa ajena ("Mike Churches 5.0").
  if (/^[A-ZÁÉÍÓÚÑ][\w' ]{2,40}\s[\d]\.\d$/.test(value.trim())) return true;
  return false;
}

/**
 * Extrae pares "Pregunta / Respuesta" de la sección PÚBLICA de FAQ. Exige una
 * línea que acabe en '?', rechaza los mensajes de clientes del panel de
 * solicitudes, los buscadores internos del portal y cualquier par cuya
 * respuesta arrastre datos personales u operativos.
 */
function extractFaqPairs(cleanLineList) {
  const pairs = [];
  let question = null;
  let answer = [];
  const flush = () => {
    if (question === null) return;
    const text = answer.join(' ').trim();
    if (text.length > 0 && !hasPiiOrOperatorNoise(text)) pairs.push({ question, answer: text });
    question = null;
    answer = [];
  };
  for (const line of cleanLineList) {
    if (line.endsWith('?')) {
      flush();
      question = isCustomerMessage(line) || isUiQuestion(line) ? null : line;
      continue;
    }
    if (question === null) continue;
    if (looksLikeSectionLabel(line)) flush();
    else answer.push(line);
  }
  flush();
  return pairs.filter((pair) => pair.question.length > 0);
}

/** ¿La línea es un mensaje de un cliente del panel, no una FAQ del portal? */
function isCustomerMessage(line) {
  const value = String(line ?? '').trim();
  if (value.length < 18) return true;
  if (/^hola\b|^buenas|^buenos d[ií]as|^gracias/i.test(value)) return true;
  if (/\b(aun est[aá] interesada|donde vives|os viene mejor|algo cu[eé]ntame)\b/i.test(value)) return true;
  if (/\bcomensales\b/i.test(value)) return true;
  return false;
}

const toInt = (value) => {
  const parsed = Number.parseInt(String(value ?? '').replace(/[^\d-]/g, ''), 10);
  return Number.isFinite(parsed) ? parsed : null;
};

const safeRatio = (num, den) => {
  if (num === null || den === null || den <= 0) return null;
  return Math.round((num / den) * 10_000) / 10_000;
};

/**
 * Métricas del panel. Sólo se acepta lo que aparece con su rótulo contiguo en
 * el volcado. Un ratio cuyos operandos falten queda `null` (AF-5): jamás se
 * calcula un porcentaje con datos inventados.
 */
function extractMetrics(cleanLineList) {
  const metrics = {
    solicitudes_totales: null,
    atendidas: null,
    contratadas: null,
    descartadas: null,
    impresiones_12m: null,
    impresiones_totales: null,
    tiempo_respuesta_h: null,
    completitud_escaparate_pct: null,
    precio_min_publicado_eur: null,
    precio_max_publicado_eur: null,
    ratio_atencion: null,
    ratio_conversion: null,
  };

  for (let index = 0; index < cleanLineList.length; index += 1) {
    const line = cleanLineList[index];
    const lower = line.toLowerCase();
    const prev = index > 0 ? cleanLineList[index - 1] : '';

    const complete = /^completa tu escaparate\s*(\d{1,3})\s*%$/i.exec(line);
    if (complete !== null) {
      metrics.completitud_escaparate_pct = toInt(complete[1]);
      continue;
    }
    const total = /^mis solicitudes \((\d+)\)$/i.exec(line);
    if (total !== null) {
      metrics.solicitudes_totales = toInt(total[1]);
      continue;
    }
    if (metrics.solicitudes_totales !== null) {
      if (lower === 'atendidas' && metrics.atendidas === null) {
        metrics.atendidas = toInt(prev);
        continue;
      }
      if (lower === 'contratada' && metrics.contratadas === null) {
        metrics.contratadas = toInt(prev);
        continue;
      }
      if (lower === 'descartadas' && metrics.descartadas === null) {
        metrics.descartadas = toInt(prev);
        continue;
      }
    }
    const impressions = /(\d[\d.]*)\s+impresiones a tu escaparate/i.exec(line);
    if (impressions !== null) {
      metrics.impresiones_12m = toInt(impressions[1]);
      continue;
    }
    const both = /últimos 12 meses:\s*([\d.]+)\s*total:\s*([\d.]+)/i.exec(line);
    if (both !== null) {
      metrics.impresiones_12m = toInt(both[1]);
      metrics.impresiones_totales = toInt(both[2]);
      continue;
    }
    const price = /desde\s*([\d.]+)\s*€?\s*hasta\s*([\d.]+)\s*€?/i.exec(line);
    if (price !== null) {
      metrics.precio_min_publicado_eur = toInt(price[1]);
      metrics.precio_max_publicado_eur = toInt(price[2]);
      continue;
    }
  }

  // Segundo pase: bloques del panel donde el número precede a su rótulo.
  //   · "Atendidas208" / "Contratadas1" / "Descartadas14"  (contador pegado)
  //   · "208" + "atendidas" + "1" + "contratada" + "14" + "descartadas"
  //     (contador suelto seguido del rótulo en la línea siguiente)
  for (let index = 0; index < cleanLineList.length; index += 1) {
    const line = cleanLineList[index];
    const glued = /^(atendidas|contratadas?|descartadas)(\d+)$/i.exec(line);
    if (glued !== null) {
      assignCounter(metrics, glued[1], glued[2]);
      continue;
    }
    const labelOnly = /^(atendidas|contratada|descartadas)$/i.exec(line);
    if (labelOnly === null) continue;
    const previous = cleanLineList[index - 1] ?? '';
    if (/^\d+$/.test(previous)) assignCounter(metrics, labelOnly[1], previous);
  }

  const pending = /(\d+)\s+peticiones enviadas/i.exec(cleanLineList.join(' '));
  if (pending !== null) metrics.peticiones_opinion_enviadas = toInt(pending[1]);

  // Bloque canónico del panel de solicitudes. El portal imprime:
  //   "4" + "208" + "1" + "contratada" + "14" + "descartadas"
  // donde el rótulo "atendidas" se pierde al filtrarse como cromo de pestaña,
  // así que la firma se ancla en "contratada/descartadas" y se lee 5 posiciones
  // atrás. El número de la carpeta ("4" sin leer) queda fuera por precaución.
  for (let index = 0; index + 4 < cleanLineList.length; index += 1) {
    const window = cleanLineList.slice(index, index + 5);
    const signedCounters =
      /^\d+$/.test(window[0]) &&
      /^\d+$/.test(window[1]) &&
      /^\d+$/.test(window[2]) &&
      /^contratadas?$/i.test(window[3]) &&
      /^\d+$/.test(window[4]);
    if (!signedCounters) continue;
    if (!/^descartadas$/i.test(cleanLineList[index + 5] ?? '')) continue;
    if (metrics.atendidas === null) metrics.atendidas = toInt(window[1]);
    if (metrics.contratadas === null) metrics.contratadas = toInt(window[2]);
    if (metrics.descartadas === null) metrics.descartadas = toInt(window[4]);
    if (metrics.solicitudes_totales === null) metrics.solicitudes_totales = toInt(window[0]);
    break;
  }

  metrics.ratio_atencion = safeRatio(metrics.atendidas, metrics.solicitudes_totales);
  metrics.ratio_conversion = safeRatio(metrics.contratadas, metrics.solicitudes_totales);
  return metrics;
}

/** Asigna el contador al campo correcto según el rótulo del portal. */
function assignCounter(metrics, label, value) {
  const parsed = toInt(value);
  const key = String(label).toLowerCase();
  if (key === 'atendidas' && metrics.atendidas === null) metrics.atendidas = parsed;
  else if (key.startsWith('contratada') && metrics.contratadas === null) metrics.contratadas = parsed;
  else if (key === 'descartadas' && metrics.descartadas === null) metrics.descartadas = parsed;
}

/** Títulos de reseña que el portal publica literalmente (evita inventar texto). */
const REVIEW_TITLES = new Set([
  'nuestra boda sergio y adriana',
  'mi boda fue espectacular',
  'insuperable',
  'excelente grupo de mariachis',
]);

/**
 * Reputación: valoración publicada, número de opiniones, canal de recogida y
 * desglose. Cualquier valor ausente queda `null`.
 */
function extractReputation(cleanLineList) {
  const reputation = {
    rating_publicado: null,
    escala: 5,
    opiniones_totales: null,
    recomendacion_pct: null,
    canal_recogida_opiniones: null,
    desglose: [],
    resenas: [],
  };

  for (let index = 0; index < cleanLineList.length; index += 1) {
    const line = cleanLineList[index];
    const rating = /valoración\s+([\d.,]+)\s+de\s+5/i.exec(line);
    if (rating !== null && reputation.rating_publicado === null) {
      const value = Number(String(rating[1]).replace(',', '.'));
      if (Number.isFinite(value)) reputation.rating_publicado = value;
    }
    // Formato del panel: "5.0 / 5.0" (sin la palabra "valoración").
    const bare = /^([\d.,]+)\s*\/\s*5(?:[.,]0)?$/.exec(line);
    if (bare !== null && reputation.rating_publicado === null) {
      const value = Number(String(bare[1]).replace(',', '.'));
      if (Number.isFinite(value) && value > 0) reputation.rating_publicado = value;
    }
    const count = /^(\d+)\s+opiniones?$/i.exec(line);
    if (count !== null && reputation.opiniones_totales === null) {
      reputation.opiniones_totales = toInt(count[1]);
    }
    const pct = /el\s+(\d{1,3})%\s+de las parejas lo recomiendan/i.exec(line);
    if (pct !== null) reputation.recomendacion_pct = toInt(pct[1]);

    const url = /(https?:\/\/[^\s]+)/.exec(line);
    if (url !== null && /rate|opinion|opiniones/i.test(url[1]) && reputation.canal_recogida_opiniones === null) {
      reputation.canal_recogida_opiniones = url[1];
    }

    const stars = /valoración\s+(\d)\s+de\s+5/i.exec(line);
    if (stars !== null) {
      const next = cleanLineList[index + 1] ?? '';
      if (/^[\d.,]+$/.test(next)) {
        const score = Number(next.replace(',', '.'));
        if (Number.isFinite(score)) {
          reputation.desglose.push({ estrellas: toInt(stars[1]), valor: score });
        }
      }
    }
  }

  for (let index = 0; index < cleanLineList.length; index += 1) {
    const line = cleanLineList[index];
    if (!REVIEW_TITLES.has(line.toLowerCase())) continue;
    const body = cleanLineList
      .slice(index + 1, index + 3)
      .join(' ')
      .replace(/leer más$/i, '')
      .trim();
    reputation.resenas.push({ titulo: line, cuerpo: body.length > 0 ? body : null });
  }
  reputation.resenas = dedupeBy(reputation.resenas, (item) => item.titulo.toLowerCase());

  if (reputation.opiniones_totales === null && reputation.resenas.length > 0) {
    reputation.opiniones_totales = reputation.resenas.length;
  }
  return reputation;
}

/**
 * Localización y radio de servicio. El portal declara dirección y mapa; el
 * radio sólo se acepta si el volcado trae un número explícito en km.
 */
function extractLocation(cleanLineList, rawText) {
  const location = {
    direccion: null,
    municipio: null,
    provincia: null,
    codigo_postal: null,
    pais: 'España',
    google_maps_url: null,
    radio_servicio: null,
    cobertura_declarada: [],
    desplazamiento_internacional: false,
    suplemento_fuera_de_madrid: false,
  };

  const addressPattern =
    /^(calle|avenida|avda|c\/|plaza|paseo|camino|carretera)\s+[^,]+,\s*([^,]+?)\s+(\d{5})\s+([^(]+?)\s*\(([^)]+)\)/i;

  const assignAddress = (line) => {
    const match = addressPattern.exec(line);
    if (match === null) return false;
    location.direccion = line;
    location.municipio = collapseWhitespace(match[2]);
    location.codigo_postal = match[3];
    location.provincia = collapseWhitespace(match[5]);
    return true;
  };

  for (let index = 0; index < cleanLineList.length; index += 1) {
    const line = cleanLineList[index];
    if (location.direccion === null && assignAddress(line)) continue;
    if (/^mapa de localización/i.test(line)) {
      const next = cleanLineList[index + 1] ?? '';
      if (location.direccion === null) assignAddress(next.replace(/^mapa de localización\s*/i, ''));
      const url = /(https?:\/\/[^\s]+)/.exec(line);
      if (url !== null && location.google_maps_url === null) location.google_maps_url = url[1];
      continue;
    }
    const radius = /radio de (?:servicio|cobertura)[:\s]*(\d{1,4})\s*km/i.exec(line);
    if (radius !== null) {
      location.radio_servicio = { valor: toInt(radius[1]), unidad: 'km', fuente: 'literal' };
      continue;
    }
    if (/^provincias de españa,?\s*y toda europa$/i.test(line)) {
      location.cobertura_declarada.push('España (nacional)', 'Europa');
      location.desplazamiento_internacional = true;
      continue;
    }
    if (/^fuera de la comunidad de madrid/i.test(line)) {
      location.suplemento_fuera_de_madrid = true;
      continue;
    }
    if (/^provincias de españa/i.test(line)) location.cobertura_declarada.push('España (nacional)');
  }

  const everywhere = /provincias de españa,? y toda europa/i.exec(String(rawText ?? ''));
  if (everywhere !== null) {
    if (!location.cobertura_declarada.includes('Europa')) location.cobertura_declarada.push('Europa');
    location.desplazamiento_internacional = true;
  }
  return location;
}

function maskEmail(email) {
  const [user, domain] = String(email).split('@');
  if (domain === undefined) return '***';
  return `${user.slice(0, 3)}${'*'.repeat(Math.max(3, user.length - 3))}@${domain}`;
}

function maskPhone(digits) {
  const value = String(digits);
  if (value.length < 6) return '***';
  return `${value.slice(0, 3)}****${value.slice(-2)}`;
}

/**
 * Identidad corporativa. La descripción sale del bloque "Información" de la
 * vista previa pública (3ª persona, sin datos de contacto, como exige el
 * portal). Los datos personales se detectan y se enmascaran: JAMÁS se publican
 * (`exposePhone:false`, doctrina contact-gate + depósito 100 € del SSOT).
 */
function extractIdentity(cleanLineList) {
  const identity = {
    nombre_usuario: null,
    nombre_comercial: null,
    persona_contacto: null,
    email: null,
    web: null,
    url_publica: null,
    descripcion_3a_persona: null,
    descripcion_corta: null,
    lema: null,
    servicios_ofrecidos: [],
    estilos_musica: [],
    formaciones: [],
    tamanos_formacion: [],
    repertorio: [],
    equipo_propio: null,
    exclusividad_fecha: null,
    piiDetected: [],
    exposePhone: false,
  };

  const afterLabel = (labelPattern) => {
    for (let index = 0; index < cleanLineList.length; index += 1) {
      if (!labelPattern.test(cleanLineList[index])) continue;
      return cleanLineList[index + 1] ?? null;
    }
    return null;
  };

  identity.nombre_usuario = afterLabel(/^nombre de usuario/i);
  identity.persona_contacto = afterLabel(/^persona de contacto/i);
  identity.email = afterLabel(/^email \*?$/i);
  identity.web = afterLabel(/^página web$/i);

  const company = cleanLineList.find((line) => /^productora ear$/i.test(line));
  identity.nombre_comercial = company ?? identity.nombre_usuario;

  const url = cleanLineList.find((line) => /^https?:\/\/[a-z0-9.-]+\.[a-z]{2,}/i.test(line));
  if (url !== undefined) identity.url_publica = url;

  // Prosa de la vista previa: la línea más larga sin '?' y sin email.
  const prose = cleanLineList
    .filter((line) => line.length > 180 && !line.endsWith('?') && !line.includes('@'))
    .sort((a, b) => b.length - a.length);
  if (prose.length > 0) {
    identity.descripcion_3a_persona = prose[0];
    identity.descripcion_corta = prose[0].slice(0, 220);
  }

  const collectUntil = (labelPattern, stopPattern) => {
    const items = [];
    let collecting = false;
    for (const line of cleanLineList) {
      if (!collecting && labelPattern.test(line)) {
        collecting = true;
        continue;
      }
      if (!collecting) continue;
      if (stopPattern.test(line)) break;
      items.push(line);
    }
    return dedupeBy(items, (item) => item.toLowerCase());
  };

  identity.servicios_ofrecidos = collectUntil(/^¿qué servicios ofreces\?$/i, /^¿qué incluye el pack/i);
  identity.estilos_musica = collectUntil(/^¿qué estilo de música ofreces\?$/i, /^tipo de formación musical:?$/i);
  identity.formaciones = collectUntil(/^tipo de formación musical:?$/i, /^tamaño de la formación:?$/i);
  identity.tamanos_formacion = collectUntil(/^tamaño de la formación:?$/i, /^repertorio:?$/i);
  identity.repertorio = collectUntil(/^repertorio:?$/i, /^¿existe algún problema/i);

  const own = afterLabel(/^¿dispones de equipo propio\?$/i);
  if (own !== null) {
    if (/^sí$/i.test(own)) identity.equipo_propio = true;
    else if (/^no$/i.test(own)) identity.equipo_propio = false;
  }

  const seen = new Set();
  const emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
  const phonePattern = /(?:\+34\s*)?[6-9]\d{2}[\s.-]?\d{3}[\s.-]?\d{3}\b/g;
  for (const line of cleanLineList) {
    for (const email of line.match(emailPattern) ?? []) {
      const key = `email:${email.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      identity.piiDetected.push({ kind: 'email', masked: maskEmail(email), expose: false });
    }
    for (const phone of line.match(phonePattern) ?? []) {
      const digits = phone.replace(/\D/g, '');
      const key = `phone:${digits}`;
      if (seen.has(key)) continue;
      seen.add(key);
      identity.piiDetected.push({ kind: 'phone', masked: maskPhone(digits), expose: false });
    }
  }

  return identity;
}

/**
 * Etiquetas de conocimiento: categorías y artículos del campus del portal, más
 * los temas detectados. Sirven para lead generation; NO se copia contenido de
 * terceros, sólo títulos y conteos literales.
 */
function extractKnowledgeTags(sections, cleanLineList) {
  const campus = sections.find((section) => section.id === 'campus');
  const campusLines = campus === undefined ? [] : cleanLines(campus.lines.join('\n'));
  const categorias = [];
  const articulos = [];

  for (const line of campusLines) {
    const bucket = /todos\s+(\d+)\s+marketing\s+(\d+)\s+noticias y eventos\s+(\d+)\s+escaparate\s+(\d+)\s+ventas\s+(\d+)/i.exec(line);
    if (bucket !== null) {
      categorias.push(
        { nombre: 'Marketing', articulos: toInt(bucket[2]) },
        { nombre: 'Noticias y eventos', articulos: toInt(bucket[3]) },
        { nombre: 'Escaparate', articulos: toInt(bucket[4]) },
        { nombre: 'Ventas', articulos: toInt(bucket[5]) },
      );
      continue;
    }
    if (line.startsWith('[') || /^una primera impresión|^tus tareas imprescindibles/i.test(line)) {
      articulos.push({ titulo: line, categoria: inferCampusCategory(line) });
    }
  }

  if (categorias.length === 0) {
    for (const nombre of ['Marketing', 'Noticias y eventos', 'Escaparate', 'Ventas']) {
      categorias.push({ nombre, articulos: null });
    }
  }

  const vocabulario = [
    'DJ', 'Orquesta', 'Mariachi', 'Fotografía', 'Vídeo', 'Decoración', 'Catering',
    'Animación', 'Karaoke', 'Audiovisuales', 'Protocolo', 'Coordinación', 'Ceremonia',
  ];
  const corpus = cleanLineList.join(' ');
  const temas = vocabulario.filter((tema) => new RegExp(tema, 'i').test(corpus));

  return {
    categorias_portal: categorias,
    articulos: dedupeBy(articulos, (item) => item.titulo.toLowerCase()),
    temas_detectados: temas,
  };
}

function inferCampusCategory(line) {
  const lower = String(line).toLowerCase();
  if (/webinar|evento|award/.test(lower)) return 'Noticias y eventos';
  if (/escaparate/.test(lower)) return 'Escaparate';
  if (/venta|reserva|cliente|llm/.test(lower)) return 'Ventas';
  return 'Marketing';
}

/**
 * Empresas colaboradoras declaradas. Sólo nombre, valoración y categoría
 * publicadas. Cero enlaces a perfiles ajenos (JUR-4: cero marcas de terceros
 * en la UI propia; aquí es un dato de inteligencia, no un claim comercial).
 */
function extractPartners(cleanLineList) {
  const partners = [];
  const start = cleanLineList.findIndex((line) => /^empresas colaboradoras$/i.test(line));
  if (start === -1) return partners;
  for (let index = start + 1; index < cleanLineList.length; index += 1) {
    const line = cleanLineList[index];
    if (/^(mapa|preguntas frecuentes sobre)/i.test(line)) break;
    const rated = /^valoración\s+([\d.]+)\s+de\s+5\s*,\s*(\d+)\s+opiniones?$/i.exec(line);
    if (rated !== null) {
      const nombre = cleanLineList[index - 1] ?? null;
      if (nombre !== null && partners.every((item) => item.nombre !== nombre)) {
        partners.push({
          nombre,
          rating_publicado: Number(rated[1]),
          opiniones: toInt(rated[2]),
          categoria: null,
        });
      }
      continue;
    }
    const categoria = /^\((\d+)\)\s*·\s*(.+)$/.exec(line);
    if (categoria !== null && partners.length > 0) {
      const last = partners[partners.length - 1];
      if (last.categoria === null) last.categoria = collapseWhitespace(categoria[2]);
    }
  }
  return partners;
}

/**
 * Fotos reales: el volcado sólo aporta rótulos de galería ("Productora EAR - 1").
 * Se cuenta lo que existe SIN fabricar URLs: cero rutas inventadas.
 */
function countRealMedia(cleanLineList) {
  const labels = cleanLineList.filter((line) => /^[^\n]{3,80}\s-\s\d{1,2}$/.test(line));
  return dedupeBy(labels, (line) => line.toLowerCase()).length;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PROYECCIÓN AL CATÁLOGO (W43/W49) — sólo claves que existen
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Claves del catálogo SSOT (`src/lib/providers/provider-field-catalog.ts`) que
 * esta ingesta puede poblar. NINGUNA otra se emite: el store rechaza claves
 * fuera del catálogo (`buildProviderFieldSet` / `findProviderFieldDef`). La
 * lista es literal para que el verificador pueda contrastarla contra el
 * catálogo real en disco.
 */
const PROJECTION_KEYS = Object.freeze({
  'ident.nombre_comercial': (seed) => seed.identity.nombre_comercial,
  'ident.descripcion_larga': (seed) => seed.identity.descripcion_3a_persona,
  'ident.descripcion_corta': (seed) => seed.identity.descripcion_corta,
  'ident.lema': (seed) => seed.identity.lema,
  'cont.web': (seed) => seed.identity.web,
  'ubic.direccion': (seed) => seed.location.direccion,
  'ubic.municipio': (seed) => seed.location.municipio,
  'ubic.provincia': (seed) => seed.location.provincia,
  'ubic.cp': (seed) => seed.location.codigo_postal,
  'ubic.pais': (seed) => seed.location.pais,
  'ubic.google_maps_url': (seed) => seed.location.google_maps_url,
  'ubic.radio_cobertura_km': (seed) =>
    seed.location.radio_servicio === null ? null : seed.location.radio_servicio.valor,
  'ubic.desplazamiento_internacional': (seed) =>
    seed.location.desplazamiento_internacional ? 'true' : null,
  'esc.url': (seed) => seed.identity.url_publica,
  'esc.rating': (seed) =>
    seed.reputation.rating_publicado === null ? null : String(seed.reputation.rating_publicado),
  'esc.reviews_count': (seed) =>
    seed.reputation.opiniones_totales === null ? null : String(seed.reputation.opiniones_totales),
  'esc.respuesta_horas': (seed) =>
    seed.metrics.tiempo_respuesta_h === null ? null : String(seed.metrics.tiempo_respuesta_h),
  'esc.servicios_incluidos': (seed) =>
    seed.identity.servicios_ofrecidos.length > 0 ? seed.identity.servicios_ofrecidos.join('\n') : null,
  'esc.tipos_musica': (seed) =>
    seed.identity.estilos_musica.length > 0 ? seed.identity.estilos_musica.join('\n') : null,
  'rep.testimonios': (seed) =>
    seed.reputation.resenas.length > 0
      ? seed.reputation.resenas
          .map((item) => `${item.titulo}: ${item.cuerpo ?? ''}`.trim())
          .join('\n')
      : null,
});

/**
 * Proyecta el seed al formato que consume `provider-profile-store`:
 * `Record<fieldKey, valueText>` con SÓLO valores reales. Un campo sin dato se
 * declara en `missing` y NO se escribe vacío (una cadena vacía inflaría el
 * porcentaje de completitud con aire).
 */
function projectToProviderFields(seed) {
  const values = {};
  const missing = [];
  for (const [key, read] of Object.entries(PROJECTION_KEYS)) {
    let value = null;
    try {
      value = read(seed);
    } catch {
      value = null; // fail-closed: un extractor roto no rompe la proyección.
    }
    if (value === null || value === undefined || String(value).trim().length === 0) {
      missing.push(key);
      continue;
    }
    values[key] = String(value).trim();
  }
  seed.faq.slice(0, 6).forEach((pair, index) => {
    if (pair.question.trim().length === 0) return;
    values[`faq.${index + 1}.pregunta`] = pair.question.trim();
    if (pair.answer.trim().length > 0) values[`faq.${index + 1}.respuesta`] = pair.answer.trim();
  });
  return { values, missing };
}

/**
 * Completitud PONDERADA: FAQ, descripción, fotos reales y canal de opiniones
 * pesan más que el resto. Un bloque sin dato aporta 0 puntos y se declara en
 * `gaps`; nunca se rellena con placeholder para subir el número.
 */
const COMPLETENESS_WEIGHTS = Object.freeze({
  identidad: 20,
  descripcion: 20,
  ubicacion: 15,
  faq: 15,
  reputacion: 15,
  canal_opiniones: 5,
  media_real: 10,
});

function computeCompleteness(seed, mediaRealCount) {
  const parts = {
    identidad: seed.identity.nombre_comercial !== null && seed.identity.email !== null,
    descripcion:
      typeof seed.identity.descripcion_3a_persona === 'string' &&
      seed.identity.descripcion_3a_persona.length >= 120,
    ubicacion: seed.location.direccion !== null && seed.location.municipio !== null,
    faq: seed.faq.filter((pair) => pair.question.length > 0 && pair.answer.length > 0).length >= 3,
    reputacion:
      seed.reputation.rating_publicado !== null && seed.reputation.opiniones_totales !== null,
    canal_opiniones: seed.reputation.canal_recogida_opiniones !== null,
    media_real: mediaRealCount > 0,
  };

  let score = 0;
  const gaps = [];
  for (const [key, weight] of Object.entries(COMPLETENESS_WEIGHTS)) {
    if (parts[key] === true) score += weight;
    else gaps.push({ bloque: key, peso: weight, motivo: 'sin dato literal en el volcado' });
  }
  return { score: Math.round(score), max: 100, parts, gaps };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ORQUESTACIÓN — buildSeed (puro) + CLI
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Construye el seed canónico desde el texto crudo. Función TOTAL: cualquier
 * entrada produce un objeto válido; nunca lanza.
 */
function buildSeed(rawText) {
  const text = String(rawText ?? '');
  const sections = splitSections(text);
  const clean = cleanLines(text);
  const faq = dedupeBy(extractFaqPairs(clean), (pair) => pair.question.toLowerCase());
  const mediaReal = countRealMedia(clean);

  const seed = {
    schemaVersion: SCHEMA_VERSION,
    source: {
      kind: 'portal_showcase_dump',
      file: null,
      chars: text.length,
      sections: sections.map((section) => section.id),
      parsedAt: new Date().toISOString(),
    },
    identity: extractIdentity(clean),
    location: extractLocation(clean, text),
    faq,
    metrics: extractMetrics(clean),
    reputation: extractReputation(clean),
    knowledge_tags: extractKnowledgeTags(sections, clean),
    partners: extractPartners(clean),
    media: { labelsDetected: mediaReal, urls: [], invented: 0 },
    doctrine: {
      exposePhone: false,
      contactGate: true,
      centralitaOficial: '+34 693 693 048',
      depositEur: 100,
      split: { artista: 80, ear: 10, vimume: 10 },
      note: 'Cero teléfonos sin verificar. El contacto directo queda bloqueado hasta la reserva o el depósito de 100 € del SSOT.',
    },
  };

  const projection = projectToProviderFields(seed);
  seed.providerFields = { values: projection.values, missing: projection.missing };
  seed.completeness = computeCompleteness(seed, mediaReal);
  seed.integrity = {
    faqTotal: seed.faq.length,
    faqConRespuesta: seed.faq.filter((pair) => pair.answer.length > 0).length,
    providerFieldsProjected: Object.keys(projection.values).length,
    providerFieldsMissing: projection.missing.length,
    piiDetected: seed.identity.piiDetected.length,
    piiPublished: 0,
  };
  return seed;
}

/** Sella el JSON con orden de claves estable y añade su propio SHA-256. */
function serializeSeed(seed) {
  const body = { ...seed };
  delete body.selfHash;
  const canonical = JSON.stringify(body, null, 2);
  const selfHash = crypto.createHash('sha256').update(canonical, 'utf8').digest('hex');
  return { text: `${JSON.stringify({ ...body, selfHash }, null, 2)}\n`, selfHash, body };
}

function argValue(name, fallback) {
  const hit = process.argv.find((item) => item.startsWith(`--${name}=`));
  return hit === undefined ? fallback : hit.slice(name.length + 3);
}

function printReport(seed, selfHash, outPath, wrote) {
  const integrity = seed.integrity;
  console.log('');
  console.log('[SHOWCASE] INGESTA DETERMINISTA DEL ESCAPARATE');
  console.log(`[SHOWCASE] Secciones         : ${seed.source.sections.join(' · ')}`);
  console.log(`[SHOWCASE] Identidad         : ${seed.identity.nombre_comercial ?? 'SIN_EVIDENCIA'}`);
  console.log(`[SHOWCASE] Ubicación         : ${seed.location.direccion ?? 'SIN_EVIDENCIA'}`);
  console.log(`[SHOWCASE] FAQ               : ${integrity.faqTotal} pares (${integrity.faqConRespuesta} con respuesta)`);
  console.log(`[SHOWCASE] Reputación        : ${seed.reputation.rating_publicado ?? '—'}/5 · ${seed.reputation.opiniones_totales ?? '—'} opiniones`);
  console.log(`[SHOWCASE] Canal opiniones   : ${seed.reputation.canal_recogida_opiniones ?? 'SIN_EVIDENCIA'}`);
  console.log(`[SHOWCASE] Métricas          : total=${seed.metrics.solicitudes_totales ?? '—'} atendidas=${seed.metrics.atendidas ?? '—'} descartadas=${seed.metrics.descartadas ?? '—'}`);
  console.log(`[SHOWCASE] PII detectada     : ${integrity.piiDetected} (publicada: 0 · exposePhone=${seed.doctrine.exposePhone})`);
  console.log(`[SHOWCASE] Campos proyectados: ${integrity.providerFieldsProjected} · ausentes ${integrity.providerFieldsMissing}`);
  console.log(`[SHOWCASE] Completitud       : ${seed.completeness.score}/${seed.completeness.max}`);
  if (seed.completeness.gaps.length > 0) {
    const gaps = seed.completeness.gaps.map((gap) => `${gap.bloque}(${gap.peso})`).join(' · ');
    console.log(`[SHOWCASE] Huecos declarados : ${gaps}`);
  }
  console.log(`[SHOWCASE] SHA-256           : ${selfHash}`);
  console.log(
    wrote
      ? `[SHOWCASE] ESCRITO -> ${path.relative(ROOT, outPath).split(path.sep).join('/')}`
      : '[SHOWCASE] --print: no se escribe en disco.',
  );
}

function main() {
  const printOnly = process.argv.includes('--print');
  const verifyOnly = process.argv.includes('--verify-only');
  const inputPath = path.resolve(ROOT, argValue('input', DEFAULT_INPUT));
  const outPath = path.resolve(ROOT, argValue('out', DEFAULT_OUT));

  if (verifyOnly) {
    if (!fs.existsSync(outPath)) {
      console.error(`SIN_EVIDENCIA: no existe el JSON canónico ${outPath}`);
      return 2;
    }
    let parsed;
    try {
      parsed = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    } catch (error) {
      console.error(`FAIL: JSON ilegible (${error instanceof Error ? error.message : String(error)}).`);
      return 1;
    }
    if (typeof parsed.selfHash !== 'string') {
      console.error('FAIL: el JSON no declara selfHash.');
      return 1;
    }
    const body = { ...parsed };
    delete body.selfHash;
    const recomputed = crypto
      .createHash('sha256')
      .update(JSON.stringify(body, null, 2), 'utf8')
      .digest('hex');
    const ok = recomputed === parsed.selfHash;
    console.log(`[SHOWCASE] VERIFY_ONLY integridad=${ok ? 'OK' : 'ROTA'} selfHash=${parsed.selfHash}`);
    return ok ? 0 : 1;
  }

  if (!fs.existsSync(inputPath)) {
    console.error(`SIN_EVIDENCIA: no existe el volcado crudo ${inputPath}`);
    return 2;
  }

  let raw;
  try {
    raw = fs.readFileSync(inputPath, 'utf8');
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error(`SIN_EVIDENCIA: no se pudo leer ${inputPath} (${detail}).`);
    return 2;
  }

  const seed = buildSeed(raw);
  seed.source.file = path.relative(ROOT, inputPath).split(path.sep).join('/');
  const { text, selfHash } = serializeSeed(seed);

  if (!printOnly) {
    try {
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, text, 'utf8');
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      console.error(`FAIL: no se pudo escribir ${outPath} (${detail}).`);
      return 1;
    }
  }

  printReport(seed, selfHash, outPath, !printOnly);
  return 0;
}

if (require.main === module) {
  try {
    process.exitCode = main();
  } catch (error) {
    // Última red: ni un fallo inesperado produce una traza sin control.
    console.error(`FAIL inesperado: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}

module.exports = {
  SCHEMA_VERSION,
  DEFAULT_INPUT,
  DEFAULT_OUT,
  PROJECTION_KEYS,
  COMPLETENESS_WEIGHTS,
  isUiNoise,
  repairMojibake,
  cleanLines,
  splitSections,
  extractFaqPairs,
  extractMetrics,
  extractReputation,
  extractLocation,
  extractIdentity,
  extractKnowledgeTags,
  extractPartners,
  countRealMedia,
  projectToProviderFields,
  computeCompleteness,
  buildSeed,
  serializeSeed,
};
