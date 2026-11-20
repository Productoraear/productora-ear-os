/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — SKILLS SOBERANAS · ESCRITOR XLSX (SPREADSHEETML, CERO DEPENDENCIAS)
 * ════════════════════════════════════════════════════════════════════════════
 * Emite un `.xlsx` real (Office Open XML / SpreadsheetML) sin ninguna librería:
 * ZIP STORE propio + los siete XML que Excel exige.
 *
 * Lo que NO hace y hay que decir en voz alta:
 *   · Los valores numéricos se escriben como número (no como texto "1.234,56 €"):
 *     así Excel puede filtrar, sumar y auditar. El formato monetario se aplica
 *     con un `numFmt` (#,##0.00 "€") declarado en `styles.xml`.
 *   · Las fórmulas se emiten como `<f>` con su valor en caché calculado en
 *     servidor (cero aritmética delegada al cliente): Excel las recalcula al
 *     abrir, pero el fichero ya trae el número correcto aunque el visor no
 *     evalúe fórmulas.
 *   · Cero `Date`: las fechas entran como texto ISO (`YYYY-MM-DD`) para que el
 *     artefacto sea determinista y no dependa de la zona horaria del servidor.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { buildZip, type ZipEntry } from './zip-store';

/** Celda de una hoja. `formula` se emite con su `value` como caché. */
export type XlsxCell =
  | { readonly kind: 'text'; readonly value: string; readonly bold?: boolean }
  | { readonly kind: 'money'; readonly value: number; readonly bold?: boolean }
  | { readonly kind: 'number'; readonly value: number; readonly bold?: boolean }
  | { readonly kind: 'formula'; readonly formula: string; readonly value: number; readonly bold?: boolean };

export interface XlsxSheet {
  /** Nombre visible de la pestaña (máx. 31 caracteres por especificación). */
  readonly name: string;
  /** Anchuras de columna en "caracteres" (opcional, en orden A, B, C…). */
  readonly columnWidths?: readonly number[];
  /** Filas de la hoja. Cada fila es un array de celdas. */
  readonly rows: readonly (readonly XlsxCell[])[];
}

/** Estilos: 0 = normal, 1 = negrita, 2 = moneda, 3 = moneda negrita, 4 = número. */
const STYLE_NORMAL = 0;
const STYLE_BOLD = 1;
const STYLE_MONEY = 2;
const STYLE_MONEY_BOLD = 3;
const STYLE_NUMBER = 4;

/** Escapa texto para XML: los cinco caracteres que rompen un documento. */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Convierte un índice de columna 0-based a letra Excel (0 → A, 26 → AA). */
export function columnLetter(index: number): string {
  let remaining = index;
  let letters = '';
  do {
    letters = String.fromCharCode(65 + (remaining % 26)) + letters;
    remaining = Math.floor(remaining / 26) - 1;
  } while (remaining >= 0);
  return letters;
}

/** Referencia absoluta de celda: (fila 0, col 0) → `A1`. */
export function cellRef(rowIndex: number, columnIndex: number): string {
  return `${columnLetter(columnIndex)}${rowIndex + 1}`;
}

/** XML de declaración común a todos los miembros del paquete. */
export const XML_DECL = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';

/** Número con hasta 2 decimales, sin notación científica y sin separador de miles. */
function formatNumeric(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  const fixed = Math.round(safe * 100) / 100;
  return Number.isInteger(fixed) ? String(fixed) : fixed.toFixed(2);
}

function buildSheetXml(sheet: XlsxSheet, internString: (text: string) => number): string {
  const columns =
    sheet.columnWidths === undefined
      ? ''
      : `<cols>${sheet.columnWidths
          .map((width, index) => `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`)
          .join('')}</cols>`;

  const rows = sheet.rows
    .map((row, rowIndex) => {
      const cells = row
        .map((cell, columnIndex) => {
          const reference = cellRef(rowIndex, columnIndex);
          const bold = cell.bold === true;
          switch (cell.kind) {
            case 'text': {
              const style = bold ? STYLE_BOLD : STYLE_NORMAL;
              const position = internString(cell.value);
              return `<c r="${reference}" s="${style}" t="s"><v>${position}</v></c>`;
            }
            case 'money': {
              const style = bold ? STYLE_MONEY_BOLD : STYLE_MONEY;
              return `<c r="${reference}" s="${style}"><v>${formatNumeric(cell.value)}</v></c>`;
            }
            case 'number': {
              const style = bold ? STYLE_BOLD : STYLE_NUMBER;
              return `<c r="${reference}" s="${style}"><v>${formatNumeric(cell.value)}</v></c>`;
            }
            case 'formula': {
              const style = bold ? STYLE_MONEY_BOLD : STYLE_MONEY;
              const formula = escapeXml(cell.formula);
              return `<c r="${reference}" s="${style}"><f>${formula}</f><v>${formatNumeric(cell.value)}</v></c>`;
            }
            default:
              return '';
          }
        })
        .join('');
      return `<row r="${rowIndex + 1}">${cells}</row>`;
    })
    .join('');

  return `${XML_DECL}<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">${columns}<sheetData>${rows}</sheetData></worksheet>`;
}

/** Tabla de cadenas compartidas: Excel la exige y evita duplicar texto en el XML. */
function buildSharedStrings(strings: readonly string[]): string {
  const items = strings
    .map((text) => `<si><t xml:space="preserve">${escapeXml(text)}</t></si>`)
    .join('');
  return `${XML_DECL}<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${strings.length}" uniqueCount="${strings.length}">${items}</sst>`;
}

/**
 * `styles.xml` con dos `numFmt` personalizados:
 *   164 → `#,##0.00 "€"` (moneda, sin pegar el símbolo al número).
 *   165 → `#,##0`        (enteros: unidades, contadores).
 */
function buildStyles(): string {
  const numFmts =
    '<numFmts count="2"><numFmt numFmtId="164" formatCode="#,##0.00 &quot;€&quot;"/><numFmt numFmtId="165" formatCode="#,##0"/></numFmts>';
  const fonts =
    '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>';
  const fills =
    '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>';
  const borders = '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>';
  const cellStyleXfs = '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>';
  const cellXfs = [
    '<cellXfs count="5">',
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>',
    '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>',
    '<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>',
    '<xf numFmtId="164" fontId="1" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1"/>',
    '<xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>',
    '</cellXfs>',
  ].join('');
  const cellStyles = '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>';
  return `${XML_DECL}<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">${numFmts}${fonts}${fills}${borders}${cellStyleXfs}${cellXfs}${cellStyles}</styleSheet>`;
}

/** Nombre de pestaña saneado: Excel prohíbe `[]:*?/\` y limita a 31 caracteres. */
function sanitizeSheetName(name: string, index: number): string {
  const cleaned = name.replace(/[[\]:*?/\\]/g, ' ').trim();
  const base = cleaned.length > 0 ? cleaned : `Hoja${index + 1}`;
  return base.slice(0, 31);
}

function buildWorkbook(sheets: readonly XlsxSheet[]): string {
  const sheetTags = sheets
    .map(
      (sheet, index) =>
        `<sheet name="${escapeXml(sanitizeSheetName(sheet.name, index))}" sheetId="${index + 1}" r:id="rId${
          index + 1
        }"/>`,
    )
    .join('');
  return `${XML_DECL}<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheetTags}</sheets></workbook>`;
}

function buildWorkbookRels(sheetCount: number): string {
  const parts: string[] = [];
  const relBase = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
  for (let index = 0; index < sheetCount; index += 1) {
    parts.push(
      `<Relationship Id="rId${index + 1}" Type="${relBase}/worksheet" Target="worksheets/sheet${
        index + 1
      }.xml"/>`,
    );
  }
  parts.push(`<Relationship Id="rId${sheetCount + 1}" Type="${relBase}/styles" Target="styles.xml"/>`);
  parts.push(
    `<Relationship Id="rId${sheetCount + 2}" Type="${relBase}/sharedStrings" Target="sharedStrings.xml"/>`,
  );
  return `${XML_DECL}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${parts.join(
    '',
  )}</Relationships>`;
}

function buildRootRels(): string {
  const base = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument';
  return `${XML_DECL}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${base}" Target="xl/workbook.xml"/></Relationships>`;
}

function buildContentTypes(sheetCount: number): string {
  const office = 'application/vnd.openxmlformats-officedocument';
  const overrides: string[] = [];
  for (let index = 1; index <= sheetCount; index += 1) {
    overrides.push(
      `<Override PartName="/xl/worksheets/sheet${index}.xml" ContentType="${office}.spreadsheetml.worksheet+xml"/>`,
    );
  }
  overrides.push(
    `<Override PartName="/xl/styles.xml" ContentType="${office}.spreadsheetml.styles+xml"/>`,
    `<Override PartName="/xl/sharedStrings.xml" ContentType="${office}.spreadsheetml.sharedStrings+xml"/>`,
    `<Override PartName="/xl/workbook.xml" ContentType="${office}.spreadsheetml.sheet.main+xml"/>`,
  );
  const defaults =
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>';
  return `${XML_DECL}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">${defaults}${overrides.join(
    '',
  )}</Types>`;
}

/**
 * Construye el fichero `.xlsx` completo.
 * Determinista: mismas hojas ⇒ mismos bytes ⇒ mismo SHA-256.
 */
export function buildXlsx(sheets: readonly XlsxSheet[]): Uint8Array {
  if (sheets.length === 0) {
    throw new Error('buildXlsx exige al menos una hoja.');
  }

  const sharedStrings: string[] = [];
  const sharedIndex = new Map<string, number>();

  const internString = (text: string): number => {
    const existing = sharedIndex.get(text);
    if (existing !== undefined) return existing;
    const position = sharedStrings.length;
    sharedStrings.push(text);
    sharedIndex.set(text, position);
    return position;
  };

  // Las hojas se construyen PRIMERO porque es ahí donde se internan los textos.
  const sheetEntries: ZipEntry[] = sheets.map((sheet, index) => ({
    path: `xl/worksheets/sheet${index + 1}.xml`,
    content: buildSheetXml(sheet, internString),
  }));

  const entries: ZipEntry[] = [
    { path: '[Content_Types].xml', content: buildContentTypes(sheets.length) },
    { path: '_rels/.rels', content: buildRootRels() },
    { path: 'xl/workbook.xml', content: buildWorkbook(sheets) },
    { path: 'xl/_rels/workbook.xml.rels', content: buildWorkbookRels(sheets.length) },
    { path: 'xl/styles.xml', content: buildStyles() },
    { path: 'xl/sharedStrings.xml', content: buildSharedStrings(sharedStrings) },
    ...sheetEntries,
  ];

  return buildZip(entries);
}
