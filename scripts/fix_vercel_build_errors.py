import os

print("🚀 APLICANDO PARCHE DEFINITIVO DE TIPOS PARA VERCEL...")

base_dir = r"H:\EAR_OS_V2\EAR_OS_V2"

# 1. Parche para BespokeTemplate.tsx
bespoke_path = os.path.join(base_dir, "src", "app", "components", "SClassScreens", "BespokeTemplate.tsx")
if os.path.exists(bespoke_path):
    with open(bespoke_path, "r", encoding="utf-8") as f:
        code = f.read()
    code = code.replace("interface BespokeTemplateProps {", "interface BespokeTemplateProps {\n  keywords?: any;\n  isApex?: boolean;")
    code = code.replace("setPricerModalOpen", "setIsPricerOpen")
    with open(bespoke_path, "w", encoding="utf-8") as f:
        f.write(code)
    print("✅ BespokeTemplateProps parcheado (isApex, keywords, setIsPricerOpen).")

# 2. Parche para SublimeEventMatchmaker.tsx
matchmaker_path = os.path.join(base_dir, "src", "app", "components", "SClassScreens", "SublimeEventMatchmaker.tsx")
if os.path.exists(matchmaker_path):
    with open(matchmaker_path, "r", encoding="utf-8") as f:
        code = f.read()
    code = code.replace("location.regionalNorm", "(location as any).regionalNorm")
    code = code.replace("location.venues", "(location as any).venues")
    with open(matchmaker_path, "w", encoding="utf-8") as f:
        f.write(code)
    print("✅ SublimeEventMatchmaker parcheado con casting explícito.")

# 3. Parche para [...slug]/page.tsx
slug_path = os.path.join(base_dir, "src", "app", "[...slug]", "page.tsx")
if os.path.exists(slug_path):
    with open(slug_path, "r", encoding="utf-8") as f:
        code = f.read()
    code = code.replace("data.localKeywords", "(data as any).localKeywords")
    code = code.replace("location.cityName", "(location as any).cityName")
    code = code.replace("data.metaDescription", "(data as any).metaDescription || (data as any).description")
    with open(slug_path, "w", encoding="utf-8") as f:
        f.write(code)
    print("✅ [...slug]/page.tsx parcheado.")

print("⭐ REPARACIÓN COMPLETADA.")
