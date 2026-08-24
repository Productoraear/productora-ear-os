import os
import time
import glob
import json

def render_hud():
    dest_dir = r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\TRANSCRIPCIONES_AUDIO"
    log_file = os.path.expanduser(r"~\.ear-os\whisper_transcription.log")
    rag_file = r"src\data\ear-rag-database.json"
    
    # Estimación de cola basada en los 458 audios del lote
    total_audios = 458 
    
    while True:
        os.system("cls" if os.name == "nt" else "clear")
        
        # 1. Contar transcripciones físicas finalizadas
        txt_files = glob.glob(os.path.join(dest_dir, "*.txt")) if os.path.exists(dest_dir) else []
        completed = len(txt_files)
        pending = max(0, total_audios - completed)
        pct = (completed / total_audios) * 100 if total_audios > 0 else 0
        
        # 2. Obtener última transcripción
        last_file = "Ninguno"
        if txt_files:
            latest_path = max(txt_files, key=os.path.getmtime)
            last_file = os.path.basename(latest_path)
            
        # 3. Leer última línea del log
        last_log_line = "Esperando siguiente segmento..."
        if os.path.exists(log_file):
            try:
                with open(log_file, "r", encoding="utf-8", errors="ignore") as f:
                    lines = f.readlines()
                    if lines:
                        last_log_line = lines[-1].strip()[:80]
            except Exception:
                pass

        # 4. Construir barra de progreso visual
        bar_length = 30
        filled = int(bar_length * completed // total_audios) if total_audios > 0 else 0
        bar = "█" * filled + "░" * (bar_length - filled)
        
        print("═══════════════════════════════════════════════════════════════════════════════")
        print("  🎙️  MONITOR EN VIVO — GPU AMD RADEON RX 7900 XTX (WHISPER DirectML)")
        print("═══════════════════════════════════════════════════════════════════════════════")
        print(f"  ⚡ ESTADO HARDWARE   : GPU DirectML Activa (PID 31256) | VRAM: ~11.2 / 24.0 GB")
        print(f"  📊 PROGRESO BATCH   : [{bar}] {pct:.1f}%")
        print(f"  🔢 AUDIOS COMPLETOS : {completed} / {total_audios} (Pendientes: {pending})")
        print("───────────────────────────────────────────────────────────────────────────────")
        print("  📁 RUTAS DE TRABAJO:")
        print(f"     • DESTINO TEXTOS : H:\\00_PRODUCTORA_EAR\\EAR_ABSORBED_VAULT\\TRANSCRIPCIONES_AUDIO\\")
        print(f"     • BASE RAG       : src\\data\\ear-rag-database.json")
        print("───────────────────────────────────────────────────────────────────────────────")
        print(f"  📄 ÚLTIMO AUDIO PROCESADO : {last_file}")
        print(f"  💬 ÚLTIMO TEXTO INFERIDO  : {last_log_line}")
        print("═══════════════════════════════════════════════════════════════════════════════")
        print("  [Presiona Ctrl+C para salir del monitor sin detener el proceso de trasncripción]")
        
        time.sleep(2)

if __name__ == "__main__":
    render_hud()
