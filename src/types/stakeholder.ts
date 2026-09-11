// src/types/stakeholder.ts

export type StakeholderRole = 'VISITOR' | 'CLIENT' | 'PROVIDER' | 'ADMIN';

export interface StakeholderViewPermissions {
  canViewFinances: boolean;
  canViewLogistics: boolean;
  canApproveContracts: boolean;
  canModifyLineItems: boolean;
  canClaimProfile: boolean;
}

export const STAKEHOLDER_PERMISSIONS: Record<StakeholderRole, StakeholderViewPermissions> = {
  VISITOR: {
    canViewFinances: false,
    canViewLogistics: false,
    canApproveContracts: false,
    canModifyLineItems: false,
    canClaimProfile: false,
  },
  CLIENT: {
    canViewFinances: true,
    canViewLogistics: true,
    canApproveContracts: true,
    canModifyLineItems: false, // El cliente solicita cambios, no modifica el sistema base
    canClaimProfile: false,
  },
  PROVIDER: {
    canViewFinances: true,     // Solo de sus servicios (filtrado en el backend)
    canViewLogistics: true,    // Solo de sus rutas asignadas
    canApproveContracts: true, // Sus propios contratos
    canModifyLineItems: false,
    canClaimProfile: true,     // Permite reclamar el VendorShadowProfile
  },
  ADMIN: {
    canViewFinances: true,
    canViewLogistics: true,
    canApproveContracts: true,
    canModifyLineItems: true,
    canClaimProfile: false,
  }
};
