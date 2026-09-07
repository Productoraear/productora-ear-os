/**
 * 📧 EMAIL TEMPLATES & BOOKING CONFIRMATION SERVICE
 * Extends the core EmailService with transactional booking confirmations,
 * OTP delivery, and artist notification emails.
 * 
 * Uses Resend API (env: RESEND_API_KEY) with graceful fallback to logging.
 */

const RESEND_API = 'https://api.resend.com/emails';
const FROM_ADDRESS = 'Productora EAR <notificaciones@productoraear.com>';
const BCC_CENTRAL = 'hola@productoraear.com';

function getResendKey(): string {
  return (process.env.RESEND_API_KEY || '').replace(/['"]/g, '').trim();
}

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const key = getResendKey();
  if (!key) {
    console.log(`📧 [EMAIL SIMULATION] To: ${to} | Subject: ${subject}`);
    return true;
  }

  try {
    const res = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [to],
        bcc: [BCC_CENTRAL],
        subject,
        html,
      }),
    });

    if (res.ok) {
      console.log(`✅ [EMAIL] Sent to ${to}: ${subject}`);
      return true;
    }

    console.error(`❌ [EMAIL] Failed: ${res.status} ${await res.text()}`);
    return false;
  } catch (err) {
    console.error('❌ [EMAIL] Network error:', err);
    return false;
  }
}

// ─── BOOKING CONFIRMATION ──────────────────────────────────────────────
export interface BookingConfirmationPayload {
  clientName: string;
  clientEmail: string;
  eventDate: string;
  eventType: string;
  location: string;
  totalAmount: number;
  depositPaid: number;
  stripeReceiptUrl?: string;
  bookingId: string;
}

export async function sendBookingConfirmation(payload: BookingConfirmationPayload): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><title>Confirmación de Reserva</title></head>
<body style="background-color:#050505;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;padding:40px 20px;">
  <div style="max-width:600px;margin:0 auto;background:#09090d;border:1px solid rgba(236,182,19,0.3);border-radius:24px;padding:40px;box-shadow:0 20px 50px rgba(0,0,0,0.8);">
    <div style="text-align:center;margin-bottom:30px;">
      <span style="font-size:10px;font-family:monospace;letter-spacing:3px;color:#ecb613;text-transform:uppercase;">Productora EAR • Confirmación de Reserva</span>
      <h1 style="color:#fff;font-size:24px;margin:10px 0;text-transform:uppercase;letter-spacing:-0.5px;">¡Reserva Confirmada!</h1>
    </div>
    <p style="font-size:14px;color:#ccc;line-height:1.6;">Estimado/a <strong>${payload.clientName}</strong>,</p>
    <p style="font-size:14px;color:#ccc;line-height:1.6;">Tu reserva ha sido confirmada con éxito. El depósito de bloqueo ha sido procesado y tu fecha está asegurada con nuestro protocolo <strong>Price-Lock SHA-256</strong>.</p>
    
    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:20px;margin:25px 0;">
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tr><td style="color:#888;padding:6px 0;">ID de Reserva:</td><td style="color:#ecb613;font-family:monospace;text-align:right;padding:6px 0;">${payload.bookingId}</td></tr>
        <tr><td style="color:#888;padding:6px 0;">Tipo de Evento:</td><td style="color:#fff;text-align:right;padding:6px 0;">${payload.eventType}</td></tr>
        <tr><td style="color:#888;padding:6px 0;">Fecha:</td><td style="color:#fff;font-weight:bold;text-align:right;padding:6px 0;">${payload.eventDate}</td></tr>
        <tr><td style="color:#888;padding:6px 0;">Ubicación:</td><td style="color:#fff;text-align:right;padding:6px 0;">${payload.location}</td></tr>
        <tr style="border-top:1px solid rgba(255,255,255,0.08);"><td style="color:#888;padding:10px 0 6px;">Inversión Total:</td><td style="color:#fff;font-weight:bold;font-size:16px;text-align:right;padding:10px 0 6px;">${payload.totalAmount.toLocaleString('es-ES')} €</td></tr>
        <tr><td style="color:#888;padding:6px 0;">Depósito Pagado:</td><td style="color:#22c55e;font-weight:bold;text-align:right;padding:6px 0;">${payload.depositPaid} € ✓</td></tr>
        <tr><td style="color:#888;padding:6px 0;">Pendiente:</td><td style="color:#ecb613;text-align:right;padding:6px 0;">${(payload.totalAmount - payload.depositPaid).toLocaleString('es-ES')} €</td></tr>
      </table>
    </div>

    ${payload.stripeReceiptUrl ? `<div style="text-align:center;margin:20px 0;"><a href="${payload.stripeReceiptUrl}" style="color:#ecb613;font-size:12px;text-decoration:underline;">Ver Recibo de Stripe</a></div>` : ''}

    <div style="text-align:center;margin:35px 0;">
      <a href="https://wa.me/34693693048?text=Hola,%20confirmo%20mi%20reserva%20${encodeURIComponent(payload.bookingId)}" style="background-color:#22c55e;color:#000;font-weight:900;font-size:13px;text-transform:uppercase;letter-spacing:1px;text-decoration:none;padding:16px 32px;border-radius:12px;display:inline-block;">
        Contactar por WhatsApp
      </a>
    </div>

    <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:20px;font-size:11px;color:#666;text-align:center;line-height:1.5;">
      Centralita: +34 693 693 048<br>
      Productora EAR • EAR OS V2 • Split Soberano 80/10/10<br>
      © 2026 Todos los derechos reservados.
    </div>
  </div>
