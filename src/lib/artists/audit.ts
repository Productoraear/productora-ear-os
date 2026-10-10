export interface LabelAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  resourceId: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  details: string;
}

export type AuditStatus = LabelAuditLog['status'];

export function createAuditLog(
  actor: string,
  role: string,
  action: string,
  resourceId: string,
  status: AuditStatus,
  details: string
): LabelAuditLog {
  return {
    id: `AUD-LBL-${Math.random().toString(36).slice(2, 11).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    actor,
    role,
    action,
    resourceId,
    status,
    details,
  };
}