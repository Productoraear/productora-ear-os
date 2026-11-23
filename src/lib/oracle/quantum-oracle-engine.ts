/**
 * 🏛️ MOTOR ORÁCULO CUÁNTICO DE EAR OS (v2.0)
 * Sistema de refinamiento cognitivo y alineación estratégica.
 * Absorbe las tácticas de la Bóveda de Crecimiento & Estrategia y la pedagogía musical soberana.
 * Estricto cumplimiento de la Regla 10 (Sin marcas registradas ni mención a terceros).
 */

import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  SUPLEMENTO_HOTEL_EUR,
  HORA_FIN_HOTEL,
  LOGISTICA_KM_HOTEL,
  LIMITE_SPL_DB,
  WATTS_PER_PAX,
  SPLIT_SOBERANO,
  AJUSTE_PREVENTIVO_B2G_EUR,
  LIMITE_B2G_LCSP_EUR,
  VAT_RATE
} from '@/lib/constants/ear-os-ssot';

/**
 * OCHO PERSONAS DEL ORÁCULO — contrato cerrado.
 *
 * DEPURACIÓN REAL (Ley Anti-Fachada AF-1 · AF-5): la ruta
 * `src/app/api/admin/compile-intent/route.ts` declaraba ocho personas en Zod
 * (`ORACLE_PERSONAS`) mientras este motor solo implementaba dos. Las seis
 * restantes (CTO, CFO, CMO, COO, LEGAL, ENGINEER) caían por el `else` y
 * devolvían **doctrina de CEO con nombre de CEO**: el panel mostraba un modo
 * que no existía. Ahora cada identificador tiene su doctrina y su refinado
 * propios; `isOraclePersona()` permite a la ruta rechazar con 400 cualquier
 * valor fuera del contrato en lugar de degradarlo en silencio.
 */
export const ORACLE_PERSONA_IDS = [
  'CEO',
  'ARTISTA',
  'CTO',
  'CFO',
  'CMO',
  'COO',
  'LEGAL',
  'ENGINEER'
] as const;

export type OraclePersona = (typeof ORACLE_PERSONA_IDS)[number];

/** Type-guard del contrato cerrado de personas (SEC-4: validación de boundary). */
export function isOraclePersona(value: unknown): value is OraclePersona {
  return typeof value === 'string' && (ORACLE_PERSONA_IDS as readonly string[]).includes(value);
}

export interface OracleRefinedResult {
  persona: OraclePersona;
  doctrineName: string;
  originalQuery: string;
  refinedPrompt: string;
  tacticalLevers: string[];
  businessChecks: string[];
  suggestedFiles: string[];
  suggestedAction: string;
}

/** Porcentajes del Split Soberano derivados del SSOT canónico (Zona Cero). */
const SPLIT_ARTISTA_PCT = Math.round(SPLIT_SOBERANO.artista * 100);
const SPLIT_EAROS_PCT = Math.round(SPLIT_SOBERANO.earOs * 100);
const SPLIT_VIMUME_PCT = Math.round(SPLIT_SOBERANO.vimume * 100);

export const DOCTRINA_CEO_EMPRESARIO = {
  nombre: 'Doctrina de Crecimiento Cuántico, Neurobranding & Alto Standing',
  principios: [
    'Sobredemanda: Diseñar una propuesta tan deseable que los clientes persigan a Productora EAR',
    'La Venta Elegante: Vender no es presionar ni rogar; es diagnosticar, entender y elevar al cliente',
    'Sprint Midas: Optimizar la rentabilidad neta en cada contrato sin regalar margen ni aceptar descuentos destructivos',
    'Neurobranding & Mentalismo: Anclaje del precio de lujo en el valor percibido del directo de conservatorio',
    'Funnels Cuánticos: Tráfico frío transformado en depósito de ' +
      `${DEPOSITO_STRIPE_EUR.toFixed(2)} € Stripe Price-Lock en < 72h`,
    'Eliminación de Fricción: Respuestas de WhatsApp Concierge en < 5 minutos desde el Call Center'
  ],
  verificaciones: [
    `¿El flujo asegura el depósito de ${DEPOSITO_STRIPE_EUR.toFixed(2)} € mediante pasarela Stripe SHA-256?`,
    '¿Se preserva el margen neto sin incurrir en costes publicitarios descontrolados?',
    '¿El mensaje elimina las objeciones antes de que el cliente las formule?'
  ],
  archivosRecomendados: [
    'src/app/(admin)/admin/compiler/page.tsx',
    'src/app/(admin)/admin/call-center/page.tsx',
    'src/components/fincas/sclass-pro/SClassProEmpMenu.tsx',
    'src/lib/compiler/omega-intent-compiler.ts'
  ]
};

