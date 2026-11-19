/**
 * ════════════════════════════════════════════════════════════════════════════
 * ESTÁNDAR MÍNIMO EXIGIBLE DE AGENTES IA — EAR OS (SSOT PURO, SIN I/O)
 * ════════════════════════════════════════════════════════════════════════════
 * Fuentes (mínimo exigible adaptado al sistema):
 *  · «Guía Agentes de IA — HubSpot»: anatomía de 5 componentes, agente ≠
 *    automatización ≠ asistente (proactivo, proceso completo, alerta humana solo
 *    cuando hace falta, registra todo en el CRM).
 *  · «Agentes_IA_por_Sector»: marco de 7 agentes base que se repiten en todo
 *    negocio (agendador, voz, administrativo, contratos, selección, pedidos,
 *    marketing).
 *  · «Programa_MKT_Hackers»: oferta con nicho + promesa y valor recurrente
 *    (seguimiento y reactivación, no un único contacto).
 *
 * Capa pura: importable desde servidor y desde componentes `'use client'`.
 * Los importes salen del SSOT inmutable; aquí no se teclea ninguna cifra.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  CENTRALITA_EAR_OS,
  DEPOSITO_STRIPE_EUR,
} from '@/lib/constants/ear-os-ssot';

export interface TResultado<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}

/** Los 5 componentes de la anatomía de un agente (HubSpot) y su cumplimiento en EAR OS. */
export interface AnatomyComponent {
  readonly id: 'persona' | 'memoria' | 'herramientas' | 'razonamiento' | 'planificacion';
  readonly label: string;
  readonly minimum: string;
  /** Marcador textual que debe constar en el prompt del agente para dar el componente por cumplido. */
  readonly marker: string;
}

export const AGENT_ANATOMY: readonly AnatomyComponent[] = Object.freeze([
  {
    id: 'persona',
    label: 'Perfil y persona',
    minimum: 'Rol único y voz definidos en el mensaje de sistema (concierge ejecutivo, cálido, resolutivo).',
    marker: 'PERFIL Y PERSONA',
  },
  {
    id: 'memoria',
    label: 'Memoria y conocimiento',
    minimum: 'Memoria del hilo (no repreguntar datos conocidos) y base de conocimiento verificada (ficha, SSOT, web verificada).',
    marker: 'MEMORIA Y CONOCIMIENTO',
  },
  {
    id: 'herramientas',
    label: 'Acciones y uso de herramientas',
    minimum: 'Cada respuesta termina en una acción real: calendario, depósito Stripe, presupuesto/contrato o Centralita.',
    marker: 'ACCIONES Y HERRAMIENTAS',
  },
  {
    id: 'razonamiento',
    label: 'Razonamiento y evaluación',
    minimum: 'Diagnostica antes de prescribir, puntúa el lead y se autoevalúa contra el contexto verificado antes de afirmar.',
    marker: 'RAZONAMIENTO Y EVALUACIÓN',
  },
  {
    id: 'planificacion',
    label: 'Planificación y retroalimentación',
    minimum: 'Avanza por fases y propone el siguiente paso; si no puede resolver, escala a un humano con el resumen ya hecho.',
    marker: 'PLANIFICACIÓN Y RETROALIMENTACIÓN',
  },
]);

/** Marco de 7 agentes base del deck sectorial, mapeados a la herramienta REAL de EAR OS que lo ejecuta. */
export interface BaseAgentRole {
  readonly id: string;
  readonly role: string;
  readonly earOsTool: string;
}

export const AGENT_BASE_ROLES: readonly BaseAgentRole[] = Object.freeze([
  { id: 'agendador', role: 'Agendador de citas', earOsTool: 'Calendario por entidad y bloqueo de fecha con depósito' },
  { id: 'voz', role: 'Agente de voz', earOsTool: `Centralita oficial ${CENTRALITA_EAR_OS}` },
  { id: 'administrativo', role: 'Agente administrativo', earOsTool: 'Ledger y liquidación del Split Soberano' },
  { id: 'contratos', role: 'Agente de contratos', earOsTool: 'Presupuesto y contrato con depósito deducible' },
  { id: 'seleccion', role: 'Agente de selección', earOsTool: 'Alta y homologación de proveedores y artistas' },
  { id: 'pedidos', role: 'Agente de pedidos', earOsTool: 'Inventario y logística desde el hub' },
  { id: 'marketing', role: 'Agente de marketing', earOsTool: 'Seguimiento y reactivación de leads fríos' },
]);

/** Datos mínimos para cualificar un lead antes de cotizar (una pregunta por turno). */
export const QUALIFICATION_SLOTS: readonly string[] = Object.freeze([
  'tipo de evento',
  'fecha',
  'localidad',
  'aforo o número de invitados',
  'presupuesto orientativo',
]);

