import { NextRequest, NextResponse } from 'next/server';
import { 
  validateDIR3Trio, 
  calculateLCSPMinorContract, 
  generateFacturaeXML,
  DIR3Codes,
  B2GPackageItem
} from '@/lib/b2g-tender-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      entidad = 'Ayuntamiento de Toledo',
      cif = 'P4516800E',
      dir3 = {
        oficinaContable: 'L01451688',
        organoGestor: 'L01451688',
        unidadTramitadora: 'L01451688'
      },
      items = [
        {
          id: 'srv-fiestas-patronales',
          name: 'Producción Fiestas Patronales & Sonido 18W/pax',
          unitPrice: 6500,
          quantity: 1,
          category: 'CULTURA_FESTEJOS',
          description: 'Sonorización Line Array Bose F1 / L-Acoustics y robótica DMX'
        },
        {
          id: 'srv-pantallas-led-p26',
          name: 'Pantalla LED P2.6 Outdoor > 5.500 nits',
          unitPrice: 2800,
          quantity: 1,
          category: 'PANTALLAS_LED',
          description: 'Mural modular de hiperbrillo exterior con escalador 4K'
        },
        {
          id: 'srv-vimume-institucional',
          name: 'Intervención Neuroacústica VIMUME Senior (ODS 3, 10, 11)',
          unitPrice: 4200,
          quantity: 1,
          category: 'VIMUME_SENIOR',
          description: 'Sesión biográfica para mayores en residencia municipal'
        }
      ]
    } = body;

    // Validación formal de los 3 códigos DIR3
    const dir3Validation = validateDIR3Trio(dir3);
    if (!dir3Validation.valid) {
      return NextResponse.json({
        success: false,
        error: 'Códigos DIR3 no conformes al estándar de FACe.',
        details: dir3Validation.errors
      }, { status: 400 });
    }

    // Cálculo y empaquetamiento del contrato menor
    const proposal = calculateLCSPMinorContract(items as B2GPackageItem[], entidad, cif, dir3 as DIR3Codes);

    // Generación del XML Facturae v3.2.2
    const facturaeXML = generateFacturaeXML(proposal);

    return NextResponse.json({
      success: true,
      expediente: proposal.expedienteRef,
      presupuestoBaseSinIva: proposal.presupuestoBaseSinIva,
      cuotaIva21: proposal.cuotaIva21,
      totalLicitacion: proposal.importeTotalLicitacion,
      ajustePreventivoAplicado: proposal.ajustePreventivoAplicado,
      odsAlineados: proposal.odsAlineados,
      sha256Integridad: proposal.sha256Integridad,
      facturaeXML,
      normativa: {
        marcoLegal: 'Art. 118 Ley 9/2017 de Contratos del Sector Público (LCSP)',
        techoLegal: 14990.00,
        techoSeguridadAplicado: 14250.00,
        portalTramitacion: 'Punto General de Entrada de Facturas Electrónicas (FACe)'
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Error al generar la factura electrónica Facturae' },
      { status: 500 }
    );
  }
}
