/**
 * 🏛️ MOTOR ORÁCULO CUÁNTICO DE EAR OS (v2.0)
 * Sistema de refinamiento cognitivo y alineación estratégica.
 * Absorbe las tácticas de la Bóveda de Crecimiento & Estrategia y la pedagogía musical soberana.
 * Estricto cumplimiento de la Regla 10 (Sin marcas registradas ni mención a terceros).
 */

export type OraclePersona = 'CEO' | 'ARTISTA';

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

export const DOCTRINA_CEO_EMPRESARIO = {
  nombre: 'Doctrina de Crecimiento Cuántico, Neurobranding & Alto Standing',
  principios: [
    'Sobredemanda: Diseñar una propuesta tan deseable que los clientes persigan a Productora EAR',
    'La Venta Elegante: Vender no es presionar ni rogar; es diagnosticar, entender y elevar al cliente',
    'Sprint Midas: Optimizar la rentabilidad neta en cada contrato sin regalar margen ni aceptar descuentos destructivos',
    'Neurobranding & Mentalismo: Anclaje del precio de lujo en el valor percibido del directo de conservatorio',
    'Funnels Cuánticos: Tráfico frío transformado en depósito de 100,00 € Stripe Price-Lock en < 72h',
    'Eliminación de Fricción: Respuestas de WhatsApp Concierge en < 5 minutos desde el Call Center'
  ],
  verificaciones: [
    '¿El flujo asegura el depósito de 100,00 € mediante pasarela Stripe SHA-256?',
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
  nombre: 'Doctrina de Soberanía Musical, Dignificación de Caché & Split 80/10/10',
  principios: [
    'Tarifa Base Innegociable: Edwin Agudelo 350,00 € solista con equipamiento Bose F1 de 1000W',
    'Split Soberano 80/10/10: 80% Artista ejecutor, 10% Infraestructura EAR OS, 10% VIMUME Impacto Social',
    'Deducción Fiscal Ley 49/2002: El 10% a VIMUME otorga certificado oficial desgravable en IRPF / Sociedades (Modelo 182 AEAT)',
    'Homologación Acústica Fincas: Sonorización calibrada a < 75 dB SPL y 12 W/pax para blindar a la finca contra multas',
    'Soberanía Frente a Intermediarios: Cero dependencia de portales que cobran 1.100 €/año de cuota fija sin retorno',
    'Comunidad Fan & Venta Directa: Fidelización emocional de parejas que contratan por calidad artística, no por precio'
  ],
  verificaciones: [
    '¿Se respeta el split soberano 80% Artista / 10% EAR OS / 10% VIMUME?',
    '¿El rider técnico cumple la especificación Bose 12 W/pax y limitador < 75 dB SPL?',
    '¿Se calculan los 1,50 €/km desde Méntrida a partir del km 50 y los 120 € de hotel si procede?'
  ],
  archivosRecomendados: [
    'src/app/(public)/artistas/edwin-agudelo/page.tsx',
    'src/components/fincas/sclass-pro/ProCampusTab.tsx',
    'src/lib/constants/seo-data-hydrated.ts',
    'src/app/(public)/bodas/[provincia]/page.tsx'
  ]
};

/**
 * ⚡ Refina una consulta humana o técnica pasándola por el prisma del Oráculo
 */
export function refineQueryWithOracle(
  query: string,
  persona: OraclePersona = 'CEO',
  context?: Record<string, any>
): OracleRefinedResult {
  const cleanQuery = query.trim();
  const lower = cleanQuery.toLowerCase();

  if (persona === 'ARTISTA') {
    const levers = [
      'Dignificación de caché: 350,00 € solista base',
      'Split Soberano 80/10/10 con deducción Ley 49/2002 VIMUME',
      'Protocolo acústico Bose F1 < 75 dB SPL para fincas'
    ];

    if (lower.includes('precio') || lower.includes('tarifa') || lower.includes('descuento')) {
      levers.push('Defensa de precio: añadir valor en repertorio ceremonial en lugar de bajar la tarifa');
    }
    if (lower.includes('finca') || lower.includes('espacio') || lower.includes('salon')) {
      levers.push('Alianza B2B con fincas: entrega del certificado de calibración acústica antes del evento');
    }

    const refined = `[ORÁCULO ARTISTA SOBERANO]\nOBJETIVO: ${cleanQuery}\n` +
      `DIRECTRICES TÁCTICAS:\n` +
      `- Defender la tarifa base de 350,00 € (Edwin Agudelo) con solvencia técnica Bose F1 y voz de conservatorio.\n` +
      `- Articular el Split Soberano 80/10/10 justificando el dividendo social y fiscal de VIMUME (Modelo 182 AEAT).\n` +
      `- Blindar la relación con las fincas garantizando presión acústica < 75 dB SPL y conexión Cetac protegida.\n` +
      `- Cierre obligatorio mediante depósito de 100,00 € en Stripe Price-Lock SHA-256.`;

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

  // Persona CEO / EMPRESARIO
  const levers = [
    'Neurobranding y posicionamiento de alto standing',
    'Venta Elegante: llamada consultiva orientada a resolver, no a empujar',
    'Filtro de exclusividad: depósito de 100,00 € Stripe Price-Lock en 24h'
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
    `- Optimizar el modelo Midas: eliminar costes ocultos y canalizar todas las reservas al depósito directo de 100 €.\n` +
    `- Neutralizar la competencia de directorios tradicionales destacando el ahorro del 30% en intermediarios parásitos.`;

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
