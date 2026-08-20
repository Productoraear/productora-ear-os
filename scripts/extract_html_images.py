import os
import glob
import json
import re
from bs4 import BeautifulSoup

print("🚀 Rastreado profundo de imágenes reales en HTML/MHTML...")

base_dir = r"H:\EAR_OS_V2"
db_path = os.path.join(base_dir, "EAR_OS_V2", "src", "data", "all_providers_database.json")

if not os.path.exists(db_path):
    print("❌ Base de datos no encontrada.")
    exit()

with open(db_path, "r", encoding="utf-8") as f:
    providers = json.load(f)

# Buscar todos los archivos HTML / MHTML / TXT que contienen el HTML guardado
html_files = glob.glob(os.path.join(base_dir, "**", "*.*"), recursive=True)
target_files = [f for f in html_files if f.endswith(('.html', '.htm', '.mhtml', '.txt'))]

print(f"📁 Analizando {len(target_files)} archivos HTML locales...")

image_map = {}

for filepath in target_files:
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
            soup = BeautifulSoup(content, "html.parser")
            
            # Buscar tarjetas de proveedores en el HTML
            cards = soup.select(".vendor-tile, .storefrontHeader, .directory-card, article, .card")
            for card in cards:
                title_elem = card.select_one(".vendor-tile__title, .storefrontHeader__title, h2, h3, .title")
                img_elem = card.select_one("img")
                
                if title_elem and img_elem:
                    name = title_elem.get_text(strip=True).lower()
                    # Extraer src o data-src
                    img_url = img_elem.get("data-src") or img_elem.get("src") or img_elem.get("data-srcset")
                    if img_url and "http" in img_url and not any(k in img_url for k in ["placeholder", "avatar", "icon", "blank"]):
                        clean_name = re.sub(r'\W+', '', name)
                        image_map[clean_name] = img_url.split("?")[0] # URL limpia
    except Exception:
        continue

print(f"🖼️  Imágenes originales extraídas de HTML: {len(image_map)}")

# Vincular imágenes reales extraídas con cada proveedor
updated_count = 0
for p in providers:
    clean_p_name = re.sub(r'\W+', '', p.get("name", "").lower())
    if clean_p_name in image_map:
        p["img"] = image_map[clean_p_name]
        updated_count += 1

with open(db_path, "w", encoding="utf-8") as f:
    json.dump(providers, f, ensure_ascii=False, indent=2)

print(f"✅ {updated_count} proveedores actualizados con sus imágenes HTML originales.")
