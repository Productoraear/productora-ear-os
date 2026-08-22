# -*- coding: utf-8 -*-
import os
import glob
import json
import re

print("🚀 INICIANDO BARRIDO GLOBAL Y MAPEO DE FOTOS DE ORIGEN...")

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
db_path = os.path.join(base_dir, "src", "data", "all_providers_database.json")

if not os.path.exists(db_path):
    # Intentar ruta alternativa
    db_path = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\all_providers_database.json"

if not os.path.exists(db_path):
    print(f"❌ Base de datos no encontrada en {db_path}")
    exit(1)

with open(db_path, "r", encoding="utf-8") as f:
    providers = json.load(f)

def clean_url(url):
    if not url or "unsplash" in str(url).lower():
        return ""
    clean = re.sub(r'/thumb_\d+x\d+/', '/1280/', str(url))
    clean = re.sub(r'/watermark_[^/]+/', '/', clean)
    clean = re.sub(r'/st-logo[^/]+/', '/', clean)
    return clean.split('?')[0]

# Buscar dinámicamente en todo H:\EAR_OS_V2
search_root = r"H:\EAR_OS_V2"
source_json_files = []

for root, dirs, files in os.walk(search_root):
    dirs[:] = [d for d in dirs if d.lower() not in {"node_modules", ".git", ".next", "dist", "build"}]
    for file in files:
        file_lower = file.lower()
        if (("vendor" in file_lower or "imported" in file_lower or "harvested" in file_lower) 
            and file_lower.endswith(".json") 
            and file_lower != "all_providers_database.json"):
            source_json_files.append(os.path.join(root, file))

print(f"📂 Archivos de origen localizados: {len(source_json_files)}")

source_media_map = {}
total_extracted_photos = 0

for b_path in source_json_files:
    try:
        with open(b_path, "r", encoding="utf-8") as bf:
            raw_data = json.load(bf)
            if isinstance(raw_data, dict):
                raw_data = [raw_data]
            if not isinstance(raw_data, list):
                continue

            for item in raw_data:
                if not isinstance(item, dict):
                    continue
                name_val = item.get("name") or item.get("nombre") or ""
                name_key = re.sub(r'\W+', '', str(name_val)).lower()
                if not name_key:
                    continue

                imgs = []
                if item.get("image"): imgs.append(item.get("image"))
                if item.get("img"): imgs.append(item.get("img"))
                if item.get("cover"): imgs.append(item.get("cover"))
                
                for key in ["gallery", "photos", "galeria", "imagenes", "images"]:
                    val = item.get(key)
                    if isinstance(val, list):
                        imgs.extend(val)

                clean_imgs = [clean_url(x) for x in imgs if clean_url(x)]
                if clean_imgs:
                    if name_key not in source_media_map:
                        source_media_map[name_key] = []
                    source_media_map[name_key].extend(clean_imgs)
                    total_extracted_photos += len(clean_imgs)
    except Exception as e:
        pass

print(f"📦 Mapeo de fotos completado: {len(source_media_map)} perfiles con {total_extracted_photos} imágenes originales.")

updated_count = 0

for p in providers:
    norm_name = re.sub(r'\W+', '', str(p.get("name", ""))).lower()
    real_photos = source_media_map.get(norm_name, [])

    existing_gallery = [clean_url(x) for x in p.get("gallery", []) if clean_url(x)]
    if clean_url(p.get("img")):
        existing_gallery.insert(0, clean_url(p.get("img")))

    all_combined = list(dict.fromkeys(real_photos + existing_gallery))

    if len(all_combined) > 0:
        p["img"] = all_combined[0]
        if len(all_combined) > 1:
            p["gallery"] = all_combined[:8]
        else:
            p["gallery"] = [all_combined[0]] * 4
        updated_count += 1

with open(db_path, "w", encoding="utf-8") as f:
    json.dump(providers, f, ensure_ascii=False, indent=2)

print("==================================================")
print(f"✅ BARRIDO COMPLETADO CON ÉXITO")
print(f" ├─ Proveedores Sincronizados: {updated_count} / {len(providers)}")
print(f" └─ Base de Datos Actualizada: {db_path}")
print("==================================================")
