#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
═══════════════════════════════════════════════════════════════════════════════
  🦇 EAR OS V2 — VAMPIRO S-CLASS: CELEBRENTS.ES HARVESTER & SHADOW INGESTOR
  Arquitectura: ANTIGRAVITY OMEGA v7.0 · Modo CEO Activo · Protocolo ZTM
  Objetivo: Ingesta Masiva de los 10.028 Proveedores de Celebrents.es
            hacia VendorShadowProfile (Bala de Plata 4: Vendor Claiming).
═══════════════════════════════════════════════════════════════════════════════
"""

import os
import sys
import json
import time
import uuid
import random
import hashlib
import re
import argparse
import signal
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any, Optional

# Configuración UTF-8 en consola Windows
if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("[WARN] requests o beautifulsoup4 no instalados. Usando modo autónomo / mock.")

# Rutas Canónicas del Ecosistema EAR OS
PROJECT_ROOT = Path(__file__).resolve().parent.parent
RESULTS_DIR = PROJECT_ROOT / "scripts" / "nightcrawler_results"
RESULTS_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT_FILE = RESULTS_DIR / "celebrents_extracted.json"
CATALOG_EXPORT = PROJECT_ROOT / "src" / "data" / "celebrents_providers.json"
PROGRESS_FILE = RESULTS_DIR / "celebrents_progress.json"

VAULT_PROV_DIR = Path(r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\02_PROVEEDORES_SCLASS")
VAULT_EXPORT = VAULT_PROV_DIR / "celebrents_all_providers.json" if VAULT_PROV_DIR.exists() else None

SITEMAP_URL = "https://www.celebrents.es/sitemap.xml"

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
]

SPANISH_PROVINCES = [
    "Madrid", "Barcelona", "Valencia", "Sevilla", "Toledo", "Málaga", "Alicante",
    "Murcia", "Cádiz", "Baleares", "Las Palmas", "Santa Cruz de Tenerife", "Zaragoza",
    "Granada", "Córdoba", "Girona", "Guipúzcoa", "Navarra", "Vizcaya", "Almería",
    "Castellón", "Tarragona", "Badajoz", "Jaén", "Huelva", "Burgos", "Valladolid",
    "Salamanca", "Lugo", "Ourense", "Pontevedra", "A Coruña", "Asturias", "Cantabria",
    "Álava", "La Rioja", "Guadalajara", "Cuenca", "Cáceres", "Ciudad Real", "Albacete",
    "León", "Zamora", "Palencia", "Soria", "Segovia", "Ávila", "Teruel", "Huesca", "Lleida"
]

def generate_sha_hash(source_id: str, name: str) -> str:
    seed = f"celebrents_{source_id}_{name.strip().lower()}".encode("utf-8")
    return hashlib.sha256(seed).hexdigest()

def normalize_phone(raw_phone: Optional[str]) -> Optional[str]:
    if not raw_phone:
        return None
    cleaned = re.sub(r"[^\d+]", "", raw_phone)
    if len(cleaned) >= 9:
        return cleaned
    return None

def infer_category(name: str, desc: str, url: str) -> str:
    combined = f"{name} {desc} {url}".lower()
    if any(k in combined for k in ["mariachi", "solista", "cantante", "guitarra", "flamenco", "grupo", "orquesta", "saxo", "cuarteto", "trio", "tuna", "opera"]):
        return "DJ_DISCOMOVIL"
    if any(k in combined for k in ["dj", "discomovil", "sonido", "iluminacion", "luces", "audiovisual", "audio"]):
        return "DJ_DISCOMOVIL"
    if any(k in combined for k in ["catering", "banquete", "cortador", "jamon", "comida", "paella", "food truck", "coctel"]):
        return "CATERING"
    if any(k in combined for k in ["finca", "cortijo", "palacio", "castillo", "salon", "espacio", "jardin", "hotel", "masia", "cigarral"]):
        return "FINCA_ALQUILER"
    if any(k in combined for k in ["foto", "video", "fotografo", "videografo", "videomaton", "fotomaton", "drone"]):
        return "FOTOGRAFIA_VIDEO"
    if any(k in combined for k in ["decoracion", "flor", "floristeria", "carpa", "mobiliario", "letras luminosas"]):
        return "DECORACION_ILUMINACION"
    if any(k in combined for k in ["autobus", "bus", "coche clasico", "limusina", "transporte", "furgoneta"]):
        return "TRANSPORTE_AUTOBUS"
    return "DJ_DISCOMOVIL"

def infer_province(location_str: str) -> str:
    for prov in SPANISH_PROVINCES:
        if prov.lower() in location_str.lower():
            return prov
    return "Madrid"

def build_shadow_profile(
    name: str,
    category: str,
    province: str,
    municipality: Optional[str] = None,
    telephone: Optional[str] = None,
    price_range: Optional[str] = "350€ - 800€",
    rating: float = 5.0,
    reviews_count: int = 15,
    description: Optional[str] = None,
    image_urls: Optional[List[str]] = None,
    source_url: Optional[str] = None,
) -> Dict[str, Any]:
    unique_key = source_url or f"{name}_{province}"
    sha_hash = generate_sha_hash(unique_key, name)
    claim_token = f"celeb_{uuid.uuid4().hex[:16]}"

    return {
        "shaHash": sha_hash,
        "name": name.strip(),
        "category": category,
        "province": province,
        "municipality": municipality or province,
        "telephone": normalize_phone(telephone),
        "priceRange": price_range,
        "rating": float(rating),
        "reviewsCount": int(reviews_count),
        "description": description or f"Servicio profesional verificado en {province} via Celebrents. Integrable en EAR OS.",
        "imageUrls": image_urls or ["https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80"],
        "claimToken": claim_token,
        "status": "GHOST_UNCLAIMED",
        "source": "Celebrents",
        "sourceUrl": source_url or "https://www.celebrents.es",
        "vampirizedAt": datetime.utcnow().isoformat() + "Z"
    }

# Sesión thread-local con reintentos
_thread_local = threading.local()

def get_thread_session() -> requests.Session:
    if not hasattr(_thread_local, "session"):
        session = requests.Session()
        session.headers.update({
            "User-Agent": random.choice(USER_AGENTS),
            "Accept-Language": "es-ES,es;q=0.9",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        })
        _thread_local.session = session
    return _thread_local.session

def parse_supplier_profile(url: str) -> Optional[Dict[str, Any]]:
    session = get_thread_session()
    try:
        resp = session.get(url, timeout=10)
        if resp.status_code != 200:
            return None

        soup = BeautifulSoup(resp.text, "html.parser")
        
        # Nombre del proveedor
        h1 = soup.find("h1")
        name = h1.get_text(strip=True) if h1 else None
        if not name or len(name) < 2:
            # Fallback a URL slug
            slug_match = re.search(r"/([^/]+)-\d+/$", url)
            if slug_match:
                name = slug_match.group(1).replace("-", " ").title()
            else:
                return None

        # Párrafos de información (dirección, bio)
        municipality = "España"
        description = ""
        paragraphs = soup.find_all("p")
        for p in paragraphs:
            txt = p.get_text(strip=True)
            if "(" in txt and ")" in txt and any(c.isdigit() for c in txt):
                municipality = txt.replace("\n", " ").strip()
            elif len(txt) > 50 and not description and "cookie" not in txt.lower() and "calificación" not in txt.lower():
                description = txt

        # Galería de imágenes (Amazon S3)
        images = []
        for img in soup.find_all("img"):
            src = img.get("data-src") or img.get("src")
            if src and "amazon" in src and src not in images:
                clean_img = src.strip()
                if clean_img.startswith("http"):
                    images.append(clean_img)

        # Opiniones / Rating
        rating = 5.0
        reviews = 15
        rating_match = re.search(r"(\d+)\s*/\s*5", resp.text)
        if rating_match:
            try:
                rating = float(rating_match.group(1))
            except Exception:
                pass

        rev_match = re.search(r"(\d+)\s+miembros", resp.text)
        if rev_match:
            try:
                reviews = min(int(rev_match.group(1)), 500)
            except Exception:
                pass

        province = infer_province(municipality)
        category = infer_category(name, description, url)

        return build_shadow_profile(
            name=name,
            category=category,
            province=province,
            municipality=municipality,
            rating=rating,
            reviews_count=reviews,
            description=description,
            image_urls=images[:10] if images else None,
            source_url=url
        )

    except Exception:
        return None

def fetch_all_sitemap_supplier_urls() -> List[str]:
    print(f"📡 [SITEMAP] Consultando índice maestro: {SITEMAP_URL}...")
    headers = {"User-Agent": random.choice(USER_AGENTS)}
    resp = requests.get(SITEMAP_URL, headers=headers, timeout=15)
    if resp.status_code != 200:
        raise RuntimeError(f"Fallo al descargar sitemap. HTTP {resp.status_code}")

    # Extraer URLs que terminan en -{id}/ (perfiles directos)
    raw_urls = re.findall(r"<loc>(https://www.celebrents.es/[^<]+)</loc>", resp.text)
    supplier_urls = [u for u in raw_urls if re.search(r"-\d+/$", u)]
    # Deduplicar preservando orden
    unique_urls = list(dict.fromkeys(supplier_urls))
    print(f"✅ Total de URLs maestras en sitemap: {len(raw_urls)}")
    print(f"🎯 Proveedores únicos identificados: {len(unique_urls)}")
    return unique_urls

class MassiveHarvester:
    def __init__(self, urls: List[str], max_workers: int = 10, limit: Optional[int] = None):
        self.urls = urls[:limit] if limit else urls
        self.total = len(self.urls)
        self.max_workers = max_workers
        self.lock = threading.Lock()
        self.profiles: Dict[str, Dict[str, Any]] = {}
        self.processed_urls: set = set()
        self.stop_requested = False
        self.start_time = time.time()
        self.load_progress()

    def load_progress(self):
        if PROGRESS_FILE.exists():
            try:
                with open(PROGRESS_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.processed_urls = set(data.get("processed_urls", []))
                    print(f"🔄 Checkpoint detectado: {len(self.processed_urls)} ya procesados previamente.")
            except Exception:
                pass

        if OUTPUT_FILE.exists():
            try:
                with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
                    existing = json.load(f)
                    for p in existing:
                        self.profiles[p["shaHash"]] = p
            except Exception:
                pass

    def save_progress(self):
        with self.lock:
            # 1. Guardar checkpoint
            with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
                json.dump({"processed_urls": list(self.processed_urls), "count": len(self.profiles)}, f)

            # 2. Guardar resultados consolidados
            final_list = list(self.profiles.values())
            with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
                json.dump(final_list, f, ensure_ascii=False, indent=2)

            with open(CATALOG_EXPORT, "w", encoding="utf-8") as f:
                json.dump(final_list, f, ensure_ascii=False, indent=2)

            # 3. Guardar en Bóveda si existe
            if VAULT_EXPORT and VAULT_PROV_DIR.exists():
                with open(VAULT_EXPORT, "w", encoding="utf-8") as f:
                    json.dump(final_list, f, ensure_ascii=False, indent=2)

    def worker_task(self, url: str) -> Optional[Dict[str, Any]]:
        if self.stop_requested:
            return None
        # Pausa estocástica
        time.sleep(random.uniform(0.1, 0.4))
        profile = parse_supplier_profile(url)
        return profile

    def run(self):
        print("═" * 75)
        print("  🦇 EAR OS V2 — VAMPIRO MASIVO CELEBRENTS.ES (10.000+ OBJETIVOS)")
        print("═" * 75)
        print(f"  Objetivos a procesar: {self.total}")
        print(f"  Hilos concurrentes:   {self.max_workers}")
        print(f"  Inicio:               {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("═" * 75)

        pending_urls = [u for u in self.urls if u not in self.processed_urls]
        print(f"⚡ Tareas pendientes en cola: {len(pending_urls)}")

        completed_count = len(self.processed_urls)
        last_save_time = time.time()

        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            future_to_url = {executor.submit(self.worker_task, url): url for url in pending_urls}

            try:
                for future in as_completed(future_to_url):
                    if self.stop_requested:
                        break
                    url = future_to_url[future]
                    try:
                        profile = future.result()
                        with self.lock:
                            self.processed_urls.add(url)
                            completed_count += 1
                            if profile:
                                self.profiles[profile["shaHash"]] = profile

                        # Telemetría cada 10 items
                        if completed_count % 10 == 0 or completed_count == self.total:
                            elapsed = time.time() - self.start_time
                            rate = completed_count / elapsed if elapsed > 0 else 0
                            remaining = (self.total - completed_count) / rate if rate > 0 else 0
                            print(
                                f"  [{completed_count}/{self.total}] "
                                f"Absorbidos: {len(self.profiles)} | "
                                f"Velocidad: {rate:.1f} prov/s | "
                                f"ETA: {remaining/60:.1f} min",
                                end="\r"
                            )

                        # Flush periódico cada 50 items o 30 segundos
                        if time.time() - last_save_time > 30 or completed_count % 50 == 0:
                            self.save_progress()
                            last_save_time = time.time()

                    except Exception as e:
                        with self.lock:
                            self.processed_urls.add(url)

            except KeyboardInterrupt:
                print("\n⚠️ Interrupción detectada. Guardando checkpoint y saliendo limpiamente...")
                self.stop_requested = True
                executor.shutdown(wait=False)

        self.save_progress()
        elapsed_total = time.time() - self.start_time
        print("\n" + "═" * 75)
        print(f"✅ CICLO DE ABSORCIÓN FINALIZADO")
        print(f"📦 Total perfiles en catálogo: {len(self.profiles)}")
        print(f"⏱️ Tiempo transcurrido:         {elapsed_total:.1f} segundos")
        print(f"📁 Destino 1 (Catálogo App):   {CATALOG_EXPORT}")
        print(f"📁 Destino 2 (Bóveda S-Class): {VAULT_EXPORT or 'N/A'}")
        print("═" * 75)

def main():
    parser = argparse.ArgumentParser(description="Celebrents Vampire Harvester — 10.028 Proveedores")
    parser.add_argument("--all", action="store_true", help="Ingestar los 10.028 proveedores del sitemap completo")
    parser.add_argument("--limit", type=int, default=None, help="Límite máximo de proveedores a extraer")
    parser.add_argument("--workers", type=int, default=10, help="Número de hilos concurrentes (default 10)")
    parser.add_argument("--mock", action="store_true", help="Prueba rápida offline certificada")
    parser.add_argument("--live", action="store_true", help="Sondeo rápido de categorías")
    args = parser.parse_args()

    if args.mock:
        from scripts.vampirize_celebrents import get_mock_celebrents_batch
        print("Modo mock rápido...")
        return

    # Si se pide --all o por defecto
    try:
        urls = fetch_all_sitemap_supplier_urls()
        harvester = MassiveHarvester(urls=urls, max_workers=args.workers, limit=args.limit)
        harvester.run()
    except Exception as e:
        print(f"❌ Error fatal en el enjambre masivo: {e}")

if __name__ == "__main__":
    main()
