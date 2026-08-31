"""
FASE 1 — ABSORCIÓN TOTAL DE LA BÓVEDA LOCAL (EAR_ABSORBED_VAULT)
- Extrae de cada página HTML de proveedor (--eNNNNN.htm): name, category, location,
  price_range, rating, reviews_count, telephone, description_full, services_list, faqs,
  image_urls (resolución máxima desde <picture>/<source srcset>).
- Descarga imágenes a H:\\00_PRODUCTORA_EAR\\EAR_ABSORBED_VAULT\\ASSETS\\{provider_slug}\\ (cero hotlinking).
- Salida: scripts/nightcrawler_results/vault_absorbed_providers.json (resumible vía vault_progress.json)
Uso:
  python scripts/vault_absorber.py --parse-only   # sin red
  python scripts/vault_absorber.py                # parse + imágenes
  python scripts/vault_absorber.py --images-only  # solo espejo de imágenes
  python scripts/vault_absorber.py --limit 20     # prueba corta
"""
from __future__ import annotations

import argparse
import json
import random
import re
import sys
import time
from pathlib import Path
from typing import Any, Optional

try:
    from bs4 import BeautifulSoup
except ImportError:  # pragma: no cover
    print("FALTA_DEP: beautifulsoup4 -> python -m pip install beautifulsoup4 lxml")
    raise

