# -*- coding: utf-8 -*-
import os, json, re

print("🚀 RESTABLECIENDO URLS DE CDN CON TOKENS INTACTOS...")

db_path = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\all_providers_database.json"
source_path = r"H:\EAR_OS_V2\src\data\bodas-vendors-harvested.json"

if not os.path.exists(source_path):
    # Buscar archivo cosechado original
    for root, dirs, files in os.walk(r"H:\EAR_OS_V2"):
        if "bodas-vendors-harvested.json" in files:
            source_path = os.path.join(root, "bodas-vendors-harvested.json")
            break

print(f"📂 Usando fuente original: {source_path}")

with open(db_path, "r", encoding="utf-8") as f:
    providers = json.load(f)

source_map = {}
if os.path.exists(source_path):
    with open(source_path, "r", encoding="utf-8") as sf:
        raw_source = json.load(sf)
        for item in raw_source:
            key = re.sub(r'\W+', '', str(item.get("name", ""))).lower()
            if key:
                imgs = []
                if item.get("img"): imgs.append(item.get("img"))
                if item.get("image"): imgs.append(item.get("image"))
                if isinstance(item.get("gallery"), list): imgs.extend(item.get("gallery"))
                # Conservar URL pura sin recortar query params ni alterar rutas
                valid_imgs = [x for x in imgs if x and "unsplash" not in str(x).lower()]
                if valid_imgs:
                    source_map[key] = valid_imgs

restored = 0
for p in providers:
    key = re.sub(r'\W+', '', str(p.get("name", ""))).lower()
    originals = source_map.get(key, [])
    if originals:
        p["img"] = originals[0]
        p["gallery"] = list(dict.fromkeys(originals))[:8]
        restored += 1

with open(db_path, "w", encoding="utf-8") as f:
    json.dump(providers, f, ensure_ascii=False, indent=2)

print(f"✅ RESTAURACIÓN COMPLETADA: {restored} proveedores re-vinculados a sus URLs exactas de CDN.")