export const DOCTRINA_ARTISTA_SOBERANO = {
  nombre: `Doctrina de Soberanía Musical, Dignificación de Caché & Split ${SPLIT_ARTISTA_PCT}/${SPLIT_EAROS_PCT}/${SPLIT_VIMUME_PCT}`,
  principios: [
    `Tarifa Base Innegociable: Edwin Agudelo ${TARIFA_BASE_SOLISTA_EUR.toFixed(2)} € solista con equipamiento Bose F1 de 1000W`,
    `Split Soberano ${SPLIT_ARTISTA_PCT}/${SPLIT_EAROS_PCT}/${SPLIT_VIMUME_PCT}: ${SPLIT_ARTISTA_PCT}% Artista ejecutor, ${SPLIT_EAROS_PCT}% Infraestructura EAR OS, ${SPLIT_VIMUME_PCT}% VIMUME Impacto Social`,
    `Deducción Fiscal Ley 49/2002: El ${SPLIT_VIMUME_PCT}% a VIMUME otorga certificado oficial desgravable en IRPF / Sociedades (Modelo 182 AEAT)`,
    `Homologación Acústica Fincas: Sonorización calibrada a < ${LIMITE_SPL_DB} dB SPL y ${WATTS_PER_PAX} W/pax para blindar a la finca contra multas`,
    'Soberanía Frente a Intermediarios: Cero dependencia de portales que cobran cuota fija anual sin retorno medible',
    'Comunidad Fan & Venta Directa: Fidelización emocional de parejas que contratan por calidad artística, no por precio'
  ],
  verificaciones: [
    `¿Se respeta el split soberano ${SPLIT_ARTISTA_PCT}% Artista / ${SPLIT_EAROS_PCT}% EAR OS / ${SPLIT_VIMUME_PCT}% VIMUME?`,
    `¿El rider técnico cumple la especificación Bose ${WATTS_PER_PAX} W/pax y limitador < ${LIMITE_SPL_DB} dB SPL?`,
    `¿Se calculan los ${LOGISTICA_EUR_PER_KM.toFixed(2)} €/km desde Méntrida a partir del km ${LOGISTICA_KM_EXENTOS} y los ${SUPLEMENTO_HOTEL_EUR.toFixed(0)} € de hotel si procede?`
  ],
  archivosRecomendados: [
    'src/app/(public)/artistas/edwin-agudelo/page.tsx',
    'src/components/fincas/sclass-pro/ProCampusTab.tsx',
    'src/lib/constants/seo-data-hydrated.ts',
    'src/app/(public)/bodas/[provincia]/page.tsx'
  ]
};

/* ═══════════════════════════════════════════════════════════════════════════
 * DOCTRINAS DE LOS SEIS ROLES RESTANTES (CTO · CFO · CMO · COO · LEGAL · ENGINEER)
 * ═══════════════════════════════════════════════════════════════════════════
 * Cada una se deriva del SSOT canónico (Zona Cero) y de las 17 puertas del
 * arnés. Ninguna cifra de negocio se teclea aquí (INV-10).
 */

