/**
 * ════════════════════════════════════════════════════════════════════════════
 * MATRIZ CANÓNICA DE 8 DIMENSIONES OPERATIVAS DEL CEO · EAR OS (S-CLASS)
 * ════════════════════════════════════════════════════════════════════════════
 * Refunda la selección de entrada del Cockpit y Compilador del Oráculo,
 * sustituyendo las plantillas simplificadas de 4 botones por la estructura
 * omnicomprensiva de los 8 roles y frentes del negocio.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  TARIFA_BASE_SOLISTA_EUR,
  TARIFA_ESTANDAR_SOLISTA_EUR,
  SOLISTA_KM_INCLUIDOS,
  DEPOSITO_STRIPE_EUR,
  AJUSTE_PREVENTIVO_B2G_EUR,
  LIMITE_B2G_LCSP_EUR,
  SPLIT_SOBERANO,
  LIMITE_SPL_DB,
} from '@/lib/constants/ear-os-ssot';
import {
  OTZARRETA_WEDDING_MENUS,
  formatOtzarretaMenuPrice,
} from '@/lib/constants/otzarreta-entity';
import { SENTINEL_HASH_SSOT } from '@/lib/governance/constitution-tier1';

export type CeoOperationalDimensionId =
  | 'CLIENTES_NOVIOS'
  | 'HOSTELERIA_FINCAS'
  | 'ARTISTAS_ESCENARIO'
  | 'PROVEEDORES_CATALOGO'
  | 'B2G_AYUNTAMIENTOS'
  | 'TESORERIA_SPLIT'
  | 'LOGISTICA_FLEET'
  | 'GOBERNANZA_SRE';

export interface CeoOperationalDimension {
  readonly id: CeoOperationalDimensionId;
  readonly code: number;
  readonly label: string;
  readonly roleTag: string;
  readonly badge: string;
  readonly summary: string;
  readonly description: string;
  readonly canonicalRuleIds: readonly number[];
  readonly canonicalInvariants: readonly string[];
  readonly defaultSeedVision: string;
  readonly accentColor: string;
}

function formatEur(amount: number): string {
  const [integer, decimals] = amount.toFixed(2).split('.');
  return `${integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${decimals} €`;
}

export const CEO_OPERATIONAL_DIMENSIONS: readonly CeoOperationalDimension[] = Object.freeze([
  {
    id: 'CLIENTES_NOVIOS',
    code: 1,
    label: 'Clientes & Novios',
    roleTag: 'HIGH-TICKET B2C',
    badge: 'CONVERSIÓN',
    summary: 'Seating Planner, menús cerrados, NDA VIP y depósito Price-Lock de 100 €.',
    description: 'Relación directa novios-productora sin fricción, protocolo de sala exclusivo, personalización de menú sin recargo celíaco y bloqueo de fecha.',
    canonicalRuleIds: [1, 5, 23, 31, 32, 51, 81, 84, 87, 88, 90],
    canonicalInvariants: [
      `Fianza deducible Stripe Price-Lock: ${DEPOSITO_STRIPE_EUR} € (Bloqueo inmediato garantizado)`,
      `Menús de gala Otzarreta: de ${formatOtzarretaMenuPrice(OTZARRETA_WEDDING_MENUS[0]?.priceEur ?? 145)} a ${formatOtzarretaMenuPrice(OTZARRETA_WEDDING_MENUS[3]?.priceEur ?? 185)} + IVA`,
      'Protocolo celíacos e intolerancias a 0,00 € sin suplemento en partida',
      'Seating Planner 3D Pulpetti incluido de cortesía con asignación de sillas',
      'Cláusula de Privacidad VIP con NDA digital y control RBAC (Regla 81)',
      'Presupuesto formal con caducidad canónica a 15 días naturales (Regla 87)',
    ],
    defaultSeedVision: 'Cerrar la contratación de gala para novios asegurando exclusividad absoluta de fecha (1 evento por día), menú cerrado sin recargo por alérgenos y depósito Stripe de 100 €.',
    accentColor: '#f59e0b',
  },
  {
    id: 'HOSTELERIA_FINCAS',
    code: 2,
    label: 'Hostelería & Fincas',
    roleTag: 'B2B HOSPITALITY',
    badge: 'ALIANZAS',
    summary: 'Estándar Otzarreta, menús 145€-185€, aforo, exclusividad 100 km y < 75 dB.',
    description: 'Acuerdos marco de exclusividad territorial, protección de licencia de actividad municipal con sonometría legal y fidelización de recintos de prestigio.',
    canonicalRuleIds: [33, 35, 71, 72, 73, 74, 75, 77, 84, 91],
    canonicalInvariants: [
      'Blindaje territorial comarcal de 100 km de no-competencia (Regla 91 · Estándar Otzarreta)',
      `Menús de temporada 2026 cerrados: de ${formatOtzarretaMenuPrice(OTZARRETA_WEDDING_MENUS[0]?.priceEur ?? 145)} a ${formatOtzarretaMenuPrice(OTZARRETA_WEDDING_MENUS[3]?.priceEur ?? 185)} + IVA`,
      `Límite acústico garantizado: < ${LIMITE_SPL_DB} dB SPL (Sin cortes policiales · Ley 37/2003)`,
      'Párking privado vigilado: 120 plazas gratuitas en Caserío Derio (Bizkaia)',
      'Exclusividad absoluta: 1 único evento por día en recinto para proteger la excelencia',
    ],
    defaultSeedVision: 'Proteger la alianza B2B exclusiva con la finca bajo el estándar Otzarreta, blindaje de 100 km comarcal y sonometría estricta por debajo de 75 dB SPL.',
    accentColor: '#10b981',
  },
  {
    id: 'ARTISTAS_ESCENARIO',
    code: 3,
    label: 'Artistas & Escenario',
    roleTag: 'TALENT & RIDERS',
    badge: 'ESPECTÁCULO',
    summary: 'Edwin Agudelo (550 € / 100 km / suelo 350 €), riders, trifásica y 52 provincias.',
    description: 'Gestión de solistas de gala, cumplimiento incondicional de riders técnicos, logística de gira nacional y respeto absoluto al suelo canónico.',
    canonicalRuleIds: [11, 12, 13, 14, 53, 56, 71, 75, 78, 97],
    canonicalInvariants: [
      `Suelo canónico infranqueable Edwin Agudelo: ${formatEur(TARIFA_BASE_SOLISTA_EUR)}`,
      `Tarifa estándar gala con transporte: ${formatEur(TARIFA_ESTANDAR_SOLISTA_EUR)} (${SOLISTA_KM_INCLUIDOS} km incluidos desde Méntrida)`,
      'Rider técnico verificado: toma trifásica 32A CEE / 400V o monofásica dedicada 16A Schuko',
      'Despliegue operativo federal en las 52 provincias españolas',
      'Split retributivo directo: 80% íntegro liquidado al artista vía Stripe Connect',
    ],
    defaultSeedVision: 'Contratar solista de gala garantizando la tarifa canónica oficial (550 € con 100 km / suelo 350 €), rider técnico trifásico verificado y split del 80%.',
    accentColor: '#8b5cf6',
  },
  {
    id: 'PROVEEDORES_CATALOGO',
    code: 4,
    label: 'Proveedores & Catálogo',
    roleTag: 'INFRAESTRUCTURA B2B',
    badge: 'CATÁLOGO 2026',
    summary: 'Ficha 380 campos, luces navideñas (652 refs), alérgenos y fianza 48h.',
    description: 'Homologación técnica y formal de proveedores de infraestructura, elevación transductiva de catálogo y liquidación segura con garantías.',
    canonicalRuleIds: [61, 63, 64, 65, 66, 67, 70, 85],
    canonicalInvariants: [
      'Catálogo oficial 2026 de iluminación monumental: 652 referencias elevadas por esquema Zod',
      'Ficha de homologación exhaustiva de proveedor con 380 campos canónicos tipados',
      'Devolución de fianza Stripe en 48h tras desmontaje e inspección técnica (Regla 85)',
      'Protocolo de alérgenos por silla sincronizado con cocina y sala (Regla 84)',
      'Despacho multimedia condicionado a suscripción SOVEREIGN o CLAIMED',
    ],
    defaultSeedVision: 'Homologar proveedor de infraestructura con ficha de 380 campos, asignación de referencias del catálogo 2026 e inspección de fianza 48h.',
    accentColor: '#38bdf8',
  },
  {
    id: 'B2G_AYUNTAMIENTOS',
    code: 5,
    label: 'B2G & Ayuntamientos',
    roleTag: 'SECTOR PÚBLICO',
    badge: 'LICITACIÓN',
    summary: 'Art. 118 LCSP (< 14.250 €), códigos DIR3, Facturae y RC 1M€.',
    description: 'Contratación menor de festejos populares, memorias técnicas blindadas contra fraccionamiento de contratos y tramitación ágil vía FACe.',
    canonicalRuleIds: [41, 44, 46, 47, 48, 62, 68, 69, 79],
    canonicalInvariants: [
      `Techo preventivo de adjudicación directa: ${formatEur(AJUSTE_PREVENTIVO_B2G_EUR)} + IVA (Art. 118 LCSP)`,
      `Límite legal estricto de contrato menor de servicios: ${formatEur(LIMITE_B2G_LCSP_EUR)}`,
      'Facturación electrónica oficial contra códigos DIR3 a través del punto FACe',
      'Póliza de Responsabilidad Civil de 1.000.000 € y certificados tributarios al día',
      'Memoria técnica y económica lista para Secretaría e Intervención en < 72h',
    ],
    defaultSeedVision: 'Emitir memoria técnica y económica para fiestas patronales con techo preventivo de 14.250 € + IVA, códigos DIR3 para FACe y póliza de RC de 1M€.',
    accentColor: '#eab308',
  },
  {
    id: 'TESORERIA_SPLIT',
    code: 6,
    label: 'Tesorería & Split 80/10/10',
    roleTag: 'FINANZAS & STRIPE',
    badge: 'TESORERÍA',
    summary: 'Split 80/10/10, Stripe Connect, conciliación céntimo entero y VIMUME.',
    description: 'Gestión contable soberana de tesorería, liquidaciones automáticas en céntimos enteros sin desvíos y fondeo de proyectos sociales.',
    canonicalRuleIds: [21, 22, 52, 55, 82, 86, 95, 98],
    canonicalInvariants: [
      `Split Soberano: ${Math.round(SPLIT_SOBERANO.artista * 100)}% Artista / ${Math.round(SPLIT_SOBERANO.earOs * 100)}% EAR OS / ${Math.round(SPLIT_SOBERANO.vimume * 100)}% VIMUME`,
      'Conciliación bancaria al céntimo entero en Stripe Connect Custom (Regla 86)',
      'Propinas digitales 100% íntegras al personal de sala sin retención de plataforma (Regla 82)',
      'Fondo VIMUME para terapia neurológica 40 Hz con supervisión HITL estricta',
      'Liquidación de fianzas con retención justificada únicamente mediante parte técnico firmado',
    ],
    defaultSeedVision: 'Conciliar tesorería con split soberano 80/10/10 en Stripe Connect, validación de céntimo entero y liquidación de propinas directas de sala.',
    accentColor: '#06b6d4',
  },
  {
    id: 'LOGISTICA_FLEET',
    code: 7,
    label: 'Logística & Flota',
    roleTag: 'OPERACIONES & FLOTA',
    badge: 'LOGÍSTICA',
    summary: 'Hojas de ruta Waybill, inventario Line Array, microfonía y telemetría.',
    description: 'Coordinación táctica de furgones técnicos, control de inventario de sonido e iluminación, horarios de carga y montaje con margen de seguridad.',
    canonicalRuleIds: [42, 43, 65, 66, 71, 76, 89],
    canonicalInvariants: [
      'Sistema de sonorización Line Array 18.000W RMS para aforos de hasta 5.000 personas',
      'Hojas de ruta digitales Waybill con manifiesto de carga y precintos QR',
      'Control de microfonía inalámbrica UHF con barrido de frecuencias libres de interferencias',
      'Telemetría GPS en tiempo real de flota con cálculo de rutas de baja emisión',
      'Protocolo de descarga, montaje y sonometría previa 3h antes de apertura de puertas',
    ],
    defaultSeedVision: 'Emitir hoja de ruta Waybill para transporte de Line Array 18.000W RMS, microfonía UHF y calibración acústica 3 horas previas al evento.',
    accentColor: '#f97316',
  },
  {
    id: 'GOBERNANZA_SRE',
    code: 8,
    label: 'Gobernanza & SRE',
    roleTag: 'SYSTEM ARCHITECTURE',
    badge: 'SENTINEL SSOT',
    summary: 'Centinela SSOT (cefa76c2...), arnés de 22 compuertas, Blast Radius AST.',
    description: 'Custodia constitucional del repositorio, verificación mecánica reproducible, radio de impacto transitivo y cero deuda técnica.',
    canonicalRuleIds: [2, 3, 4, 10, 50, 93, 94, 96, 99, 100],
    canonicalInvariants: [
      `Hash Centinela SSOT inmutable: ${SENTINEL_HASH_SSOT}`,
      'Arnés mecánico bloqueante: 22/22 compuertas obligatorias en prepush (Exit 0)',
      'Grafo de Introspección AST con 743 nodos y 544 aristas en tiempo real',
      'Cálculo de Blast-Radius transitivo en < 50ms antes de mutaciones de catálogo',
      'Doctrina Nivel 5 SDD: Cero código estocástico ("Vibe Coding") en producción',
    ],
    defaultSeedVision: 'Ejecutar auditoría de gobernanza SRE validando el sello Centinela SSOT, el grafo de 743 nodos AST y el arnés de 22 compuertas con Exit 0.',
    accentColor: '#ec4899',
  },
]);

export function getCeoDimension(id: CeoOperationalDimensionId): CeoOperationalDimension {
  const found = CEO_OPERATIONAL_DIMENSIONS.find((dim) => dim.id === id);
  if (!found) {
    return CEO_OPERATIONAL_DIMENSIONS[0];
  }
  return found;
}
