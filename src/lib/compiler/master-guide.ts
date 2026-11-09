/**
 * ════════════════════════════════════════════════════════════════════════════
 * GUÍA MAESTRA DEL COMPILADOR DE INTENCIÓN — SSOT EJECUTABLE (S-CLASS)
 * ════════════════════════════════════════════════════════════════════════════
 * Gobernanza autónoma para el CEO:
 *  · Eje 1: OBJETIVOS DE NEGOCIO (4)
 *  · Eje 2: TÁCTICAS COMERCIALES (4)
 *  · Eje 3: DESTINATARIOS DE EJECUCIÓN (3)
 *  · Eje 4: DOMINIOS / UNIDADES DE NEGOCIO AISLADAS (4)
 *  · Eje 5: PERFILES DE CLIENTE / STAKEHOLDER (6)
 *  · Eje 6: PLANTILLAS EJECUTIVAS DE 1 CLIC (8) + AUDITOR PRE-VUELO
 *
 * Reglas duras:
 *  · Cero `any`, cero dependencias externas, cero efectos secundarios al importar.
 *  · Todo importe nace del SSOT canónico (`ear-os-ssot.ts`): 0 precios
 *    hardcodeados fuera de Zona Cero (INV-10).
 *  · Cero marcas de terceros ni anglicismos en los rótulos visibles (JUR-4).
 *  · Import RELATIVO al SSOT a propósito: lo resuelven igual el bundler de Next
 *    y `scripts/verify_master_guide.ts` ejecutado con tsx.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  DEPOSITO_STRIPE_EUR,
  SAFE_LCSP_CEILING_EUR,
  TARIFA_BASE_SOLISTA_EUR,
} from '../constants/ear-os-ssot';

/** Formato monetario español sin depender de Intl en el servidor. */
function formatEur(amount: number): string {
  return `${amount.toFixed(2).replace('.', ',')} €`;
}

export const MASTER_OBJECTIVE_IDS = ['VENTAS', 'FINCAS', 'B2G', 'ARQUITECTURA'] as const;
export type MasterObjectiveId = (typeof MASTER_OBJECTIVE_IDS)[number];

export const MASTER_TACTIC_IDS = [
  'SOBREDEMANDA',
  'VENTA_ELEGANTE',
  'MIDAS_SPLIT',
  'CAMALEON_GEO',
] as const;
export type MasterTacticId = (typeof MASTER_TACTIC_IDS)[number];

export const MASTER_TARGET_IDS = ['CLINE', 'N8N', 'WHATSAPP'] as const;
export type MasterTargetAgentId = (typeof MASTER_TARGET_IDS)[number];

export const MASTER_DOMAIN_IDS = [
  'FINCAS_BODA',
  'VIMUME_SENIOR',
  'ARTISTAS_EUROPA',
  'PRODUCTORA_EAR',
] as const;
export type MasterDomainId = (typeof MASTER_DOMAIN_IDS)[number];

export const MASTER_STAKEHOLDER_IDS = [
  'PAREJA_CLIENTE',
  'DUENO_FINCA',
  'ARTISTA_PROVEEDOR',
  'AYUNTAMIENTO_B2G',
  'DIRECCION_SENIOR',
  'CEO_INTERNO',
  'NOVIOS_PRESUPUESTO_AJUSTADO',
  'WEDDING_PLANNER_AGENCIA',
  'DIRECTOR_RRHH_CORPORATIVO',
  'COMISION_FIESTAS_PATRONALES',
] as const;
export type MasterStakeholderId = (typeof MASTER_STAKEHOLDER_IDS)[number];

/** De dónde salió cada eje: declarado por el cliente, deducido del texto o defecto. */
export type GuideSource = 'declarado' | 'deducido' | 'defecto';

export interface MasterGuideOption<Id extends string> {
  readonly id: Id;
  /** Rótulo visible, en español y con emoji de dominio. */
  readonly label: string;
  /** Una línea de dolor/beneficio para el CEO. */
  readonly hint: string;
  /** Órdenes no negociables que se inyectan en el macro-script del grafo. */
  readonly directives: readonly string[];
  /** Alias normalizados (sin acentos, minúsculas) para deducir el eje del texto libre. */
  readonly aliases: readonly string[];
}

export type MasterObjective = MasterGuideOption<MasterObjectiveId>;
export type MasterTactic = MasterGuideOption<MasterTacticId>;

export interface MasterDomainOption extends MasterGuideOption<MasterDomainId> {
  readonly hostname: string;
}

export type MasterStakeholderOption = MasterGuideOption<MasterStakeholderId>;

