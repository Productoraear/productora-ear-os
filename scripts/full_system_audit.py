import os
import json
import torch
import torch_directml
import onnxruntime as ort

print("═════════════════════════════════════════════════════════════════")
print("  🔍 AUDITORÍA GLOBAL DE SISTEMA S-CLASS — ANTIGRAVITY DIAGNOSTIC")
print("═════════════════════════════════════════════════════════════════")

# 1. HARDWARE & GPU DIRECTML
print("\n[1] HARDWARE & VRAM:")
try:
    providers = ort.get_available_providers()
    dml_ok = "DmlExecutionProvider" in providers
    gpu_name = torch_directml.device_name(0)
    print(f"  ✅ GPU AMD DirectML: {gpu_name}")
    print(f"  ✅ Proveedor ONNX DirectML: {'OK' if dml_ok else 'FALLO'}")
except Exception as e:
    print(f"  ❌ Error Hardware: {e}")

# 2. DOCUMENTOS MAESTROS EN H:\
print("\n[2] DOCUMENTOS MAESTROS (H:\\00_PRODUCTORA_EAR\\DOCUMENTOS_MAESTROS):")
master_dir = r"H:\00_PRODUCTORA_EAR\DOCUMENTOS_MAESTROS"
masters = [
    "MASTER_MARKETING_Y_EMBUDOS.md", 
    "MASTER_VIMUME_METODOLOGIA.md", 
    "MASTER_EAR_OS_SISTEMA.md", 
    "MASTER_PRODUCCION_Y_RIDERS.md", 
    "MASTER_LEGAL_Y_ROYALTIES.md"
]
for m in masters:
    path = os.path.join(master_dir, m)
    status = "✅ OK" if os.path.exists(path) else "❌ FALTA"
    print(f"  • {m}: {status}")

# 3. BASE RAG & LICITACIONES B2G
print("\n[3] BASE COGNITIVA RAG & B2G HUNTER:")
rag_path = r"src\data\ear-rag-database.json"
b2g_path = r"src\data\b2g_opportunities_database.json"
if os.path.exists(rag_path):
    with open(rag_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        print(f"  ✅ Nodos RAG Activos: {len(data)}")
else:
    print("  ❌ Base RAG no encontrada")

if os.path.exists(b2g_path):
    with open(b2g_path, "r", encoding="utf-8") as f:
        b2g = json.load(f)
        print(f"  ✅ Licitaciones LCSP Indexadas: {len(b2g)}")

# 4. TRANSCRIPCIONES EN BÓVEDA ZTM
print("\n[4] BÓVEDA DE TRANSCRIPCIONES ZTM:")
trans_dir = r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\TRANSCRIPCIONES_AUDIO"
if os.path.exists(trans_dir):
    txts = [f for f in os.listdir(trans_dir) if f.endswith(".txt")]
    print(f"  ✅ Archivos de texto transcritos: {len(txts)}")

# 5. ESTRUCTURA FAMILIAR EN D:\
print("\n[5] BÓVEDA FAMILIAR EN D:\\PERSONAL_FAMILIA:")
fam_dir = r"D:\PERSONAL_FAMILIA"
fam_folders = ["01_EDWIN", "02_ADRIANA", "03_LEIRE", "04_HOGAR_Y_VEHICULOS"]
for fld in fam_folders:
    p = os.path.join(fam_dir, fld)
    print(f"  • {fld}: {'✅ Creada' if os.path.exists(p) else '❌ Falta'}")

print("\n═════════════════════════════════════════════════════════════════")
print("  🎯 AUDITORÍA FINALIZADA")
print("═════════════════════════════════════════════════════════════════")