export const DOCTRINA_CTO_ARQUITECTO = {
  nombre: 'Doctrina de Arquitectura Bare-Metal, Arnés de 17 Puertas & Cero Fachada',
  principios: [
    'Ley Anti-Fachada: ningún endpoint de salud declara OK sin sonda real (probed/source/mode/checkedAt)',
    'Exit Code 0 o no es entrega: tsc --noEmit, lint y las 17 puertas del arnés antes del commit',
    'SSOT único: toda cifra nace de ear-os-ssot.ts; prohibido el precio hardcodeado (INV-10)',
    'Idempotencia ACID: N reintentos de Stripe producen exactamente 1 fila por stripeSessionId',
    'Presupuesto de rendimiento: CLS ≤ 0,05 · LCP ≤ 2,5 s · INP ≤ 200 ms en Bare-Metal Coolify'
  ],
  verificaciones: [
    '¿La ruta nueva nace cerrada (401/403/503) antes del camino feliz? (SEC-1)',
    '¿Todo fetch externo tiene AbortController con timeout ≤ 8 s? (INV-17)',
    '¿Cero secretos de servidor alcanzables desde un componente "use client"? (INV-07 / SEC-3)'
  ],
  archivosRecomendados: [
    'src/lib/constants/ear-os-ssot.ts',
    'scripts/run_sv_protocol_15_gates.cjs',
    'src/middleware.ts',
    'src/lib/security/adminGuard.ts'
  ]
};

export const DOCTRINA_CFO_TESORERIA = {
  nombre: 'Doctrina de Tesorería Soberana, Price-Lock & Split Fiscal 80/10/10',
  principios: [
    `Depósito de ${DEPOSITO_STRIPE_EUR.toFixed(2)} € Stripe Price-Lock, 100 % deducible del importe final`,
    `Split Soberano ${SPLIT_ARTISTA_PCT}/${SPLIT_EAROS_PCT}/${SPLIT_VIMUME_PCT}: 80 % artista ejecutor, 10 % infraestructura EAR OS, 10 % VIMUME`,
    `IVA al ${Math.round(VAT_RATE * 100)} % aplicado desde el SSOT, nunca por copy manual (INV-10)`,
    `Techo B2G de ${AJUSTE_PREVENTIVO_B2G_EUR.toLocaleString('es-ES')} € para no rebasar el umbral de ${LIMITE_B2G_LCSP_EUR.toLocaleString('es-ES')} € del Art. 118 LCSP`,
    'Conciliación Stripe contra ledger local: cero cobros huérfanos y cero dobles cargos'
  ],
  verificaciones: [
    '¿El importe final cierra con el ledger y con el evento de Stripe (sin descuadre)?',
    '¿El 100 % del depósito se deduce en el precio del contrato firmado?',
    '¿El 10 % de VIMUME emite certificado de mecenazgo con su base imponible declarada?'
  ],
  archivosRecomendados: [
    'src/app/(admin)/admin/tesoreria/page.tsx',
    'scripts/verify_price_lock_flow.cjs',
    'src/lib/payments/stripe-price-lock.ts',
    'src/app/(admin)/admin/control/tabs/TesoreriaTab.tsx'
  ]
};

export const DOCTRINA_CMO_MARKETING = {
  nombre: 'Doctrina de Demanda Soberana, SEO Programático & Copy Verificable',
  principios: [
    'Promesa = URL: toda afirmación comercial responde en una página pública verificable (EP-3)',
    'Cero marcas de terceros, logos ajenos o reseñas fabricadas (JUR-4)',
    'SEO programático por provincia y tipología de finca con intención de reserva real',
    `Cifras publicadas rastreables a su SSOT en ≤ 3 clics (AF-4): tarifa base ${TARIFA_BASE_SOLISTA_EUR.toFixed(0)} €`,
    'Eliminación de fricción: respuesta Concierge en menos de 5 minutos por WhatsApp'
  ],
  verificaciones: [
    '¿Cada claim del copy tiene una URL o una constante SSOT que lo demuestra?',
    '¿Se ha eliminado todo adjetivo sin métrica del texto publicado? (L1)',
    '¿El CTA de la ruta vende y NO es un clic muerto? (INV-09)'
  ],
  archivosRecomendados: [
    'src/lib/constants/seo-data-hydrated.ts',
    'src/app/(public)/bodas/[provincia]/page.tsx',
    'src/lib/constants/mariachi-seo-matrix-400.ts',
    'src/components/fincas/sclass-pro/SClassProEmpMenu.tsx'
  ]
};

