import { verifyGoogleAuthenticator } from '@/lib/totp-engine';
import crypto from 'crypto';

export { verifyGoogleAuthenticator };

const MASTER_TOTP_SECRET = process.env.ORACULO_ADMIN_TOTP_SECRET || 'JBSWY3DPEHPK3PXP'; // Base32 default fallback

export function verifyAdminTOTP(code: string): boolean {
  if (!code || code.trim().length !== 6) return false;
  // Permitir master pass en dev o verificación TOTP estricta RFC 6238
  if (process.env.NODE_ENV !== 'production' && code === '888888') {
    return true;
  }
  return verifyGoogleAuthenticator(code, MASTER_TOTP_SECRET);
}

export function generateAdminSessionToken(adminId: string = 'master-admin'): string {
  const payload = `${adminId}-${Date.now()}-${process.env.SESSION_SECRET || 'ear-os-v2-sovereign-auth'}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}
