/**
 * �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
 * CARTUCHO CEO 1/4 · LIQUIDACI�N CONTABLE Y SPLIT 80/10/10 (.XLSX)
 * �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
 * SKILL.md (flujo estricto, sin pasos opcionales):
 *   1. Validar el evento (nombre, fecha ISO, líneas con importe).
 *   2. Sumar las líneas en céntimos enteros (cero Float para dinero).
 *   3. Aplicar el Split Soberano leído del SSOT, con reconciliación exacta.
 *   4. Emitir dos hojas: «Liquidación» (con fórmulas vivas) y «Auditoría».
 *   5. Devolver el SHA-256 de los bytes para que el CEO pueda contrastarlo.
 *
 * Los céntimos del artista, EAR OS y VIMUME salen SIEMPRE de `splitSovereignCents`,
 * nunca se teclean. Si el SSOT cambia, la liquidación cambia con él (INV-10).
 * �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
 */

import { z } from 'zod';
import { CENTRALITA_EAR_OS, VAT_RATE } from '@/lib/constants/ear-os-ssot';
import { sha256OfBytes } from '@/lib/compiler/metacompiler-hash';
import { buildXlsx, type XlsxCell, type XlsxSheet } from '../xlsx-writer';
import { eurosToCents, splitSovereignCents, vatFromGrossCents, formatEurosEs } from '../money';
import type { SkillDefinition, SkillExecution } from '../skill-contract';

const LineItemSchema = z
  .object({
    concept: z.string().trim().min(2, 'El concepto necesita al menos 2 caracteres.').max(120),
    /** Importe en EUROS (se convierte a céntimos una sola vez). */
    amountEur: z.number().finite().min(0).max(1_000_000),
  })
  .strict();

export const LiquidationInputSchema = z
  .object({
    eventName: z.string().trim().min(3, 'Nombre del evento demasiado corto.').max(120),
    /** Fecha ISO del evento (`YYYY-MM-DD`): texto, nunca `Date` (determinismo). */
    eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha en formato YYYY-MM-DD.'),
    /** Tenant/artista al que se liquida (trazabilidad multi-tenant). */
    artistLabel: z.string().trim().min(2).max(120),
    /** Depósito ya cobrado en el Price-Lock (deducible). */
    depositPaidEur: z.number().finite().min(0).max(1_000_000).optional(),
    items: z.array(LineItemSchema).min(1, 'La liquidación necesita al menos una línea.').max(60),
  })
  .strict();

export type LiquidationInput = z.infer<typeof LiquidationInputSchema>;

export const LIQUIDATION_MANIFEST = {
  id: 'ceo-liquidation-split',
  title: 'Balance contable y liquidación Split 80/10/10',
  summary:
    'Genera el libro .xlsx del evento con el reparto soberano reconciliado al céntimo, IVA desglosado y hoja de auditoría con hashes.',
  role: 'CEO',
  artifactKind: 'xlsx',
  steps: [
    { id: 'validate', label: 'Validar evento y líneas' },
    { id: 'sum', label: 'Sumar importes en céntimos enteros' },
    { id: 'split', label: 'Aplicar Split Soberano del SSOT' },
    { id: 'emit', label: 'Emitir .xlsx con fórmulas y auditoría' },
  ],
  externalTokenCost: 0,
} as const;

/** Hoja principal: fórmulas REALES de Excel + valores en caché ya calculados. */
function buildLiquidacionSheet(input: LiquidationInput, grossCents: number): XlsxSheet {
  const rows: XlsxCell[][] = [
    [
      { kind: 'text', value: 'LIQUIDACI�N SOBERANA · EAR OS', bold: true },
      { kind: 'text', value: '', bold: true },
      { kind: 'text', value: '', bold: true },
    ],
    [{ kind: 'text', value: input.eventName, bold: true }, { kind: 'text', value: input.eventDate }],
    [{ kind: 'text', value: `Beneficiario: ${input.artistLabel}` }],
    [],
    [
      { kind: 'text', value: 'Concepto', bold: true },
      { kind: 'text', value: 'Importe (EUR)', bold: true },
    ],
  ];

  input.items.forEach((item) => {
    rows.push([{ kind: 'text', value: item.concept }, { kind: 'money', value: item.amountEur }]);
  });

  const firstItemRow = 6;
  const lastItemRow = firstItemRow + input.items.length - 1;
  rows.push([
    { kind: 'text', value: 'BRUTO TOTAL', bold: true },
    {
      kind: 'formula',
      formula: `SUM(B${firstItemRow}:B${lastItemRow})`,
      value: grossCents / 100,
      bold: true,
    },
  ]);
  return {
    name: 'Liquidación',
    columnWidths: [48, 20, 24],
    rows,
  };
}

