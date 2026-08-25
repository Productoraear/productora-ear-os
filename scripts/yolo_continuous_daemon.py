import os
import sys
import time
import subprocess
import glob
import json
import torch
import torch_directml
from transformers import pipeline

sys.stdout.reconfigure(encoding='utf-8')

DEST_DIR = r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\TRANSCRIPCIONES_AUDIO"
RAG_FILE = r"src\data\ear-rag-database.json"
TEMP_WAV = "temp_yolo_process.wav"
os.makedirs(DEST_DIR, exist_ok=True)

def convert_to_clean_wav(input_path):
    if os.path.exists(TEMP_WAV):
        try: os.remove(TEMP_WAV)
        except: pass
    cmd = [
        "ffmpeg", "-y", "-err_detect", "ignore_err",
        "-i", input_path, "-vn", "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le",
        TEMP_WAV
    ]
    try:
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=120)
        return res.returncode == 0 and os.path.exists(TEMP_WAV) and os.path.getsize(TEMP_WAV) > 2000
    except:
        return False

print("🚀 INICIANDO DEMONIO CONTINUO BUCLE YOLO — TRANSCRIPCIÓN + AUTO-RAG INJECT")
dml_device = torch_directml.device()

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

while True:
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

    for file_path in target_files:
        file_name = os.path.basename(file_path)
        txt_name = f"{file_name}_transcription.txt"
        txt_path = os.path.join(DEST_DIR, txt_name)

        if os.path.exists(txt_path):
            continue

        if convert_to_clean_wav(file_path):
            try:
                result = asr_pipe(TEMP_WAV)
                text = result.get("text", "")
                words = len(text.split())
                if words > 5:
                    with open(txt_path, "w", encoding="utf-8") as tf:
                        tf.write(text)
                    print(f"   ✅ Transcrito e inyectado ({words} palabras).")
                else:
                    with open(txt_path, "w", encoding="utf-8") as tf:
                        tf.write("[OMITIDO: Contenido de audio insuficiente]")
                    print(f"   ⚠️ OMITIDO: Contenido insuficiente.")
            except Exception as e:
                print(f"   ⚠️ Error omitido: {str(e)[:60]}")
            finally:
                if os.path.exists(TEMP_WAV):
                    try: os.remove(TEMP_WAV)
                    except: pass
        else:
            with open(txt_path, "w", encoding="utf-8") as tf:
                tf.write("[OMITIDO: Archivo de vídeo/audio corrupto o sin pista válida]")
            print(f"   ⚠️ MARCADO: Archivo corrupto sin audio válido -> Omitido permanentemente.")
    
    time.sleep(10)
