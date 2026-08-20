import json
import os
from collections import Counter

JSON_FILE = r"C:\EAR_OS_V2\_auditoria\MAPA_RESCATE_PLUGINS_TOTAL.json"

def classify():
    print("📊 CLASIFICANDO LOS 2.378 PLUGINS DESPLAZADOS...")
    if not os.path.exists(JSON_FILE):
        print("❌ Archivo JSON no encontrado.")
        return

    with open(JSON_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    drive_counts = Counter()
    ext_counts = Counter()
    top_folders = Counter()

    for item in data:
        drive_counts[item["drive"]] += 1
        ext = os.path.splitext(item["file"])[1].lower()
        ext_counts[ext] += 1
        folder = os.path.dirname(item["path"])
        top_folders[folder] += 1

    print("\n==================================================")
    print("📍 DISTRIBUCIÓN POR UNIDADES DE DISCO:")
    print("==================================================")
    for drive, count in drive_counts.items():
        print(f"  └─ Disco {drive}: {count} plugins fuera de sitio")

    print("\n==================================================")
    print("📦 TIPOS DE ARCHIVO DESPLAZADOS:")
    print("==================================================")
    for ext, count in ext_counts.items():
        print(f"  └─ Extension {ext if ext else 'Sin ext'}: {count} archivos")

    print("\n==================================================")
    print("📂 TOP 10 CARPETAS CONTENEDORAS MÁS AFECTADAS:")
    print("==================================================")
    for folder, count in top_folders.most_common(10):
        print(f"  └─ ({count} VSTs) -> {folder}")
    print("==================================================\n")

if __name__ == "__main__":
    classify()
