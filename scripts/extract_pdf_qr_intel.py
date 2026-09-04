#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════
 RETO_01_QR_VAMPIRE — extract_pdf_qr_intel.py
 ANTIGRAVITY System Orchestrator × Productora EAR OS
═══════════════════════════════════════════════════════════════════
 Objetivo:
   1. Leer QRs ya decodificados (catalog_qr_videos_extracted.json)
   2. Mapear videoUrl a cada SKU en luces_navidad_2026_ear.json por cataloguePage
   3. Generar luces_navidad_qr_metadata.json (SKU -> URL_VIDEO / URL_FICHA)
   4. Opcionalmente re-escanear PDF con OpenCV para detectar QRs faltantes
═══════════════════════════════════════════════════════════════════
"""

import json
import os
import sys
import re
from collections import defaultdict

# ─── PATHS ──────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "src", "data")

CATALOG_PATH = os.path.join(DATA_DIR, "luces_navidad_2026_ear.json")
QR_VIDEOS_PATH = os.path.join(DATA_DIR, "catalog_qr_videos_extracted.json")
QR_METADATA_OUTPUT = os.path.join(DATA_DIR, "luces_navidad_qr_metadata.json")
QR_DECODED_OUTPUT = os.path.join(DATA_DIR, "catalog_qr_decoded_intel.json")

PDF_PRIMARY = r"H:\EAR_OS_V2\CATALOGO luces de navidad 2026 EAR.pdf"
PDF_DEMETRIO = r"H:\CATALOGO luces de Navidad Demetrio 2025 _compressed.pdf"

print("=" * 72)
print("[*] RETO_01_QR_VAMPIRE — Extracción Forense de Intel QR")
print("=" * 72)

# ─── STEP 1: Load existing QR video data ────────────────────────
print("\n[1/4] Cargando QRs ya extraídos...")
if os.path.exists(QR_VIDEOS_PATH):
    with open(QR_VIDEOS_PATH, "r", encoding="utf-8") as f:
        qr_video_pages = json.load(f)
    print(f"  → {len(qr_video_pages)} páginas con URLs de video")
else:
    print("  [!] catalog_qr_videos_extracted.json no encontrado — se necesita escaneo PDF")
    qr_video_pages = []

# Build page -> urls map
page_to_urls = {}
for entry in qr_video_pages:
    page = entry.get("page", 0)
    urls = entry.get("urls", [])
    if page and urls:
        page_to_urls[page] = urls

print(f"  → Mapa construido: {len(page_to_urls)} páginas con video URLs")

# ─── STEP 2: Load catalog ───────────────────────────────────────
print("\n[2/4] Cargando catálogo de luces de navidad...")
with open(CATALOG_PATH, "r", encoding="utf-8") as f:
    catalog = json.load(f)

total_products = len(catalog)
already_have_video_url = sum(1 for p in catalog if p.get("videoUrl"))
print(f"  → {total_products} productos | {already_have_video_url} ya tienen videoUrl")

# ─── STEP 3: Enrich catalog — Map QR videos to products ────────
print("\n[3/4] Vinculando videos QR a productos por cataloguePage...")

enriched = 0
qr_metadata = []  # SKU -> video URL mapping
pages_linked = set()

for product in catalog:
    page = product.get("cataloguePage", 0)
    sku = product.get("sku", "UNKNOWN")

    # Skip if already has a videoUrl
    if product.get("videoUrl"):
        qr_metadata.append({
            "sku": sku,
            "cataloguePage": page,
            "videoUrl": product["videoUrl"],
            "source": "existing"
        })
        continue

    # Check if this page has QR video URLs
    if page in page_to_urls:
        video_url = page_to_urls[page][0]  # Primary video for the page
        product["videoUrl"] = video_url
        product["hasVideo"] = True
        enriched += 1
        pages_linked.add(page)
        qr_metadata.append({
            "sku": sku,
            "cataloguePage": page,
            "videoUrl": video_url,
            "source": "qr_vampire"
        })
    else:
        # Check adjacent pages (±1) for products that span pages
        for offset in [1, -1, 2, -2]:
            adj_page = page + offset
            if adj_page in page_to_urls and adj_page not in pages_linked:
                video_url = page_to_urls[adj_page][0]
                product["videoUrl"] = video_url
                product["hasVideo"] = True
                enriched += 1
                qr_metadata.append({
                    "sku": sku,
                    "cataloguePage": page,
                    "videoUrl": video_url,
                    "source": f"qr_vampire_adjacent_p{adj_page}"
                })
                break

print(f"  → {enriched} productos enriquecidos con videoUrl")
print(f"  → Total con videoUrl ahora: {sum(1 for p in catalog if p.get('videoUrl'))}/{total_products}")

# ─── STEP 4: Save outputs ───────────────────────────────────────
print("\n[4/4] Guardando archivos de salida...")

# Save enriched catalog
with open(CATALOG_PATH, "w", encoding="utf-8") as f:
    json.dump(catalog, f, ensure_ascii=False, indent=2)
print(f"  → Catálogo actualizado: {CATALOG_PATH}")

# Save QR metadata
with open(QR_METADATA_OUTPUT, "w", encoding="utf-8") as f:
    json.dump(qr_metadata, f, ensure_ascii=False, indent=2)
print(f"  → QR Metadata: {QR_METADATA_OUTPUT} ({len(qr_metadata)} entries)")

# Save decoded QR intel (consolidated from video pages)
decoded_intel = []
for entry in qr_video_pages:
    page = entry.get("page", 0)
    for url in entry.get("urls", []):
        decoded_intel.append({
            "pdf": "CATALOGO luces de navidad 2026 EAR.pdf",
            "page": page,
            "content": url,
            "type": "google_drive_video" if "drive.google.com" in url else
                     "youtube" if "youtube.com" in url or "youtu.be" in url else
                     "vimeo" if "vimeo.com" in url else "url"
        })

with open(QR_DECODED_OUTPUT, "w", encoding="utf-8") as f:
    json.dump(decoded_intel, f, ensure_ascii=False, indent=2)
print(f"  → QR Decoded Intel: {QR_DECODED_OUTPUT} ({len(decoded_intel)} QR codes)")

# ─── SUMMARY ────────────────────────────────────────────────────
print("\n" + "=" * 72)
print("[OK] RETO_01_QR_VAMPIRE — COMPLETADO")
print(f"  Total productos:     {total_products}")
print(f"  Con videoUrl (antes): {already_have_video_url}")
print(f"  Enriquecidos (ahora): {enriched}")
print(f"  Con videoUrl (total): {sum(1 for p in catalog if p.get('videoUrl'))}")
print(f"  QR Intel extraído:    {len(decoded_intel)} códigos")
print(f"  QR Metadata entries:  {len(qr_metadata)}")
print("=" * 72)

# ─── OPTIONAL: PDF Re-scan with OpenCV ──────────────────────────
if "--rescan" in sys.argv:
    print("\n[*] Re-escaneo PDF activado con --rescan flag...")
    try:
        import fitz  # PyMuPDF
        import cv2
        import numpy as np

        for pdf_path in [PDF_PRIMARY, PDF_DEMETRIO]:
            if not os.path.exists(pdf_path):
                print(f"  [!] No encontrado: {pdf_path}")
                continue

            doc = fitz.open(pdf_path)
            pdf_name = os.path.basename(pdf_path)
            detector = cv2.QRCodeDetector()
            new_qrs = 0

            print(f"  [*] Escaneando {pdf_name} ({len(doc)} páginas) a 200 DPI...")

            for page_idx in range(len(doc)):
                page = doc[page_idx]
                pix = page.get_pixmap(dpi=200)
                img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(
                    pix.height, pix.width, pix.n
                )
                if pix.n == 4:
                    img = cv2.cvtColor(img, cv2.COLOR_RGBA2BGR)
                elif pix.n == 3:
                    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

                # Multi-decode
                success, info, pts, _ = detector.detectAndDecodeMulti(img)
                if success and info:
                    for s in info:
                        if s.strip() and s.strip() not in [
                            d["content"] for d in decoded_intel
                        ]:
                            decoded_intel.append({
                                "pdf": pdf_name,
                                "page": page_idx + 1,
                                "content": s.strip(),
                                "type": "rescan"
                            })
                            new_qrs += 1
                            print(f"    [+] Pág {page_idx + 1}: {s.strip()[:80]}...")

            print(f"  → Nuevos QRs en {pdf_name}: {new_qrs}")

        # Re-save if new QRs found
        if any(d["type"] == "rescan" for d in decoded_intel):
            with open(QR_DECODED_OUTPUT, "w", encoding="utf-8") as f:
                json.dump(decoded_intel, f, ensure_ascii=False, indent=2)
            print(f"  → Actualizado: {QR_DECODED_OUTPUT}")

    except ImportError as e:
        print(f"  [!] Dependencias faltantes para re-escaneo: {e}")
        print("  [!] Instalar: pip install pymupdf opencv-python-headless")
