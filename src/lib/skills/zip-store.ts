/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — SKILLS SOBERANAS · ESCRITOR ZIP (MÉTODO STORE, CERO DEPENDENCIAS)
 * ════════════════════════════════════════════════════════════════════════════
 * Un `.xlsx` (y un `.docx`, y un `.pptx`) son contenedores ZIP. No hay ninguna
 * librería de hojas de cálculo instalada en este repositorio, así que el
 * contenedor se escribe a mano con el único método que no exige deflate:
 * `STORE` (método 0). Sin compresión el fichero es más grande, pero es un ZIP
 * **válido y abrible por Excel, LibreOffice y Google Sheets**, y el CRC-32 se
 * calcula de verdad sobre los bytes (un ZIP con CRC falso lo rechaza el
 * descompresor, no el usuario).
 *
 * Contrato:
 *   · Nada de `Buffer`/`zlib`: sólo `Uint8Array` y aritmética entera.
 *   · Mismo conjunto de entradas ⇒ mismo fichero byte a byte (determinismo),
 *     lo que permite sellar el resultado con SHA-256 y auditar el output.
 *   · Fecha DOS fija: el artefacto no cambia entre dos ejecuciones del mismo
 *     día contable (INV-08 aplicado a la generación de documentos).
 * ════════════════════════════════════════════════════════════════════════════
 */

/** Fecha/hora DOS fija y determinista (1980-01-01 00:00:00, época de MS-DOS). */
const DOS_DATE_1980 = 0x0021;
const DOS_TIME_0000 = 0x0000;

/** Firmas de las tres estructuras de un ZIP. */
const SIGNATURE_LOCAL = 0x04034b50;
const SIGNATURE_CENTRAL = 0x02014b50;
const SIGNATURE_END = 0x06054b50;

const VERSION_MADE_BY = 20;
const VERSION_NEEDED = 20;

/** Tabla CRC-32 (IEEE 802.3) precalculada: el estándar de ZIP la exige. */
const CRC_TABLE: Uint32Array = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = (value & 1) === 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value >>> 0;
  }
  return table;
})();

/** CRC-32 de un bloque de bytes (valor sin signo, 32 bits). */
export function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let index = 0; index < bytes.length; index += 1) {
    crc = CRC_TABLE[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/** Codificador UTF-8 sin `Buffer` (el módulo vale también en Edge). */
export function utf8Bytes(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

/** Escritor secuencial de bytes little-endian sobre un `Uint8Array` fijo. */
class ByteWriter {
  private readonly view: DataView;
  private offset = 0;

  constructor(private readonly buffer: Uint8Array) {
    this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  }

  u16(value: number): void {
    this.view.setUint16(this.offset, value & 0xffff, true);
    this.offset += 2;
  }

  u32(value: number): void {
    this.view.setUint32(this.offset, value >>> 0, true);
    this.offset += 4;
  }

  bytes(source: Uint8Array): void {
    this.buffer.set(source, this.offset);
    this.offset += source.length;
  }

  get written(): number {
    return this.offset;
  }
}

export interface ZipEntry {
  /** Ruta interna del fichero (`[Content_Types].xml`, `xl/workbook.xml`, …). */
  readonly path: string;
  /** Contenido en texto UTF-8. */
  readonly content: string;
}

interface PreparedEntry {
  readonly nameBytes: Uint8Array;
  readonly dataBytes: Uint8Array;
  readonly crc: number;
  readonly localOffset: number;
}

/** Tamaño exacto del ZIP que producirá `buildZip` (una sola asignación). */
function measureZip(entries: readonly ZipEntry[]): number {
  let total = 22; // End Of Central Directory (sin comentario)
  for (const entry of entries) {
    const nameLength = utf8Bytes(entry.path).length;
    const dataLength = utf8Bytes(entry.content).length;
    total += 30 + nameLength + dataLength; // cabecera local + nombre + datos
    total += 46 + nameLength; // entrada del directorio central
  }
  return total;
}

/**
 * Construye un ZIP (método STORE) a partir de entradas de texto.
 * El orden de las entradas se respeta: mismo array ⇒ mismos bytes.
 */
export function buildZip(entries: readonly ZipEntry[]): Uint8Array {
  const buffer = new Uint8Array(measureZip(entries));
  const writer = new ByteWriter(buffer);
  const prepared: PreparedEntry[] = [];

  for (const entry of entries) {
    const nameBytes = utf8Bytes(entry.path);
    const dataBytes = utf8Bytes(entry.content);
    const crc = crc32(dataBytes);
    const localOffset = writer.written;

    writer.u32(SIGNATURE_LOCAL);
    writer.u16(VERSION_NEEDED);
    writer.u16(0x0800); // bit 11: nombres de fichero en UTF-8
    writer.u16(0); // STORE: sin compresión
    writer.u16(DOS_TIME_0000);
    writer.u16(DOS_DATE_1980);
    writer.u32(crc);
    writer.u32(dataBytes.length);
    writer.u32(dataBytes.length);
    writer.u16(nameBytes.length);
    writer.u16(0); // sin campo extra
    writer.bytes(nameBytes);
    writer.bytes(dataBytes);

    prepared.push({ nameBytes, dataBytes, crc, localOffset });
  }

  const centralDirectoryStart = writer.written;

  for (const entry of prepared) {
    writer.u32(SIGNATURE_CENTRAL);
    writer.u16(VERSION_MADE_BY);
    writer.u16(VERSION_NEEDED);
    writer.u16(0x0800);
    writer.u16(0);
    writer.u16(DOS_TIME_0000);
    writer.u16(DOS_DATE_1980);
    writer.u32(entry.crc);
    writer.u32(entry.dataBytes.length);
    writer.u32(entry.dataBytes.length);
    writer.u16(entry.nameBytes.length);
    writer.u16(0); // extra
    writer.u16(0); // comentario
    writer.u16(0); // disco
    writer.u16(0); // atributos internos
    writer.u32(0); // atributos externos
    writer.u32(entry.localOffset);
    writer.bytes(entry.nameBytes);
  }

  const centralDirectorySize = writer.written - centralDirectoryStart;

  writer.u32(SIGNATURE_END);
  writer.u16(0); // este disco
  writer.u16(0); // disco del directorio central
  writer.u16(prepared.length);
  writer.u16(prepared.length);
  writer.u32(centralDirectorySize);
  writer.u32(centralDirectoryStart);
  writer.u16(0); // comentario

  return buffer;
}
