import json
import os
import sys
import time
import whisper

MANIFEST_PATH = r"H:\incubadora despegue\TRANSCRIPCIONES_WHISPER\global_tricatedra_manifest_clean.json"
LOG_PATH = r"H:\incubadora despegue\TRANSCRIPCIONES_WHISPER\transcription_errors.log"

def main():
    print("🌙 INICIANDO MOTOR NOCTURNO PYTHON (WHISPER NATIVO)...")
    
    if not os.path.exists(MANIFEST_PATH):
        print(f"❌ No se encontró el manifiesto en: {MANIFEST_PATH}")
        return

    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    total = len(manifest)
    print(f"📋 Cargados {total} archivos académicos del manifiesto.")
    print("⌛ Cargando modelo Whisper (medium) en memoria...")
    
    try:
        model = whisper.load_model("medium")
    except Exception as e:
        print(f"⚠️ Error cargando modelo medium, intentando modelo base: {e}")
        model = whisper.load_model("base")

    completed = 0
    skipped = 0
    failed = 0
    start_time = time.time()

    for idx, item in enumerate(manifest, 1):
        file_path = item["fullPath"]
        target_dir = item["targetDir"]
        base_name = os.path.splitext(item["name"])[0]
        
        txt_output = os.path.join(target_dir, f"{base_name}.txt")

        # Idempotencia: Saltar si ya fue transcrito
        if os.path.exists(txt_output):
            skipped += 1
            continue

        print(f"\n🎙️ [{idx}/{total}] Transcribiendo [{item['category']}]: {item['name']}")
        
        if not os.path.exists(file_path):
            print(f"⚠️ Archivo no encontrado en disco: {file_path}")
            failed += 1
            continue

        try:
            os.makedirs(target_dir, exist_ok=True)
            result = model.transcribe(file_path, language="es")
            
            with open(txt_output, "w", encoding="utf-8") as out_f:
                out_f.write(result["text"])
                
            print(f"✅ Transcrito con éxito -> {base_name}.txt")
            completed += 1
        except Exception as e:
            print(f"⚠️ Error procesando {item['name']}: {e}")
            failed += 1
            with open(LOG_PATH, "a", encoding="utf-8") as log_f:
                log_f.write(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {file_path} -> {str(e)}\n")

    elapsed_hours = (time.time() - start_time) / 3600
    print("\n==================================================")
    print(f"✅ LOTE NOCTURNO COMPLETADO ({elapsed_hours:.2f} horas)")
    print(f"📄 Transcripciones creadas: {completed}")
    print(f"⏭️ Omitidos (preexistentes): {skipped}")
    print(f"⚠️ Errores: {failed}")
    print("==================================================")

if __name__ == "__main__":
    main()
