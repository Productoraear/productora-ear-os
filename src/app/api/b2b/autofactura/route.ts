import { NextRequest, NextResponse } from 'next/server';
import { 
  generateAutoInvoiceDraft, 
  B2BAffiliatePartner, 
  B2BCommissionEvent,
  calculateB2BCommission
} from '@/lib/b2b-billing-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      razonSocial = 'Finca El Olivar S.L.', 
      cif = 'B-87654321', 
      iban = 'ES9121000418450200051332', 
      direccionFiscal = 'Carretera de Toledo km 24, Madrid',
      tipoPartner = 'FINCA_HOMOLOGADA',
      eventos = []
    } = body;

    const partner: B2BAffiliatePartner = {
      id: `partner-${cif.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`,
      razonSocial,
      cif,
      tipoPartner,
      direccionFiscal,
      emailFacturacion: 'administracion@finca.es',
      telefono: '+34 912 345 678',
      iban,
      polizaRC: {
        numero: 'POL-RC-300K-VERIF',
        aseguradora: 'Mapfre Empresas',
        coberturaEuros: 300000,
        vigente: true
      },
      comisionPactadaPct: 0.12,
      scoringHistorico: 95
    };

    const commissionEvents: B2BCommissionEvent[] = eventos.length > 0 ? eventos : [
      {
        eventoId: 'EVT-2026-BODA-01',
        fechaEvento: new Date().toISOString().split('T')[0],
        clienteNombre: 'Boda Familia Martínez - Valenzuela',
        formatoContratado: 'Boda S-Class Diamond 360',
        importeBrutoEvento: 3800,
        comisionPct: 0.12,
        comisionNeta: 456,
        ivaPct: 0.21,
        ivaImporte: 95.76,
        totalLiquidable: 551.76
      }
    ];

    const draft = generateAutoInvoiceDraft(partner, commissionEvents);

    return NextResponse.json({
      success: true,
      draft,
      slaNotice: 'Liquidación programada a 7 días hábiles bancarios bajo protocolo EAR OS v2.'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Error al generar borrador de autofactura' },
      { status: 500 }
    );
  }
}
