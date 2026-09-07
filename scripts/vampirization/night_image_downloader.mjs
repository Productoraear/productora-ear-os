import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const VAULT_DIR = 'H:\\00_PRODUCTORA_EAR\\EAR_ABSORBED_VAULT\\vendors_images';
const ENRICHED_FILE = path.join(process.cwd(), 'src', 'data', 'vendors-enriched-night.json');
const MANIFEST_FILE = path.join(process.cwd(), 'scripts', '.archived_images_manifest.json');

const IMAGE_ASSISTANT_RULES = {
  webnode: {
    regex: /^(https?:\/\/[a-zA-Z0-9]+\.clvaw-cdnwnd\.com\/[a-zA-Z0-9]+\/[a-zA-Z0-9\-]+)\/\d{2,4}\/(.*?\.(?:jpe?g|png|webp))(\?.*)?/,
    replace: '$1/$2$3'
  },
  bodas_net: {
    regex: /^(https?:\/\/cdn\d+\.bodas\.net\/vendor\/\d+\/)[^\/]+\/\d+\/([a-z]+\/.*?\.(?:jpe?g|png|webp))(\?.*)?/,
    replace: '$1original/$2$3'
  }
};

function getHighestResUrl(url) {
  if (!url) return null;
  let newUrl = url;
  if (url.includes('.clvaw-cdnwnd.com')) {
    newUrl = url.replace(IMAGE_ASSISTANT_RULES.webnode.regex, IMAGE_ASSISTANT_RULES.webnode.replace);
  } else if (url.includes('bodas.net')) {
    newUrl = url.replace(IMAGE_ASSISTANT_RULES.bodas_net.regex, IMAGE_ASSISTANT_RULES.bodas_net.replace);
  }
  return newUrl;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function downloadImage(url, dest, fallbackUrl = null, retries = 2) {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(15000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    });
    
    if (!res.ok) {
      if (res.status === 404 && fallbackUrl) {
        console.log(`[DL] 404 en alta resolución, usando fallback: ${fallbackUrl}`);
        return downloadImage(fallbackUrl, dest, null, 1);
      }
      throw new Error(`HTTP ${res.status}`);
    }
    const buffer = await res.arrayBuffer();
    const data = Buffer.from(buffer);
    fs.writeFileSync(dest, data);
    
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return { size: data.length, hash };
  } catch (err) {
    if (retries > 0) {
      await sleep(1000);
      return downloadImage(url, dest, fallbackUrl, retries - 1);
    }
    throw err;
  }
}

async function main() {
  console.log('[START] Iniciando descarga masiva de imágenes (Night Vampire)...');
  
  if (!fs.existsSync(VAULT_DIR)) {
    fs.mkdirSync(VAULT_DIR, { recursive: true });
  }

  const vendors = JSON.parse(fs.readFileSync(ENRICHED_FILE, 'utf-8'));
  
  let manifest = {};
  if (fs.existsSync(MANIFEST_FILE)) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf-8'));
    } catch {}
  }

  let totalDownloaded = 0;
  let totalBytes = 0;
  let totalFailed = 0;

  for (const vendor of vendors) {
    let imagesToDownload = [];
    if (vendor.images && Array.isArray(vendor.images)) {
      imagesToDownload.push(...vendor.images);
    } else if (vendor.media?.coverImage) {
      imagesToDownload.push(vendor.media.coverImage);
    }
    
    if (imagesToDownload.length === 0) continue;
    
    // Max 3 images per provider
    imagesToDownload = imagesToDownload.slice(0, 3);
    
    const slug = vendor.slug || vendor.id || String(Date.now());
    const vendorDir = path.join(VAULT_DIR, slug);
    if (!fs.existsSync(vendorDir)) fs.mkdirSync(vendorDir, { recursive: true });

    let imgIndex = 0;
    for (const rawUrl of imagesToDownload) {
      const url = getHighestResUrl(rawUrl);
      if (!url) continue;
      
      const ext = path.extname(url.split('?')[0]) || '.jpg';
      const filename = `${slug}_${imgIndex.toString().padStart(2, '0')}${ext}`;
      const dest = path.join(vendorDir, filename);

      if (manifest[filename] && fs.existsSync(dest)) {
        // Skip already downloaded
        imgIndex++;
        continue;
      }

      console.log(`[DL] Descargando ${filename}...`);
      try {
        const { size, hash } = await downloadImage(url, dest, url !== rawUrl ? rawUrl : null);
        manifest[filename] = { url, hash, size, timestamp: new Date().toISOString() };
        totalDownloaded++;
        totalBytes += size;
        fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
      } catch (err) {
        console.error(`[ERR] Fallo al descargar ${url}: ${err.message}`);
        totalFailed++;
      }
      
      imgIndex++;
      await sleep(300); // Throttle 300ms
    }
  }

  console.log(`[DONE] Extracción finalizada.`);
  console.log(`- Imágenes descargadas: ${totalDownloaded}`);
  console.log(`- Bytes totales: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`- Errores: ${totalFailed}`);
}

main().catch(console.error);
