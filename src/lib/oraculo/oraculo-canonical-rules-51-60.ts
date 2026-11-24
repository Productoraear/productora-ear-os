/**
 * ════════════════════════════════════════════════════════════════════════════
 * REGLAS COGNITIVAS CANÓNICAS DEL ORÁCULO CEO (REGLAS 51 A 60) · EAR OS S-CLASS
 * ════════════════════════════════════════════════════════════════════════════
 * BLOQUE 6: Gobernanza Operativa, Neutralidad Algorítmica & Cierre Atómico.
 *
 * Consolida las 10 directivas selladas por el Director Generalista / CEO:
 *   - Regla 51: Depósito 100 € como fianza deducible + cerrojo atómico.
 *   - Regla 52: Reenganche persistente en LocalStorage + derivación a Centralita.
 *   - Regla 53: Artista Paciente Cero (Edwin Agudelo) y split 80/10/10.
 *   - Regla 54: Certeza climática en Otzarreta (50-200 / 350 pax, 120 párking).
 *   - Regla 55: Cancelaciones por fuerza mayor a 0 € de penalización.
 *   - Regla 56: Barra libre regida por ficha oficial (< 75 dB SPL).
 *   - Regla 57: Captación audiovisual sin subastas a la baja en bodas de alto ticket.
 *   - Regla 58: WhatsApp oficial como puente directo de dirección en 60 segundos.
 *   - Regla 59: Neutralidad algorítmica absoluta sin posiciones patrocinadas.
 *   - Regla 60: Cierre por autoridad técnica, fianza atómica y escasez real.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { type OraculoCanonicalRule } from './oraculo-canonical-rules-1-50';

export interface OraculoCanonicalRuleBloque6 {
  readonly id: number;
  readonly block: 6;
  readonly blockTitle: string;
  readonly title: string;
  readonly directive: string;
  readonly rationale: string;
  readonly invariantRef: string | null;
}

export const ORACULO_RULES_BLOQUE_6: readonly OraculoCanonicalRuleBloque6[] = Object.freeze([
  {
    id: 51,
    block: 6,
    blockTitle: 'Gobernanza Operativa, Neutralidad & Cierre Atómico',
    title: 'Depósito Price-Lock con Cerrojo Atómico de Agenda',
    directive:
      'El depósito de 100,00 € actúa como fianza deducible al 100% en Stripe activando un cerrojo atómico serializable en base de datos: la fecha queda congelada sin riesgo de colisión ni doble reserva.',
    rationale:
      'El aislamiento atómico (1 ganador HTTP 200, N-1 bloqueados HTTP 409) elimina mecánicamente el fraude o la sobreventa de fechas.',
    invariantRef: 'ear-os-ssot.ts:DEPOSITO_STRIPE_EUR',
  },
  {
    id: 52,
    block: 6,
    blockTitle: 'Gobernanza Operativa, Neutralidad & Cierre Atómico',
    title: 'Reenganche Persistente & Derivación al Maître',
    directive:
      'Toda cotización o estado de carrito se almacena con clave persistente en LocalStorage generando URL recuperable; ante dudas no resueltas en 3 interacciones, se deriva formalmente al Maître en la Centralita (+34 693 693 048).',
    rationale:
      'Evita la pérdida de carritos abandonados y asegura una vía de asistencia humana (HITL) de alto nivel.',
    invariantRef: 'phone-constants.ts:CENTRALITA',
  },
  {
    id: 53,
    block: 6,
    blockTitle: 'Gobernanza Operativa, Neutralidad & Cierre Atómico',
    title: 'Artista Paciente Cero como Validador Nacional',
    directive:
      'Edwin Agudelo (e78903) actúa como Artista Paciente Cero: su tarifa canónica de 550,00 € (con 100 km incluidos desde Méntrida) y split 80/10/10 valida la logística y la pureza lírica en las 52 provincias españolas.',
    rationale:
      'Toda regla de negocio debe ser probada y resistida en el artista fundador antes de extrapolarse a terceros proveedores.',
    invariantRef: 'AGENTS.md §3',
  },
  {
    id: 54,
    block: 6,
    blockTitle: 'Gobernanza Operativa, Neutralidad & Cierre Atómico',
    title: 'Certeza Climática y de Aforo en Otzarreta',
    directive:
      'Garantizar el plan B climático sin sobrecoste en el Caserío Otzarreta de 1902 (Derio, Bizkaia): comedor acristalado de 50 a 200 comensales ampliable a 350 en carpa/jardín, brasa de carbón de encina y sarmiento, y 120 plazas de aparcamiento privado.',
    rationale:
      'La climatología en el norte de España no puede arruinar un banquete; el comensal debe tener la certeza del espacio cerrado homologado.',
    invariantRef: 'otzarreta-entity.ts:OTZARRETA_ENTITY',
  },
  {
    id: 55,
    block: 6,
    blockTitle: 'Gobernanza Operativa, Neutralidad & Cierre Atómico',
    title: 'Cancelaciones por Fuerza Mayor a 0 € de Penalización',
    directive:
      'En caso de causa mayor sobrevenida debidamente acreditada (meteorológica extrema, salud o catástrofe), se garantiza el cambio de fecha a 0,00 € de penalización conservando el 100% de la fianza abonada.',
    rationale:
      'La postura de anfitrión noble exige no lucrarse con la desgracia ajena, fidelizando la relación a largo plazo.',
    invariantRef: null,
  },
  {
    id: 56,
    block: 6,
    blockTitle: 'Gobernanza Operativa, Neutralidad & Cierre Atómico',
    title: 'Barra Libre Regida por Ficha de Proveedor',
    directive:
      'Las condiciones de barra libre, horarios y primeras marcas se rigen exclusivamente por los campos auditados en la ficha oficial del asador/finca, con garantía acústica estricta por debajo de 75 dB SPL.',
    rationale:
      'Cero sorpresas ni costes ocultos por copa o prolongación horaria que no figuren en el contrato original.',
    invariantRef: 'ear-os-ssot.ts:LIMITE_SPL_DB',
  },
  {
    id: 57,
    block: 6,
    blockTitle: 'Gobernanza Operativa, Neutralidad & Cierre Atómico',
    title: 'Captación de Creadores Audiovisuales sin Subasta a la Baja',
    directive:
      'La homologación de fotógrafos y videógrafos en EAR OS prohíbe las subastas a la baja; se garantiza el acceso a eventos de alto ticket con menús de 145 € a 185 € a cambio de entrega de máster en resolución nativa y puntualidad de gala.',
    rationale:
      'La calidad cinematográfica de una boda requiere retribución digna para exigir material impecable y entrega rápida.',
    invariantRef: null,
  },
  {
    id: 58,
    block: 6,
    blockTitle: 'Gobernanza Operativa, Neutralidad & Cierre Atómico',
    title: 'WhatsApp Oficial como Puente de Dirección Operativa',
    directive:
      'El canal de WhatsApp de la Centralita (+34 693 693 048) opera como puente directo con la dirección ejecutiva, despachando respuestas cualificadas en menos de 60 segundos sin bots impersonales.',
    rationale:
      'El cliente VIP exige inmediatez de respuesta y contacto directo con quien tiene capacidad de decisión real.',
    invariantRef: 'phone-constants.ts:CENTRALITA',
  },
  {
    id: 59,
    block: 6,
    blockTitle: 'Gobernanza Operativa, Neutralidad & Cierre Atómico',
    title: 'Neutralidad Algorítmica Absoluta',
    directive:
      'El ranking de recomendaciones y el radar de proveedores se rige exclusivamente por coincidencia geográfica, acústica y de capacidad real; queda terminantemente prohibida la venta de posiciones patrocinadas de pago.',
    rationale:
      'La confianza en EAR OS depende de que el cliente sepa que el proveedor recomendado es el mejor para su caso, no el que más ha pagado por aparecer.',
    invariantRef: null,
  },
  {
    id: 60,
    block: 6,
    blockTitle: 'Gobernanza Operativa, Neutralidad & Cierre Atómico',
    title: 'Cierre por Autoridad Técnica, Fianza Atómica y Escasez Real',
    directive:
      'El cierre contractual se culmina conjugando la autoridad de los datos técnicos verificados en disco, la fianza atómica de 100 € como barrera de entrada y la escasez real de solo 1 fecha por día y recinto por temporada.',
    rationale:
      'La tríada perfecta de alta conversión: certeza indiscutible, micro-compromiso formal y urgencia natural por cupo limitado.',
    invariantRef: 'AGENTS.md §1.2',
  },
]);

/**
 * Obtiene una regla específica del Bloque 6 por su id (51 a 60).
 */
export function getOraculoRuleBloque6ById(id: number): OraculoCanonicalRuleBloque6 | undefined {
  return ORACULO_RULES_BLOQUE_6.find((r) => r.id === id);
}