/**
 * EJE 1 · OBJETIVO DE NEGOCIO. Orden = prioridad comercial real.
 */
export const MASTER_OBJECTIVES: readonly MasterObjective[] = [
  {
    id: 'VENTAS',
    label: '💰 Ventas & Depósito',
    hint: 'Cierre con fianza deducible',
    directives: [
      'Medir el embudo completo: visita → conserjería → depósito → contrato.',
      'Cada botón escribe de verdad: 0 clics muertos en la ruta que cobra (INV-09).',
      `El depósito de ${formatEur(DEPOSITO_STRIPE_EUR)} aparece explícito y deducible en el cierre.`,
    ],
    aliases: ['venta', 'ventas', 'comercial', 'cobro', 'facturacion', 'captacion', 'conversion', 'escaparate', 'deposito'],
  },
  {
    id: 'FINCAS',
    label: '🏰 Fincas, Sedes & Bodas',
    hint: 'Alianza con el espacio',
    directives: [
      'La ficha del espacio publica solo datos verificables: aforo, servicios y contacto real.',
      'Toda alianza se formaliza con condiciones escritas antes de publicar la ficha.',
      'El certificado acústico se entrega antes del evento, no después de una queja.',
    ],
    aliases: ['finca', 'fincas', 'boda', 'bodas', 'casamiento', 'salon', 'hosteleria', 'restaurante', 'catering', 'espacio', 'sede'],
  },
  {
    id: 'B2G',
    label: '🏛️ B2G & Ayuntamientos',
    hint: 'Contrato menor art. 118 LCSP',
    directives: [
      `Ningún importe supera el techo preventivo de ${formatEur(SAFE_LCSP_CEILING_EUR)} (art. 118 LCSP).`,
      'Facturación electrónica y códigos DIR3 identificados antes de presentar la oferta.',
      'Plazos y documentación se citan desde la fuente oficial, nunca de memoria.',
    ],
    aliases: ['b2g', 'ayuntamiento', 'lcsp', 'licitacion', 'contrato menor', 'face', 'dir3', 'subvencion', 'concejal'],
  },
  {
    id: 'ARQUITECTURA',
    label: '⚡ Código & Verdad Técnica',
    hint: 'Cero fachadas · Exit Code 0',
    directives: [
      'Cero fachadas: si un dato no se ha sondeado, se declara SIN_EVIDENCIA (AF-5).',
      'typecheck y lint con Exit Code 0; 0 any implícito en el diff (G-1/G-2).',
      'Toda ruta nueva nace cerrada y con su caso negativo probado (SEC-1).',
    ],
    aliases: ['arquitectura', 'refactor', 'deuda tecnica', 'infraestructura', 'typecheck', 'lint', 'seguridad', 'rendimiento', 'fachada', 'backend'],
  },
];

/**
 * EJE 2 · TÁCTICA COMERCIAL.
 */
export const MASTER_TACTICS: readonly MasterTactic[] = [
  {
    id: 'SOBREDEMANDA',
    label: '🔥 Sobredemanda',
    hint: 'Exclusividad y escasez real',
    directives: [
      'Elevar el valor percibido antes de nombrar el precio: prueba social verificable y aforo declarado.',
      'Una sola llamada a la acción por pantalla, siempre hacia el depósito deducible del SSOT.',
      'La escasez debe ser real (fecha bloqueada en el calendario atómico), nunca un contador simulado.',
      `Prohibido el descuento como argumento: se añade repertorio o logística, no se rebaja la tarifa base de ${formatEur(TARIFA_BASE_SOLISTA_EUR)}.`,
    ],
    aliases: ['sobredemanda', 'lista de espera', 'exclusividad', 'escasez', 'demanda'],
  },
  {
    id: 'VENTA_ELEGANTE',
    label: '✨ Venta Elegante',
    hint: 'Diagnóstico y transparencia',
    directives: [
      'Diagnóstico primero: fecha, espacio, aforo y hora de fin antes de dar cualquier cifra.',
      'Tono de asesor, no de vendedor: cero superlativos absolutos ni promesas sin fuente (JUR-1).',
      'Cada objeción se responde con un dato verificable y su enlace de prueba.',
      'El canal humano se ofrece cuando el usuario pide hablar, nunca como presión.',
    ],
    aliases: ['venta elegante', 'elegante', 'diagnostico', 'asesoria', 'transparencia', 'alivio'],
  },
  {
    id: 'MIDAS_SPLIT',
    label: '🛡️ Midas · Reparto 80/10/10',
    hint: 'Margen y dividendo social',
    directives: [
      'Toda cifra monetaria nace de ear-os-ssot.ts; 0 precios hardcodeados en componentes (INV-10).',
      'El reparto 80/10/10 se calcula en el servidor y se muestra desglosado en euros.',
      'Cualquier descuento exige contrapartida equivalente por escrito; nunca se regala margen.',
      'Logística y suplementos se derivan de las constantes del SSOT, jamás de un cálculo paralelo.',
    ],
    aliases: ['midas', 'margen', 'rentabilidad', 'reparto', 'split', '80/10/10', 'comision', 'dividendo'],
  },
  {
    id: 'CAMALEON_GEO',
    label: '🎯 Camaleón Territorial',
    hint: 'Contenido único por localidad',
    directives: [
      'Cada página declara municipio, provincia y distancia real al hub logístico.',
      'Contenido único por localidad: similitud de 5-grama ≤ 0,10 frente al resto del sitio.',
      'Datos estructurados de schema.org con área servida real, sin ubicaciones inventadas.',
      'Una intención de búsqueda por URL: prohibida la canibalización entre páginas.',
    ],
    aliases: ['camaleon', 'territorial', 'localidad', 'municipio', 'provincia', 'barrio', 'geolocaliz', 'seo local'],
  },
];

