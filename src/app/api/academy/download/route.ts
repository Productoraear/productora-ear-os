import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const doc = searchParams.get('doc') || 'rider';

  if (doc === 'rider' || doc.includes('rider')) {
    const content = `# 📜 RIDER TÉCNICO OFICIAL S-CLASS (PRODUCTORA EAR)
Versión: 2026.4 Homologada
Referencia: EAR-RIDER-B2G-SCLASS

## 1. SISTEMA PRINCIPAL P.A. (FOH)
- Presión Sonora Requerida: 12 W RMS / PAX (Mínimo 102 dBA continuo en posición FOH).
- Equipamiento Acreditado: Bose F1 Model 812 + Subwoofers F1 (o L-Acoustics Syva en recintos >200 m²).
- Cobertura: Cobertura angular de 100° horizontal x 40° vertical.

## 2. MICROFONÍA & R.F.
- Voces Principales: 2x Shure Axient Digital AD4D / Shure QLX-D con cápsulas Beta 58A / KSM8.
- Banda / Mariachi: 4x Shure SM57 para trompetas y vihuela, 1x AKG D112 / Shure Beta 52A para guitarrón.
- In-Ear Monitors: 2x Sennheiser EW IEM G4 (Banda estéreo 500-600 MHz).

## 3. MESA DE MEZCLAS & PROCESAMIENTO
- Consola: Behringer XR18 Digital Air (Control vía iPad Pro 12.9" redundante) / X32 Compact.
- Grabación: Interfaz USB multipista 24-bit / 48 kHz para acta institucional B2G.

## 4. ILUMINACIÓN & ESCENARIO
- Frontal: 4x Focos Par LED Blanco Cálido 3200K (CRI > 90).
- Efectos Pista: 2x Cabezas Móviles Beam 7R DMX + 1x Máquina de Humo Vertical LED Geyser.
- Alimentación Eléctrica: 1x Toma Cetac 16A monofásica o 2x Schuko independientes de 230V / 16A con toma de tierra verificada (< 5 Ohms).

© 2026 Productora EAR • Soberanía Técnica Garantizada
`;
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': 'attachment; filename="Rider_Tecnico_Standard_v2_EAR.md"',
      },
    });
  }

  if (doc === 'contrato' || doc.includes('contrato') || doc.includes('b2g')) {
    const content = `CONTRATO MARCO DE PRESTACIÓN DE SERVICIOS ARTÍSTICOS Y PRODUCCIÓN TÉCNICA
(HOMOLOGADO CONFORME AL ARTÍCULO 118 DE LA LEY 9/2017 DE CONTRATOS DEL SECTOR PÚBLICO - LCSP)

EXPEDIENTE: EAR-B2G-CONTRATO-MENOR-2026

REUNIDOS:
DE UNA PARTE: El Órgano de Contratación / Entidad Promotora / Ayuntamiento / Empresa Contratante.
DE OTRA PARTE: PRODUCTORA EAR (Edwin Agudelo & Cía. S.L. / Productora EAR Ecosistema).

EXPONEN Y ACUERDAN:
CLÁUSULA 1. OBJETO DEL CONTRATO:
La prestación del servicio integral de producción acústica, sonorización, iluminación y actuación artística en directo.

CLÁUSULA 2. PRECIO Y CONDICIONES DE PAGO:
El importe contractual queda fijado bajo el límite legal de Contrato Menor (<15.000 € para servicios).
Split de Liquidación: 80% Retribución Artística Directa / 10% Infraestructura Técnica EAR / 10% Fondo Social VIMUME.

CLÁUSULA 3. SOBERANÍA TÉCNICA & PREVENCIÓN DE RIESGOS:
Productora EAR garantiza que todos los equipos cumplen la normativa CE y el reglamento de baja tensión, con seguro de Responsabilidad Civil vigente por valor de 600.000 €.

En prueba de conformidad, se firma digitalmente en fecha del sistema.
`;
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'attachment; filename="Contrato_Actuacion_B2G_B2B_LCSP118.txt"',
      },
    });
  }

  if (doc === 'split' || doc.includes('royalties') || doc.includes('split')) {
    const content = `Concepto,Porcentaje,Destinatario,Garantia_Blockchain,Liquidacion_Dias
Cache_Artista_Directo,80%,Artista Principal y Musicos,SHA256_PRICE_LOCK,Inmediata (24h)
Infraestructura_Acustica,10%,Productora EAR OS,Mantenimiento_Bose_Shure,Mensual
Impacto_Social_VIMUME,10%,Fundacion Neuro-Reminiscencia 40Hz,Certificado_NextGenEU,Trimestral
`;
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="Split_Sheet_Royalties_Protocol_80_10_10.csv"',
      },
    });
  }

  // Checklist Bose
  const content = `# 📋 CHECKLIST PRE-SHOW & SONORIZACIÓN BOSE F1 / SHURE (S-CLASS)

## FASE 1: CALIBRACIÓN DE ESPACIO (T - 3 HORAS)
- [ ] Medición de m² del recinto y cálculo acústico (12W RMS / pax).
- [ ] Verificación de toma de corriente (230V, fase/neutro/tierra).
- [ ] Posicionamiento de columnas Bose F1 (altura mínima del driver superior: 2.10m).
- [ ] Configuración del arreglo flexible (Patrón C para graderíos, Recto para salas llanas).

## FASE 2: REDUNDANCIA & RF WIRELESS (T - 2 HORAS)
- [ ] Escaneo espectral con Shure Wireless Workbench (bandas libres de interferencias 470-698 MHz).
- [ ] Verificación de baterías de litio (100% carga en micrófonos inalámbricos).
- [ ] Asignación de canales en Behringer XR18: Canales 1-2 Voces, 3-6 Acústicos, 7-8 Pista/FOH.

## FASE 3: LINE CHECK & SOUND CHECK (T - 1 HORA)
- [ ] Ganancias ajustadas a -18 dBFS de media (evitar clip digital en el preamplificador).
- [ ] Verificación de acoples (Filtro Notch en 2.5 kHz y 4 kHz si fuera necesario).
- [ ] Firma y validación del Price-Lock y protocolo de actuación.

© Productora EAR • Cero Errores en Directo.
`;
  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'attachment; filename="Checklist_PreShow_Bose_F1_Shure.md"',
    },
  });
}
