# -*- coding: utf-8 -*-
import os
import re
import json
import urllib.parse
from bs4 import BeautifulSoup

print("🚀 INICIANDO PARSER ATÓMICO SILICON-VALLEY DE ARCHIVOS HTML...")

base_dir = r"H:\EAR_OS_V2\EAR_OS_V2"
db_path = os.path.join(base_dir, "src", "data", "all_providers_database.json")
search_root = r"H:\EAR_OS_V2"

if not os.path.exists(db_path):
    print(f"❌ Base de datos no encontrada en {db_path}")
    exit(1)

with open(db_path, "r", encoding="utf-8") as f:
    providers = json.load(f)

# Mapeo por clave normalizada
providers_map = {re.sub(r'\W+', '', str(p.get("name", ""))).lower(): p for p in providers}

def to_proxy_url(url):
    if not url or str(url).startswith('/api/media'):
        return url
    encoded = urllib.parse.quote(str(url), safe='')
    return f'/api/media?url={encoded}'

def parse_html_file(filepath):
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            html_content = f.read()
    except Exception:
        return None

    soup = BeautifulSoup(html_content, "html.parser")
    extracted = {"atomic_attributes": {}}

    # 1. Extracción de JSON-LD
    json_ld_scripts = soup.find_all("script", type="application/ld+json")
    for script in json_ld_scripts:
        try:
            data = json.loads(script.string)
            if isinstance(data, list):
                data = data[0]
            if isinstance(data, dict):
                if "name" in data: extracted["name"] = data["name"]
                if "aggregateRating" in data:
                    extracted["atomic_attributes"]["rating_value"] = data["aggregateRating"].get("ratingValue")
                    extracted["atomic_attributes"]["review_count"] = data["aggregateRating"].get("reviewCount")
                if "address" in data:
                    addr = data["address"]
                    if isinstance(addr, dict):
                        extracted["atomic_attributes"]["street_address"] = addr.get("streetAddress")
                        extracted["atomic_attributes"]["postal_code"] = addr.get("postalCode")
                        extracted["atomic_attributes"]["locality"] = addr.get("addressLocality")
                if "geo" in data:
                    geo = data["geo"]
                    if isinstance(geo, dict):
                        extracted["atomic_attributes"]["latitude"] = geo.get("latitude")
                        extracted["atomic_attributes"]["longitude"] = geo.get("longitude")
                if "priceRange" in data:
                    extracted["atomic_attributes"]["price_range"] = data["priceRange"]
        except Exception:
            pass

    # 2. Extracción de FAQ / Ficha Técnica Atómica
    faq_items = soup.find_all(class_=re.compile(r'(faq|feature|detail|item)', re.I))
    for item in faq_items:
        text = item.get_text(" ", strip=True)
        if ":" in text:
            parts = text.split(":", 1)
            key = re.sub(r'\W+', '_', parts[0].strip()).lower()
            val = parts[1].strip()
            if key and val and len(key) < 40:
                extracted["atomic_attributes"][key] = val

    # 3. Detección de Booleans Críticos mediante Expresiones Regulares
    full_text = soup.get_text(" ", strip=True)
    extracted["atomic_attributes"]["has_accommodation"] = bool(re.search(r'alojamiento|habitaciones|hotel', full_text, re.I))
    extracted["atomic_attributes"]["has_exclusive_catering"] = bool(re.search(r'catering exclusivo|cocina propia', full_text, re.I))
    extracted["atomic_attributes"]["allows_civil_ceremony"] = bool(re.search(r'ceremonia civil|bodas civiles', full_text, re.I))
    
    # Extractores de Pax y Precio Menú
    pax_match = re.search(r'(\d+)\s*a\s*(\d+)\s*invitados', full_text, re.I)
    if pax_match:
        extracted["atomic_attributes"]["min_pax"] = int(pax_match.group(1))
        extracted["atomic_attributes"]["max_pax"] = int(pax_match.group(2))

    price_match = re.search(r'desde\s*(\d+[\.,]?\d*)\s*€', full_text, re.I)
    if price_match:
        extracted["atomic_attributes"]["price_per_menu_min"] = price_match.group(1)

    return extracted

# Escaneo masivo de HTMLs
html_files = []
for root, dirs, files in os.walk(search_root):
    dirs[:] = [d for d in dirs if d.lower() not in {"node_modules", ".git", ".next", "dist", "build"}]
    for file in files:
        if file.lower().endswith((".html", ".htm")):
            html_files.append(os.path.join(root, file))

print(f"📂 Archivos HTML identificados en el sistema: {len(html_files)}")

updated_count = 0
atomic_fields_extracted = 0

for h_path in html_files:
    parsed = parse_html_file(h_path)
    if not parsed or not parsed.get("name"):
        continue

    norm_key = re.sub(r'\W+', '', str(parsed["name"])).lower()
    if norm_key in providers_map:
        provider = providers_map[norm_key]
        if "atomic_specs" not in provider:
            provider["atomic_specs"] = {}
        
        provider["atomic_specs"].update(parsed["atomic_attributes"])
        atomic_fields_extracted += len(parsed["atomic_attributes"])
        updated_count += 1

# Guardar base de datos enriquecida
with open(db_path, "w", encoding="utf-8") as f:
    json.dump(providers, f, ensure_ascii=False, indent=2)

print("==================================================")
print("✅ PARSING ATÓMICO Y ENRIQUECIMIENTO FINALIZADO")
print("==================================================")
print(f" ├─ Fichas HTML Procesadas: {len(html_files)}")
print(f" ├─ Proveedores Enriquecidos: {updated_count} / {len(providers)}")
print(f" ├─ Atributos Atómicos Totales Inyectados: {atomic_fields_extracted}")
print(f" └─ Base de Datos Guardada: {db_path}")
print("==================================================")
