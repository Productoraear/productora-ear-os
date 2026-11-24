/**
 * ════════════════════════════════════════════════════════════════════════════
 * REGLAS COGNITIVAS CANÓNICAS DEL ORÁCULO CEO (REGLAS 91 A 100) · EAR OS S-CLASS
 * ════════════════════════════════════════════════════════════════════════════
 * BLOQUE 10: Gobernanza Máxima, Constitución Tripartita & Juramento de Soberanía.
 *
 * CULMINACIÓN CANÓNICA 100/100 · SELLADO FINAL POR EL DIRECTOR GENERALISTA:
 *   - Regla 91: Exclusividad Territorial (100 km de blindaje para recintos fundadores).
 *   - Regla 92: Centralita de Voz 24/7 con derivación < 60s en eventos > 5.000 €.
 *   - Regla 93: Trazabilidad Radical (Patrón Clarity frente a clics fantasma).
 *   - Regla 94: Federación Agéntica centralizada y expansión nacional 52 provincias.
 *   - Regla 95: Fondo de Tracción Compuesta (50% contingencia / 50% I+D IA & directo).
 *   - Regla 96: Inalienabilidad de Propiedad Intelectual & depósito SHA-256 Zona Cero.
 *   - Regla 97: Saturación de Calendario: orden estricto de fianza 100 € sin subastas.
 *   - Regla 98: Garantía Soberana Euro a Euro: SLA < 24h sin letra pequeña.
 *   - Regla 99: Constitución Tripartita Nivel 5 (Cline, Antigravity, CEO).
 *   - Regla 100: El Juramento de Soberanía EAR OS (anti-intermediación parasitaria).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { type OraculoCanonicalRule } from './oraculo-canonical-rules-1-50';

export interface OraculoCanonicalRuleBloque10 {
  readonly id: number;
  readonly block: 10;
  readonly blockTitle: string;
  readonly title: string;
  readonly directive: string;
  readonly rationale: string;
  readonly invariantRef: string | null;
}

export const ORACULO_RULES_BLOQUE_10: readonly OraculoCanonicalRuleBloque10[] = Object.freeze([
  {
    id: 91,
    block: 10,
    blockTitle: 'Gobernanza Máxima, Constitución Tripartita & Juramento de Soberanía',
    title: 'Exclusividad Territorial & Blindaje Comarcal de 100 km',
    directive:
      'Los recintos fundadores catalogados como Paciente Cero (estándar Restaurante Otzarreta) disfrutan de un blindaje territorial estricto de 100 km de no-competencia dentro de su categoría, impidiendo la admisión de sedes rivales directas mientras mantengan activa su cuota de infraestructura y excelencia operativa.',
    rationale:
      'Fideliza al socio hostelero fundador convirtiéndolo en el bastión gastronómico y escénico indiscutible de su demarcación geográfica.',
    invariantRef: 'src/lib/constants/otzarreta-entity.ts:OTZARRETA_IDENTITY',
  },
  {
    id: 92,
    block: 10,
    blockTitle: 'Gobernanza Máxima, Constitución Tripartita & Juramento de Soberanía',
    title: 'Centralita de Voz Híbrida 24/7 con Despacho Express en < 60 Segundos',
    directive:
      'La centralita telefónica y de mensajería (+34 693 693 048) opera con asistencia de voz contextualizada que informa menús, aforos y disponibilidad técnica; ante eventos cualificados de alto impacto (> 5.000 € o > 100 pax), transfiere la llamada o el chat al Director Generalista / Maître en menos de 60 segundos con enlace directo a fianza Stripe.',
    rationale:
      'Combina la inmediatez de la IA conversacional con el cierre cálido y de máxima autoridad del ser humano en transacciones de alto ticket.',
    invariantRef: 'ear-os-ssot.ts:TELEFONO_CENTRALITA',
  },
  {
    id: 93,
    block: 10,
    blockTitle: 'Gobernanza Máxima, Constitución Tripartita & Juramento de Soberanía',
    title: 'Trazabilidad Radical & Auditoría Forense (Patrón Clarity)',
    directive:
      'El panel de cada finca y proveedor exhibe telemetría real e inmutable (visitas cualificadas, procedencia del lead, tiempo en pantalla y conversion rate a fianza) erradicando clics inflados, impresiones fantasma o métricas ficticias habituales en portales de bodas convencionales.',
    rationale:
      'Establece una relación de lealtad indestructible basada en datos matemáticos auditables y resultados financieros tangibles en cuenta bancaria.',
    invariantRef: 'reports/FORENSIC_CTA_TRACE_MATRIX.json',
  },
  {
    id: 94,
    block: 10,
    blockTitle: 'Gobernanza Máxima, Constitución Tripartita & Juramento de Soberanía',
    title: 'Federación Agéntica Nacional & Licenciamiento en 52 Provincias',
    directive:
      'El núcleo de software, los modelos de optimización y la pasarela de pagos permanecen 100% centralizados bajo la arquitectura EAR OS; la expansión física y ejecución técnica se delega a coordinadores provinciales homologados en las 52 provincias españolas, regidos estrictamente por el Split Soberano 80/10/10.',
    rationale:
      'Permite escalar el negocio a escala nacional sin hipertrofiar la estructura fija ni arriesgar la calidad del servicio en ninguna región.',
    invariantRef: 'ear-os-ssot.ts:SPLIT_SOBERANO',
  },
  {
    id: 95,
    block: 10,
    blockTitle: 'Gobernanza Máxima, Constitución Tripartita & Juramento de Soberanía',
    title: 'Fondo de Tracción Compuesta (50% Contingencia / 50% I+D Soberana)',
    directive:
      'El 10% retenido por la plataforma en el Split Soberano se provisiona bajo disciplina férrea: 50% destinado a caja de contingencia líquida para garantías de sala y el 50% restante reinvertido de forma continua en refinamiento de modelos de oráculo, arneses de software y hardware de audio e iluminación de vanguardia.',
    rationale:
      'Garantiza la solidez patrimonial de la productora y alimenta una ventaja tecnológica competitiva que ningún operador tradicional puede igualar.',
    invariantRef: 'ear-os-ssot.ts:SPLIT_SOBERANO.fondo_contingencia',
  },
  {
    id: 96,
    block: 10,
    blockTitle: 'Gobernanza Máxima, Constitución Tripartita & Juramento de Soberanía',
    title: 'Inalienabilidad de la Propiedad Intelectual & Huella SHA-256 Notarial',
    directive:
      'Todo el código fuente, pesos sinápticos locales, contratos automatizados, bases de conocimiento de la incubadora y esquemas visuales son propiedad exclusiva e inalienable de Edwin Agudelo / Productora EAR; la huella SHA-256 de la Zona Cero se custodia de forma inmutable como prueba criptográfica de autoría.',
    rationale:
      'Protege los activos intangibles de la compañía contra copias no autorizadas, derivaciones espurias o litigios de autoría en el mercado tecnológico.',
    invariantRef: 'ear-os-ssot.ts:SSOT_SENTINEL_INTEGRITY_HASH',
  },
  {
    id: 97,
    block: 10,
    blockTitle: 'Gobernanza Máxima, Constitución Tripartita & Juramento de Soberanía',
    title: 'Saturación de Calendario & Derivación Fraterna a Fincas Aliadas',
    directive:
      'Queda prohibida toda subasta o especulación de fechas cuando un recinto esté ocupado; la asignación de calendario se rige por orden de fianza (100 €), y ante fechas completas, el sistema deriva al cliente a recintos federados afines con acuerdo de corretaje bilateral.',
    rationale:
      'Mantiene la pureza ética del ecosistema, evita fricción con clientes y monetiza el 100% de la sobredemanda generada.',
    invariantRef: 'ear-os-ssot.ts:DEPOSITO_STRIPE_EUR',
  },
  {
    id: 98,
    block: 10,
    blockTitle: 'Gobernanza Máxima, Constitución Tripartita & Juramento de Soberanía',
    title: 'Garantía Soberana Euro a Euro: SLA < 24h sin Letra Pequeña',
    directive:
      'Si cualquier anomalía técnica imputable a la infraestructura de Productora EAR afecta la ejecución pactada, la dirección asume de inmediato la responsabilidad material, resolviendo el expediente en menos de 24 horas y emitiendo el abono o compensación acordada sin trabas jurídicas ni letra pequeña.',
    rationale:
      'La palabra de honor y la asunción radical de responsabilidad son la máxima seña de identidad del estatus aristocrático de la marca.',
    invariantRef: 'docs/01_ARQUITECTURA_SCLASS/GARANTIA_SOBERANA_CONTRATOS.md',
  },
  {
    id: 99,
    block: 10,
    blockTitle: 'Gobernanza Máxima, Constitución Tripartita & Juramento de Soberanía',
    title: 'Constitución Tripartita de Madurez Nivel 5 (Separación de Poderes)',
    directive:
      'La gobernanza técnica y de negocio es sagrada e inviolable: Cline («El Obrero») pica en disco dentro del scope estricto, Antigravity («El Arquitecto») audita contratos, compuertas mecánicas y verdad en disco, y Edwin Agudelo («El CEO») ostenta el monopolio exclusivo sobre tarifas, transferencias y acuerdos estratégicos. Cero adjetivos sin Exit Code 0.',
    rationale:
      'Previene alucinaciones de modelos de lenguaje, elimina la deuda técnica y garantiza que ninguna decisión financiera o jurídica se tome sin supervisión ejecutiva humana.',
    invariantRef: 'AGENTS.md:SEPARACION_DE_PODERES',
  },
  {
    id: 100,
    block: 10,
    blockTitle: 'Gobernanza Máxima, Constitución Tripartita & Juramento de Soberanía',
    title: 'El Juramento de Soberanía EAR OS (Anti-Intermediación Parasitaria)',
    directive:
      'EAR OS sella su compromiso fundacional: jamás venderá posiciones patrocinadas, jamás extorsionará a hosteleros con cuotas de visibilidad engañosa y jamás degradará el caché del artista; la plataforma existe como alianza simbiótica de excelencia técnica, honor gastronómico y retribución digna al talento.',
    rationale:
      'Es el alma y piedra angular que consagra a EAR OS como el sistema operativo de eventos más respetado, robusto e inexpugnable de la industria.',
    invariantRef: 'AGENTS.md:JURAMENTO_SOBERANO_EAR_OS',
  },
]);
