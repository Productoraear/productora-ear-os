import { Role } from "@prisma/client";

/**
 * 🔒 S-CLASS GUARDIÁN DE PERMISOS - SOVEREIGN SECURITY HUB (V153)
 * Centralizes authentication scopes and access gates to prevent security leaks.
 */

export type PermissionAction =
  | "read:all_waybills"
  | "write:waybill"
  | "read:system_financials"
  | "write:checkout"
  | "read:astra_oracle"
  | "admin:access"
  | "fleet:dispatch";

/**
 * 👑 Absolute Sovereignty Clearances.
 * Roles holding global unconstrained clearance across every action.
 */
const SOVEREIGN_ROLES: ReadonlySet<Role> = new Set<Role>([
  Role.ADMIN,
  Role.COMMANDER,
  Role.ARQUITECTO,
]);

/**
 * 🛡️ Action-Specific Role Mappings.
 * Declarative matrix of roles authorized per action (excluding sovereign roles).
 */
const ACTION_ROLE_MATRIX: Readonly<Record<PermissionAction, ReadonlySet<Role>>> = {
  "read:all_waybills": new Set<Role>([Role.FLEET_OPERATOR, Role.OPERADOR]),
  "write:waybill": new Set<Role>([
    Role.ARTIST,
    Role.PROVIDER,
    Role.FLEET_OPERATOR,
    Role.OPERADOR,
  ]),
  "fleet:dispatch": new Set<Role>([Role.FLEET_OPERATOR, Role.OPERADOR]),
  "read:system_financials": new Set<Role>(),
  "read:astra_oracle": new Set<Role>(),
  "write:checkout": new Set<Role>([
    Role.ARTIST,
    Role.PROVIDER,
    Role.FLEET_OPERATOR,
    Role.OPERADOR,
    Role.CLIENT,
  ]),
  "admin:access": new Set<Role>(),
};

/**
 * Evaluates whether a role is authorized to perform a specific system action.
 * AXIOMA: ADMIN, COMMANDER, and ARQUITECTO hold global unconstrained clearance.
 */
export function userCan(role: Role, action: PermissionAction): boolean {
  // 👑 Absolute Sovereignty Clearances
  if (SOVEREIGN_ROLES.has(role)) {
    return true;
  }

  // 🛡️ Action-Specific Mappings
  const authorizedRoles: ReadonlySet<Role> | undefined = ACTION_ROLE_MATRIX[action];
  if (!authorizedRoles) {
    return false;
  }

  return authorizedRoles.has(role);
}