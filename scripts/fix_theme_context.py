# -*- coding: utf-8 -*-
import os
import re

theme_path = os.path.join("src", "app", "context", "ThemeContext.tsx")

if os.path.exists(theme_path):
    with open(theme_path, "r", encoding="utf-8") as f:
        code = f.read()

    # Inyectar enableColorScheme={false} para deshabilitar la inyección del tag <script> de next-themes
    if "enableColorScheme={false}" not in code:
        code = code.replace('<NextThemesProvider', '<NextThemesProvider enableColorScheme={false}')

    # Asegurar 'use client' al inicio
    if not code.startswith("'use client'") and not code.startswith('"use client"'):
        code = "'use client';\n" + code

    with open(theme_path, "w", encoding="utf-8") as f:
        f.write(code)

    print("✅ ThemeContext.tsx actualizado con enableColorScheme={false} para React 19.")
