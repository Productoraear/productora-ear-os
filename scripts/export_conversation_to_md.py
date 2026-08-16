import json
import os
import sys

transcript_path = r"C:\Users\M2-W10\.gemini\antigravity-ide\brain\066359b6-dd26-4c3d-b49b-ca96c39f0c12\.system_generated\logs\transcript_full.jsonl"
output_md_path = r"C:\EAR_OS_V2\docs\release\CONVERSATION_EXPORT_BACKUP.md"

def export_transcript():
    if not os.path.exists(transcript_path):
        print(f"File not found: {transcript_path}")
        return

    os.makedirs(os.path.dirname(output_md_path), exist_ok=True)

    with open(transcript_path, 'r', encoding='utf-8') as f_in, open(output_md_path, 'w', encoding='utf-8') as f_out:
        f_out.write("# 🏛️ EXPORTACIÓN INTEGRAL DE CONVERSACIÓN // ANTIGRAVITY EAR OS\n\n")
        f_out.write(f"- **Conversation ID:** `066359b6-dd26-4c3d-b49b-ca96c39f0c12`\n")
        f_out.write(f"- **Generado:** 2026-08-16\n")
        f_out.write(f"- **SSOT:** EAR_OS_STRATEGIC_ORCHESTRATOR_PLAN.md\n\n---\n\n")

        for line in f_in:
            if not line.strip():
                continue
            try:
                entry = json.loads(line)
                source = entry.get('source', '')
                step_type = entry.get('type', '')
                content = entry.get('content', '')

                if step_type == 'USER_INPUT' or source == 'USER_EXPLICIT':
                    f_out.write(f"\n## 👤 USUARIO\n\n{content}\n\n---\n")
                elif step_type == 'PLANNER_RESPONSE' or source == 'MODEL':
                    if content:
                        f_out.write(f"\n## 🤖 ANTIGRAVITY OMEGA\n\n{content}\n\n---\n")
            except Exception as e:
                continue

    print(f"Export completed: {output_md_path} ({os.path.getsize(output_md_path)} bytes)")

if __name__ == "__main__":
    export_transcript()
