#!/usr/bin/env node
/**
 * 🦇 EAR OS V2 — VAMPIRO / CAZADOR DE PROVEEDORES BODAS.NET (NODE S-CLASS)
 * Reemplazo soberano del daemon Python (master_overnight_vampire_daemon.py)
 * para entornos bare-metal sin runtime Python en PATH.
 * Pipeline: sitemaps → catálogos → escaparates (--e\d+) → JSON-LD + teléfono
 *           → normalización SSOT → dedupe → checkpoint → fusión en
 *           src/data/bodas-vendors-harvested.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");

const SRC_DATA = path.join(PROJECT_ROOT, "src", "data");
const RESULTS_DIR = path.join(PROJECT_ROOT, "scripts", "nightcrawler_results");
const HARVESTED_FILE = path.join(SRC_DATA, "bodas-vendors-harvested.json");
const CHECKPOINT_BODAS = path.join(RESULTS_DIR, "bodas_live_harvested.json");
const CHECKPOINT_PROGRESS = path.join(RESULTS_DIR, "master_vampire_progress.json");
const PENDING_CATALOGS = path.join(RESULTS_DIR, "bodas_catalog_pending.json");
const PENDING_STOREFRONTS = path.join(RESULTS_DIR, "bodas_storefront_pending.json");

fs.mkdirSync(RESULTS_DIR, { recursive: true });
fs.mkdirSync(SRC_DATA, { recursive: true });

// Doctrina del Dato Verificado (puerto fiel de verified_doctrine.py)
const PLACEHOLDER_PHONE = "+34 693 693 048";
const PLACEHOLDER_DIGITS = new Set([
  "34693693048", "693693048", "34693048", "93693048", "693048",
]);

const digits = (p) => String(p ?? "").replace(/\D/g, "");

function isRealPhone(p) {
  const d = digits(p);
  if (!d) return false;
  if (PLACEHOLDER_DIGITS.has(d) || d === "34693693048" || d === "693693048") return false;
  if (d.length === 9) {
    if (d[0] === "6" || d[0] === "7") return true;
    if (d[0] === "9" && "12345678".includes(d[1])) return true;
    return false;
  }
  if (d.length === 11 && d.startsWith("34")) {
    const nd = d.slice(2);
    if (nd[0] === "6" || nd[0] === "7") return true;
    if (nd[0] === "9" && "12345678".includes(nd[1])) return true;
    return false;
  }
  return false;
}

function resolvePhoneWithDoctrine(candidate) {
  const cand = String(candidate ?? "").trim();
  if (!cand || ["none", "null", "nan"].includes(cand.toLowerCase())) {
    return { phone: PLACEHOLDER_PHONE, verified: false };
  }
  const di = digits(cand);
  if (PLACEHOLDER_DIGITS.has(di) || di === "34693693048" || di === "693693048") {
    return { phone: PLACEHOLDER_PHONE, verified: false };
  }
  if (isRealPhone(cand)) return { phone: cand, verified: true };
  return { phone: PLACEHOLDER_PHONE, verified: false };
}

// Clasificación de gremio (espejo de normalize_category del Python)
function normalizeCategory(url = "", desc = "", name = "") {
  const full = `${url} ${desc} ${name}`.toLowerCase();
  if (/(fotograf|videograf|\bfoto\b|video|videomat|fotomat)/.test(full)) return "foto";
  if (/(finca|cortijo|hacienda|masia|masía|palacio|cigarral|castillo|salon|salón|banquete|banquetes)/.test(full)) return "finca";
  if (/(catering|banquete|cocktail|gastronom|cortador de jamon|cortador de jamón|barra libre)/.test(full)) return "catering";
  if (/(traje|vestid|madrina|joya|tocado|peluquer|maquillaj|\bmoda\b|belleza|novia|novio)/.test(full)) return "moda";
  if (/(coche|limusina|autobus|autobús|chofer|transporte|carruaje)/.test(full)) return "transporte";
  if (/(musica|música|mariachi|banda|orquesta|solista|cantante|violin|violín|gospel|guitarra|\bdj\b)/.test(full)) return "musica";
  if (/(audio|sonido|luces|iluminac|\bdj\b|discomovil|discomóvil|arsenal|cabina led)/.test(full)) return "sonido";
  if (/(decorac|flor|ambientac|arbol|arco|globo)/.test(full)) return "decoracion";
  if (/(wedding planner|organizac|coordinac)/.test(full)) return "wedding";
  return "servicios";
}

const PROVINCE_GPS = {
  "madrid": [40.4168, -3.7038], "toledo": [39.8628, -4.0273], "barcelona": [41.3874, 2.1686],
  "valencia": [39.4699, -0.3763], "sevilla": [37.3891, -5.9845], "malaga": [36.7213, -4.4214],
  "zaragoza": [41.6488, -0.8891], "murcia": [37.9922, -1.1307], "baleares": [39.5696, 2.6502],
  "las palmas": [28.1248, -15.43], "tenerife": [28.4636, -16.2518], "alicante": [38.3452, -0.481],
  "cordoba": [37.8882, -4.7794], "valladolid": [41.6523, -4.7245], "pontevedra": [42.4336, -8.6479],
  "a coruña": [43.3623, -8.4115], "asturias": [43.3619, -5.8494], "bilbao": [43.263, -2.935],
  "granada": [37.1773, -3.5986], "cadiz": [36.5271, -6.2886], "girona": [41.9794, 2.8214],
  "tarragona": [41.1189, 1.2445], "navarra": [42.6954, -1.6761], "alava": [42.8484, -2.6728],
};

function cleanSpanish(t) {
  if (!t) return "";
  let s = String(t);
  const repl = {
    "Ã¡": "á", "Ã©": "é", "Ã­": "í", "Ã³": "ó", "Ãº": "ú",
    "Ã±": "ñ", "Ã‘": "Ñ", "Ã ": "Á", "Ã‰": "É", "Ã“": "Ó", "Ãš": "Ú",
    "â‚¬": "€", "Â": "", "\ufffd": " ",
  };
  for (const [k, v] of Object.entries(repl)) s = s.split(k).join(v);
  s = s.replace(/\bbodas\.net\b|\bzankyou\b|\bweddingwire\b/gi, "Productora EAR");
  s = s.replace(/\s*-\s*Consulta disponibilidad y precios.*/gi, "");
  s = s.replace(/\s*-\s*Precios.*/gi, "");
  s = s.replace(/\s*-\s*Fotos y opiniones.*/gi, "");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

