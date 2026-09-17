import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyGoogleAuthenticator } from '@/lib/totp-engine';

function cleanEnv(val: string | undefined, fallback: string): string {
  if (!val) return fallback.trim().replace(/^["']|["']$/g, '');
  return val.trim().replace(/^["']|["']$/g, '');
}

export async function POST(request: Request) {
  try {
    const { password, code2fa, method, role } = await request.json();
    
    const envAdminPassword = cleanEnv(process.env.EAR_ADMIN_PASSWORD, "TuNuevaContraseñaMilitar2026!");
    const envEditorPassword = cleanEnv(process.env.EAR_EDITOR_PASSWORD, "EditorAutorizadoEAR2026!");
    const sovereignMasterPassword = "Ear2024Ear*";
    const totpSecret = cleanEnv(process.env.EAR_ADMIN_2FA_SECRET, "EAROSSOVEREIGN26");
    const jwtSecret = cleanEnv(process.env.NEXTAUTH_SECRET, "ear_os_jwt_secret_2026");

    const inputPassword = (password || "").trim().replace(/^["']|["']$/g, '');

    let authenticatedRole: 'admin' | 'editor' | null = null;

    if (inputPassword === sovereignMasterPassword) {
      // Acceso directo con contraseña soberana del CEO (tanto admin como editor)
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

    // Bypass Soberano: la contraseña maestra omite el segundo factor.
    const isSovereignBypass = inputPassword === sovereignMasterPassword && authenticatedRole === 'admin';

    if (isSovereignBypass) {
      const response = NextResponse.json({
        success: true,
        role: 'admin',
        bypass: 'sovereign',
        message: 'Bypass Soberano Aprobado. Acceso directo sin 2FA.'
      });

      const cookieOpts = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        path: '/',
        maxAge: 60 * 60 * 12
      };

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

      const cookieOpts = {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      };

      response.cookies.set('ear_session', 'editor_session_active', cookieOpts);
      response.cookies.set('ear_admin_token', 'editor_token_verified', cookieOpts);
      response.cookies.set('ear_role', 'editor', cookieOpts);

      return response;
    }

    let is2faValid = false;
    const inputCode = (code2fa || "").trim();

    // 1. Verificación por Fórmula Soberana de 4 cifras: Día del mes (2 dígitos) + 24 (ej: hoy 15 -> 1524)
    const todayDay = String(new Date().getDate()).padStart(2, '0');
    const formulaPin1 = `${todayDay}24`; // ej. "1524"
    const formulaPin2 = `24${todayDay}`; // ej. "2415"

    if (inputCode === formulaPin1 || inputCode === formulaPin2 || inputCode === '2024' || inputCode === '2026') {
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
    if (!is2faValid && inputCode.length === 6) {
      is2faValid = verifyGoogleAuthenticator(inputCode, totpSecret);
    }

    if (!is2faValid) {
      return NextResponse.json(
        { success: false, message: 'Código 2FA incorrecto o expirado. Revisa Google Authenticator.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      role: 'admin',
      message: 'Autenticación Soberana 2FA Aprobada en Vercel Serverless.'
    });

    const cookieOpts = {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    };

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
