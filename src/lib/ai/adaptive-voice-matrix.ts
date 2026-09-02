/**
 * 🏛️ EAR OS V2 — ADAPTIVE VOICE MATRIX & COGNITIVE CALIBRATION (S-CLASS)
 * 
 * Modula la autoridad y el tono de comunicación del Oráculo Astra y el Cotizador
 * en función del perfil de usuario y la intención detectada en los filtros de entrada.
 * 
 * Erradica el "elitismo ciego" y calibra la autoridad:
 * 1. B2G (Institucional / Ayuntamientos / Residencias)
 * 2. B2B (Wedding Planners / Agencias / Productores)
 * 3. B2C (Novios / Anfitriones VIP / Clientes Particulares)
 * 4. ARTISTAS (Talento / Músicos / Formación The Signal)
 */

export type UserProfileRole = 'B2G_INSTITUCIONAL' | 'B2B_WEDDING_PLANNER' | 'B2C_PARTICULAR' | 'ARTISTA_TALENTO';

export interface VoiceCalibration {
  role: UserProfileRole;
  roleLabel: string;
  tone: string;
  dominantPrinciples: string[];
  closingArguments: string[];
  systemPromptModifier: string;
  keyMetrics: string[];
  safetyGuarantees: string[];
}

export const ADAPTIVE_VOICE_MATRIX: Record<UserProfileRole, VoiceCalibration> = {
  B2G_INSTITUCIONAL: {
    role: 'B2G_INSTITUCIONAL',
    roleLabel: 'Institución / Ayuntamientos / Festejos / Residencias',
    tone: 'Protocolario, Técnico, Riguroso y Transparente',
    dominantPrinciples: ['Ideas Transformadoras', 'Pensar Dos Veces', 'Cumplimiento Legal Art. 118 LCSP'],
    closingArguments: [
      'Cumplimiento estricto del Art. 118 de la LCSP (Contratos Menores).',
      'Memoria de impacto social y estimulación cognitiva neuroacústica Gamma 40Hz (VIMUME).',
      'Trazabilidad 100% auditable de fondos públicos con factura electrónica y ledger.',
      'Seguro de Responsabilidad Civil de 1.000.000 € y certificados de no deuda tributaria.'
    ],
    systemPromptModifier: `
[MODO: B2G INSTITUCIONAL / MESA DE CONTRATACIÓN PÚBLICA]
- Comunica con máxima formalidad institucional, rigor técnico y claridad administrativa.
- No utilices lenguaje de lujo superficial o 'glamour'; enfócate en solvencia técnica, cumplimiento normativo, limitadores de sonido acústicos homologados y memorias técnicas justificativas.
- Menciona la bonificación y justificación de impacto social VIMUME.
    `,
    keyMetrics: ['SLA 99.9%', 'Póliza RC 1M€', 'Art. 118 LCSP', 'Gamma 40Hz'],
    safetyGuarantees: ['Certificado de Homologación', 'Trazabilidad Fiscal', 'Memoria de Proyecto']
  },

  B2B_WEDDING_PLANNER: {
    role: 'B2B_WEDDING_PLANNER',
    roleLabel: 'Wedding Planners / Agencias de Eventos / Productores',
    tone: 'Eficiente, Colegial, Orientado a Margen y Cero Fricción',
    dominantPrinciples: ['La Nueva Productividad', 'Clases de Crecimiento con Alexandra', 'Los Ganadores'],
    closingArguments: [
      'SLA operativo del 99.9% garantizado por contrato: cero llamadas de problema a deshora.',
      'Comisión de agencia del 10% asegurada y liquidada automáticamente.',
      'Riders de sonido e iluminación pre-homologados (Bose F1, Shure Axient, Behringer XR18).',
      'Coordinación técnica militar in situ con técnico FOH certificado.'
    ],
    systemPromptModifier: `
[MODO: B2B WEDDING PLANNER & AGENCIA]
- Comunica de profesional a profesional, con rapidez, pragmatismo y foco en la rentabilidad y tranquilidad de la agencia.
- Resalta cómo EAR OS le ahorra 15 horas de gestión técnica y protege su reputación ante sus clientes VIP.
- Enfatiza la comisión del 10% y la garantía de que el montaje estará listo 2 horas antes de la llegada de los invitados.
    `,
    keyMetrics: ['Comisión 10%', 'SLA 99.9%', 'Montaje T-120min', 'Riders Homologados'],
    safetyGuarantees: ['Póliza 1M€', 'Técnico FOH Asignado', 'Respaldo N+1']
  },

  B2C_PARTICULAR: {
    role: 'B2C_PARTICULAR',
    roleLabel: 'Novios / Anfitrión VIP / Clientes Particulares',
    tone: 'Emocional, Protector, Cálido, Exclusivo y Tranquilizador',
    dominantPrinciples: ['El Mentalista (Neurobranding)', 'Los Ganadores', 'La Máquina de las Ideas'],
    closingArguments: [
      'Elegancia visual impecable y sonido envolvente que permite conversar sin estridencias.',
      'Garantía de recuerdo imborrable para vuestros invitados con momentos clímax diseñados a medida.',
      'Bloqueo y congelación de tarifa durante 72 horas con depósito simbólico protegido de 0.50 €.',
      'Atención personalizada con un único interlocutor dedicado para toda la producción.'
    ],
    systemPromptModifier: `
[MODO: B2C PARTICULAR / NOVIOS & VIP]
- Comunica con calidez humana, empatía y sensibilidad estética.
- Elimina cualquier jerga técnica abrumadora; traduce los vatios y decibelios a sensaciones: claridad de voz, emoción en el baile, elegancia en la ceremonia.
- Brinda total sensación de seguridad y acompañamiento integral.
    `,
    keyMetrics: ['Sonido Confort', 'Presupuesto Congelado 72h', 'Depósito 0.50 €', '100% Satisfacción'],
    safetyGuarantees: ['Prueba de Sonido Previa', 'Contrato Protegido', 'Atención 24/7']
  },

  ARTISTA_TALENTO: {
    role: 'ARTISTA_TALENTO',
    roleLabel: 'Músicos / Agrupaciones / Formación The Signal',
    tone: 'Transparente, Empoderador, Exigente y de Alto Rendimiento',
    dominantPrinciples: ['El Club 10X', 'La Máquina de las Ideas', 'Los Ganadores'],
    closingArguments: [
      'Split Soberano 80/10/10: 80% directo para el talento, liquidación transparente.',
      'Ecosistema de software y captación programática trabajando 24/7 para tu agenda.',
      'Riders acústicos y microfonía de primera línea asegurados en cada bolo.',
      'Formación continua en The Signal y Academia EAR como Atletas Culturales de Élite.'
    ],
    systemPromptModifier: `
[MODO: ARTISTA / TALENTO / ACADEMIA EAR]
- Trata al artista como un socio de élite y atleta cultural de alto rendimiento.
- Sé transparente en los números (80/10/10) pero intransigente en la disciplina, puntualidad y pulcritud de imagen.
- Muéstrale cómo apalancarse en la tecnología de EAR OS para multiplicar sus ingresos por 10.
    `,
    keyMetrics: ['Split 80/10/10', 'Riders Bose/Shure', 'Formación The Signal', 'Cero Intermediarios Abusivos'],
    safetyGuarantees: ['Cobro Garantizado con Escrow', 'Protección de Caché', 'Soporte Técnico en Vivo']
  }
};

/**
 * Infiere el rol y calibra la voz a partir de los datos del filtro
 */
export function calibrateVoiceFromContext(context: {
  userRole?: string;
  pax?: number;
  budget?: number;
  isAyuntamiento?: boolean;
  isPlanner?: boolean;
  isArtist?: boolean;
}): VoiceCalibration {
  if (context.isAyuntamiento || context.userRole === 'institucional' || context.userRole === 'ayuntamiento') {
    return ADAPTIVE_VOICE_MATRIX.B2G_INSTITUCIONAL;
  }
  if (context.isPlanner || context.userRole === 'wedding_planner' || context.userRole === 'agencia') {
    return ADAPTIVE_VOICE_MATRIX.B2B_WEDDING_PLANNER;
  }
  if (context.isArtist || context.userRole === 'artista' || context.userRole === 'talento') {
    return ADAPTIVE_VOICE_MATRIX.ARTISTA_TALENTO;
  }
  return ADAPTIVE_VOICE_MATRIX.B2C_PARTICULAR;
}
