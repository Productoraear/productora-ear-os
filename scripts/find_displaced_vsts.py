import csv
import os

CSV_FILE = r"C:\EAR_OS_V2\WizTree_ D disco mecanico 2Tb  20260819155126.csv"
OUTPUT_REPORT = r"C:\EAR_OS_V2\_auditoria\REPORTE_VSTS_DESPLAZADOS.txt"

VST_EXTENSIONS = {".vst3", ".vstsound", ".aaxplugin", ".dll"}

def scan_vsts():
    print("🔍 AUDITANDO PLUGINS DE AUDIO Y DLLS DESPLAZADOS EN D:...")
    if not os.path.exists(CSV_FILE):
        print("❌ CSV de D: no encontrado.")
        return

    found_vsts = []

    with open(CSV_FILE, mode='r', encoding='utf-8', errors='ignore') as f:
        reader = csv.reader(f)
        next(reader, None) # Saltador de cabecera
        header = next(reader, None)

        for row in reader:
            if len(row) < 17:
                continue
            path = row[0]
            ext = row[16].lower() if len(row) > 16 else ""

            if ext in VST_EXTENSIONS or "waves" in path.lower() or "vst" in path.lower():
                try:
                    size_mb = round(int(row[1]) / (1024 * 1024), 2)
                    found_vsts.append((path, size_mb))
                except ValueError:
                    pass

    os.makedirs(os.path.dirname(OUTPUT_REPORT), exist_ok=True)
    with open(OUTPUT_REPORT, "w", encoding="utf-8") as f:
        f.write("=== REPORTE DE PLUGINS Y DLLS ENCONTRADOS EN D: ===\n\n")
        for path, sz in found_vsts:
            f.write(f"[{sz} MB] {path}\n")

    print(f"✅ Se han localizado {len(found_vsts)} elementos de software/audio.")
    print(f"📄 Reporte generado en: {OUTPUT_REPORT}")

if __name__ == "__main__":
    scan_vsts()
