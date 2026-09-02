export type LabelRole = 'super_admin' | 'label_admin' | 'artist_manager' | 'artist' | 'viewer';

export interface UserTokenClaims {
  role: LabelRole;
  labelId?: string;
  artistId?: string;
  verified: boolean;
}

export const ROLE_PERMISSIONS: Record<LabelRole, {
  canViewAllArtists: boolean;
  canEditArtists: boolean;
  canViewFinancials: boolean;
  canManageContracts: boolean;
  canEditOwnArtistOnly: boolean;
  canAccessAnalytics: boolean;
}> = {
  super_admin: {
    canViewAllArtists: true,
    canEditArtists: true,
    canViewFinancials: true,
    canManageContracts: true,
    canEditOwnArtistOnly: false,
    canAccessAnalytics: true
  },
  label_admin: {
    canViewAllArtists: true,
    canEditArtists: true,
    canViewFinancials: true,
    canManageContracts: true,
    canEditOwnArtistOnly: false,
    canAccessAnalytics: true
  },
  artist_manager: {
    canViewAllArtists: true,
    canEditArtists: true,
    canViewFinancials: false,
    canManageContracts: false,
    canEditOwnArtistOnly: false,
    canAccessAnalytics: true
  },
  artist: {
    canViewAllArtists: false,
    canEditArtists: false,
    canViewFinancials: true,
    canManageContracts: true,
    canEditOwnArtistOnly: true,
    canAccessAnalytics: true
  },
  viewer: {
    canViewAllArtists: true,
    canEditArtists: false,
    canViewFinancials: false,
    canManageContracts: false,
    canEditOwnArtistOnly: false,
    canAccessAnalytics: true
  }
};

/**
 * 🛡️ Valida si un usuario tiene permisos específicos para un recurso artístico.
 */
export function hasPermission(
  claims: UserTokenClaims,
  action: keyof typeof ROLE_PERMISSIONS['viewer'],
  targetArtistId?: string
): boolean {
  const perms = ROLE_PERMISSIONS[claims.role];
  if (!perms) return false;

  // Si tiene acceso global
  if (perms[action] && !perms.canEditOwnArtistOnly) {
    return true;
  }

  // Si está restringido a su propio perfil de artista
  if (perms.canEditOwnArtistOnly && targetArtistId && claims.artistId === targetArtistId) {
    return true;
  }

  return false;
}
