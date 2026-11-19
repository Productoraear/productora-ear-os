import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * ⚡ ACCESO SOBERANO DE EMERGENCIA (EDWIN AGUDELO / CEO)
 * Permite desbloquear el panel administrativo y establecer las cookies de sesión
 * sin fricción de 2FA cuando hay desincronización de dispositivos.
 */
function resolveSafeOrigin(request: NextRequest): string {
  const fwdProto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim();
  const fwdHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim();
  const hostHeader = fwdHost || request.headers.get('host')?.trim() || request.nextUrl.host;
  const proto = fwdProto || (hostHeader.startsWith('localhost') || hostHeader.startsWith('127.0.0.1') ? 'http' : request.nextUrl.protocol.replace(':', '') || 'https');
  const safeHost = hostHeader.replace(/^0\.0\.0\.0(?=[:/]|$)/, 'localhost');
  return `${proto}://${safeHost}`;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = request.nextUrl;
  const pass = (url.searchParams.get('pass') || url.searchParams.get('token') || url.searchParams.get('key') || '').trim();
  const envAdminPassword = (process.env.EAR_ADMIN_PASSWORD || 'Ear2024Ear*').trim();
  const masterPin = (process.env.EAR_MASTER_PIN || '1012').trim();

  const isValid =
    Boolean(pass) &&
    (pass === envAdminPassword ||
      pass === 'Ear2024Ear*' ||
      pass === 'Ear2024Ear**' ||
      pass === '1012' ||
      (masterPin.length >= 4 && pass === masterPin));

  if (isValid) {
    const rawDest = url.searchParams.get('from') || '/admin/control';
    const destination = rawDest.startsWith('/') && !rawDest.startsWith('//') ? rawDest : '/admin/control';
    const redirectUrl = new URL(destination, resolveSafeOrigin(request));
    const response = NextResponse.redirect(redirectUrl);

    const cookieOpts = {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 días de sesión
    };

    response.cookies.set('ear_session', 'sovereign_admin_bypass', cookieOpts);
    response.cookies.set('ear_admin_token', 'sclass_sovereign_bypass_verified', cookieOpts);
    response.cookies.set('ear_role', 'admin', cookieOpts);
    response.cookies.set('ear_user_email', 'productoraear@gmail.com', cookieOpts);
    response.cookies.set('ear_user_name', encodeURIComponent('Edwin Agudelo'), cookieOpts);

    return response;
  }

  // Interfaz HTML directa de desbloqueo si se accede sin parámetros
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Desbloqueo Soberano · EAR OS</title>
  <style>
    body { background: #030305; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
    .card { background: #09090d; border: 1px solid rgba(236,182,19,0.3); border-radius: 24px; padding: 32px; max-width: 420px; width: 100%; box-shadow: 0 0 60px rgba(0,0,0,0.8); }
    h1 { font-size: 20px; margin: 0 0 8px 0; color: #fff; font-weight: 800; }
    p { font-size: 13px; color: #888; margin: 0 0 24px 0; line-height: 1.5; }
    input { width: 100%; padding: 14px; background: #030305; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; color: #ecb613; font-size: 15px; font-family: monospace; box-sizing: border-box; margin-bottom: 16px; }
    input:focus { outline: none; border-color: #ecb613; }
    button { width: 100%; padding: 14px; background: #ecb613; color: #000; border: none; border-radius: 12px; font-size: 13px; font-weight: 800; text-transform: uppercase; cursor: pointer; letter-spacing: 0.05em; }
    button:hover { background: #f6ca3c; }
    .badge { display: inline-block; font-size: 10px; font-family: monospace; color: #ecb613; background: rgba(236,182,19,0.1); border: 1px solid rgba(236,182,19,0.3); padding: 3px 8px; border-radius: 6px; margin-bottom: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">S-CLASS · ACCESO DE EMERGENCIA</div>
    <h1>Desbloqueo Soberano</h1>
    <p>Introduce la contraseña maestra para emitir credenciales administrativas y acceder directamente a los paneles de control.</p>
    <form method="GET" action="/api/auth/sovereign-bypass">
      <input type="password" name="pass" placeholder="Contraseña Master EAR OS" value="Ear2024Ear*" required autofocus />
      <button type="submit">Entrar al Centro de Mando →</button>
    </form>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
