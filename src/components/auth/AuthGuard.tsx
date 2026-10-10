'use client';

import type { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
  /** Mensaje opcional mostrado cuando el usuario no está autenticado. */
  fallbackMessage?: string;
  /** Etiqueta accesible para el contenedor de alerta. */
  alertAriaLabel?: string;
}

const DEFAULT_FALLBACK_MESSAGE = 'No estás autenticado';
const DEFAULT_ALERT_ARIA_LABEL = 'Advertencia de autenticación';

const AuthGuard = ({
  children,
  fallbackMessage = DEFAULT_FALLBACK_MESSAGE,
  alertAriaLabel = DEFAULT_ALERT_ARIA_LABEL,
}: AuthGuardProps): ReactNode => {
  const isAuthenticated = true; // Replace with actual authentication check

  if (!isAuthenticated) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        aria-label={alertAriaLabel}
        tabIndex={-1}
        className="text-red-400"
      >
        {fallbackMessage}
      </div>
    );
  }

  return (
    <div role="region" aria-label="Contenido protegido">
      {children}
    </div>
  );
};

export default AuthGuard;