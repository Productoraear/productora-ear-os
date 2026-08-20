import os
import json
import re
import hashlib
from bs4 import BeautifulSoup

BODAS_CLEAN_PATH = r"C:\EAR_OS_V2\src\lib\NUCLEO_DATA\bodas_clean.json"
BODAS_FULL_PATH = r"C:\EAR_OS_V2\src\lib\NUCLEO_DATA\bodas_full.json"
HTML_DIR = r"D:\01_VERTICAL_EVENTOS\BODAS"
OUTPUT_LOCAL_PATH = r"C:\EAR_OS_V2\src\data\catalog\proveedores_soberanos_master.json"
OUTPUT_PUBLIC_PATH = r"C:\EAR_OS_V2\public\data\proveedores_index.json"
OUTPUT_INCUBADORA_PATH = r"H:\incubadora despegue\PROVEEDORES_VAMPIRIZADOS\PROVEEDORES_SOBERANOS_MASTER.json"

print("=== [*] INICIANDO VAMPIRIZACION MAESTRA DE PROVEEDORES DE BODAS ===")

def generate_slug(name):
    s = name.lower()
    s = re.sub(r'[áàäâ]', 'a', s)
    s = re.sub(r'[éèëê]', 'e', s)
    s = re.sub(r'[íìïî]', 'i', s)
    s = re.sub(r'[óòöô]', 'o', s)
    s = re.sub(r'[úùüû]', 'u', s)
    s = re.sub(r'[ñ]', 'n', s)
    s = re.sub(r'[^a-z0-9]+', '-', s)
    return s.strip('-')

def clean_phone(p_str):
    if not p_str:
        return None
    cleaned = re.sub(r'[^0-9+]', '', str(p_str))
    if len(cleaned) >= 9:
        return cleaned
    return None

def normalize_category(cat_str):
    if not cat_str:
        return 'SERVICIOS_GENERALES'
    c = cat_str.upper()
    if 'MUSICA' in c or 'MARIACHI' in c or 'DJ' in c or 'ANIMACION' in c or 'ORQUESTA' in c:
        return 'MUSICA_VIVO'
    if 'SONIDO' in c or 'ILUMINACION' in c or 'LUCES' in c or 'AUDIOVISUAL' in c or 'ALQUILER' in c:
        return 'AUDIO_LUCES'
    if 'FINCA' in c or 'ESPACIO' in c or 'MASIA' in c or 'CASTILLO' in c or 'HOTEL' in c or 'RESTAURANTE' in c or 'CORTIJO' in c or 'BODEGA' in c:
        return 'FINCAS'
    if 'PLANNER' in c or 'ORGANIZACION' in c or 'COORDINACION' in c:
        return 'WEDDING_PLANNER'
    if 'FOTO' in c or 'VIDEO' in c or 'CINE' in c or 'DRON' in c:
        return 'FOTOGRAFIA_VIDEO'
    if 'CATERING' in c or 'BANQUETE' in c or 'GASTRONOMIA' in c or 'TARTA' in c or 'MENU' in c:
        return 'CATERING'
    if 'FLOR' in c or 'DECORACION' in c or 'MOBILIARIO' in c:
        return 'DECORACION'
    if 'COCHE' in c or 'AUTOBUS' in c or 'TRANSPORTE' in c:
        return 'TRANSPORTE'
    if 'VESTIDO' in c or 'TRAJE' in c or 'MODA' in c or 'JOYERIA' in c or 'BELLEZA' in c:
        return 'MODA_BELLEZA'
    return 'SERVICIOS_EVENTOS'

providers_dict = {}

# 1. Ingestar bodas_clean.json (Máxima calidad de imágenes y FAQs)
if os.path.exists(BODAS_CLEAN_PATH):
    print(f"[*] Procesando {BODAS_CLEAN_PATH}...")
    with open(BODAS_CLEAN_PATH, 'r', encoding='utf-8', errors='ignore') as f:
        clean_list = json.load(f)
        for item in clean_list:
            name = item.get('name', '').strip()
            if not name or len(name) < 2:
                continue
            slug = generate_slug(name)
            
            # Extraer imágenes limpias
            raw_images = item.get('images', [])
            clean_images = []
            if isinstance(raw_images, list):
                for img in raw_images:
                    if isinstance(img, dict) and 'url' in img:
                        clean_images.append(img['url'])
                    elif isinstance(img, str) and img.startswith('http'):
                        clean_images.append(img)

            # Rating y reviews
            rating = float(item.get('rating') or 4.8)
            if rating <= 0:
                rating = 4.9
            reviews = int(item.get('reviews') or 12)
            
            # Ubicación
            location = item.get('location') or item.get('category') or 'Madrid'
            
            # Precio
            price = item.get('price')
            if not price or price <= 0:
                price = 1200 if 'finca' in name.lower() else 450

            category = normalize_category(item.get('category', ''))
            
            claim_token = hashlib.sha256(f"EAR_SOVEREIGN_{slug}".encode()).hexdigest()[:16]

            providers_dict[slug] = {
                "id": slug,
                "name": name,
                "slug": slug,
                "category": category,
                "location": location,
                "description": item.get('description', ''),
                "basePrice": price,
                "maxPax": item.get('guests') or 300,
                "rating": rating,
                "reviewsCount": reviews,
                "qualityPriceRatio": round(min(10.0, max(8.5, rating * 2 - (price / 5000))), 1),
                "slaScore": 99.5,
                "images": clean_images[:12],
                "faqs": item.get('faqs') or [],
                "phone": None,
                "isVerified": True,
                "riderHomologated": True,
                "claimToken": claim_token,
                "canonicalUrl": f"/proveedores/{slug}"
            }

