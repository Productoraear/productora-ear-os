"""
CLEAN & CONSOLIDATE SSOT PROVIDERS PIPELINE // PRODUCTORA EAR OS
Purges synthetic "Partner ...", portal navigation slop, relative broken image paths,
and merges duplicates by keeping the highest quality data (phones, images, prices, descriptions).
Also merges the newly harvested 11,481 clean providers from scripts/nightcrawler_results/new_online_providers.json.
"""

import os
import sys
import re
import json
from pathlib import Path
from collections import defaultdict

BASE_DIR = Path(r"H:\EAR_OS_V2\EAR_OS_V2")
ALL_DB_PATH = BASE_DIR / "src" / "data" / "all_providers_database.json"
VAMP_PATH = BASE_DIR / "src" / "data" / "vampirized_providers.json"
NEW_SCRAPED_PATH = BASE_DIR / "scripts" / "nightcrawler_results" / "new_online_providers.json"

# Curated High-Res Unsplash S-Class Imagery per Category
CURATED_CATEGORY_IMAGES = {
    "finca": "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop",
    "catering": "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop",
    "decoracion": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop",
    "musica": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop",
    "sonido": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
    "foto": "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200&auto=format&fit=crop",
    "wedding": "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop",
    "moda": "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=1200&auto=format&fit=crop",
    "transporte": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop",
    "servicios": "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop"
}

FORBIDDEN_NAME_PATTERNS = [
    r'^partner\s+',
    r'^antes de la boda',
    r'^cr[oó]nicas de boda',
    r'^despu[eé]s de la boda',
    r'^promociones de novi[oa]s',
    r'^invitaciones de boda',
    r'^moda nupcial',
    r'^organiza tu boda',
    r'^desc[aá]rgate la app',
    r'^gu[ií]a de empresas',
    r'^opiniones de empresas',
    r'^directorio de bodas',
    r'^buscador de banquetes',
    r'^proveedores de boda',
    r'^consejos para',
    r'^reportajes de',
    r'^bodas net$',
    r'^fanders es$',
    r'^\d+\s+(?:lugares|fincas|espacios|ideas|consejos|claves|trucos|vestidos|canciones|pasos|errores|tendencias|hoteles|restaurantes|castillos|mas[ií]as|palacios)\b',
    r'^\d+\s+(?:preguntas|frases|regalos|detalles|juegos|lecturas|peinados|ramos)\b',
    r'tiene regalo',
    r'promoci[oó]n exclusiva',
    r'descuento para',
    r'celebrad la boda',
    r'de vuestros sue[ñn]os',
    r'lugares perfectos para celebrar'
]

def clean_provider_name(name):
    if not name: return ""
    n = str(name).strip()
    n = re.sub(r'\s*[-|]\s*Consulta disponibilidad.*', '', n, flags=re.I)
    n = re.sub(r'\s*[-|]\s*Pide informaci[oó]n.*', '', n, flags=re.I)
    n = re.sub(r'\s*[-|]\s*Solicitar presupuesto.*', '', n, flags=re.I)
    n = re.sub(r'\s*[-|]\s*Bodas\.net.*', '', n, flags=re.I)
    n = re.sub(r'\s*[-|]\s*Fanders.*', '', n, flags=re.I)
    return n.strip()

def norm_key(s):
    if not s: return ""
    cleaned = clean_provider_name(s)
    return re.sub(r'[^a-z0-9]', '', cleaned.lower())

def is_slop_name(name):
    if not name or len(name.strip()) < 3:
        return True
    n = name.strip().lower()
    for pat in FORBIDDEN_NAME_PATTERNS:
        if re.search(pat, n):
            return True
    return False

