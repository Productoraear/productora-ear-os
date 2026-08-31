import json
import os
import sys
from datetime import datetime

def export_chat_to_markdown():
    transcript_path = r"C:\Users\M2-W10\.gemini\antigravity-ide\brain\39f09488-62e5-4276-87d0-a8690220e2b7\.system_generated\logs\transcript_full.jsonl"
    
    if not os.path.exists(transcript_path):
        print(f"Transcript full not found at {transcript_path}, falling back to transcript.jsonl")
        transcript_path = r"C:\Users\M2-W10\.gemini\antigravity-ide\brain\39f09488-62e5-4276-87d0-a8690220e2b7\.system_generated\logs\transcript.jsonl"

    if not os.path.exists(transcript_path):
        print("No transcript file found.")
        return

    output_doc_path = os.path.join(process_cwd := os.getcwd(), "docs", "EAR_OS_MASTER_FULL_CHAT_CHRONICLE_SOVEREIGN.md")
    output_root_path = r"H:\EAR_OS_MASTER_FULL_CHAT_CHRONICLE_SOVEREIGN.md"

    os.makedirs(os.path.dirname(output_doc_path), exist_ok=True)

    print(f"Reading from: {transcript_path}")
    print(f"Target 1: {output_doc_path}")
    print(f"Target 2: {output_root_path}")

    total_lines = 0
    exported_steps = 0

    header = f"""# 🏛️ CRÓNICA MAESTRA INTEGRAL DE SESIÓN: EAR OS V2 (SOVEREIGN FULL CHAT CHRONICLE)

```
════════════════════════════════════════════════════════════════════════════════════════
SISTEMA: EAR OS V2 — ANTIGRAVITY OMEGA v4.1
FECHA DE EXPORTACIÓN: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
CONVERSATION ID: 39f09488-62e5-4276-87d0-a8690220e2b7
NATURALEZA: EXPORTACIÓN ÍNTEGRA SIN PÉRDIDAS (RAW UNTRUNCATED CHAT CHRONICLE)
PROTOCOLO: ARCHIVISTA DIGITAL PURISTA (ZERO-TOKEN MEMORY SSOT)
════════════════════════════════════════════════════════════════════════════════════════
```

---

## 📑 ÍNDICE CRONOLÓGICO DE LA INTERACCIÓN

"""

    sections = []

    with open(transcript_path, "r", encoding="utf-8", errors="replace") as f:
        for line in f:
            total_lines += 1
            line = line.strip()
            if not line:
                continue

            try:
                data = json.loads(line)
            except Exception:
                continue

            step_idx = data.get("step_index", total_lines)
            source = data.get("source", "UNKNOWN")
            step_type = data.get("type", "UNKNOWN")
            timestamp = data.get("timestamp") or datetime.now().isoformat()
            content = data.get("content") or ""
            tool_calls = data.get("tool_calls") or []

            # Format entry
            if source in ["USER_EXPLICIT", "USER"] or step_type == "USER_INPUT":
                sec = f"\n### 👤 [PASO {step_idx}] MENSAJE DEL USUARIO (CEO) — `{timestamp}`\n\n"
                sec += f"{content}\n\n---\n"
                sections.append(sec)
                exported_steps += 1
            elif source in ["MODEL", "PLANNER"] or step_type == "PLANNER_RESPONSE":
                sec = f"\n### 🏛️ [PASO {step_idx}] RESPUESTA DE ANTIGRAVITY ORCHESTRATOR — `{timestamp}`\n\n"
                if content:
                    sec += f"{content}\n\n"
                
                if tool_calls:
                    sec += "#### 🛠️ ACCIONES Y HERRAMIENTAS EJECUTADAS:\n\n"
                    for tc in tool_calls:
                        t_name = tc.get("name") or tc.get("toolName") or "Tool"
                        t_args = tc.get("arguments") or tc.get("input") or {}
                        sec += f"```json\n// Tool: {t_name}\n{json.dumps(t_args, indent=2, ensure_ascii=False)}\n```\n\n"
                
                sec += "---\n"
                sections.append(sec)
                exported_steps += 1

    full_md = header + "".join(sections)

    with open(output_doc_path, "w", encoding="utf-8") as f1:
        f1.write(full_md)

    try:
        with open(output_root_path, "w", encoding="utf-8") as f2:
            f2.write(full_md)
    except Exception as e:
        print(f"Could not write to root H:\\: {e}")

    file_size_mb = os.path.getsize(output_doc_path) / (1024 * 1024)
    print(f"[OK] Exportacion completada con exito:")
    print(f" - Pasos cronologicos procesados: {exported_steps}")
    print(f" - Tamano del archivo Markdown: {file_size_mb:.2f} MB")

if __name__ == "__main__":
    export_chat_to_markdown()
