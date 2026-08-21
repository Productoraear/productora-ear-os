import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();
    
    const envAdminEmail = process.env.EAR_ADMIN_EMAIL || "productoraear@gmail.com";
    const envAdminPassword = process.env.EAR_ADMIN_PASSWORD || "TuNuevaContraseñaMilitar2026!";
    const envEditorPassword = process.env.EAR_EDITOR_PASSWORD || "EditorAutorizadoEAR2026!";
    const jwtSecret = process.env.NEXTAUTH_SECRET || "ear_os_jwt_secret_2026";

    let isValidCreds = false;
    let targetRole = 'admin';

    if (role === 'editor') {
      if (password === envEditorPassword) {
        isValidCreds = true;
        targetRole = 'editor';
      }
    } else {
      if (email === envAdminEmail && password === envAdminPassword) {
        isValidCreds = true;
        targetRole = 'admin';
      }
    }

    if (!isValidCreds) {
      return NextResponse.json(
        { success: false, message: 'Credenciales de acceso no válidas para el perfil seleccionado.' },
        { status: 401 }
      );
    }

    // Generar PIN aleatorio criptográfico
    const generatedPin = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutos

    // Desafío Criptográfico Stateless (HMAC Payload)
    const payload = `${email}:${generatedPin}:${expiresAt}:${targetRole}`;
    const signature = crypto.createHmac('sha256', jwtSecret).update(payload).digest('hex');
    const challengeToken = `${payload}:${signature}`;

    console.log("=================================================");
    console.log(`🔐 [STATELESS OTP GENERADO] PIN: ${generatedPin} | Rol: ${targetRole}`);
    console.log(`📧 Destino: ${email}`);
    console.log("=================================================");

    const response = NextResponse.json({
      success: true,
      role: targetRole,
      message: `Desafío de seguridad generado para ${targetRole}. Introduce el PIN o usa Google Authenticator.`
    });

    // Guardar el desafío firmado en una cookie temporal segura para Vercel Serverless
    response.cookies.set('ear_otp_challenge', challengeToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 300 // 5 minutos
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Fallo al procesar el desafío de seguridad.' },
      { status: 500 }
    );
  }
}
