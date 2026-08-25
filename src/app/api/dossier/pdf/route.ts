import { NextRequest, NextResponse } from 'next/server';
import { PriceLockEngine } from '@/features/finance/services/PriceLockEngine';
import { CENTRALITA } from '@/lib/phone-constants';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  const service = searchParams.get('service') || 'Producción Técnica Audiovisual y Actuación Musical';
  const location = searchParams.get('location') || 'Madrid';
  const date = searchParams.get('date') || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
  const total = Number(searchParams.get('total')) || 1240;
  const pax = Number(searchParams.get('pax')) || 150;
  const clientName = searchParams.get('client') || 'Dirección de Contratación';

  let quote = PriceLockEngine.generateQuote({
    serviceName: service,
    location,
    eventDate: date,
    baseAmount: total,
    pax,
    clientName,
  });

  if (token) {
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64url').toString('utf8'));
      quote.hash = decoded.h || quote.hash;
      quote.pricing.totalAmount = decoded.t || quote.pricing.totalAmount;
      quote.client.location = decoded.loc || quote.client.location;
    } catch (e) {
      console.warn('Token decoding fallback:', e);
    }
  }

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Dossier Oficial S-Class & Price-Lock | Productora EAR</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;800;900&family=JetBrains+Mono:wght@400;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Montserrat', sans-serif;
      background-color: #050505;
      color: #ffffff;
      padding: 40px;
      line-height: 1.5;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      border: 2px solid #ecb613;
      border-radius: 24px;
      padding: 40px;
      background: linear-gradient(180deg, #0d0d0d 0%, #050505 100%);
      box-shadow: 0 0 50px rgba(236, 182, 19, 0.15);
      position: relative;
    }

    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-size: 110px;
      font-weight: 900;
      color: rgba(236, 182, 19, 0.03);
      pointer-events: none;
      z-index: 0;
      text-transform: uppercase;
    }
    
    header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid rgba(236, 182, 19, 0.3);
      padding-bottom: 25px;
      margin-bottom: 30px;
      position: relative;
      z-index: 1;
    }
    
    .brand h1 {
      font-size: 24px;
      font-weight: 900;
      color: #ecb613;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    
    .brand p {
      font-size: 11px;
      color: #888888;
      font-family: 'JetBrains Mono', monospace;
    }
    
    .badge {
      background: rgba(236, 182, 19, 0.1);
      border: 1px solid #ecb613;
      color: #ecb613;
      padding: 6px 14px;
      border-radius: 100px;
      font-size: 10px;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .section-title {
      font-size: 13px;
      color: #ecb613;
      font-family: 'JetBrains Mono', monospace;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 25px;
      position: relative;
      z-index: 1;
    }
    
    .card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 18px;
    }
    
    .card h3 {
      font-size: 11px;
      color: #777;
      text-transform: uppercase;
      margin-bottom: 6px;
      font-family: 'JetBrains Mono', monospace;
    }
    
    .card p {
      font-size: 15px;
      font-weight: 700;
      color: #fff;
    }
    
    .table-container {
      margin-bottom: 25px;
      position: relative;
      z-index: 1;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    
    th {
      text-align: left;
      padding: 10px 14px;
      background: rgba(236, 182, 19, 0.08);
      color: #ecb613;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 10px;
    }
    
    td {
      padding: 12px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: #ccc;
    }
    
    .total-row {
      font-size: 15px;
      font-weight: 800;
      color: #ecb613;
      background: rgba(236, 182, 19, 0.05);
    }
    
    .signatures {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 30px;
      margin-top: 35px;
      padding-top: 25px;
      border-top: 1px dashed rgba(255, 255, 255, 0.15);
      position: relative;
      z-index: 1;
    }
    
    .signature-box {
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 15px;
      min-height: 100px;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    .signature-box span {
      font-size: 10px;
      color: #666;
      font-family: 'JetBrains Mono', monospace;
      text-transform: uppercase;
    }
    
    .hash-seal {
      margin-top: 20px;
      padding: 12px;
      background: rgba(0, 0, 0, 0.6);
      border: 1px solid rgba(236, 182, 19, 0.3);
      border-radius: 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: #ecb613;
      text-align: center;
      position: relative;
      z-index: 1;
    }

    .no-print {
      margin-top: 30px;
      text-align: center;
    }

    .btn-print {
      background: #ecb613;
      color: #000;
      border: none;
      padding: 12px 28px;
      font-weight: 800;
      font-size: 12px;
      border-radius: 12px;
      cursor: pointer;
      font-family: 'Montserrat', sans-serif;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    @media print {
      body {
        background: #000;
        padding: 0;
      }
      .no-print {
        display: none;
      }
      .container {
        border: none;
        box-shadow: none;
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="watermark">S-CLASS 72H</div>

    <header>
      <div class="brand">
        <h1>PRODUCTORA EAR</h1>
        <p>QUALITY VIP SOLUTIONS, SL · NIF: B87910311</p>
        <p>Central de Producción: ${CENTRALITA.display}</p>
      </div>
      <div class="badge">
        Price-Lock SHA-256 Activo
      </div>
    </header>

    <div class="section-title">01. Identificación y Localización de la Producción</div>
    <div class="grid">
      <div class="card">
        <h3>Cliente / Entidad Solicitante</h3>
        <p>${quote.client.name}</p>
      </div>
      <div class="card">
        <h3>Ubicación / Finca / Espacio</h3>
        <p>${quote.client.location}</p>
      </div>
      <div class="card">
        <h3>Fecha Reservada</h3>
        <p>${quote.client.eventDate}</p>
      </div>
      <div class="card">
        <h3>Aforo Homologado (12 W/pax)</h3>
        <p>${quote.technicalSpecs.pax} PAX · ${quote.technicalSpecs.acousticWatts} W RMS</p>
      </div>
    </div>

    <div class="section-title">02. Configuración Técnica & Rider Homologado</div>
    <div class="card" style="margin-bottom: 25px;">
      <h3>Equipamiento Audiovisual Asignado</h3>
      <p style="font-size: 13px; font-weight: 500; color: #ddd; margin-bottom: 8px;">
        ${quote.technicalSpecs.riderSummary}
      </p>
      <p style="font-size: 11px; color: #ecb613; font-family: 'JetBrains Mono', monospace;">
        ✓ ${quote.technicalSpecs.warranty}
      </p>
    </div>

    <div class="section-title">03. Liquidación Económica & Split Soberano</div>
    <div class="table-container card" style="padding: 0; overflow: hidden;">
      <table>
        <thead>
          <tr>
            <th>Concepto</th>
            <th>Base Imponible</th>
            <th>IVA (21%)</th>
            <th>Total (€)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${quote.client.name} — ${service}</td>
            <td>${quote.pricing.subtotal.toFixed(2)} €</td>
            <td>${quote.pricing.vatAmount.toFixed(2)} €</td>
            <td>${quote.pricing.totalAmount.toFixed(2)} €</td>
          </tr>
          <tr class="total-row">
            <td colspan="3">DEPÓSITO DE BLOQUEO DE FECHA (Price-Lock 72h)</td>
            <td>${quote.pricing.depositRequired.toFixed(2)} €</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="hash-seal">
      SELLO CRIPTOGRÁFICO: ${quote.hash}<br>
      VÁLIDO HASTA: ${quote.expiresAt} · VERIFICACIÓN OFICIAL DE DISPONIBILIDAD
    </div>

    <div class="signatures">
      <div class="signature-box">
        <span>Por la Dirección Técnica (Productora EAR):</span>
        <div style="font-size: 11px; font-weight: 700; color: #ecb613;">
          Edwin Agudelo · Dirección General<br>
          <span style="font-size: 9px; color: #888;">Certificado Digital Emitido</span>
        </div>
      </div>
      <div class="signature-box">
        <span>Por la Entidad Contratante / Docusign:</span>
        <div style="font-size: 11px; color: #aaa; border-bottom: 1px solid #333; padding-bottom: 4px;">
          Firma Electrónica / Aceptación de Presupuesto
        </div>
      </div>
    </div>

    <div class="no-print">
      <button class="btn-print" onclick="window.print()">🖨️ Descargar e Imprimir PDF Oficial</button>
    </div>
  </div>
</body>
</html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
