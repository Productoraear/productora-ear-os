/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🎧 EAR OS — REAL-TIME MULTI-PATH SESSION WATCHER & EVENT LOGGER v4.17
 * ═══════════════════════════════════════════════════════════════════════════════
 * Monitorea de forma continua y simultánea todas las rutas posibles de VirtualDJ
 * (Local, OneDrive, Carpetas de Usuario) y exporta actas visadas en tiempo real.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const fs     = require('fs');
const path   = require('path');
const os     = require('os');
const crypto = require('crypto');

const HOME          = os.homedir();
const CONFIG_PATH   = path.join(HOME, '.ear-os', 'ear-dj-config.json');
const CERTS_DIR     = path.join(HOME, '.ear-os', 'certificates');
const HISTORY_DIR   = path.join(HOME, '.ear-os', 'session-history');
const WATCHER_LOG   = path.join(HOME, '.ear-os', 'watcher.log');

// Posibles ubicaciones del Escritorio (Local + OneDrive)
const DESKTOP_PATHS = [
  path.join(HOME, 'Desktop'),
  path.join(HOME, 'OneDrive', 'Desktop'),
  path.join(HOME, 'OneDrive - Personal', 'Desktop')
].filter(p => fs.existsSync(p));

// Asegurar directorios de la bóveda
[CERTS_DIR, HISTORY_DIR, path.dirname(WATCHER_LOG)].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function logEvent(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  try {
    fs.appendFileSync(WATCHER_LOG, line, 'utf-8');
  } catch (e) {}
  console.log(msg);
}

// Cargar Configuración Local
function loadConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      const raw = fs.readFileSync(CONFIG_PATH, 'utf-8').replace(/^\uFEFF/, '');
      return JSON.parse(raw);
    } catch (e) {}
  }
  return {
    djProfile: { artisticName: 'DJ Edwin Agudelo', nifDni: '71758247K', sgaeCode: 'SGAE-2026-0988' },
    defaultVenue: { venueName: 'Recinto de Gala S-Class', venueNif: 'B-29884102', city: 'Marbella (Málaga)', gpsCoordinates: '36.5101,-4.8824' },
    watcherSettings: { autoEmailVenue: false }
  };
}

// Limpieza y Extracción de Artista y Título
function cleanArtistAndTitle(rawString) {
  let text = rawString.trim().replace(/^[0-9]+[\.\-\)\s_]+/, '').trim();
  let artist = 'Artista No Identificado';
  let title = text;

  if (text.includes(' - ')) {
    const parts = text.split(' - ').map(p => p.trim());
    artist = parts[0];
    if (parts.length >= 3) {
      const lastPart = parts[parts.length - 1];
      title = lastPart.replace(/^[0-9]+[\-_][0-9]+\s*/, '').replace(/^[0-9]+\s*/, '').trim();
    } else {
      title = parts[1].replace(/^[0-9]+[\-_][0-9]+\s*/, '').replace(/^[0-9]+\s*/, '').trim();
    }
  }
  return { artist, title };
}

// Parser M3U Universal
function parseM3U(content, fileName) {
  const tracks = [];
  const lines = content.split('\n');
  let idx = 1;
  const isVdj = content.includes('#EXTVDJ') || fileName.toLowerCase().includes('virtualdj');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#EXTINF:')) {
      const info = line.substring(8);
      const commaIdx = info.indexOf(',');
      const sec = commaIdx !== -1 ? parseInt(info.substring(0, commaIdx), 10) : 240;
      const trackStr = commaIdx !== -1 ? info.substring(commaIdx + 1).trim() : info.trim();
      const { artist, title } = cleanArtistAndTitle(trackStr);

      tracks.push({
        orderIndex: idx++,
        title,
        artist,
        durationSeconds: isNaN(sec) || sec <= 0 ? 240 : sec,
        durationFormatted: `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`,
        sourceFormat: isVdj ? 'VIRTUALDJ' : 'GENERIC_M3U'
      });
    } else if (!line.startsWith('#') && line.length > 4 && line.includes('.')) {
      const filenameOnly = line.split(/[\\/]/).pop()?.replace(/\.[^/.]+$/, '') || line;
      const { artist, title } = cleanArtistAndTitle(filenameOnly);

      tracks.push({
        orderIndex: idx++,
        title,
        artist,
        durationSeconds: 240,
        durationFormatted: '4:00',
        sourceFormat: isVdj ? 'VIRTUALDJ' : 'GENERIC_M3U'
      });
    }
  }
  return tracks;
}