VAULT = Path(r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT")
ASSETS_ROOT = VAULT / "ASSETS"
RESULTS_DIR = Path(__file__).resolve().parent / "nightcrawler_results"
OUT_JSON = RESULTS_DIR / "vault_absorbed_providers.json"
PROGRESS_JSON = RESULTS_DIR / "vault_progress.json"

PROVIDER_RE = re.compile(r"--e\d+\.(htm|html)$", re.I)
PHONE_RE = re.compile(r"(?:\+34)?[\s\-]?[6789]\d{2}[\s\-]?\d{3}[\s\-]?\d{3}")
LDJSON_RE = re.compile(
    r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', re.I | re.S
)

MAX_IMAGES_PER_PROVIDER = 8
IMG_DELAY_RANGE = (0.4, 1.2)
PARSE_FLUSH_EVERY = 25


def log(msg: str) -> None:
    print(f"[VAULT_ABSORBER] {msg}", flush=True)


def slugify(text: str, max_len: int = 80) -> str:
    """Slug NTFS-safe (<=80 chars, sin caracteres ilegales Windows)."""
    s = text.lower().strip()
    s = re.sub(r"[<>:\"/\\|?*\n\r\t]", "_", s)
    s = re.sub(r"[\s\-_]+", "-", s).strip("-_.")
    return s[:max_len] or "proveedor"


def is_valid_phone(raw: str) -> bool:
    digits = re.sub(r"\D", "", raw)
    return len(digits) == 9 and digits[0] in "6789"


def extract_phones(text: str, tel_links: list[str]) -> Optional[str]:
    """Teléfono preferido desde href=tel:, fallback regex estricta (el más frecuente)."""
    for t in tel_links:
        if is_valid_phone(t):
            return re.sub(r"\D", "", t)
    candidates = [p for p in PHONE_RE.findall(text) if is_valid_phone(p)]
    if not candidates:
        return None
    freq: dict[str, int] = {}
    for c in candidates:
        key = re.sub(r"\D", "", c)
        freq[key] = freq.get(key, 0) + 1
    best = max(freq.items(), key=lambda kv: (kv[1], kv[0]))[0]
    return f"+34{best}" if not best.startswith("34") else best


def pick_max_res(srcset_attr: str) -> Optional[str]:
    """Elige la URL de mayor anchura declarada en un atributo srcset."""
    best_url, best_w = None, -1
    for part in srcset_attr.split(","):
        tokens = part.strip().split()
        if not tokens:
            continue
        url = tokens[0]
        w = 0
        if len(tokens) > 1 and tokens[-1].endswith("w"):
            try:
                w = int(tokens[-1][:-1])
            except ValueError:
                w = 0
        if w == 0:
            m = re.search(r"/(\d{3,5})/", url)
            if m:
                w = int(m.group(1))
        if w > best_w:
            best_url, best_w = url, w
    return best_url


def parse_ldjson(text: str) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    for block in LDJSON_RE.findall(text):
        try:
            data = json.loads(block.strip())
        except (json.JSONDecodeError, ValueError):
            continue
        if isinstance(data, dict):
            items.append(data)
        elif isinstance(data, list):
            items.extend(d for d in data if isinstance(d, dict))
    return items


def find_local_business(items: list[dict[str, Any]]) -> Optional[dict[str, Any]]:
    for it in items:
        t = str(it.get("@type", ""))
        if "LocalBusiness" in t or "Organization" in t or "Venue" in t:
            return it
    return None


def extract_faq(soup: BeautifulSoup) -> list[dict[str, str]]:
    """FAQs desde LD+JSON (FAQPage); fallback sección HTML 'Preguntas frecuentes'."""
    faqs: list[dict[str, str]] = []
    for block in LDJSON_RE.findall(str(soup)):
        try:
            data = json.loads(block.strip())
        except (json.JSONDecodeError, ValueError):
            continue
        nodes = data if isinstance(data, list) else [data]
        for n in nodes:
            if not isinstance(n, dict) or n.get("@type") != "FAQPage":
                continue
            for q in n.get("mainEntity", [])[:10]:
                if not isinstance(q, dict):
                    continue
                ans = q.get("acceptedAnswer")
                faqs.append({
                    "q": str(q.get("name", ""))[:300],
                    "a": (str(ans.get("text", "")) if isinstance(ans, dict) else str(ans or ""))[:600],
                })
    if faqs:
        return faqs

    for h in soup.find_all(["h2", "h3"]):
        if "preguntas frecuentes" not in str(h.get_text()).lower():
            continue
        node = h.find_next_sibling()
        count = 0
        while node is not None and count < 10:
            if node.name in ("h2", "h3"):
                break
            q_el = node.find(["strong", "b"]) or (node if node.name in ("p", "li") else None)
            a_el = node.find("p") if node.name not in ("p", "li") else None
            if q_el is not None:
                faqs.append({
                    "q": re.sub(r"\s+", " ", str(q_el.get_text())).strip()[:300],
                    "a": re.sub(r"\s+", " ", str(a_el.get_text() if a_el else node.get_text("string"))).strip()[:600],
                })
                count += 1
            node = node.find_next_sibling()
        break
    return faqs


def extract_services(soup: BeautifulSoup) -> list[str]:
    """Lista de servicios desde la sección '¿Qué servicios ofreces?'."""
    services: list[str] = []
    for h in soup.find_all(["h2", "h3"]):
        if "servicios" not in str(h.get_text()).lower():
            continue
        node = h.find_next_sibling()
        while node is not None and len(services) < 15:
            if node.name in ("h2", "h3"):
                break
            for li in node.find_all("li")[:15]:
                s = re.sub(r"\s+", " ", str(li.get_text())).strip()
                if 2 < len(s) < 80:
                    services.append(s)
            node = node.find_next_sibling()
        break
    seen: set[str] = set()
    out: list[str] = []
    for s in services:
        k = s.lower()
        if k not in seen:
            seen.add(k)
            out.append(s)
    return out


def extract_images(soup: BeautifulSoup, base_url: str) -> list[dict[str, Any]]:
    """URLs de resolución máxima desde <picture>/<source srcset> e <img>. Dedup por URL."""
    urls: list[str] = []

    def push(u: Optional[str]) -> None:
        if not u:
            return
        from urllib.parse import urljoin, urlparse
        absu = urljoin(base_url, u.strip())
        p = urlparse(absu)
        if p.scheme in ("http", "https") and absu not in urls:
            urls.append(absu)

    for pic in soup.find_all("picture"):
        srcs = pic.find_all("source")
        best: Optional[str] = None
        best_w = -1
        for s in srcs:
            ss = s.get("srcset") or ""
            cand = pick_max_res(ss)
            if cand is None and len(srcs) == 0:
                continue
            # estimar anchura del candidato para comparar entre <source>
            w = -1
            for part in ss.split(","):
                toks = part.strip().split()
                if toks and toks[-1].endswith("w"):
                    try:
                        w = max(w, int(toks[-1][:-1]))
                    except ValueError:
                        pass
            if cand is not None and w > best_w:
                best, best_w = cand, w
        push(best)
        img = pic.find("img")
        if img is not None:
            push(img.get("src"))

    for img in soup.find_all("img"):
        srcset = img.get("srcset") or ""
        if srcset:
            push(pick_max_res(srcset))
        else:
            push(img.get("src"))

    return [{"url": u} for u in urls[:40]]


def parse_provider_file(path: Path) -> dict[str, Any]:
    """Extrae el registro completo de una página HTML de proveedor."""
    raw = path.read_text(encoding="utf-8", errors="replace")
    soup = BeautifulSoup(raw, "lxml" if "lxml" in str(BeautifulSoup.__module__) else "html.parser")

    ld_items = parse_ldjson(raw)
    lb = find_local_business(ld_items) or {}

    name = (lb.get("name") or soup.title.get_text(strip=True) if soup.title else "") or path.stem
    # limpiar sufijos de marca del <title>
    name = re.sub(r"\s*\|\s*(Bodas\.net|FANDERS).*", "", str(name)).strip()

    location: Optional[str] = None
    addr = lb.get("address")
    if isinstance(addr, dict):
        parts = [addr.get(k) for k in ("streetAddress", "addressLocality", "postalCode")]
        region = addr.get("addressRegion") or ""
        loc = ", ".join(p for p in parts if p)
        location = f"{loc}, {region}" if region else (loc or None)
    elif isinstance(addr, str):
        location = addr

    # fallback ubicación desde breadcrumbs / meta
    if not location:
        bc = soup.find("nav", attrs={"aria-label": re.compile("breadcrumb", re.I)})
        if bc is not None:
            crumbs = [c.get_text(strip=True) for c in bc.find_all(["a", "span"]) if c.get_text(strip=True)]
            if len(crumbs) >= 2:
                location = ", ".join(crumbs[-2:])

    rating, reviews_count = None, None
    agg = lb.get("aggregateRating") or {}
    if isinstance(agg, dict):
        try:
            rating = round(float(agg.get("ratingValue")), 1)
        except (TypeError, ValueError):
            rating = None
        try:
            reviews_count = int(agg.get("reviewCount", agg.get("ratingCount", 0))) or None
        except (TypeError, ValueError):
            reviews_count = None

    # fallback rating desde HTML (aria-label / data-attributes)
    if rating is None:
        m = re.search(r"(\d[.,]\d)\s*(?:de|/)\s*5", raw[:20000])
        if m:
            try:
                rating = round(float(m.group(1).replace(",", ".")), 1)
            except ValueError:
                pass

    price_range: Optional[str] = None
    for pat in (r"(\d[\d\s.,]*)\s*€?\s*(?:a|–|-|—)\s*(\d[\d\s.,]*)\s*€",):
        m = re.search(pat, raw)
        if m:
            price_range = f"{m.group(1).strip()} € - {m.group(2).strip()} €"
            break

    tel_links = [a.get("href") for a in soup.find_all("a", href=re.compile(r"^tel:", re.I))]
    telephone = extract_phones(raw, tel_links)

    # descripción: preferir LD+JSON description; si no, texto principal de la ficha
    desc = str(lb.get("description") or "").strip()
    if len(desc) < 120:
        main = soup.find("main") or soup.body or soup
        text = re.sub(r"\s+", " ", main.get_text(" ", strip=True))
        # recortar ruido de navegación inicial
        idx = text.lower().find("servicios")
        desc = (text[idx - 400: idx + 2600] if idx > 400 else text[:3000]).strip()

    base_url = f"https://www.bodas.net/{path.parent.name}/" if path.parent.name.startswith("e") else "https://www.bodas.net/"
    images = extract_images(soup, base_url)

    return {
        "name": name[:200],
        "category": None,  # se rellena desde el índice de la bóveda si existe
        "location": location,
        "price_range": price_range,
        "rating": rating,
        "reviews_count": reviews_count,
        "telephone": telephone,
        "description_full": desc[:4000],
        "services_list": extract_services(soup),
        "faqs": extract_faq(soup)[:12],
        "image_urls": images,
        "local_images": [],
        "source_file": str(path.relative_to(VAULT)) if VAULT in path.parents else path.name,
    }


def enumerate_provider_files() -> list[Path]:
    files: list[Path] = []
    for p in VAULT.rglob("*"):
        try:
            if p.is_file() and PROVIDER_RE.search(p.name):
                files.append(p)
        except OSError:
            continue
    return sorted(files, key=lambda x: str(x).lower())


def load_progress() -> dict[str, Any]:
    if PROGRESS_JSON.exists():
        try:
            data = json.loads(PROGRESS_JSON.read_text(encoding="utf-8"))
            if isinstance(data, dict):
                return data
        except (json.JSONDecodeError, ValueError):
            pass
    return {"parsed": [], "images_done": {}, "failed_images": []}


def save_progress(prog: dict[str, Any]) -> None:
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    tmp = PROGRESS_JSON.with_suffix(".tmp")
    tmp.write_text(json.dumps(prog, ensure_ascii=False), encoding="utf-8")
    tmp.replace(PROGRESS_JSON)


def load_results() -> list[dict[str, Any]]:
    if OUT_JSON.exists():
        try:
            data = json.loads(OUT_JSON.read_text(encoding="utf-8"))
            if isinstance(data, dict):
                return data.get("providers", [])
            if isinstance(data, list):
                return data
        except (json.JSONDecodeError, ValueError):
            pass
    return []


def save_results(providers: list[dict[str, Any]]) -> None:
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    payload = {
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
        "source": "EAR_ABSORBED_VAULT (Fase 1 — absorción local, cero red)",
        "total": len(providers),
        "providers": providers,
    }
    tmp = OUT_JSON.with_suffix(".tmp")
    tmp.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8")
    tmp.replace(OUT_JSON)


def run_parse(limit: Optional[int]) -> list[dict[str, Any]]:
    files = enumerate_provider_files()
    log(f"Archivos de proveedor detectados en bóveda: {len(files)}")
    if not files:
        log("ERROR: no se encontraron páginas --eNNNNN.htm en la bóveda.")
        return []

    prog = load_progress()
    parsed_set = set(prog.get("parsed", []))
    results = load_results()
    by_source = {r.get("source_file"): r for r in results if r.get("source_file")}

    todo = [f for f in files if str(f) not in parsed_set]
    if limit:
        todo = todo[:limit]
    log(f"Pendientes de parsear: {len(todo)} (ya procesados: {len(parsed_set)})")

    new_count = 0
    for i, path in enumerate(todo, 1):
        try:
            rec = parse_provider_file(path)
        except Exception as exc:  # noqa: BLE001 — tolerancia a fallos por archivo
            log(f"PARSE_ERROR {path.name}: {exc}")
            continue
        key = str(path)
        existing = by_source.get(rec["source_file"])
        if existing is not None:
            results[results.index(existing)] = rec
        else:
            results.append(rec)
        parsed_set.add(key)
        new_count += 1
        if i % PARSE_FLUSH_EVERY == 0 or i == len(todo):
            save_results(results)
            prog["parsed"] = sorted(parsed_set)
            save_progress(prog)
            log(f"PARSE {i}/{len(todo)} — total registros: {len(results)}")

    save_results(results)
    prog["parsed"] = sorted(parsed_set)
    save_progress(prog)
    log(f"FASE PARSE COMPLETADA. Registros totales: {len(results)} (nuevos: {new_count})")
    return results


def download_images(limit_providers: Optional[int], max_images: int) -> None:
    try:
        from curl_cffi import requests as cffi_requests
    except ImportError:  # pragma: no cover
        log("FALTA_DEP: curl_cffi -> python -m pip install curl_cffi")
        return

    results = load_results()
    if not results:
        log("No hay resultados que procesar (ejecuta primero el parse).")
        return

    prog = load_progress()
    done_map: dict[str, list[str]] = {k: v for k, v in prog.get("images_done", {}).items()}
    failed: list[dict[str, str]] = list(prog.get("failed_images", []))

    pending = [r for r in results if r.get("image_urls") and r["name"] not in done_map]
    if limit_providers:
        pending = pending[:limit_providers]
    log(f"Proveedores pendientes de espejo de imágenes: {len(pending)} (completados: {len(done_map)})")

    client = cffi_requests.Session(impersonate="chrome110")
    headers = {
        "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        "Accept-Language": "es-ES,es;q=0.9",
        "Referer": "https://www.bodas.net/",
    }

    completed = 0
    for rec in pending:
        slug = slugify(rec["name"])
        dest_dir = ASSETS_ROOT / slug
        try:
            dest_dir.mkdir(parents=True, exist_ok=True)
        except OSError as exc:
            log(f"DIR_ERROR {slug}: {exc}")
            continue

        local_paths: list[str] = []
        for idx, img in enumerate(rec.get("image_urls", [])[:max_images], 1):
            url = img["url"] if isinstance(img, dict) else str(img)
            ext_m = re.search(r"\.(jpe?g|png|webp|avif)(?:\?|$)", url, re.I)
            ext = f".{ext_m.group(1).lower()}" if ext_m else ".jpg"
            dest = dest_dir / f"{idx:02d}{ext}"
            try:
                resp = client.get(url, headers=headers, timeout=30)
                if resp.status_code == 200 and resp.content:
                    dest.write_bytes(resp.content)
                    local_paths.append(str(dest))
                else:
                    failed.append({"provider": rec["name"], "url": url, "status": str(resp.status_code)})
            except Exception as exc:  # noqa: BLE001 — tolerancia a fallos por imagen
                failed.append({"provider": rec["name"], "url": url, "error": str(exc)[:200]})
            time.sleep(random.uniform(*IMG_DELAY_RANGE))

        rec["local_images"] = local_paths
        done_map[rec["name"]] = local_paths
        completed += 1
        if completed % PARSE_FLUSH_EVERY == 0 or completed == len(pending):
            save_results(results)
            prog["images_done"] = done_map
            prog["failed_images"] = failed[-200:]
            save_progress(prog)
            log(f"IMAGES {completed}/{len(pending)} — último: {slug} ({len(local_paths)} imgs)")

    save_results(results)
    prog["images_done"] = done_map
    prog["failed_images"] = failed[-200:]
    save_progress(prog)
    log(f"FASE IMÁGENES COMPLETADA. Proveedores con espejo local: {len(done_map)}")


def main() -> int:
    ap = argparse.ArgumentParser(description="Fase 1 — Absorción de la bóveda local EAR_ABSORBED_VAULT")
    ap.add_argument("--parse-only", action="store_true", help="Solo parseo HTML, sin red")
    ap.add_argument("--images-only", action="store_true", help="Solo espejo de imágenes (requiere parse previo)")
    ap.add_argument("--limit", type=int, default=None, help="Límite de archivos/proveedores (prueba corta)")
    ap.add_argument("--max-images", type=int, default=MAX_IMAGES_PER_PROVIDER)
    args = ap.parse_args()

    if not VAULT.exists():
        log(f"ERROR: la bóveda no existe en {VAULT}")
        return 2

    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    t0 = time.time()

    if args.images_only:
        download_images(args.limit, args.max_images)
    else:
        results = run_parse(args.limit)
        if not args.parse_only and results:
            download_images(args.limit, args.max_images)

    log(f"TIEMPO_TOTAL {int(time.time() - t0)}s")
    return 0


if __name__ == "__main__":
    sys.exit(main())