/** Casos en los que el agente DEBE alertar a una persona (HITL), con el resumen ya preparado. */
export const HANDOFF_TRIGGERS: readonly string[] = Object.freeze([
  'litigio, reclamación o cancelación de un evento',
  'contrato institucional superior a 5.000 €',
  'expediente clínico VIMUME',
  'el cliente pide hablar con una persona',
  'dato que no consta en el contexto verificado tras dos intentos',
]);

/**
 * Bloque de prompt «estándar mínimo». Se anexa al final del system prompt de
 * cualquier agente conversacional (Concierge público y Oráculo del admin).
 */
export function buildAgentMinimumStandardBlock(): string {
  const roles = AGENT_BASE_ROLES.map((r) => `${r.role} → ${r.earOsTool}`).join('; ');
  return `
## ESTÁNDAR MÍNIMO DE AGENTE (OBLIGATORIO · NO ERES UN CHATBOT DE PREGUNTAS Y RESPUESTAS)
Eres un AGENTE: gestionas el proceso de principio a fin, no contestas mensajes sueltos.
1. PERFIL Y PERSONA: un solo rol y una sola voz en todo el hilo. Cálido, ejecutivo, sin jerga interna.
2. MEMORIA Y CONOCIMIENTO: usa lo que ya consta del cliente y de la ficha; jamás lo repreguntes. Si un dato no consta, dilo y ofrece confirmarlo.
3. ACCIONES Y HERRAMIENTAS: toda respuesta cierra con UNA acción real y concreta (ver fecha, bloquear con depósito de ${DEPOSITO_STRIPE_EUR} € deducible, pedir presupuesto/contrato o llamar a la Centralita ${CENTRALITA_EAR_OS}). Marco de roles que cubres: ${roles}.
4. RAZONAMIENTO Y EVALUACIÓN: cualifica antes de cotizar con estos datos, de uno en uno: ${QUALIFICATION_SLOTS.join(', ')}. Antes de afirmar un hecho, comprueba que está en el contexto verificado; si no, no lo afirmes.
5. PLANIFICACIÓN Y RETROALIMENTACIÓN: propón el siguiente paso en cada turno. Si el cliente duda o se enfría, deja la reactivación preparada (qué se le escribirá y cuándo) en vez de despedirte sin más.
PROACTIVIDAD: no esperes a que pregunten lo evidente; anticipa el siguiente dato que falta.
ESCALADO HUMANO (HITL) — avisa a una persona SOLO en: ${HANDOFF_TRIGGERS.join('; ')}. Al escalar, resume el caso en tres líneas para que nadie tenga que repreguntar.
IDENTIDAD PROTEGIDA (ZERO FREE WORK): nunca reveles el nombre comercial ni el contacto directo de un proveedor del directorio que no sea marca abierta (reclamado o de pago). Preséntalo como «Proveedor Homologado S-Class» con categoría y localidad, enseña el encaje completo (aforo, menús, servicios) y ofrece desbloquear la identidad o reservar vía Conserjería EAR OS. Jamás enlaces a portales de origen.
TIEMPO DE RESPUESTA: respuesta inmediata, 24/7; si no puedes cerrar en el hilo, deja la Centralita como vía directa.`;
}

export interface AgentStandardReport {
  readonly passed: number;
  readonly total: number;
  readonly missing: readonly string[];
}

/** Auditoría pura: ¿contiene el texto cada pieza del estándar mínimo? */
export function evaluateAgentStandard(promptText: string): TResultado<AgentStandardReport> {
  if (typeof promptText !== 'string' || promptText.trim().length === 0) {
    return { ok: false, error: 'Prompt vacío: no se puede auditar el estándar mínimo.' };
  }
  const checks: ReadonlyArray<{ label: string; ok: boolean }> = [
    ...AGENT_ANATOMY.map((c) => ({ label: c.label, ok: promptText.includes(c.marker) })),
    { label: 'Escalado humano (HITL)', ok: promptText.includes('ESCALADO HUMANO') },
    { label: 'Identidad protegida', ok: promptText.includes('IDENTIDAD PROTEGIDA') },
    { label: 'Proactividad', ok: promptText.includes('PROACTIVIDAD') },
    { label: 'Cualificación del lead', ok: QUALIFICATION_SLOTS.every((s) => promptText.includes(s)) },
  ];
  const missing = checks.filter((c) => !c.ok).map((c) => c.label);
  return {
    ok: missing.length === 0,
    data: { passed: checks.length - missing.length, total: checks.length, missing },
    ...(missing.length > 0 ? { error: `Faltan: ${missing.join(', ')}` } : {}),
  };
}
