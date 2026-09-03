import { NextRequest, NextResponse } from 'next/server';
import { validateFincaTechnicalAudit } from '@/lib/b2b-billing-engine';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      name,
      location,
      provincia,
      cif,
      potenciaKw,
      tomaElectrica,
      polizaRCEuros,
      aseguradora,
      numeroPoliza,
      limiteInteriorDBA,
      limiteExteriorDBA,
      accesoConvoy14Plazas,
      director,
      telefono,
      email
    } = data;

    // Ejecución de auditoría técnica algorítmica
    const auditResult = validateFincaTechnicalAudit({
      name,
      location,
      provincia,
      potenciaKw: Number(potenciaKw) || 0,
      tomaElectrica: tomaElectrica || 'CETAC 32A 3P+N+T',
      polizaRC: {
        coberturaEuros: Number(polizaRCEuros) || 0,
        aseguradora: aseguradora || 'Pendiente',
        numeroPoliza: numeroPoliza || 'Pendiente',
        vigenteHasta: '2027-12-31'
      },
      accesoConvoy14Plazas: Boolean(accesoConvoy14Plazas)
    });

    const expedicionId = `HOM-${Date.now().toString(36).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      expedicionId,
      timestamp: new Date().toISOString(),
      slaOnboardingMinutos: 15,
      resultadoAuditoria: {
        aprobado: auditResult.aprobado,
        score: auditResult.score,
        infracciones: auditResult.infracciones,
        estado: auditResult.aprobado ? 'PRE_HOMOLOGADA_VALIDA' : 'REQUIERE_SUBSANACION_TECNICA'
      },
      mensaje: auditResult.aprobado
        ? 'Homologación técnica completada con éxito (< 15 min). La finca cumple con la normativa de seguridad de Productora EAR.'
        : 'Se han detectado desviaciones técnicas que deben subsanarse antes de la inclusión en la red oficial.'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Error al procesar la homologación express' },
      { status: 500 }
    );
  }
}
