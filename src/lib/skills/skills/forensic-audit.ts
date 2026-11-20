/**
 * �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
 * CARTUCHO CEO 4/4 · AUDITORÍA FORENSE DE MADUREZ Y SCORECARD (.MD)
 * �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
 * SKILL.md:
 *   1. Sondear el centinela de Zona Cero en RUNTIME (`verifySsotIntegrity`).
 *   2. Recalcular el SHA-256 del SSOT y compararlo con `KNOWN_GOOD_SSOT_HASH`.
 *   3. Verificar cada invariante de negocio declarado en el guard.
 *   4. Enumerar los cartuchos del despachador con su coste en tokens.
 *   5. Emitir el informe Markdown con veredicto derivado, no tecleado.
 *
 * Regla de honestidad: el veredicto se CALCULA de las sondas. Si el hash no
 * coincide, el informe dice SOSPECHOSO aunque la tentación sea pintar verde.
 * �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
 */

import { z } from 'zod';
import {
  AJUSTE_PREVENTIVO_B2G_EUR,
  CENTRALITA_EAR_OS,
  DEPOSITO_STRIPE_EUR,
  LIMITE_SPL_DB,
  TARIFA_BASE_SOLISTA_EUR,
  VAT_RATE,
  WATTS_PER_PAX,
} from '@/lib/constants/ear-os-ssot';
import { computeSsotHash, verifySsotIntegrity } from '@/lib/security/ssotIntegrityGuard';
import { sha256OfBytes, sha256OfText } from '@/lib/compiler/metacompiler-hash';
import { SKILL_REGISTRY } from '../registry';
import type { SkillDefinition, SkillExecution } from '../skill-contract';

export const AuditInputSchema = z
  .object({
    /** Etiqueta del operador que lanza la auditoría (trazabilidad). */
    operator: z.string().trim().min(2).max(80).default('CEO'),
    /** Notas opcionales que se incrustan en el informe. */
    notes: z.string().trim().max(600).optional(),
  })
  .strict();

export type AuditInput = z.infer<typeof AuditInputSchema>;

export const AUDIT_MANIFEST = {
  id: 'ceo-forensic-audit',
  title: 'Auditoría de madurez de rutas y scorecard forense',
  summary:
    'Sondea la Zona Cero en runtime, recalcula su SHA-256, verifica invariantes y emite el informe con veredicto calculado.',
  role: 'CEO',
  artifactKind: 'md',
  steps: [
    { id: 'probe', label: 'Sondear centinela SSOT en runtime' },
    { id: 'hash', label: 'Recalcular SHA-256 y comparar' },
    { id: 'invariants', label: 'Verificar invariantes de negocio' },
    { id: 'emit', label: 'Emitir informe con veredicto' },
  ],
  externalTokenCost: 0,
} as const;

