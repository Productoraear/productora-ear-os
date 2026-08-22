"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type TenantRole = 'B2C_NOVIOS' | 'B2G_AYUNTAMIENTOS' | 'B2B_EMPRESARIOS' | 'ARTISTA_THE_SIGNAL';

export interface RoleMetadata {
  id: TenantRole;
  title: string;
  badge: string;
  accentColor: string;
  description: string;
  defaultPath: string;
  focusKeywords: string[];
  linchpinMetric: string;
}

export const ROLE_METADATA_MAP: Record<TenantRole, RoleMetadata> = {
  B2C_NOVIOS: {
    id: 'B2C_NOVIOS',
    title: 'Novios & Bodas Bespoke',
    badge: 'B2C • Alta Distinción',
    accentColor: '#ecb613',
    description: 'Protocolo de autor, sonorización Bose 2.000W calibrada a 12 W/pax y Price-Lock 72h.',
    defaultPath: '/bodas',
    focusKeywords: ['Solista Premium 350€', 'Ensamble 6 Músicos', 'Plan B Garantizado', 'Bodas.net 5.0★'],
    linchpinMetric: '12 W/pax Presión Acústica'
  },
  B2G_AYUNTAMIENTOS: {
    id: 'B2G_AYUNTAMIENTOS',
    title: 'Administración Pública & Licitaciones',
    badge: 'B2G • Art. 118 LCSP',
    accentColor: '#3b82f6',
    description: 'Contratos menores <15.000€, estimulación neurocognitiva 40Hz VIMUME y fondos NextGenEU.',
    defaultPath: '/vimume',
    focusKeywords: ['Expediente Pozuelo 13.775€', 'Memoria Técnica LCSP', 'Adjudicación Directa', 'Salud 40Hz'],
    linchpinMetric: '<15.000 € Contrato Menor'
  },
  B2B_EMPRESARIOS: {
    id: 'B2B_EMPRESARIOS',
    title: 'Transformación Empresarial B2B',
    badge: 'B2B • Alta Dirección',
    accentColor: '#10b981',
    description: 'Acompañamiento estratégico, auditoría de procesos y gestión de activos de alta rentabilidad.',
    defaultPath: '/empresarios',
    focusKeywords: ['Plan Ejecución 1.000€/m', 'Premium Business 3.000€/m', 'Garantía de ROI', 'Ingeniería de Ventas'],
    linchpinMetric: 'LTV:CAC >= 3:1'
  },
  ARTISTA_THE_SIGNAL: {
    id: 'ARTISTA_THE_SIGNAL',
    title: 'The Signal • Talent Vault',
    badge: 'Artistas • Split 80/10/10',
    accentColor: '#a855f7',
    description: 'Blindaje de carrera, microfonía Shure Axient Digital, póliza RC 1.000.000€ y soberanía patrimonial.',
    defaultPath: '/artistas/edwin-agudelo',
    focusKeywords: ['Split Soberano 80/10/10', 'Master Rights Defense', 'Rider Shure Axient', 'Dossier de Autor'],
    linchpinMetric: '80% Soberanía Artística'
  }
};

interface TenantRoleContextType {
  role: TenantRole;
  setRole: (role: TenantRole) => void;
  metadata: RoleMetadata;
}

const TenantRoleContext = createContext<TenantRoleContextType>({
  role: 'B2C_NOVIOS',
  setRole: () => {},
  metadata: ROLE_METADATA_MAP.B2C_NOVIOS
});

export const TenantRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<TenantRole>(() => {
    if (typeof window === 'undefined') return 'B2C_NOVIOS';
    try {
      const saved = localStorage.getItem('ear-tenant-role') as TenantRole;
      if (saved && ROLE_METADATA_MAP[saved]) return saved;
    } catch {}
    return 'B2C_NOVIOS';
  });

  const setRole = (newRole: TenantRole) => {
    setRoleState(newRole);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ear-tenant-role', newRole);
      } catch (e) {
        console.warn('Error saving tenant role:', e);
      }
    }
  };

  return (
    <TenantRoleContext.Provider
      value={{
        role,
        setRole,
        metadata: ROLE_METADATA_MAP[role]
      }}
    >
      {children}
    </TenantRoleContext.Provider>
  );
};

export const useTenantRole = () => useContext(TenantRoleContext);
export default TenantRoleContext;
