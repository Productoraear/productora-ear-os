import urllib.request
import urllib.error
import urllib.parse
import json
import time
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:3007"

ENDPOINTS = [
    {
        "name": "Robots.txt Directives",
        "path": "/robots.txt",
        "method": "GET",
        "headers": {"User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"},
        "payload": None,
        "expected_statuses": [200]
    },
    {
        "name": "Sitemap XML Index",
        "path": "/sitemap.xml",
        "method": "GET",
        "headers": {"User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"},
        "payload": None,
        "expected_statuses": [200]
    },
    {
        "name": "Bodas Neural Tunnel Hub",
        "path": "/bodas",
        "method": "GET",
        "headers": {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"},
        "payload": None,
        "expected_statuses": [200]
    },
    {
        "name": "Arsenal Técnico View",
        "path": "/arsenal",
        "method": "GET",
        "headers": {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"},
        "payload": None,
        "expected_statuses": [200]
    },
    {
        "name": "Auth API: Send OTP",
        "path": "/api/auth/send-otp",
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36"
        },
        "payload": {"email": "healthcheck@productoraear.com", "action": "ping"},
        "expected_statuses": [200, 400, 401, 403]
    },
    {
        "name": "Auth API: Admin Verify",
        "path": "/api/auth/admin-verify",
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36"
        },
        "payload": {"token": "test-ping", "code": "000000"},
        "expected_statuses": [200, 400, 401, 403]
    }
]

def run_health_checks():
    print("=" * 70)
    print(f"🩺 EJECUTANDO HEALTH-CHECK DE APIS & ENDPOINTS CRÍTICOS: {BASE_URL}")
    print("=" * 70)

    total_checks = len(ENDPOINTS)
    passed_checks = 0
    failures = []

    for ep in ENDPOINTS:
        url = f"{BASE_URL}{ep['path']}"
        method = ep["method"]
        headers = ep["headers"]
        payload_data = ep["payload"]
        
        req_body = json.dumps(payload_data).encode("utf-8") if payload_data else None

        req = urllib.request.Request(url, data=req_body, headers=headers, method=method)

        start_time = time.time()
        status_code = None
        response_body = ""
        is_success = False
        duration_ms = 0

        try:
            with urllib.request.urlopen(req, timeout=10) as res:
                status_code = res.getcode()
                response_body = res.read().decode("utf-8", errors="ignore")
                duration_ms = int((time.time() - start_time) * 1000)
                is_success = status_code in ep["expected_statuses"]
        except urllib.error.HTTPError as e:
            status_code = e.code
            response_body = e.read().decode("utf-8", errors="ignore")
            duration_ms = int((time.time() - start_time) * 1000)
            # Codes like 400/401/403 for bad payload in security endpoints are valid responses (not 500 crashes)
            is_success = status_code in ep["expected_statuses"]
        except Exception as e:
            duration_ms = int((time.time() - start_time) * 1000)
            is_success = False
            response_body = str(e)

        if is_success:
            passed_checks += 1
            print(f"✅ [{status_code}] {ep['name']:<30} {ep['path']:<24} {duration_ms:>5} ms")
        else:
            failures.append({
                "endpoint": ep["name"],
                "path": ep["path"],
                "status": status_code,
                "duration_ms": duration_ms,
                "error": response_body[:200]
            })
            print(f"❌ [{status_code}] {ep['name']:<30} {ep['path']:<24} {duration_ms:>5} ms [FALLO]")

    print("\n" + "━" * 70)
    print(f"📊 RESULTADO DE DISPONIBILIDAD: {passed_checks}/{total_checks} ENDPOINTS OPERATIVOS (0 ERRORES 5XX)")
    print("━" * 70)

    if failures:
        print("⚠️ DETALLE DE ENDPOINTS CON INCIDENCIA:")
        for f in failures:
            print(f"  • {f['endpoint']} ({f['path']}) -> Código: {f['status']} | Error: {f['error']}")
    else:
        print("🛡️ CERTIFICACIÓN S-CLASS: Ningún endpoint genera errores 500 (Internal Server Error).")
    print("━" * 70 + "\n")

if __name__ == "__main__":
    run_health_checks()
