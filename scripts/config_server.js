/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🎧 EAR OS — CONFIG GUI MICRO-SERVER v4.11
 * ═══════════════════════════════════════════════════════════════════════════════
 * Servidor HTTP local ultraligero (Zero-Dependencies) para el Editor Visual de DJ.
 * Puerto: 3008
 * Endpoint GUI: http://127.0.0.1:3008
 * API:
 *   - GET  /api/config -> Lee ~/.ear-os/ear-dj-config.json
 *   - POST /api/config -> Guarda ~/.ear-os/ear-dj-config.json
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');
const os   = require('os');

const PORT = 3008;
const CONFIG_PATH = path.join(os.homedir(), '.ear-os', 'ear-dj-config.json');
const HTML_FILE   = path.join(__dirname, '..', 'docs', 'config-editor.html');

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 1. SERVE HTML GUI
  if (req.url === '/' || req.url === '/index.html') {
    if (fs.existsSync(HTML_FILE)) {
      const html = fs.readFileSync(HTML_FILE, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Error: docs/config-editor.html no encontrado.');
    }
    return;
  }

  // 2. GET /api/config
  if (req.url === '/api/config' && req.method === 'GET') {
    if (fs.existsSync(CONFIG_PATH)) {
      try {
        let raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
        raw = raw.replace(/^\uFEFF/, '');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(raw);
        return;
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error leyendo archivo de configuracion', details: err.message }));
        return;
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'ear-dj-config.json no existe aun' }));
      return;
    }
  }

  // 3. POST /api/config
  if (req.url === '/api/config' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(parsed, null, 2), 'utf-8');
        console.log(`[EAR OS GUI] Configuración guardada en: ${CONFIG_PATH}`);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ status: 'OK', message: 'Configuracion guardada exitosamente', path: CONFIG_PATH }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'JSON invalido', details: err.message }));
      }
    });
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`═══════════════════════════════════════════════════════════════`);
  console.log(`  🎧 EAR OS — DJ CONFIG GUI SERVER ACTIVO`);
  console.log(`  URL: http://127.0.0.1:${PORT}`);
  console.log(`  Destino: ${CONFIG_PATH}`);
  console.log(`═══════════════════════════════════════════════════════════════`);
});
