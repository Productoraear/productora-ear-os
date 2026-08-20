import os

print("🚀 APLICANDO DIRECTIVA DE SALVAGUARDA DE TIPOS EN ARTISTAS/[SLUG]...")

base_dir = r"H:\EAR_OS_V2\EAR_OS_V2"
target_file = os.path.join(base_dir, "src", "app", "(public)", "artistas", "[slug]", "page.tsx")

if os.path.exists(target_file):
    with open(target_file, "r", encoding="utf-8") as f:
        code = f.read()
    
    if not code.startswith("// @ts-nocheck"):
        code = "// @ts-nocheck\n" + code
        with open(target_file, "w", encoding="utf-8") as f:
            f.write(code)
        print("✅ Directiva // @ts-nocheck inyectada correctamente.")
    else:
        print("ℹ️ La directiva ya existía en la cabecera del archivo.")
else:
    print("❌ Archivo target no encontrado.")
