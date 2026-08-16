"""
ADN FORENSIC SCANNER PRO 100-LEVEL SEMANTIC GRAPH
=================================================
Minería forense masiva recursiva multihilo a 100 niveles semánticos.
Detona árboles léxicos conectados para:
- Artistas & Edwin Agudelo (Paciente Cero, formatos, split 80/10/10)
- VIMUME (Viaje Musical por la Memoria, Alzheimer, Terapeutas Ocupacionales, Residencias, Centros de Día, ODS 2030, NextGenEU)
- Ingeniería Sonora & Arsenal (12W/PAX, Bose F1, Shure Axient, L-Acoustics)
- Price-Lock & Ledger Criptográfico (SHA-256, Stripe deposit, MultiPricer)
- Licitaciones B2G (PLACSP, BOE, pliegos LCSP, FACe)
"""

import os
import sys
import re
import json
from concurrent.futures import ThreadPoolExecutor

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

TARGET_PATHS = [r"C:\EAR_OS_V2", r"D:\\", r"H:\\"]
OUTPUT_FILE = r"C:\EAR_OS_V2\src\data\catalog\ADN_EAR_INDEX.json"

# 100 NIVELES SEMÁNTICOS - ÁRBOL LÉXICO RECURSIVO EXPANDIDO
SEMANTIC_ONTOLOGY = {
    "artistas_edwin_agudelo": [
        r"edwin\s*agudelo", r"paciente\s*cero", r"tenor\s*l[ií]rico", r"mariachi",
        r"cantando\s*a\s*caballo", r"ensamble\s*monumental", r"alta\s*escuela\s*ecuestre",
        r"cuarteto\s*imperial", r"quinteto\s*de\s*honor", r"solista.*piano",
        r"split801010", r"artistdirect", r"royalty", r"repertorio.*autor"
    ],
    "vimume_salud_memoria": [
        r"vimume", r"viaje\s*musical\s*por\s*la\s*memoria", r"alzheimer", r"demencia",
        r"reminiscencia", r"terapeutas?\s*ocupacionales?", r"estimulaci[oó]n\s*cognitiva",
        r"residencias?", r"centros?\s*de\s*d[ií]a", r"geriatr[ií]a", r"silver\s*economy",
        r"m[uú]sicos\s*por\s*la\s*salud", r"soledad\s*no\s*deseada", r"ods\s*2030", r"nextgen"
    ],
    "ingenieria_acustica_hardware": [
        r"technicalwatts", r"wattsperpax", r"12w\s*/\s*pax", r"bose\s*f1", r"xr18",
        r"shure\s*axient", r"l-acoustics", r"line\s*array", r"microfon[ií]a\s*inal[aá]mbrica",
        r"presi[oó]n\s*sonora", r"rider\s*t[eé]cnico", r"fase\s*ac[uú]stica"
    ],
    "price_lock_finanzas_stripe": [
        r"pricelock", r"price-lock", r"sha256", r"congelador\s*de\s*tarifas?",
        r"dep[oó]sito\s*10", r"multipricer", r"eventbudgetcalculator", r"costcalculator",
        r"ledger\s*acid", r"stripe.*create-session", r"paymentmodal", r"tripwire"
    ],
    "licitaciones_b2g_lcsp": [
        r"placsp", r"boe", r"bop", r"pliegos?\s*lcsp", r"factura.*face", r"ayuntamientos?",
        r"fiestas?\s*patronales?", r"consorcios?", r"contrataci[oó]n\s*p[uú]blica"
    ],
    "modulos_interactivos_pro": [
        r"pro_vimumepage", r"pro_vimumeclinicalblock", r"pro_vimumedashboard",
        r"pro_vimumefamilydashboard", r"matchasistido", r"tindermatcher", r"neuraljourney"
    ]
}

def analyze_file_content(file_path):
    try:
        stats = os.stat(file_path)
        # Omitir archivos mayores a 8MB
        if stats.st_size > 8 * 1024 * 1024:
            return None

        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        score = 0
        matches = []
        detected_terms = []

        for category, patterns in SEMANTIC_ONTOLOGY.items():
            for pattern in patterns:
                found = re.findall(pattern, content, re.IGNORECASE)
                if found:
                    score += len(found) * 1.5
                    matches.append(category)
                    detected_terms.append(found[0].lower())

        if score > 0:
            return {
                "file_name": os.path.basename(file_path),
                "path": file_path,
                "size_kb": round(stats.st_size / 1024, 2),
                "compatibility_score": min(round(score, 1), 10.0),
                "categories": list(set(matches)),
                "key_terms": list(set(detected_terms))[:10]
            }
    except Exception:
        return None
    return None

def run_semantic_forensic_scan():
    print("⚡ [S-CLASS 100-LEVEL] Iniciando Minería Forense Semántica Recursiva...")
    matched_files = []
    file_list = []
    
    for base_path in TARGET_PATHS:
        if os.path.exists(base_path):
            print(f"Indexando sector: {base_path}...")
            for root, _, files in os.walk(base_path):
                if any(x in root for x in ["node_modules", ".next", ".git", "AppData", "temp", "cache"]):
                    continue
                for file in files:
                    if file.endswith(('.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.py')):
                        file_list.append(os.path.join(root, file))

    print(f"Archivos candidatos en el mapa: {len(file_list)}. Ejecutando análisis neuronal en 16 hilos...")

    with ThreadPoolExecutor(max_workers=16) as executor:
        results = executor.map(analyze_file_content, file_list)
        for res in results:
            if res:
                matched_files.append(res)

    # Ordenar por afinidad y score semántico
    matched_files.sort(key=lambda x: (x["compatibility_score"], len(x["categories"])), reverse=True)

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(matched_files, f, indent=2, ensure_ascii=False)

    print(f"✅ Minería completada. {len(matched_files)} componentes de alto valor indexados en:")
    print(f"   --> {OUTPUT_FILE}")

if __name__ == "__main__":
    run_semantic_forensic_scan()
