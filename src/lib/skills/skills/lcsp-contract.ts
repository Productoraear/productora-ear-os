/**
 * �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
 * CARTUCHO CEO 2/4 · CONTRATO LCSP ART. 118 & FIANZA B2C (.PDF)
 * �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
 * SKILL.md:
 *   1. Determinar la naturaleza jurídica: B2G (contrato menor) o B2C (privado).
 *   2. Para B2G: rechazar si el importe supera el techo preventivo del SSOT.
 *      Esto NO es una advertencia: es un ABORTO de la ejecución (JUR-1).
 *   3. Calcular fianza/depósito y desglose de IVA en céntimos.
 *   4. Emitir PDF A4 con cláusulas, importes formateados y trazabilidad SSOT.
 *
 * Advertencia legal declarada: el PDF es un borrador operativo generado por el
 * sistema. La firma biométrica y la revisión jurídica quedan FUERA del alcance
 * de esta habilidad y se marcan en el documento como pendientes.
 * �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
 */

import { z } from 'zod';
import {
  AJUSTE_PREVENTIVO_B2G_EUR,
  CENTRALITA_EAR_OS,
  DEPOSITO_STRIPE_EUR,
  LIMITE_B2G_LCSP_EUR,
  LIMITE_SPL_DB,
  VAT_RATE,
  WATTS_PER_PAX,
} from '@/lib/constants/ear-os-ssot';
import { sha256OfBytes } from '@/lib/compiler/metacompiler-hash';
import { buildPdf, type PdfBlock } from '../pdf-writer';
import { eurosToCents, formatEurosEs, vatFromGrossCents } from '../money';
import type { SkillDefinition, SkillExecution } from '../skill-contract';

export const ContractInputSchema = z
  .object({
    counterparty: z.string().trim().min(3, 'Nombre de la contraparte demasiado corto.').max(140),
    counterpartyTaxId: z
      .string()
      .trim()
      .min(9, 'CIF/NIF incompleto.')
      .max(20)
      .optional(),
    /** B2G = administración pública (Art. 118 LCSP) · B2C = cliente privado. */
    mode: z.enum(['B2G', 'B2C']),
    grossEur: z.number().finite().positive('El importe debe ser mayor que cero.').max(1_000_000),
    eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha en formato YYYY-MM-DD.'),
    venue: z.string().trim().min(3).max(140),
    pax: z.number().int().min(1).max(5000),
    serviceSummary: z.string().trim().min(10).max(500),
  })
  .strict();

export type ContractInput = z.infer<typeof ContractInputSchema>;

export const CONTRACT_MANIFEST = {
  id: 'ceo-lcsp-contract',
  title: 'Emisor de contratos LCSP Art. 118 y fianza B2C',
  summary:
    'Genera el PDF imprimible del contrato con fianza, IVA desglosado y aborto automático si un contrato B2G supera el techo del SSOT.',
  role: 'CEO',
  artifactKind: 'pdf',
  steps: [
    { id: 'classify', label: 'Clasificar B2G / B2C' },
    { id: 'guard', label: 'Verificar techo LCSP del SSOT' },
    { id: 'compute', label: 'Calcular fianza e IVA en céntimos' },
    { id: 'emit', label: 'Emitir PDF A4 con cláusulas' },
  ],
  externalTokenCost: 0,
} as const;

const DATE_ES = (iso: string): string => {
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
};

interface ContractTotals {
  readonly grossCents: number;
  readonly fianzaCents: number;
  readonly pendingCents: number;
  readonly vatBaseCents: number;
  readonly vatQuotaCents: number;
  readonly checkedAt: string;
}

