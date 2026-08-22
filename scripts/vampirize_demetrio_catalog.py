import fitz
import re
import json
import os

pdf_path = r'H:\CATALOGO luces de Navidad Demetrio 2025 _compressed.pdf'
output_json = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'demetrio_luces_navidad_2025.json')

doc = fitz.open(pdf_path)
print(f"Iniciando vampirización profunda de {len(doc)} páginas...")

def clean_txt(t):
    return t.replace('\ufffd', '€').replace('', '€').strip()

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

catalog_items = []
sku_counter = 1000

for page_idx in range(len(doc)):
    page_num = page_idx + 1
    if page_num == 1:
        continue # Portada
        
    page = doc[page_idx]
    text = clean_txt(page.get_text())
    lines = [clean_txt(l) for l in text.split('\n') if clean_txt(l)]
    blocks = [clean_txt(b[4]) for b in page.get_text('blocks') if len(b) > 4 and clean_txt(b[4])]
    
    category, subcategory, target_sector = get_category_info(page_num)
    
    # Check if page has prices
    # Normalizing price formats like "12.500 €", "1.450 €", "430 €", "12,50 €", "3,90 €"
    price_matches = re.findall(r'(\d{1,3}(?:\.\d{3})*(?:,\d{2})?|\d+(?:,\d{2})?)\s*€', text)
    
    # If no price match with symbol, check numbers followed by € in blocks
    if not price_matches:
        for b in blocks:
            pm = re.findall(r'(\d{1,3}(?:\.\d{3})*(?:,\d{2})?|\d+(?:,\d{2})?)\s*€', b)
            price_matches.extend(pm)
            
    # Extract model codes
    models = []
    for line in lines:
        # Check standard model formats
        m_match = re.findall(r'\b(CR\s+[A-Z0-9\-\+\s\/]+|C\-[A-Z0-9\-]+|CRA\-[A-Z0-9\-]+|EC[A-Z0-9\-]+|A\s+4\s+[A-Z0-9\-]+|BR\-[A-Z0-9\-]+)\b', line)
        for m in m_match:
            clean_m = m.strip()
            # filter out false positives
            if len(clean_m) >= 4 and not clean_m.startswith('CR ') or len(clean_m.split()) <= 6:
                if clean_m not in models:
                    models.append(clean_m)
                    
    # Look for dimensions, power, weight, voltage
    power_matches = re.findall(r'(\d+)\s*W\b', text)
    weight_matches = re.findall(r'(\d+[\.,]?\d*)\s*Kg\b', text, re.IGNORECASE)
    voltages = list(set(re.findall(r'\b(24V|220-240V|230V|220V|24v|230v)\b', text, re.IGNORECASE)))
    voltages = [v.upper() for v in voltages]
    
    dim_meters = re.findall(r'(\d+[,\.]\d+)\s*M\b', text, re.IGNORECASE)
    dim_cms = re.findall(r'(\d+x\d+x\d+)\s*cm\b|\b(Ø\s*\d+\s*CM)\b|(\d+\s*cm)\b', text, re.IGNORECASE)
    
    is_special_transport = "TRANSPORTE" in text and "ESPECIAL" in text
    has_video = "VÍDEO" in text or "VIDEO" in text or "V€DEO" in text
    
    # Construct structured items
    # If there are models found on the page
    if models:
        for idx, model in enumerate(models):
            sku_counter += 1
            
            # Associate price if available
            price_val = None
            price_disp = "Consultar Cotización"
            if idx < len(price_matches):
                raw_p = price_matches[idx].replace('.', '').replace(',', '.')
                try:
                    price_val = float(raw_p)
                    price_disp = f"{price_matches[idx]} €"
                except:
                    pass
            elif len(price_matches) == 1:
                raw_p = price_matches[0].replace('.', '').replace(',', '.')
                try:
                    price_val = float(raw_p)
                    price_disp = f"{price_matches[0]} €"
                except:
                    pass
                    
            # Specs for this item
            power_val = int(power_matches[idx]) if idx < len(power_matches) else (int(power_matches[0]) if power_matches else None)
            weight_val = weight_matches[idx] if idx < len(weight_matches) else (weight_matches[0] if weight_matches else None)
            voltage_val = voltages[0] if voltages else "24V / 230V"
            
            # Dimensions description
            dim_str = ""
            if dim_meters:
                dim_str = " x ".join([f"{d}m" for d in dim_meters[:3]])
            elif dim_cms:
                flat_dims = [item for sublist in dim_cms for item in sublist if item]
                if flat_dims:
                    dim_str = flat_dims[0]
                    
            # Generate human-friendly title
            title = f"{category} — {model}"
            if "SNOWMAN" in model:
                title = f"Muñeco de Nieve Gigante 3D LED {model}"
            elif "BEAR DOOR" in model or "PENDOOR" in model:
                title = f"Portal Escultórico 3D Transitable {model}"
            elif "RIBBON" in model:
                title = f"Cono Árbol Gigante 3D Flash {model}"
            elif "BALL" in model:
                title = f"Bola Decorativa Esférica {model}"
            elif "STAR" in model:
                title = f"Estrella Decorativa Tridimensional {model}"
            elif "FOLDABLE" in text.upper() or "ESFERA" in text.upper():
                title = f"Esfera LED Plegable 3D {model}"
            elif "ARCOS" in category or "2D" in category:
                title = f"Arco de Calle / Motivo Ornamental {model}"
                
            item_record = {
                "id": f"demetrio-{sku_counter}",
                "sku": model,
                "name": title,
                "category": category,
                "subcategory": subcategory,
                "targetSector": target_sector,
                "description": f"Elemento de iluminación profesional de alta durabilidad para proyectos municipales, centros comerciales y grandes fincas. Estructura de aluminio reforzado con guirnalda e hilo luminoso LED de alta eficiencia.",
                "priceNumeric": price_val,
                "priceDisplay": price_disp,
                "unitType": "unidad",
                "powerWatts": power_val,
                "weightKg": weight_val,
                "voltage": voltage_val,
                "dimensions": dim_str or "Consultar ficha técnica",
                "ipRating": "IP65 / IP44 Plug Estanco",
                "specialTransport": is_special_transport,
                "hasVideo": has_video,
                "cataloguePage": page_num,
                "provider": "Demetrio Iluminación / Red S-Class EAR OS",
                "canonicalUrl": f"/arsenal/luces-navidad/{model.lower().replace(' ', '-').replace('/', '-')}"
            }
            catalog_items.append(item_record)
    else:
        # Fallback if no specific model regex matched but there's a page with price/specs
        if price_matches or "MOTIVOS" in text.upper() or "GUIRNALDAS" in text.upper() or "CORTINAS" in text.upper():
            sku_counter += 1
            p_val = None
            p_disp = "Consultar Cotización"
            if price_matches:
                raw_p = price_matches[0].replace('.', '').replace(',', '.')
                try:
                    p_val = float(raw_p)
                    p_disp = f"{price_matches[0]} €"
                except:
                    pass
                    
            item_record = {
                "id": f"demetrio-{sku_counter}",
                "sku": f"DEM-P{page_num}-{sku_counter}",
                "name": f"{category} — Ref. Pág. {page_num}",
                "category": category,
                "subcategory": subcategory,
                "targetSector": target_sector,
                "description": f"Conjunto de iluminación profesional extraído del Catálogo Demetrio 2025 (Página {page_num}). Apto para contratos públicos LCSP y ambientación comercial de gran formato.",
                "priceNumeric": p_val,
                "priceDisplay": p_disp,
                "unitType": "unidad",
                "powerWatts": int(power_matches[0]) if power_matches else None,
                "weightKg": weight_matches[0] if weight_matches else None,
                "voltage": voltages[0] if voltages else "230V / 24V",
                "dimensions": "Ver catálogo técnico",
                "ipRating": "IP65 / IP44 Plug",
                "specialTransport": is_special_transport,
                "hasVideo": has_video,
                "cataloguePage": page_num,
                "provider": "Demetrio Iluminación / Red S-Class EAR OS",
                "canonicalUrl": f"/arsenal/luces-navidad/dem-p{page_num}"
            }
            catalog_items.append(item_record)

print(f"Total productos extraídos y estructurados: {len(catalog_items)}")

with open(output_json, 'w', encoding='utf-8') as f:
    json.dump(catalog_items, f, ensure_ascii=False, indent=2)

print(f"Guardado exitoso en: {output_json}")