export const DOCTRINA_COO_OPERACIONES = {
  nombre: 'Doctrina de Operación HITL, Logística desde Méntrida & Continuidad de Servicio',
  principios: [
    `Logística ${LOGISTICA_EUR_PER_KM.toFixed(2)} €/km a partir del km ${LOGISTICA_KM_EXENTOS} desde el Hub Méntrida`,
    `Suplemento hotelero de ${SUPLEMENTO_HOTEL_EUR.toFixed(0)} € si el cierre supera las ${HORA_FIN_HOTEL}:00 h o los ${LOGISTICA_KM_HOTEL} km`,
    'Límites de automatización: 5 % HITL total en litigios y cancelaciones; 25 % con revisión humana en depósitos',
    'Bitácora y rollback ensayado en menos de 5 minutos (CHG-2)',
    'Cero clics muertos en las rutas que venden (INV-09)'
  ],
  verificaciones: [
    '¿El escalado humano (HITL) está definido para cancelaciones, litigios y contratos B2G que exigen revisión?',
    '¿La ruta calcula distancia y portes desde la sede real del proveedor, no desde Méntrida por defecto?',
    '¿Existe procedimiento de contingencia documentado y probado?'
  ],
  archivosRecomendados: [
    'src/app/(admin)/admin/flota/page.tsx',
    'src/app/(admin)/admin/manual-operaciones/page.tsx',
    'src/app/(admin)/admin/scheduler/page.tsx',
    'src/components/admin/UberStyleBookingDispatcher.tsx'
  ]
};

export const DOCTRINA_LEGAL_CUMPLIMIENTO = {
  nombre: 'Doctrina de Escudo Jurídico, LCSP Art. 118 & Ley 37/2003',
  principios: [
    `Contratos menores B2G bajo el umbral de ${LIMITE_B2G_LCSP_EUR.toLocaleString('es-ES')} €; techo preventivo ${AJUSTE_PREVENTIVO_B2G_EUR.toLocaleString('es-ES')} €`,
    `Ruido: limitador calibrado por debajo de ${LIMITE_SPL_DB} dB SPL y ${WATTS_PER_PAX} W/pax (Ley 37/2003)`,
    'VIMUME se declara como programa de estimulación neuroacústica, nunca como tratamiento médico (JUR-3)',
    'Ley 49/2002: certificado de mecenazgo con base imponible y Modelo 182 AEAT',
    'Cero datos personales en logs, URLs o payloads n8n (INV-14 · RGPD)'
  ],
  verificaciones: [
    '¿El importe del contrato respeta el techo preventivo del Art. 118 LCSP?',
    '¿El rider acústico está firmado y el limitador homologado antes del evento?',
    '¿Existe consentimiento bilateral del proveedor y del cliente antes del cierre?'
  ],
  archivosRecomendados: [
    'src/app/(admin)/admin/licitaciones/page.tsx',
    'scripts/verify_sonometro_pwa.cjs',
    'src/lib/constants/vimume-clinical-ssot.ts',
    'src/app/(admin)/admin/control/tabs/ProveedoresTab.tsx'
  ]
};

export const DOCTRINA_ENGINEER_EJECUTOR = {
  nombre: 'Doctrina de Ejecución Quirúrgica, Tipos Estrictos & Cero Deuda',
  principios: [
    'Scope cerrado: se toca únicamente el fichero autorizado en `files[]`, ni uno más',
    'TypeScript strict con cero `any` implícito en el diff (G-1)',
    'Componentes hoja: nunca se declara un registro de navegación paralelo',
    '0 spinners huérfanos y skeletons de geometría fija: CLS < 0,02 (INV-18)',
    'Selecciona solo lo necesario en Prisma: cero payload bloat (INV-20)'
  ],
  verificaciones: [
    '¿Compila `tsc --noEmit` con Exit Code 0 sobre el diff?',
    '¿El componente nuevo se registra en la fuente única de navegación si es una ruta?',
    '¿El test asignado se ejecuta y pasa antes de firmar la entrega?'
  ],
  archivosRecomendados: [
    'src/lib/config/admin-navigation.ts',
    'src/app/(admin)/admin/layout.tsx',
    'package.json',
    'src/lib/oracle/quantum-oracle-engine.ts'
  ]
};

