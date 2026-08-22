# -*- coding: utf-8 -*-
import os
import re

print("🔧 REPARANDO THEME CONTEXT Y METADATOS SSR...")

# A. Reescribir ThemeContext.tsx con montaje diferido
theme_path = os.path.join("src", "app", "context", "ThemeContext.tsx")

theme_code = """'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

function ThemeBridge({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted ? (
        <NextThemesProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme="dark"
          enableColorScheme={false}
        >
          <ThemeBridge>{children}</ThemeBridge>
        </NextThemesProvider>
      ) : (
        <ThemeBridge>{children}</ThemeBridge>
      )}
    </>
  );
}
"""

with open(theme_path, "w", encoding="utf-8") as f:
    f.write(theme_code)
print("✅ ThemeContext.tsx reescrito con montaje diferido cliente (React 19 OK).")

# B. Asegurar navegación segura en [...slug]/page.tsx
slug_path = os.path.join("src", "app", "[...slug]", "page.tsx")
if os.path.exists(slug_path):
    with open(slug_path, "r", encoding="utf-8") as f:
        code = f.read()

    code = re.sub(
        r'semantic\.canonicalPath\.replace\(',
        '(semantic?.canonicalPath || "").replace(',
        code
    )
    code = re.sub(
        r'semantic\.metaDescription',
        '(semantic?.metaDescription || semantic?.description || "")',
        code
    )

    with open(slug_path, "w", encoding="utf-8") as f:
        f.write(code)
    print("✅ [...slug]/page.tsx: Acceso seguro a canonicalPath parcheado.")

print("==================================================")
