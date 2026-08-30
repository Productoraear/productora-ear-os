import { NextResponse } from 'next/server';
import { B2G_PRESETS } from '@/lib/vimume/b2g-tender-engine';

/**
 * 🏛️ B2G TENDER ALERT FEED — API ROUTE
 * Gobernanza Antigravity Omega v4.1
 * 
 * Simula y sirve oportunidades de licitación B2G detectadas en la 
 * Plataforma de Contratación del Sector Público (PLACSP).
 * 
 * En producción, este endpoint se conectaría al scraper real 
 * (scripts/b2g_hunter_scanner.py) o a un webhook de la PLACSP.
 * Actualmente sirve un feed de oportunidades de alta fidelidad
 * basado en patrones reales de licitaciones de festejos y 
 * servicios sociales detectados en el mercado.
 */

export interface B2GTenderOpportunity {
  id: string;
  expedienteRef: string;
  title: string;
  organoContratante: string;
  municipio: string;
  provincia: string;
  dir3Code: string;
  cpvCode: string;
  cpvDescription: string;
  importeBase: number;
  importeConIVA: number;
  fechaPublicacion: string;
  fechaLimite: string;
  diasRestantes: number;
  tipoContrato: 'MENOR' | 'NEGOCIADO_SIN_PUB' | 'ABIERTO';
  isLCSPCompliant: boolean;
  vimumeCompatible: boolean;
  matchScore: number; // 0-100
  matchReasons: string[];
  status: 'NUEVA' | 'ANALIZADA' | 'BORRADOR_EMITIDO' | 'PRESENTADA' | 'ADJUDICADA' | 'DESCARTADA';
}

export interface B2GAlertFeedResponse {
  success: boolean;
  timestamp: string;
  count: number;
  tenders: B2GTenderOpportunity[];
  presets: typeof B2G_PRESETS;
}

// Keywords de alto valor para filtrado de licitaciones
const B2G_HIGH_VALUE_KEYWORDS = [
  'fiestas patronales', 'festejos populares', 'verbena', 'concierto municipal',
  'espectáculo musical', 'sonorización', 'equipo de sonido', 'iluminación escénica',
  'música en vivo', 'actuación artística', 'envejecimiento activo',
  'soledad no deseada', 'centro de día', 'residencia de mayores',
  'intervención sociosanitaria', 'musicoterapia', 'cohesión social',
  'servicio social', 'tercera edad', 'atención geriátrica',
  'cultura', 'actividades culturales', 'pantalla led', 'catering',
];

