#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ANTIGRAVITY OMEGA v4.1 — GENERADOR DEL DOSSIER OFICIAL DE EMBAJADORES CULTURALES B2G
=====================================================================================
Genera el Dossier Institucional S-Class en HTML y lo compila a PDF vectorial de alta
resolución mediante Playwright para distribución a los 217 contactos de FITUR 2026.
"""
import os
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE_DIR = Path(__file__).resolve().parent.parent
DOSSIERS_DIR = BASE_DIR / "docs" / "dossiers"
PUBLIC_DOSSIERS_DIR = BASE_DIR / "public" / "dossiers"

DOSSIERS_DIR.mkdir(parents=True, exist_ok=True)
PUBLIC_DOSSIERS_DIR.mkdir(parents=True, exist_ok=True)

HTML_OUTPUT = DOSSIERS_DIR / "DOSSIER_OFICIAL_EMBAJADORES_CULTURALES_B2G.html"
PDF_DOCS_OUTPUT = DOSSIERS_DIR / "DOSSIER_OFICIAL_EMBAJADORES_CULTURALES_B2G.pdf"
PDF_PUBLIC_OUTPUT = PUBLIC_DOSSIERS_DIR / "dossier-embajadores-culturales-fitur-2026.pdf"

HTML_CONTENT = """<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Dossier Oficial: Programa Soberano de Embajadores Culturales B2G — Productora EAR</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Inter:wght@300;400;600;700&family=JetBrains+Mono:wght@400;700&display=swap');

    @page {
      size: A4;
      margin: 18mm 16mm 18mm 16mm;
      @bottom-right {
        content: "Pág. " counter(page);
        font-family: 'JetBrains Mono', monospace;
        font-size: 8pt;
        color: #71717a;
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', sans-serif;
      background-color: #ffffff;
      color: #18181b;
      line-height: 1.55;
      font-size: 10pt;
    }

    .page {
      page-break-after: always;
      position: relative;
      min-height: 100%;
    }

    .page:last-child {
      page-break-after: avoid;
    }

    /* HEADER CORPORATIVO */
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #ecb613;
      padding-bottom: 12px;
      margin-bottom: 24px;
    }

    .brand-title {
      font-family: 'Cinzel', serif;
      font-size: 18pt;
      font-weight: 900;
      letter-spacing: 1.5px;
      color: #09090b;
    }

    .brand-subtitle {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #71717a;
      margin-top: 2px;
    }

    .badge-protocol {
      background: #09090b;
      color: #ecb613;
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
      text-transform: uppercase;
    }

    /* TÍTULOS Y PORTADA */
    .cover-hero {
      text-align: center;
      padding: 40px 10px 30px 10px;
    }

    .cover-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      color: #d97706;
      background: #fef3c7;
      padding: 5px 12px;
      border-radius: 20px;
      display: inline-block;
      margin-bottom: 16px;
      font-weight: 700;
      text-transform: uppercase;
    }

    h1 {
      font-family: 'Cinzel', serif;
      font-size: 24pt;
      font-weight: 900;
      line-height: 1.25;
      color: #09090b;
      margin-bottom: 14px;
    }

    h2 {
      font-family: 'Cinzel', serif;
      font-size: 14pt;
      font-weight: 700;
      color: #09090b;
      border-left: 3.5px solid #ecb613;
      padding-left: 10px;
      margin: 22px 0 12px 0;
    }

    h3 {
      font-family: 'Inter', sans-serif;
      font-size: 11pt;
      font-weight: 700;
      color: #27272a;
      margin: 14px 0 6px 0;
    }

    p {
      margin-bottom: 10px;
      color: #3f3f46;
      font-size: 9.5pt;
      text-align: justify;
    }

    /* GRID Y CAJAS DESTACADAS */
    .metric-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin: 20px 0;
    }

    .metric-card {
      background: #f4f4f5;
      border: 1px solid #e4e4e7;
      border-radius: 8px;
      padding: 12px 8px;
      text-align: center;
    }

    .metric-val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14pt;
      font-weight: 700;
      color: #09090b;
    }

    .metric-label {
      font-size: 7pt;
      text-transform: uppercase;
      color: #71717a;
      font-weight: 600;
      margin-top: 4px;
    }

    .callout-box {
      background: #fafafa;
      border: 1px solid #e4e4e7;
      border-left: 4px solid #09090b;
      padding: 14px;
      border-radius: 6px;
      margin: 16px 0;
      font-size: 9pt;
    }

    .callout-gold {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-left: 4px solid #ecb613;
    }

    /* TABLAS S-CLASS */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      font-size: 8.5pt;
    }

    th {
      background: #09090b;
      color: #ffffff;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 7.5pt;
      padding: 8px 10px;
      text-align: left;
    }

    td {
      padding: 8px 10px;
      border-bottom: 1px solid #e4e4e7;
      color: #27272a;
    }

    tr:nth-child(even) td {
      background-color: #fafafa;
    }

    .text-right {
      text-align: right;
    }

    .font-mono {
      font-family: 'JetBrains Mono', monospace;
    }

    .signature-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-top: 36px;
      padding-top: 16px;
      border-top: 1px dashed #d4d4d8;
    }

    .signature-box {
      text-align: center;
      font-size: 8.5pt;
      color: #52525b;
    }

    .signature-line {
      margin-top: 40px;
      border-top: 1px solid #09090b;
      padding-top: 6px;
      font-weight: 700;
      color: #09090b;
    }
  </style>
