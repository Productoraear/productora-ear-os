import os
import sys
import shutil
from pathlib import Path

TARGET_DIR = Path(r"H:\incubadora despegue\TRANSCRIPCIONES_WHISPER")
TARGET_DIR.mkdir(parents=True, exist_ok=True)

SEARCH_ROOTS = [
    Path(r"C:\Users\M2-W10\Desktop"),
    Path(r"C:\Users\M2-W10\Documents"),
    Path(r"C:\Users\M2-W10\Downloads"),
    Path(r"H:\00_PRODUCTORA_EAR"),
    Path(r"H:\EAR_VAULT_XMIND_INBOX"),
    Path(r"H:\SANTUARIO_EAR"),
    Path(r"D:\USUARIO_DATOS"),
    Path(r"D:\OS AZUL"),
    Path(r"D:\EAR_VAULT")
]

print("[*] Buscando archivos whisper/transcripciones...")
found = 0

for root_dir in SEARCH_ROOTS:
    if not root_dir.exists():
        continue
    for root, dirs, files in os.walk(root_dir):
        # Exclude giant media caches
        dirs[:] = [d for d in dirs if d not in {"node_modules", ".git", "AppData", "$RECYCLE.BIN", "BRUTOS_VIDEO", "BRUTOS_AUDIO", "BRUTOS_FOTOS"}]
        for f in files:
            f_lower = f.lower()
            fp = Path(root) / f
            is_whisper = False
            
            # Check name
            if any(k in f_lower for k in ["whisper", "transcrip", "subtitul", "audio_txt", "entrevista", "llamada", "clase", "leccion", "modulo"]):
                if fp.suffix.lower() in [".txt", ".md", ".srt", ".vtt", ".json", ".docx"]:
                    is_whisper = True
            
            # Check content if small text file
            if not is_whisper and fp.suffix.lower() in [".txt", ".srt", ".vtt"] and fp.stat().st_size < 5 * 1024 * 1024:
                try:
                    with open(fp, "r", encoding="utf-8", errors="ignore") as tf:
                        head = tf.read(2048)
                        if "-->" in head or "[00:" in head or "WEBVTT" in head or "Amplify" in head or "oferta" in head:
                            is_whisper = True
                except Exception:
                    pass

            if is_whisper:
                dest = TARGET_DIR / f
                counter = 1
                while dest.exists() and dest.stat().st_size != fp.stat().st_size:
                    dest = TARGET_DIR / f"{fp.stem}_{counter}{fp.suffix}"
                    counter += 1
                try:
                    if not dest.exists():
                        shutil.copy2(fp, dest)
                        found += 1
                        print(f"[+] Whisper / Transcripción: {fp.name} ({round(fp.stat().st_size/1024, 2)} KB)")
                except Exception as e:
                    print(f"[!] Error: {e}")

print(f"[✅] Total nuevas transcripciones Whisper añadidas: {found}")
