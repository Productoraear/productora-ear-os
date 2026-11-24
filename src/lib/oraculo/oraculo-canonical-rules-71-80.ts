/**
 * ════════════════════════════════════════════════════════════════════════════
 * REGLAS COGNITIVAS CANÓNICAS DEL ORÁCULO CEO (REGLAS 71 A 80) · EAR OS S-CLASS
 * ════════════════════════════════════════════════════════════════════════════
 * BLOQUE 8: Seguridad Operativa, Cumplimiento Normativo & Arbitraje Soberano.
 *
 * Consolida las 10 directivas selladas por el Director Generalista / CEO:
 *   - Regla 71: Rider eléctrico (32A/63A trifásica) y grupo electrógeno auxiliar.
 *   - Regla 72: Plan de lluvia dual: reubicación o suspensión por seguridad eléctrica.
 *   - Regla 73: Cumplimiento Ley 37/2003 (< 75 dB SPL) y sonometría preventiva.
 *   - Regla 74: Gestión de alérgenos (Otzarreta 0,00 € recargo celíacos).
 *   - Regla 75: Montaje concluido 2h antes y soundcheck silencioso in-ear.
 *   - Regla 76: Streaming con enlace redundante (Bonding 4G/5G / Starlink) + backup 4K.
 *   - Regla 77: Cánones de propiedad intelectual (SGAE/AGEDI) a cargo del organizador.
 *   - Regla 78: Horas extra por bloques de 60 min con firma presencial previa.
 *   - Regla 79: Póliza de RC (600.000 € / 1.200.000 €) anexada de serie.
 *   - Regla 80: Arbitraje soberano: retención 24-48h y mediación directa del CEO.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { type OraculoCanonicalRule } from './oraculo-canonical-rules-1-50';

export interface OraculoCanonicalRuleBloque8 {
  readonly id: number;
  readonly block: 8;
  readonly blockTitle: string;
  readonly title: string;
  readonly directive: string;
  readonly rationale: string;
  readonly invariantRef: string | null;
}

export const ORACULO_RULES_BLOQUE_8: readonly OraculoCanonicalRuleBloque8[] = Object.freeze([
  {
    id: 71,
    block: 8,
    blockTitle: 'Seguridad Operativa, Cumplimiento Normativo & Arbitraje Soberano',
    title: 'Rider Eléctrico & Suministro Trifásico Homologado',
    directive:
      'El suministro eléctrico adecuado (acometida CETAC 32A/63A trifásica con toma de tierra verificada) es responsabilidad exclusiva del contratante o del recinto; en su defecto, Productora EAR provee de forma opcional grupo electrógeno insonorizado homologado con cuadro de distribución regulado.',
    rationale:
      'Garantiza la estabilidad de etapas de potencia, cabezas móviles y sistemas de vídeo LED, impidiendo cortes imprevistos y protegiendo el equipamiento contra fluctuaciones de tensión.',
    invariantRef: 'src/lib/constants/ear-os-ssot.ts:POTENCIA_MINIMA_KW',
  },
  {
    id: 72,
    block: 8,
    blockTitle: 'Seguridad Operativa, Cumplimiento Normativo & Arbitraje Soberano',
    title: 'Protocolo Dual de Plan de Lluvia & Climatología Adversa',
    directive:
      'Ante inclemencias meteorológicas o lluvia, se activa de inmediato el protocolo dual: reubicación obligatoria del espectáculo en espacio cubierto/carpa estanca previamente acordada, o suspensión técnica justificada por riesgo de electrocución según normativa de baja tensión sin penalización para el equipo.',
    rationale:
      'La integridad física de los artistas, técnicos e invitados prevalece sobre cualquier exigencia escénica; elimina ambigüedades contractuales ante fenómenos meteorológicos.',
    invariantRef: 'docs/01_ARQUITECTURA_SCLASS/PLAN_DE_LLUVIA_CANONICO.md',
  },
  {
    id: 73,
    block: 8,
    blockTitle: 'Seguridad Operativa, Cumplimiento Normativo & Arbitraje Soberano',
    title: 'Cumplimiento Estricto Ley del Ruido & Sonometría Preventiva',
    directive:
      'Todo evento se dimensiona bajo la ratio de 10-12 W/pax y se calibra estrictamente por debajo de los 75 dB SPL ponderados conforme a la Ley 37/2003 del Ruido; se aplica monitorización sonométrica en tiempo real y queda prohibida cualquier promesa de inmunidad legal o elusión de sonómetros municipales.',
    rationale:
      'Protege la licencia municipal de la finca o recinto y blinda jurídicamente al cliente contra denuncias vecinales o paralizaciones policiales in situ.',
    invariantRef: 'ear-os-ssot.ts:LIMITE_SPL_DB',
  },
  {
    id: 74,
    block: 8,
    blockTitle: 'Seguridad Operativa, Cumplimiento Normativo & Arbitraje Soberano',
    title: 'Gestión Canónica de Alérgenos & 0 € Suplemento Celíacos',
    directive:
      'La gestión de menús especiales y alérgenos se rige por la ficha técnica del catering homologado; en el Paciente Cero (Restaurante Otzarreta), los platos adaptados para celíacos, vegetarianos e intolerancias graves se liquidan estrictamente con 0,00 € de sobrecoste.',
    rationale:
      'La hospitalidad de gala no penaliza económicamente las condiciones médicas de los comensales; refuerza la percepción de elegancia y transparencia radical.',
    invariantRef: 'src/lib/constants/otzarreta-entity.ts:OTZARRETA_WEDDING_MENUS',
  },
  {
    id: 75,
    block: 8,
    blockTitle: 'Seguridad Operativa, Cumplimiento Normativo & Arbitraje Soberano',
    title: 'Montaje Anticipado 2 Horas & Soundcheck Silencioso',
    directive:
      'La infraestructura técnica, iluminación y cableado deben quedar 100% ensamblados y verificados un mínimo de 2 horas antes de la recepción de invitados; las pruebas de sonido previas al show se ejecutan mediante sistemas in-ear o monitorización silenciosa para no contaminar la atmósfera del cóctel.',
    rationale:
      'Garantiza que los anfitriones y sus invitados jamás presencien labores de carga, escaleras o pruebas acústicas estridentes de backstage.',
    invariantRef: 'docs/01_ARQUITECTURA_SCLASS/CHECKLIST_MONTAJE_GALA.md',
  },
  {
    id: 76,
    block: 8,
    blockTitle: 'Seguridad Operativa, Cumplimiento Normativo & Arbitraje Soberano',
    title: 'Streaming de Alta Disponibilidad con Enlace Redundante & Backup 4K',
    directive:
      'Toda retransmisión en directo (streaming de enlaces nupciales o plenos municipales) debe operar con conexión redundante agregada (Bonding de múltiples SIMs 4G/5G y Starlink de respaldo) junto con grabación simultánea en disco o tarjetas master a 4K 60fps.',
    rationale:
      'Elimina el punto único de fallo en transmisiones corporativas o familiares críticas donde la conectividad local de la finca o recinto sea inestable.',
    invariantRef: 'src/lib/providers/sovereign-lead-gate.ts:STREAMING_REDUNDANTE',
  },
  {
    id: 77,
    block: 8,
    blockTitle: 'Seguridad Operativa, Cumplimiento Normativo & Arbitraje Soberano',
    title: 'Responsabilidad de Cánones de Autor (SGAE / AGEDI)',
    directive:
      'El abono de licencias y cánones de comunicación pública por derechos de autor (SGAE, AGEDI, AIE) corresponde exclusivamente al promotor, contratante o establecimiento organizador del acto; Productora EAR facilita con antelación la hoja de repertorio oficial con los títulos y códigos correspondientes.',
    rationale:
      'Deslinda con precisión jurídica la responsabilidad tributaria y de propiedad intelectual, evitando retenciones o reclamaciones posteriores dirigidas al elenco artístico.',
    invariantRef: 'docs/02_CONTRATOS/CLAUSULADO_PROPIEDAD_INTELECTUAL.md',
  },
  {
    id: 78,
    block: 8,
    blockTitle: 'Seguridad Operativa, Cumplimiento Normativo & Arbitraje Soberano',
    title: 'Horas Extra Tarificadas por Bloques de 60 Minutos con Firma In Situ',
    directive:
      'Toda extensión horaria sobre el horario pactado en contrato se liquida por tramos indivisibles de 60 minutos según tarifa canónica vigente, requiriendo la firma presencial o confirmación digital fehaciente del contratante antes de iniciar la prórroga de la actuación.',
    rationale:
      'Erradica disputas en la liquidación final y garantiza que los técnicos, DJs y músicos sean remunerados inmediatamente por la ampliación de su jornada.',
    invariantRef: 'ear-os-ssot.ts:TARIFA_HORA_EXTRA_EUR',
  },
  {
    id: 79,
    block: 8,
    blockTitle: 'Seguridad Operativa, Cumplimiento Normativo & Arbitraje Soberano',
    title: 'Blindaje con Póliza de Responsabilidad Civil (600.000 € / 1.200.000 €)',
    directive:
      'Toda operativa de montaje, sonido, iluminación monumental y estructuras 3D transita amparada por Póliza de Responsabilidad Civil con cobertura de 600.000 € (estándar) ampliable a 1.200.000 € en grandes licitaciones B2G, con certificado nominativo emitido por aseguradora de primer orden anexado de serie.',
    rationale:
      'Aporta tranquilidad institucional a interventores municipales, directores de hoteles y parejas de novios ante cualquier contingencia accidental.',
    invariantRef: 'src/features/catalog/ui/ChristmasLightingCatalogView.tsx:POLIZA_RC',
  },
  {
    id: 80,
    block: 8,
    blockTitle: 'Seguridad Operativa, Cumplimiento Normativo & Arbitraje Soberano',
    title: 'Arbitraje Soberano: Custodia de Liquidación & Mediación CEO',
    directive:
      'Ante cualquier discrepancia en la prestación del servicio, se activa una custodia temporal de la liquidación final (retención de 24 a 48 horas tras el evento hasta validar la conformidad de ambas partes) con mediación directa del Director Generalista / CEO (+34 693 693 048) antes de cualquier vía contenciosa.',
    rationale:
      'Desactiva el 99% de los conflictos mediante una solución ejecutiva ágil, justa y comercialmente impecable que salvaguarda la reputación del ecosistema Productora EAR.',
    invariantRef: 'ear-os-ssot.ts:TELEFONO_CENTRALITA',
  },
]);
