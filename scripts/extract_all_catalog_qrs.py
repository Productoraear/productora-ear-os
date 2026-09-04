import sys
import fitz
import cv2
import numpy as np
import json
import os

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass

print("====================================================================")
print("[*] EXTRACCIÓN MASIVA DE ENLACES QR & VÍDEOS EN CATÁLOGO NAVIDAD")
print("====================================================================")

pdf_path = r"H:\EAR_OS_V2\CATALOGO luces de navidad 2026 EAR.pdf"
doc = fitz.open(pdf_path)
detector = cv2.QRCodeDetector()

print(f"[*] Procesando {len(doc)} páginas...")

results = []
pages_with_qr = 0

for page_idx in range(len(doc)):
    page = doc[page_idx]
    page_num = page_idx + 1

    # Search for video markers
    rects = page.search_for("D E O") + page.search_for("VIDEO") + page.search_for("VÍDEO")
    if not rects:
        continue

    pix = page.get_pixmap(dpi=200)
    page_img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)
    if pix.n >= 3:
        page_img = cv2.cvtColor(page_img, cv2.COLOR_RGB2BGR)

    sx = pix.width / page.rect.width
    sy = pix.height / page.rect.height

    decoded_on_page = []

    for r in rects:
        # Search bounding box around the rect
        x_c = (r.x0 + r.x1) / 2
        y_c = (r.y0 + r.y1) / 2

        crops_to_try = [
            # Above the text
            (max(0, int((x_c - 120) * sx)), max(0, int((y_c - 220) * sy)), min(pix.width, int((x_c + 120) * sx)), min(pix.height, int((y_c + 40) * sy))),
            # Around the text
            (max(0, int((r.x0 - 100) * sx)), max(0, int((r.y0 - 120) * sy)), min(pix.width, int((r.x1 + 100) * sx)), min(pix.height, int((r.y1 + 120) * sy))),
            # Below the text
            (max(0, int((x_c - 120) * sx)), max(0, int((y_c - 40) * sy)), min(pix.width, int((x_c + 120) * sx)), min(pix.height, int((y_c + 220) * sy)))
        ]

        found_url = None
        for x0, y0, x1, y1 in crops_to_try:
            crop = page_img[y0:y1, x0:x1]
            if crop.shape[0] < 20 or crop.shape[1] < 20:
                continue
            gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
            for th_val in [150, 180, 200, 220]:
                _, th = cv2.threshold(gray, th_val, 255, cv2.THRESH_BINARY)
                val, _, _ = detector.detectAndDecode(th)
                if val and val.strip() and val.strip() not in decoded_on_page:
                    found_url = val.strip()
                    break
            if found_url:
                break

        if found_url and found_url not in decoded_on_page:
            decoded_on_page.append(found_url)
            print(f"  [+] Pág {page_num}: {found_url}")

    if decoded_on_page:
        pages_with_qr += 1
        results.append({
            "page": page_num,
            "urls": decoded_on_page
        })

output_file = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\catalog_qr_videos_extracted.json"
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("====================================================================")
print(f"[OK] {pages_with_qr} páginas con QRs decodificados -> Guardado en {output_file}")
print("====================================================================")
