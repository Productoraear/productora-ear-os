import os
import glob
import json

trans_dir = r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\TRANSCRIPCIONES_AUDIO"
rag_file = r"src\data\ear-rag-database.json"

files = glob.glob(os.path.join(trans_dir, "*.txt"))
total_files = len(files)
total_words = 0
total_bytes = 0

for f in files:
    total_bytes += os.path.getsize(f)
    try:
        with open(f, "r", encoding="utf-8", errors="ignore") as tf:
            content = tf.read()
            total_words += len(content.split())
    except Exception:
        pass

rag_nodes = 0
if os.path.exists(rag_file):
    with open(rag_file, "r", encoding="utf-8") as rf:
        data = json.load(rf)
        rag_nodes = len(data)

print("═════════════════════════════════════════════════════════════════")
print("  📊 AUDITORÍA FORENSE — BÓVEDA DE TRANSCRIPCIONES Y RAG")
print("═════════════════════════════════════════════════════════════════")
print(f"  • Carpeta de Destino           : {trans_dir}")
print(f"  • Archivos `.txt` generados     : {total_files} transcripciones")
print(f"  • Palabras totales sintetizadas : {total_words:,} palabras")
print(f"  • Volumen de conocimiento       : {total_bytes / (1024*1024):.2f} MB")
print(f"  • Nodos en Bóveda Cognitiva RAG : {rag_nodes:,}")
print("═════════════════════════════════════════════════════════════════")
