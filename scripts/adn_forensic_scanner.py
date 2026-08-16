"""
ADN FORENSIC SCANNER - EXTRACTOR DE ACTIVOS S-CLASS
===================================================
Escanea el almacenamiento local buscando fragmentos de alto valor de:
- Monetización y split de artistas
- Cálculos acústicos de ingeniería (12W/PAX, Bose, Axient)
- Protocolos clínicos y reminiscencia VIMUME
- Motores de Price-Lock y hashes SHA-256
"""

import os
import sys
import re
import json
from concurrent.futures import ThreadPoolExecutor

# Forzar codificación UTF-8 en consola de Windows
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

TARGET_PATHS = [r"C:\EAR_OS_V2", r"D:\\", r"H:\\"]
OUTPUT_FILE = r"C:\EAR_OS_V2\src\data\catalog\ADN_EAR_INDEX.json"

KEYWORDS = {
    "monetizacion_artistas": [r"monetizacio", r"rights", r"split801010", r"royalty", r"artistDirect"],    
    "calculo_acustico": [r"technicalWatts", r"wattsPerPax", r"bose", r"xr18", r"shure"],
    "vimume_terapia": [r"vimume", r"reminiscencia", r"estimulacion", r"musicosPorLaSalud"],
    "price_lock": [r"priceLock", r"sha256", r"congelador", r"bespokePricer"]
}

def analyze_file_content(file_path):
    try:
        stats = os.stat(file_path)
        if stats.st_size > 5 * 1024 * 1024:
            return None

        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        score = 0
        matches = []
        for category, patterns in KEYWORDS.items():
            for pattern in patterns:
                if re.search(pattern, content, re.IGNORECASE):
                    score += 2.5
                    matches.append(category)

        if score > 0:
            return {
                "file_name": os.path.basename(file_path),
                "path": file_path,
                "size_kb": round(stats.st_size / 1024, 2),
                "compatibility_score": min(round(score, 1), 10),
                "capabilities": list(set(matches))
            }
    except Exception:
        return None
    return None

def run_forensic_scan():
    print("⚡ [S-CLASS] Iniciando escaneo forense de ADN sobre contenido...")
    matched_files = []
    file_list = []
    
    for base_path in TARGET_PATHS:
        if os.path.exists(base_path):
            print(f"Rastreando unidad: {base_path}...")
            for root, _, files in os.walk(base_path):
                if any(x in root for x in ["node_modules", ".next", ".git"]):
                    continue
                for file in files:
                    if file.endswith(('.ts', '.tsx', '.js', '.jsx', '.py', '.md')):
                        file_list.append(os.path.join(root, file))

    print(f"Archivos candidatos encontrados: {len(file_list)}. Extrayendo firmas semánticas...")

    with ThreadPoolExecutor(max_workers=16) as executor:
        results = executor.map(analyze_file_content, file_list)
        for res in results:
            if res:
                matched_files.append(res)

    matched_files.sort(key=lambda x: x["compatibility_score"], reverse=True)

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(matched_files, f, indent=2, ensure_ascii=False)

    print(f"✅ Escaneo completado. {len(matched_files)} activos de alto valor indexados en {OUTPUT_FILE}")

if __name__ == "__main__":
    run_forensic_scan()
