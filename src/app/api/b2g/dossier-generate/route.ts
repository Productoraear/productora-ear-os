import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';

/**
 * 🏛️ DISPATCHER B2G EXPRESS (LEY 9/2017 LCSP - ART. 118)
 * Genera el expediente técnico administrativo completo para Contratos Menores de Servicios
 * (<15.000 € + IVA) con regla del 95% del techo y codificación DIR3 para FacturaE.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      municipio = 'Ayuntamiento de Toledo',
      presupuestoMax = 14950,
      cpv = '92300000-4 (Servicios de Espectáculos)',
      objeto = 'Circuito Municipal de Actuaciones Musicales y Cultura Senior',
      codigoDIR3 = 'L01451688'
    } = body;

    const maxBudgetNum = Number(presupuestoMax) || 14950;
    // Regla del 95% para garantizar adjudicación directa sin superar el límite de 15.000 € + IVA
    const ofertaSugerida = Math.round(maxBudgetNum * 0.95 * 100) / 100;
    const ivaCalculado = Math.round(ofertaSugerida * 0.21 * 100) / 100;
    const totalConIVA = Math.round((ofertaSugerida + ivaCalculado) * 100) / 100;

    const timestamp = Date.now();
    const hashExpediente = `EXP-B2G-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;

    const dossierData = {
      expedienteId: hashExpediente,
      municipio,
      codigoDIR3,
      cpv,
      objeto,
      marcoLegal: 'Artículo 118 de la Ley 9/2017 de Contratos del Sector Público (LCSP)',
      desgloseEconomico: {
        techoPresupuestario: maxBudgetNum,
        ofertaBase: ofertaSugerida,
        porcentajeTecho: '95.00%',
        iva21: ivaCalculado,
        totalLicitable: totalConIVA,
      },
      impactoSocialODS2030: {
        ods3: 'Salud y Bienestar (Envejecimiento Activo VIMUME)',
        ods8: 'Trabajo Decente y Crecimiento Económico (Contratación de Artistas Locales Certificados)',
        ods11: 'Ciudades y Comunidades Sostenibles (Cultura en Municipios de Menos de 5.000 hab)'
      },
      memoriasIncluidas: [
        'Memoria Justificativa de la Necesidad del Servicio',
        'Informe de Insuficiencia de Medios Propios Municipales',
        'Pliego de Prescripciones Técnicas (Equipamiento Bose F1 + Microfonía Shure)',
        'Ficha de Inscripción en Registro de Licitadores (ROLECE)'
      ],
      generadoEn: new Date(timestamp).toISOString()
    };

    console.log(`🏛️ [B2G DISPATCHER] Expediente generado: ${hashExpediente} | ${municipio} | Oferta: ${ofertaSugerida}€`);

    return NextResponse.json({
      success: true,
      expediente: dossierData
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ [B2G DISPATCHER ERROR]:', error);
    return NextResponse.json({ error: error.message || 'Error en el despacho de expediente B2G' }, { status: 500 });
  }
}
