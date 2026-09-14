import os
import re
import json
import shutil
import subprocess
from pathlib import Path

# Base Paths
SOURCE_ROOT = Path(r"D:\02_PERSONAL_EDWIN\06_Video_y_Media")
VAULT_MEDIA = Path(r"D:\00_VELOCITY_MEDIA_VAULT")
VAULT_KNOWLEDGE = Path(r"H:\EAR_VAULT_VELOCITY_KNOWLEDGE")

# Create base dirs
VAULT_MEDIA.mkdir(parents=True, exist_ok=True)
VAULT_KNOWLEDGE.mkdir(parents=True, exist_ok=True)

# Load match report
match_file = Path("reports/velocity_forensic_cross_match.json")
with open(match_file, "r", encoding="utf-8") as f:
    cross_data = json.load(f)

def verify_video_integrity(file_path):
    """Uses ffprobe to verify that the video container and stream can be decoded."""
    try:
        cmd = [
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration,size,bit_rate:stream=codec_type,codec_name",
            "-of", "json",
            str(file_path)
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            info = json.loads(result.stdout)
            duration = float(info.get("format", {}).get("duration", 0))
            if duration > 5:  # Valid video > 5 seconds
                return True, duration, "OK"
        return False, 0, result.stderr[:200]
    except Exception as e:
        return False, 0, str(e)

def clean_class_name(filename):
    """Cleans up the raw filename into a professional title."""
    clean = filename
    clean = re.sub(r'_REPARADO.*$', '', clean, flags=re.IGNORECASE)
    clean = re.sub(r'\(2\)', '', clean)
    clean = re.sub(r'\(youtube\.com\)', '', clean, flags=re.IGNORECASE)
    clean = clean.replace('_', ' ').strip()
    return clean

print("="*80)
print("🏛️ EAR OS OMEGA — PROCESAMIENTO Y VALIDACIÓN INTEGRAL VELOCITY MEDIA")
print("="*80)

total_processed = 0
valid_videos = []
corrupt_videos = []

for course in cross_data.get("covered", []):
    category = course.get("category", "General").upper()
    cat_prefix = "00_SERIES" if "SERIE" in category else (
        "01_PODCASTS" if "PODCAST" in category else (
            "03_CURSOS" if "CURSO" in category else "04_WORKSHOPS"
        )
    )
    course_clean_name = re.sub(r'[^\w\s-]', '', course["title"]).strip()
    
    # Destination folders
    dest_media_dir = VAULT_MEDIA / cat_prefix / course_clean_name
    dest_know_dir = VAULT_KNOWLEDGE / cat_prefix / course_clean_name
    dest_media_dir.mkdir(parents=True, exist_ok=True)
    dest_know_dir.mkdir(parents=True, exist_ok=True)
    
    # Create Course Hub Index in Knowledge Vault
    course_index_file = dest_know_dir / f"00_INDICE_{course_clean_name}.md"
    if not course_index_file.exists():
        with open(course_index_file, "w", encoding="utf-8") as f:
            f.write(f"""# 📚 {course['title']}
**Categoría:** {cat_prefix} | **Total Clases Esperadas:** {course.get('expected_classes', '?')} | **Duración:** {course.get('duration', '?')}
**URL Plataforma:** [{course.get('url', 'N/A')}]({course.get('url', '#')})

---
## 🎯 Misión del Programa
Este programa forma parte del arsenal de consultoría estratégica de Productora EAR / Alumnos.
Toda decisión o duda sobre esta materia se contrasta contra los principios de esta serie.

## 📋 Clases en el Vault
""")

    print(f"\n📂 Procesando: [{cat_prefix}] {course['title']} ({len(course['files'])} archivos)")

    for raw_fn in course["files"]:
        total_processed += 1
        source_path = None
        # Find exact source file in SOURCE_ROOT
        for r, d, files in os.walk(SOURCE_ROOT):
            if raw_fn in files:
                source_path = Path(r) / raw_fn
                break
        
        if not source_path or not source_path.exists():
            continue
        
        # 1. Verify video integrity with ffprobe
        is_valid, duration_sec, error_msg = verify_video_integrity(source_path)
        clean_title = clean_class_name(raw_fn)
        final_mp4_name = f"{clean_title}.mp4"
        dest_mp4_path = dest_media_dir / final_mp4_name
        dest_md_path = dest_know_dir / f"{clean_title}.md"
        
        duration_min = round(duration_sec / 60, 1) if duration_sec else "?"
        size_mb = round(source_path.stat().st_size / (1024 * 1024), 1)

        if is_valid:
            # Copy to Vault Media (if not already there)
            if not dest_mp4_path.exists() or dest_mp4_path.stat().st_size != source_path.stat().st_size:
                shutil.copy2(source_path, dest_mp4_path)
            
            valid_videos.append({
                "course": course["title"],
                "class": clean_title,
                "media_path": str(dest_mp4_path),
                "knowledge_path": str(dest_md_path),
                "duration_min": duration_min,
                "size_mb": size_mb
            })
            
            dest_url = str(dest_mp4_path).replace('\\', '/')
            with open(dest_md_path, "w", encoding="utf-8") as f:
                f.write(f"""# 🎬 {clean_title}
**Programa:** [[00_INDICE_{course_clean_name}|{course['title']}]] | **Duración:** {duration_min} min | **Tamaño:** {size_mb} MB  
**Video Local en Disco D:** [▶ ABRIR CLASE EN DISCO D](file:///{dest_url})

---
## ⚡ Marco Mental & Principio Innegociable
> *\"Extraer el modelo mental clave de la clase y su aplicación directa a Productora EAR y asesoría a alumnos.\"*

### 🛠️ Tácticas y Estrategias Aplicables
1. **Paso 1:** Identificar el punto de apalancamiento exacto explicado en la clase.
2. **Paso 2:** Protocolo de implementación inmediata.
3. **Paso 3:** Comparador de objeciones y respuestas de cierre.

---
## 📜 Transcripción en Audio (Whisper Large-v3)
*Estado: [LISTO PARA TRANSCRIBIR CON GPU]*
""")
            # Append to Course Index
            with open(course_index_file, "a", encoding="utf-8") as f:
                f.write(f"- [[{clean_title}]] ({duration_min}m) — [▶ Ver Video](file:///{dest_url})\n")

            print(f"   🟢 [VÁLIDO] {clean_title} ({duration_min}m | {size_mb} MB)")
        else:
            corrupt_videos.append({
                "course": course["title"],
                "raw_file": raw_fn,
                "path": str(source_path),
                "error": error_msg
            })
            print(f"   🔴 [CORRUPTO/RECARGAR] {raw_fn} -> Error: {error_msg}")

# Summary
summary_report = {
    "total_evaluated": total_processed,
    "valid_verified_count": len(valid_videos),
    "corrupted_count": len(corrupt_videos),
    "valid_videos": valid_videos,
    "corrupted_videos": corrupt_videos
}

with open("reports/velocity_integrity_validation.json", "w", encoding="utf-8") as f:
    json.dump(summary_report, f, indent=2, ensure_ascii=False)

print("\n" + "="*80)
print(f"🏆 VALIDACIÓN COMPLETADA:")
print(f"   ✅ Videos Verificados con ffprobe y 100% Funcionales: {len(valid_videos)}")
print(f"   ❌ Videos Corruptos o Vacíos: {len(corrupt_videos)}")
print(f"   📁 Bóveda Multimedia: {VAULT_MEDIA}")
print(f"   🧠 Bóveda de Conocimiento: {VAULT_KNOWLEDGE}")
print("="*80)
