'use client';

import React, { useEffect } from 'react';
import { useSovereignRole } from '@/shared/hooks/useSovereignRole';

export const RoleSkinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isB2G, isB2C, isB2B } = useSovereignRole();

  useEffect(() => {
    // Restaurar clase base
    document.body.classList.remove('theme-b2g', 'theme-b2c', 'theme-b2b');

    // Inyectar Skin según el rol SOBERANO
    if (isB2G) {
      document.body.classList.add('theme-b2g');
    } else if (isB2C) {
      document.body.classList.add('theme-b2c');
    } else if (isB2B) {
      document.body.classList.add('theme-b2b');
    }
  }, [isB2G, isB2C, isB2B]);

  return <>{children}</>;
};