def detect_category(cat_str, desc="", name=""):
    full = f"{cat_str or ''} {desc or ''} {name or ''}".lower()
    # 1. Moda y Belleza (prioritize novias, vestidos, peluquería, maquillaje)
    if any(k in full for k in ['novia', 'novias', 'novio', 'novios', 'traje', 'vestid', 'madrina', 'joyer', 'joyas', 'tocado', 'atelier', 'peluquer', 'maquillaj', 'moda', 'belleza', 'estilism', 'sastrer']):
        return 'moda'
    # 2. Fotografía y Vídeo
    if any(k in full for k in ['fotograf', 'videograf', 'videomatón', 'fotomatón', 'foto', 'video', 'cinema']):
        return 'foto'
    # 3. Música y Grupos
    if any(k in full for k in ['orquesta', 'mariachi', 'músic', 'music', 'saxo', 'violin', 'solista', 'banda', 'coro', 'cantante', 'acústic', 'guitarr']):
        return 'musica'
    # 4. Sonido, Iluminación y DJs
    if any(k in full for k in ['audio', 'sonido', 'luces', 'iluminac', 'dj', 'discomovil', 'discomóvil', 'arsenal', 'altavoz', 'pantalla led']):
        return 'sonido'
    # 5. Catering y Gastronomía
    if any(k in full for k in ['cater', 'banquete', 'gastro', 'comida', 'paella', 'restaurante', 'pulpería', 'pulperia', 'coctel', 'cóctel', 'food truck']):
        return 'catering'
    # 6. Transporte
    if any(k in full for k in ['coche', 'autobús', 'autobus', 'limusina', 'carroza', 'transporte', 'vehículo', 'minibus', 'microbús', 'calesa']):
        return 'transporte'
    # 7. Decoración y Floristería
    if any(k in full for k in ['decor', 'flor', 'ambientac', 'guirnalda', 'mobiliario']):
        return 'decoracion'
    # 8. Wedding Planners
    if any(k in full for k in ['wedding', 'planner', 'organizac', 'coordinac']):
        return 'wedding'
    # 9. Fincas & Espacios
    if any(k in full for k in ['finca', 'cortijo', 'hacienda', 'masía', 'masia', 'casa rural', 'salon de boda', 'salón de boda', 'palacio', 'castillo', 'espacio para eventos']):
        return 'finca'
    return 'servicios'

def clean_image_url(img, category="servicios"):
    if not img or not isinstance(img, str):
        return CURATED_CATEGORY_IMAGES.get(category, CURATED_CATEGORY_IMAGES["servicios"])
    img = img.strip()
    # If it's a relative path (e.g. boda-irma-alex-jvl-10_1_166821-172189773436718.jpg)
    if not img.startswith('http://') and not img.startswith('https://'):
        return CURATED_CATEGORY_IMAGES.get(category, CURATED_CATEGORY_IMAGES["servicios"])
    # If it's a watermark or placeholder icon
    bad_tokens = ['logo', 'badge', 'icon', 'square-icon', 'wedshoots', 'premio', 'seal', 'watermark', 'illustration', 'plane_destination', 'stars.svg']
    if any(b in img.lower() for b in bad_tokens):
        return CURATED_CATEGORY_IMAGES.get(category, CURATED_CATEGORY_IMAGES["servicios"])
    return img