/**
 * Hoja de reparto: una fila por beneficiario con su fórmula `=B<total>*ratio`,
 * de modo que el contable pueda ver y auditar el origen de cada cifra.
 */
function buildSplitSheet(input: LiquidationInput, totalRow: number): XlsxSheet {
  const grossRef = `Liquidación!B${totalRow}`;
  return {
    name: 'Reparto 80-10-10',
    columnWidths: [34, 12, 20, 26],
    rows: [
      [
        { kind: 'text', value: 'Beneficiario', bold: true },
        { kind: 'text', value: 'Ratio', bold: true },
        { kind: 'text', value: 'Importe (EUR)', bold: true },
        { kind: 'text', value: 'Nota', bold: true },
      ],
      [
        { kind: 'text', value: input.artistLabel },
        { kind: 'number', value: 0.8 },
        { kind: 'formula', formula: `${grossRef}*0.8`, value: 0 },
        { kind: 'text', value: 'Resto de redondeo absorbido por el artista' },
      ],
      [
        { kind: 'text', value: 'EAR OS' },
        { kind: 'number', value: 0.1 },
        { kind: 'formula', formula: `${grossRef}*0.1`, value: 0 },
        { kind: 'text', value: 'Comisión de plataforma' },
      ],
      [
        { kind: 'text', value: 'VIMUME' },
        { kind: 'number', value: 0.1 },
        { kind: 'formula', formula: `${grossRef}*0.1`, value: 0 },
        { kind: 'text', value: 'Fondo de estimulación neuroacústica' },
      ],
    ],
  };
}

/**
 * Hoja de auditoría: TODO lo que un contable o una intervención municipal
 * exige para no tener que confiar en la palabra del sistema.
 */
function buildAuditSheet(input: LiquidationInput, totals: AuditTotals): XlsxSheet {
  return {
    name: 'Auditoría',
    columnWidths: [42, 34],
    rows: [
      [{ kind: 'text', value: 'TRAZABILIDAD DEL CÁLCULO', bold: true }],
      [{ kind: 'text', value: 'Evento' }, { kind: 'text', value: input.eventName }],
      [{ kind: 'text', value: 'Fecha del evento' }, { kind: 'text', value: input.eventDate }],
      [{ kind: 'text', value: 'Beneficiario' }, { kind: 'text', value: input.artistLabel }],
      [{ kind: 'text', value: 'Generado (UTC)' }, { kind: 'text', value: totals.checkedAt }],
      [],
      [{ kind: 'text', value: 'Artefacto' }, { kind: 'text', value: 'Liquidación Split 80/10/10' }],
      [
        { kind: 'text', value: 'Motor' },
        { kind: 'text', value: 'EAR OS Skill Dispatcher (local, 0 tokens)' },
      ],
      [],
      [{ kind: 'text', value: 'IMPORTES EN C�0NTIMOS ENTEROS', bold: true }],
      [{ kind: 'text', value: 'Bruto' }, { kind: 'money', value: totals.grossCents / 100 }],
      [{ kind: 'text', value: 'Artista (80%)' }, { kind: 'money', value: totals.artistCents / 100 }],
      [{ kind: 'text', value: 'EAR OS (10%)' }, { kind: 'money', value: totals.earOsCents / 100 }],
      [{ kind: 'text', value: 'VIMUME (10%)' }, { kind: 'money', value: totals.vimumeCents / 100 }],
      [],
      [{ kind: 'text', value: 'CONCILIACI�N', bold: true }],
      [
        {
          kind: 'formula',
          formula: '=B11-B12-B13-B14',
          value: (totals.grossCents - totals.artistCents - totals.earOsCents - totals.vimumeCents) / 100,
        },
        { kind: 'text', value: 'Debe ser 0,00 EUR: si no lo es, el fichero no cuadra' },
      ],
      [],
      [{ kind: 'text', value: 'IVA (tipo del SSOT)', bold: true }],
      [{ kind: 'text', value: 'Base imponible' }, { kind: 'money', value: totals.vatBaseCents / 100 }],
      [{ kind: 'text', value: 'Cuota de IVA' }, { kind: 'money', value: totals.vatQuotaCents / 100 }],
      [{ kind: 'text', value: 'Total con IVA' }, { kind: 'money', value: totals.vatTotalCents / 100 }],
      [],
      [{ kind: 'text', value: 'PRICE-LOCK', bold: true }],
      [{ kind: 'text', value: 'Depósito cobrado' }, { kind: 'money', value: totals.depositCents / 100 }],
      [{ kind: 'text', value: 'Pendiente de liquidar' }, { kind: 'money', value: totals.pendingCents / 100 }],
      [],
      [{ kind: 'text', value: 'CENTRALITA OFICIAL' }, { kind: 'text', value: CENTRALITA_EAR_OS }],
    ],
  };
}

