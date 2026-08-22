export function createAuditLog(actor, role, action, resourceId, status, details) {
    return {
        id: `AUD-LBL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        timestamp: new Date().toISOString(),
        actor,
        role,
        action,
        resourceId,
        status,
        details
    };
}