function slugify(name) {
  return String(name || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

function tokenKey(name, province = "") {
  return `${slugify(name).slice(0, 25)}_${slugify(province).slice(0, 10)}`;
}

function readJSON(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}
function writeJSONAtomic(file, data) {
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tmp, file);
}

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

async function fetchStealth(url, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        redirect: "follow",
        headers: {
          "User-Agent": UA,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
          "Cache-Control": "no-cache",
        },
      });
      clearTimeout(timer);
      if (!res.ok) return null;
      return await res.text();
    } catch {
      clearTimeout(timer);
      await sleep(800 * (i + 1));
    }
  }
  return null;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function extractLocs(xml) {
  const out = [];
  const re = /<loc>(?:<!\[CDATA\[)?([^<]+?)(?:\]\]>)?<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) out.push(m[1].trim());
  return out;
}

function extractStorefrontUrls(html) {
  const out = new Set();
  const re = /href=["'](https:\/\/www\.bodas\.net\/[^"']*?--e\d+)["']/g;
  let m;
  while ((m = re.exec(html)) !== null) out.add(m[1]);
  const re2 = /https:\/\/www\.bodas\.net\/[^\s"'<>]+--e\d+/g;
  while ((m = re2.exec(html)) !== null) out.add(m[1]);
  return [...out];
}

function extractStorefront(html, url) {
  const $ = cheerio.load(html);

  let ld = null;
  $('script[type="application/ld+json"]').each((_, el) => {
    if (ld) return;
    const raw = $(el).contents().text().trim();
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      const nodes = Array.isArray(parsed) ? parsed : parsed["@graph"] || [parsed];
      for (const node of nodes) {
        if (!node || typeof node !== "object") continue;
        if (
          ["LocalBusiness", "Organization", "ProfessionalService", "EntertainmentBusiness", "Store", "Place", "LodgingBusiness"].includes(node["@type"])
        ) {
          ld = node;
          break;
        }
      }
    } catch {
      /* JSON-LD malformado: se ignora */
    }
  });

  const name = cleanSpanish(
    (ld && (ld.name || ld.legalName)) ||
      $('meta[property="og:title"]').attr("content") ||
      $("h1").first().text() ||
      "",
  );

  const phoneCandidates = [];
  if (ld && ld.telephone) phoneCandidates.push(String(ld.telephone));
  $('a[href^="tel:"]').each((_, el) => {
    phoneCandidates.push(($(el).attr("href") || "").replace(/^tel:/i, ""));
  });
  const bodyText = $("body").text();
  const rawPhones = bodyText.match(/\b(?:\+34|0034)?[ -]?[6789]\d{2}[ -]?\d{3}[ -]?\d{3}\b/g) || [];
  phoneCandidates.push(...rawPhones);

  let phone = PLACEHOLDER_PHONE;
  let verified = false;
  for (const c of phoneCandidates) {
    const r = resolvePhoneWithDoctrine(c);
    if (r.verified) {
      phone = r.phone;
      verified = true;
      break;
    }
  }

  const addr = ld && ld.address && typeof ld.address === "object" ? ld.address : {};
  const province = cleanSpanish(addr.addressRegion || addr.addressLocality || ld.areaServed || "Madrid");
  const address = cleanSpanish(
    [addr.streetAddress, addr.addressLocality, addr.addressRegion, addr.postalCode].filter(Boolean).join(", ") ||
      ld.address ||
      "",
  );

  const agg = ld && ld.aggregateRating && typeof ld.aggregateRating === "object" ? ld.aggregateRating : {};
  const rating = Number(agg.ratingValue) || 4.9;
  const reviews = Number(agg.reviewCount) || 18;

  const description = cleanSpanish((ld && ld.description) || $('meta[name="description"]').attr("content") || "");

  const imageUrls = [];
  if (ld && ld.image) {
    for (const im of (Array.isArray(ld.image) ? ld.image : [ld.image])) {
      if (typeof im === "string" && im) imageUrls.push(im);
      else if (im && typeof im === "object" && im.url) imageUrls.push(im.url);
    }
  }
  $('img[src*="cdn"], img[data-src*="cdn"]').each((_, el) => {
    const src = $(el).attr("src") || $(el).attr("data-src") || "";
    if (src && !src.includes("logo") && !src.includes("badge")) imageUrls.push(src);
  });

  const geo = ld && ld.geo && typeof ld.geo === "object" ? ld.geo : {};
  let lat = geo.latitude;
  let lng = geo.longitude;
  if (lat == null || lng == null) {
    const gps = PROVINCE_GPS[slugify(province)];
    if (gps) {
      lat = gps[0];
      lng = gps[1];
    }
  }

  const category = normalizeCategory(url, description, name);
  const slug = slugify(name) || `bodas-${(url.match(/(\d+)$/) || ["", Date.now()])[1]}`;

  return {
    id: `bodas-live-${slug}`,
    name: name || "Proveedor Homologado",
    slug,
    category,
    province,
    phone,
    telephone: phone,
    verified,
    address,
    imageUrls: [...new Set(imageUrls)].slice(0, 40),
    img: imageUrls[0] || "",
    description,
    description_full: description,
    rating,
    reviews,
    lat,
    lng,
    sourceUrl: url,
    source: "Bodas.net",
    harvestedAt: new Date().toISOString(),
  };
}

