/**
 * ════════════════════════════════════════════════════════════════════════════
 * REGLAS COGNITIVAS CANÓNICAS DEL ORÁCULO CEO (REGLAS 81 A 90) · EAR OS S-CLASS
 * ════════════════════════════════════════════════════════════════════════════
 * BLOQUE 9: Experiencia VIP, Resiliencia de Sala, Split & Fianza Soberana.
 *
 * Consolida las 10 directivas selladas por el Director Generalista / CEO:
 *   - Regla 81: Privacidad VIP, NDA digital obligatorio y control RBAC.
 *   - Regla 82: Propinas digitales en Stripe Connect 100% íntegras para sala.
 *   - Regla 83: Lead scoring de alta prioridad (< 15 min WhatsApp Centralita).
 *   - Regla 84: Sincronización Seating Planner 3D y pase de cocina/alérgenos.
 *   - Regla 85: Devolución atómica de fianza en 48h o parte técnico motivado.
 *   - Regla 86: Conciliación transparente del Split 80/10/10 y exportación contable.
 *   - Regla 87: Caducidad de presupuesto a 15 días y bloqueo Price-Lock 100 €.
 *   - Regla 88: Firma biométrica táctil móvil con sellado eIDAS y SHA-256.
 *   - Regla 89: Resiliencia de sala y modo offline PWA + orden de servicio PDF.
 *   - Regla 90: Aplazamientos a 0 € de penalización y prioridad de temporada.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { type OraculoCanonicalRule } from './oraculo-canonical-rules-1-50';

export interface OraculoCanonicalRuleBloque9 {
  readonly id: number;
  readonly block: 9;
  readonly blockTitle: string;
  readonly title: string;
  readonly directive: string;
  readonly rationale: string;
  readonly invariantRef: string | null;
}

export const ORACULO_RULES_BLOQUE_9: readonly OraculoCanonicalRuleBloque9[] = Object.freeze([
  {
    id: 81,
    block: 9,
    blockTitle: 'Experiencia VIP, Resiliencia de Sala, Split & Fianza Soberana',
    title: 'Privacidad VIP con NDA Digital & Blindaje RBAC',
    directive:
      'Toda celebración que involucre personalidades públicas o contratación de alto nivel activa automáticamente el protocolo de confidencialidad: firma previa de NDA digital vinculante, prohibición estricta de captura y difusión de imágenes por el equipo técnico y restricción de acceso RBAC al expediente de sala.',
    rationale:
      'Garantiza la discreción absoluta requerida por clientes de alto patrimonio y protocolo institucional, eliminando filtraciones no autorizadas.',
    invariantRef: 'docs/02_CONTRATOS/ACUERDO_CONFIDENCIALIDAD_VIP.md',
  },
  {
    id: 82,
    block: 9,
    blockTitle: 'Experiencia VIP, Resiliencia de Sala, Split & Fianza Soberana',
    title: 'Propinas Digitales 100% Íntegras Vía Stripe Connect',
    directive:
      'El sistema habilita módulo voluntario de gratificación digital transparente a través de Stripe Connect, transfiriendo el 100% del importe donado al equipo de sala, camareros y técnicos sin retención ni comisión de plataforma, conviviendo con el abono tradicional en mano.',
    rationale:
      'Dignifica la retribución del personal de hostelería y montaje, incentivando una atención de sala insuperable sin generar costes añadidos a la productora.',
    invariantRef: 'src/lib/finance/stripe-connect-payouts.ts:GRATIFICACIONES_SALA',
  },
  {
    id: 83,
    block: 9,
    blockTitle: 'Experiencia VIP, Resiliencia de Sala, Split & Fianza Soberana',
    title: 'Lead Scoring Prioritario & Despacho Inmediato en < 15 Minutos',
    directive:
      'El motor de scoring asigna prioridad máxima («VIP_HOT») a toda cotización con aforo superior a 100 comensales o importe superior a 5.000 €, disparando una alerta instantánea a la Centralita WhatsApp (+34 693 693 048) con llamada o mensaje del Maître en menos de 15 minutos.',
    rationale:
      'La velocidad de contacto en presupuestos de alto ticket multiplica exponencialmente la tasa de conversión antes de que el cliente explore alternativas.',
    invariantRef: 'ear-os-ssot.ts:TELEFONO_CENTRALITA',
  },
  {
    id: 84,
    block: 9,
    blockTitle: 'Experiencia VIP, Resiliencia de Sala, Split & Fianza Soberana',
    title: 'Sincronización Seating Planner 3D & Pase de Cocina con Alérgenos',
    directive:
      'La distribución de mesas del Seating Planner Pulpetti genera en un clic la hoja de servicio para el jefe de cocina y camareros, indicando la ubicación exacta de comensales celíacos, veganos o con intolerancias graves mediante iconografía normalizada por silla.',
    rationale:
      'Erradica errores en el servicio de platos especiales durante banquetes masivos y asegura una coordinación perfecta entre sala y fogones.',
    invariantRef: 'src/components/pulpetti/SeatingPlanner3D.tsx:ALERGENOS_SILLA',
  },
  {
    id: 85,
    block: 9,
    blockTitle: 'Experiencia VIP, Resiliencia de Sala, Split & Fianza Soberana',
    title: 'Devolución Ágil de Fianza en 48 Horas con Liberación Stripe',
    directive:
      'La retención de garantía o fianza de custodia en Stripe se desbloquea de forma automatizada en un plazo máximo de 48 horas tras el desmontaje del evento; cualquier retención parcial exige emitir un parte técnico visado con prueba fotográfica y justificación económica en menos de 24 horas.',
    rationale:
      'Construye confianza intachable con el contratante, demostrando que la fianza no es una vía encubierta de cobro sino una salvaguarda operativa temporal.',
    invariantRef: 'ear-os-ssot.ts:DEPOSITO_STRIPE_EUR',
  },
  {
    id: 86,
    block: 9,
    blockTitle: 'Experiencia VIP, Resiliencia de Sala, Split & Fianza Soberana',
    title: 'Transparencia Contable del Split Soberano 80/10/10',
    directive:
      'El portal del proveedor refleja en tiempo real la liquidación exacta de cada servicio desglosada bajo el canon SSOT: 80% artista/ejecutor, 10% plataforma/centralita y 10% fondo de contingencia/reinversión, con exportación contable en PDF/CSV y payout directo en Stripe Connect.',
    rationale:
      'Garantiza la lealtad incondicional de los mejores artistas y fincas de España gracias a una transparencia financiera total e inviolable.',
    invariantRef: 'ear-os-ssot.ts:SPLIT_SOBERANO',
  },
  {
    id: 87,
    block: 9,
    blockTitle: 'Experiencia VIP, Resiliencia de Sala, Split & Fianza Soberana',
    title: 'Caducidad de Oferta a 15 Días & Price-Lock Condicionado a Depósito',
    directive:
      'Las propuestas económicas tienen una validez legal estricta de 15 días naturales; el bloqueo de la fecha y la congelación de la tarifa frente a revisiones estacionales (Price-Lock) exigen la formalización del depósito canónico de 100,00 € deducible al 100%.',
    rationale:
      'Genera una frontera temporal real que evita negociaciones dilatadas y asegura el flujo de caja operativo sin descuentos deshonestos.',
    invariantRef: 'ear-os-ssot.ts:VALIDEZ_PRESUPUESTO_DIAS',
  },
  {
    id: 88,
    block: 9,
    blockTitle: 'Experiencia VIP, Resiliencia de Sala, Split & Fianza Soberana',
    title: 'Firma Biométrica Táctil en Móvil con Sellado Criptográfico eIDAS',
    directive:
      'El contrato y la orden de servicio se rubrican directamente en la pantalla del smartphone del cliente mediante trazo biométrico táctil, sellado de tiempo y hash inmutable SHA-256 acorde a la normativa eIDAS, remitiendo copia instantánea por WhatsApp y correo electrónico.',
    rationale:
      'Cierra acuerdos vinculantes en cuestión de segundos durante visitas al caserío o fincas colaboradoras, sin impresiones ni trámites analógicos.',
    invariantRef: 'src/lib/contracts/eidas-contract-signer.ts:FIRMA_SHA256',
  },
  {
    id: 89,
    block: 9,
    blockTitle: 'Experiencia VIP, Resiliencia de Sala, Split & Fianza Soberana',
    title: 'Resiliencia Operativa de Sala: Caché Local PWA & Orden en PDF',
    directive:
      'La aplicación de sala y los planos de mesas del Seating Planner operan con persistencia local en caché offline (PWA / Service Worker); antes de la apertura de puertas, el Maître descarga la orden de servicio completa en PDF de alta resolución como respaldo ante fallos de conectividad.',
    rationale:
      'Asegura la continuidad del evento incluso en fincas rurales con sombra de cobertura móvil o caídas imprevistas de red WiFi.',
    invariantRef: 'src/lib/pwa/offline-resilience-cache.ts:ORDEN_SERVICIO_PDF',
  },
  {
    id: 90,
    block: 9,
    blockTitle: 'Experiencia VIP, Resiliencia de Sala, Split & Fianza Soberana',
    title: 'Política Soberana de Aplazamiento a 0 € de Penalización',
    directive:
      'Si una pareja o institución necesita aplazar su fecha por causa debidamente acreditada, el 100% de los anticipos y depósitos formalizados se custodia intacto para la nueva fecha acordada dentro de los siguientes 12 meses, disfrutando de prioridad absoluta de calendario sin recargo alguno.',
    rationale:
      'Elimina el miedo al desembolso inicial y solidifica la reputación aristocrática de Productora EAR frente a competidores con cláusulas punitivas leoninas.',
    invariantRef: 'docs/01_ARQUITECTURA_SCLASS/POLITICA_APLAZAMIENTOS_SOBERANA.md',
  },
]);
