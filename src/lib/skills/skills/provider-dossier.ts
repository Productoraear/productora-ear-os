/**
 * �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
 * CARTUCHO CEO 3/4 · DOSSIER DE CIERRE COMERCIAL POR PROVEEDOR (.PDF)
 * �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
 * SKILL.md:
 *   1. Recibir los datos REALES del tenant (nombre, categoría, aforo, tarifa).
 *   2. Componer un dossier con propuesta económica calculada en céntimos.
 *   3. Si el proveedor tiene `monthlyFeeEur`, declarar que retiene el 100 % de
 *      su caché en contrataciones directas (regla de planes de pago del SSOT).
 *   4. Emitir PDF A4. Cada cifra del dossier se deriva del input, no del copy.
 *
 * Lo que esta habilidad NO hace: no inventa datos del proveedor. Si el campo
 * no llega, no se pinta. Un dossier con aforo inventado es una ficha falsa.
 * �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
 */

import { z } from 'zod';
import { CENTRALITA_EAR_OS, SPLIT_SOBERANO, VAT_RATE } from '@/lib/constants/ear-os-ssot';
import { sha256OfBytes } from '@/lib/compiler/metacompiler-hash';
import { buildPdf, type PdfBlock } from '../pdf-writer';
import { eurosToCents, formatEurosEs, splitSovereignCents, vatFromGrossCents } from '../money';
import type { SkillDefinition, SkillExecution } from '../skill-contract';

export const DossierInputSchema = z
  .object({
    providerName: z.string().trim().min(3, 'Nombre del proveedor demasiado corto.').max(140),
    /** Categoría real del ecosistema (finca, asador, artista, técnico⬦). */
    category: z.string().trim().min(3).max(60),
    /** Aforo declarado por el proveedor. Opcional: si falta, no se pinta. */
    capacityPax: z.number().int().min(1).max(20000).optional(),
    /** Tarifa propuesta para el primer cierre, en euros. */
    proposedGrossEur: z.number().finite().positive().max(1_000_000),
    /** Cuota mensual si el proveedor está en plan de pago (0 = directorio gratuito). */
    monthlyFeeEur: z.number().finite().min(0).max(100_000).optional(),
    /** Bloques de valor diferencial (máx. 6 para que el dossier no sea ruido). */
    valueBlocks: z
      .array(z.string().trim().min(4).max(180))
      .min(1, 'El dossier necesita al menos un bloque de valor.')
      .max(6),
    /** Fecha ISO de la propuesta. */
    proposalDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha en formato YYYY-MM-DD.'),
  })
  .strict();

export type DossierInput = z.infer<typeof DossierInputSchema>;

export const DOSSIER_MANIFEST = {
  id: 'ceo-provider-dossier',
  title: 'Dossier de cierre por proveedor',
  summary:
    'Compone el dossier comercial del tenant con propuesta económica reconciliada, bloques de valor y régimen de comisión declarado.',
  role: 'CEO',
  artifactKind: 'pdf',
  steps: [
    { id: 'ingest', label: 'Ingerir datos reales del proveedor' },
    { id: 'economics', label: 'Calcular propuesta y comisión en céntimos' },
    { id: 'compose', label: 'Componer bloques de valor' },
    { id: 'emit', label: 'Emitir PDF A4 del dossier' },
  ],
  externalTokenCost: 0,
} as const;

const DATE_ES = (iso: string): string => {
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
};

interface DossierTotals {
  readonly grossCents: number;
  readonly providerCents: number;
  readonly vatBaseCents: number;
  readonly vatQuotaCents: number;
  readonly checkedAt: string;
}