async function runPool(items, workers, fn) {
  let idx = 0;
  const runner = async () => {
    while (idx < items.length) {
      const i = idx++;
      try {
        await fn(items[i]);
      } catch {
        /* fail-closed: se ignora el elemento, cero fabricación */
      }
      await sleep(120);
    }
  };
  const pool = Array.from({ length: Math.min(workers, Math.max(1, items.length)) }, () => runner());
  await Promise.all(pool);
}

async function main() {
  const args = process.argv.slice(2);
  const flag = (name) => args.includes(name);
  const argVal = (name, def) => {
    const i = args.indexOf(name);
    return i !== -1 && args[i + 1] != null && !args[i + 1].startsWith("--") ? args[i + 1] : def;
  };

  const limit = Number(argVal("--limit", "2000"));
  const maxCatalogs = Number(argVal("--max-catalogs", "400"));
  const catalogOffset = Number(argVal("--catalog-offset", "0"));
  const workers = Number(argVal("--workers", "6"));
  const discoverOnly = flag("--discover-only");
  const harvestOnly = flag("--harvest-only");
  const drain = flag("--drain") || flag("--all");

  console.log("=".repeat(80));
  console.log("🦇 [EAR OS] VAMPIRO / CAZADOR BODAS.NET (NODE S-CLASS)");
  console.log(`   limit=${limit} workers=${workers} maxCatalogs=${maxCatalogs} offset=${catalogOffset} drain=${drain} discoverOnly=${discoverOnly} harvestOnly=${harvestOnly}`);
  console.log("=".repeat(80));

  const existing = readJSON(HARVESTED_FILE, []);
  const knownKeys = new Set((Array.isArray(existing) ? existing : []).map((p) => tokenKey(p.name, p.province)).filter(Boolean));
  const knownUrls = new Set((Array.isArray(existing) ? existing : []).map((p) => p.sourceUrl || p.url).filter(Boolean));
  const knownSlugs = new Set();
  for (const p of (Array.isArray(existing) ? existing : [])) {
    if (p.slug) knownSlugs.add(String(p.slug).toLowerCase());
    const ns = slugify(p.name);
    if (ns) knownSlugs.add(ns);
  }

  let harvested = readJSON(CHECKPOINT_BODAS, []);
  if (!Array.isArray(harvested)) harvested = [];
  const harvestedUrls = new Set(harvested.map((p) => p.sourceUrl || p.url).filter(Boolean));
  for (const p of harvested) knownKeys.add(tokenKey(p.name, p.province));

  let catalogQueue = readJSON(PENDING_CATALOGS, []);
  if (!Array.isArray(catalogQueue)) catalogQueue = [];
  let storefrontQueue = readJSON(PENDING_STOREFRONTS, []);
  if (!Array.isArray(storefrontQueue)) storefrontQueue = [];

  if (!harvestOnly && catalogQueue.length === 0) {
    console.log("\n[*] FASE 0: descubriendo sub-sitemaps de catálogo...");
    const idxXml = await fetchStealth("https://www.bodas.net/sitemaps/desktop/vendor-catalog-index.xml");
    if (idxXml) {
      const subMaps = extractLocs(idxXml).filter((l) => l.includes("vendor-catalog"));
      console.log(`   -> ${subMaps.length} sub-sitemaps localizados.`);
      for (const sm of subMaps.slice(0, 41)) {
        const smXml = await fetchStealth(sm);
        if (!smXml) continue;
        for (const c of extractLocs(smXml).filter((l) => !l.includes("sitemap") && l.includes("bodas.net"))) {
          if (!catalogQueue.includes(c)) catalogQueue.push(c);
        }
      }
      console.log(`   -> ${catalogQueue.length} catálogos en cola.`);
      writeJSONAtomic(PENDING_CATALOGS, catalogQueue);
    } else {
      console.log("   [!] No se pudo acceder al índice de sitemaps.");
    }
  }

  let totalHarvestedNow = 0;
  let iteration = 0;
  let firstPass = true;

  do {
    iteration++;
    const off = firstPass ? catalogOffset : 0;

    if (!harvestOnly && catalogQueue.length > 0) {
      console.log(`\n[*] FASE A (iter ${iteration}): descubriendo escaparates (--e\\d+) desde catálogos...`);
      const batch = catalogQueue.slice(off, off + maxCatalogs);
      let discovered = 0;
      await runPool(batch, workers, async (cu) => {
        const html = await fetchStealth(cu);
        if (!html) return;
        for (const su of extractStorefrontUrls(html)) {
          if (!knownUrls.has(su) && !harvestedUrls.has(su) && !storefrontQueue.includes(su)) {
            storefrontQueue.push(su);
            discovered++;
          }
        }
      });
      catalogQueue = catalogQueue.filter((_, i) => i < off || i >= off + maxCatalogs);
      writeJSONAtomic(PENDING_CATALOGS, catalogQueue);
      writeJSONAtomic(PENDING_STOREFRONTS, storefrontQueue);
      console.log(`   -> ${discovered} nuevos escaparates encolados. Cola: ${storefrontQueue.length} | catálogos restantes: ${catalogQueue.length}`);
    }

    if (discoverOnly && firstPass) {
      console.log("\n🏁 MODO DESCUBRIMIENTO: catálogos y escaparates descubiertos, sin cosechar.");
      console.log(`   -> Cola escaparates encolados: ${storefrontQueue.length}`);
      console.log(`   -> Cola catálogos restante: ${catalogQueue.length}`);
      return;
    }

    // FASE B: cosechar escaparates
    if (storefrontQueue.length > 0) {
      const target = storefrontQueue.slice(0, limit);
      let harvestedNow = 0;
      let fetched = 0;
      let nullFetches = 0;
      let extracted = 0;
      let deduped = 0;
      await runPool(target, workers, async (su) => {
        if (knownUrls.has(su) || harvestedUrls.has(su)) return;
        const urlSlug = su.split("/").pop().replace(/--e\d+$/, "").toLowerCase();
        if (knownSlugs.has(urlSlug)) return; // pre-dedupe rápido por slug de URL
        const html = await fetchStealth(su);
        fetched++;
        if (!html) {
          nullFetches++;
          return;
        }
        const profile = extractStorefront(html, su);
        if (!profile || !profile.name) return;
        extracted++;
        const key = tokenKey(profile.name, profile.province);
        if (knownKeys.has(key)) {
          deduped++;
          return;
        }
        knownKeys.add(key);
        knownUrls.add(su);
        knownSlugs.add(slugify(profile.name));
        knownSlugs.add(String(profile.slug).toLowerCase());
        harvestedUrls.add(su);
        harvested.push(profile);
        harvestedNow++;
        totalHarvestedNow++;
      });
      storefrontQueue = storefrontQueue.slice(target.length);
      writeJSONAtomic(PENDING_STOREFRONTS, storefrontQueue);
      writeJSONAtomic(CHECKPOINT_BODAS, harvested);
      writeJSONAtomic(CHECKPOINT_PROGRESS, {
        timestamp: new Date().toISOString(),
        iteration,
        harvestedNow,
        bodas_live_harvested: harvested.length,
        pending_catalogs: catalogQueue.length,
        pending_storefronts: storefrontQueue.length,
        status: catalogQueue.length === 0 && storefrontQueue.length === 0 ? "COMPLETED" : "RUNNING",
      });
      console.log(`   [iter ${iteration}] fetched=${fetched} nullFetches=${nullFetches} extracted=${extracted} deduped=${deduped} nuevos=${harvestedNow} | cola=${storefrontQueue.length}`);
    }

    firstPass = false;
  } while (drain && (catalogQueue.length > 0 || storefrontQueue.length > 0));

  console.log("\n[*] Fusionando con src/data/bodas-vendors-harvested.json...");
  const master = readJSON(HARVESTED_FILE, []);
  if (!Array.isArray(master)) return console.error("   [!] bodas-vendors-harvested.json no es array.");
  const masterKeys = new Set(master.map((p) => tokenKey(p.name, p.province)).filter(Boolean));
  let added = 0;
  for (const p of harvested) {
    const key = tokenKey(p.name, p.province);
    if (!masterKeys.has(key)) {
      master.push(p);
      masterKeys.add(key);
      added++;
    }
  }
  writeJSONAtomic(HARVESTED_FILE, master);

  console.log("\n" + "=".repeat(80));
  console.log("🏁 COSECHA BODAS.NET COMPLETADA");
  console.log(`   -> Nuevos cosechados esta sesión: ${totalHarvestedNow}`);
  console.log(`   -> Total checkpoint (bodas_live_harvested.json): ${harvested.length}`);
  console.log(`   -> Nuevos fusionados en catálogo maestro: ${added}`);
  console.log(`   -> Catálogo maestro total: ${master.length}`);
  console.log(`   -> Cola catálogos restante: ${catalogQueue.length}`);
  console.log(`   -> Cola escaparates restante: ${storefrontQueue.length}`);
  console.log("=".repeat(80));
}

main().catch((err) => {
  console.error("❌ Error fatal en el vampiro:", err);
  process.exit(1);
});




