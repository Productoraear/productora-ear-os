import { NextResponse, type NextRequest } from 'next/server';
import crypto from 'crypto';
import { findAuthorizedMember, normalizeEmail } from '@/lib/constants/authorized-users';
import { sendTelegramNotification } from '@/lib/services/telegram';
import { verifyGoogleAuthenticator } from '@/lib/totp-engine';
import { safeEqual } from '@/lib/security/constantTime';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function cleanEnv(val: string | undefined, fallback: string = ''): string {
  if (!val) return fallback.trim().replace(/^["']|["']$/g, '');
  return val.trim().replace(/^["']|["']$/g, '');
}

/**
 * FASE 3 · SEGUNDO FACTOR DEL EDITOR (sin códigos mágicos).
 * El editor no tiene secreto TOTP propio (el sistema sólo enrola el de dirección),
 * así que su segundo factor es la POSESIÓN del canal autorizado: se re-verifica
 * el OTP firmado con HMAC de Fase 1 —mismo email, mismo rol, misma firma, no
 * caducado— contra el código tecleado, en tiempo constante.
 *
 * Antes de esto existía un literal `'2026'` que abría la Fase 3 a cualquiera que
 * lo leyera en el repositorio: un segundo factor hardcodeado es un backdoor.
 */
function verifyEditorChallengeCode(
  request: NextRequest,
  expectedEmail: string,
  expectedRole: string,
  input2fa: string,
  jwtSecret: string,
): boolean {
  const challengeCookie: string | undefined = request.cookies.get('ear_otp_challenge')?.value;
  if (challengeCookie === undefined) return false;

  const parts: string[] = challengeCookie.split(':');
  if (parts.length !== 5) return false;

  const [email, pin, expiresAtStr, role, signature] = parts;
  if (!safeEqual(email, expectedEmail) || !safeEqual(role, expectedRole)) return false;

  const expectedSig: string = crypto
    .createHmac('sha256', jwtSecret)
    .update(`${email}:${pin}:${expiresAtStr}:${role}`)
    .digest('hex');

  if (!safeEqual(signature, expectedSig)) return false;
  if (Date.now() > parseInt(expiresAtStr, 10)) return false;

  return safeEqual(input2fa, pin);
}

/**
 * 🛡️ SISTEMA DE RECUPERACIÓN SOBERANO EN 3 FASES (S-CLASS)
 * Fase 1: Envío de OTP de 6 cifras al email autorizado (con resguardo a Telegram oficial).
 * Fase 2: Comprobación estricta de OTP + Contraseña del sistema (Master o Editor).
 * Fase 3: Validación del segundo factor real (TOTP de Google Authenticator para
 *         dirección; OTP firmado de Fase 1 para editores). La «fórmula del día»
 *         fue eliminada: era una función pública del calendario, no un secreto.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json().catch(() => ({}));
    const { action, email, otpCode, password, code2fa, phase2Token } = body;

    const envAdminPassword = cleanEnv(process.env.EAR_ADMIN_PASSWORD, "");
    const envEditorPassword = cleanEnv(process.env.EAR_EDITOR_PASSWORD, "");
    const sovereignMasterPassword = cleanEnv(process.env.EAR_SOVEREIGN_MASTER_PASSWORD, "");
    const totpSecret = cleanEnv(process.env.EAR_ADMIN_2FA_SECRET, "");
    const jwtSecret = cleanEnv(process.env.NEXTAUTH_SECRET, "");
    const resendKey = cleanEnv(process.env.RESEND_API_KEY, "");

    if (!envAdminPassword || !envEditorPassword || !sovereignMasterPassword || !totpSecret || !jwtSecret) {
      return NextResponse.json(
        { success: false, message: 'Sistema de seguridad no configurado en entorno.' },
        { status: 503 }
      );
    }

    const cookieOpts = {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 días
    };

    // ─────────────────────────────────────────────────────────────
    // FASE 1: ENVÍO DE CÓDIGO OTP AL EMAIL AUTORIZADO
    // ─────────────────────────────────────────────────────────────
    if (action === 'phase1_send_otp') {
      if (!email || typeof email !== 'string') {
        return NextResponse.json(
          { success: false, message: 'Debes proporcionar un email válido.' },
          { status: 400 }
        );
      }

      const normalized = normalizeEmail(email);
      const member = findAuthorizedMember(normalized);

      if (!member) {
        return NextResponse.json(
          { success: false, message: 'Este email no figura en la lista de cuentas autorizadas del sistema.' },
          { status: 403 }
        );
      }

      // Generar OTP de 6 dígitos numéricos (CSPRNG: `Math.random` es predecible)
      const pin = crypto.randomInt(100000, 1000000).toString();
      const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutos

      // Firma criptográfica HMAC-SHA256
      const payloadToSign = `${normalized}:${pin}:${expiresAt}:${member.role}`;
      const signature = crypto.createHmac('sha256', jwtSecret).update(payloadToSign).digest('hex');
      const challengeValue = `${normalized}:${pin}:${expiresAt}:${member.role}:${signature}`;

      // 1. Resguardo inmediato a Telegram oficial
      const telegramAlert = 
        `🔐 *CÓDIGO DE RECUPERACIÓN FASE 1 — EAR OS*\n\n` +
        `• *Usuario:* ${member.name} (${member.title})\n` +
        `• *Email:* \`${normalized}\`\n` +
        `• *Código OTP:* \`${pin}\`\n` +
        `• *Validez:* 15 minutos (Expira: ${new Date(expiresAt).toLocaleTimeString('es-ES')})\n\n` +
        `Si no has solicitado este código, verifica la seguridad de la cuenta de inmediato.`;

      await sendTelegramNotification(telegramAlert);

      // 2. Envío vía Resend si está disponible
      if (resendKey) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: 'Seguridad EAR OS <seguridad@productoraear.com>',
              to: [normalized],
              subject: `Código de Recuperación [${pin}] • EAR OS S-Class`,
              html: `
                <div style="font-family: sans-serif; background: #030305; color: #fff; padding: 32px; border-radius: 16px;">
                  <h2 style="color: #ecb613; margin-top: 0;">Recuperación en 3 Fases EAR OS</h2>
                  <p>Hola <strong>${member.name}</strong>,</p>
                  <p>Has iniciado el protocolo de recuperación de acceso para el rol <strong>${member.title}</strong>.</p>
                  <div style="background: rgba(236,182,19,0.1); border: 1px solid #ecb613; padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0;">
                    <span style="font-size: 32px; font-weight: bold; font-family: monospace; letter-spacing: 6px; color: #ecb613;">${pin}</span>
                  </div>
                  <p style="color: #a1a1aa; font-size: 13px;">Este código expira en 15 minutos. Luego deberás ingresar la contraseña del sistema y tu autenticador 2FA.</p>
                </div>
              `
            })
          });
        } catch (resendErr) {
          console.warn('⚠️ [RECOVERY] Envío directo Resend falló, el código está respaldado en Telegram:', resendErr);
        }
      }

      const response = NextResponse.json({
        success: true,
        message: `Código enviado con éxito a ${normalized} (y respaldado en Telegram de dirección).`,
        user: { name: member.name, role: member.role }
      });

      response.cookies.set('ear_otp_challenge', challengeValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60 // 15 minutos
      });

      return response;
    }

    // ─────────────────────────────────────────────────────────────
    // FASE 2: VERIFICACIÓN DE OTP + CONTRASEÑA DEL SISTEMA
    // ─────────────────────────────────────────────────────────────
    if (action === 'phase2_verify_password') {
      const challengeCookie = request.cookies.get('ear_otp_challenge')?.value;

      if (!challengeCookie) {
        return NextResponse.json(
          { success: false, message: 'La sesión del código OTP ha expirado o no se ha solicitado. Inicia Fase 1.' },
          { status: 400 }
        );
      }

      const parts = challengeCookie.split(':');
      if (parts.length !== 5) {
        return NextResponse.json({ success: false, message: 'Token de Fase 1 inválido.' }, { status: 400 });
      }

      const [storedEmail, storedPin, expiresAtStr, storedRole, signature] = parts;
      const expectedPayload = `${storedEmail}:${storedPin}:${expiresAtStr}:${storedRole}`;
      const expectedSig = crypto.createHmac('sha256', jwtSecret).update(expectedPayload).digest('hex');

      if (!safeEqual(signature, expectedSig) || Date.now() > parseInt(expiresAtStr, 10)) {
        return NextResponse.json(
          { success: false, message: 'El código OTP ha caducado o está manipulado. Solicita uno nuevo.' },
          { status: 401 }
        );
      }

      if (!safeEqual((otpCode || '').trim(), storedPin)) {
        return NextResponse.json(
          { success: false, message: 'El código OTP introducido es incorrecto.' },
          { status: 401 }
        );
      }

      // Validar Contraseña del Sistema (Master, Admin o Editor según corresponda)
      const inputPass = (password || '').trim().replace(/^["']|["']$/g, '');
      const isPassValid = 
        inputPass === sovereignMasterPassword || 
        inputPass === envAdminPassword || 
        (storedRole === 'editor' && inputPass === envEditorPassword);

      if (!isPassValid) {
        return NextResponse.json(
          { success: false, message: 'Contraseña del sistema incorrecta.' },
          { status: 401 }
        );
      }

      // Generar Token de Fase 2 completada (válido por 10 minutos para Fase 3)
      const phase2Expires = Date.now() + 10 * 60 * 1000;
      const p2Payload = `P2_PASSED:${storedEmail}:${storedRole}:${phase2Expires}`;
      const p2Sig = crypto.createHmac('sha256', jwtSecret).update(p2Payload).digest('hex');
      const tokenP2 = `${storedEmail}:${storedRole}:${phase2Expires}:${p2Sig}`;

      return NextResponse.json({
        success: true,
        message: 'Fase 1 y Fase 2 superadas con éxito. Procede a la verificación final con tu Authenticator.',
        phase2Token: tokenP2,
        role: storedRole
      });
    }

    // ─────────────────────────────────────────────────────────────
    // FASE 3: VERIFICACIÓN DE AUTHENTICATOR (TOTP o FÓRMULA DEL DÍA)
    // ─────────────────────────────────────────────────────────────
    if (action === 'phase3_verify_authenticator') {
      if (!phase2Token || typeof phase2Token !== 'string') {
        return NextResponse.json(
          { success: false, message: 'Falta el token de autorización de Fase 2.' },
          { status: 400 }
        );
      }

      const p2Parts = phase2Token.split(':');
      if (p2Parts.length !== 4) {
        return NextResponse.json({ success: false, message: 'Token de Fase 2 con formato inválido.' }, { status: 400 });
      }

      const [storedEmail, storedRole, phase2ExpiresStr, p2Sig] = p2Parts;
      const expectedP2Payload = `P2_PASSED:${storedEmail}:${storedRole}:${phase2ExpiresStr}`;
      const expectedP2Sig = crypto.createHmac('sha256', jwtSecret).update(expectedP2Payload).digest('hex');

      if (!safeEqual(p2Sig, expectedP2Sig) || Date.now() > parseInt(phase2ExpiresStr, 10)) {
        return NextResponse.json(
          { success: false, message: 'La autorización de Fase 2 ha expirado. Repite el proceso.' },
          { status: 401 }
        );
      }

      const input2fa = (code2fa || '').trim();
      let is2faValid = false;

      // ── «FÓRMULA DEL DÍA» ELIMINADA (P0 · VETO ABSOLUTO) ──────────────────
      // `DD24` / `24DD` eran una función pública del calendario: 31 códigos
      // posibles con el algoritmo legible en el repositorio ⇒ bypass del
      // segundo factor. Aquí sólo valen secretos reales.

      // 1. Google Authenticator TOTP de 6 cifras (dirección)
      if (!is2faValid && storedRole !== 'editor' && input2fa.length === 6) {
        if (verifyGoogleAuthenticator(input2fa, totpSecret)) {
          is2faValid = true;
        }
      }

      // 2. Editor: OTP firmado de Fase 1 (posesión real del canal autorizado).
      //    Sustituye al literal hardcodeado `'2026'`, que era un backdoor.
      if (!is2faValid && storedRole === 'editor') {
        is2faValid = verifyEditorChallengeCode(request, storedEmail, storedRole, input2fa, jwtSecret);
      }

      if (!is2faValid) {
        return NextResponse.json(
          { success: false, message: 'Código 2FA incorrecto o expirado. Usa Google Authenticator o solicita un OTP nuevo.' },
          { status: 401 }
        );
      }

      // Todo validado: Emitir credenciales de sesión oficiales de EAR OS
      const member = findAuthorizedMember(storedEmail);
      const assignedRole = (storedRole === 'admin' ? 'admin' : 'editor') as 'admin' | 'editor';

      const response = NextResponse.json({
        success: true,
        message: '¡Protocolo de Recuperación en 3 Fases completado con ÉXITO S-Class! Acceso restaurado.',
        role: assignedRole,
        user: member ? { name: member.name, email: member.email, title: member.title } : undefined
      });

      response.cookies.set('ear_session', `${assignedRole}_recovered_session`, cookieOpts);
      response.cookies.set('ear_admin_token', `sclass_recovery_3phase_${assignedRole}_verified`, cookieOpts);
      response.cookies.set('ear_role', assignedRole, cookieOpts);

      if (member) {
        response.cookies.set('ear_user_email', member.email, cookieOpts);
        response.cookies.set('ear_user_name', encodeURIComponent(member.name), cookieOpts);
      }

      // Limpiar cookie de challenge
      response.cookies.delete('ear_otp_challenge');

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Acción de recuperación no reconocida.' },
      { status: 400 }
    );

  } catch (error) {
    console.error('❌ [RECOVERY ERROR]:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno en el servidor de recuperación.' },
      { status: 500 }
    );
  }
}
