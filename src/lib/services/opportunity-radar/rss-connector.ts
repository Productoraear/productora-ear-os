import * as cheerio from 'cheerio';
import type { AnyNode } from 'domhandler';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * RSS / ATOM CONNECTOR (GOOGLE ALERTS + FEEDS PÚBLICOS)
 * ════════════════════════════════════════════════════════════════════════════
 * Conector REAL de ingestión de feeds RSS 2.0 y Atom 1.0.
 *
 *  - Google Alerts expone cada alerta como feed RSS/Atom con una URL opaca
 *    (https://www.google.com/alerts/feeds/<ALERT_ID>/<UNIQUE_ID>).
 *  - BOE, sedes electrónicas municipales y agregadores de convocatorias
 *    publican feeds RSS/Atom que este conector normaliza de forma uniforme.
 *
 * DOCTRINA DEL DATO VERIFICADO:
 *  - Sin red o con feed inválido => devuelve `items: []` y `error` (FAIL-CLOSED).
 *  - Jamás fabrica títulos ni enlaces: solo normaliza lo que la fuente devuelve.
 * ════════════════════════════════════════════════════════════════════════════
 */

export interface RssItem {
    title: string;
    link: string;
    description: string;
    publishedAt: string | null;
    guid: string;
}

export interface RssFetchResult {
    ok: boolean;
    url: string;
    items: RssItem[];
    error: string | null;
}

const FETCH_TIMEOUT_MS = 12_000;
const MAX_ITEMS = 30;

function decodeEntities(raw: string): string {
    try {
        // cheerio decodifica entidades HTML y elimina el marcado sobrante.
        return cheerio.load(raw, { xmlMode: false }).text().trim();
    } catch {
        return raw.trim();
    }
}

function firstNonEmpty(...values: Array<string | undefined | null>): string {
    for (const value of values) {
        if (value && value.trim().length > 0) {
            return value.trim();
        }
    }
    return '';
}

function extractText(scope: cheerio.Cheerio<AnyNode>, selector: string): string {
    const node = scope.find(selector).first();
    return decodeEntities(node.text() ?? '');
}

function extractLink(scope: cheerio.Cheerio<AnyNode>): string {
    // Atom usa <link href="...">; RSS 2.0 usa <link>texto</link> o <guid>.
    const atomLink = scope.find('link').first();
    const href = atomLink.attr('href');
    if (href && href.trim().length > 0) {
        return href.trim();
    }
    const textLink = scope.find('link').first().text();
    if (textLink && textLink.trim().length > 0) {
        return textLink.trim();
    }
    return '';
}

function normalizeDate(raw: string | undefined | null): string | null {
    if (!raw || raw.trim().length === 0) {
        return null;
    }
    const parsed = new Date(raw.trim());
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

/**
 * Descarga y normaliza un feed RSS/Atom desde una URL real.
 * Devuelve siempre un resultado resuelto (nunca lanza).
 */
export async function fetchRssFeed(url: string): Promise<RssFetchResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
            },
            signal: controller.signal,
            redirect: 'follow',
        });

        if (!response.ok) {
            return { ok: false, url, items: [], error: `HTTP ${response.status}` };
        }

        const contentType = response.headers.get('content-type') || '';
        const isIso = /charset=(iso-8859-1|latin1)/i.test(contentType);
        const buffer = await response.arrayBuffer();
        const xml = new TextDecoder(isIso ? 'iso-8859-1' : 'utf-8').decode(buffer);

        if (!xml || xml.trim().length === 0) {
            return { ok: false, url, items: [], error: 'Feed vacío' };
        }

        // Modo XML: preserva mayúsculas/minúsculas de las etiquetas (RSS/Atom).
        const $ = cheerio.load(xml, { xmlMode: true });

        const items: RssItem[] = [];
        const entries = $('item, entry');

        entries.each((_, element) => {
            if (items.length >= MAX_ITEMS) {
                return;
            }

            const scope = $(element);

            const title = extractText(scope, 'title');
            const link = extractLink(scope);
            const description = firstNonEmpty(
                extractText(scope, 'description'),
                extractText(scope, 'summary'),
                extractText(scope, 'content'),
            );

            const pubDate = firstNonEmpty(
                scope.find('pubDate').first().text(),
                scope.find('published').first().text(),
                scope.find('updated').first().text(),
            );

            const guid = firstNonEmpty(
                scope.find('guid').first().text(),
                scope.find('id').first().text(),
            );

            items.push({
                title: title || link || 'Sin título',
                link: link || url,
                description,
                publishedAt: normalizeDate(pubDate),
                guid: guid || `${link}|${title}`,
            });
        });

        return { ok: true, url, items, error: null };
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { ok: false, url, items: [], error: message };
    } finally {
        clearTimeout(timeout);
    }
}