function buildDossierBlocks(input: DossierInput, totals: DossierTotals): PdfBlock[] {
  const blocks: PdfBlock[] = [
    { text: 'PRODUCTORA EAR OS', style: 'heading' },
    { text: `DOSSIER DE COLABORACI�N · ${input.providerName.toUpperCase()}`, style: 'title' },
    { text: `Fecha de propuesta: ${DATE_ES(input.proposalDate)}`, style: 'small' },

    { text: '1. EL PROVEEDOR', style: 'heading', spaceBefore: 10 },
    { text: `Razón de colaboración: ${input.providerName}.`, style: 'body' },
    { text: `Categoría en el ecosistema: ${input.category}.`, style: 'body' },
  ];

  // Solo se declara el aforo si el dato llegó: cero cifras inventadas.
  if (input.capacityPax !== undefined) {
    blocks.push({ text: `Aforo declarado: ${input.capacityPax} personas.`, style: 'body' });
  }

  blocks.push(
    { text: '2. PROPUESTA ECON�MICA PARA EL PRIMER CIERRE', style: 'heading', spaceBefore: 10 },
    { text: `Importe propuesto: ${formatEurosEs(totals.grossCents)}.`, style: 'body' },
    {
      text: `Base imponible: ${formatEurosEs(totals.vatBaseCents)}. Cuota de IVA (${Math.round(
        VAT_RATE * 100,
      )}%): ${formatEurosEs(totals.vatQuotaCents)}.`,
      style: 'body',
    },
  );

  if (input.monthlyFeeEur !== undefined && input.monthlyFeeEur > 0) {
    blocks.push({
      text: `Plan de pago activo (${formatEurosEs(
        eurosToCents(input.monthlyFeeEur),
      )} / mes): el proveedor retiene el 100% de su caché en contrataciones directas (0% de comisión EAR OS).`,
      style: 'body',
    });
  } else {
    blocks.push({
      text: `Directorio gratuito: se aplica el Split Soberano ${Math.round(
        SPLIT_SOBERANO.artista * 100,
      )}/${Math.round(SPLIT_SOBERANO.earOs * 100)}/${Math.round(
        SPLIT_SOBERANO.vimume * 100,
      )} sobre el bruto (${formatEurosEs(totals.providerCents)} para el proveedor).`,
      style: 'body',
    });
  }

  blocks.push(
    { text: '3. BLOQUES DE VALOR', style: 'heading', spaceBefore: 10 },
    ...input.valueBlocks.map((text, index) => ({
      text: `${index + 1}. ${text}`,
      style: 'body' as const,
    })),
    { text: '4. RESPALDO OPERATIVO', style: 'heading', spaceBefore: 10 },
    {
      text: 'Catálogo con teléfono verificable, depósito Price-Lock deducible del importe final y liquidación trazable al céntimo.',
      style: 'body',
    },
    { text: `Centralita oficial de coordinación: ${CENTRALITA_EAR_OS}.`, style: 'body' },
    { text: '5. TRAZABILIDAD', style: 'heading', spaceBefore: 10 },
    {
      text: `Generado por EAR OS Skill Dispatcher el ${totals.checkedAt}. Motor local, 0 tokens de API externa.`,
      style: 'small',
    },
    {
      text: 'Los importes de esta propuesta son una oferta comercial y no constituyen un contrato firmado.',
      style: 'small',
    },
  );

  return blocks;
}

export const providerDossierSkill: SkillDefinition<DossierInput> = {
  manifest: DOSSIER_MANIFEST,
  input: DossierInputSchema,
  async run(input, context): Promise<SkillExecution> {
    const grossCents = eurosToCents(input.proposedGrossEur);
    const vat = vatFromGrossCents(grossCents);
    const split = splitSovereignCents(grossCents);
    const monthlyFeeCents = eurosToCents(input.monthlyFeeEur ?? 0);
    const isPaidPlan = monthlyFeeCents > 0;

    const totals: DossierTotals = {
      grossCents,
      providerCents: isPaidPlan ? grossCents : split.artistCents,
      vatBaseCents: vat.baseCents,
      vatQuotaCents: vat.vatCents,
      checkedAt: context.now,
    };

    const bytes = buildPdf({
      title: `Dossier · ${input.providerName}`,
      author: 'Productora EAR OS',
      subject: `Propuesta de colaboración · ${input.category}`,
      footer: `Productora EAR OS · ${CENTRALITA_EAR_OS}`,
      blocks: buildDossierBlocks(input, totals),
    });

    const slug = input.providerName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()
      .slice(0, 48);

    return {
      skill: DOSSIER_MANIFEST.id,
      title: DOSSIER_MANIFEST.title,
      role: 'CEO',
      mode: 'REAL',
      probed: true,
      checkedAt: context.now,
      artifacts: [
        {
          kind: 'pdf',
          filename: `dossier-${slug || 'proveedor'}-${input.proposalDate}.pdf`,
          bytes,
          sha256: sha256OfBytes(bytes),
          byteLength: bytes.length,
        },
      ],
      summary: [
        { label: 'Proveedor', value: input.providerName },
        { label: 'Categoría', value: input.category },
        {
          label: 'Aforo',
          value:
            input.capacityPax === undefined ? 'No declarado (no se inventa)' : `${input.capacityPax} pax`,
        },
        { label: 'Propuesta bruta', value: formatEurosEs(grossCents) },
        { label: `IVA (${Math.round(VAT_RATE * 100)}%)`, value: formatEurosEs(vat.vatCents) },
        {
          label: 'Régimen',
          value: isPaidPlan ? 'Plan de pago · 0% comisión' : 'Directorio gratuito · Split 80/10/10',
        },
        { label: 'Neto para el proveedor', value: formatEurosEs(totals.providerCents) },
      ],
      evidence: [
        isPaidPlan
          ? `Plan de pago declarado (${formatEurosEs(monthlyFeeCents)} / mes): retención del 100%.`
          : 'Split Soberano aplicado desde SPLIT_SOBERANO del SSOT.',
        input.capacityPax === undefined
          ? 'Aforo no aportado: el dossier omite la cifra en lugar de estimarla.'
          : `Aforo declarado por el proveedor: ${input.capacityPax}.`,
        `IVA ${Math.round(VAT_RATE * 100)}% desde VAT_RATE del SSOT.`,
        `Bloques de valor emitidos: ${input.valueBlocks.length}.`,
      ],
    };
  },
};
