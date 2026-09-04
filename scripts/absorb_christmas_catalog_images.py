import os
import io
import time
import json
import fitz # PyMuPDF
from PIL import Image

PDF_PATH = r"H:\EAR_OS_V2\CATALOGO luces de navidad 2026 EAR.pdf"
OUTPUT_PAGES_DIR = r"h:\EAR_OS_V2\EAR_OS_V2\public\images\navidad_2026"
OUTPUT_PRODUCTS_DIR = r"h:\EAR_OS_V2\EAR_OS_V2\public\images\navidad_2026\products"
JSON_PATH = r"h:\EAR_OS_V2\EAR_OS_V2\src\data\luces_navidad_2026_ear.json"

os.makedirs(OUTPUT_PAGES_DIR, exist_ok=True)
os.makedirs(OUTPUT_PRODUCTS_DIR, exist_ok=True)

print(f"Abriendo catálogo maestro: {PDF_PATH}")
doc = fitz.open(PDF_PATH)
total_pages = len(doc)
print(f"Total páginas a renderizar y absorber: {total_pages}")

# 1. Render all 196 pages as high-quality optimized JPEG
t0 = time.time()
for p_idx in range(total_pages):
    page_num = p_idx + 1
    target_page_file = os.path.join(OUTPUT_PAGES_DIR, f"page_{page_num}.jpg")
    
    # Render with dpi=130
    page = doc[p_idx]
    pix = page.get_pixmap(dpi=130)
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    
    # Save optimized JPEG
    img.save(target_page_file, format="JPEG", quality=82, optimize=True)
    
    if page_num % 20 == 0 or page_num == total_pages:
        print(f"  [Progreso] {page_num}/{total_pages} páginas renderizadas ({time.time() - t0:.1f}s)")

print(f"Renderizado completado en {time.time() - t0:.2f}s")

# 2. Extract product individual images where feasible
print("Extrayendo imágenes individuales de productos...")
extracted_products = 0

with open(JSON_PATH, "r", encoding="utf-8") as f:
    products = json.load(f)

# Group products by cataloguePage
products_by_page = {}
for prod in products:
    p = prod.get("cataloguePage")
    if p:
        products_by_page.setdefault(p, []).append(prod)

for page_num, page_prods in products_by_page.items():
    if page_num > total_pages:
        continue
    page = doc[page_num - 1]
    
    # Get images on page
    info_list = page.get_image_info(xrefs=True)
    # Filter candidate product images: width >= 180, height >= 180, width < 2000, not page borders
    valid_imgs = []
    for info in info_list:
        xref = info.get("xref")
        w = info.get("width", 0)
        h = info.get("height", 0)
        if xref > 0 and 150 <= w <= 1800 and 150 <= h <= 1800:
            # Exclude full page background dimensions
            if not (w == 1068 and h == 1628) and not (w == 2469 and h == 1719):
                valid_imgs.append(info)
                
    # If the number of valid images matches or can be assigned to the products on this page:
    if valid_imgs:
        # Sort by vertical position (bbox y0) then x0
        valid_imgs.sort(key=lambda x: (x.get("bbox", [0, 0, 0, 0])[1], x.get("bbox", [0, 0, 0, 0])[0]))
        
        for idx, prod in enumerate(page_prods):
            if idx < len(valid_imgs):
                img_info = valid_imgs[idx]
                xref = img_info["xref"]
                try:
                    base_img = doc.extract_image(xref)
                    raw_bytes = base_img["image"]
                    sku_clean = prod["sku"].replace("/", "-").replace(" ", "_").replace(".", "-")
                    prod_filename = f"{sku_clean}.jpg"
                    prod_filepath = os.path.join(OUTPUT_PRODUCTS_DIR, prod_filename)
                    
                    # Convert to RGB JPEG
                    pil_img = Image.open(io.BytesIO(raw_bytes)).convert("RGB")
                    pil_img.save(prod_filepath, format="JPEG", quality=85, optimize=True)
                    
                    prod["image"] = f"/images/navidad_2026/products/{prod_filename}"
                    prod["pageImage"] = f"/images/navidad_2026/page_{page_num}.jpg"
                    extracted_products += 1
                except Exception as e:
                    # Fallback to page image
                    prod["image"] = f"/images/navidad_2026/page_{page_num}.jpg"
                    prod["pageImage"] = f"/images/navidad_2026/page_{page_num}.jpg"
            else:
                prod["image"] = f"/images/navidad_2026/page_{page_num}.jpg"
                prod["pageImage"] = f"/images/navidad_2026/page_{page_num}.jpg"
    else:
        for prod in page_prods:
            prod["image"] = f"/images/navidad_2026/page_{page_num}.jpg"
            prod["pageImage"] = f"/images/navidad_2026/page_{page_num}.jpg"

# Ensure all products have valid images
for prod in products:
    p = prod.get("cataloguePage", 1)
    if not prod.get("image"):
        prod["image"] = f"/images/navidad_2026/page_{p}.jpg"
    if not prod.get("pageImage"):
        prod["pageImage"] = f"/images/navidad_2026/page_{p}.jpg"

print(f"Total productos con imagen individual extraída: {extracted_products}/{len(products)}")

with open(JSON_PATH, "w", encoding="utf-8") as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"Base de datos {JSON_PATH} actualizada con 100% de imágenes válidas.")
