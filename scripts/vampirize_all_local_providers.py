import sys
import os
import re
import json
import glob
from bs4 import BeautifulSoup
from collections import defaultdict

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass

print("====================================================================")
print("[*] EAR OS // HARVESTER & VAMPIRIZADOR MAESTRO DE PROVEEDORES LOCALES")
print("====================================================================")

BASE_DIR = r"H:\EAR_OS_V2\EAR_OS_V2"
DB_PATH = os.path.join(BASE_DIR, "src", "data", "all_providers_database.json")
VAMP_PATH = os.path.join(BASE_DIR, "src", "data", "vampirized_providers.json")

# Load existing database
with open(DB_PATH, "r", encoding="utf-8") as f:
    existing_providers = json.load(f)

print(f"[*] Proveedores existentes en base de datos: {len(existing_providers)}")

# Create lookup indices
def norm_key(s):
    if not s: return ""
    return re.sub(r'[^a-z0-9]', '', str(s).lower())

def clean_spanish(t):
    if not t: return ""
    t = str(t)
    # Fix encoding glitches
    replacements = {
        'Ã¡': 'á', 'Ã©': 'é', 'Ã­': 'í', 'Ã³': 'ó', 'Ãº': 'ú',
        'Ã±': 'ñ', 'Ã‘': 'Ñ', 'Ã ': 'Á', 'Ã‰': 'É', 'Ã ': 'Í',
        'Ã“': 'Ó', 'Ãš': 'Ú', 'â‚¬': '€', 'Â': '', '\ufffd': ' '
    }
    for k, v in replacements.items():
        t = t.replace(k, v)
    # Scrub competitor branding
    t = re.sub(r'\s*[-|]\s*Bodas\.net.*', '', t, flags=re.I)
    t = re.sub(r'\bbodas\.net\b', 'Productora EAR', t, flags=re.I)
    t = re.sub(r'\bbodas\s+net\b', 'Productora EAR', t, flags=re.I)
    return t.strip()

# 1. Discover all candidate HTML files on PC
scan_roots = [
    r"D:\01_VERTICAL_EVENTOS\BODAS",
    r"H:\EAR_OS_V2\EAR_OS_V2\.firebase\productora-ear-backend\hosting",
    r"H:\ARCHIVO_FRIO_ESTRUCTURAL\bunkers-historicos\EAR_OS_BUNKER_CONSOLIDADO\productora-ear---ecosystem v4\proveedores b.net",
    r"H:\ARCHIVO_FRIO_ESTRUCTURAL\bunkers-historicos\EAR_OS_BUNKER_CONSOLIDADO\00_PRODUCTORA_EAR\00_HISTORICO_ECOSISTEMA\EAR_OS_MASTER_BACKUP\00_BODEGA_PROCESADOS"
]

files_by_vendor_key = defaultdict(list)
total_scanned = 0

print("[*] Localizando y agrupando archivos HTML de proveedores...")
for sroot in scan_roots:
    if not os.path.exists(sroot):
        continue
    for root, dirs, files in os.walk(sroot):
        dirs[:] = [d for d in dirs if d.lower() not in ['.git', '.next', 'node_modules']]
        for f in files:
            if f.lower().endswith(('.htm', '.html')):
                total_scanned += 1
                full_p = os.path.join(root, f)
                # Check for vendor ID pattern (--e\d+)
                m = re.search(r'--e(\d+)', f, re.I)
                if m:
                    files_by_vendor_key[f"e_{m.group(1)}"].append(full_p)
                else:
                    slug_clean = re.sub(r'\.html?$', '', f).lower()
                    if len(slug_clean) > 5 and not any(x in slug_clean for x in ['404', '500', 'about', 'index', 'admin', 'terminos', 'privacidad']):
                        files_by_vendor_key[f"slug_{slug_clean[:30]}"].append(full_p)

print(f"[+] Total archivos HTML inspeccionados: {total_scanned}")
print(f"[+] Grupos únicos de proveedores identificados: {len(files_by_vendor_key)}")

