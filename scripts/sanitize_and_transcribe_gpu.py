import os
import sys

# Ensure UTF-8 stdout on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='ignore')

import subprocess
import glob
import json
import time
import torch
import torch_directml
from transformers import WhisperProcessor, WhisperForConditionalGeneration
import soundfile as sf

print("═════════════════════════════════════════════════════════════════")
print("  🛠️ TRANSCRIPCIÓN ROBUSTA GPU DIRECTML (ESPAÑOL FORZADO)")
print("═════════════════════════════════════════════════════════════════")

DEST_DIR = r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\TRANSCRIPCIONES_AUDIO"
TEMP_WAV = "temp_process.wav"
os.makedirs(DEST_DIR, exist_ok=True)

def convert_to_clean_wav(input_path):
    if os.path.exists(TEMP_WAV):
        try:
            os.remove(TEMP_WAV)
        except:
            pass
    cmd = [
        "ffmpeg", "-y", "-err_detect", "ignore_err",
        "-i", input_path,
        "-vn", "-ac", "1", "-ar", "16000",
        "-c:a", "pcm_s16le",
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
print("[2] Cargando modelo Whisper con token de idioma 'spanish'...")
processor = WhisperProcessor.from_pretrained("openai/whisper-tiny")
model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-tiny").to(dml_device)

# Forzar decodificador en español
forced_decoder_ids = processor.get_decoder_prompt_ids(language="spanish", task="transcribe")

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
    if not os.path.exists(s_root):
        continue
    for root, dirs, files in os.walk(s_root):
        if is_protected(root):
            continue
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

    print(f"[{idx}/{len(target_files)}] Ingestando en español: {file_name}...")

    if not convert_to_clean_wav(file_path):
        print(f"  ⚠️ OMITIDO: Archivo corrupto o sin audio válido.")
        skipped += 1
        continue

    try:
        speech_array, sampling_rate = sf.read(TEMP_WAV)
        # Limitar tramos a 10 minutos para proteger VRAM
        max_samples = 10 * 60 * 16000
        if len(speech_array) > max_samples:
            speech_array = speech_array[:max_samples]

        inputs = processor(speech_array, sampling_rate=16000, return_tensors="pt")
        input_features = inputs.input_features.to(dml_device)

        with torch.no_grad():
            predicted_ids = model.generate(input_features, forced_decoder_ids=forced_decoder_ids)
            transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]

        if len(transcription.strip()) > 5:
            with open(txt_path, "w", encoding="utf-8") as tf:
                tf.write(transcription)
            processed += 1
            print(f"  ✅ OK ({len(transcription.split())} palabras) -> {txt_name}")
        else:
            print(f"  ⚠️ OMITIDO: Transcripción vacía.")
    except Exception as e:
        print(f"  ❌ ERROR GPU/Memoria: {str(e)[:100]}")
    finally:
        if os.path.exists(TEMP_WAV):
            try:
                os.remove(TEMP_WAV)
            except:
                pass

print("═════════════════════════════════════════════════════════════════")
print(f"  🎯 TRANSCRIPCIÓN ESPAÑOLA COMPLETADA: {processed} OK | {skipped} omitidos")
print("═════════════════════════════════════════════════════════════════")