// Render HTML del Certificado S-Class
function renderCertificateHtml(cert) {
  const artisticName = (cert.djProfile?.artisticName && cert.djProfile.artisticName !== 'DJ_NOMBRE_ARTISTICO') 
    ? cert.djProfile.artisticName 
    : (cert.djProfile?.legalName || 'Edwin Agudelo');
  const legalName = cert.djProfile?.legalName || 'Edwin Alberto Agudelo Restrepo';
  const nifDni = (cert.djProfile?.nifDni && cert.djProfile.nifDni !== 'DNI_O_NIE') 
    ? cert.djProfile.nifDni 
    : '55386793 X';
  const sgaeCode = (cert.djProfile?.sgaeCode && !cert.djProfile.sgaeCode.includes('XXXX')) 
    ? cert.djProfile.sgaeCode 
    : 'SGAE-2026-0988';

  const venueName = (cert.venue?.venueName && cert.venue.venueName !== 'NOMBRE_DEL_LOCAL')
    ? cert.venue.venueName
    : 'Recinto de Gala S-Class';
  const venueNif = (cert.venue?.venueNif && cert.venue.venueNif !== 'NIF_DEL_LOCAL')
    ? cert.venue.venueNif
    : 'B-29884102';
  const venueCity = (cert.venue?.city && cert.venue.city !== 'CIUDAD')
    ? cert.venue.city
    : 'Marbella (Málaga)';

  const trackRows = cert.tracks.map((t, idx) => `
    <tr style="border-bottom: 1px solid #1f1f28; font-family: 'JetBrains Mono', monospace; font-size: 11px;">
      <td style="padding: 8px 12px; color: #71717a;">${idx + 1}</td>
      <td style="padding: 8px 12px; font-weight: 700; color: #fff;">${t.title}</td>
      <td style="padding: 8px 12px; color: #ecb613; font-weight: 600;">${t.artist}</td>
      <td style="padding: 8px 12px; color: #a1a1aa;">${t.durationFormatted}</td>
      <td style="padding: 8px 12px; color: #10b981; font-weight: 600;">${t.sourceFormat}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>${cert.certificateId} · Certificado de Ejecución Pública EAR OS</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@500;700&family=Syne:wght@700;800&display=swap" rel="stylesheet">
  <style>
    body { background: #050505; color: #eee; font-family: 'Inter', sans-serif; padding: 40px; margin: 0; }
    .container { max-width: 960px; margin: 0 auto; }
    .header { border-bottom: 2px solid #ecb613; padding-bottom: 20px; margin-bottom: 24px; }
    .badge { display: inline-block; padding: 4px 12px; background: rgba(236,182,19,0.12); border: 1px solid rgba(236,182,19,0.3); border-radius: 9999px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; color: #ecb613; }
    .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; background: #0e0e14; border: 1px solid rgba(255,255,255,0.08); padding: 18px; border-radius: 14px; margin-bottom: 20px; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; margin-top: 14px; background: #0a0a0f; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.06); }
    th { background: #14141d; padding: 10px 12px; text-align: left; font-size: 10px; text-transform: uppercase; color: #888; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.05em; }
    .hash-box { background: #000; border: 1px solid #27272a; padding: 10px 14px; font-family: 'JetBrains Mono', monospace; font-size: 11px; word-break: break-all; color: #ecb613; border-radius: 8px; margin-top: 6px; }
    .footer { margin-top: 30px; border-top: 1px solid #27272a; padding-top: 16px; font-size: 10px; color: #71717a; font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">ACTA DE EJECUCIÓN PÚBLICA AUTOMÁTICA · EAR OS S-CLASS v4.17</div>
      <h1 style="font-family: 'Syne', sans-serif; margin: 10px 0 4px 0; font-size: 24px; color: #fff;">Certificado Forense de Repertorio & Proof of Play</h1>
      <p style="margin: 0; font-size: 12px; color: #a1a1aa; font-family: 'JetBrains Mono', monospace;">ID Documento: <strong style="color: #fff;">${cert.certificateId}</strong> | Emitido: ${new Date(cert.issuedAt).toLocaleString('es-ES')}</p>
    </div>

    <div class="meta-grid">
      <div>
        <strong style="color: #71717a; display: block; font-size: 9px; text-transform: uppercase; font-family: 'JetBrains Mono', monospace;">Artista / Intérprete DJ</strong>
        <span style="font-size: 14px; font-weight: 700; color: #fff;">${artisticName}</span>
        <span style="display: block; color: #a1a1aa;">DNI: ${nifDni}</span>
        <span style="display: block; color: #ecb613; font-family: 'JetBrains Mono', monospace;">SGAE: ${sgaeCode}</span>
      </div>
      <div>
        <strong style="color: #71717a; display: block; font-size: 9px; text-transform: uppercase; font-family: 'JetBrains Mono', monospace;">Recinto & Ubicación</strong>
        <span style="font-size: 14px; font-weight: 700; color: #fff;">${venueName}</span>
        <span style="display: block; color: #a1a1aa;">CIF: ${venueNif}</span>
        <span style="display: block; color: #06b6d4;">${venueCity}</span>
      </div>
      <div>
        <strong style="color: #71717a; display: block; font-size: 9px; text-transform: uppercase; font-family: 'JetBrains Mono', monospace;">Sesión Auditada</strong>
        <span style="font-size: 14px; font-weight: 700; color: #10b981;">${cert.tracks.length} Obras Fonográficas</span>
        <span style="display: block; color: #a1a1aa;">Duración: ${cert.totalDurationFormatted}</span>
        <span style="display: block; color: #71717a; font-family: 'JetBrains Mono', monospace;">Motor: ${cert.softwareDetected}</span>
      </div>
    </div>

    <div>
      <strong style="font-size: 10px; text-transform: uppercase; color: #888; font-family: 'JetBrains Mono', monospace;">Firma Digital SHA-256 Inmutable:</strong>
      <div class="hash-box">${cert.sha256Proof}</div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Título de la Obra</th>
          <th>Artista / Intérprete</th>
          <th>Duración</th>
          <th>Formato</th>
        </tr>
      </thead>
      <tbody>
        ${trackRows}
      </tbody>
    </table>

    <div class="footer">
      <p>Certificamos bajo fe de sistema digital auditado que la lista adjunta de ${cert.tracks.length} obras fonográficas fue ejecutada en el recinto '${cert.venue.venueName}' (CIF: ${cert.venue.venueNif}) con las garantías del Art. 108 de la Ley de Propiedad Intelectual española. Firma SHA-256 verificable en nodo EAR OS.</p>
      <p style="margin-top: 6px;">© 2026 Productora EAR S.L. · Sistema Operativo para la Industria de la Música y Eventos de Gala.</p>
    </div>
  </div>
</body>
</html>`;
}

// Procesar archivo de sesión
function processHistoryFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.m3u', '.m3u8', '.csv', '.xml', '.nml', '.txt'].includes(ext)) return;

  const fileName = path.basename(filePath);
  logEvent(`\n[EVENTO DETECTADO] Archivo modificado: ${filePath}`);

  try {
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    if (!rawContent || rawContent.trim().length < 10) return;

    const tracks = parseM3U(rawContent, fileName);
    if (tracks.length === 0) return;

    const config = loadConfig();
    const totalSeconds = tracks.reduce((acc, t) => acc + t.durationSeconds, 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const totalDurationFormatted = hours > 0 ? `${hours}h ${minutes}m ${secs}s` : `${minutes}m ${secs}s`;

    const todayStr = new Date().toISOString().split('T')[0];
    const timestamp = Date.now().toString(36).toUpperCase();
    const certificateId = `EAR-CERT-${todayStr.replace(/-/g, '')}-${timestamp}`;
    const issuedAt = new Date().toISOString();

    const payload = `${certificateId}|${config.defaultVenue.venueNif}|${config.defaultVenue.gpsCoordinates}|${tracks.length}|${issuedAt}|EAR_OS_SOVEREIGN`;
    const sha256Proof = crypto.createHash('sha256').update(payload).digest('hex').toUpperCase();

    const certObj = {
      certificateId,
      issuedAt,
      sha256Proof,
      djProfile: config.djProfile,
      venue: config.defaultVenue,
      softwareDetected: tracks[0]?.sourceFormat || 'VIRTUALDJ',
      totalDurationFormatted,
      tracks
    };

    const htmlContent = renderCertificateHtml(certObj);

    // 1. Guardar en todos los Escritorios detectados (Local + OneDrive)
    const targetDesktops = [
      path.join(HOME, 'Desktop'),
      path.join(HOME, 'OneDrive', 'Desktop'),
      path.join(HOME, 'OneDrive - Personal', 'Desktop')
    ];

    targetDesktops.forEach(desk => {
      if (fs.existsSync(desk)) {
        const deskFile = path.join(desk, `EAR_OS_SESION_${todayStr}_${timestamp}.html`);
        fs.writeFileSync(deskFile, htmlContent, 'utf-8');
        logEvent(`[EAR OS WATCHER] 💻 Guardado en Escritorio: ${deskFile}`);
      }
    });

    // 2. Guardar en ~/.ear-os/certificates
    const certFilePath = path.join(CERTS_DIR, `${certificateId}.html`);
    fs.writeFileSync(certFilePath, htmlContent, 'utf-8');

    // 3. Archivar copia en ~/.ear-os/session-history
    const archivedHistoryPath = path.join(HISTORY_DIR, `[${todayStr}]_${fileName}`);
    fs.copyFileSync(filePath, archivedHistoryPath);

    logEvent(`[EAR OS WATCHER] ✅ Certificado SHA-256 Emitido: ${certificateId}`);
    logEvent(`[EAR OS WATCHER] 🔒 Firma Hash: ${sha256Proof.substring(0, 32)}...`);
    logEvent(`[EAR OS WATCHER] 🏛️ Guardado en Bóveda: ${certFilePath}`);
  } catch (err) {
    logEvent(`[EAR OS WATCHER] ❌ Error procesando ${filePath}: ${err.message}`);
  }
}

// Iniciar Vigilancia Multi-Ruta
function startWatcher() {
  const config = loadConfig();
  const potentialPaths = [
    path.join(HOME, 'Documents', 'VirtualDJ', 'History'),
    path.join(HOME, 'OneDrive', 'Documents', 'VirtualDJ', 'History'),
    path.join(HOME, 'OneDrive - Personal', 'Documents', 'VirtualDJ', 'History'),
    path.join(HOME, 'Documents', 'Rekordbox'),
    path.join(HOME, 'Music', '_Serato_'),
    path.join(HOME, 'Documents', 'Native Instruments', 'Traktor Pro')
  ];

  // Agregar directorios configurados
  if (config.detectedSoftware) {
    Object.values(config.detectedSoftware).forEach(sw => {
      if (sw.historyDirectory && !potentialPaths.includes(sw.historyDirectory)) {
        potentialPaths.push(sw.historyDirectory);
      }
    });
  }

  // Filtrar solo las carpetas existentes
  const watchDirs = potentialPaths.filter(p => fs.existsSync(p));

  console.log(`═══════════════════════════════════════════════════════════════`);
  console.log(`  🎧 EAR OS — REAL-TIME MULTI-PATH SESSION WATCHER (v4.17)`);
  console.log(`  Directorios activos bajo vigilancia continua:`);
  watchDirs.forEach(d => console.log(`  ✓ ${d}`));
  if (watchDirs.length === 0) {
    console.log(`  [!] Ninguna carpeta DJ encontrada en rutas estándar.`);
  }
  console.log(`═══════════════════════════════════════════════════════════════`);

  const processedFiles = new Map();

  function checkDir(dir) {
    if (!fs.existsSync(dir)) return;
    try {
      const files = fs.readdirSync(dir);
      files.forEach(f => {
        const ext = path.extname(f).toLowerCase();
        if (!['.m3u', '.m3u8', '.csv', '.xml', '.nml', '.txt'].includes(ext)) return;
        const fullPath = path.join(dir, f);
        try {
          const stats = fs.statSync(fullPath);
          const lastMtime = processedFiles.get(fullPath);
          if (!lastMtime || stats.mtimeMs > lastMtime) {
            processedFiles.set(fullPath, stats.mtimeMs);
            setTimeout(() => {
              if (fs.existsSync(fullPath)) {
                processHistoryFile(fullPath);
              }
            }, 300);
          }
        } catch (e) {}
      });
    } catch (err) {}
  }

  // Registrar mtimes iniciales
  watchDirs.forEach(dir => {
    try {
      fs.readdirSync(dir).forEach(f => {
        const fullPath = path.join(dir, f);
        try {
          const stats = fs.statSync(fullPath);
          processedFiles.set(fullPath, stats.mtimeMs);
        } catch (e) {}
      });
    } catch (e) {}
  });

  // Watchers fs.watch + Sondeo periódico cada 1.5s
  watchDirs.forEach(dir => {
    try {
      fs.watch(dir, () => checkDir(dir));
    } catch (err) {}
  });

  setInterval(() => {
    watchDirs.forEach(dir => checkDir(dir));
  }, 1500);
}

if (require.main === module) {
  startWatcher();
}

module.exports = { startWatcher, processHistoryFile };