/** EJE 3 · DESTINATARIO: a quién se le entrega el grafo y con qué entregable. */
export interface MasterTargetAgent extends MasterGuideOption<MasterTargetAgentId> {
  /** Entregable verificable que debe existir al final de la cadena. */
  readonly deliverable: string;
}

export const MASTER_TARGETS: readonly MasterTargetAgent[] = [
  {
    id: 'CLINE',
    label: '🤖 Agente Local',
    hint: 'Tarea en cola verificable',
    directives: [
      'La orden se encola en la cola del orquestador con scaffold y criterio de cierre ejecutable.',
      'El agente no interpreta: recibe rutas exactas, firmas y el comando que debe devolver Exit 0.',
    ],
    aliases: ['cline', 'obrero', 'agente local', 'tarea en cola'],
    deliverable: 'Tarea encolada con scaffold, criterio de cierre y verificación ejecutable.',
  },
  {
    id: 'N8N',
    label: '⚡ Automatización n8n',
    hint: 'Webhook idempotente',
    directives: [
      'El webhook es idempotente: varios reintentos con la misma referencia producen una sola fila (INV-08).',
      'La cola muerta queda visible y con alerta; el fallo nunca se silencia.',
    ],
    aliases: ['n8n', 'webhook', 'automatizacion', 'automatizar'],
    deliverable: 'Webhook idempotente con reintento y cola muerta visible.',
  },
  {
    id: 'WHATSAPP',
    label: '💬 Conserjería WhatsApp',
    hint: 'Cierre humano directo',
    directives: [
      'El mensaje lleva contexto suficiente para responder sin preguntar dos veces.',
      'Prohibido incluir datos personales en registros, URLs o parámetros (INV-14).',
    ],
    aliases: ['whatsapp', 'conserjeria', 'cierre directo', 'llamada'],
    deliverable: 'Mensaje a la conserjería con contexto y sin datos personales en registros.',
  },
];

/**
 * EJE 4 · UNIDAD DE NEGOCIO / DOMINIO AISLADO (4 webs sobre 1 SSOT).
 */
export const MASTER_DOMAINS: readonly MasterDomainOption[] = [
  {
    id: 'FINCAS_BODA',
    hostname: 'fincasparaboda.com',
    label: '💍 FincasParaBoda.com',
    hint: 'Escaparate nupcial 0% fuga + 100 Fundadores',
    directives: [
      'Escaparate exclusivo sin publicidad de espacios competidores dentro de la ficha.',
      'Pacto de los 100 Fundadores: igualación de cuota previa verificada con tarifa vitalicia.',
    ],
    aliases: ['fincasparaboda', 'portal nupcial', 'fundadores', 'banquete', 'caserio'],
  },
  {
    id: 'ARTISTAS_EUROPA',
    hostname: 'artistaseuropa.com',
    label: '🎸 ArtistasEuropa.com',
    hint: 'Panel 360 del artista + Despacho inmediato',
    directives: [
      'Ficha 360 del artista con tarifas propias por formato, distribución digital ISRC y telemetría.',
      'Despacho geográfico inmediato con bloqueo atómico y liquidación transparente 80/10/10.',
    ],
    aliases: ['artistaseuropa', 'musico', 'solista', 'banda', 'isrc', 'repertorio'],
  },
  {
    id: 'VIMUME_SENIOR',
    hostname: 'viajemusicalporlamemoria.com',
    label: '🧠 ViajeMusicalPorLaMemoria.com',
    hint: 'Impacto Senior 40 Hz + B2G + Ley 49/2002',
    directives: [
      'Protocolo acústico 40 Hz no invasivo (< 75 dB SPL) para centros de mayores.',
      'Triple vía de ingreso: contrato menor B2G, mecenazgo fiscal Ley 49/2002 y cuota privada.',
    ],
    aliases: ['viajemusicalporlamemoria', 'vimume', 'mayores', 'residencia', '40 hz', 'mecenazgo'],
  },
  {
    id: 'PRODUCTORA_EAR',
    hostname: 'productoraear.com',
    label: '🏛️ ProductoraEAR.com',
    hint: 'Matriz corporativa & Centro de Mando',
    directives: [
      'Cabecera institucional del ecosistema, eventos corporativos y control centralizado.',
      'Cortafuegos operativo: una incidencia en otra vertical jamás detiene la matriz.',
    ],
    aliases: ['productoraear', 'matriz', 'corporativo', 'cockpit', 'ecosistema'],
  },
];

