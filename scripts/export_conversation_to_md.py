import json
import os
import sys
from datetime import datetime

transcript_path = r"C:\Users\M2-W10\.gemini\antigravity-ide\brain\066359b6-dd26-4c3d-b49b-ca96c39f0c12\.system_generated\logs\transcript_full.jsonl"
output_paths = [
    r"C:\EAR_OS_V2\docs\release\CONVERSATION_EXPORT_BACKUP.md",
    r"C:\EAR_OS_V2\docs\release\EAR_OS_SESSION_EXPORT_2026_08_17.md"
]

def export_transcript():
    if not os.path.exists(transcript_path):
        print(f"File not found: {transcript_path}")
        return

    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    for output_md_path in output_paths:
        os.makedirs(os.path.dirname(output_md_path), exist_ok=True)

        with open(transcript_path, 'r', encoding='utf-8') as f_in, open(output_md_path, 'w', encoding='utf-8') as f_out:
            f_out.write("# 🏛️ EXPORTACIÓN INTEGRAL DE SESIÓN // EAR OS V2 S-CLASS\n\n")
            f_out.write(f"- **Conversation ID:** `066359b6-dd26-4c3d-b49b-ca96c39f0c12`\n")
            f_out.write(f"- **Fecha de Exportación:** `{now_str}`\n")
            f_out.write(f"- **SSOT:** `EAR_OS_STRATEGIC_ORCHESTRATOR_PLAN.md`\n")
            f_out.write(f"- **Estado de Release:** `LISTO_PARA_PRODUCCION_MVP`\n\n")
            f_out.write("## 📌 ÍNDICE DE HITOS CLAVE EN ESTA SESIÓN\n")
            f_out.write("1. Activación del Embudo Paciente Cero (Edwin Agudelo) en `/cotizador?artista=edwin-agudelo` y WhatsApp pre-cargado (+34 693 693 048).\n")
            f_out.write("2. Radar B2G Multiescala (13.9k€ a 120k€+) con alertas en Telegram y Vercel Cron a las 09:00 CEST.\n")
            f_out.write("3. Cazador Fantasma V4.2 en `/admin/hunter` con selector de profundidad y motor dual resiliente.\n")
            f_out.write("4. Blindaje de seguridad Anthropic v2.1.0 (8/8 vectores sellados) y persistencia en `.clinerules`.\n")
            f_out.write("5. Consola Proveedor B2B `/dashboard/proveedor` y Micro-Lote 01 (100 fincas Madrid/Toledo).\n\n")
            f_out.write("---\n\n# 📜 REGISTRO CRONOLÓGICO COMPLETO\n\n")

            for line in f_in:
                if not line.strip():
                    continue
                try:
                    entry = json.loads(line)
                    source = entry.get('source', '')
                    step_type = entry.get('type', '')
                    content = entry.get('content', '')

                    if step_type == 'USER_INPUT' or source == 'USER_EXPLICIT':
                        if content and not content.startswith('{ CHECKPOINT'):
                            f_out.write(f"\n## 👤 USUARIO\n\n{content}\n\n---\n")
                    elif step_type == 'PLANNER_RESPONSE' or source == 'MODEL':
                        if content:
                            f_out.write(f"\n## 🤖 ANTIGRAVITY OMEGA\n\n{content}\n\n---\n")
                except Exception as e:
                    continue

        print(f"Export completed: {output_md_path} ({os.path.getsize(output_md_path)} bytes)")

if __name__ == "__main__":
    export_transcript()