</head>
<body>

  <!-- PÁGINA 1: PORTADA Y SÍNTESIS EJECUTIVA -->
  <div class="page">
    <div class="header-bar">
      <div>
        <div class="brand-title">PRODUCTORA EAR</div>
        <div class="brand-subtitle">División de Gobernanza Cultural & Producción B2G</div>
      </div>
      <div class="badge-protocol">FITUR 2026 // IFEMA MADRID</div>
    </div>

    <div class="cover-hero">
      <div class="cover-tag">EXPEDIENTE TÉCNICO B2G // CONTRATO MENOR ART. 118 LCSP</div>
      <h1>PROGRAMA SOBERANO DE EMBAJADORES CULTURALES Y DIPLOMACIA PÚBLICA</h1>
      <p style="text-align: center; font-size: 11pt; color: #52525b; max-width: 90%; margin: 0 auto 20px auto;">
        Servicio llave en mano de producción de gala, rider acústico Bose F1 y mentoría escénica para la dignificación de artistas de su comunidad en FITUR 2026 y recepciones de Estado.
      </p>
    </div>

    <div class="metric-grid">
      <div class="metric-card">
        <div class="metric-val">14.250 €</div>
        <div class="metric-label">Presupuesto Menor LCSP</div>
      </div>
      <div class="metric-card">
        <div class="metric-val">4.85x</div>
        <div class="metric-label">Retorno Social SROI</div>
      </div>
      <div class="metric-card">
        <div class="metric-val">&lt; 75 dB</div>
        <div class="metric-label">Límite Confort SPL</div>
      </div>
      <div class="metric-card">
        <div class="metric-val">80 / 10 / 10</div>
        <div class="metric-label">Split Soberano Artistas</div>
      </div>
    </div>

    <h2>1. Justificación y Asimetría Diplomática</h2>
    <p>
      Las delegaciones de turismo, consulados y gobiernos autonómicos afrontan en FITUR una fricción recurrente: disponen de partidas oficiales de representación y marca exterior, pero las convocatorias artísticas suelen ejecutarse de forma improvisada, con altavoces estridentes que impiden el diálogo de las autoridades o sin cobertura reglamentaria de prevención de riesgos y póliza de responsabilidad civil.
    </p>
    <p>
      <strong>Productora EAR</strong> resuelve esta carencia transformando el encargo en un <strong>expediente administrativo homologado llave en mano</strong>: la institución formaliza un Contrato Menor regulado por el Artículo 118 de la Ley 9/2017 de Contratos del Sector Público, recibiendo dirección artística, equipamiento acústico de conservatorio y una justificación forense de Retorno Social de la Inversión (SROI = 4.85x).
    </p>

    <div class="legal-box">
      <strong>Vía Administrativa Directa (Art. 118 LCSP):</strong> Al fijar el importe base en <strong>14.250,00 € + IVA</strong> (ajuste al 95% del techo legal de 15.000 €), el expediente se tramita por adjudicación directa inmediata sin concurso público, sin riesgo de impugnación y con tramitación electrónica vía punto general de entrada de facturas <strong>FACe</strong>.
    </div>

    <div class="legal-box" style="margin-top: 12px; border-left: 3.5px solid #059669; background: #ecfdf5;">
      <strong>Acreditación Diplomática Previa (Cuerpo Consular):</strong>
      Oficio Oficial de Agradecimiento del <em>Consulado General Central de Colombia en Madrid</em> a Edwin Agudelo y sus Mariachis con motivo del Encuentro Cultural e Inauguración Consular en el Teatro de La Latina ante la Señora Ministra de Relaciones Exteriores. Rigor protocolar y etiqueta de Estado demostrados en recepciones consulares de primer nivel.
    </div>
  </div>

  <!-- PÁGINA 2: ESPECIFICACIONES TÉCNICAS Y REPARTO ECONÓMICO -->
  <div class="page">
    <div class="header-bar">
      <div>
        <div class="brand-title">PRODUCTORA EAR</div>
        <div class="brand-subtitle">Memoria Técnica & Prescripciones de Ejecución</div>
      </div>
      <div class="badge-protocol">PLIEGO TÉCNICO S-CLASS</div>
    </div>

    <h2>2. Contenido Integral del Servicio & Programa de Embajadores Culturales</h2>
    <p>
      El coste del expediente se destina íntegramente a la <strong>inversión técnica en su stand</strong> (sonido Bose F1, iluminación, técnicos audiovisuales y montajes similares a los de ejercicios anteriores), <strong>respetando el precio promedio de sus últimos 2 años</strong>. Como ventaja estratégica exclusiva y sin coste adicional, el programa incluye:
    </p>

    <table>
      <thead>
        <tr>
          <th>Pilar de Servicio</th>
          <th>Descripción Técnica y Operativa</th>
          <th class="text-right">SLA / Garantía</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Edwin Agudelo como E-Manager</strong></td>
          <td>Dirección artística y gestión escénica institucional por <strong>Edwin Agudelo</strong> (+34 años de oficio real). Acompañamiento integral, protocolo diplomático y representación de los valores patrios de la delegación.</td>
          <td class="text-right font-mono">E-Manager Asignado</td>
        </tr>
        <tr>
          <td><strong>Inversión Stand: Audio & Luz</strong></td>
          <td>Montaje completo de stand similar a sus ejercicios anteriores: Columnas Bose F1 Model 812 + microfonía Shure Axient Digital e iluminación calibrada a <strong>12 W/pax</strong> y <strong>&lt; 75 dB SPL</strong>.</td>
          <td class="text-right font-mono">Precio Promedio 2 Años</td>
        </tr>
        <tr>
          <td><strong>Formación: 2 Artistas / 2 Meses</strong></td>
          <td><strong>BONIFICADO (&gt; 1.000 € de valor)</strong>: Selección de 2 artistas emergentes de su colectividad/diáspora para cursar <strong>2 meses de formación con 8 mentorías de alto impacto</strong> con Edwin Agudelo.</td>
          <td class="text-right font-mono">8 Mentorías Élite</td>
        </tr>
        <tr>
          <td><strong>Muestra Artística de Estado</strong></td>
          <td>Puesta en escena de los 2 artistas en su stand/gala de FITUR con repertorio protocolar alineado con la identidad y valores de su país o región.</td>
          <td class="text-right font-mono">Representación Oficial</td>
        </tr>
        <tr>
          <td><strong>Cobertura & Impacto VIMUME</strong></td>
          <td>Póliza RC de 1.000.000 €, altas en Régimen de Artistas y 10% del split soberano destinado a estimulación neurocognitiva 40Hz para mayores de su colectividad.</td>
          <td class="text-right font-mono">SROI 4.85x / Póliza 1M€</td>
        </tr>
      </tbody>
    </table>

    <div class="legal-box" style="margin-top: 12px; border-left: 3.5px solid #d97706; background: #fffbeb;">
      <strong>La Ventaja Diplomática Soberana (Inversión Eficiente + Apoyo a su Diáspora):</strong>
      Su entidad realiza la inversión técnica habitual para su stand de FITUR (sonido, iluminación, técnicos) bajo tarifa blindada en el promedio de sus últimos 2 años. A cambio, recibe la dirección de Edwin Agudelo como <strong>E-Manager</strong> y resolvemos la histórica falta de apoyo a sus talentos locales: 2 artistas de su comunidad reciben 2 meses de formación y 8 mentorías profesionales para brillar en FITUR con rider de gala, sin que la legación gaste un solo euro extra.
    </div>

    <h2>3. Cuadro Económico y Liquidación Soberana</h2>
    <p>
      El modelo garantiza transparencia absoluta y cumplimiento estricto de las directivas europeas de dignificación laboral del sector cultural:
    </p>

    <table>
      <thead>
        <tr>
          <th>Concepto Presupuestario</th>
          <th>Porcentaje</th>
          <th class="text-right">Base Imponible</th>
          <th class="text-right">Total (+IVA 21%)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Remuneración Directa al Colectivo Artístico</strong></td>
          <td>80%</td>
          <td class="text-right font-mono">11.400,00 €</td>
          <td class="text-right font-mono">13.794,00 €</td>
        </tr>
        <tr>
          <td><strong>Operación Técnica, Sonido Bose F1 y Logística EAR</strong></td>
          <td>10%</td>
          <td class="text-right font-mono">1.425,00 €</td>
          <td class="text-right font-mono">1.724,25 €</td>
        </tr>
        <tr>
          <td><strong>Fondo de Investigación y Musicoterapia Social VIMUME</strong></td>
          <td>10%</td>
          <td class="text-right font-mono">1.425,00 €</td>
          <td class="text-right font-mono">1.724,25 €</td>
        </tr>
        <tr style="background: #f4f4f5; font-weight: 700;">
          <td colspan="2"><strong>PRESUPUESTO TOTAL DEL EXPEDIENTE (Art. 118 LCSP)</strong></td>
          <td class="text-right font-mono">14.250,00 €</td>
          <td class="text-right font-mono" style="color: #d97706;">17.242,50 €</td>
        </tr>
      </tbody>
    </table>

    <h2>4. Declaración Responsable y Tramitación</h2>
    <p>
      Productora EAR certifica no estar incursa en ninguna de las prohibiciones de contratar establecidas en el Artículo 71 de la Ley 9/2017 LCSP, hallándose al corriente de sus obligaciones tributarias y con la Seguridad Social.
    </p>

    <div class="signature-grid">
      <div class="signature-box">
        Por el Órgano de Contratación / Consulado General
        <div class="signature-line">Firma y Sello de la Autoridad Competente</div>
      </div>
      <div class="signature-box">
        Por Productora EAR — Dirección General
        <div class="signature-line">Firma: Edwin Agudelo // Productora EAR</div>
      </div>
    </div>
  </div>