/** Rótulo corto por persona (usado por el selector del compilador). */
const PERSONA_LABEL: Record<OraclePersona, string> = {
  CEO: 'CEO / Empresario',
  ARTISTA: 'Artista Soberano',
  CTO: 'CTO / Arquitecto',
  CFO: 'CFO / Tesorería',
  CMO: 'CMO / Marketing',
  COO: 'COO / Operaciones',
  LEGAL: 'Legal / Cumplimiento',
  ENGINEER: 'Engineer / Ejecutor'
};

/** Qué decide cada rol, traducido a impacto de negocio (CEO-2). */
const PERSONA_PURPOSE: Record<OraclePersona, string> = {
  CEO: 'Crecimiento, pricing y cierre de contratos',
  ARTISTA: 'Caché, split 80/10/10 y blindaje acústico',
  CTO: 'Arquitectura, arnés de 17 puertas y cero fachada',
  CFO: 'Tesorería, Price-Lock Stripe y conciliación',
  CMO: 'Demanda, SEO programático y copy verificable',
  COO: 'Operación HITL, logística y continuidad',
  LEGAL: 'LCSP, Ley 37/2003 y protección de datos',
  ENGINEER: 'Ejecución quirúrgica, tipos estrictos y cero deuda'
};

interface OracleDoctrine {
  nombre: string;
  principios: readonly string[];
  verificaciones: readonly string[];
  archivosRecomendados: readonly string[];
}

/** Mapa cerrado persona → doctrina. Elimina el `else` que servía CEO a todos. */
const DOCTRINE_BY_PERSONA: Record<OraclePersona, OracleDoctrine> = {
  CEO: DOCTRINA_CEO_EMPRESARIO,
  ARTISTA: DOCTRINA_ARTISTA_SOBERANO,
  CTO: DOCTRINA_CTO_ARQUITECTO,
  CFO: DOCTRINA_CFO_TESORERIA,
  CMO: DOCTRINA_CMO_MARKETING,
  COO: DOCTRINA_COO_OPERACIONES,
  LEGAL: DOCTRINA_LEGAL_CUMPLIMIENTO,
  ENGINEER: DOCTRINA_ENGINEER_EJECUTOR
};

/** Metadatos de presentación del selector de personas (una fila por rol real). */
export interface OraclePersonaDescriptor {
  id: OraclePersona;
  /** Rótulo corto para el botón. */
  label: string;
  doctrineName: string;
  /** Qué decide este rol, en términos de negocio. */
  purpose: string;
}

/** Catálogo derivado del contrato cerrado: el panel nunca teclea la lista. */
export const ORACLE_PERSONA_CATALOG: readonly OraclePersonaDescriptor[] =
  ORACLE_PERSONA_IDS.map((id) => ({
    id,
    label: PERSONA_LABEL[id],
    doctrineName: DOCTRINE_BY_PERSONA[id].nombre,
    purpose: PERSONA_PURPOSE[id]
  }));

/** Doctrina activa para una persona (siempre existe: el mapa está cerrado). */
export function getOracleDoctrine(persona: OraclePersona): OracleDoctrine {
  return DOCTRINE_BY_PERSONA[persona];
}

/**
 * ⚡ Refina una consulta humana o técnica pasándola por el prisma del Oráculo
 */
