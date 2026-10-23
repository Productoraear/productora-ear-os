import { createHash } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fetchRssFeed, RssItem } from './rss-connector';
import { classifyOpportunity } from './classifier';
import { fetchTedNotices, TedNotice } from '../ted-connector';
import { fireAndForgetN8n } from '../n8n-dispatcher';
import { SAFE_LCSP_CEILING_EUR } from '@/lib/constants/ear-os-ssot';
import type {
    OpportunityCategory,
    OpportunityRecord,
    OpportunitySource,
    RadarScanResult,
    RadarStore,
} from './types';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * OPPORTUNITY RADAR — ORQUESTADOR REAL (CERO FACHADAS)
 * ════════════════════════════════════════════════════════════════════════════
 * Motor unificado de caza de oportunidades para EAR OS y su red de proveedores.
 *
 * Fuentes REALES (ninguna fabrica datos):
 *  1. Google Alerts RSS  -> env OPPORTUNITY_RADAR_FEEDS (JSON) o GOOGLE_ALERTS_RSS.
 *  2. Feeds RSS/Atom     -> BOE, sedes municipales, agregadores de convocatorias.
 *  3. TED API v3         -> env TED_API_KEY (licitaciones UE, servicios sociales).
 *
 * Idempotencia: huella SHA-256 por aviso; cada aviso se despacha UNA sola vez.
 * Fail-closed: sin fuentes configuradas => 0 avisos (nunca inventa).
 * ════════════════════════════════════════════════════════════════════════════
 */

interface FeedConfig {
    url: string;
    name: string;
    source: OpportunitySource;
}

const STORE_PATH = path.join(process.cwd(), 'src', 'data', 'opportunities_radar.json');
const HIGH_MATCH_THRESHOLD = 80;
const TELEGRAM_TOKEN = () => process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = () => process.env.TELEGRAM_CHAT_ID;

function sha256(input: string): string {
    return createHash('sha256').update(input, 'utf8').digest('hex');
}

function parseFeedConfigs(): FeedConfig[] {
    const configs: FeedConfig[] = [];
    const seen = new Set<string>();

    const push = (url: string, name: string, source: OpportunitySource): void => {
        const trimmed = url.trim();
        if (!trimmed || seen.has(trimmed)) {
            return;
        }
        seen.add(trimmed);
        configs.push({ url: trimmed, name: name || trimmed, source });
    };

    // 1. Google Alerts RSS (lista separada por comas).
    const googleAlerts = process.env.GOOGLE_ALERTS_RSS || '';
    if (googleAlerts.trim()) {
        googleAlerts
            .split(',')
            .map((entry) => entry.trim())
            .filter(Boolean)
            .forEach((url, index) => push(url, `Google Alerts #${index + 1}`, 'GOOGLE_ALERTS_RSS'));
    }

    // 2. Catálogo JSON completo de feeds (Google Alerts + BOE + municipios...).
    const raw = process.env.OPPORTUNITY_RADAR_FEEDS || '';
    if (raw.trim()) {
        try {
            const parsed: unknown = JSON.parse(raw);
            const list = Array.isArray(parsed) ? parsed : [];
            for (const entry of list) {
                if (typeof entry === 'string') {
                    push(entry, entry, 'RSS_FEED');
                } else if (typeof entry === 'object' && entry !== null) {
                    const item = entry as { url?: unknown; name?: unknown; source?: unknown };
                    if (typeof item.url === 'string') {
                        const source: OpportunitySource =
                            item.source === 'GOOGLE_ALERTS_RSS' ? 'GOOGLE_ALERTS_RSS' : 'RSS_FEED';
                        push(item.url, typeof item.name === 'string' ? item.name : item.url, source);
                    }
                }
            }
        } catch {
            // JSON malformado: se ignora el catálogo.
        }
    }

    // 3. Feeds públicos institucionales canónicos del Estado (baseline real verificable).
    // Conecta de inmediato con el Boletín Oficial del Estado (ayudas, subvenciones, convocatorias).
    const BASELINE_PUBLIC_FEEDS: readonly { url: string; name: string }[] = [
        { url: 'https://www.boe.es/rss/canal.php?c=ayudas', name: 'BOE — Subvenciones y Ayudas Públicas' },
        { url: 'https://www.boe.es/rss/canal.php?c=becas', name: 'BOE — Becas, Ayudas y Premios Culturales' },
    ];
    for (const feed of BASELINE_PUBLIC_FEEDS) {
        push(feed.url, feed.name, 'RSS_FEED');
    }

    return configs;
}

