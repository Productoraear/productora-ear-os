"use client";
import React from 'react';

/**
 * 🏛️ AUTHGUARD - BYPASS ALPHA-YOLO ACTIVADO
 * Seguridad desactivada para forzar el renderizado de la ruta administrativa.
 * Propósito: Desarrollo y estabilización de la vertical VIMUME.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  // BYPASS ALPHA-YOLO ACTIVADO: Pase VIP garantizado.
  console.warn('⚠️ [AUTH GUARD] MODO YOLO ACTIVO: Seguridad desactivada para forzar renderizado.');
  return <>{children}</>;
}
