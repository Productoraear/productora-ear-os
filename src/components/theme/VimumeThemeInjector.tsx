'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const VimumeThemeInjector: React.FC = React.memo(function VimumeThemeInjector() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && pathname.startsWith('/vimume')) {
      document.body.classList.add('theme-vimume');
    } else {
      document.body.classList.remove('theme-vimume');
    }
  }, [pathname]);

  return null;
});
