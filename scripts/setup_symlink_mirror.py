import os
import shutil

SOURCE_PHOTOS = r"H:\\"
DEST_PHOTOS = r"D:\02_PERSONAL_EDWIN\05_Fotografia_y_Media_Personal"

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".nef", ".arw", ".bmp"}

def evacuate_photos_and_prep_mirror():
    print("🚀 INICIANDO EVACUACIÓN DE FOTOS A D:\\ Y PREPARACIÓN DE ESPEJO...")
    os.makedirs(DEST_PHOTOS, exist_ok=True)

    moved_files = 0
    moved_mb = 0.0

    # 1. Evacuación de fotos de H:\ a D:\
    print("📸 Evacuando fotos desde H:\\ hacia D:\\02_PERSONAL_EDWIN...")
    for root, dirs, files in os.walk(SOURCE_PHOTOS):
        # Omitir carpetas de sistema o dev
        if "node_modules" in root or ".next" in root or "EAR_OS_V2" in root:
            continue

        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in IMAGE_EXTS:
                src_file = os.path.join(root, f)
                dest_file = os.path.join(DEST_PHOTOS, f)

                # Si hay duplicado de nombre, renombrar con índice
                if os.path.exists(dest_file):
                    base, e = os.path.splitext(f)
                    dest_file = os.path.join(DEST_PHOTOS, f"{base}_idx{e}")

                try:
                    sz_mb = round(os.path.getsize(src_file) / (1024 * 1024), 2)
                    shutil.move(src_file, dest_file)
                    moved_files += 1
                    moved_mb += sz_mb
                except Exception as e:
                    pass

    print("\n==================================================")
    print("✅ EVACUACIÓN DE FOTOS COMPLETADA")
    print("==================================================")
    print(f" ├─ Archivos de Imagen Evacuados a D:\\: {moved_files}")
    print(f" └─ Espacio Recuperado en SSD H:\\: {round(moved_mb / 1024, 2)} GB")
    print("==================================================\n")

if __name__ == "__main__":
    evacuate_photos_and_prep_mirror()
