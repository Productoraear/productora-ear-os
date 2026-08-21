import { NextResponse } from 'next/server';
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
