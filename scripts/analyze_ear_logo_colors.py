import os
import sys
import json
from collections import Counter

def extract_image_palette(image_path, num_colors=10):
    try:
        from PIL import Image
    except ImportError:
        return {"error": "PIL not installed"}

    if not os.path.exists(image_path):
        return {"error": f"File not found: {image_path}"}

    try:
        img = Image.open(image_path).convert("RGBA")
        width, height = img.size
        # Resize for faster processing
        img_small = img.resize((150, 150))
        pixels = list(img_small.getdata())

        # Filter out fully transparent or nearly transparent pixels
        solid_pixels = []
        for r, g, b, a in pixels:
            if a > 50:
                # Round to nearest 8 to group similar colors
                r_r = int(round(r / 8.0) * 8)
                g_r = int(round(g / 8.0) * 8)
                b_r = int(round(b / 8.0) * 8)
                solid_pixels.append((r_r, g_r, b_r))

        if not solid_pixels:
            return {"colors": []}

        counts = Counter(solid_pixels).most_common(num_colors)
        results = []
        for (r, g, b), count in counts:
            hex_code = f"#{r:02x}{g:02x}{b:02x}".upper()
            pct = round((count / len(solid_pixels)) * 100, 1)
            results.append({"hex": hex_code, "rgb": [r, g, b], "percentage": pct})

        return {
            "file": os.path.basename(image_path),
            "dimensions": f"{width}x{height}",
            "dominant_colors": results
        }
    except Exception as e:
        return {"error": str(e)}

def search_pc_for_ear_logos():
    search_roots = ["L:\\", "D:\\", "H:\\00_PRODUCTORA_EAR", "C:\\"]
    found_files = []
    
    # Fast targeted check for known folders
    known_targets = [
        r"L:\A IMPORTAR ORIGINALES PARA PHOTOSHOP\LOGO PRODUCTORA EAR",
        r"D:\COPIAS_DE_SEGURIDAD\EAR os posible recuperacion\Carpeta desconocida\BACKUPS\20260208_Sincro_Identidad_Roles",
        r"H:\00_PRODUCTORA_EAR",
        r"H:\EAR_OS_V2\EAR_OS_V2\public\images\brand",
        r"H:\EAR_OS_V2\EAR_OS_V2\public\brand_assets_ear"
    ]
    
    for folder in known_targets:
        if os.path.exists(folder):
            try:
                for root, dirs, files in os.walk(folder):
                    for f in files:
                        lower = f.lower()
                        if any(kw in lower for kw in ["logo", "isotipo", "marca", "manual", "colibri", "ear"]):
                            full = os.path.join(root, f)
                            size_kb = round(os.path.getsize(full) / 1024, 1)
                            found_files.append({"path": full, "size_kb": size_kb})
            except Exception:
                pass
                
    return found_files

def main():
    print("=== INICIANDO EXTRACCIÓN DE COLORES DE LOGOTIPO PRODUCTORA EAR ===")
    base_dir = os.path.abspath(os.path.dirname(__file__) + "/..")
    
    # Analyze local brand images
    img1 = os.path.join(base_dir, "public", "images", "brand", "colibri_logo_completo.png")
    img2 = os.path.join(base_dir, "public", "images", "brand", "colibri_isotipo.png")
    img3 = os.path.join(base_dir, "public", "brand_assets_ear", "ear-concept idea para logotipo.png")
    
    report = {
        "colibri_logo_completo": extract_image_palette(img1),
        "colibri_isotipo": extract_image_palette(img2),
        "concept_logo": extract_image_palette(img3),
        "discovered_pc_assets": search_pc_for_ear_logos()[:25]
    }
    
    out_dir = os.path.join(base_dir, "scripts", "reports")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "ear_logo_colors_condensed.json")
    
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
        
    print(f"✅ Reporte generado en: {out_path}")
    print(json.dumps(report, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
