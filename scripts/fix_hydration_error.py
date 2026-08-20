import os

print("🛡️ APLICANDO PROTECCIÓN DE HIDRATACIÓN CONTRA EXTENSIONES...")

base_dir = r"H:\EAR_OS_V2\EAR_OS_V2"
layout_path = os.path.join(base_dir, "src", "app", "layout.tsx")

if os.path.exists(layout_path):
    with open(layout_path, "r", encoding="utf-8") as f:
        code = f.read()
    
    # Inyectar suppressHydrationWarning en las etiquetas html y body si no existe
    if "suppressHydrationWarning" not in code:
        code = code.replace("<html", "<html suppressHydrationWarning")
        code = code.replace("<body", "<body suppressHydrationWarning")
        with open(layout_path, "w", encoding="utf-8") as f:
            f.write(code)
        print("✅ Atributo suppressHydrationWarning inyectado en layout.tsx.")
    else:
        print("ℹ️ El atributo ya estaba presente en layout.tsx.")
else:
    print("❌ layout.tsx no encontrado.")
