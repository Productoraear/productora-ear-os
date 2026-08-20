import os
import shutil

app_dir = r"H:\EAR_OS_V2\EAR_OS_V2\src\app"

print("🔍 Buscando y eliminando carpetas [category] en conflicto...")
for root, dirs, files in os.walk(app_dir):
    for d in dirs:
        if d.lower() == "[category]":
            bad_path = os.path.join(root, d)
            print(f"❌ Eliminando: {bad_path}")
            shutil.rmtree(bad_path, ignore_errors=True)

print("✅ Limpieza de rutas dinámicas completada.")
