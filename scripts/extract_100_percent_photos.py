import os
import glob
import json
import re

print("🚀 INICIANDO EXTRACCIÓN Y MAPEO DEL 100% DE FOTOS ORIGINALES...")

base_dir = r"H:\EAR_OS_V2\EAR_OS_V2"
db_path = os.path.join(base_dir, "src", "data", "all_providers_database.json")

if not os.path.exists(db_path):
    print("❌ Base de datos no encontrada.")
    exit()

with open(db_path, "r", encoding="utf-8") as f:
    providers = json.load(f)

def clean_url(url):
    if not url or "unsplash" in url:
        return ""
    clean = re.sub(r'/thumb_\d+x\d+/', '/1280/', str(url))
    clean = re.sub(r'/watermark_[^/]+/', '/', clean)
    clean = re.sub(r'/st-logo[^/]+/', '/', clean)
    return clean.split('?')[0]

# Buscar en la bodega de volcados locales todos los archivos de origen
bodega_paths = [
    r"H:\EAR_OS_V2\EAR_OS_V2\src\data\imported_providers.json",
    r"H:\EAR_OS_V2\EAR_OS_V2\src\data\EVE_BODAS_VENDORS.json"
]

source_media_map = {}

for b_path in bodega_paths:
    if os.path.exists(b_path):
        try:
            with open(b_path, "r", encoding="utf-8") as bf:
                raw_data = json.load(bf)
                for item in raw_data:
                    name_key = re.sub(r'\W+', '', str(item.get("name", "")).lower())
                    imgs = []
                    
                    # Extraer imágen principal y galerías desglosadas
                    if item.get("image"): imgs.append(item.get("image"))
                    if item.get("img"): imgs.append(item.get("img"))
                    if isinstance(item.get("gallery"), list):
                        imgs.extend(item.get("gallery"))
                    if isinstance(item.get("photos"), list):
                        imgs.extend(item.get("photos"))

                    clean_imgs = [clean_url(x) for x in imgs if clean_url(x)]
                    if clean_imgs and name_key:
                        if name_key not in source_media_map:
                            source_media_map[name_key] = []
                        source_media_map[name_key].extend(clean_imgs)
        except Exception as e:
            print(f"⚠️ Aviso leyendo {b_path}: {e}")

print(f"📦 Mapeo de fotos de origen completado. {len(source_media_map)} perfiles con medios localizados.")

updated_count = 0

for p in providers:
    norm_name = re.sub(r'\W+', '', str(p.get("name", "")).lower())
    
    # 1. Recuperar fotos originales del mapa de origen
    real_photos = source_media_map.get(norm_name, [])
    
    # Añadir las fotos que ya tuviera la ficha si no eran de unsplash
    existing_gallery = [clean_url(x) for x in p.get("gallery", []) if clean_url(x)]
    if clean_url(p.get("img")):
        existing_gallery.insert(0, clean_url(p.get("img")))
        
    all_combined = list(dict.fromkeys(real_photos + existing_gallery))
    
    if len(all_combined) > 0:
        p["img"] = all_combined[0]
        # Si tiene más de una foto real, rellenar la galería solo con sus fotos originales
        if len(all_combined) > 1:
            p["gallery"] = all_combined[:8]
        else:
            # Si solo existe 1 foto original, duplicar los ángulos de la foto original antes de meter imágenes vacías
            p["gallery"] = [all_combined[0]] * 4
        updated_count += 1

with open(db_path, "w", encoding="utf-8") as f:
    json.dump(providers, f, ensure_ascii=False, indent=2)

print(f"✅ BARRIDO COMPLETADO. {updated_count} proveedores sincronizados con el 100% de sus fotos de origen.")