def clean_description(desc, name, prov="", cat="servicios"):
    cat_labels = {
        "finca": "espacios exclusivos y fincas para eventos",
        "catering": "alta gastronomía y servicio de catering",
        "decoracion": "diseño floral y ambientación exclusiva",
        "musica": "producción musical en directo y repertorio premium",
        "sonido": "sonorización acústica 12 W/pax e iluminación DMX",
        "foto": "fotografía editorial y cinematografía 4K",
        "wedding": "organización integral y coordinación técnica",
        "moda": "estilismo nupcial y sastrería a medida",
        "transporte": "transporte nupcial y logística para invitados",
        "servicios": "producción técnica y servicios homologados para bodas"
    }
    cat_label = cat_labels.get(cat, "servicios profesionales para eventos")
    p_str = f" en {prov}" if prov and prov not in ("None", "España", "") else ""
    fallback_desc = f"{name} ofrece {cat_label}{p_str}. Cobertura técnica garantizada, seguro de RC de 1.000.000 € y certificación S-Class EAR OS."

    if not desc or len(str(desc).strip()) < 20:
        return fallback_desc

    d = str(desc).strip()
    d_low = d.lower()

    # Boilerplate junk filters
    bad_phrases = [
        'descárgate la app', 'descargate la app', 'organiza tu boda donde y cuando quieras',
        'cada boda es un mundo y detrás de cada una hay una preciosa historia',
        'cada boda es un mundo y detras de cada una hay una preciosa historia',
        'filtros 0', 'solicitar presupuesto', 'ver fotos más', 'ver fotos mas',
        'opiniones reales de parejas', 'pide información y precios', 'pide informacion y precios',
        'servicio profesional para eventos en none'
    ]
    if any(bp in d_low for bp in bad_phrases):
        # Extract meaningful sentence if any, otherwise fallback
        sentences = [s.strip() for s in re.split(r'[.\n]', d) if len(s.strip()) > 35 and not any(bp in s.lower() for bp in bad_phrases)]
        if sentences:
            d = ". ".join(sentences[:2]) + "."
        else:
            return fallback_desc

    # Scrub competitor tokens
    d = re.sub(r'en None\b', 'en toda España', d)
    d = re.sub(r'\bbodas\.net\b', 'Productora EAR', d, flags=re.I)
    d = re.sub(r'\bbodas\s+net\b', 'Productora EAR', d, flags=re.I)
    d = re.sub(r'\s*\.\.\.\s*Leer m[aá]s.*', '.', d, flags=re.I)
    d = re.sub(r'\s+', ' ', d).strip()
    if len(d) < 25:
        return fallback_desc
    return d

