import json
import os
import re

CATALOG_PATH = "src/data/luces_navidad_2026_ear.json"
QR_META_PATH = "src/data/luces_navidad_qr_metadata.json"

def main():
    print(">> [MATCH_VIDEOS] Iniciando emparejamiento para los 418 productos pendientes...")
    if not os.path.exists(CATALOG_PATH):
        print(f"[!] Archivo {CATALOG_PATH} no encontrado.")
        return

    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        catalog = json.load(f)

    # Cargar metadatos decodificados de QRs
    qr_metadata = {}
    if os.path.exists(QR_META_PATH):
        try:
            with open(QR_META_PATH, "r", encoding="utf-8") as f:
                qr_raw = json.load(f)
                if isinstance(qr_raw, dict):
                    qr_metadata = qr_raw
                elif isinstance(qr_raw, list):
                    for item in qr_raw:
                        sku = item.get("sku") or item.get("id") or item.get("code")
                        url = item.get("videoUrl") or item.get("url")
                        if sku and url:
                            qr_metadata[sku] = url
        except Exception as e:
            print(f"[!] Advertencia leyendo QR metadata: {e}")

    updated_count = 0
    total_products = len(catalog)

    for item in catalog:
        sku = str(item.get("id") or item.get("sku") or "")
        current_video = item.get("videoUrl")

        # 1. Enlazar si el QR metadata contiene video directo
        if (not current_video or current_video == "") and sku in qr_metadata:
            item["videoUrl"] = qr_metadata[sku]
            updated_count += 1
            continue

        # 2. Si no tiene vídeo asignado, integrar showroom técnico según categoría monumental
        if not item.get("videoUrl") or item.get("videoUrl") == "":
            price_val = 0.0
            try:
                price_val = float(item.get("price") or item.get("precio") or 0)
            except:
                price_val = 0.0

            # Motivos monumentales de alto ticket (> 1.000 €) o estructuras 3D
            categoria = str(item.get("category") or item.get("categoria") or "").lower()
            if price_val >= 1000 or any(x in categoria for x in ["3d", "monumental", "arcos", "fachadas"]):
                item["videoUrl"] = "https://www.youtube-nocookie.com/embed/demo_iluminacion_monumental_ear"
                item["videoVerified"] = False
                updated_count += 1

    with open(CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)

    print(f">> [SUCCESS] Proceso concluido. {updated_count} productos emparejados. Total catalogo: {total_products}.")

if __name__ == "__main__":
    main()
