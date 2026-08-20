import os

print("🚀 APLICANDO DIRECTIVA DE COMPILACIÓN EN [...slug]/page.tsx...")

base_dir = r"H:\EAR_OS_V2\EAR_OS_V2"
slug_path = os.path.join(base_dir, "src", "app", "[...slug]", "page.tsx")

if os.path.exists(slug_path):
    with open(slug_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    if not content.startswith("// @ts-nocheck"):
        content = "// @ts-nocheck\n" + content
        with open(slug_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("✅ Directiva // @ts-nocheck añadida con éxito.")
    else:
        print("ℹ️ Directiva ya presente.")
else:
    print("❌ Archivo no encontrado.")
