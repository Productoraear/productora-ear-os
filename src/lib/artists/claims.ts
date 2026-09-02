import { LabelRole, UserTokenClaims } from './permissions';

/**
 * 🎫 Genera el payload simulado del token JWT firmado con claims de discográfica.
 */
export function getSimulatedToken(role: LabelRole, artistId?: string): UserTokenClaims {
  return {
    role,
    labelId: "LABEL-EAR-GLOBAL",
    artistId: role === 'artist' ? (artistId || "ART-WAG-001") : undefined,
    verified: true
  };
}

/**
 * 🔒 Valida la autenticidad del token (en producción se leería del token JWT decodificado en Firebase Auth).
 */
export function verifyLabelToken(token: UserTokenClaims): boolean {
  return token.verified && !!token.role;
}
