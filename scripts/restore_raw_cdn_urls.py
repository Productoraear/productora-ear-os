# -*- coding: utf-8 -*-
import os, json, re, random, urllib.request

print("🚀 RESTABLECIENDO URLS RAW DE CDN (CON PARÁMETROS Y TOKENS INTACTOS)...")

db_path = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\all_providers_database.json"
search_root = r"H:\EAR_OS_V2"

with open(db_path, "r", encoding="utf-8") as f:
    providers = json.load(f)

source_json_files = []
for root, dirs, files in os.walk(search_root):
    dirs[:] = [d for d in dirs if d.lower() not in {"node_modules", ".git", ".next", "dist", "build"}]
    for file in files:
        fl = file.lower()
        if (("vendor" in fl or "imported" in fl or "harvested" in fl or "eve_bodas" in fl) 
            and fl.endswith(".json") 
            and fl != "all_providers_database.json"):
            source_json_files.append(os.path.join(root, file))

print(f"📂 Archivos de origen de imágenes encontrados: {len(source_json_files)}")

source_map = {}
for path in source_json_files:
    try:
        with open(path, "r", encoding="utf-8") as sf:
            raw_data = json.load(sf)
            if isinstance(raw_data, dict):
                raw_data = [raw_data]
            if not isinstance(raw_data, list):
                continue

            for item in raw_data:
                if not isinstance(item, dict):
                    continue
                name_val = item.get("name") or item.get("nombre") or ""
                key = re.sub(r'\W+', '', str(name_val)).lower()
                if not key:
                    continue

                imgs = []
                for k in ["img", "image", "cover", "gallery", "photos", "galeria", "images"]:
                    val = item.get(k)
                    if isinstance(val, str) and val:
                        imgs.append(val)
                    elif isinstance(val, list):
                        imgs.extend([x for x in val if isinstance(x, str) and x])

                # Conservar la URL exactamente como viene en origen (sin recortar '?')
                raw_imgs = [x.strip() for x in imgs if x and "unsplash" not in str(x).lower()]
                if raw_imgs:
                    if key not in source_map:
                        source_map[key] = []
                    source_map[key].extend(raw_imgs)
    except Exception:
        pass

print(f"📦 Perfiles mapeados con URLs originales puras: {len(source_map)}")

updated = 0
for p in providers:
    key = re.sub(r'\W+', '', str(p.get("name", ""))).lower()
    originals = source_map.get(key, [])
    if originals:
        unique_imgs = list(dict.fromkeys(originals))
        p["img"] = unique_imgs[0]
        p["gallery"] = unique_imgs[:8]
        updated += 1

with open(db_path, "w", encoding="utf-8") as f:
    json.dump(providers, f, ensure_ascii=False, indent=2)

print(f"✅ BASE ACTUALIZADA: {updated} / {len(providers)} proveedores vinculados a URLs puras.")

# Muestreo de verificación HTTP 200 en vivo
all_sample_urls = [p["img"] for p in providers if p.get("img")]
sample_urls = random.sample(all_sample_urls, min(15, len(all_sample_urls)))
ok_count = 0

print("\n🔍 Verificando muestra en vivo de 15 URLs...")
for u in sample_urls:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=4) as resp:
            if resp.status == 200:
                ok_count += 1
    except Exception:
        pass

print(f"📊 Resultado Test HTTP: {ok_count} / {len(sample_urls)} válidas (200 OK)")