// Oportunidades reales detectadas (simulación de alta fidelidad basada en patrones reales del mercado)
function generateLiveTenderFeed(): B2GTenderOpportunity[] {
  const now = new Date();
  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);

  return [
    {
      id: 'B2G-2026-AYT-001',
      expedienteRef: 'CM-2026/SEP-0187',
      title: 'Servicio de sonorización y actuación musical para Fiestas Patronales 2026',
      organoContratante: 'Ayuntamiento de Torrijos',
      municipio: 'Torrijos',
      provincia: 'Toledo',
      dir3Code: 'L01452270',
      cpvCode: '92300000-4',
      cpvDescription: 'Servicios de Entretenimiento y Espectáculos',
      importeBase: 12400.00,
      importeConIVA: 15004.00,
      fechaPublicacion: formatDate(addDays(now, -2)),
      fechaLimite: formatDate(addDays(now, 4)),
      diasRestantes: 4,
      tipoContrato: 'MENOR',
      isLCSPCompliant: true,
      vimumeCompatible: false,
      matchScore: 96,
      matchReasons: ['Festejos patronales', 'Sonorización profesional', 'Contrato Menor LCSP', 'Provincia Hub (Toledo)'],
      status: 'NUEVA',
    },
    {
      id: 'B2G-2026-AYT-002',
      expedienteRef: 'CM-2026/SEP-0193',
      title: 'Programa de musicoterapia y envejecimiento activo para centros de día municipales',
      organoContratante: 'Concejalía de Servicios Sociales — Ayuntamiento de Illescas',
      municipio: 'Illescas',
      provincia: 'Toledo',
      dir3Code: 'L01450870',
      cpvCode: '85320000-8',
      cpvDescription: 'Servicios Sociales Comunitarios',
      importeBase: 4200.00,
      importeConIVA: 5082.00,
      fechaPublicacion: formatDate(addDays(now, -1)),
      fechaLimite: formatDate(addDays(now, 6)),
      diasRestantes: 6,
      tipoContrato: 'MENOR',
      isLCSPCompliant: true,
      vimumeCompatible: true,
      matchScore: 99,
      matchReasons: ['VIMUME Compatible (<75 dB SPL)', 'Envejecimiento Activo', 'Preset PILOTO_TRIMESTRAL', 'Contrato Menor LCSP', 'Zona Hub Central'],
      status: 'NUEVA',
    },
    {
      id: 'B2G-2026-AYT-003',
      expedienteRef: 'CM-2026/SEP-0201',
      title: 'Contratación de espectáculo de gala para Homenaje al Mayor — Día Internacional de las Personas Mayores',
      organoContratante: 'Ayuntamiento de Navalcarnero',
      municipio: 'Navalcarnero',
      provincia: 'Madrid',
      dir3Code: 'L01280930',
      cpvCode: '92300000-4',
      cpvDescription: 'Servicios de Entretenimiento y Espectáculos',
      importeBase: 2800.00,
      importeConIVA: 3388.00,
      fechaPublicacion: formatDate(now),
      fechaLimite: formatDate(addDays(now, 5)),
      diasRestantes: 5,
      tipoContrato: 'MENOR',
      isLCSPCompliant: true,
      vimumeCompatible: true,
      matchScore: 97,
      matchReasons: ['Gala Institucional', 'Preset GALA_MAYOR', 'VIMUME Compatible', '<15 km de Méntrida'],
      status: 'NUEVA',
    },
    {
      id: 'B2G-2026-AYT-004',
      expedienteRef: 'CM-2026/SEP-0209',
      title: 'Suministro de pantallas LED y equipo audiovisual para verbena patronal Septiembre 2026',
      organoContratante: 'Ayuntamiento de Fuensalida',
      municipio: 'Fuensalida',
      provincia: 'Toledo',
      dir3Code: 'L01450680',
      cpvCode: '92300000-4',
      cpvDescription: 'Servicios de Entretenimiento y Espectáculos',
      importeBase: 8900.00,
      importeConIVA: 10769.00,
      fechaPublicacion: formatDate(addDays(now, -3)),
      fechaLimite: formatDate(addDays(now, 2)),
      diasRestantes: 2,
      tipoContrato: 'MENOR',
      isLCSPCompliant: true,
      vimumeCompatible: false,
      matchScore: 91,
      matchReasons: ['Pantallas LED', 'Equipo audiovisual', 'Verbena patronal', 'Contrato Menor LCSP'],
      status: 'ANALIZADA',
    },
    {
      id: 'B2G-2026-AYT-005',
      expedienteRef: 'CM-2026/SEP-0215',
      title: 'Plan anual de cohesión social y talleres sociosanitarios para la red de centros municipales',
      organoContratante: 'Diputación Provincial de Toledo — Área de Bienestar Social',
      municipio: 'Toledo (Capital)',
      provincia: 'Toledo',
      dir3Code: 'L02000052',
      cpvCode: '85320000-8',
      cpvDescription: 'Servicios Sociales Comunitarios',
      importeBase: 14250.00,
      importeConIVA: 17242.50,
      fechaPublicacion: formatDate(addDays(now, -1)),
      fechaLimite: formatDate(addDays(now, 8)),
      diasRestantes: 8,
      tipoContrato: 'MENOR',
      isLCSPCompliant: true,
      vimumeCompatible: true,
      matchScore: 100,
      matchReasons: ['Techo Art. 118 LCSP (14.250 €)', 'Preset PLAN_ANUAL_TECHO', 'VIMUME Integral', 'Diputación Provincial', '12 centros en red'],
      status: 'NUEVA',
    },
  ];
}

export async function GET() {
  const tenders = generateLiveTenderFeed();

  const response: B2GAlertFeedResponse = {
    success: true,
    timestamp: new Date().toISOString(),
    count: tenders.length,
    tenders,
    presets: B2G_PRESETS,
  };

  return NextResponse.json(response, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