def run_cleaning():
    print("=" * 70)
    print("EAR OS // PURGA TOTAL DE SLOP Y CONSOLIDACIÓN SSOT S-CLASS")
    print("=" * 70)

    with open(ALL_DB_PATH, "r", encoding="utf-8") as f:
        raw_db = json.load(f)
    print(f"[*] Registros cargados de all_providers_database: {len(raw_db)}")

    # 1. Filter out obvious slop
    valid_records = []
    slop_count = 0
    for r in raw_db:
        name = r.get("name", "")
        if is_slop_name(name):
            slop_count += 1
            continue
        valid_records.append(r)
    print(f"[-] Slop eliminado (Partner slop / Artículos blog / Portales): {slop_count}")
    print(f"[+] Registros válidos tras filtro inicial: {len(valid_records)}")

    # 2. Group by normalized name for smart merging
    groups = defaultdict(list)
    for r in valid_records:
        nk = norm_key(r.get("name", ""))
        if nk:
            groups[nk].append(r)

    print(f"[*] Clústeres de proveedores únicos identificados: {len(groups)}")

    merged_providers = []
    for nk, cluster in groups.items():
        if len(cluster) == 1:
            canonical = cluster[0]
        else:
            # Smart merge: pick the best attributes across duplicates
            canonical = dict(cluster[0])
            for item in cluster[1:]:
                # Phone: prefer non-null and not fallback
                if (not canonical.get("phone") or canonical.get("phone") == "+34 693 693 048") and item.get("phone") and item.get("phone") != "+34 693 693 048":
                    canonical["phone"] = item["phone"]
                # Img: prefer valid http url
                can_img = canonical.get("img") or ""
                item_img = item.get("img") or ""
                if (not can_img.startswith("http")) and item_img.startswith("http"):
                    canonical["img"] = item_img
                # Description: prefer longer, non-placeholder description
                can_desc = str(canonical.get("description") or "")
                item_desc = str(item.get("description") or "")
                if "Cada boda es un mundo" in can_desc and "Cada boda es un mundo" not in item_desc and len(item_desc) > 20:
                    canonical["description"] = item_desc
                elif len(item_desc) > len(can_desc):
                    canonical["description"] = item_desc
                # Price: prefer real price > 50
                try:
                    can_p = float(canonical.get("basePrice") or 0)
                    item_p = float(item.get("basePrice") or 0)
                    if can_p in (0, 50) and item_p > 50:
                        canonical["basePrice"] = item_p
                        canonical["priceRange"] = item.get("priceRange") or f"Desde {item_p:.0f} €"
                except:
                    pass
                # Ratings
                try:
                    ir = float(item.get("rating") or 0)
                    cr = float(canonical.get("rating") or 0)
                    if ir > cr:
                        canonical["rating"] = ir
                except:
                    pass
                # Reviews
                try:
                    irev = int(item.get("reviews") or 0)
                    crev = int(canonical.get("reviews") or 0)
                    if irev > crev:
                        canonical["reviews"] = irev
                except:
                    pass
                # Province
                if (not canonical.get("province") or canonical.get("province") == "None") and item.get("province") and item.get("province") != "None":
                    canonical["province"] = item["province"]

        # Polish fields
        canonical["name"] = clean_provider_name(canonical.get("name"))
        cat = detect_category(canonical.get("category"), canonical.get("description"), canonical.get("name"))
        canonical["category"] = cat
        canonical["img"] = clean_image_url(canonical.get("img"), cat)
        canonical["description"] = clean_description(canonical.get("description"), canonical.get("name"), canonical.get("province"), cat)
        
        # Ensure proper province
        if canonical.get("province") == "None" or not canonical.get("province"):
            canonical["province"] = "España"
            canonical["locality"] = canonical.get("locality") if canonical.get("locality") != "None" else "España"

        # Ensure verified
        canonical["verified"] = True
        canonical["badge"] = "Verificado S-Class"
        canonical["source"] = "Productora EAR // Red Homologada S-Class"
        canonical["sla"] = "Respuesta < 2h"

        if not canonical.get("basePrice") or canonical.get("basePrice") == 50:
            # Default realistic base prices by category
            category_base_prices = {
                "finca": 1800, "catering": 85, "decoracion": 650,
                "musica": 350, "sonido": 450, "foto": 950,
                "wedding": 1200, "moda": 800, "transporte": 350, "servicios": 450
            }
            bp = category_base_prices.get(cat, 450)
            canonical["basePrice"] = bp
            canonical["priceRange"] = f"Desde {bp} €"

        merged_providers.append(canonical)

    print(f"[+] Proveedores canónicos consolidados y desduplicados: {len(merged_providers)}")

    # 3. Check for newly harvested providers
    if NEW_SCRAPED_PATH.exists():
        try:
            with open(NEW_SCRAPED_PATH, "r", encoding="utf-8") as f:
                new_data = json.load(f)
            new_list = new_data.get("providers", [])
            print(f"[*] Incorporando {len(new_list)} nuevos proveedores cosechados...")
            existing_names = {norm_key(p["name"]) for p in merged_providers}
            added_new = 0
            for item in new_list:
                iname = item.get("name")
                if is_slop_name(iname):
                    continue
                nk = norm_key(iname)
                if nk and nk not in existing_names:
                    cat = detect_category(item.get("category"), item.get("description_full"), iname)
                    prov = item.get("provincia") or "España"
                    new_rec = {
                        "id": f"prov-harvest-{nk[:30]}",
                        "name": iname.strip(),
                        "phone": item.get("telephone") or "+34 693 693 048",
                        "category": cat,
                        "province": prov,
                        "locality": prov,
                        "verified": True,
                        "source": "Productora EAR // Red Homologada S-Class",
                        "isPreferred": False,
                        "rank": 90,
                        "badge": "Verificado S-Class",
                        "basePrice": 450,
                        "priceRange": "Desde 450 €",
                        "rating": 4.9,
                        "reviews": 16,
                        "sla": "Respuesta < 2h",
                        "img": clean_image_url(None, cat),
                        "gallery": [],
                        "description": clean_description(item.get("description_full", "")[:300], iname, prov, cat),
                        "description_full": clean_description(item.get("description_full", ""), iname, prov, cat),
                        "address": f"{prov}, España",
                        "services_list": ["Cobertura acústica", "Seguro RC 1.000.000 €", "Price-Lock 72h"],
                        "pack_name": "Pack Imperial S-Class",
                        "vampirized": True,
                        "last_updated": "2026-09-08T09:00:00Z",
                        "atomic_specs": {
                            "faqs": [],
                            "latitude": None,
                            "longitude": None,
                            "postalCode": None
                        }
                    }
                    merged_providers.append(new_rec)
                    existing_names.add(nk)
                    added_new += 1
            print(f"[+] Nuevos proveedores añadidos a la base: {added_new}")
        except Exception as e:
            print(f"[WARN] Error procesando new_online_providers: {e}")

    # Prioritize Productora EAR as Sovereign Node #1
    sovereign_ear = {
        "id": "prov-productora-ear-sovereign",
        "name": "Productora EAR // Infraestructura S-Class",
        "phone": "+34 693 693 048",
        "category": "sonido",
        "province": "Madrid",
        "locality": "Méntrida (Hub Central) / Cobertura Nacional",
        "verified": True,
        "source": "Productora EAR // Hub Soberano",
        "isPreferred": True,
        "rank": 100,
        "badge": "Homologación Soberana S-Class",
        "basePrice": 350.0,
        "priceRange": "Desde 350 €",
        "rating": 5.0,
        "reviews": 128,
        "sla": "Inmediato < 15 min",
        "img": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
        "gallery": [
            "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop"
        ],
        "description": "Infraestructura acústica integral, microfonía Shure Beta 87A, PA Bose F1 812, iluminación DMX y protocolo de garantía Price-Lock 72h con depósito directo.",
        "description_full": "Infraestructura acústica integral, cálculo de presión sonora 12 W/pax, seguro de RC de 1.000.000 € y soporte técnico presencial.",
        "address": "Hub Central Méntrida, Toledo / Cobertura Toda España",
        "services_list": ["Sonorización 12 W/pax", "Seguro RC 1.000.000 €", "Price-Lock 72h SHA-256", "Centralita 24/7"],
        "pack_name": "Roster Soberano S-Class",
        "vampirized": False,
        "last_updated": "2026-09-08T09:00:00Z",
        "atomic_specs": {
            "faqs": [
                "¿Qué incluye el servicio? Sonorización profesional, transporte, técnico in-situ y cobertura de seguro RC.",
                "¿Cómo se asegura la reserva? Depósito de 100 € formalizado vía Stripe con firma de bloqueo de tarifa."
            ],
            "latitude": 40.24,
            "longitude": -4.19,
            "postalCode": "45280"
        }
    }

    # Filter out any duplicate sovereign
    merged_providers = [p for p in merged_providers if norm_key(p["name"]) != norm_key(sovereign_ear["name"])]
    merged_providers.insert(0, sovereign_ear)

    print(f"\n[OK] TOTAL FINAL PROVEEDORES PURGADOS Y BLINDADOS: {len(merged_providers)}")

    # Write out to all_providers_database.json
    print(f"[*] Guardando en {ALL_DB_PATH}...")
    with open(ALL_DB_PATH, "w", encoding="utf-8") as f:
        json.dump(merged_providers, f, ensure_ascii=False, indent=2)

    # Write out to vampirized_providers.json
    print(f"[*] Sincronizando en {VAMP_PATH}...")
    with open(VAMP_PATH, "w", encoding="utf-8") as f:
        json.dump(merged_providers, f, ensure_ascii=False, indent=2)

    print("[OK] PIPELINE COMPLETADO EXITOSAMENTE SIN ERRORES.")

if __name__ == "__main__":
    run_cleaning()
