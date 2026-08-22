import os
import whisper
import json

audio_path = r"D:\Migracion_C\M2-W10\Downloads\EAR_OS_V2_jubila_a_Bodas.m4a"
output_path = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\podcast_jubila_bodas_transcript.json"

print(f"Loading Whisper model...")
model = whisper.load_model("tiny")  # Fast model to get quick high-signal insights

print(f"Transcribing {audio_path}...")
result = model.transcribe(audio_path, language="es", fp16=False)

print(f"Transcription complete! Length: {len(result['text'])} chars")

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"Saved to {output_path}")
print("\n--- FIRST 1000 CHARACTERS ---")
print(result['text'][:1000])
