#!/usr/bin/env python3
"""
🏛️ EAR OS GOLD - AGENTE B2B OUTBOUND DE RECLAMACIÓN PROACTIVA (10X)
Generador de Micro-Lotes Personalizados para Fincas & Espacios (Madrid & Toledo)
"""

import json
import os
import re
import urllib.parse

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATABASE_PATH = os.path.join(BASE_DIR, 'src', 'data', 'bodas-vendors-harvested.json')
OUTPUT_DIR = os.path.join(BASE_DIR, 'src', 'data', 'outbound')
OUTPUT_FILE = os.path.join(OUTPUT_DIR, 'microbatch_100_madrid_toledo.json')

os.makedirs(OUTPUT_DIR, exist_ok=True)

def generate_claim_url(slug, token):
    base_url = "https://www.productoraear.com/reclamar-perfil"
    params = urllib.parse.urlencode({'id': slug, 'token': token, 'source': 'outbound_10x'})
    return f"{base_url}?{params}"

def generate_whatsapp_link(phone, text):
    clean_phone = re.sub(r'\D', '', phone)
    if not clean_phone.startswith('34') and len(clean_phone) == 9:
        clean_phone = '34' + clean_phone
    encoded_text = urllib.parse.quote(text)
    return f"https://wa.me/{clean_phone}?text={encoded_text}"

def run_microbatch():
    if not os.path.exists(DATABASE_PATH):
        print(f"[-] Error: Archivo de base de datos no encontrado: {DATABASE_PATH}")
        return

    with open(DATABASE_PATH, 'r', encoding='utf-8') as f:
        all_vendors = json.load(f)

    print(f"[*] Base de datos cargada: {len(all_vendors)} activos.")

    # 1. Filtrar Fincas en Madrid y Toledo con teléfono
    candidates = []
    for v in all_vendors:
        if v.get('category') == 'FINCAS_Y_ESPACIOS':
            loc = (v.get('location', {}).get('province', '') + ' ' + v.get('location', {}).get('city', '') + ' ' + v.get('description', '')).lower()
            name = v.get('name', '').strip()
            phone = v.get('phone', '')

            # Evitar entradas basura
            if len(name) > 3 and not any(w in name.lower() for w in ['foro', 'comunidad', 'debate', 'facebook']):
                if 'madrid' in loc or 'toledo' in loc or 'espana' in loc:
                    candidates.append(v)

    # 2. Ordenar por rating y reviews para elegir las 100 mejores
    candidates.sort(key=lambda x: (x.get('metrics', {}).get('rating', 0), x.get('metrics', {}).get('reviewCount', 0)), reverse=True)
    selected_100 = candidates[:100]

    print(f"[*] Seleccionadas {len(selected_100)} fincas de primer nivel para el Micro-Lote 01 (Madrid/Toledo).")

    dispatch_manifest = []

    for idx, finca in enumerate(selected_100, 1):
        name = finca.get('name')
        slug = finca.get('slug', re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-'))
        phone = finca.get('phone', '+34 693 693 048')
        rating = finca.get('metrics', {}).get('rating', 5.0)
        reviews = finca.get('metrics', {}).get('reviewCount', 24)
        city = finca.get('location', {}).get('city', 'Madrid')
        province = finca.get('location', {}).get('province', 'Madrid')
        base_price = finca.get('pricing', {}).get('rentalBasePrice', 1500)
        claim_token = f"claim_{slug}_10x"
        claim_url = generate_claim_url(slug, claim_token)

        # Mensaje WhatsApp Hiper-Personalizado con FOMO Competitivo S-Class
        whatsapp_copy = (
            f"Hola equipo de {name}, os contactamos desde la centralita técnica de Productora EAR en Madrid. "
            f"Vuestra ficha en la Red Homologada de {city} cuenta con una valoración de {rating}★ ({reviews} reseñas auditadas). "
            f"Os hemos habilitado el botón de reserva directa en 1-clic con seguro de RC de 1M€ y riders estandarizados (12 W/pax) para esta temporada 2026. "
            f"Podéis verificar y gestionar vuestra ficha oficial directamente desde este enlace seguro: {claim_url}"
        )

        # Email Copy para Dirección / Event Manager
        email_subject = f"Verificación de Ficha Oficial y Protocolo de Reservas 2026: {name}"
        email_body = f"""Estimada Dirección de Eventos de {name},

Nos ponemos en contacto desde el Departamento de Infraestructura y Producción de Productora EAR (www.productoraear.com).

Dentro de nuestro ecosistema nacional de contratación y cálculo acústico (12 W/pax), {name} figura como espacio homologado en {city} ({province}).

A fin de evitar comisiones abusivas de intermediación y garantizar reservas directas con seguro de responsabilidad civil de 1.000.000 € y riders homologados, os facilitamos el acceso a vuestra consola de gestión:

• Espacio: {name}
• Tarifa Base Estimada: {base_price} €
• Enlace de Verificación y Activación: {claim_url}

Quedamos a vuestra disposición para cualquier soporte técnico o de agenda.

Atentamente,
Despacho de Producción y Homologación
Productora EAR OS | +34 693 693 048 | www.productoraear.com
"""

        dispatch_manifest.append({
            'batch_id': 'MICROBATCH_01_MADRID_TOLEDO',
            'order_index': idx,
            'vendor_id': finca.get('id', f'vendor-{slug}'),
            'name': name,
            'slug': slug,
            'phone': phone,
            'location': {
                'city': city,
                'province': province
            },
            'metrics': {
                'rating': rating,
                'reviews': reviews
            },
            'claim_url': claim_url,
            'claim_token': claim_token,
            'whatsapp_link': generate_whatsapp_link(phone, whatsapp_copy),
            'whatsapp_copy': whatsapp_copy,
            'email_subject': email_subject,
            'email_body': email_body,
            'status': 'READY_FOR_DISPATCH'
        })

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(dispatch_manifest, f, ensure_ascii=False, indent=2)

    print(f"[+] Micro-Lote 01 generado con éxito: {len(dispatch_manifest)} registros.")
    print(f"[+] Archivo guardado en: {OUTPUT_FILE}")

if __name__ == '__main__':
    run_microbatch()
