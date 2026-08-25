import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';

/**
 * 🏛️ DISPATCHER B2G EXPRESS (LEY 9/2017 LCSP - ART. 118)
 * Genera el expediente técnico administrativo completo para Contratos Menores de Servicios
 * (<15.000 € + IVA) con regla del 95% del techo presupuestario y codificación DIR3 para FacturaE.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { 
      municipio = 'Ayuntamiento de Toledo',
      presupuestoMax = 14950,
      cpv = '92300000-4 (Servicios de Espectáculos y Técnicos)',
      objeto = 'Circuito Municipal de Actuaciones Musicales y Cultura Senior',
      codigoDIR3 = 'L01451688'
    } = body;

    return generateB2GExpediente({
      municipio,
      presupuestoMax,
      cpv,
      objeto,
      codigoDIR3
    });
  } catch (error: any) {
    console.error('❌ [B2G DISPATCHER ERROR]:', error);
    return NextResponse.json({ error: error.message || 'Error en el despacho de expediente B2G' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const municipio = searchParams.get('municipio') || searchParams.get('location') || 'Ayuntamiento de Toledo';
    const presupuestoMax = Number(searchParams.get('presupuesto') || searchParams.get('presupuestoMax')) || 14950;
    const cpv = searchParams.get('cpv') || '92300000-4 (Servicios de Espectáculos y Técnicos)';
    const objeto = searchParams.get('objeto') || searchParams.get('service') || 'Circuito Municipal de Actuaciones Musicales y Cultura Senior';
    const codigoDIR3 = searchParams.get('dir3') || searchParams.get('codigoDIR3') || 'L01451688';

    return generateB2GExpediente({
      municipio,
      presupuestoMax,
      cpv,
      objeto,
      codigoDIR3
    });
  } catch (error: any) {
    console.error('❌ [B2G DISPATCHER GET ERROR]:', error);
    return NextResponse.json({ error: error.message || 'Error en consulta B2G' }, { status: 500 });
  }
}

function generateB2GExpediente(params: {
  municipio: string;
  presupuestoMax: number | string;
  cpv: string;
  objeto: string;
  codigoDIR3: string;
}) {
  const maxBudgetNum = Number(params.presupuestoMax) || 14950;
  // Regla del 95% para garantizar adjudicación directa sin superar el límite de 15.000 € + IVA
  const ofertaSugerida = Math.round(maxBudgetNum * 0.95 * 100) / 100;
  const ivaCalculado = Math.round(ofertaSugerida * 0.21 * 100) / 100;
  const totalConIVA = Math.round((ofertaSugerida + ivaCalculado) * 100) / 100;

  const timestamp = Date.now();
  const hashExpediente = `EXP-B2G-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;

  const dossierData = {
    expedienteId: hashExpediente,
    municipio: params.municipio,
    codigoDIR3: params.codigoDIR3,
    cpv: params.cpv,
    objeto: params.objeto,
    marcoLegal: 'Artículo 118 de la Ley 9/2017 de Contratos del Sector Público (LCSP)',
    desgloseEconomico: {
      techoPresupuestario: maxBudgetNum,
      ofertaBase: ofertaSugerida,
      porcentajeTecho: '95.00%',
      iva21: ivaCalculado,
      totalLicitable: totalConIVA,
    },
    impactoSocialODS2030: {
      ods3: 'Salud y Bienestar (Envejecimiento Activo VIMUME 40Hz)',
      ods8: 'Trabajo Decente y Crecimiento Económico (Contratación de Artistas Locales Certificados)',
      ods11: 'Ciudades y Comunidades Sostenibles (Cultura en Municipios y Dinamización Rural)'
    },
    solvenciaTecnica: {
      presionAcustica: '12 W/pax Homologados (Normativa <75 dB)',
      equipamiento: 'Bose F1 Model 812 Flex Array + Microfonía Shure Axient Digital',
      seguroRC: '1.000.000 € (Póliza de Responsabilidad Civil Vigente)',
      registroOficial: 'Inscrito en ROLECE (Registro Oficial de Licitadores)'
    },
    memoriasIncluidas: [
      'Memoria Justificativa de la Necesidad del Servicio',
      'Informe de Insuficiencia de Medios Propios Municipales',
      'Pliego de Prescripciones Técnicas (Equipamiento Bose F1 + Microfonía Shure)',
      'Ficha de Inscripción en Registro de Licitadores (ROLECE)',
      'Certificado de Acreditación Digital FacturaE / FACe'
    ],
    pdfDossierUrl: `/api/dossier/pdf?municipio=${encodeURIComponent(params.municipio)}&presupuesto=${ofertaSugerida}&cpv=${encodeURIComponent(params.cpv)}&objeto=${encodeURIComponent(params.objeto)}&dir3=${encodeURIComponent(params.codigoDIR3)}&b2g=true`,
    generadoEn: new Date(timestamp).toISOString()
  };

  console.log(`🏛️ [B2G DISPATCHER] Expediente generado: ${hashExpediente} | ${params.municipio} | Oferta: ${ofertaSugerida}€`);

  return NextResponse.json({
    success: true,
    expediente: dossierData
  }, { status: 200 });
}
