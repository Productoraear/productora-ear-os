/**
 * Productora EAR OS :: Agregadora Soberana DDEX
 * Generación algorítmica de ISRC oficiales, códigos UPC-A con dígito de control
 * Módulo 10, validación DSP y exportador de manifiesto DDEX (XML/JSON) con Split 80/10/10.
 */

export interface SovereignRelease {
  id: string;
  title: string;
  artist: string;
  album: string;
  durationSeconds: number;
  genre: string;
  language: string;
  releaseDate: string;
  isrc?: string;
  upc?: string;
}

export interface DspValidationResult {
  dsp: string;
  valid: boolean;
  issues: string[];
}

export interface DdexManifest {
  schema: "DDEX ERN 4.3";
  generatedAt: string;
  release: SovereignRelease;
  splitSovereign: {
    artista: number;
    earOs: number;
    vimume: number;
  };
  validation: DspValidationResult[];
}

const EAR_REGISTRANT_CODE = "ES-EAR";
const EAR_YEAR = "26";
const EAR_LABEL_UPC_PREFIX = "8400000";

/**
 * Genera un código ISRC soberano (ES-EAR-26-XXXXX) estable y determinista.
 */
export function generateSovereignISRC(release: SovereignRelease): string {
  const seed = `${release.artist}-${release.title}-${release.album}`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const designator = (hash >>> 0) % 100000;
  return `${EAR_REGISTRANT_CODE}-${EAR_YEAR}-${designator.toString().padStart(5, "0")}`;
}

/**
 * Genera un código UPC-A con dígito de control Módulo 10.
 */
export function generateSovereignUPC(release: SovereignRelease): string {
  const seed = `${release.album}-${release.releaseDate}`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  // 11 dígitos base: 7 del prefijo + 4 de semilla de catálogo
  const catalog = (hash >>> 0) % 10000;
  const base = `${EAR_LABEL_UPC_PREFIX}${catalog.toString().padStart(4, "0")}`;
  const check = calculateUpcCheckDigit(base);
  return `${base}${check}`;
}

/**
 * Calcula el dígito verificador UPC-A (Módulo 10).
 */
export function calculateUpcCheckDigit(base: string): number {
  const digits = base.split("").map((ch) => Number(ch));
  if (digits.length !== 11 || digits.some((d) => Number.isNaN(d))) {
    return 0;
  }
  let sum = 0;
  for (let i = 0; i < digits.length; i += 1) {
    const weight = i % 2 === 0 ? 3 : 1;
    sum += digits[i] * weight;
  }
  const mod = sum % 10;
  return mod === 0 ? 0 : 10 - mod;
}

/**
 * Valida si una pista de audio cumple los requisitos mínimos para los DSP.
 */
export function validateAudioForDSP(release: SovereignRelease): DspValidationResult[] {
  const issues: string[] = [];
  if (release.durationSeconds < 30) issues.push("Duración inferior a 30 segundos.");
  if (release.durationSeconds > 900) issues.push("Duración superior a 15 minutos.");
  if (!release.artist.trim()) issues.push("Artista vacío.");
  if (!release.title.trim()) issues.push("Título vacío.");
  if (!release.isrc) issues.push("ISRC ausente.");

  return [
    { dsp: "Spotify", valid: issues.length === 0, issues },
    { dsp: "Apple Music", valid: issues.length === 0, issues },
    { dsp: "YouTube Music", valid: issues.length === 0, issues },
    { dsp: "TikTok / Instagram Reels", valid: issues.length === 0, issues },
  ];
}

/**
 * Exporta el manifiesto DDEX ERN 4.3 con ISRC, UPC y validación DSP.
 */
export function exportDDEXManifest(release: SovereignRelease): DdexManifest {
  const isrc = release.isrc || generateSovereignISRC(release);
  const upc = release.upc || generateSovereignUPC(release);
  const enriched: SovereignRelease = { ...release, isrc, upc };

  return {
    schema: "DDEX ERN 4.3",
    generatedAt: new Date().toISOString(),
    release: enriched,
    splitSovereign: {
      artista: 80,
      earOs: 10,
      vimume: 10,
    },
    validation: validateAudioForDSP(enriched),
  };
}

/**
 * Serializa el manifiesto DDEX a XML ligero.
 */
export function exportDDEXManifestXML(release: SovereignRelease): string {
  const manifest = exportDDEXManifest(release);
  const r = manifest.release;
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<DdexManifest schema="${manifest.schema}">`,
    `  <Release id="${r.id}">`,
    `    <Title>${escapeXml(r.title)}</Title>`,
    `    <Artist>${escapeXml(r.artist)}</Artist>`,
    `    <Album>${escapeXml(r.album)}</Album>`,
    `    <ISRC>${r.isrc}</ISRC>`,
    `    <UPC>${r.upc}</UPC>`,
    `    <Genre>${escapeXml(r.genre)}</Genre>`,
    `    <DurationSeconds>${r.durationSeconds}</DurationSeconds>`,
    `  </Release>`,
    `  <SplitSovereign artista="${manifest.splitSovereign.artista}" earOs="${manifest.splitSovereign.earOs}" vimume="${manifest.splitSovereign.vimume}" />`,
    `</DdexManifest>`,
  ].join("\n");
}

function escapeXml(value: string): string {
  const amp = "&";
  return value
    .replace(/&/g, amp + "amp;")
    .replace(/</g, amp + "lt;")
    .replace(/>/g, amp + "gt;")
    .replace(/"/g, amp + "quot;")
    .replace(/'/g, amp + "apos;");
}