export function refineQueryWithOracle(
  query: string,
  persona: OraclePersona = 'CEO',
  context?: Readonly<Record<string, string | number | boolean>>
): OracleRefinedResult {
  // `context` queda reservado para ampliaciones futuras (telemetría, scoring);
  // no se re-hardcodea ningún valor de negocio: todo nace del SSOT canónico.
  void context;
  const cleanQuery = query.trim();
  const lower = cleanQuery.toLowerCase();

  if (persona === 'ARTISTA') {
    const levers = [
      `Dignificación de caché: ${TARIFA_BASE_SOLISTA_EUR.toFixed(2)} € solista base`,
      `Split Soberano ${SPLIT_ARTISTA_PCT}/${SPLIT_EAROS_PCT}/${SPLIT_VIMUME_PCT} con deducción Ley 49/2002 VIMUME`,
      `Protocolo acústico Bose F1 < ${LIMITE_SPL_DB} dB SPL (${WATTS_PER_PAX} W/pax) para fincas`
    ];

    if (lower.includes('precio') || lower.includes('tarifa') || lower.includes('descuento')) {
      levers.push('Defensa de precio: añadir valor en repertorio ceremonial en lugar de bajar la tarifa');
    }
    if (lower.includes('finca') || lower.includes('espacio') || lower.includes('salon')) {
      levers.push('Alianza B2B con fincas: entrega del certificado de calibración acústica antes del evento');
    }

    const refined = `[ORÁCULO ARTISTA SOBERANO]\nOBJETIVO: ${cleanQuery}\n` +
      `DIRECTRICES TÁCTICAS:\n` +
      `- Defender la tarifa base de ${TARIFA_BASE_SOLISTA_EUR.toFixed(2)} € (Edwin Agudelo) con solvencia técnica Bose F1 y voz de conservatorio.\n` +
      `- Articular el Split Soberano ${SPLIT_ARTISTA_PCT}/${SPLIT_EAROS_PCT}/${SPLIT_VIMUME_PCT} justificando el dividendo social y fiscal de VIMUME (Modelo 182 AEAT).\n` +
      `- Blindar la relación con las fincas garantizando presión acústica < ${LIMITE_SPL_DB} dB SPL (${WATTS_PER_PAX} W/pax) y conexión Cetac protegida.\n` +
      `- Cierre obligatorio mediante depósito de ${DEPOSITO_STRIPE_EUR.toFixed(2)} € en Stripe Price-Lock SHA-256.`;

    return {
      persona: 'ARTISTA',
      doctrineName: DOCTRINA_ARTISTA_SOBERANO.nombre,
      originalQuery: cleanQuery,
      refinedPrompt: refined,
      tacticalLevers: levers,
      businessChecks: DOCTRINA_ARTISTA_SOBERANO.verificaciones,
      suggestedFiles: DOCTRINA_ARTISTA_SOBERANO.archivosRecomendados,
      suggestedAction: 'Desplegar propuesta con Rider Acústico Bose y Certificado VIMUME Ley 49/2002'
    };
  }

  // Personas distintas de CEO y ARTISTA: cada una con su directriz propia.
  // (Antes de esta corrección las seis caían aquí y recibían doctrina de CEO.)
  const roleResult = refineNonCeoPersona(cleanQuery, persona);
  if (roleResult !== null) return roleResult;

  // Persona CEO / EMPRESARIO
  const levers = [
    'Neurobranding y posicionamiento de alto standing',
    'Venta Elegante: llamada consultiva orientada a resolver, no a empujar',
    `Filtro de exclusividad: depósito de ${DEPOSITO_STRIPE_EUR.toFixed(2)} € Stripe Price-Lock en 24h`
  ];

  if (lower.includes('campaña') || lower.includes('adquisicion') || lower.includes('lead')) {
    levers.push('Sobredemanda: oferta irresistible (Oferta Mafia) que hace irracional decir que no');
  }
  if (lower.includes('finca') || lower.includes('b2b') || lower.includes('proveedor')) {
    levers.push('Acuerdo B2B simbiótico: resolución del dolor de ruido de la finca a cambio de recomendación preferente');
  }

  const refined = `[ORÁCULO CEO / EMPRESARIO]\nOBJETIVO: ${cleanQuery}\n` +
    `DIRECTRICES TÁCTICAS:\n` +
    `- Aplicar el principio de Sobredemanda: posicionar a Productora EAR como el estándar de lujo y alta fidelidad.\n` +
    `- Implementar Venta Elegante: responder en < 5 minutos con empatía, interés en la fecha y solvencia ejecutiva.\n` +
    `- Optimizar el modelo Midas: eliminar costes ocultos y canalizar todas las reservas al depósito directo de ${DEPOSITO_STRIPE_EUR.toFixed(2)} €.\n` +
    `- Blindar la logística: ${LOGISTICA_EUR_PER_KM.toFixed(2)} €/km a partir del km ${LOGISTICA_KM_EXENTOS}, con suplemento hotelero de ${SUPLEMENTO_HOTEL_EUR.toFixed(0)} € si el cierre supera las ${HORA_FIN_HOTEL}:00 h o los ${LOGISTICA_KM_HOTEL} km.\n` +
    `- Neutralizar la competencia de directorios tradicionales demostrando que el intermediario no aporta valor medible al cliente final.`;

  return {
    persona: 'CEO',
    doctrineName: DOCTRINA_CEO_EMPRESARIO.nombre,
    originalQuery: cleanQuery,
    refinedPrompt: refined,
    tacticalLevers: levers,
    businessChecks: DOCTRINA_CEO_EMPRESARIO.verificaciones,
    suggestedFiles: DOCTRINA_CEO_EMPRESARIO.archivosRecomendados,
    suggestedAction: 'Activar secuencia de contacto inmediato por WhatsApp Concierge y emisión de Price-Lock'
  };
}

