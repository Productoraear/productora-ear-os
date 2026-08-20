import os
import json
from datetime import datetime

ROOT_DIR = r"C:\EAR_OS_V2"
OUTPUT_DIR = os.path.join(ROOT_DIR, "_auditoria")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "INVENTARIO_ESTRUCTURA_EAR_OS.md")

# Directorios que ignoraremos en el escaneo profundo para evitar contaminación de Big Data
EXCLUDE_DIRS = {".git", ".next", "node_modules", ".vercel"}

def build_tree_and_audit():
    print("🔍 INICIANDO AUDITORÍA FORENSE DE ESTRUCTURA DIGITAL EN C:\\EAR_OS_V2...")
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    dir_stats = []
    root_files = []

    total_files = 0
    total_size_bytes = 0

    for root, dirs, files in os.walk(ROOT_DIR):
        # Filtrar directorios excluidos para no saturar el informe
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]

        rel_path = os.path.relpath(root, ROOT_DIR)
        file_count = len(files)
        dir_size = 0

        for f in files:
            fp = os.path.join(root, f)
            try:
                sz = os.path.getsize(fp)
                dir_size += sz
                total_size_bytes += sz
                total_files += 1
            except Exception:
                pass

        if rel_path == ".":
            root_files = files
        else:
            dir_stats.append({
                "path": rel_path,
                "files_count": file_count,
                "size_mb": round(dir_size / (1024 * 1024), 2)
            })

    # Generar Informe Purista en Markdown
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    report = f"""# 🏛️ DIAGNÓSTICO E INVENTARIO FORENSE: ESTRUCTURA C:\\EAR_OS_V2
**Fecha de Auditoría:** {now_str}  
**Directorio Raíz:** `{ROOT_DIR}`  
**Archivos Totales Indexados:** {total_files}  
**Tamaño Total del Sistema:** {round(total_size_bytes / (1024 * 1024), 2)} MB  

---

## 1. Archivos Sueltos en Raíz (`C:\\EAR_OS_V2`)
*Se deben evaluar para mover a sus carpetas canónicas (00_INBOX, docs, data_vault, etc.).*

"""
    for rf in sorted(root_files):
        report += f"- `{rf}`\n"

    report += """\n---

## 2. Inventario de Directorios y Módulos
| Ruta Relativa | N° de Archivos | Tamaño (MB) |
| :--- | :---: | :---: |
"""
    for stat in sorted(dir_stats, key=lambda x: x['path']):
        report += f"| `{stat['path']}` | {stat['files_count']} | {stat['size_mb']} MB |\n"

    report += """\n---

## 3. Dictamen Operativo del Archivista
1. **Preservación de Núcleo:** Los módulos `src`, `lib`, `config`, `supabase`, `prisma` y `scripts` permanecerán intactos para evitar roturas de compilación.
2. **Depuración de Raíz:** Todo archivo Markdown (`.md`), documento suelto o notas de audio sin clasificar en la raíz deben ser trasladados a `00_INBOX_COGNITIVO` o `BASE_DE_CONOCIMIENTO`.
"""

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(report)

    print(f"✅ AUDITORÍA COMPLETADA.")
    print(f"📄 Informe de diagnóstico guardado en: {OUTPUT_FILE}")
    print("\n--- RESUMEN EN CONSOLA ---")
    print(f"Archivos en Raíz: {len(root_files)}")
    print(f"Carpetas Mapeadas: {len(dir_stats)}")
    print("---------------------------\n")

if __name__ == "__main__":
    build_tree_and_audit()
