export type LeadTemperature = "FRIO" | "TEMPLADO" | "CALIENTE";

export type ChangeFreq = "daily" | "weekly" | "monthly";

export interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: ChangeFreq;
  priority: number;
  temperature: LeadTemperature;
}

interface TemperatureProfile {
  priority: number;
  changefreq: ChangeFreq;
  paths: readonly string[];
}

const TEMPERATURE_PROFILES: Readonly<Record<LeadTemperature, TemperatureProfile>> = {
  CALIENTE: {
    priority: 1.0,
    changefreq: "daily",
    paths: [
      "/reservar/solista",
      "/reservar/solista/blindaje-vip",
      "/reservar/boda",
      "/reservar/evento-corporativo",
    ],
  },
  TEMPLADO: {
    priority: 0.8,
    changefreq: "weekly",
    paths: [
      "/precios",
      "/fincas-homologadas",
      "/comparativas/solista-vs-orquesta",
      "/comparativas/dj-vs-musica-en-directo",
    ],
  },
  FRIO: {
    priority: 0.6,
    changefreq: "monthly",
    paths: [
      "/ideas/musica-para-bodas",
      "/estilos/jazz-acustico",
      "/estilos/flamenco-de-gala",
      "/guia/decibelios-eventos",
    ],
  },
};

const TEMPERATURE_ORDER: readonly LeadTemperature[] = ["CALIENTE", "TEMPLADO", "FRIO"];

const DEFAULT_BASE_URL = "https://www.productoraear.com";

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function normalizeBaseUrl(baseUrl: string): string {
  try {
    const parsed = new URL(baseUrl);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return DEFAULT_BASE_URL;
    return parsed.origin;
  } catch {
    return DEFAULT_BASE_URL;
  }
}

export function buildTemperatureEntries(
  baseUrl: string = DEFAULT_BASE_URL,
  now: Date = new Date()
): SitemapEntry[] {
  const origin = normalizeBaseUrl(baseUrl);
  const lastmod = now.toISOString();
  const entries: SitemapEntry[] = [];
  for (const temperature of TEMPERATURE_ORDER) {
    const profile = TEMPERATURE_PROFILES[temperature];
    for (const path of profile.paths) {
      entries.push({
        loc: `${origin}${path}`,
        lastmod,
        changefreq: profile.changefreq,
        priority: profile.priority,
        temperature,
      });
    }
  }
  return entries;
}

export function renderSitemapXml(entries: readonly SitemapEntry[]): string {
  const body = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${escapeXml(e.loc)}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority.toFixed(1)}</priority>\n  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export function generateTemperatureSitemap(baseUrl?: string): string {
  return renderSitemapXml(buildTemperatureEntries(baseUrl));
}
