export type AssetStatus = 'VERIFICADO' | 'PENDIENTE' | 'AUDITANDO' | 'LECTURA_PENDIENTE';
export type AssetCategory = 'LEGAL' | 'TECHNICAL' | 'AUDIO' | 'VISUAL' | 'CONTRACT';

export interface VaultAsset {
  id: string;
  name: string;
  category: AssetCategory;
  status: AssetStatus;
  size: string;
  updatedAt: string;
  url?: string;
  metadata?: Record<string, any>;
  isEncrypted: boolean;
}

export interface AuditLogEntry {
  id: string;
  assetId: string;
  userId: string;
  timestamp: string;
  action: 'VIEW' | 'DOWNLOAD' | 'DECRYPT';
  ipAddress: string;
}