/**
 * Directriz maestra por rol: cabecera del prompt refinado y una orden
 * prescriptiva que el ejecutor puede cumplir sin ambigüedad (FLUENCY-1).
 */
const ROLE_DIRECTIVE: Record<
  Exclude<OraclePersona, 'CEO' | 'ARTISTA'>,
  { header: string; orders: readonly string[]; action: string }
> = {
  CTO: {
    header: 'ORÁCULO CTO / ARQUITECTO',
    orders: [
      'Ninguna superficie nueva se considera entregada sin sonda real: `probed`, `source`, `mode` y `checkedAt` en todo JSON de salud.',
      'Cierra el cambio con `tsc --noEmit` y las 17 puertas del arnés; un fallo obliga a declarar SOSPECHOSO, nunca OK.',
      'Toda consulta Prisma lleva `select` quirúrgico y todo fetch externo `AbortController` con timeout ≤ 8 s.'
    ],
    action: 'Ejecutar typecheck + arnés de 17 puertas y publicar el scorecard con los huecos a la vista'
  },
  CFO: {
    header: 'ORÁCULO CFO / TESORERÍA',
    orders: [
      `Instrumenta el cobro del depósito de ${DEPOSITO_STRIPE_EUR.toFixed(2)} € con idempotencia ACID: N reintentos, 1 fila por stripeSessionId.`,
      `Respeta el Split Soberano ${SPLIT_ARTISTA_PCT}/${SPLIT_EAROS_PCT}/${SPLIT_VIMUME_PCT} y el IVA del ${Math.round(VAT_RATE * 100)} % tal como los declara el SSOT.`,
      `Ningún contrato B2G supera ${AJUSTE_PREVENTIVO_B2G_EUR.toLocaleString('es-ES')} €: por encima del umbral de ${LIMITE_B2G_LCSP_EUR.toLocaleString('es-ES')} € cambia el procedimiento legal.`
    ],
    action: 'Conciliar Stripe contra ledger y emitir el cierre de tesorería con SHA-256'
  },
  CMO: {
    header: 'ORÁCULO CMO / MARKETING',
    orders: [
      'Toda promesa nueva nace con su URL pública verificable; si la URL no existe, la promesa no se publica.',
      'Sustituye todo adjetivo sin métrica por una cifra rastreable al SSOT en ≤ 3 clics.',
      'Cero marcas de terceros, logos ajenos o reseñas fabricadas en cualquier pieza.'
    ],
    action: 'Publicar la pieza con claim → URL → constante SSOT y medir el CTA al depósito'
  },
  COO: {
    header: 'ORÁCULO COO / OPERACIONES',
    orders: [
      `Calcula portes a ${LOGISTICA_EUR_PER_KM.toFixed(2)} €/km desde el km ${LOGISTICA_KM_EXENTOS} y aplica el suplemento de ${SUPLEMENTO_HOTEL_EUR.toFixed(0)} € cuando proceda.`,
      'Marca el punto de escalado humano (HITL) antes de automatizar cancelaciones, litigios o depósitos.',
      'Verifica que ningún CTA de la ruta de venta es un clic muerto antes de dar el flujo por operativo.'
    ],
    action: 'Activar el flujo con punto HITL declarado y rollback documentado'
  },
  LEGAL: {
    header: 'ORÁCULO LEGAL / CUMPLIMIENTO',
    orders: [
      `Comprueba el importe frente al techo preventivo de ${AJUSTE_PREVENTIVO_B2G_EUR.toLocaleString('es-ES')} € (Art. 118 LCSP) antes de emitir el documento.`,
      `Exige rider acústico firmado y limitador por debajo de ${LIMITE_SPL_DB} dB SPL (${WATTS_PER_PAX} W/pax) según Ley 37/2003.`,
      'Asegura que VIMUME se describe como estimulación neuroacústica y no como tratamiento médico; cero datos personales en logs.'
    ],
    action: 'Emitir el expediente con la cláusula aplicable citada y el consentimiento bilateral'
  },
  ENGINEER: {
    header: 'ORÁCULO ENGINEER / EJECUTOR',
    orders: [
      'Toca exclusivamente los ficheros declarados en `files[]` y ningún otro.',
      'Cero `any` implícito en el diff y componentes hoja: sin registros de navegación paralelos.',
      'Reserva geometría con `min-h-*` para no provocar layout shift y ejecuta el test asignado antes de firmar.'
    ],
    action: 'Entregar el diff con Exit Code 0 y el test ejecutado'
  }
};

