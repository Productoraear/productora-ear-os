import os
import json
from pathlib import Path

vault = Path(r"D:\EAR_VAULT")
trans_files = list(vault.rglob("*_transcription.json"))

print(f"Total archivos *_transcription.json encontrados: {len(trans_files)}")

valid_transcripts = 0
for tf in trans_files:
    try:
        txt = tf.read_text(encoding="utf-8", errors="ignore")
        if "{" in txt:
            # check if json
            data = json.loads(txt)
            # check if it has text/segments
            if isinstance(data, dict) and ("text" in data or "segments" in data or "transcription" in data):
                valid_transcripts += 1
                sample_text = data.get("text", "")[:100] or str(data)[:100]
                print(f"✓ {tf.name} -> {sample_text}...")
        elif len(txt) > 200 and not "<html" in txt.lower():
            valid_transcripts += 1
            print(f"✓ (raw text) {tf.name}")
    except Exception:
        pass

print(f"\nTotal transcripciones válidas encontradas: {valid_transcripts}")
