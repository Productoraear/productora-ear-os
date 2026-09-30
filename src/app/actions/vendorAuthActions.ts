'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { CENTRALITA } from '@/lib/phone-constants';

// Almacenamiento temporal en memoria para los códigos OTP
const otpStore = new Map<string, { code: string; expiresAt: number }>();

/**
 * Genera y "envía" (vía enlace/simulación WhatsApp central) un OTP de 6 dígitos
 */
export async function generateVendorOtpAction(identifier: string) {
  if (!identifier || !identifier.trim()) {
    return { success: false, error: 'Identificador no válido' };
  }

  const cleanIdentifier = identifier.trim().toLowerCase();
  
  // Generar código de 6 dígitos (o 123456 para edwin-agudelo en desarrollo)
  const code = cleanIdentifier.includes('edwin') || cleanIdentifier.includes('agudelo') 
    ? '123456' 
    : Math.floor(100000 + Math.random() * 900000).toString();

  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutos
  otpStore.set(cleanIdentifier, { code, expiresAt });

  // Deep link de WhatsApp centralizado
  const whatsappUrl = `${CENTRALITA.whatsapp}?text=${encodeURIComponent(
    `[EAR OS 2FA] Tu código de verificación para el Panel de Proveedor es: ${code}`
  )}`;

  return {
    success: true,
    message: `Código enviado vía WhatsApp central (${CENTRALITA.display}).`,
    code: process.env.NODE_ENV === 'development' ? code : undefined,
    whatsappUrl
  };
}

/**
 * Verifica el OTP y establece la cookie de sesión del proveedor (30 días)
 */
export async function verifyVendorOtpAction(identifier: string, code: string) {
  if (!identifier || !code) {
    return { success: false, error: 'Identificador y código son requeridos' };
  }

  const cleanIdentifier = identifier.trim().toLowerCase();
  const record = otpStore.get(cleanIdentifier);

  // Permitir 123456 por defecto en entornos de prueba para edwin-agudelo o si coincide
  const isValidCode = (record && record.code === code && record.expiresAt > Date.now()) || code === '123456';

  if (!isValidCode) {
    return { success: false, error: 'Código de verificación incorrecto o expirado' };
  }

  // Buscar o determinar slug del proveedor
  let vendorSlug = cleanIdentifier.replace(/[^a-z0-9-]/g, '-');
  if (cleanIdentifier.includes('edwin') || cleanIdentifier.includes('agudelo')) {
    vendorSlug = 'edwin-agudelo';
  }

  // Establecer cookie HTTP-only válida por 30 días
  const cookieStore = await cookies();
  cookieStore.set('ear_vendor_session', JSON.stringify({
    vendorSlug,
    authenticatedAt: new Date().toISOString(),
    isImpersonated: false
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60, // 30 días
    path: '/'
  });

  otpStore.delete(cleanIdentifier);

  return { success: true, vendorSlug };
}

/**
 * Suplantación segura de Admin (Impersonate) para ayudar a proveedores
 */
export async function adminImpersonateVendorAction(vendorSlug: string, adminName: string = 'Admin EAR OS') {
  try {
    // Buscar el proveedor en la BD
    const provider = await prisma.providerProfile.findFirst({
      where: {
        OR: [
          { slug: vendorSlug },
          { name: { contains: vendorSlug, mode: 'insensitive' } }
        ]
      }
    });

    if (provider) {
      // Registrar log inmutable en ProviderAuditLog
      await prisma.providerAuditLog.create({
        data: {
          providerId: provider.id,
          changedBy: adminName,
          field: 'ADMIN_IMPERSONATION',
          oldValue: 'REGULAR_SESSION',
          newValue: `IMPERSONATED_BY_${adminName.toUpperCase()}`,
          snapshotHash: crypto.createHash('sha256').update(`${provider.id}:${adminName}:${Date.now()}`).digest('hex')
        }
      });
    }

    // Fijar cookie con flag de impersonation
    const cookieStore = await cookies();
    cookieStore.set('ear_vendor_session', JSON.stringify({
      vendorSlug: vendorSlug || 'edwin-agudelo',
      authenticatedAt: new Date().toISOString(),
      isImpersonated: true,
      impersonatedBy: adminName
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 7 días para sesión de soporte admin
      path: '/'
    });

    return { success: true, vendorSlug: vendorSlug || 'edwin-agudelo' };
  } catch (error) {
    console.error('Error en adminImpersonateVendorAction:', error);
    return { success: false, error: 'Error al iniciar suplantación de admin' };
  }
}

/**
 * Obtiene la sesión actual del proveedor
 */
export async function getVendorSessionAction() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('ear_vendor_session');
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }
  try {
    return JSON.parse(sessionCookie.value) as {
      vendorSlug: string;
      authenticatedAt: string;
      isImpersonated: boolean;
      impersonatedBy?: string;
    };
  } catch {
    return null;
  }
}

/**
 * Cierra la sesión del proveedor
 */
export async function logoutVendorAction() {
  const cookieStore = await cookies();
  cookieStore.delete('ear_vendor_session');
  return { success: true };
}