/**
 * EJE 5 · STAKEHOLDER / PERFIL DE CLIENTE OBJETIVO.
 */
export const MASTER_STAKEHOLDERS: readonly MasterStakeholderOption[] = [
  {
    id: 'PAREJA_CLIENTE',
    label: '💑 Pareja / Contratante',
    hint: 'Certeza de fecha y presupuesto al céntimo',
    directives: [
      'Resolver el miedo a cancelaciones y sobrecostes ocultos en menos de 60 segundos.',
      `Ofrecer bloqueo inmediato de fecha con fianza deducible de ${formatEur(DEPOSITO_STRIPE_EUR)}.`,
    ],
    aliases: ['pareja', 'novios', 'cliente final', 'contratante', 'invitados'],
  },
  {
    id: 'DUENO_FINCA',
    label: '🏰 Dueño de Finca / Restaurante',
    hint: 'Cero fuga a rivales y control acústico',
    directives: [
      'Demostrar con telemetría real las visitas, simulaciones de menú y solicitudes de ruta.',
      'Garantizar el cumplimiento acústico Ley 37/2003 a cambio de recomendación preferente.',
    ],
    aliases: ['dueno', 'propietario', 'eduardo', 'gerente finca', 'director espacio'],
  },
  {
    id: 'ARTISTA_PROVEEDOR',
    label: '🎤 Artista / Proveedor S-Class',
    hint: '80% íntegro, caché respetado y panel 360',
    directives: [
      'Respetar las condiciones individuales de su ficha, km exentos y suplementos.',
      'Entregar solo solicitudes filtradas con compromiso real o contacto por conserjería.',
    ],
    aliases: ['artista', 'proveedor', 'fotografo', 'dj', 'interprete'],
  },
  {
    id: 'AYUNTAMIENTO_B2G',
    label: '🏛️ Concejal / Técnico Municipal',
    hint: 'Expediente limpio art. 118 LCSP',
    directives: [
      `Presupuesto cerrado inferior a ${formatEur(SAFE_LCSP_CEILING_EUR)} con memoria justificativa lista.`,
      'Incluir código DIR3, solvencia técnica y limitador telemático homologado.',
    ],
    aliases: ['concejal', 'secretario', 'interventor', 'tecnico municipal', 'diputacion'],
  },
  {
    id: 'DIRECCION_SENIOR',
    label: '🩺 Dirección Centro Senior / RSC',
    hint: 'Bienestar cognitivo y deducción fiscal',
    directives: [
      'Aportar métricas del protocolo 40 Hz y dossier de mecenazgo Ley 49/2002.',
      'Garantizar presión sonora confortable entre 65 y 75 dBA sin fatiga auditiva.',
    ],
    aliases: ['terapeuta', 'geriatria', 'centro de dia', 'fundacion', 'rsc'],
  },
  {
    id: 'CEO_INTERNO',
    label: '👑 CEO / Arquitecto del Sistema',
    hint: 'Verdad técnica, 0 fachadas y máximo retorno',
    directives: [
      'Entregar trazabilidad completa archivo por archivo y comando verificador con Exit Code 0.',
      'Cero métricas de vanidad: si la base de datos no responde, mostrar estado real y causa.',
    ],
    aliases: ['ceo', 'edwin', 'director', 'administrador', 'interno'],
  },
  {
    id: 'NOVIOS_PRESUPUESTO_AJUSTADO',
    label: '💍 Novios · Presupuesto Inteligente',
    hint: 'Match bilateral exacto sin sorpresas ni sobrecostes',
    directives: [
      'Aplicar el Motor Magia Negra (50/15/15/10/10) con tolerancia elástica ±10% para mostrar solo proveedores que encajan en su presupuesto real.',
      'Garantizar el Match Bilateral: nunca enseñar opciones inalcanzables ni generar frustración comercial.',
    ],
    aliases: ['presupuesto ajustado', 'economico', 'barato', 'ahorro', 'jovenes'],
  },
  {
    id: 'WEDDING_PLANNER_AGENCIA',
    label: '📋 Wedding Planner / Coordinadora',
    hint: 'Puntualidad suiza, rider cerrado y 0 incendios',
    directives: [
      'Entregar dossier técnico completo, seguros de RC y teléfonos de guardia 24/7 en un solo enlace.',
      'Respetar la autoría de la organizadora garantizando coordinación silenciosa con el espacio.',
    ],
    aliases: ['wedding planner', 'organizadora', 'coordinadora', 'agencia', 'planner'],
  },
  {
    id: 'DIRECTOR_RRHH_CORPORATIVO',
    label: '🏢 Director RRHH / Evento Corporativo',
    hint: 'Factura limpia, impacto RSC deducible (Ley 49/2002)',
    directives: [
      'Destacar la factura llave en mano y el certificado de mecenazgo social VIMUME (10% del Split) para la memoria ESG de la empresa.',
      'Asegurar montaje audiovisual impecable (pantallas LED, microfonía Shure y sonido Bose).',
    ],
    aliases: ['corporativo', 'empresa', 'rrhh', 'cena de gala', 'congreso', 'incentivo'],
  },
  {
    id: 'COMISION_FIESTAS_PATRONALES',
    label: '🎺 Comisión de Fiestas / Peñas',
    hint: 'Espectáculo de alto impacto sin superar 14.250 €',
    directives: [
      `Estructurar la propuesta de festejos populares por debajo de ${formatEur(SAFE_LCSP_CEILING_EUR)} para adjudicación ágil.`,
      'Garantizar presión sonora de fiesta (90-102 dBA) con limitador homologado según normativa municipal.',
    ],
    aliases: ['comision de fiestas', 'fiestas patronales', 'verbena', 'plaza', 'festejos'],
  },
];