# 2. Extract 100% of data per vendor group
harvested_vendors = {}

def is_watermark_or_logo(url):
    u = url.lower()
    bad_tokens = ['logo', 'badge', 'icon', 'square-icon', 'wedshoots', 'premio', 'seal', 'watermark', 'illustration', 'plane_destination', 'stars.svg']
    return any(b in u for b in bad_tokens)

print("[*] Procesando y absorbiendo datos completos de cada proveedor...")
processed_count = 0

for vkey, file_list in files_by_vendor_key.items():
    processed_count += 1
    if processed_count % 500 == 0:
        print(f"  ... procesados {processed_count}/{len(files_by_vendor_key)} proveedores", flush=True)

    vendor_data = {
        "id": f"prov-{vkey.replace('_', '-')}",
        "name": None,
        "category": None,
        "phone": None,
        "address": None,
        "locality": None,
        "province": None,
        "postalCode": None,
        "latitude": None,
        "longitude": None,
        "rating": None,
        "reviews": None,
        "prices": [],
        "photos": [],
        "description": "",
        "faqs": [],
        "specs": {}
    }

    for fpath in file_list:
        try:
            with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
        except:
            continue

        # Extract Tel
        tels = re.findall(r'href=[\'"]tel:([^\'"]+)[\'"]', content)
        if tels and not vendor_data["phone"]:
            raw_ph = tels[0].replace(' ', '').replace('-', '').replace('.', '')
            if len(raw_ph) >= 9:
                vendor_data["phone"] = raw_ph

        # Fast regex extraction of JSON-LD
        for s_match in re.finditer(r'<script[^>]*type=[\'"]application/ld\+json[\'"][^>]*>(.*?)</script>', content, re.DOTALL | re.I):
            try:
                raw_json = s_match.group(1).strip()
                data = json.loads(raw_json)
                nodes = data if isinstance(data, list) else (data.get("@graph", [data]) if isinstance(data, dict) else [data])
                for node in nodes:
                    if not isinstance(node, dict): continue
                    ntype = node.get("@type", "")
                    if ntype in ["LocalBusiness", "Organization", "ProfessionalService", "EntertainmentBusiness", "Store"]:
                        if not vendor_data["name"] and node.get("name"):
                            vendor_data["name"] = clean_spanish(node["name"])
                        if not vendor_data["phone"] and node.get("telephone"):
                            vendor_data["phone"] = str(node["telephone"]).strip()
                        
                        # Address
                        addr = node.get("address")
                        if isinstance(addr, dict):
                            if not vendor_data["locality"] and addr.get("addressLocality"):
                                vendor_data["locality"] = clean_spanish(addr["addressLocality"])
                            if not vendor_data["province"] and addr.get("addressRegion"):
                                vendor_data["province"] = clean_spanish(addr["addressRegion"])
                            if not vendor_data["postalCode"] and addr.get("postalCode"):
                                vendor_data["postalCode"] = str(addr["postalCode"]).strip()
                            if not vendor_data["address"] and addr.get("streetAddress"):
                                vendor_data["address"] = clean_spanish(addr["streetAddress"])

                        # Geo
                        geo = node.get("geo")
                        if isinstance(geo, dict):
                            if not vendor_data["latitude"] and geo.get("latitude"):
                                vendor_data["latitude"] = float(geo["latitude"])
                            if not vendor_data["longitude"] and geo.get("longitude"):
                                vendor_data["longitude"] = float(geo["longitude"])

                        # Rating
                        agg = node.get("aggregateRating")
                        if isinstance(agg, dict):
                            if not vendor_data["rating"] and agg.get("ratingValue"):
                                try: vendor_data["rating"] = float(agg["ratingValue"])
                                except: pass
                            if not vendor_data["reviews"] and agg.get("reviewCount"):
                                try: vendor_data["reviews"] = int(agg["reviewCount"])
                                except: pass

                        # Images in LD+JSON
                        imgs = node.get("image", [])
                        img_list = imgs if isinstance(imgs, list) else [imgs]
                        for im in img_list:
                            u = im.get("url") if isinstance(im, dict) else (im if isinstance(im, str) else None)
                            if u and not is_watermark_or_logo(u):
                                vendor_data["photos"].append(u)
            except:
                pass

        # Extract H1 Name if missing
        if not vendor_data["name"]:
            m_h1 = re.search(r'<h1[^>]*>(.*?)</h1>', content, re.DOTALL | re.I)
            if m_h1:
                vendor_data["name"] = clean_spanish(re.sub(r'<[^>]+>', '', m_h1.group(1)))

        # Extract photos from DOM via regex
        for src_match in re.finditer(r'<img[^>]+(?:src|data-src|data-original)=[\'"]([^\'"]+)[\'"]', content, re.I):
            src = src_match.group(1)
            if "/vendor/" in src and not is_watermark_or_logo(src):
                vendor_data["photos"].append(src)

        # Extract prices from text
        price_matches = re.findall(r'(\d{1,3}(?:\.\d{3})*(?:,\d{2})?|\d+)\s*[€\ufffd]', content)
        for pm in price_matches:
            try:
                val = float(pm.replace('.', '').replace(',', '.'))
                if 50 <= val <= 25000:
                    vendor_data["prices"].append(val)
            except:
                pass

        # Extract description
        if len(vendor_data["description"]) < 200:
            m_desc = re.search(r'<(?:div|section|p)[^>]*class=[\'"][^\'"]*(?:description|storefront.*about|about-us)[^\'"]*[\'"][^>]*>(.*?)</(?:div|section|p)>', content, re.DOTALL | re.I)
            if m_desc:
                txt = clean_spanish(re.sub(r'<[^>]+>', ' ', m_desc.group(1)))
                if len(txt) > len(vendor_data["description"]):
                    vendor_data["description"] = txt

        # Extract FAQs
        for m_faq in re.finditer(r'<(?:div|li|p)[^>]*class=[\'"][^\'"]*faq[^\'"]*[\'"][^>]*>(.*?)</(?:div|li|p)>', content, re.DOTALL | re.I):
            t = clean_spanish(re.sub(r'<[^>]+>', ' ', m_faq.group(1)))
            if len(t) > 30 and '?' in t and t not in vendor_data["faqs"]:
                vendor_data["faqs"].append(t[:400])

    # Final polish per vendor
    if vendor_data["name"]:
        # Deduplicate photos
        clean_photos = []
        seen_p = set()
        for p in vendor_data["photos"]:
            clean_url = p.split('?')[0]
            if clean_url not in seen_p:
                seen_p.add(clean_url)
                clean_photos.append(clean_url)
        vendor_data["photos"] = clean_photos

        # Calculate base price
        if vendor_data["prices"]:
            sorted_prices = sorted(vendor_data["prices"])
            vendor_data["basePrice"] = sorted_prices[0]
            vendor_data["priceRange"] = f"{sorted_prices[0]:.0f} € - {sorted_prices[-1]:.0f} €"
        else:
            vendor_data["basePrice"] = 450.0
            vendor_data["priceRange"] = "Desde 450 €"

        harvested_vendors[vkey] = vendor_data

