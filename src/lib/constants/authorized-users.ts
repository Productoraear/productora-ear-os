/**
 * 🛡️ USUARIOS Y EQUIPO AUTORIZADO DE EAR OS (S-CLASS)
 * Define las cuentas autorizadas para gestión del sistema, marketing y campañas.
 */

export interface AuthorizedTeamMember {
  email: string;
  name: string;
  role: 'admin' | 'editor';
  title: string;
  department: string;
  allowedScopes: string[];
}

export const AUTHORIZED_TEAM_MEMBERS: AuthorizedTeamMember[] = [
  {
    email: 'edwin.agudelo@productoraear.com',
    name: 'Edwin Agudelo',
    role: 'admin',
    title: 'CEO & Fundador',
    department: 'Dirección General & Operaciones',
    allowedScopes: ['*']
  },
  {
    email: 'edwin@productoraear.com',
    name: 'Edwin Agudelo',
    role: 'admin',
    title: 'CEO Soberano',
    department: 'Dirección General',
    allowedScopes: ['*']
  },
  {
    email: 'adri521@hotmail.com',
    name: 'Adriana',
    role: 'editor',
    title: 'Dirección de Marketing & Relaciones',
    department: 'Marketing, Prensa & Alianzas',
    allowedScopes: ['marketing', 'campaigns', 'providers', 'press', 'crm']
  },
  {
    email: 'agudeloleire@gmail.com',
    name: 'Leire Agudelo',
    role: 'editor',
    title: 'Especialista de Campañas & Marketing Digital',
    department: 'Marketing Digital, Social Media & Ads',
    allowedScopes: ['marketing', 'campaigns', 'social', 'providers', 'crm']
  }
];

/**
 * Normaliza un email para comparación insensible a mayúsculas y espacios.
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Busca un miembro del equipo autorizado por su email.
 */
export function findAuthorizedMember(email: string): AuthorizedTeamMember | undefined {
  const normalized = normalizeEmail(email);
  return AUTHORIZED_TEAM_MEMBERS.find(m => normalizeEmail(m.email) === normalized);
}

/**
 * Verifica si un email está explícitamente autorizado en el sistema.
 */
export function isAuthorizedEmail(email: string): boolean {
  return findAuthorizedMember(email) !== undefined;
}
