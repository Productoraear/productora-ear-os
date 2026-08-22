# -*- coding: utf-8 -*-
import os
import re
import json
import urllib.parse
from bs4 import BeautifulSoup

print("🚀 INICIANDO PARSER ATÓMICO V2 CON MATCHING TRIANGULADO...")

base_dir = r"H:\EAR_OS_V2\EAR_OS_V2"
db_path = os.path.join(base_dir, "src", "data", "all_providers_database.json")
search_root = r"H:\EAR_OS_V2"

with open(db_path, "r", encoding="utf-8") as f:
    providers = json.load(f)

# 1. Crear indices dobles de matching (por nombre limpio y por slug)
def clean_name(val):
    if not val: return ""
    text = str(val)
    text = re.sub(r'\s*[-|]\s*Bodas\.net.*', '', text, flags=re.I)
    text = re.sub(r'\s*[-|]\s*Fotógrafos.*', '', text, flags=re.I)
    text = re.sub(r'\s*[-|]\s*Catering.*', '', text, flags=re.I)
    text = re.sub(r'\s*[-|]\s*Música.*', '', text, flags=re.I)
    text = re.sub(r'\s*[-|]\s*Fincas.*', '', text, flags=re.I)
    return re.sub(r'\W+', '', text).lower()

providers_by_name = {}
providers_by_slug = {}

for p in providers:
    raw_name = p.get("name", "")
    k_name = clean_name(raw_name)
    if k_name:
        providers_by_name[k_name] = p

    # Extraer slug de la URL original o id
    url_val = str(p.get("url") or p.get("web") or "")
    slug_match = re.search(r'/([^/]+--e\d+)', url_val)
    if slug_match:
        providers_by_slug[slug_match.group(1).lower()] = p

def extract_node_data(soup, html_content):
    extracted = {"names": [], "slugs": [], "atomic_attributes": {}}

    # A) Extracción de URL Canónica y Slug
    canonical = soup.find("link", rel="canonical")
    if canonical and canonical.get("href"):
        c_url = canonical["href"]
        slug_m = re.search(r'/([^/]+--e\d+)', c_url)
        if slug_m:
            extracted["slugs"].append(slug_m.group(1).lower())

    # B) Extracción de Títulos (H1, OG:Title, Title)
    h1 = soup.find("h1")
    if h1: extracted["names"].append(h1.get_text(strip=True))

    og_title = soup.find("meta", property="og:title")
    if og_title and og_title.get("content"):
        extracted["names"].append(og_title["content"])

    if soup.title and soup.title.string:
        extracted["names"].append(soup.title.string)

    # C) JSON-LD Recursivo (@graph aware)
    scripts = soup.find_all("script", type="application/ld+json")
    for s in scripts:
        try:
            data = json.loads(s.string)
            nodes = data.get("@graph", [data]) if isinstance(data, dict) else (data if isinstance(data, list) else [data])
            for node in nodes:
                if isinstance(node, dict):
                    if "name" in node: extracted["names"].append(node["name"])
                    if "aggregateRating" in node:
                        extracted["atomic_attributes"]["rating_value"] = node["aggregateRating"].get("ratingValue")
                        extracted["atomic_attributes"]["review_count"] = node["aggregateRating"].get("reviewCount")
                    if "address" in node and isinstance(node["address"], dict):
                        extracted["atomic_attributes"]["locality"] = node["address"].get("addressLocality")
                        extracted["atomic_attributes"]["postal_code"] = node["address"].get("postalCode")
                    if "geo" in node and isinstance(node["geo"], dict):
                        extracted["atomic_attributes"]["latitude"] = node["geo"].get("latitude")
                        extracted["atomic_attributes"]["longitude"] = node["geo"].get("longitude")
        except Exception:
            pass

    # D) Extracción de Atributos Físicos y Operativos
    full_text = soup.get_text(" ", strip=True)
    extracted["atomic_attributes"]["has_accommodation"] = bool(re.search(r'alojamiento|habitaciones|hotel', full_text, re.I))
    extracted["atomic_attributes"]["allows_civil_ceremony"] = bool(re.search(r'ceremonia civil|bodas civiles', full_text, re.I))
    extracted["atomic_attributes"]["has_exclusive_catering"] = bool(re.search(r'catering exclusivo|cocina propia', full_text, re.I))

    pax_m = re.search(r'(\d+)\s*a\s*(\d+)\s*invitados', full_text, re.I)
    if pax_m:
        extracted["atomic_attributes"]["min_pax"] = int(pax_m.group(1))
        extracted["atomic_attributes"]["max_pax"] = int(pax_m.group(2))

    return extracted

# 2. Escaneo y Matching
html_files = []
for root, dirs, files in os.walk(search_root):
    dirs[:] = [d for d in dirs if d.lower() not in {"node_modules", ".git", ".next", "dist", "build"}]
    for f in files:
        if f.lower().endswith((".html", ".htm")):
            html_files.append(os.path.join(root, f))

print(f"📂 Fichas HTML a procesar: {len(html_files)}")

updated_count = 0
total_attrs = 0

for path in html_files:
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
    except Exception:
        continue

    soup = BeautifulSoup(content, "html.parser")
    node_data = extract_node_data(soup, content)

    target_provider = None

    # Intentar match por slug canónico primero
    for s in node_data["slugs"]:
        if s in providers_by_slug:
            target_provider = providers_by_slug[s]
            break

    # Si no hay match por slug, intentar por variaciones de nombre limpio
    if not target_provider:
        for n in node_data["names"]:
            k = clean_name(n)
            if k in providers_by_name:
                target_provider = providers_by_name[k]
                break

    if target_provider:
        if "atomic_specs" not in target_provider:
            target_provider["atomic_specs"] = {}
        target_provider["atomic_specs"].update(node_data["atomic_attributes"])
        total_attrs += len(node_data["atomic_attributes"])
        updated_count += 1

with open(db_path, "w", encoding="utf-8") as f:
    json.dump(providers, f, ensure_ascii=False, indent=2)

print("==================================================")
print("✅ REFACTORIZACIÓN Y PARSING ATÓMICO FINALIZADO")
print("==================================================")
print(f" ├─ Archivos HTML Escaneados: {len(html_files)}")
print(f" ├─ Proveedores Exitosamente Emparejados: {updated_count} / {len(providers)}")
print(f" ├─ Atributos Atómicos Inyectados: {total_attrs}")
print(f" └─ Base de Datos Actualizada: {db_path}")
print("==================================================")