/** Bloques del documento: encabezado, partes, objeto, importes, cláusulas. */
function buildContractBlocks(input: ContractInput, totals: ContractTotals): PdfBlock[] {
  const blocks: PdfBlock[] = [
    { text: 'PRODUCTORA EAR OS', style: 'heading' },
    { text: 'CONTRATO DE PRESTACI�N DE SERVICIOS ARTÍSTICOS Y T�0CNICOS', style: 'title' },
    { text: `Referencia: ${input.mode}-${input.eventDate}`, style: 'small' },

    { text: '1. PARTES', style: 'heading', spaceBefore: 10 },
    {
      text: `Prestador: Productora EAR OS (Edwin Agudelo). Centralita oficial: ${CENTRALITA_EAR_OS}.`,
      style: 'body',
    },
    {
      text: `Contratante: ${input.counterparty}${
        input.counterpartyTaxId === undefined ? '' : ` � CIF/NIF ${input.counterpartyTaxId}`
      }.`,
      style: 'body',
    },

    { text: '2. OBJETO Y LUGAR', style: 'heading', spaceBefore: 10 },
    { text: `Servicio: ${input.serviceSummary}`, style: 'body' },
    { text: `Fecha de celebración: ${DATE_ES(input.eventDate)}.`, style: 'body' },
    { text: `Emplazamiento: ${input.venue}. Aforo declarado: ${input.pax} personas.`, style: 'body' },

    { text: '3. IMPORTE Y FORMA DE PAGO', style: 'heading', spaceBefore: 10 },
    { text: `Importe bruto pactado: ${formatEurosEs(totals.grossCents)}.`, style: 'body' },
    {
      text: `Base imponible: ${formatEurosEs(totals.vatBaseCents)}. Cuota de IVA (${Math.round(
        VAT_RATE * 100,
      )}%): ${formatEurosEs(totals.vatQuotaCents)}.`,
      style: 'body',
    },
    {
      text: `Fianza / depósito de reserva: ${formatEurosEs(
        totals.fianzaCents,
      )} (deducible del importe final).`,
      style: 'body',
    },
    {
      text: `Pendiente a liquidar antes del inicio del servicio: ${formatEurosEs(totals.pendingCents)}.`,
      style: 'body',
    },
  ];

  if (input.mode === 'B2G') {
    blocks.push(
      { text: '4. R�0GIMEN JURÍDICO (CONTRATO MENOR)', style: 'heading', spaceBefore: 10 },
      {
        text: `Contrato menor de servicios conforme al Art. 118 de la Ley 9/2017 (LCSP). Límite legal: ${formatEurosEs(
          eurosToCents(LIMITE_B2G_LCSP_EUR),
        )}.`,
        style: 'body',
      },
      {
        text: `Techo preventivo aplicado por EAR OS: ${formatEurosEs(
          eurosToCents(AJUSTE_PREVENTIVO_B2G_EUR),
        )} (margen del 5% para evitar reparos de intervención).`,
        style: 'body',
      },
      {
        text: 'Facturación electrónica mediante FACe y cumplimiento de la normativa municipal aplicable.',
        style: 'body',
      },
    );
  } else {
    blocks.push(
      { text: '4. R�0GIMEN JURÍDICO (CONTRATO PRIVADO)', style: 'heading', spaceBefore: 10 },
      {
        text: 'Contrato privado entre partes conforme al Código Civil y normativa de consumo aplicable.',
        style: 'body',
      },
      {
        text: 'La reserva queda bloqueada mediante depósito Price-Lock y es íntegramente deducible.',
        style: 'body',
      },
    );
  }

  blocks.push(
    { text: '5. RIDER T�0CNICO Y PROTECCI�N AC�aSTICA', style: 'heading', spaceBefore: 10 },
    {
      text: `El servicio se prestará por debajo de ${LIMITE_SPL_DB} dB SPL conforme a la Ley 37/2003 del Ruido, con una potencia de referencia de ${WATTS_PER_PAX} W por asistente y limitador homologado.`,
      style: 'body',
    },
    {
      text: 'La contraparte garantiza suministro eléctrico estable y espacio de montaje suficiente.',
      style: 'body',
    },
    { text: '6. CANCELACI�N', style: 'heading', spaceBefore: 10 },
    {
      text: 'El depósito Price-Lock se deduce íntegramente de la liquidación final cuando el servicio se presta.',
      style: 'body',
    },
    { text: '7. TRAZABILIDAD DEL DOCUMENTO', style: 'heading', spaceBefore: 10 },
    {
      text: `Generado por EAR OS Skill Dispatcher el ${totals.checkedAt}. Motor local, 0 tokens de API externa.`,
      style: 'small',
    },
    {
      text: 'PENDIENTE: revisión jurídica y firma biométrica del contratante. Este PDF es un borrador operativo.',
      style: 'small',
    },
  );

  return blocks;
}

