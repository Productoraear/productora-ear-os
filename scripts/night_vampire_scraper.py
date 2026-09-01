#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ANTIGRAVITY OMEGA v4.1 — OPERACIÓN NOCTURNA DE ABSORCIÓN MASIVA CAÓTICA
=======================================================================
- Evasión WAF Akamai con curl_cffi + impersonate="chrome110"
- Navegación estocástica no lineal ("Pareja Indecisa")
- Pausas Gaussianas de vacilación humana
- Rutas canónicas probadas (HTTP 200)
"""
from __future__ import annotations

import argparse
import json
import random
import re
import sys
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable, Optional

try:
    from curl_cffi import requests as cffi_requests
except Exception as exc:
    print("[FATAL] Falta dependencia obligatoria 'curl_cffi'. Ejecuta: pip install curl_cffi")
    sys.exit(2)

try:
    from bs4 import BeautifulSoup
except Exception as exc:
    print("[FATAL] Falta dependencia 'beautifulsoup4'. Ejecuta: pip install beautifulsoup4 lxml")
    sys.exit(2)

BASE_DIR = Path(__file__).resolve().parent.parent
RESULTS_DIR = BASE_DIR / "scripts" / "nightcrawler_results"
RESULTS_DIR.mkdir(parents=True, exist_ok=True)

NEW_PROVIDERS_FILE = RESULTS_DIR / "new_online_providers.json"
PROGRESS_FILE = RESULTS_DIR / "nightcrawler_progress.json"

DEDUP_SOURCES: list[Path] = [
    BASE_DIR / "src" / "data" / "vampirized_providers.json",
    BASE_DIR / "src" / "lib" / "NUCLEO_DATA" / "bodas_full.json",
    BASE_DIR / "src" / "lib" / "NUCLEO_DATA" / "bodas_clean.json",
    Path(r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\DOCUMENTOS_HISTORICOS\[2026-08-23]_final-providers.json"),
    RESULTS_DIR / "vault_absorbed_providers.json",
]

IMPERSONATE = "chrome110"
LONG_PAUSE_EVERY_N = 120
LONG_PAUSE_MIN, LONG_PAUSE_MAX = 180, 300
RETRY_SLEEP_ON_BLOCK = 300
FLUSH_EVERY_N = 25

USER_AGENTS: list[str] = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
]

BASE_HEADERS: dict[str, str] = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "es-ES,es;q=0.9,en-US;q=0.8,en;q=0.7",
    "Sec-Ch-Ua": '"Not A?Brand";v="8", "Chromium";v="110", "Google Chrome";v="110"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Upgrade-Insecure-Requests": "1",
}

PROVINCIAS: list[tuple[str, str]] = [
    ("Madrid", "madrid"), ("Toledo", "toledo"), ("Barcelona", "barcelona"),
    ("Málaga", "malaga"), ("Sevilla", "sevilla"), ("Valencia", "valencia"),
    ("Alicante", "alicante"), ("A Coruña", "a-coruna"), ("Asturias", "asturias"),
    ("Badajoz", "badajoz"), ("Baleares", "illes-balears"), ("Cádiz", "cadiz"),
    ("Cantabria", "cantabria"), ("Castellón", "castellon"), ("Ciudad Real", "ciudad-real"),
    ("Córdoba", "cordoba"), ("Girona", "girona"), ("Granada", "granada"),
    ("Guadalajara", "guadalajara"), ("Jaén", "jien"), ("Las Palmas", "las-palmas"),
    ("Murcia", "murcia"), ("Navarra", "navarra"), ("Pontevedra", "pontevedra"),
    ("Santa Cruz de Tenerife", "santa-cruz-de-tenerife"), ("Valladolid", "valladolid"),
    ("Zaragoza", "zaragoza"), ("Albacete", "albacete"), ("Almería", "almeria"),
    ("Ávila", "avila"), ("Burgos", "burgos"), ("Cáceres", "caceres"),
    ("Cuenca", "cuenca"), ("Gipuzkoa", "gipuzkoa"), ("Huelva", "huelva"),
    ("Huesca", "huesca"), ("León", "leon"), ("Lleida", "lleida"),
    ("Lugo", "lugo"), ("Ourense", "ourense"), ("Palencia", "palencia"),
    ("La Rioja", "la-rioja"), ("Salamanca", "salamanca"), ("Segovia", "segovia"),
    ("Soria", "soria"), ("Tarragona", "tarragona"), ("Teruel", "teruel"),
    ("Bizkaia", "bizkaia"), ("Zamora", "zamora"), ("Ceuta", "ceuta"), ("Melilla", "melilla"),
]

# Rutas canónicas reales (evita HTTP 404)
BODAS_CATEGORIES: list[tuple[str, str]] = [
    ("Catering", "bodas/proveedores/catering"),
    ("Fotógrafos", "bodas/proveedores/fotografos"),
    ("Música", "bodas/proveedores/musica"),
    ("DJs", "bodas/proveedores/musica/dj-para-bodas"),
    ("Fincas", "bodas/banquetes/fincas"),
    ("Animación", "bodas/proveedores/animacion"),
    ("Vídeo", "bodas/proveedores/video"),
    ("Joyería", "bodas/novias/joyeria"),
    ("Decoración", "bodas/proveedores/decoracion-para-bodas"),
    ("Autobuses", "bodas/proveedores/autobuses"),
    ("Coches de boda", "bodas/proveedores/coches-de-boda"),
]

FANDERS_CATEGORIES: list[tuple[str, str]] = [
    ("Fincas", "fincas"), ("Catering", "catering"), ("Música", "musica"),
    ("Fotografía", "fotografia"), ("Decoración", "decoracion"), ("Flores", "flores"),
]

TUBODAHOLA_CATEGORIES: list[tuple[str, str]] = [
    ("Fincas Luxury", "fincas-para-bodas"),
    ("Catering Gourmet", "catering-para-bodas"),
    ("Música de Gala", "musica-para-bodas"),
    ("Fotógrafos de Autor", "fotografos-de-bodas"),
    ("Espacios Singulares", "espacios-singulares"),
    ("Proveedores Luxury", "proveedores-bodas"),
]

BODAS_BASE = "https://www.bodas.net"
FANDERS_BASE = "https://fanders.es"
TUBODAHOLA_BASE = "https://www.tubodahola.com"

def bodas_url(path_cat: str, prov_slug: str) -> str:
    return f"{BODAS_BASE}/{path_cat}/{prov_slug}"

def fanders_url(cat_slug: str) -> str:
    return f"{FANDERS_BASE}/{cat_slug}"

def tubodahola_url(cat_slug: str) -> str:
    return f"{TUBODAHOLA_BASE}/{cat_slug}/"

def normalize_name(name: str) -> str:
    if not name: return ""
    n = name.lower().strip()
    n = re.sub(r"\s+", " ", n)
    for suffix in ("en bodas.net", "bodas.net", "en fanders.es", "fanders.es"):
        if n.endswith(suffix):
            n = n[:-len(suffix)].strip()
    return n

def _iter_names(obj: Any) -> Iterable[str]:
    if isinstance(obj, str):
        yield obj
    elif isinstance(obj, dict):
        for key in ("name", "nombre", "provider_name", "title"):
            v = obj.get(key)
            if isinstance(v, str) and v.strip(): yield v
        for v in obj.values():
            if isinstance(v, (list, dict)): yield from _iter_names(v)
    elif isinstance(obj, list):
        for item in obj: yield from _iter_names(item)

def load_dedup_set() -> set[str]:
    dedup: set[str] = set()
    for src in DEDUP_SOURCES:
        if not src.exists(): continue
        try:
            raw = json.loads(src.read_text(encoding="utf-8"))
            for nm in _iter_names(raw):
                nn = normalize_name(nm)
                if nn: dedup.add(nn)
        except Exception: pass
    return dedup

PHONE_RE = re.compile(r"(?:\+34)?[\s\-]?[6789]\d{2}[\s\-]?\d{3}[\s\-]?\d{3}")

def extract_providers(html: str, source_url: str) -> list[dict[str, Any]]:
    providers: list[dict[str, Any]] = []
    seen_local: set[str] = set()
    soup = BeautifulSoup(html, "lxml")

    if "tubodahola.com" in source_url:
        for h in soup.find_all(["h2", "h3"]):
            title = h.get_text(strip=True).replace(",premium", "").strip()
            if len(title) > 3 and not any(x in title.lower() for x in ["contacto", "aviso", "cookies", "guía", "privacidad"]):
                nn = normalize_name(title)
                if not nn or nn in seen_local: continue
                seen_local.add(nn)
                parent = h.parent
                for _ in range(4):
                    if parent and parent.parent: parent = parent.parent
                    else: break
                card_text = parent.get_text(" ", strip=True) if parent else ""
                a = h.find("a", href=True) or (parent.find("a", href=True) if parent else None)
                url = a["href"] if a else source_url
                if url.startswith("/"): url = TUBODAHOLA_BASE + url
                phone_m = PHONE_RE.search(card_text)
                providers.append({
                    "name": title,
                    "url": url,
                    "telephone": phone_m.group(0).replace(" ", "").replace("-", "") if phone_m else None,
                    "description_full": card_text[:1200] if card_text else None,
                    "source_url": source_url,
                })
        return providers

    card_urls = soup.select('a[href*="--e"]')
    for a in card_urls:
        name = a.get_text(" ", strip=True)
        nn = normalize_name(name)
        if not nn or nn in seen_local or len(nn) < 3: continue
        seen_local.add(nn)
        
        url = a["href"]
        if url.startswith("/"):
            url = (BODAS_BASE if "bodas.net" in source_url else FANDERS_BASE) + url

        parent = a.parent
        for _ in range(5):
            if parent and parent.parent: parent = parent.parent
            else: break

        card_text = parent.get_text(" ", strip=True) if parent else ""
        phone_m = PHONE_RE.search(card_text)

        providers.append({
            "name": name,
            "url": url,
            "telephone": phone_m.group(0).replace(" ", "").replace("-", "") if phone_m else None,
            "description_full": card_text[:1200] if card_text else None,
            "source_url": source_url,
        })
    return providers

@dataclass
class HttpClient:
    impersonate: str = IMPERSONATE
    timeout: int = 30

    def _headers(self) -> dict[str, str]:
        h = dict(BASE_HEADERS)
        h["User-Agent"] = random.choice(USER_AGENTS)
        return h

    def get(self, url: str) -> tuple[int, Optional[str]]:
        try:
            resp = cffi_requests.get(url, impersonate=self.impersonate, headers=self._headers(), timeout=self.timeout)
            return int(resp.status_code), (resp.text if resp.status_code == 200 else None)
        except Exception as exc:
            print(f"[HTTP-ERR] {url} -> {exc}", flush=True)
            return 0, None

@dataclass
class Job:
    site: str
    category: str
    provincia: Optional[str]
    url: str

def generate_humanized_chaotic_queue(raw_queue: list[Job]) -> list[Job]:
    """Genera un orden no lineal simulando la navegación de una pareja indecisa."""
    chaotic = []
    pool = list(raw_queue)
    random.shuffle(pool)

    while pool:
        idx = random.randint(0, len(pool) - 1)
        current = pool.pop(idx)
        chaotic.append(current)

        if random.random() < 0.20 and pool:
            same_cat = [j for j in pool if j.category == current.category]
            if same_cat:
                nxt = random.choice(same_cat)
                pool.remove(nxt)
                chaotic.append(nxt)
    return chaotic

def calculate_hesitation_delay(is_category_change: bool = False) -> float:
    """Simula vacilación humana con distribución Gaussiana."""
    if is_category_change:
        return max(10.0, random.gauss(20.0, 5.0))
    return max(4.0, random.gauss(8.5, 2.0))

@dataclass
class Progress:
    completed_urls: list[str] = field(default_factory=list)
    total_requests: int = 0
    new_providers: int = 0
    started_at: str = ""
    updated_at: str = ""

    def save(self) -> None:
        self.updated_at = datetime.now(timezone.utc).isoformat(timespec="seconds")
        PROGRESS_FILE.write_text(json.dumps({
            "completed_urls": self.completed_urls,
            "total_requests": self.total_requests,
            "new_providers": self.new_providers,
            "started_at": self.started_at or self.updated_at,
            "updated_at": self.updated_at,
        }, ensure_ascii=False, indent=2), encoding="utf-8")

def load_progress() -> Progress:
    if PROGRESS_FILE.exists():
        try:
            d = json.loads(PROGRESS_FILE.read_text(encoding="utf-8"))
            return Progress(
                completed_urls=d.get("completed_urls", []),
                total_requests=d.get("total_requests", 0),
                new_providers=d.get("new_providers", 0),
                started_at=d.get("started_at", ""),
            )
        except Exception: pass
    return Progress(started_at=datetime.now(timezone.utc).isoformat(timespec="seconds"))

def append_new_providers(batch: list[dict[str, Any]]) -> None:
    existing: dict[str, Any] = {"providers": []}
    if NEW_PROVIDERS_FILE.exists():
        try:
            existing = json.loads(NEW_PROVIDERS_FILE.read_text(encoding="utf-8"))
        except Exception: pass
    existing.setdefault("providers", []).extend(batch)
    existing["updated_at"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
    existing["total"] = len(existing["providers"])
    NEW_PROVIDERS_FILE.write_text(json.dumps(existing, ensure_ascii=False, indent=2), encoding="utf-8")

def build_raw_queue() -> list[Job]:
    queue = []
    for cat_name, path_cat in BODAS_CATEGORIES:
        for prov_name, prov_slug in PROVINCIAS:
            queue.append(Job("bodas", cat_name, prov_name, bodas_url(path_cat, prov_slug)))
            # Paginación profunda (páginas 2 a 5 para agotar todo el inventario provincial)
            for page in range(2, 6):
                p_url = f"{bodas_url(path_cat, prov_slug)}?page={page}"
                queue.append(Job("bodas", f"{cat_name} (Pág {page})", prov_name, p_url))

    for hcat_name, hcat_slug in TUBODAHOLA_CATEGORIES:
        queue.append(Job("tubodahola", hcat_name, "Nacional/Luxury", tubodahola_url(hcat_slug)))
        for page in range(2, 5):
            h_url = f"{tubodahola_url(hcat_slug)}page/{page}/"
            queue.append(Job("tubodahola", f"{hcat_name} (Pág {page})", "Nacional/Luxury", h_url))

    for fcat_name, fcat_slug in FANDERS_CATEGORIES:
        queue.append(Job("fanders", fcat_name, None, fanders_url(fcat_slug)))
    return queue

def run(args: argparse.Namespace) -> int:
    print("=" * 72, flush=True)
    print("ANTIGRAVITY OMEGA v4.1 — OPERACIÓN CAÓTICA HUMANIZADA", flush=True)
    print("=" * 72, flush=True)

    dedup = load_dedup_set()
    print(f"[FASE 2] Deduplicación inicial: {len(dedup)} registros SSOT.", flush=True)

    raw_q = build_raw_queue()
    queue = generate_humanized_chaotic_queue(raw_q)
    if args.limit and args.limit > 0:
        queue = queue[:args.limit]

    print(f"[COLA CAÓTICA] {len(queue)} tareas planificadas en orden estocástico.", flush=True)

    progress = load_progress()
    done_set = set(progress.completed_urls)
    client = HttpClient()
    pending_batch = []
    last_cat = None

    for i, job in enumerate(queue, start=1):
        if job.url in done_set: continue

        is_cat_change = (last_cat is not None and last_cat != job.category)
        last_cat = job.category

        status, html = client.get(job.url)
        progress.total_requests += 1

        if status in (403, 429):
            print(f"[WAF-BLOCK {status}] {job.url} -> Pausa de emergencia {RETRY_SLEEP_ON_BLOCK}s", flush=True)
            progress.save()
            time.sleep(RETRY_SLEEP_ON_BLOCK)
            status, html = client.get(job.url)

        if status != 200 or not html:
            print(f"[WARN {status}] {job.url} -> Ignorando.", flush=True)
            progress.completed_urls.append(job.url)
            progress.save()
            time.sleep(calculate_hesitation_delay(is_cat_change))
            continue

        provs = extract_providers(html, job.url)
        fresh = [p for p in provs if normalize_name(p["name"]) not in dedup]

        for p in fresh:
            dedup.add(normalize_name(p["name"]))
            p["captured_at"] = datetime.now(timezone.utc).isoformat()
            p["site"] = job.site
            p["category"] = job.category
            p["provincia"] = job.provincia

        if fresh:
            pending_batch.extend(fresh)
            progress.new_providers += len(fresh)
            print(f"[CRAWL OK] {job.url} -> {len(provs)} encontrados, {len(fresh)} nuevos.", flush=True)

        if len(pending_batch) >= FLUSH_EVERY_N:
            append_new_providers(pending_batch)
            pending_batch = []
            print(f"[FLUSH] Guardados {progress.new_providers} registros acumulados.", flush=True)

        progress.completed_urls.append(job.url)
        progress.save()

        if progress.total_requests % LONG_PAUSE_EVERY_N == 0:
            pause = random.uniform(LONG_PAUSE_MIN, LONG_PAUSE_MAX)
            print(f"[PAUSA LARGA] {progress.total_requests} peticiones -> Esperando {pause:.0f}s...", flush=True)
            time.sleep(pause)
        else:
            time.sleep(calculate_hesitation_delay(is_cat_change))

    if pending_batch:
        append_new_providers(pending_batch)

    progress.save()
    print(f"[FIN] Sesión completada. Nuevos proveedores: {progress.new_providers}", flush=True)
    return 0

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0)
    return run(ap.parse_args())

if __name__ == "__main__":
    raise SystemExit(main())