</body>
</html>`.trim();

  return sendEmail(
    payload.clientEmail,
    `✅ Reserva Confirmada • ${payload.eventType} (${payload.bookingId})`,
    html
  );
}

// ─── ARTIST BOOKING NOTIFICATION ───────────────────────────────────────
export interface ArtistNotificationPayload {
  artistName: string;
  artistEmail: string;
  eventDate: string;
  eventType: string;
  location: string;
  estimatedFee: number;
  clientName: string;
  bookingId: string;
}

export async function sendArtistBookingNotification(payload: ArtistNotificationPayload): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><title>Nueva Reserva</title></head>
<body style="background-color:#050505;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;padding:40px 20px;">
  <div style="max-width:600px;margin:0 auto;background:#09090d;border:1px solid rgba(236,182,19,0.3);border-radius:24px;padding:40px;">
    <div style="text-align:center;margin-bottom:30px;">
      <span style="font-size:10px;font-family:monospace;letter-spacing:3px;color:#ecb613;text-transform:uppercase;">EManeger Studio • Nueva Reserva</span>
      <h1 style="color:#fff;font-size:22px;margin:10px 0;">¡Nuevo Booking Confirmado!</h1>
    </div>
    <p style="font-size:14px;color:#ccc;">Hola <strong>${payload.artistName}</strong>,</p>
    <p style="font-size:14px;color:#ccc;">Tienes una nueva reserva confirmada. El cliente ya ha depositado y tu fecha está bloqueada.</p>
    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:20px;margin:25px 0;">
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tr><td style="color:#888;padding:6px 0;">Booking:</td><td style="color:#ecb613;font-family:monospace;text-align:right;">${payload.bookingId}</td></tr>
        <tr><td style="color:#888;padding:6px 0;">Cliente:</td><td style="color:#fff;text-align:right;">${payload.clientName}</td></tr>
        <tr><td style="color:#888;padding:6px 0;">Fecha:</td><td style="color:#fff;font-weight:bold;text-align:right;">${payload.eventDate}</td></tr>
        <tr><td style="color:#888;padding:6px 0;">Evento:</td><td style="color:#fff;text-align:right;">${payload.eventType}</td></tr>
        <tr><td style="color:#888;padding:6px 0;">Ubicación:</td><td style="color:#fff;text-align:right;">${payload.location}</td></tr>
        <tr style="border-top:1px solid rgba(255,255,255,0.08);"><td style="color:#888;padding:10px 0;">Tu Caché Neto (80%):</td><td style="color:#22c55e;font-weight:bold;font-size:16px;text-align:right;padding:10px 0;">${payload.estimatedFee.toLocaleString('es-ES')} €</td></tr>
      </table>
    </div>
    <div style="text-align:center;margin:25px 0;">
      <a href="https://www.productoraear.com/studio/artist/bookings" style="background:#ecb613;color:#000;font-weight:900;font-size:12px;text-transform:uppercase;letter-spacing:1px;text-decoration:none;padding:14px 28px;border-radius:12px;display:inline-block;">Ver en EManeger Studio</a>
    </div>
    <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:20px;font-size:11px;color:#666;text-align:center;">Split Soberano: 80% Artista / 10% EAR OS / 10% VIMUME</div>
  </div>
</body>
</html>`.trim();

  return sendEmail(
    payload.artistEmail,
    `🎵 Nuevo Booking • ${payload.eventType} el ${payload.eventDate}`,
    html
  );
}

// ─── OTP EMAIL ─────────────────────────────────────────────────────────
export async function sendOTPEmail(email: string, otpCode: string): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><title>Código de Verificación</title></head>
<body style="background-color:#050505;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;padding:40px 20px;">
  <div style="max-width:480px;margin:0 auto;background:#09090d;border:1px solid rgba(236,182,19,0.3);border-radius:24px;padding:40px;text-align:center;">
    <span style="font-size:10px;font-family:monospace;letter-spacing:3px;color:#ecb613;text-transform:uppercase;">EAR OS V2 • Verificación</span>
    <h1 style="color:#fff;font-size:20px;margin:15px 0;">Tu Código de Acceso</h1>
    <div style="background:rgba(236,182,19,0.1);border:2px solid #ecb613;border-radius:16px;padding:20px;margin:25px 0;">
      <span style="font-size:36px;font-weight:900;font-family:monospace;letter-spacing:8px;color:#ecb613;">${otpCode}</span>
    </div>
    <p style="font-size:12px;color:#888;margin-top:20px;">Este código expira en <strong>5 minutos</strong>. No compartas este código con nadie.</p>
    <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:20px;margin-top:30px;font-size:11px;color:#666;">
      Si no solicitaste este código, ignora este correo.<br>
      Productora EAR • +34 693 693 048
    </div>
  </div>
</body>
</html>`.trim();

  return sendEmail(email, `🔐 Código de Verificación EAR OS: ${otpCode}`, html);
}
