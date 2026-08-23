#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
════════════════════════════════════════════════════════════════════════════════════════
VAMPIRIZADOR S-CLASS — PRODUCCIONES SONOMUSIC MADRID (+20% PRICE ELEVATION)
Vampiriza el 100% del catálogo, fichas técnicas, equipos, potencias e imágenes
desde https://producciones-sonomusic.com/ e inyecta en:
  1. src/data/catalog_sonomusic_vampirized.json
  2. src/data/all_providers_database.json (Proveedor Homologado #1 Sonido e Iluminación)
  3. src/data/ear-rag-database.json (Nodos RAG de Presupuestos & Equipos Oficiales)
════════════════════════════════════════════════════════════════════════════════════════
"""

import os
import re
import sys
import json
import urllib.request
import datetime
from pathlib import Path
from bs4 import BeautifulSoup
from typing import List, Dict, Any

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

BASE_DIR = Path(r"H:\EAR_OS_V2\EAR_OS_V2")
ALL_PROVIDERS_PATH = BASE_DIR / "src" / "data" / "all_providers_database.json"
RAG_DB_PATH = BASE_DIR / "src" / "data" / "ear-rag-database.json"
SONOMUSIC_CATALOG_PATH = BASE_DIR / "src" / "data" / "catalog_sonomusic_vampirized.json"
REGISTRY_PATH = BASE_DIR / "scripts" / "registry.json"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

MARKUP_PERCENTAGE = 0.20  # +20% Price Elevation

def parse_price(soup: BeautifulSoup) -> float:
    price_tag = soup.find("p", class_="price") or soup.find("span", class_="woocommerce-Price-amount")
    if not price_tag:
        return 0.0
    text = price_tag.get_text()
    # Format typically: 360.00€ or 1,170.00€
    clean = re.sub(r"[^\d,\.]", "", text)
    if "," in clean and "." in clean:
        clean = clean.replace(",", "")
    elif "," in clean:
        clean = clean.replace(",", ".")
    try:
        return float(clean)
    except Exception:
        return 0.0

def fetch_sitemap_urls(sitemap_url: str) -> List[str]:
    try:
        req = urllib.request.Request(sitemap_url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read().decode("utf-8", errors="ignore")
            urls = re.findall(r"<loc>(.*?)</loc>", content)
            return urls
    except Exception as e:
        print(f"[-] Error fetching sitemap {sitemap_url}: {e}")
        return []

def scrape_product(url: str) -> Dict[str, Any]:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as resp:
        html = resp.read().decode("utf-8", errors="ignore")
        soup = BeautifulSoup(html, "html.parser")

        # Title
        h1 = soup.find("h1")
        title = h1.text.strip() if h1 else url.strip("/").split("/")[-1].replace("-", " ").title()

        # Price
        orig_price = parse_price(soup)
        elevated_price = round(orig_price * (1.0 + MARKUP_PERCENTAGE), 2)

        # Description
        desc_div = soup.find("div", class_="woocommerce-product-details__short-description") or soup.find("div", id="tab-description") or soup.find("div", class_="elementor-widget-theme-post-content")
        desc = desc_div.get_text(separator="\n", strip=True) if desc_div else ""

        # Extract features / bullet points
        features = []
        for li in soup.find_all("li"):
            txt = li.get_text(strip=True)
            if txt and len(txt) > 5 and len(txt) < 150 and not any(skip in txt.lower() for skip in ["carrito", "cuenta", "inicio", "cookies", "aviso legal", "política"]):
                features.append(txt)
        features = list(dict.fromkeys(features))[:10]

        # Extract Watts / Potencia
        watts_match = re.search(r"(\d+[\.,]?\d*)\s*(?:W|Watts|W\s*RMS)", desc + " " + title, re.IGNORECASE)
        watts = int(float(watts_match.group(1).replace(".", "").replace(",", "."))) if watts_match else None

        # Extract PAX / Aforo
        pax_match = re.search(r"(\d+)\s*(?:personas|invitados|pax)", desc + " " + title, re.IGNORECASE)
        pax = int(pax_match.group(1)) if pax_match else None

        # Images
        imgs = []
        for img in soup.find_all("img"):
            src = img.get("src", "")
            if "wp-content/uploads" in src and "Logo" not in src:
                imgs.append(src)
        imgs = list(dict.fromkeys(imgs))

        # Categorization
        slug = url.strip("/").split("/")[-1]
        category = "sonido"
        if "iluminacion" in slug or "luces" in slug:
            category = "iluminacion"
        elif "karaoke" in slug:
            category = "karaoke"
        elif "discomovil" in slug:
            category = "discomovil"
        elif "concierto" in slug:
            category = "concierto"
        elif "backline" in slug:
            category = "backline"

        return {
            "id": f"sonomusic-{slug}",
            "slug": slug,
            "title": title,
            "category": category,
            "url_source": url,
            "original_price_eur": orig_price,
            "ear_catalog_price_eur": elevated_price,
            "markup_applied": "+20%",
            "watts_rms": watts,
            "pax_recommended": pax,
            "description": desc[:600] if desc else f"{title} profesional para eventos en Madrid.",
            "features": features,
            "images": imgs,
            "vampirized_at": datetime.datetime.now().isoformat()
        }

def main():
    print("=" * 80)
    print("VAMPIRIZADOR S-CLASS: PRODUCCIONES SONOMUSIC MADRID")
    print("Elevación de Precios: +20% | Dominio Oficial: https://producciones-sonomusic.com/")
    print("=" * 80)

    product_urls = fetch_sitemap_urls("https://producciones-sonomusic.com/product-sitemap.xml")
    product_urls = [u for u in product_urls if not u.endswith("/shop/")]

    print(f"[*] Total productos localizados en el sitemap: {len(product_urls)}")

    catalog = []
    for idx, u in enumerate(product_urls, 1):
        try:
            print(f"[{idx}/{len(product_urls)}] Vampirizando: {u}...")
            item = scrape_product(u)
            catalog.append(item)
            print(f"    -> {item['title']} | Orig: {item['original_price_eur']}€ | EAR (+20%): {item['ear_catalog_price_eur']}€")
        except Exception as e:
            print(f"[-] Error en {u}: {e}")

    # Guardar Catálogo Vampirizado
    with open(SONOMUSIC_CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)
    print(f"\n[+] Catálogo guardado en: {SONOMUSIC_CATALOG_PATH}")

    # 1. Inyectar/Actualizar Proveedor en all_providers_database.json
    print("\n[*] Inyectando Sonomusic Madrid en all_providers_database.json...")
    all_providers = []
    if ALL_PROVIDERS_PATH.exists():
        try:
            with open(ALL_PROVIDERS_PATH, "r", encoding="utf-8") as f:
                all_providers = json.load(f)
        except Exception:
            all_providers = []

    # Filter out existing Sonomusic record if any
    all_providers = [p for p in all_providers if p.get("id") != "prov-sonomusic-madrid-official" and p.get("name") != "Producciones Sonomusic Madrid"]

    sonomusic_provider_record = {
        "id": "prov-sonomusic-madrid-official",
        "name": "Producciones Sonomusic Madrid",
        "phone": "+34 600 000 000",
        "website": "https://producciones-sonomusic.com",
        "category": "sonido",
        "province": "madrid",
        "verified": True,
        "source": "sonomusic_vampirized_official",
        "isPreferred": True,
        "rank": 2,
        "badge": "PROVEEDOR HOMOLOGADO SONIDO & ILUMINACIÓN",
        "basePrice": 84,  # Pack Sonido 1 con +20%
        "rating": "4.9",
        "reviews": 84,
        "sla": "12 W/pax Homologado + Montaje Madrid",
        "img": catalog[0]["images"][0] if (catalog and catalog[0]["images"]) else "https://producciones-sonomusic.com/wp-content/uploads/2023/09/Mujer-con-microfono.png",
        "gallery": [img for c in catalog for img in c["images"]][:8],
        "description": "Alquiler de equipos de sonido, iluminación para eventos, discomóvil, karaoke y backline profesional en Madrid. Cobertura acústica garantizada y montaje in-situ.",
        "description_full": "Proveedor integral homologado de Productora EAR para eventos en la Comunidad de Madrid. Dispone de sistemas line array, altavoces autoamplificados, microfonía inalámbrica, iluminación robótica DMX, estructuras truss y tarimas Guil homologadas con cálculo de carga.",
        "address": "Madrid, Comunidad de Madrid",
        "catalog_items_count": len(catalog),
        "catalog": catalog,
        "services_list": [
            "Alquiler de Equipos de Sonido Profesional (Packs desde 84€)",
            "Iluminación Espectacular DMX y Cabezas Móviles",
            "Packs de Discomóvil con Cabina DJ y Sonorización",
            "Packs de Karaoke Profesional para Fiestas Privadas",
            "Packs de Concierto y Sonorización de Bandas",
            "Alquiler de Backline (Baterías, Amplificadores, Teclados)"
        ],
        "vampirized": True,
        "last_updated": datetime.datetime.now().isoformat()
    }

    all_providers.insert(1, sonomusic_provider_record)

    with open(ALL_PROVIDERS_PATH, "w", encoding="utf-8") as f:
        json.dump(all_providers, f, ensure_ascii=False, indent=2)
    print(f"[+] Proveedor Producciones Sonomusic Madrid inyectado exitosamente en all_providers_database.json")

    # 2. Inyectar Nodos RAG en ear-rag-database.json
    print("\n[*] Inyectando Nodos RAG del Catálogo Sonomusic (+20%) en ear-rag-database.json...")
    rag_docs = []
    if RAG_DB_PATH.exists():
        try:
            with open(RAG_DB_PATH, "r", encoding="utf-8") as f:
                rag_docs = json.load(f)
        except Exception:
            rag_docs = []

    rag_ids = {d.get("id") for d in rag_docs if isinstance(d, dict)}

    new_rag_nodes = 0
    for item in catalog:
        node_id = f"RAG-CATALOG-SONOMUSIC-{item['slug'].upper()}"
        if node_id not in rag_ids:
            node = {
                "id": node_id,
                "tipo": "CATALOGO_PROVEEDOR_HOMOLOGADO",
                "categoria": "EQUIPAMIENTO_Y_TARIFAS_OFICIALES",
                "proveedor": "Producciones Sonomusic Madrid",
                "titulo": f"Tarifa Oficial: {item['title']}",
                "precio_base_proveedor_eur": item["original_price_eur"],
                "precio_catalogo_ear_eur": item["ear_catalog_price_eur"],
                "margen_aplicado": "+20%",
                "potencia_watts": item["watts_rms"],
                "aforo_pax": item["pax_recommended"],
                "resumen_semantico": f"{item['title']} - Tarifa EAR {item['ear_catalog_price_eur']}€ (Tarifa base prov: {item['original_price_eur']}€ +20%). Incluye: {', '.join(item['features'][:4]) if item['features'] else 'Equipamiento homologado'}.",
                "contenido_completo": f"FICHA TÉCNICA Y TARIFA HOMOLOGADA: {item['title']}\nPrecio Catálogo Productora EAR: {item['ear_catalog_price_eur']} € (Precio proveedor: {item['original_price_eur']} €).\nCategoría: {item['category']}.\nDescripción: {item['description']}\nComponentes y características:\n- " + "\n- ".join(item['features']),
                "metadata": {
                    "slug": item["slug"],
                    "url_proveedor": item["url_source"],
                    "imagenes": item["images"],
                    "actualizado": item["vampirized_at"]
                }
            }
            rag_docs.append(node)
            rag_ids.add(node_id)
            new_rag_nodes += 1

    with open(RAG_DB_PATH, "w", encoding="utf-8") as f:
        json.dump(rag_docs, f, ensure_ascii=False, indent=2)

    print(f"[+] {new_rag_nodes} nuevos Nodos RAG inyectados en {RAG_DB_PATH}")

    # 3. Documentar en scripts/registry.json
    if REGISTRY_PATH.exists():
        try:
            with open(REGISTRY_PATH, "r", encoding="utf-8") as rf:
                reg = json.load(rf)
            
            reg["vampirize_sonomusic"] = {
                "path": "scripts/vampire_scrapers/vampirize_sonomusic.py",
                "purpose": "Vampiriza el catalogo de Sonomusic Madrid (+20% markup) e inyecta en all_providers_database.json y RAG",
                "input": "https://producciones-sonomusic.com/product-sitemap.xml",
                "output": "src/data/catalog_sonomusic_vampirized.json & src/data/all_providers_database.json",
                "cli_command": "python scripts/vampire_scrapers/vampirize_sonomusic.py"
            }

            with open(REGISTRY_PATH, "w", encoding="utf-8") as rf:
                json.dump(reg, rf, ensure_ascii=False, indent=2)
            print("[+] Herramienta documentada en scripts/registry.json")
        except Exception as e:
            print(f"[-] Error registrando script: {e}")

    print("\n" + "=" * 80)
    print("VAMPIRIZACIÓN SONOMUSIC MADRID COMPLETADA CON ÉXITO")
    print(f"Total productos en catálogo: {len(catalog)} | Elevación aplicada: +20%")
    print("=" * 80)

if __name__ == "__main__":
    main()
