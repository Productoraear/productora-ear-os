#!/usr/bin/env python3
"""
HARVESTER NACIONAL DE RESIDENCIAS DE MAYORES, CENTROS DE DÍA Y HOGARES DEL JUBILADO
Productora EAR — Proyecto VIMUME — Protocolo S-Class
Extrae y cataloga todas las entidades geriátricas, centros de día y hogares de pensionistas de España.
"""

import urllib.request
import urllib.parse
import json
import os
import time
import math

MENTRIDA_LAT = 40.2378
MENTRIDA_LON = -4.1953

def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

# Cuadrículas de barrido para cubrir toda España peninsular e islas sin provocar Timeout en Overpass
ZONAS_ESPANA = [
    {"nombre": "Centro (Madrid, Toledo, C.Real, Cuenca, Guadalajara)", "bbox": "38.5,-5.5,41.5,-1.5"},
    {"nombre": "Noroeste (Galicia, Asturias, León, Zamora)", "bbox": "41.5,-9.5,44.0,-5.0"},
    {"nombre": "Norte (Cantabria, Euskadi, Navarra, La Rioja, Burgos, Palencia)", "bbox": "41.8,-5.0,43.6,-1.2"},
    {"nombre": "Noreste (Catalunya, Aragón)", "bbox": "40.0,-2.0,42.9,3.5"},
    {"nombre": "Este / Levante (Comunitat Valenciana, Murcia, Albacete)", "bbox": "37.3,-2.5,40.8,0.8"},
    {"nombre": "Sur (Andalucía Occidental - Sevilla, Huelva, Cádiz, Córdoba)", "bbox": "36.0,-7.5,38.5,-4.0"},
    {"nombre": "Sur (Andalucía Oriental - Málaga, Granada, Jaén, Almería)", "bbox": "36.5,-5.0,38.6,-1.6"},
    {"nombre": "Oeste (Extremadura, Salamanca, Valladolid, Ávila)", "bbox": "38.0,-7.5,41.8,-4.5"},
    {"nombre": "Baleares", "bbox": "38.5,1.0,40.2,4.5"},
    {"nombre": "Canarias", "bbox": "27.5,-18.5,29.5,-13.3"}
]

def query_zone(bbox, name):
    print(f"\n[BARRIDO S-CLASS] Consultando zona: {name} (BBOX: {bbox})...")
    ql = f"""
    [out:json][timeout:50];
    (
      node["amenity"="nursing_home"]({bbox});
      way["amenity"="nursing_home"]({bbox});
      node["social_facility:for"="senior"]({bbox});
      way["social_facility:for"="senior"]({bbox});
      node["social_facility"="group_home"]["social_facility:for"="senior"]({bbox});
      node["social_facility"="day_care"]({bbox});
      way["social_facility"="day_care"]({bbox});
      node["amenity"="social_centre"]["community_centre"="senior"]({bbox});
    );
    out center;
    """
    url = "https://overpass-api.de/api/interpreter"
    req = urllib.request.Request(
        url,
        data=ql.encode('utf-8'),
        headers={'User-Agent': 'ProductoraEAR-National-Senior-Harvester/2.0 (edwin@productoraear.com)'}
    )
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            elements = data.get('elements', [])
            print(f"  -> {len(elements)} entidades detectadas en {name}.")
            return elements
    except Exception as e:
        print(f"  [ERROR] Fallo al consultar {name}: {e}")
        return []

