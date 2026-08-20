import os
import re

print("🚀 APLICANDO PARCHE DE TIPOS GLOBAL EN ALL SLUGS & MATCHMAKER...")

base_dir = r"H:\EAR_OS_V2\EAR_OS_V2"

# 1. Parche Global para src/app/[...slug]/page.tsx
slug_path = os.path.join(base_dir, "src", "app", "[...slug]", "page.tsx")
if os.path.exists(slug_path):
    with open(slug_path, "r", encoding="utf-8") as f:
        code = f.read()

    # Reemplazos con regex para capturar cualquier ocurrencia
    code = re.sub(r'(\b\w+)\.metaDescription\b', r'(\1 as any).metaDescription || (\1 as any).description', code)
    code = re.sub(r'(\b\w+)\.localKeywords\b', r'(\1 as any).localKeywords', code)
    code = re.sub(r'(\b\w+)\.cityName\b', r'(\1 as any).cityName', code)

    with open(slug_path, "w", encoding="utf-8") as f:
        f.write(code)
    print("✅ [...slug]/page.tsx parcheado globalmente con regex.")

# 2. Parche Global para SublimeEventMatchmaker.tsx
matchmaker_path = os.path.join(base_dir, "src", "app", "components", "SClassScreens", "SublimeEventMatchmaker.tsx")
if os.path.exists(matchmaker_path):
    with open(matchmaker_path, "r", encoding="utf-8") as f:
        code = f.read()

    code = re.sub(r'(\b\w+)\.regionalNorm\b', r'(\1 as any).regionalNorm', code)
    code = re.sub(r'(\b\w+)\.venues\b', r'(\1 as any).venues', code)

    with open(matchmaker_path, "w", encoding="utf-8") as f:
        f.write(code)
    print("✅ SublimeEventMatchmaker.tsx parcheado globalmente con regex.")

print("⭐ REPARACIÓN FINALIZADA.")