function mapRssItemToRecord(item: RssItem, feed: FeedConfig): OpportunityRecord {
    const classification = classifyOpportunity(item.title, item.description);
    const fingerprint = `${feed.url}|${item.guid}|${item.title}|${item.link}`;

    return {
        id: sha256(fingerprint),
        source: feed.source,
        sourceUrl: feed.url,
        title: item.title,
        description: item.description,
        url: item.link,
        publishedAt: item.publishedAt,
        categories: classification.categories,
        matchScore: classification.matchScore,
        matchReasons: classification.matchReasons,
        vimumeCompatible: classification.vimumeCompatible,
        firstSeenAt: new Date().toISOString(),
    };
}

function mapTedNoticeToRecord(notice: TedNotice): OpportunityRecord {
    const cpv = notice.classificationCpvs[0] ?? '';
    const isVimumeCpv = cpv.startsWith('8532') || cpv.startsWith('85312');
    const classification = classifyOpportunity(
        notice.subject,
        `${notice.buyer} ${isVimumeCpv ? 'servicios sociales mayores' : 'espectáculos'}`,
    );

    const categories: OpportunityCategory[] = isVimumeCpv
        ? ['VIMUME_SERVICIOS_SOCIALES', 'LICITACION_B2G']
        : ['LICITACION_B2G'];

    const baseValue = notice.baseValueEur ?? 0;
    const isMenor = baseValue > 0 && baseValue <= SAFE_LCSP_CEILING_EUR;
    const reasons: string[] = [
        `Fuente verificable TED UE (${notice.publicationNumber})`,
        isMenor ? 'Contrato Menor LCSP (< 14.250 €)' : 'Contrato supera techo Art. 118',
        isVimumeCpv ? 'VIMUME compatible (servicios sociales mayores)' : 'Espectáculos / eventos',
    ];

    return {
        id: sha256(`${notice.publicationNumber}|${notice.subject}|${notice.deadline ?? ''}`),
        source: 'TED_API',
        sourceUrl: notice.noticeUrl ?? 'https://ted.europa.eu',
        title: notice.subject,
        description: `${notice.subject} — ${notice.buyer}`,
        url: notice.noticeUrl ?? 'https://ted.europa.eu',
        publishedAt: notice.publicationDate,
        categories,
        matchScore: isVimumeCpv ? 92 : 82,
        matchReasons: [...reasons, ...classification.matchReasons],
        vimumeCompatible: isVimumeCpv,
        firstSeenAt: new Date().toISOString(),
    };
}

async function loadStore(): Promise<RadarStore> {
    try {
        const raw = await fs.readFile(STORE_PATH, 'utf8');
        const parsed = JSON.parse(raw) as Partial<RadarStore>;
        return {
            opportunities: Array.isArray(parsed.opportunities) ? parsed.opportunities : [],
            seenHashes: Array.isArray(parsed.seenHashes) ? parsed.seenHashes : [],
            lastScanAt: typeof parsed.lastScanAt === 'string' ? parsed.lastScanAt : null,
            scanCount: typeof parsed.scanCount === 'number' ? parsed.scanCount : 0,
        };
    } catch {
        return { opportunities: [], seenHashes: [], lastScanAt: null, scanCount: 0 };
    }
}

async function saveStore(store: RadarStore): Promise<void> {
    try {
        await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
        await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
    } catch (error) {
        console.warn('[opportunity-radar] No se pudo persistir el almacén:', error);
    }
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function formatTelegramMessage(record: OpportunityRecord): string {
    const categories = record.categories.join(' · ');
    const badges = record.vimumeCompatible
        ? `${record.matchScore}% (VIMUME <75 dB)`
        : `${record.matchScore}%`;

    return [
        `🎯 <b>OPORTUNIDAD DETECTADA (RADAR REAL)</b>`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `• <b>${escapeHtml(record.title)}</b>`,
        `• <b>Categoría:</b> ${escapeHtml(categories)}`,
        `• <b>Match:</b> ${badges}`,
        record.publishedAt
            ? `• <b>Publicado:</b> ${escapeHtml(new Date(record.publishedAt).toLocaleDateString('es-ES'))}`
            : '',
        `• <b>Fuente:</b> ${escapeHtml(record.source)}`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `👉 <a href="${escapeHtml(record.url)}">Abrir convocatoria / pliego</a>`,
        `📞 Centralita EAR: +34 693 693 048`,
    ]
        .filter((line) => line.length > 0)
        .join('\n');
}

async function sendTelegramOpportunity(record: OpportunityRecord): Promise<boolean> {
    const token = TELEGRAM_TOKEN();
    const chatId = TELEGRAM_CHAT_ID();
    if (!token || !chatId) {
        return false;
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: formatTelegramMessage(record),
                parse_mode: 'HTML',
                disable_web_page_preview: false,
            }),
        });

        if (!response.ok) {
            const body = await response.text();
            console.error(`[opportunity-radar] Telegram HTTP ${response.status}:`, body);
            return false;
        }

        const data = (await response.json()) as { ok?: boolean };
        return data.ok === true;
    } catch (error) {
        console.error('[opportunity-radar] Telegram network error:', error);
        return false;
    }
}

