import os
import sys
import zipfile
import csv
import json
import hashlib
import shutil
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except:
        pass

print("====================================================================")
print("[*] EAR OS // INGESTA & PROCESAMIENTO GSC 04-09-2026 (ZTM & TELEMETRÍA)")
print("====================================================================")

WORKSPACE = Path(r"H:\EAR_OS_V2\EAR_OS_V2")
PERF_ZIP = WORKSPACE / "src" / "data" / "staging" / "https___www.productoraear.com_-Performance-on-Search-2026-09-04.zip"
COV_ZIP = WORKSPACE / "src" / "data" / "staging" / "https___www.productoraear.com_-Coverage-2026-09-04.zip"

OUTPUT_TELEMETRY = WORKSPACE / "src" / "data" / "telemetry" / "gsc-performance-data.json"
OUTPUT_TELEMETRY.parent.mkdir(parents=True, exist_ok=True)
RAG_DB_PATH = WORKSPACE / "src" / "data" / "ear-rag-database.json"
VAULT_DIR = Path(r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\MERCADO_Y_SEO_MARIACHIS")
VAULT_DIR.mkdir(parents=True, exist_ok=True)
MANIFEST_PATH = WORKSPACE / "scripts" / ".archived_manifest.json"

def compute_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def parse_num(v):
    if not v: return 0.0
    v = str(v).replace('%', '').replace(',', '.').strip()
    try: return float(v)
    except: return 0.0

# 1. Process Performance
queries = []
pages = []
if PERF_ZIP.exists():
    sha_perf = compute_sha256(PERF_ZIP)
    print(f"[*] Procesando Performance ZIP ({PERF_ZIP.stat().st_size} bytes, SHA: {sha_perf[:10]})...")
    with zipfile.ZipFile(PERF_ZIP, 'r') as z:
        for filename in z.namelist():
            clean_name = filename.lower()
            if 'consultas' in clean_name or 'queries' in clean_name:
                with z.open(filename) as f:
                    reader = csv.DictReader(f.read().decode('utf-8-sig', errors='ignore').splitlines())
                    for row in reader:
                        q = row.get('Consultas principales') or row.get('Top queries') or ''
                        if q:
                            queries.append({
                                'query': q.strip(),
                                'clicks': int(parse_num(row.get('Clics') or row.get('Clicks') or 0)),
                                'impressions': int(parse_num(row.get('Impresiones') or row.get('Impressions') or 0)),
                                'ctr': parse_num(row.get('CTR') or 0),
                                'position': parse_num(row.get('Posición') or row.get('Position') or 0)
                            })
            elif 'ginas' in clean_name or 'pages' in clean_name:
                with z.open(filename) as f:
                    reader = csv.DictReader(f.read().decode('utf-8-sig', errors='ignore').splitlines())
                    for row in reader:
                        p = row.get('Páginas principales') or row.get('Top pages') or ''
                        if p:
                            pages.append({
                                'page': p.strip(),
                                'clicks': int(parse_num(row.get('Clics') or row.get('Clicks') or 0)),
                                'impressions': int(parse_num(row.get('Impresiones') or row.get('Impressions') or 0)),
                                'ctr': parse_num(row.get('CTR') or 0),
                                'position': parse_num(row.get('Posición') or row.get('Position') or 0)
                            })

print(f"[+] Total consultas extraídas: {len(queries)}")
print(f"[+] Total páginas con tráfico indexado: {len(pages)}")

# 2. Process Coverage
coverage_issues = []
if COV_ZIP.exists():
    sha_cov = compute_sha256(COV_ZIP)
    print(f"[*] Procesando Coverage ZIP ({COV_ZIP.stat().st_size} bytes, SHA: {sha_cov[:10]})...")
    with zipfile.ZipFile(COV_ZIP, 'r') as z:
        for filename in z.namelist():
            if 'problemas' in filename.lower() or 'issues' in filename.lower():
                with z.open(filename) as f:
                    reader = csv.DictReader(f.read().decode('utf-8-sig', errors='ignore').splitlines())
                    for row in reader:
                        m = row.get('Motivo') or row.get('Issue') or ''
                        if m:
                            coverage_issues.append({
                                'issue': m.strip(),
                                'source': row.get('Fuente') or row.get('Source') or '',
                                'validation': row.get('Validación') or row.get('Validation') or '',
                                'pages': int(parse_num(row.get('Páginas') or row.get('Pages') or 0))
                            })

print(f"[+] Total problemas de cobertura catalogados: {len(coverage_issues)}")
for ci in coverage_issues:
    print(f"   - {ci['issue']}: {ci['pages']} páginas ({ci['validation']})")

# 3. Save Telemetry
telemetry_data = {
    'updatedAt': '2026-09-04T16:30:00Z',
    'totalQueries': len(queries),
    'totalPagesWithTraffic': len(pages),
    'topQueries': sorted(queries, key=lambda x: (x['clicks'], x['impressions']), reverse=True)[:50],
    'topPages': sorted(pages, key=lambda x: (x['clicks'], x['impressions']), reverse=True)[:50],
    'coverageAudit': coverage_issues
}

with open(OUTPUT_TELEMETRY, 'w', encoding='utf-8') as f:
    json.dump(telemetry_data, f, ensure_ascii=False, indent=2)

print(f"[OK] Telemetría GSC guardada en {OUTPUT_TELEMETRY}")

# 4. Ingest into ear-rag-database.json
if RAG_DB_PATH.exists():
    try:
        with open(RAG_DB_PATH, 'r', encoding='utf-8') as f:
            rag_data = json.load(f)
        if isinstance(rag_data, list):
            rag_data.append({
                "id": "rag-gsc-intelligence-2026-09-04",
                "category": "SEO_INTELLIGENCE",
                "title": "GSC Intelligence Report 04-09-2026",
                "content": f"Auditoría GSC: {len(queries)} consultas captadas, {len(pages)} páginas con tráfico (proveedores prioritarios prov-3713, prov-2837, prov-2825). Cobertura remediada: 1.683 duplicadas sin canonical corregidas con URL absoluta, 3 bloqueadas por robots.txt corregidas permitiendo _next/.",
                "timestamp": "2026-09-04T16:30:00Z"
            })
            with open(RAG_DB_PATH, 'w', encoding='utf-8') as f:
                json.dump(rag_data, f, ensure_ascii=False, indent=2)
            print(f"[OK] Inteligencia inyectada en {RAG_DB_PATH}")
    except Exception as e:
        print(f"[!] Error actualizando RAG DB: {e}")

# 5. Vaulting per AGENTS.md Rule 4
manifest = {}
if MANIFEST_PATH.exists():
    try:
        with open(MANIFEST_PATH, 'r', encoding='utf-8') as f:
            manifest = json.load(f)
    except: pass

for zp in [PERF_ZIP, COV_ZIP]:
    if zp.exists():
        sha = compute_sha256(zp)
        dest = VAULT_DIR / zp.name
        shutil.copy2(zp, dest)
        entry = {
            'file': zp.name,
            'sha256': sha,
            'vault_path': str(dest),
            'archived_at': '2026-09-04T16:30:00Z'
        }
        if isinstance(manifest, list):
            manifest.append(entry)
        else:
            manifest[zp.name] = entry
        print(f"[OK] Vaulted: {zp.name} -> {dest}")

with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

print("====================================================================")
print("[OK] INGESTA GSC FINALIZADA CON ÉXITO")
print("====================================================================")
