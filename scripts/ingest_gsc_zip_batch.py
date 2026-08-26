import os
import sys
import zipfile
import csv
import json
import hashlib
from datetime import datetime

ZIP_PATHS = [
    r"D:\Migracion_C\M2-W10\Downloads\https___www.productoraear.com_-Performance-on-Search-2026-08-26.zip",
    r"D:\Migracion_C\M2-W10\Downloads\https___www.productoraear.com_-Performance-on-Search-2026-08-25.zip",
    r"D:\Migracion_C\M2-W10\Downloads\https___www.productoraear.com_-Performance-on-Search-2026-08-24.zip",
    r"D:\Migracion_C\M2-W10\Downloads\https___www.productoraear.com_-Performance-on-Search-2026-08-24 (1).zip"
]

DEST_DIR = r"H:\EAR_OS_V2\EAR_OS_V2\g s console\extracted_batch"
OUTPUT_JSON = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\telemetry\gsc-performance-data.json"
HASHES_JSON = r"H:\EAR_OS_V2\EAR_OS_V2\scripts\.processed_hashes.json"

os.makedirs(DEST_DIR, exist_ok=True)
os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)

def compute_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

processed_hashes = {}
if os.path.exists(HASHES_JSON):
    try:
        with open(HASHES_JSON, 'r', encoding='utf-8') as f:
            processed_hashes = json.load(f)
    except:
        pass

queries_agg = {}
pages_agg = {}
devices_agg = {}
countries_agg = {}
dates_agg = {}

def parse_num(v):
    if not v: return 0.0
    v = v.replace('%', '').replace(',', '.').strip()
    try:
        return float(v)
    except:
        return 0.0

extracted_files_count = 0

for zip_path in ZIP_PATHS:
    if not os.path.exists(zip_path):
        print(f"[WARN] File not found: {zip_path}")
        continue
    
    sha = compute_sha256(zip_path)
    processed_hashes[os.path.basename(zip_path)] = {
        "sha256": sha,
        "path": zip_path,
        "processed_at": datetime.now().isoformat()
    }
    
    try:
        with zipfile.ZipFile(zip_path, 'r') as z:
            for member in z.namelist():
                z.extract(member, DEST_DIR)
                extracted_files_count += 1
                
                # Parse CSVs
                csv_path = os.path.join(DEST_DIR, member)
                if not member.lower().endswith('.csv') or not os.path.isfile(csv_path):
                    continue
                
                basename = os.path.basename(member).lower()
                
                with open(csv_path, 'r', encoding='utf-8', errors='replace') as f:
                    reader = csv.reader(f)
                    header = next(reader, None)
                    if not header: continue
                    
                    # Normalize header
                    header = [h.strip().lower() for h in header]
                    
                    # Detect CSV Type
                    is_queries = any('consulta' in h or 'query' in h for h in header)
                    is_pages = any('página' in h or 'pagina' in h or 'page' in h for h in header)
                    is_countries = any('país' in h or 'pais' in h or 'country' in h for h in header)
                    is_devices = any('dispositivo' in h or 'device' in h for h in header)
                    is_dates = any('fecha' in h or 'date' in h for h in header)
                    
                    for row in reader:
                        if not row or len(row) < 4: continue
                        name = row[0].strip()
                        clicks = parse_num(row[1]) if len(row) > 1 else 0
                        impressions = parse_num(row[2]) if len(row) > 2 else 0
                        ctr = parse_num(row[3]) if len(row) > 3 else 0
                        pos = parse_num(row[4]) if len(row) > 4 else 0
                        
                        if is_queries and not is_pages:
                            if name not in queries_agg:
                                queries_agg[name] = {'clicks': 0, 'impressions': 0, 'positions': []}
                            queries_agg[name]['clicks'] += clicks
                            queries_agg[name]['impressions'] += impressions
                            queries_agg[name]['positions'].append(pos)
                        elif is_pages:
                            if name not in pages_agg:
                                pages_agg[name] = {'clicks': 0, 'impressions': 0, 'positions': []}
                            pages_agg[name]['clicks'] += clicks
                            pages_agg[name]['impressions'] += impressions
                            pages_agg[name]['positions'].append(pos)
                        elif is_countries:
                            if name not in countries_agg:
                                countries_agg[name] = {'clicks': 0, 'impressions': 0}
                            countries_agg[name]['clicks'] += clicks
                            countries_agg[name]['impressions'] += impressions
                        elif is_devices:
                            if name not in devices_agg:
                                devices_agg[name] = {'clicks': 0, 'impressions': 0}
                            devices_agg[name]['clicks'] += clicks
                            devices_agg[name]['impressions'] += impressions
                        elif is_dates:
                            if name not in dates_agg:
                                dates_agg[name] = {'clicks': 0, 'impressions': 0}
                            dates_agg[name]['clicks'] += clicks
                            dates_agg[name]['impressions'] += impressions
                            
    except Exception as e:
        print(f"[ERR] Error processing {zip_path}: {e}")

