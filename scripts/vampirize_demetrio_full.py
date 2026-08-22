import fitz
import re
import json
import os

pdf_path = r'H:\CATALOGO luces de Navidad Demetrio 2025 _compressed.pdf'
output_json = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'demetrio_luces_navidad_2025.json')

doc = fitz.open(pdf_path)
print(f"=== VAMPIRIZACIÓN TOTAL CATÁLOGO DEMETRIO 2025 ({len(doc)} PÁGINAS) ===")

def clean_spanish(t):
    rep = {
        'Informacin': 'Información',
        'Vdeo': 'Vídeo',
        'Espumilln': 'Espumillón',
        'Dimetro': 'Diámetro',
        'Catlogo': 'Catálogo',
        'balcn': 'balcón',
        'rbol': 'árbol',
        'posicin': 'posición',
        'conexin': 'conexión',
        'Fro': 'Frío',
        'Clido': 'Cálido',
        'Tamao': 'Tamaño',
        'Prpura': 'Púrpura',
        'Animacin': 'Animación',
        'N': 'Nº',
        'PLSTICOS': 'PLÁSTICOS',
        '\ufffd': '€'
    }
    for k, v in rep.items():
        t = t.replace(k, v)
    return t

def get_category_info(page_num):
    if page_num <= 45:
        return "Motivos 3D Gigantes", "Figuras y Esculturas 3D Transitables", "Ayuntamientos, Plazas Públicas y Centros Comerciales"
    elif page_num <= 55:
        return "Conos y Árboles Gigantes 3D", "Árboles Monumentales Flash", "Plazas Mayores y Grandes Espacios B2G"
    elif page_num <= 60:
        return "Motivos Plásticos / Biodegradables", "Figuras Ecológicas", "Sostenibilidad y Decoración Urbana"
    elif page_num <= 65:
        return "Esferas 3D Plegables", "Esferas Foldable Flash", "Arbolado Urbano, Balcones y Galerías"
    elif page_num <= 70:
        return "Árboles y Almendros LED", "Arbolado Luminoso", "Paseos Marítimos, Parques y Hoteles"
    elif page_num <= 119:
        return "Motivos 2D y Arcos de Calle", "Alumbrado Vial y Báculos de Farola", "Calles Comerciales, Avenidas y Fiestas Patronales"
    elif page_num <= 125:
        return "Elementos Decorativos y Bolas", "Bolas Gigantes y Estrellas", "Decoración Aérea y Grandes Superficies"
    elif page_num <= 130:
        return "Twinkly Pro Smart LED", "Mapeo 3D Inteligente DMX/App", "Espectáculos Lumínicos Digitales"
    elif page_num <= 135:
        return "Guirnaldas Profesionales", "Guirnaldas LED 24V / 230V", "Iluminación de Fachadas, Fincas y Troncos"
    elif page_num <= 140:
        return "Cortinas y Mallas LED", "Cortinas Luminosas y Estalactitas", "Cornisas, Edificios Históricos y Centros Urbanos"
    else:
        return "Accesorios y Montaje", "Conectores, Cuadros y Prolongadores", "Infraestructura Eléctrica Homologada"

catalog_products = []
seen_skus = set()
sku_counter = 2000

