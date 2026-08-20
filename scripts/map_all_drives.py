import os
import json
import string
from ctypes import windll

OUTPUT_FILE = r"C:\EAR_OS_V2\_auditoria\MAPA_SISTEMA_COMPLETO.json"
EXCLUDE_DIRS = {".git", ".next", "node_modules", "$RECYCLE.BIN", "System Volume Information", "Windows", "Program Files", "Program Files (x86)"}

def get_available_drives():
    drives = []
    bitmask = windll.kernel32.GetLogicalDrives()
    for letter in string.ascii_uppercase:
        if bitmask & 1:
            drives.append(f"{letter}:\\")
        bitmask >>= 1
    return drives

def scan_system():
    print("🛡️ INICIANDO MAPEO PASIVO MULTIDISCO (CERO ESCRITURA EN ORIGEN)")
    available_drives = get_available_drives()
    print(f"🔍 Unidades detectadas en el sistema: {available_drives}\n")

    system_map = {}

    for drive in available_drives:
        # Solo mapeamos discos accesibles y omitimos la unidad C de sistema profundo si se requiere
        print(f"📂 Mapeando unidad: {drive}...")
        drive_data = {"total_files": 0, "total_size_mb": 0, "folders": {}}

        for root, dirs, files in os.walk(drive):
            # Filtrar carpetas de sistema o pesadas de entorno
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]

            rel_path = root
            file_count = len(files)
            folder_size = 0

            for f in files:
                try:
                    fp = os.path.join(root, f)
                    sz = os.path.getsize(fp)
                    folder_size += sz
                except Exception:
                    pass

            size_mb = round(folder_size / (1024 * 1024), 2)
            drive_data["folders"][rel_path] = {
                "file_count": file_count,
                "size_mb": size_mb
            }
            drive_data["total_files"] += file_count
            drive_data["total_size_mb"] += size_mb

        drive_data["total_size_mb"] = round(drive_data["total_size_mb"], 2)
        system_map[drive] = drive_data
        print(f"  └─ Archivos: {drive_data['total_files']} | Peso estimado: {drive_data['total_size_mb']} MB")

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(system_map, f, ensure_ascii=False, indent=2)

    print("\n==================================================")
    print(f"✅ MAPEO COMPLETADO SIN TOCAR NADA EN TUS DISCOS.")
    print(f"📄 Mapa indexado guardado en: {OUTPUT_FILE}")
    print("==================================================\n")

if __name__ == "__main__":
    scan_system()
