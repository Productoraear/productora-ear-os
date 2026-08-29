import os
import csv
import json
from datetime import datetime

EXTRACT_DIR = r"H:\EAR_OS_V2\EAR_OS_V2\g s console\extracted_batch"
OUTPUT_JSON = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\telemetry\gsc-performance-data.json"

os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)

def parse_num(v):
    if not v: return 0.0
    v = str(v).replace('%', '').replace(',', '.').strip()
    try:
        return float(v)
    except:
        return 0.0

queries_agg = {}
pages_agg = {}
devices_agg = {}
countries_agg = {}

for f in os.listdir(EXTRACT_DIR):
    csv_path = os.path.join(EXTRACT_DIR, f)
    if not f.lower().endswith('.csv') or not os.path.isfile(csv_path):
        continue
    
    with open(csv_path, 'r', encoding='utf-8', errors='replace') as fp:
        reader = csv.reader(fp)
        header = next(reader, None)
        if not header: continue
        header = [h.strip().lower() for h in header]
        
        is_queries = any('consulta' in h or 'query' in h for h in header)
        is_pages = any('página' in h or 'pagina' in h or 'page' in h for h in header)
        is_countries = any('país' in h or 'pais' in h or 'country' in h for h in header)
        is_devices = any('dispositivo' in h or 'device' in h for h in header)
        
        for row in reader:
            if not row or len(row) < 2: continue
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

final_queries = []
for q, data in queries_agg.items():
    avg_pos = sum(data['positions']) / len(data['positions']) if data['positions'] else 0.0
    ctr = (data['clicks'] / data['impressions'] * 100) if data['impressions'] > 0 else 0.0
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

opp_queries = sorted(
    [q for q in final_queries if q['position'] >= 4 and q['impressions'] >= 5],
    key=lambda x: x['opportunityScore'],
    reverse=True
)

output_data = {
    'meta': {
        'lastIngestedAt': datetime.now().isoformat(),
        'sourceDirectory': EXTRACT_DIR
    },
    'totals': {
        'totalClicks': total_clicks,
        'totalImpressions': total_impressions,
        'averageCtr': round(avg_ctr, 2),
        'totalUniqueQueries': len(final_queries),
        'totalUniquePages': len(final_pages)
    },
    'topOpportunityQueries': opp_queries[:50],
    'topPerformingQueries': final_queries[:50],
    'topPages': final_pages[:50],
    'devices': [{'device': k, 'clicks': int(v['clicks']), 'impressions': int(v['impressions'])} for k, v in devices_agg.items()],
    'countries': [{'country': k, 'clicks': int(v['clicks']), 'impressions': int(v['impressions'])} for k, v in countries_agg.items()]
}

with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
    json.dump(output_data, f, indent=2, ensure_ascii=False)

print(f"[REPOPULATE OK] {total_impressions} impresiones, {len(final_queries)} queries, {len(opp_queries)} oportunidades.")