export const forensicAuditSkill: SkillDefinition<AuditInput> = {
  manifest: AUDIT_MANIFEST,
  input: AuditInputSchema,
  async run(input, context): Promise<SkillExecution> {
    const report = verifySsotIntegrity();
    const recomputed = computeSsotHash();
    const verdict = report.intact && recomputed === report.referenceHash ? 'VERIFICADO' : 'SOSPECHOSO';

    const lines: string[] = [
      '# Informe forense de madurez · EAR OS',
      '',
      `- **Operador:** ${input.operator}`,
      `- **Generado (UTC):** ${context.now}`,
      `- **Veredicto:** \`${verdict}\``,
      '',
      '## 1. Zona Cero (SSOT)',
      '',
      `- Hash recalculado: \`${recomputed}\``,
      `- Hash de referencia: \`${report.referenceHash}\``,
      `- Coincide: **${recomputed === report.referenceHash ? 'SÍ' : 'NO'}**`,
      `- Invariantes OK: **${report.invariantsOk ? 'SÍ' : 'NO'}**`,
      '',
    ];

    if (report.violatedInvariants.length > 0) {
      lines.push('### Invariantes violados', '');
      for (const violation of report.violatedInvariants) lines.push(`- ${violation}`);
      lines.push('');
    }

    lines.push(
      '## 2. Constantes canónicas en vigor',
      '',
      '| Constante | Valor |',
      '|---|---|',
      `| Tarifa base solista | ${TARIFA_BASE_SOLISTA_EUR.toFixed(2)} EUR |`,
      `| Depósito Price-Lock | ${DEPOSITO_STRIPE_EUR.toFixed(2)} EUR |`,
      `| Techo preventivo B2G | ${AJUSTE_PREVENTIVO_B2G_EUR.toFixed(2)} EUR |`,
      `| Rider acústico | ${LIMITE_SPL_DB} dB SPL / ${WATTS_PER_PAX} W por pax |`,
      `| IVA | ${Math.round(VAT_RATE * 100)}% |`,
      `| Centralita oficial | ${CENTRALITA_EAR_OS} |`,
      '',
      '## 3. Cartuchos del despachador',
      '',
      '| Cartucho | Rol | Formato | Coste tokens |',
      '|---|---|---|---|',
    );

    for (const entry of SKILL_REGISTRY) {
      const manifest = entry.manifest;
      lines.push(
        `| ${manifest.title} | ${manifest.role} | ${manifest.artifactKind.toUpperCase()} | ${manifest.externalTokenCost} |`,
      );
    }

    lines.push(
      '',
      `Total de cartuchos: **${SKILL_REGISTRY.length}**. Coste externo agregado: **0 tokens**.`,
      '',
    );

    if (input.notes !== undefined && input.notes.length > 0) {
      lines.push('## 4. Notas del operador', '', input.notes, '');
    }

    lines.push(
      '## Veredicto',
      '',
      verdict === 'VERIFICADO'
        ? 'La Zona Cero está íntegra y sus invariantes se cumplen en esta ejecución. El sistema puede emitir documentos con estos valores.'
        : 'La Zona Cero NO coincide con la referencia o viola un invariante. Detener la emisión de documentos financieros hasta resolverse.',
      '',
      '---',
      'Generado por EAR OS Skill Dispatcher · motor local · 0 tokens de API externa.',
      '',
    );

    const markdown = lines.join('\n');
    const bytes = new TextEncoder().encode(markdown);

    return {
      skill: AUDIT_MANIFEST.id,
      title: AUDIT_MANIFEST.title,
      role: 'CEO',
      mode: 'REAL',
      probed: true,
      checkedAt: context.now,
      artifacts: [
        {
          kind: 'md',
          filename: `auditoria-forense-${context.now.slice(0, 10)}.md`,
          bytes,
          sha256: sha256OfBytes(bytes),
          byteLength: bytes.length,
        },
      ],
      summary: [
        { label: 'Veredicto', value: verdict },
        { label: 'Hash recalculado', value: `${recomputed.slice(0, 16)}⬦` },
        { label: 'Hash de referencia', value: `${report.referenceHash.slice(0, 16)}⬦` },
        {
          label: 'Invariantes',
          value: report.invariantsOk
            ? 'Todos se cumplen'
            : `${report.violatedInvariants.length} violado(s)`,
        },
        { label: 'Cartuchos registrados', value: String(SKILL_REGISTRY.length) },
        { label: 'Coste externo', value: '0 tokens' },
      ],
      evidence: [
        `Sonda en runtime: verifySsotIntegrity() �  intact=${String(report.intact)}.`,
        `SHA-256 recalculado: ${recomputed}`,
        `SHA-256 del informe: ${sha256OfText(markdown)}`,
        `Invariantes verificados por el guard de Zona Cero (${report.violatedInvariants.length} violaciones).`,
        'El veredicto se calcula de las sondas; no se teclea ni se asume verde.',
      ],
    };
  },
};