/**
 * Refinado para las seis personas que no son CEO ni ARTISTA.
 * Devuelve `null` cuando la persona es CEO o ARTISTA (las trata el llamador).
 */
function refineNonCeoPersona(
  cleanQuery: string,
  persona: OraclePersona
): OracleRefinedResult | null {
  if (persona === 'CEO' || persona === 'ARTISTA') return null;

  const doctrine = DOCTRINE_BY_PERSONA[persona];
  const directive = ROLE_DIRECTIVE[persona];
  const lower = cleanQuery.toLowerCase();

  const levers: string[] = doctrine.principios.slice(0, 3).map((p) => p);
  if (lower.includes('campaña') || lower.includes('lead') || lower.includes('marketing')) {
    levers.push('Cada lead cualificado se persigue con URL de reserva y depósito deducible, sin rebajas de tarifa');
  }
  if (lower.includes('stripe') || lower.includes('pago') || lower.includes('cobro')) {
    levers.push(`Idempotencia ACID en Stripe: N reintentos producen 1 fila por sesión de ${DEPOSITO_STRIPE_EUR.toFixed(2)} €`);
  }
  if (lower.includes('b2g') || lower.includes('licitacion') || lower.includes('contrato')) {
    levers.push(`Techo preventivo B2G ${AJUSTE_PREVENTIVO_B2G_EUR.toLocaleString('es-ES')} € (Art. 118 LCSP)`);
  }

  const refined =
    `[${directive.header}]\nOBJETIVO: ${cleanQuery}\n` +
    `DOCTRINA APLICADA: ${doctrine.nombre}\n` +
    `DIRECTRICES TÁCTICAS:\n` +
    directive.orders.map((order) => `- ${order}`).join('\n');

  return {
    persona,
    doctrineName: doctrine.nombre,
    originalQuery: cleanQuery,
    refinedPrompt: refined,
    tacticalLevers: levers,
    businessChecks: [...doctrine.verificaciones],
    suggestedFiles: [...doctrine.archivosRecomendados],
    suggestedAction: directive.action
  };
}