</body>
</html>
"""

def generate_pdf():
    print("=" * 72)
    print("ANTIGRAVITY OMEGA v4.1 — GENERACIÓN DE DOSSIER INSTITUCIONAL B2G")
    print("=" * 72)

    # 1. Guardar HTML maestro
    with open(HTML_OUTPUT, "w", encoding="utf-8") as f:
        f.write(HTML_CONTENT)
    print(f"[HTML] Generado en: {HTML_OUTPUT}")

    # 2. Renderizar con Playwright a PDF
    print("[PLAYWRIGHT] Inicializando renderizado vectorial sin márgenes corruptos...")
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            page.set_content(HTML_CONTENT, wait_until="networkidle")
            
            # Exportar a docs/dossiers
            page.pdf(
                path=str(PDF_DOCS_OUTPUT),
                format="A4",
                print_background=True,
                margin={"top": "0mm", "bottom": "0mm", "left": "0mm", "right": "0mm"}
            )
            print(f"[PDF DOCS] Exportado con éxito a: {PDF_DOCS_OUTPUT}")

            # Exportar copia descargable pública a public/dossiers
            page.pdf(
                path=str(PDF_PUBLIC_OUTPUT),
                format="A4",
                print_background=True,
                margin={"top": "0mm", "bottom": "0mm", "left": "0mm", "right": "0mm"}
            )
            print(f"[PDF PUBLIC] Exportado a CDN pública: {PDF_PUBLIC_OUTPUT}")

            browser.close()

        sz_kb = os.path.getsize(PDF_DOCS_OUTPUT) / 1024
        print(f"[COMPLETADO] Dossier PDF generado ({sz_kb:.1f} KB).")
        return 0
    except Exception as e:
        print(f"[ERROR] Error al renderizar PDF con Playwright: {e}")
        return 1

if __name__ == "__main__":
    raise SystemExit(generate_pdf())