for page_idx in range(len(doc)):
    page_num = page_idx + 1
    if page_num == 1:
        continue # Portada
        
    page = doc[page_idx]
    raw_text = page.get_text()
    clean_text = clean_spanish(raw_text)
    lines = [clean_spanish(l.strip()) for l in clean_text.split('\n') if l.strip()]
    blocks = [clean_spanish(b[4].strip()) for b in page.get_text('blocks') if len(b) > 4 and b[4].strip()]
    
    category, subcategory, target_sector = get_category_info(page_num)
    
    # 1. Extract prices
    prices_raw = re.findall(r'(\d{1,3}(?:\.\d{3})*(?:,\d{2})?|\d+(?:,\d{2})?)\s*[€]', clean_text)
    
    # 2. Extract models
    page_models = []
    for l in lines:
        m_match = re.findall(r'^(CR\s+[A-Za-z0-9\-\+\s\/\(\)]+|C\-[A-Za-z0-9\-]+|CRA\-[A-Za-z0-9\-]+|EC[A-Za-z0-9\-]+|A\s+4\s+[A-Za-z0-9\-]+|BR\-[A-Za-z0-9\-]+)$', l)
        for m in m_match:
            clean_m = m.strip()
            # Avoid generic header lines
            if clean_m not in page_models and len(clean_m) >= 4 and not clean_m.startswith('CR 57') or len(clean_m.split()) <= 6:
                if not any(clean_m.upper().startswith(x) for x in ['MOTIVOS', 'FIGURAS', 'TRANSPORTE', 'INFORMACIÓN', 'ESTRUCTURA', 'GUIRNALDA', 'CORTINA']):
                    page_models.append(clean_m)
                    
    # 3. Extract specs
    power_matches = [int(p) for p in re.findall(r'(\d+)\s*W\b', clean_text) if int(p) < 100000]
    weight_matches = [w.replace(',', '.') for w in re.findall(r'(\d+[\.,]?\d*)\s*Kg\b', clean_text, re.IGNORECASE)]
    voltages = list(set([v.upper() for v in re.findall(r'\b(24V|220-240V|230V|220V|24v|230v)\b', clean_text)]))
    dim_meters = re.findall(r'(\d+[,\.]\d+)\s*M\b', clean_text, re.IGNORECASE)
    dim_cms = re.findall(r'(\d+x\d+x\d+\s*cm|\d+x\d+\s*cm|Ø\s*\d+\s*CM|\d+\s*cm)', clean_text, re.IGNORECASE)
    
    is_special_transport = "TRANSPORTE" in clean_text.upper() and "ESPECIAL" in clean_text.upper()
    has_video = "VÍDEO" in clean_text.upper() or "VIDEO" in clean_text.upper()
    
    # Structure items
    if page_models:
        for idx, model in enumerate(page_models):
            sku_counter += 1
            
            # Map price
            price_val = None
            price_disp = "Consultar Cotización"
            if idx < len(prices_raw):
                raw_p = prices_raw[idx].replace('.', '').replace(',', '.')
                try:
                    price_val = float(raw_p)
                    price_disp = f"{prices_raw[idx]} €"
                except:
                    pass
            elif len(prices_raw) == 1:
                raw_p = prices_raw[0].replace('.', '').replace(',', '.')
                try:
                    price_val = float(raw_p)
                    price_disp = f"{prices_raw[0]} €"
                except:
                    pass
                    
            # Specs for model
            pow_val = power_matches[idx] if idx < len(power_matches) else (power_matches[0] if power_matches else None)
            wt_val = weight_matches[idx] if idx < len(weight_matches) else (weight_matches[0] if weight_matches else None)
            volt_val = voltages[0] if voltages else "24V / 230V"
            
            # Dimension string
            dim_str = ""
            if dim_meters and len(dim_meters) >= (idx + 1) * 2:
                chunk = dim_meters[idx*2:(idx+1)*3]
                dim_str = " x ".join([f"{d.replace(',', '.')}m" for d in chunk])
            elif dim_meters:
                dim_str = " x ".join([f"{d.replace(',', '.')}m" for d in dim_meters[:3]])
            elif dim_cms:
                dim_str = dim_cms[min(idx, len(dim_cms)-1)]
                
            # Descriptive Name
            name = f"{category} — {model}"
            m_upper = model.upper()
            if "SNOWMAN" in m_upper:
                name = f"Muñeco de Nieve Gigante 3D 6m LED {model}"
            elif "BEAR DOOR" in m_upper:
                name = f"Portal Escultórico Oso 3D Transitable 4.2m {model}"
            elif "PENDOOR" in m_upper:
                name = f"Portal Escultórico Pingüino 3D 4.4m {model}"
            elif "PCBEAR" in m_upper:
                name = f"Oso Polar 3D Malla PVC 3m {model}"
            elif "BASTONES" in m_upper:
                name = f"Bastones Navideños Gigantes 3D LED {model}"
            elif "CARAMELO" in m_upper:
                name = f"Caramelo Dulce 2D LED {model}"
            elif "PIRULETA" in m_upper:
                name = f"Piruleta Navideña 3D LED {model}"
            elif "RIBBON" in m_upper:
                name = f"Cono Árbol Gigante 3D Flash {model}"
            elif "BALL" in m_upper or "BOLA" in clean_text.upper():
                name = f"Bola Decorativa Esférica LED {model}"
            elif "STAR" in m_upper:
                name = f"Estrella Decorativa 3D {model}"
            elif "FOLDABLE" in clean_text.upper() or "CRA-" in m_upper:
                name = f"Esfera Plegable Foldable Flash LED {model}"
            elif "METEORITO" in clean_text.upper():
                name = f"Motivo 2D Animación Meteorito {model}"
            elif "ARCOS" in category or "2D" in category:
                name = f"Arco de Calle / Motivo Ornamental {model}"
            elif "TWINKLY" in category:
                name = f"Sistema Twinkly Pro Smart LED {model}"
            elif "ACCESORIOS" in category:
                name = f"Accesorio Conector Profesional {model}"
                
            slug = re.sub(r'[^a-z0-9]+', '-', f"{category}-{model}".lower()).strip('-')
            
            item = {
                "id": f"dem-{sku_counter}",
                "sku": model,
                "name": name,
                "category": category,
                "subcategory": subcategory,
                "targetSector": target_sector,
                "description": f"Solución de alumbrado festivo y decoración navideña profesional para ayuntamientos, plazas mayores, calles comerciales y centros de eventos. Chasis de aluminio anodizado, micro-LED de alta eficiencia y protección climática certificada.",
                "priceNumeric": price_val,
                "priceDisplay": price_disp,
                "unitType": "unidad",
                "powerWatts": pow_val,
                "weightKg": wt_val,
                "voltage": volt_val,
                "dimensions": dim_str or "Ver especificación técnica",
                "ipRating": "IP65 / IP44 Plug Estanco",
                "specialTransport": is_special_transport,
                "hasVideo": has_video,
                "cataloguePage": page_num,
                "provider": "Demetrio Iluminación / Red S-Class EAR OS",
                "canonicalUrl": f"/arsenal/luces-navidad/{slug}"
            }
            catalog_products.append(item)
    else:
        # Page without discrete SKU code
        sku_counter += 1
        price_val = None
        price_disp = "Consultar Cotización"
        if prices_raw:
            raw_p = prices_raw[0].replace('.', '').replace(',', '.')
            try:
                price_val = float(raw_p)
                price_disp = f"{prices_raw[0]} €"
            except:
                pass
                
        dim_str = ""
        if dim_meters:
            dim_str = " x ".join([f"{d.replace(',', '.')}m" for d in dim_meters[:3]])
        elif dim_cms:
            dim_str = dim_cms[0]
            
        slug = f"dem-p{page_num}-{re.sub(r'[^a-z0-9]+', '-', category.lower())}"
        
        item = {
            "id": f"dem-{sku_counter}",
            "sku": f"DEM-P{page_num}",
            "name": f"{category} — Ref. Pág. {page_num}",
            "category": category,
            "subcategory": subcategory,
            "targetSector": target_sector,
            "description": f"Conjunto de iluminación profesional extraído del Catálogo Demetrio 2025 (Página {page_num}). Apto para contratos públicos LCSP y ambientación comercial de gran formato.",
            "priceNumeric": price_val,
            "priceDisplay": price_disp,
            "unitType": "unidad",
            "powerWatts": power_matches[0] if power_matches else None,
            "weightKg": weight_matches[0] if weight_matches else None,
            "voltage": voltages[0] if voltages else "230V / 24V",
            "dimensions": dim_str or "Ver catálogo técnico",
            "ipRating": "IP65 / IP44 Plug Estanco",
            "specialTransport": is_special_transport,
            "hasVideo": has_video,
            "cataloguePage": page_num,
            "provider": "Demetrio Iluminación / Red S-Class EAR OS",
            "canonicalUrl": f"/arsenal/luces-navidad/{slug}"
        }
        catalog_products.append(item)

print(f"[OK] Total productos procesados y catalogados: {len(catalog_products)}")

# Summary statistics by category
category_counts = {}
for p in catalog_products:
    c = p['category']
    category_counts[c] = category_counts.get(c, 0) + 1

for c, count in category_counts.items():
    print(f"  - {c}: {count} productos")

with open(output_json, 'w', encoding='utf-8') as f:
    json.dump(catalog_products, f, ensure_ascii=False, indent=2)

print(f"\nBase de datos guardada con exito en: {output_json}")