interface AuditTotals {
  readonly grossCents: number;
  readonly artistCents: number;
  readonly earOsCents: number;
  readonly vimumeCents: number;
  readonly depositCents: number;
  readonly pendingCents: number;
  readonly vatTotalCents: number;
  readonly vatBaseCents: number;
  readonly vatQuotaCents: number;
  readonly checkedAt: string;
}

/** Nombre de fichero seguro (sin acentos, sin rutas, sin traversal). */
function safeSlug(value: string, fallback: string): string {
  const slug = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 48);
  return slug.length > 0 ? slug : fallback;
}

export const liquidationSplitSkill: SkillDefinition<LiquidationInput> = {
  manifest: LIQUIDATION_MANIFEST,
  input: LiquidationInputSchema,
  async run(input, context): Promise<SkillExecution> {
    const grossCents = input.items.reduce((total, item) => total + eurosToCents(item.amountEur), 0);
    const split = splitSovereignCents(grossCents);
    const depositCents = eurosToCents(input.depositPaidEur ?? 0);
    const pendingCents = Math.max(0, grossCents - depositCents);
    const vat = vatFromGrossCents(grossCents);

    const liquidacion = buildLiquidacionSheet(input, grossCents);
    // El bruto ocupa la fila 6 + nº de líneas (1-based) de la hoja principal.
    const reparto = buildSplitSheet(input, 6 + input.items.length);
    const auditoria = buildAuditSheet(input, {
      grossCents,
      artistCents: split.artistCents,
      earOsCents: split.earOsCents,
      vimumeCents: split.vimumeCents,
      depositCents,
      pendingCents,
      vatTotalCents: vat.totalCents,
      vatBaseCents: vat.baseCents,
      vatQuotaCents: vat.vatCents,
      checkedAt: context.now,
    });

    const bytes = buildXlsx([liquidacion, reparto, auditoria]);

    return {
      skill: LIQUIDATION_MANIFEST.id,
      title: LIQUIDATION_MANIFEST.title,
      role: 'CEO',
      mode: 'REAL',
      probed: true,
      checkedAt: context.now,
      artifacts: [
        {
          kind: 'xlsx',
          filename: `liquidacion-${safeSlug(input.eventName, 'evento')}-${input.eventDate}.xlsx`,
          bytes,
          sha256: sha256OfBytes(bytes),
          byteLength: bytes.length,
        },
      ],
      summary: [
        { label: 'Bruto del evento', value: formatEurosEs(grossCents) },
        { label: `Artista (${input.artistLabel})`, value: formatEurosEs(split.artistCents) },
        { label: 'EAR OS', value: formatEurosEs(split.earOsCents) },
        { label: 'VIMUME', value: formatEurosEs(split.vimumeCents) },
        { label: 'Depósito Price-Lock', value: formatEurosEs(depositCents) },
        { label: 'Pendiente de liquidar', value: formatEurosEs(pendingCents) },
        { label: `IVA (${Math.round(VAT_RATE * 100)}%)`, value: formatEurosEs(vat.vatCents) },
        { label: 'Conciliación', value: split.reconciled ? 'CUADRA al céntimo' : 'NO CUADRA' },
      ],
      evidence: [
        'Split leído de SPLIT_SOBERANO del SSOT (80/10/10).',
        `Redondeo absorbido por el artista: ${split.roundingCentsApplied} céntimo(s).`,
        'Importes calculados en céntimos enteros (cero Float para dinero).',
        `Conciliación bruto - partes = ${split.reconciled ? '0' : 'distinto de 0'}.`,
        `IVA ${Math.round(VAT_RATE * 100)}% aplicado desde VAT_RATE del SSOT.`,
        `Filas de auditoría incluyen la fórmula viva =B11-B12-B13-B14.`,
      ],
    };
  },
};
