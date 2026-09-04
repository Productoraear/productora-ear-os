'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function VimumeThemeInjector() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && pathname.startsWith('/vimume')) {
      document.body.classList.add('theme-vimume');
    } else {
      document.body.classList.remove('theme-vimume');
    }
  }, [pathname]);

  return null;
}