/**
 * Ejecuta un barrido completo del radar con fuentes REALES.
 * Devuelve un resumen honesto; jamás fabrica oportunidades.
 */
export async function runOpportunityRadar(): Promise<RadarScanResult> {
    const feeds = parseFeedConfigs();
    const hasTedKey = Boolean(process.env.TED_API_KEY);

    if (feeds.length === 0 && !hasTedKey) {
        console.warn(
            '[opportunity-radar] FAIL-CLOSED: sin OPPORTUNITY_RADAR_FEEDS/GOOGLE_ALERTS_RSS ni TED_API_KEY. 0 avisos.',
        );
        return {
            ok: false,
            source: 'FAIL_CLOSED',
            scannedFeeds: 0,
            fetchedCount: 0,
            newCount: 0,
            highMatchCount: 0,
            telegramDispatched: 0,
            n8nDispatched: 0,
            error: 'Sin fuentes reales configuradas',
            timestamp: new Date().toISOString(),
        };
    }

    const store = await loadStore();
    const seen = new Set(store.seenHashes);
    const candidates: OpportunityRecord[] = [];
    let fetchedCount = 0;

    // 1. Feeds RSS/Atom (Google Alerts + públicos).
    const feedResults = await Promise.all(feeds.map((feed) => fetchRssFeed(feed.url)));
    for (let index = 0; index < feedResults.length; index += 1) {
        const result = feedResults[index];
        fetchedCount += result.items.length;
        for (const item of result.items) {
            candidates.push(mapRssItemToRecord(item, feeds[index]));
        }
    }

    // 2. TED API v3 (licitaciones UE reales).
    if (hasTedKey) {
        const scan = await fetchTedNotices(50);
        if (scan.ok) {
            fetchedCount += scan.notices.length;
            for (const notice of scan.notices) {
                candidates.push(mapTedNoticeToRecord(notice));
            }
        }
    }

    // 3. Idempotencia: solo avisos nunca vistos.
    const fresh = candidates.filter((record) => !seen.has(record.id));
    const uniqueFresh = Array.from(new Map(fresh.map((r) => [r.id, r] as const)).values());

    const highMatch = uniqueFresh.filter((record) => record.matchScore >= HIGH_MATCH_THRESHOLD);

    // 4. Despacho REAL (Telegram + n8n) SOLO para novedades de alto match.
    let telegramDispatched = 0;
    let n8nDispatched = 0;

    for (const record of highMatch) {
        const sentTelegram = await sendTelegramOpportunity(record);
        if (sentTelegram) {
            telegramDispatched += 1;
        }

        fireAndForgetN8n('opportunity-radar', {
            os_origin: 'EAR_OS_V2_GOLD',
            id: record.id,
            title: record.title,
            url: record.url,
            categories: record.categories,
            matchScore: record.matchScore,
            vimumeCompatible: record.vimumeCompatible,
            source: record.source,
            publishedAt: record.publishedAt,
            dispatchTime: new Date().toISOString(),
        });
        n8nDispatched += 1;
    }

    // 5. Persistencia (huellas nuevas + registros).
    const mergedOpportunities = [...store.opportunities, ...uniqueFresh].slice(-500);
    const mergedHashes = [...store.seenHashes, ...uniqueFresh.map((r) => r.id)].slice(-5000);

    const nextStore: RadarStore = {
        opportunities: mergedOpportunities,
        seenHashes: mergedHashes,
        lastScanAt: new Date().toISOString(),
        scanCount: store.scanCount + 1,
    };
    await saveStore(nextStore);

    return {
        ok: true,
        source: 'OPPORTUNITY_RADAR',
        scannedFeeds: feeds.length,
        fetchedCount,
        newCount: uniqueFresh.length,
        highMatchCount: highMatch.length,
        telegramDispatched,
        n8nDispatched,
        error: null,
        timestamp: new Date().toISOString(),
    };
}

export { loadStore as getRadarStore };
export type { FeedConfig };

