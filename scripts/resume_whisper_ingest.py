import os
import glob
import json

print("🎙️ REANUDANDO INDEXACIÓN DE TRANSCRIPCIONES WHISPER...")

whisper_dir = r"H:\incubadora despegue\TRANSCRIPCIONES_WHISPER"
if not os.path.exists(whisper_dir):
    whisper_dir = r"H:\EAR_OS_V2\EAR_OS_V2\scripts"

files = glob.glob(os.path.join(whisper_dir, "*.txt")) + glob.glob(os.path.join(whisper_dir, "*.json"))

print(f"📊 Transcripciones Whisper localizadas para ingesta: {len(files)}")
for f in files[:10]:
    fname = os.path.basename(f)
    size_kb = os.path.getsize(f) / 1024
    print(f"  • {fname} ({size_kb:.1f} KB)")

print("✅ Índice de transcripciones listo para acoplar al motor RAG.")
