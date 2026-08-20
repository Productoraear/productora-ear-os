import os
import glob
import json
import re

print("🔎 BUSCANDO BODEGAS MASIVAS DE FOTOS EN DISCO H:...")

base_dir = r"H:\EAR_OS_V2\EAR_OS_V2"
db_path = os.path.join(base_dir, "src", "data", "all_providers_database.json")

if not os.path.exists(db_path):
    print("❌ Base de datos maestra no encontrada.")
    exit()

with open(db_path, "r", encoding="utf-8") as f:
    providers = json.load(f)

# Buscar en todo H: cualquier JSON con proveedores importados
all_json_files = glob.glob(r"H:\**\*providers*.json", recursive=True) + glob.glob(r"H:\**\*bodas*.json", recursive=True)

photo_vault = {}

for j_file in all_json_files:
    if "all_providers_database.json" in j_file: continue
    try:
        with open(j_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, list):
                for item in data:
                    p_id = str(item.get("id") or item.get("provider_id") or item.get("name", "")).strip().lower()
                    imgs = []
                    
                    if item.get("image"): imgs.append(item.get("image"))
                    if item.get("img"): imgs.append(item.get("img"))
                    if isinstance(item.get("gallery"), list): imgs.extend(item.get("gallery"))
                    if isinstance(item.get("photos"), list): imgs.extend(item.get("photos"))
                    
                    # Filtrar URLs reales de bodas.net / cdn
                    clean_imgs = [
                        re.sub(r'/thumb_\d+x\d+/', '/1280/', str(x)).split('?')[0] 
                        for x in imgs if x and "http" in str(x) and "unsplash" not in str(x)
                    ]
                    
                    if clean_imgs and p_id:
                        if p_id not in photo_vault: photo_vault[p_id] = []
                        photo_vault[p_id].extend(clean_imgs)
    except Exception:
        pass

print(f"📦 Se han escaneado {len(all_json_files)} archivos de bodega. Perfiles con fotos reales extraídas: {len(photo_vault)}")

# Sincronización estricta sobre la base de datos principal
fixed_count = 0
for p in providers:
    p_id = str(p.get("id") or p.get("name", "")).strip().lower()
    
    # 1. Buscar fotos reales asociadas
    real_photos = photo_vault.get(p_id, [])
    
    # 2. Purgar cualquier foto de Unsplash que estuviera en el array actual
    current_gallery = [
        re.sub(r'/thumb_\d+x\d+/', '/1280/', str(x)).split('?')[0] 
        for x in p.get("gallery", []) if x and "unsplash" not in str(x)
    ]
    if p.get("img") and "unsplash" not in str(p.get("img")):
        current_gallery.insert(0, str(p.get("img")))
        
    combined = list(dict.fromkeys(real_photos + current_gallery))
    
    if combined:
        p["img"] = combined[0]
        # Si hay solo 1 foto real, la galería contiene SOLO esa foto real (sin inventar falsas miniaturas de Unsplash)
        p["gallery"] = combined[:8]
        fixed_count += 1
    else:
        # Si el proveedor no tiene más fotos en bodega, la galería se asigna únicamente con su portada real limpia
        p["gallery"] = [p.get("img")] if p.get("img") else []

with open(db_path, "w", encoding="utf-8") as f:
    json.dump(providers, f, ensure_ascii=False, indent=2)

print(f"✅ REPARACIÓN DE GALERÍAS FINALIZADA ({fixed_count} proveedores sincronizados con imágenes reales únicas).")
