import { createHash } from 'crypto';
import {
  type MetricKey,
  type MetricPoint,
  getPlatform,
  METRIC_KEYS,
} from '@/lib/career/platform-registry';

/**
 * Mapeo declarativo de cabeceras de columnas conocidas a claves canónicas MetricKey.
 */
interface ColumnMapping {
  readonly patterns: readonly RegExp[];
  readonly metric: MetricKey;
  readonly isMoney?: boolean;
}

const PLATFORM_COLUMN_MAPPINGS: Readonly<Record<string, readonly ColumnMapping[]>> = Object.freeze({
  'apple-music': [
    { patterns: [/^plays$/i, /^reproducciones$/i, /^streams$/i], metric: 'plays' },
    { patterns: [/^listeners$/i, /^oyentes$/i, /^unique_listeners$/i], metric: 'listeners' },
    { patterns: [/^saves$/i, /^guardados$/i, /^shazams$/i], metric: 'saves' },
  ],
  'amazon-music': [
    { patterns: [/^plays$/i, /^reproducciones$/i, /^streams$/i], metric: 'plays' },
    { patterns: [/^listeners$/i, /^oyentes$/i], metric: 'listeners' },
  ],
  tidal: [
    { patterns: [/^plays$/i, /^streams$/i, /^reproducciones$/i], metric: 'plays' },
  ],
  bandcamp: [
    { patterns: [/^plays$/i, /^streams$/i, /^plays_total$/i], metric: 'plays' },
    { patterns: [/^amount$/i, /^revenue$/i, /^total$/i, /^importe$/i, /^net_revenue$/i], metric: 'revenue_cents', isMoney: true },
  ],
  ticketmaster: [
    { patterns: [/^tickets$/i, /^entradas$/i, /^tickets_sold$/i, /^cantidad$/i], metric: 'tickets_sold' },
    { patterns: [/^revenue$/i, /^importe$/i, /^total$/i, /^net_amount$/i], metric: 'revenue_cents', isMoney: true },
  ],
  distrokid: [
    { patterns: [/^quantity$/i, /^streams$/i, /^plays$/i], metric: 'plays' },
    { patterns: [/^earnings$/i, /^revenue$/i, /^amount$/i, /^net_usd$/i, /^net_eur$/i], metric: 'revenue_cents', isMoney: true },
  ],
  sgae: [
    { patterns: [/^importe$/i, /^derechos$/i, /^neto$/i, /^liquidado$/i, /^amount$/i], metric: 'revenue_cents', isMoney: true },
  ],
});

export interface RejectedRow {
  readonly line: number;
  readonly raw: string;
  readonly reason: string;
}

export interface CsvImportResult {
  readonly platformId: string;
  readonly totalRows: number;
  readonly acceptedPoints: readonly MetricPoint[];
  readonly rejectedRows: readonly RejectedRow[];
  readonly duplicatesSkipped: number;
}

/**
 * Normaliza cantidades monetarias a céntimos enteros (EUR/USD céntimos).
 * Tolera formato europeo (12,50 € -> 1250) y anglosajón ($12.50 -> 1250).
 */
export function parseMoneyToCents(raw: string): number | null {
  const clean = raw.replace(/[^\d.,-]/g, '').trim();
  if (clean.length === 0) return null;

  // Si tiene coma y punto, asumimos formato según posición del último separador
  let normalized = clean;
  const lastComma = clean.lastIndexOf(',');
  const lastDot = clean.lastIndexOf('.');

  if (lastComma > -1 && lastDot > -1) {
    if (lastComma > lastDot) {
      // 1.234,56
      normalized = clean.replace(/\./g, '').replace(',', '.');
    } else {
      // 1,234.56
      normalized = clean.replace(/,/g, '');
    }
  } else if (lastComma > -1) {
    normalized = clean.replace(',', '.');
  }

  const num = parseFloat(normalized);
  if (Number.isNaN(num) || !Number.isFinite(num)) return null;
  return Math.round(num * 100);
}

/**
 * Normaliza contadores enteros (plays, listeners, tickets, etc.).
 */
export function parseIntegerCounter(raw: string): number | null {
  const clean = raw.replace(/[^\d-]/g, '').trim();
  if (clean.length === 0) return null;
  const num = parseInt(clean, 10);
  if (Number.isNaN(num) || !Number.isFinite(num)) return null;
  return num;
}

