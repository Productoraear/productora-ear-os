/**
 * ════════════════════════════════════════════════════════════════════════════
 * REGLAS COGNITIVAS CANÓNICAS DEL ORÁCULO CEO (REGLAS 61 A 70) · EAR OS S-CLASS
 * ════════════════════════════════════════════════════════════════════════════
 * BLOQUE 7: Alumbrado Monumental, Licitaciones LCSP & Alquiler de Alto Formato.
 *
 * Consolida las 10 directivas selladas por el Director Generalista / CEO:
 *   - Regla 61: Doble vertiente en iluminación monumental (B2G menor y Alto Ticket).
 *   - Regla 62: Licitación B2G automatizada bajo LCSP (< 14.250 / 14.500 €).
 *   - Regla 63: Blindaje de especificación técnica (IP65, 24V, reposición < 24h).
 *   - Regla 64: Retención y fianza de custodia atómica en Stripe.
 *   - Regla 65: Ciclo de vida estacional: montaje, desmontaje y rotación 3D.
 *   - Regla 66: Logística pesada con flete a consultar por cubicaje y radio.
 *   - Regla 67: Protocolo digital Twinkly™ Pro y mapeo espacial direccionable.
 *   - Regla 68: Pack Llave en Mano: Alumbrado + Show en Vivo + PA Line Array.
 *   - Regla 69: Ventana estacional con recargo del +15% tras el 31 de octubre.
 *   - Regla 70: Ficha técnica interactiva con cotas milimétricas y demo visual.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { type OraculoCanonicalRule } from './oraculo-canonical-rules-1-50';

export interface OraculoCanonicalRuleBloque7 {
  readonly id: number;
  readonly block: 7;
  readonly blockTitle: string;
  readonly title: string;
  readonly directive: string;
  readonly rationale: string;
  readonly invariantRef: string | null;
}

export const ORACULO_RULES_BLOQUE_7: readonly OraculoCanonicalRuleBloque7[] = Object.freeze([
  {
    id: 61,
    block: 7,
    blockTitle: 'Alumbrado Monumental, Licitaciones LCSP & Alquiler de Alto Formato',
    title: 'Doble Vertiente: Contrato Menor B2G & Alto Ticket Privado',
    directive:
      'El catálogo de iluminación monumental opera bajo bifurcación estricta: canalización de contratos menores para Ayuntamientos e instituciones (< 14.250 / 14.500 € bajo LCSP) y paquetes de alquiler o venta para bodas de lujo, fincas y hoteles.',
    rationale:
      'Permite monetizar el mismo arsenal de activos lumínicos tanto en la campaña invernal de instituciones públicas como en enlaces nupciales y galas corporativas de alta alcurnia.',
    invariantRef: 'src/data/luces-navidad.ts:CHRISTMAS_LIGHTING_PRODUCTS',
  },
  {
    id: 62,
    block: 7,
    blockTitle: 'Alumbrado Monumental, Licitaciones LCSP & Alquiler de Alto Formato',
    title: 'Automatización de Memoria Técnica para Licitaciones B2G',
    directive:
      'Toda propuesta institucional para Ayuntamientos debe generar automáticamente la memoria descriptiva con marcado CE, esquemas de conexión estanca a 24V, certificado de aislamiento IP65/IP67 y desglose presupuestario formal exigido por la LCSP.',
    rationale:
      'Elimina fricción burocrática y posiciona a Productora EAR como licitador técnico homologado listo para adjudicación directa en contratos menores.',
    invariantRef: 'src/lib/providers/sovereign-lead-gate.ts:LCSP_UMBRAL_CONTRATO_MENOR',
  },
  {
    id: 63,
    block: 7,
    blockTitle: 'Alumbrado Monumental, Licitaciones LCSP & Alquiler de Alto Formato',
    title: 'Garantía Técnica de Catálogo & Reposición en < 24h',
    directive:
      'Las luminarias y estructuras monumentales deben cumplir con chasis de aluminio anticorrosión, certificación de protección IP65/IP44 exterior, baja tensión a 24V y compromiso de reposición inmediata ante cualquier incidencia en menos de 24 horas.',
    rationale:
      'La fiabilidad operativa en festividades patronales y navideñas es crítica; el SLA de reposición en 24h neutraliza el riesgo percibido por concejalías y comités de festejos.',
    invariantRef: 'src/features/catalog/ui/ChristmasLightingCatalogView.tsx:CATEGORY_COVERS',
  },
  {
    id: 64,
    block: 7,
    blockTitle: 'Alumbrado Monumental, Licitaciones LCSP & Alquiler de Alto Formato',
    title: 'Fianza de Custodia Atómica con Retención en Stripe',
    directive:
      'En contratos de alquiler privado de motivos 3D transitables o equipos Twinkly Pro, se ejecuta una autorización previa o retención atómica de fianza en tarjeta mediante Stripe, la cual solo es liberada tras el desmontaje, revisión técnica y certificación de estado.',
    rationale:
      'Protege el patrimonio físico de alta graduación contra manipulaciones negligentes o sustracciones en recintos públicos y privados.',
    invariantRef: 'ear-os-ssot.ts:DEPOSITO_STRIPE_EUR',
  },
  {
    id: 65,
    block: 7,
    blockTitle: 'Alumbrado Monumental, Licitaciones LCSP & Alquiler de Alto Formato',
    title: 'Custodia Estacional & Rotación Intermunicipal 3D',
    directive:
      'El servicio incluye la gestión integral del ciclo de vida del motivo: transporte, anclaje homologado, desmontaje, almacenamiento con atmósfera controlada en nave y programa de rotación intermunicipal para que ningún municipio repita el mismo elemento dos años seguidos.',
    rationale:
      'Aumenta la tasa de retención B2G multianual ofreciendo novedad visual constante sin requerir que el consistorio adquiera en propiedad el inmovilizado.',
    invariantRef: 'src/data/luces_navidad_2026_ear.json:specialTransport',
  },
  {
    id: 66,
    block: 7,
    blockTitle: 'Alumbrado Monumental, Licitaciones LCSP & Alquiler de Alto Formato',
    title: 'Logística Pesada: Transporte Especial por Cubicaje',
    directive:
      'Todo elemento clasificado como gran formato o motivo 3D transitable se etiqueta bajo el concepto canónico «Transporte Especial / A Consultar», requiriendo cálculo logístico personalizado según radio kilométrico y necesidad de grúa pluma visada.',
    rationale:
      'Evita fugas de margen operativo por portes infravalorados en piezas monumentales que demandan vehículos de plataforma y personal habilitado.',
    invariantRef: 'ear-os-ssot.ts:LOGISTICA_BASE_KM',
  },
  {
    id: 67,
    block: 7,
    blockTitle: 'Alumbrado Monumental, Licitaciones LCSP & Alquiler de Alto Formato',
    title: 'Protocolo Twinkly™ Pro: Píxeles Mapeables & Sincronización Musical',
    directive:
      'Los proyectos digitales de iluminación inteligente deben implementarse bajo estándar Twinkly™ Pro con píxeles RGB F5 direccionables, controladores Ethernet/WiFi de 6 puertos e integración directa con Twinkly Music Player para coreografía sonora sincronizada.',
    rationale:
      'Eleva el catálogo de EAR OS de simple iluminación pasiva a instalación artística interactiva de vanguardia con alta diferenciación en el mercado.',
    invariantRef: 'src/features/catalog/ui/ChristmasLightingCatalogView.tsx:TwinklyPro',
  },
  {
    id: 68,
    block: 7,
    blockTitle: 'Alumbrado Monumental, Licitaciones LCSP & Alquiler de Alto Formato',
    title: 'Pack Encendido Navideño Llave en Mano',
    directive:
      'Las propuestas de gran formato para plazas consistoriales deben ofrecerse en formato bundle: estructura lumínica central + espectáculo en vivo (solista lírico / coro navideño) + megafonía Line Array exterior homologada con pulsador gigante para el acto oficial de encendido.',
    rationale:
      'Convierte la venta de producto en una experiencia institucional completa que agota el presupuesto del contrato menor aportando valor cultural inmediato.',
    invariantRef: 'ear-os-ssot.ts:TARIFA_MINIMA_SOLISTA_EUR',
  },
  {
    id: 69,
    block: 7,
    blockTitle: 'Alumbrado Monumental, Licitaciones LCSP & Alquiler de Alto Formato',
    title: 'Ventana de Tarifa Protegida & Recargo Estacional (+15%)',
    directive:
      'La tarifa estándar del catálogo de iluminación tiene validez protegida y bloqueo de fecha garantizado hasta el 31 de octubre. A partir del 1 de noviembre, se aplica un recargo logístico de urgencia (+15%) por saturación de flota y montaje acelerado.',
    rationale:
      'Crea una palanca ineludible de urgencia cronológica genuina que anticipa la firma de contratos y reservas de tesorería antes del cuello de botella invernal.',
    invariantRef: 'ear-os-ssot.ts:VALIDEZ_PRESUPUESTO_DIAS',
  },
  {
    id: 70,
    block: 7,
    blockTitle: 'Alumbrado Monumental, Licitaciones LCSP & Alquiler de Alto Formato',
    title: 'Ficha Visual Interactiva con Cotas Métricas & Vídeo Demostrativo',
    directive:
      'La visualización en catálogo y modal técnico debe exhibir selector de variantes, cotas métricas del fabricante (alto x ancho x fondo), consumo eléctrico en vatios, peso estructural en kg y enlace a vídeo demostrativo cuando esté indexado.',
    rationale:
      'Permite a los técnicos municipales y wedding planners validar de inmediato el encaje espacial y la viabilidad eléctrica de la instalación sin demoras.',
    invariantRef: 'src/features/catalog/ui/ChristmasLightingCatalogView.tsx:hasVideo',
  },
]);
