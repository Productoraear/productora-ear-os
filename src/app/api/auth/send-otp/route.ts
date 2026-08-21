import { NextResponse } from 'next/server';
import crypto from 'crypto';

globalThis.otpVault = globalThis.otpVault || new Map<string, { code: string; expiresAt: number }>();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const envEmail = process.env.EAR_ADMIN_EMAIL || "productoraear@gmail.com";
    const envPassword = process.env.EAR_ADMIN_PASSWORD || "TuNuevaContraseñaMilitar2026!";

    if (email !== envEmail || password !== envPassword) {
      return NextResponse.json(
        { success: false, message: 'Credenciales Master no válidas.' },
        { status: 401 }
      );
    }

    const generatedPin = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    globalThis.otpVault.set(email, { code: generatedPin, expiresAt });

    console.log("=================================================");
    console.log(`🔐 [ENCLAVE DE SEGURIDAD MILITAR] OTP GENERADO: ${generatedPin}`);
    console.log(`📧 Destino autorizado: ${email}`);
    console.log("=================================================");

    return NextResponse.json({
      success: true,
      message: `Código PIN OTP generado y registrado para ${email}. Válido por 5 minutos.`
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Fallo al generar el token OTP.' },
      { status: 500 }
    );
  }
}