def main():
    os.makedirs('public/data/providers', exist_ok=True)
    os.makedirs('src/data/sourcing', exist_ok=True)
    vault_dir = "H:/00_PRODUCTORA_EAR/EAR_ABSORBED_VAULT"
    os.makedirs(vault_dir, exist_ok=True)

    all_harvested = []
    seen = set()

    for zona in ZONAS_ESPANA:
        elements = query_zone(zona['bbox'], zona['nombre'])
        for el in elements:
            tags = el.get('tags', {})
            name = tags.get('name')
            if not name:
                continue

            name_clean = name.strip()
            key = name_clean.lower()
            if key in seen:
                continue
            seen.add(key)

            lat = el.get('lat') or el.get('center', {}).get('lat')
            lon = el.get('lon') or el.get('center', {}).get('lon')
            dist = haversine_km(MENTRIDA_LAT, MENTRIDA_LON, lat, lon) if lat and lon else 999.0

            # Categorización precisa
            nl = name_clean.lower()
            amenity = tags.get('amenity', '')
            social = tags.get('social_facility', '')
            comm = tags.get('community_centre', '')

            if "día" in nl or "dia" in nl or social == 'day_care':
                tipo = "Centro de Día"
            elif "jubilad" in nl or "pensionis" in nl or "mayores" in nl or comm == 'senior':
                tipo = "Hogar del Jubilado / Pensionistas"
            elif "residencia" in nl or amenity == 'nursing_home':
                tipo = "Residencia de Mayores"
            else:
                tipo = "Centro Geriátrico / Mayores"

            phone = tags.get('phone') or tags.get('contact:phone') or tags.get('telephone') or ''
            street = tags.get('addr:street', '')
            num = tags.get('addr:housenumber', '')
            address = f"{street} {num}".strip() if street else tags.get('addr:full', '')
            city = tags.get('addr:city') or tags.get('addr:municipality') or zona['nombre'].split('(')[0].strip()
            province = tags.get('addr:province') or ''
            operator = tags.get('operator', tags.get('operator:type', 'Público / Concertado / Privado'))
            website = tags.get('website') or tags.get('contact:website') or ''

            item = {
                'id': f"senior-es-{len(all_harvested)+1:05d}",
                'nombre': name_clean,
                'tipo': tipo,
                'municipio': city,
                'provincia': province,
                'direccion': address or 'Consultar registro municipal',
                'telefono': phone or 'Centralita Pendiente',
                'web': website,
                'operador': operator,
                'distancia_mentrida_km': dist,
                'coordenadas': f"{lat}, {lon}" if lat and lon else "N/D",
                'estado_prospeccion': 'nuevo',
                'tarifa_estimada': '350,00 € (Solista Gala Edwin Agudelo)',
                'acustica': 'Bose S1 Pro / Shure Beta 87A (<75 dB SPL)',
                'marco_legal': 'Contrato Menor Art. 118 LCSP (<14.250 €)'
            }
            all_harvested.append(item)

        # Pausa respetuosa para evitar rate-limiting de Overpass
        time.sleep(2)

    # Ordenar por proximidad a Méntrida
    all_harvested.sort(key=lambda x: x['distancia_mentrida_km'])

    print(f"\n==================================================")
    print(f"BARRIDO NACIONAL COMPLETADO: {len(all_harvested)} centros únicos.")
    print(f"==================================================")

    # 1. Guardar bóveda completa en EAR_ABSORBED_VAULT (Regla 8: fuera de git si es masivo)
    vault_path = os.path.join(vault_dir, "VIMUME_NATIONAL_SENIOR_CARE_VAULT.json")
    with open(vault_path, 'w', encoding='utf-8') as f:
        json.dump(all_harvested, f, ensure_ascii=False, indent=2)
    print(f"[BOVEDA MAESTRA] Guardada en {vault_path}")

    # 2. Guardar partición curada para el Frontend y Admin (< 1 MB, Regla 8 Anti-Bloat)
    curated_partition = all_harvested[:800] # Top 800 más cercanos o estratégicos
    partition_path = 'public/data/providers/senior_care.json'
    with open(partition_path, 'w', encoding='utf-8') as f:
        json.dump(curated_partition, f, ensure_ascii=False, indent=2)
    print(f"[EDGE CDN PARTITION] Top {len(curated_partition)} guardados en {partition_path} (<1MB)")

    # 3. Guardar en el directorio de sourcing interno
    sourcing_path = 'src/data/sourcing/vimume_senior_leads.json'
    with open(sourcing_path, 'w', encoding='utf-8') as f:
        json.dump(all_harvested[:150], f, ensure_ascii=False, indent=2)
    print(f"[SOURCING ADMIN DECK] Top 150 leads inmediatos en {sourcing_path}")

if __name__ == '__main__':
    main()
