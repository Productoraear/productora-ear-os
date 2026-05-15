"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * 🏛️ THEME WRAPPER
 * Dynamically applies the VIMUME theme class to the body.
 */
export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isVimume = pathname.startsWith('/vimume');

  useEffect(() => {
    if (isVimume) {
      document.body.classList.add('theme-vimume');
    } else {
      document.body.classList.remove('theme-vimume');
    }
  }, [isVimume]);

  return <>{children}</>;
}
