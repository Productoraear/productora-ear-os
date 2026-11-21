/**
 * ══════════════════════════════════════════════════════════════════════════════
 * SOVEREIGN VOICE ENGINE & MULTI-TENANT PROFILE ROUTER — EAR OS v12.1 S-CLASS
 * ══════════════════════════════════════════════════════════════════════════════
 * Capa de abstracción vocal agéntica que aísla estrictamente la identidad
 * del Artista Fundador (Edwin Agudelo) y gestiona perfiles vocales autónomos
 * para Fincas, Restaurantes y proveedores homologados.
 *
 * Principio Constitucional:
 * - Edwin Agudelo (`ARTIST_FOUNDER`): Inmutable (`isImmutable: true`), tono lírico
 *   y de cierre comercial. Ningún tenant puede sobrescribir este perfil.
 * - Otzarreta / Ezkertza Berria (`VENUE_MAITRE`): Tono hospitalario, pausado,
 *   gastronómico y de sala señorial.
 * - Proveedores / Terceros (`CUSTOM_TENANT`): Perfil adaptable con hooks para
 *   pesos de inferencia neuronal externos (VibeVoice / ElevenLabs / Fish Audio).
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type VoiceProfileType = 'ARTIST_FOUNDER' | 'VENUE_MAITRE' | 'CUSTOM_TENANT';

export interface VoiceProfile {
  tenantId: string;
  profileType: VoiceProfileType;
  voiceId: string;
  voiceName: string;
  systemTone: string;
  pitch: number;
  speedMultiplier: number;
  isImmutable: boolean; // TRUE para Edwin Agudelo. Blindado por gobernanza.
  externalInferenceEndpoint?: string;
  fallbackLang: string;
  description: string;
}

/**
 * Perfil Inmutable Constitucional del Paciente Cero y Artista Fundador.
 * Suelo canónico: 350 € base / 550 € estándar con Bose L1 Pro.
 */
export const EDWIN_AGUDELO_VOICE_PROFILE: Readonly<VoiceProfile> = Object.freeze({
  tenantId: 'edwin-agudelo',
  profileType: 'ARTIST_FOUNDER',
  voiceId: 'edwin-tenor-lyric-sclass',
  voiceName: 'Edwin Agudelo (Tenor Solista & Dirección)',
  systemTone: 'Lírico, cercano, elegante, resolutivo y con autoridad artística en música para eventos.',
  pitch: 0.98,
  speedMultiplier: 1.02,
  isImmutable: true,
  fallbackLang: 'es-ES',
  description: 'Voz oficial de Edwin Agudelo para contratación de directos, serenatas y solista.',
});

/**
 * Perfil de Sala y Alta Gastronomía para Caserío Ezkertza Berria & Otzarreta (Derio).
 */
export const OTZARRETA_VOICE_PROFILE: Readonly<VoiceProfile> = Object.freeze({
  tenantId: 'otzarreta',
  profileType: 'VENUE_MAITRE',
  voiceId: 'otzarreta-maitre-sala',
  voiceName: 'Maître Ezkertza Berria & Otzarreta (Eduardo Martínez)',
  systemTone: 'Hospitalario, pausado, distinguido, con profundo conocimiento de producto vasco y brasas.',
  pitch: 0.95,
  speedMultiplier: 0.98,
  isImmutable: false,
  fallbackLang: 'es-ES',
  description: 'Voz del servicio de sala para banquetes, aforos (salón 200 / jardín 350 pax) y los 4 menús de gala (145–185 € + IVA) de Ezkertza Berria & Otzarreta (Derio 1902).',
});

/**
 * Perfil Institucional B2G y Licitaciones de la Centralita.
 */
export const B2G_INSTITUTIONAL_VOICE_PROFILE: Readonly<VoiceProfile> = Object.freeze({
  tenantId: 'b2g-institucional',
  profileType: 'CUSTOM_TENANT',
  voiceId: 'ear-b2g-consultant',
  voiceName: 'Consultor Gabinete B2G (Art. 118 LCSP)',
  systemTone: 'Técnico, formal, preciso, orientado a pliegos administrativos y expedientes menores.',
  pitch: 1.0,
  speedMultiplier: 1.05,
  isImmutable: false,
  fallbackLang: 'es-ES',
  description: 'Voz técnica para secretarías de ayuntamientos y contratación pública menor.',
});

/**
 * Perfil Genérico por defecto para la Centralita de Productora EAR.
 */
export const DEFAULT_CENTRALITA_VOICE_PROFILE: Readonly<VoiceProfile> = Object.freeze({
  tenantId: 'centralita-general',
  profileType: 'CUSTOM_TENANT',
  voiceId: 'ear-centralita-concierge',
  voiceName: 'Conserjería Centralita EAR OS',
  systemTone: 'Cálido, profesional, ágil y servicial.',
  pitch: 1.0,
  speedMultiplier: 1.0,
  isImmutable: false,
  fallbackLang: 'es-ES',
  description: 'Voz de atención general para consultas, directorio y derivación telefónica.',
});

/**
 * Resuelve deterministamente el perfil vocal según la ruta canónica y el tenant.
 *
 * @param pathname Ruta actual del navegador o request context
 * @param explicitTenantId Tenant opcional suministrado por la cabecera
 */
export function resolveVoiceProfile(pathname: string = '', explicitTenantId?: string): VoiceProfile {
  const cleanPath = pathname.toLowerCase();
  const cleanTenant = (explicitTenantId || '').toLowerCase();

  // 1. BLINDAJE INMUTABLE: Rutas de Edwin Agudelo o catálogo musical propio
  if (
    cleanTenant === 'edwin-agudelo' ||
    cleanTenant === 'e78903' ||
    cleanPath.includes('/reservar/solista') ||
    cleanPath.includes('/artistas/e78903') ||
    cleanPath.includes('/edwin-agudelo') ||
    cleanPath.includes('/solista')
  ) {
    return EDWIN_AGUDELO_VOICE_PROFILE;
  }

  // 2. OTZARRETA / EZKERTZA BERRIA: Caserío y restaurante en Derio
  if (
    cleanTenant === 'otzarreta' ||
    cleanTenant === 'restaurante-otzarreta' ||
    cleanTenant === 'ezkertza-berria' ||
    /(?:^|\/)(?:otzarreta|restaurante-otzarreta|ezkertza(?:-berria)?)(?:\/|$|\?)/i.test(cleanPath)
  ) {
    return OTZARRETA_VOICE_PROFILE;
  }

  // 3. GABINETE B2G Y EXPEDIENTES ART. 118
  if (
    cleanTenant === 'b2g' ||
    cleanPath.includes('/ayuntamientos') ||
    cleanPath.includes('/b2g') ||
    cleanPath.includes('/licitaciones')
  ) {
    return B2G_INSTITUTIONAL_VOICE_PROFILE;
  }

  // 4. Default: Centralita General
  return DEFAULT_CENTRALITA_VOICE_PROFILE;
}

/**
 * Validador de inmutabilidad: asegura que ninguna mutación externa altere
 * la voz del Artista Fundador.
 */
export function assertVoiceProfileIntegrity(profile: VoiceProfile): boolean {
  if (profile.tenantId === 'edwin-agudelo') {
    return profile.isImmutable === true && profile.profileType === 'ARTIST_FOUNDER';
  }
  return true;
}
