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

def repatriate():
    print("🚀 INICIANDO REPATRIACIÓN QUIRÚRGICA DE VSTs Y LIBRERÍAS...")
    if not os.path.exists(JSON_FILE):
        print("❌ No se encontró el mapa JSON en _auditoria.")
        return

    for d in [DEST_VST3, DEST_VST2, DEST_AAX, DEST_VSTSOUND, DEST_KONTAKT]:
        os.makedirs(d, exist_ok=True)

    with open(JSON_FILE, "r", encoding="utf-8") as f:
        items = json.load(f)

    moved_vst3 = 0
    moved_vst2 = 0
    moved_aax = 0
    moved_vstsound = 0
    moved_nki = 0

    for item in items:
        src = item["path"]
        if not os.path.exists(src):
            continue

        file_name = item["file"]
        ext = os.path.splitext(file_name)[1].lower()

        target_dir = None
        if ext == ".vst3":
            target_dir = DEST_VST3
            moved_vst3 += 1
        elif ext == ".dll" and ("vst" in file_name.lower() or "waves" in file_name.lower()):
            target_dir = DEST_VST2
            moved_vst2 += 1
        elif ext == ".aaxplugin":
            target_dir = DEST_AAX
            moved_aax += 1
        elif ext == ".vstsound":
            target_dir = DEST_VSTSOUND
            moved_vstsound += 1
        elif ext == ".nki":
            target_dir = DEST_KONTAKT
            moved_nki += 1

        if target_dir:
            dest_file = os.path.join(target_dir, file_name)
            if not os.path.exists(dest_file):
                try:
                    shutil.move(src, dest_file)
                except Exception as e:
                    print(f"⚠️ Error al mover {file_name}: {e}")

    print("\n==================================================")
    print("✅ REPATRIACIÓN COMPLETADA CON ÉXITO")
    print("==================================================")
    print(f" ├─ VST3 Moviendo a C:\\Program Files\\Common Files\\VST3: {moved_vst3}")
    print(f" ├─ VST2 Moviendo a C:\\Program Files\\VSTPlugins: {moved_vst2}")
    print(f" ├─ AAX Moviendo a C:\\Program Files\\Common Files\\Avid: {moved_aax}")
    print(f" ├─ VSTSound Moviendo a C:\\ProgramData\\Steinberg: {moved_vstsound}")
    print(f" └─ Kontakt NKI Moviendo a D:\\02_PERSONAL_EDWIN: {moved_nki}")
    print("==================================================\n")

if __name__ == "__main__":
    repatriate()
