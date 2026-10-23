/**
 * 🛰️ OMEGA FLEET — Registro unificado de TODA la flota de agentes (0 huérfanos).
 * ----------------------------------------------------------------------------
 * `createOmegaFleet()` registra un handler para cada `AgentId` de las 6
 * divisiones. `OMEGA_FLEET_ROSTER` es el censo canónico consumido por las
 * rutas /api/agents (dispatch/status) y por la consola del panel.
 */
import { AgentBus } from './agentBus';
import type { AgentId } from './agentBus';
import { createEarBus } from './sectorAgents';
import { registerCommercialDivision } from './commercialAgents';
import { registerTechnicalDivision } from './technicalAgents';
import { registerLegalFinancialDivision } from './legalFinancialAgents';
import { registerVimumeDivision } from './vimumeAgents';
import { registerArtistCareerDivision } from './artistCareerAgents';

export interface FleetSpec {
  readonly id: AgentId;
  readonly division: string;
  readonly sector: string;
  readonly description: string;
}

export const OMEGA_DIVISION_COUNT: number = 6;

export const OMEGA_FLEET_ROSTER: readonly FleetSpec[] = [
  // ── División 1 · Comercial ──
  { id: 'voice-concierge', division: 'Comercial', sector: 'Comercial', description: 'Atención vocal y triaje de consultas entrantes.' },
  { id: 'lead-intake-dispatcher', division: 'Comercial', sector: 'Comercial', description: 'Enrutamiento y calificación de leads hacia CRM/n8n.' },
  { id: 'sales-closer', division: 'Comercial', sector: 'Comercial', description: 'Cierre de reservas con depósito Stripe 100 €.' },
  { id: 'logistics-pricer', division: 'Comercial', sector: 'Comercial', description: 'Cálculo SSOT de tarifas, kilometraje y hotel.' },
  { id: 'retention-reactivator', division: 'Comercial', sector: 'Comercial', description: 'Reactivación de clientes con descuento fidelidad.' },
  { id: 'finca-negotiator', division: 'Comercial', sector: 'Comercial', description: 'Negociación de alianzas con recintos homologados.' },
  { id: 'cross-sell-orchestrator', division: 'Comercial', sector: 'Comercial', description: 'Detección de ventas cruzadas sobre servicios base.' },
  { id: 'vip-concierge-escalation', division: 'Comercial', sector: 'Comercial', description: 'Escalado VIP de máxima prioridad a guardia humana.' },
  // ── División 2 · Técnica ──
  { id: 'acoustic-rider-guard', division: 'Técnica', sector: 'Técnica', description: 'Validación acústica Ley 37/2003 y limitador telemático.' },
  { id: 'equipment-allocator', division: 'Técnica', sector: 'Técnica', description: 'Asignación de tier de sonido según potencia.' },
  { id: 'convoy-telemetry-sentinel', division: 'Técnica', sector: 'Técnica', description: 'Telemetría de desplazamiento del convoy.' },
  { id: 'soundcheck-auditor', division: 'Técnica', sector: 'Técnica', description: 'Planificación de pruebas de sonido.' },
  { id: 'procurement-inventory', division: 'Técnica', sector: 'Técnica', description: 'Dimensionado de inventario técnico.' },
  { id: 'subcontract-dispatcher', division: 'Técnica', sector: 'Técnica', description: 'Subcontratación de técnicos extra.' },
  { id: 'route-optimizer', division: 'Técnica', sector: 'Técnica', description: 'Optimización de coste de ruta y hotel.' },
  { id: 'venue-profiler', division: 'Técnica', sector: 'Técnica', description: 'Perfil acústico y de capacidad del recinto.' },
  // ── División 3 · Jurídica/B2G/Financiera ──
  { id: 'smart-contract-engine', division: 'Jurídica/B2G/Financiera', sector: 'Jurídica', description: 'Contratos inteligentes con sello SHA-256.' },
  { id: 'b2g-tender-hunter', division: 'Jurídica/B2G/Financiera', sector: 'Jurídica', description: 'Vigilancia de licitaciones menores Art. 118 LCSP.' },
  { id: 'b2g-pliego-compiler', division: 'Jurídica/B2G/Financiera', sector: 'Jurídica', description: 'Compilación de pliegos con hash de inmutabilidad.' },
  { id: 'split-settlement-dispatcher', division: 'Jurídica/B2G/Financiera', sector: 'Financiera', description: 'Liquidación del Split Soberano 80/10/10.' },
  { id: 'modelo-182-tax-shield', division: 'Jurídica/B2G/Financiera', sector: 'Financiera', description: 'Escudo fiscal Ley 49/2002 (Modelo 182).' },
  { id: 'invoice-treasury-agent', division: 'Jurídica/B2G/Financiera', sector: 'Financiera', description: 'Tesorería y estado de cobro con IVA.' },
  { id: 'vendor-compliance-auditor', division: 'Jurídica/B2G/Financiera', sector: 'Jurídica', description: 'Auditoría de datos verificados del proveedor.' },
  { id: 'dispute-escrow-arbitrator', division: 'Jurídica/B2G/Financiera', sector: 'Jurídica', description: 'Arbitraje neutral de fondos en escrow.' },
  // ── División 4 · VIMUME/B2B ──
  { id: 'vimume-protocol-sentinel', division: 'VIMUME/B2B', sector: 'Sanitaria', description: 'Vigilancia del protocolo 40 Hz y límite clínico.' },
  { id: 'clinical-report-generator', division: 'VIMUME/B2B', sector: 'Sanitaria', description: 'Reportes clínicos con SROI y deducción fiscal.' },
  { id: 'dental-clinic-coordinator', division: 'VIMUME/B2B', sector: 'Sanitaria', description: 'Coordinación con clínicas dentales.' },
  { id: 'veterinary-care-agent', division: 'VIMUME/B2B', sector: 'Sanitaria', description: 'Protocolo calmante veterinario.' },
  { id: 'hospitality-table-agent', division: 'VIMUME/B2B', sector: 'B2B', description: 'Servicio hospitality de gala.' },
  { id: 'real-estate-event-liaison', division: 'VIMUME/B2B', sector: 'B2B', description: 'Liaison inmobiliario con show premium.' },
  { id: 'corporate-experience-agent', division: 'VIMUME/B2B', sector: 'B2B', description: 'Experiencias corporativas.' },
  { id: 'omni-supervisor-daemon', division: 'VIMUME/B2B', sector: 'Supervisión', description: 'Enrutador central de intenciones.' },
  // ── División 5 · Sector ──
  { id: 'lead-intake', division: 'Sector', sector: 'Comercial', description: 'Ingesta y sincronización de leads con n8n.' },
  { id: 'acoustic-rider', division: 'Sector', sector: 'Técnica', description: 'Rider acústico por contexto.' },
  { id: 'b2g-compliance', division: 'Sector', sector: 'Jurídica', description: 'Auditoría de contratos menores.' },
  { id: 'vimume-impact', division: 'Sector', sector: 'Sanitaria', description: 'Estimación clínica y deducción Ley 49/2002.' },
  { id: 'escalation', division: 'Sector', sector: 'Supervisión', description: 'Despacho a guardia humana.' },
  { id: 'supervisor', division: 'Sector', sector: 'Supervisión', description: 'Orquestador de flujo.' },
  // ── División 6 · Artist Career Management ──
  { id: 'artist-career-manager', division: 'Artist Career', sector: 'Management 360°', description: 'Gestión 360° de carreras (flagship multinacional).' },
  { id: 'artist-scout', division: 'Artist Career', sector: 'A&R', description: 'Clasificación de etapa y decisión de firma.' },
  { id: 'artist-development', division: 'Artist Career', sector: 'Desarrollo', description: 'Coaching vocal/imagen/marca.' },
  { id: 'release-strategist', division: 'Artist Career', sector: 'Distribución', description: 'Release con ISRC/UPC y validación DSP.' },
  { id: 'tour-architect', division: 'Artist Career', sector: 'Touring', description: 'Planificación de giras.' },
  { id: 'brand-partnership-director', division: 'Artist Career', sector: 'Brand', description: 'Campañas de marca y endorsements.' },
  { id: 'catalog-publishing-director', division: 'Artist Career', sector: 'Catálogo', description: 'Regalías de catálogo y publishing.' },
  { id: 'sync-licensing-agent', division: 'Artist Career', sector: 'Sync', description: 'Licencias de sincronización.' },
  { id: 'fanbase-growth-agent', division: 'Artist Career', sector: 'Marketing', description: 'Crecimiento digital de audiencia.' },
  { id: 'business-affairs-agent', division: 'Artist Career', sector: 'Legal', description: 'Comisión, anticipo y estructura legal.' },
];

export function createOmegaFleet(): AgentBus {
  const bus = createEarBus();
  registerCommercialDivision(bus);
  registerTechnicalDivision(bus);
  registerLegalFinancialDivision(bus);
  registerVimumeDivision(bus);
  registerArtistCareerDivision(bus);
  return bus;
}