/**
 * Divide una línea de CSV respetando entrecomillados.
 */
function splitCsvLine(line: string, delimiter: string): readonly string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim().replace(/^["']|["']$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^["']|["']$/g, ''));
  return result;
}

/**
 * Parser de CSV universal tolerante para plataformas musicales y de ticketing.
 */
export function parseCareerCsv(
  content: string,
  platformId: string,
  artistId: string = 'e78903',
): CsvImportResult {
  const platform = getPlatform(platformId);
  if (!platform) {
    return {
      platformId,
      totalRows: 0,
      acceptedPoints: [],
      rejectedRows: [{ line: 0, raw: '', reason: `Plataforma ${platformId} no registrada en platform-registry.ts` }],
      duplicatesSkipped: 0,
    };
  }

  const rawLines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (rawLines.length === 0) {
    return {
      platformId,
      totalRows: 0,
      acceptedPoints: [],
      rejectedRows: [{ line: 0, raw: '', reason: 'Archivo CSV vacío' }],
      duplicatesSkipped: 0,
    };
  }

  // Detección automática del delimitador (, o ;)
  const firstLine = rawLines[0];
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;
  const delimiter = semiCount > commaCount ? ';' : ',';

  const headers = splitCsvLine(firstLine, delimiter).map((h) => h.toLowerCase());
  const mappings = PLATFORM_COLUMN_MAPPINGS[platformId] ?? [];

  // Mapear índices de cabecera a métricas
  const headerIndices: { readonly index: number; readonly metric: MetricKey; readonly isMoney: boolean }[] = [];

  headers.forEach((header, colIndex) => {
    for (const mapping of mappings) {
      if (mapping.patterns.some((pattern) => pattern.test(header))) {
        headerIndices.push({
          index: colIndex,
          metric: mapping.metric,
          isMoney: !!mapping.isMoney,
        });
        break;
      }
    }
  });

  if (headerIndices.length === 0) {
    return {
      platformId,
      totalRows: rawLines.length - 1,
      acceptedPoints: [],
      rejectedRows: [
        {
          line: 1,
          raw: firstLine,
          reason: `No se reconocieron columnas métricas válidas para ${platformId}. Cabeceras detectadas: ${headers.join(', ')}`,
        },
      ],
      duplicatesSkipped: 0,
    };
  }

  const accepted: MetricPoint[] = [];
  const rejected: RejectedRow[] = [];
  const seenRowHashes = new Set<string>();
  let duplicatesSkipped = 0;

  for (let i = 1; i < rawLines.length; i++) {
    const rawLine = rawLines[i];
    const rowHash = createHash('sha256').update(rawLine).digest('hex');

    if (seenRowHashes.has(rowHash)) {
      duplicatesSkipped++;
      continue;
    }
    seenRowHashes.add(rowHash);

    const cols = splitCsvLine(rawLine, delimiter);
    let rowParsed = false;

    // Fecha de captura (si existe columna 'date'/'fecha', usarla; si no, ISO actual)
    let capturedAt = new Date().toISOString();
    const dateColIdx = headers.findIndex((h) => /^(date|fecha|timestamp|periodo)$/i.test(h));
    if (dateColIdx > -1 && cols[dateColIdx]) {
      const parsedDate = new Date(cols[dateColIdx]);
      if (!Number.isNaN(parsedDate.getTime())) {
        capturedAt = parsedDate.toISOString();
      }
    }

    for (const mapping of headerIndices) {
      const rawVal = cols[mapping.index];
      if (!rawVal) continue;

      const val = mapping.isMoney ? parseMoneyToCents(rawVal) : parseIntegerCounter(rawVal);
      if (val === null) continue;

      if (!METRIC_KEYS.includes(mapping.metric)) continue;

      accepted.push({
        artistId,
        platformId,
        metric: mapping.metric,
        value: val,
        capturedAt,
        source: 'csv',
      });
      rowParsed = true;
    }

    if (!rowParsed) {
      rejected.push({
        line: i + 1,
        raw: rawLine,
        reason: 'Fila sin valores numéricos interpretables en las columnas mapeadas',
      });
    }
  }

  return {
    platformId,
    totalRows: rawLines.length - 1,
    acceptedPoints: accepted,
    rejectedRows: rejected,
    duplicatesSkipped,
  };
}