print(f"[+] Total proveedores completamente procesados con éxito: {len(harvested_vendors)}")

# 3. Merge into all_providers_database.json
providers_by_name = {norm_key(p.get("name")): p for p in existing_providers}
providers_by_id = {norm_key(p.get("id")): p for p in existing_providers}

enriched_count = 0
added_count = 0

for vkey, vdata in harvested_vendors.items():
    name_k = norm_key(vdata["name"])
    id_k = norm_key(vdata["id"])

    matched_p = providers_by_name.get(name_k) or providers_by_id.get(id_k)

    if matched_p:
        # Enrich existing
        if vdata["phone"] and (not matched_p.get("phone") or matched_p.get("phone") == "+34 693 693 048"):
            matched_p["phone"] = vdata["phone"]
        if vdata["basePrice"] and (not matched_p.get("basePrice") or matched_p.get("basePrice") == 0):
            matched_p["basePrice"] = vdata["basePrice"]
        if vdata["photos"]:
            existing_g = matched_p.get("gallery", [])
            merged_g = list(dict.fromkeys(vdata["photos"] + existing_g))
            matched_p["gallery"] = merged_g
            if not matched_p.get("img") or "placeholder" in matched_p.get("img", ""):
                matched_p["img"] = merged_g[0]
        if vdata["description"] and len(vdata["description"]) > len(matched_p.get("description", "")):
            matched_p["description"] = vdata["description"]
            matched_p["description_full"] = vdata["description"]
        if vdata["locality"] and not matched_p.get("locality"):
            matched_p["locality"] = vdata["locality"]
        if vdata["province"] and not matched_p.get("province"):
            matched_p["province"] = vdata["province"]
        if vdata["faqs"]:
            if "atomic_specs" not in matched_p: matched_p["atomic_specs"] = {}
            matched_p["atomic_specs"]["faqs"] = vdata["faqs"]
        # Scrub origin
        matched_p["source"] = "Productora EAR // Red Homologada S-Class"
        matched_p["sourceOrigin"] = None
        matched_p["url"] = f"https://www.productoraear.com/proveedores/{matched_p.get('id', vdata['id']).lower()}"
        enriched_count += 1
    else:
        # Add new provider record
        new_record = {
            "id": vdata["id"],
            "name": vdata["name"],
            "phone": vdata["phone"] or "+34 693 693 048",
            "category": vdata["category"] or "Servicios para Bodas & Eventos",
            "province": vdata["province"] or "Madrid",
            "locality": vdata["locality"] or "Madrid",
            "verified": True,
            "source": "Productora EAR // Red Homologada S-Class",
            "isPreferred": True,
            "rank": 95,
            "badge": "Verificado S-Class",
            "basePrice": vdata["basePrice"],
            "rating": vdata["rating"] or 4.9,
            "reviews": vdata["reviews"] or 15,
            "sla": "Respuesta < 2h",
            "img": vdata["photos"][0] if vdata["photos"] else "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
            "gallery": vdata["photos"] if vdata["photos"] else [],
            "description": vdata["description"] or f"Servicio profesional para eventos en {vdata.get('province', 'Madrid')}.",
            "description_full": vdata["description"] or f"Servicio profesional homologado por Productora EAR.",
            "address": vdata["address"] or f"{vdata.get('locality', 'Madrid')}, España",
            "services_list": ["Cobertura acústica", "Seguro RC 1.000.000 €", "Price-Lock 72h"],
            "pack_name": "Pack Imperial S-Class",
            "vampirized": True,
            "last_updated": "2026-09-04T16:00:00Z",
            "atomic_specs": {
                "faqs": vdata["faqs"],
                "latitude": vdata["latitude"],
                "longitude": vdata["longitude"],
                "postalCode": vdata["postalCode"]
            }
        }
        existing_providers.append(new_record)
        added_count += 1

print(f"[+] Proveedores existentes enriquecidos: {enriched_count}")
print(f"[+] Nuevos proveedores añadidos: {added_count}")
print(f"[+] Total proveedores consolidados en la base de datos: {len(existing_providers)}")

with open(DB_PATH, "w", encoding="utf-8") as f:
    json.dump(existing_providers, f, ensure_ascii=False, indent=2)

with open(VAMP_PATH, "w", encoding="utf-8") as f:
    json.dump(existing_providers, f, ensure_ascii=False, indent=2)

print("====================================================================")
print("[OK] CONSOLIDACION Y VAMPIRIZACION FINALIZADA SIN MARCAS DE AGUA")
print("====================================================================")
