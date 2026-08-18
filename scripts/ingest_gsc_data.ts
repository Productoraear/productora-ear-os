/**
 * 🛰️ MOTOR DE INGESTA & PROCESAMIENTO AUTOMATIZADO DE GOOGLE SEARCH CONSOLE (GSC)
 * Lee los archivos CSV exportados en 'g s console/' o subdirectorios de fecha,
 * calcula métricas de rendimiento, clústeres de oportunidad y canibalizaciones,
 * y genera el dataset estructurado en 'src/data/telemetry/gsc-performance-data.json'.
 */

import fs from 'fs';
import path from 'path';

export interface GscQueryItem {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number; // Porcentaje numérico (ej: 3.03)
  position: number;
  opportunityScore: number; // Alto si tiene muchas impresiones y posición entre 8 y 40
}

export interface GscPageItem {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GscDeviceItem {
  device: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GscCountryItem {
  country: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GscDateItem {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GscPerformanceDataset {
  meta: {
    lastIngestedAt: string;
    sourceDirectory: string;
    searchType: string;
    dateRange: string;
  };
  totals: {
    totalClicks: number;
    totalImpressions: number;
    averageCtr: number;
    averagePosition: number;
    totalUniqueQueries: number;
    totalUniquePages: number;
  };
  topOpportunityQueries: GscQueryItem[];
  topPerformingQueries: GscQueryItem[];
  topPages: GscPageItem[];
  devices: GscDeviceItem[];
  topCountries: GscCountryItem[];
  timelineSummary: {
    startDate: string;
    endDate: string;
    totalDays: number;
  };
}

function parseNumber(val: string): number {
  if (!val) return 0;
  const clean = val.replace(/%/g, '').replace(/,/g, '.').trim();
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

function parseCsv(content: string): string[][] {
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  return lines.map(line => {
    // Simple CSV parser supporting standard commas and quoted strings
    const row: string[] = [];
    let insideQuote = false;
    let currentCell = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if ((char === ',' || char === ';') && !insideQuote) {
        row.push(currentCell.trim());
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    row.push(currentCell.trim());
    return row;
  });
}

function extractDateFromFolderName(name: string): number {
  // Buscar formato YYYY-MM-DD
  const isoMatch = name.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return new Date(`${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`).getTime();
  }

  // Buscar formato DD MM YYYY
  const dmyMatch = name.match(/(\d{1,2})[ _-](\d{1,2})[ _-](\d{4})/);
  if (dmyMatch) {
    return new Date(`${dmyMatch[3]}-${dmyMatch[2].padStart(2, '0')}-${dmyMatch[1].padStart(2, '0')}`).getTime();
  }

  return 0;
}

function findLatestGscDirectory(baseDir: string): string {
  if (!fs.existsSync(baseDir)) {
    throw new Error(`Directorio base GSC no encontrado: ${baseDir}`);
  }

  const entries = fs.readdirSync(baseDir, { withFileTypes: true });
  const subdirs = entries.filter(e => e.isDirectory()).map(e => path.join(baseDir, e.name));

  if (subdirs.length === 0) {
    return baseDir;
  }

  // Ordenar por fecha cronológica extraída del nombre, o fallback a mtime
  subdirs.sort((a, b) => {
    const dateA = extractDateFromFolderName(path.basename(a)) || fs.statSync(a).mtime.getTime();
    const dateB = extractDateFromFolderName(path.basename(b)) || fs.statSync(b).mtime.getTime();
    return dateB - dateA;
  });

  return subdirs[0];
}

export function ingestGscData(targetDir?: string): GscPerformanceDataset {
  const rootDir = process.cwd();
  const baseGscDir = targetDir || path.join(rootDir, 'g s console');
  const gscDir = findLatestGscDirectory(baseGscDir);

  console.log(`📡 [GSC INGEST] Procesando directorio: ${gscDir}`);

  // 1. Parsear Filtros
  let searchType = 'Web';
  let dateRange = 'Últimos 16 meses';
  const filtrosPath = path.join(gscDir, 'Filtros.csv');
  if (fs.existsSync(filtrosPath)) {
    const raw = fs.readFileSync(filtrosPath, 'utf-8');
    const rows = parseCsv(raw);
    rows.forEach(r => {
      if (r[0]?.toLowerCase().includes('búsqueda') || r[0]?.toLowerCase().includes('busqueda')) {
        searchType = r[1] || searchType;
      }
      if (r[0]?.toLowerCase().includes('fecha')) {
        dateRange = r[1] || dateRange;
      }
    });
  }

  // 2. Parsear Consultas.csv
  const queriesList: GscQueryItem[] = [];
  const consultasPath = path.join(gscDir, 'Consultas.csv');
  if (fs.existsSync(consultasPath)) {
    const raw = fs.readFileSync(consultasPath, 'utf-8');
    const rows = parseCsv(raw);
    const dataRows = rows.slice(1); // Omitir cabecera

    dataRows.forEach(r => {
      if (r.length >= 5) {
        const query = r[0].replace(/^"|"$/g, '');
        const clicks = Math.round(parseNumber(r[1]));
        const impressions = Math.round(parseNumber(r[2]));
        const ctr = parseNumber(r[3]);
        const position = parseNumber(r[4]);

        // Score de Oportunidad: alto si hay muchas impresiones pero CTR bajo y posición rescatable (10 a 50)
        let opportunityScore = 0;
        if (impressions > 20 && position >= 10 && position <= 50) {
          opportunityScore = Math.round((impressions / Math.max(1, position)) * (100 - ctr));
        }

        if (query) {
          queriesList.push({
            query,
            clicks,
            impressions,
            ctr,
            position,
            opportunityScore
          });
        }
      }
    });
  }

  // 3. Parsear Páginas.csv
  const pagesList: GscPageItem[] = [];
  const paginasPath = path.join(gscDir, 'Páginas.csv');
  if (fs.existsSync(paginasPath)) {
    const raw = fs.readFileSync(paginasPath, 'utf-8');
    const rows = parseCsv(raw);
    const dataRows = rows.slice(1);

    dataRows.forEach(r => {
      if (r.length >= 5) {
        const page = r[0].replace(/^"|"$/g, '');
        const clicks = Math.round(parseNumber(r[1]));
        const impressions = Math.round(parseNumber(r[2]));
        const ctr = parseNumber(r[3]);
        const position = parseNumber(r[4]);

        if (page) {
          pagesList.push({
            page,
            clicks,
            impressions,
            ctr,
            position
          });
        }
      }
    });
  }

  // 4. Parsear Dispositivos.csv
  const devicesList: GscDeviceItem[] = [];
  const dispositivosPath = path.join(gscDir, 'Dispositivos.csv');
  if (fs.existsSync(dispositivosPath)) {
    const raw = fs.readFileSync(dispositivosPath, 'utf-8');
    const rows = parseCsv(raw);
    rows.slice(1).forEach(r => {
      if (r.length >= 5) {
        devicesList.push({
          device: r[0],
          clicks: Math.round(parseNumber(r[1])),
          impressions: Math.round(parseNumber(r[2])),
          ctr: parseNumber(r[3]),
          position: parseNumber(r[4])
        });
      }
    });
  }

  // 5. Parsear Países.csv
  const countriesList: GscCountryItem[] = [];
  const paisesPath = path.join(gscDir, 'Países.csv');
  if (fs.existsSync(paisesPath)) {
    const raw = fs.readFileSync(paisesPath, 'utf-8');
    const rows = parseCsv(raw);
    rows.slice(1).forEach(r => {
      if (r.length >= 5) {
        countriesList.push({
          country: r[0],
          clicks: Math.round(parseNumber(r[1])),
          impressions: Math.round(parseNumber(r[2])),
          ctr: parseNumber(r[3]),
          position: parseNumber(r[4])
        });
      }
    });
  }

  // 6. Parsear Gráfico.csv
  const datesList: GscDateItem[] = [];
  const graficoPath = path.join(gscDir, 'Gráfico.csv');
  if (fs.existsSync(graficoPath)) {
    const raw = fs.readFileSync(graficoPath, 'utf-8');
    const rows = parseCsv(raw);
    rows.slice(1).forEach(r => {
      if (r.length >= 2 && r[0]) {
        datesList.push({
          date: r[0],
          clicks: Math.round(parseNumber(r[1])),
          impressions: Math.round(parseNumber(r[2])),
          ctr: parseNumber(r[3]),
          position: parseNumber(r[4])
        });
      }
    });
  }

  // Cálculos Agregados Globales
  const totalClicks = queriesList.reduce((acc, q) => acc + q.clicks, 0) || devicesList.reduce((acc, d) => acc + d.clicks, 0);
  const totalImpressions = queriesList.reduce((acc, q) => acc + q.impressions, 0) || devicesList.reduce((acc, d) => acc + d.impressions, 0);
  const avgCtr = totalImpressions > 0 ? parseFloat(((totalClicks / totalImpressions) * 100).toFixed(2)) : 0;
  const avgPosition = queriesList.length > 0
    ? parseFloat((queriesList.reduce((acc, q) => acc + q.position, 0) / queriesList.length).toFixed(1))
    : 0;

  // Top Oportunidades: Ordenadas por Opportunity Score descendente
  const topOpportunityQueries = [...queriesList]
    .sort((a, b) => b.opportunityScore - a.opportunityScore)
    .slice(0, 30);

  // Top Rendimiento: Ordenadas por Clics e Impresiones
  const topPerformingQueries = [...queriesList]
    .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions)
    .slice(0, 30);

  // Top Páginas
  const topPages = [...pagesList]
    .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions)
    .slice(0, 50);

  const dataset: GscPerformanceDataset = {
    meta: {
      lastIngestedAt: new Date().toISOString(),
      sourceDirectory: path.basename(gscDir),
      searchType,
      dateRange
    },
    totals: {
      totalClicks,
      totalImpressions,
      averageCtr: avgCtr,
      averagePosition: avgPosition,
      totalUniqueQueries: queriesList.length,
      totalUniquePages: pagesList.length
    },
    topOpportunityQueries,
    topPerformingQueries,
    topPages,
    devices: devicesList,
    topCountries: countriesList.slice(0, 20),
    timelineSummary: {
      startDate: datesList[0]?.date || '',
      endDate: datesList[datesList.length - 1]?.date || '',
      totalDays: datesList.length
    }
  };

  // Guardar archivo JSON estructurado en src/data/telemetry/
  const outputDir = path.join(rootDir, 'src', 'data', 'telemetry');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'gsc-performance-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(dataset, null, 2), 'utf-8');

  console.log(`✅ [GSC INGEST] Dataset generado exitosamente en: ${outputPath}`);
  console.log(`📊 Totales Procesados: ${totalClicks} Clics | ${totalImpressions} Impresiones | ${queriesList.length} Consultas únicas | ${pagesList.length} Páginas únicas`);

  return dataset;
}

// Ejecución directa
try {
  ingestGscData();
} catch (err) {
  console.error('❌ [GSC INGEST ERROR]:', err);
  process.exit(1);
}

