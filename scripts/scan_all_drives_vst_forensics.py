import os
import json
import string
from ctypes import windll

OUTPUT_JSON = r"C:\EAR_OS_V2\_auditoria\MAPA_RESCATE_PLUGINS_TOTAL.json"
OUTPUT_TXT = r"C:\EAR_OS_V2\_auditoria\REPORTE_PLUGINS_DESPLAZADOS.txt"

# Extensiones críticas de producción musical
TARGET_EXTENSIONS = {".vst3", ".vstsound", ".aaxplugin", ".fxp", ".nicnt", ".nki"}

# Rutas legítimas donde Cubase / Waves esperan encontrar plugins
CANONICAL_PATHS = [
    r"c:\program files\common files\vst3",
    r"c:\program files\vstplugins",
    r"c:\program files\steinberg",
    r"c:\programdata\steinberg",
    r"c:\program files (x86)\waves",
    r"c:\program files\common files\avid\audio\plug-ins",
    r"c:\windows\system32",
    r"c:\windows\syswow64"
]

EXCLUDE_SYSTEM_FOLDERS = {"$recycle.bin", "system volume information", "windows\\winsxs"}

def get_available_drives():
    drives = []
    bitmask = windll.kernel32.GetLogicalDrives()
    for letter in string.ascii_uppercase:
        if bitmask & 1:
            drives.append(f"{letter}:\\")
        bitmask >>= 1
    return drives

def is_canonical(file_path):
    lower_path = file_path.lower()
    return any(lower_path.startswith(c_path) for c_path in CANONICAL_PATHS)

def run_forensic_scan():
    print("🛡️ INICIANDO ESCANEO FORENSE EN TODOS LOS DISCOS DEL PC...")
    drives = get_available_drives()
    print(f"🔍 Unidades detectadas: {drives}\n")

    displaced_plugins = []
    canonical_plugins_count = 0

    for drive in drives:
        print(f"📂 Escaneando unidad {drive}...")
        for root, dirs, files in os.walk(drive):
            # Filtrar carpetas del sistema innecesarias
            dirs[:] = [d for d in dirs if d.lower() not in EXCLUDE_SYSTEM_FOLDERS]

            for file in files:
                ext = os.path.splitext(file)[1].lower()
                full_path = os.path.join(root, file)

                # Coincidencia por extensión o término Waves/VST en archivos DLL
                is_vst_dll = (ext == ".dll" and ("vst" in file.lower() or "waves" in file.lower()))
                
                if ext in TARGET_EXTENSIONS or is_vst_dll:
                    try:
                        size_mb = round(os.path.getsize(full_path) / (1024 * 1024), 2)
                    except Exception:
                        size_mb = 0.0

                    item = {"file": file, "path": full_path, "size_mb": size_mb, "drive": drive}

                    if is_canonical(full_path):
                        canonical_plugins_count += 1
                    else:
                        displaced_plugins.append(item)

    # Guardar reporte detallado
    os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(displaced_plugins, f, ensure_ascii=False, indent=2)

    with open(OUTPUT_TXT, "w", encoding="utf-8") as f:
        f.write(f"=== INFORME FORENSE DE PLUGINS DESPLAZADOS EN TODO EL PC ===\n")
        f.write(f"Plugins Correctamente Ubicados: {canonical_plugins_count}\n")
        f.write(f"Plugins Desplazados/Perdidos Hallados: {len(displaced_plugins)}\n\n")
        for p in displaced_plugins:
            f.write(f"[{p['size_mb']} MB] [{p['drive']}] {p['path']}\n")

    print("\n==================================================")
    print(f"✅ ESCANEO FINALIZADO.")
    print(f"📍 Plugins Correctos en Sistema: {canonical_plugins_count}")
    print(f"⚠️ Plugins Desplazados Localizados: {len(displaced_plugins)}")
    print(f"📄 Reporte generado en: {OUTPUT_TXT}")
    print("==================================================\n")

if __name__ == "__main__":
    run_forensic_scan()
