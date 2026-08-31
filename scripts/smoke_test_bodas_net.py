"""
🏛️ SMOKE TEST — VALIDACIÓN DE EXTRACCIÓN DE 1 PROVEEDOR (BODAS.NET)
═══════════════════════════════════════════════════════════════════
Propósito: Verificar que Playwright + Stealth puede:
1. Abrir bodas.net sin ser bloqueado por WAF
2. Parsear la lista de proveedores (nombres, categorías, URLs)
3. Intentar navegar al perfil individual y extraer el teléfono
Si este test pasa, el scraper nocturno puede lanzarse con confianza.
═══════════════════════════════════════════════════════════════════
"""
import json
import os
import time
import random
from datetime import datetime

try:
    from playwright.sync_api import sync_playwright
    from playwright_stealth import Stealth
    print("✅ Playwright + Stealth importados correctamente")
except ImportError as e:
    print(f"❌ FALTA DEPENDENCIA: {e}")
    print("Ejecuta: pip install playwright playwright-stealth && playwright install chromium")
    exit(1)

OUTPUT_DIR = os.path.join("scripts", "nightcrawler_results")
os.makedirs(OUTPUT_DIR, exist_ok=True)

TARGET_URL = "https://www.bodas.net/musica-bodas/madrid"

def run_smoke_test():
    print("═" * 60)
    print("  🔬 SMOKE TEST — EXTRACCIÓN BODAS.NET CON PLAYWRIGHT STEALTH")
    print("═" * 60)
    print(f"  Target: {TARGET_URL}")
    print(f"  Inicio: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("═" * 60)

    results = {
        "test_timestamp": datetime.now().isoformat(),
        "waf_bypass": False,
        "listing_parse": False,
        "providers_found": 0,
        "phone_extracted": False,
        "providers": [],
        "errors": []
    }

    with sync_playwright() as pw:
        browser = pw.chromium.launch(
            headless=True,
            args=[
                '--disable-blink-features=AutomationControlled',
                '--no-sandbox',
                '--disable-dev-shm-usage',
            ]
        )
        context = browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            locale='es-ES',
            timezone_id='Europe/Madrid',
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        )

        # Aplicar stealth
        stealth = Stealth()
        stealth.apply_stealth_sync(context)

        page = context.new_page()

        # ━━ FASE 1: Cargar página de listado ━━━━━━━━━━━━━━━━━━━━
        print("\n[1/4] Navegando a la página de listado...")
        try:
            page.goto(TARGET_URL, wait_until='domcontentloaded', timeout=30000)
            time.sleep(random.uniform(2, 4))

            # Verificar que no estamos bloqueados
            title = page.title()
            url = page.url
            print(f"  Título: {title}")
            print(f"  URL final: {url}")

            if "captcha" in title.lower() or "robot" in title.lower() or "blocked" in title.lower():
                print("  ❌ WAF/CAPTCHA DETECTADO — Abortando")
                results["errors"].append("WAF/CAPTCHA bloqueó el acceso")
                browser.close()
                return results

            results["waf_bypass"] = True
            print("  ✅ WAF BYPASS: Página cargada sin bloqueo")

        except Exception as e:
            print(f"  ❌ ERROR navegación: {e}")
            results["errors"].append(str(e))
            browser.close()
            return results

        # ━━ FASE 2: Parsear listado de proveedores ━━━━━━━━━━━━━
        print("\n[2/4] Parseando listado de proveedores...")
        try:
            # Esperar a que cargue el contenido dinámico
            page.wait_for_load_state('networkidle', timeout=15000)
            time.sleep(random.uniform(1, 3))

            # Intentar múltiples selectores para tarjetas de proveedor
            selectors = [
                'article[data-testid]',
                '.app-search-result',
                '[class*="vendor"]',
                '[class*="StoreFrontCard"]',
                '[class*="storefrontCard"]',
                'a[href*="--e"]',
                '.listing-item',
                'div[class*="result"]',
                'article',
            ]

            provider_elements = []
            used_selector = None
            for sel in selectors:
                elements = page.query_selector_all(sel)
                if elements and len(elements) >= 2:
                    provider_elements = elements
                    used_selector = sel
                    break

            if not provider_elements:
                # Fallback: buscar links a perfiles de proveedor
                links = page.query_selector_all('a[href]')
                profile_links = []
                for link in links:
                    href = link.get_attribute('href') or ''
                    if '--e' in href and '/musica-bodas/' in href:
                        profile_links.append(link)
                if profile_links:
                    provider_elements = profile_links
                    used_selector = 'a[href*="--e"] (fallback links)'

            print(f"  Selector usado: {used_selector}")
            print(f"  Elementos encontrados: {len(provider_elements)}")

            if not provider_elements:
                print("  ⚠️ No se encontraron proveedores con los selectores conocidos")
                print("  Guardando HTML para diagnóstico...")
                html = page.content()
                diag_path = os.path.join(OUTPUT_DIR, "smoke_test_page.html")
                with open(diag_path, 'w', encoding='utf-8') as f:
                    f.write(html)
                print(f"  HTML guardado en: {diag_path}")
                results["errors"].append("No se encontraron proveedores — HTML guardado para diagnóstico")
                results["listing_parse"] = False
            else:
                results["listing_parse"] = True

                # Extraer datos básicos de cada tarjeta (máx 10 para smoke test)
                for i, el in enumerate(provider_elements[:10]):
                    try:
                        text = el.inner_text() or ''
                        href = el.get_attribute('href') or ''
                        # Si es un contenedor, buscar el link dentro
                        if not href:
                            inner_link = el.query_selector('a[href*="--e"]')
                            if inner_link:
                                href = inner_link.get_attribute('href') or ''

                        name = ''
                        # Intentar extraer nombre
                        name_el = el.query_selector('h2, h3, [class*="name"], [class*="title"]')
                        if name_el:
                            name = name_el.inner_text().strip()
                        elif text:
                            name = text.split('\n')[0].strip()[:100]

                        if name and len(name) > 2:
                            provider_data = {
                                "name": name,
                                "profile_url": href if href.startswith('http') else f"https://www.bodas.net{href}" if href else '',
                                "raw_text_snippet": text[:200].replace('\n', ' | ')
                            }
                            results["providers"].append(provider_data)

                    except Exception as e:
                        results["errors"].append(f"Error parseando elemento {i}: {str(e)[:100]}")

                results["providers_found"] = len(results["providers"])
                print(f"  ✅ PROVEEDORES PARSEADOS: {results['providers_found']}")
                for p in results["providers"][:5]:
                    print(f"    → {p['name']}")

        except Exception as e:
            print(f"  ❌ ERROR parsing: {e}")
            results["errors"].append(str(e))

        # ━━ FASE 3: Navegar a perfil individual y buscar teléfono ━━
        print("\n[3/4] Intentando extracción de teléfono en perfil individual...")
        if results["providers"] and results["providers"][0].get("profile_url"):
            profile_url = results["providers"][0]["profile_url"]
            try:
                print(f"  Navegando a: {profile_url}")
                time.sleep(random.uniform(3, 6))
                page.goto(profile_url, wait_until='domcontentloaded', timeout=30000)
                page.wait_for_load_state('networkidle', timeout=15000)
                time.sleep(random.uniform(2, 4))

                # Buscar botón de "Ver Teléfono"
                phone_selectors = [
                    'button:has-text("teléfono")',
                    'button:has-text("Teléfono")',
                    'button:has-text("Ver tel")',
                    'a:has-text("teléfono")',
                    '[data-testid*="phone"]',
                    '[class*="phone"]',
                    'a[href^="tel:"]',
                ]

                phone_found = False
                for ps in phone_selectors:
                    try:
                        phone_el = page.query_selector(ps)
                        if phone_el:
                            print(f"  Encontrado selector de teléfono: {ps}")
                            # Intentar hacer clic
                            phone_el.click()
                            time.sleep(random.uniform(1, 3))

                            # Buscar el número revelado
                            tel_links = page.query_selector_all('a[href^="tel:"]')
                            for tl in tel_links:
                                href = tl.get_attribute('href') or ''
                                if href.startswith('tel:'):
                                    phone = href.replace('tel:', '').strip()
                                    if len(phone) >= 9:
                                        print(f"  ✅ TELÉFONO EXTRAÍDO: {phone}")
                                        results["phone_extracted"] = True
                                        results["providers"][0]["phone"] = phone
                                        phone_found = True
                                        break

                            if phone_found:
                                break
                    except Exception:
                        continue

                if not phone_found:
                    # Fallback: buscar patrones de teléfono en el texto
                    body_text = page.inner_text('body')
                    import re
                    phones = re.findall(r'(?:\+34|0034)?[\s\-]?\d{3}[\s\-]?\d{3}[\s\-]?\d{3}', body_text)
                    if phones:
                        print(f"  ✅ TELÉFONO DETECTADO POR REGEX: {phones[0].strip()}")
                        results["phone_extracted"] = True
                        results["providers"][0]["phone"] = phones[0].strip()
                    else:
                        print("  ⚠️ Teléfono no extraído (ofuscado por JS o requiere login)")
                        # Guardar HTML del perfil para diagnóstico
                        profile_html = page.content()
                        profile_path = os.path.join(OUTPUT_DIR, "smoke_test_profile.html")
                        with open(profile_path, 'w', encoding='utf-8') as f:
                            f.write(profile_html)
                        print(f"  HTML del perfil guardado en: {profile_path}")

            except Exception as e:
                print(f"  ❌ ERROR en perfil: {e}")
                results["errors"].append(str(e))
        else:
            print("  ⚠️ No hay URL de perfil para probar extracción de teléfono")

        # ━━ FASE 4: Resumen ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        print("\n[4/4] RESUMEN DEL SMOKE TEST:")
        print("═" * 60)
        print(f"  WAF Bypass:         {'✅ OK' if results['waf_bypass'] else '❌ BLOQUEADO'}")
        print(f"  Listado Parseado:   {'✅ OK' if results['listing_parse'] else '❌ FALLO'}")
        print(f"  Proveedores Found:  {results['providers_found']}")
        print(f"  Teléfono Extraído:  {'✅ OK' if results['phone_extracted'] else '⚠️ NO (posible ofuscación JS)'}")
        print(f"  Errores:            {len(results['errors'])}")
        print("═" * 60)

        if results['waf_bypass'] and results['listing_parse'] and results['providers_found'] > 0:
            print("  🟢 VEREDICTO: SMOKE TEST PASSED — Scraper nocturno puede lanzarse")
        elif results['waf_bypass'] and results['listing_parse']:
            print("  🟡 VEREDICTO: PARCIAL — Listado OK, teléfonos pueden requerir ajustes")
        else:
            print("  🔴 VEREDICTO: FAILED — Revisar WAF y selectores antes de lanzar")

        browser.close()

    # Guardar resultados del smoke test
    result_path = os.path.join(OUTPUT_DIR, "smoke_test_results.json")
    with open(result_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"\n  Resultados guardados en: {result_path}")

    return results

if __name__ == "__main__":
    run_smoke_test()
