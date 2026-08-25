import os
import sys
import subprocess
import torch
import torch_directml
from transformers import pipeline

print("═════════════════════════════════════════════════════════════════")
print("  🛠️  TRANSCRIPCIÓN COMPLETA GPU DIRECTML (CHUNK SLIDING WINDOW)")
print("═════════════════════════════════════════════════════════════════")

sys.stdout.reconfigure(encoding='utf-8')

DEST_DIR = r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\TRANSCRIPCIONES_AUDIO"
TEMP_WAV = "temp_process.wav"
os.makedirs(DEST_DIR, exist_ok=True)

def convert_to_clean_wav(input_path):
    if os.path.exists(TEMP_WAV):
        try: os.remove(TEMP_WAV)
        except: pass
        
    cmd = [
        "ffmpeg", "-y", "-err_detect", "ignore_err",
        "-i", input_path,
        "-vn", "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le",
        TEMP_WAV
    ]
    
    try:
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=120)
        if res.returncode == 0 and os.path.exists(TEMP_WAV) and os.path.getsize(TEMP_WAV) > 2000:
            return True
    except Exception:
        pass
    return False

dml_device = torch_directml.device()
print(f"[1] Dispositivo DirectML asignado: {torch_directml.device_name(0)}")

print("[2] Cargando Pipeline de Reconocimiento con Ventanas de 30s...")
asr_pipe = pipeline(
    "automatic-speech-recognition",
    model="openai/whisper-tiny",
    torch_dtype=torch.float32,
    device=dml_device,
    chunk_length_s=30,
    generate_kwargs={"language": "spanish", "task": "transcribe"}
)

PROTECTED_L = [r"L:\A IMPORTAR ORIGINALES PARA"]
def is_protected(path):
    p_up = os.path.normpath(path).upper()
    return any(p_up.startswith(os.path.normpath(prot).upper()) for prot in PROTECTED_L)

SEARCH_ROOTS = [
    r"H:\EAR_OS_V2\public\media",
    r"H:\EAR_OS_V2\VERTICAL_ARTISTAS",
    r"H:\EAR_OS_V2\VERTICAL_INCUBADORA_VAMPIRIZADA"
]

target_files = []
for s_root in SEARCH_ROOTS:
    if not os.path.exists(s_root): continue
    for root, dirs, files in os.walk(s_root):
        if is_protected(root): continue
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in [".mp3", ".wav", ".mp4", ".ogg", ".flac", ".m4a", ".mov", ".mkv"]:
                fp = os.path.join(root, f)
                if not is_protected(fp):
                    target_files.append(fp)

print(f"[3] Archivos detectados en cola: {len(target_files)}")

processed = 0
skipped = 0

for idx, file_path in enumerate(target_files, 1):
    file_name = os.path.basename(file_path)
    txt_name = f"{file_name}_transcription.txt"
    txt_path = os.path.join(DEST_DIR, txt_name)

    print(f"[{idx}/{len(target_files)}] Transcribiendo audio completo: {file_name}...")
    
    if not convert_to_clean_wav(file_path):
        print(f"   ⚠️ OMITIDO: Archivo corrupto o sin audio válido.")
        skipped += 1
        continue
        
    try:
        result = asr_pipe(TEMP_WAV)
        transcription = result["text"]
        words = len(transcription.split())
        
        if words > 5:
            with open(txt_path, "w", encoding="utf-8") as tf:
                tf.write(transcription)
            processed += 1
            print(f"   ✅ OK ({words} palabras transcritas) -> {txt_name}")
        else:
            print(f"   ⚠️ OMITIDO: Contenido insuficiente.")

    except Exception as e:
        print(f"   ❌ ERROR GPU/Memoria: {str(e)[:100]}")
    finally:
        if os.path.exists(TEMP_WAV):
            try: os.remove(TEMP_WAV)
            except: pass

print("═════════════════════════════════════════════════════════════════")
print(f"  🎯 PROCESO COMPLETO: {processed} OK | {skipped} omitidos")
print("═════════════════════════════════════════════════════════════════")
