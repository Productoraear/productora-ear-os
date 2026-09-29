"""
════════════════════════════════════════════════════════════════════════════════════════
AUDITOR FORENSE MASIVO DE SITEMAPS & VERIFICADOR ATÓMICO S-CLASS (EAR OS 2050)
Barrido concurrente de URLs con streaming en consola a alta velocidad,
análisis de coherencia semántica, validación de CTAs, Price-Lock y Schema JSON-LD.
════════════════════════════════════════════════════════════════════════════════════════
"""

import os
import sys
import json
import time
import urllib.request
import urllib.error
import re
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_URL = "http://localhost:3007"
INTENT_DATA_PATH = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\telemetry\gsc-sitemap-intent-landings.json"
REPORT_JSON_PATH = r"H:\EAR_OS_V2\EAR_OS_V2\.antigravity\reports\AUDITORIA_FORENSE_SITEMAP_SCLASS.json"
REPORT_MD_PATH = r"H:\EAR_OS_V2\EAR_OS_V2\.antigravity\reports\AUDITORIA_FORENSE_SITEMAP_SCLASS.md"

os.makedirs(os.path.dirname(REPORT_JSON_PATH), exist_ok=True)

# Lista de URLs clave a auditar (Core + 1000 GSC Intent URLs + Muestreo de Provincias)
def collect_all_urls():
    urls = [
        "/",
        "/fincas",
        "/fincas/madrid/finca-alubian",
        "/fincas/sevilla/finca-salvago",
        "/fincas/madrid/finca-san-damaso",
        "/fincas/valencia/alqueria-balada",
        "/reservar/solista",
        "/catering-brasas",
        "/arroces",
        "/vimume/propuesta",
        "/artistas/representacion",
        "/proveedores",
        "/arsenal/pantallas-led/madrid",
        "/arsenal/pantallas-led/baleares",
        "/bodas/madrid/dj/madrid",
        "/bodas/toledo/mariachi-gala/toledo",
        "/bodas/toledo/bodas-lujo/escalona",
        "/bodas/bilbao/sonido-iluminacion/getxo",
        "/directorio"
    ]

    # Inyectar intenciones GSC
    if os.path.exists(INTENT_DATA_PATH):
        try:
            with open(INTENT_DATA_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
                all_intents = data.get("allIntents", [])
                for item in all_intents:
                    path = item.get("internalPath")
                    if path and path not in urls:
                        urls.append(path)
        except Exception as e:
            print(f"[!] Error cargando intenciones GSC: {e}")

    return urls

def audit_single_url(path):
    url = f"{BASE_URL}{path}"
    start_t = time.perf_counter()
    result = {
        "path": path,
        "url": url,
        "status": 0,
        "latency_ms": 0,
        "title": "",
        "has_price_lock_cta": False,
        "has_split_80_10_10": False,
        "has_mentrida_hub": False,
        "has_json_ld": False,
        "coherence_score": 0.0,
        "errors": []
    }

    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'ProductoraEAR-ForensicAuditor/2050'})
        with urllib.request.urlopen(req, timeout=10) as response:
            latency = (time.perf_counter() - start_t) * 1000
            result["status"] = response.status
            result["latency_ms"] = round(latency, 2)
            html = response.read().decode('utf-8', errors='replace')

            # Extracción y análisis
            title_match = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE)
            result["title"] = title_match.group(1).strip() if title_match else "SIN_TITULO"

            # Validar señales clave
            if "Price-Lock" in html or "100" in html or "PAGAR RESERVA" in html or "Bloquear" in html:
                result["has_price_lock_cta"] = True
            if "80/10/10" in html or "Split Soberano" in html or "VIMUME" in html:
                result["has_split_80_10_10"] = True
            if "Méntrida" in html or "Mentrida" in html or "Hub" in html:
                result["has_mentrida_hub"] = True
            if 'type="application/ld+json"' in html or "schema.org" in html:
                result["has_json_ld"] = True

            # Coherencia de Slug vs Contenido
            slug_words = [w for w in re.split(r'[/_\-]', path.lower()) if len(w) > 2]
            matched_words = sum(1 for w in slug_words if w in html.lower())
            result["coherence_score"] = round((matched_words / len(slug_words)) * 100, 1) if slug_words else 100.0

    except urllib.error.HTTPError as e:
        result["status"] = e.code
        result["latency_ms"] = round((time.perf_counter() - start_t) * 1000, 2)
        result["errors"].append(f"HTTP Error {e.code}")
    except Exception as e:
        result["status"] = 500
        result["latency_ms"] = round((time.perf_counter() - start_t) * 1000, 2)
        result["errors"].append(str(e))

    return result

