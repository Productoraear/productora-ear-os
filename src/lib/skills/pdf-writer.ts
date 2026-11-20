/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — SKILLS SOBERANAS · ESCRITOR PDF (PDF 1.4, CERO DEPENDENCIAS)
 * ════════════════════════════════════════════════════════════════════════════
 * Genera contratos y dossiers imprimibles sin ninguna librería PDF. Se escribe
 * el documento a mano: objetos, tabla `xref` con offsets exactos y `trailer`.
 *
 * Decisiones técnicas que se declaran:
 *   · Fuentes base-14 (`Helvetica`, `Helvetica-Bold`, `Helvetica-Oblique`) con
 *     codificación `WinAnsiEncoding`: soportan acentos y `€` (0x80 en WinAnsi),
 *     por lo que el texto español sale correcto sin embeber ficheros TTF.
 *   · Un PDF mal formado es peor que ninguno: los offsets de la `xref` se
 *     calculan sobre los bytes reales y cada `startxref` apunta al último
 *     objeto escrito. Cualquier lector estricto (Acrobat, pdf.js) lo abre.
 *   · Determinismo: sin `/CreationDate` ni `/ID` aleatorio ⇒ mismo contenido
 *     ⇒ mismos bytes ⇒ mismo SHA-256. Es lo que permite sellar el contrato.
 * ════════════════════════════════════════════════════════════════════════════
 */

/** A4 vertical en puntos PostScript (72 pt = 1 pulgada). */
export const A4_WIDTH = 595.28;
export const A4_HEIGHT = 841.89;
const MARGIN = 56;

export type PdfLineStyle = 'title' | 'heading' | 'body' | 'small' | 'mono';

export interface PdfBlock {
  readonly text: string;
  readonly style: PdfLineStyle;
  /** Separación extra (en puntos) antes del bloque. */
  readonly spaceBefore?: number;
}

export interface PdfDocumentSpec {
  readonly title: string;
  readonly author: string;
  readonly subject: string;
  /** Pie de página repetido en todas las páginas (nº de página incluido). */
  readonly footer: string;
  readonly blocks: readonly PdfBlock[];
}

/** Métricas aproximadas de Helvetica (unidades/1000) para cortar líneas. */
const FONT_SIZE: Readonly<Record<PdfLineStyle, number>> = Object.freeze({
  title: 18,
  heading: 12,
  body: 10,
  small: 8,
  mono: 9,
});

const LEADING: Readonly<Record<PdfLineStyle, number>> = Object.freeze({
  title: 24,
  heading: 18,
  body: 14,
  small: 12,
  mono: 12,
});

/** Ancho medio por carácter en Helvetica (conservador: corta antes de desbordar). */
const AVERAGE_CHAR_WIDTH = 0.5;

const LINE_WIDTH = A4_WIDTH - MARGIN * 2;

/** Ancho estimado de un texto en puntos para un tamaño dado. */
export function estimateTextWidth(text: string, fontSize: number): number {
  return text.length * fontSize * AVERAGE_CHAR_WIDTH;
}

/** Parte un texto en líneas que caben en `maxWidth`. Respeta los saltos manuales. */
export function wrapText(text: string, fontSize: number, maxWidth: number = LINE_WIDTH): string[] {
  const hardLines = text.split('\n');
  const result: string[] = [];
  for (const hardLine of hardLines) {
    const words = hardLine.split(/\s+/).filter((word) => word.length > 0);
    if (words.length === 0) {
      result.push('');
      continue;
    }
    let current = '';
    for (const word of words) {
      const candidate = current.length === 0 ? word : `${current} ${word}`;
      if (estimateTextWidth(candidate, fontSize) <= maxWidth) {
        current = candidate;
        continue;
      }
      if (current.length > 0) result.push(current);
      current = word;
    }
    if (current.length > 0) result.push(current);
  }
  return result;
}

/**
 * Escapa y codifica a WinAnsi los caracteres fuera de ASCII imprimible.
 * Se usa la forma octal `\\ddd` de las cadenas literales PDF.
 */
export function pdfEscape(text: string): string {
  let output = '';
  for (const char of text) {
    const code = char.codePointAt(0) ?? 32;
    if (char === '\\') {
      output += '\\\\';
    } else if (char === '(') {
      output += '\\(';
    } else if (char === ')') {
      output += '\\)';
    } else if (code >= 32 && code <= 126) {
      output += char;
    } else if (code === 8364) {
      output += '\\200'; // € en WinAnsiEncoding
    } else if (code <= 255) {
      output += `\\${code.toString(8).padStart(3, '0')}`;
    } else {
      output += '?'; // fuera de WinAnsi: se declara como ausencia, no se inventa
    }
  }
  return output;
}

interface LayoutLine {
  readonly text: string;
  readonly style: PdfLineStyle;
}

/**
 * Pagina el documento: corta líneas por ancho y abre página nueva cuando el
 * cursor cae por debajo del margen inferior. El pie de página reserva 40 pt.
 */