# Build finalized queries list
final_queries = []
for q, data in queries_agg.items():
    avg_pos = sum(data['positions']) / len(data['positions']) if data['positions'] else 0.0
    ctr = (data['clicks'] / data['impressions'] * 100) if data['impressions'] > 0 else 0.0
    # Opportunity score: high impressions in positions 4-30
    opp_score = round(data['impressions'] * (1.0 / (avg_pos + 1.0)) * 10, 2)
    final_queries.append({
        'query': q,
        'clicks': int(data['clicks']),
        'impressions': int(data['impressions']),
        'ctr': round(ctr, 2),
        'position': round(avg_pos, 1),
        'opportunityScore': opp_score
    })

final_pages = []
for p, data in pages_agg.items():
    avg_pos = sum(data['positions']) / len(data['positions']) if data['positions'] else 0.0
    ctr = (data['clicks'] / data['impressions'] * 100) if data['impressions'] > 0 else 0.0
    final_pages.append({
        'page': p,
        'clicks': int(data['clicks']),
        'impressions': int(data['impressions']),
        'ctr': round(ctr, 2),
        'position': round(avg_pos, 1)
    })

final_queries.sort(key=lambda x: x['impressions'], reverse=True)
final_pages.sort(key=lambda x: x['impressions'], reverse=True)

total_clicks = sum(q['clicks'] for q in final_queries)
total_impressions = sum(q['impressions'] for q in final_queries)
avg_ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0.0

# Opportunity queries: high potential to rank in Top 3
opp_queries = sorted(
    [q for q in final_queries if q['position'] >= 4 and q['impressions'] >= 5],
    key=lambda x: x['opportunityScore'],
    reverse=True
)

output_data = {
    'meta': {
        'lastIngestedAt': datetime.now().isoformat(),
        'sourceZipsCount': len(ZIP_PATHS),
        'extractedFilesCount': extracted_files_count
    },
    'totals': {
        'totalClicks': total_clicks,
        'totalImpressions': total_impressions,
        'averageCtr': round(avg_ctr, 2),
        'totalUniqueQueries': len(final_queries),
        'totalUniquePages': len(final_pages)
    },
    'topOpportunityQueries': opp_queries[:30],
    'topPerformingQueries': final_queries[:30],
    'topPages': final_pages[:30],
    'devices': [{'device': k, 'clicks': int(v['clicks']), 'impressions': int(v['impressions'])} for k, v in devices_agg.items()],
    'countries': [{'country': k, 'clicks': int(v['clicks']), 'impressions': int(v['impressions'])} for k, v in countries_agg.items()]
}

with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
    json.dump(output_data, f, indent=2, ensure_ascii=False)

with open(HASHES_JSON, 'w', encoding='utf-8') as f:
    json.dump(processed_hashes, f, indent=2, ensure_ascii=False)

print(json.dumps({
    "status": "SUCCESS",
    "totalClicks": total_clicks,
    "totalImpressions": total_impressions,
    "uniqueQueries": len(final_queries),
    "uniquePages": len(final_pages),
    "top5Opportunities": [q['query'] for q in opp_queries[:5]],
    "top5Pages": [p['page'] for p in final_pages[:5]]
}, indent=2))
