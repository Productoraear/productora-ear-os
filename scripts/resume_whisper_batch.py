import os
import glob
import string
import whisper
from datetime import datetime

print("🎙️ INICIANDO REANUDACIÓN AUTOMÁTICA DE TRANSCRIPCIONES PENDIENTES...")

# 1. Rutas de almacenamiento
output_dir = r"H:\incubadora despegue\TRANSCRIPCIONES_WHISPER"
os.makedirs(output_dir, exist_ok=True)

# 2. Obtener lista de audios/vídeos procesados previamente
existing_transcripts = set()
for txt_file in glob.glob(os.path.join(output_dir, "*.txt")):
    base_name = os.path.splitext(os.path.basename(txt_file))[0]
    existing_transcripts.add(base_name.lower())

print(f"📊 Transcripciones completadas encontradas en archivo: {len(existing_transcripts)}")

# 3. Detectar todos los archivos multimedia en los discos
media_extensions = {".mp4", ".m4a", ".mp3", ".wav", ".mkv", ".mov", ".aac"}
skip_folders = {"windows", "$recycle.bin", "program files", "node_modules", ".git", "appdata"}

drives = [f"{d}:\\" for d in string.ascii_uppercase if os.path.exists(f"{d}:\\")]
pending_files = []

print("🔎 Buscando vídeos y audios pendientes de transcripción...")
for drive in drives:
    for root, dirs, files in os.walk(drive):
        dirs[:] = [d for d in dirs if d.lower() not in skip_folders]
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in media_extensions:
                file_stem = os.path.splitext(file)[0].lower()
                # Si el archivo no tiene su transcripción limpia correspondiente, añadir a la cola
                if not any(file_stem in t for t in existing_transcripts):
                    full_path = os.path.join(root, file)
                    pending_files.append(full_path)

print(f"📌 Se han localizado {len(pending_files)} archivos multimedia pendientes de procesar.")

if pending_files:
    print("🚀 Cargando modelo Whisper (Small/Medium)...")
    model = whisper.load_model("small")

    for idx, media_path in enumerate(pending_files, 1):
        file_name = os.path.basename(media_path)
        out_txt_name = f"{os.path.splitext(file_name)[0]}.txt"
        out_txt_path = os.path.join(output_dir, out_txt_name)

        print(f"\n⏳ [{idx}/{len(pending_files)}] Transcribiendo: {file_name}...")
        try:
            result = model.transcribe(media_path, language="es")
            with open(out_txt_path, "w", encoding="utf-8") as tf:
                tf.write(result["text"])
            print(f"✅ Transcripción guardada: {out_txt_name}")
        except Exception as e:
            print(f"⚠️ Error procesando {file_name}: {e}")
else:
    print("✅ Todos los vídeos y audios detectados en el sistema cuentan con su transcripción completada.")
