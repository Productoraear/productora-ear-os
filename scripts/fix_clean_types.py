import os

print("🚀 APLICANDO REPARACIÓN DEFINITIVA Y LIMPIA DE TIPOS...")

base_dir = r"H:\EAR_OS_V2\EAR_OS_V2"

# 1. Limpieza de BespokeTemplate.tsx
bespoke_path = os.path.join(base_dir, "src", "app", "components", "SClassScreens", "BespokeTemplate.tsx")
if os.path.exists(bespoke_path):
    with open(bespoke_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    new_lines = []
    seen = set()
    in_interface = False
    for line in lines:
        if "interface BespokeTemplateProps" in line:
            in_interface = True
            new_lines.append(line)
            continue
        
        if in_interface:
            if "}" in line and not line.strip().startswith("//"):
                in_interface = False
                new_lines.append(line)
                continue
            
            # Evitar duplicados de claves dentro de la interfaz
            key = line.strip().split("?:")[0].split(":")[0].strip()
            if key in ["keywords", "isApex", "setPricerModalOpen"]:
                if key in seen:
                    continue
                seen.add(key)
        
        new_lines.append(line)
    
    code = "".join(new_lines)
    code = code.replace("setPricerModalOpen", "setIsPricerOpen")
    
    # Asegurar la declaración única de las propiedades opcionales
    if "keywords?:" not in code:
        code = code.replace("interface BespokeTemplateProps {", "interface BespokeTemplateProps {\n  keywords?: any;\n  isApex?: boolean;")
    
    with open(bespoke_path, "w", encoding="utf-8") as f:
        f.write(code)
    print("✅ BespokeTemplate.tsx limpiado sin identificadores duplicados.")

# 2. Reparación de [...slug]/page.tsx mediante regex
slug_path = os.path.join(base_dir, "src", "app", "[...slug]", "page.tsx")
if os.path.exists(slug_path):
    with open(slug_path, "r", encoding="utf-8") as f:
        code = f.read()
    
    # Castear accesos dinámicos que fallan en tsc
    code = code.replace("data.localKeywords", "(data as any).localKeywords")
    code = code.replace("data.metaDescription", "(data as any).metaDescription || (data as any).description")
    code = code.replace("location.cityName", "(location as any).cityName")
    
    with open(slug_path, "w", encoding="utf-8") as f:
        f.write(code)
    print("✅ [...slug]/page.tsx reparado con cast de compatibilidad.")

# 3. Reparación de SublimeEventMatchmaker.tsx
matchmaker_path = os.path.join(base_dir, "src", "app", "components", "SClassScreens", "SublimeEventMatchmaker.tsx")
if os.path.exists(matchmaker_path):
    with open(matchmaker_path, "r", encoding="utf-8") as f:
        code = f.read()
    
    code = code.replace("location.regionalNorm", "(location as any).regionalNorm")
    code = code.replace("location.venues", "(location as any).venues")
    
    with open(matchmaker_path, "w", encoding="utf-8") as f:
        f.write(code)
    print("✅ SublimeEventMatchmaker.tsx reparado.")

print("⭐ CORRECCIÓN DE BUNDLE COMPLETADA.")
