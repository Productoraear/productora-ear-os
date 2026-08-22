# -*- coding: utf-8 -*-
import os
import json
import re

print("🚀 INICIANDO INGESTA MASIVA DE MAPAS MARKDOWN AL GRAFO RAG...")

search_root = r"H:\EAR_OS_V2"
base_dir = r"H:\EAR_OS_V2\EAR_OS_V2"
rag_path = os.path.join(base_dir, "src", "data", "ear-rag-database.json")

existing_rag = []
if os.path.exists(rag_path):
    try:
        with open(rag_path, "r", encoding="utf-8") as f:
            existing_rag = json.load(f)
            if not isinstance(existing_rag, list):
                existing_rag = []
    except Exception:
        existing_rag = []

existing_ids = {node.get("id") for node in existing_rag if isinstance(node, dict) and "id" in node}

md_nodes = []
processed_count = 0

for root, dirs, files in os.walk(search_root):
    dirs[:] = [d for d in dirs if d.lower() not in {"node_modules", ".git", ".next", "dist", "build", "coverage"}]
    for file in files:
        if file.lower().endswith(".md"):
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, search_root)
            
            clean_rel_path = re.sub(r'\W+', '-', rel_path).lower()
            node_id = f"md-node-{clean_rel_path}"
            
            if node_id in existing_ids:
                continue

            try:
                with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read().strip()

                if len(content) < 10:
                    continue

                title_match = re.search(r'^#\s+(.+)$', content, re.M)
                title = title_match.group(1).strip() if title_match else os.path.splitext(file)[0].replace("-", " ").replace("_", " ").title()
                tags = [tag.strip("# ").lower() for tag in re.findall(r'#\w+', content)]
                
                node = {
                    "id": node_id,
                    "title": title,
                    "source": rel_path,
                    "type": "markdown_mindmap",
                    "tags": list(set(tags)),
                    "content": content[:2000]
                }

                md_nodes.append(node)
                processed_count += 1
            except Exception:
                pass

combined_rag = existing_rag + md_nodes

with open(rag_path, "w", encoding="utf-8") as f:
    json.dump(combined_rag, f, ensure_ascii=False, indent=2)

rag_size_mb = round(os.path.getsize(rag_path) / (1024 * 1024), 2)

print("==================================================")
print("✅ INGESTA RAG DE MAPAS MARKDOWN COMPLETADA")
print("==================================================")
print(f" ├─ Nuevos Nodos Ingestados: {processed_count}")
print(f" ├─ Nodos Totales en Bóveda RAG: {len(combined_rag)}")
print(f" └─ Peso de Bóveda RAG: {rag_size_mb} MB ({rag_path})")
print("==================================================")
