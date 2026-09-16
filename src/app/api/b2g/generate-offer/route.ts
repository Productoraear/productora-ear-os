import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const TENDERS_PATH = path.join(process.cwd(), 'src', 'data', 'b2g', 'placsp_harvested_tenders.json');

export async function POST(req: NextRequest) {
  try {
    const { expediente_id } = await req.json();

    if (!expediente_id) {
      return NextResponse.json({ error: 'expediente_id es obligatorio' }, { status: 400 });
    }

    if (!fs.existsSync(TENDERS_PATH)) {
      return NextResponse.json({ error: 'Bóveda de licitaciones no encontrada' }, { status: 404 });
    }

    const tenders = JSON.parse(fs.readFileSync(TENDERS_PATH, 'utf-8'));
    const tender = tenders.find((t: any) => t.expediente_id === expediente_id);

    if (!tender) {
      return NextResponse.json({ error: `Expediente ${expediente_id} no localizado` }, { status: 404 });
    }

    // SSOT: Ajuste preventivo Art. 118 LCSP (< 14.250 €)
    const rawBase = tender.desglose_economico?.oferta_base_eur || 14155;
    const baseAmount = Math.min(rawBase, 14250);
    const ivaAmount = Number((baseAmount * 0.21).toFixed(2));
    const totalAmount = Number((baseAmount + ivaAmount).toFixed(2));

    const dossierContent = {
      id: `DOSSIER-${tender.expediente_id}`,
      fecha_emision: new Date().toISOString(),
      entidad_contratante: tender.entidad_publica,
      codigo_dir3: tender.codigo_dir3,
      provincia: tender.provincia,
      objeto_contrato: tender.objeto_contrato,
      marco_legal: "Artículo 118 Ley 9/2017 LCSP (Contratos Menores de Servicios)",
      adjudicatario_propuesto: "Productora EAR S.L. / Edwin Agudelo (Exclusividad Art. 168.a.2º LCSP)",
      desglose_economico_final: {
        base_imponible_eur: baseAmount,
        iva_21_eur: ivaAmount,
        total_adjudicacion_eur: totalAmount,
        ajuste_preventivo_lcsp: "CUMPLE < 14.250,00 €"
      },
      prescripcion_tecnica: {
        rider: tender.prescripcion_tecnica?.rider_acustico || "Bose F1 Model 812 Dual Array + Subgraves F1 + Microfonía Shure Axient Digital",
        presion_acustica: "12 W/pax Homologada (< 75 dB SPL en perímetro)",
        artista_exclusivo: "Edwin Agudelo (Exclusividad Art. 168.a.2º LCSP)",
        seguro_rc: "Póliza Responsabilidad Civil 1.000.000 € (Vigente)"
      },
      memorias: {
        memoria_justificativa: tender.memorias_autogeneradas?.memoria_justificativa || `La presente contratación se ampara en el Art. 118 LCSP para cubrir las necesidades de producción musical y sonorización en ${tender.entidad_publica}, acreditando solvencia e idoneidad técnica.`,
        insuficiencia_medios: tender.memorias_autogeneradas?.informe_insuficiencia_medios || `Se acredita la insuficiencia de medios técnicos propios del consistorio para la producción sonora de alta fidelidad bajo normativa de limitadores acústicos.`,
        declaracion_responsable: tender.memorias_autogeneradas?.declaracion_responsable || `Certificación de no estar incurso en prohibición de contratar y hallarse al corriente de obligaciones tributarias y de la Seguridad Social.`
      },
      hash_integridad_sha256: crypto.createHash('sha256').update(`${tender.expediente_id}-${totalAmount}-${Date.now()}`).digest('hex')
    };

    return NextResponse.json({
      success: true,
      dossier: dossierContent
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al generar expediente' }, { status: 500 });
  }
}