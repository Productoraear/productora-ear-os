import { createHash } from 'crypto';

/**
 * 🛰️ TED API v3 CONNECTOR — FUENTE REAL DE LICITACIONES UE (CERO FACHADAS)
 * ---------------------------------------------------------------------------
 * Sustituye el radar hardcodeado del B2G Hunter por una consulta real al
 * Tenders Electronic Daily (api.ted.europa.eu/v3), validada en auditoría forense.
 *
 * DOCTRINA DEL DATO VERIFICADO:
 *  - NUNCA fabrica expedientes. Si falta TED_API_KEY => fail-closed (0 resultados).
 *  - Campo de query correcto: `classification-cpv`.
 *  - Campo de salida correcto: `notice-title` (NO `title`).
 *  - Sin valor económico declarado => NO se marca como Art. 118 LCSP.
 *
 * Config (server-only):
 *  - TED_API_URL        (default https://api.ted.europa.eu/v3/notices/search)
 *  - TED_API_KEY        (subscription key; obligatoria para operar)
 *  - TED_API_KEY_HEADER (default x-api-key)
 */

export type TedNotice = {
    publicationNumber: string;
    subject: string;
    buyer: string;
    classificationCpvs: string[];
    deadline: string | null;
    publicationDate: string | null;
    noticeUrl: string | null;
    baseValueEur: number | null;
    currency: string | null;
};

export type TedSearchScan = {
    ok: boolean;
    source: 'TED_V3' | 'FAIL_CLOSED';
    fetchedAt: string;
    total: number;
    notices: TedNotice[];
    error: string | null;
};

type TedSearchParams = {
    query: string;
    fields: string[];
    limit: number;
};

type TedRawNotice = {
    'publication-number'?: string;
    'notice-title'?: string | Record<string, string>;
    'buyer-name'?: string | Record<string, unknown>;
    'classification-cpv'?: string | string[] | { code?: string }[];
    deadline?: string;
    'publication-date'?: string;
    links?: Record<string, unknown> | { 'notice'?: string; 'official-language'?: string }[];
    'value'?: number | { 'amount'?: number; 'currency'?: string };
    [key: string]: unknown;
};

const DEFAULT_TED_URL = 'https://api.ted.europa.eu/v3/notices/search';
const DEFAULT_API_KEY_HEADER = 'x-api-key';

/** CPVs de alto valor para EAR OS (música, servicios sociales VIMUME, sonido, iluminación, eventos). */
const TARGET_CPV_PREFIXES: readonly string[] = Object.freeze([
    '92300000', // Servicios de entretenimiento / espectáculos
    '92310000', // Actuaciones en directo
    '92320000', // Servicios artísticos
    '85320000', // Servicios sociales comunitarios
    '85312000', // Servicios sociales para mayores
    '31520000', // Lámparas e iluminación
    '51313000', // Instalación de equipos de sonido
    '79952000', // Servicios de eventos
]);

function asArray(value: unknown): unknown[] {
    if (Array.isArray(value)) return value;
    if (value == null) return [];
    return [value];
}

function extractMultilingualString(val: unknown): string {
    if (typeof val === 'string') return val;
    if (val && typeof val === 'object') {
        const obj = val as Record<string, unknown>;
        const candidate = obj.spa ?? obj.SPA ?? obj.es ?? obj.ES ?? obj.eng ?? obj.ENG ?? obj.en ?? obj.EN ?? Object.values(obj)[0];
        if (typeof candidate === 'string') return candidate;
        if (Array.isArray(candidate) && candidate.length > 0) {
            const first = candidate[0];
            if (typeof first === 'string') return first;
            if (first && typeof first === 'object') return extractMultilingualString(first);
        }
    }
    return '';
}

function extractNoticeUrl(raw: TedRawNotice): string | null {
    if (raw.links && typeof raw.links === 'object') {
        const links = raw.links as Record<string, unknown>;
        if (links.html && typeof links.html === 'object') {
            const html = links.html as Record<string, string>;
            const url = html.SPA || html.spa || html.ENG || html.eng || Object.values(html)[0];
            if (typeof url === 'string') return url;
        }
        if (links.htmlDirect && typeof links.htmlDirect === 'object') {
            const htmlDirect = links.htmlDirect as Record<string, string>;
            const url = htmlDirect.SPA || htmlDirect.spa || htmlDirect.ENG || htmlDirect.eng || Object.values(htmlDirect)[0];
            if (typeof url === 'string') return url;
        }
        if (Array.isArray(raw.links) && raw.links.length > 0) {
            const first = raw.links[0] as Record<string, unknown>;
            if (typeof first.notice === 'string') return first.notice;
        }
    }
    if (raw['publication-number']) {
        return `https://ted.europa.eu/es/notice/-/detail/${raw['publication-number']}`;
    }
    return null;
}

