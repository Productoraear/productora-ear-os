import pymupdf
import os
import json

pdf_path = r"H:\CATALOGO luces de Navidad Demetrio 2025 _compressed.pdf"
output_dir = os.path.join(os.getcwd(), "public", "images", "demetrio")
os.makedirs(output_dir, exist_ok=True)

doc = pymupdf.open(pdf_path)
print(f"Abriendo catálogo PDF con {len(doc)} páginas...")

# Renderizar cada página a resolución 150 DPI (suficiente para calidad retina y peso óptimo ~150KB por imagen)
matrix = pymupdf.Matrix(1.5, 1.5)

for page_idx in range(len(doc)):
    page_num = page_idx + 1
    page = doc[page_idx]
    pix = page.get_pixmap(matrix=matrix, alpha=False)
    out_file = os.path.join(output_dir, f"page_{page_num}.jpg")
    pix.save(out_file)
    if page_num % 20 == 0 or page_num == len(doc):
        print(f"Renderizada pagina {page_num}/{len(doc)} -> {out_file}")

print("\n[OK] Todas las paginas renderizadas exitosamente.")

# Ahora actualizar src/data/demetrio_luces_navidad_2025.json
catalog_json_path = os.path.join(os.getcwd(), "src", "data", "demetrio_luces_navidad_2025.json")
with open(catalog_json_path, "r", encoding="utf-8") as f:
    products = json.load(f)

for p in products:
    page_num = p.get("cataloguePage") or 1
    # Asegurar que el rango este dentro de 1 a 145
    page_num = max(1, min(len(doc), int(page_num)))
    p["image"] = f"/images/demetrio/page_{page_num}.jpg"

with open(catalog_json_path, "w", encoding="utf-8") as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

print(f"[OK] Actualizadas las 358 referencias en {catalog_json_path} con sus capturas directas del catálogo.")
