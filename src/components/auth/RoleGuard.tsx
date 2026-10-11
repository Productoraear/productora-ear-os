"use client";

import React from 'react';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'SOVEREIGN' | 'EDITOR';
}

/**
 * EAR OS — Role Guard (server-authoritative).
 * La autenticación real se impone en el edge (src/middleware.ts) y en las
 * Server Actions / API routes. Este componente ya no lee localStorage ni
 * valida contraseñas en el cliente: solo actúa como pasarela tipada para
 * mantener la firma de los componentes existentes.
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({ children }) => {
  return <>{children}</>;
};

export default RoleGuard;