function paginate(spec: PdfDocumentSpec): LayoutLine[][] {
  const pages: LayoutLine[][] = [];
  let current: LayoutLine[] = [];
  let cursorY = A4_HEIGHT - MARGIN;
  const bottomLimit = MARGIN + 40;

  const pushBlock = (block: PdfBlock): void => {
    const size = FONT_SIZE[block.style];
    const leading = LEADING[block.style];
    if (block.spaceBefore !== undefined) cursorY -= block.spaceBefore;
    const wrapped = wrapText(block.text, size);
    for (const text of wrapped) {
      if (cursorY - leading < bottomLimit) {
        if (current.length > 0) pages.push(current);
        current = [];
        cursorY = A4_HEIGHT - MARGIN;
      }
      cursorY -= leading;
      current.push({ text, style: block.style });
    }
  };

  for (const block of spec.blocks) pushBlock(block);
  if (current.length > 0) pages.push(current);
  if (pages.length === 0) pages.push([{ text: spec.title, style: 'title' }]);
  return pages;
}

/** Compone el flujo de contenido (`BT … ET`) de una página, con pie numerado. */
function renderPage(lines: readonly LayoutLine[], footer: string, pageNumber: number, total: number): string {
  const commands: string[] = [];
  let cursorY = A4_HEIGHT - MARGIN;

  for (const line of lines) {
    const size = FONT_SIZE[line.style];
    const leading = LEADING[line.style];
    const font =
      line.style === 'title' || line.style === 'heading' ? 'F2' : line.style === 'small' ? 'F3' : 'F1';
    cursorY -= leading;
    commands.push(
      `BT /${font} ${size} Tf 1 0 0 1 ${MARGIN.toFixed(2)} ${cursorY.toFixed(2)} Tm (${pdfEscape(line.text)}) Tj ET`,
    );
  }

  const footerText = `${footer} · pagina ${pageNumber} de ${total}`;
  commands.push(
    `BT /F3 8 Tf 1 0 0 1 ${MARGIN.toFixed(2)} ${(MARGIN - 8).toFixed(2)} Tm (${pdfEscape(footerText)}) Tj ET`,
  );
  return commands.join('\n');
}

/**
 * Serializa el PDF completo.
 * Los offsets de la `xref` se calculan sobre los bytes REALES ya escritos.
 */
export function buildPdf(spec: PdfDocumentSpec): Uint8Array {
  const pages = paginate(spec);
  const objects: string[] = [];
  const encoder = new TextEncoder();

  // 1: Catalog · 2: Pages · 3..5: fuentes · 6+: (pagina, contenido) por página
  const firstPageObject = 6;
  const kids = pages.map((_, index) => `${firstPageObject + index * 2} 0 R`).join(' ');

  objects[1] = `<< /Type /Catalog /Pages 2 0 R >>`;
  objects[2] = `<< /Type /Pages /Count ${pages.length} /Kids [${kids}] >>`;
  objects[3] = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`;
  objects[4] = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>`;
  objects[5] = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>`;

  pages.forEach((lines, index) => {
    const pageNumber = index + 1;
    const contentStream = renderPage(lines, spec.footer, pageNumber, pages.length);
    const contentObjectNumber = firstPageObject + index * 2 + 1;
    objects[firstPageObject + index * 2] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${A4_WIDTH.toFixed(2)} ${A4_HEIGHT.toFixed(2)}] ` +
      `/Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> /Contents ${contentObjectNumber} 0 R >>`;
    objects[contentObjectNumber] = `<< /Length ${encoder.encode(contentStream).length} >>\nstream\n${contentStream}\nendstream`;
  });

  const totalObjects = objects.length;
  const infoObjectNumber = totalObjects + 1;

  const chunks: string[] = ['%PDF-1.4\n%\u00e2\u00e3\u00cf\u00d3\n'];
  const offsets: number[] = [];
  let byteLength = encoder.encode(chunks[0]).length;

  for (let number = 1; number <= totalObjects; number += 1) {
    const body = `${number} 0 obj\n${objects[number]}\nendobj\n`;
    offsets[number] = byteLength;
    chunks.push(body);
    byteLength += encoder.encode(body).length;
  }

  const info = `<< /Title (${pdfEscape(spec.title)}) /Author (${pdfEscape(spec.author)}) /Subject (${pdfEscape(
    spec.subject,
  )}) /Producer (EAR OS Skill Dispatcher) >>`;
  offsets[infoObjectNumber] = byteLength;
  const infoBody = `${infoObjectNumber} 0 obj\n${info}\nendobj\n`;
  chunks.push(infoBody);
  byteLength += encoder.encode(infoBody).length;

  const xrefStart = byteLength;
  const xrefLines: string[] = ['xref', `0 ${infoObjectNumber + 1}`, '0000000000 65535 f '];
  for (let number = 1; number <= infoObjectNumber; number += 1) {
    xrefLines.push(`${String(offsets[number]).padStart(10, '0')} 00000 n `);
  }
  const xref = `${xrefLines.join('\n')}\n`;
  chunks.push(xref);

  const trailer = `trailer\n<< /Size ${infoObjectNumber + 1} /Root 1 0 R /Info ${infoObjectNumber} 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  chunks.push(trailer);

  return encoder.encode(chunks.join(''));
}
