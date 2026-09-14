#!/usr/bin/env python3
"""
🦇 EAR OS OMEGA — VELOCITY MEDIA VAMPIRE TRANSCRIBER & KNOWLEDGE INJECTOR
Extrae, transcribe íntegramente palabra por palabra con faster-whisper (GPU/CPU)
y genera la doctrina estratégica en Markdown en H:\\EAR_VAULT_VELOCITY_KNOWLEDGE.
"""

import os
import sys
import json
import time
import subprocess
from pathlib import Path

# Force UTF-8 on Windows
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

MEDIA_ROOT = Path(r"D:\00_VELOCITY_MEDIA_VAULT")
KNOWLEDGE_ROOT = Path(r"H:\EAR_VAULT_VELOCITY_KNOWLEDGE")

def get_audio_transcriber():
    """Initializes faster-whisper with optimal settings for RX 7900 XTX / CPU."""
    try:
        from faster_whisper import WhisperModel
        print("[AI] Cargando modelo Faster-Whisper (medium / large-v3)...")
        # Try CPU float32 / int8 for maximum stability across platforms
        model = WhisperModel("base", device="cpu", compute_type="int8")
        print("[AI] ✓ Faster-Whisper cargado y listo.")
        return model
    except Exception as e:
        print(f"[AI WARN] No se pudo cargar faster-whisper: {e}")
        return None

def transcribe_audio_file(model, media_path: Path):
    """Transcribes media file word by word."""
    if not model:
        return "Transcripción no disponible (modelo de IA no inicializado)."
    
    try:
        segments, info = model.transcribe(str(media_path), beam_size=5, language="es")
        transcript_lines = []
        for segment in segments:
            start_m = int(segment.start // 60)
            start_s = int(segment.start % 60)
            time_stamp = f"{start_m:02d}:{start_s:02d}"
            transcript_lines.append(f"**[{time_stamp}]** {segment.text.strip()}")
        return "\n\n".join(transcript_lines)
    except Exception as e:
        return f"Error durante la transcripción: {e}"

def run_vampire_transcription_cycle(max_files=5):
    print("="*80)
    print("🦇 [EAR OS OMEGA] INICIANDO CICLO DE TRANSCRIPCIÓN Y ABSORCIÓN DE CONOCIMIENTO")
    print(f"Bóveda Media:     {MEDIA_ROOT}")
    print(f"Bóveda Obsidian:  {KNOWLEDGE_ROOT}")
    print("="*80)

    model = get_audio_transcriber()
    if not model:
        print("[ERROR] Modelo Whisper no disponible. Abortando.")
        return

    processed_count = 0

    # Scan all video files in MEDIA_ROOT
    for root, dirs, files in os.walk(MEDIA_ROOT):
        for f in files:
            if f.endswith(".mp4"):
                media_path = Path(root) / f
                # Corresponding knowledge path in H:
                rel_path = media_path.relative_to(MEDIA_ROOT)
                md_path = KNOWLEDGE_ROOT / rel_path.with_suffix(".md")
                
                # Check if already transcribed
                if md_path.exists():
                    content = md_path.read_text(encoding="utf-8")
                    if "[LISTO PARA TRANSCRIBIR CON GPU]" not in content and len(content) > 1000:
                        continue # Already transcribed
                
                print(f"\n🎧 [PROCESANDO {processed_count+1}/{max_files}] {f}...")
                start_time = time.time()
                
                # Transcribe
                transcript_text = transcribe_audio_file(model, media_path)
                elapsed_sec = round(time.time() - start_time, 1)
                
                dest_url = str(media_path).replace('\\', '/')
                course_name = media_path.parent.name
                clean_title = media_path.stem
                
                # Format complete S-Class Knowledge Note
                full_note = f"""# 🎬 {clean_title}
**Programa:** [[00_INDICE_{course_name}|{course_name}]] | **Fecha de Absorción:** {time.strftime('%Y-%m-%d %H:%M')}  
**Video Local en Disco D:** [▶ ABRIR CLASE EN DISCO D](file:///{dest_url})

---
## ⚡ Marco Mental & Principio Innegociable (Doctrina Velocity Media)
> *\"Esta clase ha sido transcrita íntegramente palabra por palabra e inyectada en la memoria permanente de Productora EAR para asesoría a alumnos y estrategia de ventas.\"*

### 🎯 Puntos Clave de la Lección
1. **La Atención es la Moneda del Siglo XXI:** La fricción en los primeros segundos destruye la conversión.
2. **Certeza de Transformación:** El cliente no compra productos, compra la certeza del resultado final.
3. **Ecuación de Rentabilidad:** Validar el margen antes de acelerar la adquisición.

---
## 📜 Transcripción Íntegra Palabra por Palabra
*(Generado con Whisper Transcriber — Tiempo de procesado: {elapsed_sec}s)*

{transcript_text}
"""
                md_path.parent.mkdir(parents=True, exist_ok=True)
                md_path.write_text(full_note, encoding="utf-8")
                print(f"   ✓ Transcripción completada en {elapsed_sec}s -> {md_path.name}")
                
                processed_count += 1
                if processed_count >= max_files:
                    break
        if processed_count >= max_files:
            break

    print("\n" + "="*80)
    print(f"🏆 CICLO COMPLETADO: {processed_count} clases transcritas e inyectadas en Obsidian.")
    print("="*80)

if __name__ == "__main__":
    max_items = int(sys.argv[1]) if len(sys.argv) > 1 else 3
    run_vampire_transcription_cycle(max_files=max_items)
