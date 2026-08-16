import os
from pathlib import Path

target_dir = Path(r"H:\incubadora despegue")
whisper_dir = target_dir / "TRANSCRIPCIONES_WHISPER"

files = sorted(list(whisper_dir.glob("*.*")), key=lambda p: p.name.lower())

lines = [
    "# 🎙️ ÍNDICE MAESTRO DE TRANSCRIPCIONES WHISPER (ORO COGNITIVO)",
    f"**Ubicación:** `{whisper_dir}`",
    f"**Total de Transcripciones Recuperadas:** {len(files)}",
    "",
    "---",
    "",
    "| N° | Archivo de Transcripción | Formato | Tamaño (KB) |",
    "|---|---|---|---|"
]

for i, f in enumerate(files, 1):
    size_kb = round(f.stat().st_size / 1024, 2)
    lines.append(f"| {i} | `{f.name}` | `{f.suffix.upper()}` | {size_kb} |")

with open(target_dir / "INDICE_WHISPER_MAESTRO.md", "w", encoding="utf-8") as out:
    out.write("\n".join(lines))

print(f"Indice creado con {len(files)} archivos.")
