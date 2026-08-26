import json

with open('src/data/telemetry/gsc-performance-data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("=== INFORME DE INTELIGENCIA DE BÚSQUEDA GSC ===")
print(f"Total Impresiones Reales: {data['totals']['totalImpressions']}")
print(f"Total Clics: {data['totals']['totalClicks']}")
print(f"Total Consultas Únicas: {data['totals']['totalUniqueQueries']}")
print(f"Total URLs Indexadas con Tráfico: {data['totals']['totalUniquePages']}")

print("\n--- TOP CONSULTAS DE ALTA INTENCIÓN COMERCIAL & IMPRESIONES ---")
for q in data['topPerformingQueries'][:12]:
    print(f"• {q['query']}: {q['impressions']} imp | Pos: {q['position']} | CTR: {q['ctr']}%")

print("\n--- TOP URLs CAPTADORAS DE IMPRESIONES ---")
for p in data['topPages'][:8]:
    print(f"• {p['page']} -> {p['impressions']} imp (Pos: {p['position']})")