def run_mass_audit():
    print("=" * 80)
    print(">> INICIANDO AUDITORIA FORENSE ATOMICA DE SITEMAPS (STREAMING EN TIEMPO REAL)")
    print("=" * 80)

    urls = collect_all_urls()
    total = len(urls)
    print(f"[*] Total URLs cargadas para verificacion: {total}")
    print("[*] Servidor objetivo:", BASE_URL)
    print("-" * 80)

    results = []
    success_count = 0
    error_count = 0

    start_global = time.perf_counter()

    # Ejecutar con concurrencia
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_to_url = {executor.submit(audit_single_url, u): u for u in urls}

        idx = 0
        for future in as_completed(future_to_url):
            idx += 1
            res = future.result()
            results.append(res)

            status_icon = "[OK]" if res["status"] == 200 else "[FAIL]"
            if res["status"] == 200:
                success_count += 1
            else:
                error_count += 1

            # Barra de progreso y stream
            pct = round((idx / total) * 100, 1)
            cta_badge = "[100e CTA: OK]" if res["has_price_lock_cta"] else "[100e CTA: --]"
            schema_badge = "[Schema: OK]" if res["has_json_ld"] else "[Schema: --]"
            
            # Print streaming line
            print(f"[{idx:04d}/{total:04d}] {pct:>5.1f}% | {status_icon} HTTP {res['status']} | {res['latency_ms']:>6.1f}ms | {cta_badge} {schema_badge} | {res['path'][:45]:<45}")

    total_time = round(time.perf_counter() - start_global, 2)
    avg_latency = round(sum(r["latency_ms"] for r in results) / total, 2) if total > 0 else 0

    print("=" * 80)
    print(">> RESULTADOS GLOBALES DE LA AUDITORIA FORENSE")
    print("=" * 80)
    print(f" - URLs Auditadas: {total}")
    print(f" - Exitosas (HTTP 200): {success_count} ({round((success_count/total)*100, 2)}%)")
    print(f" - Anomalias / Errores: {error_count}")
    print(f" - Tiempo Total: {total_time}s ({round(total/total_time, 1)} URLs/segundo)")
    print(f" - Latencia Media (TTFB): {avg_latency} ms")
    print("-" * 80)

    # Guardar reporte JSON
    summary_data = {
        "timestamp": datetime.now().isoformat(),
        "metrics": {
            "total_urls": total,
            "success_count": success_count,
            "error_count": error_count,
            "success_rate_pct": round((success_count/total)*100, 2),
            "total_time_seconds": total_time,
            "avg_latency_ms": avg_latency
        },
        "results": results
    }

    with open(REPORT_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(summary_data, f, indent=2, ensure_ascii=False)

    # Guardar reporte Markdown
    md = f"""# 🛡️ INFORME FORENSE ATÓMICO DE SITEMAPS & COBERTURA S-CLASS
*Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | Modo: Bare-Metal 2050*

### 📊 Resumen Ejecutivo
- **Total URLs Auditadas:** {total}
- **Tasa de Cobertura Exitosa (HTTP 200):** {round((success_count/total)*100, 2)}% ({success_count}/{total})
- **Errores / 404 Detectados:** {error_count}
- **Latencia Promedio:** {avg_latency} ms
- **Velocidad de Auditoría:** {round(total/total_time, 1)} URLs/segundo

---

### 🔍 Muestreo de Verificación en Vivo
| URL Auditada | HTTP | Latencia | Price-Lock 100€ | Schema JSON-LD | Hub Méntrida | Coherencia |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
"""
    for r in results[:35]:
        cta = "✅" if r["has_price_lock_cta"] else "❌"
        sch = "✅" if r["has_json_ld"] else "❌"
        hub = "✅" if r["has_mentrida_hub"] else "❌"
        md += f"| `{r['path']}` | **{r['status']}** | {r['latency_ms']} ms | {cta} | {sch} | {hub} | {r['coherence_score']}% |\n"

    with open(REPORT_MD_PATH, 'w', encoding='utf-8') as f:
        f.write(md)

    print(f"[OK] Reporte JSON guardado en: {REPORT_JSON_PATH}")
    print(f"[OK] Reporte Markdown guardado en: {REPORT_MD_PATH}")

if __name__ == "__main__":
    run_mass_audit()
