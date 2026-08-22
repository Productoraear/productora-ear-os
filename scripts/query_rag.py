# -*- coding: utf-8 -*-
import os
import json
import sys
import time

print("🧠 INICIALIZANDO NÚCLEO DE CONSULTAS RAG DE EAR OS...")

rag_path = os.path.join("src", "data", "ear-rag-database.json")
if not os.path.exists(rag_path):
    print("❌ No se encontró la Bóveda RAG en src/data/ear-rag-database.json")
    sys.exit(1)

t0 = time.time()
with open(rag_path, "r", encoding="utf-8") as f:
    database = json.load(f)
load_time = round((time.time() - t0) * 1000, 2)

print(f"✅ Bóveda RAG cargada en {load_time} ms | Nodos totales: {len(database)}")

def search_rag(query, limit=3):
    query_terms = query.lower().split()
    results = []
    t_start = time.time()
    
    for node in database:
        title = node.get("title", "").lower()
        content = node.get("content", "").lower()
        tags = [t.lower() for t in node.get("tags", [])]
        source = node.get("source", "").lower()
        
        score = 0
        for term in query_terms:
            if term in title: score += 5
            if term in tags: score += 4
            if term in source: score += 3
            if term in content: score += 1
            
        if score > 0:
            results.append((score, node))
            
    results.sort(key=lambda x: x[0], reverse=True)
    search_time = round((time.time() - t_start) * 1000, 2)
    
    print(f"\n🔎 BÚSQUEDA RAG: '{query}' ({search_time} ms) | Coincidencias: {len(results)}")
    print("=" * 65)
    for rank, (score, item) in enumerate(results[:limit], 1):
        print(f"[{rank}] Score: {score} | Título: {item.get('title')}")
        print(f"    Fuente: {item.get('source')}")
        snippet = item.get('content', '')[:140].replace('\n', ' ')
        print(f"    Extracto: {snippet}...")
        print("-" * 65)

# 2. Ejecutar consultas de prueba sobre el Grafo de Conocimiento
search_rag("rider tecnico bose xr18")
search_rag("vimume estimulacion sensorial")
search_rag("cotizador bodas presupuesto")
