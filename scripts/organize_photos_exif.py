import os
import shutil
import winreg
from datetime import datetime
from PIL import Image

SOURCE_DIR = r"D:\02_PERSONAL_EDWIN\05_Fotografia_y_Media_Personal"
QUARANTINE_DIR = r"D:\99_CUARENTENA_FOTOS_CORRUPTAS_6MESES"
SOFTWARE_UI_DIR = os.path.join(SOURCE_DIR, "_RECURSOS_SOFTWARE_Y_UI")
KONTAKT_CANONICAL = r"D:\01_PRODUCCION_AUDIO\Librerias_Kontakt"

VALID_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".nef", ".arw", ".tif", ".tiff"}
MIN_SIZE_BYTES = 150 * 1024  # 150 KB mínimo
MIN_FREE_DISK_GB = 10.0      # Parada de emergencia

def set_native_access_registry_path(content_path):
    reg_key_path = r"Software\Native Instruments\Native Access"
    try:
        key = winreg.CreateKey(winreg.HKEY_CURRENT_USER, reg_key_path)
        winreg.SetValueEx(key, "ContentDirectory", 0, winreg.REG_SZ, content_path)
        winreg.CloseKey(key)
        print(f"⚙️ REGISTRO ACTUALIZADO: Native Access 'Content Location' -> {content_path}")
        return True
    except Exception as e:
        print(f"⚠️ No se pudo escribir en el registro: {e}")
        return False

def check_disk_space(path):
    total, used, free = shutil.disk_usage(path)
    return free / (1024 ** 3)

def fast_validate_and_get_date(filepath, ext):
    """Valida la imagen leyendo únicamente la cabecera EXIF sin cargar píxeles en memoria."""
    try:
        if ext in {".nef", ".arw", ".tif", ".tiff"}:
            mtime = os.path.getmtime(filepath)
            return True, datetime.fromtimestamp(mtime).strftime("%Y-%m-%d")

        with Image.open(filepath) as img:
            exif = img._getexif() if hasattr(img, '_getexif') else None
            if exif and 36867 in exif: # 36867 = DateTimeOriginal
                date_str = exif[36867].split()[0].replace(":", "-")
                return True, date_str
            mtime = os.path.getmtime(filepath)
            return True, datetime.fromtimestamp(mtime).strftime("%Y-%m-%d")
    except Exception:
        return False, "SIN_FECHA"

def process_media():
    print("🚀 INICIANDO CLASIFICACIÓN FORENSE ULTRA-RÁPIDA...")
    
    os.makedirs(QUARANTINE_DIR, exist_ok=True)
    os.makedirs(SOFTWARE_UI_DIR, exist_ok=True)
    os.makedirs(KONTAKT_CANONICAL, exist_ok=True)

    set_native_access_registry_path(KONTAKT_CANONICAL)

    moved_photos = 0
    moved_quarantine = 0
    moved_software_ui = 0
    moved_kontakt = 0

    for root, dirs, files in os.walk(SOURCE_DIR):
        if "99_CUARENTENA" in root or "_RECURSOS_SOFTWARE" in root:
            continue

        for f in files:
            if check_disk_space("D:\\") < MIN_FREE_DISK_GB:
                print("🛑 ALERTA: Espacio libre en D:\\ menor a 10 GB. Pausando script...")
                return

            filepath = os.path.join(root, f)
            ext = os.path.splitext(f)[1].lower()

            # 1. Reubicación de instrumentos Kontakt
            if ext in {".nki", ".nks", ".nicnt"}:
                dest = os.path.join(KONTAKT_CANONICAL, f)
                try:
                    shutil.move(filepath, dest)
                    moved_kontakt += 1
                except Exception:
                    pass
                continue

            if ext not in VALID_EXTS:
                continue

            try:
                filesize = os.path.getsize(filepath)
            except Exception:
                continue

            # 2. Separación de Iconos y UI de software
            if filesize < MIN_SIZE_BYTES and ext in {".png", ".jpg", ".webp"}:
                dest = os.path.join(SOFTWARE_UI_DIR, f)
                try:
                    shutil.move(filepath, dest)
                    moved_software_ui += 1
                except Exception:
                    pass
                continue

            # 3. Validación rápida de cabecera y extracción de fecha
            is_valid, date_str = fast_validate_and_get_date(filepath, ext)
            if not is_valid:
                dest = os.path.join(QUARANTINE_DIR, f)
                try:
                    shutil.move(filepath, dest)
                    moved_quarantine += 1
                except Exception:
                    pass
                continue

            # 4. Agrupación por Fecha de Sesión
            target_folder = os.path.join(SOURCE_DIR, f"SESION_{date_str}")
            os.makedirs(target_folder, exist_ok=True)
            dest = os.path.join(target_folder, f)

            if not os.path.exists(dest):
                try:
                    shutil.move(filepath, dest)
                    moved_photos += 1
                except Exception:
                    pass

    print("\n==================================================")
    print("✅ PROCESO COMPLETADO EXITOSAMENTE")
    print("==================================================")
    print(f" ├─ Fotos Válidas Organizadas por Fecha: {moved_photos}")
    print(f" ├─ Archivos Kontakt Reubicados a D:\\01_PRODUCCION_AUDIO: {moved_kontakt}")
    print(f" ├─ Recursos UI e Iconos Filtrados: {moved_software_ui}")
    print(f" └─ Fotos Corruptas en Cuarentena (6 Meses): {moved_quarantine}")
    print("==================================================\n")

if __name__ == "__main__":
    process_media()