/**
 * EJE 6 · PLANTILLAS EJECUTIVAS DE 1 CLIC (para cuando el CEO trabaja en solitario).
 */
export interface MasterExecutiveTemplate {
  readonly id: string;
  readonly title: string;
  readonly badge: string;
  readonly domain: MasterDomainId;
  readonly stakeholder: MasterStakeholderId;
  readonly objective: MasterObjectiveId;
  readonly tactic: MasterTacticId;
  readonly targetAgent: MasterTargetAgentId;
  readonly promptTemplate: string;
}

export const MASTER_EXECUTIVE_TEMPLATES: readonly MasterExecutiveTemplate[] = [
  {
    id: 'TPL_FUNDADORES_100',
    title: '🏰 Alianza Finca · Pacto 100 Fundadores',
    badge: 'FincasParaBoda.com',
    domain: 'FINCAS_BODA',
    stakeholder: 'DUENO_FINCA',
    objective: 'FINCAS',
    tactic: 'SOBREDEMANDA',
    targetAgent: 'CLINE',
    promptTemplate:
      'Construir o actualizar la propuesta de escaparate exclusivo para propietario de finca en Bizkaia/Madrid: igualar su cuota del portal anterior con tarifa vitalicia de Fundador (top 100), activar simulador de menús 2026 con 0% de fuga a competidores y bloqueo de visita técnica con depósito deducible de 100,00 €.',
  },
  {
    id: 'TPL_ARTISTA_360',
    title: '🎸 Ficha 360 de Artista + Caché Propio',
    badge: 'ArtistasEuropa.com',
    domain: 'ARTISTAS_EUROPA',
    stakeholder: 'ARTISTA_PROVEEDOR',
    objective: 'VENTAS',
    tactic: 'MIDAS_SPLIT',
    targetAgent: 'CLINE',
    promptTemplate:
      'Desplegar panel 360 en la ficha individual del artista con configurador de caché por formato, cálculo automático de desplazamiento (1,50 €/km desde km 50), reproductor multimedia de alta fidelidad, registro ISRC y liquidación 80/10/10 conectada a depósito de 100,00 €.',
  },
  {
    id: 'TPL_B2G_MUNICIPIO',
    title: '🏛️ Pliego Contrato Menor Ayuntamiento',
    badge: 'Art. 118 LCSP',
    domain: 'VIMUME_SENIOR',
    stakeholder: 'AYUNTAMIENTO_B2G',
    objective: 'B2G',
    tactic: 'VENTA_ELEGANTE',
    targetAgent: 'CLINE',
    promptTemplate:
      'Generar expediente técnico y económico de contrato menor para ayuntamiento bajo el techo preventivo de 14.250,00 € (art. 118 LCSP), incluyendo certificación acústica Ley 37/2003 (< 75 dB SPL, 12 W/pax) y memoria de impacto social para mayores.',
  },
  {
    id: 'TPL_VIMUME_MECENAZGO',
    title: '🧠 Programa Senior 40 Hz + Ley 49/2002',
    badge: 'VIMUME',
    domain: 'VIMUME_SENIOR',
    stakeholder: 'DIRECCION_SENIOR',
    objective: 'B2G',
    tactic: 'MIDAS_SPLIT',
    targetAgent: 'N8N',
    promptTemplate:
      'Automatizar el dossier de impacto neuroacústico 40 Hz para residencias de mayores y empresas patrocinadoras, calculando la deducción fiscal de la Ley 49/2002 y disparando el certificado RSC al webhook idempotente.',
  },
  {
    id: 'TPL_PAREJA_CIERRE_24H',
    title: '💑 Cierre de Pareja Indecisa en 24h',
    badge: 'Depósito 100 €',
    domain: 'FINCAS_BODA',
    stakeholder: 'PAREJA_CLIENTE',
    objective: 'VENTAS',
    tactic: 'VENTA_ELEGANTE',
    targetAgent: 'WHATSAPP',
    promptTemplate:
      'Redactar respuesta diagnóstica de alta conversión para pareja que consulta fecha de boda: resolver dudas de repertorio y límite sonoro de su finca, mostrar el desglose transparente desde 350,00 € y facilitar el enlace de bloqueo atómico con 100,00 € deducibles.',
  },
  {
    id: 'TPL_CAMALEON_MUNICIPIOS',
    title: '🎯 Expansión Territorial por Municipio',
    badge: 'SEO Local',
    domain: 'FINCAS_BODA',
    stakeholder: 'PAREJA_CLIENTE',
    objective: 'VENTAS',
    tactic: 'CAMALEON_GEO',
    targetAgent: 'CLINE',
    promptTemplate:
      'Generar páginas territoriales por municipio y provincia con distancia real al hub logístico, datos estructurados schema.org verificados, similitud de 5-grama inferior a 0,10 y simulador adaptado a los proveedores reales de esa zona.',
  },
  {
    id: 'TPL_AUDITORIA_ANTIFACHADA',
    title: '⚡ Barrido Forense Anti-Fachadas P0',
    badge: 'Exit Code 0',
    domain: 'PRODUCTORA_EAR',
    stakeholder: 'CEO_INTERNO',
    objective: 'ARQUITECTURA',
    tactic: 'MIDAS_SPLIT',
    targetAgent: 'CLINE',
    promptTemplate:
      'Ejecutar auditoría forense sobre los módulos menos favorecidos del repositorio: eliminar datos de demostración, conectar cada botón a su endpoint real, verificar 0 tipos any implícitos y sellar con typecheck, lint y las 17 puertas en Exit Code 0.',
  },
  {
    id: 'TPL_AISLAMIENTO_DOMINIOS',
    title: '🛡️ Cortafuegos entre las 4 Verticales',
    badge: 'Multi-Dominio',
    domain: 'PRODUCTORA_EAR',
    stakeholder: 'CEO_INTERNO',
    objective: 'ARQUITECTURA',
    tactic: 'SOBREDEMANDA',
    targetAgent: 'CLINE',
    promptTemplate:
      'Verificar y blindar el enrutamiento independiente de fincasparaboda.com, artistaseuropa.com, viajemusicalporlamemoria.com y productoraear.com para que cada dominio tenga su propio cortafuegos y un mantenimiento en uno no afecte la facturación de los otros tres.',
  },
];

