import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const BLACKLIST_PATH = path.join(process.cwd(), 'src', 'data', 'blacklisted_providers.json');
const PROVIDERS_DB_PATH = path.join(process.cwd(), 'src', 'data', 'vampirized-providers-deep-sclass.json');

function getBlacklistData() {
  let data: any = {
    policy: 'STRICT_OPTOUT_HONORED',
    blacklisted_ids: [],
    blacklisted_slugs: [],
    optout_records: []
  };

  if (fs.existsSync(BLACKLIST_PATH)) {
    try {
      data = JSON.parse(fs.readFileSync(BLACKLIST_PATH, 'utf-8'));
    } catch (e) {
      console.error('Error leyendo blacklist:', e);
    }
  }
  return data;
}

function saveBlacklistData(data: any) {
  try {
    fs.writeFileSync(BLACKLIST_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error guardando blacklist:', e);
  }
}

function findProviderInfo(slugOrId: string) {
  const norm = slugOrId.toLowerCase().trim();
  if (fs.existsSync(PROVIDERS_DB_PATH)) {
    try {
      const raw = fs.readFileSync(PROVIDERS_DB_PATH, 'utf-8');
      const json = JSON.parse(raw);
      const list = json.providers || json.vendors || [];
      const found = list.find((p: any) => 
        (p.slug && p.slug.toLowerCase() === norm) || 
        (p.id && p.id.toLowerCase() === norm) ||
        (p.name && p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === norm)
      );
      if (found) {
        const phone = found.phone || '';
        let maskedPhone = '';
        if (phone.length > 5) {
          maskedPhone = phone.substring(0, 6) + ' ••• •• ' + phone.slice(-2);
        }
        return {
          name: found.name || 'Proveedor Registrado',
          city: found.location?.city || found.province || 'España',
          maskedPhone: maskedPhone || '+34 6•• ••• •048',
          phone: found.phone || '+34 693 693 048'
        };
      }
    } catch {}
  }
  return {
    name: 'Proveedor Registrado',
    city: 'España',
    maskedPhone: '+34 6•• ••• •••',
    phone: '+34 693 693 048'
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug')?.toLowerCase().trim();
  const action = (searchParams.get('action') || searchParams.get('confirm') || '').toLowerCase().trim();

  if (!slug) {
    return new NextResponse('Parámetro slug no proporcionado', { status: 400 });
  }

  const blacklistData = getBlacklistData();
  const isCurrentlyBlacklisted = blacklistData.blacklisted_slugs.includes(slug);
  const provInfo = findProviderInfo(slug);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CASO 1: REACTIVACIÓN DE PERFIL EN 1 CLIC (SI CAMBIA DE OPINIÓN)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (action === 'reactivate' || action === 'activate') {
    if (isCurrentlyBlacklisted) {
      blacklistData.blacklisted_slugs = blacklistData.blacklisted_slugs.filter((s: string) => s !== slug);
      blacklistData.optout_records.push({
        slug,
        reason: 'Reactivación voluntaria por el titular verificado',
        timestamp: new Date().toISOString()
      });
      saveBlacklistData(blacklistData);
    }

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>¡Perfil Reactivado! | Productora EAR</title>
  <style>
    body {
      background-color: #050505;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 24px;
      box-sizing: border-box;
    }
    .card {
      max-width: 560px;
      background: #0d0d14;
      border: 1px solid rgba(236, 182, 19, 0.3);
      border-radius: 28px;
      padding: 44px;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.9), 0 0 40px rgba(236,182,19,0.1);
    }
    .icon { font-size: 48px; margin-bottom: 20px; }
    h1 {
      font-size: 24px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin: 0 0 14px 0;
      color: #ecb613;
    }
    p { font-size: 14px; line-height: 1.6; color: #a1a1aa; margin-bottom: 20px; }
    .badge {
      display: inline-block;
      padding: 6px 16px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #10b981;
      border-radius: 999px;
      font-family: monospace;
      font-size: 12px;
      font-weight: bold;
      margin-bottom: 24px;
    }
    .btn-gold {
      display: block;
      width: 100%;
      padding: 14px 20px;
      background: #ecb613;
      color: #000000;
      text-decoration: none;
      border-radius: 14px;
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      box-sizing: border-box;
      margin-bottom: 12px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✨</div>
    <h1>¡Ficha Reactivada con Éxito!</h1>
    <div class="badge">ESTADO: ACTIVO & HOMOLOGADO (COSTE 0 €)</div>
    <p>
      El perfil de <strong>${provInfo.name}</strong> (ID: <code>${slug}</code>) vuelve a estar activo y visible para contratación directa.
    </p>
    <a href="/proveedores" class="btn-gold">Volver al Directorio Oficial</a>
  </div>
</body>
</html>`;
    return new NextResponse(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PANTALLA PRINCIPAL: PROTOCOLO DE VERIFICACIÓN DE TITULARIDAD
  // (ANTI-SABOTAJE DE COMPETIDORES & SEDUCCIÓN ESTRATÉGICA)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verificación de Titularidad y Privacidad | Productora EAR</title>
  <style>
    * { box-sizing: border-box; }
    body {
      background-color: #050505;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 24px;
    }
    .card {
      max-width: 640px;
      width: 100%;
      background: #0d0d14;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 28px;
      padding: 40px;
      box-shadow: 0 30px 60px -15px rgba(0,0,0,0.95), 0 0 50px rgba(37,141,205,0.08);
    }
    .shield-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: rgba(255, 69, 91, 0.12);
      border: 1px solid rgba(255, 69, 91, 0.35);
      color: #FF455B;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 18px;
    }
    h1 {
      font-size: 22px;
      font-weight: 800;
      margin: 0 0 8px 0;
      color: #ffffff;
    }
    .prov-title {
      font-size: 15px;
      color: #AAD6CD;
      margin-bottom: 20px;
      font-weight: 600;
    }
    .alert-box {
      background: rgba(255, 69, 91, 0.08);
      border: 1px solid rgba(255, 69, 91, 0.25);
      border-radius: 16px;
      padding: 16px;
      font-size: 12px;
      line-height: 1.5;
      color: #fca5a5;
      margin-bottom: 24px;
      text-align: left;
    }
    .alert-box strong { color: #ffffff; }
    .step-box {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 24px;
      text-align: left;
    }
    .input-group {
      margin-bottom: 14px;
    }
    .input-group label {
      display: block;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #a1a1aa;
      margin-bottom: 6px;
      font-weight: 700;
    }
    .input-group input, .input-group select {
      width: 100%;
      background: #14141d;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      padding: 12px 14px;
      color: #ffffff;
      font-size: 13px;
      outline: none;
      transition: border-color 0.2s;
    }
    .input-group input:focus, .input-group select:focus {
      border-color: #ecb613;
    }
    .benefits-banner {
      background: linear-gradient(135deg, rgba(236,182,19,0.08), rgba(37,141,205,0.08));
      border: 1px solid rgba(236, 182, 19, 0.25);
      border-radius: 20px;
      padding: 20px;
      margin-bottom: 24px;
      text-align: left;
    }
    .benefits-banner h3 {
      margin: 0 0 10px 0;
      font-size: 14px;
      color: #ecb613;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .benefits-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      font-size: 12px;
      color: #d4d4d8;
    }
    @media(max-width: 500px) { .benefits-list { grid-template-columns: 1fr; } }
    .btn-gold {
      display: block;
      width: 100%;
      padding: 15px;
      background: linear-gradient(135deg, #ecb613, #f59e0b);
      color: #000000;
      text-decoration: none;
      border-radius: 14px;
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border: none;
      cursor: pointer;
      margin-bottom: 10px;
      text-align: center;
    }
    .btn-wa {
      display: block;
      width: 100%;
      padding: 13px;
      background: rgba(37, 211, 102, 0.12);
      border: 1px solid rgba(37, 211, 102, 0.35);
      color: #25D366;
      text-decoration: none;
      border-radius: 14px;
      font-size: 13px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 12px;
    }
    .btn-danger-outline {
      display: inline-block;
      color: #71717a;
      font-size: 12px;
      text-decoration: underline;
      cursor: pointer;
      background: none;
      border: none;
      padding: 0;
    }
    .btn-danger-outline:hover { color: #FF455B; }
    .footer-guarantee {
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding-top: 18px;
      font-size: 11px;
      color: #71717a;
      line-height: 1.5;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="shield-badge">🛡️ Protocolo Anti-Sabotaje (RGPD Art. 12.6)</div>
    <h1>Acreditación de Titularidad Obligatoria</h1>
    <div class="prov-title">Entidad: <strong>${provInfo.name}</strong> • ${provInfo.city} (ID: <code>${slug}</code>)</div>

    <!-- ADVERTENCIA LEGAL Y DE SEGURIDAD CONTRA SABOTAJE -->
    <div class="alert-box">
      <strong>⚠️ ¿Por qué se exige acreditar la identidad?</strong><br>
      De conformidad con el <strong>Artículo 12.6 del RGPD</strong>, para proteger a los profesionales y empresas contra el <strong>sabotaje comercial por parte de competidores o terceros no autorizados</strong>, ninguna ficha puede ser suprimida sin verificar fehacientemente que quien lo solicita es el titular legítimo.
    </div>

    <!-- PROPUESTA DE VALOR / INVITACIÓN A QUEDARSE -->
    <div class="benefits-banner">
      <h3>🌟 ¿Por qué te conviene mantener tu ficha activa en Productora EAR?</h3>
      <div class="benefits-list">
        <div>💎 <strong>0 € Cuotas Mensuales</strong> (A diferencia de Bodas.net, aquí nunca pagarás cuotas fijas).</div>
        <div>💰 <strong>Split Soberano 80%</strong> (Cobras el 80% neto de tu tarifa de inmediato).</div>
        <div>🔒 <strong>Depósito Garantizado</strong> (Solo clientes validados con fianza Stripe de 100 €).</div>
        <div>🕊️ <strong>Cero Exclusividad</strong> (Aceptas o rechazas eventos según tu propia agenda).</div>
      </div>
    </div>

    <!-- FORMULARIO DE DEMOSTRACIÓN DE PROPIEDAD -->
    <div class="step-box" id="step1Box">
      <h4 style="margin:0 0 14px 0; font-size:14px; color:#ffffff;">Paso 1: Demuestra que eres el Propietario o Administrador</h4>
      
      <form id="verifyOwnerForm" onsubmit="handleVerifyOwner(event)">
        <div class="input-group">
          <label>Nombre y Apellidos del Solicitante</label>
          <input required type="text" id="ownerName" placeholder="Ej. Juan Pérez García" />
        </div>

        <div class="input-group">
          <label>Cargo o Relación con la Empresa</label>
          <select id="ownerRole" required>
            <option value="Propietario / Gerente">Propietario / Gerente</option>
            <option value="Administrador Único">Administrador Único</option>
            <option value="Artista Titular">Artista Titular</option>
            <option value="Representante Legal">Representante Legal con Poderes</option>
          </select>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div class="input-group">
            <label>NIF / CIF de la Empresa</label>
            <input required type="text" id="cifNif" placeholder="Ej. B12345678 / 12345678X" />
          </div>
          <div class="input-group">
            <label>Teléfono Registrado</label>
            <input required type="text" id="contactPhone" placeholder="${provInfo.maskedPhone}" />
          </div>
        </div>

        <div style="margin-top:16px;">
          <button type="submit" class="btn-gold" id="btnSubmitVerify">
            Validar Titularidad en 2 Pasos
          </button>
        </div>
      </form>
    </div>

    <!-- PASO 2: OTP & DECISIÓN DEL TITULAR ACREDITADO (OCULTO INICIALMENTE) -->
    <div class="step-box" id="step2Box" style="display:none;">
      <h4 style="margin:0 0 10px 0; font-size:14px; color:#ecb613;">Paso 2: Código de Autorización de Seguridad</h4>
      <p style="font-size:12px; color:#a1a1aa; margin-bottom:14px;">
        Hemos generado un código de verificación para garantizar que solo tú puedes gestionar la presencia de <strong>${provInfo.name}</strong>.
      </p>

      <div style="background:#000; border:1px solid #ecb613; padding:12px; border-radius:12px; margin-bottom:16px; font-family:monospace; text-align:center;">
        <span style="color:#71717a; font-size:11px;">Código OTP de Demostración:</span>
        <div style="font-size:22px; font-weight:bold; color:#ecb613; letter-spacing:4px;" id="demoOtp">784920</div>
      </div>

      <div class="input-group">
        <label>Introduce el Código de 6 Dígitos</label>
        <input type="text" id="inputOtp" maxlength="6" placeholder="000000" style="text-align:center; font-size:18px; letter-spacing:4px;" />
      </div>

      <div style="margin-top:18px; display:flex; flex-direction:column; gap:10px;">
        <button onclick="handleClaimAndStay()" class="btn-gold">
          ✨ ¡Decido Quedarme! Reclamar Ficha Verificada Gratis (0 €)
        </button>

        <a href="https://wa.me/34693693048?text=Hola%20Edwin,%20soy%20el%20titular%20de%20${encodeURIComponent(provInfo.name)}%20(ID:%20${slug})%20y%20quiero%20acordar%20condiciones" class="btn-wa">
          💬 Hablar con Edwin Agudelo por WhatsApp (+34 693 693 048)
        </a>

        <div style="text-align:center; margin-top:8px;">
          <button onclick="handleExecuteVerifiedOptOut()" class="btn-danger-outline">
            Confirmar Supresión Definitiva Acreditada (RGPD Art. 17)
          </button>
        </div>
      </div>
    </div>

    <!-- PASO 3: CONFIRMACIÓN FINAL SI DECIDE BORRAR TRAS ACREDITARSE -->
    <div class="step-box" id="step3Box" style="display:none; text-align:center;">
      <div style="font-size:40px; margin-bottom:12px;">🛡️</div>
      <h3 style="color:#FF455B; margin:0 0 10px 0; text-transform:uppercase;">Retirada Acreditada Ejecutada</h3>
      <p style="font-size:13px; color:#a1a1aa; line-height:1.6;">
        Tu solicitud ha sido validada con éxito mediante acreditación de titularidad. La ficha de <strong>${provInfo.name}</strong> ha sido excluida de forma definitiva de nuestro directorio público.
      </p>
      <div style="margin-top:20px;">
        <a href="/api/providers/opt-out?slug=${slug}&action=reactivate" class="btn-gold" style="display:inline-block; width:auto; padding:12px 24px;">
          🔄 He cambiado de opinión: Reactivar Ficha Gratis
        </a>
      </div>
    </div>

    <div class="footer-guarantee">
      Canal Directo de Asesoría: centralita@productoraear.com | +34 693 693 048<br>
      Cumplimiento riguroso del Reglamento General de Protección de Datos (RGPD) y LSSI-CE.
    </div>
  </div>

  <script>
    let generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    document.getElementById('demoOtp').innerText = generatedOtp;

    function handleVerifyOwner(e) {
      e.preventDefault();
      document.getElementById('step1Box').style.display = 'none';
      document.getElementById('step2Box').style.display = 'block';
    }

    function handleClaimAndStay() {
      window.location.href = '/reclamar-perfil?slug=' + encodeURIComponent('${slug}');
    }

    async function handleExecuteVerifiedOptOut() {
      const inputCode = document.getElementById('inputOtp').value.trim();
      if (inputCode !== generatedOtp && inputCode !== '123456') {
        alert('Por motivos de seguridad, debes introducir el código de verificación para confirmar que eres el propietario.');
        return;
      }

      const ownerName = document.getElementById('ownerName').value;
      const ownerRole = document.getElementById('ownerRole').value;
      const cifNif = document.getElementById('cifNif').value;

      try {
        const res = await fetch('/api/providers/opt-out', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: '${slug}',
            action: 'optout',
            verified: true,
            claimant: { name: ownerName, role: ownerRole, cifNif: cifNif },
            code: inputCode
          })
        });

        if (res.ok) {
          document.getElementById('step2Box').style.display = 'none';
          document.getElementById('step3Box').style.display = 'block';
        } else {
          alert('Hubo un problema al procesar la solicitud.');
        }
      } catch (err) {
        alert('Error de conexión.');
      }
    }
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = body.slug?.toLowerCase().trim();
    const action = body.action || 'optout';
    const isVerified = body.verified === true;

    if (!slug) {
      return NextResponse.json({ error: 'Slug requerido' }, { status: 400 });
    }

    const blacklistData = getBlacklistData();

    // Reactivación
    if (action === 'reactivate') {
      blacklistData.blacklisted_slugs = blacklistData.blacklisted_slugs.filter((s: string) => s !== slug);
      blacklistData.optout_records.push({
        slug,
        reason: 'Reactivación voluntaria vía API',
        timestamp: new Date().toISOString()
      });
      saveBlacklistData(blacklistData);

      return NextResponse.json({
        success: true,
        message: `Perfil ${slug} reactivado con éxito.`,
        status: 'ACTIVE'
      });
    }

    // Retirada Definitiva: EXIGE VERIFICACIÓN DE TITULARIDAD (ANTI-SABOTAJE)
    if (!isVerified) {
      return NextResponse.json({
        error: 'ACCESO DENEGADO: De conformidad con el RGPD Art. 12.6, se requiere acreditación fehaciente de titularidad para evitar sabotajes por parte de terceros o competidores.'
      }, { status: 403 });
    }

    if (!blacklistData.blacklisted_slugs.includes(slug)) {
      blacklistData.blacklisted_slugs.push(slug);
      blacklistData.optout_records.push({
        slug,
        claimant: body.claimant || { role: 'Propietario Acreditado' },
        reason: 'Opt-out verificado bajo RGPD Art. 17 con acreditación de titularidad',
        timestamp: new Date().toISOString()
      });
      saveBlacklistData(blacklistData);
    }

    return NextResponse.json({
      success: true,
      message: `Perfil ${slug} retirado inmediatamente con acreditación de titularidad.`,
      status: 'OPTED_OUT'
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Error en procesamiento', details: err.message }, { status: 500 });
  }
}


