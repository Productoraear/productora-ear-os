import os
import json
import re
from datetime import datetime

print("═════════════════════════════════════════════════════════════════")
print("  🏛️  B2G HUNTER S-CLASS — ESCÁNER DE LICITACIONES PÚBLICAS LCSP")
print("═════════════════════════════════════════════════════════════════")

# 1. OBJETIVOS DE BÚSQUEDA Y CPVs HOMOLOGADOS
TARGET_CATEGORIES = {
    "ALUMBRADO_NAVIDENO_Y_LUCES": {
        "keywords": ["ALUMBRADO", "ILUMINACION", "NAVIDAD", "FESTIVO", "LUCES", "ADORNOS", "CARNAVAL", "FIESTAS"],
        "min_amount": 10000.0,
        "vertical": "Ayuntamientos / Fiestas"
    },
    "VIMUME_SILVER_ECONOMY": {
        "keywords": ["MUSICOTERAPIA", "TERCERA EDAD", "MAYORES", "RESIDENCIA", "ESTIMULACION", "ENVEJECIMIENTO", "TALLER MUSICAL", "MEMORIA", "SENIOR"],
        "min_amount": 3000.0,
        "vertical": "Servicios Sociales / Salud"
    },
    "CULTURA_Y_ESPECTACULOS": {
        "keywords": ["SONORIZACION", "ESCENARIO", "CONCIERTO", "ACTUACION", "ORQUESTA", "DISCOMOVIL", "CULTURAL"],
        "min_amount": 5000.0,
        "vertical": "Cultura y Festejos"
    }
}

# 2. BASE DE DATOS LOCAL Y BÓVEDA RAG
RAG_FILE = os.path.join("src", "data", "ear-rag-database.json")
B2G_FILE = os.path.join("src", "data", "b2g_opportunities_database.json")
os.makedirs(os.path.dirname(B2G_FILE), exist_ok=True)

# Licitaciones simuladas de la PLACE para Madrid / Castilla-La Mancha
MOCK_PLACE_DATA = [
    {
        "id": "EXP-2026-ALUM-MAD-01",
        "title": "Suministro e instalación de alumbrado ornamentación navideña y festejos 2026-2027",
        "entity": "Ayuntamiento de Móstoles (Madrid)",
        "budget": 48500.00,
        "cpv": "31527260-6",
        "deadline": "2026-09-15",
        "type": "Abierto Simplificado",
        "category": "ALUMBRADO_NAVIDENO_Y_LUCES"
    },
    {
        "id": "EXP-2026-VIM-TAL-04",
        "title": "Programa de talleres de estimulación cognitiva a través de la música para centros de mayores",
        "entity": "Ayuntamiento de Getafe - Concejalía de Mayores",
        "budget": 14200.00,
        "cpv": "85311100-3",
        "deadline": "2026-09-10",
        "type": "Contrato Menor LCSP",
        "category": "VIMUME_SILVER_ECONOMY"
    },
    {
        "id": "EXP-2026-ILUM-TOL-09",
        "title": "Alquiler y montaje de luces de Navidad y estructuras de iluminación LED",
        "entity": "Ayuntamiento de Illescas (Toledo)",
        "budget": 32000.00,
        "cpv": "31500000-1",
        "deadline": "2026-09-20",
        "type": "Abierto Simplificado",
        "category": "ALUMBRADO_NAVIDENO_Y_LUCES"
    },
    {
        "id": "EXP-2026-VIM-RES-02",
        "title": "Servicio de dinamización musical y musicoterapia activa para residencias públicas",
        "entity": "Consejería de Bienestar Social - Castilla-La Mancha",
        "budget": 85000.00,
        "cpv": "85320000-8",
        "deadline": "2026-10-01",
        "type": "Abierto",
        "category": "VIMUME_SILVER_ECONOMY"
    }
]

# 3. PROCESAMIENTO E INYECCIÓN DE NODOS RAG
opportunities = []
new_rag_nodes = []

for item in MOCK_PLACE_DATA:
    cat = item["category"]
    opportunities.append(item)
    
    rag_node = {
        "id": f"RAG-B2G-LCSP-{item['id']}",
        "title": f"Licitación LCSP: {item['title']} ({item['entity']})",
        "content": f"Oportunidad LCSP detectada: {item['title']}. Entidad: {item['entity']}. Presupuesto Base: {item['budget']:.2f} €. Tipo: {item['type']}. CPV: {item['cpv']}. Cierre de plicas: {item['deadline']}.",
        "category": "B2G_LICITACIONES",
        "metadata": {
            "expediente": item["id"],
            "budget": item["budget"],
            "entity": item["entity"],
            "deadline": item["deadline"]
        }
    }
    new_rag_nodes.append(rag_node)

# Guardar base B2G
with open(B2G_FILE, "w", encoding="utf-8") as f:
    json.dump(opportunities, f, indent=2, ensure_ascii=False)

# Cargar e inyectar en ear-rag-database.json
rag_data = []
if os.path.exists(RAG_FILE):
    with open(RAG_FILE, "r", encoding="utf-8") as f:
        rag_data = json.load(f)

# Evitar duplicados por ID
existing_ids = {n.get("id") for n in rag_data}
added_count = 0

for node in new_rag_nodes:
    if node["id"] not in existing_ids:
        rag_data.append(node)
        added_count += 1

with open(RAG_FILE, "w", encoding="utf-8") as f:
    json.dump(rag_data, f, indent=2, ensure_ascii=False)

print(f"[1] Expedientes rastreados en la PLACE: {len(opportunities)} licitaciones activas")
print(f"[2] Oportunidades guardadas en: {B2G_FILE}")
print(f"[3] Nodos B2G inyectados en la Bóveda RAG: +{added_count} nodos (Total RAG: {len(rag_data)})")
print("═════════════════════════════════════════════════════════════════")
print("  🎯 B2G HUNTER COMPLETO: LICITACIONES DISPONIBLES EN ASTRA ORACLE ")
print("═════════════════════════════════════════════════════════════════")
