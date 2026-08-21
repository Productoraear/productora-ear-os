import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyGoogleAuthenticator } from '@/lib/totp-engine';

export async function POST(request: Request) {
  try {
    const { password, code2fa, method, role } = await request.json();
    
    const envAdminPassword = process.env.EAR_ADMIN_PASSWORD || "TuNuevaContraseñaMilitar2026!";
    const envEditorPassword = process.env.EAR_EDITOR_PASSWORD || "EditorAutorizadoEAR2026!";
    const totpSecret = process.env.EAR_ADMIN_2FA_SECRET || "EAROSSOVEREIGN26";
    const jwtSecret = process.env.NEXTAUTH_SECRET || "ear_os_jwt_secret_2026";

    let authenticatedRole: 'admin' | 'editor' | null = null;

    // 1. Verificación de Contraseña de Paso 1
    if (role === 'editor' && password === envEditorPassword) {
      authenticatedRole = 'editor';
    } else if (password === envAdminPassword) {
      authenticatedRole = 'admin';
    }

    if (!authenticatedRole) {
      return NextResponse.json(
        { success: false, message: 'Contraseña master o de editor incorrecta.' },
        { status: 401 }
      );
    }

    // Si es editor, el acceso requiere solo contraseña master de editor
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
        maxAge: 60 * 60 * 24 * 7 // 7 días
      };

      response.cookies.set('ear_session', 'editor_session_active', cookieOpts);
      response.cookies.set('ear_admin_token', 'editor_token_verified', cookieOpts);
      response.cookies.set('ear_role', 'editor', cookieOpts);

      return response;
    }

    // 2. Verificación de Administrador (Doble Factor 2FA Obligatorio)
    let is2faValid = false;

    // Opción A: Verificación mediante Google Authenticator (TOTP Cero Memoria)
    if (method === 'authenticator' || code2fa) {
      is2faValid = verifyGoogleAuthenticator(code2fa, totpSecret);
    }

    // Opción B: Verificación por Email (Desafío Criptográfico HMAC Stateless)
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
        { success: false, message: 'Código 2FA incorrecto o expirado. Revisa Google Authenticator o solicita un nuevo PIN.' },
        { status: 401 }
      );
    }

    // Emisión de cookies soberanas de Administrador
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
