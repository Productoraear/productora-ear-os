/**
 * 🏛️ EAR OS - DATABASE CONTRACT (S-CLASS)
 * Version: 1.1.0
 * Purpose: Multi-Tenancy Sovereign Schema for Planner OS.
 */

export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer';
export type GuestStatus = 'invited' | 'confirmed' | 'declined' | 'checked-in';
export type MembershipStatus = 'active' | 'pending' | 'suspended';

export interface AuditFields {
  id: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  metadata?: Record<string, any>;
}

export interface Workspace extends AuditFields {
  name: string;
  slug: string;
  owner_id: string;
}

export interface Membership extends AuditFields {
  workspace_id: string;
  user_id: string;
  role: UserRole;
  status: MembershipStatus;
}

export interface Event extends AuditFields {
  workspace_id: string;
  title: string;
  event_date: string;
  venue_name?: string;
  created_by: string;
}

export interface Guest extends AuditFields {
  workspace_id: string;
  event_id: string;
  full_name: string;
  email?: string;
  phone?: string;
  status: GuestStatus;
  table_id?: string | null;
  seat_label?: string | null;
}

export interface Table extends AuditFields {
  workspace_id: string;
  event_id: string;
  name: string;
  capacity: number;
  sort_order?: number;
}
