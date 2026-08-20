import json
import os

# Rutas potenciales del corpus
possible_inputs = [
    r"H:\EAR_OS_V2\_auditoria\CORPUS_TEXTO_BODAS_HTML.json",
    r"C:\EAR_OS_V2\_auditoria\CORPUS_TEXTO_BODAS_HTML.json",
    r"..\ _auditoria\CORPUS_TEXTO_BODAS_HTML.json"
]

corpus_path = None
for p in possible_inputs:
    if os.path.exists(p):
        corpus_path = p
        break

output_mariachis = r"src\data\mariachis_catalog_clean.json"
os.makedirs(os.path.dirname(output_mariachis), exist_ok=True)

if corpus_path:
    print(f"📖 Leyendo corpus desde: {corpus_path}")
    with open(corpus_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    filtered = []
    for item in data:
        text_block = " ".join(item.get("headings", []) + item.get("text", [])).lower()
        if any(term in text_block for term in ["mariachi", "ranchera", "música", "musica", "grupo", "banda", "actuacion", "actuación"]):
            filtered.append(item)

    with open(output_mariachis, "w", encoding="utf-8") as f_out:
        json.dump(filtered, f_out, ensure_ascii=False, indent=2)

    print(f"✅ Catálogo filtrado con éxito: {len(filtered)} activos musicales encontrados.")
else:
    print("⚠️ No se encontró el archivo CORPUS_TEXTO_BODAS_HTML.json. Verificando rutas...")