/**
 * AUDITOR PRE-VUELO (Educador en vivo para el CEO):
 * Evalúa qué tan completa está la orden antes de enviarla al obrero, sin bloquear.
 */
export interface PromptReadinessCheck {
  readonly id: string;
  readonly label: string;
  readonly passed: boolean;
  readonly tip: string;
}

export function evaluatePromptReadiness(text: string): {
  readonly score: number;
  readonly checks: readonly PromptReadinessCheck[];
} {
  const clean = text.trim();
  const lower = normalizeGuideText(clean);

  const checks: PromptReadinessCheck[] = [
    {
      id: 'LEN',
      label: 'Contexto suficiente (mínimo 40 caracteres)',
      passed: clean.length >= 40,
      tip: 'Describe en una frase qué quieres lograr y para quién.',
    },
    {
      id: 'GEO_OR_SCOPE',
      label: 'Ubicación, ruta web o alcance definido',
      passed: /(madrid|bizkaia|bilbao|derio|valencia|sevilla|espana|municipio|provincia|\/admin|\/otzarreta|\/proveedores|finca|ayuntamiento|residencia)/.test(lower),
      tip: 'Añade la zona geográfica (ej. Bizkaia, Madrid) o la pantalla exacta que quieres tocar.',
    },
    {
      id: 'KPI_OR_PRICE',
      label: 'Métrica de negocio o regla económica presente',
      passed: /(100|350|14\.?250|80\/10\/10|deposito|reserva|contrato|cuota|visitas|conversion|exit code 0)/.test(lower),
      tip: 'Menciona qué resultado medible esperas (ej. depósito 100 €, igualar cuota, Exit Code 0).',
    },
    {
      id: 'ACTION_VERB',
      label: 'Verbo ejecutivo claro',
      passed: /(construir|crear|actualizar|blindar|auditar|desplegar|automatizar|redactar|generar|reparar|conectar|sincronizar)/.test(lower),
      tip: 'Empieza con un verbo de acción directo (Construir, Blindar, Automatizar, Reparar).',
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);
  return { score, checks };
}

/** Combinación por defecto cuando el cliente no declara ni permite deducir el eje. */
export const DEFAULT_MASTER_GUIDE: {
  readonly objective: MasterObjectiveId;
  readonly tactic: MasterTacticId;
  readonly targetAgent: MasterTargetAgentId;
  readonly domain: MasterDomainId;
  readonly stakeholder: MasterStakeholderId;
} = {
  objective: 'VENTAS',
  tactic: 'SOBREDEMANDA',
  targetAgent: 'CLINE',
  domain: 'PRODUCTORA_EAR',
  stakeholder: 'CEO_INTERNO',
};

/** Minúsculas sin diacríticos: la deducción no puede fallar por una tilde. */
function normalizeGuideText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/** Busca por identificador exacto, con mayúsculas indiferentes. */
function pickById<T extends { readonly id: string }>(
  options: readonly T[],
  id: string | null | undefined,
): T | null {
  if (typeof id !== 'string') return null;
  const needle = id.trim().toUpperCase();
  if (needle.length === 0) return null;
  for (const option of options) {
    if (option.id === needle) return option;
  }
  return null;
}

/**
 * Deduce el eje desde texto libre ponderando la longitud del alias: un alias
 * más largo es más específico («venta elegante» gana a «venta»).
 */
function detectByAliases<T extends { readonly aliases: readonly string[] }>(
  options: readonly T[],
  haystack: string,
): T | null {
  let best: T | null = null;
  let bestScore = 0;
  for (const option of options) {
    let score = 0;
    for (const alias of option.aliases) {
      if (alias.length > 0 && haystack.includes(alias)) score += alias.length;
    }
    if (score > bestScore) {
      best = option;
      bestScore = score;
    }
  }
  return best;
}

/** Devuelve la opción por id o la de defecto del eje (nunca lanza por dato raro). */
function pickDefault<T extends { readonly id: string }>(options: readonly T[], id: string): T {
  const found = pickById(options, id);
  if (found !== null) return found;
  const first = options[0];
  if (first === undefined) {
    throw new Error('Guía Maestra vacía: invariante del módulo roto (0 objetivos/tácticas/destinatarios).');
  }
  return first;
}

export interface MasterGuideInput {
  readonly objective?: string | null;
  readonly tactic?: string | null;
  readonly targetAgent?: string | null;
  readonly domain?: string | null;
  readonly stakeholder?: string | null;
}

export interface ResolvedMasterGuide {
  readonly objective: MasterObjective;
  readonly tactic: MasterTactic;
  readonly targetAgent: MasterTargetAgent;
  readonly domain: MasterDomainOption;
  readonly stakeholder: MasterStakeholderOption;
  /** Directivas de los ejes principales, en orden estable. */
  readonly directives: readonly string[];
  /** Procedencia declarada de cada eje (AF-1: nada se da por supuesto en silencio). */
  readonly sources: {
    readonly objective: GuideSource;
    readonly tactic: GuideSource;
    readonly targetAgent: GuideSource;
    readonly domain: GuideSource;
    readonly stakeholder: GuideSource;
  };
}

/**
 * Resuelve la Guía Maestra con prioridad explícita:
 *   1) eje declarado por el cliente (validado por el esquema del endpoint);
 *   2) eje deducido del texto de la orden (tolerante a acentos);
 *   3) eje por defecto del módulo.
 * Función pura y total: no lanza con entradas hostiles y no depende del entorno.
 */
export function resolveMasterGuide(
  input: MasterGuideInput = {},
  hintText = '',
): ResolvedMasterGuide {
  const haystack = normalizeGuideText(hintText);

  const declaredObjective = pickById(MASTER_OBJECTIVES, input.objective);
  const declaredTactic = pickById(MASTER_TACTICS, input.tactic);
  const declaredTarget = pickById(MASTER_TARGETS, input.targetAgent);
  const declaredDomain = pickById(MASTER_DOMAINS, input.domain);
  const declaredStakeholder = pickById(MASTER_STAKEHOLDERS, input.stakeholder);

  const deducedObjective = declaredObjective === null ? detectByAliases(MASTER_OBJECTIVES, haystack) : null;
  const deducedTactic = declaredTactic === null ? detectByAliases(MASTER_TACTICS, haystack) : null;
  const deducedTarget = declaredTarget === null ? detectByAliases(MASTER_TARGETS, haystack) : null;
  const deducedDomain = declaredDomain === null ? detectByAliases(MASTER_DOMAINS, haystack) : null;
  const deducedStakeholder = declaredStakeholder === null ? detectByAliases(MASTER_STAKEHOLDERS, haystack) : null;

  const objective = declaredObjective ?? deducedObjective ?? pickDefault(MASTER_OBJECTIVES, DEFAULT_MASTER_GUIDE.objective);
  const tactic = declaredTactic ?? deducedTactic ?? pickDefault(MASTER_TACTICS, DEFAULT_MASTER_GUIDE.tactic);
  const targetAgent = declaredTarget ?? deducedTarget ?? pickDefault(MASTER_TARGETS, DEFAULT_MASTER_GUIDE.targetAgent);
  const domain = declaredDomain ?? deducedDomain ?? pickDefault(MASTER_DOMAINS, DEFAULT_MASTER_GUIDE.domain);
  const stakeholder = declaredStakeholder ?? deducedStakeholder ?? pickDefault(MASTER_STAKEHOLDERS, DEFAULT_MASTER_GUIDE.stakeholder);

  const sourceOf = (declared: unknown, deduced: unknown): GuideSource =>
    declared !== null ? 'declarado' : deduced !== null ? 'deducido' : 'defecto';

  const extraDirectives = [
    ...(declaredDomain !== null || deducedDomain !== null ? domain.directives : []),
    ...(declaredStakeholder !== null || deducedStakeholder !== null ? stakeholder.directives : []),
  ];

  return {
    objective,
    tactic,
    targetAgent,
    domain,
    stakeholder,
    directives: [...objective.directives, ...tactic.directives, ...targetAgent.directives, ...extraDirectives],
    sources: {
      objective: sourceOf(declaredObjective, deducedObjective),
      tactic: sourceOf(declaredTactic, deducedTactic),
      targetAgent: sourceOf(declaredTarget, deducedTarget),
      domain: sourceOf(declaredDomain, deducedDomain),
      stakeholder: sourceOf(declaredStakeholder, deducedStakeholder),
    },
  };
}

/** Directivas numeradas, tal y como se inyectan en el macro-script del grafo. */
export function renderGuideDirectives(guide: ResolvedMasterGuide): string {
  return guide.directives.map((directive, index) => `${index + 1}. ${directive}`).join('\n');
}

/**
 * Bloque de texto que se antepone a la orden del CEO cuando se consulta a un
 * modelo: así la guía viaja dentro del contexto y no puede ser ignorada.
 */
export function buildGuideBrief(guide: ResolvedMasterGuide): string {
  return [
    '[GUÍA MAESTRA S-CLASS · CUMPLIMIENTO OBLIGATORIO]',
    `UNIDAD DE NEGOCIO: ${guide.domain.id} — ${guide.domain.hostname} (${guide.domain.hint})`,
    `INTERLOCUTOR / CLIENTE: ${guide.stakeholder.id} — ${guide.stakeholder.label} (${guide.stakeholder.hint})`,
    `OBJETIVO DE NEGOCIO: ${guide.objective.id} — ${guide.objective.label} (${guide.objective.hint})`,
    `TÁCTICA COMERCIAL: ${guide.tactic.id} — ${guide.tactic.label} (${guide.tactic.hint})`,
    `DESTINATARIO: ${guide.targetAgent.id} — ${guide.targetAgent.label}`,
    `ENTREGABLE EXIGIDO: ${guide.targetAgent.deliverable}`,
    'DIRECTIVAS NO NEGOCIABLES:',
    renderGuideDirectives(guide),
  ].join('\n');
}