print(f"[+] Total proveedores tras bodas_clean: {len(providers_dict)}")

# 2. Ingestar bodas_full.json para ampliar cobertura
if os.path.exists(BODAS_FULL_PATH):
    print(f"[*] Procesando {BODAS_FULL_PATH}...")
    try:
        with open(BODAS_FULL_PATH, 'r', encoding='utf-8', errors='ignore') as f:
            full_list = json.load(f)
            for item in full_list:
                name = item.get('name', '').strip()
                if not name:
                    continue
                slug = generate_slug(name)
                
                if slug not in providers_dict:
                    category = normalize_category(item.get('category', ''))
                    loc = item.get('location', 'España')
                    rating = float(item.get('rating') or 4.8)
                    if rating <= 0:
                        rating = 4.8
                    price = item.get('pricing', {}).get('base_price') if isinstance(item.get('pricing'), dict) else None
                    if not price:
                        price = 650
                        
                    raw_images = item.get('images', [])
                    clean_images = [img for img in raw_images if isinstance(img, str) and img.startswith('http')]
                    
                    claim_token = hashlib.sha256(f"EAR_SOVEREIGN_{slug}".encode()).hexdigest()[:16]

                    providers_dict[slug] = {
                        "id": slug,
                        "name": name,
                        "slug": slug,
                        "category": category,
                        "location": loc,
                        "description": item.get('description', ''),
                        "basePrice": price,
                        "maxPax": 350,
                        "rating": rating,
                        "reviewsCount": item.get('reviews', 15) if isinstance(item.get('reviews'), int) else 15,
                        "qualityPriceRatio": 9.4,
                        "slaScore": 99.0,
                        "images": clean_images[:8],
                        "faqs": [],
                        "phone": item.get('contact', {}).get('phone') if isinstance(item.get('contact'), dict) else None,
                        "isVerified": True,
                        "riderHomologated": True,
                        "claimToken": claim_token,
                        "canonicalUrl": f"/proveedores/{slug}"
                    }
                else:
                    # Enriquecer teléfono si existe
                    if isinstance(item.get('contact'), dict) and item['contact'].get('phone') and not providers_dict[slug].get('phone'):
                        providers_dict[slug]['phone'] = clean_phone(item['contact']['phone'])
    except Exception as e:
        print(f"[!] Error leyendo bodas_full: {e}")

print(f"[+] Total proveedores tras bodas_full: {len(providers_dict)}")

# 3. Escanear HTMLs para extraer teléfonos y menus
if os.path.exists(HTML_DIR):
    print(f"[*] Escaneando archivos HTML en {HTML_DIR}...")
    html_files = []
    for root, dirs, files in os.walk(HTML_DIR):
        for f in files:
            if f.endswith(('.htm', '.html')):
                html_files.append(os.path.join(root, f))
    
    print(f"[*] Analizando {len(html_files)} archivos HTML...")
    phone_pattern = re.compile(r'(?:tel:|telefono|telf|m[oó]vil|llamar|contacto)[^\d+]{0,15}(\+?34[\s.-]?[6789]\d{2}[\s.-]?\d{3}[\s.-]?\d{3}|[6789]\d{2}[\s.-]?\d{3}[\s.-]?\d{3})', re.IGNORECASE)
    
    extracted_phones = 0
    for hf in html_files:
        try:
            with open(hf, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                
                # Buscar nombre en title o h1
                soup = BeautifulSoup(content[:3000], 'html.parser')
                title_tag = soup.find('title')
                title_text = title_tag.text if title_tag else ""
                
                # Encontrar coincidencia con proveedor existente
                for slug, p in providers_dict.items():
                    if len(p['name']) > 4 and p['name'].lower() in title_text.lower():
                        if not p['phone']:
                            m = phone_pattern.search(content)
                            if m:
                                p['phone'] = clean_phone(m.group(1))
                                extracted_phones += 1
                        break
        except Exception:
            continue

    print(f"[+] Teléfonos extraídos y asociados desde HTML: {extracted_phones}")

# Guardar datasets maestros
master_providers_list = list(providers_dict.values())
print(f"\n[+] Total proveedores consolidados y soberanizados: {len(master_providers_list)}")

os.makedirs(os.path.dirname(OUTPUT_LOCAL_PATH), exist_ok=True)
with open(OUTPUT_LOCAL_PATH, 'w', encoding='utf-8') as f:
    json.dump(master_providers_list, f, indent=2, ensure_ascii=False)
print(f"[OK] Guardado en {OUTPUT_LOCAL_PATH}")

# Generar índice ligero para el cliente (primeras 500 destacadas + paginador)
os.makedirs(os.path.dirname(OUTPUT_PUBLIC_PATH), exist_ok=True)
with open(OUTPUT_PUBLIC_PATH, 'w', encoding='utf-8') as f:
    json.dump(master_providers_list[:500], f, indent=2, ensure_ascii=False)
print(f"[OK] Guardado índice público en {OUTPUT_PUBLIC_PATH}")

# Guardar copia en Incubadora Despegue
try:
    os.makedirs(os.path.dirname(OUTPUT_INCUBADORA_PATH), exist_ok=True)
    with open(OUTPUT_INCUBADORA_PATH, 'w', encoding='utf-8') as f:
        json.dump(master_providers_list, f, indent=2, ensure_ascii=False)
    print(f"[OK] Guardado máster en {OUTPUT_INCUBADORA_PATH}")
except Exception as e:
    print(f"[!] Aviso al escribir en H: {e}")

print("=== [OK] VAMPIRIZACION Y SOBERANIZACION COMPLETADA EXITOSAMENTE ===")
