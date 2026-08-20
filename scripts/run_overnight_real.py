import json
import os
import time
import whisper

MANIFEST_PATH = r"H:\incubadora despegue\TRANSCRIPCIONES_WHISPER\global_tricatedra_manifest_clean.json"
LOG_PATH = r"H:\incubadora despegue\TRANSCRIPCIONES_WHISPER\transcription_errors.log"

def is_placeholder(file_path):
    """Devuelve True si el archivo de texto es solo un borrador/marcador inicial."""
    if not os.path.exists(file_path):
        return True
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read(300)
            return "[ACTIVO MULTIMEDIA INDEXADO]" in content
    except Exception:
        return True

def main():
    print("🌙 INICIANDO MOTOR DE TRANSCRIPCIÓN PROFUNDA NOCTURNA (WHISPER MEDIUM)...")
    
    if not os.path.exists(MANIFEST_PATH):
        print(f"❌ No se encontró el manifiesto en: {MANIFEST_PATH}")
        return

    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    total = len(manifest)
    print(f"📋 Carga de {total} activos académicos lista.")
    print("⌛ Cargando modelo Whisper (medium) en memoria GPU/RAM...")
    
    model = whisper.load_model("medium")
    print("✅ Modelo medium cargado con éxito.")

    completed = 0
    skipped = 0
    failed = 0
    start_time = time.time()

    for idx, item in enumerate(manifest, 1):
        file_path = item["fullPath"]
        target_dir = item["targetDir"]
        base_name = os.path.splitext(item["name"])[0]
        
        txt_output = os.path.join(target_dir, f"{base_name}.txt")

        # Solo omitir si el archivo .txt ya existe Y NO ES un borrador marcador
        if os.path.exists(txt_output) and not is_placeholder(txt_output):
            skipped += 1
            continue

        if not os.path.exists(file_path):
            failed += 1
            continue

        print(f"\n🎙️ [{idx}/{total}] Transcribiendo audio [{item['category']}]: {item['name']}")
        
        try:
            os.makedirs(target_dir, exist_ok=True)
            result = model.transcribe(file_path, language="es")
            
            with open(txt_output, "w", encoding="utf-8") as out_f:
                out_f.write(result["text"])
                
            print(f"✅ Transcripción real guardada -> {base_name}.txt")
            completed += 1
        except Exception as e:
            print(f"⚠️ Error al procesar {item['name']}: {e}")
            failed += 1
            with open(LOG_PATH, "a", encoding="utf-8") as log_f:
                log_f.write(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {file_path} -> {str(e)}\n")

    elapsed_hours = (time.time() - start_time) / 3600
    print("\n==================================================")
    print(f"✅ TRANSCRIPCIÓN NOCTURNA FINALIZADA ({elapsed_hours:.2f} horas)")
    print(f"📄 Archivos transcritos de voz a texto: {completed}")
    print(f"⏭️ Omitidos (transcripciones completas previas): {skipped}")
    print(f"⚠️ Fallos registrados: {failed}")
    print("==================================================")

if __name__ == "__main__":
    main()
