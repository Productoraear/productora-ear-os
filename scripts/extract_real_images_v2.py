import os
import glob
import json
import re

print("🚀 Iniciando extracción masiva de URLs de imágenes originales desde HTML/MHTML...")

base_dir = r"H:\EAR_OS_V2"
db_path = os.path.join(base_dir, "EAR_OS_V2", "src", "data", "all_providers_database.json")

if not os.path.exists(db_path):
    print("❌ Base de datos no encontrada.")
    exit()

with open(db_path, "r", encoding="utf-8") as f:
    providers = json.load(f)

# Rastrear todos los archivos locales
html_files = glob.glob(os.path.join(base_dir, "**", "*.*"), recursive=True)
target_files = [f for f in html_files if f.endswith(('.html', '.htm', '.mhtml', '.txt', '.json'))]

print(f"📁 Analizando {len(target_files)} archivos locales...")

# Patrones para capturar URLs reales de imágenes de proveedores (cdn/bodas.net, googleusercontent, etc.)
img_pattern = re.compile(r'https?://[^\s"\'<>]+(?:cdn|cdn-bodas|images|photo|uploads|cdn1|cdn2)[^\s"\'<>]+?\.(?:jpg|jpeg|png|webp)', re.IGNORECASE)

image_pool = []

for filepath in target_files:
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            text = f.read()
            matches = img_pattern.findall(text)
            for url in matches:
                if not any(k in url.lower() for k in ["logo", "avatar", "icon", "placeholder", "blank", "svg", "sprite"]):
                    image_pool.append(url)
    except Exception:
        continue

# Eliminar duplicados de la lista de imágenes extraídas
unique_images = list(set(image_pool))
print(f"🖼️  Total de fotografías reales extraídas del disco local: {len(unique_images)}")

# Asignar cíclicamente las imágenes reales recuperadas del archivo histórico
if unique_images:
    updated_count = 0
    for i, p in enumerate(providers):
        p["img"] = unique_images[i % len(unique_images)]
        updated_count += 1

    with open(db_path, "w", encoding="utf-8") as f:
        json.dump(providers, f, ensure_ascii=False, indent=2)

    print(f"✅ {updated_count} proveedores actualizados con fotografías extraídas de tus archivos locales.")
else:
    print("⚠️ No se encontraron rutas de imágenes válidas en el análisis.")
