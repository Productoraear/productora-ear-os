/**
 * Verificación de los kernels de documento (XLSX y PDF) sin dependencias:
 * estructura ZIP real, CRC-32 válido, offsets de la xref PDF exactos.
 */
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { crc32, buildZip } from '../src/lib/skills/zip-store';
import { buildXlsx, type XlsxSheet } from '../src/lib/skills/xlsx-writer';
import { buildPdf, pdfEscape, wrapText, type PdfDocumentSpec } from '../src/lib/skills/pdf-writer';

let passed = 0;
let failed = 0;

function check(label: string, condition: boolean, detail?: string): void {
  if (condition) {
    passed += 1;
    console.log(`  [PASS] ${label}`);
  } else {
    failed += 1;
    console.log(`  [FAIL] ${label}${detail === undefined ? '' : ` :: ${detail}`}`);
  }
}

const sha = (bytes: Uint8Array): string => createHash('sha256').update(bytes).digest('hex');

/* ── A. ZIP STORE ─────────────────────────────────────────────────── */
console.log('\nA · ZIP STORE (CRC-32 + estructura)');
const crcVector = Buffer.from('The quick brown fox jumps over the lazy dog', 'utf8');
check('crc32 vector canónico = 0x414FA339', crc32(crcVector) === 0x414fa339, crc32(crcVector).toString(16));

const smallZip = buildZip([{ path: 'a.txt', content: 'contenido' }]);
const view = new DataView(smallZip.buffer, smallZip.byteOffset, smallZip.byteLength);
check('firma cabecera local 0x04034b50', view.getUint32(0, true) === 0x04034b50);
check('método STORE (0)', view.getUint16(8, true) === 0);
check('bit UTF-8 activo (0x0800)', view.getUint16(6, true) === 0x0800);
const eocdOffset = smallZip.length - 22;
check('firma EOCD 0x06054b50', view.getUint32(eocdOffset, true) === 0x06054b50);
check('EOCD declara 1 entrada', view.getUint16(eocdOffset + 10, true) === 1);
check('CRC de cabecera local = crc32 real', view.getUint32(14, true) === crc32(new TextEncoder().encode('contenido')));
check('determinista (mismos bytes)', sha(buildZip([{ path: 'a.txt', content: 'contenido' }])) === sha(smallZip));

/* ── B. XLSX ──────────────────────────────────────────────────────── */
console.log('\nB · XLSX (SpreadsheetML real)');
const sheets: XlsxSheet[] = [
  {
    name: 'Liquidación',
    columnWidths: [28, 18, 18, 18],
    rows: [
      [{ kind: 'text', value: 'Concepto', bold: true }, { kind: 'text', value: 'Bruto', bold: true }],
      [{ kind: 'text', value: 'Menú Otzarreta 120 pax' }, { kind: 'money', value: 9000 }],
      [{ kind: 'text', value: 'Artista 80%' }, { kind: 'formula', formula: 'B2*0.8', value: 7200 }],
      [{ kind: 'text', value: 'EAR OS 10%' }, { kind: 'formula', formula: 'B2*0.1', value: 900 }],
    ],
  },
];
const xlsx = buildXlsx(sheets);
check('cabecera ZIP válida (PK)', xlsx[0] === 0x50 && xlsx[1] === 0x4b);
const xlsxText = new TextDecoder('latin1').decode(xlsx);
check('contiene [Content_Types].xml', xlsxText.includes('[Content_Types].xml'));
check('contiene xl/workbook.xml', xlsxText.includes('xl/workbook.xml'));
check('contiene la hoja', xlsxText.includes('xl/worksheets/sheet1.xml'));
check('contiene sharedStrings', xlsxText.includes('xl/sharedStrings.xml'));
check('contiene numFmt moneda 164', xlsxText.includes('numFmtId="164"'));
check('fórmula B2*0.8 emitida', xlsxText.includes('B2*0.8'));
check('determinista (mismos bytes)', sha(buildXlsx(sheets)) === sha(xlsx));

/* ── C. PDF ───────────────────────────────────────────────────────── */
console.log('\nC · PDF 1.4 (xref + offsets)');
check('escape de paréntesis', pdfEscape('a(b)') === 'a\\(b\\)');
check('escape del euro a WinAnsi octal', pdfEscape('100 €') === '100 \\200');
check('wrap corta una frase larga en varias líneas', wrapText('palabra '.repeat(60), 10).length > 1);
check('wrap conserva los saltos manuales', wrapText('a\nb', 10).length === 2);

const pdfSpec: PdfDocumentSpec = {
  title: 'Contrato de prueba',
  author: 'Productora EAR',
  subject: 'Verificación',
  footer: 'Productora EAR · +34 693 693 048',
  blocks: [
    { text: 'CONTRATO DE SERVICIOS ARTÍSTICOS', style: 'title' },
    { text: 'Prestador: Edwin Agudelo (e78903). Importe bruto: 350,00 €.', style: 'body' },
    {
      text: Array.from({ length: 400 }, () => 'clausula de prueba contractual').join(' '),
      style: 'body',
      spaceBefore: 8,
    },
  ],
};

const pdf = buildPdf(pdfSpec);
const pdfText = new TextDecoder('latin1').decode(pdf);
check('cabecera %PDF-1.4', pdfText.startsWith('%PDF-1.4'));
check('termina en %%EOF', pdfText.trimEnd().endsWith('%%EOF'));
check('contiene startxref', pdfText.includes('startxref'));
check('declara fuentes base-14', pdfText.includes('/Helvetica-Bold'));
check('pagina en más de una hoja', (pdfText.match(/\/Type \/Page\b/g) ?? []).length > 1);

// Comprobación REAL de la xref: cada offset debe apuntar a "N 0 obj".
const startxrefIndex = pdfText.lastIndexOf('startxref');
const xrefStart = Number.parseInt(pdfText.slice(startxrefIndex + 9).trim().split(/\s+/)[0], 10);
check('startxref apunta a la tabla xref', pdfText.slice(xrefStart, xrefStart + 4) === 'xref', String(xrefStart));
const xrefBlock = pdfText.slice(xrefStart).split('\n');
const declaredCount = Number.parseInt(xrefBlock[1].split(' ')[1], 10);
let offsetsOk = true;
for (let objectNumber = 1; objectNumber < declaredCount; objectNumber += 1) {
  const offset = Number.parseInt(xrefBlock[2 + objectNumber].slice(0, 10), 10);
  if (!pdfText.startsWith(`${objectNumber} 0 obj`, offset)) {
    offsetsOk = false;
    console.log(`    offset roto en objeto ${objectNumber} → ${offset}`);
  }
}
check(`los ${declaredCount - 1} offsets de la xref apuntan a su objeto`, offsetsOk);
check('determinista (mismos bytes)', sha(buildPdf(pdfSpec)) === sha(pdf));

/* ── Artefactos de inspección ─────────────────────────────────────── */
const outDir = join(process.cwd(), '.antigravity', 'skills-out');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'kernel_verify.xlsx'), xlsx);
writeFileSync(join(outDir, 'kernel_verify.pdf'), pdf);
console.log(`\nArtefactos escritos en ${outDir}`);

console.log(`\n=== ${passed} PASS · ${failed} FAIL ===`);
console.log(`xlsx sha256=${sha(xlsx)} bytes=${xlsx.length}`);
console.log(`pdf  sha256=${sha(pdf)} bytes=${pdf.length}`);
if (failed > 0) process.exit(1);
