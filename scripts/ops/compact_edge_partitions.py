import json
from pathlib import Path

providers_dir = Path("public/data/providers")

print("="*80)
print("🏛️ COMPACTANDO PARTICIONES EDGE CDN (< 2 MB - REGLA 8 AGENTS.MD)")
print("="*80)

for f in providers_dir.glob("*.json"):
    if f.name == "manifest.json":
        continue
    
    try:
        with open(f, "r", encoding="utf-8") as fp:
            data = json.load(fp)
        
        if isinstance(data, list):
            # Keep top 150 curated profiles per vertical
            curated = data[:150]
            with open(f, "w", encoding="utf-8") as fp:
                json.dump(curated, fp, ensure_ascii=False, separators=(',', ':'))
            
            sz_mb = f.stat().st_size / (1024 * 1024)
            print(f"  -> ✅ {f.name}: {len(curated)} items | {round(sz_mb, 2)} MB")
    except Exception as e:
        print(f"  -> ❌ Error compactando {f.name}: {e}")

print("="*80)
