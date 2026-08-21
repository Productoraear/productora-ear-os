import os

print("🛡️ INSTALANDO SANITIZACIÓN ROBUSTA DE CONTRASEÑAS EN APIS SERVERLESS...")

base_dir = r"H:\EAR_OS_V2\EAR_OS_V2"

# 1. ACTUALIZAR /api/auth/send-otp/route.ts
send_otp_path = os.path.join(base_dir, "src", "app", "api", "auth", "send-otp", "route.ts")

send_otp_code = """import { NextResponse } from 'next/server';
import crypto from 'crypto';

function cleanEnv(val: string | undefined, fallback: string): string {
  if (!val) return fallback.trim().replace(/^["']|["']$/g, '');
  return val.trim().replace(/^["']|["']$/g, '');
}

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();
    
    const envAdminEmail = cleanEnv(process.env.EAR_ADMIN_EMAIL, "productoraear@gmail.com").toLowerCase();
    const envAdminPassword = cleanEnv(process.env.EAR_ADMIN_PASSWORD, "TuNuevaContraseñaMilitar2026!");
    const envEditorPassword = cleanEnv(process.env.EAR_EDITOR_PASSWORD, "EditorAutorizadoEAR2026!");
    const jwtSecret = cleanEnv(process.env.NEXTAUTH_SECRET, "ear_os_jwt_secret_2026");

    const inputPassword = (password || "").trim().replace(/^["']|["']$/g, '');
    const inputEmail = (email || "").trim().toLowerCase();

    let isValidCreds = false;
    let targetRole = 'admin';

    if (role === 'editor') {
      if (inputPassword === envEditorPassword) {
        isValidCreds = true;
        targetRole = 'editor';
      }
    } else {
      if (inputEmail === envAdminEmail && inputPassword === envAdminPassword) {
        isValidCreds = true;
        targetRole = 'admin';
      }
    }

    if (!isValidCreds) {
      return NextResponse.json(
        { success: false, message: 'Credenciales de acceso no válidas. Comprueba la contraseña ingresada.' },
        { status: 401 }
      );
    }

    const generatedPin = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    const payload = `${inputEmail}:${generatedPin}:${expiresAt}:${targetRole}`;
    const signature = crypto.createHmac('sha256', jwtSecret).update(payload).digest('hex');
    const challengeToken = `${payload}:${signature}`;

    const response = NextResponse.json({
      success: true,
      role: targetRole,
      message: `Desafío de seguridad generado para ${targetRole}. Introduce el PIN de Google Authenticator.`
    });

    response.cookies.set('ear_otp_challenge', challengeToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 300
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error interno en la verificación de credenciales.' },
      { status: 500 }
    );
  }
}
"""

with open(send_otp_path, "w", encoding="utf-8") as f:
    f.write(send_otp_code)

# 2. ACTUALIZAR /api/auth/admin-verify/route.ts
verify_path = os.path.join(base_dir, "src", "app", "api", "auth", "admin-verify", "route.ts")

verify_code = """import { NextResponse } from 'next/server';
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
    const totpSecret = cleanEnv(process.env.EAR_ADMIN_2FA_SECRET, "EAROSSOVEREIGN26");
    const jwtSecret = cleanEnv(process.env.NEXTAUTH_SECRET, "ear_os_jwt_secret_2026");

    const inputPassword = (password || "").trim().replace(/^["']|["']$/g, '');

    let authenticatedRole: 'admin' | 'editor' | null = null;

    if (role === 'editor' && inputPassword === envEditorPassword) {
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

    if (method === 'authenticator' || code2fa) {
      is2faValid = verifyGoogleAuthenticator(code2fa, totpSecret);
    }

    if (!is2faValid && method === 'email') {
      const challengeCookie = request.headers.get('cookie')?.split('; ')
        .find(c => c.startsWith('ear_otp_challenge='))?.split('=')[1];

      if (challengeCookie) {
        const parts = challengeCookie.split(':');
        if (parts.length === 5) {
          const [email, pin, expiresAtStr, reqRole, signature] = parts;
          const expectedPayload = `${email}:${pin}:${expiresAtStr}:${reqRole}`;
          const expectedSig = crypto.createHmac('sha256', jwtSecret).update(expectedPayload).digest('hex');

          if (signature === expectedSig && Date.now() <= parseInt(expiresAtStr, 10)) {
            if (code2fa === pin) {
              is2faValid = true;
            }
          }
        }
      }
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
"""

with open(verify_path, "w", encoding="utf-8") as f:
    f.write(verify_code)

print("✅ APIs de Autenticación actualizadas con sanitización de contraseñas y stripping de comillas.")
