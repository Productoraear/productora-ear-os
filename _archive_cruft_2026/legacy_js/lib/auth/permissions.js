import { Role } from "@prisma/client";
/**
 * Evaluates whether a role is authorized to perform a specific system action.
 * AXIOMA: ADMIN, COMMANDER, and ARQUITECTO hold global unconstrained clearance.
 */
export function userCan(role, action) {
    // 👑 Absolute Sovereignty Clearances
    if (role === Role.ADMIN ||
        role === Role.COMMANDER ||
        role === Role.ARQUITECTO) {
        return true;
    }
    // 🛡️ Action-Specific Mappings
    switch (action) {
        case "read:all_waybills":
            return role === Role.FLEET_OPERATOR || role === Role.OPERADOR;
        case "write:waybill":
            return (role === Role.ARTIST ||
                role === Role.PROVIDER ||
                role === Role.FLEET_OPERATOR ||
                role === Role.OPERADOR);
        case "fleet:dispatch":
            return role === Role.FLEET_OPERATOR || role === Role.OPERADOR;
        case "read:system_financials":
            // Restricted absolutely to high executive level
            return false;
        case "read:astra_oracle":
            // Restricted absolutely to high executive level
            return false;
        case "write:checkout":
            // Public ledger interaction
            return true;
        case "admin:access":
            return false;
        default:
            return false;
    }
}