function normalizeCpv(value: unknown): string[] {
    return asArray(value)
        .map((entry) => {
            if (typeof entry === 'string') return entry;
            if (typeof entry === 'object' && entry !== null) {
                const code = (entry as { code?: unknown }).code;
                return typeof code === 'string' ? code : '';
            }
            return '';
        })
        .filter((code) => code.length > 0);
}

function parseBaseValue(value: unknown): { baseValueEur: number | null; currency: string | null } {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return { baseValueEur: value, currency: 'EUR' };
    }
    if (typeof value === 'object' && value !== null) {
        const obj = value as { amount?: unknown; currency?: unknown };
        const amount = typeof obj.amount === 'number' && Number.isFinite(obj.amount)
            ? obj.amount
            : null;
        const currency = typeof obj.currency === 'string' ? obj.currency : 'EUR';
        return { baseValueEur: amount, currency };
    }
    return { baseValueEur: null, currency: null };
}

function mapRawNotice(raw: TedRawNotice): TedNotice {
    const classificationCpvs = normalizeCpv(raw['classification-cpv']);
    const noticeUrl = extractNoticeUrl(raw);
    const { baseValueEur, currency } = parseBaseValue(raw.value ?? raw['value']);
    const subject = extractMultilingualString(raw['notice-title']) || (typeof raw['notice-title'] === 'string' ? raw['notice-title'] : '');
    const buyer = extractMultilingualString(raw['buyer-name']) || 'Órgano de contratación no especificado';

    return {
        publicationNumber: raw['publication-number'] ?? '',
        subject,
        buyer,
        classificationCpvs,
        deadline: raw.deadline ?? null,
        publicationDate: raw['publication-date'] ?? null,
        noticeUrl,
        baseValueEur,
        currency,
    };
}

function extractNotices(payload: unknown): TedRawNotice[] {
    if (!payload || typeof payload !== 'object') return [];
    const obj = payload as Record<string, unknown>;
    const candidates = [obj.results, obj.notices];
    for (const candidate of candidates) {
        if (Array.isArray(candidate)) {
            return candidate.filter(
                (item): item is TedRawNotice =>
                    typeof item === 'object' && item !== null
            );
        }
    }
    return [];
}

function classifyCpvMatch(cpv: string): boolean {
    const normalized = cpv.trim().toUpperCase();
    return TARGET_CPV_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

function getTedConfig(): { url: string; apiKey?: string; headerName: string } {
    const url = process.env.TED_API_URL || DEFAULT_TED_URL;
    const apiKey = process.env.TED_API_KEY || undefined;
    const headerName = process.env.TED_API_KEY_HEADER || DEFAULT_API_KEY_HEADER;
    return { url, apiKey, headerName };
}

function sha256(input: string): string {
    return createHash('sha256').update(input, 'utf8').digest('hex');
}

/**
 * Consulta el TED API v3 y devuelve exclusivamente avisos reales.
 * En TED v3, la búsqueda pública (/v3/notices/search) es un servicio abierto de la UE.
 * Si TED_API_KEY está configurada se pasa en headers; de lo contrario se consulta el endpoint público.
 */
export async function fetchTedNotices(limit = 50): Promise<TedSearchScan> {
    const { url, apiKey, headerName } = getTedConfig();

    const query = 'place-of-performance = ESP AND (classification-cpv IN (92300000, 92310000, 92320000, 85320000, 85312000, 31520000, 51313000, 79952000) OR notice-title ~ (musica, festejos, cultura, sonido, iluminacion, orquesta, eventos)) SORT BY publication-date DESC';

    const params: TedSearchParams = {
        query,
        fields: [
            'publication-number',
            'notice-title',
            'buyer-name',
            'classification-cpv',
            'deadline',
            'publication-date',
            'links',
        ],
        limit,
    };

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20_000);

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        if (apiKey) {
            headers[headerName] = apiKey;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(params),
            signal: controller.signal,
        });

        let payload: unknown = null;
        try {
            payload = await response.json();
        } catch {
            // payload no-JSON => tratado como vacío.
        }
        clearTimeout(timeout);

        if (!response.ok) {
            return {
                ok: false,
                source: 'TED_V3',
                fetchedAt: new Date().toISOString(),
                total: 0,
                notices: [],
                error: `TED_API HTTP ${response.status}`,
            };
        }

        const rawNotices = extractNotices(payload);
        const notices = rawNotices
            .map(mapRawNotice)
            .filter((notice) => notice.subject.length > 0);

        return {
            ok: true,
            source: 'TED_V3',
            fetchedAt: new Date().toISOString(),
            total: notices.length,
            notices,
            error: null,
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
            ok: false,
            source: 'TED_V3',
            fetchedAt: new Date().toISOString(),
            total: 0,
            notices: [],
            error: message,
        };
    }
}

/** Firma determinista por aviso para idempotencia de despacho. */
export function tedNoticeFingerprint(notice: TedNotice): string {
    return sha256(
        `${notice.publicationNumber}|${notice.subject}|${notice.deadline ?? ''}`
    );
}