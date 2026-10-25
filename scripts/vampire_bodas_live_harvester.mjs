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
import readline from "node:readline";
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
const TELEMETRY_LOG = path.join(RESULTS_DIR, "bodas_drain_telemetry.log");

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
  // Reparación iterativa de doble/triple codificación UTF-8 (mojibake en cascada)
  for (let pass = 0; pass < 3; pass++) {
    let next = s;
    for (const [k, v] of Object.entries(repl)) {
      if (k && next.includes(k)) next = next.split(k).join(v);
    }
    if (next === s) break;
    s = next;
  }
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

// ─────────────────────────────────────────────────────────────────────────────
// MAESTRO EN STREAMING (235 MB sin OOM)
// El catálogo maestro es un array JSON pretty-printed con un proveedor por
// objeto y un único "name"/"slug"/"province" a 4 espacios de sangría.
// Se indexa línea a línea y se anexa copiando bytes: nunca JSON.parse completo.
// ─────────────────────────────────────────────────────────────────────────────
const MASTER_FIELD_RE = /^    "(name|slug|province|sourceUrl|url)": "((?:[^"\\]|\\.)*)",?$/;

const unescapeJson = (s) => s.replace(/\\"/g, '"').replace(/\\\\/g, "\\");

function telemetry(entry) {
  try {
    fs.appendFileSync(TELEMETRY_LOG, `${JSON.stringify({ ts: new Date().toISOString(), ...entry })}\n`, "utf8");
  } catch {
    /* telemetría best-effort: jamás rompe la cosecha */
  }
}

async function buildMasterIndex(file) {
  const index = { keys: new Set(), slugs: new Set(), urls: new Set(), count: 0, streamed: false };
  if (!fs.existsSync(file)) return index;
  const size = fs.statSync(file).size;
  if (size === 0) return index;

  const rl = readline.createInterface({
    input: fs.createReadStream(file, { encoding: "utf8", highWaterMark: 1 << 20 }),
    crlfDelay: Infinity,
  });

  let name = null;
  let province = null;
  let slug = null;
  for await (const line of rl) {
    if (line.startsWith("  }")) {
      if (name) {
        index.keys.add(tokenKey(name, province || ""));
        index.count++;
        index.slugs.add(slug || slugify(name));
      }
      name = null;
      province = null;
      slug = null;
      continue;
    }
    const m = MASTER_FIELD_RE.exec(line);
    if (!m) continue;
    const field = m[1];
    const value = unescapeJson(m[2]);
    if (field === "name" && name === null) name = value;
    else if (field === "province" && province === null) province = value;
    else if (field === "slug" && slug === null) slug = value.toLowerCase();
    else if ((field === "sourceUrl" || field === "url") && value) index.urls.add(value);
  }

  if (index.count === 0) {
    // Salvavidas: si el formato cambió, se degrada a la carga clásica.
    const arr = readJSON(file, []);
    for (const p of Array.isArray(arr) ? arr : []) {
      const k = tokenKey(p.name, p.province);
      if (k) index.keys.add(k);
      if (p.slug) index.slugs.add(String(p.slug).toLowerCase());
      if (p.sourceUrl || p.url) index.urls.add(p.sourceUrl || p.url);
      index.count++;
    }
    index.streamed = false;
    return index;
  }

  index.streamed = true;
  return index;
}

function indentProviderEntry(obj) {
  return JSON.stringify(obj, null, 2)
    .split("\n")
    .map((l) => `  ${l}`)
    .join("\n");
}

async function appendProvidersToMaster(file, providers) {
  if (!providers.length) return 0;
  if (!fs.existsSync(file) || fs.statSync(file).size === 0) {
    fs.writeFileSync(file, "[\n]\n", "utf8");
  }
  const size = fs.statSync(file).size;
  const tailLen = Math.min(size, 64 * 1024);
  const fd = fs.openSync(file, "r");
  const buf = Buffer.allocUnsafe(tailLen);
  fs.readSync(fd, buf, 0, tailLen, size - tailLen);
  fs.closeSync(fd);

  // Aritmética 100% en BYTES: el catálogo contiene UTF-8 multibyte (acentos, ñ, €)
  const closeByte = buf.lastIndexOf(0x5d); // ']'
  if (closeByte === -1) throw new Error("catálogo maestro sin cierre ']'");

  let end = closeByte;
  while (end > 0) {
    const b = buf[end - 1];
    if (b === 0x20 || b === 0x0a || b === 0x0d || b === 0x09) end--;
    else break;
  }
  const lastSignificant = end > 0 ? buf[end - 1] : 0;
  // Invariante: el corte debe caer justo tras '}' (hay proveedores) o '['
  if (lastSignificant !== 0x7d && lastSignificant !== 0x5b) {
    throw new Error(`punto de corte inseguro en el maestro (byte 0x${lastSignificant.toString(16)})`);
  }
  const emptyArray = lastSignificant === 0x5b;
  const prefixEnd = size - tailLen + end; // bytes [0..prefixEnd) ya escritos

  const body = providers.map(indentProviderEntry).join(",\n");
  const suffix = `${emptyArray ? "\n" : ",\n"}${body}\n]\n`;
  const tmp = `${file}.append.tmp`;

  await new Promise((resolve, reject) => {
    const rs = fs.createReadStream(file, { start: 0, end: prefixEnd - 1 });
    const ws = fs.createWriteStream(tmp, { encoding: "utf8" });
    rs.on("error", reject);
    ws.on("error", reject);
    ws.on("finish", resolve);
    rs.on("end", () => ws.end(suffix));
    rs.pipe(ws, { end: false });
  });

  const expected = prefixEnd + Buffer.byteLength(suffix, "utf8");
  const written = fs.statSync(tmp).size;
  if (written !== expected) {
    fs.rmSync(tmp, { force: true });
    throw new Error(`escritura incompleta (${written}/${expected} bytes): maestro intacto`);
  }

  fs.renameSync(tmp, file);
  return providers.length;
}

async function flushHarvestedToMaster(index, pending, file = HARVESTED_FILE) {
  const batch = [];
  const local = new Set();
  for (const p of pending) {
    const key = tokenKey(p.name, p.province);
    if (!key || index.keys.has(key) || local.has(key)) continue;
    local.add(key);
    batch.push(p);
  }
  if (!batch.length) return 0;

  await appendProvidersToMaster(file, batch);

  for (const p of batch) {
    index.keys.add(tokenKey(p.name, p.province));
    index.slugs.add(String(p.slug || slugify(p.name)).toLowerCase());
    if (p.sourceUrl) index.urls.add(p.sourceUrl);
  }
  index.count += batch.length;
  return batch.length;
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
      // Decodificación correcta: se intenta UTF-8 estricto y, si los bytes no son
      // UTF-8 válidos, se cae al charset declarado (evita mojibake en descripciones).
      const buf = Buffer.from(await res.arrayBuffer());
      try {
        return new TextDecoder("utf-8", { fatal: true }).decode(buf);
      } catch {
        const declared = /charset=([^;]+)/i.exec(res.headers.get("content-type") || "");
        const charset = (declared ? declared[1].trim().toLowerCase() : "windows-1252").replace(/^["']|["']$/g, "");
        try {
          return new TextDecoder(charset, { fatal: false }).decode(buf);
        } catch {
          return new TextDecoder("windows-1252", { fatal: false }).decode(buf);
        }
      }
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
      // Cadencia sigilosa con jitter humano (media ~125 ms; la espera real la marca fetchStealth)
      await sleep(70 + Math.floor(Math.random() * 110));
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
  const maxHours = Number(argVal("--max-hours", "0"));
  const masterFile = argVal("--master", HARVESTED_FILE);
  const discoverOnly = flag("--discover-only");
  const harvestOnly = flag("--harvest-only");
  const drain = flag("--drain") || flag("--all");
  const startedAt = Date.now();

  console.log("=".repeat(80));
  console.log("🦇 [EAR OS] VAMPIRO / CAZADOR BODAS.NET (NODE S-CLASS)");
  console.log(`   limit=${limit} workers=${workers} maxCatalogs=${maxCatalogs} offset=${catalogOffset} drain=${drain} discoverOnly=${discoverOnly} harvestOnly=${harvestOnly}`);
  console.log("=".repeat(80));

  // Índice del maestro en streaming: 235 MB sin cargarlos en heap (RAM libre crítica)
  const masterIndex = await buildMasterIndex(masterFile);
  const knownKeys = new Set(masterIndex.keys);
  const knownUrls = new Set(masterIndex.urls);
  const knownSlugs = masterIndex.slugs;
  console.log(
    `[*] Índice maestro: ${masterIndex.count} proveedores (${masterIndex.streamed ? "streaming" : "JSON.parse"}) | ${masterIndex.slugs.size} slugs | ${knownUrls.size} urls fuente`,
  );

  let harvested = readJSON(CHECKPOINT_BODAS, []);
  if (!Array.isArray(harvested)) harvested = [];
  const harvestedUrls = new Set(harvested.map((p) => p.sourceUrl || p.url).filter(Boolean));
  for (const p of harvested) knownKeys.add(tokenKey(p.name, p.province));

  let catalogQueue = readJSON(PENDING_CATALOGS, []);
  if (!Array.isArray(catalogQueue)) catalogQueue = [];
  let storefrontQueue = readJSON(PENDING_STOREFRONTS, []);
  if (!Array.isArray(storefrontQueue)) storefrontQueue = [];

  // Dedupe O(1) de la cola de escaparates (includes() sería cuadrático con 100k+ URLs)
  const queuedStorefronts = new Set(storefrontQueue);

  // Perfiles cosechados aún no escritos en el maestro (fusión incremental en streaming)
  const pendingMerge = [];
  const pendingMergeKeys = new Set();
  for (const p of harvested) {
    const key = tokenKey(p.name, p.province);
    if (!key || masterIndex.keys.has(key) || pendingMergeKeys.has(key)) continue;
    pendingMergeKeys.add(key);
    pendingMerge.push(p);
  }

  const persistState = () => {
    try {
      writeJSONAtomic(PENDING_CATALOGS, catalogQueue);
      writeJSONAtomic(PENDING_STOREFRONTS, storefrontQueue);
      writeJSONAtomic(CHECKPOINT_BODAS, harvested);
    } catch {
      /* fail-closed: jamás corrompe el estado previo ya persistido */
    }
  };

  if (flag("--status")) {
    console.log(`   -> Catálogos pendientes: ${catalogQueue.length}`);
    console.log(`   -> Escaparates pendientes: ${storefrontQueue.length}`);
    console.log(`   -> Checkpoint cosechado: ${harvested.length}`);
    console.log(`   -> Pendientes de fusionar en maestro: ${pendingMerge.length}`);
    return;
  }

  process.once("SIGINT", () => {
    console.log("\n[!] SIGINT recibido: persistiendo colas y saliendo...");
    persistState();
    process.exit(130);
  });
  process.once("SIGTERM", () => {
    persistState();
    process.exit(143);
  });

  if (!harvestOnly && catalogQueue.length === 0) {
    console.log("\n[*] FASE 0: descubriendo sub-sitemaps de catálogo...");
    const idxXml = await fetchStealth("https://www.bodas.net/sitemaps/desktop/vendor-catalog-index.xml");
    if (idxXml) {
      const subMaps = extractLocs(idxXml).filter((l) => l.includes("vendor-catalog"));
      console.log(`   -> ${subMaps.length} sub-sitemaps localizados.`);
      const catalogSeen = new Set(catalogQueue);
      for (const sm of subMaps.slice(0, 41)) {
        const smXml = await fetchStealth(sm);
        if (!smXml) continue;
        for (const c of extractLocs(smXml).filter((l) => !l.includes("sitemap") && l.includes("bodas.net"))) {
          if (catalogSeen.has(c)) continue;
          catalogSeen.add(c);
          catalogQueue.push(c);
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
  const catalogAttempts = new Map();

  do {
    iteration++;
    const off = firstPass ? catalogOffset : 0;

    if (!harvestOnly && catalogQueue.length > 0) {
      if (maxHours > 0 && (Date.now() - startedAt) / 3600000 >= maxHours) {
        console.log(`\n⏸ Presupuesto de ${maxHours} h agotado: colas persistidas para reanudar.`);
        persistState();
        break;
      }
      console.log(`\n[*] FASE A (iter ${iteration}): descubriendo escaparates (--e\\d+) desde catálogos...`);
      const batch = catalogQueue.slice(off, off + maxCatalogs);
      let discovered = 0;
      const failedCatalogs = [];
      await runPool(batch, workers, async (cu) => {
        const html = await fetchStealth(cu);
        if (!html) {
          failedCatalogs.push(cu);
          return;
        }
        for (const su of extractStorefrontUrls(html)) {
          if (knownUrls.has(su) || harvestedUrls.has(su) || queuedStorefronts.has(su)) continue;
          queuedStorefronts.add(su);
          storefrontQueue.push(su);
          discovered++;
        }
      });
      catalogQueue = catalogQueue.filter((_, i) => i < off || i >= off + maxCatalogs);

      // Reintento único de catálogos con fallo transitorio (red / 5xx / timeout)
      let retried = 0;
      for (const cu of failedCatalogs) {
        const attempts = (catalogAttempts.get(cu) || 0) + 1;
        if (attempts > 1) {
          catalogAttempts.delete(cu);
          continue;
        }
        catalogAttempts.set(cu, attempts);
        catalogQueue.push(cu);
        retried++;
      }

      writeJSONAtomic(PENDING_CATALOGS, catalogQueue);
      writeJSONAtomic(PENDING_STOREFRONTS, storefrontQueue);
      console.log(
        `   -> ${discovered} nuevos escaparates encolados. Cola: ${storefrontQueue.length} | catálogos restantes: ${catalogQueue.length} | fallos=${failedCatalogs.length} reintentados=${retried}`,
      );
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
        pendingMerge.push(profile);
        harvestedNow++;
        totalHarvestedNow++;
      });
      storefrontQueue = storefrontQueue.slice(target.length);
      for (const su of target) queuedStorefronts.delete(su);

      // Fusión incremental en el maestro (streaming: no duplica 235 MB en RAM)
      let fused = 0;
      if (pendingMerge.length > 0) {
        try {
          fused = await flushHarvestedToMaster(masterIndex, pendingMerge, masterFile);
          pendingMerge.length = 0;
        } catch (err) {
          console.log(`   [!] Fusión diferida a la próxima iteración: ${String(err && err.message)}`);
        }
      }

      writeJSONAtomic(PENDING_STOREFRONTS, storefrontQueue);
      writeJSONAtomic(CHECKPOINT_BODAS, harvested);

      const elapsedMin = Math.max(1, (Date.now() - startedAt) / 60000);
      const ratePerMin = +(totalHarvestedNow / elapsedMin).toFixed(2);
      const finished = catalogQueue.length === 0 && storefrontQueue.length === 0;
      writeJSONAtomic(CHECKPOINT_PROGRESS, {
        timestamp: new Date().toISOString(),
        iteration,
        harvestedNow,
        fusedIntoMaster: fused,
        masterTotal: masterIndex.count,
        bodas_live_harvested: harvested.length,
        pending_catalogs: catalogQueue.length,
        pending_storefronts: storefrontQueue.length,
        pending_merge: pendingMerge.length,
        harvested_per_min: ratePerMin,
        elapsed_min: +elapsedMin.toFixed(1),
        status: finished ? "COMPLETED" : "RUNNING",
      });
      telemetry({
        event: "iteration",
        iteration,
        fetched,
        nullFetches,
        extracted,
        deduped,
        harvestedNow,
        fused,
        masterTotal: masterIndex.count,
        pending_catalogs: catalogQueue.length,
        pending_storefronts: storefrontQueue.length,
        pending_merge: pendingMerge.length,
        harvested_per_min: ratePerMin,
        elapsed_min: +elapsedMin.toFixed(1),
        status: finished ? "COMPLETED" : "RUNNING",
      });
      console.log(
        `   [iter ${iteration}] fetched=${fetched} null=${nullFetches} extraidos=${extracted} dedupe=${deduped} nuevos=${harvestedNow} fusionados=${fused} | cola=${storefrontQueue.length} | catálogos=${catalogQueue.length} | maestro=${masterIndex.count} | ${ratePerMin}/min`,
      );
    }

    firstPass = false;
  } while (
    drain &&
    (catalogQueue.length > 0 || storefrontQueue.length > 0) &&
    !(maxHours > 0 && (Date.now() - startedAt) / 3600000 >= maxHours)
  );

  console.log("\n[*] Fusión final con src/data/bodas-vendors-harvested.json (streaming)...");
  let added = 0;
  if (pendingMerge.length > 0) {
    try {
      added = await flushHarvestedToMaster(masterIndex, pendingMerge, masterFile);
      pendingMerge.length = 0;
    } catch (err) {
      console.error(`   [!] No se pudo fusionar el remanente: ${String(err && err.message)}`);
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log("🏁 COSECHA BODAS.NET COMPLETADA");
  console.log(`   -> Nuevos cosechados esta sesión: ${totalHarvestedNow}`);
  console.log(`   -> Total checkpoint (bodas_live_harvested.json): ${harvested.length}`);
  console.log(`   -> Nuevos fusionados en catálogo maestro: ${added}`);
  console.log(`   -> Catálogo maestro total: ${masterIndex.count}`);
  console.log(`   -> Cola catálogos restante: ${catalogQueue.length}`);
  console.log(`   -> Cola escaparates restante: ${storefrontQueue.length}`);
  console.log(`   -> Estado: ${catalogQueue.length === 0 && storefrontQueue.length === 0 ? "COMPLETED" : "PAUSED"}`);
  console.log("=".repeat(80));
}

main().catch((err) => {
  console.error("❌ Error fatal en el vampiro:", err);
  process.exit(1);
});