export const lcspContractSkill: SkillDefinition<ContractInput> = {
  manifest: CONTRACT_MANIFEST,
  input: ContractInputSchema,
  async run(input, context): Promise<SkillExecution> {
    const grossCents = eurosToCents(input.grossEur);

    // JUR-1 · Guard duro: un contrato B2G por encima del techo preventivo no se
    // emite "con advertencia": se ABORTA. El error viaja con el importe exacto.
    if (input.mode === 'B2G') {
      const ceilingCents = eurosToCents(AJUSTE_PREVENTIVO_B2G_EUR);
      if (grossCents > ceilingCents) {
        throw new Error(
          `ABORTADO (JUR-1): ${formatEurosEs(grossCents)} supera el techo preventivo B2G de ${formatEurosEs(
            ceilingCents,
          )} (Art. 118 LCSP). Fragmenta el contrato o reduce el importe.`,
        );
      }
    }

    const vat = vatFromGrossCents(grossCents);
    const fianzaCents = Math.min(eurosToCents(DEPOSITO_STRIPE_EUR), grossCents);

    const totals: ContractTotals = {
      grossCents,
      fianzaCents,
      pendingCents: Math.max(0, grossCents - fianzaCents),
      vatBaseCents: vat.baseCents,
      vatQuotaCents: vat.vatCents,
      checkedAt: context.now,
    };

    const bytes = buildPdf({
      title: `Contrato ${input.mode} · ${input.counterparty}`,
      author: 'Productora EAR OS',
      subject: input.serviceSummary.slice(0, 120),
      footer: `Productora EAR OS · ${CENTRALITA_EAR_OS}`,
      blocks: buildContractBlocks(input, totals),
    });

    return {
      skill: CONTRACT_MANIFEST.id,
      title: CONTRACT_MANIFEST.title,
      role: 'CEO',
      mode: 'REAL',
      probed: true,
      checkedAt: context.now,
      artifacts: [
        {
          kind: 'pdf',
          filename: `contrato-${input.mode.toLowerCase()}-${input.eventDate}.pdf`,
          bytes,
          sha256: sha256OfBytes(bytes),
          byteLength: bytes.length,
        },
      ],
      summary: [
        { label: 'Contraparte', value: input.counterparty },
        {
          label: 'Régimen',
          value: input.mode === 'B2G' ? 'Contrato menor (Art. 118 LCSP)' : 'Contrato privado',
        },
        { label: 'Importe bruto', value: formatEurosEs(grossCents) },
        { label: `IVA (${Math.round(VAT_RATE * 100)}%)`, value: formatEurosEs(vat.vatCents) },
        { label: 'Fianza / depósito', value: formatEurosEs(fianzaCents) },
        { label: 'Pendiente a liquidar', value: formatEurosEs(totals.pendingCents) },
      ],
      evidence: [
        input.mode === 'B2G'
          ? `Importe verificado contra el techo B2G del SSOT (${formatEurosEs(
              eurosToCents(AJUSTE_PREVENTIVO_B2G_EUR),
            )}): dentro de rango.`
          : 'Contrato privado: no aplica el techo LCSP.',
        `Fianza leída de DEPOSITO_STRIPE_EUR (${formatEurosEs(eurosToCents(DEPOSITO_STRIPE_EUR))}).`,
        `Rider acústico: ${LIMITE_SPL_DB} dB SPL / ${WATTS_PER_PAX} W por pax, desde el SSOT.`,
        `IVA ${Math.round(VAT_RATE * 100)}% desde VAT_RATE del SSOT.`,
        'El PDF declara que la firma biométrica y la revisión jurídica están pendientes.',
      ],
    };
  },
};
