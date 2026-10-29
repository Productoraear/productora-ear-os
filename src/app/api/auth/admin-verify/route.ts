import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyGoogleAuthenticator } from '@/lib/totp-engine';
import { findAuthorizedMember } from '@/lib/constants/authorized-users';
import { safeEqual } from '@/lib/security/constantTime';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function cleanEnv(val: string | undefined, fallback: string): string {
  if (!val) return fallback.trim().replace(/^["']|["']$/g, '');
  return val.trim().replace(/^["']|["']$/g, '');
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      password?: string;
      code2fa?: string;
      role?: string;
      action?: string;
      bypassSovereign?: boolean;
      email?: string;
    };
    const { password, code2fa, role, action, bypassSovereign, email } = body;
    
    const inputPassword = (password || "").trim().replace(/^["']|["']$/g, '');
    const inputCode = (code2fa || "").trim().replace(/^["']|["']$/g, '');

    const cookieOpts = {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 días de sesión
    };

    // ── ACCESO SOBERANO DE EMERGENCIA (PIN MAESTRO SIN LITERAL EN EL BINARIO) ──
    // P0 — Doctrina fail-closed: el PIN vive EXCLUSIVAMENTE en `EAR_MASTER_PIN`.
    // Un literal en el código es un backdoor público (el bundle y el repo son
    // legibles). Sin la variable configurada, esta vía queda DESACTIVADA.
    const masterPin = cleanEnv(process.env.EAR_MASTER_PIN, '');
    const isMasterPin =
      masterPin.length >= 4 && (safeEqual(inputPassword, masterPin) || safeEqual(inputCode, masterPin));
    if (isMasterPin) {
      const response = NextResponse.json({
        success: true,
        role: 'admin',
        bypass: 'sovereign_master_pin',
        message: 'Acceso Soberano de Emergencia aprobado. Bienvenido.'
      });

      response.cookies.set('ear_session', 'sovereign_admin_bypass', cookieOpts);
      response.cookies.set('ear_admin_token', 'sclass_sovereign_bypass_verified', cookieOpts);
      response.cookies.set('ear_role', 'admin', cookieOpts);
      response.cookies.set('ear_user_email', 'edwin.agudelo@productoraear.com', cookieOpts);
      response.cookies.set('ear_user_name', encodeURIComponent('Edwin Agudelo'), cookieOpts);

      return response;
    }

    const envAdminPassword = cleanEnv(process.env.EAR_ADMIN_PASSWORD, "");
    const envEditorPassword = cleanEnv(process.env.EAR_EDITOR_PASSWORD, "");
    const sovereignMasterPassword = cleanEnv(process.env.EAR_SOVEREIGN_MASTER_PASSWORD, "");
    const totpSecret = cleanEnv(process.env.EAR_ADMIN_2FA_SECRET, "");
    const jwtSecret = cleanEnv(process.env.NEXTAUTH_SECRET, "");

    // Fail-closed (P0): sin secretos reales de entorno, la autenticación convencional no se habilita.
    if (!envAdminPassword || !envEditorPassword || !sovereignMasterPassword || !totpSecret || !jwtSecret) {
      return NextResponse.json(
        { success: false, message: 'Autenticación no configurada: faltan variables de entorno de seguridad.' },
        { status: 503 }
      );
    }

    const authorizedMember = email ? findAuthorizedMember(email) : undefined;

    let authenticatedRole: 'admin' | 'editor' | null = null;

    // Validación por miembro de equipo autorizado
    if (authorizedMember) {
      const isPasswordValid = 
        inputPassword === sovereignMasterPassword || 
        inputPassword === envAdminPassword || 
        inputPassword === envEditorPassword;

      if (isPasswordValid) {
        authenticatedRole = authorizedMember.role;
      }
    } else {
      if (inputPassword === sovereignMasterPassword) {
        // Acceso soberano del CEO
        authenticatedRole = (role === 'editor') ? 'editor' : 'admin';
      } else if (role === 'editor' && inputPassword === envEditorPassword) {
        authenticatedRole = 'editor';
      } else if (inputPassword === envAdminPassword) {
        authenticatedRole = 'admin';
      }
    }

    if (!authenticatedRole) {
      return NextResponse.json(
        { success: false, message: 'Contraseña o credenciales no válidas.' },
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
        user: authorizedMember ? {
          name: authorizedMember.name,
          email: authorizedMember.email,
          title: authorizedMember.title,
          department: authorizedMember.department
        } : undefined,
        message: authorizedMember 
          ? `Acceso de Editor Autorizado: Bienvenida ${authorizedMember.name} (${authorizedMember.title}).`
          : 'Acceso de Editor Autorizado Aprobado.'
      });

      response.cookies.set('ear_session', 'editor_session_active', cookieOpts);
      response.cookies.set('ear_admin_token', 'editor_token_verified', cookieOpts);
      response.cookies.set('ear_role', 'editor', cookieOpts);
      if (authorizedMember) {
        response.cookies.set('ear_user_email', authorizedMember.email, cookieOpts);
        response.cookies.set('ear_user_name', encodeURIComponent(authorizedMember.name), cookieOpts);
      }

      return response;
    }

    let is2faValid = false;

    // ── FÓRMULA DEL DÍA ELIMINADA (P0 · VETO ABSOLUTO) ──────────────────────
    // `DD24` era una función determinista y pública del calendario: 31 códigos
    // posibles y el algoritmo legible en el repositorio ⇒ bypass total del
    // segundo factor para cualquiera. Los canales que quedan son secretos
    // reales: OTP firmado con HMAC y enviado al canal autorizado, y TOTP de
    // Google Authenticator.

    // 1. Verificación por PIN de 4-6 cifras enviado al móvil / Telegram / Email (Challenge Cookie)
    if (!is2faValid) {
      const challengeCookie = request.headers.get('cookie')?.split('; ')
        .find(c => c.startsWith('ear_otp_challenge='))?.split('=')[1];

      if (challengeCookie) {
        const parts = challengeCookie.split(':');
        if (parts.length === 5) {
          const [email, pin, expiresAtStr, reqRole, signature] = parts;
          const expectedPayload = `${email}:${pin}:${expiresAtStr}:${reqRole}`;
          const expectedSig = crypto.createHmac('sha256', jwtSecret).update(expectedPayload).digest('hex');

          if (safeEqual(signature, expectedSig) && Date.now() <= parseInt(expiresAtStr, 10)) {
            if (safeEqual(inputCode, pin)) {
              is2faValid = true;
            }
          }
        }
      }
    }

    // 2. Verificación por Google Authenticator (TOTP tradicional de 6 cifras)
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
        { success: false, message: 'Código 2FA incorrecto o expirado. Usa Google Authenticator o solicita un código nuevo.' },
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

  } catch {
    return NextResponse.json(
      { success: false, message: 'Fallo crítico de verificación serverless.' },
      { status: 500 }
    );
  }
}
