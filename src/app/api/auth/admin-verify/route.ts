import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyGoogleAuthenticator } from '@/lib/totp-engine';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function cleanEnv(val: string | undefined, fallback: string): string {
  if (!val) return fallback.trim().replace(/^["']|["']$/g, '');
  return val.trim().replace(/^["']|["']$/g, '');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, code2fa, method, role, action, bypassSovereign } = body;
    
    const envAdminPassword = cleanEnv(process.env.EAR_ADMIN_PASSWORD, "");
    const envEditorPassword = cleanEnv(process.env.EAR_EDITOR_PASSWORD, "");
    const sovereignMasterPassword = cleanEnv(process.env.EAR_SOVEREIGN_MASTER_PASSWORD, "");
    const totpSecret = cleanEnv(process.env.EAR_ADMIN_2FA_SECRET, "");
    const jwtSecret = cleanEnv(process.env.NEXTAUTH_SECRET, "");

    // Fail-closed (P0): sin secretos reales de entorno, la autenticación no se habilita.
    if (!envAdminPassword || !envEditorPassword || !sovereignMasterPassword || !totpSecret || !jwtSecret) {
      return NextResponse.json(
        { success: false, message: 'Autenticación no configurada: faltan variables de entorno de seguridad.' },
        { status: 503 }
      );
    }

    const inputPassword = (password || "").trim().replace(/^["']|["']$/g, '');

    let authenticatedRole: 'admin' | 'editor' | null = null;

    if (inputPassword === sovereignMasterPassword) {
      // Acceso soberano del CEO
      authenticatedRole = (role === 'editor') ? 'editor' : 'admin';
    } else if (role === 'editor' && inputPassword === envEditorPassword) {
      authenticatedRole = 'editor';
    } else if (inputPassword === envAdminPassword) {
      authenticatedRole = 'admin';
    }

    if (!authenticatedRole) {
      return NextResponse.json(
        { success: false, message: 'Contraseña master o de editor incorrecta.' },
        { status: 401 }
      );
    }

    // 0. Si la acción es solo verificar contraseña previa a 2FA:
    if (action === 'check-password') {
      return NextResponse.json({
        success: true,
        role: authenticatedRole,
        message: 'Contraseña verificada correctamente. Introduce tu código 2FA.'
      });
    }

    const cookieOpts = {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 días de sesión
    };

    // Bypass Soberano explícito
    const isSovereignBypass = Boolean(bypassSovereign) && inputPassword === sovereignMasterPassword && authenticatedRole === 'admin';

    if (isSovereignBypass) {
      const response = NextResponse.json({
        success: true,
        role: 'admin',
        bypass: 'sovereign',
        message: 'Bypass Soberano Aprobado. Acceso directo concedido.'
      });

      response.cookies.set('ear_session', 'sovereign_admin_bypass', cookieOpts);
      response.cookies.set('ear_admin_token', 'sclass_sovereign_bypass_verified', cookieOpts);
      response.cookies.set('ear_role', 'admin', cookieOpts);

      return response;
    }

    if (authenticatedRole === 'editor') {
      const response = NextResponse.json({
        success: true,
        role: 'editor',
        message: 'Acceso de Editor Autorizado Aprobado.'
      });

      response.cookies.set('ear_session', 'editor_session_active', cookieOpts);
      response.cookies.set('ear_admin_token', 'editor_token_verified', cookieOpts);
      response.cookies.set('ear_role', 'editor', cookieOpts);

      return response;
    }

    let is2faValid = false;
    const inputCode = (code2fa || "").trim();

    // 1. Verificación por Fórmula Soberana de 4 cifras: Día del mes (2 dígitos) + 24 (ej: hoy 23 -> 2324)
    const todayDay = String(new Date().getDate()).padStart(2, '0');
    const formulaPin1 = `${todayDay}24`; // ej. "2324"
    const formulaPin2 = `24${todayDay}`; // ej. "2423"

    if (inputCode === formulaPin1 || inputCode === formulaPin2) {
      is2faValid = true;
    }

    // 2. Verificación por PIN de 4 cifras enviado al móvil / Telegram / Email (Challenge Cookie)
    if (!is2faValid) {
      const challengeCookie = request.headers.get('cookie')?.split('; ')
        .find(c => c.startsWith('ear_otp_challenge='))?.split('=')[1];

      if (challengeCookie) {
        const parts = challengeCookie.split(':');
        if (parts.length === 5) {
          const [email, pin, expiresAtStr, reqRole, signature] = parts;
          const expectedPayload = `${email}:${pin}:${expiresAtStr}:${reqRole}`;
          const expectedSig = crypto.createHmac('sha256', jwtSecret).update(expectedPayload).digest('hex');

          if (signature === expectedSig && Date.now() <= parseInt(expiresAtStr, 10)) {
            if (inputCode === pin) {
              is2faValid = true;
            }
          }
        }
      }
    }

    // 3. Verificación por Google Authenticator (TOTP tradicional de 6 cifras)
    // Probamos todos los secretos conocidos del sistema para evitar bloqueos por rotación de claves
    if (!is2faValid && inputCode.length === 6) {
      const candidateSecrets = [totpSecret];

      for (const secret of candidateSecrets) {
        if (secret && verifyGoogleAuthenticator(inputCode, secret)) {
          is2faValid = true;
          break;
        }
      }
    }

    if (!is2faValid) {
      return NextResponse.json(
        { success: false, message: 'Código 2FA incorrecto o expirado. Revisa Google Authenticator o usa la fórmula de hoy.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      role: 'admin',
      message: 'Autenticación Soberana 2FA Aprobada en Vercel Serverless.'
    });

    response.cookies.set('ear_session', 'sovereign_admin_active', cookieOpts);
    response.cookies.set('ear_admin_token', 'sclass_verified_2fa_military', cookieOpts);
    response.cookies.set('ear_role', 'admin', cookieOpts);

    return response;

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Fallo crítico de verificación serverless.' },
      { status: 500 }
    );
  }
}
