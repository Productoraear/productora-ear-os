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

export function createAuditLog(
  actor: string,
  role: string,
  action: string,
  resourceId: string,
  status: 'SUCCESS' | 'WARNING' | 'FAILED',
  details: string
): LabelAuditLog {
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
