
import os
import time
import re
from playwright.sync_api import sync_playwright, TimeoutError
from urllib.parse import urlparse

# --- CONFIGURACIÓN YOLO ---
INBOX_URL = "https://substack.com/inbox"
OUTPUT_DIR = "substack_output"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "substack_completo.md")
USER_DATA_DIR = "user_data"
# --- FIN DE LA CONFIGURACIÓN ---

def setup_directories():
    """Crea los directorios necesarios si no existen."""
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
    if not os.path.exists(USER_DATA_DIR):
        os.makedirs(USER_DATA_DIR)

def get_subscription_urls(page):
    """
    MODO YOLO: Navega a la página de inbox y usa un selector adivinado
    para encontrar los enlaces de las publicaciones.
    """
    print("="*50)
    print("PASO 1: OBTENIENDO LISTA DE PUBLICACIONES (MODO YOLO)")
    print("="*50)
    print(f"Navegando a {INBOX_URL}...")
    page.goto(INBOX_URL, wait_until='networkidle', timeout=90000)
    
    print("Página de Inbox cargada. Esperando 5 segundos por si acaso...")
    time.sleep(5)

    yolo_selector = 'a.link-LIBpto'
    print(f"Buscando enlaces de publicaciones con el selector YOLO: '{yolo_selector}'")
    links = page.locator(yolo_selector).all()
    
    urls = set()
    for link in links:
        url = link.get_attribute('href')
        if not url or not url.startswith('http'):
            continue

        try:
            parsed_uri = urlparse(url)
            # Queremos la URL base, no un post específico.
            base_url = f"{parsed_uri.scheme}://{parsed_uri.netloc}"
            hostname = parsed_uri.netloc
            
            # Filtro para asegurar que son publicaciones y no enlaces internos
            if hostname and hostname != 'substack.com' and not hostname.startswith('app.') and '/p/' not in url and '/@' not in url:
                urls.add(base_url)
        except Exception:
            continue

    if not urls:
        print(f"MODO YOLO FALLÓ: El selector '{yolo_selector}' no encontró ninguna URL de publicación válida.")
    else:
        print(f"\nMODO YOLO ÉXITO (PARCIAL): Se encontraron {len(urls)} posibles suscripciones:")
        for url in sorted(list(urls)):
            print(f"  - {url}")
    return list(urls)

def get_all_posts_from_archive(page, archive_url):
    """Navega por la página de archivo de una newsletter y hace scroll hasta cargar todos sus artículos."""
    print(f"\n--- Procesando Archivo: {archive_url} ---")
    try:
        page.goto(archive_url, wait_until='networkidle', timeout=120000)
        print("Comenzando a hacer scroll para cargar todos los artículos de este archivo...")
        last_height = page.evaluate('document.body.scrollHeight')
        patience = 0
        MAX_PATIENCE = 3
        while patience < MAX_PATIENCE:
            page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
            print("  Haciendo scroll...")
            time.sleep(4)
            new_height = page.evaluate('document.body.scrollHeight')
            if abs(new_height - last_height) < 10:
                patience += 1
                print(f"  La altura casi no ha cambiado. Paciencia: {patience}/{MAX_PATIENCE}")
            else:
                patience = 0
            last_height = new_height
        
        print("  Scroll finalizado para este archivo.")
        links = page.locator('a.pencraft[href*="/p/"]').all()
        post_urls = [link.get_attribute('href') for link in links]
        unique_post_urls = list(dict.fromkeys(post_urls))
        print(f"  Se encontraron {len(unique_post_urls)} artículos únicos en este archivo.")
        return unique_post_urls
    except Exception as e:
        print(f"  -> ERROR al procesar el archivo {archive_url}: {e}")
        return []

def scrape_article(page, url):
    """Navega a la URL de un artículo y extrae su título y contenido."""
    CONTENT_SELECTORS = ['article.post', '.post-content', 'article']
    try:
        print(f"    -> Procesando post: {url}")
        page.goto(url, wait_until='domcontentloaded', timeout=60000)
        title_element = page.locator('h1').first
        title = title_element.inner_text(timeout=5000) if title_element.is_visible() else "Sin Título"
        article_body_element = None
        for selector in CONTENT_SELECTORS:
            try:
                page.wait_for_selector(selector, timeout=2000)
                article_body_element = page.locator(selector).first
                if article_body_element.is_visible():
                    break
            except TimeoutError:
                continue
        if article_body_element:
            content = article_body_element.inner_text()
            return title, content
        else:
            return title, "Contenido no encontrado."
    except Exception as e:
        print(f"      -> ERROR grave al procesar {url}: {e}")
        return None, None

def main():
    setup_directories()
    with sync_playwright() as p:
        context = p.chromium.launch_persistent_context(USER_DATA_DIR, headless=False, channel="chrome", args=['--start-maximized'])
        page = context.new_page()
        page.set_default_timeout(60000)

        # Ir a una página neutral primero para asegurar que el login se detecta si es necesario
        page.goto("https://substack.com", wait_until='load')
        if "login" in page.url or "sign-in" in page.url:
            print("="*50)
            print("ACCIÓN REQUERIDA: Por favor, inicia sesión en Substack en el navegador.")
            input("Una vez hayas iniciado sesión, vuelve aquí y presiona Enter...")
        else:
            print("Sesión guardada detectada. Continuando...")

        subscription_urls = get_subscription_urls(page)
        if not subscription_urls:
            print("No se puede continuar sin suscripciones. Terminando script.")
            context.close()
            return

        master_article_list = []
        print("\n" + "="*50)
        print("PASO 2: RECOPILANDO URLs DE ARTÍCULOS DE CADA ARCHIVO")
        print("="*50)
        for i, sub_url in enumerate(subscription_urls):
            print(f"\nProcesando suscripción {i+1}/{len(subscription_urls)}: {sub_url}")
            archive_url = f"{sub_url.rstrip('/')}/archive"
            posts = get_all_posts_from_archive(page, archive_url)
            master_article_list.extend(posts)
        
        master_article_list = sorted(list(dict.fromkeys(master_article_list)))
        print("\n" + "="*50)
        print(f"PASO 3: EXTRACCIÓN DE CONTENIDO. TOTAL DE ARTÍCULOS ÚNICOS ENCONTRADOS: {len(master_article_list)}")
        print("Este proceso puede tardar mucho tiempo...")
        print("="*50)

        open(OUTPUT_FILE, 'w', encoding='utf-8').close()

        with open(OUTPUT_FILE, 'a', encoding='utf-8') as f:
            for i, url in enumerate(master_article_list):
                print(f"\nProcesando artículo {i+1}/{len(master_article_list)}")
                title, content = scrape_article(page, url)
                if title and content:
                    f.write(f"# {title}\n\n")
                    f.write(f"Fuente: {url}\n\n")
                    f.write(content)
                    f.write("\n\n---\n\n")
                time.sleep(1)

        print("\n" + "="*50)
        print("¡¡¡PROCESO COMPLETADO!!!")
        print(f"Todos los artículos han sido guardados en: {OUTPUT_FILE}")
        print("="*50)
        context.close()

if __name__ == "__main__":
    main()
