import { NextResponse } from 'next/server';

globalThis.otpVault = globalThis.otpVault || new Map<string, { code: string; expiresAt: number }>();

export async function POST(request: Request) {
  try {
    const { password, code2fa } = await request.json();
    const envEmail = process.env.EAR_ADMIN_EMAIL || "productoraear@gmail.com";
    const envPassword = process.env.EAR_ADMIN_PASSWORD || "TuNuevaContraseñaMilitar2026!";

    if (password !== envPassword) {
      return NextResponse.json(
        { success: false, message: 'Paso 1 Fallido: Contraseña Master incorrecta.' },
        { status: 401 }
      );
    }

    const record = globalThis.otpVault.get(envEmail);

    if (!record) {
      return NextResponse.json(
        { success: false, message: 'Paso 2 Fallido: No existe un PIN activo. Solicita un nuevo código.' },
        { status: 401 }
      );
    }

    if (Date.now() > record.expiresAt) {
      globalThis.otpVault.delete(envEmail);
      return NextResponse.json(
        { success: false, message: 'Paso 2 Fallido: El PIN OTP ha expirado (Vida útil: 5 minutos).' },
        { status: 401 }
      );
    }

    if (code2fa !== record.code) {
      return NextResponse.json(
        { success: false, message: 'Paso 2 Fallido: Código PIN incorrecto.' },
        { status: 401 }
      );
    }

    // Consumir token tras uso
    globalThis.otpVault.delete(envEmail);

    const response = NextResponse.json({
      success: true,
      message: 'Autenticación Soberana 2FA Aprobada.'
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
      { success: false, message: 'Fallo crítico de autenticación.' },
      { status: 500 }
    );
  }
}
