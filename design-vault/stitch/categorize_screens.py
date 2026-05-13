import json
import os

with open('design-vault/stitch/screens_raw.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

screens = data['screens']

registry = {
    "EMANAGER": [],
    "ADMIN": [],
    "CLIENT_FRONTEND": [],
    "TOOLS": [],
    "B2B_B2G": [],
    "VIMUME": [],
    "LEGAL": [],
    "OTHER": []
}

for s in screens:
    title = s.get('title', '').upper()
    entry = {
        "id": s['name'].split('/')[-1],
        "title": s['title'],
        "device": s.get('deviceType', 'UNKNOWN')
    }
    
    if 'EMANAGER' in title or 'LECCIÓN' in title or 'CURRÍCULUM' in title or 'ENTRENAMIENTO' in title or 'PROTOCOL' in title:
        registry["EMANAGER"].append(entry)
    elif 'ADMIN' in title or 'ANALYTICS' in title or 'REPORT' in title or 'AUDITORÍA' in title or 'METRICS' in title:
        registry["ADMIN"].append(entry)
    elif 'HOME' in title or 'CONTACT' in title or 'SERVICIOS' in title or 'ARTISTAS' in title or 'THE SIGNAL' in title or 'SOCIAL' in title or 'NOSOTROS' in title:
        registry["CLIENT_FRONTEND"].append(entry)
    elif 'HERRAMIENTA' in title or 'TOOL' in title or 'SIMULADOR' in title or 'CALCULADORA' in title or 'PLANIFICADOR' in title or 'TRACKER' in title:
        registry["TOOLS"].append(entry)
    elif 'B2B' in title or 'BUSINESS' in title or 'CORPORATE' in title or 'AGENCY' in title:
        registry["B2B_B2G"].append(entry)
    elif 'VIMUME' in title:
        registry["VIMUME"].append(entry)
    elif 'LEGAL' in title or 'VAULT' in title or 'BÓVEDA' in title or 'CONTRACT' in title or 'SHIELD' in title:
        registry["LEGAL"].append(entry)
    else:
        registry["OTHER"].append(entry)

with open('design-vault/reports/StitchRegistry.json', 'w', encoding='utf-8') as f:
    json.dump(registry, f, indent=2, ensure_ascii=False)

print("Registry generated successfully.")
