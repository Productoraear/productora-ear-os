import json
import os
import shutil

JSON_FILE = r"C:\EAR_OS_V2\_auditoria\MAPA_RESCATE_PLUGINS_TOTAL.json"

# Destinos canónicos oficiales
DEST_VST3 = r"C:\Program Files\Common Files\VST3"
DEST_VST2 = r"C:\Program Files\VSTPlugins"
DEST_AAX = r"C:\Program Files\Common Files\Avid\Audio\Plug-Ins"
DEST_VSTSOUND = r"C:\ProgramData\Steinberg\Content\VST Sound"
DEST_KONTAKT = r"D:\02_PERSONAL_EDWIN\Librerias_Audio\Kontakt"

# Prefijos de rutas que NUNCA debemos tocar
PROTECTED_PATHS = [
    r"c:\windows",
    r"c:\program files\adobe",
    r"c:\program files\audacity",
    r"c:\program files\obs-studio",
    r"c:\program files (x86)\microsoft visual studio",
    r"c:\program files\waves central",
    r"c:\program files\common files\microsoft shared"
]

def is_protected(path):
    lower_path = path.lower()
    return any(lower_path.startswith(p) for p in PROTECTED_PATHS)

def safe_repatriate():
    print("🚀 INICIANDO REPATRIACIÓN FILTRADA Y SEGURA (MODO ADMINISTRADOR)...")
    if not os.path.exists(JSON_FILE):
        print("❌ No se encontró el mapa JSON en _auditoria.")
        return

    for d in [DEST_VST3, DEST_VST2, DEST_AAX, DEST_VSTSOUND, DEST_KONTAKT]:
        os.makedirs(d, exist_ok=True)

    with open(JSON_FILE, "r", encoding="utf-8") as f:
        items = json.load(f)

    success_count = 0
    skipped_protected = 0

    for item in items:
        src = item["path"]
        if not os.path.exists(src):
            continue

        # Si el archivo está en una ruta protegida del SO/Programas, OMITIR
        if is_protected(src):
            skipped_protected += 1
            continue

        # Solo procesar si el origen está en D:\ u H:\
        if not (src.startswith("D:\\") or src.startswith("H:\\")):
            continue

        file_name = item["file"]
        ext = os.path.splitext(file_name)[1].lower()

        target_dir = None
        if ext == ".vst3":
            target_dir = DEST_VST3
        elif ext == ".dll" and ("vst" in file_name.lower() or "waves" in file_name.lower()):
            target_dir = DEST_VST2
        elif ext == ".aaxplugin":
            target_dir = DEST_AAX
        elif ext == ".vstsound":
            target_dir = DEST_VSTSOUND
        elif ext == ".nki":
            target_dir = DEST_KONTAKT

        if target_dir:
            dest_file = os.path.join(target_dir, file_name)
            if not os.path.exists(dest_file):
                try:
                    shutil.copy2(src, dest_file) # Usamos copy2 para preservar metadatos sin borrar origen aún
                    success_count += 1
                except Exception as e:
                    print(f"⚠️ Error al copiar {file_name}: {e}")

    print("\n==================================================")
    print("✅ REPATRIACIÓN SEGURA CONCLUIDA")
    print("==================================================")
    print(f" ├─ Archivos Protegidos Omitidos: {skipped_protected}")
    print(f" └─ Plugins/Librerías Repatriados desde D: e H:: {success_count}")
    print("==================================================\n")

if __name__ == "__main__":
    safe_repatriate()
